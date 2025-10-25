"use client";

import Link from "next/link";

export default function AW169ProceduresListPage() {
  const procedures = [
    { title: "CLEAR AREA TAKE-OFF PROCEDURE", href: "/aw169/procedures/clear-area-take-off?plist=1" },
    { title: "CLEAR AREA CAT A LANDING PROCEDURE", href: "/aw169/procedures/clear-area-cat-a-landing-procedure?plist=1" },
    { title: "GROUND AND ELEVATED HELIPORT / HELIDECK VARIABLE TDP PROCEDURE", href: "/aw169/procedures/ground-and-elevated-heliport-helideck-variable-tdp-procedure?plist=1" },
    { title: "OFFSHORE / ELEVATED HELIDECK TAKE-OFF NORMAL PROCEDURE", href: "/aw169/procedures/offshore-elevated-helideck-take-off-normal-procedure?plist=1" },
    { title: "ENGINE SHUTDOWN IN EMERGENCY", href: "/aw169/procedures/engine-shutdown-emergency?plist=1" },
    { title: "SINGLE ENGINE PROCEDURE", href: "/aw169/procedures/single-engine?plist=1" },
    { title: "ENGINE RE-LIGHT (IN FLIGHT)", href: "/aw169/procedures/engine-re-light?plist=1" },
    { title: "GROUND OR ELEVATED HELIPAD APPROACH AND LANDING VARIABLE LDP PROCEDURE", href: "/aw169/procedures/ground-or-elevated-helipad-approach-and-landing-variable-ldp-procedure?plist=1" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">AW169 · Procedures</h1>
          <Link href="/" className="text-sm underline text-blue-600 dark:text-blue-400">Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-6 space-y-4">
        <section className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <div className="space-y-3">
            {procedures.map((p) => (
              <Link key={p.href} href={p.href} className="block rounded-lg border p-4 hover:bg-slate-50 dark:hover:bg-zinc-800 dark:border-zinc-700">
                <div className="text-slate-900 dark:text-zinc-100 font-medium">{p.title}</div>
              </Link>
            ))}
          </div>
        </section>
        <p className="text-xs text-slate-500 dark:text-zinc-400">Tap anywhere inside a procedure to return to this list.</p>
      </main>
    </div>
  );
}

