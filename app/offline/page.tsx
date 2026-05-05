"use client";
import { useEffect, useMemo, useState } from "react";
import AppTopBar from "@/components/AppTopBar";
import { saveSectionOffline, clearOfflineSection, listOffline } from "@/lib/offline";
import { loadAllQuestions } from "@/lib/loadAllQuestions";
import { useActiveModelVariant } from "@/lib/models/hooks";

type Section = { id: string; title: string };
type SectionPayload = { items: any[] };

const sectionFilePromiseCache = new Map<string, Promise<{ items?: any[] } | null>>();
const derivedSectionPayloadPromiseCache = new Map<string, Promise<SectionPayload>>();

const DEDICATED_OFFLINE_ROUTE_BY_SECTION_ID: Record<string, string> = {
  emergency_procedures: "/emergency-quiz",
  "engine-systems": "/engine-systems-quiz",
  avionics_fms_limitations: "/avionics-fms-limitations-quiz",
};

const AW169_LIGHTS_RELATED_SECTION_IDS = new Set(["emergency_procedures", "engine-systems"]);
const AW169_LIGHTS_ROUTE_PATHS = [
  "/training/lights",
  "/training/lights/cwp/aw169",
  "/aw169/procedures/single-engine",
  "/aw169/procedures/engine-shutdown-emergency",
  "/aw169/procedures/engine-re-light",
];
const AW169_LIGHTS_SEED_DATA_PATHS = [
  "/model-data/AW169/training/lights/manifest.json",
  "/model-data/AW169/training/lights.json",
  "/training/lights/manifest.json",
];

function normalizeOfflineAssetPath(path: string, baseDir: string) {
  if (path.startsWith("/")) return path;
  return `${baseDir}/${path.replace(/^\.?\//, "")}`;
}

function getSectionCacheKey(id: string, variantId: string) {
  return `${variantId}:${id}`;
}

function getOfflineLaunchHref(id: string) {
  return DEDICATED_OFFLINE_ROUTE_BY_SECTION_ID[id] || `/quiz/${encodeURIComponent(id)}`;
}

function getOfflineWarmPaths(id: string) {
  const genericHref = `/quiz/${encodeURIComponent(id)}`;
  const launchHref = getOfflineLaunchHref(id);

  return Array.from(new Set([
    genericHref,
    launchHref,
    ...(launchHref === genericHref ? [] : [`${launchHref}/1`, `${launchHref}/result`]),
  ]));
}

async function fetchSection(id: string, variantId: string): Promise<{ items?: any[] } | null> {
  const key = getSectionCacheKey(id, variantId);
  const existing = sectionFilePromiseCache.get(key);
  if (existing) return existing;

  const urls = [`/model-data/${variantId}/sections/${id}.json`, `/quiz-data/sections/${id}.json`];
  const promise = (async () => {
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const raw = await res.text();
        try {
          return JSON.parse(raw);
        } catch {
          const cleaned = raw.replace(/[\u0000-\u001F]/g, " ");
          return JSON.parse(cleaned);
        }
      } catch {}
    }
    return null;
  })();

  sectionFilePromiseCache.set(key, promise);
  return promise;
}

function buildDerivedSectionItems(id: string, items: any[]): any[] {
  const norm = (s: any) => String(s || "").toLowerCase();
  let filtered: any[] = [];
  if (id === "limitations") {
    filtered = items.filter((q: any) => norm(q.section).includes("limitation"));
  } else if (id === "avionics_fms_limitations") {
    const s = (q: any) => norm(q.section).replace(/[^a-z]/g, "");
    filtered = items.filter((q: any) => {
      const t = s(q);
      return t.includes("avionics") || t.includes("fms") || t.includes("avionicsfms");
    });
  } else if (id === "engine-systems") {
    const s = (q: any) => norm(q.section).replace(/[^a-z]/g, "");
    filtered = items.filter((q: any) => s(q).includes("engsyst"));
  } else if (id === "performance") {
    filtered = items.filter((q: any) => norm(q.section).includes("performance"));
  } else if (id === "procedures") {
    filtered = items.filter((q: any) => norm(q.section).includes("procedur"));
  }
  if (!filtered.length) {
    const toId = (v: any) => String(v || "").toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    const target = toId(id);
    filtered = items.filter((q: any) => {
      const candidates = [q.section, (q as any).sectionId, (q as any).sectionID]
        .filter(Boolean)
        .map(toId);
      return candidates.includes(target);
    });
  }
  return filtered;
}

async function deriveSectionPayload(id: string, variantId: string, allItems?: any[]): Promise<SectionPayload> {
  const key = getSectionCacheKey(id, variantId);
  const existing = derivedSectionPayloadPromiseCache.get(key);
  if (existing) return existing;

  const promise = Promise.resolve(allItems ?? loadAllQuestions(variantId))
    .then((items) => ({ items: buildDerivedSectionItems(id, items) }))
    .catch((error) => {
      derivedSectionPayloadPromiseCache.delete(key);
      throw error;
    });

  derivedSectionPayloadPromiseCache.set(key, promise);
  return promise;
}

