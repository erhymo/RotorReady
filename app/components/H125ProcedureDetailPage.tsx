"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AppTopBar from "@/components/AppTopBar";
import { fetchContentJson } from "@/lib/contentUrl";
import { renderInline, type InlineNode } from "@/lib/procedures/inline";

// `group` puts consecutive steps into one titled box. Inside a box a step with no
// `left` is numbered 1, 2, 3…; a step with `left` is a labelled row (a scenario
// or a warning, not part of the numbered sequence). `when` is a short condition
// shown above the step text. Procedures without `group` keep the plain checklist.
type Step = { left?: string; group?: string; when?: string; right: InlineNode[] };
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

  function renderChecklist(steps: Step[]) {
    return (
      <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
        <div className="text-sm text-slate-800 dark:text-zinc-100">Perform as follows:</div>
        <div className="mt-2 divide-y divide-slate-200/70 dark:divide-zinc-700/60">
          {steps.map((s, i) => (
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
    );
  }

  function renderGroupedSteps(steps: Step[]) {
    const groups: { title: string; steps: Step[] }[] = [];
    for (const st of steps) {
      const title = st.group ?? st.left ?? "";
      const last = groups[groups.length - 1];
      if (last && last.title === title) last.steps.push(st);
      else groups.push({ title, steps: [st] });
    }
    return (
      <div className="space-y-4">
        {groups.map((g, gi) => {
          const single = g.steps.length === 1;
          // A lone labelled step reads better as "Title — label" than as a box with one row.
          const title = single && g.steps[0].left ? `${g.title} — ${g.steps[0].left}` : g.title;
          let n = 0;
          return (
            <section
              key={gi}
              className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 overflow-hidden"
            >
              <h2 className="border-b bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                {title}
              </h2>
              <div className="divide-y divide-slate-200/70 dark:divide-zinc-700/60">
                {g.steps.map((st, si) => {
                  const labelled = !single && !!st.left;
                  const numbered = !single && !st.left;
                  if (numbered) n += 1;
                  return (
                    <div key={si} className="flex gap-3 px-4 py-3">
                      {numbered && (
                        <div className="w-5 shrink-0 text-right text-sm font-semibold text-slate-500 dark:text-zinc-400">
                          {n}.
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-1 text-sm text-slate-800 dark:text-zinc-100">
                        {labelled && (
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                            {st.left}
                          </div>
                        )}
                        {st.when && (
                          <div className="text-xs italic text-slate-500 dark:text-zinc-400">{st.when}</div>
                        )}
                        <div>{renderInline(st.right)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
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

        {def.steps.some((s) => s.group) ? renderGroupedSteps(def.steps) : renderChecklist(def.steps)}

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
        onClick={() => {
          // Opened from the list with router.push, so closing is one step back.
          // Pushing the list again stacked a second list entry above the
          // procedure and made "Home" jump back into it.
          if (typeof window !== "undefined" && window.history.length > 1) router.back();
          else router.push(backHref);
        }}
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
