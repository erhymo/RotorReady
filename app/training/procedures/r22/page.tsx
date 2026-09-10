"use client";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";
import AbbreviationsLinkCard from "@/app/components/AbbreviationsLinkCard";
import { R22_PROCEDURES } from "@/lib/procedures/r22/data";

const GROUPS: { heading: string; slugs: string[] }[] = [
  {
    heading: "Normal procedures",
    slugs: [
      "daily-or-preflight-checks",
      "before-starting-engine",
      "starting-engine-and-run-up",
      "takeoff-and-cruise",
      "practice-autorotation",
      "descent-approach-and-landing",
      "shutdown-procedure",
    ],
  },
  {
    heading: "Emergency procedures",
    slugs: [
      "power-failure-and-autorotation",
      "emergency-water-landing",
      "loss-of-tail-rotor-thrust",
      "engine-and-electrical-fire",
      "tachometer-and-governor-failure",
      "warning-caution-lights-and-audio-alerts",
    ],
  },
];

export default function R22ProceduresListPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="R22 Procedures" backHref="/" backLabel="Home" />
      <main className="mx-auto max-w-3xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">R22 Procedures</h1>
        <p className="text-sm text-slate-600 dark:text-zinc-300">
          Browse R22 normal procedures — preflight, engine start and run-up, takeoff, autorotation training, landing and
          shutdown — plus power failure, water landing, tail rotor, fire and caution-light emergency procedures.
        </p>
        <AbbreviationsLinkCard href="/r22/abbreviations" />
        {GROUPS.map((group) => (
          <section key={group.heading} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200">{group.heading}</h2>
            <div className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4 space-y-3">
              {group.slugs.map((slug) => {
                const proc = R22_PROCEDURES.find((p) => p.slug === slug);
                if (!proc) return null;
                return (
                  <Link
                    key={slug}
                    href={`/r22/procedures/${slug}`}
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
