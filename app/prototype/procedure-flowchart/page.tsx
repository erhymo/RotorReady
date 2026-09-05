"use client";

import AppTopBar from "@/components/AppTopBar";

function Arrow() {
  return (
    <div className="flex justify-center py-1">
      <div className="h-6 w-px bg-slate-300 dark:bg-zinc-600" />
    </div>
  );
}

function StepBox({
  n,
  children,
  tone = "neutral",
}: {
  n?: number;
  children: React.ReactNode;
  tone?: "neutral" | "action";
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
        tone === "action"
          ? "border-blue-300 bg-blue-50 text-blue-950 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-100"
          : "border-slate-200 bg-white text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      }`}
    >
      {n !== undefined && (
        <span className="mt-0.5 inline-grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {n}
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}

function CautionBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
      ⚠ {children}
    </div>
  );
}

function OutcomeBox({ tone, children }: { tone: "ok" | "urgent"; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-xl border-2 px-4 py-3 text-center text-sm font-bold ${
        tone === "ok"
          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200"
          : "border-red-600 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-950/40 dark:text-red-200"
      }`}
    >
      {children}
    </div>
  );
}

export default function ProcedureFlowchartPrototype() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="Prototype: Procedure Flowchart" backHref="/" />
      <div className="mx-auto max-w-md space-y-6 p-6">
        <div className="rounded-xl border-2 border-red-600 bg-red-50 px-4 py-3 dark:border-red-500 dark:bg-red-950/40">
          <div className="text-xs font-bold uppercase tracking-wide text-red-700 dark:text-red-300">
            AW169 — Warning
          </div>
          <div className="text-lg font-bold text-red-900 dark:text-red-100">1(2) ENG FIRE — In Flight</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <StepBox n={1}>Confirm ENG FIRE light</StepBox>
          <Arrow />
          <StepBox n={2}>Flight condition — Safe OEI</StepBox>
          <Arrow />
          <StepBox n={3}>Affected ENG MODE → IDLE</StepBox>
          <Arrow />
          <StepBox n={4}>Confirm engine FIRE</StepBox>
          <Arrow />
          <StepBox n={5}>Affected ENG MODE → OFF</StepBox>
          <Arrow />
          <StepBox n={6}>ENG FIRE ARM pushbutton → ARM</StepBox>
          <Arrow />
          <StepBox n={7}>FIRE EXTING switch → BTL 1</StepBox>
          <Arrow />
          <CautionBox>FIRE BTL LOW P illuminates once bottle discharges</CautionBox>
          <Arrow />

          {/* Branch point */}
          <div className="relative pt-2">
            <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-slate-300 dark:bg-zinc-600" />
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 grid grid-cols-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                <div>If warning clears</div>
                <div>If fire remains</div>
              </div>

              {/* Left branch — clears */}
              <div className="space-y-2">
                <StepBox tone="action">Fuel SOV → CLOSE</StepBox>
                <Arrow />
                <StepBox tone="action">Deselect ENG FIRE/ARM</StepBox>
                <Arrow />
                <StepBox tone="action">→ Single Engine Procedure</StepBox>
                <Arrow />
                <OutcomeBox tone="ok">Land as soon as practicable</OutcomeBox>
              </div>

              {/* Right branch — remains */}
              <div className="space-y-2">
                <StepBox tone="action">FIRE EXTING switch → BTL 2</StepBox>
                <Arrow />
                <StepBox tone="action">LAND IMMEDIATELY</StepBox>
                <Arrow />
                <OutcomeBox tone="urgent">Emergency Ground Egress</OutcomeBox>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
          Prototype only — not wired into real procedure data yet.
        </p>
      </div>
    </div>
  );
}
