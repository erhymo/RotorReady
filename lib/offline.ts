import { getStoredActiveModelVariantId, modelScopedKey } from "@/lib/models/storage";

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

export function clearOfflineSection(id: string, variantId = getStoredActiveModelVariantId()) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(keyFor(variantId, id));
  } catch (error) {
    console.warn("Kunne ikke slette offline-seksjon", { id, variantId, error });
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
