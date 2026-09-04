"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";

import AppTopBar from "@/components/AppTopBar";

import { PROCEDURES } from "./proceduresData";

function H125AS350B3eProcedureInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const params = useParams();

  const rawSlug = (params && (params as any).slug) || "";
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : String(rawSlug || "");
  const def = PROCEDURES[slug];

  const plist = sp.get("plist");
  const compactList = !!plist && plist !== "0" && plist !== "false";
  const compact = compactList;

  if (!def) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
        <AppTopBar title="Procedure" backHref="/training/procedures/h125-as350-b3e" backLabel="Procedures" />
        <main className="mx-auto max-w-3xl p-6">
          <div className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
            <div className="text-slate-900 dark:text-zinc-100 font-semibold mb-2">Procedure not found</div>
            <p className="text-sm text-slate-700 dark:text-zinc-300">
              This H125 / AS350 B3e procedure is not defined. Use the RFM directly for reference.
            </p>
          </div>
        </main>
      </div>
    );
  }

  function renderContent() {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">{def!.title}</h1>
          {(def!.subtitle || def!.rfmReference) && (
            <div className="mt-3 text-sm text-slate-700 dark:text-zinc-300 space-y-1">
              {def!.subtitle && <div>{def!.subtitle}</div>}
              {def!.rfmReference && (
                <div>
                  <span className="font-semibold">RFM reference:</span> {def!.rfmReference}
                </div>
              )}
            </div>
          )}
        </header>

        {def!.warnings?.map((w, i) => (
          <div key={i} className="rounded-xl border-2 border-red-600 bg-red-50 dark:bg-red-900/30 dark:border-red-500 p-4 text-sm text-red-900 dark:text-red-100">
            <div className="font-bold text-center mb-1">WARNING</div>
            <p className="text-center">{w}</p>
          </div>
        ))}

        {def!.cautions?.map((c, i) => (
          <div key={i} className="rounded-xl border-2 border-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-500 p-4 text-sm text-amber-900 dark:text-amber-100">
            <div className="font-bold text-center mb-1">CAUTION</div>
            <p className="text-center">{c}</p>
          </div>
        ))}

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm text-slate-800 dark:text-zinc-100">Perform as follows:</div>
          <div className="mt-2 divide-y divide-slate-200/70 dark:divide-zinc-700/60">
            {def!.steps.map((s, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 py-2">
                <div className="text-sm text-slate-700 dark:text-zinc-300">
                  <span className="inline-block w-6 text-right mr-2">{i + 1}.</span>
                  <span className="font-medium">{s.left}</span>
                </div>
                <div className="text-sm text-slate-800 dark:text-zinc-100 sm:mt-0 mt-1">
                  {"·"} {s.right}
                </div>
              </div>
            ))}
          </div>
        </section>

        {def!.notes && def!.notes.length > 0 && (
          <section className="rounded-xl border-l-4 border-blue-500/60 bg-blue-50 dark:bg-zinc-800 dark:border-blue-400 p-4 space-y-2">
            <div className="font-semibold text-sm text-slate-900 dark:text-zinc-100">Note</div>
            {def!.notes.map((n, i) => (
              <p key={i} className="text-sm text-slate-800 dark:text-zinc-200">{n}</p>
            ))}
          </section>
        )}

        <footer className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">
          H125 / AS350 B3e training reference. For training use only. Always cross-check with the latest approved RFM.
        </footer>
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
          try {
            const before = window.location.pathname + window.location.search;
            router.back();
            setTimeout(() => {
              try {
                if (window.location.pathname + window.location.search === before) {
                  router.push("/training/procedures/h125-as350-b3e");
                }
              } catch {}
            }, 120);
          } catch {}
        }}
      >
        <div
          className="h-full w-full overflow-y-auto"
          onClickCapture={(e) => {
            const t = e.target as HTMLElement;
            if (t && t.closest("a,button,input,textarea,select,[data-prevent-back]")) {
              e.stopPropagation();
            }
          }}
          onMouseDownCapture={(e) => {
            const t = e.target as HTMLElement;
            if (t && t.closest("a,button,input,textarea,select,[data-prevent-back]")) {
              e.stopPropagation();
            }
          }}
          onTouchStartCapture={(e) => {
            const t = e.target as HTMLElement;
            if (t && t.closest("a,button,input,textarea,select,[data-prevent-back]")) {
              e.stopPropagation();
            }
          }}
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="Procedure" backHref="/training/procedures/h125-as350-b3e" backLabel="Procedures" />
      {renderContent()}
    </div>
  );
}

export default function ProcedureClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-zinc-900" />}>
      <H125AS350B3eProcedureInner />
    </Suspense>
  );
}
