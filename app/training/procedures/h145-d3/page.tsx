"use client";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";
import { H145D3_PROCEDURES } from "@/lib/h145d3Procedures/data";

const GROUPS: { heading: string; slugs: string[] }[] = [
  {
    heading: "Engine emergencies",
    slugs: ["single-engine-failure", "double-engine-failure-autorotation", "single-engine-emergency-shutdown", "inflight-restart"],
  },
  {
    heading: "Fire",
    slugs: ["engine-fire", "cabin-fire", "electrical-fire"],
  },
  {
    heading: "Drive system",
    slugs: ["tail-rotor-drive-failure"],
  },
  {
    heading: "Fuel",
    slugs: ["low-fuel-emergency"],
  },
  {
    heading: "Slope operations (normal procedures)",
    slugs: ["slope-takeoff", "slope-landing"],
  },
];

export default function H145D3ProceduresListPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="H145 D3 Procedures" backHref="/" backLabel="Home" />
      <main className="mx-auto max-w-3xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">H145 D3 Procedures</h1>
        <p className="text-sm text-slate-600 dark:text-zinc-300">
          Browse H145 D3 engine emergency, fire, drive-system, fuel, and slope-operation procedures.
        </p>
        {GROUPS.map((group) => (
          <section key={group.heading} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200">{group.heading}</h2>
            <div className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4 space-y-3">
              {group.slugs.map((slug) => {
                const proc = H145D3_PROCEDURES.find((p) => p.slug === slug);
                if (!proc) return null;
                return (
                  <Link
                    key={slug}
                    href={`/h145-d3/procedures/${slug}`}
                    className="group block rounded-lg border p-4 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-zinc-700 dark:border-zinc-700"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-slate-900 dark:text-zinc-100 font-medium">{proc.title}</div>
                        {proc.subtitle && <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{proc.subtitle}</div>}
                      </div>
                      <div className="text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
