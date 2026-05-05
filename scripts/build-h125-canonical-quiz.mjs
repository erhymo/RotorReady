import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const variants = [
  {
    modelId: "H125_AS350_B3_2B1",
    source: "AS350 B3 / H125 RFM",
    sections: [
      { id: "description-and-systems", title: "Description And Systems" },
      { id: "emergency_procedures", title: "Emergency Procedures" },
      { id: "limitations", title: "Limitations" },
      { id: "normal_procedures", title: "Normal Procedures" },
      { id: "air_law", title: "Air Law (EASA)", source: "EASA Air Ops" },
    ],
  },
  {
    modelId: "H125_AS350_B3E",
    source: "H125 / AS350 B3e RFM",
    sections: [
      { id: "description-and-systems", title: "Description And Systems" },
      { id: "limitations", title: "Limitations" },
      { id: "emergency_procedures", title: "Emergency Procedures" },
      { id: "normal_procedures", title: "Normal Procedures" },
      { id: "air_law", title: "Air Law (EASA)", source: "EASA Air Ops" },
    ],
  },
];

function stripInvalidControlChars(text) {
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ");
}

function readJsonFile(file) {
  return JSON.parse(stripInvalidControlChars(fs.readFileSync(file, "utf8")));
}

function asReferences(item, fallbackSource) {
  const refs = [];
  for (const key of ["references", "reference", "manual", "source"]) {
    const value = item[key];
    if (Array.isArray(value)) refs.push(...value.filter(Boolean).map(String));
    else if (value) refs.push(String(value));
  }
  if (!refs.length && fallbackSource) refs.push(fallbackSource);
  return [...new Set(refs)];
}

function normalizeItem(item, modelId, sectionId, fallbackSource) {
  const next = { ...item };
  next.sectionId = sectionId;
  next.section = next.section || sectionId;
  next.type = next.type || "single";
  next.modelIds = [modelId];
  next.source = next.source || next.manual || next.reference || fallbackSource;
  next.references = asReferences(next, fallbackSource);

  if (typeof next.answer === "string" && Array.isArray(next.options)) {
    const idx = next.options.findIndex((option) => option === next.answer);
    next.answer = idx >= 0 ? [idx] : [];
  }
  if (typeof next.answer === "number") next.answer = [next.answer];
  if (!Array.isArray(next.answer)) next.answer = [];
  if (!Array.isArray(next.tags)) next.tags = [];
  if (!next.id) throw new Error(`Missing id in ${modelId}/${sectionId}`);
  return next;
}

function dedupeById(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

for (const variant of variants) {
  const variantDir = path.join(root, "public/model-data", variant.modelId);
  const indexSections = [];

  for (const section of variant.sections) {
    const file = path.join(variantDir, "sections", `${section.id}.json`);
    const data = readJsonFile(file);
    const rawItems = Array.isArray(data) ? data : data.items || [];
    const items = dedupeById(
      rawItems.map((item) => normalizeItem(item, variant.modelId, section.id, section.source || variant.source)),
    );

    fs.writeFileSync(file, `${JSON.stringify({ items }, null, 2)}\n`);
    indexSections.push({ id: section.id, title: section.title, file: `sections/${section.id}.json`, count: items.length });
    console.log(`${variant.modelId}/${section.id}: ${items.length}`);
  }

  fs.writeFileSync(
    path.join(variantDir, "index.json"),
    `${JSON.stringify({ modelId: variant.modelId, sections: indexSections }, null, 2)}\n`,
  );
}