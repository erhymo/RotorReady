// Lightweight entitlement check with optional Firebase client.
// Returns false if Firebase is not configured or user not entitled.
import type { User } from "firebase/auth";

export async function hasPaidAccess(): Promise<boolean> {
  try {
    // Dynamic import to avoid hard dependency during build
    const { auth, db }: any = await import("@/lib/firebase/client");
    if (!auth) return false;

    const { onAuthStateChanged }: any = await import("firebase/" + "auth");
    const user = await new Promise<User | null>((resolve) => {
      if (auth.currentUser) {
        resolve(auth.currentUser);
        return;
      }
      let unsubscribe: (() => void) | undefined;
      unsubscribe = onAuthStateChanged(auth, (u: any) => {
        if (unsubscribe) unsubscribe();
        resolve(u);
      });
    });

    if (!user) return false;

    const { getDoc, doc }: any = await import("firebase/" + "firestore");
    const snap = await getDoc(doc(db, "users", user.uid));
    const ents = snap.data()?.entitlements || {};
    return Boolean(ents.AW169 || ents.AW189 || ents.AW139);
  } catch {
    return false;
  }
}
