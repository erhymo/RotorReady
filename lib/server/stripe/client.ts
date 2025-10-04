import Stripe from "stripe";

import { serverEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (stripeClient) return stripeClient;

  const secret = serverEnv.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("Stripe secret key is not configured. Set STRIPE_SECRET_KEY in the environment.");
  }

  stripeClient = new Stripe(secret, {
    apiVersion: "2024-06-20",
  });

  return stripeClient;
}
