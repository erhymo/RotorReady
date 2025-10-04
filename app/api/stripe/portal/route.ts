import { NextResponse } from "next/server";

import { serverEnv } from "@/lib/env";
import { requireIdToken } from "@/lib/server/auth/verifyIdToken";
import { getStripeClient } from "@/lib/server/stripe/client";
import { ensureStripeCustomer } from "@/lib/server/subscriptions/service";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: Request) {
  const user = await requireIdToken(req).catch(() => null);
  if (!user) return unauthorized();

  try {
    const stripe = getStripeClient();
    const customerId = await ensureStripeCustomer({ uid: user.uid, email: user.email, name: user.name });
    const returnUrl = serverEnv.STRIPE_PORTAL_RETURN_URL || `${new URL(req.url).origin}/account`;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Failed to create billing portal session", error);
    return NextResponse.json({ error: error?.message || "Kunne ikke åpne Stripe portal" }, { status: 500 });
  }
}
