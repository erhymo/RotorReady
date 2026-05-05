"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useActiveModelVariant } from "@/lib/models/hooks";

export default function ClientActiveModelBadge() {
  const { variant, loading } = useActiveModelVariant();

  const fullLabel = useMemo(() => {
    if (!variant) return "";
    if (variant.productId === "H125") {
      // Desktop: behold menneskevennlig label, men fjern "H125 / " prefix hvis tilstede
      return variant.label.replace(/^H125\s*\/\s*/, "");
    }
    return variant.label;
  }, [variant]);

  const shortLabel = useMemo(() => {
    if (!variant) return "";
    if (variant.productId === "H125") {
      // Mobil: kompakt label (AS350 B3 (2B1) -> AS350B3)
      const human = variant.label.replace(/^H125\s*\/\s*/, "");
      const noParen = human.replace(/\s*\([^)]*\)\s*/g, "");
      return noParen.replace(/AS350\s+([A-Za-z0-9]+)/, "AS350$1");
    }
    return fullLabel;
  }, [variant, fullLabel]);

  if (loading) {
    return (
      <div className="ml-2 inline-flex h-7 min-w-[120px] items-center rounded-full border border-emerald-400 bg-emerald-50/80 px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm dark:border-emerald-400/70 dark:bg-emerald-200/50">
        <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" aria-hidden />
        <span className="ml-2 opacity-70">Loading…</span>
      </div>
    );
  }

  return (
	  <Link
	    href="/account"
	    className="ml-2 inline-flex min-h-11 items-center rounded-full border border-emerald-500 bg-emerald-50 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:border-emerald-400 dark:bg-emerald-200/80 dark:text-slate-900"
	    title={`Active model: ${fullLabel} — open Settings`}
	    aria-label={`Active model: ${fullLabel}. Open Settings`}
	  >
      <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
      <span className="md:hidden">{shortLabel}</span>
      <span className="hidden md:inline">{fullLabel}</span>
	  </Link>
  );
}

