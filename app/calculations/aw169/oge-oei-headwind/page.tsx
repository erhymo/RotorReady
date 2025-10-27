"use client";
import { useMemo, useState } from "react";
import { compute } from "@/lib/calculations/aw169/ogeOeiHeadwind";

export default function Page() {
  const [paStr, setPaStr] = useState("0");
  const [oatStr, setOatStr] = useState("20");
  const [windStr, setWindStr] = useState("10");
  const [currentNoFuelStr, setCurrentNoFuelStr] = useState("");

  const pa = parseFloat(paStr);
  const oat = parseFloat(oatStr);
  const wind = parseFloat(windStr);
  const currentNoFuel = parseFloat(currentNoFuelStr);

  const res = useMemo(
    () =>
      compute({
        paFt: Number.isFinite(pa) ? pa : 0,
        oatC: Number.isFinite(oat) ? oat : 0,
        headwindKts: Number.isFinite(wind) ? wind : 0,
      }),
    [pa, oat, wind]
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AW169 - OEI 2.5 min - OGE - Headwind (Planning)</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-1">Rotor speed: PLUS · Electrical load: 100% · OAT lines: -40..+50°C · Headwind treated as headwind component only</p>
      </header>

      <div className="grid sm:grid-cols-4 gap-4">
        <label className="block text-sm">
          <span className="text-slate-700 dark:text-zinc-200">Pressure altitude (ft)</span>
          <input type="number" className="mt-1 w-full rounded-md border bg-white/70 dark:bg-zinc-900/70 px-3 py-2"
            value={paStr} onChange={e => setPaStr(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="text-slate-700 dark:text-zinc-200">OAT (°C)</span>
          <input type="number" min={-40} max={50} step={1} className="mt-1 w-full rounded-md border bg-white/70 dark:bg-zinc-900/70 px-3 py-2"
            value={oatStr} onChange={e => setOatStr(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="text-slate-700 dark:text-zinc-200">Headwind (kts)</span>
          <input type="number" min={0} max={50} step={1} className="mt-1 w-full rounded-md border bg-white/70 dark:bg-zinc-900/70 px-3 py-2"
            value={windStr} onChange={e => setWindStr(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="text-slate-700 dark:text-zinc-200">Current weight (without fuel) (kg) — optional</span>
          <input type="number" className="mt-1 w-full rounded-md border bg-white/70 dark:bg-zinc-900/70 px-3 py-2"
            value={currentNoFuelStr} onChange={e => setCurrentNoFuelStr(e.target.value)} />
        </label>
      </div>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-xs text-slate-500 dark:text-zinc-400">Max GW (kg)</div>
          <div className="text-2xl font-bold">{res.maxGwKg}</div>
        </div>
        <div className={`rounded-lg border p-4 ${Number.isFinite(currentNoFuel) ? (res.maxGwKg - currentNoFuel >= 0 ? 'bg-emerald-50/30 dark:bg-emerald-900/20' : 'bg-rose-50/30 dark:bg-rose-900/20') : ''}`}>
          <div className="text-xs text-slate-500 dark:text-zinc-400">Available fuel (kg)</div>
          <div className="text-2xl font-bold">{Number.isFinite(currentNoFuel) ? Math.round(res.maxGwKg - currentNoFuel) : '—'}</div>
        </div>
      </section>
      {res.clamped && (
        <div className="text-xs text-amber-700 dark:text-amber-300">Inputs were outside chart range and have been clamped to valid limits.</div>
      )}


      <div className="text-xs text-slate-500 dark:text-zinc-400 space-y-1">
        <div>Chart reference: AW169 RFM Supplement 5 (External Hoist, Goodrich) · {res.meta.figure} · Page {res.meta.page} · {res.meta.issue}</div>
        <div>Assumptions: OAT {res.meta.oat}, Rotor speed {res.meta.rotorSpeed}, Electrical load {res.meta.electricalLoad}. Headwind treated as headwind component.</div>
        <div>Disclaimer: For training/planning aid only. Verify against the RFM before flight.</div>
      </div>
    </div>
  );
}

