import { onAuthStateChanged } from "firebase/auth";

const E2E_LOGIN_OVERRIDE_KEY = "rr_e2e_logged_in";
const FREE_ACCESS_ENABLED = true;

function hasE2ELoginOverride(): boolean {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
  const isAutomation = typeof navigator !== "undefined" && navigator.webdriver;

  if (!isLocalHost && !isAutomation) return false;

  try {
    return window.localStorage.getItem(E2E_LOGIN_OVERRIDE_KEY) === "1";
  } catch {
    return false;
  }
}

export async function isLoggedInAsync(timeoutMs = 3000): Promise<boolean> {
  // RotorReady is currently free to use. Keep this helper permissive so older
  // quiz/training flows do not redirect users away from training content.
  if (FREE_ACCESS_ENABLED) return true;

  if (hasE2ELoginOverride()) return true;

  try {
    const { auth } = await import("@/lib/firebase/client");
    if (!auth) return false;
    if (auth.currentUser) return true;
    // Wait for Firebase auth to hydrate (mobile can be late). Time out conservatively.
    return await new Promise<boolean>((resolve) => {
      let done = false;
      const finish = (val: boolean) => { if (!done) { done = true; try { unsub(); } catch {} resolve(val); } };
      const unsub = onAuthStateChanged(auth, (user) => finish(!!user), () => finish(false));
      setTimeout(() => finish(false), Math.max(500, timeoutMs));
    });
  } catch {
    return false;
  }
}

