"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BackButton } from "@/app/components/BackButton";
import { useActiveModelVariant } from "@/lib/models/hooks";

export default function ClearAreaTakeOffPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-zinc-900" />}>
      <ClearAreaTakeOffInner />
    </Suspense>
  );
}

function ClearAreaTakeOffInner() {
  const router = useRouter();
  const { variant } = useActiveModelVariant();
  const sp = useSearchParams();
  const cwp = sp.get("cwp");
  const plist = sp.get("plist");
  const compactCWP = !!cwp && cwp !== "0" && cwp !== "false";
  const compactList = !!plist && plist !== "0" && plist !== "false";
  const compact = compactCWP || compactList;
  const figureSrc = variant.id === "AW169_EP"
    ? "/aw169/procedures/clear-area-take-off/clear_area_take_off_ep.svg"
    : "/aw169/procedures/clear-area-take-off/clear_area_take_off_exact.svg";

  function renderContent() {
    const steps = [
      { left: "PARK BRAKE", right: <>Release. Confirm <span className="font-semibold bg-green-200 text-green-900 dark:bg-green-900/40 dark:text-green-200 px-1 rounded">PARK BRK ON</span> advisory not illuminated on CAS.</> },
      { left: "Pilot Altimeter", right: <>Set.</> },
      { left: "Rad Alt", right: <>Check.</> },
      { left: "Power checks", right: <>Carry out as required in accordance with <span className="font-semibold">ENGINE POWER CHECKS</span> procedure in Basic RFM Section 4.</> },
      { left: "Nosewheel steering", right: <>LOCK.</> },
      { left: "Engine/Rotor", right: <>TQ/ITT matched as required and check <span className="font-semibold">NF/NR 103%</span>.</> },
      { left: "MFD PWR PLANT page", right: <>Check all parameters within normal operating limits and cross‑check with PFD.</> },
      { left: "Warnings and Cautions", right: <>None/as required.</> },
      { left: "Flight controls", right: <>Check correct functioning.</> },
      { left: "Hover", right: <>Establish a <span className="font-semibold">6 ft (1.8 m) ATS</span> hover and note pitch attitude. No winds from rear sectors (090° to 270°).</> },
      { left: "PI/NR", right: <>Note PI value and confirm NR in <span className="font-semibold">PLUS</span> Mode.</> },
      { left: "Collective/Cyclic control", right: <>Apply Cyclic to rotate 10° nose down with respect to hover attitude and apply collective to increase hover PI by 5–10% to maintain height. Maintain pitch attitude until airspeed indication starts to increase then reduce pitch down by 5° to climb and start climb to TDP.</> },
      { left: "Take‑Off Decision Point (TDP)", right: <>At TDP continue climb and accelerate to <span className="font-semibold">VTOSS (45 KIAS)</span>. From VTOSS continue climb and accelerate to <span className="font-semibold">VY</span>.</> },
      { left: "Acceleration/Climb", right: <>Passing through <span className="font-semibold">VTOSS (45 KIAS)</span> continue acceleration to <span className="font-semibold">VY</span> and climb to <span className="font-semibold">1000 ft (300 m) ATS</span>.</> },
      { left: "Landing gear", right: <>Up (when reaching VY but not below <span className="font-semibold">200 ft ATS</span>).</> },
      { left: "AFTER TAKE‑OFF checks", right: <>Complete.</> },
    ];

    return (
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">CLEAR AREA TAKE-OFF PROCEDURE</h1>
          <div className="mt-3 text-sm text-slate-700 dark:text-zinc-300 space-y-2">
            <div><span className="font-semibold">Take‑Off Decision Point (TDP)</span></div>
            <div className="space-y-1">
              <div className="flex items-baseline">
                <span>Height</span>
                <span className="mx-2 flex-1 border-b border-dotted border-slate-400/80 dark:border-zinc-500/60" />
                <span className="font-semibold">20 ft (6 m) ATS</span>
              </div>
              <div className="flex items-baseline">
                <span>Airspeed</span>
                <span className="mx-2 flex-1 border-b border-dotted border-slate-400/80 dark:border-zinc-500/60" />
                  <span className="font-semibold">35 KIAS</span>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm font-semibold text-slate-800 dark:text-zinc-100 mb-2">Take-Off</div>
          <div className="rounded-lg overflow-hidden border dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <img
              src={figureSrc}
              alt="Figure NP 3: Take-Off Profile Clear Area"
              className="w-full h-auto"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="mt-2 text-center text-xs text-slate-500 dark:text-zinc-400">Figure NP 3: Take-Off Profile Clear Area</div>
        </section>

        <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 text-sm text-slate-800 dark:text-zinc-100">
          <div className="font-semibold text-center mb-1">Note</div>
          <p>Radio altimeter heights are shown in the flight path profiles. Refer to Barometric altimeter when obstacles are present in the Take‑Off flight path.</p>
        </section>

        <section className="space-y-3">
          <div className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 text-sm text-slate-800 dark:text-zinc-100 flex flex-col items-center">
            <div className="rounded border-2 border-amber-600 bg-amber-100 px-3 py-1 font-bold text-amber-900">CAUTION</div>
            <p className="mt-3 text-center">If this procedure is modified, it may not be possible, if an engine fails in the Take‑Off path, to carry out a safe OEI landing or achieve the scheduled OEI performance.</p>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm text-slate-800 dark:text-zinc-100">Perform as follows:</div>
          <div className="mt-2 divide-y divide-slate-200/70 dark:divide-zinc-700/60">
            {steps.map((s, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 py-2">
                <div className="text-sm text-slate-700 dark:text-zinc-300">
                  <span className="inline-block w-6 text-right mr-2">{i + 1}.</span>
                  <span className="font-medium">{s.left}</span>
                </div>
                <div className="text-sm text-slate-800 dark:text-zinc-100 sm:mt-0 mt-1">— {s.right}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">AW169 training reference. For training use only.</footer>
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

