"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type StepType = "note" | "action" | "branch" | "caution" | "warning";
type Severity = "warning" | "caution";

type ProcedureStep =
  | { type: "branch"; heading?: string; text: string }
  | { type: Exclude<StepType, "branch">; text: string };

type LightItem = {
  id: string;
  name: string;
  severity: Severity;
  system?: string;
  description?: string;
  icon?: string;
  procedure: ProcedureStep[];
  notes?: string[];
};

type Manifest = { files: string[] };

type Mode = "idle" | "light" | "procedure" | "done";

const COLORS = {
  warning: { bg: "bg-red-600", ring: "ring-red-400", text: "text-white" },
  caution: { bg: "bg-yellow-400", ring: "ring-yellow-300", text: "text-black" }
} as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function uniqById(items: LightItem[]): LightItem[] {
  const seen = new Set<string>();
  return items.filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)));
}

function splitProcedure(steps: ProcedureStep[]) {
  const notes: ProcedureStep[] = [];
  const actions: ProcedureStep[] = [];
  const rest: ProcedureStep[] = [];
  for (const s of steps) {
    if (s.type === "note") notes.push(s);
    else if (s.type === "action") actions.push(s);
    else rest.push(s);
  }
  return { notes, actions, rest };
}

function pickFirstBranchPair(steps: ProcedureStep[]) {
  for (let i = 0; i < steps.length - 1; i++) {
    if (steps[i].type === "branch" && steps[i + 1].type === "branch") {
      return { left: steps[i] as Extract<ProcedureStep, { type: "branch" }>, right: steps[i + 1] as Extract<ProcedureStep, { type: "branch" }>, startIndex: i };
    }
  }
  return null;
}

