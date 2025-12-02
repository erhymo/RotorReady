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
            OFFSHORE / ELEVATED HELIDECK APPROACH AND NORMAL LANDING PROCEDURE
          </h1>
        </header>

        {/* Figure under title */}
        <section aria-label="Figure" className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <img
            src="/aw169/procedures/offshore-elevated-helideck-approach-and-normal-landing-procedure/np10-landing-profile.svg"
            alt="Figure NP 10: Offshore / Elevated Helideck – Normal Landing Profile"
            className="w-full h-auto"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </section>

	        {/* LDP summary */}
	        <section className="rounded-xl border bg-white p-4 dark:bg-zinc-900 dark:border-zinc-700">
	          <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Landing decision point (LDP)</h2>
	          <div className="mt-2 space-y-2 text-slate-800 dark:text-zinc-100">
	            <div className="flex items-baseline">
	              <span>Height</span>
	              <span className="mx-2 flex-1 border-b border-dotted border-slate-400/80 dark:border-zinc-500/60" />
	              <span className="font-semibold">30 ft ALS</span>
	            </div>
	            <div className="flex items-baseline">
	              <span>Groundspeed</span>
	              <span className="mx-2 flex-1 border-b border-dotted border-slate-400/80 dark:border-zinc-500/60" />
	              <span className="font-semibold">12 kts</span>
	            </div>
	          </div>
	        </section>

        {/* Steps */}
        <section className="rounded-xl border bg-white p-4 dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Procedure</h2>
          <ol className="mt-3 list-decimal pl-6 space-y-2 text-slate-800 dark:text-zinc-100">
            <li>
              <span className="font-medium">Pre-landing checks</span> — Complete.
            </li>
            <li>
              <span className="font-medium">Landing direction</span> — If possible carry out an approach into the prevailing wind.
            </li>
            <li>
              <span className="font-medium">Landing lights</span> — For night operations set as follows: Flying pilot side set pointing down; Non flying pilot side set pointing forward.
            </li>
            <li>
              <span className="font-medium">EDCU, MISC, AURAL INHIBIT</span> — Select NORMAL or LOW HT as required.
            </li>
          </ol>

          {/* Note box after item 4 */}
          <div className="mt-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 text-sm">
            <p className="font-semibold">Note</p>
            <p>
              When descending below 150 ft Rad Alt height a vocal message ‘ONE FIFTY FEET’ is activated regardless of the landing gear status. This message is suppressed if AWG is set to LOW HT.
            </p>
          </div>

          <ol start={5} className="mt-3 list-decimal pl-6 space-y-2 text-slate-800 dark:text-zinc-100">
            <li>
              <span className="font-medium">PARK BRAKE</span> — Apply, Confirm pressure can be felt on brake pedals and PARK BRK ON advisory illuminated on CAS.
            </li>
            <li>
              <span className="font-medium">PFD menu</span> — Select DG as required.
            </li>
            <li>
              <span className="font-medium">Initial point</span> — Establish a constant descent with a ROD of 200 and 300 fpm and decelerate slowly towards the LDP (30 ft ALS at 12 kts GS and position the deck at 45°) maintaining the flight path to keep the rotor tip path plane outboard, but close to the edge of the helideck.
            </li>
            <li>
              <span className="font-medium">LDP</span> — The LDP is positioned with the aircraft approximately 45° from the centre of the helideck viewed through the lower part of the windscreen.
            </li>
            <li>
              <span className="font-medium">Landing</span> — When passing LDP fly directly to landing position, flare to reduce ROD and speed to achieve HIGE over landing position.
            </li>
            <li>
              <span className="font-medium">Touchdown</span> — When over the landing position descend vertically and use collective to cushion touchdown. Maximum nose up attitude at touchdown 15°. Maximum GS at touchdown 5 kts (9 km/hr).
            </li>
            <li>
              <span className="font-medium">PARK BRAKE</span> — As required after landing.
            </li>
            <li>
              <span className="font-medium">POST LANDING CHECKS</span> — See page 187. — Complete.
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

