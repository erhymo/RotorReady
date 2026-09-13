"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AppTopBar from "@/components/AppTopBar";
import AbbreviationsLinkCard from "@/app/components/AbbreviationsLinkCard";
import { fetchContentJson } from "@/lib/contentUrl";

type ListGroup = { heading: string; slugs: string[] };
type ProcedureSummary = { slug: string; title: string; subtitle?: string };
type ProceduresDoc = {
  pageTitle?: string;
  intro?: string;
  listGroups?: ListGroup[];
  procedures?: ProcedureSummary[];
};

/**
 * The procedure index for one variant. Which procedures exist, how they are
 * grouped and in what order all come from the same JSON as the procedures
 * themselves, so adding one does not need an app release.
 */
export default function ProceduresListPage({
  variantId,
  detailHref,
  abbreviationsHref,
}: {
  variantId: string;
  detailHref: string;
  abbreviationsHref: string;
}) {
  const [doc, setDoc] = useState<ProceduresDoc | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setDoc(null);
    });
    fetchContentJson<ProceduresDoc>(`/procedures/${variantId}.json`)
      .then((json) => {
        if (!cancelled) setDoc(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [variantId]);

  const bySlug = new Map((doc?.procedures ?? []).map((p) => [p.slug, p]));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title={doc?.pageTitle ?? "Procedures"} backHref="/" backLabel="Home" />
      <main className="mx-auto max-w-3xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{doc?.pageTitle ?? "Procedures"}</h1>
        {doc?.intro && <p className="text-sm text-slate-600 dark:text-zinc-300">{doc.intro}</p>}
        <AbbreviationsLinkCard href={abbreviationsHref} />

        {doc === null && <p className="text-sm text-slate-500 dark:text-zinc-400">Loading…</p>}

        {doc?.listGroups?.map((group, gi) => (
          <section key={`${group.heading}-${gi}`} className="space-y-3">
            {group.heading && (
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200">
                {group.heading}
              </h2>
            )}
            <div className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700 p-4 space-y-3">
              {group.slugs.map((slug) => {
                const proc = bySlug.get(slug);
                if (!proc) return null;
                return (
                  <Link
                    key={slug}
                    href={`${detailHref}?slug=${encodeURIComponent(slug)}&plist=1`}
                    className="group block rounded-lg border p-4 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-zinc-700 dark:border-zinc-700"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-slate-900 dark:text-zinc-100 font-medium">{proc.title}</div>
                        {proc.subtitle && (
                          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{proc.subtitle}</div>
                        )}
                      </div>
                      <div className="text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">
                        ›
                      </div>
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
