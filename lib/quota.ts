import { getStoredActiveModelVariantId, modelScopedKey } from "@/lib/models/storage";

function quotaKey(mod: string) {
  const variantId = getStoredActiveModelVariantId();
  return `${modelScopedKey("rr_quota", variantId)}:${mod}`;
}

export function incQuota(mod: string) {
  const key = quotaKey(mod);
  const legacyKey = `rr_quota:${mod}`;
  const n = parseInt(localStorage.getItem(key) || "0", 10) + 1;
  localStorage.setItem(key, String(n));
  if (legacyKey !== key) {
    localStorage.removeItem(legacyKey);
  }
  return n;
}
export function getQuota(mod: string) {
  const key = quotaKey(mod);
  const legacyKey = `rr_quota:${mod}`;
  const value = localStorage.getItem(key) || localStorage.getItem(legacyKey) || "0";
  return parseInt(value, 10);
}
export async function isPaidAsync(): Promise<boolean> {
  try {
    const { hasPaidAccess } = await import("@/lib/entitlements");
    return await hasPaidAccess();
  } catch {
    return false;
  }
}
