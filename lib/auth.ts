import { onAuthStateChanged } from "firebase/auth";

export async function isLoggedInAsync(timeoutMs = 3000): Promise<boolean> {
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

