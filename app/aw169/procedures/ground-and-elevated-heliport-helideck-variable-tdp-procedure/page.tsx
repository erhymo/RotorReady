"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BackButton } from "@/app/components/BackButton";
import { useActiveModelVariant } from "@/lib/models/hooks";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-zinc-900" />}>
      <PageInner />
    </Suspense>
  );
}

function PageInner() {
  const router = useRouter();
  const { variant } = useActiveModelVariant();
  const sp = useSearchParams();
  const afterTakeOffChecksPage = variant.id === "AW169_EP" ? "183" : "167";
  const cwp = sp.get("cwp");
  const plist = sp.get("plist");
  const compactCWP = !!cwp && cwp !== "0" && cwp !== "false";
  const compactList = !!plist && plist !== "0" && plist !== "false";
  const compact = compactCWP || compactList;

  function renderContent() {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-zinc-100">
            GROUND AND ELEVATED HELIPORT / HELIDECK VARIABLE TDP PROCEDURE
          </h1>
        </header>

        {/* Figure */}
        <section aria-label="Figure" className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <img
            src="/aw169/procedures/ground-and-elevated-heliport-helideck-variable-tdp-procedure/offshore_elevated_helideck_take_off_normal_procedure_exact.svg"
            alt="Figure NP 4: Take-Off Profile Variable TDP Procedure"
            className="w-full h-auto"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </section>

        {/* CAUTION */}
        <section
          aria-label="Caution"
          className="rounded-xl border bg-white p-4 dark:bg-zinc-900 dark:border-zinc-700"
        >
          <div className="inline-block border-2 border-yellow-500 px-2 py-0.5 font-semibold">
            CAUTION
          </div>
          <p className="mt-3 text-slate-800 dark:text-zinc-100">
            If this procedure is modified, it may not be possible, if an engine fails in the Take-Off path, to carry out a safe OEI landing or achieve the scheduled OEI performance.
          </p>
        </section>
        {/* Steps 1-7 */}
        <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <ol className="list-decimal pl-6 space-y-2 text-slate-800 dark:text-zinc-100">
            <li>
              <span className="font-medium">Pilot Altimeter</span> — Set 0 ft or nearest 1000 ft (300 m) setting to T-O altitude, with collective at MPOG.
            </li>
            <li>
              <span className="font-medium">Rad Alt</span> — Check
            </li>
            <li>
              <span className="font-medium">Power checks</span> — Carry out as required in accordance with <span className="font-semibold">ENGINE POWER CHECKS</span> procedure in Basic RFM Section 4.
            </li>
            <li>
              <span className="font-medium">NOSEWHEEL lock</span> — LOCK
            </li>
            <li>
              <span className="font-medium">PARK BRAKE</span> — As required
            </li>
            <li>
              <span className="font-medium">Engine/Rotor</span> — TQ/ITT matched as required and check NF/NR 103%.
            </li>
            <li>
              <span className="font-medium">MFD PWR PLANT page</span> — Check all parameters within normal operating limits and cross check with PFD.
            </li>
          </ol>
        </section>

        {/* Steps 8-16 */}
        <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <ol start={8} className="list-decimal pl-6 space-y-2 text-slate-800 dark:text-zinc-100">
            <li>
              <span className="font-medium">Warnings and Cautions</span> — None/as required.
            </li>
            <li>
              <span className="font-medium">Flight controls</span> — Check correct functioning.
            </li>
            <li>
              <span className="font-medium">Landing lights</span> — For night operations set as follows:
              <ul className="list-disc pl-6">
                <li>Flying pilot side set pointing down;</li>
                <li>Non flying pilot side set pointing forward.</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Hover</span> — Establish a 6 ft (1.8 m) ATS hover and note pitch attitude and PI. No winds from rear sectors (090° to 270°).
            </li>
            <li>
              <span className="font-medium">Collective/Cyclic Control</span> — Increase collective to start a slow climb (max 300 fpm) to TDP (max 400 ft) maintaining the centre of the helipad in sight between yaw pedals.
            </li>
            <li>
              <span className="font-medium">Take-Off Decision Point (TDP)</span> — Rotate in 2 sec. 15 deg. nose down with respect to hover attitude using collective to maintain height. Maintain this attitude until airspeed indications starts to increase, then reduce pitch down by 5 deg. to accelerate through VTOSS (45 KIAS). From VTOSS continue climb and accelerate to Vy.
            </li>
            <li>
              <span className="font-medium">Acceleration/Climb</span> — Passing through VTOSS (45 KIAS) continue acceleration to Vy and climb to 1000 ft (300 m) ATS.
            </li>
            <li>
              <span className="font-medium">Landing gear</span> — UP (when reaching Vy but not below 200 ft (60 m) ATS).
            </li>
            <li>
              <span className="font-medium">AFTER TAKE-OFF checks. See page {afterTakeOffChecksPage}.</span> — Complete.
            </li>
          </ol>
        </section>


        <footer className="text-xs text-zinc-500 dark:text-zinc-400">
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
        onClick={() => {
          try {
            const before = window.location.pathname + window.location.search;
            router.back();
            setTimeout(() => {
              try {
                if (window.location.pathname + window.location.search === before) {
                  if (compactList) {
                    router.push('/training/procedures/aw169');
                  } else {
                    const sp2 = new URLSearchParams(window.location.search);
                    const v = sp2.get('v') || '';
                    const light = sp2.get('light') || '';
                    const mem = sp2.get('mem') || '0';
                    router.push(`/training/lights?resume=1&v=${encodeURIComponent(v)}&light=${encodeURIComponent(light)}&mem=${encodeURIComponent(mem)}&cwp=1`);
                  }
                }
              } catch {}
            }, 120);
          } catch {}
        }}
      >
        <div
          className="h-full w-full overflow-y-auto"
          onClickCapture={(e) => { const t = e.target as HTMLElement; if (t && t.closest('a,button,input,textarea,select,[data-prevent-back]')) { e.stopPropagation(); } }}
          onMouseDownCapture={(e) => { const t = e.target as HTMLElement; if (t && t.closest('a,button,input,textarea,select,[data-prevent-back]')) { e.stopPropagation(); } }}
          onTouchStartCapture={(e) => { const t = e.target as HTMLElement; if (t && t.closest('a,button,input,textarea,select,[data-prevent-back]')) { e.stopPropagation(); } }}
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div
        className="sticky z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700"
        style={{ top: "calc(4rem + env(safe-area-inset-top, 0px))" }}
      >
        <div className="mx-auto max-w-3xl px-6 py-3">
	          <BackButton label="Procedures" to="/training/procedures/aw169" />
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

