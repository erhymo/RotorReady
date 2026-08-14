"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BellIcon } from "@/components/Icons";
import { INFO_STORAGE_KEY, LATEST_INFO_VERSION } from "@/lib/info/infoConstants";

export default function InfoBell() {
  // Start false to match the server-rendered HTML, then read localStorage
  // after mount — reading it during the initial render would make that
  // render diverge from the server output (a hydration mismatch) for any
  // user with unread info, which is most new visitors.
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
		    <div className="inline-flex items-center gap-2">
		      <span
		        className="inline-flex items-center rounded-full border border-emerald-600/40 bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 select-none sm:hidden"
		        title="In production"
		      >
		        Prod
		      </span>
		      <span className="hidden items-center gap-1 rounded-full border border-emerald-600/40 bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 select-none sm:inline-flex">
		        In production
		      </span>
	      <Link
	        href="/info"
	        prefetch={false}
		        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xs shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
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

