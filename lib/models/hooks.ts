"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";

import {
  getModelVariant,
  DEFAULT_MODEL_VARIANT_ID,
  listModelVariants,
  type ModelVariantDefinition,
} from "@/lib/models/catalog";
import { getStoredActiveModelVariantId, storeActiveModelVariantId } from "@/lib/models/storage";

type VariantSource = "default" | "local" | "user";
type VariantListener = (variant: ModelVariantDefinition, source: VariantSource) => void;

type VariantState = {
  variant: ModelVariantDefinition;
  source: VariantSource;
};

export type ActiveModelState = {
  variant: ModelVariantDefinition;
  loading: boolean;
  setActiveVariant: (variantId: string) => Promise<void>;
  source: VariantSource;
};

const FALLBACK_VARIANT = getModelVariant(DEFAULT_MODEL_VARIANT_ID)!;

let currentVariant: ModelVariantDefinition = FALLBACK_VARIANT;
let currentSource: VariantSource = "default";
let hydratedFromStorage = false;
const listeners = new Set<VariantListener>();
let firebaseClientPromise: Promise<typeof import("@/lib/firebase/client")> | null = null;
let firestoreLitePromise: Promise<typeof import("firebase/firestore/lite")> | null = null;

function loadFirebaseClient() {
  if (!firebaseClientPromise) {
    firebaseClientPromise = import("@/lib/firebase/client");
  }
  return firebaseClientPromise;
}

function loadFirestoreLite() {
  if (!firestoreLitePromise) {
    firestoreLitePromise = import("firebase/firestore/lite");
  }
  return firestoreLitePromise;
}

async function persistActiveVariantToServer(variantId: string) {
  try {
    const { auth } = await loadFirebaseClient();
    const token = await auth?.currentUser?.getIdToken().catch(() => null);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch("/api/account/model", {
      method: "POST",
      headers,
      body: JSON.stringify({ variantId }),
    });
    if (!res.ok) {
      console.warn("Unable to update active model on server", await res.text());
    }
  } catch (error) {
    console.warn("Error updating active model", error);
  }
}

function hydrateFromStorage() {
  if (hydratedFromStorage) return;
  if (typeof window === "undefined") return;
  hydratedFromStorage = true;
  const stored = getStoredActiveModelVariantId();
  const def = getModelVariant(stored) || FALLBACK_VARIANT;
  currentVariant = def;
  currentSource = stored && stored !== DEFAULT_MODEL_VARIANT_ID ? "local" : "default";
}

function broadcastVariantState(variant: ModelVariantDefinition, source: VariantSource) {
  currentVariant = variant;
  currentSource = source;
  listeners.forEach((listener) => listener(variant, source));
}

export function useActiveModelVariant(): ActiveModelState {
  if (typeof window !== "undefined") {
    hydrateFromStorage();
  }

  const [{ variant, source }, setState] = useState<VariantState>(() => ({
    variant: currentVariant,
    source: currentSource,
  }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const listener: VariantListener = (nextVariant, nextSource) => {
      setState({ variant: nextVariant, source: nextSource });
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      try {
        const [{ auth, db }, { doc, getDoc }] = await Promise.all([
          loadFirebaseClient(),
          loadFirestoreLite(),
        ]);

        if (cancelled || !auth || !db) {
          if (!cancelled) setLoading(false);
          return;
        }

        unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
          if (!user) {
            setLoading(false);
            return;
          }
          try {
            const snap = await getDoc(doc(db, "users", user.uid));
            const serverVariantId = snap.data()?.activeModelId as string | undefined;
            const localVariantId = getStoredActiveModelVariantId();
            const localDef = getModelVariant(localVariantId);
            if (localDef && serverVariantId && serverVariantId !== localDef.id) {
              // Prefer the user's local selection; try to sync to server, but don't block UI
              storeActiveModelVariantId(localDef.id);
              broadcastVariantState(localDef, "user");
              persistActiveVariantToServer(localDef.id).catch(() => {});
            } else if (serverVariantId) {
              const def = getModelVariant(serverVariantId);
              if (def) {
                storeActiveModelVariantId(def.id);
                broadcastVariantState(def, "user");
              }
            }
          } catch (error) {
            console.warn("Unable to fetch active model for user", error);
          } finally {
            setLoading(false);
          }
        });
      } catch (error) {
        console.warn("Unable to initialize active model sync", error);
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      try {
        unsubscribe?.();
      } catch {}
    };
  }, []);

  const setActiveVariant = useCallback(async (variantId: string) => {
    const def = getModelVariant(variantId);
    if (!def) return;
    const { auth } = await loadFirebaseClient().catch(() => ({ auth: undefined }));
    const user = auth?.currentUser;
    const nextSource: VariantSource = user ? "user" : "local";
    broadcastVariantState(def, nextSource);
    storeActiveModelVariantId(def.id);
    if (user) {
      await persistActiveVariantToServer(def.id);
    }
  }, []);

  return useMemo(
    () => ({
      variant,
      loading,
      source,
      setActiveVariant,
    }),
    [variant, loading, source, setActiveVariant],
  );
}

export function useModelCatalog() {
  return listModelVariants();
}
