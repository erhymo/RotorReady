// Build-time helpers for generateStaticParams(). Used only by page.tsx server
// wrappers around dynamic-segment routes that need to enumerate every value
// the route could take so `output: 'export'` (the native-shell static build,
// see scripts/build-native-shell.mjs) can pre-render a page for each one.
// Reads the exact same JSON under public/ that the client-side pages already
// fetch at runtime, so the enumerated set matches what's actually offered.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function readJson(p: string): any | null {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function subdirs(p: string): string[] {
  try {
    return readdirSync(p, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

/** Every quiz section id offered across the global quiz-data index and every model's index.json. */
export function getQuizSectionIds(): string[] {
  const ids = new Set<string>();
  const addFromIndex = (p: string) => {
    const data = readJson(p);
    for (const s of data?.sections ?? []) {
      if (typeof s?.id === "string" && s.id !== "all") ids.add(s.id);
    }
  };
  addFromIndex(path.join(PUBLIC_DIR, "quiz-data", "index.json"));
  for (const model of subdirs(path.join(PUBLIC_DIR, "model-data"))) {
    addFromIndex(path.join(PUBLIC_DIR, "model-data", model, "index.json"));
  }
  return Array.from(ids);
}

/** Every audio episode id across every model's public/audio/<MODEL>/index.json. */
export function getAudioEpisodeIds(): string[] {
  const ids = new Set<string>();
  for (const model of subdirs(path.join(PUBLIC_DIR, "audio"))) {
    const data = readJson(path.join(PUBLIC_DIR, "audio", model, "index.json"));
    for (const item of data?.items ?? []) {
      if (typeof item?.id === "string") ids.add(item.id);
    }
  }
  return Array.from(ids);
}

/** Every AW169 light id with a recorded audio walkthrough, across public/audio/<MODEL>/lights/index.json. */
export function getLightAudioIds(): string[] {
  const ids = new Set<string>();
  for (const model of subdirs(path.join(PUBLIC_DIR, "audio"))) {
    const data = readJson(path.join(PUBLIC_DIR, "audio", model, "lights", "index.json"));
    for (const item of data?.items ?? []) {
      if (typeof item?.lightId === "string") ids.add(item.lightId);
    }
  }
  return Array.from(ids);
}

// Quiz question pages are pure client-side pagination indices (the actual
// question data lives in sessionStorage, seeded by the quiz's start page) —
// the URL param is just "1", "2", "3"... up to however many questions that
// particular section can have. A flat generous ceiling for every section
// blows the export up badly (2 files per page × every section × every
// number adds up fast), so this reads the real per-section question counts
// from public/ and gives each section its own range, with a buffer for
// content growth before the next native-shell rebuild.
function getSectionMaxQuestionCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  const record = (sectionId: string, n: number) => {
    if (n > (counts[sectionId] ?? 0)) counts[sectionId] = n;
  };
  const scan = (dir: string) => {
    let files: string[] = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".json"));
    } catch {
      return;
    }
    for (const file of files) {
      const data = readJson(path.join(dir, file));
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      record(file.replace(/\.json$/, ""), items.length);
    }
  };
  scan(path.join(PUBLIC_DIR, "quiz-data", "sections"));
  for (const model of subdirs(path.join(PUBLIC_DIR, "model-data"))) {
    scan(path.join(PUBLIC_DIR, "model-data", model, "sections"));
  }
  return counts;
}

const SECTION_MAX_QUESTION_COUNTS = getSectionMaxQuestionCounts();
const DEFAULT_QUESTION_RANGE = 60; // fallback for a section with no matching sections/*.json (e.g. derived-only)
const QUESTION_RANGE_BUFFER = 1.2;

export function getQuestionRangeForSection(sectionId: string): number {
  const real = SECTION_MAX_QUESTION_COUNTS[sectionId] ?? DEFAULT_QUESTION_RANGE;
  return Math.max(20, Math.ceil((real * QUESTION_RANGE_BUFFER) / 10) * 10);
}

export function getQuestionIndexParams(paramName: string, count: number): Record<string, string>[] {
  return Array.from({ length: count }, (_, i) => ({ [paramName]: String(i + 1) }));
}

export const QUIZ_AMOUNT_TOKENS = ["10", "20", "30", "40", "all"];
