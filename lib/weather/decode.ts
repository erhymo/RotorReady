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

export type TafChunk = { text: string; status: "green" | "yellow" | "red"; ceilingFt: number | null; visibilityM: number | null; belowAlternate: boolean };

export function decodeTafChunks(raw: string, opts?: { ceilingMinimaFt?: number; visMinimaM?: number; yellowFactor?: number }): TafChunk[] {
  if (!raw) return [];
  // Remove leading "TAF" and airport/time headers for cleaner chunks
  const cleaned = raw.replace(/^TAF\s+AMD\s+|^TAF\s+/i, "").replace(/^\w{4}\s+\d{4}Z\s+\d{4}\/\d{4}\s+/i, "");
  // Split into chunks at common TAF delimiters but keep the delimiter with the chunk via lookahead
  const parts = cleaned.split(/\s+(?=(?:BECMG|TEMPO|PROB\d{2}|FM\d{4})\b)/g);
  return parts.map((p) => {
    const ceilingFt = parseCeilingFt(p);
    const visibilityM = parseVisibilityM(p);
    const status = deriveStatus(ceilingFt, visibilityM, opts);
    const belowAlternate = status === "red"; // placeholder: same as minima for now
    return { text: p, status, ceilingFt, visibilityM, belowAlternate } as TafChunk;
  });
}

