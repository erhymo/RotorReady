import { adminDb } from "@/lib/firebase/admin";
import { isProductId, type ProductId } from "@/lib/models/catalog";

import type { PriceTier, RotorModelId } from "./models";

export type ModelSubscriptionState = {
  subscriptionId?: string | null;
  status?: string;
  active?: boolean;
  priceId?: string | null;
  priceAmount?: number | null;
  priceCurrency?: string | null;
  priceTier?: PriceTier;
  subscriptionItemId?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  trialEndsAt?: string | null;
  cancelAtPeriodEnd?: boolean;
  endedAt?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  lastEventId?: string | null;
  latestInvoiceId?: string | null;
  invoiceStatus?: string | null;
  pastDueSince?: string | null;
  trialUsed?: boolean;
  pendingCheckoutSessionId?: string | null;
  pendingSince?: string | null;
  paymentFailures?: number;
};

export type SubscriptionSummary = {
  activeSubscriptions: number;
  activeTrials: number;
  pastDue: boolean;
  updatedAt: string;
};

export type UserSubscriptionDoc = {
  stripeCustomerId?: string;
  subscriptions?: Record<string, ModelSubscriptionState>;
  entitlements?: Record<string, boolean>;
  subscriptionSummary?: SubscriptionSummary;
  activeModelId?: string;
  trials?: Record<
    string,
    {
      active: boolean;
      productId: string;
      variantId?: string;
      startedAt: string;
      expiresAt: string;
    }
  >;
};

const USERS_COLLECTION = "users";

function userDoc(uid: string) {
  return adminDb.collection(USERS_COLLECTION).doc(uid);
}

function pruneUndefined<T extends Record<string, unknown>>(input: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}

export async function getUserSubscriptionDoc(uid: string): Promise<UserSubscriptionDoc | null> {
  const snap = await userDoc(uid).get();
  if (!snap.exists) return null;
  return snap.data() as UserSubscriptionDoc;
}

