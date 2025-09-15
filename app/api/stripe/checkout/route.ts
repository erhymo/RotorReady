import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST() {
  const secret = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_ID; // optional until configured
  const ret = process.env.STRIPE_PORTAL_RETURN_URL || "http://localhost:3000/account";

  if (!secret || !price) {
    return NextResponse.json({ error: "Stripe price not configured" }, { status: 400 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${ret}?checkout=success`,
      cancel_url: `${ret}?checkout=cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("Stripe checkout error:", e?.message || e);
    return NextResponse.json({ error: "Checkout create failed" }, { status: 500 });
  }
}

export async function GET() {
  const secret = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_ID;
  const ret = process.env.STRIPE_PORTAL_RETURN_URL || "http://localhost:3000/account";
  if (!secret || !price) {
    return NextResponse.json({ error: "Stripe price not configured" }, { status: 400 });
  }
  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${ret}?checkout=success`,
      cancel_url: `${ret}?checkout=cancel`,
    });
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (e) {
    return NextResponse.json({ error: "Checkout create failed" }, { status: 500 });
  }
}
