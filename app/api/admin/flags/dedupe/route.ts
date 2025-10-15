import { NextResponse } from "next/server";
export const runtime = "nodejs";

import { adminDb } from "@/lib/firebase/admin";

function keyOf(d: any) {
  return [String(d.questionId || ""), String(d.section || ""), String(d.userId || ""), String(d.createdAt || "")] .join("|");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const confirm = searchParams.get("confirm") === "1" || searchParams.get("confirm") === "true";

  const snap = await adminDb.collection("flags").get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));

  const groups = new Map<string, any[]>();
  for (const d of docs) {
    const k = keyOf(d);
    const arr = groups.get(k) || [];
    arr.push(d);
    groups.set(k, arr);
  }

  const duplicateGroups = Array.from(groups.entries()).filter(([, arr]) => arr.length > 1);

  // Decide which to keep: oldest createdAt (or lowest id if tie)
  const toDelete: string[] = [];
  for (const [, arr] of duplicateGroups) {
    const sorted = [...arr].sort((a, b) => {
      const atA = new Date(a.createdAt || 0).getTime();
      const atB = new Date(b.createdAt || 0).getTime();
      if (atA !== atB) return atA - atB; // oldest first
      return String(a.id).localeCompare(String(b.id));
    });
    const keep = sorted[0];
    for (const d of sorted.slice(1)) toDelete.push(d.id);
  }

  let deleted = 0;
  if (confirm && toDelete.length) {
    // Firestore batch limit 500
    const chunks: string[][] = [];
    for (let i = 0; i < toDelete.length; i += 450) chunks.push(toDelete.slice(i, i + 450));
    for (const chunk of chunks) {
      const batch = adminDb.batch();
      for (const id of chunk) {
        batch.delete(adminDb.collection("flags").doc(id));
      }
      await batch.commit();
      deleted += chunk.length;
    }
  }

  return NextResponse.json({
    total: docs.length,
    keys: groups.size,
    duplicateGroups: duplicateGroups.length,
    toDelete: toDelete.length,
    deleted,
    confirmRequired: !confirm,
  });
}

