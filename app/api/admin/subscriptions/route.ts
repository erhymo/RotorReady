import { NextResponse } from "next/server";

import { isProduction } from "@/lib/env";
import { isFirebaseAdminUnavailableError } from "@/lib/firebase/admin";
import { createEmptySubscriptionMetrics, getSubscriptionMetrics } from "@/lib/server/subscriptions/metrics";

export const runtime = "nodejs";

export async function GET() {
  try {
    const metrics = await getSubscriptionMetrics();
    return NextResponse.json({ metrics });
  } catch (error: any) {
    console.error("Failed to load subscription metrics", error);
    if (isFirebaseAdminUnavailableError(error)) {
      return NextResponse.json(
        {
          metrics: createEmptySubscriptionMetrics(),
          [isProduction ? "error" : "devWarning"]: isProduction
            ? "Firebase Admin er ikke tilgjengelig; viser tom abonnementsoversikt."
            : "Firebase Admin er ikke konfigurert i dev; viser tom abonnementsoversikt.",
        },
        { status: 200 },
      );
    }
    return NextResponse.json({ error: error?.message || "Kunne ikke hente metrics" }, { status: 500 });
  }
}
