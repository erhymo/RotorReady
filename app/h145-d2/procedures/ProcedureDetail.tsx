"use client";

import AppTopBar from "@/components/AppTopBar";
import type { ProcedureDefinition } from "@/lib/h145d2Procedures/data";

export default function ProcedureDetail({ procedure }: { procedure: ProcedureDefinition }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="Procedure" backHref="/training/procedures/h145-d2" backLabel="Procedures" />
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">{procedure.title}</h1>
          {procedure.subtitle && <div className="mt-1 text-sm text-slate-600 dark:text-zinc-300">{procedure.subtitle}</div>}
          {procedure.intro && <p className="mt-3 text-sm text-slate-700 dark:text-zinc-300">{procedure.intro}</p>}
        </header>

        {procedure.image && (
          <figure className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
            <img src={procedure.image.src} alt={procedure.image.alt} className="w-full h-auto rounded-lg" />
            {procedure.image.caption && (
              <figcaption className="mt-2 text-xs text-slate-500 dark:text-zinc-400 text-center">{procedure.image.caption}</figcaption>
            )}
          </figure>
        )}

        {procedure.warnings?.map((w, i) => (
          <div key={i} className="rounded-xl border-2 border-red-600 bg-red-50 dark:bg-red-900/30 dark:border-red-500 p-4 text-sm text-red-900 dark:text-red-100">
            <div className="font-bold text-center mb-1">WARNING</div>
            <p className="text-center">{w}</p>
          </div>
        ))}

        {procedure.cautions?.map((c, i) => (
          <div key={i} className="rounded-xl border-2 border-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-500 p-4 text-sm text-amber-900 dark:text-amber-100">
            <div className="font-bold text-center mb-1">CAUTION</div>
            <p className="text-center">{c}</p>
          </div>
        ))}

        {procedure.groups.map((g, gi) => (
          <section key={gi} className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
            {g.heading && <div className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200 mb-3">{g.heading}</div>}
            <div className="divide-y divide-slate-200/70 dark:divide-zinc-700/60">
              {g.steps.map((s, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 py-2">
                  <div className="text-sm text-slate-700 dark:text-zinc-300">
                    <span className="inline-block w-10 text-right mr-2 font-medium">{s.left}</span>
                  </div>
                  <div className="text-sm text-slate-800 dark:text-zinc-100 sm:mt-0 mt-1">— {s.right}</div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {procedure.notes && procedure.notes.length > 0 && (
          <section className="rounded-xl border-l-4 border-blue-500/60 bg-blue-50 dark:bg-zinc-800 dark:border-blue-400 p-4 space-y-2">
            <div className="font-semibold text-sm text-slate-900 dark:text-zinc-100">Note</div>
            {procedure.notes.map((n, i) => (
              <p key={i} className="text-sm text-slate-800 dark:text-zinc-200">{n}</p>
            ))}
          </section>
        )}

        <p className="text-xs text-slate-500 dark:text-zinc-400">Source: {procedure.reference}</p>
        <footer className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">
          H145 D2 training reference. For training use only. Always cross-check with the latest approved Flight Manual.
        </footer>
      </main>
    </div>
  );
}
