"use client";

import { Suspense } from "react";

import Link from "next/link";
import { BackButton } from "@/app/components/BackButton";
import { useRouter, useSearchParams } from "next/navigation";

export default function EngineShutdownEmergencyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-zinc-900" />}>
      <EngineShutdownEmergencyInner />
    </Suspense>
  );
}

function EngineShutdownEmergencyInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const cwp = sp.get("cwp");
  const plist = sp.get("plist");
  const compactCWP = !!cwp && cwp !== "0" && cwp !== "false";
  const compactList = !!plist && plist !== "0" && plist !== "false";
  const compact = compactCWP || compactList;

  function Content() {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">ENGINE SHUTDOWN IN EMERGENCY</h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-zinc-300">
            Use this procedure to shut down an engine promptly when required by an emergency or malfunction.
          </p>
        </header>

        <section className="space-y-3">
          <div className="rounded-xl border-l-4 border-amber-500/60 bg-amber-50 dark:bg-zinc-900/70 p-3 text-sm dark:text-zinc-100">
            <div className="font-semibold mb-1">CAUTION</div>
            Failure to follow the aborted engine restart procedure may cause damage to the engine.
          </div>
        </section>

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm text-slate-800 dark:text-zinc-100">Monitor engine indications. If any of the following occur, shut down the engine:</div>
          <ul className="list-disc pl-6 text-sm text-slate-800 dark:text-zinc-100">
            <li>No light‑up within 10 seconds of ENG MODE knob to IDLE</li>
            <li>ITT increases beyond engine limits</li>
            <li>ITT invalid (X or blank)</li>
            <li>Engine hangs (NG stagnation below 60%)</li>
            <li>Starter fails to disengage by 54% NG</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm text-slate-800 dark:text-zinc-100">Shut down engine as follows:</div>
          <ol className="list-decimal pl-6 text-sm text-slate-800 dark:text-zinc-100">
            <li>ENG MODE knob — <span className="font-semibold">OFF</span>.</li>
            <li>FUEL ENG SOV (EDCU, FUEL page) — <span className="font-semibold">CLOSE</span>.</li>
          </ol>
        </section>

        <footer className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">
          AW169 training reference. For training use only.
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
        onClick={() => { try { const before = window.location.pathname + window.location.search; router.back(); setTimeout(() => { try { if (window.location.pathname + window.location.search === before) { if (compactList) { router.push('/training/procedures/aw169'); } else { const sp2 = new URLSearchParams(window.location.search); const v = sp2.get('v') || ''; const light = sp2.get('light') || ''; const mem = sp2.get('mem') || '0'; router.push(`/training/lights?resume=1&v=${encodeURIComponent(v)}&light=${encodeURIComponent(light)}&mem=${encodeURIComponent(mem)}&cwp=1`); } } } catch {} }, 120); } catch {} }}
      >
        <div className="h-full w-full overflow-y-auto" onClickCapture={(e) => { const t = e.target as HTMLElement; if (t && t.closest('a,button,input,textarea,select,[data-prevent-back]')) { e.stopPropagation(); } }} onMouseDownCapture={(e) => { const t = e.target as HTMLElement; if (t && t.closest('a,button,input,textarea,select,[data-prevent-back]')) { e.stopPropagation(); } }} onTouchStartCapture={(e) => { const t = e.target as HTMLElement; if (t && t.closest('a,button,input,textarea,select,[data-prevent-back]')) { e.stopPropagation(); } }}>
          <Content />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700">
        <div className="mx-auto max-w-3xl px-6 py-3">
          <BackButton label="Back to procedure" />
        </div>
      </div>
      <Content />
    </div>
  );
}

