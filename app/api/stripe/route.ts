import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getEnv(name: string) {
  const v = process.env[name];
  if (!v || v.length === 0) throw new Error(`Missing env: ${name}`);
  return v;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  // Read the raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn("Stripe env not configured; skipping signature verification");
    return NextResponse.json({ ok: true, note: "No STRIPE env; ignored" });
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      getEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch (err: any) {
    console.error("Stripe signature verification failed:", err?.message || err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email || session.customer_email;
      if (email) {
        // Find user doc by email
        const usersRef = adminDb.collection("users");
        const snap = await usersRef.where("email", "==", email).limit(1).get();
        if (!snap.empty) {
          const docRef = snap.docs[0].ref;
          await docRef.set({ entitlements: { AW169: true } }, { merge: true });
        } else {
          // fallback: upsert separate index
          const idxRef = adminDb.collection("users_by_email").doc(email);
          await idxRef.set({ entitlements: { AW169: true }, updatedAt: new Date().toISOString() }, { merge: true });
        }
      }
    } else if (event.type.startsWith("customer.subscription.")) {
      // Handle subscription lifecycle if needed
      console.log("Stripe subscription event:", event.type);
    } else {
      console.log("Unhandled Stripe event:", event.type);
    }
  } catch (e) {
    console.error("Error handling event", e);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
