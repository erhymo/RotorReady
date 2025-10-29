export const dynamic = "force-dynamic";

import Link from "next/link";
import { NO_AIRPORTS } from "@/lib/airports/no_icao";

export default function AirportsPage() {
  const sorted = [...NO_AIRPORTS].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Airports</h1>
      <p className="text-slate-600 dark:text-zinc-300 mb-2">All Norwegian ICAO airports (source: Avinor AIS). Tap an airport to see ATS & Fuel opening hours.</p>
      <div className="divide-y divide-slate-200 dark:divide-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {sorted.map((a) => (
          <Link
            prefetch={false}
            key={a.icao}
            href={`/airports/${a.icao}`}
            className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900 dark:text-zinc-100">{a.name}</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400">{a.icao} — {a.lat.toFixed(4)}, {a.lon.toFixed(4)}</div>
              </div>
              <div className="text-slate-400 dark:text-zinc-400">›</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-xs text-slate-500 dark:text-zinc-400">Updated twice daily from Avinor AIS (cached 12h).</div>
    </div>
  );
}

