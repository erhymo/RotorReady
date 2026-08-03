"use client";

import Link from "next/link";

export default function AbbreviationsLinkCard({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border-2 border-blue-200 bg-blue-50 p-4 transition hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-blue-800 dark:bg-blue-950/40 dark:hover:bg-blue-950/60"
    >
      <div>
        <div className="text-sm font-semibold text-blue-900 dark:text-blue-200">Abbreviations</div>
        <div className="mt-0.5 text-xs text-blue-700/80 dark:text-blue-300/70">Quick lookup for abbreviations used in these procedures</div>
      </div>
      <span className="text-blue-500 transition-transform group-hover:translate-x-0.5 dark:text-blue-400">›</span>
    </Link>
  );
}
