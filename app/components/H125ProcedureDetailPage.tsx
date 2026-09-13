"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AppTopBar from "@/components/AppTopBar";
import { fetchContentJson } from "@/lib/contentUrl";
import { renderInline, type InlineNode } from "@/lib/procedures/inline";

type Step = { left: string; right: InlineNode[] };
type H125Procedure = {
  slug: string;
  title: string;
  subtitle?: string;
  rfmReference?: string;
  steps: Step[];
};

/**
 * H125 / AS350 procedures keep their own layout (numbered steps, "Perform as
 * follows", the tap-to-close compact overlay used when opened from the list) —
 * only the content moved out of the bundle into public/procedures/<variantId>.json,
 * and the procedure is now chosen by `?slug=` so a new one needs no app release.
 */
export default function H125ProcedureDetailPage({
  variantId,
  backHref,
  footerNote,
  notFoundNote,
}: {
  variantId: string;
  backHref: string;
  footerNote: string;
  notFoundNote: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const slug = sp.get("slug") ?? "";
  const plist = sp.get("plist");
  const compact = !!plist && plist !== "0" && plist !== "false";
  const [procedures, setProcedures] = useState<H125Procedure[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setProcedures(null);
    });
    fetchContentJson<{ procedures?: H125Procedure[] }>(`/procedures/${variantId}.json`)
      .then((json) => {
        if (!cancelled) setProcedures(Array.isArray(json?.procedures) ? json.procedures : []);
      })
      .catch(() => {
        if (!cancelled) setProcedures([]);
      });
    return () => {
      cancelled = true;
    };
  }, [variantId]);

  const def = procedures?.find((p) => p.slug === slug);

  if (procedures !== null && !def) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
        <AppTopBar title="Procedure" backHref={backHref} backLabel="Procedures" />
        <main className="mx-auto max-w-3xl p-6">
          <div className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
            <div className="text-slate-900 dark:text-zinc-100 font-semibold mb-2">Procedure not found</div>
            <p className="text-sm text-slate-700 dark:text-zinc-300">{notFoundNote}</p>
          </div>
        </main>
      </div>
    );
  }

  function renderContent() {
    if (!def) return <main className="mx-auto max-w-3xl p-6 text-sm text-slate-500 dark:text-zinc-400">Loading…</main>;
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">{def.title}</h1>
          {(def.subtitle || def.rfmReference) && (
            <div className="mt-3 text-sm text-slate-700 dark:text-zinc-300 space-y-1">
              {def.subtitle && <div>{def.subtitle}</div>}
              {def.rfmReference && (
                <div>
                  <span className="font-semibold">RFM reference:</span> {def.rfmReference}
                </div>
              )}
            </div>
          )}
        </header>

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm text-slate-800 dark:text-zinc-100">Perform as follows:</div>
          <div className="mt-2 divide-y divide-slate-200/70 dark:divide-zinc-700/60">
            {def.steps.map((s, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 py-2">
                <div className="text-sm text-slate-700 dark:text-zinc-300">
                  <span className="inline-block w-6 text-right mr-2">{i + 1}.</span>
                  <span className="font-medium">{s.left}</span>
                </div>
                <div className="text-sm text-slate-800 dark:text-zinc-100 sm:mt-0 mt-1">
                  {"·"} {renderInline(s.right)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">{footerNote}</footer>
      </main>
    );
  }

  if (compact) {
    return (
      <div
        className="fixed left-0 right-0 bottom-0 top-0 z-40 bg-white dark:bg-zinc-900 cursor-pointer"
        role="button"
        aria-label="Close procedure"
        onClick={() => router.push(backHref)}
      >
        <div
          className="h-full w-full overflow-y-auto"
          onClickCapture={(e) => {
            const t = e.target as HTMLElement;
            if (t && t.closest("a,button,input,textarea,select,[data-prevent-back]")) e.stopPropagation();
          }}
          onMouseDownCapture={(e) => {
            const t = e.target as HTMLElement;
            if (t && t.closest("a,button,input,textarea,select,[data-prevent-back]")) e.stopPropagation();
          }}
          onTouchStartCapture={(e) => {
            const t = e.target as HTMLElement;
            if (t && t.closest("a,button,input,textarea,select,[data-prevent-back]")) e.stopPropagation();
          }}
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="Procedure" backHref={backHref} backLabel="Procedures" />
      {renderContent()}
    </div>
  );
}
