"use client";

import { useState } from "react";
import AppTopBar from "@/components/AppTopBar";
import R22_ABBREVIATIONS from "@/data/r22/abbreviations";

// Selected R22 POH Section 2 (Limitations), Section 4 (Recommended Airspeeds) and
// Section 5 (Performance) numbers. For training use only.
const data = {
  airspeed: {
    title: "Airspeed Limits & Recommended Speeds",
    items: [
      {
        label: "Never-exceed airspeed (VNE)",
        lines: [
          "Up to 3000 ft density altitude: 102 KIAS.",
          "Above 3000 ft density altitude: reduced — see the VNE placards in Section 2.",
          "Airspeed indicator: green arc 50–102 KIAS, red line 102 KIAS.",
        ],
      },
      {
        label: "Recommended airspeeds (Section 4)",
        lines: [
          "Takeoff and climb: 60 KIAS.",
          "Maximum rate of climb (VY): 53 KIAS.",
          "Maximum range: 83 KIAS.",
          "Landing approach: 60 KIAS.",
          "Autorotation: 60–70 KIAS.",
          "Significant turbulence: 60–70 KIAS.",
        ],
      },
      {
        label: "Turbulence / AD 95-26-04 (unless 200 hr, 50 in R22, + SFAR 73)",
        lines: [
          "Flight prohibited when surface winds exceed 25 kt including gusts.",
          "Flight prohibited when surface wind gust spread exceeds 15 kt.",
          "Continued flight in moderate, severe or extreme turbulence is prohibited.",
          "On inadvertent turbulence encounter, adjust to between 60 KIAS and 0.7 VNE, but no lower than 57 KIAS.",
        ],
      },
    ],
  },
  rotor: {
    title: "Rotor & Engine RPM",
    items: [
      {
        label: "Rotor speed limits",
        lines: [
          "Power on: maximum 104 % (530 RPM), minimum 101 % (515 RPM).",
          "97 % (495 RPM) minimum permitted on R22s with O-320 engine and a 97–104 % green-arc tachometer.",
          "Power off: maximum 110 % (561 RPM), minimum 90 % (459 RPM).",
          "Transient operation below 101 % is permitted only for emergency-procedures training.",
        ],
      },
      {
        label: "Rotor tachometer markings",
        lines: [
          "Yellow arc 60–70 %; lower red line 90 %; lower yellow arc 90–101 %.",
          "Green arc 101–104 %; upper yellow arc 104–110 %; upper red line 110 %.",
        ],
      },
      {
        label: "Engine tachometer markings",
        lines: [
          "Yellow arc 60–70 %; lower red arc 90–101 %; green arc 101–104 %; upper red arc 104–110 %.",
          "R22s with the O-320 engine may have a green arc from 97 % to 104 %.",
        ],
      },
      {
        label: "Low / high RPM alerts",
        lines: [
          "Low RPM caution light and horn: rotor speed below 97 % — disabled with collective full down.",
          "High RPM warble (later aircraft): rotor speed approaching the 110 % limit.",
        ],
      },
    ],
  },
  engine: {
    title: "Powerplant Limits",
    items: [
      {
        label: "Engine",
        lines: [
          "One Lycoming O-320-A2B, -A2C, -B2C, or O-360-J2A — four-cylinder, horizontally opposed, direct-drive, air-cooled, carbureted, normally aspirated.",
          "Maximum continuous engine speed: 104 % (2652 RPM).",
          "Maximum transient: 106 % (2700 RPM). Intentional operation above maximum continuous is prohibited.",
        ],
      },
      {
        label: "Temperatures & oil",
        lines: [
          "Cylinder head temperature: maximum 500 °F (260 °C); green arc 200–500 °F.",
          "Oil temperature: maximum 245 °F (118 °C); green arc 75–245 °F.",
          "Oil pressure: minimum 25 psi at idle, 55 psi in flight; maximum 95 psi in flight, 115 psi at start & warm-up.",
          "Oil pressure gage: lower red 25, lower yellow 25–55, green 55–95, upper yellow 95–115, upper red 115 psi.",
          "Minimum oil quantity for takeoff: 4 qt (3.8 L).",
        ],
      },
      {
        label: "Manifold pressure & carburetor air",
        lines: [
          "Manifold pressure limits vary by engine and pressure altitude — see the LIMIT MANIFOLD PRESSURE placards (Section 2).",
          "Carburetor air temperature gage: yellow arc −15 to +5 °C (carb-ice range).",
          "Below 18 in. MAP the CAT gage is unreliable — apply full carburetor heat regardless of indication.",
        ],
      },
    ],
  },
  weight: {
    title: "Weight & Loading",
    items: [
      {
        label: "Gross weight limits",
        lines: [
          "Maximum gross weight — Standard & HP: 1300 lb (590 kg).",
          "Maximum gross weight — Alpha, Beta, Beta II: 1370 lb (622 kg).",
          "Minimum gross weight: 920 lb (417 kg).",
        ],
      },
      {
        label: "Seats, baggage & CG",
        lines: [
          "Maximum per seat, including its baggage compartment: 240 lb (109 kg).",
          "Maximum in either baggage compartment: 50 lb (23 kg).",
          "Reference datum is 100 in forward of the main rotor shaft centerline.",
          "With both doors installed, a solo pilot plus baggage of 135 lb (61 kg) or more keeps CG within limits; below that, compute weight and balance — removable ballast may be required.",
          "Minimum solo pilot weight placard: 130 lb (135 lb with full aux fuel), or see the POH.",
        ],
      },
    ],
  },
  fuel: {
    title: "Fuel",
    items: [
      {
        label: "Approved grades",
        lines: [
          "Grade 100 (green), 100LL / 100VLL (blue), UL 91 / UL 94, 91/96 UL, and other national grades per the filler-cap placards.",
          "Minimum grade per placard: 100-octane, or 91/96, or 100LL — see the Pilot's Handbook.",
        ],
      },
      {
        label: "Capacity (bladder tanks)",
        lines: [
          "Main tank: 16.9 US gal usable (18.3 total).",
          "Auxiliary tank: 9.4 US gal usable (9.7 total).",
          "Combined: 26.3 US gal usable (28.0 total).",
        ],
      },
      {
        label: "Capacity (tanks without bladders — see SB-109A)",
        lines: [
          "Main 19.2, auxiliary 10.5, combined 29.7 US gal usable.",
          "Per R22 Service Bulletin SB-109A, fuel tanks without bladders should no longer be in service.",
        ],
      },
      {
        label: "Low fuel caution light",
        lines: [
          "Illuminates at approximately 1 US gal usable (all-aluminum tanks) or 1.5 US gal (bladder tanks).",
          "Fuel exhaustion follows in about 5 minutes at cruise power (aluminum) or about 10 minutes (bladder).",
          "Do not use the low-fuel light as a working indication of fuel quantity.",
        ],
      },
    ],
  },
  operations: {
    title: "Flight, Maneuver & Kinds-of-Operation Limits",
    items: [
      {
        label: "Kinds of operation",
        lines: [
          "Approved as a normal-category rotorcraft (FAA Type Certificate H10WE — R22, R22 Alpha, R22 Beta, R22 Mariner).",
          "VFR day and night operations are approved.",
          "Night VFR only when landing, navigation, instrument and anti-collision lights are operational.",
          "IFR operation is not approved. Flight in known icing conditions is prohibited.",
        ],
      },
      {
        label: "Flight & maneuver limitations",
        lines: [
          "Aerobatic flight is prohibited; abrupt control inputs can cause catastrophic failure of a critical component.",
          "Low-G cyclic pushovers are prohibited — a near-weightless condition can cause catastrophic loss of lateral control. Recover with immediate gentle aft cyclic; reload the rotor before applying lateral cyclic to stop any roll.",
          "Flight with the governor selected off is prohibited except for an in-flight malfunction or emergency-procedures training.",
          "Maximum operating density altitude: 14,000 ft.",
        ],
      },
      {
        label: "Crew & required equipment",
        lines: [
          "Minimum crew: one pilot in the right seat; a flight instructor may act as PIC from the left seat. Solo flight from the right seat only; the left seat belt must be buckled.",
          "A functioning headset must be worn by each pilot.",
          "Alternator, RPM governor, low rotor RPM warning system and OAT gage must be operational for dispatch.",
          "Operation is approved with either or both cabin doors removed — loose items in the cabin must be properly secured.",
        ],
      },
    ],
  },
  performance: {
    title: "Performance & Hover (selected)",
    items: [
      {
        label: "Hover & controllability",
        lines: [
          "IGE hover controllability substantiated in 17 kt wind from any direction up to 9800 ft (2990 m) density altitude.",
          "Full carburetor heat reduces hover ceilings by up to 2000 ft (610 m).",
          "Refer to the hover performance charts (Section 5) for allowable gross weight.",
        ],
      },
      {
        label: "Autorotation glide",
        lines: [
          "Maximum glide distance: approximately 75 KIAS, rotor RPM approximately 90 %.",
          "Best glide ratio is about 4:1 — roughly one nautical mile per 1500 ft AGL.",
          "Increase rotor RPM to 97 % minimum when autorotating below 500 ft AGL.",
        ],
      },
      {
        label: "Temperature & data basis",
        lines: [
          "Satisfactory engine cooling demonstrated to 38 °C (100 °F) OAT at sea level, or ISA + 23 °C (41 °F) at altitude.",
          "Height-velocity diagram: avoid operation in the shaded areas.",
          "Performance data was obtained under ideal conditions; performance under other conditions may be substantially less.",
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
              {item.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function R22QuickReferencePage() {
  const [showAbbr, setShowAbbr] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar
        title="R22 Quick Reference"
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
          For training use only. This is an informal quick reference of selected R22 POH limitations, operating numbers and
          performance notes. Always use the official R22 Pilot&apos;s Operating Handbook as primary reference.
        </p>

        {showAbbr && (
          <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">Abbreviations</h2>
            <ul className="divide-y divide-slate-200 dark:divide-zinc-700 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              {R22_ABBREVIATIONS.map((row, i) => (
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

        <GroupCard title={data.airspeed.title} items={data.airspeed.items} />
        <GroupCard title={data.rotor.title} items={data.rotor.items} />
        <GroupCard title={data.engine.title} items={data.engine.items} />
        <GroupCard title={data.weight.title} items={data.weight.items} />
        <GroupCard title={data.fuel.title} items={data.fuel.items} />
        <GroupCard title={data.operations.title} items={data.operations.items} />
        <GroupCard title={data.performance.title} items={data.performance.items} />
      </main>
    </div>
  );
}
