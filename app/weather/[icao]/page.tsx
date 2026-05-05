"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";

import { NO_AIRPORTS } from "@/lib/airports/no_icao";
import { NO_AIRPORT_FEATURES } from "@/lib/airports/no_features";
import { getAirportMinima } from "@/lib/airports/no_minima";
import { distanceNm } from "@/lib/geo/haversine";
import { decodeTafChunks, parseIssueTimeUtc, minutesSince, formatAgeMinutes } from "@/lib/weather/decode";
import type { TafChunk } from "@/lib/weather/decode";

type Wx = {
  icao: string;
  metarRaw?: string;
  tafRaw?: string;
  tafChunks?: TafChunk[];
  isAMD?: boolean;
};

type DayNight = {
  hasData: boolean;
  dayStartLocal?: string | null; // civil twilight begin (morning)
  nightStartLocal?: string | null; // civil twilight end (evening)
  sunriseLocal?: string | null;
  sunsetLocal?: string | null;
};

const TAF_STATUS_CLASS: Record<"green" | "yellow" | "red", string> = {
  green:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700",
  yellow:
    "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700",
  red:
    "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-700",
};

export default function WeatherDetail() {
  const params = useParams<{ icao?: string }>();
  const icao = (params?.icao || "").toUpperCase();
  const airport = NO_AIRPORTS.find((a) => a.icao === icao) || null;

  const alternates = useMemo(() => {
    if (!airport) return [] as typeof NO_AIRPORTS;
    const withDist = NO_AIRPORTS
      .filter((a) => a.icao !== airport.icao)
      .map((a) => ({
        ...a,
        distNm: distanceNm(airport.lat, airport.lon, a.lat, a.lon),
      }))
      .filter((a) => a.distNm <= 200);

    const ilsFirst = withDist
      .filter((a) => NO_AIRPORT_FEATURES[a.icao]?.ils)
      .sort((a, b) => a.distNm - b.distNm);

    const nonIls = withDist
      .filter((a) => !NO_AIRPORT_FEATURES[a.icao]?.ils)
      .sort((a, b) => a.distNm - b.distNm);

    const ordered = [...ilsFirst, ...nonIls].slice(0, 5).map(({ distNm, ...rest }) => rest);

    return ordered as typeof NO_AIRPORTS;
  }, [airport]);

  const [data, setData] = useState<Record<string, Wx>>({});
  const [dayNight, setDayNight] = useState<DayNight | null>(null);

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
            const metarRaw: string | undefined = json?.metar?.raw || undefined;
            const tafRaw: string | undefined = json?.taf?.raw || undefined;
            const minima = getAirportMinima(a.icao);
            const tafChunks: TafChunk[] | undefined = tafRaw ? decodeTafChunks(tafRaw, minima) : undefined;
            const isAMD: boolean | undefined = json?.taf?.isAMD ?? undefined;
            return [a.icao, { icao: a.icao, metarRaw, tafRaw, tafChunks, isAMD } as Wx] as const;
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

  useEffect(() => {
    let active = true;

    async function loadDayNight() {
      if (!airport) {
        if (active) setDayNight(null);
        return;
      }

      // Only show defined day/night times for ILS airports (larger fields), plus Hammerfest (ENHF) which we use frequently
      const features = NO_AIRPORT_FEATURES[airport.icao];
      const allowDayNight = features?.ils || airport.icao === "ENHF";
      if (!allowDayNight) {
        if (active) setDayNight(null);
        return;
      }

      try {
        const res = await fetch(`/api/weather/daynight?icao=${airport.icao}`, { cache: "no-store" });
        if (!res.ok) {
          if (active) setDayNight(null);
          return;
        }
        const json = await res.json();
        if (!active) return;

        if (!json?.hasData) {
          setDayNight({ hasData: false });
        } else {
          setDayNight({
            hasData: true,
            dayStartLocal: json.dayStartLocal || null,
            nightStartLocal: json.nightStartLocal || null,
            sunriseLocal: json.sunriseLocal || null,
            sunsetLocal: json.sunsetLocal || null,
          });
        }
      } catch {
        if (active) setDayNight(null);
      }
    }

    loadDayNight();

    return () => {
      active = false;
    };
  }, [airport?.icao]);

  if (!airport) {
    return (
      <>
      <AppTopBar title="Unknown airport" backHref="/weather" backLabel="Weather" />
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Unknown airport</h1>
        <p className="text-slate-600 dark:text-zinc-300">ICAO {icao} is not in the current airport list.</p>
      </div>
      </>
    );
  }


  return (
    <>
    <AppTopBar
      title={airport.icao}
      backHref="/weather"
      backLabel="Weather"
	      rightAction={<Link href="/weather/all" className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">Airports</Link>}
    />
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {airport.icao} <span className="text-slate-600 dark:text-zinc-300 font-normal">{airport.name}</span>
        </h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-1">METAR and TAF (color-coded) for selected airport and 5 nearest alternates within 200 nm.</p>
      </header>

      <section className="space-y-6">
        {/* Primary (fixed at top, not clickable) */}
	        <div className="rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
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
                    {dayNight?.hasData && (
                      <div className="flex flex-col items-end text-xs text-slate-600 dark:text-zinc-300">
                        {dayNight.dayStartLocal && dayNight.sunriseLocal && (
                          <div className="flex items-center gap-1">
                            <span>{"\u2600"}</span>
                            <span>{dayNight.dayStartLocal} - {dayNight.sunriseLocal}</span>
                          </div>
                        )}
                        {dayNight.sunsetLocal && dayNight.nightStartLocal && (
                          <div className="flex items-center gap-1">
                            <span>{"\u263E"}</span>
                            <span>{dayNight.sunsetLocal} - {dayNight.nightStartLocal}</span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                  {(() => {
                    const m = wx?.metarRaw ? parseIssueTimeUtc(wx.metarRaw) : null;
                    const age = m ? minutesSince(m) : null;
                    return age != null ? (
                      <div className="text-xs text-slate-500 dark:text-zinc-400">{formatAgeMinutes(age)}</div>
                    ) : null;
                  })()}
                  <div className="text-sm text-slate-700 dark:text-zinc-200">
                    <span className="font-medium">METAR:</span> {wx?.metarRaw || <span className="text-slate-400">(loading…)</span>}
                  </div>
                  {(() => {
                    const t = wx?.tafRaw ? parseIssueTimeUtc(wx.tafRaw) : null;
                    const age = t ? minutesSince(t) : null;
                    return age != null ? (
                      <div className="text-xs text-slate-500 dark:text-zinc-400">{formatAgeMinutes(age)}</div>
                    ) : null;
                  })()}
                  <div className="text-sm text-slate-700 dark:text-zinc-200">
                    <span className="font-medium">{wx?.isAMD ? "AMD TAF" : "TAF"}:</span>
                    {wx?.tafChunks && wx.tafChunks.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {wx.tafChunks.map((chunk, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                              chunk.visibilityM != null || chunk.ceilingFt != null
                                ? TAF_STATUS_CLASS[chunk.status]
                                : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-900/40 dark:text-zinc-200 dark:border-zinc-700"
                            }`}
                          >
                            {chunk.text}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400"> {wx?.tafRaw || "(loading…)"}</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-zinc-300 flex items-center gap-3">
                    <div>
                      RWY: <span className="font-medium">{f?.runways?.join(", ") || "—"}</span>
                    </div>
                    <div className="flex gap-1">
                      {f?.ils ? (
                        <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold border-slate-300 dark:border-zinc-700">
                          ILS
                        </span>
                      ) : null}
                      {f?.rnp ? (
                        <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold border-slate-300 dark:border-zinc-700">
                          RNP
                        </span>
                      ) : null}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Alternates within 200 nm */}
        <div className="pt-2">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-2">
            Alternates within 200 nm (5 nearest)
          </div>
	          <ul className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:divide-zinc-800">
            {alternates.map((a) => {
              const wx = data[a.icao];
              const f = NO_AIRPORT_FEATURES[a.icao];
              return (
                <li key={a.icao} className="p-0">
                  <div className="relative block px-4 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">
                          {a.icao} <span className="text-slate-600 dark:text-zinc-300 font-normal">{a.name}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-zinc-400">
                          {distanceNm(airport.lat, airport.lon, a.lat, a.lon).toFixed(0)} nm
                        </div>
                      </div>
                    </div>
                    {(() => {
                      const m = wx?.metarRaw ? parseIssueTimeUtc(wx.metarRaw) : null;
                      const age = m ? minutesSince(m) : null;
                      return age != null ? (
                        <div className="text-xs text-slate-500 dark:text-zinc-400">{formatAgeMinutes(age)}</div>
                      ) : null;
                    })()}
                    <div className="text-sm text-slate-700 dark:text-zinc-200">
                      <span className="font-medium">METAR:</span> {wx?.metarRaw || <span className="text-slate-400">(loading…)</span>}
                    </div>
                    {(() => {
                      const t = wx?.tafRaw ? parseIssueTimeUtc(wx.tafRaw) : null;
                      const age = t ? minutesSince(t) : null;
                      return age != null ? (
                        <div className="text-xs text-slate-500 dark:text-zinc-400">{formatAgeMinutes(age)}</div>
                      ) : null;
                    })()}
                    <div className="text-sm text-slate-700 dark:text-zinc-200">
                      <span className="font-medium">{wx?.isAMD ? "AMD TAF" : "TAF"}:</span>
                      {wx?.tafChunks && wx.tafChunks.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {wx.tafChunks.map((chunk, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                chunk.visibilityM != null || chunk.ceilingFt != null
                                  ? TAF_STATUS_CLASS[chunk.status]
                                  : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-900/40 dark:text-zinc-200 dark:border-zinc-700"
                              }`}
                            >
                              {chunk.text}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400"> {wx?.tafRaw || "(loading…)"}</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-zinc-300 flex items-center gap-3">
                      <div>
                        RWY: <span className="font-medium">{f?.runways?.join(", ") || "—"}</span>
                      </div>
                      <div className="flex gap-1">
                        {f?.ils ? (
                          <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold border-slate-300 dark:border-zinc-700">
                            ILS
                          </span>
                        ) : null}
                        {f?.rnp ? (
                          <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold border-slate-300 dark:border-zinc-700">
                            RNP
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="text-xs text-slate-500 dark:text-zinc-400 space-y-1">
        <div>
          Provider: aviation weather APIs (CheckWX as primary, MET Norway as fallback). TAF segments with explicit
          visibility/ceiling values are color-coded using standard ILS CAT I minima: green = no alternate, yellow = 1
          alternate, red = 2 alternates (below minima).
        </div>
        <div>Auto-refresh every 2 minutes.</div>
      </div>
    </div>
    </>
  );
}

