import { getStoredActiveModelVariantId, modelScopedKey } from "@/lib/models/storage";
import { fetchContentText } from "@/lib/contentUrl";

export type OfflineBlob = { type: "section"; id: string; payload: unknown; savedAt: string };

const base = "offline:sections";
const keyFor = (variantId: string, id: string) => `${modelScopedKey(base, variantId)}:${id}`;

export function saveSectionOffline(id: string, payload: unknown, variantId = getStoredActiveModelVariantId()) {
  if (typeof window === "undefined") return false;
  try {
    const blob: OfflineBlob = { type: "section", id, payload, savedAt: new Date().toISOString() };
    localStorage.setItem(keyFor(variantId, id), JSON.stringify(blob));
    return true;
  } catch (error) {
    console.warn("Kunne ikke lagre offline-seksjon", { id, variantId, error });
    return false;
  }
}

export function loadSectionOffline<T = unknown>(id: string, variantId = getStoredActiveModelVariantId()): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(keyFor(variantId, id));
    if (!raw) return null;
    return JSON.parse(raw).payload as T;
  } catch {
    return null;
  }
}

export function listOffline(variantId = getStoredActiveModelVariantId()) {
  if (typeof window === "undefined") return [] as string[];
  try {
    const prefix = `${modelScopedKey(base, variantId)}:`;
    return Object.keys(localStorage)
      .filter((k) => k.startsWith(prefix))
      .map((k) => k.replace(prefix, ""));
  } catch {
    return [] as string[];
  }
}

// Quiz sections a user explicitly downloaded for offline use (via the Offline
// packages page, removed 2026-09-24 — older installs still hold such copies)
// used to be loaded from this local snapshot forever, with no way to notice a
// newer version had been pushed — see the S92 limitations quiz incident this
// was written for. This silently re-fetches each saved section over the network
// and overwrites the local copy on success, so a downloaded package drifts back
// into sync the moment the app has signal. Best-effort: any failure (no signal,
// derived/manifest-only section not covered by a direct model-data file) just
// leaves the existing local copy untouched — it's a freshness improvement on
// top of the safety net, never a replacement for it.
export async function refreshOfflineSectionsInBackground(
  variantId = getStoredActiveModelVariantId(),
): Promise<void> {
  if (typeof window === "undefined") return;
  const ids = listOffline(variantId);
  for (const id of ids) {
    const urls = [`/model-data/${variantId}/sections/${id}.json`, `/quiz-data/sections/${id}.json`];
    for (const url of urls) {
      try {
        const raw = await fetchContentText(url);
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.items) && data.items.length) {
          saveSectionOffline(id, data, variantId);
          break;
        }
      } catch {}
    }
  }
}
