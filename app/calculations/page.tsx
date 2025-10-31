"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";


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
export default function CalculationsHub() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header>
        <div className="mb-2">
          <button type="button" onClick={() => router.back()} className="text-sm text-slate-600 dark:text-zinc-300 hover:underline">← Back</button>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calculations</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-1">Performance calculators based on aircraft RFM charts.</p>
      </header>

      <section className="space-y-3">
        <Bar
          href="/calculations/aw169/oge-oei-headwind"
          title="HOVER CEILING OUT OF GROUND EFFECT UNFACTORED HEADWIND OEI 2.5 min"
          description="AW169 (ISA+35). Find max gross weight and available weight from PA and headwind."
        />
      </section>
    </div>
  );
}

