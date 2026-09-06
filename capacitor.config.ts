import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mayday.rotorready",
  appName: "RotorReady",
  // public/native-shell/ is a static export of the offline-critical route tree (home,
  // quiz, AW169 training/lights, audio — see scripts/build-native-shell.mjs), bundled
  // straight into the native binary. There's no server.url here on purpose: the app boots
  // from this local copy every time, online or offline, instead of depending on a live
  // network fetch (or a previously-activated service worker) just to start. Genuinely
  // network-only destinations (weather, airports, admin, login/signup) open in the
  // in-app browser against the live site instead of being bundled — see
  // lib/liveOnlyLinks.ts. Being a plain subdirectory of public/, it's also served live by
  // Vercel (no route, no function), which is what lib/nativeUpdater.ts polls for content
  // updates without needing a new store build.
  webDir: "public/native-shell",
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
  plugins: {
    CapacitorUpdater: {
      // lib/nativeUpdater.ts drives update checks explicitly against our own
      // public/native-shell/version.json — the plugin's own autoUpdate polling
      // talks to Capgo's proprietary updateUrl protocol, which we're not using
      // (self-hosted, no Capgo account).
      autoUpdate: "off",
      // Found during Android testing: the plugin sends usage/health telemetry
      // to Capgo's own statsUrl by default, independent of autoUpdate — not
      // something to send anywhere given we have no Capgo account, and while
      // offline it retries roughly once a second with no backoff (a real
      // battery/CPU cost for an app meant to be used offline for hours).
      // Empty string disables stats reporting entirely, per the plugin's docs.
      statsUrl: "",
    },
  },
};

export default config;