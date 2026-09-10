"use client";

// Some destinations (live weather, airport hours) inherently need a server —
// they aren't part of the native app's bundled local shell (see
// scripts/build-native-shell.mjs's EXCLUDE_FROM_EXPORT), so there's no local
// route for the app's own router to navigate to; a plain <Link> would 404
// against the local bundle regardless of connectivity. In the native app,
// navigate the WebView straight to the live URL instead; on the web (where
// these routes are served normally), just do a normal in-app navigation.
export async function openLiveOnlyLink(path: string) {
  const { Capacitor } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform()) {
    window.location.href = path;
    return;
  }
  window.location.href = `https://rotor-ready.com${path}`;
}
