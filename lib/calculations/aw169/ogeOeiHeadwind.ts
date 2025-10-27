import data from "../data/aw169_oge_oei_headwind_isa+35.json" assert { type: "json" };
import { linearInterpolate, clamp } from "../interp";

export type Inputs = { paFt: number; headwindKts: number; gwKg: number };
export type Result = {
  ok: boolean;
  maxGwKg: number;
  availableKg: number; // positive => you can add this much
  clamped: boolean;
  meta: typeof data.metadata;
};

function interpBase(paFt: number) {
  const pts = data.baseline_zero_wind.map(p => ({ x: p.pa_ft, y: p.max_gw_kg }));
  return linearInterpolate(paFt, pts);
}

function interpHeadwind(kts: number) {
  const pts = data.headwind_increment_kg.map(p => ({ x: p.kts, y: p.kg }));
  return linearInterpolate(kts, pts);
}

export function compute(inputs: Inputs): Result {
  const pa = clamp(inputs.paFt, data.bounds.pa_ft_min, data.bounds.pa_ft_max);
  const kts = clamp(inputs.headwindKts, data.bounds.headwind_kts_min, data.bounds.headwind_kts_max);
  const base = interpBase(pa);
  const inc = interpHeadwind(kts);
  let maxGw = base + inc;
  const clamped = pa !== inputs.paFt || kts !== inputs.headwindKts;
  maxGw = clamp(maxGw, data.bounds.gw_kg_min, data.bounds.gw_kg_max);
  const available = maxGw - inputs.gwKg;
  return { ok: true, maxGwKg: Math.round(maxGw), availableKg: Math.round(available), clamped, meta: data.metadata };
}

