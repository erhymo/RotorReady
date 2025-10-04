import { DEFAULT_MODEL_VARIANT_ID, getModelVariant } from "@/lib/models/catalog";

const ACTIVE_MODEL_STORAGE_KEY = "rr_active_model_variant";

export function getStoredActiveModelVariantId(): string {
  if (typeof window === "undefined") return DEFAULT_MODEL_VARIANT_ID;
  try {
    const stored = localStorage.getItem(ACTIVE_MODEL_STORAGE_KEY);
    if (stored && getModelVariant(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn("Kunne ikke lese aktiv modell fra localStorage", error);
  }
  return DEFAULT_MODEL_VARIANT_ID;
}

export function storeActiveModelVariantId(variantId: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_MODEL_STORAGE_KEY, variantId);
  } catch (error) {
    console.warn("Kunne ikke lagre aktiv modell", error);
  }
}

export function modelScopedKey(baseKey: string, variantId: string): string {
  return `${baseKey}:${variantId}`;
}
