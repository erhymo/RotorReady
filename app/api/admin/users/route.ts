import { NextResponse } from "next/server";

import { isProduction } from "@/lib/env";
import { adminDb, adminAuth, isFirebaseAdminUnavailableError } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [snap, idxSnap] = await Promise.all([
      adminDb.collection("users").get(),
      adminDb.collection("users_by_email").get(),
    ]);

    const byEmail = new Map<string, string | null>();

    for (const doc of snap.docs) {
      const data = doc.data() as any;
      const email: string | null = data?.email || null;
      if (!email) continue;
      const createdAtMeta = (doc as any).createTime?.toDate?.();
      const createdAt: string | null = createdAtMeta ? createdAtMeta.toISOString() : (data?.createdAt ?? null);
      const cur = byEmail.get(email);
      if (!cur || (createdAt && (!cur || Date.parse(createdAt) > Date.parse(cur)))) {
        byEmail.set(email, createdAt || cur || null);
      }
    }

    for (const doc of idxSnap.docs) {
      const email = doc.id;
      const data = doc.data() as any;
      const createdAt: string | null = data?.createdAt ?? null;
      const cur = byEmail.get(email);
      if (!cur || (createdAt && (!cur || Date.parse(createdAt) > Date.parse(cur)))) {
        byEmail.set(email, createdAt || cur || null);
      }
    }

    // From Firebase Auth (users that may not yet have Firestore profile)
    try {
      let pageToken: string | undefined = undefined;
      do {
        const res = await adminAuth.listUsers(1000, pageToken);
        for (const u of res.users) {
          const email = u.email;
          if (!email) continue;
          const creation = u.metadata?.creationTime ? new Date(u.metadata.creationTime).toISOString() : null;
          const cur = byEmail.get(email);
          if (!cur || (creation && (!cur || Date.parse(creation) > Date.parse(cur)))) {
            byEmail.set(email, creation || cur || null);
          }
        }
        pageToken = res.pageToken as any;
      } while (pageToken);
    } catch {}

    const users = Array.from(byEmail.entries()).map(([email, createdAt]) => ({ email, createdAt }));

    users.sort((a, b) => {
      const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
      const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
      return tb - ta; // newest first
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Failed to load users list", error);
    if (isFirebaseAdminUnavailableError(error)) {
      return NextResponse.json(
        {
          users: [],
          [isProduction ? "error" : "devWarning"]: isProduction
            ? "Firebase Admin er ikke tilgjengelig; viser tom brukerliste."
            : "Firebase Admin er ikke konfigurert i dev; viser tom brukerliste.",
        },
        { status: 200 },
      );
    }
    return NextResponse.json({ error: error?.message || "Kunne ikke hente brukere" }, { status: 500 });
  }
}

