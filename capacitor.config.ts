import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rotorready.app",
  appName: "RotorReady",
  webDir: "public",
  server: {
    url: "https://rotor-ready.com",
    cleartext: false,
  },
  ios: {
    contentInset: "always",
  },
};

export default config;