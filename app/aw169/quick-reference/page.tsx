"use client";

import { useState } from "react";
import { BackButton } from "@/app/components/BackButton";
import AW169_ABBREVIATIONS from "@/data/aw169/abbreviations";

const data = {
  torque: {
    title: "Transmission Torque (TQ %)",
    items: [
      {
        label: "AEO 90 KIAS and below",
        lines: [
          "Max continuous: 100%",
          "30 min: 101–111%",
          "Max 30 min: 111%",
          "Transient 10 s: 125%",
        ],
      },
      {
        label: "AEO above 90 KIAS",
        lines: [
          "Max continuous: 100%",
          "Transient 10 s: 125%",
        ],
      },
      {
        label: "OEI",
        lines: [
          "Max continuous: 140%",
          "2.5 min: 141–174%",
          "Max 2.5 min: 174%",
          "Transient 10 s: 192%",
        ],
      },
    ],
  },
  nr: {
    title: "Rotor Speed (NR %)",
    items: [
      {
        label: "AEO power-on",
        lines: [
          "Variable governing with PLUS-mode",
          "Transient min: 90%",
          "Transient max: 107%",
        ],
      },
      {
        label: "OEI power-on",
        lines: [
          "Transient min: 85%",
          "Cautionary (OEI landing/flyaway only): 90–100%",
          "Min continuous: 101%",
          "Continuous: 101–105%",
          "Max continuous: 105%",
          "Transient max: 107%",
        ],
      },
      {
        label: "Power-off",
        lines: [
          "Transient min: 85%",
          "Min continuous: 90%",
        ],
      },
    ],
  },
  airspeed: {
    title: "Airspeed Limits (selected)",
    items: [
      {
        label: "General",
        lines: [
          "Max airspeed AEO with TQ above 100%: 90 KIAS",
          "IFR Vmini: 50 KIAS",
          "Max IFR approach: 130 KIAS at and below 5000 ft, then minus 2 kt / 1000 ft above",
          "Max with one AP failed: 120 KIAS",
          "Max wipers: 140 KIAS",
          "Min autorotation: 50 KIAS",
        ],
      },
    ],
  },
  ground: {
    title: "Ground & Handling Limits",
    items: [
      {
        label: "Slope limits (basic configuration)",
        lines: [
          "Sloped take‑off and landing limited to:",
          "Nose up: 10°",
          "Nose down: 7°",
          "Left wing low: 10°",
          "Right wing low: 10°",
        ],
      },
      {
        label: "Wheel brake & parking",
        lines: [
          "Max running speed for wheel brake application: 40 knots GS",
          "Parking on dry, paved slopes up to 12° permitted for max 20 hours.",
        ],
      },
      {
        label: "Ground speed (selected)",
        lines: [
          "On paved surfaces (dry, paved): max taxi speed 40 knots GS, rolling take-off / running landing 60 knots GS, max emergency landing speed 60 knots GS",
          "On prepared grass: max taxi speed 20 knots GS",
          "Rolling take-off / running landing: 30 knots GS",
          "Max emergency landing speed: 50 knots GS",
        ],
      },
      {
        label: "Wind for engine/rotor start & stop",
        lines: [
          "If forecast wind exceeds 50 knots, park in sheltered area or hangar.",
        ],
      },
    ],
  },
  enhancedPerformance: {
    title: "Enhanced Performance",
    items: [
      {
        label: "AEO",
        lines: [
          "Max takeoff TQ: 122%",
          "Max transient TQ: 132%",
        ],
      },
      {
        label: "OEI",
        lines: [
          "Max continuous TQ: 148%",
          "Max 2.5 min TQ: 185%",
          "Max transient TQ: 195%",
        ],
      },
    ],
  },
  itt: {
    title: "Inlet / Inter Turbine Temperature (ITT °C)",
    items: [
      {
        label: "Engine start",
        lines: [
          "Max for start: 750 °C",
          "Transient 2 s: up to 825 °C",
        ],
      },
      {
        label: "AEO",
        lines: [
          "Max continuous: 868 °C (100%)",
          "30 min: 869–930 °C (100.1–107.1%)",
          "Max 30 min: 930 °C (107.1%)",
          "Transient 20 s: 941 °C (108.4%)",
        ],
      },
      {
        label: "OEI",
        lines: [
          "Max continuous: 941 °C (108.4%)",
          "2.5 min: 942–1020 °C (108.5–117.5%)",
          "Max 2.5 min: 1020 °C (117.5%)",
        ],
      },
    ],
  },
  engineOil: {
    title: "Engine Oil Limits",
    items: [
      {
        label: "Engine oil pressure (bar)",
        lines: [
          "Normal range: 5.1–18.1 bar",
          "Transient max (20 s): 21.0 bar",
          "Transient min (20 s): 2.6 bar",
        ],
      },
      {
        label: "Engine oil temperature (°C)",
        lines: [
          "Normal range: -40 to 135 °C",
          "Cautionary range: 135 to 160 °C (1 min)",
        ],
      },
    ],
  },
  weight: {
    title: "Weight Limits (basic configuration)",
    items: [
      {
        label: "Basic RFM Section 1",
        lines: [
          "Max gross weight for towing / taxi: 4650 kg",
          "Max gross weight for CAT B take-off / landing: 4600 kg",
          "Min flight / rotor-running gross weight: 3300 kg",
        ],
      },
      {
        label: "Increased gross weight (Supplement 30)",
        lines: [
          "Max gross weight for towing / taxi: 4850 kg",
          "Max gross weight for take-off / landing: 4800 kg",
        ],
      },
    ],
  },
};

