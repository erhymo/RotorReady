"use client";

import { useState } from "react";
import AppTopBar from "@/components/AppTopBar";
import S92_ABBREVIATIONS from "@/data/s92/abbreviations";

const data = {
  torqueDual: {
    title: "Propulsion & Drive Limits — Dual Engine (Q% / TGT °C / Ng % / Np %)",
    items: [
      {
        label: "Max continuous",
        lines: [
          "Torque: 100%",
          "TGT: 935 °C",
          "Ng: 99.9%",
          "Np/Nr: 106% / 105%",
        ],
      },
      {
        label: "30 min (hover only)",
        lines: [
          "Torque: 100%",
          "TGT: 988 °C",
          "Ng: 101.5%",
        ],
      },
      {
        label: "Takeoff (5 min)",
        lines: [
          "Torque: 100%",
          "TGT: 995 °C",
          "Ng: 102.9%",
        ],
      },
      {
        label: "Transient",
        lines: [
          "12 s: TGT 1003 °C / Ng 103.7% / Np 116%",
          "10 s: Torque 120%",
        ],
      },
      {
        label: "Notes",
        lines: [
          "86% Q above 100 KIAS is a flight-control-load limit, not a gearbox limit.",
          "One engine may exceed 100% up to 110% provided the other is proportionally less and the sum ≤ 200%.",
          "Np overspeed trip: 120%. Ng overspeed trip: 108.5%.",
        ],
      },
    ],
  },
  torqueSingle: {
    title: "Propulsion & Drive Limits — Single Engine / OEI (Q% / TGT °C / Ng % / Np %)",
    items: [
      {
        label: "Max continuous",
        lines: [
          "Torque: 120%",
          "TGT: 988 °C",
          "Ng: 102.4%",
          "Np/Nr: 106% / 105%",
        ],
      },
      {
        label: "OEI 2 min",
        lines: [
          "Torque: 120%",
          "TGT: 1006 °C",
          "Ng: 102.9%",
          "Np/Nr: 106% / 100%",
        ],
      },
      {
        label: "OEI 30 sec",
        lines: [
          "Torque: 141%",
          "TGT: 1049 °C",
          "Ng: 103.7%",
          "Np/Nr: 106% / 100%",
        ],
      },
      {
        label: "Transient 5 sec / Max starting peak",
        lines: [
          "Torque: 156%",
          "TGT (max starting peak): 1000 °C",
        ],
      },
    ],
  },
  nrAvoid: {
    title: "Np/Nr Avoid Ranges",
    items: [
      {
        label: "Avoid prolonged operation",
        lines: [
          "36% to 49% — tail rotor drive shaft critical range",
          "56% to 67% — engine power turbine critical range",
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
          "VNE power on (max airspeed): 165 KIAS",
          "VNE power off: 120 KIAS (or lower VNE power-on value if below 120 KIAS)",
          "Vmini (IFR): 50 KIAS",
          "Max with landing gear down/in transit: 165 KIAS",
          "Max with APU operating: 150 KIAS",
        ],
      },
      {
        label: "Degraded configurations (all): 120 KIAS max",
        lines: [
          "One engine inoperative",
          "One or both SAS inoperative",
          "Both APs inoperative",
          "One primary flight control servo inoperative",
          "Hydraulic boost inoperative",
          "Any sliding door/window pinned open",
        ],
      },
      {
        label: "Ground / low-speed",
        lines: [
          "Max groundspeed takeoff/landing: 65 kt (50 kt per later manual change)",
          "Max groundspeed taxi: 35 kt",
          "Max groundspeed brake application: 35 kt",
          "Max sideward flight / crosswind hover: 35 kt",
          "Max rearward flight / tailwind hover: 35 kt",
        ],
      },
      {
        label: "Other",
        lines: [
          "Max for landing gear emergency blowdown: 90 KIAS",
          "Max for opening/closing sliding door or window: 80 KIAS",
          "Max standard wiper operation: 40 kt; improved wiper: 100 KIAS",
        ],
      },
    ],
  },
  altitude: {
    title: "Altitude Limits",
    items: [
      {
        label: "General",
        lines: [
          "Enroute: 15,000 ft density altitude",
          "Cat A ground level helipad: 5,500 ft density altitude or 6,000 ft pressure altitude, whichever is lower",
          "Icing flight (RIPS on): up to 10,000 ft pressure altitude",
        ],
      },
      {
        label: "Coupled operations",
        lines: [
          "Above 120 KIAS: min 200 ft AGL",
          "At or below 120 KIAS: min 50 ft AGL (monitor controls below 200 ft; VMC required below 100 ft)",
        ],
      },
    ],
  },
  weightCg: {
    title: "Weight & CG Limits",
    items: [
      {
        label: "Weight",
        lines: [
          "Max takeoff and landing weight: 26,500 lb (12,020 kg)",
          "Min operating weight: 16,200 lb (7,348 kg)",
        ],
      },
      {
        label: "Loading",
        lines: [
          "Max cabin floor loading: 75 lb/ft² (366 kg/m²); heavy-duty floor: 200 lb/ft² (976 kg/m²)",
          "Max combined baggage/ramp load: 1,000 lb (454 kg); max shelf load: 300 lb (136 kg)",
          "Fuel imbalance above 700 lb (317 kg) combined with unbalanced cargo may exceed lateral CG limits",
        ],
      },
      {
        label: "Ambient temperature",
        lines: [
          "Operating range: -40 °C to ISA +35 °C",
          "Engines shut down below -25 °C ground OAT for over 1 hr: warm to 0 °C for 8 hr, or use Cold Weather Pre-heat kit before flight",
          "Pitot heat / engine anti-ice ON below +5 °C OAT",
        ],
      },
    ],
  },
  groundFlight: {
    title: "Ground & Flight Limits",
    items: [
      {
        label: "Crosswind & slope",
        lines: [
          "Cat A horizontal takeoff/landing: max 35 kt crosswind",
          "Cat A ground level helipad: max 22 kt crosswind",
          "Slope landing: 10° nose up/down slope, 13° left/right side up-slope",
        ],
      },
      {
        label: "Prohibited",
        lines: [
          "Aerobatic maneuvers",
          "Practice touchdown autorotations",
          "360° hovering turns in less than 12 seconds",
          "Flight in freezing drizzle/rain or supercooled large drops (SLD)",
          "Use of OEI power ratings except for an actual engine failure",
        ],
      },
      {
        label: "Other",
        lines: [
          "Max bank angle, one primary flight control servo inoperative: 30°",
          "Low fuel light(s) illuminated: avoid pitch >10° nose up or >5° nose down",
          "Fuel crossfeed: Cat A emergency operation only; Cat B cruise flight only",
        ],
      },
    ],
  },
  engineOil: {
    title: "Engine Oil Limits",
    items: [
      {
        label: "Pressure",
        lines: [
          "Min idle: 20–30 psi",
          "Continuous: 30–100 psi",
          "Maximum (5 min): 100–120 psi",
          "Max fluctuation: 5 psi",
        ],
      },
      {
        label: "Temperature",
        lines: [
          "Max continuous: 132 °C",
          "15 min: 132–149 °C",
          "Maximum allowable: 149 °C",
        ],
      },
    ],
  },
  starterFuel: {
    title: "Starter & Fuel Limits",
    items: [
      {
        label: "Back-to-back starting",
        lines: [
          "OAT above +15 °C: 2 starts, 5 min cooling, 2 starts, 30 min cooling, then repeat",
          "OAT +15 °C or less: 4 starts, 15 min cooling, 4 starts, 30 min cooling, then repeat",
        ],
      },
      {
        label: "Fuel temperature (Jet A / A-1 / JP-5 / JP-8)",
        lines: [
          "Max: 57 °C (135 °F)",
          "Min: -40 °C (-40 °F)",
          "Anti-icing additive required below -20 °C",
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

export default function S92QuickReferencePage() {
  const [showAbbr, setShowAbbr] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar
        title="S-92 Quick Reference"
        backHref="/"
        backLabel="Home"
        rightAction={
          <button
            type="button"
            onClick={() => setShowAbbr((v) => !v)}
            className="px-3 py-1 rounded border text-xs font-medium bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
          >
            ABBR
          </button>
        }
      />

      <main className="mx-auto max-w-3xl p-4 space-y-4">
        <p className="text-xs text-slate-600 dark:text-zinc-300">
          For training use only. This is an informal quick reference of selected S-92 RFM limitations. Always use the
          official RFM as primary reference.
        </p>

        {showAbbr && (
          <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">Abbreviations</h2>
            <ul className="divide-y divide-slate-200 dark:divide-zinc-700 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              {S92_ABBREVIATIONS.map((row, i) => (
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

        <GroupCard title={data.torqueDual.title} items={data.torqueDual.items} />
        <GroupCard title={data.torqueSingle.title} items={data.torqueSingle.items} />
        <GroupCard title={data.nrAvoid.title} items={data.nrAvoid.items} />
        <GroupCard title={data.airspeed.title} items={data.airspeed.items} />
        <GroupCard title={data.altitude.title} items={data.altitude.items} />
        <GroupCard title={data.weightCg.title} items={data.weightCg.items} />
        <GroupCard title={data.groundFlight.title} items={data.groundFlight.items} />
        <GroupCard title={data.engineOil.title} items={data.engineOil.items} />
        <GroupCard title={data.starterFuel.title} items={data.starterFuel.items} />
      </main>
    </div>
  );
}
