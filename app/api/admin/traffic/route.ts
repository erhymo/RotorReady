import { NextResponse } from "next/server";

import { getTrafficMetrics } from "@/lib/server/traffic/metrics";

export const runtime = "nodejs";

export async function GET() {
  try {
    const metrics = await getTrafficMetrics();
    return NextResponse.json({ metrics });
  } catch (error: any) {
    console.error("Failed to load traffic metrics", error);
    return NextResponse.json(
      { error: error?.message || "Kunne ikke hente trafikkstatistikk" },
      { status: 500 },
    );
  }
}