function GroupCard({ title, items }: { title: string; items: { label: string; lines: string[] }[] }) {
  return (
    <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 space-y-3">
      <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">{title}</h2>
      <div className="space-y-2 text-sm text-slate-800 dark:text-zinc-100">
        {items.map((item) => (
          <div key={item.label} className="space-y-0.5">
            <div className="font-medium">{item.label}</div>
            <ul className="list-disc pl-5 space-y-0.5">
              {item.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AW169QuickReferencePage() {
  const [showAbbr, setShowAbbr] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between gap-3">
          <BackButton label="Home" to="/" />
          <h1 className="text-sm font-semibold tracking-widest opacity-80">AW169 QUICK REFERENCE</h1>
          <button
            type="button"
            onClick={() => setShowAbbr((v) => !v)}
            className="px-3 py-1 rounded border text-xs font-medium bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
          >
            ABBR
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-3xl p-4 space-y-4">
        <p className="text-xs text-slate-600 dark:text-zinc-300">
          For training use only. This is an informal quick reference of selected AW169 RFM limitations. Always use the
          official RFM / QRH as primary reference.
        </p>

        {showAbbr && (
          <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">Abbreviations</h2>
            <ul className="divide-y divide-slate-200 dark:divide-zinc-700 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              {AW169_ABBREVIATIONS.map((row, i) => (
                <li
                  key={`${row.abbr}-${i}`}
                  className="flex items-start gap-4 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-100"
                >
                  <div className="w-32 shrink-0 font-mono font-semibold">{row.abbr}</div>
                  <div className="flex-1 text-slate-700 dark:text-zinc-200">{row.meaning}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <GroupCard title={data.torque.title} items={data.torque.items} />
        <GroupCard title={data.enhancedPerformance.title} items={data.enhancedPerformance.items} />
        <GroupCard title={data.nr.title} items={data.nr.items} />
        <GroupCard title={data.airspeed.title} items={data.airspeed.items} />
        <GroupCard title={data.ground.title} items={data.ground.items} />
        <GroupCard title={data.itt.title} items={data.itt.items} />
        <GroupCard title={data.engineOil.title} items={data.engineOil.items} />
        <GroupCard title={data.weight.title} items={data.weight.items} />
      </main>
    </div>
  );
}

