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
  // Do NOT read localStorage during render: on the client's first render pass
  // (used to reconcile against the server-rendered HTML), `window` is already
  // defined, so hydrating here would make that first pass diverge from the
  // server output whenever the stored model isn't the default — causing a
  // hydration mismatch (and a flash of the wrong model) on every page for any
  // user who has picked a non-default aircraft. Hydrate in an effect instead,
  // which runs after hydration completes and is the React-safe way to bring
  // in client-only state.
  const [{ variant, source }, setState] = useState<VariantState>(() => ({
    variant: currentVariant,
    source: currentSource,
  }));
  // Only "loading" until the very first hydration from storage has happened;
  // guarded by the module-level flag so later mounts (client-side navigation
  // within the same session) don't re-flash a loading state.
  const [loading, setLoading] = useState(() => typeof window === "undefined" || !hydratedFromStorage);

  useEffect(() => {
    // hydrateFromStorage() is idempotent (a no-op past the first call), but
    // every instance of this hook — multiple components call it on the same
    // page — must still sync its OWN local state from the module-level
    // source of truth after mount. Gating the setState call behind "was I
    // the instance that actually did the read" left every instance except
    // the first stuck showing the default variant forever, since nothing
    // else updates it short of an explicit setActiveVariant() call.
    hydrateFromStorage();
    setState({ variant: currentVariant, source: currentSource });
    setLoading(false);
  }, []);

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
