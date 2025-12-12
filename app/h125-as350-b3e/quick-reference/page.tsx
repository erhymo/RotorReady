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
  envelope: {
    title: "Flight Envelope (selected)",
    items: [
      {
        label: "Altitude limits",
        lines: [
          "Maximum operating altitude in flight (post MOD 07-3368): Hp = 20 000 ft.",
          "Maximum operating altitude with takeoff power: 16 000 ft.",
          "Maximum operating altitude in autorotation: 20 000 ft.",
        ],
      },
      {
        label: "Temperature limits",
        lines: [
          "General flight envelope temperature: -40 °C to ISA+35 °C, limited to +50 °C.",
          "Engine start without preheating allowed down to -25 °C ambient.",
          "Maximum ambient temperature for ground operation: +50 °C.",
        ],
      },
    ],
  },
  rotor: {
    title: "Rotor Speed (Nr)",
    items: [
      {
        label: "Power-on (continuous / transient)",
        lines: [
          "Normal Nr range (power-on): 375–394 rpm.",
          "Maximum transient Nr (power-on): 410 rpm.",
        ],
      },
      {
        label: "Power-off (autorotation)",
        lines: [
          "Power-off Nr range: 320–430 rpm.",
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
  engine: {
    title: "Engine Speeds (Ng / Nf)",
    items: [
      {
        label: "Ng (gas generator)",
        lines: [
          "Continuous operating range: 60–99 %.",
          "Maximum transient (10 s): 101 %.",
        ],
      },
      {
        label: "Nf (power turbine)",
        lines: [
          "Continuous operating range: 335–410 rpm.",
          "Maximum transient: 420 rpm.",
        ],
      },
    ],
  },
  t4: {
    title: "Turbine Outlet Temperature (T4 °C)",
    items: [
      {
        label: "Flight limits",
        lines: [
          "Max continuous in flight: 867 °C.",
          "Takeoff limit (5 min): 897 °C.",
        ],
      },
      {
        label: "Transient / start limits",
        lines: [
          "Maximum transient (10 s): 915 °C.",
          "Maximum during start (10 s): 950 °C.",
        ],
      },
      {
        label: "Takeoff power usage (general)",
        lines: [
          "Takeoff power may be used up to IAS 40 kt.",
          "If N1 and/or T4 is in the takeoff power range, limit use to 5 min (pre MOD 07-4309) or 30 min (post MOD 07-4309).",
          "If only torque is in the takeoff power range, there is no time limit; heating/demisting is permitted up to max takeoff power.",
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
          "Maximum internal weight for flight, takeoff and landing: 2250 kg (4961 lb).",
          "Minimum internal weight for flight and landing: 1310 kg (2888 lb).",
        ],
      },
      {
        label: "Increased internal gross weight (if SUP.28 installed)",
        lines: [
          "With high landing gear and dual hydraulics (SUP.28): max internal weight in flight: 2370 kg (5225 lb).",
          "Max internal weight for IGE takeoff and landing (SUP.28): 2370 kg (5225 lb).",
        ],
      },
      {
        label: "Baggage compartments",
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
  ground: {
    title: "Ground & Slope Limits",
    items: [
      {
        label: "Landing / rotor stop slopes",
        lines: [
          "Maximum slope for landing / rotor stopping: nose up 12°, nose down 6°, sideways 8°.",
        ],
      },
      {
        label: "Running landings & maneuvering",
        lines: [
          "Excluding emergencies and failures, maximum IAS for running landings: 40 kt (74 km/h).",
          "Continuous operation in servo-transparency (significant load feedback in controls) is prohibited.",
        ],
      },
    ],
  },
  systems: {
    title: "Systems (selected limits)",
    items: [
      {
        label: "Fuel & oil",
        lines: [
          "Approved turbine fuels: Jet A, Jet A-1, Jet B.",
          "Normal engine oil temperature range: 0–105 °C (max 105 °C).",
          "Minimum oil pressure at Ng < 70 %: 0.5 bar.",
        ],
      },
      {
        label: "Electrical",
        lines: [
          "Minimum battery voltage for engine start: 22 V.",
          "Maximum generator load in flight: 100 A.",
          "Maximum generator load on ground: 115 A.",
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
          "Additional equipment may be required by operational regulations.",
        ],
      },
      {
        label: "Crew & occupancy",
        lines: [
          "Minimum flight crew: 1 pilot in the right seat.",
          "Maximum number of occupants (including crew): 6.",
        ],
      },
      {
        label: "Prohibited operations (selected)",
        lines: [
          "Aerobatic manoeuvres.",
          "Engine starting when snow or ice accumulations are in or around the engine air intake.",
          "Flight in falling snow without optional sand filter installed.",
          "Flight in freezing rain or icing conditions.",
          "In-flight engine power reduction using the twist grip control (except where explicitly allowed for training / emergency procedures in the RFM).",
          "Intentional complete VEMD cut-off in flight (lane 1 + 2).",
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

export default function H125B3EQuickReferencePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between gap-3">
          <BackButton label="Home" to="/" />
          <h1 className="text-xs sm:text-sm font-semibold tracking-widest opacity-80 text-center">
            H125 / AS350 B3e QUICK REFERENCE
          </h1>
          <div className="w-12 sm:w-16" />
        </div>
      </div>

      <main className="mx-auto max-w-3xl p-4 space-y-4">
        <p className="text-xs text-slate-600 dark:text-zinc-300">
          For training use only. This is an informal quick reference of selected H125 / AS350 B3e RFM limitations and
          operating numbers. Always use the official RFM / QRH as primary reference.
        </p>

        <GroupCard title={data.airspeed.title} items={data.airspeed.items} />
        <GroupCard title={data.envelope.title} items={data.envelope.items} />
        <GroupCard title={data.rotor.title} items={data.rotor.items} />
        <GroupCard title={data.engine.title} items={data.engine.items} />
        <GroupCard title={data.t4.title} items={data.t4.items} />
        <GroupCard title={data.weight.title} items={data.weight.items} />
        <GroupCard title={data.ground.title} items={data.ground.items} />
        <GroupCard title={data.systems.title} items={data.systems.items} />
        <GroupCard title={data.crew.title} items={data.crew.items} />
      </main>
    </div>
  );
}
