"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";
import { useActiveModelVariant } from "@/lib/models/hooks";


type StepType = "note" | "action" | "branch" | "caution" | "warning" | "step";
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
  // Optional clickable cross-reference hotspots baked from the source document
  // (currently used by S92). Rects are pixel coordinates within the pageImage
  // at its native imageWidth/imageHeight; destPage resolves via that model's
  // training/lights/page-index.json to another light id, if one exists yet.
  links?: { rect: [number, number, number, number]; destPage: number | null }[];
  imageWidth?: number;
  imageHeight?: number;
};

type Manifest = { files: string[] };

type Mode = "idle" | "light" | "procedure" | "done";

const COLORS = {
  warning: { bg: "bg-red-600", ring: "ring-red-400", text: "text-white" },
  caution: { bg: "bg-amber-500", ring: "ring-amber-400", text: "text-white" }
} as const;

// AW169 QRH memory box crop coordinates (normalized to QRH page image)
const AW169_PAGE_W = 415.508;
const AW169_PAGE_H = 650.192;
const AW169_MEMORY_CROPS: Record<string, [number, number, number, number]> = {
  "bag-fire-flight": [0.104171, 0.160992, 0.741213, 0.032206],
  "bag-fire-ground": [0.104171, 0.160992, 0.741213, 0.032206],
  "elec-fail-double-dc-gen": [0.105326, 0.236293, 0.741646, 0.061551],
  "eng-drive-shaft-failure": [0.149658, 0.199658, 0.748433, 0.032298],
  "eng-eecu-fail": [0.149658, 0.190984, 0.748433, 0.032298],
  "eng-fail-fixed": [0.152113, 0.183417, 0.741791, 0.055368],
  "eng-fire-flight": [0.105326, 0.190061, 0.741646, 0.219997],
  "eng-fire-ground": [0.153123, 0.167175, 0.741646, 0.181516],
  "eng-idle": [0.104171, 0.328758, 0.743812, 0.032298],
  "eng-oil-press": [0.104171, 0.237216, 0.743812, 0.049185],
  "eng-out": [0.101861, 0.205564, 0.748578, 0.032298],
  "mgb-oil-press": [0.151824, 0.192091, 0.743812, 0.090712],
  "mgb-oil-temp": [0.105326, 0.207133, 0.741646, 0.061459],
  "rotor-high": [0.104171, 0.341954, 0.743812, 0.049185],
  "rotor-low": [0.104171, 0.341954, 0.743812, 0.049185]
};

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
	      return {
	        left: steps[i] as Extract<ProcedureStep, { type: "branch" }>,
	        right: steps[i + 1] as Extract<ProcedureStep, { type: "branch" }>,
	        startIndex: i,
	      };
	    }
	  }
	  return null;
}

