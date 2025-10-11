"use client";
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/BackButton";
import { saveSectionOffline, clearOfflineSection, listOffline, loadSectionOffline } from "@/lib/offline";
import { loadAllQuestions } from "@/lib/loadAllQuestions";
import { useActiveModelVariant } from "@/lib/models/hooks";

type Section = { id: string; title: string };

async function fetchSection(id: string, variantId: string) {
  const urls = [`/model-data/${variantId}/sections/${id}.json`, `/quiz-data/sections/${id}.json`];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
  }
  throw new Error("Could not fetch section");
}

async function deriveSectionPayload(id: string, variantId: string) {
  // Faller tilbake til å bygge et kapittel fra spørsmålsbanken når fil ikke finnes
  const items = await loadAllQuestions(variantId);
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
  // Generisk fallback: match på normalisert seksjons-ID (f.eks. "normal_procedures")
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
  return { items: filtered };
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
  // For alle produkter: slå sammen seksjonsliste fra modellspesifikk og global index, og filtrer bort "all"
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
  // AW169: legg til kapitler som finnes i quiz-menyen slik at de kan lastes ned offline (uten AFM/QRH)
  if (productId === "AW169") {
    const aw169: Section[] = [
      { id: "limitations", title: "Limitations" },
      { id: "avionics_fms_limitations", title: "Avionics & FMS Limitations" },
      { id: "engine-systems", title: "Engine Systems" },
      { id: "emergency_procedures", title: "Emergency Procedures" },
      { id: "normal_procedures", title: "Normal Procedures" },
      // { id: "performance", title: "Performance" }, // legg til når vi har spørsmål
    ];
    collected.push(...aw169);
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
  // Gating midlertidig deaktivert – alltid tilgang til offline
  const { variant: activeVariant, loading: variantLoading } = useActiveModelVariant();


  useEffect(() => {
    if (variantLoading) return;
    try {
      setOfflineIds(listOffline(activeVariant.id));
    } catch {
      setOfflineIds([]);
    }
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
        setSectionsError("Kunne ikke laste tilgjengelige seksjoner");
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingSections(false);
      });
    return () => {
      mounted = false;
    };
  }, [activeVariant.id, variantLoading]);


  // Etter at seksjoner er lastet: hent antall spørsmål per seksjon (automatisk og modell-spesifikt)
  useEffect(() => {
    if (variantLoading) return;
    if (!sections.length) { setCounts({}); return; }
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(sections.map(async (s) => {
        try {
          const data = await fetchSection(s.id, activeVariant.id).catch(() => null);
          if (data && Array.isArray(data.items)) return [s.id, data.items.length] as const;
          const built = await deriveSectionPayload(s.id, activeVariant.id).catch(() => ({ items: [] }));
          return [s.id, Array.isArray(built.items) ? built.items.length : 0] as const;
        } catch { return [s.id, 0] as const; }
      }));
      if (!cancelled) setCounts(Object.fromEntries(entries));
    })();
    return () => { cancelled = true; };
  }, [sections, activeVariant.id, variantLoading]);

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

  async function downloadSectionOffline(section: Section) {
    updateStatus(section.id, `Laster ned "${section.title}"…`);
    try {
      // 1) Forsøk å hente standard seksjonsfil (modell- eller global)
      let data: any | null = null;
      try {
        data = await fetchSection(section.id, activeVariant.id);
      } catch {}

      // 2) Fallback for AW169 og andre kapitler uten egen seksjonsfil: bygg fra spørsmålsbanken
      if (!data) {
        const built = await deriveSectionPayload(section.id, activeVariant.id);
        if (Array.isArray(built.items) && built.items.length > 0) {
          data = built;
        }
      }

      if (!data) throw new Error("Ingen data for valgt kapittel");

      saveSectionOffline(section.id, data, activeVariant.id);
      refreshOfflineIds();
      updateStatus(section.id, `✓ "${section.title}" lagret for offline bruk`);
    } catch (error) {
      console.warn("Kunne ikke laste ned seksjon offline", section.id, error);
      updateStatus(section.id, "❌ Klarte ikke å laste ned");
    }
  }

  function clearSectionOffline(section: Section) {
    clearOfflineSection(section.id, activeVariant.id);
    refreshOfflineIds();
    updateStatus(section.id, "Slettet lokale offline-data");
  }

  const readyForActions = true;
  const showContent = true;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 text-slate-900 dark:text-zinc-100">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4 dark:text-zinc-100">Offline pakker</h1>
      {showContent && (
        <>
          <section className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-zinc-100">Tilgjengelige seksjoner</h2>
            {loadingSections ? (
              <p className="text-sm text-slate-600 dark:text-zinc-300">Laster seksjoner…</p>
            ) : sectionsError ? (
              <p className="text-sm text-red-600 dark:text-red-400">{sectionsError}</p>
            ) : sections.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-zinc-300">Ingen seksjoner tilgjengelig for offline lagring.</p>
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
                            className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:bg-blue-400/60 dark:bg-blue-500 dark:hover:bg-blue-600"
                          >
                            {stored ? "Oppdater" : "Last ned"}
                          </button>
                          {stored && (
                            <button
                              onClick={() => clearSectionOffline(section)}
                              disabled={!readyForActions}
                              className="rounded bg-gray-200 text-gray-800 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-800 dark:text-zinc-100"
                            >
                              Fjern
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-zinc-300">
                        {stored ? "Lagret lokalt" : "Ikke lagret"}
                        {status[section.id] && <span className="block mt-1">{status[section.id]}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 mt-6 space-y-3">
            <h2 className="font-semibold">Nedlastede kapitler</h2>
            {offlineIds.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-zinc-300">Ingen kapitler lastet ned ennå.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offlineIds.map((id) => {
                  const fallback = id.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
                  const title = titleById.get(id) || fallback;
                  return (
                    <li key={id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-zinc-700 p-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-zinc-100">{title}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">{id}</p>
                      </div>
                      <a
                        href={`/quiz/${encodeURIComponent(id)}`}
                        className="inline-flex items-center rounded bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        title="Start quiz for dette kapittelet"
                      >
                        Velg antall
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {otherOfflineIds.length > 0 && (
              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800">
                <h3 className="font-medium text-sm mb-2">Andre offline-seksjoner (ikke i listen over tilgjengelige)</h3>
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
  );
}
