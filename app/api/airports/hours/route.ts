import { NextResponse } from "next/server";

const TTL = 12 * 60 * 60 * 1000; // 12h = update twice daily
const cache = new Map<string, { data: any; expires: number }>();

// Manual overrides for largest airports (seeded now, parser will fill the rest)
const MANUAL: Record<string, { ats: string | null; fuel: string | null; note?: string }> = {
  ENGM: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Oslo Gardermoen
  ENBR: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Bergen Flesland
  ENZV: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Stavanger Sola
  ENVA: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Trondheim Værnes
  ENBO: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Bodø
  ENTC: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Tromsø
  ENTO: { ats: "0600-2300", fuel: "0600-2300 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Torp
  ENCN: { ats: "0600-2300", fuel: "0600-2300 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Kjevik
  ENAL: { ats: "0600-2300", fuel: "0600-2300 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Vigra
};

function aipUrlFor(icao: string): string {
  // Known landing page for Avinor AIS. Parser will follow redirects/content.
  return `https://avinor.no/ais`; // Placeholder root; per-airport deep links vary across releases
}

async function tryParseFromAIP(icao: string): Promise<{ ats: string | null; fuel: string | null } | null> {
  try {
    const url = aipUrlFor(icao);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "RotorReady/1.0 (+https://rotor-ready.vercel.app; contact: myhre.oyvind@gmail.com)",
        "Accept": "text/html,application/xhtml+xml",
      },
      // Avoid caching upstream to respect our 12h cache only
      cache: "no-store",
    });
    if (!res.ok) return null;
    const html = await res.text();
    // TODO: Implement robust selectors once stable per-airport URLs/DOM are confirmed.
    // For now, return null to fall back to manual.
    void html; // satisfy linter
    return null;
  } catch {
    return null;
  }
}

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
    const manual = MANUAL[icao];
    let data: { ats: string | null; fuel: string | null; sourceUrl: string; source: "manual" | "aip" } | null = null;

    if (manual) {
      data = { ats: manual.ats, fuel: manual.fuel, sourceUrl: aipUrlFor(icao), source: "manual" };
    } else {
      const parsed = await tryParseFromAIP(icao);
      data = { ats: parsed?.ats ?? null, fuel: parsed?.fuel ?? null, sourceUrl: aipUrlFor(icao), source: parsed ? "aip" : "manual" };
    }

    cache.set(key, { data, expires: now + TTL });
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 502 });
  }
}

