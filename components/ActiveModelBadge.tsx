"use client";

import Link from "next/link";

import { useActiveModelVariant } from "@/lib/models/hooks";

export function ActiveModelBadge() {
  const { variant, loading } = useActiveModelVariant();

  return (
    <Link
      href="/account"
      className="inline-flex items-center gap-2 rounded-full border border-emerald-400/80 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
    >
      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
      {loading ? "Laster modell…" : variant.label}
    </Link>
  );
}
