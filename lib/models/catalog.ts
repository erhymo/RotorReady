export type ProductId = "AW169" | "AW189" | "AW139" | "H125" | "R22" | "R44_II" | "S92" | "H135_T3" | "H145_D2" | "H145_D3";

export type ModelStatus = "available" | "coming_soon";

/** Capability flags — which per-model screens exist for this variant. */
export type ModelFeatures = {
  quickReference?: boolean;
  systemNotes?: boolean;
  procedures?: boolean;
  abbreviations?: boolean;
  exteriorMap?: boolean;
  calculations?: boolean;
  audio?: boolean;
  /** Has a caution/warning-panel (CWP) lights trainer — the turbine models only, not the Robinson pistons. */
  lights?: boolean;
};

export type ModelVariantDefinition = {
  id: string;
  /** Full name for the settings model picker (e.g. "Sikorsky S-92"). */
  label: string;
  /** Optional override for the settings chip when it differs from `label`. */
  pickerLabel?: string;
  /** Short name used inside Home cards / bar descriptions (e.g. "S-92", "H145 D2"). */
  shortLabel: string;
  description?: string;
  productId: ProductId;
  status: ModelStatus;
  /**
   * The single kebab-case slug this model uses for every per-model folder:
   *   app/<slug>/...          data/<slug>/...
   *   lib/procedures/<slug>/  app/calculations/<slug>/
   *   app/training/procedures/<slug>/  app/training/lights/cwp/<slug>/
   * AW169 Standard and EP share one route slug ("aw169").
   */
  routeSlug: string;
  /**
   * Slug for app/calculations/<slug>/ when it differs from routeSlug — the two
   * H125 variants share one calculator directory ("h125"). Defaults to routeSlug.
   */
  calcSlug?: string;
  /** Source-document label for the Quick Reference card ("RFM", "POH", "Flight Manual", "QRH/RFM"). */
  docLabel?: string;
  /** Free text for the Home "Procedures" card (varies too much to template). */
  proceduresDescription?: string;
  /** Optional override for the Home "Quick Reference" card description. */
  quickReferenceDescription?: string;
  fuelType?: "jetA1" | "avgas100LL";
  features: ModelFeatures;
  notes?: string;
};

