export function incQuota(mod: string) {
  const k = `rr_quota:${mod}`;
  const n = parseInt(localStorage.getItem(k) || "0", 10) + 1;
  localStorage.setItem(k, String(n));
  return n;
}
export function getQuota(mod: string) {
  const k = `rr_quota:${mod}`;
  return parseInt(localStorage.getItem(k) || "0", 10);
}
export async function isPaidAsync(): Promise<boolean> {
  try {
    const { hasPaidAccess } = await import("@/lib/entitlements");
    return await hasPaidAccess();
  } catch {
    return false;
  }
}
