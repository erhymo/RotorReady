import { Capacitor, registerPlugin } from "@capacitor/core";

// Keeping audio alive with the screen off needs three separate things, and
// missing any one of them makes playback die the moment the phone is pocketed:
//
//  1. Media Session metadata/handlers (this file, both platforms). Chromium
//     suspends media in a backgrounded WebView unless a session is active, and
//     it is also what puts the episode on the lock screen instead of a blank
//     "unknown media" tile.
//  2. iOS: UIBackgroundModes=audio plus an AVAudioSession in the .playback
//     category (ios/App/App/Info.plist + AppDelegate.swift). The default
//     category stops on screen lock by design.
//  3. Android: a foreground service, or the OS suspends the process a few
//     seconds after the screen goes off (BackgroundAudio plugin, below).
//
// All three ship in the native binary, so this only reaches users on a new
// store build — there is no live-content path for it.

export type BackgroundAudioPlugin = {
  /** Start the foreground service that keeps the process alive while playing. */
  start(options: { title: string; artist: string }): Promise<void>;
  /** Tear the service down so the notification does not linger after playback. */
  stop(): Promise<void>;
};

const BackgroundAudio = registerPlugin<BackgroundAudioPlugin>("BackgroundAudio");

const isAndroid = () => Capacitor.getPlatform() === "android";

/** Android only, and deliberately best-effort: a failure here must never stop playback. */
export async function startBackgroundAudio(title: string, artist: string) {
  if (!isAndroid()) return;
  try {
    await BackgroundAudio.start({ title, artist });
  } catch {
    // Plugin missing (web/older build) or the user denied notifications —
    // audio still plays while the app is foregrounded, so carry on.
  }
}

export async function stopBackgroundAudio() {
  if (!isAndroid()) return;
  try {
    await BackgroundAudio.stop();
  } catch {
    // Nothing to tear down.
  }
}

type SessionHandlers = {
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onSkip: (delta: number) => void;
};

const SKIP_SECONDS = 15;

/**
 * Publish the episode to the OS media session. Returns a cleanup function.
 * No-ops where the API is unavailable rather than throwing.
 */
export function setMediaSession(
  meta: { title: string; artist: string },
  handlers: SessionHandlers,
): () => void {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return () => {};
  const session = navigator.mediaSession;

  try {
    session.metadata = new MediaMetadata({
      title: meta.title,
      artist: meta.artist,
      album: "RotorReady",
      // Sized per the Media Session spec's recommended set so Android's
      // notification and iOS's now-playing view both have something to scale
      // from. The icon already ships in the bundle, so this costs no network.
      artwork: [
        { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
    });
  } catch {
    // MediaMetadata unsupported; handlers below are still worth installing.
  }

  // seekbackward/seekforward are what the lock screen and a car head unit send;
  // previoustrack/nexttrack are mapped to the same skip because this player has
  // no playlist, and leaving them unhandled makes the buttons look broken.
  const actions: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
    ["play", () => handlers.onPlay()],
    ["pause", () => handlers.onPause()],
    ["seekbackward", (d) => handlers.onSkip(-(d.seekOffset ?? SKIP_SECONDS))],
    ["seekforward", (d) => handlers.onSkip(d.seekOffset ?? SKIP_SECONDS)],
    ["previoustrack", () => handlers.onSkip(-SKIP_SECONDS)],
    ["nexttrack", () => handlers.onSkip(SKIP_SECONDS)],
    [
      "seekto",
      (d) => {
        if (typeof d.seekTime === "number") handlers.onSeek(d.seekTime);
      },
    ],
  ];

  for (const [action, handler] of actions) {
    try {
      session.setActionHandler(action, handler);
    } catch {
      // Individual actions are optional across platforms.
    }
  }

  return () => {
    for (const [action] of actions) {
      try {
        session.setActionHandler(action, null);
      } catch {
        // ignore
      }
    }
    try {
      session.metadata = null;
    } catch {
      // ignore
    }
  };
}

/** Drives the scrubber shown on the lock screen. Ignores non-finite values. */
export function setMediaPositionState(position: number, duration: number, rate: number) {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  if (!Number.isFinite(duration) || duration <= 0) return;
  if (!Number.isFinite(position) || position < 0) return;
  try {
    navigator.mediaSession.setPositionState({
      duration,
      // Clamped because a position past duration throws, and timeupdate can
      // briefly report one at the very end of a file.
      position: Math.min(position, duration),
      playbackRate: rate > 0 ? rate : 1,
    });
  } catch {
    // setPositionState is not universally implemented.
  }
}

export function setMediaPlaybackState(playing: boolean) {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  } catch {
    // ignore
  }
}
