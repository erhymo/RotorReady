"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function WeatherHubClient() {
  const router = useRouter();
  const [pos, setPos] = useState<{ lat: number; lon: number } | null>(null);
  const [geoErr, setGeoErr] = useState<string | null>(null);
  const [primaryWx, setPrimaryWx] = useState<Wx | null>(null);
  const [primaryDayNight, setPrimaryDayNight] = useState<DayNight | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoErr("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (res) => {
        setPos({ lat: res.coords.latitude, lon: res.coords.longitude });
      },
      (err) => setGeoErr(err.message),
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 8_000 }
    );
  }, []);

  const nearestSorted = useMemo(() => {
    const list = NO_AIRPORTS.map((a) => ({
      ...a,
      distNm: pos ? distanceNm(pos.lat, pos.lon, a.lat, a.lon) : null,
    }));
    list.sort((a, b) => {
      if (a.distNm == null && b.distNm == null) return a.icao.localeCompare(b.icao);
      if (a.distNm == null) return 1;
      if (b.distNm == null) return -1;
      return a.distNm - b.distNm;
    });
    return list;
  }, [pos]);

  const primary = useMemo(() => (nearestSorted.length ? nearestSorted[0] : null), [nearestSorted]);

  // Load METAR/TAF for the nearest airport (if geolocation is available)
  useEffect(() => {
    let active = true;
    async function load() {
      if (!primary || geoErr) {
        if (active) setPrimaryWx(null);
        return;
      }
      try {
        const res = await fetch(`/api/weather/metar-taf?icao=${primary.icao}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const metarRaw: string | undefined = json?.metar?.raw || undefined;
        const tafRaw: string | undefined = json?.taf?.raw || undefined;
        const minima = getAirportMinima(primary.icao);
        const tafChunks: TafChunk[] | undefined = tafRaw ? decodeTafChunks(tafRaw, minima) : undefined;
        const isAMD: boolean | undefined = json?.taf?.isAMD ?? undefined;
        if (active) {
          setPrimaryWx({ icao: primary.icao, metarRaw, tafRaw, tafChunks, isAMD });
        }
      } catch (e) {
        console.warn("wx fetch failed", primary?.icao, e);
        if (active) setPrimaryWx(null);

      }
    }
    load();
    const id = setInterval(load, 120_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [primary?.icao, geoErr]);
  // Load defined day/night and twilight intervals for the nearest airport (same as detail page header)
  useEffect(() => {
    let active = true;

    async function loadDayNight() {
      if (!primary || geoErr) {
        if (active) setPrimaryDayNight(null);
        return;
      }

      const features = NO_AIRPORT_FEATURES[primary.icao];
      const allowDayNight = features?.ils || primary.icao === "ENHF";
      if (!allowDayNight) {
        if (active) setPrimaryDayNight(null);
        return;
      }

      try {
        const res = await fetch(`/api/weather/daynight?icao=${primary.icao}`, { cache: "no-store" });
        if (!res.ok) {
          if (active) setPrimaryDayNight(null);
          return;
        }
        const json = await res.json();
        if (!active) return;

        if (!json?.hasData) {
          setPrimaryDayNight({ hasData: false });
        } else {
          setPrimaryDayNight({
            hasData: true,
            dayStartLocal: json.dayStartLocal || null,
            nightStartLocal: json.nightStartLocal || null,
            sunriseLocal: json.sunriseLocal || null,
            sunsetLocal: json.sunsetLocal || null,
          });
        }
      } catch {
        if (active) setPrimaryDayNight(null);
      }
    }

    loadDayNight();

    return () => {
      active = false;
    };
  }, [primary?.icao, geoErr]);



  const sortedByIcao = useMemo(() => {
    return [...NO_AIRPORTS].sort((a, b) => a.icao.localeCompare(b.icao));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Weather planning</h1>
          <p className="text-slate-600 dark:text-zinc-300 text-sm mt-1">
            Nearest airport at the top (if location is available), then full list of Norwegian airports.
          </p>
        </div>
        <a
          href="/weather/all"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          All Airports
        </a>
      </header>

      {primary && !geoErr && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Nearest airport</h2>
          <button
            type="button"
            onClick={() => router.push(`/weather/${primary.icao}`)}
            className="w-full rounded-xl border text-left hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition"
          >
            <div className="relative block px-4 py-4 space-y-3">
              {(() => {
                const a = primary;
                const wx = primaryWx && primaryWx.icao === a.icao ? primaryWx : null;
                const f = NO_AIRPORT_FEATURES[a.icao];
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">
                          {a.icao}{" "}
                          <span className="text-slate-600 dark:text-zinc-300 font-normal">{a.name}</span>
                        </div>
                        {a.distNm != null && (
                          <div className="text-xs text-slate-500 dark:text-zinc-400">
                            ~{a.distNm.toFixed(0)} nm away
                          </div>
                        )}
                      </div>
                      {primaryDayNight?.hasData && (
                        <div className="flex flex-col items-end text-xs text-slate-600 dark:text-zinc-300">
                          {primaryDayNight.dayStartLocal && primaryDayNight.sunriseLocal && (
                            <div className="flex items-center gap-1">
                              <span>{"\u2600"}</span>
                              <span>{primaryDayNight.dayStartLocal} - {primaryDayNight.sunriseLocal}</span>
                            </div>
                          )}
                          {primaryDayNight.sunsetLocal && primaryDayNight.nightStartLocal && (
                            <div className="flex items-center gap-1">
                              <span>{"\u263E"}</span>
                              <span>{primaryDayNight.sunsetLocal} - {primaryDayNight.nightStartLocal}</span>
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
                      <span className="font-medium">METAR:</span>{" "}
                      {wx?.metarRaw || <span className="text-slate-400">(loading...)</span>}
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
                        <span className="text-slate-400"> {wx?.tafRaw || "(loading...)"}</span>
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
          </button>
        </section>
      )}

      {geoErr && (
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Location unavailable: {geoErr}. You can still browse all airports below.
        </p>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-zinc-200">All Norwegian airports</h2>
        <ul className="divide-y rounded-xl border">
          {sortedByIcao.map((a) => (
            <li key={a.icao} className="p-0">
              <button
                type="button"
                onClick={() => router.push(`/weather/${a.icao}`)}
                className="w-full text-left px-4 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition"
              >
                <span>
                  <span className="font-semibold">{a.icao}</span>{" "}
                  <span className="text-slate-600 dark:text-zinc-300 text-sm">{a.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