export async function setStripeCustomerId(uid: string, customerId: string) {
  await userDoc(uid).set({ stripeCustomerId: customerId, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function setActiveModelVariant(uid: string, variantId: string) {
  await userDoc(uid).set(
    {
      activeModelId: variantId,
      modelPreferences: { updatedAt: new Date().toISOString() },
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function getStripeCustomerId(uid: string): Promise<string | null> {
  const doc = await getUserSubscriptionDoc(uid);
  return doc?.stripeCustomerId || null;
}

export async function getModelSubscriptionState(
  uid: string,
  modelId: RotorModelId,
): Promise<ModelSubscriptionState | null> {
  const doc = await getUserSubscriptionDoc(uid);
  const state = doc?.subscriptions?.[modelId];
  return state || null;
}

export async function updateModelSubscription(
  uid: string,
  modelId: RotorModelId,
  updates: Partial<ModelSubscriptionState>,
) {
  const now = new Date();
  const nowIso = now.toISOString();

  const sanitizedUpdates = pruneUndefined(updates);

  await adminDb.runTransaction(async (tx) => {
    const ref = userDoc(uid);
    const snap = await tx.get(ref);
    const data = (snap.exists ? snap.data() : {}) as UserSubscriptionDoc;
    const existingSubs = { ...(data.subscriptions || {}) } as Record<string, ModelSubscriptionState>;
    const existing = existingSubs[modelId] || {};

    const next: ModelSubscriptionState = {
      ...existing,
      ...sanitizedUpdates,
      updatedAt: sanitizedUpdates.updatedAt ?? nowIso,
    };
    if (!existing.createdAt) {
      next.createdAt = next.createdAt ?? nowIso;
    }
    if (updates.subscriptionId === null) {
      next.subscriptionId = null;
    }
    if (updates.pendingCheckoutSessionId === null) {
      next.pendingCheckoutSessionId = null;
    }
    existingSubs[modelId] = next;

    const entitlements = { ...(data.entitlements || {}) } as Record<string, boolean>;
    entitlements[modelId] = computeEntitlementAccess(next, now);

    const summary = computeSubscriptionSummary(existingSubs, now);

    const payload: Record<string, unknown> = {
      subscriptions: existingSubs,
      entitlements,
      subscriptionSummary: summary,
      updatedAt: nowIso,
    };

    tx.set(ref, payload, { merge: true });
  });
}

export function isTrialActive(trial: { active?: boolean; expiresAt?: string } | undefined, now: Date = new Date()): boolean {
  if (!trial || !trial.active) return false;
  if (!trial.expiresAt) return false;
  const expires = new Date(trial.expiresAt);
  if (Number.isNaN(expires.getTime())) return false;
  return expires.getTime() > now.getTime();
}

export async function startTrialForProduct(
  uid: string,
  productId: ProductId,
  variantId: string,
  durationDays: number,
) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  await adminDb.runTransaction(async (tx) => {
    const ref = userDoc(uid);
    const snap = await tx.get(ref);
    const data = (snap.exists ? snap.data() : {}) as UserSubscriptionDoc;
    const trials = { ...(data.trials || {}) } as Required<UserSubscriptionDoc>["trials"];
    const key = productId;
    const existing = trials[key];
    const nowIso = now.toISOString();

    trials[key] = {
      active: true,
      productId,
      variantId,
      startedAt: nowIso,
      expiresAt: expiresAt.toISOString(),
    };

    const entitlements = { ...(data.entitlements || {}) } as Record<string, boolean>;
    entitlements[productId] = true;

    tx.set(ref, {
      trials,
      entitlements,
      updatedAt: nowIso,
    }, { merge: true });
  });
}

export function hasActiveTrial(doc: UserSubscriptionDoc | null | undefined, productId: ProductId): boolean {
  if (!doc?.trials) return false;
  const trial = doc.trials[productId];
  return isTrialActive(trial);
}

export async function markPendingCheckoutSession(
  uid: string,
  modelId: RotorModelId,
  sessionId: string,
) {
  await updateModelSubscription(uid, modelId, {
    pendingCheckoutSessionId: sessionId,
    pendingSince: new Date().toISOString(),
  });
}

export async function clearPendingCheckoutSession(
  uid: string,
  modelId: RotorModelId,
  sessionId: string,
) {
  await adminDb.runTransaction(async (tx) => {
    const ref = userDoc(uid);
    const snap = await tx.get(ref);
    if (!snap.exists) return;
    const data = snap.data() as UserSubscriptionDoc;
    const subs = { ...(data.subscriptions || {}) };
    const current = subs[modelId];
    if (!current) return;
    if (current.pendingCheckoutSessionId !== sessionId) return;
    const updated: ModelSubscriptionState = {
      ...current,
      pendingCheckoutSessionId: null,
      pendingSince: null,
      updatedAt: new Date().toISOString(),
    };
    subs[modelId] = updated;
    const entitlements = { ...(data.entitlements || {}) };
    entitlements[modelId] = computeEntitlementAccess(updated, new Date());
    const summary = computeSubscriptionSummary(subs, new Date());
    tx.set(ref, {
      subscriptions: subs,
      entitlements,
      subscriptionSummary: summary,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  });
}

export function computeEntitlementAccess(state: ModelSubscriptionState | undefined, now: Date): boolean {
  if (!state) return false;
  const status = state.status || "incomplete";
  if (status === "active" || status === "trialing") return true;
  if (status === "past_due") {
    if (!state.pastDueSince) return true;
    const grace = 2 * 24 * 60 * 60 * 1000; // 2 dager
    const since = new Date(state.pastDueSince);
    if (Number.isNaN(since.getTime())) return true;
    return since.getTime() + grace > now.getTime();
  }
  if (state.cancelAtPeriodEnd && state.currentPeriodEnd) {
    const end = new Date(state.currentPeriodEnd);
    if (!Number.isNaN(end.getTime())) {
      return end.getTime() > now.getTime();
    }
  }
  return false;
}

export function computeSubscriptionSummary(
  subscriptions: Record<string, ModelSubscriptionState>,
  now: Date,
): SubscriptionSummary {
  let activeSubscriptions = 0;
  let activeTrials = 0;
  let pastDue = false;

  for (const state of Object.values(subscriptions)) {
    if (!state) continue;
    const status = state.status || "incomplete";
    const hasAccess = computeEntitlementAccess(state, now);
    if (hasAccess) {
      activeSubscriptions += 1;
    }
    if (status === "trialing") {
      activeTrials += 1;
    }
    if (status === "past_due") {
      if (!state.pastDueSince) {
        pastDue = true;
      } else {
        const since = new Date(state.pastDueSince);
        if (Number.isNaN(since.getTime())) {
          pastDue = true;
        } else if (since.getTime() + 2 * 24 * 60 * 60 * 1000 > now.getTime()) {
          pastDue = true;
        }
      }
    }
  }

  return {
    activeSubscriptions,
    activeTrials,
    pastDue,
    updatedAt: now.toISOString(),
  };
}