export default function LightsTrainer() {
  const router = useRouter();
  const [all, setAll] = useState<LightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("idle");
  const [pickCount, setPickCount] = useState<number | "all">(10);
  const [deck, setDeck] = useState<LightItem[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let files: string[] = [];
        try {
          const res = await fetch("/training/lights/manifest.json", { cache: "no-store" });
          if (res.ok) {
            const man = (await res.json()) as Manifest;
            if (man?.files?.length) files = man.files;
          }
        } catch {}
        if (!files.length) files = ["/training/lights/all-lights.json"];
        const arrays = await Promise.allSettled(
          files.map((p) => fetch(p, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])))
        );
        const merged: LightItem[] = arrays.flatMap((r) =>
          r.status === "fulfilled" && Array.isArray(r.value) ? (r.value as LightItem[]) : []
        );
        const warnings = uniqById(merged.filter((x) => x?.severity === "warning"));
        if (!cancelled) setAll(warnings);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const start = useCallback(() => {
    if (!all.length) return;
    const shuffled = shuffle(all);
    const n = pickCount === "all" ? shuffled.length : Math.min(shuffled.length, pickCount);
    setDeck(shuffled.slice(0, n));
    setIdx(0);
    setMode("light");
  }, [all, pickCount]);

  const current = deck[idx];

  const reveal = useCallback(() => {
    if (!current) return;
    setMode("procedure");
  }, [current]);

  const next = useCallback(() => {
    if (idx + 1 >= deck.length) {
      setMode("done");
      return;
    }
    setIdx((i) => i + 1);
    setMode("light");
  }, [idx, deck.length]);

  const prev = useCallback(() => {
    if (idx <= 0) return;
    setIdx((i) => i - 1);
    setMode("light");
  }, [idx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode === "idle" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); start(); }
      else if (mode === "light" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); reveal(); }
      else if (mode === "procedure" && e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if ((mode === "procedure" || mode === "light") && e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, start, reveal, next, prev]);

  const canPrev = idx > 0 && (mode === "procedure" || mode === "light");
  const canNext = mode === "procedure";

  const header = useMemo(() => {
    if (!current) return null;
    const pal = COLORS[current.severity];
    return (
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg px-3 py-1.5 font-semibold ring-2 ${pal.bg} ${pal.text} ${pal.ring}`} title={current.system || ""}>
              {current.name}
            </div>
            {current.system && <div className="text-xs opacity-70 uppercase tracking-wide">{current.system}</div>}
          </div>
          <div className="text-sm opacity-70">{idx + 1} / {deck.length} • {mode.toUpperCase()}</div>
        </div>
      </div>
    );
  }, [current, deck.length, idx, mode]);

  function StepCard({ step }: { step: ProcedureStep }) {
    const base = "rounded-xl p-4 whitespace-pre-wrap leading-relaxed";
    switch (step.type) {
      case "action":
        return <div className={`${base} border`}>{step.text}</div>;
      case "note":
        return <div className={`${base} border-l-4 border-blue-500/70 bg-blue-50`}>{step.text}</div>;
      case "caution":
        return <div className={`${base} border-l-4 border-amber-500/70 bg-amber-50`}><div className="font-semibold mb-1">CAUTION</div>{step.text}</div>;
      case "warning":
        return <div className={`${base} border-l-4 border-red-600/70 bg-red-50`}><div className="font-semibold mb-1">WARNING</div>{step.text}</div>;
      case "branch":
        return (
          <div className={`${base} border-dashed border`}>
            {step.heading && <div className="font-semibold mb-1">{step.heading}</div>}
            {step.text}
          </div>
        );
      default:
        return <div className={`${base} border`}>{(step as any).text}</div>;
    }
  }

  function ProcedureLikePDF({ item }: { item: LightItem }) {
    const { notes, actions, rest } = splitProcedure(item.procedure || []);
    const pair = pickFirstBranchPair(rest);
    const beforeTree = pair ? rest.slice(0, pair.startIndex) : rest;
    const afterTree = pair ? rest.slice(pair.startIndex + 2) : [];
    return (
      <div className="space-y-6">
        {notes.length > 0 && (
          <section className="space-y-2">
            {notes.map((n, i) => <StepCard key={`${item.id}-note-${i}`} step={n} />)}
          </section>
        )}
        {actions.length > 0 && (
          <section className="rounded-xl border-4 border-black p-0 overflow-hidden">
            <table className="w-full text-[15px]">
              <tbody>
                {actions.map((a, i) => (
                  <tr key={`${item.id}-act-${i}`} className="border-b last:border-b-0">
                    <td className="w-12 align-top px-4 py-3 font-bold">{i + 1}.</td>
                    <td className="align-top px-4 py-3">{(a as any).text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {(pair || beforeTree.length || afterTree.length) && (
          <div className="flex items-center justify-center">
            <div className="h-6 w-px bg-black" />
          </div>
        )}
        {beforeTree.length > 0 && (
          <section className="space-y-2">{beforeTree.map((s, i) => <StepCard key={`${item.id}-pre-${i}`} step={s} />)}</section>
        )}
        {pair && (
          <section className="relative">
            <div className="absolute left-1/6 right-1/6 top-3 h-px bg-black mx-auto" />
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <div className="flex justify-center">
                  <div className="h-6 w-px bg-black" />
                </div>
                <div className="mt-3 rounded-xl border p-4">
                  {pair.left.heading && <div className="font-semibold mb-1">{pair.left.heading}</div>}
                  <div className="whitespace-pre-wrap">{pair.left.text}</div>
                </div>
              </div>
              <div className="relative">
                <div className="flex justify-center">
                  <div className="h-6 w-px bg-black" />
                </div>
                <div className="mt-3 rounded-xl border p-4">
                  {pair.right.heading && <div className="font-semibold mb-1">{pair.right.heading}</div>}
                  <div className="whitespace-pre-wrap">{pair.right.text}</div>
                </div>
              </div>
            </div>
          </section>
        )}
        {afterTree.length > 0 && (
          <section className="space-y-2">{afterTree.map((s, i) => <StepCard key={`${item.id}-post-${i}`} step={s} />)}</section>
        )}
        {item.notes && item.notes.length > 0 && (
          <section className="space-y-2">
            <div className="text-sm font-semibold opacity-80">Notes</div>
            {item.notes.map((n, i) => (
              <div key={`${item.id}-noteB-${i}`} className="rounded-xl border bg-neutral-50 p-4 whitespace-pre-wrap">
                {n}
              </div>
            ))}
          </section>
        )}
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="h-px w-40 bg-black" />
          <div className="text-sm tracking-widest">END</div>
          <div className="h-px w-40 bg-black" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {mode !== "idle" && current && header}
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        {mode === "idle" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Red Warning Lights – Trainer</h1>
            <p className="opacity-70">Select the number of random red lights and press <b>Start</b>.</p>
            <div className="flex items-center gap-3">
              <label className="text-sm opacity-70">Amount:</label>
              <select
                value={pickCount}
                onChange={(e) => setPickCount(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="rounded-lg border px-3 py-2"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value="all">All</option>
              </select>
              <button
                onClick={start}
                disabled={loading || !all.length}
                className="rounded-lg px-5 py-2 bg-black text-white disabled:opacity-40"
              >
                {loading ? "Loading…" : `Start (${all.length} available)`}
              </button>
            </div>
            {!all.length && !loading && (
              <div className="text-sm opacity-70">
                No red lights found. Place JSON in <code>/public/training/lights/</code> and optionally a <code>manifest.json</code> with paths.
              </div>
            )}
          </div>
        )}
        {mode === "light" && current && (
          <div className="space-y-6">
            <button
              onClick={reveal}
              className="w-full rounded-2xl border p-8 text-left transition hover:shadow-md"
              title="Click to show procedure"
            >
              <div className="mb-3 text-sm opacity-70">Click the light to show the procedure</div>
              <div className={`flex items-center gap-4 rounded-2xl p-5 ring-2 ${COLORS[current.severity].bg} ${COLORS[current.severity].text} ${COLORS[current.severity].ring}`}>
                {current.icon && (
                  <img src={current.icon} alt={current.name} className="h-14 w-14 object-contain rounded-md bg-white/10" />
                )}
                <div className="flex-1">
                  <div className="text-xl font-semibold">{current.name}</div>
                  {current.description && <div className="opacity-90 mt-0.5">{current.description}</div>}
                </div>
              </div>
            </button>
            <div className="flex items-center justify-between pt-2">
              <button onClick={prev} disabled={!canPrev} className="rounded-lg px-4 py-2 border disabled:opacity-40">Previous</button>
              <div className="text-sm opacity-60">Enter/Space: show procedure</div>
              <button disabled className="rounded-lg px-4 py-2 border opacity-40">Next</button>
            </div>
          </div>
        )}
        {mode === "procedure" && current && (
          <div className="space-y-6">
            {current.description && <div className="rounded-xl border bg-white p-4">{current.description}</div>}
            <ProcedureLikePDF item={current} />
            <div className="sticky bottom-0 bg-white/80 backdrop-blur border-t">
              <div className="max-w-3xl mx-auto p-4 flex items-center justify-between">
                <button onClick={prev} disabled={!canPrev} className="rounded-lg px-4 py-2 border disabled:opacity-40">Previous</button>
                <div className="text-sm opacity-60">→ for Next</div>
                <button onClick={next} disabled={!canNext} className="rounded-lg px-4 py-2 bg-black text-white disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        )}
        {mode === "done" && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-semibold">Finished ✅</h2>
            <p className="opacity-70">You have completed all selected red lights ({deck.length}).</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setMode("idle"); setDeck([]); setIdx(0); }} className="rounded-lg px-5 py-2 border">Restart</button>
              <button onClick={() => router.push("/")} className="rounded-lg px-5 py-2 bg-black text-white">Go to home</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
