"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { BoltIcon, BookIcon, DownloadIcon } from "@/components/Icons";

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

export default function HomePage() {
  const [ver, setVer] = useState<any>(null);
  const hasCheckout = Boolean(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID);
  useEffect(() => {
    fetch("/quiz-data/versions/data-version.json").then(r=>r.json()).then(setVer).catch(()=>{});
  }, []);
  return (
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
          description="Download ‘Limitations’ locally for offline use."
          tone="emerald"
          icon={<DownloadIcon className="h-4 w-4" />}
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
  );
}
