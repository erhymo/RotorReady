"use client";

import { BackButton } from "@/app/components/BackButton";

const data = {
  airspeed: {
    title: "Airspeed Limits (selected)",
    items: [
      {
        label: "VNE power on / power off (Hp = 0)",
        lines: [
          "VNE power on: 155 kt IAS at Hp = 0.",
          "VNE power off: 125 kt IAS at Hp = 0.",
        ],
      },
      {
        label: "Cold weather corrections",
        lines: [
          "OAT < -30 °C: reduce VNE power on by 10 kt.",
          "OAT < -20 °C: reduce VNE power off by 20 kt (minimum 65 kt).",
        ],
      },
    ],
  },
  rotor: {
    title: "Rotor Speed (Nr)",
    items: [
      {
        label: "Power-off",
        lines: [
          "Minimum power-off Nr: 320 rpm.",
        ],
      },
      {
        label: "Normal operating range",
        lines: [
          "Normal Nr range (power-on): 375–405 rpm.",
        ],
      },
      {
        label: "Aural warnings",
        lines: [
          "Low Nr aural warning: ≤ 360 rpm.",
          "High Nr aural warning: ≥ 410 rpm.",
        ],
      },
    ],
  },
  torque: {
    title: "Engine Torque Limits (TQ %)",
    items: [
      {
        label: "Arriel 2B1 (AEO)",
        lines: [
          "Maximum continuous: 92.7 %.",
          "Takeoff rating: 100 %.",
          "Transient (5 s): 104 %.",
        ],
      },
    ],
  },
  t4: {
    title: "Turbine Outlet Temperature (T4 °C)",
    items: [
      {
        label: "Start",
        lines: [
          "Max continuous during start: 750 °C.",
          "Transient during start (10 s): 865 °C.",
        ],
      },
      {
        label: "Flight",
        lines: [
          "Max continuous in flight: 849 °C.",
          "Takeoff rating: 915 °C.",
        ],
      },
    ],
  },
  ground: {
    title: "Ground & Slope Limits",
    items: [
      {
        label: "Landing / rotor stop slopes",
        lines: [
          "Nose up: 10°.",
          "Nose down: 6°.",
          "Sideways: 8°.",
        ],
      },
      {
        label: "Engine start",
        lines: [
          "Prohibited if snow or ice has collected in or around the engine air intake.",
        ],
      },
    ],
  },
	  weight: {
	    title: "Weight & Loading (selected)",
	    items: [
	      {
	        label: "Internal weight limits",
	        lines: [
	          "Maximum permissible internal weight in flight: 2250 kg (4961 lb).",
	          "Maximum permissible internal weight for IGE take-off and landing: 2250 kg (4961 lb).",
	        ],
	      },
	      {
	        label: "Cargo compartments",
	        lines: [
	          "RH cargo compartment: max 100 kg.",
	          "LH cargo compartment: max 120 kg.",
	          "Rear cargo compartment: max 80 kg.",
	        ],
	      },
	      {
	        label: "Cabin floor",
	        lines: [
	          "Rear cabin floor: max 310 kg.",
	          "Forward left cabin floor: max 150 kg.",
	        ],
	      },
	    ],
	  },
  systems: {
    title: "Systems (selected limits)",
    items: [
      {
        label: "Engine oil",
        lines: ["Maximum oil pressure: 9.8 bar (142 psi)."],
      },
      {
        label: "Electrical",
        lines: [
          "Maximum voltage: 31.5 V (rated range 26–29 V).",
          "Maximum continuous current: 150 A.",
        ],
      },
      {
        label: "Fuel anti-icing",
        lines: [
          "Fuel anti-icing additive mandatory if OAT < -20 °C and the fuel does not contain a freezing inhibitor.",
        ],
      },
    ],
  },
  crew: {
    title: "Crew & Operational Use",
    items: [
      {
        label: "Approved operations",
        lines: [
          "Approved for day and night VFR.",
          "Flight in icing conditions is not permitted.",
        ],
      },
      {
        label: "Crew & occupancy",
        lines: [
          "Minimum crew: 1 pilot in the right seat.",
          "Maximum persons on board (including crew): 6.",
        ],
      },
      {
        label: "Prohibited operations (selected)",
        lines: [
          "Aerobatic manoeuvres: prohibited.",
          "Intentional engine power reduction in flight using the twist grip: prohibited (except where explicitly allowed for training/emergency procedures in the RFM).",
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

export default function H125QuickReferencePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between gap-3">
          <BackButton label="Home" to="/" />
          <h1 className="text-xs sm:text-sm font-semibold tracking-widest opacity-80 text-center">
            H125 / AS350 B3 (2B1) QUICK REFERENCE
          </h1>
          <div className="w-12 sm:w-16" />
        </div>
      </div>

      <main className="mx-auto max-w-3xl p-4 space-y-4">
        <p className="text-xs text-slate-600 dark:text-zinc-300">
          For training use only. This is an informal quick reference of selected H125 / AS350 B3 (2B1) RFM limitations and
          operating numbers. Always use the official RFM / QRH as primary reference.
        </p>

        <GroupCard title={data.airspeed.title} items={data.airspeed.items} />
        <GroupCard title={data.rotor.title} items={data.rotor.items} />
        <GroupCard title={data.torque.title} items={data.torque.items} />
        <GroupCard title={data.t4.title} items={data.t4.items} />
	        <GroupCard title={data.weight.title} items={data.weight.items} />
        <GroupCard title={data.ground.title} items={data.ground.items} />
        <GroupCard title={data.systems.title} items={data.systems.items} />
        <GroupCard title={data.crew.title} items={data.crew.items} />
      </main>
    </div>
  );
}
