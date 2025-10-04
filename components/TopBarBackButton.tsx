"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback } from "react";

export default function TopBarBackButton({ href, label = "Tilbake", className = "" }: { href?: string; label?: string; className?: string }) {
  const router = useRouter();

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else if (href) {
        router.push(href);
      } else {
        router.push("/");
      }
    },
    [router, href]
  );

  return (
    <Link
      href={href || "/"}
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 " +
        className
      }
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="text-slate-600 dark:text-zinc-300">
        <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </Link>
  );
}

