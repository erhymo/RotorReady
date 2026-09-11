"use client";

import { Capacitor } from "@capacitor/core";

// The native app boots from a locally bundled static shell (capacitor.config.ts has no
// server.url, on purpose — see that file's comment for the full history) so cold launch
// works instantly, online or offline. But that bundle is a snapshot taken at the last
// native build (scripts/build-native-shell.mjs), and it excludes .mp3/.pdf entirely
// (COPY_EXCLUDE_EXT) — so inside the native app, a plain relative fetch for a podcast
// index.json resolves to a possibly-stale snapshot, and a relative fetch for an actual
// .mp3 resolves to nothing at all (404), every time, whether or not the device has a
// network connection.
//
// This resolves a public content path (audio/lights index.json + mp3, quiz-data,
// model-data, training assets — anything served as a plain file under public/) to a URL
// that works both on the web and inside the native app:
//   - Web: unchanged, relative — the service worker's own NetworkFirst caching
//     (next.config.mjs) already provides freshness-when-online / fallback-when-offline.
//   - Native: the live rotor-ready.com URL, so a normal commit + push makes new content
//     (a new podcast, a fixed dataset) show up the next time the app has signal — no new
//     store build or review cycle needed for a content-only change.
const LIVE_ORIGIN = "https://rotor-ready.com";

export function contentUrl(path: string): string {
  return Capacitor.isNativePlatform() ? `${LIVE_ORIGIN}${path}` : path;
}

/**
 * Fetches JSON content, preferring the live origin in the native app (freshest — see
 * contentUrl above) and falling back to the locally bundled copy at the same relative
 * path if the live fetch fails (no signal, e.g. mid-flight with nothing downloaded yet).
 * That fallback copy may be stale, but it's always there, so the list still renders
 * instead of hanging or coming up empty. On the web this is just a normal fetch — no
 * `cache: "no-store"` (see app/audio/page.tsx's comment for why that broke the service
 * worker's own offline caching).
 */
export async function fetchContentJson<T>(path: string): Promise<T> {
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await fetch(`${LIVE_ORIGIN}${path}`);
      if (!res.ok) throw new Error(`live fetch failed: ${res.status}`);
      return (await res.json()) as T;
    } catch {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`bundled fetch failed: ${res.status}`);
      return (await res.json()) as T;
    }
  }
  const res = await fetch(path);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  return (await res.json()) as T;
}
