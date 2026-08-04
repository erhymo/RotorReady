"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";
import { useActiveModelVariant } from "@/lib/models/hooks";
import type { ProductId } from "@/lib/models/catalog";

function Bar(props: { href: string; title: string; description: string }) {
  return (
    <Link href={props.href} prefetch={false} className="group w-full rounded-xl border-l-4 border-slate-500 bg-slate-50/40 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800/60 dark:hover:bg-zinc-700/80 block">
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold text-slate-900 dark:text-zinc-100">{props.title}</div>
          <div className="text-sm text-slate-600 dark:text-zinc-300 mt-0.5">{props.description}</div>
        </div>
        <div className="text-slate-400 text-xl transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
      </div>
    </Link>
  );
}

const CALCULATIONS_ROUTE_SLUG: Record<ProductId, string> = {
  AW169: "aw169",
  AW189: "aw189",
  AW139: "aw139",
  H125: "h125",
  R44_II: "r44-ii",
  S92: "s92",
  H135_T3: "h135-t3",
  H145_D2: "h145-d2",
  H145_D3: "h145-d3",
};

const FUEL_LABEL: Partial<Record<ProductId, string>> = {
  R44_II: "Avgas 100LL",
};

export default function CalculationsHub() {
  const { variant } = useActiveModelVariant();
  const slug = CALCULATIONS_ROUTE_SLUG[variant.productId];
  const fuelLabel = FUEL_LABEL[variant.productId] ?? "Jet A-1";

  return (
    <>
    <AppTopBar title="Calculations" backHref="/" backLabel="Home" />
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calculations</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-1">Performance calculators for {variant.label}.</p>
      </header>

      <section className="space-y-3">
        <Bar
          href={`/calculations/${slug}/unit-conversions`}
          title="Conversions"
          description={`Convert speed, distance, altitude, weight and ${fuelLabel} fuel for quick planning.`}
        />
        <Bar
          href={`/calculations/${slug}/true-airspeed`}
          title="True Airspeed"
          description="Compute TAS from IAS, pressure altitude and outside air temperature."
        />
      </section>
    </div>
    </>
  );
}
