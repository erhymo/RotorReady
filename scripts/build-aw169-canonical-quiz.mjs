import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "public/model-data/AW169/sections");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function itemsFrom(rel) {
  const data = readJson(rel);
  return Array.isArray(data) ? data : data.items || [];
}

function normalizeItem(item, sectionId, fallbackSection, fallbackSource) {
  const next = { ...item };
  next.sectionId = sectionId;
  next.section = next.section || fallbackSection;
  next.type = next.type || "single";
  next.modelIds = ["AW169"];
  next.source = next.source || next.manual || fallbackSource;
  if (!Array.isArray(next.references) || next.references.length === 0) {
    next.references = next.manual ? [String(next.manual)] : next.source ? [String(next.source)] : [];
  }
  if (typeof next.answer === "string" && Array.isArray(next.options)) {
    const idx = next.options.findIndex((option) => option === next.answer);
    next.answer = idx >= 0 ? [idx] : [];
  }
  if (typeof next.answer === "number") next.answer = [next.answer];
  if (!Array.isArray(next.answer)) next.answer = [];
  if (!Array.isArray(next.tags)) next.tags = [];
  if (!next.id) throw new Error(`Missing id in ${sectionId}`);
  return next;
}

function dedupe(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

function writeSection(sectionId, items) {
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${sectionId}.json`);
  fs.writeFileSync(file, `${JSON.stringify({ items }, null, 2)}\n`);
  return items.length;
}

const sections = [
  {
    id: "limitations",
    title: "Limitations",
    files: [
      "public/quiz-data/sections/limitations.json",
      "public/quiz-data/all-questions/lims-p5.json",
      "public/quiz-data/all-questions/lims-p6.json",
      "public/quiz-data/all-questions/lims-p7.json",
      "public/quiz-data/all-questions/lims-p8.json",
      "public/quiz-data/all-questions/lims-p9.json",
      "public/quiz-data/all-questions/lims-p10.json",
      "public/quiz-data/all-questions/lims-p11.json",
      "public/quiz-data/all-questions/lims-p12.json",
    ],
    section: "LIMITATIONS",
    source: "AW169 RFM/QRH",
  },
  {
    id: "engine-systems",
    title: "Engine, Fuel, Lubricants, Hydraulics & System Limitations",
    files: [
      "public/quiz-data/all-questions/lims-p15.json",
      "public/quiz-data/all-questions/lims-p16.json",
      "public/quiz-data/all-questions/lims-p17.json",
      "public/quiz-data/all-questions/lims-p18.json",
    ],
    section: "LIMITATIONS - ENG SYST",
    source: "AW169 RFM/QRH",
  },
  { id: "avionics_fms_limitations", title: "Avionics & FMS Limitations", files: ["public/quiz-data/sections/avionics_fms_limitations.json"], section: "Avionics & FMS Limitations", source: "AW169 QRH" },
  { id: "emergency_procedures", title: "Emergency Procedures", files: ["public/quiz-data/sections/emergency_procedures.json"], section: "EMERGENCY PROCEDURES", source: "AW169 RFM/QRH" },
  { id: "normal_procedures", title: "Normal Procedures", files: ["public/quiz-data/sections/normal_procedures.json"], section: "NORMAL PROCEDURES", source: "AW169 QRH" },
  { id: "air_law", title: "Air Law (EASA)", files: ["public/quiz-data/sections/air_law.json"], section: "AIR LAW", source: "EASA Air Ops" },
  { id: "performance", title: "Performance", files: ["public/model-data/AW169/sections/performance.json"], section: "PERFORMANCE", source: "AW169 RFM/QRH", write: false },
  { id: "systems_description", title: "Systems Description", files: ["public/model-data/AW169/sections/systems_description.json"], section: "SYSTEMS DESCRIPTION", source: "AW169 RFM", write: false },
];

const indexSections = [];
for (const section of sections) {
  const merged = section.files.flatMap((file) => itemsFrom(file));
  const normalized = dedupe(merged.map((item) => normalizeItem(item, section.id, section.section, section.source)));
  const count = section.write === false ? normalized.length : writeSection(section.id, normalized);
  indexSections.push({ id: section.id, title: section.title, file: `sections/${section.id}.json`, count });
  console.log(`${section.id}: ${count}`);
}

fs.writeFileSync(
  path.join(root, "public/model-data/AW169/index.json"),
  `${JSON.stringify({ modelId: "AW169", sections: indexSections }, null, 2)}\n`,
);