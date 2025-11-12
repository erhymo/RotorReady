// Quick check script for AW169 OEI OGE planning calculator against test points
// This file is not part of the app; used locally to sanity-check numbers.

import fs from 'node:fs';
const raw = fs.readFileSync(new URL('../lib/calculations/data/aw169_oge_oei_headwind_isa+35.json', import.meta.url), 'utf8');
const sanitized = raw.replace(/\u0000/g, '').replace(' b0C', ' C');
const data = JSON.parse(sanitized);

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function linearInterpolate(x, pts) {
  if (!pts || pts.length === 0) return NaN;
  pts = pts.slice().sort((a,b)=>a.x-b.x);
  if (x <= pts[0].x) return pts[0].y;
  if (x >= pts[pts.length-1].x) return pts[pts.length-1].y;
  for (let i=0;i<pts.length-1;i++) {
    const a = pts[i], b = pts[i+1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / (b.x - a.x);
      return lerp(a.y, b.y, t);
    }
  }
  return NaN;
}

function isaTempCAtPaFt(paFt) { return 15 - 1.98 * (paFt / 1000); }
function densityAltitudeFt(paFt, oatC) { const isa = isaTempCAtPaFt(paFt); const deltaT = oatC - isa; return paFt + 120 * deltaT; }
function interpBase(altitudeFt) { const pts = data.baseline_zero_wind.map(p=>({x:p.pa_ft, y:p.max_gw_kg})); return linearInterpolate(altitudeFt, pts); }

function calc(paFt, oatC, headwindKts=0) {
  const pa = clamp(paFt, data.bounds.pa_ft_min, data.bounds.pa_ft_max);
  const oat = clamp(oatC, -40, 50);
  const kts = clamp(Math.max(0, headwindKts), data.bounds.headwind_kts_min, data.bounds.headwind_kts_max);
  const da = clamp(densityAltitudeFt(pa, oat), data.bounds.pa_ft_min, data.bounds.pa_ft_max);
  const base = interpBase(da);
  const inc = linearInterpolate(kts, data.headwind_increment_kg.map(p=>({x:p.kts, y:p.kg})));
  const maxGw = clamp(base + inc, data.bounds.gw_kg_min, data.bounds.gw_kg_max);
  return { mgw: Math.round(maxGw), da: Math.round(da) };
}

const tests = [
  { gw: 3700, oat: 0, pa: 6000 },
  { gw: 3800, oat: -10, pa: 6500 },
  { gw: 3450, oat: -10, pa: 9000 },
  { gw: 4000, oat: 0, pa: 4000 },
  { gw: 4250, oat: 0, pa: 1000 },
];

for (const t of tests) {
  const { mgw, da } = calc(t.pa, t.oat, 0);
  const diff = mgw - t.gw;
  console.log(`PA=${t.pa} ft, OAT=${t.oat}C -> DA≈${da} ft; MaxGW=${mgw} kg | ref=${t.gw} kg | diff=${diff}`);
}

