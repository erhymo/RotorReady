"use client";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";
import { VFR_TOPICS } from "@/lib/ifrVfr/data";

export default function VfrTopicListPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="VFR" backHref="/ifr-vfr" backLabel="IFR - VFR" />
      <main className="mx-auto max-w-3xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">VFR rules</h1>
        <p className="text-sm text-slate-600 dark:text-zinc-300">
          Visual flight rules to keep fresh, from EASA SERA (Standardised European Rules of the Air).
        </p>
        <section className="rounded-xl border-l-4 border-emerald-600 bg-white dark:bg-zinc-800 dark:border-emerald-400 p-4 shadow-sm">
          <div className="space-y-3">
            {VFR_TOPICS.map((t) => (
              <Link
                key={t.slug}
                href={`/ifr-vfr/vfr/${t.slug}`}
                className="group block rounded-lg border p-4 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-zinc-700 dark:border-zinc-700"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-slate-900 dark:text-zinc-100 font-medium">{t.title}</div>
                  <div className="text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
