import { NextResponse } from "next/server";

import { isProduction } from "@/lib/env";
import { adminDb, isFirebaseAdminUnavailableError } from "@/lib/firebase/admin";

export const runtime = "nodejs";

// Admin view of the crash reports collected by /api/client-error. Guarded by
// middleware.ts like every /api/admin route.

const COLLECTION = "clientErrors";

function unavailable(error: unknown) {
  return NextResponse.json({
    errors: [],
    [isProduction ? "error" : "devWarning"]: isProduction
      ? "Firebase Admin is not available; showing an empty error list."
      : "Firebase Admin is not configured in dev; showing an empty error list.",
  });
}

export async function GET() {
  try {
    const snap = await adminDb.collection(COLLECTION).orderBy("lastSeenAt", "desc").limit(50).get();
    const errors = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ errors });
  } catch (error: any) {
    console.error("Failed to load client errors", error);
    if (isFirebaseAdminUnavailableError(error)) return unavailable(error);
    return NextResponse.json({ error: error?.message || "Could not load errors" }, { status: 500 });
  }
}

// Clearing an entry after the fix has shipped keeps the list about current
// problems. If the error comes back, it simply reappears with a fresh count.
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^[a-f0-9]{32}$/.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await adminDb.collection(COLLECTION).doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Failed to delete client error", error);
    return NextResponse.json({ error: error?.message || "Could not delete" }, { status: 500 });
  }
}
