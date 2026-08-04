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

type FuelType = "jetA1" | "avgas100LL";

const FUEL_LABELS: Record<FuelType, { name: string; density: number }> = {
  jetA1: { name: "Jet A-1", density: 0.8 },
  avgas100LL: { name: "Avgas 100LL", density: 0.72 },
};

export default function UnitConversionsCalculator({ fuelType = "jetA1" }: { fuelType?: FuelType }) {
  const router = useRouter();

  const [knots, setKnots] = useState("");
  const [kmh, setKmh] = useState("");

  const [nm, setNm] = useState("");
  const [km, setKm] = useState("");

  const [ft, setFt] = useState("");
  const [meters, setMeters] = useState("");

  const [kg, setKg] = useState("");
  const [lb, setLb] = useState("");

  const [fuelKg, setFuelKg] = useState("");
  const [fuelL, setFuelL] = useState("");

  const [distNm, setDistNm] = useState("");
  const [spdKts, setSpdKts] = useState("");
  const [timeMin, setTimeMin] = useState("");

  const fuel = FUEL_LABELS[fuelType];

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Conversions</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-1 text-sm">
          Quick unit conversions for planning: speed, distance, altitude, weight and fuel.
          For training use only - always cross-check with your SOP and performance data.
        </p>
      </header>

      <section className="space-y-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">Speed: knots &lt;-&gt; km/h</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Knots</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={knots}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setKnots(v);
                  const n = parseNum(v);
                  setKmh(fmt(n != null ? n * 1.852 : null, 1));
                }}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">km/h</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={kmh}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setKmh(v);
                  const n = parseNum(v);
                  setKnots(fmt(n != null ? n / 1.852 : null, 1));
                }}
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">Distance: NM &lt;-&gt; km</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Nautical miles</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={nm}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setNm(v);
                  const n = parseNum(v);
                  setKm(fmt(n != null ? n * 1.852 : null, 1));
                }}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Kilometres</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={km}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setKm(v);
                  const n = parseNum(v);
                  setNm(fmt(n != null ? n / 1.852 : null, 1));
                }}
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">Altitude: ft &lt;-&gt; m</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Feet</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={ft}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setFt(v);
                  const n = parseNum(v);
                  setMeters(fmt(n != null ? n * 0.3048 : null, 0));
                }}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Metres</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={meters}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setMeters(v);
                  const n = parseNum(v);
                  setFt(fmt(n != null ? n / 0.3048 : null, 0));
                }}
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">Weight: kg &lt;-&gt; lb</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Kilograms</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={kg}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setKg(v);
                  const n = parseNum(v);
                  setLb(fmt(n != null ? n * 2.20462 : null, 1));
                }}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Pounds</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={lb}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setLb(v);
                  const n = parseNum(v);
                  setKg(fmt(n != null ? n / 2.20462 : null, 1));
                }}
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">Fuel: {fuel.name} kg &lt;-&gt; litres</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">
            Uses approx density {fuel.density.toFixed(2)} kg/l at 15C.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Kilograms</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={fuelKg}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setFuelKg(v);
                  const n = parseNum(v);
                  setFuelL(fmt(n != null ? n / fuel.density : null, 1));
                }}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Litres</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={fuelL}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setFuelL(v);
                  const n = parseNum(v);
                  setFuelKg(fmt(n != null ? n * fuel.density : null, 1));
                }}
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <h2 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">Time / speed / distance</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">
            Enter distance (NM) and ground speed (kt) to get time in minutes.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Distance (NM)</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={distNm}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setDistNm(v);
                  const d = parseNum(v);
                  const s = parseNum(spdKts);
                  const t = d != null && s != null && s > 0 ? (d / s) * 60 : null;
                  setTimeMin(fmt(t, 0));
                }}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Ground speed (kt)</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={spdKts}
                inputMode="decimal"
                onChange={(e) => {
                  const v = e.target.value;
                  setSpdKts(v);
                  const d = parseNum(distNm);
                  const s = parseNum(v);
                  const t = d != null && s != null && s > 0 ? (d / s) * 60 : null;
                  setTimeMin(fmt(t, 0));
                }}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="block text-slate-700 dark:text-zinc-200">Time (min)</span>
              <input
                className="w-full rounded border px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
                value={timeMin}
                readOnly
              />
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
