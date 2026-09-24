"use client";

import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";

import { apiUrl } from "@/lib/contentUrl";

const VISITOR_ID_KEY = "rr_traffic_visitor_id";
const LAST_SENT_KEY = "rr_traffic_last_sent_at";
const CLIENT_COOLDOWN_MS = 30 * 60 * 1000;

function getVisitorId() {
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const next = window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(VISITOR_ID_KEY, next);
    return next;
  } catch {
    return `anon-${Date.now().toString(36)}`;
  }
}

function shouldSendHeartbeat() {
  try {
    const lastSent = Number(window.localStorage.getItem(LAST_SENT_KEY) || "0");
    return !lastSent || Date.now() - lastSent >= CLIENT_COOLDOWN_MS;
  } catch {
    return true;
  }
}

function markHeartbeatSent() {
  try {
    window.localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
  } catch {}
}

export default function AnalyticsProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldSendHeartbeat()) return;

    const payload = {
      visitorId: getVisitorId(),
      path: window.location.pathname,
      source: "app-open",
      platform: Capacitor.getPlatform(),
    };

    const send = async () => {
      try {
        // apiUrl, not a relative path: inside the native app a relative /api
        // call hits the bundled shell and 404s, so until 2026-09-24 no native
        // app open was ever counted. No keepalive either — this runs on mount,
        // not on page exit, and a keepalive request that needs a CORS
        // preflight (the native case) is not reliably supported.
        const res = await fetch(apiUrl("/api/traffic/heartbeat"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) markHeartbeatSent();
      } catch {
        // Traffic metrics must never affect the training app experience.
      }
    };

    void send();
  }, []);

  return null;
}

