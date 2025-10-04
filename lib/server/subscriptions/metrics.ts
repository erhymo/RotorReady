import { adminDb } from "@/lib/firebase/admin";

import type { ModelSubscriptionState } from "./firestore";
import { computeEntitlementAccess } from "./firestore";
import { listRotorModels, type RotorModelId } from "./models";

export type SubscriptionMetrics = {
  totalUsers: number;
  totals: {
    active: number;
    trials: number;
    pastDue: number;
  };
  perModel: Record<RotorModelId, {
    active: number;
    trials: number;
    pastDue: number;
  }>;
};

function emptyCounters() {
  return {
    active: 0,
    trials: 0,
    pastDue: 0,
  };
}

export async function getSubscriptionMetrics(): Promise<SubscriptionMetrics> {
  const perModel = Object.fromEntries(listRotorModels().map((model) => [model.id, emptyCounters()])) as SubscriptionMetrics["perModel"];
  const totals = emptyCounters();
  let totalUsers = 0;

  const snapshot = await adminDb.collection("users").select("subscriptions").get();
  snapshot.forEach((doc) => {
    totalUsers += 1;
    const subscriptions = (doc.data()?.subscriptions || {}) as Record<string, ModelSubscriptionState>;
    const now = new Date();
    for (const [modelId, state] of Object.entries(subscriptions)) {
      if (!perModel[modelId as RotorModelId]) continue;
      const access = computeEntitlementAccess(state, now);
      if (access) {
        perModel[modelId as RotorModelId].active += 1;
        totals.active += 1;
      }
      if (state?.status === "trialing") {
        perModel[modelId as RotorModelId].trials += 1;
        totals.trials += 1;
      }
      if (state?.status === "past_due") {
        perModel[modelId as RotorModelId].pastDue += 1;
        totals.pastDue += 1;
      }
    }
  });

  return {
    totalUsers,
    totals,
    perModel,
  };
}
