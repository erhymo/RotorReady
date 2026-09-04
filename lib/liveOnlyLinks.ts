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
  const { Browser } = await import("@capacitor/browser");
  await Browser.open({ url: `https://rotor-ready.com${path}` });
}
