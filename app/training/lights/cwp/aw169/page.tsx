"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import AppTopBar from "@/components/AppTopBar";
import { useActiveModelVariant } from "@/lib/models/hooks";

const VARIANT_ID = "AW169" as const;

type Severity = "warning" | "caution";

type LightItem = {
  id: string;
  name: string;
  severity: Severity;
  system?: string;
  description?: string;
  modelIds?: string[];
  models?: string[];
  productIds?: string[];
  productId?: string;
  modelId?: string;
};

function displayName(item: LightItem): string {
  if (item.id.endsWith("-flight")) return `${item.name} (in flight)`;
  if (item.id.endsWith("-ground")) return `${item.name} (on ground)`;
  return item.name;
}

function twoLineLabel(item: LightItem): string {
  const id = item.id;
  if (id === "eng-drive-shaft-failure") return "ENGINE DRIVE SHAFT\nFAILURE";
  if (id.endsWith("-flight")) return `${item.name}\n(IN FLIGHT)`;
  if (id.endsWith("-ground")) return `${item.name}\n(ON GROUND)`;
  const name = displayName(item);
  const words = name.split(" ");
  if (words.length >= 3) {
    const mid = Math.ceil(words.length / 2);
    return words.slice(0, mid).join(" ") + "\n" + words.slice(mid).join(" ");
  }
  return name;
}

export default function Page() {
  const router = useRouter();
  const { variant: activeVariant, setActiveVariant } = useActiveModelVariant();
  const [all, setAll] = useState<LightItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Ensure an AW169-family variant is active when landing directly on this
  // page (e.g. from a different product's context) — but don't clobber an
  // EP pilot's stored preference back to Standard. CWP light content here
  // is identical between AW169 and AW169 EP and served from this one route
  // regardless of which is active, so only correct a genuine mismatch.
  useEffect(() => {
    if (activeVariant.productId !== "AW169") {
      try { setActiveVariant(VARIANT_ID); } catch {}
    }
  }, [activeVariant.productId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const manifests: string[] = [
          `/model-data/${VARIANT_ID}/training/lights/manifest.json`,
          `/model-data/${VARIANT_ID}/training/lights.json`,
          `/training/lights/manifest.json`,
        ];

        let files: string[] = [];
        for (const url of manifests) {
          try {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) continue;
            const data = await res.json();
            if (Array.isArray((data as any)?.files)) { files = (data as any).files; break; }
            if (Array.isArray(data)) { files = data as any; break; }
          } catch {}
        }
        if (!files.length) files = ["/training/lights/all-lights.json"]; // best-effort fallback

        const arrays = await Promise.allSettled(
          files.map((path) => {
            const finalPath = path.startsWith("/") ? path : `/model-data/${VARIANT_ID}/training/lights/${path}`;
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

          if (modelIds && (modelIds.includes(VARIANT_ID) || modelIds.includes("AW169"))) return true;
          if (models && models.includes(VARIANT_ID)) return true;
          if (productIds && productIds.includes("AW169")) return true;
          if (typeof modelId === "string" && (modelId === VARIANT_ID || modelId === "AW169")) return true;
          if (typeof productId === "string" && productId === "AW169") return true;

          return true; // For non-H125 models we include by default
        });

        const warnings = filtered.filter((x) => x.severity === "warning");
        warnings.sort((a, b) => displayName(a).localeCompare(displayName(b)));
        if (!cancelled) setAll(warnings);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const gridCols = useMemo(() => {
    const n = all.length || 12;
    if (n <= 6) return 3;
    if (n <= 8) return 4;
    if (n <= 12) return 4;
    if (n <= 15) return 5;
    return 6;
  }, [all.length]);
  const gridClass = useMemo(() => (gridCols === 3
    ? "grid-cols-3"
    : gridCols === 4
    ? "grid-cols-4"
    : gridCols === 5
    ? "grid-cols-5"
    : "grid-cols-6"
  ), [gridCols]);
  const gridClassSm = useMemo(() => (gridCols === 3
    ? "sm:grid-cols-3"
    : gridCols === 4
    ? "sm:grid-cols-4"
    : gridCols === 5
    ? "sm:grid-cols-5"
    : "sm:grid-cols-6"
  ), [gridCols]);


  function handleLampClick(id?: string) {
    if (!id) return;
    // Use the actually-active variant (AW169 or AW169 EP), not the hardcoded
    // page constant — this route is shared by both since CWP light content
    // is identical, but hardcoding "AW169" here forced /training/lights to
    // silently revert an EP pilot back to Standard the moment they opened a
    // light's procedure, even though the CWP grid itself correctly stayed EP.
    const activeId = activeVariant.productId === "AW169" ? activeVariant.id : VARIANT_ID;
    try {
      sessionStorage.setItem(
        "lights:resume",
        JSON.stringify({ variantId: activeId, lightId: id, memoryOnly: false, deck: [id], idx: 0, lastSeverity: "warning" as Severity })
      );
    } catch {}
    router.push(`/training/lights?resume=1&v=${encodeURIComponent(activeId)}&light=${encodeURIComponent(id)}&mem=0&cwp=1`);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
	      <AppTopBar title="CWP Trainer · AW169" backHref="/training/lights" backLabel="Lights" />
      <main className="mx-auto max-w-5xl p-4 sm:p-6 space-y-4 sm:space-y-6">
        <section className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-700" aria-hidden />
              <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">CWP-trainer · AW169</h1>
            </div>
	            <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">Tap a light to train</div>
          </div>

          {/* Panel container */}
          <div className="mx-auto w-full" style={{ maxHeight: "calc(100dvh - 160px)" }}>
            <div
              className="mx-auto rounded-2xl shadow-inner ring-1 ring-white/10 p-3 sm:p-4"
              style={{ background: "linear-gradient(180deg,#16171d 0%,#22232a 100%)" }}
            >
              <div className={`grid grid-cols-2 ${gridClassSm} gap-2 sm:gap-3`}>
                {loading && (
                  <div className="col-span-full text-center py-10 text-slate-600 dark:text-zinc-300">Loading…</div>
                )}
                {!loading && all.map((item) => {
                  const clickable = !!item.id;
                  const classes = [
                    "relative select-none rounded-md sm:rounded-lg flex items-center justify-center text-center font-extrabold tracking-wide antialiased h-20 sm:h-20 md:h-24 overflow-hidden",
                    "bg-neutral-900 ring-1 ring-white/10 text-red-600 dark:text-red-200",
                    "[text-shadow:0_0_12px_rgba(255,85,85,0.6)]",
                    clickable ? "cursor-pointer hover:opacity-95 active:opacity-90" : "opacity-90 cursor-default",
                  ].join(" ");
                  return (
                    <div
                      key={item.id}
                      className={classes}
                      onClick={() => handleLampClick(item.id)}
	                      onKeyDown={(event) => {
	                        if (!clickable || (event.key !== "Enter" && event.key !== " ")) return;
	                        event.preventDefault();
	                        handleLampClick(item.id);
	                      }}
                      role={clickable ? "button" : undefined}
	                      tabIndex={clickable ? 0 : undefined}
                      aria-label={displayName(item)}
                      title={displayName(item)}
                    >
                      <span className="px-1 leading-tight whitespace-pre-line break-words text-[12px] sm:text-[13px] md:text-sm">
                        {twoLineLabel(item).toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

