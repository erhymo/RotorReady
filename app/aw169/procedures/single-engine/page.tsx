"use client";

import { Suspense } from "react";

import Link from "next/link";
import { BackButton } from "@/app/components/BackButton";
import { useRouter, useSearchParams } from "next/navigation";

export default function SingleEngineProcedurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-zinc-900" />}>
      <SingleEngineProcedureInner />
    </Suspense>
  );
}

function SingleEngineProcedureInner() {
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
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">SINGLE ENGINE PROCEDURE</h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-zinc-300">
            The following procedure intends to indicate the procedures to follow, in OEI conditions, following an emergency or malfunction procedure which has caused an engine failure or an intentional shutdown.
          </p>
        </header>

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <p className="text-sm text-slate-800 dark:text-zinc-100">
            After an engine shutdown, the indication of fuel quantity on PFD and on MFD ENGINE synoptic page will change as follows:
          </p>
          <ul className="list-disc pl-6 text-sm text-slate-800 dark:text-zinc-100">
            <li>
              if the fuel quantity associated to the failed engine is greater than 160 kg, the quantity exceeding 160 kg is added to the quantity of the operative engine and the Total Fuel Quantity coincides with it. The Fuel Quantity of the failed engine is displayed in grey inverse video as 160 kg.
            </li>
            <li>
              if the fuel quantity associated to the failed engine is lower than 160 kg, the Total Fuel Quantity coincides with the fuel quantity indication of the operative engine. The Fuel Quantity readout associated to the failed engine turns to grey inverse video.
            </li>
          </ul>
          <div className="rounded-xl border-l-4 border-blue-500/60 bg-blue-50 dark:bg-zinc-900/70 p-3 text-sm dark:text-zinc-100">
            <div className="font-semibold mb-1">Note</div>
            Consider increased unusable fuel affecting flight duration.
          </div>
        </section>

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm text-slate-800 dark:text-zinc-100">
            When conditions permit confirm the following:
          </div>
          <ol className="list-decimal pl-6 text-sm text-slate-800 dark:text-zinc-100">
            <li>
              Carry out <span className="font-semibold">ENGINE SHUTDOWN IN EMERGENCY</span> procedure.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <div className="rounded-xl border p-4 bg-white dark:bg-blue-900/40 dark:text-white dark:border-blue-400">
            <div className="font-semibold mb-1">IS ENGINE DAMAGE SUSPECTED?</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border p-3 bg-white dark:bg-zinc-900/70 dark:text-zinc-100">
                <div className="font-semibold mb-1">NO</div>
                <div className="text-sm">Refer to <Link
                  href={{
                    pathname: "/aw169/procedures/engine-re-light",
                    query: {
                      resume: "1",
                      v: sp.get("v") || "AW169",
                      light: sp.get("light") || "",
                      mem: sp.get("mem") || "0",
                      cwp: "1",
                    },
                  }}
                  onClick={() => { try { sessionStorage.setItem("lights:resume", JSON.stringify({ variantId: sp.get("v") || "AW169", lightId: sp.get("light") || "", memoryOnly: (sp.get("mem") || "0") === "1", idx: 0, deck: [sp.get("light") || ""], lastSeverity: "warning" })); } catch {} }}
                  className="underline text-blue-600 dark:text-blue-400"
                >engine re-light procedure</Link> as applicable.</div>
              </div>
              <div className="rounded-xl border p-3 bg-white dark:bg-zinc-900/70 dark:text-zinc-100">
                <div className="font-semibold mb-1">YES</div>
                <div className="text-sm">DO NOT attempt engine re-light. Continue as follows:</div>
                <div className="mt-2 rounded-xl border-l-4 border-blue-500/60 bg-blue-50 dark:bg-zinc-900/70 p-3 text-sm">
                  <div className="font-semibold mb-1">Note</div>
                  FUEL XFER (if installed): Select as required on EDCU FUEL page.
                </div>
              </div>
            </div>
          </div>
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
          <BackButton label="Home" to="/" />
        </div>
      </div>
      <Content />
    </div>
  );
}

