"use client";

import { useEffect, useState } from "react";

import AppTopBar from "@/components/AppTopBar";
import { fetchContentJson } from "@/lib/contentUrl";

type QuickReferenceItem = { label: string; lines: string[] };
type QuickReferenceGroup = { title: string; items: QuickReferenceItem[] };
type QuickReferenceDoc = { title: string; intro: string; groups: QuickReferenceGroup[] };
type Abbreviation = { abbr: string; meaning: string };

function GroupCard({ title, items }: QuickReferenceGroup) {
  return (
    <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 space-y-3">
      <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">{title}</h2>
      <div className="space-y-2 text-sm text-slate-800 dark:text-zinc-100">
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`} className="space-y-0.5">
            <div className="font-medium">{item.label}</div>
            <ul className="list-disc pl-5 space-y-0.5">
              {item.lines.map((line, j) => (
                <li key={`${line}-${j}`}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Quick reference for one variant. The numbers used to be a hardcoded object
 * inside each model's page and the abbreviations a compiled-in array, so
 * correcting a limitation needed a store release before an installed native app
 * would show it. Both now come from public/quick-reference/<variantId>.json and
 * public/abbreviations/<variantId>.json through lib/contentUrl.ts.
 */
export default function QuickReferencePage({ variantId }: { variantId: string }) {
  const [doc, setDoc] = useState<QuickReferenceDoc | null>(null);
  const [abbreviations, setAbbreviations] = useState<Abbreviation[]>([]);
  const [showAbbr, setShowAbbr] = useState(false);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setDoc(null);
    });
    fetchContentJson<QuickReferenceDoc>(`/quick-reference/${variantId}.json`)
      .then((json) => {
        if (!cancelled) setDoc(json);
      })
      .catch(() => {});
    fetchContentJson<{ items?: Abbreviation[] }>(`/abbreviations/${variantId}.json`)
      .then((json) => {
        if (!cancelled) setAbbreviations(Array.isArray(json?.items) ? json.items : []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [variantId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar
        title={doc?.title ?? "Quick Reference"}
        backHref="/"
        backLabel="Home"
        rightAction={
          abbreviations.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowAbbr((v) => !v)}
              className="px-3 py-1 rounded border text-xs font-medium bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
            >
              ABBR
            </button>
          ) : undefined
        }
      />

      <main className="mx-auto max-w-3xl p-4 space-y-4">
        {doc?.intro && <p className="text-xs text-slate-600 dark:text-zinc-300">{doc.intro}</p>}

        {showAbbr && (
          <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">Abbreviations</h2>
            <ul className="divide-y divide-slate-200 dark:divide-zinc-700 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              {abbreviations.map((row, i) => (
                <li
                  key={`${row.abbr}-${i}`}
                  className="flex items-start gap-4 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-100"
                >
                  <div className="w-32 shrink-0 font-mono font-semibold">{row.abbr}</div>
                  <div className="flex-1 text-slate-700 dark:text-zinc-200">{row.meaning}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {doc === null && <p className="text-sm text-slate-500 dark:text-zinc-400 py-6 text-center">Loading…</p>}

        {doc?.groups.map((group, i) => (
          <GroupCard key={`${group.title}-${i}`} title={group.title} items={group.items} />
        ))}
      </main>
    </div>
  );
}
