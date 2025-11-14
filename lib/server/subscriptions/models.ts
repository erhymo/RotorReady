export type RotorModelId = "AW169" | "AW189" | "AW139" | "H125" | "R44_II";

export type PriceTier = "standard" | "discount";

export type RotorModelConfig = {
  id: RotorModelId;
  label: string;
  description: string;
  trialDays: number;
  priceEnv: {
    [key in PriceTier]?: string;
  };
};

const MODEL_CONFIGS: RotorModelConfig[] = [
  {
    id: "AW169",
    label: "AW169",
    description: "Leonardo AW169 – Limitations, QRH/AFM and systems quizzes.",
    trialDays: 10,
    priceEnv: {
      standard: "STRIPE_PRICE_AW169_STANDARD",
      discount: "STRIPE_PRICE_AW169_DISCOUNT",
    },
  },
  {
    id: "AW189",
    label: "AW189",
    description: "Leonardo AW189 – Training content.",
    trialDays: 10,
    priceEnv: {
      standard: "STRIPE_PRICE_AW189_STANDARD",
      discount: "STRIPE_PRICE_AW189_DISCOUNT",
    },
  },
  {
    id: "AW139",
    label: "AW139",
    description: "Leonardo AW139 – Training content.",
    trialDays: 10,
    priceEnv: {
      standard: "STRIPE_PRICE_AW139_STANDARD",
      discount: "STRIPE_PRICE_AW139_DISCOUNT",
    },
  },
  {
    id: "H125",
    label: "Airbus H125",
    description: "Airbus H125 – Training content.",
    trialDays: 10,
    priceEnv: {
      standard: "STRIPE_PRICE_H125_STANDARD",
      discount: "STRIPE_PRICE_H125_DISCOUNT",
    },
  },
  {
    id: "R44_II",
    label: "Robinson R44 II",
    description: "Robinson R44 II – Training content.",
    trialDays: 10,
    priceEnv: {
      standard: "STRIPE_PRICE_R44_II_STANDARD",
      discount: "STRIPE_PRICE_R44_II_DISCOUNT",
    },
  },
];

const MODEL_MAP = new Map<RotorModelId, RotorModelConfig>(
  MODEL_CONFIGS.map((config) => [config.id, config]),
);

export function listRotorModels(): RotorModelConfig[] {
  return MODEL_CONFIGS;
}

export function isRotorModelId(value: unknown): value is RotorModelId {
  return typeof value === "string" && MODEL_MAP.has(value as RotorModelId);
}

export function getRotorModelConfig(id: RotorModelId): RotorModelConfig {
  const config = MODEL_MAP.get(id);
  if (!config) {
    throw new Error(`Unknown rotor model id: ${id}`);
  }
  return config;
}

export function getPriceEnvKey(id: RotorModelId, tier: PriceTier = "standard"): string | null {
  const config = getRotorModelConfig(id);
  return config.priceEnv[tier] ?? null;
}

export function getPriceIdFromEnv(id: RotorModelId, tier: PriceTier = "standard"): string {
  const envKey = getPriceEnvKey(id, tier);
  if (!envKey) return "";
  return process.env[envKey] || "";
}
