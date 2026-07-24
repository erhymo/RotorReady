import { NextResponse } from "next/server";

import { checkRateLimit, rateLimitResponse } from "@/lib/server/rateLimit";

const ICAO_PATTERN = /^[A-Z0-9]{4}$/;

// Simple in-memory cache per ICAO
const CACHE_TTL_MS = 60_000; // 60 seconds
const cache = new Map<string, { data: unknown; expires: number }>();

// Legacy Norwegian provider (MET.no) as fallback
const METNO_BASE = "https://api.met.no/weatherapi/tafmetar/1.0";
const METNO_UA =
  process.env.METNO_USER_AGENT || "RotorReady/1.0 (rotor-ready.com; contact: myhre.oyvind@gmail.com)";

// Primary global provider: CheckWX
const CHECKWX_BASE = process.env.CHECKWX_BASE_URL || "https://api.checkwx.com";
const CHECKWX_KEY = process.env.CHECKWX_API_KEY;

async function fetchTxt(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": METNO_UA,
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

async function fetchMetarTaf(icao: string): Promise<{
  provider: "checkwx" | "met.no";
  metarRaw: string | null;
  tafRaw: string | null;
  isAMD?: boolean;
}> {
  // Prefer CheckWX globally when an API key is configured; fall back to MET.no otherwise.
  if (CHECKWX_KEY) {
    const [metarJson, tafJson] = await Promise.all([
      fetchFromCheckwx(`/metar/${icao}`),
      fetchFromCheckwx(`/taf/${icao}`),
    ]);

    const metarRaw = extractCheckwxRaw(metarJson);
    const tafRaw = extractCheckwxRaw(tafJson);
    const isAMD = tafRaw ? /\bTAF\b\s+AMD\b|^AMD\b/i.test(tafRaw) : undefined;

    return {
      provider: "checkwx",
      metarRaw: metarRaw || null,
      tafRaw: tafRaw || null,
      isAMD,
    };
  }

  const [metarTxt, tafTxt] = await Promise.all([
    fetchTxt(`${METNO_BASE}/metar.txt?icao=${icao}`),
    fetchTxt(`${METNO_BASE}/taf.txt?icao=${icao}`),
  ]);

  const metarRaw = pickLatestLine(metarTxt, icao);
  const tafRaw = pickLatestLine(tafTxt, icao);
  const isAMD = tafRaw ? /\bTAF\b\s+AMD\b|^AMD\b/i.test(tafRaw) : undefined;

  return {
    provider: "met.no",
    metarRaw: metarRaw || null,
    tafRaw: tafRaw || null,
    isAMD,
  };
}

export async function GET(req: Request) {
  const rl = checkRateLimit(req, { bucket: "weather:metar-taf", limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSeconds);

  const { searchParams } = new URL(req.url);
  const icao = (searchParams.get("icao") || "").toUpperCase();

  if (!ICAO_PATTERN.test(icao)) {
    return NextResponse.json({ error: "Missing or invalid ICAO" }, { status: 400 });
  }

  const key = `tafmetar:${icao}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expires > now) {
    return NextResponse.json(hit.data);
  }

	  try {
	    const { provider, metarRaw, tafRaw, isAMD } = await fetchMetarTaf(icao);

	    const payload = {
	      icao,
	      provider,
	      metar: { raw: metarRaw },
	      taf: { raw: tafRaw, isAMD },
	    };

	    cache.set(key, { data: payload, expires: now + CACHE_TTL_MS });
	    return NextResponse.json(payload);
	  } catch (err: any) {
	    const provider = CHECKWX_KEY ? "checkwx" : "met.no";
	    return NextResponse.json(
	      { icao, provider, error: String(err?.message || err) },
	      { status: 502 }
	    );
	  }
}

