"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActiveModelVariant } from "@/lib/models/hooks";

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
  pageImage?: string;
  procedure?: ProcedureStep[];
  notes?: string[];
  references?: string[];
  modelIds?: string[];
};

type Manifest = { files: string[] };

type Mode = "idle" | "light" | "procedure" | "done";

const COLORS = {
  warning: { bg: "bg-red-600", ring: "ring-red-400", text: "text-white" },
  caution: { bg: "bg-amber-500", ring: "ring-amber-400", text: "text-white" }
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
  const { variant: activeVariant } = useActiveModelVariant();
  const isH125 = activeVariant.productId === "H125";
  const [all, setAll] = useState<LightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("idle");
  const [pickCounts, setPickCounts] = useState<{ warning: number | "all"; caution: number | "all" }>({ warning: 10, caution: 10 });
  const [deck, setDeck] = useState<LightItem[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const manifests: string[] = [
          `/model-data/${activeVariant.id}/training/lights/manifest.json`,
          `/model-data/${activeVariant.id}/training/lights.json`,
        ];
        if (activeVariant.productId !== "H125") {
          manifests.push("/training/lights/manifest.json");
        }

        let files: string[] = [];
        for (const url of manifests) {
          try {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) continue;
            const data = await res.json();
            if (Array.isArray(data?.files)) {
              files = data.files;
              break;
            }
            if (Array.isArray(data)) {
              files = data;
              break;
            }
          } catch (err) {
            console.warn("Kunne ikke lese manifest", url, err);
          }
        }

        if (!files.length && activeVariant.productId !== "H125") {
          files = ["/training/lights/all-lights.json"];
        }

        const arrays = await Promise.allSettled(
          files.map((path) => {
            const finalPath = path.startsWith("/") ? path : `/model-data/${activeVariant.id}/training/lights/${path}`;
            return fetch(finalPath, { cache: "no-store" }).then((res) => (res.ok ? res.json() : []));
          })
        );

        const merged: LightItem[] = arrays.flatMap((result) =>
          result.status === "fulfilled" && Array.isArray(result.value) ? (result.value as LightItem[]) : []
        );

        const filtered = merged.filter((item) => {
          const modelIds = Array.isArray((item as any).modelIds) ? (item as any).modelIds : null;
          const models = Array.isArray((item as any).models) ? (item as any).models : null;
          const productIds = Array.isArray((item as any).productIds) ? (item as any).productIds : null;
          const productId = (item as any).productId;
          const modelId = (item as any).modelId;

          if (modelIds && (modelIds.includes(activeVariant.id) || modelIds.includes(activeVariant.productId))) return true;
          if (models && models.includes(activeVariant.id)) return true;
          if (productIds && productIds.includes(activeVariant.productId)) return true;
          if (typeof modelId === "string" && (modelId === activeVariant.id || modelId === activeVariant.productId)) return true;
          if (typeof productId === "string" && productId === activeVariant.productId) return true;

          if (activeVariant.productId === "H125") return false;
          return true;
        });

        const cleaned = uniqById(filtered);
        if (!cancelled) setAll(cleaned);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeVariant.id, activeVariant.productId]);

  const warningLights = useMemo(() => all.filter((item) => item.severity === "warning"), [all]);
  const cautionLights = useMemo(() => all.filter((item) => item.severity === "caution"), [all]);

  const start = useCallback((severity: Severity) => {
    const pool = severity === "warning" ? warningLights : cautionLights;
    if (!pool.length) return;
    const setting = pickCounts[severity];
    const shuffled = shuffle(pool);
    const n = setting === "all" ? shuffled.length : Math.min(shuffled.length, setting);
    setDeck(shuffled.slice(0, n));
    setIdx(0);
    setMode("light");
  }, [warningLights, cautionLights, pickCounts]);

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
      if (mode === "idle" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); start("warning"); }
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
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center rounded-full border bg-white/90 dark:bg-zinc-900/80 border-slate-300 dark:border-zinc-700 px-2.5 py-1 text-sm font-medium text-slate-900 dark:text-zinc-100"
              title={current.system || ""}
            >
              <span className={`${current.severity === "warning" ? "bg-red-500" : "bg-amber-500"} mr-2 inline-block h-2 w-2 rounded-full`} aria-hidden />
              {current.name}
            </div>
            {current.system && <div className="text-xs opacity-70 uppercase tracking-wide dark:text-zinc-300">{current.system}</div>}
          </div>
          <div className="text-sm opacity-70 dark:text-zinc-300">{idx + 1} / {deck.length} • {mode.toUpperCase()}</div>
        </div>
      </div>
    );
  }, [current, deck.length, idx, mode]);

  function StepCard({ step }: { step: ProcedureStep }) {
  const base = "rounded-xl p-4 whitespace-pre-wrap leading-relaxed text-[15px] md:text-[16px] dark:bg-zinc-900/80 dark:text-zinc-100";
    switch (step.type) {
      case "action":
        return <div className={`${base} border dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-100`}>{step.text}</div>;
      case "note":
        return <div className={`${base} border-l-4 border-blue-500/60 bg-blue-50 dark:bg-zinc-900/70 dark:text-zinc-100`}>{step.text}</div>;
      case "caution":
        return <div className={`${base} border-l-4 border-amber-500/60 bg-amber-50 dark:bg-zinc-900/70 dark:text-zinc-100`}><div className="font-semibold mb-1">CAUTION</div>{step.text}</div>;
      case "warning":
        return <div className={`${base} border-l-4 border-red-600/60 bg-red-50 dark:bg-zinc-900/70 dark:text-zinc-100`}><div className="font-semibold mb-1">WARNING</div>{step.text}</div>;
      case "branch":
        return (
          <div className={`${base} border-dashed border dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-100`}>
            {step.heading && <div className="font-semibold mb-1">{step.heading}</div>}
            {step.text}
          </div>
        );
      default:
        return <div className={`${base} border dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-100`}>{(step as any).text}</div>;
    }
  }

  function ProcedureLikePDF({ item }: { item: LightItem }) {
    if (item.pageImage) {
      // On H125 in dark mode, inline SVG and strip its prefers-color-scheme: dark block
      // so the SVG stays in its light palette (darker ink) even when OS is dark (mobile Safari).
      const [svgHtml, setSvgHtml] = useState<string | null>(null);
      useEffect(() => {
        let cancelled = false;
        async function load() {
          try {
            if (!isH125) { setSvgHtml(null); return; }
            if (typeof window === "undefined") { setSvgHtml(null); return; }
            const isDark = document.documentElement.classList.contains("dark");
            const isSvg = typeof item.pageImage === "string" && item.pageImage.endsWith(".svg");
            const isMobile = window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
            if (!(isDark && isSvg && isMobile)) { setSvgHtml(null); return; }
            const src = String(item.pageImage);
            const res = await fetch(src, { cache: "no-store" });
            if (!res.ok) { setSvgHtml(null); return; }
            const txt = await res.text();
            // Remove the @media (prefers-color-scheme: dark) block entirely
            const cleaned = txt.replace(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[\s\S]*?\}/g, "");
            const isCaution = false;
            if (!isCaution) { setSvgHtml(null); return; }

            // Inject white background and normalize to DOOR style only for CAUTION (yellow) lights
            const withBg = cleaned.replace(/<svg([^>]*)>/, '<svg$1><rect width="100%" height="100%" fill="white"/>');
            const style = '<style id="rr-mobile-dark-normalize">\n'
              + ':root,svg,g{color:#111 !important}\n'
              + '.txt,.title,.label{fill:#111 !important}\n'
              + 'line,path,polyline,polygon,rect,circle,ellipse{stroke:#111 !important}\n'
              + '.warnRect{fill:#000 !important;stroke:#111 !important}\n'
              + '.warnText{fill:#ffcc00 !important}\n'
              + '.branchCaution,.caution,.orange{fill:orange !important}\n'
              + '</style>';
            const finalSvg = withBg.replace(/<\/svg>\s*$/, style + '</svg>');
            if (!cancelled) setSvgHtml(finalSvg);
          } catch {
            if (!cancelled) setSvgHtml(null);
          }
        }
        load();
        return () => { cancelled = true; };
      }, [item.pageImage]);

      return (
        <figure className={`rounded-2xl border bg-white shadow ${ (isH125) ? "dark:bg-white dark:border-zinc-300" : "dark:bg-zinc-900/80 dark:border-zinc-600" } p-4`}>
          <div className="relative overflow-hidden rounded-xl">
            {svgHtml ? (
              <div className="w-full h-auto mx-auto [&>svg]:max-w-full [&>svg]:w-auto [&>svg]:h-auto [&>svg]:max-h-[70svh] sm:[&>svg]:max-h-none" dangerouslySetInnerHTML={{ __html: svgHtml }} />
            ) : (
              <Image
                src={item.pageImage}
                alt={item.name}
                width={1200}
                height={1600}
                className={`w-full h-auto transition ${item.severity === "warning" ? "dark:brightness-110 dark:contrast-125 dark:saturate-150" : "dark:brightness-110 dark:contrast-120 dark:saturate-140"}`}
                priority
              />
            )}
          </div>
          {item.references?.length ? (
            <figcaption className="mt-3 text-xs text-slate-500 dark:text-zinc-400">
              {item.references.join(", ")}
            </figcaption>
          ) : null}
        </figure>
      );
    }

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
          <section className="rounded-xl border-2 border-black dark:border-zinc-600 dark:bg-zinc-900/80 p-0 overflow-hidden">
            <table className="w-full text-[15px]">
              <tbody>
                {actions.map((a, i) => (
                  <tr key={`${item.id}-act-${i}`} className="border-b last:border-b-0 dark:border-zinc-700">
                    <td className="w-12 align-top px-4 py-3 font-bold dark:text-zinc-100">{i + 1}.</td>
                    <td className="align-top px-4 py-3 dark:text-zinc-100">{(a as any).text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {(pair || beforeTree.length || afterTree.length) && (
          <div className="flex items-center justify-center">
            <div className="h-6 w-px bg-black dark:bg-zinc-100" />
          </div>
        )}
        {beforeTree.length > 0 && (
          <section className="space-y-2">{beforeTree.map((s, i) => <StepCard key={`${item.id}-pre-${i}`} step={s} />)}</section>
        )}
        {pair && (
          <section className="relative">
            <div className="absolute left-1/6 right-1/6 top-3 h-px bg-black dark:bg-zinc-100 mx-auto" />
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <div className="flex justify-center">
                  <div className="h-6 w-px bg-black dark:bg-zinc-100" />
                </div>
                <div className="mt-3 rounded-xl border p-4 bg-white dark:bg-blue-900/20 dark:text-white dark:border-blue-300">
                  {pair.left.heading && <div className="font-semibold mb-1">{pair.left.heading}</div>}
                  <div className="whitespace-pre-wrap">{pair.left.text}</div>
                </div>
              </div>
              <div className="relative">
                <div className="flex justify-center">
                  <div className="h-6 w-px bg-black dark:bg-zinc-100" />
                </div>
                <div className="mt-3 rounded-xl border p-4 bg-white dark:bg-blue-900/20 dark:text-white dark:border-blue-300">
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
              <div key={`${item.id}-noteB-${i}`} className="rounded-xl border bg-neutral-50 dark:bg-blue-900/20 dark:text-zinc-100 dark:border-blue-300 p-4 whitespace-pre-wrap">
                {n}
              </div>
            ))}
          </section>
        )}
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="h-px w-40 bg-black dark:bg-zinc-100" />
          <div className="text-sm tracking-widest text-black dark:text-zinc-100">END</div>
          <div className="h-px w-40 bg-black dark:bg-zinc-100" />
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      {mode !== "idle" && current && header}
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        {mode === "idle" && (
          <div className="space-y-6">
            <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" aria-hidden />
                <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Red Warning Lights – Trainer</h1>
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-300">Select the number of random red lights and press <b>Start</b>.</p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-slate-600 dark:text-zinc-300">Amount:</label>
                <select
                  value={pickCounts.warning}
                  onChange={(e) => setPickCounts((prev) => ({ ...prev, warning: e.target.value === "all" ? "all" : Number(e.target.value) }))}
                  className="rounded-md border px-3 py-2 bg-white text-slate-900 border-slate-300 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value="all">All</option>
                </select>
                <button
                  onClick={() => start("warning")}
                  disabled={loading || !warningLights.length}
                  className="rounded-md px-4 py-2 bg-red-600 text-white font-medium disabled:opacity-40"
                >
                  {loading ? "Loading…" : `Start (${warningLights.length} available)`}
                </button>
              </div>
              {!warningLights.length && !loading && (
                <div className="text-sm text-slate-600 dark:text-zinc-300">
                  No red lights found for the selected model.
                </div>
              )}
            </section>

            <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Yellow Caution Lights – Trainer</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-300">Train on caution lights with the same workflow.</p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-slate-600 dark:text-zinc-300">Amount:</label>
                <select
                  value={pickCounts.caution}
                  onChange={(e) => setPickCounts((prev) => ({ ...prev, caution: e.target.value === "all" ? "all" : Number(e.target.value) }))}
                  className="rounded-md border px-3 py-2 bg-white text-slate-900 border-slate-300 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value="all">All</option>
                </select>
                <button
                  onClick={() => start("caution")}
                  disabled={loading || !cautionLights.length}
                  className="rounded-md px-4 py-2 bg-amber-500 text-amber-950 font-medium disabled:opacity-40 dark:bg-amber-400 dark:text-zinc-900"
                >
                  {loading ? "Loading…" : `Start (${cautionLights.length} available)`}
                </button>
              </div>
              {!cautionLights.length && !loading && (
                <div className="text-sm text-slate-600 dark:text-zinc-300">
                  No caution lights found for the selected model.
                </div>
              )}
            </section>
          </div>
        )}
        {mode === "light" && current && (
          <div className="space-y-6">
            <button
              onClick={reveal}
              className="w-full rounded-2xl border p-8 text-left transition hover:shadow-md bg-white dark:bg-zinc-900 dark:border-zinc-700"
              title="Click to show procedure"
            >
              <div className="mb-3 text-sm opacity-90 text-gray-600 dark:text-zinc-100">Click the light to show the procedure</div>
              {isH125 ? (
                <div className="flex justify-center">
                  <div className="w-[min(20rem,100%)] rounded-md bg-black p-4 h-20 grid place-items-center shadow-inner ring-1 ring-white/10">
                    <div
                      className={`${
                        current.severity === "warning"
                          ? "text-red-600 dark:text-red-200 dark:drop-shadow-[0_0_14px_rgba(255,85,85,0.65)]"
                          : "text-amber-600 dark:text-amber-100 dark:drop-shadow-[0_0_14px_rgba(251,191,36,0.5)]"
                      } text-xl md:text-2xl font-extrabold tracking-wide antialiased`}
                    >
                      {current.name.toUpperCase()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl p-5 border bg-neutral-50 dark:bg-zinc-900/80 dark:border-zinc-700">
                  <span className={`${current.severity === "warning" ? "bg-red-500" : "bg-amber-500"} inline-block h-2.5 w-2.5 rounded-full`} aria-hidden />
                  {current.icon && (
                    <Image
                      src={current.icon}
                      alt={current.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 object-contain rounded-md bg-white/20 dark:bg-white/5"
                      unoptimized
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-lg md:text-xl font-semibold text-slate-900 dark:text-zinc-100">{current.name}</div>
                    {current.description && <div className="opacity-80 mt-0.5 text-slate-600 dark:text-zinc-300">{current.description}</div>}
                  </div>
                </div>
              )}
            </button>
            <div className="flex items-center justify-between pt-2">
              <button onClick={prev} disabled={!canPrev} className="rounded-lg px-4 py-2 border dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 disabled:opacity-40">Previous</button>
              <div className="text-sm opacity-60 dark:text-zinc-300">Enter/Space: show procedure</div>
              <button disabled className="rounded-lg px-4 py-2 border opacity-40">Next</button>
            </div>
          </div>
        )}
        {mode === "procedure" && current && (
          <div className="space-y-6">
            {current.description && !current.pageImage && (
              <div className="rounded-xl border bg-white dark:bg-blue-900/20 dark:text-zinc-100 dark:border-blue-300 p-4 text-[15px] md:text-[16px]">
                {current.description}
              </div>
            )}
            <ProcedureLikePDF item={current} />
            <div className="sticky bottom-0 bg-white/80 dark:bg-transparent backdrop-blur border-t dark:border-blue-400">
              <div className="max-w-3xl mx-auto p-4 flex items-center justify-between">
                <button onClick={prev} disabled={!canPrev} className="rounded-lg px-4 py-2 border dark:text-zinc-100 dark:border-blue-400 disabled:opacity-40">Previous</button>
                <div className="text-sm opacity-60 dark:text-zinc-300">→ for Next</div>
                <button onClick={next} disabled={!canNext} className="rounded-lg px-4 py-2 bg-blue-600 text-white dark:bg-transparent dark:text-zinc-100 disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        )}
        {mode === "done" && (
          <div className="text-center py-24">
            <div className="text-3xl font-semibold mb-4 text-slate-900 dark:text-zinc-100">Great job!</div>
            <div className="text-lg opacity-70 mb-8 text-slate-700 dark:text-zinc-300">You&apos;ve completed the training.</div>
            <button
              onClick={() => router.refresh()}
              className="rounded-lg px-6 py-3 bg-black text-white transition hover:bg-black/90 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Restart
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
