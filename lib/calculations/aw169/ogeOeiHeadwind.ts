import data from "../data/aw169_oge_oei_headwind_isa+35.json" assert { type: "json" };
import { linearInterpolate, clamp } from "../interp";

export type Inputs = { paFt: number; oatC: number; headwindKts: number };
export type Result = {
  ok: boolean;
  maxGwKg: number;
  clamped: boolean;
  meta: typeof data.metadata;
};

function isaTempCAtPaFt(paFt: number) {
  // Approx ISA lapse rate 1.98°C per 1000 ft
  return 15 - 1.98 * (paFt / 1000);
}

function densityAltitudeFt(paFt: number, oatC: number) {
  const isa = isaTempCAtPaFt(paFt);
  const deltaT = oatC - isa;
  // Common approximation: DA ≈ PA + 120 ft per °C above ISA
  return paFt + 120 * deltaT;
}

function interpBase(altitudeFt: number) {
  const pts = data.baseline_zero_wind.map(p => ({ x: p.pa_ft, y: p.max_gw_kg }));
  return linearInterpolate(altitudeFt, pts);
}

function interpHeadwind(kts: number) {
  const pts = data.headwind_increment_kg.map(p => ({ x: p.kts, y: p.kg }));
  return linearInterpolate(kts, pts);
}

export function compute(inputs: Inputs): Result {
  const paMin = data.bounds.pa_ft_min;
  const paMax = data.bounds.pa_ft_max;
  const rawPa = inputs.paFt;
  const pa = clamp(rawPa, paMin, paMax);

  const oatMin = (data as any).bounds?.oat_c_min ?? -40;
  const oatMax = (data as any).bounds?.oat_c_max ?? 50;
  const rawOat = inputs.oatC;
  const oat = clamp(rawOat, oatMin, oatMax);

  const rawKts = inputs.headwindKts;
  // Tailwind not allowed: clamp below 0 to 0
  const kts = clamp(Math.max(0, rawKts), data.bounds.headwind_kts_min, data.bounds.headwind_kts_max);

  const da = densityAltitudeFt(pa, oat);
  const daClamped = clamp(da, paMin, paMax);

  const base = interpBase(daClamped);
  const inc = interpHeadwind(kts);
  let maxGw = base + inc;

  maxGw = clamp(maxGw, data.bounds.gw_kg_min, data.bounds.gw_kg_max);

  // Only treat user inputs as "clamped" for the UI notice; don't warn when only derived DA was bounded.
  const clampedInputs = (rawPa < paMin || rawPa > paMax) || (rawOat < oatMin || rawOat > oatMax) || (rawKts < data.bounds.headwind_kts_min || rawKts > data.bounds.headwind_kts_max);

  return { ok: true, maxGwKg: Math.round(maxGw), clamped: clampedInputs, meta: data.metadata };
}
