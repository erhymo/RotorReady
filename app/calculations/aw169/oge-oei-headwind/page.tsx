"use client";
import { useRouter } from "next/navigation";

import { useMemo, useState, useEffect } from "react";
import { compute } from "@/lib/calculations/aw169/ogeOeiHeadwind";

export default function Page() {
  const [paStr, setPaStr] = useState("0");
  const [oatStr, setOatStr] = useState("15");
  const router = useRouter();

  const [windStr, setWindStr] = useState("0");

  const LS_KEY = "calc:aw169:oge-oei-headwind:v1";
  const TTL_MS = 20 * 60 * 1000; // 20 minutes

  // Restore from localStorage if fresh (< TTL)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && typeof obj.savedAt === "number" && Date.now() - obj.savedAt < TTL_MS) {
          if (typeof obj.paStr === "string") setPaStr(obj.paStr);
          if (typeof obj.oatStr === "string") setOatStr(obj.oatStr);
          if (typeof obj.windStr === "string") setWindStr(obj.windStr);
        } else {
          localStorage.removeItem(LS_KEY);
        }
      }
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ paStr, oatStr, windStr, savedAt: Date.now() }));
    } catch {}
  }, [paStr, oatStr, windStr]);

  const pa = parseFloat(paStr);
  const oat = parseFloat(oatStr);
  const wind = parseFloat(windStr);

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
        <div className="mb-2">
          <button type="button" onClick={() => router.back()} className="text-sm text-slate-600 dark:text-zinc-300 hover:underline">
            ← Back
          </button>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hover Ceiling OGE Unfactored Headwind - OEI 2.5 min</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-1">Rotor speed: PLUS · Electrical load: 100% · OAT lines: -40..+50°C · Headwind treated as headwind component only</p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="block text-sm">
          <span className="text-slate-700 dark:text-zinc-200">Pressure altitude (ft)</span>
          <input type="number" className="mt-1 w-full rounded-md border bg-white/70 dark:bg-zinc-900/70 px-3 py-2"
            value={paStr} onChange={e => setPaStr(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="text-slate-700 dark:text-zinc-200">OAT (°C)</span>
          <div className="mt-1 flex gap-2">
            <input type="text" inputMode="numeric" pattern="-?[0-9]*" placeholder="e.g. -10" className="w-full rounded-md border bg-white/70 dark:bg-zinc-900/70 px-3 py-2"
              value={oatStr} onChange={e => setOatStr(e.target.value.replace(/[^0-9-]/g, ''))} />
            <div className="flex items-stretch gap-1">
              <button type="button" className="px-3 rounded-md border bg-white/70 dark:bg-zinc-900/70" onClick={() => setOatStr(() => {
                const v = parseFloat(oatStr);
                const n = Number.isFinite(v) ? Math.max(-40, v - 1) : -1;
                return String(n);
              })}>–</button>
              <button type="button" className="px-3 rounded-md border bg-white/70 dark:bg-zinc-900/70" onClick={() => setOatStr(() => {
                const v = parseFloat(oatStr);
                const n = Number.isFinite(v) ? Math.min(50, v + 1) : 1;
                return String(n);
              })}>+</button>
            </div>
          </div>
        </label>
        <label className="block text-sm">
          <span className="text-slate-700 dark:text-zinc-200">Headwind (kts)</span>
          <input type="number" min={0} max={50} step={1} className="mt-1 w-full rounded-md border bg-white/70 dark:bg-zinc-900/70 px-3 py-2"
            value={windStr} onChange={e => setWindStr(e.target.value)} />
        </label>

      </div>

      <section>
        <div className="rounded-lg border p-4">
          <div className="text-xs text-slate-500 dark:text-zinc-400">Max GW (kg)</div>
          <div className="text-2xl font-bold">{res.maxGwKg}</div>
        </div>
      </section>
      {res.clamped && (
        <div className="text-xs text-amber-700 dark:text-amber-300">Inputs were outside chart range and have been clamped to valid limits.</div>
      )}


      <div className="text-xs text-slate-500 dark:text-zinc-400 space-y-1">
        <div>Chart reference: AW169 RFM Supplement 5 (External Hoist, Goodrich) · {res.meta.figure} · Page {res.meta.page} · {res.meta.issue}</div>
        <div>Assumptions: OAT {res.meta.oat}, Rotor speed {res.meta.rotorSpeed}, Electrical load {res.meta.electricalLoad}. Headwind treated as headwind component.</div>
        <div>Headwind planning credit: Headwind is automatically reduced by 50% in accordance with the QRH. Enter the actual wind.</div>
        <div>Disclaimer: For training/planning aid only. Verify against the RFM before flight.</div>
      </div>
    </div>
  );
}

