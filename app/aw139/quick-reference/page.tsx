"use client";

import { useState } from "react";
import AppTopBar from "@/components/AppTopBar";
import AW139_ABBREVIATIONS from "@/data/aw139/abbreviations";

const data = {
  weight: {
    title: "Weight, CG & Occupants",
    items: [
      {
        label: "Weight",
        lines: [
          "Max gross weight for towing/taxi: 6450 kg",
          "Max gross weight for CAT B take-off/landing: 6400 kg",
          "Min flight/rotor running gross weight: 4400 kg",
        ],
      },
      {
        label: "Occupants",
        lines: [
          "Low density configuration: 14 max (incl. crew)",
          "High density configuration: 17 max (incl. crew)",
          "Minimum of 3 seats, in at least one row, must be installed",
        ],
      },
      {
        label: "Minimum flight crew",
        lines: [
          "VFR Day: 1 pilot (not from left seat alone)",
          "VFR Night / IFR Day/Night: 2 pilots",
        ],
      },
    ],
  },
  airspeed: {
    title: "Airspeed Limitations",
    items: [
      {
        label: "General",
        lines: [
          "Vne (power ON, low altitude/OAT): up to 170 KIAS — chart-limited, decreases with altitude/OAT (Fig 1-5)",
          "Vmini (IFR): 50 KIAS",
          "Max IFR approach airspeed: 150 KIAS",
          "Max airspeed with Take-Off Power: 90 KIAS",
          "Max airspeed with NR at 102%: 90 KIAS",
          "Min airspeed in autorotation: 40 KIAS",
        ],
      },
      {
        label: "Landing gear",
        lines: [
          "Max landing gear operating airspeed (Vlo): 150 KIAS or Vne if less",
          "Max landing gear extended airspeed (Vle): 150 KIAS or Vne if less",
        ],
      },
      {
        label: "Degraded configurations",
        lines: [
          "One AP failed — max climb airspeed: 100 KIAS",
          "One AP failed — max rate of climb: 1000 fpm",
          "One AP failed — max airspeed: Vne − 27 KIAS",
        ],
      },
      {
        label: "Doors / wipers",
        lines: [
          "Max airspeed, right cabin door locked open: 100 KIAS",
          "Max airspeed, left or both cabin doors locked open: 80 KIAS",
          "Max airspeed for opening/closing cabin doors: 80 KIAS",
          "Max airspeed for windscreen wiper operation: 140 KIAS",
        ],
      },
    ],
  },
  groundWind: {
    title: "Ground Speed & Wind Limitations",
    items: [
      {
        label: "Paved surfaces",
        lines: [
          "Max taxi speed: 40 kt (74 km/hr) — nose wheel locked fore/aft above 20 kt",
          "Max emergency landing speed (nose wheel locked): 60 kt (110 km/hr)",
          "Max towing speed: 37 km/hr (23 mph)",
        ],
      },
      {
        label: "Grass surfaces",
        lines: [
          "Max taxi speed: 20 kt (37 km/hr) — nose wheel locked fore/aft above 10 kt",
          "Max emergency landing speed (nose wheel locked): 40 kt (74 km/hr)",
        ],
      },
      {
        label: "Rotor start/stop",
        lines: [
          "Max wind speed: 60 kt (30 m/s)",
          "Above 30 kt crosswind: up to 50 mm (2 in) lateral cyclic into wind may be used",
          "Above 33 kt: windspeed must be logged in the aircraft log book",
        ],
      },
    ],
  },
  altitude: {
    title: "Altitude, OAT, Icing & Manoeuvring",
    items: [
      {
        label: "Altitude / OAT",
        lines: [
          "Max/min operating altitude, max take-off/landing altitude, max/min OAT: see Fig 1-6 envelope chart",
          "Min temperature for ground starting: -40 °C",
        ],
      },
      {
        label: "Icing",
        lines: [
          "Flight into known icing conditions: prohibited (base config)",
          "Flight into freezing rain: prohibited",
        ],
      },
      {
        label: "Manoeuvring / autorotation / slope",
        lines: [
          "Aerobatic manoeuvres: prohibited",
          "Practice autorotative landings: prohibited",
          "In autorotation, ENG MODE switch must not be retarded FLIGHT→IDLE except in emergency",
          "Slope limits (take-off/landing): 5° nose up, 5° nose down, 5° left wing low, 5° right wing low",
        ],
      },
    ],
  },
  powerPlant: {
    title: "Power Plant — PT6C-67C (PI% / Ng% / Nf% / ITT)",
    items: [
      {
        label: "Power Index (PI %) — AEO",
        lines: [
          "Max continuous: 100",
          "Take-off (5 min) range: 101–110",
          "Max take-off: 110",
          "Transient (5 s): 121",
        ],
      },
      {
        label: "Power Index (PI %) — OEI",
        lines: [
          "Max continuous: 140",
          "2.5 min range: 141–160",
          "Max 2.5 min: 160",
          "Transient (5 s): 176",
        ],
      },
      {
        label: "Gas Generator Speed (Ng %) — AEO",
        lines: [
          "Min ground idle: 55.0",
          "Max continuous: 100.0",
          "Take-off (5 min) range: 100.1–102.4",
          "Transient (5 s): 107.0",
        ],
      },
      {
        label: "Power Turbine Speed (Nf %) — AEO",
        lines: [
          "Min continuous: 98, max continuous: 101",
          "Cautionary range: 101–103",
          "Max transient (10 s): 106",
        ],
      },
      {
        label: "ITT (°C / %) — AEO",
        lines: [
          "Max continuous: 735 / 100",
          "Take-off range: 736–775 / 100.1–105.4",
          "Transient (5 s): 847 / 115.2",
          "Starting max unlimited: 869 / 118.2, transient (2 s): 1000 / 136.0",
        ],
      },
      {
        label: "Engine oil temperature (°C)",
        lines: [
          "Min for starting: -40",
          "Normal range: 10–140, max normal: 140",
          "Transient (1 min): 150",
        ],
      },
      {
        label: "Engine oil pressure (BAR)",
        lines: [
          "Min ground idle (<1 min): 4.2",
          "Normal range: 6.3–8.9",
          "Max for engine start (5 min): 15.2",
        ],
      },
      {
        label: "Starter duty cycle",
        lines: [
          "45 s ON, 1 min OFF — 45 s ON, 1 min OFF — 45 s ON, 30 min OFF",
        ],
      },
    ],
  },
  transmission: {
    title: "Transmission Limits (Torque / Oil Temp / Oil Pressure)",
    items: [
      {
        label: "Torque (TQ %)",
        lines: [
          "AEO max continuous: 100, take-off (5 min) 101–110, transient (5 s) 121",
          "OEI max continuous: 140, 2.5 min 141–160, transient (5 s) 176",
        ],
      },
      {
        label: "Gearbox oil temperature (°C) — MGB / IGB / TGB",
        lines: [
          "Min for starting: -40",
          "Normal range: 1–110, max normal: 110",
        ],
      },
      {
        label: "MGB oil pressure (BAR)",
        lines: [
          "Min idle: 2.3",
          "Normal range: 3.1–6.0, max normal: 6.0",
        ],
      },
    ],
  },
  rotorSpeed: {
    title: "Rotor Speed Limits (NR %)",
    items: [
      {
        label: "Power ON — AEO",
        lines: [
          "Min continuous: 98, max continuous: 101",
          "Cautionary range: 101–103",
          "Max transient (10 s): 106",
        ],
      },
      {
        label: "Power ON — OEI",
        lines: [
          "Min transient: 85, min cautionary: 90",
          "Cautionary (OEI landing only): 90–97",
          "Min continuous: 98, max continuous: 101, cautionary range: 101–103",
          "Max transient (10 s): 106",
        ],
      },
      {
        label: "Power OFF (autorotation)",
        lines: [
          "Min transient: 90, min continuous: 95",
          "Continuous operation: 95–110, max continuous: 110",
          "Max transient: 116",
        ],
      },
    ],
  },
  fuel: {
    title: "Fuel System",
    items: [
      {
        label: "Fuel pressure (BAR)",
        lines: [
          "Cautionary range: 0.0–0.5",
          "Normal range: 0.6–2.1, max: 2.1",
        ],
      },
      {
        label: "Capacity",
        lines: [
          "Total usable: 1588 litres",
          "Unusable: 20 litres (indicated 0 kg in coordinated flight)",
          "Max cross-feed (tank with pump off): 228 kg",
        ],
      },
      {
        label: "Authorized fuels",
        lines: [
          "JET A, JET A-1, JP5, JP8, JP8+100, GOST 10227 RT/TS-1, No. 3 Jet Fuel (not with T1502/T1602 additives)",
          "Any mixture of authorized fuels may be used",
        ],
      },
    ],
  },
  hydraulicsElectrical: {
    title: "Hydraulics, Wheel Brake, Pitot & Electrical",
    items: [
      {
        label: "Hydraulic fluid temperature (°C)",
        lines: [
          "Min for starting: -40",
          "Normal operating range: -20 to 119",
          "Max cautionary: 134",
        ],
      },
      {
        label: "Hydraulic fluid pressure (BAR)",
        lines: [
          "Normal operation range: 180–225",
          "Max cautionary: 250",
        ],
      },
      {
        label: "Wheel brake / pitot",
        lines: [
          "Max running speed for brake application: 40 kt (74 km/hr)",
          "Parking on slopes up to 10° permitted max 1 hour",
          "Pitot heat ON at +4 °C OAT or less; OFF at +10 °C OAT or more",
        ],
      },
      {
        label: "Electrical",
        lines: [
          "DC generator normal load: 0–100%, cautionary (start only) 101–155%, max 155% (≤45 s)",
          "Battery discharge: -200 to 0 A, battery charge: 0–200 A",
          "Main/essential bus voltage: 22–29 V normal",
        ],
      },
    ],
  },
  avionics: {
    title: "AFCS / Avionics / FMS",
    items: [
      {
        label: "AFCS",
        lines: [
          "Min AFCS configuration for IFR flight: 2 AP in ATT mode",
          "Intentional ATT mode de-selection during IFR flight: prohibited",
        ],
      },
      {
        label: "ILS",
        lines: [
          "Certified for CAT 1 ILS approaches up to 7.5° glideslope",
          "Max airspeed for glideslope up to 4°: 150 KIAS",
          "Max airspeed for glideslope 4–7.5° (steep approach): 120 KIAS",
        ],
      },
      {
        label: "FMS",
        lines: [
          "Verify NAV DB currency and coherence with the procedure to be flown",
          "Without SBAS GPS/coverage: check predictive RAIM (P-RAIM) on destination waypoint",
          "LDA, SDF and MLS approaches: not authorized",
        ],
      },
    ],
  },
  misc: {
    title: "Miscellaneous & Baggage Compartment",
    items: [
      {
        label: "Miscellaneous",
        lines: [
          "Polarized sunglasses: not permitted",
          "Ventilation: operate cockpit fans or open window at MPOG/HIGE/HOGE or below 25 kt (46 km/hr)",
          "Torque limiter set: max AEO TQ available 114%/114%",
        ],
      },
      {
        label: "Baggage compartment",
        lines: [
          "Max load: 200 kg (440 lb)",
          "Max unit load: 300 kg/m² (61 lb/sq.ft)",
          "Max load height: 600 mm (2 ft)",
          "All cargo must be secured with restraint net or other approved means",
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

export default function AW139QuickReferencePage() {
  const [showAbbr, setShowAbbr] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar
        title="AW139 Quick Reference"
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
          For training use only. This is an informal quick reference of selected AW139 RFM limitations. Always use the
          official RFM as primary reference.
        </p>

        {showAbbr && (
          <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">Abbreviations</h2>
            <ul className="divide-y divide-slate-200 dark:divide-zinc-700 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              {AW139_ABBREVIATIONS.map((row, i) => (
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

        <GroupCard title={data.weight.title} items={data.weight.items} />
        <GroupCard title={data.airspeed.title} items={data.airspeed.items} />
        <GroupCard title={data.groundWind.title} items={data.groundWind.items} />
        <GroupCard title={data.altitude.title} items={data.altitude.items} />
        <GroupCard title={data.powerPlant.title} items={data.powerPlant.items} />
        <GroupCard title={data.transmission.title} items={data.transmission.items} />
        <GroupCard title={data.rotorSpeed.title} items={data.rotorSpeed.items} />
        <GroupCard title={data.fuel.title} items={data.fuel.items} />
        <GroupCard title={data.hydraulicsElectrical.title} items={data.hydraulicsElectrical.items} />
        <GroupCard title={data.avionics.title} items={data.avionics.items} />
        <GroupCard title={data.misc.title} items={data.misc.items} />
      </main>
    </div>
  );
}
