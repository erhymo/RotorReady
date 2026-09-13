"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchContentJson } from "@/lib/contentUrl";

type Abbreviation = { abbr: string; meaning: string };

// The list used to be a compiled-in array per model, so a correction only
// reached an installed native app on the next store release. It now comes from
// public/abbreviations/<variantId>.json through lib/contentUrl.ts.
export default function AbbreviationsPage({ title, variantId }: { title: string; variantId: string }) {
  const router = useRouter();
  const [data, setData] = useState<Abbreviation[]>([]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setData([]);
    });
    fetchContentJson<{ items?: Abbreviation[] }>(`/abbreviations/${variantId}.json`)
      .then((json) => {
        if (!cancelled) setData(Array.isArray(json?.items) ? json.items : []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [variantId]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 dark:text-zinc-100">
      <header
        className="sticky z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-slate-200 dark:border-zinc-700"
        style={{ top: "4rem" }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="px-3 py-1 rounded border text-sm bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
          >
            Close
          </button>
          <h1 className="text-sm font-semibold tracking-widest opacity-80">{title}</h1>
          <div className="w-[64px]" aria-hidden />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto p-4">
          <ul className="divide-y divide-slate-200 dark:divide-zinc-700 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
            {data.map((row, i) => (
              <li key={`${row.abbr}-${i}`} className="flex items-start gap-4 bg-white dark:bg-zinc-900 px-4 py-3">
                <div className="w-32 shrink-0 font-mono text-sm font-semibold text-slate-800 dark:text-zinc-100">{row.abbr}</div>
                <div className="flex-1 text-sm text-slate-700 dark:text-zinc-200">{row.meaning}</div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
