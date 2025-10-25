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
            GROUND OR ELEVATED HELIPAD APPROACH AND LANDING VARIABLE LDP PROCEDURE
          </h1>
        </header>

        {/* Figure under title */}
        <section aria-label="Figure" className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <img
            src="/aw169/procedures/ground-or-elevated-helipad-approach-and-landing-variable-ldp-procedure/figure-np-9-ge-hh-landing-profile.svg"
            alt="Figure NP 9: G&E H/H Landing Profile"
            className="w-full h-auto"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </section>

        {/* Approach and Landing Procedure */}
        <section className="rounded-xl border bg-white p-4 dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Approach and Landing Procedure</h2>

          {/* CAUTION */}
          <div className="mt-3 rounded-xl border bg-white p-4 dark:bg-zinc-900 dark:border-zinc-700" aria-label="Caution">
            <div className="inline-block border-2 border-yellow-500 px-2 py-0.5 font-semibold">CAUTION</div>
            <p className="mt-3">
              If this procedure is modified, it may not be possible, if an engine fails in the landing
              path, to carry out a safe OEI landing or achieve the scheduled OEI performance.
            </p>
          </div>

          {/* Steps */}
          <ol className="mt-4 list-decimal pl-6 space-y-2 text-slate-800 dark:text-zinc-100">
            <li>
              <span className="font-medium">Pre-landing checks</span> — Complete.
            </li>
            <li>
              <span className="font-medium">Landing direction</span> — If possible orientate the aircraft for an approach into the prevailing wind.
            </li>
            <li>
              <span className="font-medium">Landing lights</span> — For night operations set as follows:
              <ul className="list-disc pl-6">
                <li>Flying pilot side set pointing down;</li>
                <li>Non flying pilot side set pointing forward.</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">EDCU, MISC, AURAL INHIBIT</span> — Select NORMAL or LOW HT as required.
            </li>

            {/* Note */}
            <div className="rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900 dark:border-zinc-700">
              <div className="font-semibold">Note</div>
              <p className="mt-1">
                When descending below 150 ft Rad Alt height a vocal message ‘ONE FIFTY FEET’ is
                activated regardless of the landing gear status. This message is suppressed if AWG is
                set to LOW HT.
              </p>
            </div>

            <li>
              <span className="font-medium">Initial point</span> — Establish an approach at 20 kts GS and 50 ft higher than LDP height and slow down
              maintaining height to reach a hover with the centre of helipad in sight between the yaw pedals.
            </li>
            <li>
              <span className="font-medium">Descent to landing surface</span> — Start descending with no more than 300 fpm maintaining the centre of helipad in sight between the yaw pedals to reach a 6 ft hover above landing surface.
            </li>
            <li>
              <span className="font-medium">Landing</span> — After touchdown, centralize cyclic and reduce collective to MPOG.
            </li>
            <li>
              <span className="font-medium">PARK BRAKE</span> — As required after landing.
            </li>
            <li>
              <span className="font-medium">POST LANDING CHECKS. See page 187.</span> — Complete.
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
          <BackButton label="Home" to="/" />
        </div>
      </div>
      <Content />
    </div>
  );
}

