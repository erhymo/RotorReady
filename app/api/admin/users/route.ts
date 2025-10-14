import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const snap = await adminDb.collection("users").get();
    const users = snap.docs.map((doc) => {
      const data = doc.data() as any;
      const email: string | null = data?.email || null;
      const createdAtMeta = (doc as any).createTime?.toDate?.();
      const createdAt: string | null = createdAtMeta ? createdAtMeta.toISOString() : (data?.createdAt ?? null);
      return { email, createdAt };
    }).filter((u) => !!u.email) as { email: string; createdAt?: string | null }[];

    users.sort((a, b) => {
      const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
      const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
      return tb - ta; // newest first
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Failed to load users list", error);
    return NextResponse.json({ error: error?.message || "Kunne ikke hente brukere" }, { status: 500 });
  }
}

