"use client";

import { BackButton } from "@/app/components/BackButton";

const data = {
  torque: {
    title: "Transmission Torque (TQ %)",
    items: [
      {
        label: "AEO ≤ 90 KIAS",
        lines: [
          "Max continuous: 100%",
          "30 min: 101–111%",
          "Max 30 min: 111%",
          "Transient 10 s: 125%",
        ],
        ref: "RFM Sec 1 – TORQUE (TQ %) AEO ≤ 90 KIAS",
      },
      {
        label: "AEO > 90 KIAS",
        lines: [
          "Max continuous: 100%",
          "Transient 10 s: 125%",
        ],
        ref: "RFM Sec 1 – TORQUE (TQ %) AEO > 90 KIAS",
      },
      {
        label: "OEI",
        lines: [
          "Max continuous: 140%",
          "2.5 min: 141–174%",
          "Max 2.5 min: 174%",
          "Transient 10 s: 192%",
        ],
        ref: "RFM Sec 1 – TORQUE (TQ %) OEI",
      },
    ],
  },
  ng: {
    title: "Gas Generator Speed (NG %)",
    items: [
      {
        label: "AEO",
        lines: [
          "Max continuous: 96.5%",
          "30 min: 96.6–98.2%",
          "Max 30 min: 98.2%",
          "Transient 20 s: 98.9%",
        ],
        ref: "RFM Sec 1 – GAS GENERATOR SPEED (NG %) AEO",
      },
      {
        label: "OEI",
        lines: [
          "Max continuous: 98.9%",
          "2.5 min: 99–100.7%",
          "Max 2.5 min: 100.7%",
          "Transient 5 s: 101.2%",
        ],
        ref: "RFM Sec 1 – GAS GENERATOR SPEED (NG %) OEI",
      },
    ],
  },
  nr: {
    title: "Rotor Speed (NR %)",
    items: [
      {
        label: "AEO power-on",
        lines: [
          "Variable governing with PLUS-mode (see Fig. 1‑10)",
          "Transient min: 90%",
          "Transient max: 107%",
        ],
        ref: "RFM Sec 1 – ROTOR SPEED LIMITATIONS AEO POWER‑ON",
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
        ref: "RFM Sec 1 – ROTOR SPEED LIMITATIONS OEI POWER‑ON",
      },
      {
        label: "Power-off",
        lines: [
          "Transient min: 85%",
          "Min continuous: 90%",
        ],
        ref: "RFM Sec 1 – ROTOR SPEED LIMITATIONS POWER‑OFF",
      },
    ],
  },
  airspeed: {
    title: "Airspeed Limits (selected)",
    items: [
      {
        label: "General",
        lines: [
          "Max airspeed AEO with TQ > 100%: 90 KIAS",
          "IFR Vmini: 50 KIAS",
          "Max IFR approach: 130 KIAS ≤ 5000 ft, then −2 kt / 1000 ft",
          "Max with one AP failed: 120 KIAS",
          "Max wipers: 140 KIAS",
          "Min autorotation: 50 KIAS",
        ],
        ref: "RFM Sec 1 – AIRSPEED LIMITATIONS",
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
        ref: "RFM Sec 1 – ITT (1st engine start)",
      },
      {
        label: "AEO",
        lines: [
          "Max continuous: 868 °C (100%)",
          "30 min: 869–930 °C (100.1–107.1%)",
          "Max 30 min: 930 °C (107.1%)",
          "Transient 20 s: 941 °C (108.4%)",
        ],
        ref: "RFM Sec 1 – ITT AEO",
      },
      {
        label: "OEI",
        lines: [
          "Max continuous: 941 °C (108.4%)",
          "2.5 min: 942–1020 °C (108.5–117.5%)",
          "Max 2.5 min: 1020 °C (117.5%)",
        ],
        ref: "RFM Sec 1 – ITT OEI",
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
        ref: "RFM Sec 1 – WEIGHT AND CG LIMITATIONS",
      },
      {
        label: "Increased gross weight (Supplement 30)",
        lines: [
          "Max gross weight for towing / taxi: 4850 kg",
          "Max gross weight for take-off / landing: 4800 kg",
        ],
        ref: "RFM Supp 30 – WEIGHT AND CG LIMITATIONS (4800 kg)",
      },
    ],
  },
};

function GroupCard({ title, items }: { title: string; items: { label: string; lines: string[]; ref: string }[] }) {
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
            <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{item.ref}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AW169QuickReferencePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between gap-3">
          <BackButton label="Home" to="/" />
          <h1 className="text-sm font-semibold tracking-widest opacity-80">AW169 QUICK REFERENCE</h1>
          <div className="w-[64px]" aria-hidden />
        </div>
      </div>

      <main className="mx-auto max-w-3xl p-4 space-y-4">
        <p className="text-xs text-slate-600 dark:text-zinc-300">
          For training use only. This is an informal quick reference of selected AW169 RFM limitations. Always use the
          official RFM / QRH as primary reference.
        </p>

        <GroupCard title={data.torque.title} items={data.torque.items} />
        <GroupCard title={data.ng.title} items={data.ng.items} />
        <GroupCard title={data.nr.title} items={data.nr.items} />
        <GroupCard title={data.airspeed.title} items={data.airspeed.items} />
        <GroupCard title={data.itt.title} items={data.itt.items} />
        <GroupCard title={data.weight.title} items={data.weight.items} />
      </main>
    </div>
  );
}

