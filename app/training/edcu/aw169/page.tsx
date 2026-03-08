"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type KeyDef = { label?: string; goto?: string | null; disabled?: boolean };
type LayoutSide = { x?: number; w?: number; top?: number; bottom?: number; y?: number; h?: number; left?: number; right?: number };
type Layout = { left?: LayoutSide; right?: LayoutSide; bottom?: LayoutSide };
type PageDef = { title: string; image?: string; layout?: Layout; left: KeyDef[]; right: KeyDef[]; bottom: KeyDef[]; notes?: string };

type PagesMap = Record<string, PageDef>;

export default function EDCUTrainerAW169Page() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialP = sp.get("p")?.toUpperCase() || "HOME";
  const cal = (() => { const v = sp.get("cal"); return !!v && v !== "0" && v !== "false"; })();
  const [pages, setPages] = useState<PagesMap | null>(null);
  const [current, setCurrent] = useState<string>(initialP);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/model-data/AW169/training/edcu/pages.json", { cache: "no-store" });
        const data = (await res.json()) as PagesMap;
        if (!cancelled) setPages(data);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Keep URL in sync for deep-linking
    const url = new URL(window.location.href);
    url.searchParams.set("p", current);
    window.history.replaceState({}, "", url.toString());
  }, [current]);

  const page = useMemo(() => (pages ? pages[current] : null), [pages, current]);

  function onPress(key?: KeyDef) {
    if (!key || !key.goto) return;
    setCurrent(key.goto);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <main className="mx-auto max-w-5xl p-4 sm:p-6 space-y-4">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-700" aria-hidden />
            <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">EDCU trainer · AW169</h1>
          </div>
          <Link href="/" className="text-sm underline text-blue-600 dark:text-blue-400">Home</Link>
        </header>

        {!page && (
          <div className="rounded-xl border bg-white p-6 text-center text-slate-600 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300">
            Loading…
          </div>
        )}

        {page && (
          <section className="rounded-2xl border bg-neutral-950 p-3 sm:p-4 shadow-inner dark:border-zinc-700">
            {/* Bezel layout: left keys · screen · right keys */}
            <div className="grid grid-cols-[auto,1fr,auto] gap-3 sm:gap-4 items-stretch">
              {/* Left keys */}
              <div className="flex flex-col justify-between gap-2 py-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <KeyButton key={`L${i}`} def={page.left[i]} onPress={onPress} side="L" idx={i + 1} />
                ))}
              </div>

              {/* Screen */}
              <div className="relative rounded-xl bg-neutral-900 ring-1 ring-white/10 overflow-hidden">
                {page.image ? (
                  <div className="relative w-full min-h-[460px]">
                    {/* Background image taken from RFM export */}
                    <img src={page.image} alt={page.title} className="block w-full h-auto select-none pointer-events-none" />

                    {/* Clickable hot-zones overlay */}
                    {(() => {
                      const l = { x: 0, w: 18, top: 8, bottom: 92, ...(page.layout?.left || {}) } as Required<LayoutSide>;
                      const r = { x: 82, w: 18, top: 8, bottom: 92, ...(page.layout?.right || {}) } as Required<LayoutSide>;
                      const b = { y: 92, h: 8, left: 10, right: 90, ...(page.layout?.bottom || {}) } as Required<LayoutSide>;
                      const segL = (l.bottom - l.top) / 6;
                      const segR = (r.bottom - r.top) / 6;
                      const segB = (b.right - b.left) / 6;
                      const zoneCls = cal ? "outline outline-1 outline-red-500/60 bg-red-500/10" : "bg-transparent";
                      return (
                        <>
                          {Array.from({ length: 6 }).map((_, i) => (
                            <button
                              key={`L-overlay-${i}`}
                              type="button"
                              style={{ position: "absolute", left: `${l.x}%`, width: `${l.w}%`, top: `${l.top + i * segL}%`, height: `${segL}%` }}
                              className={zoneCls}
                              onClick={() => onPress(page.left[i])}
                              aria-label={`L${i + 1} ${page.left[i]?.label ?? ""}`}
                              title={page.left[i]?.label ?? ""}
                            />
                          ))}
                          {Array.from({ length: 6 }).map((_, i) => (
                            <button
                              key={`R-overlay-${i}`}
                              type="button"
                              style={{ position: "absolute", left: `${r.x}%`, width: `${r.w}%`, top: `${r.top + i * segR}%`, height: `${segR}%` }}
                              className={zoneCls}
                              onClick={() => onPress(page.right[i])}
                              aria-label={`R${i + 1} ${page.right[i]?.label ?? ""}`}
                              title={page.right[i]?.label ?? ""}
                            />
                          ))}
                          {Array.from({ length: 6 }).map((_, i) => (
                            <button
                              key={`B-overlay-${i}`}
                              type="button"
                              style={{ position: "absolute", left: `${b.left + i * segB}%`, width: `${segB}%`, top: `${b.y}%`, height: `${b.h}%` }}
                              className={zoneCls}
                              onClick={() => onPress(page.bottom[i])}
                              aria-label={`B${i + 1} ${page.bottom[i]?.label ?? ""}`}
                              title={page.bottom[i]?.label ?? ""}
                            />
                          ))}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="relative min-h-[380px] sm:min-h-[460px] p-4 sm:p-5">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>AW169</span>
                      <span>EDCU</span>
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <h2 className="text-center text-lg sm:text-xl font-semibold tracking-wide text-neutral-100">{page.title}</h2>
                      <div className="mt-3 text-center text-neutral-400 text-xs">Navigation demo — FUEL and LIGHTS pages</div>
                    </div>
                    <div className="mt-5 sm:mt-6 grid place-items-center">
                      <div className="rounded-lg border border-white/10 bg-neutral-800/40 px-4 py-10 text-neutral-300 text-sm w-full max-w-md text-center">
                        {page.title} page content placeholder
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right keys */}
              <div className="flex flex-col justify-between gap-2 py-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <KeyButton key={`R${i}`} def={page.right[i]} onPress={onPress} side="R" idx={i + 1} />
                ))}
              </div>
            </div>

            {/* Bottom keys */}
            <div className="mt-3 sm:mt-4 grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <KeyButton key={`B${i}`} def={page.bottom[i]} onPress={onPress} side="B" idx={i + 1} />
              ))}
            </div>
          </section>
        )}

        <footer className="pt-1 text-center text-xs text-slate-500 dark:text-zinc-400">
          MVP: Navigation only (HOME, FUEL, LIGHTS). Images and interactive controls to follow.
        </footer>
      </main>
    </div>
  );
}

function KeyButton({ def, onPress, side, idx }: { def?: KeyDef; onPress: (d?: KeyDef) => void; side: "L"|"R"|"B"; idx: number }) {
  const label = (def?.label ?? "").trim();
  const actionable = !!def?.goto && label.length > 0 && !def?.disabled;
  const classes = [
    "select-none text-[10px] sm:text-xs font-semibold uppercase tracking-wide",
    "rounded-md px-2 py-2 sm:px-3 sm:py-2",
    actionable ? "bg-neutral-800 text-neutral-100 hover:bg-neutral-700 cursor-pointer" : "bg-neutral-900 text-neutral-500 cursor-default",
    "ring-1 ring-white/10 text-center"
  ].join(" ");

  const aria = `${side}${idx} ${label || "disabled"}`;

  return (
    <button
      type="button"
      className={classes}
      onClick={() => actionable && onPress(def)}
      aria-label={aria}
      disabled={!actionable}
      title={label || ""}
    >
      {label || ""}
    </button>
  );
}

