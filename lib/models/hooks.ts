"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  getModelVariant,
  DEFAULT_MODEL_VARIANT_ID,
  listModelVariants,
  type ModelVariantDefinition,
} from "@/lib/models/catalog";
import { getStoredActiveModelVariantId, storeActiveModelVariantId } from "@/lib/models/storage";

type VariantSource = "default" | "local" | "user";

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
const SERVER_SNAPSHOT: VariantState = { variant: FALLBACK_VARIANT, source: "default" };

let state: VariantState = SERVER_SNAPSHOT;
let hydrated = false;
const listeners = new Set<() => void>();

// Reads localStorage the first time any component asks for a snapshot on the
// client. Safe to call from getSnapshot() (which useSyncExternalStore only
// calls post-hydration) — unlike calling it during render or in an effect,
// this is exactly what useSyncExternalStore's getServerSnapshot/getSnapshot
// split exists for: the server (and the client's hydration-matching pass)
// see SERVER_SNAPSHOT, then React swaps in the real client value with no
// manual effect and no hydration-mismatch warning.
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const stored = getStoredActiveModelVariantId();
  const def = getModelVariant(stored) || FALLBACK_VARIANT;
  const source: VariantSource = stored && stored !== DEFAULT_MODEL_VARIANT_ID ? "local" : "default";
  state = { variant: def, source };
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot(): VariantState {
  hydrate();
  return state;
}

function getServerSnapshot(): VariantState {
  return SERVER_SNAPSHOT;
}

function setActiveVariantGlobal(variantId: string) {
  const def = getModelVariant(variantId);
  if (!def) return;
  state = { variant: def, source: "local" };
  storeActiveModelVariantId(def.id);
  listeners.forEach((listener) => listener());
}

export function useActiveModelVariant(): ActiveModelState {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { variant, source } = snapshot;
  // Reference equality with SERVER_SNAPSHOT means hydrate() hasn't run yet on
  // the client — i.e. this is still the hydration-matching render, and the
  // real stored variant (from localStorage) hasn't been read. Once hydrate()
  // runs it always assigns a brand-new object, even if the resolved variant
  // happens to equal the default — so this stays a reliable one-way flag.
  const loading = snapshot === SERVER_SNAPSHOT;

  const setActiveVariant = useCallback(async (variantId: string) => {
    setActiveVariantGlobal(variantId);
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
