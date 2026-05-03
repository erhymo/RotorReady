import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rotorready.app",
  appName: "RotorReady",
  webDir: "public",
  server: {
    url: "https://rotor-ready.com",
    cleartext: false,
  },
};

export default config;