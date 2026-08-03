import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mayday.rotorready",
  appName: "RotorReady",
  // The app loads all content live from server.url below and only ever falls back to a
  // local file for the offline errorPath page — so webDir points at a minimal folder with
  // just that page, not the full public/ directory (which holds many-hundred-MB of podcast
  // audio and RFM PDFs never actually read from local assets at runtime).
  webDir: "public-native",
  server: {
    url: "https://rotor-ready.com",
    cleartext: false,
    errorPath: "native-error.html",
  },
  ios: {
    contentInset: "always",
  },
};

export default config;