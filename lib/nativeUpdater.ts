"use client";

// Background content updates for the native app's local-first shell (see
// scripts/build-native-shell.mjs and project_native_local_first_shell memory).
// The shell is bundled into the native binary at build time, so without this
// a content fix would only reach installed apps on the next store release.
// Self-hosted @capgo/capacitor-updater: we drive checks against our own
// public/native-shell/version.json (plain static file, no Capgo account/
// backend involved) rather than the plugin's own autoUpdate polling, which
// talks to Capgo's proprietary updateUrl protocol — see capacitor.config.ts's
// `autoUpdate: "off"`.

const VERSION_URL = "https://rotor-ready.com/native-shell/version.json";

type ShellManifestEntry = {
  file_name: string;
  file_hash: string;
  download_url: string;
};

type ShellVersion = {
  version: string;
  url: string;
  files: ShellManifestEntry[];
};

/**
 * Call once at app startup, native platforms only. Never throws — a failed
 * or skipped update check must not affect the app that's already running.
 */
export async function initNativeUpdater(): Promise<void> {
  const { Capacitor } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform()) return;

  const { CapacitorUpdater } = await import("@capgo/capacitor-updater");

  // Required every launch: tells the plugin the bundle that just booted is
  // good. Skipping this is what triggers the plugin's own automatic rollback
  // to the last-known-good bundle — this call *is* the safety net.
  try {
    await CapacitorUpdater.notifyAppReady();
  } catch {
    // Nothing useful to do if this fails — the plugin's own timeout-based
    // rollback still applies.
  }

  try {
    const res = await fetch(VERSION_URL, { cache: "no-store" });
    if (!res.ok) return;
    const remote: ShellVersion = await res.json();
    if (!remote?.version || !Array.isArray(remote.files) || !remote.files.length) return;

    const missing = await CapacitorUpdater.getMissingBundleFiles({
      manifest: remote.files,
      version: remote.version,
    });
    if (!missing?.missing?.length) return; // already current, or nothing new for this device

    const bundle = await CapacitorUpdater.download({
      url: remote.url,
      version: remote.version,
      manifest: remote.files,
    });

    // Stage for the *next* launch/background transition — never swap the
    // content out from under the user mid-session.
    await CapacitorUpdater.next({ id: bundle.id });
  } catch {
    // Best-effort background update. Any failure here (network, disk,
    // corrupt download) just means we try again next launch.
  }
}
