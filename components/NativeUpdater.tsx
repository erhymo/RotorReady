"use client";

import { useEffect } from "react";
import { initNativeUpdater } from "@/lib/nativeUpdater";

/**
 * Kicks off a background content-update check for the native app's
 * local-first shell. No-op on the web (initNativeUpdater bails out unless
 * running inside Capacitor) and renders nothing.
 */
export default function NativeUpdater() {
  useEffect(() => {
    initNativeUpdater();
  }, []);

  return null;
}
