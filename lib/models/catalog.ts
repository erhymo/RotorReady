export type ProductId = "AW169" | "AW189" | "AW139" | "H125" | "R44_II" | "S92";

export type ModelStatus = "available" | "coming_soon";

export type ModelVariantDefinition = {
  id: string;
  label: string;
  description?: string;
  productId: ProductId;
  status: ModelStatus;
  notes?: string;
};

export const MODEL_VARIANTS: ModelVariantDefinition[] = [
  {
    id: "AW169",
    label: "AW169 Standard",
    description: "Leonardo AW169 – standard RotorReady data.",
    productId: "AW169",
    status: "available",
  },
  {
    id: "AW169_EP",
    label: "AW169 EP",
    description: "Leonardo AW169 Enhanced Performance (EP).",
    productId: "AW169",
    status: "available",
  },
  {
    id: "AW189",
    label: "AW189",
    description: "Leonardo AW189 – long range and capacity.",
    productId: "AW189",
    status: "available",
  },
  {
    id: "AW139",
    label: "AW139",
    description: "Leonardo AW139 – medium twin.",
    productId: "AW139",
    status: "available",
  },
  {
    id: "H125_AS350_B3_2B1",
    label: "H125 / AS350 B3 (2B1)",
    description: "Airbus H125 med Arriel 2B1.",
    productId: "H125",
    status: "available",
  },
  {
    id: "H125_AS350_B3E",
    label: "H125 / AS350 B3e",
    description: "Airbus H125 (B3e).",
    productId: "H125",
    status: "available",
  },
  {
    id: "R44_II",
    label: "R44 II",
    description: "Robinson R44 II – training content.",
    productId: "R44_II",
    status: "available",
  },
  {
    id: "S92",
    label: "Sikorsky S-92",
    description: "Sikorsky S-92A – RFM og ECL-basert treningsinnhold.",
    productId: "S92",
    status: "available",
  },
];

export const DEFAULT_MODEL_VARIANT_ID = "AW169";

const MODEL_VARIANT_MAP = new Map<string, ModelVariantDefinition>(
  MODEL_VARIANTS.map((variant) => [variant.id, variant]),
);

export function listModelVariants(): ModelVariantDefinition[] {
  return MODEL_VARIANTS;
}

export function getModelVariant(id: string | null | undefined): ModelVariantDefinition | null {
  if (!id) return null;
  return MODEL_VARIANT_MAP.get(id) || null;
}

export function listVariantsByProduct(productId: ProductId): ModelVariantDefinition[] {
  return MODEL_VARIANTS.filter((variant) => variant.productId === productId);
}

export function isProductId(value: unknown): value is ProductId {
  return (
    value === "AW169" ||
    value === "AW189" ||
    value === "AW139" ||
    value === "H125" ||
    value === "R44_II" ||
    value === "S92"
  );
}
