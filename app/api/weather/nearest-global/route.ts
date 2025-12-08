import { NextResponse } from "next/server";

// Simple in-memory cache by rounded lat/lon
const CACHE_TTL_MS = 60_000; // 60 seconds
const cache = new Map<string, { data: unknown; expires: number }>();

const CHECKWX_BASE = process.env.CHECKWX_BASE_URL || "https://api.checkwx.com";
const CHECKWX_KEY = process.env.CHECKWX_API_KEY;

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

function extractCheckwxRaw(json: any): string | null {
  if (!json) return null;
  const data = (json as any).data;
  if (!Array.isArray(data) || data.length === 0) return null;

  const first = data[0];
  if (typeof first === "string") return first;
  if (first && typeof first === "object") {
    if (typeof (first as any).raw_text === "string") return (first as any).raw_text;
    if (typeof (first as any).text === "string") return (first as any).text;
  }
  return null;
}

function extractStation(json: any): { icao?: string | null; name?: string | null; lat?: number | null; lon?: number | null } | null {
  if (!json) return null;
  const data = (json as any).data;
  if (!Array.isArray(data) || data.length === 0) return null;
  const first = data[0] as any;

  const icao: string | null =
    (typeof first.icao === "string" && first.icao) ||
    (typeof first.id === "string" && first.id) ||
    (typeof first.station?.icao === "string" && first.station.icao) ||
    null;

  const name: string | null =
    (typeof first.station?.name === "string" && first.station.name) ||
    (typeof first.name === "string" && first.name) ||
    (typeof first.station?.location === "string" && first.station.location) ||
    null;

  let lat: number | null = null;
  let lon: number | null = null;
  if (first.station?.geometry?.coordinates && Array.isArray(first.station.geometry.coordinates)) {
    const coords = first.station.geometry.coordinates as [number, number];
    lon = typeof coords[0] === "number" ? coords[0] : null;
    lat = typeof coords[1] === "number" ? coords[1] : null;
  }

  if (lat == null && typeof first.latitude === "number") lat = first.latitude;
  if (lon == null && typeof first.longitude === "number") lon = first.longitude;

  return { icao, name, lat, lon };
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

    const station = extractStation(metarJson) || extractStation(tafJson);
    const metarRaw = extractCheckwxRaw(metarJson);
    const tafRaw = extractCheckwxRaw(tafJson);
    const isAMD = tafRaw ? /\bTAF\b\s+AMD\b|^AMD\b/i.test(tafRaw) : undefined;

    const payload = {
      provider: "checkwx" as const,
      query: { lat, lon },
      icao: station?.icao || null,
      station: station || null,
      metar: { raw: metarRaw || null },
      taf: { raw: tafRaw || null, isAMD },
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

