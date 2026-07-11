"use client";

import { useState } from "react";
import AppTopBar from "@/components/AppTopBar";
import H135T3_ABBREVIATIONS from "@/data/h135t3/abbreviations";

const data = {
  general: {
    title: "General & Crew",
    items: [
      {
        label: "Kinds of operation / min crew",
        lines: [
          "Approved for day and night VFR and IFR",
          "Minimum flight crew: 1 pilot from the right crew seat",
          "Max occupants: 8 persons (including flight crew)",
        ],
      },
    ],
  },
  operational: {
    title: "Operational Limits",
    items: [
      {
        label: "Prohibited",
        lines: [
          "Aerobatic maneuvers",
          "Intentional full autorotation landings for training",
          "Flight into known icing conditions",
        ],
      },
      {
        label: "Wind",
        lines: [
          "Rotor start/stop: max 50 kt from all directions, max 25 kt rear wind component",
          "Max rear wind component (forward flight): 25 kt",
        ],
      },
      {
        label: "Slope operations (A.TRIM off above 3°)",
        lines: [
          "Max 14° sloping down left/right",
          "Max 12° nose up, max 8° nose down (tail clearance permitting)",
          "Max 6° if mast moment indication has failed",
        ],
      },
      {
        label: "Hover turns",
        lines: [
          "Max 60°/s (6 s/360°) up to 2850 kg",
          "Max 30°/s (12 s/360°) above 2850 kg or HIGH NR active — aggressive pedal turns forbidden",
        ],
      },
    ],
  },
  afcs: {
    title: "AFCS Limits",
    items: [
      {
        label: "Level of attentiveness",
        lines: [
          "Above 500 ft AGL: hands-off permitted",
          "Below 500 ft: attentive hands-off/on or manual",
          "Below 100 ft: attentive hands-on or manual",
          "Below 10 ft: manual only",
        ],
      },
      {
        label: "Vmini / degraded modes",
        lines: [
          "Vmini: 30 KIAS with 4-axis AFCS; 60 KIAS otherwise",
          "Backup SAS: max 120 KIAS or Vne, max bank 45°",
          "AFCS OFF: max 120 KIAS or Vne, max bank 30°",
        ],
      },
      {
        label: "ILS / approach",
        lines: [
          "Max glideslope: 6.7° ILS, 10.0° LPV/LNAV-VNAV",
          "Max descent rate: 1000 ft/min approach, 1500 ft/min enroute",
          "Max tailwind on steep approach (>6°): 15 kt",
        ],
      },
    ],
  },
  mass: {
    title: "Mass & Loading",
    items: [
      {
        label: "Weight",
        lines: [
          "Max ramp/taxi weight: 3000 kg",
          "Max gross mass: 2980 kg",
          "Min gross mass for flight: 1700 kg",
        ],
      },
      {
        label: "Loading",
        lines: [
          "Max floor loading: 600 kg/m²",
          "Max tie-down ring load: 100 kg",
          "Max safety harness fitting load: 230 kg",
        ],
      },
    ],
  },
  altitudeTemp: {
    title: "Altitude & Temperature",
    items: [
      {
        label: "Altitude",
        lines: [
          "Max operating altitude: 20,000 ft",
          "Max altitude for HIGE/T.O./landing: 16,000 ft DA or PA, whichever is less",
        ],
      },
      {
        label: "Temperature",
        lines: [
          "Max OAT: ISA+39°C (abs. max +50°C); if ≥40°C, max 30 min ground ops",
          "Min OAT: -35°C",
          "Min battery temp for engine start: -20°C (preheat if colder)",
        ],
      },
    ],
  },
  rotorEngine: {
    title: "Rotor, Engine & Torque",
    items: [
      {
        label: "Rotor / N2",
        lines: [
          "Lead-lag resonance range: 60-68% NR — cyclic neutral, collective full down",
          "TOP (takeoff power) rating: max 5 minutes",
        ],
      },
      {
        label: "Torque (AEO / OEI)",
        lines: [
          "AEO max continuous: 2×69%; TOP (5 min): 2×78%; transient: 2×82%",
          "OEI max continuous: 89.5%; 2 min: 125%; 30 sec: 128%",
        ],
      },
      {
        label: "TOT",
        lines: [
          "Starting continuous 819°C, transient (5 s) 910°C",
          "AEO max continuous 879°C, TOP 897°C",
          "OEI max continuous 942°C, 2 min 994°C, 30 sec 1024°C",
        ],
      },
    ],
  },
  fluidsFuel: {
    title: "Fluids & Fuel",
    items: [
      {
        label: "Engine oil",
        lines: [
          "Pressure: min 1.3 bar, continuous 1.3-5 bar, max 10 bar",
          "Temperature: continuous 10-110°C, max 110°C, min for starting -35°C",
        ],
      },
      {
        label: "Main transmission oil",
        lines: [
          "Pressure: min 0.5 bar, continuous 0.5-7.8 bar",
          "Temperature: continuous 0-105°C, max 120°C",
        ],
      },
      {
        label: "Fuel",
        lines: [
          "Max viscosity: 12 cSt",
          "Total usable fuel: 700.55 litres / 560.40 kg (unusable: 9.45 litres / 7.6 kg)",
          "Anti-icing additive concentration: max 0.15%, min 0.10%",
        ],
      },
      {
        label: "Generator / hydraulics",
        lines: [
          "Max continuous generator load: 200 A below 15,000 ft, 180 A above",
          "Max ground power start current: 700 A",
        ],
      },
    ],
  },
  emergencyQuick: {
    title: "Emergency Quick Facts",
    items: [
      {
        label: "Engine failure",
        lines: [
          "Double engine failure in flight: perform autorotation",
          "Autorotation: 75 KIAS recommended (90 KIAS max range, 60 KIAS min R/D)",
          "Flare attitude at approx. 100 ft AGL",
        ],
      },
      {
        label: "Fire",
        lines: [
          "Extinguisher bottle auto-discharges at N1 < 50%",
          "ENG FIRE warning still on after shutdown: LAND IMMEDIATELY",
        ],
      },
      {
        label: "Fuel",
        lines: [
          "Both LOW FUEL warnings on: LAND WITHIN 10 MINUTES",
          "FUEL RESERVE triggers at approx. 36 kg/45 L (tank 1) or 32 kg/40 L (tank 2)",
        ],
      },
      {
        label: "Mast moment failure",
        lines: [
          "Slope landing >6° prohibited",
          "Center cyclic manually via stick position indicator before T/O and after landing",
        ],
      },
    ],
  },
} as const;

