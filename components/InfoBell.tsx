"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BellIcon } from "@/components/Icons";
import { INFO_STORAGE_KEY, LATEST_INFO_VERSION } from "@/lib/info/infoConstants";

export default function InfoBell() {
  const [hasUnreadInfo, setHasUnreadInfo] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(INFO_STORAGE_KEY);
      setHasUnreadInfo(stored !== LATEST_INFO_VERSION);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/40 bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 select-none">
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
  );
}

