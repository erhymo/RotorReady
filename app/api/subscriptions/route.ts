import { NextResponse } from "next/server";

import { requireIdToken } from "@/lib/server/auth/verifyIdToken";
import {
  disableModelSubscription,
  enableModelSubscription,
  listSubscriptionOverview,
} from "@/lib/server/subscriptions/service";
import { isRotorModelId } from "@/lib/server/subscriptions/models";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const user = await requireIdToken(req).catch(() => null);
  if (!user) return unauthorized();

  try {
    const models = await listSubscriptionOverview(user.uid);
    return NextResponse.json({ models });
  } catch (error: any) {
    console.error("Failed to list subscriptions", error);
    return NextResponse.json({ error: error?.message || "Kunne ikke hente abonnement" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await requireIdToken(req).catch(() => null);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null) as {
    modelId?: string;
    action?: "enable" | "disable";
  } | null;

  if (!body?.modelId || !isRotorModelId(body.modelId)) {
    return NextResponse.json({ error: "Ugyldig modell" }, { status: 400 });
  }
  if (!body.action) {
    return NextResponse.json({ error: "Handling mangler" }, { status: 400 });
  }

  try {
    if (body.action === "enable") {
      const result = await enableModelSubscription({
        uid: user.uid,
        modelId: body.modelId,
        email: user.email,
        name: user.name,
      }, req);
      return NextResponse.json({ result });
    }

    if (body.action === "disable") {
      const result = await disableModelSubscription({ uid: user.uid, modelId: body.modelId });
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: "Ukjent handling" }, { status: 400 });
  } catch (error: any) {
    console.error("Abonnementshandling feilet", error);
    return NextResponse.json({ error: error?.message || "Failed to update subscription" }, { status: 500 });
  }
}
