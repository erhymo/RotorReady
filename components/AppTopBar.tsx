"use client";

import type { ReactNode } from "react";

import TopBarBackButton from "@/components/TopBarBackButton";

type AppTopBarProps = {
  title: string;
  backHref?: string;
  backLabel?: string;
  rightAction?: ReactNode;
  className?: string;
};

export default function AppTopBar({
  title,
  backHref = "/",
  backLabel = "Back",
  rightAction,
  className = "",
}: AppTopBarProps) {
  return (
    <div
      className={`sticky z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 ${className}`}
      style={{ top: "calc(4rem + env(safe-area-inset-top, 0px))" }}
    >
      <div className="mx-auto grid h-12 max-w-5xl grid-cols-[minmax(72px,1fr)_auto_minmax(72px,1fr)] items-center gap-3 px-4 sm:px-6">
        <div className="justify-self-start">
          <TopBarBackButton href={backHref} label={backLabel} />
        </div>
        <h1 className="min-w-0 max-w-[48vw] truncate text-center text-sm font-semibold tracking-wide text-slate-900 dark:text-zinc-100 sm:max-w-none sm:text-base">
          {title}
        </h1>
        <div className="justify-self-end">{rightAction}</div>
      </div>
    </div>
  );
}
