import { NextResponse } from "next/server";
export const runtime = "nodejs";

import { adminDb } from "@/lib/firebase/admin";

type FlagDoc = {
  id: string;
  questionId?: unknown;
  section?: unknown;
  userId?: unknown;
  createdAt?: unknown;
};

function keyOf(d: FlagDoc) {
  return [String(d.questionId || ""), String(d.section || ""), String(d.userId || ""), String(d.createdAt || "")].join("|");
}

function createdAtMs(value: unknown): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string" || typeof value === "number") {
    return new Date(value).getTime();
  }
  if (typeof value === "object" && value && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    const date = (value as { toDate: () => Date }).toDate();
    return date.getTime();
  }
  return 0;
}

async function findDuplicates() {
  const snap = await adminDb.collection("flags").get();
  const docs: FlagDoc[] = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() || {}) }));

  const groups = new Map<string, FlagDoc[]>();
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
      const atA = createdAtMs(a.createdAt);
      const atB = createdAtMs(b.createdAt);
      if (atA !== atB) return atA - atB; // oldest first
      return String(a.id).localeCompare(String(b.id));
    });
    for (const d of sorted.slice(1)) toDelete.push(d.id);
  }

  return { total: docs.length, keys: groups.size, duplicateGroups: duplicateGroups.length, toDelete };
}

// Read-only preview. Never deletes, regardless of query params, so this is safe to
// hit via a plain link (GET must not mutate state).
export async function GET() {
  try {
    const { total, keys, duplicateGroups, toDelete } = await findDuplicates();
    return NextResponse.json({
      total,
      keys,
      duplicateGroups,
      toDelete: toDelete.length,
      deleted: 0,
      confirmRequired: true,
    });
  } catch {
    return NextResponse.json({ error: "Firestore admin not configured or unreachable." }, { status: 503 });
  }
}

// Actually deletes duplicates. Requires an explicit JSON body so this can't be
// triggered by a plain navigable link, browser prefetch, or crawler.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { confirm?: boolean } | null;
  if (!body?.confirm) {
    return NextResponse.json({ error: "Missing confirm:true in request body" }, { status: 400 });
  }

  let dup: Awaited<ReturnType<typeof findDuplicates>>;
  try {
    dup = await findDuplicates();
  } catch {
    return NextResponse.json({ error: "Firestore admin not configured or unreachable." }, { status: 503 });
  }
  const { total, keys, duplicateGroups, toDelete } = dup;

  let deleted = 0;
  if (toDelete.length) {
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

  return NextResponse.json({ total, keys, duplicateGroups, toDelete: toDelete.length, deleted });
}
