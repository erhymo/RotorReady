"use client";

import { useMemo } from "react";
import { useActiveModelVariant } from "@/lib/models/hooks";

export default function ClientActiveModelBadge() {
  const { variant, loading } = useActiveModelVariant();

  const label = useMemo(() => {
    if (!variant) return "";
    // Vis "AS350 ..." for H125-produkter
    if (variant.productId === "H125") {
      return variant.label.replace("H125 / ", "AS350 ");
    }
    return variant.label;
  }, [variant]);

  if (loading) {
    return (
      <div className="ml-2 inline-flex h-7 min-w-[120px] items-center rounded-full border border-emerald-400 bg-emerald-50/80 px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm dark:border-emerald-400/70 dark:bg-emerald-200/50">
        <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" aria-hidden />
        <span className="ml-2 opacity-70">Laster…</span>
      </div>
    );
  }

  return (
    <div
      className="ml-2 inline-flex items-center rounded-full border border-emerald-500 bg-emerald-50 px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm dark:border-emerald-400 dark:bg-emerald-200/80 dark:text-slate-900"
      title={`Aktiv modell: ${label}`}
      aria-label={`Aktiv modell: ${label}`}
    >
      <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
      {label}
    </div>
  );
}

