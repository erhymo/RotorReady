import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mayday.rotorready",
  appName: "RotorReady",
  // public-native/ is a static export of the offline-critical route tree (home, quiz,
  // AW169 training/lights, audio — see scripts/build-native-shell.mjs), bundled straight
  // into the native binary. There's no server.url here on purpose: the app boots from this
  // local copy every time, online or offline, instead of depending on a live network
  // fetch (or a previously-activated service worker) just to start. Genuinely
  // network-only destinations (weather, airports, admin, login/signup) open in the
  // in-app browser against the live site instead of being bundled — see
  // lib/liveOnlyLinks.ts.
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