async function resolveOfflineSectionPayload(
  id: string,
  variantId: string,
  options?: { allItems?: any[] | null; allowDerivedFallback?: boolean },
): Promise<SectionPayload | { items?: any[] } | null> {
  const data = await fetchSection(id, variantId);
  if (data && Array.isArray(data.items)) return data;

  if (!options?.allowDerivedFallback) return null;

  const built = await deriveSectionPayload(id, variantId, options?.allItems ?? undefined).catch(() => ({ items: [] }));
  return Array.isArray(built.items) && built.items.length > 0 ? built : null;
}

// sections are now resolved dynamically from index.json (model-level and global)

async function fetchAvailableSections(variantId: string, productId: string): Promise<Section[]> {
  // For H125/H125-derivater: bruk dynamiske seksjoner fra model-data eller quiz-data
  if (productId === "H125") {
    const urls = [`/model-data/${variantId}/index.json`, "/quiz-data/index.json"];
    const collected: Section[] = [];
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        const arr = Array.isArray(data.sections) ? (data.sections as Section[]) : [];
        collected.push(...arr);
      } catch {}
    }
    const seen = new Set<string>();
    const merged = collected.filter((s) => {
      if (!s || typeof s.id !== "string") return false;
      if (s.id === "all") return false;
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
    return merged;
  }
  // For all products: merge section list from model-specific and global index, and filter out "all"
  const urls = [`/model-data/${variantId}/index.json`, "/quiz-data/index.json"];
  const collected: Section[] = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      const arr = Array.isArray(data.sections) ? (data.sections as Section[]) : [];
      collected.push(...arr);
    } catch {}
  }
  const seen = new Set<string>();
  const merged = collected.filter((s) => {
    if (!s || typeof s.id !== "string") return false;
    if (s.id === "all") return false;
    if (productId === "AW169" && (s.id === "afm" || s.id === "qrh")) return false; // skjul AFM/QRH for AW169
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
  return merged;
}

export default function OfflinePage() {
  const [status, setStatus] = useState<Record<string, string>>({});
  const [sections, setSections] = useState<Section[]>([]);
  const [offlineIds, setOfflineIds] = useState<string[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [sectionsError, setSectionsError] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [allQuestions, setAllQuestions] = useState<any[] | null>(null);
  // Gating midlertidig deaktivert – alltid tilgang til offline
  const { variant: activeVariant, loading: variantLoading } = useActiveModelVariant();

  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });



  useEffect(() => {
    if (variantLoading) return;
    try {
      setOfflineIds(listOffline(activeVariant.id));
    } catch {
      setOfflineIds([]);
    }
  }, [activeVariant.id, variantLoading]);

  // Preload the full question bank once per variant so we can cheaply derive
  // synthetic sections (limitations, performance, etc.) without reloading
  // everything for each section.
  useEffect(() => {
    if (variantLoading) return;
    let cancelled = false;
    (async () => {
      try {
        const items = await loadAllQuestions(activeVariant.id);
        if (!cancelled) setAllQuestions(items);
      } catch {
        if (!cancelled) setAllQuestions(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeVariant.id, variantLoading]);

  useEffect(() => {
    if (variantLoading) return;
    let mounted = true;
    setLoadingSections(true);
    fetchAvailableSections(activeVariant.id, activeVariant.productId)
      .then((items) => {
        if (!mounted) return;
        setSections(items);
      })
      .catch(() => {
        if (!mounted) return;
	        setSectionsError("Could not load available sections.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingSections(false);
      });
    return () => {
      mounted = false;
    };
  }, [activeVariant.id, variantLoading]);


  // After sections are loaded: fetch question count per section (automatic and model-specific)
  useEffect(() => {
    if (variantLoading) return;
    if (!sections.length) {
      setCounts({});
      return;
    }
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        sections.map(async (s) => {
          try {
            const data = await resolveOfflineSectionPayload(
              s.id,
              activeVariant.id,
              {
                allItems: allQuestions,
                // Uten forhåndslastet question bank hopper vi over dyr fallback og
                // viser 0 inntil allQuestions er klar.
                allowDerivedFallback: Boolean(allQuestions),
              },
            );
            return [s.id, Array.isArray(data?.items) ? data.items.length : 0] as const;
          } catch {
            return [s.id, 0] as const;
          }
        }),
      );
      if (!cancelled) setCounts(Object.fromEntries(entries));
    })();
    return () => {
      cancelled = true;
    };
  }, [sections, activeVariant.id, variantLoading, allQuestions]);

  const availableIdSet = useMemo(() => new Set(sections.map((s) => s.id)), [sections]);
  const otherOfflineIds = useMemo(
    () => offlineIds.filter((id) => !availableIdSet.has(id)),
    [offlineIds, availableIdSet]
  );

  const titleById = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of sections) m.set(s.id, s.title);
    return m;
  }, [sections]);


  function refreshOfflineIds() {
    setOfflineIds(listOffline(activeVariant.id));
  }

  function updateStatus(id: string, message: string) {
    setStatus((prev) => ({ ...prev, [id]: message }));
  }

  async function fetchJsonNoStore(url: string) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function prefetchHtmlRoutes(paths: string[]) {
    for (const path of Array.from(new Set(paths))) {
      try {
        await fetch(path, {
          cache: "no-store",
          headers: { Accept: "text/html" },
        });
      } catch {}
    }
  }

  async function prefetchAw169LightsAssets() {
    if (activeVariant.id !== "AW169") return;

    const jsonUrls = new Set<string>(AW169_LIGHTS_SEED_DATA_PATHS);
    const seedUrls = new Set<string>(AW169_LIGHTS_SEED_DATA_PATHS);
    const lightEntries: any[] = [];

    for (const url of AW169_LIGHTS_SEED_DATA_PATHS) {
      const data = await fetchJsonNoStore(url);
      if (Array.isArray((data as any)?.files)) {
        const baseDir = url.startsWith("/model-data/")
          ? `/model-data/${activeVariant.id}/training/lights`
          : "/training/lights";
        for (const file of (data as any).files as string[]) {
          jsonUrls.add(normalizeOfflineAssetPath(file, baseDir));
        }
        continue;
      }

      if (!Array.isArray(data)) continue;

      if (data.every((entry) => typeof entry === "string")) {
        const baseDir = url.startsWith("/model-data/")
          ? `/model-data/${activeVariant.id}/training/lights`
          : "/training/lights";
        for (const file of data as string[]) {
          jsonUrls.add(normalizeOfflineAssetPath(file, baseDir));
        }
        continue;
      }

      lightEntries.push(...data.filter((entry) => entry && typeof entry === "object"));
    }

    for (const url of Array.from(jsonUrls)) {
      if (seedUrls.has(url)) continue;
      const data = await fetchJsonNoStore(url);
      if (Array.isArray(data)) {
        lightEntries.push(...data.filter((entry) => entry && typeof entry === "object"));
      }
    }

    const assetUrls = new Set<string>();
    for (const entry of lightEntries) {
      if (typeof entry?.pageImage === "string") {
        assetUrls.add(entry.pageImage);
      }
    }

    await Promise.all(
      [...jsonUrls, ...assetUrls].map((url) => fetch(url, { cache: "no-store" }).catch(() => {}))
    );
  }

  async function prefetchAw169LightsOfflinePackage() {
    await prefetchAw169LightsAssets();
    await prefetchHtmlRoutes(AW169_LIGHTS_ROUTE_PATHS);
  }

  async function downloadSectionOffline(section: Section, options?: { prefetchRoutes?: boolean }) {
	    updateStatus(section.id, `Downloading "${section.title}"…`);
    try {
      const data = await resolveOfflineSectionPayload(section.id, activeVariant.id, {
        allItems: allQuestions,
        allowDerivedFallback: true,
      });

	      if (!data) throw new Error("No offline data available for the selected section.");

      const saved = saveSectionOffline(section.id, data, activeVariant.id);
	      if (!saved) throw new Error("Could not save offline data. Check device storage or private browsing mode.");
      if (options?.prefetchRoutes !== false) {
        await prefetchOfflineRoutes([section.id]);
      }
      refreshOfflineIds();
	      updateStatus(section.id, `✓ "${section.title}" saved for offline use`);
    } catch (error) {
	      console.warn("Could not download section offline", section.id, error);
      updateStatus(section.id, "❌ Failed to download");
    }
  }

  function clearSectionOffline(section: Section) {
    clearOfflineSection(section.id, activeVariant.id);
    refreshOfflineIds();
	    updateStatus(section.id, "Removed local offline data");
  }

  async function prefetchAllQuestionsAssets() {
    try {
	      // Kuraterte all-questions-banker er i praksis AW169-spesifikke. For
	      // andre modeller vil de uansett bli filtrert bort, så vi dropper å
	      // laste dem for å spare båndbredde og parsing.
	      if (activeVariant.productId === "AW169") {
	        const r = await fetch('/quiz-data/all-questions/manifest.json', { cache: 'no-store' });
	        if (r.ok) {
	          const arr = await r.json();
	          if (Array.isArray(arr)) {
	            await Promise.all(
	              arr.map((f) => fetch(`/quiz-data/all-questions/${f}`, { cache: 'no-store' }).catch(() => {}))
	            );
	          }
	        }
	      }
      // Priming index files helps future navigation offline
      await fetch(`/model-data/${activeVariant.id}/index.json`, { cache: 'no-store' }).catch(() => {});
      await fetch('/quiz-data/index.json', { cache: 'no-store' }).catch(() => {});
    } catch {}
  }

  // Hent og cache rutene som trengs for å starte og bruke quiz offline.
  async function prefetchOfflineRoutes(ids: string[]) {
    const paths = Array.from(new Set(ids.flatMap((id) => getOfflineWarmPaths(id))));
    await prefetchHtmlRoutes(paths);

    if (activeVariant.id === "AW169" && ids.some((id) => AW169_LIGHTS_RELATED_SECTION_IDS.has(id))) {
      await prefetchAw169LightsOfflinePackage();
    }
  }

  async function downloadAllSections() {
    if (!sections.length) return;
    setDownloadingAll(true);
    setDownloadProgress({ done: 0, total: sections.length });
    for (const s of sections) {
      await downloadSectionOffline(s, { prefetchRoutes: false });
      setDownloadProgress((p) => ({ done: Math.min(p.done + 1, p.total), total: p.total }));
    }
    await prefetchAllQuestionsAssets().catch(() => {});
    await prefetchOfflineRoutes(sections.map((s) => s.id)).catch(() => {});
    setDownloadingAll(false);
  }

  const readyForActions = true;
  const showContent = true;

  return (
    <>
    <AppTopBar title="Offline packages" backHref="/" backLabel="Home" />
    <div className="max-w-2xl mx-auto p-6 space-y-8 text-slate-900 dark:text-zinc-100">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold dark:text-zinc-100">Offline packages</h1>
        <p className="text-sm text-slate-600 dark:text-zinc-300">Download quiz sections and supporting pages for use without network coverage.</p>
      </header>
	      <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-slate-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-zinc-200">
	        <div className="font-semibold text-slate-900 dark:text-zinc-100">Selected aircraft: {activeVariant.label}</div>
	        <p className="mt-1">Offline packages are stored per aircraft. Download the packages you need before leaving network coverage.</p>
	      </section>
      {showContent && (
        <>
          <section className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	              <h2 className="font-semibold text-slate-900 dark:text-zinc-100">Available packages</h2>
              <button
                onClick={downloadAllSections}
                disabled={loadingSections || sections.length === 0 || downloadingAll}
                className="min-h-10 rounded-lg bg-[#2E6EA1] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloadingAll ? `Downloading… ${downloadProgress.done}/${downloadProgress.total}` : "Download all for this aircraft"}
              </button>
            </div>
            {loadingSections ? (
              <p className="text-sm text-slate-600 dark:text-zinc-300">Loading sections…</p>
            ) : sectionsError ? (
              <p className="text-sm text-red-600 dark:text-red-400">{sectionsError}</p>
            ) : sections.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-zinc-300">No sections available for offline storage.</p>
            ) : (
              <ul className="space-y-4">
                {sections.map((section) => {
                  const stored = offlineIds.includes(section.id);
                  return (
                    <li key={section.id} className="rounded-lg border border-slate-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-zinc-100">{section.title}</p>
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">{section.id}</p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{typeof counts[section.id] === "number" ? `${counts[section.id]} questions` : ""}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => downloadSectionOffline(section)}
                            disabled={!readyForActions}
	                            className="min-h-11 rounded-lg bg-[#2E6EA1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24577f] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                          >
	                            {stored ? "Update" : "Download"}
                          </button>
                          {stored && (
                            <button
                              onClick={() => clearSectionOffline(section)}
                              disabled={!readyForActions}
	                              className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            >
	                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-zinc-300">
	                        {stored ? "Stored locally" : "Not stored"}
                        {status[section.id] && <span className="block mt-1">{status[section.id]}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 mt-6 space-y-3">
		            <h2 className="font-semibold">Downloaded packages</h2>
            {offlineIds.length === 0 ? (
	              <p className="text-sm text-slate-600 dark:text-zinc-300">No offline packages downloaded yet.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offlineIds.map((id) => {
                  const fallback = id.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
                  const title = titleById.get(id) || fallback;
                  const launchHref = getOfflineLaunchHref(id);
                  return (
                    <li key={id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-zinc-700 p-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-zinc-100">{title}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">{id}</p>
                      </div>
                      <a
                        href={launchHref}
	                        className="inline-flex min-h-11 items-center rounded-lg bg-[#2E6EA1] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#24577f] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
		                        title="Start quiz for this package"
                      >
		                        Start
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {otherOfflineIds.length > 0 && (
              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800">
	                <h3 className="font-medium text-sm mb-2">Other offline sections not in the available list</h3>
                <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-zinc-200">
                  {otherOfflineIds.map((id) => (
                    <li key={id}>{id}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </>
      )}
    </div>
    </>
  );
}
