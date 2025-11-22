import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";
import { requireIdToken } from "@/lib/server/auth/verifyIdToken";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await requireIdToken(req);
    const now = new Date();
    const nowIso = now.toISOString();

    const ref = adminDb.collection("users").doc(user.uid);
    await ref.set(
      {
        lastSeenAt: nowIso,
        updatedAt: nowIso,
        // Fyll inn e-post hvis vi kjenner den, uten a overskrive eksisterende verdi hvis den mangler her.
        ...(user.email ? { email: user.email } : {}),
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to record heartbeat", error);
    return NextResponse.json({ error: "Kunne ikke lagre aktivitet" }, { status: 500 });
  }
}

