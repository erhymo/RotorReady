"use client";

import { useState } from "react";
import AppTopBar from "@/components/AppTopBar";
import AW189_ABBREVIATIONS from "@/data/aw189/abbreviations";

const data = {
  weight: {
    title: "Weight, CG & Occupants",
    items: [
      {
        label: "Weight",
        lines: [
          "Max gross weight for towing: 8600 kg",
          "Max gross weight for taxiing: 8650 kg",
          "Max gross weight for CAT B take-off/landing: 8600 kg",
          "Min flight/rotor running gross weight: 5400 kg",
          "Min flight weight for Hd less than -5000 ft: 6000 kg",
        ],
      },
      {
        label: "Occupants",
        lines: [
          "Max occupants in cabin: 19",
          "Each occupant must have a seat and seat belt",
        ],
      },
      {
        label: "Minimum flight crew",
        lines: [
          "See Basic Flight Manual / applicable Supplement",
          "CAT A T/O or landing from left seat, or Offshore/Elevated Helideck ops: min 2 pilots",
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
          "Vne (power ON, OEI/power OFF): chart-limited — see Fig 1-7/1-8 envelope",
          "Max airspeed with PI (TQ) above 100%: 90 KIAS",
          "Vmini (IFR): 50 KIAS",
          "Max IFR approach airspeed: 150 KIAS",
          "Min airspeed in autorotation: 60 KIAS",
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
        label: "Degraded / other",
        lines: [
          "Max airspeed with one AP failed: 110 KIAS",
          "Max airspeed for windscreen wiper operation: 140 KIAS",
        ],
      },
      {
        label: "Cabin doors",
        lines: [
          "Max airspeed for opening/closing cabin doors: 50 KIAS",
          "Max lateral windspeed for opening/closing cabin doors: 20 kt",
          "Max wind/ground/airspeed with one or both doors locked open: 50 KIAS",
          "With Kit Stop Passenger Door fitted: max 80 KIAS opening/locked open, 60 KIAS closing",
        ],
      },
    ],
  },
  groundRotor: {
    title: "Ground Speed, Wheel Brake & Rotor Start/Stop",
    items: [
      {
        label: "Ground speed",
        lines: [
          "Max GS with PARK BRAKE ON: 5 kt (9 km/h)",
          "Paved surfaces — max taxi speed: 40 kt; max emergency landing speed: 60 kt",
          "Grass surfaces — max taxi speed: 20 kt (nose wheel locked fore/aft above 10 kt); max emergency landing speed (nose wheel locked): 20 kt",
        ],
      },
      {
        label: "Wheel brake",
        lines: [
          "Max running speed for brake application: 60 kt",
          "Parking on slopes up to 10° permitted for max 8 hours",
        ],
      },
      {
        label: "Rotor start/stop & rotor brake",
        lines: [
          "Max wind speed for rotor starting/stopping: 50 kt",
          "Max rotor speed for brake application: 40%",
          "Max pressure in BRAKE position: 62.5 BAR",
          "Min pressure for lever in BRAKE position: 40 BAR",
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
          "Min temperature for ground starting: -40 °C",
          "Max altitude at 8300 kg: 10000 ft Hp or Hd",
          "Max altitude from 8300 to 8600 kg: 6000 ft Hp or Hd",
          "Pitot heat: AUTO/ON at +4 °C OAT or less; AUTO/OFF at +5 °C OAT or more",
        ],
      },
      {
        label: "Icing",
        lines: [
          "Known icing conditions: prohibited unless an appropriate Icing Kit is installed and functioning",
          "Freezing rain and freezing fog: prohibited",
        ],
      },
      {
        label: "Manoeuvring / autorotation / slope",
        lines: [
          "Aerobatic manoeuvres: prohibited",
          "Practice autorotative landings: prohibited",
          "In autorotation, ENG MODE switch must not be retarded FLIGHT→IDLE except in emergency",
          "OEI training: selecting either ENG MODE switch to IDLE/OFF is prohibited",
          "Slope take-off/landing: limited to 10° in all directions",
          "CAT B take-off/landing with tailwind: must be avoided",
        ],
      },
    ],
  },
  catA: {
    title: "Category A Operations & Ditching",
    items: [
      {
        label: "Heliport / helideck size",
        lines: [
          "Ground/elevated heliport (T/O and landing): min 20 × 20 m or 20 m diameter",
          "Offshore/elevated helideck: min 15 × 15 m or 15 m diameter",
          "Offshore/elevated helideck, weight below 7800 kg: min 12 × 12 m or 12 m diameter",
        ],
      },
      {
        label: "Clear area runway",
        lines: [
          "Min demonstrated RTO runway length: 900 m (2950 ft)",
          "Min demonstrated landing runway length: 700 m",
        ],
      },
      {
        label: "Wind",
        lines: [
          "Max crosswind for CAT A: 20 kt (10 m/s)",
          "Max crosswind for CAT A Clear Area: 30 kt (15 m/s)",
          "Take-off with tailwind component: prohibited",
          "CAT A headwind credit: max 50% of the performance increase from actual headwind",
        ],
      },
      {
        label: "Ditching configuration (if fitted)",
        lines: [
          "Take-off after ditching: prohibited",
          "Emergency flotation system: for ditching only",
          "Flotation bags must not be inflated in flight",
        ],
      },
    ],
  },
  engineApu: {
    title: "Engine & APU Starter Duty Cycle / Training",
    items: [
      {
        label: "Engine starter duty cycle",
        lines: [
          "45 s ON, 1 min OFF — repeat twice more, then 45 s ON, 30 min OFF",
        ],
      },
      {
        label: "APU starter duty cycle",
        lines: [
          "20 s delay between each attempted start",
          "20 min delay after 3 aborted starts",
          "If repeated twice: 40 min cooldown required, plus APU troubleshooting",
        ],
      },
      {
        label: "Engine training mode",
        lines: [
          "OEI TNG selection permitted only with Avionics Software Phase 3.0 or later (Supplement 33)",
        ],
      },
      {
        label: "APU heater / air conditioning",
        lines: [
          "HEATER may only be selected to APU when OAT is at or below 20 °C",
          "Whenever APU is running, selecting both AIR COND systems (if fitted) is prohibited",
        ],
      },
    ],
  },
  fuel: {
    title: "Fuel System",
    items: [
      {
        label: "Capacity",
        lines: [
          "Total usable: 1320 litres (2569 litres in Extended Range Configuration)",
          "Unusable: 24 litres (9 litres in Extended Range Configuration)",
          "Max cross-feed (tank with pump off): 283 kg / 625 lb",
        ],
      },
      {
        label: "Authorized fuels",
        lines: [
          "JET A, JET A-1, AVTUR/JP8, JP5/AVCAT, No. 3 Jet Fuel (not with T1502/T1602 additives)",
          "Icing inhibitor mandatory below -15 °C",
          "JP5 (F44) prohibited below -30 °C OAT",
        ],
      },
    ],
  },
  lubeHydraulic: {
    title: "Lubricants & Hydraulics",
    items: [
      {
        label: "Engine oil",
        lines: [
          "Type I: D50TF1 (GE Spec) / MIL-PRF-7808",
          "Type II: D50TF1 (GE Spec) / MIL-PRF-23699 — preferred -20 °C to ISA+40 °C",
          "Min oil temp for starting: Type II -30 °C, Type I -40 °C",
        ],
      },
      {
        label: "Transmission oil",
        lines: ["DOD-L-85734 (e.g. ATO555)"],
      },
      {
        label: "Hydraulic fluid",
        lines: [
          "MIL-PRF-83282 (e.g. Aeroshell Fluid 31)",
          "Alternative MIL-PRF-5606 (e.g. Aeroshell Fluid 41) for enhanced low-temp performance below -20 °C",
          "Mixing hydraulic fluid of different specification/brand: prohibited",
          "Electrical hydraulic pump: ground operation only",
        ],
      },
    ],
  },
  electrical: {
    title: "Electrical System",
    items: [
      {
        label: "AC generator load (%)",
        lines: [
          "Engine: normal 0–100, cautionary 101–150, max cautionary 150",
          "APU: normal 0–100, cautionary 101–155, max cautionary 155",
        ],
      },
      {
        label: "TRU load (%)",
        lines: [
          "Engine: normal 0–100, cautionary 101–150, max cautionary 150",
          "APU: normal 0–100, cautionary 101–155, max cautionary 155",
        ],
      },
      {
        label: "Battery / bus",
        lines: [
          "Battery discharge: -200 to 0 A, battery charge: 0–200 A",
          "Emergency bus voltage: normal 22–30 V, min normal 22 V, max normal 30 V",
        ],
      },
    ],
  },
  avionics: {
    title: "AFCS / Avionics / ILS / FMS",
    items: [
      {
        label: "AFCS",
        lines: [
          "Intentional P/R–C/Y PTR de-clutching in flight: prohibited",
          "AFCS upper modes must be disengaged after one AP has failed, except during approach",
          "VNAV AFCS mode is inoperative on the AFCS Control Panel",
        ],
      },
      {
        label: "ILS / VOR",
        lines: [
          "Certified for CAT I ILS approaches up to 4° glideslope",
          "Max airspeed for glideslope up to 4°: 150 KIAS",
          "Max airspeed at DA(H): 130 KIAS",
          "Coupled VOR approach/nav: max airspeed for glideslope up to 4°: 150 KIAS",
        ],
      },
      {
        label: "RNP APCH with LPV/LP minima",
        lines: [
          "Max glide path angle: 9°",
          "Min DH: 200 ft",
          "Min APP mode engagement airspeed: 50 KIAS",
          "Max ROD approaching MAP: 1000 fpm",
          "Max airspeed at DA(H): 130 KIAS",
        ],
      },
      {
        label: "FMS",
        lines: [
          "Verify NAV DB currency and coherence with the procedure to be flown",
          "Max ROD during coupled approaches: 1000 fpm",
          "ADF: do not select landing/external flood lights ON when using ADF (indication unreliable)",
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
          "Headset/Helmet: must match aircraft electrical characteristics, authorized by manufacturer",
        ],
      },
      {
        label: "Baggage compartment",
        lines: [
          "Max load: 300 kg (660 lb); max unit load 550 kg/m² (110 lb/sq.ft); max height 600 mm (2 ft)",
          "With Kit Vertical Cargo Net fitted: max load 360 kg (793 lb), max height 700 mm (2 ft 3 in)",
          "All cargo must be secured with the approved restraint net",
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

export default function AW189QuickReferencePage() {
  const [showAbbr, setShowAbbr] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar
        title="AW189 Quick Reference"
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
          For training use only. This is an informal quick reference of selected AW189 QRH/RFM limitations. Always use
          the official RFM as primary reference.
        </p>

        {showAbbr && (
          <section className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">Abbreviations</h2>
            <ul className="divide-y divide-slate-200 dark:divide-zinc-700 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
              {AW189_ABBREVIATIONS.map((row, i) => (
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
        <GroupCard title={data.groundRotor.title} items={data.groundRotor.items} />
        <GroupCard title={data.altitude.title} items={data.altitude.items} />
        <GroupCard title={data.catA.title} items={data.catA.items} />
        <GroupCard title={data.engineApu.title} items={data.engineApu.items} />
        <GroupCard title={data.fuel.title} items={data.fuel.items} />
        <GroupCard title={data.lubeHydraulic.title} items={data.lubeHydraulic.items} />
        <GroupCard title={data.electrical.title} items={data.electrical.items} />
        <GroupCard title={data.avionics.title} items={data.avionics.items} />
        <GroupCard title={data.misc.title} items={data.misc.items} />
      </main>
    </div>
  );
}
