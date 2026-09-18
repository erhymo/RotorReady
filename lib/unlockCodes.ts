// Lightweight client-side gate for operator-specific bonus content (e.g. Lufttransport OPC
// prep episodes). Not real security — the code lives in this bundle and unlock state is a
// plain localStorage flag — but that's intentional: it just needs to keep the content out of
// the general audio list, not withstand a determined attacker.
// Empty on purpose: the OPC 26 episode it gated was retired 2026-09-17, and a code that
// reports "Unlocked" while revealing nothing is worse than one that reports "Wrong code".
// The mechanism below is kept for the next operator-specific release — re-add a
// `CODE: "rr_unlock_<flag>"` line here and set the same `unlockFlag` on the audio item.
const UNLOCK_CODES: Record<string, string> = {};

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
