import { getModelVariant } from "@/lib/models/catalog";
import { apiUrl, fetchContentJson } from "@/lib/contentUrl";

// Was a plain `fetch(url, { cache: "force-cache" })` — on the native app (no
// server.url; see capacitor.config.ts) a relative fetch resolves against the
// bundled local shell, not the live site, and force-cache then pinned whatever
// that first resolved to for the rest of the session. fetchContentJson is the
// same live-first-with-bundled-fallback resolution every other content fetch
// in the app already uses, so "All" quiz, per-section quiz banks, and the
// offline-package derivation that reuses this function all get fresh content
// the moment it's pushed, instead of only after the next native store build.
async function fetchJson<T = unknown>(url: string): Promise<T | null> {
  try {
    return await fetchContentJson<T>(url);
  } catch (error) {
    console.warn("Kunne ikke hente", url, error);
    return null;
  }
}

// Simple in-memory caches so expensive aggregations are only done once per
// variant during a session. This improves perceived speed when multiple views
// (Offline, quiz "All", section counts) all need the full question bank.
const allQuestionsPromiseCache = new Map<string, Promise<any[]>>();
const sectionQuestionsPromiseCache = new Map<string, Promise<any[]>>();
let blockedSetPromise: Promise<Set<string>> | null = null;

function normalizeSectionCandidate(value: unknown): string | null {
  if (value == null) return null;
  const normalized = String(value).trim().toLowerCase().replace(/\s+/g, "_");
  return normalized || null;
}

function matchesSectionId(
  item: { section?: unknown; sectionId?: unknown; sectionID?: unknown },
  normalizedSectionId: string,
) {
  const sectionCandidates = [item.section, item.sectionId, item.sectionID]
    .map(normalizeSectionCandidate)
    .filter((value): value is string => Boolean(value));
  return sectionCandidates.includes(normalizedSectionId);
}

function normalizeQuestionItem(q: any) {
  if (typeof q.answer === "string" && Array.isArray(q.options)) {
    const idx = q.options.findIndex((opt: string) => opt === q.answer);
    q.answer = idx >= 0 ? [idx] : [];
  }
  if (typeof q.answer === "number") q.answer = [q.answer];
  if (q.references != null && !Array.isArray(q.references)) {
    q.references = [String(q.references)];
  }
  return q;
}

async function fetchDirectModelSectionQuestions(
  sectionId: string,
  variantId?: string,
): Promise<any[] | null> {
  if (!variantId) return null;
  const sectionData = await fetchJson<{ items?: any[] }>(`/model-data/${variantId}/sections/${sectionId}.json`);
  if (!sectionData?.items || !Array.isArray(sectionData.items)) return null;

  return sectionData.items.map((item: any) => normalizeQuestionItem({
    ...item,
    sectionId: item.sectionId ?? sectionId,
    __file: `model-data/${variantId}/sections/${sectionId}.json`,
  }));
}

async function fetchBlockedSet(): Promise<Set<string>> {
  if (blockedSetPromise) return blockedSetPromise;
  blockedSetPromise = (async () => {
    try {
      const res = await fetch(apiUrl("/api/blocked-questions"), { cache: "no-store" });
      if (!res.ok) return new Set<string>();
      const data = await res.json();
      const ids: string[] = Array.isArray(data?.ids) ? data.ids : [];
      return new Set(ids);
    } catch {
      return new Set<string>();
    }
  })();

  try {
    return await blockedSetPromise;
  } catch (error) {
    // On failure, clear the cache so a later call can retry.
    console.warn("Kunne ikke hente blokkert-spørsmål-liste", error);
    blockedSetPromise = null;
    return new Set<string>();
  }
}

