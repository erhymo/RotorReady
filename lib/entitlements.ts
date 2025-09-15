// Lightweight entitlement check with optional Firebase client.
// Returns false if Firebase is not configured or user not entitled.
export async function hasPaidAccess(): Promise<boolean> {
  try {
    // Dynamic import to avoid hard dependency during build
    const { auth, db }: any = await import("@/lib/firebase/client");
    if (!auth?.currentUser || !auth.currentUser.emailVerified) return false;
    const { getDoc, doc }: any = await import("firebase/" + "firestore");
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const ents = snap.data()?.entitlements || {};
    return Boolean(ents.AW169 || ents.AW189 || ents.AW139);
  } catch {
    return false;
  }
}