type GroupItem = { label: string; lines: readonly string[] };
type Group = { title: string; items: readonly GroupItem[] };

function GroupCard({ title, items }: Group) {
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

export default function H135T3QuickReferencePage() {
  const [showAbbr, setShowAbbr] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar
        title="H135 T3 Quick Reference"
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
          For training use only. This is an informal quick reference of selected H135 T3 (EC135 T3H) Flight Manual
          limitations, sourced from the Helionix Step 3.5 / 3 MFD cockpit configuration. Always use the official Flight
          Manual as primary reference.
        </p>

        {showAbbr && (
          <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">Abbreviations</h2>
            <ul className="divide-y divide-slate-200 dark:divide-zinc-700 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              {H135T3_ABBREVIATIONS.map((row, i) => (
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

        <GroupCard title={data.general.title} items={data.general.items} />
        <GroupCard title={data.operational.title} items={data.operational.items} />
        <GroupCard title={data.afcs.title} items={data.afcs.items} />
        <GroupCard title={data.mass.title} items={data.mass.items} />
        <GroupCard title={data.altitudeTemp.title} items={data.altitudeTemp.items} />
        <GroupCard title={data.rotorEngine.title} items={data.rotorEngine.items} />
        <GroupCard title={data.fluidsFuel.title} items={data.fluidsFuel.items} />
        <GroupCard title={data.emergencyQuick.title} items={data.emergencyQuick.items} />
      </main>
    </div>
  );
}
