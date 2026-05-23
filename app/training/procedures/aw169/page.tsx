"use client";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";
import { useActiveModelVariant } from "@/lib/models/hooks";

export default function AW169ProceduresListPage() {
  const { variant } = useActiveModelVariant();
  const isEnhancedPerformance = variant.id === "AW169_EP";

  const procedures = [
    // Clear Area
    { title: "CLEAR AREA TAKE-OFF PROCEDURE", href: "/aw169/procedures/clear-area-take-off?plist=1" },
    { title: "CLEAR AREA CAT A LANDING PROCEDURE", href: "/aw169/procedures/clear-area-cat-a-landing-procedure?plist=1" },

    // Ground
    {
      title: "GROUND AND ELEVATED HELIPORT / HELIDECK VERTICAL PROCEDURE",
      href: "/aw169/procedures/ground-and-elevated-heliport-helideck-vertical-procedure?plist=1",
    },
    { title: "GROUND AND ELEVATED HELIPORT / HELIDECK VARIABLE TDP PROCEDURE", href: "/aw169/procedures/ground-and-elevated-heliport-helideck-variable-tdp-procedure?plist=1" },
    { title: "GROUND OR ELEVATED HELIPAD APPROACH AND LANDING VARIABLE LDP PROCEDURE", href: "/aw169/procedures/ground-or-elevated-helipad-approach-and-landing-variable-ldp-procedure?plist=1" },

    // Offshore
    { title: "OFFSHORE AND ELEVATED HELIDECK LANDING PROCEDURES", href: "/aw169/procedures/offshore-and-elevated-helideck-landing-procedures?plist=1" },
    { title: "OFFSHORE / ELEVATED HELIDECK APPROACH AND NORMAL LANDING PROCEDURE", href: "/aw169/procedures/offshore-elevated-helideck-approach-and-normal-landing-procedure?plist=1" },
    { title: "OFFSHORE / ELEVATED HELIDECK TAKE-OFF NORMAL PROCEDURE", href: "/aw169/procedures/offshore-elevated-helideck-take-off-normal-procedure?plist=1" },

    // Engine (bottom)
    { title: "ENGINE SHUTDOWN IN EMERGENCY", href: "/aw169/procedures/engine-shutdown-emergency?plist=1" },
    { title: "SINGLE ENGINE PROCEDURE", href: "/aw169/procedures/single-engine?plist=1" },
    ...(isEnhancedPerformance
      ? [{ title: "EP CAT A OEI CONTINGENCY PROCEDURES", href: "/aw169/procedures/ep-cat-a-oei-contingencies?plist=1" }]
      : []),
    { title: "ENGINE RE-LIGHT (IN FLIGHT)", href: "/aw169/procedures/engine-re-light?plist=1" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
	    <AppTopBar title={isEnhancedPerformance ? "AW169 EP Procedures" : "AW169 Procedures"} backHref="/" backLabel="Home" />

	      <main className="mx-auto max-w-3xl p-6 space-y-5">
	      <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{isEnhancedPerformance ? "AW169 EP Procedures" : "AW169 Procedures"}</h1>
	        <p className="text-sm text-slate-600 dark:text-zinc-300">
	          Browse training procedures for the selected AW169 variant. Normal profiles are reused where the EP QRH matches; EP-only OEI contingency notes are shown separately.
	        </p>
	        <section className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <div className="space-y-3">
            {procedures.map((p) => (
              <Link key={p.href} href={p.href} className="group block rounded-lg border p-4 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-zinc-800 dark:border-zinc-700">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-slate-900 dark:text-zinc-100 font-medium">{p.title}</div>
                  <div className="text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <p className="text-xs text-slate-500 dark:text-zinc-400">Use the Procedures back control to return to this list.</p>
      </main>
    </div>
  );
}

