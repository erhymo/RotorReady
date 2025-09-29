export type FlagPayload = {
  section: string;
  questionId: string;
  sectionId?: string;
  dataSource?: "sections" | "all-questions";
  dataFile?: string | null;
  snapshot?: {
    question?: string;
    options?: string[];
    explanation?: string;
    references?: string[];
    answer?: number[];
  };
  reason?: string;
};

export async function reportFlag(payload: FlagPayload) {
  try {
    await fetch("/api/flags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Kunne ikke sende flagg", error);
    }
  }
}
