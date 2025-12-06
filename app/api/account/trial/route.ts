import { NextResponse } from "next/server";

import { requireIdToken } from "@/lib/server/auth/verifyIdToken";
import { getModelVariant, isProductId } from "@/lib/models/catalog";
import {
  getUserSubscriptionDoc,
  hasActiveTrial,
  setActiveModelVariant,
  startTrialForProduct,
} from "@/lib/server/subscriptions/firestore";

const TRIAL_DAYS = 10;

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await requireIdToken(req).catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as {
    productId?: string;
    variantId?: string;
  } | null;

  if (!body?.productId || !isProductId(body.productId)) {
    return NextResponse.json({ error: "Ugyldig produkt" }, { status: 400 });
  }

  if (!body.variantId) {
    return NextResponse.json({ error: "variantId" }, { status: 400 });
  }

  const variant = getModelVariant(body.variantId);
  if (!variant || variant.productId !== body.productId) {
    return NextResponse.json({ error: "Ugyldig modell" }, { status: 400 });
  }

  if (variant.status === "coming_soon") {
    return NextResponse.json({ error: "The model is not available yet" }, { status: 409 });
  }

  const doc = await getUserSubscriptionDoc(user.uid);
  if (hasActiveTrial(doc, body.productId)) {
    return NextResponse.json({ error: "You already have an active trial for this model" }, { status: 409 });
  }

  await startTrialForProduct(user.uid, body.productId, variant.id, TRIAL_DAYS);
  await setActiveModelVariant(user.uid, variant.id);

  const updated = await getUserSubscriptionDoc(user.uid);
  const trial = updated?.trials?.[body.productId];

  return NextResponse.json({ ok: true, trial });
}
