import Link from "next/link";
import ClientUserMenu from "@/components/ClientUserMenu";

export default function Header() {
  return (
    <div className="w-full border-b border-slate-200/70 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:bg-zinc-950/90 dark:border-zinc-800 dark:text-zinc-100">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
        {/* Logo / Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-sky-500/20 ring-1 ring-sky-300/50 dark:bg-sky-900/40 dark:ring-sky-800/60">
            <div className="h-3 w-3 rounded-sm bg-sky-600 dark:bg-sky-400" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-slate-900 dark:text-white">RotorReady</div>
            <div className="-mt-0.5 text-xs text-slate-500 dark:text-zinc-300">Be Prepared</div>
          </div>
        </Link>
        <Link
          href="/"
          className="group/home ml-2 flex items-center gap-1 rounded px-2 py-1 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 dark:text-sky-300 dark:hover:bg-zinc-800"
        >
          <span className="text-lg">🏠</span>
          <span className="sr-only">Hjem</span>
        </Link>

        {/* Right side actions */}
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/offline" className="text-slate-700 hover:text-slate-900 dark:text-zinc-200 dark:hover:text-white">
            Offline
          </Link>
          <Link href="/account" className="text-slate-700 hover:text-slate-900 dark:text-zinc-200 dark:hover:text-white">
            Account
          </Link>
          <ClientUserMenu />
        </nav>
      </div>
    </div>
  );
}