async function computeAllQuestions(variantId?: string): Promise<any[]> {
	const all: any[] = [];

		// Slå opp varianten én gang slik at vi både kan styre hvilke banker som
		// lastes inn (AW169 vs. andre produkter) og filtrere senere.
		const variant = variantId ? getModelVariant(variantId) : null;
		const productId = variant?.productId;
		const isAw139Variant = variantId === "AW139";

	// 1) Modell-spesifikke kapitler fra index.json for varianten
	if (variantId) {
		const index = await fetchJson<{ sections?: Array<{ id?: string; title?: string }> }>(
			`/model-data/${variantId}/index.json`,
		);
		if (index?.sections?.length) {
			for (const section of index.sections) {
				const sectionId = section?.id?.trim();
				if (!sectionId) continue;

				// Prøv modell-fil først
				let sectionData = await fetchJson<{ items?: any[] }>(
					`/model-data/${variantId}/sections/${sectionId}.json`,
				);
				let source: "model" | "global" | null = null;
				if (sectionData?.items && Array.isArray(sectionData.items)) {
					source = "model";
				} else {
					// Fallback: global seksjon for samme id
					sectionData = await fetchJson<{ items?: any[] }>(
						`/quiz-data/sections/${sectionId}.json`,
					);
					if (sectionData?.items && Array.isArray(sectionData.items)) source = "global";
				}
				if (!source) continue;

				const label = typeof section.title === "string" && section.title.trim() ? section.title : sectionId;
				const enriched = (sectionData!.items || []).map((item: any) => ({
					section: label,
					...item,
					sectionId: item.sectionId ?? sectionId,
					__file: source === "model"
						? `model-data/${variantId}/sections/${sectionId}.json`
						: `quiz-data/sections/${sectionId}.json`,
				}));
				all.push(...enriched);
			}
		}
	}

		// 1b) AW139: legg til generisk Air Law-bank fra global seksjon (EASA/ICAO)
		// når vi eksplisitt gjenbruker de samme Air Law-spørsmålene som AW169.
		if (isAw139Variant) {
			const sectionId = "air_law";
			const sectionData = await fetchJson<{ items?: any[] }>(
				`/quiz-data/sections/${sectionId}.json`,
			);
			if (sectionData?.items && Array.isArray(sectionData.items)) {
				const label = "AIR LAW";
				const enriched = (sectionData.items || []).map((item: any) => ({
					section: label,
					...item,
					sectionId: item.sectionId ?? sectionId,
					__file: `quiz-data/sections/${sectionId}.json`,
				}));
				all.push(...enriched);
			}
		}

		// 2) Kuraterte ekstra-banker fra manifest (legacy-tillegg).
		// AW169 har nå canonical section-filer, så den trenger ikke lenger å laste
		// hele manifestet bare for å vise ett kapittel. Manifestet beholdes for
		// uspesifisert/admin-bruk og eventuelle eldre AW169-produktvarianter.
	const shouldIncludeAllQuestionBanks = !variantId || (productId === "AW169" && variantId !== "AW169");
	if (shouldIncludeAllQuestionBanks) {
		const manifest = await fetchJson<string[]>("/quiz-data/all-questions/manifest.json");
		if (manifest?.length) {
			for (const file of manifest) {
				const data = await fetchJson<any[]>(`/quiz-data/all-questions/${file}`);
				if (!data || !Array.isArray(data)) continue;
				const withSource = data.map((item) => ({ ...item, __file: file }));
				all.push(...withSource);
			}
		}
	}

  // 3) Unik per id + normalisering
  const seen = new Set<string>();
  const filtered = all.filter((q) => {
    const id = q?.id;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  for (const q of filtered) normalizeQuestionItem(q);

		// 4) Variant-filtrering: tillat eksplisitt scoping; ellers default-allow for AW169 (legacy)
		let variantFiltered: any[] = filtered;
		if (variantId) {
			variantFiltered = filtered.filter((q) => {
				// Eksplisitt modell-liste
				if (Array.isArray(q.modelIds)) {
					if (q.modelIds.includes(variantId)) return true;
					// AW139 skal også kunne bruke de generiske Air Law-spørsmålene
					// fra den globale air_law-banken som opprinnelig var merket for AW169.
					if (
						isAw139Variant &&
						q.__file === "quiz-data/sections/air_law.json" &&
						q.modelIds.includes("AW169")
					) {
						return true;
					}
					return false;
				}
				// Eldre felter / produkt-scoping
				if (Array.isArray(q.models)) return q.models.includes(variantId);
				if (productId && Array.isArray(q.productIds)) return q.productIds.includes(productId);
				if (productId && typeof q.productId === "string") return q.productId === productId;
				// Ingen eksplisitt scoping: behold for AW169 (historisk innhold), ellers dropp
				return productId === "AW169";
			});
		}

  // 5) Soft-delete (blocklist)
  const blockedSet = await fetchBlockedSet();
  return variantFiltered.filter((q) => !blockedSet.has(q?.id));
}

export async function loadAllQuestions(variantId?: string): Promise<any[]> {
  const key = variantId || "__all__";
  const existing = allQuestionsPromiseCache.get(key);
  if (existing) return existing;

  const promise = computeAllQuestions(variantId).catch((error) => {
    // If the aggregation fails, don't keep a rejected promise cached.
    allQuestionsPromiseCache.delete(key);
    throw error;
  });

  allQuestionsPromiseCache.set(key, promise);
  return promise;
}

export async function loadQuestionsForSectionId<T = any>(
  sectionId: string,
  variantId?: string,
): Promise<T[]> {
  const normalizedSectionId = normalizeSectionCandidate(sectionId);
  if (!normalizedSectionId) return [];

  const key = `${variantId || "__all__"}:${normalizedSectionId}`;
  const existing = sectionQuestionsPromiseCache.get(key);
  if (existing) return existing as Promise<T[]>;

  const promise = fetchDirectModelSectionQuestions(normalizedSectionId, variantId)
    .then(async (directItems) => {
      if (directItems?.length) {
        const blockedSet = await fetchBlockedSet();
        return directItems.filter((q) => !blockedSet.has(q?.id)) as T[];
      }
      return loadAllQuestions(variantId)
        .then((items) => items.filter((item) => matchesSectionId(item, normalizedSectionId)) as T[]);
    })
    .catch((error) => {
      sectionQuestionsPromiseCache.delete(key);
      throw error;
    });

  sectionQuestionsPromiseCache.set(key, promise);
  return promise;
}
