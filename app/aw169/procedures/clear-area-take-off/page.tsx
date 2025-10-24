"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BackButton } from "@/app/components/BackButton";

export default function ClearAreaTakeOffPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-zinc-900" />}> 
      <ClearAreaTakeOffInner />
    </Suspense>
  );
}

function ClearAreaTakeOffInner() {
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
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">CLEAR AREA TAKE-OFF PROCEDURE</h1>
          <div className="mt-3 text-sm text-slate-700 dark:text-zinc-300 space-y-1">
            <div><span className="font-semibold">Take‑Off Decision Point (TDP)</span></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
              <div>Height — <span className="font-semibold">20 ft (6 m) ATS</span></div>
              <div>Airspeed — <span className="font-semibold">20 KIAS</span></div>
            </div>
          </div>
        </header>

        <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 text-sm text-slate-800 dark:text-zinc-100">
          <div className="font-semibold mb-1">Note</div>
          <p>Radio altimeter heights are shown in the flight path profiles. Refer to Barometric altimeter when obstacles are present in the Take‑Off flight path.</p>
        </section>

        <section className="space-y-3">
          <div className="rounded-xl border-l-4 border-amber-500/60 bg-amber-50 dark:bg-zinc-900/70 p-3 text-sm dark:text-zinc-100">
            <div className="font-semibold mb-1">CAUTION</div>
            If this procedure is modified, it may not be possible, if an engine fails in the Take‑Off path, to carry out a safe OEI landing or achieve the scheduled OEI performance.
          </div>
        </section>

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm text-slate-800 dark:text-zinc-100">Perform as follows:</div>
          <ol className="list-decimal pl-6 text-sm text-slate-800 dark:text-zinc-100">
            <li>Park brake — <span className="font-semibold">Release</span>. Confirm <span className="font-semibold">PARK BRK ON</span> advisory not illuminated on CAS.</li>
            <li>Pilot altimeter — <span className="font-semibold">Set</span>.</li>
            <li>Rad Alt — <span className="font-semibold">Check</span>.</li>
            <li>Power checks — Carry out as required in accordance with <span className="font-semibold">ENGINE POWER CHECKS</span> procedure in Basic RFM Section 4.</li>
            <li>Nosewheel steering — <span className="font-semibold">LOCK</span>.</li>
            <li>Engine/Rotor — TQ/ITT matched as required and check <span className="font-semibold">NF/NR 103%</span>.</li>
            <li>MFD PWR PLANT page — Check all parameters within normal operating limits and cross‑check with PFD.</li>
            <li>Warnings and cautions — <span className="font-semibold">None/as required</span>.</li>
            <li>Flight controls — Check correct functioning.</li>
            <li>Hover — Establish a <span className="font-semibold">6 ft (1.8 m) ATS</span> hover and note pitch attitude. No winds from rear sectors (090° to 270°).</li>
            <li>PI/NR — Note PI value and confirm NR in <span className="font-semibold">PLUS</span> Mode.</li>
            <li>Collective/Cyclic control — Apply cyclic to rotate ~10° nose down from hover attitude and apply collective to increase hover PI by 5–10% to maintain height. Maintain pitch attitude until airspeed indication starts to increase, then reduce pitch down by ~5° to climb and start climb to TDP.</li>
            <li>Take‑Off Decision Point (TDP) — At TDP continue climb and accelerate to <span className="font-semibold">VTOSS (45 KIAS)</span>. From VTOSS continue climb and accelerate to <span className="font-semibold">VY</span>.</li>
            <li>Acceleration/Climb — Passing through <span className="font-semibold">VTOSS (45 KIAS)</span> continue acceleration to <span className="font-semibold">VY</span> and climb to <span className="font-semibold">1000 ft (300 m) ATS</span>.</li>
            <li>Landing gear — <span className="font-semibold">Up</span> (when reaching VY but not below <span className="font-semibold">200 ft ATS</span>).</li>
            <li>After take‑off checks — <span className="font-semibold">Complete</span>.</li>
          </ol>
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

