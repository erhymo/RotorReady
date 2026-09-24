import { NextResponse } from "next/server";
import { handleNativeCorsPreflight, nativeCorsHeaders } from "@/lib/server/nativeCors";

export const runtime = "nodejs";

// The native app reads this cross-origin from the WebView; see lib/server/nativeCors.ts.
export async function OPTIONS(req: Request) {
  return handleNativeCorsPreflight(req);
}

export async function GET(req: Request) {
  const cors = nativeCorsHeaders(req);
  try {
    const { listBlockedQuestionIds } = await import("@/lib/server/questions/blockedQuestionsStore");
    const ids = await listBlockedQuestionIds();
    return NextResponse.json({ ids }, { headers: cors });
  } catch (err) {
    // Fail-safe: do not block quiz if store is unavailable
    return NextResponse.json({ ids: [] }, { headers: cors });
  }
}
