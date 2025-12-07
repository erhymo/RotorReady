"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientUserMenu from "./ClientUserMenu";
import ClientActiveModelBadge from "./ClientActiveModelBadge";
import InfoBell from "./InfoBell";


export default function Header() {
	  const pathname = usePathname();
	  const showInfoBell = pathname === "/";

	  return (
    <div className="w-full border-b border-slate-200/70 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:bg-zinc-950/90 dark:border-zinc-800 dark:text-zinc-100">
	      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
        {/* Logo / Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <svg viewBox="0 0 120 120" role="img" aria-label="RotorReady logo" className="h-10 w-10 transition-transform group-hover:scale-[1.02]">
            <circle cx="60" cy="60" r="56" fill="#2E6EA1" />
            <text x="60" y="66" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fontWeight="800" fontSize="58" fill="#fff">
              RR
            </text>
          </svg>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-slate-900 dark:text-white">
              RotorReady
            </div>
            <div className="-mt-0.5 text-xs text-slate-500 dark:text-zinc-300">
              Be Prepared
            </div>
          </div>
        </Link>

	        {/* Home */}
	        <Link
	          href="/"
	          className="ml-1 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
	          aria-label="Home"
	        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="text-slate-600 dark:text-zinc-300">
            <path d="M3 11l9-7 9 7v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3z" fill="currentColor" />
          </svg>
          Home
        </Link>

		        {/* Active model indicator (mobile + desktop), with info bell only visible under it on small screens */}
		        <div className="relative flex items-center">
		          <ClientActiveModelBadge />
		          {/* Info bell stacked directly under the active model badge on home, mobile only */}
		          {showInfoBell && (
		            <div className="absolute right-0 top-full mt-4 md:hidden">
		              <InfoBell />
		            </div>
		          )}
		        </div>

	        {/* Right-side nav (hidden on mobile to avoid horizontal scroll) */}
	        <nav className="ml-auto hidden md:flex items-center gap-4 text-sm">
	          <Link
	            href="/offline"
	            className="text-slate-700 hover:text-slate-900 dark:text-zinc-200 dark:hover:text-white"
	          >
	            Offline
	          </Link>
	          <Link
	            href="/account"
	            className="text-slate-700 hover:text-slate-900 dark:text-zinc-200 dark:hover:text-white"
	          >
	            Account
	          </Link>
	          {/* User menu; on desktop, show info bell under the account name without moving it */}
	          <div className="relative">
	            <ClientUserMenu />
	            {showInfoBell && (
	              <div className="absolute right-0 top-full mt-2 hidden md:block">
	                <InfoBell />
	              </div>
	            )}
	          </div>
	        </nav>
      </div>
    </div>
  );
}
