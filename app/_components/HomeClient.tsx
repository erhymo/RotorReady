"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { BellIcon, BoltIcon, BookIcon, DownloadIcon } from "@/components/Icons";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { INFO_STORAGE_KEY, LATEST_INFO_VERSION } from "@/lib/info/infoConstants";

function Bar(props: { href: string; title: string; description: string; tone?: "blue"|"amber"|"slate"|"emerald"; icon?: React.ReactNode }) {
  const tones: Record<string, string> = {
    blue: "border-blue-600 bg-blue-50/40 hover:bg-blue-50 dark:border-blue-400 dark:bg-blue-900/40 dark:hover:bg-blue-900/60",
    amber: "border-amber-500 bg-amber-50/40 hover:bg-amber-50 dark:border-amber-400 dark:bg-amber-900/40 dark:hover:bg-amber-900/60",
    slate: "border-slate-500 bg-slate-50/40 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800/60 dark:hover:bg-zinc-700/80",
    emerald: "border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60",
  };
  const tone = tones[props.tone || "slate"];
  return (
    <Link href={props.href} prefetch={false} className={`group w-full rounded-xl border-l-4 ${tone} transition block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900`}>
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {props.icon && <span className="inline-grid place-items-center h-8 w-8 rounded-lg bg-white/70 text-slate-700 dark:bg-zinc-900/80 dark:text-zinc-100">{props.icon}</span>}
          <div>
            <div className="font-semibold text-slate-900 dark:text-zinc-100">{props.title}</div>
            <div className="text-sm text-slate-600 dark:text-zinc-300 mt-0.5">{props.description}</div>
          </div>
        </div>
        <div className="text-slate-400 text-xl transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
      </div>
    </Link>
  );
}

export default function HomeClient() {
  const [ver, setVer] = useState<any>(null);
  const { variant: activeVariant } = useActiveModelVariant();
  const hasCheckout = Boolean(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID);
	  const [hasUnreadInfo, setHasUnreadInfo] = useState(false);
  useEffect(() => {
    fetch("/quiz-data/versions/data-version.json").then(r=>r.json()).then(setVer).catch(()=>{});
  }, []);
	  useEffect(() => {
	    try {
	      const stored = window.localStorage.getItem(INFO_STORAGE_KEY);
	      setHasUnreadInfo(stored !== LATEST_INFO_VERSION);
	    } catch {
	      // ignore
	    }
	  }, []);
	  return (<>
	      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
	        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/40 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 px-2.5 py-1 text-xs font-medium select-none">
	          In production
	        </span>
	        <Link
	          href="/info"
	          prefetch={false}
	          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs shadow-sm transition ${
	            hasUnreadInfo
	              ? "border-emerald-500 bg-emerald-100 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-900/60 dark:text-emerald-100"
	              : "border-slate-300 bg-white text-slate-500 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
	          }`}
	          aria-label={hasUnreadInfo ? "New information available" : "Information"}
	        >
	          <BellIcon className="h-4 w-4" />
	        </Link>
	      </div>

    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header>
  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">RotorReady</h1>
  <p className="text-slate-600 dark:text-zinc-300 mt-2">Train smarter. Faster repetition for lights and limitations. Offline support for operations without internet.</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-zinc-200 uppercase">Training Modes</h2>
        <Bar
          href="/training/lights"
          title="Emergency and Malfunction"
          description="Practice emergency and malfunction procedures. Lights and Procedures."
          tone="amber"
          icon={<BoltIcon className="h-4 w-4" />}
        />
        <Bar
          href="/quiz"
          title="Quiz"
          description="Choose which quiz to take: limitations, performance, procedures, etc."
          tone="blue"
          icon={<BookIcon className="h-4 w-4" />}
        />
        {activeVariant?.id === "AW169" && (
          <Bar
            href="/training/procedures/aw169"
            title="Procedures"
            description="Browse AW169 procedures. Tap inside a procedure to return to the list."
            tone="emerald"
            icon={<BookIcon className="h-4 w-4" />}
          />
        )}
        {activeVariant?.id === "AW169" && (
          <Bar
            href="/aw169/quick-reference"
            title="Quick Reference"
            description="Key AW169 RFM limitations and numbers for quick reference."
            tone="slate"
            icon={<BookIcon className="h-4 w-4" />}
          />
        )}


      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-zinc-200 uppercase">Tools</h2>
        {hasCheckout && (
          <Bar
            href="/api/stripe/checkout"
            title="Purchase Access"
            description="Buy a subscription for full access and offline mode."
            tone="emerald"
            icon={<DownloadIcon className="h-4 w-4" />}
          />
        )}
        <Bar
          href="/offline"
          title="Offline Packages"
          description="Download ‘Chapters’ locally for offline use."
          tone="emerald"
          icon={<DownloadIcon className="h-4 w-4" />}
        />
        {activeVariant?.id === "AW169" && (
          <Bar
            href="/calculations"
            title="Calculations"
            description="Performance calculators (e.g., AW169 OEI OGE headwind)."
            tone="slate"
          />
        )}
        <Bar
          href="/weather"
          title="Weather planning"
          description="Nearest ICAO airports in Norway. METAR/TAF + alternates."
          tone="slate"
        />
        <Bar
          href="/airports"
          title="Airports"
          description="Browse all Norwegian airports from Avinor AIS; see ATS & fuel opening hours."
          tone="slate"
        />

        <Bar
          href="/account"
          title="My Page"
          description="See progress, adjust helicopter preferences (locally stored)."
        />
      </section>

      {ver && (
        <footer className="pt-2 text-xs text-slate-500 dark:text-zinc-400">
          <div>Data: {ver.version} — QRH: {ver.qrhVersion} — RFM: {ver.rfmVersion}</div>
        </footer>
      )}
    </div>
  </> );
}