export const MODEL_VARIANTS: ModelVariantDefinition[] = [
  {
    id: "AW169",
    label: "AW169 Standard",
    shortLabel: "AW169",
    description: "Leonardo AW169 – standard RotorReady data.",
    productId: "AW169",
    status: "available",
    routeSlug: "aw169",
    docLabel: "RFM",
    proceduresDescription: "Browse AW169 procedures and training checklists.",
    fuelType: "jetA1",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, exteriorMap: true, calculations: true, audio: true, lights: true },
  },
  {
    id: "AW169_EP",
    label: "AW169 EP",
    shortLabel: "AW169",
    description: "Leonardo AW169 Enhanced Performance (EP).",
    productId: "AW169",
    status: "available",
    routeSlug: "aw169",
    docLabel: "RFM",
    proceduresDescription: "Browse AW169 procedures and training checklists.",
    fuelType: "jetA1",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, exteriorMap: true, calculations: true, audio: true, lights: true },
  },
  {
    id: "AW189",
    label: "AW189",
    shortLabel: "AW189",
    description: "Leonardo AW189 – long range and capacity.",
    productId: "AW189",
    status: "available",
    routeSlug: "aw189",
    docLabel: "QRH/RFM",
    proceduresDescription: "Browse AW189 normal, engine-failure, fire and emergency procedures.",
    fuelType: "jetA1",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, calculations: true, audio: true, lights: true },
  },
  {
    id: "AW139",
    label: "AW139",
    shortLabel: "AW139",
    description: "Leonardo AW139 – medium twin.",
    productId: "AW139",
    status: "available",
    routeSlug: "aw139",
    docLabel: "RFM",
    proceduresDescription: "Browse AW139 normal, engine-failure, fire and emergency procedures.",
    fuelType: "jetA1",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, calculations: true, audio: true, lights: true },
  },
  {
    id: "H125_AS350_B3_2B1",
    label: "H125 / AS350 B3 (2B1)",
    shortLabel: "H125 / AS350 B3 (2B1)",
    description: "Airbus H125 med Arriel 2B1.",
    productId: "H125",
    status: "available",
    routeSlug: "h125-as350-b3-2b1",
    calcSlug: "h125",
    docLabel: "RFM",
    proceduresDescription: "Browse H125 / AS350 B3 (2B1) procedures and training checklists.",
    quickReferenceDescription: "Selected H125 / AS350 B3 (2B1) RFM limitations and numbers.",
    fuelType: "jetA1",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, calculations: true, audio: true, lights: true },
  },
  {
    id: "H125_AS350_B3E",
    label: "H125 / AS350 B3e",
    shortLabel: "H125 / AS350 B3e",
    description: "Airbus H125 (B3e).",
    productId: "H125",
    status: "available",
    routeSlug: "h125-as350-b3e",
    calcSlug: "h125",
    docLabel: "RFM",
    proceduresDescription: "Browse H125 / AS350 B3e procedures and training checklists.",
    quickReferenceDescription: "Selected H125 / AS350 B3e RFM limitations and numbers.",
    fuelType: "jetA1",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, calculations: true, audio: true, lights: true },
  },
  {
    id: "R22",
    label: "R22",
    shortLabel: "R22",
    description: "Robinson R22 – POH-based training content.",
    productId: "R22",
    status: "available",
    routeSlug: "r22",
    docLabel: "POH",
    proceduresDescription: "Browse R22 normal and emergency procedures.",
    quickReferenceDescription: "Selected R22 POH limitations and numbers.",
    fuelType: "avgas100LL",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, calculations: true },
  },
  {
    id: "R44_II",
    label: "R44 II",
    pickerLabel: "R44 II Raven",
    shortLabel: "R44 II",
    description: "Robinson R44 II – training content.",
    productId: "R44_II",
    status: "available",
    routeSlug: "r44-ii",
    docLabel: "POH",
    proceduresDescription: "Browse R44 II normal and emergency procedures.",
    quickReferenceDescription: "Selected R44 II POH limitations and numbers.",
    fuelType: "avgas100LL",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, calculations: true, audio: true },
  },
  {
    id: "S92",
    label: "Sikorsky S-92",
    pickerLabel: "S-92",
    shortLabel: "S-92",
    description: "Sikorsky S-92A – RFM og ECL-basert treningsinnhold.",
    productId: "S92",
    status: "available",
    routeSlug: "s92",
    docLabel: "RFM",
    proceduresDescription: "Browse S-92 Category A/B, offshore helideck and engine-failure procedures.",
    fuelType: "jetA1",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, calculations: true, audio: true, lights: true },
  },
  {
    id: "H135_T3",
    label: "H135 T3",
    shortLabel: "H135 T3",
    description: "Airbus H135 T3 (EC135 T3H) – Flight Manual og Pilot's Checklist-basert treningsinnhold.",
    productId: "H135_T3",
    status: "available",
    routeSlug: "h135-t3",
    docLabel: "Flight Manual",
    proceduresDescription: "Browse H135 T3 normal, engine emergency, fire, drive-system and fuel procedures.",
    fuelType: "jetA1",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, calculations: true, audio: true, lights: true },
  },
  {
    id: "H145_D2",
    label: "H145 D2",
    shortLabel: "H145 D2",
    description: "Airbus H145 D2 (BK117 D-2, 4-bladet rotor) – Flight Manual og Pilot's Checklist-basert treningsinnhold.",
    productId: "H145_D2",
    status: "available",
    routeSlug: "h145-d2",
    docLabel: "Flight Manual",
    proceduresDescription: "Browse H145 D2 normal, engine emergency, fire, drive-system and fuel procedures.",
    fuelType: "jetA1",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, calculations: true, audio: true, lights: true },
  },
  {
    id: "H145_D3",
    label: "H145 D3",
    shortLabel: "H145 D3",
    description: "Airbus H145 D3 (BK117 D-3, 5-bladet rotor) – Flight Manual og Pilot's Checklist-basert treningsinnhold.",
    productId: "H145_D3",
    status: "available",
    routeSlug: "h145-d3",
    docLabel: "Flight Manual",
    proceduresDescription: "Browse H145 D3 normal, engine emergency, fire, drive-system and fuel procedures.",
    fuelType: "jetA1",
    features: { quickReference: true, systemNotes: true, procedures: true, abbreviations: true, calculations: true, audio: true, lights: true },
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
    value === "R22" ||
    value === "R44_II" ||
    value === "S92" ||
    value === "H135_T3" ||
    value === "H145_D2" ||
    value === "H145_D3"
  );
}

/**
 * Per-model route hrefs, derived from the variant's `routeSlug`. Use this
 * instead of hard-coding "/<slug>/system-notes" strings anywhere.
 */
export function modelRoutes(variant: Pick<ModelVariantDefinition, "routeSlug" | "calcSlug">) {
  const s = variant.routeSlug;
  return {
    quickReference: `/${s}/quick-reference`,
    systemNotes: `/${s}/system-notes`,
    abbreviations: `/${s}/abbreviations`,
    exteriorMap: `/${s}/exterior-map`,
    procedures: `/${s}/procedures`,
    trainingProcedures: `/training/procedures/${s}`,
    calculations: `/calculations/${variant.calcSlug ?? s}`,
    cwp: `/training/lights/cwp/${s}`,
  };
}
