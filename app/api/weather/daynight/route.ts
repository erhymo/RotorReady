import { NextResponse } from "next/server";

import { NO_AIRPORTS } from "@/lib/airports/no_icao";
import { NO_AIRPORT_FEATURES } from "@/lib/airports/no_features";

type DayNightPayload = {
  icao: string;
  hasData: boolean;
  provider: string;
  dayStartUtc?: string | null; // civil twilight begin (morning)
  nightStartUtc?: string | null; // civil twilight end (evening)
  sunriseUtc?: string | null;
  sunsetUtc?: string | null;
  dayStartLocal?: string | null;
  nightStartLocal?: string | null;
  sunriseLocal?: string | null;
  sunsetLocal?: string | null;
  error?: string;
};

const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const cache = new Map<string, { data: DayNightPayload; expires: number }>();

function formatLocalOslo(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  try {
    return new Intl.DateTimeFormat("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Oslo",
    }).format(d);
  } catch {
    // Fallback: UTC HH:MM if time zone formatting fails for some reason
    return new Intl.DateTimeFormat("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(d);
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const icao = (searchParams.get("icao") || "").toUpperCase();

  if (!icao || icao.length !== 4) {
    return NextResponse.json({ error: "Missing or invalid ICAO" }, { status: 400 });
  }

  const airport = NO_AIRPORTS.find((a) => a.icao === icao) || null;
  if (!airport) {
    return NextResponse.json({ error: "Unknown airport" }, { status: 404 });
  }

  const features = NO_AIRPORT_FEATURES[icao];
  // Only provide data for ILS airports (large airports), plus Hammerfest (ENHF) which we use frequently
  const allowDayNight = features?.ils || icao === "ENHF";
  if (!allowDayNight) {
    const payload: DayNightPayload = {
      icao,
      hasData: false,
      provider: "sunrise-sunset.org",
    };
    return NextResponse.json(payload);
  }

  const key = `daynight:${icao}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expires > now) {
    return NextResponse.json(hit.data);
  }

  try {
    const url = `https://api.sunrise-sunset.org/json?lat=${airport.lat}&lng=${airport.lon}&date=today&formatted=0`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          process.env.METNO_USER_AGENT ||
          "RotorReady/1.0 (rotor-ready.com; contact: myhre.oyvind@gmail.com)",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`sunrise-sunset.org ${res.status}: ${body?.slice(0, 200)}`);
    }

    const json = await res.json();
    if (!json || json.status !== "OK") {
      throw new Error(`sunrise-sunset.org status ${json?.status ?? "unknown"}`);
    }

    const beginIso: string | null = json.results?.civil_twilight_begin ?? null;
    const endIso: string | null = json.results?.civil_twilight_end ?? null;
    const sunriseIso: string | null = json.results?.sunrise ?? null;
    const sunsetIso: string | null = json.results?.sunset ?? null;

    const payload: DayNightPayload = {
      icao,
      hasData: !!(beginIso && endIso),
      provider: "sunrise-sunset.org",
      dayStartUtc: beginIso,
      nightStartUtc: endIso,
      sunriseUtc: sunriseIso,
      sunsetUtc: sunsetIso,
      dayStartLocal: formatLocalOslo(beginIso),
      nightStartLocal: formatLocalOslo(endIso),
      sunriseLocal: formatLocalOslo(sunriseIso),
      sunsetLocal: formatLocalOslo(sunsetIso),
    };

    cache.set(key, { data: payload, expires: now + CACHE_TTL_MS });
    return NextResponse.json(payload);
  } catch (err: any) {
    const payload: DayNightPayload = {
      icao,
      hasData: false,
      provider: "sunrise-sunset.org",
      dayStartUtc: null,
      nightStartUtc: null,
      sunriseUtc: null,
      sunsetUtc: null,
      dayStartLocal: null,
      nightStartLocal: null,
      sunriseLocal: null,
      sunsetLocal: null,
      error: String(err?.message || err),
    };
    return NextResponse.json(payload, { status: 502 });
  }
}

