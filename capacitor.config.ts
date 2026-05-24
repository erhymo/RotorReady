import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mayday.rotorready",
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