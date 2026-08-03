"use client";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";
import AbbreviationsLinkCard from "@/app/components/AbbreviationsLinkCard";
import { AW139_PROCEDURES } from "@/lib/aw139Procedures/data";

const GROUPS: { heading: string; slugs: string[]; extraLink?: { href: string; title: string; subtitle?: string } }[] = [
  {
    heading: "Normal procedures",
    slugs: [
      "exterior-check",
      "pre-start-checks",
      "engine-starting",
      "take-off",
      "approach-and-landing",
      "engine-and-rotor-shutdown",
    ],
  },
  {
    heading: "Engine failure",
    slugs: ["single-engine-failure", "single-engine-landing", "double-engine-failure-autorotation"],
  },
  {
    heading: "Fire",
    slugs: ["engine-fire", "cabin-and-baggage-fire", "electrical-fire-smoke"],
  },
  {
    heading: "Emergency shutdown & systems",
    slugs: ["engine-shutdown-emergency", "tail-rotor-failures", "double-dc-generator-failure", "hydraulic-pressure-low"],
  },
  {
    heading: "Category A operations (Supplement 12)",
    slugs: [
      "ground-and-elevated-heliport-vertical-take-off",
      "offshore-helideck-take-off",
      "clear-area-take-off",
      "heliport-landing",
      "offshore-helideck-landing",
      "clear-area-landing",
    ],
    extraLink: {
      href: "/aw139/procedures/cat-a-oei-contingencies",
      title: "CAT A OEI CONTINGENCY PROCEDURES",
      subtitle: "Engine-failure quick reference for each Cat A profile, from the AW139 QRH",
    },
  },
];

export default function AW139ProceduresListPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="AW139 Procedures" backHref="/" backLabel="Home" />
      <main className="mx-auto max-w-3xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">AW139 Procedures</h1>
        <p className="text-sm text-slate-600 dark:text-zinc-300">
          Browse AW139 normal procedures, engine-failure response, fire procedures, and other emergency/malfunction
          procedures.
        </p>
        <AbbreviationsLinkCard href="/aw139/abbreviations" />
        {GROUPS.map((group) => (
          <section key={group.heading} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200">{group.heading}</h2>
            <div className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4 space-y-3">
              {group.slugs.map((slug) => {
                const proc = AW139_PROCEDURES.find((p) => p.slug === slug);
                if (!proc) return null;
                return (
                  <Link
                    key={slug}
                    href={`/aw139/procedures/${slug}`}
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
              {group.extraLink && (
                <Link
                  href={group.extraLink.href}
                  className="group block rounded-lg border p-4 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-zinc-700 dark:border-zinc-700"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-slate-900 dark:text-zinc-100 font-medium">{group.extraLink.title}</div>
                      {group.extraLink.subtitle && (
                        <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{group.extraLink.subtitle}</div>
                      )}
                    </div>
                    <div className="text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
                  </div>
                </Link>
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
