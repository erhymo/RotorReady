import { getModelVariant } from "@/lib/models/catalog";

async function fetchJson<T = unknown>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("Kunne ikke hente", url, error);
    return null;
  }
}

async function fetchBlockedSet(): Promise<Set<string>> {
  try {
    const res = await fetch("/api/blocked-questions", { cache: "no-store" });
    if (!res.ok) return new Set();
    const data = await res.json();
    const ids: string[] = Array.isArray(data?.ids) ? data.ids : [];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

export async function loadAllQuestions(variantId?: string): Promise<any[]> {
  const all: any[] = [];

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

  // 2) Kuraterte ekstra-banker fra manifest (valgfritt tillegg)
  const manifest = await fetchJson<string[]>("/quiz-data/all-questions/manifest.json");
  if (manifest?.length) {
    for (const file of manifest) {
      const data = await fetchJson<any[]>(`/quiz-data/all-questions/${file}`);
      if (!data || !Array.isArray(data)) continue;
      const withSource = data.map((item) => ({ ...item, __file: file }));
      all.push(...withSource);
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

  for (const q of filtered) {
    if (typeof q.answer === "string" && Array.isArray(q.options)) {
      const idx = q.options.findIndex((opt: string) => opt === q.answer);
      q.answer = idx >= 0 ? [idx] : [];
    }
    if (typeof q.answer === "number") q.answer = [q.answer];
    if (q.references != null && !Array.isArray(q.references)) {
      q.references = [String(q.references)];
    }
  }

  // 4) Variant-filtrering: tillat eksplisitt scoping; ellers default-allow for AW169 (legacy)
  let variantFiltered: any[] = filtered;
  if (variantId) {
    const variant = getModelVariant(variantId);
    const productId = variant?.productId;
    variantFiltered = filtered.filter((q) => {
      if (Array.isArray(q.modelIds)) return q.modelIds.includes(variantId);
      if (Array.isArray(q.models)) return q.models.includes(variantId);
      if (productId && Array.isArray(q.productIds)) return q.productIds.includes(productId);
      if (productId && typeof q.productId === "string") return q.productId === productId;
      // Ingen eksplisitt scoping: behold for AW169 (historisk innhold), ellers dropp
      return variant?.productId === "AW169";
    });
  }

  // 5) Soft-delete (blocklist)
  const blockedSet = await fetchBlockedSet();
  return variantFiltered.filter((q) => !blockedSet.has(q?.id));
}
