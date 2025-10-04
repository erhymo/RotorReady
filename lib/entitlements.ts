// Lightweight entitlement check with optional Firebase client.
// Returns false if Firebase is not configured or user not entitled.
import type { User } from "firebase/auth";

import { DEFAULT_MODEL_VARIANT_ID, getModelVariant } from "@/lib/models/catalog";
import { getStoredActiveModelVariantId } from "@/lib/models/storage";

function trialIsActive(trial: { active?: boolean; expiresAt?: string } | undefined): boolean {
  if (!trial || !trial.active) return false;
  if (!trial.expiresAt) return false;
  const expires = new Date(trial.expiresAt);
  if (Number.isNaN(expires.getTime())) return false;
  return expires.getTime() > Date.now();
}

export async function hasPaidAccess(): Promise<boolean> {
  try {
    // Dynamic import to avoid hard dependency during build
    const { auth, db }: any = await import("@/lib/firebase/client");
    if (!auth) return false;

    const { onAuthStateChanged }: any = await import("firebase/" + "auth");
    const user = await new Promise<User | null>((resolve) => {
      if (auth.currentUser) {
        resolve(auth.currentUser);
        return;
      }
      let unsubscribe: (() => void) | undefined;
      unsubscribe = onAuthStateChanged(auth, (u: any) => {
        if (unsubscribe) unsubscribe();
        resolve(u);
      });
    });

    if (!user) return false;

    const { getDoc, doc }: any = await import("firebase/" + "firestore");
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.data() || {};
    const entitlements = (data.entitlements || {}) as Record<string, unknown>;
    const trials = (data.trials || {}) as Record<string, { active?: boolean; expiresAt?: string }>;

    const storedVariantId = getStoredActiveModelVariantId();
    const activeVariantId = typeof data.activeModelId === "string" ? data.activeModelId : storedVariantId;
    const variant = getModelVariant(activeVariantId) || getModelVariant(DEFAULT_MODEL_VARIANT_ID)!;
    const productId = variant.productId;

    const entValue = entitlements[productId];
    let hasEntitlement = false;
    if (typeof entValue === "object" && entValue !== null) {
      hasEntitlement = Boolean((entValue as { active?: boolean }).active ?? false);
    } else {
      hasEntitlement = Boolean(entValue);
    }

    const trialActive = trialIsActive(trials[productId]);

    return hasEntitlement || trialActive;
  } catch {
    return false;
  }
}
