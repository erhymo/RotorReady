"use client";

import { BackButton } from "@/app/components/BackButton";

const data = {
  airspeed: {
    title: "Airspeed Limits (selected)",
    items: [
      {
        label: "Basic VNE / autorotation",
        lines: [
          "Vne ≤ 2200 lb takeoff gross weight: 130 KIAS.",
          "Vne > 2200 lb takeoff gross weight: 120 KIAS.",
          "Maximum autorotation airspeed: 100 KIAS.",
        ],
      },
      {
        label: "Doors removed & indicator notes",
        lines: [
          "With any combination of cabin doors removed: maximum approved airspeed 100 KIAS.",
          "Airspeed indicator green arc: 0–110 KIAS.",
          "Yellow arc (precautionary range): 110–130 KIAS – special operating procedures apply.",
          "Earlier indicators without yellow arc require placard: \"DO NOT EXCEED 110 KIAS EXCEPT IN SMOOTH AIR\".",
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
          "Power-on rotor speed range: 101–102 % NR (404–408 RPM).",
          "Power-off rotor speed range: 90–108 % NR (360–432 RPM).",
          "Rotor tachometer green arc: 90–108 %.",
          "Rotor tachometer red lines: 90 % (lower), 108 % (upper).",
        ],
      },
      {
        label: "Engine RPM (IO-540-AE1A5)",
        lines: [
          "Maximum continuous engine speed: 102 % (2718 RPM).",
          "Engine tachometer green arc: 101–102 %.",
          "Engine tachometer red lines: 101 % (lower), 102 % (upper).",
        ],
      },
      {
        label: "Training note",
        lines: [
          "Transient rotor operation below 101 % NR is only permitted for emergency procedures training.",
        ],
      },
    ],
  },
  weight: {
    title: "Weight & Loading (selected)",
    items: [
      {
        label: "Gross weight limits",
        lines: [
          "Maximum gross weight: 2500 lb.",
          "Minimum gross weight: 1600 lb.",
        ],
      },
      {
        label: "Seats, baggage & CG",
        lines: [
          "Maximum weight per seat (including baggage compartment): 300 lb (136 kg).",
          "Maximum load in any baggage compartment: 50 lb (23 kg).",
          "Baggage compartment placard: COMPARTMENT CAPACITY 50 LB MAX; do not exceed 300 lb combined seat plus compartment.",
          "With all doors installed: solo pilot weight ≥ 150 lb (68 kg) keeps CG within limits without adding ballast.",
        ],
      },
      {
        label: "Weight & balance practice",
        lines: [
          "Helicopter must always be flown within weight and balance limits specified in Section 2.",
          "Loading outside limits can result in insufficient control travel for safe operation.",
          "CG may be adjusted by removable ballast in any under-seat baggage compartment, but weight & balance must be recalculated and compartment limits verified.",
          "Fuel burn moves CG forward; safe loading must be checked with both takeoff fuel and empty fuel.",
        ],
      },
    ],
  },
  operations: {
    title: "Flight & Operating Limits",
    items: [
      {
        label: "Kinds of operation",
        lines: [
          "Approved for day and night VFR operations.",
          "Night VFR permitted only when landing, navigation, instrument and anti-collision lights are operational.",
          "IFR operations are not approved.",
          "Flight in known icing conditions is prohibited.",
        ],
      },
      {
        label: "Flight & manoeuvre limitations",
        lines: [
          "Aerobatic flight is prohibited.",
          "Low-G cyclic pushovers are specifically prohibited due to risk of catastrophic loss of lateral control.",
          "Maximum operating density altitude: 14 000 ft.",
          "Maximum operating altitude: 9 000 ft AGL.",
        ],
      },
      {
        label: "Crew & required systems",
        lines: [
          "Minimum flight crew: 1 pilot in the right front seat (solo flight from right front seat).",
          "Required for dispatch: alternator, RPM governor, low rotor RPM warning system, OAT gage and hydraulic control system operational.",
        ],
      },
    ],
  },
  fuel: {
    title: "Fuel & Placards (bladder tanks)",
    items: [
      {
        label: "Fuel capacity & usable fuel",
        lines: [
          "Combined usable fuel with bladder tanks: 46.5 US gal (29.5 + 17.0).",
          "Combined total fuel capacity with bladder tanks: 47.7 US gal.",
        ],
      },
      {
        label: "Fuel system notes & placards",
        lines: [
          "Main tank placard (bladder): MAIN 29.5 US GAL usable.",
          "Aux tank placard (bladder): AUX 17.0 US GAL usable.",
          "Combined usable fuel without bladders: 48.9 US gal (tanks without bladders should no longer be in service per SB-78B).",
        ],
      },
    ],
  },
  engine: {
    title: "Engine, Oil & Temperatures",
    items: [
      {
        label: "Oil pressure",
        lines: [
          "Normal (green) range in flight: 55–95 psi.",
          "Lower red line: 25 psi; lower yellow arc: 25–55 psi.",
          "Upper yellow arc: 95–115 psi; upper red line (maximum): 115 psi.",
        ],
      },
      {
        label: "Oil temperature",
        lines: [
          "Normal (green) range: 75–245 °F (24–118 °C).",
          "Red line (maximum oil temperature): 245 °F (118 °C).",
        ],
      },
      {
        label: "Cylinder head temperature (CHT)",
        lines: [
          "Green arc: 200–500 °F (93–260 °C).",
          "Red line (maximum CHT): 500 °F (260 °C).",
        ],
      },
      {
        label: "Manifold pressure",
        lines: [
          "Green arc: 15.0–23.3 in. Hg.",
          "Red line (maximum MAP): 26.1 in. Hg.",
          "Yellow arc: variable manifold pressure limits – see cockpit placard for schedule.",
        ],
      },
      {
        label: "Instrument color code",
        lines: [
          "Red: operating limit – pointer should not enter red during normal operation.",
          "Green: normal operating range.",
          "Yellow: precautionary range; special operating procedures apply.",
        ],
      },
    ],
  },
  performance: {
    title: "Performance & Hover (selected)",
    items: [
      {
        label: "IGE / OGE hover assumptions",
        lines: [
          "IGE hover controllability substantiated in 17 kt wind from any direction up to 9800 ft density altitude.",
          "IGE hover ceiling charts assume 2 ft skid height, full throttle, zero wind.",
          "OGE hover ceiling chart assumes takeoff power or full throttle.",
        ],
      },
      {
        label: "Engine cooling & temperatures",
        lines: [
          "Satisfactory engine cooling demonstrated to 38 °C (100 °F) OAT at sea level.",
          "At altitude, engine cooling demonstrated to ISA + 23 °C (41 °F).",
        ],
      },
      {
        label: "Height–velocity diagram",
        lines: [
          "Height–velocity diagram is annotated: AVOID OPERATION IN SHADED AREAS.",
          "Performance charts are based on ideal conditions; actual performance under other conditions may be substantially less.",
        ],
      },
    ],
  },
} as const;

type Group = { title: string; items: { label: string; lines: string[] }[] };

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

export default function R44IIQuickReferencePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between gap-3">
          <BackButton label="Home" to="/" />
          <h1 className="text-xs sm:text-sm font-semibold tracking-widest opacity-80 text-center">R44 II QUICK REFERENCE</h1>
          <div className="w-12 sm:w-16" />
        </div>
      </div>

      <main className="mx-auto max-w-3xl p-4 space-y-4">
        <p className="text-xs text-slate-600 dark:text-zinc-300">
          For training use only. This is an informal quick reference of selected R44 II POH limitations, operating numbers and
          performance notes. Always use the official R44 II POH as primary reference.
        </p>

        <GroupCard title={data.airspeed.title} items={data.airspeed.items} />
        <GroupCard title={data.rotor.title} items={data.rotor.items} />
        <GroupCard title={data.weight.title} items={data.weight.items} />
        <GroupCard title={data.operations.title} items={data.operations.items} />
        <GroupCard title={data.fuel.title} items={data.fuel.items} />
        <GroupCard title={data.engine.title} items={data.engine.items} />
        <GroupCard title={data.performance.title} items={data.performance.items} />
      </main>
    </div>
  );
}
