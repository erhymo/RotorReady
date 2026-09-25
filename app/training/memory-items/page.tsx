"use client";

import { useEffect, useState } from "react";

import AppTopBar from "@/components/AppTopBar";
import { fetchContentJson } from "@/lib/contentUrl";
import { useActiveModelVariant } from "@/lib/models/hooks";

// Every immediate-action (memory) item for the selected aircraft on one page,
// read from public/model-data/<variant>/training/memory-items.json. The list is
// content, so a correction or a new model reaches installed apps on push.

type Step = { n: string; item: string; action?: string; sub?: boolean; condition?: boolean; note?: boolean };
type Drill = { ref: string; title: string; steps: Step[] };
type MemoryDoc = {
  source?: string;
  intro?: string;
  principles?: { title: string; items: string[] };
  groups: { title: string; drills: Drill[] }[];
};

function StepRow({ step }: { step: Step }) {
  if (step.condition) {
    return (
      <li className="flex gap-2 pt-1 font-semibold text-slate-900 dark:text-zinc-100">
        <span className="w-6 shrink-0 text-right">{step.n}.</span>
        <span>{step.item}</span>
      </li>
    );
  }
  if (step.note) {
    return <li className="pl-8 text-sm italic text-slate-600 dark:text-zinc-300">{step.item}</li>;
  }
  return (
    <li className={`flex gap-2 ${step.sub ? "pl-6" : ""}`}>
      <span className="w-6 shrink-0 text-right font-semibold text-slate-900 dark:text-zinc-100">{step.n}.</span>
      <span className="text-slate-800 dark:text-zinc-100">
        {step.item}
        {step.action && (
          <>
            {" — "}
            <span className="font-semibold">{step.action}</span>
          </>
        )}
      </span>
    </li>
  );
}

export default function MemoryItemsPage() {
  const { variant, loading: variantLoading } = useActiveModelVariant();
  const [doc, setDoc] = useState<MemoryDoc | null | undefined>(undefined);

  useEffect(() => {
    if (variantLoading) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setDoc(undefined);
    });
    fetchContentJson<MemoryDoc>(`/model-data/${variant.id}/training/memory-items.json`)
      .then((d) => {
        if (!cancelled) setDoc(d);
      })
      .catch(() => {
        if (!cancelled) setDoc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [variant.id, variantLoading]);

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <AppTopBar backHref="/training/lights" backLabel="Back" title="Memory items" />

      <header className="rounded-xl border bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">{variant.label} — Memory items</h1>
        {doc?.intro && <p className="mt-2 text-sm text-slate-700 dark:text-zinc-300">{doc.intro}</p>}
        {doc?.source && <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">Source: {doc.source}</p>}
      </header>

      {doc === undefined && <p className="text-sm text-slate-600 dark:text-zinc-300">Loading…</p>}
      {doc === null && (
        <p className="text-sm text-slate-600 dark:text-zinc-300">No memory item list is available for this aircraft yet.</p>
      )}

      {doc?.principles && (
        <section className="rounded-xl border-2 border-slate-900 bg-white p-4 dark:border-zinc-300 dark:bg-zinc-800">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-zinc-100">{doc.principles.title}</h2>
          <ol className="mt-2 space-y-1">
            {doc.principles.items.map((p, i) => (
              <li key={p} className="flex gap-2 text-slate-800 dark:text-zinc-100">
                <span className="w-6 shrink-0 text-right font-semibold">{i + 1}.</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {doc?.groups.map((group) => (
        <section key={group.title} className="space-y-3">
          <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200">{group.title}</h2>
          {group.drills.map((drill) => (
            <article
              key={`${drill.ref}-${drill.title}`}
              className="rounded-xl border-l-4 border-red-600 bg-white p-4 shadow-sm dark:border-red-500 dark:bg-zinc-800"
            >
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100">
                <span className="mr-2 text-slate-500 dark:text-zinc-400">{drill.ref}</span>
                {drill.title}
              </h3>
              <ol className="mt-2 space-y-1.5 text-[15px]">
                {drill.steps.map((step, i) => (
                  <StepRow key={i} step={step} />
                ))}
              </ol>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
