// Best-effort Firestore sync. Silently no-ops if Firebase isn't configured.
export type ResultRecord = {
  section: string;
  total: number;
  correct: number;
  percent: number;
  version?: { qrh?: string; rfm?: string };
  at: string; // ISO
};

export async function saveResult(rec: ResultRecord) {
  try {
    const { auth, db }: any = await import("@/lib/firebase/client");
    if (!auth?.currentUser) return;
    const { collection, addDoc }: any = await import("firebase/" + "firestore");
    const ref = collection(db, "users", auth.currentUser.uid, "results");
    await addDoc(ref, rec);
  } catch {
    // ignore when firebase isn't available
  }
}
