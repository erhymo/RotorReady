"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BackButton } from "@/app/components/BackButton";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-zinc-900" />}> 
      <PageInner />
    </Suspense>
  );
}

function PageInner() {
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
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-zinc-100">
            OFFSHORE / ELEVATED HELIDECK TAKE-OFF NORMAL PROCEDURE
          </h1>
        </header>

        {/* Figure under title */}
        <section aria-label="Figure" className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <img
            src="/aw169/procedures/offshore-elevated-helideck-take-off-normal-procedure/figure-np-5-offshore-elevated-helideck-take-off-normal-procedure.svg"
            alt="Figure NP 5: Offshore / Elevated Helideck Take-Off Normal Procedure"
            className="w-full h-auto"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </section>

        <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <ol className="list-decimal pl-6 space-y-2 text-slate-800 dark:text-zinc-100">
            <li>
              <span className="font-medium">Pilot Altimeter</span> — Set 0 ft or nearest 1000 ft (300 m) setting to T-O altitude, with collective at MPOG.
            </li>
            <li>
              <span className="font-medium">Rad Alt</span> — Check.
            </li>
            <li>
              <span className="font-medium">Power checks</span> — Carry out as required in accordance with ENGINE POWER CHECKS procedure in Basic RFM Section 4.
            </li>
            <li>
              <span className="font-medium">NOSEWHEEL lock</span> — LOCK.
            </li>
            <li>
              <span className="font-medium">PARK BRAKE</span> — As required.
            </li>
            <li>
              <span className="font-medium">Engine / Rotor</span> — TQ / ITT matched as required and check NF / NR 103 %.
            </li>
            <li>
              <span className="font-medium">MFD PWR PLANT page</span> — Check all parameters within normal operating limits and cross check with PFD.
            </li>
            <li>
              <span className="font-medium">Warnings and Cautions</span> — None / as required.
            </li>
            <li>
              <span className="font-medium">Flight controls</span> — Check correct functioning.
            </li>
            <li>
              <span className="font-medium">Landing lights</span> — For night operations set as follows:
              <ul className="list-disc pl-6">
                <li>Flying pilot side set pointing down.</li>
                <li>Non-flying pilot side set pointing forward.</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Hover</span> — Establish a 6 ft (1.8 m) ATS hover and note pitch attitude and PI. No winds from rear sectors (090° to 270°).
            </li>
            <li>
              <span className="font-medium">Collective / Cyclic Control</span> — Increase collective to start a slow climb (max 300 fpm) to TDP (max 400 ft) maintaining the centre of the helideck in sight between yaw pedals.
            </li>
            <li>
              <span className="font-medium">Take-Off Decision Point (TDP)</span> — Rotate in 2 sec ≈ 15° nose down with respect to hover attitude using collective to maintain height. Maintain this attitude until airspeed indications start to increase, then reduce pitch down by 5° to accelerate through V<sub>TOSS</sub> (45 KIAS). From V<sub>TOSS</sub> continue climb and accelerate to V<sub>Y</sub>.
            </li>
            <li>
              <span className="font-medium">Acceleration / Climb</span> — Passing through V<sub>TOSS</sub> (45 KIAS) continue acceleration to V<sub>Y</sub> and climb to 1000 ft (300 m) ATS.
            </li>
            <li>
              <span className="font-medium">Landing gear</span> — UP (when reaching V<sub>Y</sub> but not below 200 ft (60 m) ATS).
            </li>
            <li>
              <span className="font-medium">AFTER TAKE-OFF checks. See page 167.</span> — Complete.
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

