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

export async function loadAllQuestions(variantId?: string): Promise<any[]> {
  const all: any[] = [];

  if (variantId) {
    const index = await fetchJson<{ sections?: Array<{ id?: string; title?: string }> }>(
      `/model-data/${variantId}/index.json`,
    );
    if (index?.sections?.length) {
      for (const section of index.sections) {
        if (!section?.id) continue;
        const sectionData = await fetchJson<{ items?: any[] }>(
          `/model-data/${variantId}/sections/${section.id}.json`,
        );
        if (!sectionData?.items || !Array.isArray(sectionData.items)) continue;
        const label = typeof section.title === "string" && section.title.trim() ? section.title : section.id;
        const enriched = sectionData.items.map((item) => ({
          section: label,
          ...item,
          sectionId: item.sectionId ?? section.id,
          __file: `model-data/${variantId}/sections/${section.id}.json`,
        }));
        all.push(...enriched);
      }
    }
  }

  const manifest = await fetchJson<string[]>("/quiz-data/all-questions/manifest.json");
  if (manifest?.length) {
    for (const file of manifest) {
      const data = await fetchJson<any[]>(`/quiz-data/all-questions/${file}`);
      if (!data || !Array.isArray(data)) continue;
      const withSource = data.map((item) => ({ ...item, __file: file }));
      all.push(...withSource);
    }
  }

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

  if (!variantId) {
    return filtered;
  }

  const variant = getModelVariant(variantId);
  const productId = variant?.productId;

  return filtered.filter((q) => {
    if (Array.isArray(q.modelIds)) {
      return q.modelIds.includes(variantId);
    }
    if (Array.isArray(q.models)) {
      return q.models.includes(variantId);
    }
    if (productId && Array.isArray(q.productIds)) {
      return q.productIds.includes(productId);
    }
    if (productId && typeof q.productId === "string") {
      return q.productId === productId;
    }
    if (!variant || variant.productId === "AW169") {
      return true;
    }
    return false;
  });
}
