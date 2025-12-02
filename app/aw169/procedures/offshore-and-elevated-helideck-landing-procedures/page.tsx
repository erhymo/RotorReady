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
            OFFSHORE AND ELEVATED HELIDECK LANDING PROCEDURES
          </h1>
        </header>

	        {/* Figure under title */}
	        <section
	          aria-label="Figure"
	          className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4"
	        >
	          <img
	            src="/aw169/procedures/offshore-elevated-helideck-take-off-normal-procedure/offshore_elevated_helideck_take_off_profile_exact.svg"
	            alt="OFFSHORE / ELEVATED HELIDECK TAKE-OFF NORMAL PROCEDURE profile"
	            className="w-full h-auto"
	            onError={(e) => {
	              (e.currentTarget as HTMLImageElement).style.display = "none";
	            }}
	          />
	        </section>

        {/* Wind limitations */}
        <section className="rounded-xl border bg-white p-4 dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Wind limitations</h2>
          <div className="mt-2 space-y-2 text-slate-800 dark:text-zinc-100">
            <p>
              Wind Limitations Chart ................................................................... Figure NP 6
            </p>
            <p>Landing with tail wind component is prohibited.</p>
          </div>

          <div className="mt-4 rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900 dark:border-zinc-700">
            <p className="font-semibold">Note</p>
            <p className="mt-2">
              Unless otherwise authorized by operation regulations the pilot is not authorized to
              credit more than 50 percent of the performance increase resulting from the wind
              component presented in Figure NP 6. For information on the use of the Wind Limitations
              Chart see Section 4 of paragraph WIND EFFECT LIMITATIONS CHART EXAMPLES in Part D.
            </p>
          </div>
        </section>

        {/* LDP */}
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

          <div className="mt-4 rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900 dark:border-zinc-700">
            <p className="font-semibold">Note</p>
            <p className="mt-2">Radio altimeter heights are shown in the flight path profiles.</p>
          </div>
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

