"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
  const loading = false;

  useEffect(() => {
    const listener: VariantListener = (nextVariant, nextSource) => {
      setState({ variant: nextVariant, source: nextSource });
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setActiveVariant = useCallback(async (variantId: string) => {
    const def = getModelVariant(variantId);
    if (!def) return;
    broadcastVariantState(def, "local");
    storeActiveModelVariantId(def.id);
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
