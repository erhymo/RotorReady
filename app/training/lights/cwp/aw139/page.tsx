"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AppTopBar from "@/components/AppTopBar";
import { useActiveModelVariant } from "@/lib/models/hooks";

type Severity = "warning" | "caution";

type LightItem = {
  id: string;
  name: string;
  severity: Severity;
  pageImage?: string;
  modelIds?: string[];
};

const VARIANT_ID = "AW139" as const;

function displayName(item: LightItem): string {
  return item.name;
}

export default function Page() {
  const router = useRouter();
  const { variant: activeVariant, setActiveVariant } = useActiveModelVariant();
  const [all, setAll] = useState<LightItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeVariant.id !== VARIANT_ID) {
      try {
        setActiveVariant(VARIANT_ID);
      } catch {
        // ignore
      }
    }
  }, [activeVariant.id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const manifests = [
          `/model-data/${VARIANT_ID}/training/lights/manifest.json`,
          `/model-data/${VARIANT_ID}/training/lights.json`,
        ];

        let files: string[] = [];
        for (const url of manifests) {
          try {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) continue;
            const data = await res.json();
            if (Array.isArray((data as any)?.files)) {
              files = (data as any).files as string[];
              break;
            }
            if (Array.isArray(data)) {
              files = data as string[];
              break;
            }
          } catch {
            // ignore manifest errors, try next
          }
        }

        if (!files.length) {
          files = [];
        }

        const arrays = await Promise.allSettled(
          files.map((p) => {
            const finalPath = p.startsWith("/") ? p : `/model-data/${VARIANT_ID}/training/lights/${p}`;
            return fetch(finalPath, { cache: "no-store" }).then((res) => (res.ok ? res.json() : []));
          }),
        );

        const merged: LightItem[] = arrays.flatMap((result) =>
          result.status === "fulfilled" && Array.isArray(result.value) ? (result.value as LightItem[]) : [],
        );

        const warnings = merged.filter((x) => x.severity === "warning");
        warnings.sort((a, b) => displayName(a).localeCompare(displayName(b)));
        if (!cancelled) setAll(warnings);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleLampClick(id?: string) {
    if (!id) return;
    try {
      sessionStorage.setItem(
        "lights:resume",
        JSON.stringify({
          variantId: VARIANT_ID,
          lightId: id,
          memoryOnly: false,
          deck: [id],
          idx: 0,
          lastSeverity: "warning" as Severity,
        }),
      );
    } catch {
      // ignore
    }
    router.push(
      `/training/lights?resume=1&v=${encodeURIComponent(VARIANT_ID)}&light=${encodeURIComponent(id)}&mem=0&cwp=1`,
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
	      <AppTopBar title="CWP Trainer · AW139" backHref="/training/lights" backLabel="Lights" />
      <main className="mx-auto max-w-5xl p-4 sm:p-6 space-y-4 sm:space-y-6">
        <section className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-700" aria-hidden />
              <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">CWP-trainer · AW139</h1>
            </div>
	            <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">Tap a light to train</div>
          </div>

          <div className="mx-auto w-full" style={{ maxHeight: "calc(100dvh - 160px)" }}>
            <div
              className="mx-auto rounded-2xl shadow-inner ring-1 ring-white/10 p-3 sm:p-4"
              style={{ background: "linear-gradient(180deg,#16171d 0%,#22232a 100%)" }}
            >
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                {loading && (
                  <div className="col-span-full text-center py-10 text-slate-600 dark:text-zinc-300">Loading…</div>
                )}
                {!loading &&
                  all.map((item) => {
                    const classes = [
                      "relative select-none rounded-md sm:rounded-lg flex items-center justify-center text-center font-extrabold tracking-wide antialiased h-20 sm:h-20 md:h-24 overflow-hidden",
                      "bg-neutral-900 ring-1 ring-white/10 text-red-600 dark:text-red-200",
                      "[text-shadow:0_0_12px_rgba(255,85,85,0.6)]",
                      "cursor-pointer hover:opacity-95 active:opacity-90",
                    ].join(" ");
                    return (
                      <div
                        key={item.id}
                        className={classes}
                        onClick={() => handleLampClick(item.id)}
	                        onKeyDown={(event) => {
	                          if (event.key !== "Enter" && event.key !== " ") return;
	                          event.preventDefault();
	                          handleLampClick(item.id);
	                        }}
                        role="button"
	                        tabIndex={0}
                        aria-label={displayName(item)}
                        title={displayName(item)}
                      >
                        <span className="px-1 leading-tight whitespace-pre-line break-words text-[12px] sm:text-[13px] md:text-sm">
                          {displayName(item).toUpperCase()}
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

