import { NextResponse } from "next/server";

import { requireIdToken } from "@/lib/server/auth/verifyIdToken";
import { getModelVariant } from "@/lib/models/catalog";
import { setActiveModelVariant } from "@/lib/server/subscriptions/firestore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await requireIdToken(req).catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as { variantId?: string } | null;
  if (!body?.variantId) {
    return NextResponse.json({ error: "variantId" }, { status: 400 });
  }

  const variant = getModelVariant(body.variantId);
  if (!variant) {
    return NextResponse.json({ error: "Ugyldig modell" }, { status: 400 });
  }

  if (variant.status === "coming_soon") {
    return NextResponse.json({ error: "Modellen er ikke tilgjengelig ennå" }, { status: 409 });
  }

  await setActiveModelVariant(user.uid, variant.id);

  return NextResponse.json({ ok: true, variant });
}
