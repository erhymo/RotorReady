import { NextResponse } from "next/server";

// Simple in-memory cache per ICAO
const CACHE_TTL_MS = 60_000; // 60 seconds
const cache = new Map<string, { data: unknown; expires: number }>();

const BASE = "https://api.met.no/weatherapi/tafmetar/1.0";
const UA = process.env.METNO_USER_AGENT || "RotorReady/1.0 (rotor-ready.com; contact: myhre.oyvind@gmail.com)";

async function fetchTxt(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/plain",
    },
    // Always fetch fresh from provider; we handle our own cache
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`MET.no ${res.status} for ${url}: ${body?.slice(0, 200)}`);
  }
  return res.text();
}

function pickLatestLine(txt: string, icao: string): string | null {
  const lines = txt
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l.toUpperCase().includes(icao));
  if (lines.length === 0) return null;
  return lines[lines.length - 1];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const icao = (searchParams.get("icao") || "").toUpperCase();

  if (!icao || icao.length !== 4) {
    return NextResponse.json({ error: "Missing or invalid ICAO" }, { status: 400 });
  }

  const key = `tafmetar:${icao}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expires > now) {
    return NextResponse.json(hit.data);
  }

  try {
    const [metarTxt, tafTxt] = await Promise.all([
      fetchTxt(`${BASE}/metar.txt?icao=${icao}`),
      fetchTxt(`${BASE}/taf.txt?icao=${icao}`),
    ]);

    const metarRaw = pickLatestLine(metarTxt, icao);
    const tafRaw = pickLatestLine(tafTxt, icao);

    const isAMD = tafRaw ? /\bTAF\b\s+AMD\b|^AMD\b/i.test(tafRaw) : undefined;

    const payload = {
      icao,
      provider: "met.no",
      metar: { raw: metarRaw || null },
      taf: { raw: tafRaw || null, isAMD },
    };

    cache.set(key, { data: payload, expires: now + CACHE_TTL_MS });
    return NextResponse.json(payload);
  } catch (err: any) {
    return NextResponse.json(
      { icao, provider: "met.no", error: String(err?.message || err) },
      { status: 502 }
    );
  }
}

