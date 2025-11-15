import type { AirportMinima } from "../airports/no_minima";

export type DecodedMetar = {
  ceilingFt: number | null;
  visibilityM: number | null;
  status: "green" | "yellow" | "red";
};

// Minima (ILS) and yellow threshold factor per request
export const CEILING_MINIMA_FT = 200;
export const VIS_MINIMA_M = 550;
// Yellow when within 20% above minima (e.g., ceiling <= 240 ft, vis <= 660 m)
export const YELLOW_FACTOR = 1.2;

export function parseCeilingFt(raw: string): number | null {
  // CAVOK implies no significant cloud below 5000 ft and vis >= 10 km
  if (/\bCAVOK\b/.test(raw)) return 5000;

  // Look for vertical visibility
  const vv = raw.match(/\bVV(\d{3})\b/);
  if (vv) return parseInt(vv[1], 10) * 100;

  // Find lowest BKN/OVC layer
  const layers = [...raw.matchAll(/\b(BKN|OVC)(\d{3})\b/g)].map((m) => parseInt(m[2], 10) * 100);
  if (layers.length === 0) return null;
  return Math.min(...layers);
}

// Parse issue time (UTC) from METAR/TAF raw using DDHHMMZ token.
// Returns a Date in UTC; handles month rollover near month boundaries.
export function parseIssueTimeUtc(raw: string, now: Date = new Date()): Date | null {
  const m = raw.match(/\b(\d{2})(\d{2})(\d{2})Z\b/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const hour = parseInt(m[2], 10);
  const min = parseInt(m[3], 10);
  const y = now.getUTCFullYear();
  const mon = now.getUTCMonth();
  let d = new Date(Date.UTC(y, mon, day, hour, min, 0));
  // If parsed time is >36h in the future (e.g., early month), roll back one month.
  if (d.getTime() - now.getTime() > 36 * 3600 * 1000) {
    d = new Date(Date.UTC(y, mon - 1, day, hour, min, 0));
  }
  return d;
}

export function minutesSince(date: Date, now: Date = new Date()): number {
  const diffMs = now.getTime() - date.getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
}

export function formatAgeMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

export function parseVisibilityM(raw: string): number | null {
  if (/\bCAVOK\b/.test(raw)) return 10000;
  // Prefer visibility groups (four digits) not adjacent to '/'
  const matches = [...raw.matchAll(/(?:^|\s)(\d{4})(?=\s|$)/g)]
    .map((m) => m[1])
    .filter(Boolean) as string[];
  if (matches.length === 0) return null;
  // Select first that looks like vis, prefer 9999/0xxx/xxxx <= 5000 typical
  const pick = matches.find((v) => v === "9999" || /^0\d{3}$/.test(v) || parseInt(v, 10) <= 8000) ?? matches[0];
  const v = parseInt(pick, 10);
  if (v >= 9999) return 10000; // 9999 means 10 km or more
  return v;
}

export function deriveStatus(
  ceilingFt: number | null,
  visM: number | null,
  opts: { ceilingMinimaFt?: number; visMinimaM?: number; yellowFactor?: number } = {}
): "green" | "yellow" | "red" {
  const ceilingMin = opts.ceilingMinimaFt ?? CEILING_MINIMA_FT;
  const visMin = opts.visMinimaM ?? VIS_MINIMA_M;
  const yellowFactor = opts.yellowFactor ?? YELLOW_FACTOR;

  // Compute per-dimension statuses and return the worst (red < yellow < green)
  const ceilingStatus = (() => {
    if (ceilingFt == null) return "yellow"; // unknown
    if (ceilingFt <= ceilingMin) return "red";
    if (ceilingFt <= Math.ceil(ceilingMin * yellowFactor)) return "yellow";
    return "green";
  })();

  const visStatus = (() => {
    if (visM == null) return "yellow"; // unknown
    if (visM <= visMin) return "red";
    if (visM <= Math.ceil(visMin * yellowFactor)) return "yellow";
    return "green";
  })();

  const rank = (s: DecodedMetar["status"]) => (s === "red" ? 0 : s === "yellow" ? 1 : 2);
  return rank(ceilingStatus) < rank(visStatus) ? ceilingStatus : visStatus;
}

export function decodeMetar(raw: string): DecodedMetar {
  const ceilingFt = parseCeilingFt(raw);
  const visibilityM = parseVisibilityM(raw);
  const status = deriveStatus(ceilingFt, visibilityM);
  return { ceilingFt, visibilityM, status };
}

export type TafChunk = {
  text: string;
  status: "green" | "yellow" | "red";
  ceilingFt: number | null;
  visibilityM: number | null;
  alternatesRequired: 0 | 1 | 2;
};

export function decodeTafChunks(raw: string, minima: AirportMinima): TafChunk[] {
  if (!raw) return [];
  // Remove leading TAF and airport/time headers for cleaner chunks
  const cleaned = raw
    .replace(/^TAF\s+AMD\s+|^TAF\s+/i, "")
    .replace(/^\w{4}\s+\d{4}Z\s+\d{4}\/\d{4}\s+/i, "");
  // Split into chunks at common TAF delimiters but keep the delimiter with the chunk via lookahead
  const parts = cleaned.split(/\s+(?=(?:BECMG|TEMPO|PROB\d{2}|FM\d{4})\b)/g);
  return parts
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => {
      const ceilingFt = parseCeilingFt(p);
      const visibilityM = parseVisibilityM(p);
      const { status, alternatesRequired } = classifyTafStatus(ceilingFt, visibilityM, minima);
      return { text: p, status, ceilingFt, visibilityM, alternatesRequired };
    });
}

function classifyTafStatus(
  ceilingFt: number | null,
  visM: number | null,
  minima: AirportMinima
): { status: "green" | "yellow" | "red"; alternatesRequired: 0 | 1 | 2 } {
  const { minRvr, minCeiling, noAltRvr, noAltCeiling } = minima;

  // If visibility is missing, treat as unknown but above minima => require 1 alternate
  if (visM == null) {
    return { status: "yellow", alternatesRequired: 1 };
  }

  const ceilingOkMin = ceilingFt == null || ceilingFt >= minCeiling;
  const ceilingOkNoAlt = ceilingFt == null || ceilingFt >= noAltCeiling;

  // Green: no alternate (VMC with margins)
  if (visM >= noAltRvr && ceilingOkNoAlt) {
    return { status: "green", alternatesRequired: 0 };
  }

  // Yellow: 1 alternate (above minima but not meeting no-alternate margins)
  if (visM >= minRvr && ceilingOkMin) {
    return { status: "yellow", alternatesRequired: 1 };
  }

  // Red: 2 alternates (below minima on vis or ceiling)
  return { status: "red", alternatesRequired: 2 };
}

