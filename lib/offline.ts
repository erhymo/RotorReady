import { getStoredActiveModelVariantId, modelScopedKey } from "@/lib/models/storage";

export type OfflineBlob = { type: "section"; id: string; payload: unknown; savedAt: string };

const base = "offline:sections";
const keyFor = (variantId: string, id: string) => `${modelScopedKey(base, variantId)}:${id}`;

export function saveSectionOffline(id: string, payload: unknown, variantId = getStoredActiveModelVariantId()) {
  if (typeof window === "undefined") return;
  const blob: OfflineBlob = { type: "section", id, payload, savedAt: new Date().toISOString() };
  localStorage.setItem(keyFor(variantId, id), JSON.stringify(blob));
}

export function loadSectionOffline<T = unknown>(id: string, variantId = getStoredActiveModelVariantId()): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(keyFor(variantId, id));
  if (!raw) return null;
  try { return JSON.parse(raw).payload as T; } catch { return null; }
}

export function clearOfflineSection(id: string, variantId = getStoredActiveModelVariantId()) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(keyFor(variantId, id));
}

export function listOffline(variantId = getStoredActiveModelVariantId()) {
  if (typeof window === "undefined") return [] as string[];
  const prefix = `${modelScopedKey(base, variantId)}:`;
  return Object.keys(localStorage)
    .filter((k) => k.startsWith(prefix))
    .map((k) => k.replace(prefix, ""));
}
