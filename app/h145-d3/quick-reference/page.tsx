"use client";

import { useState } from "react";
import AppTopBar from "@/components/AppTopBar";
import H145D3_ABBREVIATIONS from "@/data/h145d3/abbreviations";

const data = {
  general: {
    title: "General & Crew",
    items: [
      {
        label: "Kinds of operation / min crew",
        lines: [
          "Certified CS/FAR 29; Category B day/night VFR and IFR",
          "Cat A (FMS 9.1-1) and NVG (FMS 9.2-11) with special equipment",
          "Minimum flight crew: 1 pilot from the right crew seat",
          "Single pilot from left seat: VFR only, no pax right seat, rotor brake not required, normal collective installed",
          "Max occupants: 10 persons (including flight crew)",
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
          "Autorotation training with engines OFF/IDLE",
          "Flight into known icing conditions, volcanic ash",
          "(If IRS installed) flight in salty environment",
        ],
      },
      {
        label: "Wind",
        lines: ["Rotor start/stop: max 50 kt from any horizontal direction"],
      },
      {
        label: "Slope operations",
        lines: [
          "Max 10° nose down (tail clearance permitting)",
          "Max 12° sloping right, max 8° sloping left",
          "Max 8° nose up",
          "Max 3° if mast moment indication has failed",
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
          "GA mode activation below 4 ft AGL: prohibited",
        ],
      },
      {
        label: "Vmini / degraded modes",
        lines: [
          "Vmini: 30 KIAS with 4-axis AFCS (3 upper modes); 60 KIAS otherwise",
          "Backup SAS / AFCS OFF: max 110 KIAS or Vne (whichever less), max bank 45°",
        ],
      },
      {
        label: "ILS / approach",
        lines: [
          "Max glideslope: 6.7° ILS, 10.0° LPV/LNAV-VNAV",
          "Max descent rate: 1000 ft/min approach, 1500 ft/min enroute",
          "Max tailwind on steep approach (>6°): 15 kt",
          "Min height in IMC approach: 200 ft AGL",
        ],
      },
    ],
  },
  mass: {
    title: "Mass & Loading",
    items: [
      {
        label: "Weight",
        lines: ["Max gross mass: 3800 kg (100 kg more than H145 D2)", "Min gross mass for flight: 2000 kg"],
      },
      {
        label: "Loading",
        lines: [
          "Max floor loading: 600 kg/m²",
          "Max tie-down ring load: 70 kg",
          "Forward/middle multi-purpose brackets: max 200 kg/person, max 40 kg equipment",
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
          "Max operating altitude: 20,000 ft PA",
          "Max altitude for HIGE/T.O./landing: 20,000 ft PA or DA, whichever is less",
        ],
      },
      {
        label: "Temperature",
        lines: [
          "Basic config: max ISA+35°C (abs. max +50°C), min -30°C",
          "With oil cooler blocking plates (cold weather kit): max +35°C, min -45°C",
          "If OAT ≥ +40°C: max 30 min ground operating time",
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
          "NR min continuous: 85% above 2250 kg, 80% below 2250 kg",
          "Rotor brake permitted: 0-50% NR",
          "N2 min continuous 94%, max continuous 108.3%",
        ],
      },
      {
        label: "Torque (AEO / OEI)",
        lines: [
          "AEO max continuous: 2×74%; takeoff power (30 min): 2×95%; transient: 2×104.5%",
          "Amber torque range disappears between VY+10kt and VY+25kt",
          "OEI max continuous: 100%; 2 min: 143%; 30 sec: 150%",
        ],
      },
      {
        label: "TOT / FLI",
        lines: [
          "Starting: continuous 760°C, transient 840°C (max 10 s, auto stop)",
          "FLI red teardrop transient: max 12 s unintended use",
        ],
      },
    ],
  },
  fluidsFuel: {
    title: "Fluids & Fuel",
    items: [
      {
        label: "Engine oil",
        lines: ["Max oil temperature (high red limit): 117°C"],
      },
      {
        label: "Main gearbox (MGB) oil",
        lines: [
          "Pressure: min red 0.7-1.0 bar, continuous 1.3-5.0 bar, max red 5.0 bar",
          "Temperature: continuous -10 to 105°C",
        ],
      },
      {
        label: "Fuel",
        lines: [
          "Max viscosity: 12 cSt",
          "Total usable fuel: 903.8 litres / 723.0 kg",
          "Biobor JF biocide: 0.1 ml/l curative, 0.2 ml/l preventive",
        ],
      },
      {
        label: "Hydraulics / generator",
        lines: [
          "Hydraulic pressure: min 69 bar, continuous 90-120 bar, max 150 bar (fluid: MIL-H-5606)",
          "Max continuous generator load: 200 A below 15,000 ft, 180 A above; total both: 360 A",
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
          "Autorotation: max range 90 KIAS, min rate-of-descent 60 KIAS (target Vy)",
          "Flare attitude ~100 ft AGL (15-20°), reduce to ~10° at 8-12 ft AGL",
        ],
      },
      {
        label: "Fire",
        lines: [
          "Extinguisher bottle auto-discharges when N1 ≤ 45%",
          "ENG FIRE warning still on after both bottles: LAND IMMEDIATELY",
        ],
      },
      {
        label: "Fuel",
        lines: [
          "Both LOW FUEL warnings on: LAND WITHIN 8 MINUTES",
          "LOW FUEL warning: supply tank <26 kg",
        ],
      },
      {
        label: "Mast moment",
        lines: [
          "Amber caution: 54-68% (higher than H145 D2's 54-66%)",
          "MM EXCEEDED warning: >83%/60s, >90%/20s, or >95%",
          "Avoid slope landings >3° and crosswind >10 kt if indication has failed",
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

export default function H145D3QuickReferencePage() {
  const [showAbbr, setShowAbbr] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar
        title="H145 D3 Quick Reference"
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
          For training use only. This is an informal quick reference of selected H145 D3 (BK117 D-3, Helionix
          SW V10, 5-bladed bearingless rotor) Flight Manual limitations. Always use the official Flight Manual
          as primary reference.
        </p>

        {showAbbr && (
          <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">Abbreviations</h2>
            <ul className="divide-y divide-slate-200 dark:divide-zinc-700 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              {H145D3_ABBREVIATIONS.map((row, i) => (
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
