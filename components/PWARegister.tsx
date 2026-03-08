"use client";

import { useEffect } from "react";

/**
 * Ensures the PWA service worker is registered on the current origin.
 *
 * This is a belt-and-braces fallback on top of next-pwa's injected
 * registration script, and is only active in production.
 */
export default function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const existing = await navigator.serviceWorker.getRegistration();
        // If there's already an active SW for this origin/scope, do nothing.
        if (existing && existing.active) return;

        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (err) {
        // In production we fail silently; console logging here would only
        // be visible in dev tools and is not critical for users.
        if (process.env.NODE_ENV !== "production") {
          console.warn("PWA service worker registration failed", err);
        }
      }
    };

    void register();
  }, []);

  return null;
}

