"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import AppTopBar from "@/components/AppTopBar";
import { fetchContentJson } from "@/lib/contentUrl";
import { renderInline, type InlineNode } from "@/lib/procedures/inline";

type Step = { left: string; right: InlineNode[] };
type Group = { heading?: string; steps: Step[] };

export type Procedure = {
  slug: string;
  title: string;
  subtitle?: string;
  reference: string;
  intro?: InlineNode[];
  warnings?: string[];
  cautions?: string[];
  groups: Group[];
  notes?: string[];
  image?: { src: string; alt: string; caption?: string };
};

type ProceduresDoc = { footerNote?: string; procedures?: Procedure[] };

/**
 * One procedure, chosen by `?slug=`. The content used to be JSX inside
 * lib/procedures/<model>/data.tsx — compiled into the bundle, and reachable only
 * through a per-procedure build-time route — so neither a correction nor a new
 * procedure could reach an installed native app without a store release.
 */
export default function ProcedureDetailPage({
  variantId,
  backHref,
}: {
  variantId: string;
  backHref: string;
}) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const [doc, setDoc] = useState<ProceduresDoc | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setDoc(undefined);
    });
    fetchContentJson<ProceduresDoc>(`/procedures/${variantId}.json`)
      .then((json) => {
        if (!cancelled) setDoc(json);
      })
      .catch(() => {
        if (!cancelled) setDoc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [variantId]);

  const procedure = doc?.procedures?.find((p) => p.slug === slug);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="Procedure" backHref={backHref} backLabel="Procedures" />
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        {doc === undefined && <p className="text-sm text-slate-500 dark:text-zinc-400">Loading…</p>}

        {doc !== undefined && !procedure && (
          <div className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
            <div className="text-slate-900 dark:text-zinc-100 font-semibold mb-2">Procedure not found</div>
            <p className="text-sm text-slate-700 dark:text-zinc-300">
              Use the flight manual directly for reference.
            </p>
          </div>
        )}

        {procedure && (
          <>
            <header className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">{procedure.title}</h1>
              {procedure.subtitle && (
                <div className="mt-1 text-sm text-slate-600 dark:text-zinc-300">{procedure.subtitle}</div>
              )}
              {procedure.intro && (
                <p className="mt-3 text-sm text-slate-700 dark:text-zinc-300">{renderInline(procedure.intro)}</p>
              )}
            </header>

            {procedure.image && (
              <figure className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={procedure.image.src} alt={procedure.image.alt} className="w-full h-auto rounded-lg" />
                {procedure.image.caption && (
                  <figcaption className="mt-2 text-xs text-slate-500 dark:text-zinc-400 text-center">
                    {procedure.image.caption}
                  </figcaption>
                )}
              </figure>
            )}

            {procedure.warnings?.map((w, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-red-600 bg-red-50 dark:bg-red-900/30 dark:border-red-500 p-4 text-sm text-red-900 dark:text-red-100"
              >
                <div className="font-bold text-center mb-1">WARNING</div>
                <p className="text-center">{w}</p>
              </div>
            ))}

            {procedure.cautions?.map((c, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-500 p-4 text-sm text-amber-900 dark:text-amber-100"
              >
                <div className="font-bold text-center mb-1">CAUTION</div>
                <p className="text-center">{c}</p>
              </div>
            ))}

            {procedure.groups.map((g, gi) => (
              <section key={gi} className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4">
                {g.heading && (
                  <div className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200 mb-3">
                    {g.heading}
                  </div>
                )}
                <div className="divide-y divide-slate-200/70 dark:divide-zinc-700/60">
                  {g.steps.map((s, i) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 py-2">
                      <div className="text-sm text-slate-700 dark:text-zinc-300">
                        <span className="inline-block w-8 text-right mr-2">{s.left || "•"}</span>
                      </div>
                      <div className="text-sm text-slate-800 dark:text-zinc-100 sm:mt-0 mt-1">
                        {renderInline(s.right)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {procedure.notes && procedure.notes.length > 0 && (
              <section className="rounded-xl border-l-4 border-blue-500/60 bg-blue-50 dark:bg-zinc-800 dark:border-blue-400 p-4 space-y-2">
                <div className="font-semibold text-sm text-slate-900 dark:text-zinc-100">Note</div>
                {procedure.notes.map((n, i) => (
                  <p key={i} className="text-sm text-slate-800 dark:text-zinc-200">
                    {n}
                  </p>
                ))}
              </section>
            )}

            <p className="text-xs text-slate-500 dark:text-zinc-400">Source: {procedure.reference}</p>
            {doc?.footerNote && (
              <footer className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">{doc.footerNote}</footer>
            )}
          </>
        )}
      </main>
    </div>
  );
}
