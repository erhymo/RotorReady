"use client";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";

function ChoiceCard(props: { href: string; title: string; description: string; tone: "blue" | "emerald" }) {
  const tones: Record<string, string> = {
    blue: "border-blue-600 bg-blue-50/40 hover:bg-blue-50 dark:border-blue-400 dark:bg-blue-900/40 dark:hover:bg-blue-900/60",
    emerald: "border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60",
  };
  return (
    <Link
      href={props.href}
      prefetch={false}
      className={`group block w-full rounded-xl border-l-4 p-6 shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${tones[props.tone]}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-zinc-100">{props.title}</div>
          <div className="text-sm text-slate-600 dark:text-zinc-300 mt-1">{props.description}</div>
        </div>
        <div className="text-2xl text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
      </div>
    </Link>
  );
}

export default function IfrVfrPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="IFR - VFR" backHref="/" backLabel="Home" />
      <main className="mx-auto max-w-2xl p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">IFR - VFR Rules</h1>
          <p className="text-sm text-slate-600 dark:text-zinc-300 mt-1">
            A reference to keep the EASA instrument and visual flight rules fresh. Choose IFR or VFR to keep them from blurring together.
          </p>
        </div>
        <div className="space-y-4">
          <ChoiceCard href="/ifr-vfr/vfr" title="VFR" description="Visual flight rules: minima, cruising levels, right of way, signals." tone="emerald" />
          <ChoiceCard href="/ifr-vfr/ifr" title="IFR" description="Instrument flight rules: cruising levels, alternates, holding, ILS, lost comms." tone="blue" />
        </div>
      </main>
    </div>
  );
}
