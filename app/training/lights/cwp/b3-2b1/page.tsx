"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useActiveModelVariant } from "@/lib/models/hooks";

const VARIANT_ID = "H125_AS350_B3_2B1" as const;

type Severity = "warning" | "caution";

type Slot = {
  label?: string;
  id?: string; // maps to LightItem.id on /training/lights page
  severity?: Severity;
  empty?: boolean; // render as off/blank
};

const GRID: Slot[][] = [
  // Row 1 (left -> right)
  [
    { label: "FUEL", id: "fuel", severity: "caution" },
    { empty: true }, // AP FAIL - removed
    { label: "GENE", id: "gene", severity: "caution" },
    { label: "PITOT", id: "pitot", severity: "caution" },
    { label: "MGB\nTEMP", id: "mgb-temp", severity: "caution" },
    { label: "ENG\nCHIP", id: "eng-chip", severity: "caution" },
    { label: "ENG\nP", id: "eng-oil-pressure", severity: "warning" },
    { label: "ENG\nFIRE", id: "eng-fire", severity: "warning" }
  ],
  // Row 2
  [
    { label: "FUEL\nP", id: "fuel-p", severity: "caution" },
    { empty: true }, // TRIM FAIL - removed
    { label: "BATT", severity: "caution" }, // shown but no procedure mapping (yet)
    { label: "HORN", id: "horn", severity: "caution" },
    { label: "DOOR", id: "door", severity: "caution" },
    { label: "MGB\nCHIP", id: "mgb-chip", severity: "caution" },
    { label: "MGB\nP", id: "mgb-pressure", severity: "warning" },
    { label: "BATT\nTEMP", id: "batt-temp", severity: "warning" }
  ],
  // Row 3
  [
    { label: "FUEL\nFILT", id: "fuel-filt", severity: "caution" },
    { empty: true }, // GYRO FAIL - removed
    { empty: true }, // MASTER CAUT position left blank for now
    { label: "TWT.\nGRIP", id: "twt-grip", severity: "caution" }, // yellow per request
    { label: "GOV", id: "gov-caution", severity: "caution" },
    { label: "TGB\nCHIP", id: "tgb-chip", severity: "caution" },
    { label: "GOV", id: "gov-failure", severity: "warning" },
    { label: "HYDR", id: "hydr-failure", severity: "warning" }
  ]
];

export default function Page() {
  const router = useRouter();
  const { variant: activeVariant, setActiveVariant } = useActiveModelVariant();

  // Ensure the active variant is B3 2B1 when landing directly on this page
  useEffect(() => {
    if (activeVariant.id !== VARIANT_ID) {
      try { setActiveVariant(VARIANT_ID); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVariant.id]);

  function handleLampClick(id?: string) {
    if (!id) return; // not mapped
    try {
      sessionStorage.setItem(
        "lights:resume",
        JSON.stringify({ variantId: VARIANT_ID, lightId: id, memoryOnly: false, deck: [id], idx: 0, lastSeverity: undefined })
      );
    } catch {}
    router.push(`/training/lights?resume=1&v=${encodeURIComponent(VARIANT_ID)}&light=${encodeURIComponent(id)}&mem=0&cwp=1`);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <main className="mx-auto max-w-5xl p-4 sm:p-6 space-y-4 sm:space-y-6">

        <section className="p-0 border-0 bg-transparent shadow-none rounded-none sm:p-6 sm:border sm:bg-white sm:shadow-sm sm:rounded-xl sm:overflow-hidden dark:sm:bg-zinc-900 dark:sm:border-zinc-700">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4 px-4 pt-4 sm:px-0 sm:pt-0">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-700" aria-hidden />
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-zinc-100">CWP-trainer · AS350 B3 2B1</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm underline text-blue-600 dark:text-blue-400">Home</Link>
              <Link href="/training/lights" className="text-sm underline text-blue-600 dark:text-blue-400">Back to Lights trainer</Link>
            </div>
          </div>

          {/* Panel container: responsive, fills most of screen incl. landscape */}
          <div className="-mx-4 sm:mx-0" style={{ maxHeight: "calc(100dvh - 160px)" }}>
            <div
              className="rounded-2xl shadow-inner ring-1 ring-white/10 p-3 sm:p-4 w-[100vw] sm:w-full"
              style={{
                background: "linear-gradient(180deg,#121216 0%,#1b1b21 100%)",
                aspectRatio: "1200 / 420",
              }}
            >
              <div className="grid grid-cols-8 grid-rows-3 gap-2 sm:gap-3 h-full">
                {GRID.map((row, r) =>
                  row.map((slot, c) => {
                    const key = `${r}-${c}`;
                    const clickable = !!slot.id;
                    const clsBase =
                      "relative select-none rounded-md sm:rounded-lg flex items-center justify-center text-center font-extrabold tracking-wide antialiased";
                    const clsOff = "bg-black/80 ring-1 ring-white/10 text-transparent"; // empty slot
                    const clsAmber =
                      "bg-black text-amber-500 dark:text-amber-200 ring-1 ring-white/10";
                    const clsRed = "bg-black text-red-600 dark:text-red-200 ring-1 ring-white/10";
                    const clsGlow =
                      slot.severity === "warning"
                        ? "[text-shadow:0_0_12px_rgba(255,85,85,0.6)]"
                        : slot.severity === "caution"
                        ? "[text-shadow:0_0_10px_rgba(251,191,36,0.5)]"
                        : "";

                    const classes = [
                      clsBase,
                      slot.empty ? clsOff : slot.severity === "warning" ? clsRed : clsAmber,
                      clickable ? "cursor-pointer hover:opacity-95 active:opacity-90" : "opacity-90 cursor-default",
                      clsGlow,
                    ].join(" ");

                    return (
                      <div
                        key={key}
                        className={classes}
                        onClick={() => handleLampClick(slot.id)}
                        role={clickable ? "button" : undefined}
                        aria-label={slot.label || "off"}
                      >
                        {/* Allow two-line labels (e.g. MGB P) */}
                        {slot.label && (
                          <span className="px-1 leading-tight whitespace-pre text-[12px] sm:text-sm md:text-base">
                            {slot.label}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

