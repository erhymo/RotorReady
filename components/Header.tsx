import Link from "next/link";
import ClientUserMenu from "@/components/ClientUserMenu";

export function Header() {
			return (
				<div className="w-full border-b border-slate-200/70 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:bg-zinc-950/90 dark:border-zinc-800 dark:text-zinc-100">
					<div className="mx-auto max-w-6xl h-16 px-6 flex items-center gap-4">
					{/* Logo / Brand */}
					<Link href="/" className="flex items-center gap-3 group">
								<div className="h-8 w-8 rounded-md bg-sky-500/20 ring-1 ring-sky-300/50 grid place-items-center dark:bg-sky-900/40 dark:ring-sky-800/60">
									<div className="h-3 w-3 rounded-sm bg-sky-600 dark:bg-sky-400" />
								</div>
								<div className="leading-tight">
									<div className="font-semibold tracking-tight text-slate-900 dark:text-white">
										RotorReady
									</div>
									<div className="text-xs text-slate-500 dark:text-zinc-300 -mt-0.5">Be Prepared</div>
								</div>
					</Link>
				<Link href="/" className="ml-2 flex items-center gap-1 px-2 py-1 rounded hover:bg-sky-100 text-sky-700 font-semibold text-sm transition group/home dark:hover:bg-zinc-800 dark:text-sky-300">
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
					<Link href="/admin/dashboard" className="text-sky-700 hover:text-sky-900 font-medium dark:text-sky-400 dark:hover:text-sky-200">
							Admin
						</Link>
						<ClientUserMenu />
					</nav>
				</div>
			</div>
		);
}
