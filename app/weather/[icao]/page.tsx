"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import { NO_AIRPORTS } from "@/lib/airports/no_icao";
import { distanceNm } from "@/lib/geo/haversine";
import { parseCeilingFt } from "@/lib/weather/decode";

import { NO_AIRPORT_FEATURES } from "@/lib/airports/no_features";

type Wx = {
  icao: string;
  metarRaw?: string;
  tafRaw?: string;
  green?: boolean;
  isAMD?: boolean;
};

export default function WeatherDetail() {
  const router = useRouter();
  const params = useParams<{ icao?: string }>();
  const icao = (params?.icao || "").toUpperCase();
  const airport = NO_AIRPORTS.find((a) => a.icao === icao) || null;

  const alternates = useMemo(() => {
    if (!airport) return [] as typeof NO_AIRPORTS;
    const list = NO_AIRPORTS
      .filter((a) => a.icao !== airport.icao)
      .map((a) => ({ ...a, distNm: distanceNm(airport.lat, airport.lon, a.lat, a.lon) }))
      .filter((a) => a.distNm <= 150)
      .sort((a, b) => a.distNm - b.distNm)
      .slice(0, 4);
    return list as typeof NO_AIRPORTS;
  }, [airport]);

  const [data, setData] = useState<Record<string, Wx>>({});

  useEffect(() => {
    let active = true;
    async function load() {
      const targets = airport ? [airport, ...alternates] : [];
      if (targets.length === 0) return;
      const entries = await Promise.all(
        targets.map(async (a) => {
          try {
            const res = await fetch(`/api/weather/metar-taf?icao=${a.icao}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const metarRaw: string | undefined = json?.metar?.raw;
            const tafRaw: string | undefined = json?.taf?.raw;
            const metarCeil = metarRaw ? parseCeilingFt(metarRaw) : null;
            const tafCeil = tafRaw ? parseCeilingFt(tafRaw) : null;
            const metarOk = metarRaw ? (metarCeil == null ? true : metarCeil > 1500) : false;
            const tafOk = tafRaw ? (tafCeil == null ? true : tafCeil > 1500) : null;
            const green = tafRaw ? (metarOk && !!tafOk) : metarOk;
            const isAMD: boolean | undefined = json?.taf?.isAMD ?? undefined;
            return [a.icao, { icao: a.icao, metarRaw, tafRaw, green, isAMD } as Wx] as const;
          } catch (e) {
            console.warn("wx fetch failed", a.icao, e);
            return [a.icao, { icao: a.icao }] as const;
          }
        })
      );
      if (active) {
        const obj: Record<string, Wx> = {};
        for (const [key, wx] of entries as unknown as [string, Wx][]) {
          obj[key] = wx;
        }
        setData(obj);
      }
    }
    load();
    const id = setInterval(load, 120_000); // auto-refresh every 2 min
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [airport?.icao, alternates.map((a) => a.icao).join(",")]);

  if (!airport) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <button type="button" onClick={() => router.back()} className="text-sm text-slate-600 dark:text-zinc-300 hover:underline">← Back</button>
        <h1 className="text-2xl font-bold">Unknown airport</h1>
        <p className="text-slate-600 dark:text-zinc-300">ICAO {icao} not in Norway list yet.</p>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header>
        <div className="mb-2">
          <button type="button" onClick={() => router.back()} className="text-sm text-slate-600 dark:text-zinc-300 hover:underline">← Back</button>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {airport.icao} <span className="text-slate-600 dark:text-zinc-300 font-normal">{airport.name}</span>
        </h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-1">METAR/TAF for selected airport and 4 nearest alternates.</p>
      </header>

      <section className="space-y-6">
        {/* Primary (fixed at top, not clickable) */}
        <div className="rounded-xl border">
          <div className="relative block px-4 py-4 space-y-3">
            {(() => {
              const a = airport;
              const wx = data[a.icao];
              const f = NO_AIRPORT_FEATURES[a.icao];
              return (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{a.icao} <span className="text-slate-600 dark:text-zinc-300 font-normal">{a.name}</span></div>
                      {/* primary has no distance line */}
                    </div>
                    <span className={`h-2.5 w-2.5 rounded-full ${wx?.green ? "bg-emerald-500" : "bg-slate-300 dark:bg-zinc-600"}`}></span>
                  </div>
                  <div className="text-sm text-slate-700 dark:text-zinc-200">
                    <span className="font-medium">METAR:</span> {wx?.metarRaw || <span className="text-slate-400">(loading…)</span>}
                  </div>
                  <div className="text-sm text-slate-700 dark:text-zinc-200">
                    <span className="font-medium">{wx?.isAMD ? "AMD TAF" : "TAF"}:</span> {wx?.tafRaw || <span className="text-slate-400">(loading…)</span>}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-zinc-300 flex items-center gap-3">
                    <div>RWY: <span className="font-medium">{f?.runways?.join(", ") || "—"}</span></div>
                    <div className="flex gap-1">
                      {f?.ils ? <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold border-slate-300 dark:border-zinc-700">ILS</span> : null}
                      {f?.rnp ? <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold border-slate-300 dark:border-zinc-700">RNP</span> : null}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Alternates within 150 nm */}
        <div className="pt-2">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-2">Alternates within 150 nm</div>
          <ul className="divide-y rounded-xl border">
            {alternates.map((a) => {
              const wx = data[a.icao];
              const f = NO_AIRPORT_FEATURES[a.icao];
              return (
                <li key={a.icao} className="p-0">
                  <Link href={`/weather/${a.icao}`} className="relative block px-4 py-4 space-y-3 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{a.icao} <span className="text-slate-600 dark:text-zinc-300 font-normal">{a.name}</span></div>
                        <div className="text-xs text-slate-500 dark:text-zinc-400">{distanceNm(airport.lat, airport.lon, a.lat, a.lon).toFixed(0)} nm</div>
                      </div>
                      <span className={`h-2.5 w-2.5 rounded-full ${wx?.green ? "bg-emerald-500" : "bg-slate-300 dark:bg-zinc-600"}`}></span>
                    </div>
                    <div className="text-sm text-slate-700 dark:text-zinc-200">
                      <span className="font-medium">METAR:</span> {wx?.metarRaw || <span className="text-slate-400">(loading…)</span>}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-zinc-200">
                      <span className="font-medium">{wx?.isAMD ? "AMD TAF" : "TAF"}:</span> {wx?.tafRaw || <span className="text-slate-400">(loading…)</span>}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-zinc-300 flex items-center gap-3">
                      <div>RWY: <span className="font-medium">{f?.runways?.join(", ") || "—"}</span></div>
                      <div className="flex gap-1">
                        {f?.ils ? <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold border-slate-300 dark:border-zinc-700">ILS</span> : null}
                        {f?.rnp ? <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold border-slate-300 dark:border-zinc-700">RNP</span> : null}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="text-xs text-slate-500 dark:text-zinc-400 space-y-1">
        <div>Provider: MET Norway (tafmetar/1.0). Green dot = METAR ceiling &gt; 1500 ft and TAF (any period) has no BKN/OVC/VV below 1500 ft. If TAF is missing, METAR alone is used.</div>
        <div>Auto-refresh every 2 minutes. Privacy: Uses browser geolocation (with permission); no location data is sent to the server.</div>
      </div>
    </div>
  );
}

