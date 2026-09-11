import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mayday.rotorready",
  appName: "RotorReady",
  // public-native/ is a static export of the offline-critical route tree (home, quiz,
  // AW169 training/lights, audio — see scripts/build-native-shell.mjs), bundled straight
  // into the native binary. There's no server.url here on purpose: the app boots from
  // this local copy every time, online or offline, instead of depending on a live network
  // fetch just to start.
  //
  // History (so the next person doesn't re-litigate this): shipped 2026-09-04 as the
  // "local-first shell", extended 2026-09-06 with @capgo/capacitor-updater for background
  // content updates (so a fix wouldn't need a full store release), reverted 2026-09-09
  // back to plain server.url when that background-update mechanism turned out to never
  // actually apply a real content push on a real device (7 full relaunches, no change).
  // The server.url revert then broke the actual reason this shell existed in the first
  // place: a cold app launch (fully killed, then reopened) while offline — e.g. a phone
  // in airplane mode on a flight — tries to load the live site over network and hits a
  // dead-end error page, with no path to the downloaded podcast episodes already sitting
  // safely on the device (lib/audioOffline.ts, unaffected by any of this). Restored
  // 2026-09-10 for that reason, this time *without* the background updater: content
  // updates now only reach users via a new native build/store release, not silently in
  // the background. Simpler and predictable, at the cost of needing a real app-store
  // release for a content-only fix.
  //
  // Genuinely network-only destinations (weather, airports, admin, login/signup) are
  // just normal in-app links again (not bundled, not specially handled) — visiting them
  // requires a live connection, same as any other page that needs a server, and that's
  // an honest, obvious failure mode rather than a special case to maintain.
  //
  // 2026-09-11: the 2026-09-10 "content only via a new build" tradeoff above turned out
  // to be unacceptable in practice — new podcasts genuinely weren't reaching users
  // without a store release, and the bundled shell excludes .mp3/.pdf entirely
  // (COPY_EXCLUDE_EXT in scripts/build-native-shell.mjs), so audio playback in the native
  // app never worked from a relative URL at all, downloaded-for-offline or not. Fixed
  // with lib/contentUrl.ts, *not* another swing back to server.url or another attempt at
  // a binary/JS-bundle updater (both already tried and reverted — see history above):
  // the app shell/JS still boots from this local bundle every time, but content fetches
  // (audio/lights index.json + mp3, and — once extended — quiz-data/model-data) now
  // resolve to the live rotor-ready.com URL first, falling back to the bundled copy only
  // if that fails (no signal). A commit + push now reaches the native app the moment it
  // next has signal, no store release needed — but this mechanism change itself still
  // needs one more native build to reach already-installed apps.
  webDir: "public-native",
  server: {
    errorPath: "native-error.html",
  },
  ios: {
    contentInset: "always",
  },
  android: {
    // Android 15+ enforces edge-to-edge rendering (content draws behind the status/nav
    // bars) and Capacitor's default ("disable") does nothing to compensate, so the WebView
    // content — including the app's sticky headers — was rendering partly under the status
    // bar. "force" applies native margins matching the system bar insets on every Android
    // version, not just 15+.
    adjustMarginsForEdgeToEdge: "force",
  },
};

export default config;
