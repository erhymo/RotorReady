"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { auth, db } from "@/lib/firebase/client";
import {
  getModelVariant,
  DEFAULT_MODEL_VARIANT_ID,
  listModelVariants,
  type ModelVariantDefinition,
} from "@/lib/models/catalog";
import { getStoredActiveModelVariantId, storeActiveModelVariantId } from "@/lib/models/storage";
import { doc, getDoc } from "firebase/firestore";

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

async function persistActiveVariantToServer(variantId: string) {
  try {
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
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
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
          // Prefer the users local selection; try to sync to server, but dont block UI
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

    return () => unsubscribe();
  }, []);

  const setActiveVariant = useCallback(async (variantId: string) => {
    const def = getModelVariant(variantId);
    if (!def) return;
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
