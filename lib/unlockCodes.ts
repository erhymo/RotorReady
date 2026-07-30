// Lightweight client-side gate for operator-specific bonus content (e.g. Lufttransport OPC
// prep episodes). Not real security — the code lives in this bundle and unlock state is a
// plain localStorage flag — but that's intentional: it just needs to keep the content out of
// the general audio list, not withstand a determined attacker.
const UNLOCK_CODES: Record<string, string> = {
  LT26: "rr_unlock_opc26",
};

export function tryUnlockCode(rawCode: string): boolean {
  if (typeof window === "undefined") return false;
  const code = rawCode.trim().toUpperCase();
  const flag = UNLOCK_CODES[code];
  if (!flag) return false;
  try {
    localStorage.setItem(flag, "true");
  } catch {
    // ignore
  }
  return true;
}

export function isUnlockFlagSet(flag: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(flag) === "true";
  } catch {
    return false;
  }
}
