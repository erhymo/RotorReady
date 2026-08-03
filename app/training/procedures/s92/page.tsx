"use client";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";
import AbbreviationsLinkCard from "@/app/components/AbbreviationsLinkCard";
import { S92_PROCEDURES } from "@/lib/s92Procedures/data";

const GROUPS: { heading: string; slugs: string[] }[] = [
  {
    heading: "Normal procedures",
    slugs: [
      "exterior-check",
      "before-starting-and-starting-engines",
      "rotor-engagement-and-before-takeoff",
      "after-takeoff-and-landing-checks",
      "shutdown",
    ],
  },
  {
    heading: "Category A / B",
    slugs: [
      "cat-a-horizontal-takeoff",
      "cat-a-rolling-takeoff",
      "cat-a-approach-and-landing",
      "cat-a-vertical-takeoff-ground-level-helipad",
      "cat-a-ground-level-helipad-approach-and-landing",
      "cat-b-takeoff",
      "cat-b-landing",
    ],
  },
  {
    heading: "Elevated helideck (offshore)",
    slugs: ["elevated-helideck-vertical-takeoff", "elevated-helideck-approach-and-landing"],
  },
  {
    heading: "Engine failure",
    slugs: ["single-engine-failure-on-takeoff", "single-engine-landing", "single-engine-failure-elevated-helideck", "dual-engine-failure-autorotation", "emergency-engine-shutdown"],
  },
  {
    heading: "Fire, electrical & hydraulic",
    slugs: [
      "engine-and-apu-fire",
      "cabin-cockpit-fire-and-smoke",
      "electrical-fire-in-flight",
      "electrical-system-malfunctions",
      "hydraulic-system-malfunctions",
    ],
  },
];

export default function S92ProceduresListPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="S-92 Procedures" backHref="/" backLabel="Home" />
      <main className="mx-auto max-w-3xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">S-92 Procedures</h1>
        <p className="text-sm text-slate-600 dark:text-zinc-300">
          Browse S-92 Category A/B takeoff and landing profiles, elevated helideck operations, and engine-failure response procedures.
        </p>
        <AbbreviationsLinkCard href="/s92/abbreviations" />
        {GROUPS.map((group) => (
          <section key={group.heading} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200">{group.heading}</h2>
            <div className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4 space-y-3">
              {group.slugs.map((slug) => {
                const proc = S92_PROCEDURES.find((p) => p.slug === slug);
                if (!proc) return null;
                return (
                  <Link
                    key={slug}
                    href={`/s92/procedures/${slug}`}
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
