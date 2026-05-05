"use client";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";

export default function H125AS350B3_2B1ProceduresListPage() {
  const procedures = [
    {
      title: "BEFORE START / PREFLIGHT AND PRE-START CHECKS",
      href: "/h125-as350-b3-2b1/procedures/before-start-and-pre-start-checks?plist=1",
    },
    {
      title: "ENGINE START – NORMAL PROCEDURE",
      href: "/h125-as350-b3-2b1/procedures/engine-start-normal?plist=1",
    },
    {
      title: "BEFORE TAKE-OFF / HOVER CHECK",
      href: "/h125-as350-b3-2b1/procedures/before-take-off-and-hover-check?plist=1",
    },
    {
      title: "TAKE-OFF AND INITIAL CLIMB",
      href: "/h125-as350-b3-2b1/procedures/take-off-and-initial-climb?plist=1",
    },
	    {
	      title: "CLIMB",
	      href: "/h125-as350-b3-2b1/procedures/climb?plist=1",
	    },
	    {
	      title: "CRUISE FLIGHT AND MANEUVERS",
	      href: "/h125-as350-b3-2b1/procedures/cruise-and-maneuvers?plist=1",
	    },
	    {
	      title: "DESCENT AND APPROACH",
	      href: "/h125-as350-b3-2b1/procedures/descent-and-approach?plist=1",
	    },
    {
      title: "APPROACH AND LANDING – NORMAL",
      href: "/h125-as350-b3-2b1/procedures/approach-and-landing-normal?plist=1",
    },
    {
      title: "ENGINE SHUTDOWN AND SECURING THE HELICOPTER",
      href: "/h125-as350-b3-2b1/procedures/shutdown-and-securing-helicopter?plist=1",
    },
    {
      title: "ENGINE HEALTH CHECK PROCEDURE",
      href: "/h125-as350-b3-2b1/procedures/engine-health-check?plist=1",
    },
    {
      title: "CRANKING PROCEDURE",
      href: "/h125-as350-b3-2b1/procedures/cranking-procedure?plist=1",
    },
    {
      title: "AFTER COCKPIT FIRE EXTINGUISHER USE",
      href: "/h125-as350-b3-2b1/procedures/after-cockpit-fire-extinguisher-use?plist=1",
    },
    {
      title: "TAIL ROTOR FAILURE – HANDLING AND LANDING",
      href: "/h125-as350-b3-2b1/procedures/tail-rotor-failure-handling-and-landing?plist=1",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
	    <AppTopBar title="H125 / AS350 B3 (2B1) Procedures" backHref="/" backLabel="Home" />

	      <main className="mx-auto max-w-3xl p-6 space-y-5">
	      <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">H125 / AS350 B3 (2B1) Procedures</h1>
	        <p className="text-sm text-slate-600 dark:text-zinc-300">
	          Browse normal and emergency training procedures. Each procedure opens as a focused reference view with a clear return path.
	        </p>
	        <section className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <div className="space-y-3">
            {procedures.map((p) => (
              <Link
                key={p.href}
                href={p.href}
	                className="group block rounded-lg border p-4 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-zinc-800 dark:border-zinc-700"
              >
	                <div className="flex items-center justify-between gap-3">
	                  <div className="text-slate-900 dark:text-zinc-100 font-medium">{p.title}</div>
	                  <div className="text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
	                </div>
              </Link>
            ))}
          </div>
        </section>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
		        Use the Procedures back control to return to this list.
        </p>
      </main>
    </div>
  );
}
