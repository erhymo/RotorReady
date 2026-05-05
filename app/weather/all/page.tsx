export const dynamic = "force-dynamic";

import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";
import { NO_AIRPORTS } from "@/lib/airports/no_icao";

export default function WeatherAllAirportsPage() {
  const sorted = [...NO_AIRPORTS].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
    <AppTopBar title="All airports" backHref="/weather" backLabel="Weather" />
	    <div className="max-w-4xl mx-auto p-6 space-y-5">
	      <header className="space-y-2">
	        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All airports</h1>
	        <p className="text-sm text-slate-600 dark:text-zinc-300">Tap an airport to view METAR and TAF.</p>
	      </header>
	      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:divide-zinc-800">
        {sorted.map((a) => (
          <Link
            prefetch={false}
            key={a.icao}
            href={`/weather/${a.icao}`}
	            className="block px-4 py-3.5 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-zinc-800"
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
    </div>
    </>
  );
}

