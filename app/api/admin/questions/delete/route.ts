import { NextResponse } from "next/server";
export const runtime = "nodejs";

// Soft-delete: add question ID to Firestore blocklist so it's filtered out at runtime
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    section?: string;
    id?: string;
    dataSource?: "sections" | "all-questions";
    dataFile?: string | null;
    sectionId?: string;
  } | null;
  if (!body?.id) {
    return NextResponse.json({ error: "Bad body" }, { status: 400 });
  }
  try {
    const { addBlockedQuestion } = await import("@/lib/server/questions/blockedQuestionsStore");
    await addBlockedQuestion({
      id: body.id,
      section: body.section,
      sectionId: body.sectionId,
      dataSource: body.dataSource ?? null,
      dataFile: body.dataFile ?? null,
    });
    return NextResponse.json({ ok: true, blocked: body.id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to block question" }, { status: 500 });
  }
}
