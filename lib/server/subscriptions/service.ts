import type Stripe from "stripe";

import { publicEnv } from "@/lib/env";

import { getStripeClient } from "@/lib/server/stripe/client";

import {
  clearPendingCheckoutSession,
  computeEntitlementAccess,
  getModelSubscriptionState,
  getStripeCustomerId,
  getUserSubscriptionDoc,
  markPendingCheckoutSession,
  setStripeCustomerId,
  updateModelSubscription,
  type ModelSubscriptionState,
} from "./firestore";
import {
  getPriceEnvKey,
  getPriceIdFromEnv,
  getRotorModelConfig,
  isRotorModelId,
  listRotorModels,
  type PriceTier,
  type RotorModelId,
} from "./models";

export type EnsureCustomerParams = {
  uid: string;
  email?: string | null;
  name?: string | null;
};

export type EnableModelResult =
  | {
      type: "checkout";
      url: string;
      sessionId: string;
    }
  | {
      type: "noop";
      reason: string;
    };

export type DisableModelResult = {
  subscriptionId?: string;
  cancelAtPeriodEnd?: boolean;
};

export type SubscriptionOverview = {
  modelId: RotorModelId;
  label: string;
  description: string;
  state: ModelSubscriptionState | null;
  hasAccess: boolean;
  trialDays: number;
};

