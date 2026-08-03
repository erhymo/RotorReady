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
            OFFSHORE / ELEVATED HELIDECK TAKE-OFF NORMAL PROCEDURE
          </h1>
        </header>

        {/* Figure under title */}
        <section aria-label="Figure" className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <img
            src="/aw169/procedures/offshore-elevated-helideck-take-off-normal-procedure/figure-np-6-offshore-elevated-helideck-normal-take-off-profile.svg"
            alt="Figure NP 6: Offshore / Elevated Helideck – Normal Take-Off Profile"
            className="w-full h-auto"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </section>

        <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <ol className="list-decimal pl-6 space-y-2 text-slate-800 dark:text-zinc-100">
            <li>
              <span className="font-medium">ECS</span> — As required.
            </li>
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
              <span className="font-medium">PARK BRAKE</span> — Apply. Confirm pressure can be felt on brake pedals and <span className="font-semibold">PARK BRK ON</span> advisory illuminated on CAS.
            </li>
            <li>
              <span className="font-medium">Engine/Rotor</span> — Check TQ matched and NF/NR 103%.
            </li>
            <li>
              <span className="font-medium">MFD PWR PLANT page</span> — Check all parameters within normal operating limits and cross check with PFD.
            </li>
            <li>
              <span className="font-medium">PFD menu</span> — Select DG on Rig, Otherwise check heading and select as required.
            </li>
            <li>
              <span className="font-medium">Warnings and Cautions</span> — None/as required.
            </li>
            <li>
              <span className="font-medium">Landing Lights</span> — For night operations set as follows:
              <ul className="list-disc pl-6">
                <li>Flying pilot side set pointing down</li>
                <li>Non flying pilot side set pointing forward.</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Hover</span> — Establish a 5 ft (1.5 m) ATS hover with the helicopter nose wheel positioned approximately 2 m from the front edge of the helideck and note hovering PI.
            </li>
          </ol>

          <div className="rounded-xl border bg-white p-4 dark:bg-zinc-900 dark:border-zinc-700 mt-4" aria-label="Note">
            <div className="font-semibold">Note</div>
            <p className="mt-1">
              If wind is from right sector, it is recommended that the aircraft is oriented to minimize the crosswind.
            </p>
          </div>

          <ol start={13} className="list-decimal pl-6 space-y-2 text-slate-800 dark:text-zinc-100 mt-4">
            <li>
              <span className="font-medium">Collective/Cyclic Control</span> — Increase PI by 15% in approximately 2 sec. to climb vertically at 400 fpm or greater, maintaining hover position.
            </li>
            <li>
              <span className="font-medium">Take-Off Decision Point (TDP)</span> — At 25 ft (7.5 m) ATS rotate nose to 12° nose down to achieve 15 kts GS then rotate to 6° nose up while continuing to accelerate to V<sub>Y</sub> (75 KIAS).
            </li>
            <li>
              <span className="font-medium">V<sub>Y</sub></span> — Above 200 ft, Landing Gear UP.
            </li>
            <li>
              <span className="font-medium">PARK BRAKE</span> — Release. Confirm <span className="font-semibold">PARK BRK ON</span> advisory extinguishes on CAS.
            </li>
            <li>
              <span className="font-medium">PFD menu</span> — Select MAG as required.
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

