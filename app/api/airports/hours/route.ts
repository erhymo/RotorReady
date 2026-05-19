import { NextResponse } from "next/server";

const TTL = 12 * 60 * 60 * 1000; // 12h = update twice daily
const cache = new Map<string, { data: any; expires: number }>();
const OPERATIONAL_HOURS_URL = "https://aim-prod.avinor.no/no/OperationalHours";

// Manual overrides for largest airports (seeded now, parser will fill the rest)
const MANUAL: Record<string, { ats: string | null; fuel: string | null; note?: string }> = {
  ENGM: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Oslo Gardermoen
  ENBR: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Bergen Flesland
  ENZV: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Stavanger Sola
  ENVA: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Trondheim Vaernes
  ENBO: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Bodo
  ENTC: { ats: "H24", fuel: "H24 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Tromso
  ENTO: { ats: "0600-2300", fuel: "0600-2300 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Torp
  ENCN: { ats: "0600-2300", fuel: "0600-2300 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Kjevik
  ENAL: { ats: "0600-2300", fuel: "0600-2300 (Jet A-1)", note: "Indicative; check AIP/NOTAM" }, // Vigra
};

function aipUrlFor(icao: string): string {
  // Consolidated operational hours (ATS, Fuel, etc.) published by Avinor AIS.
  // Avinor redirects this endpoint to the current OperationalHours/View/Index/{id}.
  return OPERATIONAL_HOURS_URL;
}

async function tryParseFromAIP(icao: string): Promise<{ ats: string | null; fuel: string | null } | null> {
  try {
    const url = aipUrlFor(icao);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "RotorReady/1.0 (+https://rotor-ready.vercel.app; contact: myhre.oyvind@gmail.com)",
        "Accept": "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Convert HTML to a rough plain-text to make parsing resilient without DOM
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, "\n")
      .replace(/&nbsp;/g, " ")
      .replace(/\r/g, "")
      .replace(/\t/g, " ")
      .replace(/\n\n+/g, "\n");

    function sectionBetween(src: string, startMarker: string, endMarkers: string[]): string | null {
      const s = src.indexOf(startMarker);
      if (s === -1) return null;
      let e = -1;
      for (const endMarker of endMarkers) {
        const idx = src.indexOf(endMarker, s + startMarker.length);
        if (idx !== -1 && (e === -1 || idx < e)) e = idx;
      }
      const end = e === -1 ? src.length : e;
      return src.slice(s + startMarker.length, end);
    }

    function extractHr(section: string | null, icaoCode: string): string | null {
      if (!section) return null;
      const lines = section.split("\n").map(l => l.trim()).filter(Boolean);
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toUpperCase() === icaoCode) {
          // HR is usually the next non-empty line that isn't a header
          for (let j = i + 1; j < lines.length; j++) {
            const l = lines[j];
            if (!l || l === "AIRPORT" || l === "ICAO" || l === "HR" || l === "RMK:" || l.toUpperCase() === icaoCode) continue;
            return l;
          }
        }
      }
      return null;
    }

    const atsSection = sectionBetween(text, "AD 2.3 Operational hours: ATS", ["AD 2.3 Operational hours: Fuel", "AD 2.6 Operational hours"]);
    const fuelSection = sectionBetween(text, "AD 2.3 Operational hours: Fuel", ["AD 2.6 Operational hours", "AD 2.3 Operational hours: MET", "AD 2.3 Operational hours: De-Icing"]);

    const ats = extractHr(atsSection, icao);
    const fuel = extractHr(fuelSection, icao);

    if (ats || fuel) return { ats: ats ?? null, fuel: fuel ?? null };
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
    let data: { ats: string | null; fuel: string | null; sourceUrl: string; source: "manual" | "aip"; updatedAt: string } | null = null;

    const parsed = await tryParseFromAIP(icao);
    if (parsed) {
      data = { ats: parsed.ats, fuel: parsed.fuel, sourceUrl: aipUrlFor(icao), source: "aip", updatedAt: new Date(now).toISOString() };
    } else if (manual) {
      data = { ats: manual.ats, fuel: manual.fuel, sourceUrl: aipUrlFor(icao), source: "manual", updatedAt: new Date(now).toISOString() };
    } else {
      data = { ats: null, fuel: null, sourceUrl: aipUrlFor(icao), source: "manual", updatedAt: new Date(now).toISOString() };
    }

    cache.set(key, { data, expires: now + TTL });
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 502 });
  }
}

