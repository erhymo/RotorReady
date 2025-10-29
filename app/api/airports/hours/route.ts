import { NextResponse } from "next/server";

const TTL = 12 * 60 * 60 * 1000; // 12h = update twice daily
const cache = new Map<string, { data: any; expires: number }>();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const icao = (searchParams.get("icao") || "").toUpperCase();
  if (!icao || icao.length !== 4) {
    return NextResponse.json({ error: "Missing or invalid ICAO" }, { status: 400 });
  }

  const key = `hours:${icao}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expires > now) {
    return NextResponse.json(hit.data);
  }

  try {
    // Placeholder: real implementation will parse Avinor AIS eAIP for ATS & Fuel hours.
    // For now, return nulls and a source link; structure kept stable for future upgrade.
    const data = { ats: null as string | null, fuel: null as string | null, sourceUrl: "https://avinor.no/ais" };

    cache.set(key, { data, expires: now + TTL });
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 502 });
  }
}