function LightsBar(props: {
	  title: string;
	  description: string;
	  tone?: "blue" | "amber" | "slate" | "emerald" | "red";
	  icon?: ReactNode;
	  href?: string;
	  onClick?: () => void;
	  actionLabel?: string;
	  disabled?: boolean;
}) {
	  const tones: Record<string, string> = {
	    blue: "border-blue-600 bg-blue-50/40 hover:bg-blue-50 dark:border-blue-400 dark:bg-blue-900/40 dark:hover:bg-blue-900/60",
	    amber: "border-amber-500 bg-amber-50/40 hover:bg-amber-50 dark:border-amber-400 dark:bg-amber-900/40 dark:hover:bg-amber-900/60",
	    slate: "border-slate-500 bg-slate-50/40 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800/60 dark:hover:bg-zinc-700/80",
	    emerald: "border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60",
	    red: "border-red-600 bg-red-50/40 hover:bg-red-50 dark:border-red-500 dark:bg-red-900/40 dark:hover:bg-red-900/60",
	  };
	  const tone = tones[props.tone || "slate"];
	  const base =
	    "group w-full rounded-xl border-l-4 " +
	    tone +
	    " transition block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900";
	  const inner = (
	    <div className="px-5 py-4 flex items-start justify-between gap-4">
	      <div className="flex items-start gap-3">
	        {props.icon && (
	          <span className="inline-grid place-items-center h-8 w-8 rounded-lg bg-white/70 text-slate-700 dark:bg-zinc-900/80 dark:text-zinc-100">
	            {props.icon}
	          </span>
	        )}
	        <div>
	          <div className="font-semibold text-slate-900 dark:text-zinc-100">{props.title}</div>
	          <div className="text-sm text-slate-600 dark:text-zinc-300 mt-0.5">{props.description}</div>
	        </div>
	      </div>
	      <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-400 text-sm">
	        {props.actionLabel && (
	          <span className="font-medium text-slate-700 dark:text-zinc-200">{props.actionLabel}</span>
	        )}
	        <span className="text-xl transition-transform group-hover:translate-x-0.5">&gt;</span>
	      </div>
	    </div>
	  );
	  if (props.href) {
	    return (
	      <Link
	        href={props.href}
	        prefetch={false}
	        className={`${base} ${props.disabled ? "opacity-50 pointer-events-none" : ""}`}
	      >
	        {inner}
	      </Link>
	    );
	  }
	  return (
	    <button
	      type="button"
	      onClick={props.disabled ? undefined : props.onClick}
	      className={`${base} text-left ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
	      disabled={props.disabled}
	    >
	      {inner}
	    </button>
	  );
}

// Per-model CWP-trainer destinations shown on the idle "Emergency & Malfunction" menu.
const CWP_TRAINER_LINKS: Record<string, { label: string; href: string }> = {
  H125_AS350_B3_2B1: { label: "AS350 B3 2B1", href: "/training/lights/cwp/b3-2b1" },
  H125_AS350_B3E: { label: "AS350 B3e", href: "/training/lights/cwp/b3e" },
  AW189: { label: "AW189", href: "/training/lights/cwp/aw189" },
  S92: { label: "S-92", href: "/training/lights/cwp/s92" },
  H135_T3: { label: "H135 T3", href: "/training/lights/cwp/h135-t3" },
};

function WarningTriangleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4.5 21.5 20.5H2.5L12 4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17.3" r="0.9" fill="currentColor" />
    </svg>
  );
}

function CwpPanelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 12h17M12 3.5v17" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

	  function displayName(item: LightItem): string {
	    if (item.id.endsWith("-flight")) return `${item.name} (in flight)`;
	    if (item.id.endsWith("-ground")) return `${item.name} (on ground)`;
	    return item.name;
	  }

export default function LightsTrainer() {
	  const router = useRouter();
	  const { variant: activeVariant, setActiveVariant } = useActiveModelVariant();
	  const isH125 = activeVariant.productId === "H125";
	  const isAw169 = activeVariant.productId === "AW169";
	  const isB3e = activeVariant.id === "H125_AS350_B3E";
	  const [all, setAll] = useState<LightItem[]>([]);
	  const [loading, setLoading] = useState(true);
	  const [pageIndex, setPageIndex] = useState<Record<string, string>>({});
	  const [mode, setMode] = useState<Mode>("idle");
	  const [lastSeverity, setLastSeverity] = useState<Severity | null>(null);
		  const [deck, setDeck] = useState<LightItem[]>([]);
		  const [idx, setIdx] = useState(0);
		  const [memoryOnly, setMemoryOnly] = useState(false);
		  const [showMemoryMenu, setShowMemoryMenu] = useState(false);
		  const [memoryGridSeverity, setMemoryGridSeverity] = useState<Severity | null>(null);
		  const [returnToMemoryGrid, setReturnToMemoryGrid] = useState<Severity | null>(null);
		  const [isMobile, setIsMobile] = useState(false);
	  const [compactCWP, setCompactCWP] = useState(false);
		  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(() => new Set());
	  const [pickCounts, setPickCounts] = useState<{ warning: "all" | number }>({ warning: "all" });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia?.("(max-width: 640px)");
    const update = () => setIsMobile(!!mql && mql.matches);
    update();
    mql?.addEventListener?.("change", update);
    return () => mql?.removeEventListener?.("change", update);
  }, []);
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/model-data/${activeVariant.id}/training/lights/page-index.json`, { cache: "no-store" });
        if (!res.ok) { if (!cancelled) setPageIndex({}); return; }
        const data = await res.json();
        if (!cancelled) setPageIndex(data && typeof data === "object" ? data : {});
      } catch {
        if (!cancelled) setPageIndex({});
      }
    })();
    return () => { cancelled = true; };
  }, [activeVariant.id]);

  function goToLight(lightId: string) {
    try {
      sessionStorage.setItem(
        "lights:resume",
        JSON.stringify({ variantId: activeVariant.id, lightId, memoryOnly: false, deck: [lightId], idx: 0, lastSeverity: "warning" }),
      );
    } catch {}
    router.push(`/training/lights?resume=1&v=${encodeURIComponent(activeVariant.id)}&light=${encodeURIComponent(lightId)}&mem=0&cwp=1`);
  }

  function LinkHotspots({ item }: { item: LightItem }) {
    if (!item.links?.length || !item.imageWidth || !item.imageHeight) return null;
    return (
      <>
        {item.links.map((link, i) => {
          const targetId = link.destPage != null ? pageIndex[String(link.destPage)] : undefined;
          if (!targetId || targetId === item.id) return null;
          const [x0, y0, x1, y1] = link.rect;
          const style = {
            left: `${(x0 / item.imageWidth!) * 100}%`,
            top: `${(y0 / item.imageHeight!) * 100}%`,
            width: `${((x1 - x0) / item.imageWidth!) * 100}%`,
            height: `${((y1 - y0) / item.imageHeight!) * 100}%`,
          };
          return (
            <button
              key={i}
              type="button"
              className="absolute cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              style={style}
              title="Go to linked procedure"
              onClick={(e) => { e.stopPropagation(); goToLight(targetId); }}
            />
          );
        })}
      </>
    );
  }

  const procOverlayRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const manifests: string[] = [
          `/model-data/${activeVariant.id}/training/lights/manifest.json`,
          `/model-data/${activeVariant.id}/training/lights.json`,
        ];
        // Global AW169 lights (QRH-based) should only be used when training AW169,
        // not as a fallback dataset for other models like R44 II.
        if (isAw169) {
          manifests.push("/training/lights/manifest.json");
        }

        let variantFiles: string[] = [];
        let fallbackFiles: string[] = [];
        for (const url of manifests) {
          try {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) continue;
            const data = await res.json();
            const isVariant = url.startsWith("/model-data/");
            if (Array.isArray((data as any)?.files)) {
              const list = (data as any).files as string[];
              if (isVariant) variantFiles.push(...list);
              else fallbackFiles = list;
              continue;
            }
            if (Array.isArray(data)) {
              if (isVariant) variantFiles.push(...(data as any[] as string[]));
              else fallbackFiles = data as any[] as string[];
              continue;
            }
          } catch (err) {
            console.warn("Kunne ikke lese manifest", url, err);
          }
        }

        let files: string[] = variantFiles.length ? Array.from(new Set(variantFiles)) : fallbackFiles;
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

	  const aw169RedMemoryLights = useMemo(
	    () =>
	      isAw169
	        ? warningLights.filter((item) => (AW169_MEMORY_CROPS as any)[item.id])
	        : [],
	    [warningLights, activeVariant.id]
	  );

	  const aw169AmberMemoryLights = useMemo(
	    () =>
	      isAw169
	        ? all.filter((item) => item.severity === "caution" && (AW169_MEMORY_CROPS as any)[item.id])
	        : [],
	    [all, activeVariant.id]
	  );

  // Resume previous procedure context when returning from a linked procedure page
  useEffect(() => {
    try {
      // If URL already has resume parameters, let the URL-resume effect handle it to avoid double-restores
      if (searchParams?.get("resume")) return;
      const raw = sessionStorage.getItem("lights:resume");
      if (!raw) return;
      const r = JSON.parse(raw) as { variantId: string; lightId: string; memoryOnly?: boolean; deck?: string[]; idx?: number; lastSeverity?: Severity };
      if (r.variantId !== activeVariant.id) return;
      if (!all.length) return;
      const item = all.find((x) => x.id === r.lightId);
      if (!item) return;
      let deckItems: LightItem[] = [];
      if (Array.isArray(r.deck) && r.deck.length) {
        deckItems = r.deck.map((id) => all.find((x) => x.id === id)).filter(Boolean) as LightItem[];
        // Ensure current item is present
        if (!deckItems.find((d) => d.id === item.id)) deckItems.push(item);
      } else {
        // Fallback: at least current item
        deckItems = [item];
      }
      const idxToSet = (typeof r.idx === "number" && r.idx >= 0 && r.idx < deckItems.length)
        ? r.idx
        : Math.max(0, deckItems.findIndex((d) => d.id === item.id));
      setDeck(deckItems);
      setIdx(idxToSet >= 0 ? idxToSet : 0);
      setLastSeverity(r.lastSeverity ?? (deckItems[0]?.severity ?? item.severity));
      setMemoryOnly(!!r.memoryOnly);
      setMode("procedure");
      sessionStorage.removeItem("lights:resume");
    } catch {}
  }, [all, activeVariant.id, searchParams]);

  // Resume via URL query (?resume=1&v=<variant>&light=<id>&mem=0|1>)
  useEffect(() => {
    const run = async () => {
      try {
        if (!searchParams) return;
        const resume = searchParams.get("resume");
        const v = searchParams.get("v");
        const light = searchParams.get("light");
        const mem = searchParams.get("mem");
        const cwp = searchParams.get("cwp");
        if (!resume || !v || !light) return;
        setCompactCWP(!!cwp && cwp !== "0" && cwp !== "false");
        if (v !== activeVariant.id) { try { await setActiveVariant(v); } catch {} return; }
        if (!all.length) return;
        const item = all.find((x) => x.id === light);
        if (!item) return;
        // Prefer restoring full deck/idx from sessionStorage if available and matching
        try {
          const raw = sessionStorage.getItem("lights:resume");
          if (raw) {
            const r = JSON.parse(raw) as { variantId: string; lightId: string; memoryOnly?: boolean; deck?: string[]; idx?: number; lastSeverity?: Severity };
            if (r.variantId === v) {
              let deckItems: LightItem[] = [];
              if (Array.isArray(r.deck) && r.deck.length) {
                deckItems = r.deck.map((id) => all.find((x) => x.id === id)).filter(Boolean) as LightItem[];
                if (!deckItems.find((d) => d.id === item.id)) deckItems.push(item);
              } else {
                deckItems = [item];
              }
              const idxToSet = (typeof r.idx === "number" && r.idx >= 0 && r.idx < deckItems.length)
                ? r.idx
                : Math.max(0, deckItems.findIndex((d) => d.id === item.id));
              setDeck(deckItems);
              setIdx(idxToSet >= 0 ? idxToSet : 0);
              setLastSeverity(r.lastSeverity ?? (deckItems[0]?.severity ?? item.severity));
              setMemoryOnly(mem === "1" ? true : !!r.memoryOnly);
              setMode("procedure");
              try { sessionStorage.removeItem("lights:resume"); } catch {}
              // clean URL without remounting the page (preserve state)
              try {
                const url = new URL(window.location.href);
                url.search = "";
                window.history.replaceState({}, "", url.toString());
              } catch {}
              return;
            }
          }
        } catch {}
        // Fallback: single item resume
        setDeck([item]);
        setIdx(0);
        setLastSeverity(item.severity);
        setMemoryOnly(mem === "1");
        setMode("procedure");
        // clean URL without remounting the page (preserve state)
        try {
          const url = new URL(window.location.href);
          url.search = "";
          window.history.replaceState({}, "", url.toString());
        } catch {}
      } catch {}
    };
    run();
  }, [searchParams, all, activeVariant.id, setActiveVariant]);

  function AW169MemoryCrop({ item }: { item: LightItem }) {
    const crop = (AW169_MEMORY_CROPS as any)[item.id] as [number, number, number, number] | undefined;
    if (!crop) return null as any;
    const [nx, ny, nw, nh] = crop;
    const vbX = Math.max(0, Math.min(AW169_PAGE_W, nx * AW169_PAGE_W));
    const vbY = Math.max(0, Math.min(AW169_PAGE_H, ny * AW169_PAGE_H));
    const vbW = Math.max(10, Math.min(AW169_PAGE_W, nw * AW169_PAGE_W));
    const vbH = Math.max(10, Math.min(AW169_PAGE_H, nh * AW169_PAGE_H));
    const href = String(item.pageImage || "");
    return (
      <figure className="p-0 m-0 bg-transparent">
        <svg viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} width="100%" xmlns="http://www.w3.org/2000/svg" className="block w-full h-auto">
          <image href={href} width={AW169_PAGE_W} height={AW169_PAGE_H} preserveAspectRatio="xMidYMid meet" />
        </svg>
      </figure>
    );
  }


  const hasMemory = useCallback((item: LightItem) => {
    const steps = item.procedure || [];
    return steps.some((s) => s.type === "action");
  }, []);

	  const memoryCount = useMemo(() => {
	    if (isAw169) {
	      return aw169RedMemoryLights.length;
	    }
	    if (activeVariant.id === "AW189") {
	      // Until we have explicit memory markers for AW189, include all red lights
	      return warningLights.length;
	    }
	    return 0;
	  }, [aw169RedMemoryLights, warningLights, activeVariant.id]);

	  const amberMemoryCount = useMemo(
	    () => (isAw169 ? aw169AmberMemoryLights.length : 0),
	    [aw169AmberMemoryLights, activeVariant.id]
	  );

			  const start = useCallback(async (_severity: Severity) => {
	    const pool = warningLights;
	    if (!pool.length) return;
	    const shuffled = shuffle(pool);
	    let n = shuffled.length;
	    if (!isAw169) {
	      const desired = pickCounts.warning === "all" ? shuffled.length : pickCounts.warning;
	      n = Math.min(shuffled.length, desired);
	    }
	    setDeck(shuffled.slice(0, n) as LightItem[]);
    setLastSeverity("warning");
	    setIdx(0);
	    setMemoryOnly(false);
	    setMode("light");
		  }, [warningLights, activeVariant.id, pickCounts.warning]);

  const startMemoryOnly = useCallback(async () => {
	    let pool: LightItem[] = [];
	    if (isAw169) {
	      // Include ONLY lights that have a detected QRH memory box crop
	      pool = aw169RedMemoryLights;
	    } else if (activeVariant.id === "AW189") {
	      // Until explicit memory items exist for AW189, include all red lights
	      pool = warningLights;
	    }

	    if (!pool.length) return;
	    const shuffled = shuffle(pool);
	    const n = shuffled.length;
	    setDeck(shuffled.slice(0, n));
	    setLastSeverity("warning");
	    setIdx(0);
	    setMemoryOnly(true);
	    setMode("light");
	  }, [aw169RedMemoryLights, warningLights, activeVariant.id]);

		  const startAmberMemoryOnly = useCallback(async () => {
	    if (!isAw169) return;
	    const pool = aw169AmberMemoryLights;
	    if (!pool.length) return;
	    const shuffled = shuffle(pool);
	    const n = shuffled.length;
	    setDeck(shuffled.slice(0, n));
	    setLastSeverity("caution");
	    setIdx(0);
	    setMemoryOnly(true);
	    setMode("light");
	  }, [activeVariant.id, aw169AmberMemoryLights]);

		  const restart = useCallback(() => {
	    const sev: Severity = lastSeverity ?? (deck[0]?.severity ?? "warning");
	    let pool = warningLights;
	    if (memoryOnly) {
	      if (isAw169) {
	        pool = aw169RedMemoryLights;
	      } else if (activeVariant.id === "AW189") {
	        pool = warningLights;
	      } else {
	        pool = [] as LightItem[];
	      }
	    }
	    if (!pool.length) return;
		    const n = deck.length || pool.length;
	    const key = `lights:lastOrders:${activeVariant.id}:${sev}:${n}:memory:${memoryOnly ? 1 : 0}`;
	    const lastOrders = (() => {
	      try { return JSON.parse(sessionStorage.getItem(key) || "[]"); } catch { return []; }
	    })() as string[];
	    const sig = (arr: LightItem[]) => arr.map((x) => x.id).join(",");
	    let next = shuffle(pool).slice(0, n);
	    if (lastOrders.includes(sig(next))) {
	      next = shuffle(pool).slice(0, n);
	    }
	    const updated = [...lastOrders, sig(next)].slice(-2);
	    try { sessionStorage.setItem(key, JSON.stringify(updated)); } catch {}
			    setDeck(next as LightItem[]);
			    setIdx(0);
			    setMode("light");
			  }, [lastSeverity, deck, warningLights, activeVariant.id, memoryOnly, aw169RedMemoryLights]);

		  async function openMemoryItem(item: LightItem) {
	    setDeck([item]);
	    setLastSeverity(item.severity as Severity);
	    setIdx(0);
	    setMemoryOnly(true);
		    setReturnToMemoryGrid(item.severity as Severity);
		    setMode("procedure");
	    setShowMemoryMenu(false);
	    setMemoryGridSeverity(null);
	  }

	  const renderText = useCallback((text?: string) => {
    if (!text) return null as any;
    if (!isAw169) return text as any;
    const re = /(SINGLE ENGINE PROCEDURE|ENGINE SHUTDOWN IN EMERGENCY)/gi;
    const parts = String(text).split(re);
    if (parts.length === 1) return text as any;
    return (
      <>
        {parts.map((p, i) => {
          const up = p.toUpperCase();
          if (up === "SINGLE ENGINE PROCEDURE") {
            return (
              <Link
                key={i}
                href={{
                  pathname: "/aw169/procedures/single-engine",
                  query: {
                    resume: "1",
                    v: activeVariant.id,
                    light: current?.id || "",
                    mem: memoryOnly ? "1" : "0",
                    cwp: "1"
                  }
                }}
                onClick={() => { try { sessionStorage.setItem("lights:resume", JSON.stringify({ variantId: activeVariant.id, lightId: current?.id || "", memoryOnly, idx, deck: deck.map(d => d.id), lastSeverity })); } catch {} }}
                className="underline text-blue-600 dark:text-blue-400"
              >
                SINGLE ENGINE PROCEDURE
              </Link>
            );
          }
          if (up === "ENGINE SHUTDOWN IN EMERGENCY") {
            return (
              <Link
                key={i}
                href={{
                  pathname: "/aw169/procedures/engine-shutdown-emergency",
                  query: {
                    resume: "1",
                    v: activeVariant.id,
                    light: current?.id || "",
                    mem: memoryOnly ? "1" : "0",
                    cwp: "1"
                  }
                }}
                onClick={() => { try { sessionStorage.setItem("lights:resume", JSON.stringify({ variantId: activeVariant.id, lightId: current?.id || "", memoryOnly, idx, deck: deck.map(d => d.id), lastSeverity })); } catch {} }}
                className="underline text-blue-600 dark:text-blue-400"
              >
                ENGINE SHUTDOWN IN EMERGENCY
              </Link>
            );
          }
          return p;
        })}
      </>
    );
  }, [activeVariant.id, idx, deck, memoryOnly]);

  const current = deck[idx];
	  const currentFlagged = current ? flaggedIds.has(current.id) : false;

	  const toggleCurrentFlag = useCallback(() => {
	    if (!current) return;
	    setFlaggedIds((prev) => {
	      const next = new Set(prev);
	      if (next.has(current.id)) next.delete(current.id);
	      else next.add(current.id);
	      return next;
	    });
	  }, [current]);

  const reveal = useCallback(() => {
    if (!current) return;
    setMode("procedure");
    if (typeof window !== "undefined") {
      try { window.history.pushState({ rr: "procedure" }, "", window.location.href); } catch {}
    }
  }, [current]);

		  const next = useCallback(() => {
		    if (idx + 1 >= deck.length) {
		      // If this was a single-memory-item session started from Browse on AW169,
		      // go back to the corresponding memory grid instead of the generic "done" screen.
		      if (
		        memoryOnly &&
		        isAw169 &&
		        deck.length === 1 &&
		        returnToMemoryGrid
		      ) {
		        setShowMemoryMenu(true);
		        setMemoryGridSeverity(returnToMemoryGrid);
		        setReturnToMemoryGrid(null);
		        setMode("idle");
		        return;
		      }
		      setMode("done");
		      return;
		    }
		    setIdx((i) => i + 1);
		    setMode("light");
		  }, [idx, deck.length, memoryOnly, activeVariant.id, returnToMemoryGrid, setShowMemoryMenu, setMemoryGridSeverity, setReturnToMemoryGrid]);

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

  useEffect(() => {
    if (isMobile && mode === "procedure") {
      setTimeout(() => procOverlayRef.current?.focus(), 0);
    }
  }, [isMobile, mode]);

  useEffect(() => {
    if (!isMobile) return;
    const onPop = () => {
      if (mode === "procedure") {
        setMode("light");
        try { history.pushState(null, "", location.href); } catch {}
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [isMobile, mode]);


  const canPrev = idx > 0 && (mode === "procedure" || mode === "light");
  const canNext = mode === "procedure";

  const header = useMemo(() => {
    if (!current) return null;
    return (
      <div className="sticky top-0 z-10 bg-slate-50/90 dark:bg-zinc-900/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 py-2.5 flex items-center gap-3">
          <span className={`${current.severity === "warning" ? "bg-red-500" : "bg-amber-500"} inline-block h-2 w-2 rounded-full shrink-0`} aria-hidden />
          <span className="text-sm font-medium text-slate-900 dark:text-zinc-100">{displayName(current)}</span>
          {current.system && <span className="text-xs opacity-60 uppercase tracking-wide dark:text-zinc-400">{current.system}</span>}
        </div>
      </div>
    );
  }, [current]);

  const topBarCounter = mode !== "idle" && mode !== "done" && current ? (
    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-zinc-300">
      {idx + 1} / {deck.length}
    </span>
  ) : null;

  function StepCard({ step }: { step: ProcedureStep }) {
  const base = "rounded-xl p-4 whitespace-pre-wrap leading-relaxed text-[15px] md:text-[16px] dark:bg-zinc-900/80 dark:text-zinc-100";
    switch (step.type) {
      case "action":
        return <div className={`${base} border dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-100`}>{renderText(step.text)}</div>;
      case "step":
        return <div className={`${base}`}>{renderText(step.text)}</div>;
      case "note":
        return <div className={`${base} border-l-4 border-blue-500/60 bg-blue-50 dark:bg-zinc-900/70 dark:text-zinc-100`}>{renderText(step.text)}</div>;
      case "caution":
        return <div className={`${base} border-l-4 border-amber-500/60 bg-amber-50 dark:bg-zinc-900/70 dark:text-zinc-100`}><div className="font-semibold mb-1">CAUTION</div>{renderText(step.text)}</div>;
      case "warning":
        return <div className={`${base} border-l-4 border-red-600/60 bg-red-50 dark:bg-zinc-900/70 dark:text-zinc-100`}><div className="font-semibold mb-1">WARNING</div>{renderText(step.text)}</div>;
      case "branch":
        return (
          <div className={`${base} border-dashed border dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-100`}>
            {step.heading && <div className="font-semibold mb-1">{step.heading}</div>}
            {renderText(step.text)}
          </div>
        );
      default:
        return <div className={`${base} border dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-100`}>{renderText((step as any).text)}</div>;
    }
  }

  // AW169 QRH-style renderer for 1(2) ENG FIRE (FLIGHT)
  function AW169EngFireFlightQRH({ item, renderText, memoryOnly }: { item: LightItem; renderText: (txt?: string) => any; memoryOnly: boolean }) {
    const { notes, actions, rest } = splitProcedure(item.procedure || []);

    if (memoryOnly) {
      return (
        <div className="space-y-6">
          {actions.length > 0 && (
            <section className="rounded-xl border-2 border-black dark:border-zinc-600 dark:bg-zinc-900/80 p-0 overflow-hidden">
              <table className="w-full text-[15px]">
                <tbody>
                  {actions.map((a, i) => (
                    <tr key={`${item.id}-mem-${i}`} className="border-b last:border-b-0 dark:border-zinc-700">
                      <td className="w-12 align-top px-4 py-3 font-bold dark:text-zinc-100">{i + 1}.</td>
                      <td className="align-top px-4 py-3 dark:text-zinc-100">{renderText((a as any).text)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      );
    }

    // Extract the small "FIRE BTL LOW P" caution sentence so we can render a yellow pill inline
    const idxLowP = rest.findIndex((s: any) => s.type === "caution" && /FIRE\s*BTL\s*LOW\s*P/i.test(String(s.text)));
    const lowPCaution = idxLowP >= 0 ? (rest[idxLowP] as any) : null;
    const remaining = idxLowP >= 0 ? rest.filter((_, i) => i !== idxLowP) : rest;

    const pair = pickFirstBranchPair(remaining);
    const beforeTree = pair ? remaining.slice(0, pair.startIndex) : remaining;
    const afterTree = pair ? remaining.slice(pair.startIndex + 2) : [];

    return (
      <div className="space-y-6">
        {/* Header row with red label and the "+ Audio tone …" text */}
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-white bg-[#e3172b] text-[13px] font-semibold shadow-[0_0_0_1px_rgba(0,0,0,0.45)]">1(2) ENG FIRE</span>
          {notes[0] && (
            <div className="text-sm text-slate-800 dark:text-zinc-100">{renderText(notes[0].text)}</div>
          )}
        </div>

        {/* Memory items table */}
        <section className="rounded-xl border-2 border-black dark:border-zinc-600 dark:bg-zinc-900/80 p-0 overflow-hidden">
          <table className="w-full text-[15px]">
            <tbody>
              {actions.map((a, i) => (
                <tr key={`${item.id}-act-${i}`} className="border-b last:border-b-0 dark:border-zinc-700">
                  <td className="w-12 align-top px-4 py-3 font-bold dark:text-zinc-100">{i + 1}.</td>
                  <td className="align-top px-4 py-3 dark:text-zinc-100">{renderText((a as any).text)}</td>
                </tr>
              ))}
              {lowPCaution && (
                <tr>
                  <td className="align-top px-4 py-3" />
                  <td className="align-top px-4 py-3 text-sm">
                    <span className="inline-block align-middle px-2.5 py-1 rounded-sm bg-[#ffcc00] text-black font-semibold border border-black mr-2">
                      FIRE BTL LOW P
                    </span>
                    <span className="align-middle text-slate-700 dark:text-zinc-200">
                      {renderText(String(lowPCaution.text).replace(/\s*FIRE\s*BTL\s*LOW\s*P\s*/i, "").trim())}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

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
                <div className="mt-3 rounded-xl border p-4 bg-white dark:bg-zinc-900/80 dark:text-zinc-100">
                  {pair.left.heading && (
                    <div className="font-semibold mb-1">
                      {pair.left.heading}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{renderText(pair.left.text)}</div>
                </div>
              </div>
              <div className="relative">
                <div className="flex justify-center">
                  <div className="h-6 w-px bg-black dark:bg-zinc-100" />
                </div>
                <div className="mt-3 rounded-xl border p-4 bg-white dark:bg-zinc-900/80 dark:text-zinc-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-white bg-[#e3172b] text-[12px] font-semibold">1(2) ENG FIRE</span>
                    {pair.right.heading && <div className="text-sm font-semibold">{pair.right.heading.replace(/^\s*IF\s*1\(2\)\s*ENG\s*FIRE\s*/i, "IF ")}</div>}
                  </div>
                  <div className="whitespace-pre-wrap">{renderText(pair.right.text)}</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {afterTree.length > 0 && (
          <section className="space-y-2">
            {afterTree.map((s, i) => {
              if ((s as any).type === "caution") {
                return (
                  <div key={`${item.id}-post-${i}`} className="rounded-md border-2 border-black bg-[#ffe6a6] text-black p-3">
                    <span className="inline-block px-2 py-0.5 rounded-sm bg-[#ffcc00] text-black font-bold border border-black mr-2">CAUTION</span>
                    {renderText((s as any).text)}
                  </div>
                );
              }

              return <StepCard key={`${item.id}-post-${i}`} step={s} />;
            })}
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





  function ProcedureLikePDF({ item, flat = false, memoryOnly: memoryMode = false, hideReferences = false }: { item: LightItem; flat?: boolean; memoryOnly?: boolean; hideReferences?: boolean }) {
    if (item.pageImage) {
    // Memory-only: override default image rendering for specific variants
    if (memoryMode) {
      if (isAw169) {
        const { actions } = splitProcedure(item.procedure || []);
        return (
          <div className="flex items-center justify-center min-h-[65vh] px-4">
            <section className="w-full max-w-2xl rounded-xl border border-slate-300 dark:border-zinc-500 bg-transparent">
              <table className="w-full text-[15px]">
                <tbody>
                  {actions.length > 0 ? (
                    actions.map((a, i) => (
                      <tr
                        key={`${item.id}-mem-${i}`}
                        className="border-b last:border-b-0 border-slate-200 dark:border-zinc-700"
                      >
                        <td className="w-12 align-top px-4 py-3 font-bold text-slate-900 dark:text-zinc-100">
                          {i + 1}.
                        </td>
                        <td className="align-top px-4 py-3 text-slate-900 dark:text-zinc-100">
                          {renderText((a as any).text)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="align-top px-4 py-3 text-slate-900 dark:text-zinc-100"
                        colSpan={2}
                      >
                        Memory items for this light will be added. Tap to reveal full QRH page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>
        );
      }

      // AW169: show QRH-accurate cropped memory box
      if (isAw169 && item.pageImage) {
        return <AW169MemoryCrop item={item} />;
      }
      const { actions } = splitProcedure(item.procedure || []);
      // AW189: show our own framed table layout (no QRH image)
      if (activeVariant.id === "AW189") {
        return (
          <div className="space-y-6">
            <section className="rounded-xl border-2 border-black dark:border-zinc-600 dark:bg-zinc-900/80 p-0 overflow-hidden">
              <table className="w-full text-[15px]">
                <tbody>
                  {actions.length > 0 ? (
                    actions.map((a, i) => (
                      <tr key={`${item.id}-mem-${i}`} className="border-b last:border-b-0 dark:border-zinc-700">
                        <td className="w-12 align-top px-4 py-3 font-bold dark:text-zinc-100">{i + 1}.</td>
                        <td className="align-top px-4 py-3 dark:text-zinc-100">{renderText((a as any).text)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="align-top px-4 py-3 dark:text-zinc-100" colSpan={2}>
                        Memory items for this light will be added. Tap to reveal full QRH page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>
        );
      }
      // Fallback (non-AW169): render a clean table of memory actions
      return (
        <div className="space-y-6">
          {actions.length > 0 && (
            <section className="rounded-xl border-2 border-black dark:border-zinc-600 dark:bg-zinc-900/80 p-0 overflow-hidden">
              <table className="w-full text-[15px]">
                <tbody>
                  {actions.map((a, i) => (
                    <tr key={`${item.id}-mem-${i}`} className="border-b last:border-b-0 dark:border-zinc-700">
                      <td className="w-12 align-top px-4 py-3 font-bold dark:text-zinc-100">{i + 1}.</td>
                      <td className="align-top px-4 py-3 dark:text-zinc-100">{renderText((a as any).text)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      );
    }

      // If memory-only mode is active for AW169, render only the cropped memory box from the QRH page
      if (memoryMode && isAw169) {
        return <AW169MemoryCrop item={item} />;
      }
      // On H125 in dark mode, inline SVG and strip its prefers-color-scheme: dark block
      // so the SVG stays in its light palette (darker ink) even when OS is dark (mobile Safari).

      /*
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
    if (isAw169) {
      return (
        <div className="flex items-center justify-center min-h-[65vh] px-4">
          <section className="w-full max-w-2xl rounded-xl border border-slate-300 dark:border-zinc-500 bg-transparent">
            <table className="w-full text-[15px]">
              <tbody>
                {actions.length > 0 ? (
                  actions.map((a, i) => (
                    <tr
                      key={`${item.id}-mem-${i}`}
                      className="border-b last:border-b-0 border-slate-200 dark:border-zinc-700"
                    >
                      <td className="w-12 align-top px-4 py-3 font-bold text-slate-900 dark:text-zinc-100">
                        {i + 1}.
                      </td>
                      <td className="align-top px-4 py-3 text-slate-900 dark:text-zinc-100">
                        {renderText((a as any).text)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="align-top px-4 py-3 text-slate-900 dark:text-zinc-100"
                      colSpan={2}
                    >
                      Memory items for this light will be added. Tap to reveal full QRH page.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      );
    }

            if (!cancelled) setSvgHtml(finalSvg);
          } catch {
            if (!cancelled) setSvgHtml(null);
          }
        }
        load();
        return () => { cancelled = true; };
      */

      const fullBleed = isAw169 && item.severity === "warning" && !!item.pageImage;

      return (
        <figure className={fullBleed ? "bg-white dark:bg-zinc-900 p-0" : (flat ? "bg-white dark:bg-zinc-900 p-0" : `rounded-2xl border bg-white shadow ${ (isH125) ? "dark:bg-zinc-900/80 dark:border-zinc-600" : "dark:bg-zinc-900/80 dark:border-zinc-600" } p-4`)}>
          <div className={fullBleed ? "relative" : "relative overflow-hidden rounded-xl"}>
            <Image
              src={item.pageImage}
              alt={item.name}
              width={1200}
              height={1600}
              className={`w-full h-auto transition ${item.severity === "warning" ? "dark:brightness-110 dark:contrast-125 dark:saturate-150" : "dark:brightness-110 dark:contrast-120 dark:saturate-140"}`}
              priority
            />
            <LinkHotspots item={item} />
          </div>
          {item.references?.length && !hideReferences ? (
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

    if (memoryMode) {
      // In memory-only mode, for AW169 with pageImage, show a QRH-accurate cropped SVG excerpt
      if (isAw169 && item.pageImage) {
        return <AW169MemoryCrop item={item} />;
      }
      // Fallback (non-AW169 or without page image): render a clean table of memory actions
      return (
        <div className="space-y-6">
          {actions.length > 0 && (
            <section className="rounded-xl border-2 border-black dark:border-zinc-600 dark:bg-zinc-900/80 p-0 overflow-hidden">
              <table className="w-full text-[15px]">
                <tbody>
                  {actions.map((a, i) => (
                    <tr key={`${item.id}-mem-${i}`} className="border-b last:border-b-0 dark:border-zinc-700">
                      <td className="w-12 align-top px-4 py-3 font-bold dark:text-zinc-100">{i + 1}.</td>
                      <td className="align-top px-4 py-3 dark:text-zinc-100">{renderText((a as any).text)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      );
    }

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
                    <td className="align-top px-4 py-3 dark:text-zinc-100">{renderText((a as any).text)}</td>
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
                <div className="mt-3 rounded-xl border p-4 bg-white dark:bg-blue-900/40 dark:text-white dark:border-blue-400">
                  {pair.left.heading && <div className="font-semibold mb-1">{pair.left.heading}</div>}
                  <div className="whitespace-pre-wrap">{renderText(pair.left.text)}</div>
                </div>
              </div>
              <div className="relative">
                <div className="flex justify-center">
                  <div className="h-6 w-px bg-black dark:bg-zinc-100" />
                </div>
                <div className="mt-3 rounded-xl border p-4 bg-white dark:bg-blue-900/40 dark:text-white dark:border-blue-400">
                  {pair.right.heading && <div className="font-semibold mb-1">{pair.right.heading}</div>}
                  <div className="whitespace-pre-wrap">{renderText(pair.right.text)}</div>
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

              <div key={`${item.id}-noteB-${i}`} className="rounded-xl border bg-neutral-50 dark:bg-blue-900/40 dark:text-zinc-100 dark:border-blue-400 p-4 whitespace-pre-wrap">
                {renderText(n)}
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

  const isResuming = useMemo(() => {
    try {
      if (typeof window !== "undefined") {
        if (sessionStorage.getItem("lights:resume")) return true;
      }
    } catch {}
    return !!searchParams?.get("resume");
  }, [searchParams]);

  if (isResuming && mode !== "procedure") {
    return <div className="min-h-screen bg-slate-50 dark:bg-zinc-900" />;
  }

	  return (
	    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
		      <AppTopBar title="Emergency & Malfunction" backHref="/" backLabel="Home" rightAction={topBarCounter} />
	      {!isMobile && mode === "procedure" && !compactCWP && current && header}
		      <main className="mx-auto max-w-3xl p-6 space-y-6">
		        {mode === "idle" && !isAw169 && activeVariant.id !== "AW139" && (
          <div className="space-y-4">
            <section className="rounded-xl border-l-4 border-red-600 dark:border-red-500 bg-white dark:bg-zinc-800 shadow-sm p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="inline-grid place-items-center h-8 w-8 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300 shrink-0" aria-hidden>
                  <WarningTriangleIcon />
                </span>
                <div>
                  <h1 className="font-semibold text-slate-900 dark:text-zinc-100">Red Warning Lights – Trainer</h1>
                  <p className="text-sm text-slate-600 dark:text-zinc-300 mt-0.5">Select the number of random red lights and press <b>Start</b>.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pl-11">
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
                <div className="text-sm text-slate-600 dark:text-zinc-300 pl-11">
                  No red lights found for the selected model.
                </div>
              )}
            </section>

            {CWP_TRAINER_LINKS[activeVariant.id] && (
              <LightsBar
                tone="slate"
                icon={<CwpPanelIcon />}
                title="CWP-trainer"
                description={`${CWP_TRAINER_LINKS[activeVariant.id].label} warning panel — tap to train by pressing lights.`}
                href={CWP_TRAINER_LINKS[activeVariant.id].href}
              />
            )}

            {activeVariant.id === "AW189" && (
              <LightsBar
                tone="slate"
                title={`Memory items – Trainer (${activeVariant.id})`}
                description="Train only on memory items from the QRH for red lights."
                actionLabel={loading ? "Loading…" : `Start (${memoryCount})`}
                onClick={startMemoryOnly}
                disabled={loading || memoryCount === 0}
              />
            )}
			          </div>
			        )}

			        {mode === "idle" && activeVariant.id === "AW139" && (
			          <div className="space-y-4">
			            <LightsBar
			              tone="red"
			              icon={<WarningTriangleIcon />}
			              title="Red Warning Lights  Trainer"
			              description="Practice all red warning lights in random order. Tap to start."
			              actionLabel={
			                loading ? "Loading" : warningLights.length ? `Start (${warningLights.length} lights)` : "No red lights"
			              }
			              onClick={() => start("warning")}
			              disabled={loading || !warningLights.length}
			            />
			
			            <LightsBar
			              tone="slate"
			              icon={<CwpPanelIcon />}
			              title="CWP-trainer"
			              description="AW139 warning panel  tap to train by pressing lights."
			              href="/training/lights/cwp/aw139"
			            />
			          </div>
			        )}
		
			        {mode === "idle" && isAw169 && (
	          <div className="space-y-4">
	            <LightsBar
		              tone="red"
		              icon={<WarningTriangleIcon />}
	              title="Red Warning Lights  Trainer"
	              description="Practice all red warning lights in random order. Tap to start."
	              actionLabel={
	                loading ? "Loading" : warningLights.length ? `Start (${warningLights.length} lights)` : "No red lights"
	              }
	              onClick={() => start("warning")}
	              disabled={loading || !warningLights.length}
	            />

	            <LightsBar
	              tone="slate"
	              icon={<CwpPanelIcon />}
	              title="CWP-trainer"
	              description="AW169 warning panel  tap to train by pressing lights."
	              href="/training/lights/cwp/aw169"
	            />

		            <>
		              <LightsBar
		                tone="slate"
		                title="Memory items – Trainer (AW169)"
		                description="Train only on QRH memory items. Tap to choose red or amber items."
		                onClick={() => setShowMemoryMenu((prev) => !prev)}
		              />
		              {showMemoryMenu && (
		                <div className="space-y-3 pl-3 border-l border-slate-200 dark:border-zinc-700">
		                  {/* RED: random trainer */}
		                  <LightsBar
		                    tone="red"
		                    title="Red memory items"
		                    description="QRH memory items for red warning lights."
		                    actionLabel={
		                      loading
		                        ? "Loading…"
		                        : memoryCount
		                        ? `Start (${memoryCount} items)`
		                        : "No red memory items"
		                    }
		                    onClick={startMemoryOnly}
		                    disabled={loading || memoryCount === 0}
		                  />
		                  {/* RED: per-item browse (CWP-style grid) */}
		                  <LightsBar
		                    tone="red"
		                    title="Red memory items"
		                    description="Browse red QRH memory items one by one."
		                    actionLabel={
		                      loading
		                        ? "Loading…"
		                        : memoryCount
		                        ? "Browse"
		                        : "No red memory items"
		                    }
		                    onClick={() => setMemoryGridSeverity("warning")}
		                    disabled={loading || memoryCount === 0}
		                  />
		                  {/* AMBER: random trainer */}
		                  <LightsBar
		                    tone="amber"
		                    title="Amber (yellow) memory items"
		                    description="QRH memory items for amber caution lights."
		                    actionLabel={
		                      loading
		                        ? "Loading…"
		                        : amberMemoryCount
		                        ? `Start (${amberMemoryCount} items)`
		                        : "No amber memory items"
		                    }
		                    onClick={startAmberMemoryOnly}
		                    disabled={loading || amberMemoryCount === 0}
		                  />
		                  {/* AMBER: per-item browse (CWP-style grid) */}
		                  <LightsBar
		                    tone="amber"
		                    title="Amber (yellow) memory items"
		                    description="Browse amber QRH memory items one by one."
		                    actionLabel={
		                      loading
		                        ? "Loading…"
		                        : amberMemoryCount
		                        ? "Browse"
		                        : "No amber memory items"
		                    }
		                    onClick={() => setMemoryGridSeverity("caution")}
		                    disabled={loading || amberMemoryCount === 0}
		                  />
		                  {memoryGridSeverity && (
		                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
		                      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border bg-white p-4 shadow-lg dark:bg-zinc-900 dark:border-zinc-700">
		                        <div className="flex items-center justify-between mb-3">
		                          <div className="flex items-center gap-2">
		                            <span
		                              className={`inline-block h-2.5 w-2.5 rounded-full ${
		                                memoryGridSeverity === "warning" ? "bg-red-600" : "bg-amber-500"
		                              }`}
		                              aria-hidden
		                            />
		                            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
		                              {memoryGridSeverity === "warning"
		                                ? "Select a red memory item"
		                                : "Select an amber (yellow) memory item"}
		                            </h3>
		                          </div>
		                          <button
		                            type="button"
		                            onClick={() => setMemoryGridSeverity(null)}
		                            className="text-xs text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 underline"
		                          >
		                            Close
		                          </button>
		                        </div>
		                        {(() => {
		                          const items =
		                            memoryGridSeverity === "warning"
		                              ? aw169RedMemoryLights
		                              : aw169AmberMemoryLights;
		                          if (!items.length) {
		                            return (
		                              <p className="text-xs text-slate-600 dark:text-zinc-300">
		                                {memoryGridSeverity === "warning"
		                                  ? "No red memory items available yet."
		                                  : "No amber memory items available yet."}
		                              </p>
		                            );
		                          }
		                          return (
		                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
		                              {items.map((item) => (
		                                <button
		                                  key={item.id}
		                                  type="button"
		                                  onClick={() => openMemoryItem(item)}
		                                  className={`relative select-none rounded-md sm:rounded-lg flex items-center justify-center text-center font-semibold tracking-wide h-20 sm:h-20 md:h-24 overflow-hidden ${
		                                    memoryGridSeverity === "warning"
		                                      ? "bg-neutral-900 ring-1 ring-white/10 text-red-600 dark:text-red-200 [text-shadow:0_0_12px_rgba(255,85,85,0.6)]"
		                                      : "bg-neutral-900 ring-1 ring-white/10 text-amber-400 dark:text-amber-200 [text-shadow:0_0_12px_rgba(251,191,36,0.6)]"
		                                  } cursor-pointer hover:opacity-95 active:opacity-90`}
		                                  aria-label={displayName(item)}
		                                  title={displayName(item)}
		                                >
		                                  <span className="px-1 leading-tight whitespace-pre-line break-words text-[11px] sm:text-[12px] md:text-sm">
		                                    {displayName(item).toUpperCase()}
		                                  </span>
		                                </button>
		                              ))}
		                            </div>
		                          );
		                        })()}
		                      </div>
		                    </div>
		                  )}
		                </div>
		              )}
		            </>
	          </div>
	        )}
        {mode === "light" && current && (
          <div className="space-y-5">
            <button
              onClick={reveal}
              className={`w-full rounded-2xl border-l-4 ${
                current.severity === "warning" ? "border-red-600 dark:border-red-500" : "border-amber-500 dark:border-amber-400"
              } bg-white dark:bg-zinc-800 shadow-sm p-6 text-left transition hover:shadow-md`}
              aria-label={memoryOnly ? "Click to show memory items" : "Click to show procedure"}
              title="Click to show procedure"
            >
              <div className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">{memoryOnly ? "Tap to show memory items" : "Tap to show procedure"}</div>
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
                <div className="flex items-center gap-4">
                  {current.icon && (
                    <Image
                      src={current.icon}
                      alt={displayName(current)}
                      width={56}
                      height={56}
                      className="h-14 w-14 object-contain rounded-md bg-slate-100 dark:bg-zinc-900/60"
                      unoptimized
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-lg md:text-xl font-semibold text-slate-900 dark:text-zinc-100">{displayName(current)}</div>
                    {!memoryOnly && current.description && <div className="opacity-80 mt-0.5 text-slate-600 dark:text-zinc-300">{renderText(current.description)}</div>}
                  </div>
                </div>
              )}
            </button>
            <div className="flex items-center justify-between">
              <button onClick={prev} disabled={!canPrev} className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:shadow-none disabled:hover:bg-white dark:disabled:hover:bg-zinc-800">
                <span aria-hidden>‹</span> Previous
              </button>
              <div className="text-xs opacity-50 dark:text-zinc-400">Enter/Space to reveal</div>
              <button disabled className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium bg-white dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 shadow-sm opacity-40">
                Next <span aria-hidden>›</span>
              </button>
            </div>
          </div>
        )}
        {mode === "procedure" && current && compactCWP && (
          <div
            ref={procOverlayRef}
            tabIndex={-1}
	            className="fixed left-0 right-0 bottom-0 top-0 z-40 bg-white dark:bg-zinc-900"
	          >
	            <button
	              type="button"
	              className="fixed right-3 top-3 z-50 rounded-lg bg-slate-900/90 px-3 py-2 text-sm font-semibold text-white shadow dark:bg-white/90 dark:text-slate-900"
	              onClick={() => {
              try {
                const before = window.location.pathname + window.location.search;
                router.back();
                setTimeout(() => {
                  try {
                    if (window.location.pathname + window.location.search === before) {
	                      const v = activeVariant?.id;
	                      if (isAw169) router.push('/training/lights/cwp/aw169');
                      else if (v === 'H125_AS350_B3_2B1') router.push('/training/lights/cwp/b3-2b1');
                      else router.push('/training/lights');
                    }
                  } catch {}
                }, 120);
              } catch {}
	              }}
	            >
	              Close procedure
	            </button>
            <div className="h-full w-full overflow-y-auto">
              <div className="px-0">
                <div className={`${!isMobile ? "max-w-3xl mx-auto my-6 px-4" : ""}`}>
                  <ProcedureLikePDF item={current} flat memoryOnly={memoryOnly} hideReferences />
                </div>
              </div>
            </div>
          </div>
        )}

        {isMobile && mode === "procedure" && current && !compactCWP && (
          <div ref={procOverlayRef} tabIndex={-1} className="fixed left-0 right-0 bottom-0 top-0 z-40 bg-white dark:bg-zinc-900">
            <div className="h-full w-full overflow-y-auto" onClick={(e) => { try { const t = e.target as HTMLElement; if (t && t.closest('a,button,input,textarea,select,[data-prevent-back]')) return; if (isAw169 && current?.severity === 'warning' && current?.pageImage) { next(); } } catch {} }}>
            {!(isAw169 && memoryOnly && current?.pageImage) && header}

              <div className="px-0">
                <ProcedureLikePDF item={current} flat memoryOnly={memoryOnly} />
              </div>
            </div>
		              <div className="fixed left-0 right-0 bottom-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-t border-slate-200 dark:border-zinc-700">
                <div className="max-w-none mx-auto p-4 flex items-center justify-between gap-8" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
                  <button onClick={prev} disabled={!canPrev} className="rounded-lg px-5 py-3 border text-base font-semibold hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700" aria-label="Prev light">
                    ← Prev
                  </button>
	                  <button onClick={toggleCurrentFlag} className={`rounded-lg px-5 py-3 border text-base font-semibold ${currentFlagged ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-800 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"}`} aria-label="Flag light" aria-pressed={currentFlagged}>
	                    {currentFlagged ? "Flagged" : "Flag"}
	                  </button>
                  <button onClick={next} disabled={!canNext} className="rounded-lg px-5 py-3 border bg-blue-600 text-white text-base font-semibold hover:bg-blue-500 active:bg-blue-600 disabled:opacity-40" aria-label="Next light">
                    Next →
                  </button>
                </div>
              </div>
          </div>
        )
        }

        {!isMobile && mode === "procedure" && current && !compactCWP && (
          <div className="space-y-6">
            {!memoryOnly && current.description && !current.pageImage && (
              <div className="rounded-xl border bg-white dark:bg-blue-900/40 dark:text-zinc-100 dark:border-blue-400 p-4 text-[15px] md:text-[16px]">
                {renderText(current.description)}
              </div>
            )}
            {(memoryOnly && isAw169 && current?.pageImage) ? (
              <div role="button" aria-label="Next" onClick={next} className="cursor-pointer select-none">
                <ProcedureLikePDF item={current} memoryOnly />
              </div>
            ) : (
              <ProcedureLikePDF item={current} memoryOnly={memoryOnly} />
            )}
	              <div className="sticky bottom-0 bg-white/80 dark:bg-transparent backdrop-blur border-t dark:border-blue-400">
                <div className="max-w-3xl mx-auto p-4 flex items-center justify-between">
                  <button onClick={prev} disabled={!canPrev} className="rounded-lg px-4 py-2 border dark:text-zinc-100 dark:border-blue-400 disabled:opacity-40">Previous</button>
	                  <button onClick={toggleCurrentFlag} className={`rounded-lg px-4 py-2 border ${currentFlagged ? "bg-amber-500 text-white border-amber-500" : "dark:text-zinc-100 dark:border-blue-400"}`}>{currentFlagged ? "Flagged" : "Flag"}</button>
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
              onClick={restart}
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
