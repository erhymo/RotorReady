"use client";

// Some destinations (live weather, airport hours) inherently need a server —
// they aren't part of the native app's local shell (see
// scripts/build-native-shell.mjs), so there's no local route to navigate to.
// In the native app, open them in the system/in-app browser against the live
// site instead of a dead client-side 404; on the web (where these routes are
// served normally), just do a normal navigation.
export async function openLiveOnlyLink(path: string) {
  const { Capacitor } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform()) {
    window.location.href = path;
    return;
  }
  const liveUrl = `https://rotor-ready.com${path}`;
  try {
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({ url: liveUrl });
  } catch {
    // @capacitor/browser was only added 2026-09-04 (the local-first-shell
    // work) — any installed app binary built before that (e.g. the Google
    // Play production release, which as of this writing is still the
    // pre-2026-09-04 versionCode 6/1.4; the newer 1.5 build has a compiled-in
    // Browser plugin but is sitting as a draft release, not yet rolled out)
    // never got the native Browser plugin implementation compiled in at all.
    // isNativePlatform() is core Capacitor and always present, so that check
    // above passes, but Browser.open() itself then throws/rejects with
    // nothing catching it — the tap did literally nothing, no visible error.
    // Fall back to navigating the app's own WebView to the live page instead
    // of silently failing; loses the "stay in the app shell" framing, but
    // gets the user to real content instead of nothing at all.
    window.location.href = liveUrl;
  }
}
