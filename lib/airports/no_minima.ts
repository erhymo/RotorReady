export type AirportMinima = {
  minRvr: number; // meters, e.g. 550
  minCeiling: number; // feet, e.g. DH 200 ft
  noAltRvr: number; // meters, typically 3000
  noAltCeiling: number; // feet, typically minCeiling + 400
  approach?: string; // optional label, e.g. "ILS RWY 17"
};

// Standard ILS CAT I baseline used unless overridden per airport
export const DEFAULT_AIRPORT_MINIMA: AirportMinima = {
  minRvr: 550,
  minCeiling: 200,
  noAltRvr: 3000,
  noAltCeiling: 600,
  approach: "ILS CAT I (standard)",
};

// Per-airport minima. All use standard ILS CAT I values for now; approach labels
// are provided so they can be fine-tuned later using AIP/IPPc data.
export const NO_AIRPORT_MINIMA: Record<string, AirportMinima> = {
  ENGM: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS CAT I" },
  ENBR: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS RWY 17" },
  ENZV: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENVA: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENBO: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENTC: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENAL: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENCN: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENTO: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENHD: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENML: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENKB: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENEV: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
  ENKR: { ...DEFAULT_AIRPORT_MINIMA, approach: "ILS" },
};

export function getAirportMinima(icao: string): AirportMinima {
  return NO_AIRPORT_MINIMA[icao] ?? DEFAULT_AIRPORT_MINIMA;
}

