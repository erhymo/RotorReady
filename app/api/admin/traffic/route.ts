import { NextResponse } from "next/server";

import { isProduction } from "@/lib/env";
import { isFirebaseAdminUnavailableError } from "@/lib/firebase/admin";
import { createEmptyTrafficMetrics, getTrafficMetrics } from "@/lib/server/traffic/metrics";

export const runtime = "nodejs";

export async function GET() {
  try {
    const metrics = await getTrafficMetrics();
    return NextResponse.json({ metrics });
  } catch (error: any) {
    console.error("Failed to load traffic metrics", error);
    if (isFirebaseAdminUnavailableError(error)) {
      return NextResponse.json(
        {
          metrics: createEmptyTrafficMetrics(),
          [isProduction ? "error" : "devWarning"]: isProduction
            ? "Firebase Admin er ikke tilgjengelig; viser tom trafikkoversikt."
            : "Firebase Admin er ikke konfigurert i dev; viser tom trafikkoversikt.",
        },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { error: error?.message || "Kunne ikke hente trafikkstatistikk" },
      { status: 500 },
    );
  }
}

