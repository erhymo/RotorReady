import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { listBlockedQuestionIds } = await import("@/lib/server/questions/blockedQuestionsStore");
    const ids = await listBlockedQuestionIds();
    return NextResponse.json({ ids });
  } catch (err) {
    // Fail-safe: do not block quiz if store is unavailable
    return NextResponse.json({ ids: [] });
  }
}

