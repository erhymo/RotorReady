"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function parseNum(input: string): number | null {
  const s = input.replace(",", ".").trim();
  if (!s) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function fmt(n: number | null, digits = 1): string {
  if (n == null || !Number.isFinite(n)) return "";
  return n.toFixed(digits);
}

function calcTas(pressAltStr: string, oatStr: string, iasStr: string): string {
  const altFt = parseNum(pressAltStr);
  const oatC = parseNum(oatStr);
  const iasKt = parseNum(iasStr);

  if (altFt == null || oatC == null || iasKt == null) return "";

  let h = altFt * 0.3048; // ft -> m
  if (!Number.isFinite(h) || h < 0) return "";
  if (h > 20000) h = 20000; // cap at 20 000 m

  let P: number;
  if (h < 11000) {
    P = 101325 * Math.pow(1 - 0.0000225577 * h, 5.25588);
  } else {
    P = 22632.1 * Math.exp(-0.0001577 * (h - 11000));
  }

  const T_K = oatC + 273.15;
  if (!Number.isFinite(T_K) || T_K <= 0) return "";

  const R = 287.05;
  const rho0 = 1.225;
  const rho = P / (R * T_K);
  if (!Number.isFinite(rho) || rho <= 0) return "";

  const tas = iasKt * Math.sqrt(rho0 / rho);
  return fmt(tas, 1);
}

export default function TrueAirspeedPage() {
  const router = useRouter();

  const [pressAlt, setPressAlt] = useState("");
  const [oat, setOat] = useState("");
  const [ias, setIas] = useState("");
  const [tas, setTas] = useState("");

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <header>
        <div className="mb-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-slate-600 dark:text-zinc-300 hover:underline"
          >
            &lt;- Back
          </button>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">True Airspeed</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-1 text-sm">
          Compute true airspeed (TAS) from indicated airspeed, pressure altitude and outside air temperature.
          ISA-based, subsonic speeds only. For training use.
        </p>
      </header>

      <section className="space-y-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">Inputs</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Pressure altitude (ft)</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={pressAlt}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setPressAlt(v);
                  setTas(calcTas(v, oat, ias));
                }}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Outside air temperature (deg C)</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={oat}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setOat(v);
                  setTas(calcTas(pressAlt, v, ias));
                }}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Indicated airspeed IAS (kt)</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={ias}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setIas(v);
                  setTas(calcTas(pressAlt, oat, v));
                }}
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">Result</h2>
          <div className="text-sm space-y-1">
            <span className="block text-slate-700 dark:text-zinc-200">True airspeed TAS (kt)</span>
            <input
              className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800"
              value={tas}
              readOnly
            />
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Approximated using ISA pressure and density model. Not for operational use.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

