import { NextResponse } from "next/server";

// Simple in-memory cache by rounded lat/lon
const CACHE_TTL_MS = 60_000; // 60 seconds
const cache = new Map<string, { data: unknown; expires: number }>();

const CHECKWX_BASE = process.env.CHECKWX_BASE_URL || "https://api.checkwx.com";
const CHECKWX_KEY = process.env.CHECKWX_API_KEY;

type StationInfo = { icao?: string | null; name?: string | null; lat?: number | null; lon?: number | null };

async function fetchFromCheckwx(path: string): Promise<any> {
  if (!CHECKWX_KEY) {
    throw new Error("CHECKWX_API_KEY not configured");
  }

  const url = `${CHECKWX_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      "x-api-key": CHECKWX_KEY,
      Accept: "application/json",
    },
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`CheckWX ${res.status} for ${url}: ${body?.slice(0, 200)}`);
  }

  return res.json();
}

function extractCheckwxRawFromEntry(first: any): string | null {
  if (!first) return null;
  if (typeof first === "string") return first;
  if (first && typeof first === "object") {
    if (typeof (first as any).raw_text === "string") return (first as any).raw_text;
    if (typeof (first as any).text === "string") return (first as any).text;
  }
  return null;
}

function extractCheckwxRaw(json: any): string | null {
  if (!json) return null;
  const data = (json as any).data;
  if (!Array.isArray(data) || data.length === 0) return null;
  return extractCheckwxRawFromEntry(data[0]);
}

function extractStationFromEntry(first: any): StationInfo | null {
  if (!first || typeof first !== "object") return null;

  const icao: string | null =
    (typeof (first as any).icao === "string" && (first as any).icao) ||
    (typeof (first as any).id === "string" && (first as any).id) ||
    (typeof (first as any).station?.icao === "string" && (first as any).station.icao) ||
    null;

  const name: string | null =
    (typeof (first as any).station?.name === "string" && (first as any).station.name) ||
    (typeof (first as any).name === "string" && (first as any).name) ||
    (typeof (first as any).station?.location === "string" && (first as any).station.location) ||
    null;

  let lat: number | null = null;
  let lon: number | null = null;
  const stationObj = (first as any).station;
  if (stationObj?.geometry?.coordinates && Array.isArray(stationObj.geometry.coordinates)) {
    const coords = stationObj.geometry.coordinates as [number, number];
    lon = typeof coords[0] === "number" ? coords[0] : null;
    lat = typeof coords[1] === "number" ? coords[1] : null;
  }

  if (lat == null && typeof (first as any).latitude === "number") lat = (first as any).latitude;
  if (lon == null && typeof (first as any).longitude === "number") lon = (first as any).longitude;

  return { icao, name, lat, lon };
}

function extractStation(json: any): StationInfo | null {
  if (!json) return null;
  const data = (json as any).data;
  if (!Array.isArray(data) || data.length === 0) return null;
  const first = data[0] as any;
  return extractStationFromEntry(first);
}

type StationPayload = {
  icao: string | null;
  station: StationInfo | null;
  metar: { raw: string | null };
  taf: { raw: string | null; isAMD?: boolean };
};

function buildKeyFromEntry(entry: any, stationInfo: StationInfo | null): string | null {
  if (stationInfo?.icao) return stationInfo.icao;
  if (typeof (entry as any)?.id === "string") return (entry as any).id;
  return null;
}

function extractStationsWithAlternates(metarJson: any, tafJson: any, maxCount: number): StationPayload[] {
  const results: StationPayload[] = [];
  const metarData = Array.isArray((metarJson as any)?.data) ? ((metarJson as any).data as any[]) : [];
  const tafData = Array.isArray((tafJson as any)?.data) ? ((tafJson as any).data as any[]) : [];

  const tafByKey = new Map<string, any>();
  for (const t of tafData) {
    const stationInfo = extractStationFromEntry(t);
    const key = buildKeyFromEntry(t, stationInfo);
    if (!key) continue;
    if (!tafByKey.has(key)) tafByKey.set(key, t);
  }

  for (const m of metarData) {
    if (results.length >= maxCount) break;
    const stationInfo = extractStationFromEntry(m);
    const metarRaw = extractCheckwxRawFromEntry(m);
    if (!stationInfo && !metarRaw) continue;

    const key = buildKeyFromEntry(m, stationInfo);
    const tafEntry = key ? tafByKey.get(key) : undefined;
    const tafRaw = tafEntry ? extractCheckwxRawFromEntry(tafEntry) : null;
    const isAMD = tafRaw ? /\bTAF\b\s+AMD\b|^AMD\b/i.test(tafRaw) : undefined;

    results.push({
      icao: stationInfo?.icao ?? null,
      station: stationInfo ?? null,
      metar: { raw: metarRaw ?? null },
      taf: { raw: tafRaw ?? null, isAMD },
    });
  }

  return results;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");

  if (!latStr || !lonStr) {
    return NextResponse.json({ error: "Missing lat or lon" }, { status: 400 });
  }

  const lat = Number(latStr);
  const lon = Number(lonStr);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Invalid lat or lon" }, { status: 400 });
  }

  const key = `nearest:${lat.toFixed(2)},${lon.toFixed(2)}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expires > now) {
    return NextResponse.json(hit.data);
  }

  try {
    const [metarJson, tafJson] = await Promise.all([
      fetchFromCheckwx(`/metar/lat/${lat}/lon/${lon}`),
      fetchFromCheckwx(`/taf/lat/${lat}/lon/${lon}`),
    ]);

    // Build a small list of nearby stations with METAR/TAF, using the first as primary.
    const stations = extractStationsWithAlternates(metarJson, tafJson, 5);

    const fallbackStation = extractStation(metarJson) || extractStation(tafJson);
    const fallbackMetarRaw = extractCheckwxRaw(metarJson);
    const fallbackTafRaw = extractCheckwxRaw(tafJson);
    const fallbackIsAMD = fallbackTafRaw ? /\bTAF\b\s+AMD\b|^AMD\b/i.test(fallbackTafRaw) : undefined;

    const primary: StationPayload =
      stations[0] || {
        icao: fallbackStation?.icao ?? null,
        station: fallbackStation ?? null,
        metar: { raw: fallbackMetarRaw ?? null },
        taf: { raw: fallbackTafRaw ?? null, isAMD: fallbackIsAMD },
      };

    const alternates = stations.slice(1);

    const payload = {
      provider: "checkwx" as const,
      query: { lat, lon },
      // Backwards-compatible single fields (mirror primary)
      icao: primary.icao,
      station: primary.station,
      metar: primary.metar,
      taf: primary.taf,
      // New richer structure
      primary,
      alternates,
    };

    cache.set(key, { data: payload, expires: now + CACHE_TTL_MS });
    return NextResponse.json(payload);
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message || err), provider: "checkwx", query: { lat, lon } },
      { status: 502 }
    );
  }
}

