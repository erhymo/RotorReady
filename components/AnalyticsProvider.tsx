"use client";
import { useEffect } from "react";
import posthog from "posthog-js";
import { auth } from "@/lib/firebase/client";

async function sendHeartbeat() {
  try {
    const user = auth?.currentUser;
    if (!user) return;
    const last = window.localStorage.getItem("rr_last_heartbeat_at");
    const now = Date.now();
    if (last) {
      const lastMs = parseInt(last, 10);
      if (Number.isFinite(lastMs) && now - lastMs < 60 * 60 * 1000) {
        return;
      }
    }
    const token = await user.getIdToken().catch(() => null);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch("/api/account/heartbeat", {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      console.warn("Failed to send heartbeat", await res.text());
      return;
    }
    window.localStorage.setItem("rr_last_heartbeat_at", String(now));
  } catch (error) {
    console.warn("Error sending heartbeat", error);
  }
}

export default function AnalyticsProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (typeof window !== "undefined" && key && host) {
      posthog.init(key, { api_host: host, capture_pageview: true, person_profiles: "identified_only" });
      // Merk miljø på events
      const env = process.env.NEXT_PUBLIC_ENV || (process.env.NODE_ENV === "production" ? "production" : "development");
      posthog.register({ env });
    }

    if (typeof window !== "undefined" && auth) {
      const unsub = auth.onAuthStateChanged((user) => {
        if (user) {
          sendHeartbeat();
        }
      });
      return () => {
        unsub();
      };
    }
  }, []);
  return null;
}

