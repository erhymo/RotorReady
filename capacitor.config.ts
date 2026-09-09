import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mayday.rotorready",
  appName: "RotorReady",
  // The app loads all content live from server.url below and only ever falls back to a
  // local file for the offline errorPath page — so webDir points at a minimal folder with
  // just that page, not a full bundled copy of the site.
  //
  // This is a deliberate reversion (2026-09-09) from the "local-first shell" architecture
  // (bundled offline export + @capgo/capacitor-updater background content updates,
  // shipped as versionCode 7/1.5 and iOS 1.0.8). That system's delta-update mechanism
  // never worked end-to-end on a real device: a genuine content push after install (going
  // from 3 to 8 AW169 EP light-audio episodes, plus several other fixes) still hadn't
  // reached an installed app after 7 full relaunches. The code and the plugin's own
  // comparison logic both checked out correct on inspection, so the bug is somewhere in
  // real-world plugin behavior that was never actually exercised before shipping (per
  // project_native_local_first_shell memory: "a real delta-download+rollback cycle is
  // still unexercised" — this was that first real exercise, and it failed silently with
  // no diagnostics reaching us). Rather than debug an unproven mechanism further, this
  // reverts to the simple, previously-reliable server.url approach and keeps only the
  // two genuinely independent wins from that work: the Android hardware back-button fix
  // (@capacitor/app, see components/NativeBackButton.tsx) and the Android 15 edge-to-edge
  // margin fix below. True first-ever-offline-launch support is given up for now — what's
  // kept instead: downloaded podcast episodes (lib/audioOffline.ts, plain Cache API, was
  // never part of the local-first-shell system and is completely unaffected by this
  // revert) and any page already visited once while online (the existing next-pwa service
  // worker in next.config.mjs, unchanged throughout — NetworkFirst-caches quiz/lights
  // pages and falls back to cache offline; was simply unused while server.url was absent).
  webDir: "public-native",
  server: {
    url: "https://rotor-ready.com",
    cleartext: false,
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
