"use client";

import { useState } from "react";

export type ExteriorHotspot = {
  id: string;
  label: string;
  /** Position of the marker dot, in percent of the silhouette's viewBox (0-100). */
  x: number;
  y: number;
  /** Which side the leader line/bubble should extend toward, so bubbles don't run off the edge. */
  side?: "left" | "right";
  description: string;
  /** Optional short technical detail line shown under the description (e.g. frequency, install location). */
  note?: string;
};

export default function ExteriorMap({
  imageSrc,
  imageAlt,
  hotspots,
  width,
  height,
}: {
  imageSrc: string;
  imageAlt: string;
  hotspots: ExteriorHotspot[];
  width: number;
  height: number;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const active = hotspots.find((h) => h.id === activeId) || null;
  const expanded = hotspots.find((h) => h.id === expandedId) || null;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700">
        <div className="relative" style={{ width: `${width}px`, minWidth: `${width}px` }}>
          <img src={imageSrc} alt={imageAlt} width={width} height={height} className="block select-none" draggable={false} />

          {hotspots.map((h) => {
            const isActive = h.id === activeId;
            {/* Bubble extends away from the nearest edge, toward the open middle of the image. */}
            const side = h.side || (h.x < 50 ? "right" : "left");
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  setActiveId((cur) => (cur === h.id ? null : h.id));
                  if (expandedId && expandedId !== h.id) setExpandedId(null);
                }}
                aria-label={h.label}
                className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                <span
                  className={`block rounded-full transition-all ${
                    isActive
                      ? "h-4 w-4 bg-amber-500 ring-4 ring-amber-300/60"
                      : "h-3 w-3 bg-blue-600 ring-2 ring-white dark:ring-zinc-900 hover:bg-amber-500"
                  }`}
                />
                {isActive && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 z-20 flex items-center ${
                      side === "right" ? "left-full ml-2" : "right-full mr-2 flex-row-reverse"
                    }`}
                  >
                    <span className={`h-px w-6 bg-slate-400 dark:bg-zinc-500 ${side === "left" ? "scale-x-[-1]" : ""}`} />
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(h.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          setExpandedId(h.id);
                        }
                      }}
                      className="whitespace-nowrap rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1.5 text-xs font-semibold shadow-lg cursor-pointer hover:opacity-90"
                    >
                      {h.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-zinc-400 px-1">
        Tap a marker to see what it is, tap the label for more detail. Scroll sideways to see the whole aircraft.
      </p>

      {expanded && (
        <div className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-slate-900 dark:text-zinc-100">{expanded.label}</h3>
            <button
              type="button"
              onClick={() => setExpandedId(null)}
              aria-label="Close"
              className="shrink-0 rounded-full h-7 w-7 grid place-items-center text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-700 dark:text-zinc-300">{expanded.description}</p>
          {expanded.note && (
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 border-t pt-2 dark:border-zinc-700">
              {expanded.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