function toIsoFromUnix(seconds?: number | null): string | null {
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

function getCurrentPeriodStart(subscription: Stripe.Subscription | Stripe.Response<Stripe.Subscription>): string | null {
  return toIsoFromUnix(subscription.items.data[0]?.current_period_start ?? null);
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription | Stripe.Response<Stripe.Subscription>): string | null {
  return toIsoFromUnix(subscription.items.data[0]?.current_period_end ?? null);
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const subscription = invoice.parent?.subscription_details?.subscription;
  if (!subscription) return null;
  return typeof subscription === "string" ? subscription : subscription.id;
}

export async function ensureStripeCustomer(params: EnsureCustomerParams): Promise<string> {
  const existing = await getStripeCustomerId(params.uid);
  if (existing) return existing;

  const stripe = getStripeClient();
  const customer = await stripe.customers.create({
    email: params.email || undefined,
    name: params.name || undefined,
    metadata: {
      uid: params.uid,
    },
  });
  await setStripeCustomerId(params.uid, customer.id);
  return customer.id;
}

function resolveBaseUrl(req?: Request): string {
  if (req) {
    const url = new URL(req.url);
    return `${url.protocol}//${url.host}`;
  }
  if (publicEnv.NEXT_PUBLIC_BASE_URL) return publicEnv.NEXT_PUBLIC_BASE_URL;
  return "http://localhost:3000";
}

function determinePriceTier(allStates: Record<string, ModelSubscriptionState | undefined>, modelId: RotorModelId): PriceTier {
  const now = new Date();
  const activeOtherModels = Object.entries(allStates)
    .filter(([id]) => id !== modelId)
    .filter(([, state]) => (state ? computeEntitlementAccess(state, now) : false));
  return activeOtherModels.length === 0 ? "standard" : "discount";
}

function assertPriceConfigured(modelId: RotorModelId, tier: PriceTier) {
  const envKey = getPriceEnvKey(modelId, tier);
  if (!envKey) {
    throw new Error(`Ingen Stripe-pris konfigurert for ${modelId} (${tier}). Sett ${`STRIPE_PRICE_${modelId}_${tier.toUpperCase()}`}.`);
  }
  const priceId = getPriceIdFromEnv(modelId, tier);
  if (!priceId) {
    throw new Error(`Miljøvariabel ${envKey} mangler. Sett Stripe price ID for ${modelId} (${tier}).`);
  }
}

export async function enableModelSubscription(
  {
    uid,
    modelId,
    email,
    name,
  }: {
    uid: string;
    modelId: RotorModelId;
    email?: string | null;
    name?: string | null;
  },
  req?: Request,
): Promise<EnableModelResult> {
  const stripe = getStripeClient();
  const doc = (await getUserSubscriptionDoc(uid)) || {};
  const currentState = (doc.subscriptions || {})[modelId] || null;

  if (currentState && computeEntitlementAccess(currentState, new Date())) {
    if (currentState.cancelAtPeriodEnd && currentState.subscriptionId) {
      const subscription = await stripe.subscriptions.update(currentState.subscriptionId, {
        cancel_at_period_end: false,
      });
      await updateModelSubscription(uid, modelId, {
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
        currentPeriodEnd: getCurrentPeriodEnd(subscription) ?? currentState.currentPeriodEnd ?? null,
        subscriptionId: subscription.id,
      });
      return { type: "noop", reason: "Resumed" };
    }
    if (!(currentState.cancelAtPeriodEnd ?? false)) {
      return { type: "noop", reason: "Allerede aktiv" };
    }
  }

  const customerId = await ensureStripeCustomer({ uid, email, name });

  const allStates = doc.subscriptions || {};
  const tier = determinePriceTier(allStates, modelId);
  assertPriceConfigured(modelId, tier);
  const priceId = getPriceIdFromEnv(modelId, tier);

  const config = getRotorModelConfig(modelId);
  const trialEligible = !(currentState?.trialUsed ?? false);

  const baseUrl = resolveBaseUrl(req);
  const successUrl = `${baseUrl}/account?model=${modelId}&status=success`;
  const cancelUrl = `${baseUrl}/account?model=${modelId}&status=cancel`;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    automatic_tax: { enabled: true },
    allow_promotion_codes: false,
    subscription_data: {
      metadata: {
        uid,
        modelId,
        priceTier: tier,
        priceId,
      },
      trial_period_days: trialEligible ? config.trialDays : undefined,
      description: `${config.label} abonnement`,
    },
    metadata: {
      uid,
      modelId,
      priceTier: tier,
      priceId,
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  if (!session.url) {
    throw new Error("Stripe Checkout-session mangler URL");
  }

  await markPendingCheckoutSession(uid, modelId, session.id);
  await updateModelSubscription(uid, modelId, {
    status: "pending",
    priceId,
    priceTier: tier,
    pendingCheckoutSessionId: session.id,
    trialUsed: trialEligible ? false : currentState?.trialUsed ?? true,
  });

  return { type: "checkout", url: session.url, sessionId: session.id };
}

export async function disableModelSubscription({
  uid,
  modelId,
}: {
  uid: string;
  modelId: RotorModelId;
}): Promise<DisableModelResult> {
  const state = await getModelSubscriptionState(uid, modelId);
  if (!state?.subscriptionId) {
    await updateModelSubscription(uid, modelId, {
      status: "inactive",
      cancelAtPeriodEnd: false,
      active: false,
    });
    return {};
  }

  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.update(state.subscriptionId, {
    cancel_at_period_end: true,
  });

  await updateModelSubscription(uid, modelId, {
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
    currentPeriodEnd: getCurrentPeriodEnd(subscription) ?? state.currentPeriodEnd ?? null,
    subscriptionId: subscription.id,
  });

  return { subscriptionId: subscription.id, cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false };
}

export async function listSubscriptionOverview(uid: string): Promise<SubscriptionOverview[]> {
  const doc = (await getUserSubscriptionDoc(uid)) || {};
  const now = new Date();
  return listRotorModels().map((model) => {
    const state = doc.subscriptions?.[model.id] ?? null;
    const hasAccess = computeEntitlementAccess(state || undefined, now);
    return {
      modelId: model.id,
      label: model.label,
      description: model.description,
      state,
      hasAccess,
      trialDays: model.trialDays,
    } satisfies SubscriptionOverview;
  });
}

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const uid = session.metadata?.uid;
  const modelId = session.metadata?.modelId;
  if (!uid || !isRotorModelId(modelId)) {
    console.warn("Webhook: mangler uid eller modelId i metadata", session.id);
    return;
  }
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  const tier = (session.metadata?.priceTier as PriceTier | undefined) ?? "standard";
  const priceId = (session.metadata?.priceId as string | undefined) || null;

  await clearPendingCheckoutSession(uid, modelId, session.id);

  await updateModelSubscription(uid, modelId, {
    subscriptionId: subscriptionId || null,
    status: "processing",
    priceTier: tier,
    priceId: priceId,
  });

  if (typeof session.customer === "string") {
    await setStripeCustomerId(uid, session.customer);
  }
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const uid = subscription.metadata?.uid;
  const modelId = subscription.metadata?.modelId;
  if (!uid || !isRotorModelId(modelId)) return;

  const tier = (subscription.metadata?.priceTier as PriceTier | undefined) ?? undefined;
  const priceItem = subscription.items.data[0]?.price;

  const state: ModelSubscriptionState = {
    subscriptionId: subscription.id,
    status: subscription.status,
    priceId: priceItem?.id ?? undefined,
    priceAmount: priceItem?.unit_amount ?? undefined,
    priceCurrency: priceItem?.currency ?? undefined,
    priceTier: tier,
    subscriptionItemId: subscription.items.data[0]?.id ?? undefined,
    currentPeriodStart: getCurrentPeriodStart(subscription) ?? undefined,
    currentPeriodEnd: getCurrentPeriodEnd(subscription) ?? undefined,
    trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
    latestInvoiceId: typeof subscription.latest_invoice === "string" ? subscription.latest_invoice : subscription.latest_invoice?.id,
    invoiceStatus: typeof subscription.latest_invoice === "string"
      ? undefined
      : subscription.latest_invoice?.status,
    trialUsed: subscription.trial_end ? true : undefined,
    pastDueSince: subscription.status === "past_due" ? new Date().toISOString() : null,
  };

  await updateModelSubscription(uid, modelId, state);

  await rebalancePriceTiers(uid);
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const uid = subscription.metadata?.uid;
  const modelId = subscription.metadata?.modelId;
  if (!uid || !isRotorModelId(modelId)) return;

  await updateModelSubscription(uid, modelId, {
    status: "canceled",
    cancelAtPeriodEnd: false,
    active: false,
    subscriptionId: subscription.id,
    endedAt: new Date().toISOString(),
  });

  await rebalancePriceTiers(uid);
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;
  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const uid = subscription.metadata?.uid;
  const modelId = subscription.metadata?.modelId as RotorModelId | undefined;

  if (!uid || !modelId || !isRotorModelId(modelId)) return;

  await updateModelSubscription(uid, modelId, {
    status: "past_due",
    pastDueSince: new Date(invoice.created * 1000).toISOString(),
    latestInvoiceId: invoice.id,
    invoiceStatus: invoice.status,
    paymentFailures: (invoice.attempt_count ?? 0) + 1,
  });
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;
  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const uid = subscription.metadata?.uid;
  const modelId = subscription.metadata?.modelId as RotorModelId | undefined;
  if (!uid || !modelId || !isRotorModelId(modelId)) return;

  await updateModelSubscription(uid, modelId, {
    status: "active",
    pastDueSince: null,
    latestInvoiceId: invoice.id,
    invoiceStatus: invoice.status,
  });
}

async function ensurePriceTierForModel(
  uid: string,
  modelId: RotorModelId,
  desiredTier: PriceTier,
  state: ModelSubscriptionState | undefined,
) {
  if (!state?.subscriptionId) return;
  const desiredPriceId = getPriceIdFromEnv(modelId, desiredTier);
  if (!desiredPriceId) return;
  if (state.priceId === desiredPriceId && state.priceTier === desiredTier) return;

  const stripe = getStripeClient();
  let subscriptionItemId = state.subscriptionItemId || undefined;
  if (!subscriptionItemId) {
    const subscription = await stripe.subscriptions.retrieve(state.subscriptionId);
    subscriptionItemId = subscription.items.data[0]?.id;
    if (!subscriptionItemId) return;
  }

  const updated = await stripe.subscriptions.update(state.subscriptionId, {
    items: [
      {
        id: subscriptionItemId,
        price: desiredPriceId,
      },
    ],
    proration_behavior: "none",
  });

  const price = updated.items.data[0]?.price;
  await updateModelSubscription(uid, modelId, {
    priceTier: desiredTier,
    priceId: desiredPriceId,
    priceAmount: price?.unit_amount ?? null,
    priceCurrency: price?.currency ?? null,
    subscriptionItemId: updated.items.data[0]?.id ?? subscriptionItemId,
  });
}

async function rebalancePriceTiers(uid: string) {
  const doc = await getUserSubscriptionDoc(uid);
  const subscriptions = doc?.subscriptions;
  if (!subscriptions) return;
  const now = new Date();
  const entries = Object.entries(subscriptions)
    .filter((entry): entry is [RotorModelId, ModelSubscriptionState] => isRotorModelId(entry[0]) && Boolean(entry[1]))
    .filter(([, state]) => computeEntitlementAccess(state, now));

  if (entries.length <= 1) {
    if (entries.length === 1) {
      const [modelId, state] = entries[0];
      await ensurePriceTierForModel(uid, modelId, "standard", state);
    }
    return;
  }

  entries.sort((a, b) => {
    const left = new Date(
      a[1]?.createdAt || a[1]?.currentPeriodStart || a[1]?.updatedAt || new Date().toISOString(),
    ).getTime();
    const right = new Date(
      b[1]?.createdAt || b[1]?.currentPeriodStart || b[1]?.updatedAt || new Date().toISOString(),
    ).getTime();
    return left - right;
  });

  const [primaryModelId, primaryState] = entries[0];
  await ensurePriceTierForModel(uid, primaryModelId, "standard", primaryState);

  for (const [modelId, state] of entries.slice(1)) {
    await ensurePriceTierForModel(uid, modelId, "discount", state);
  }
}
