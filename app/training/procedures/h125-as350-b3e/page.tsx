"use client";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";

export default function H125AS350B3eProceduresListPage() {
  const procedures = [
    {
      title: "ENGINE PRESTART CHECK",
      href: "/h125-as350-b3e/procedures/before-start-and-pre-start-checks?plist=1",
    },
    {
      title: "ENGINE STARTING",
      href: "/h125-as350-b3e/procedures/engine-start-normal?plist=1",
    },
    {
      title: "RUN-UP CHECK & BEFORE TAKEOFF CHECK",
      href: "/h125-as350-b3e/procedures/before-take-off-and-hover-check?plist=1",
    },
    {
      title: "TAKEOFF CHECK AND PROCEDURE",
      href: "/h125-as350-b3e/procedures/take-off-and-initial-climb?plist=1",
    },
    {
      title: "CLIMB, CRUISE, APPROACH & LANDING",
      href: "/h125-as350-b3e/procedures/climb-cruise-approach-landing?plist=1",
    },
    {
      title: "ENGINE AND ROTOR SHUTDOWN",
      href: "/h125-as350-b3e/procedures/shutdown-and-securing-helicopter?plist=1",
    },
    {
      title: "ENGINE HEALTH CHECK PROCEDURE",
      href: "/h125-as350-b3e/procedures/engine-health-check?plist=1",
    },
    {
      title: "CRANKING PROCEDURE",
      href: "/h125-as350-b3e/procedures/cranking-procedure?plist=1",
    },
    {
      title: "ENGINE FLAME-OUT & AUTOROTATION",
      href: "/h125-as350-b3e/procedures/engine-flame-out-and-autorotation?plist=1",
    },
    {
      title: "TAIL ROTOR FAILURES",
      href: "/h125-as350-b3e/procedures/tail-rotor-failures?plist=1",
    },
    {
      title: "SMOKE IN THE CABIN",
      href: "/h125-as350-b3e/procedures/smoke-in-cabin?plist=1",
    },
    {
      title: "ENGINE FIRE, GOVERNOR & FADEC FAILURES",
      href: "/h125-as350-b3e/procedures/engine-fire-and-governor-failures?plist=1",
    },
    {
      title: "TRANSMISSION & HYDRAULIC FAILURES",
      href: "/h125-as350-b3e/procedures/transmission-and-hydraulic-failures?plist=1",
    },
    {
      title: "ELECTRICAL & FUEL ALARMS",
      href: "/h125-as350-b3e/procedures/electrical-and-fuel-alarms?plist=1",
    },
    {
      title: "VEMD SCREEN, NR/N2 & PARAMETER FAILURES",
      href: "/h125-as350-b3e/procedures/vemd-and-instrument-failures?plist=1",
    },
    {
      title: "FLIGHT CONTROL HARDOVER & OTHER WARNINGS",
      href: "/h125-as350-b3e/procedures/flight-control-and-misc-warnings?plist=1",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="H125 / AS350 B3e Procedures" backHref="/" backLabel="Home" />

      <main className="mx-auto max-w-3xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">H125 / AS350 B3e Procedures</h1>
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
