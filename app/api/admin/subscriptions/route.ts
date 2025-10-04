import { NextResponse } from "next/server";

import { getSubscriptionMetrics } from "@/lib/server/subscriptions/metrics";

export const runtime = "nodejs";

export async function GET() {
  try {
    const metrics = await getSubscriptionMetrics();
    return NextResponse.json({ metrics });
  } catch (error: any) {
    console.error("Failed to load subscription metrics", error);
    return NextResponse.json({ error: error?.message || "Kunne ikke hente metrics" }, { status: 500 });
  }
}
