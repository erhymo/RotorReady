#!/usr/bin/env node
// Sets the `count` of every quiz section in public/model-data/<MODEL>/index.json to
// the number of questions actually in its section file.
//
// The quiz list shows these counts without fetching every section file, so they
// are written into index.json — and nothing used to keep them in step. S92
// limitations went from 20 to 48 questions while the list kept saying 20, and
// AW139/AW189 showed no counts at all. validate-content.mjs now fails when a
// count is missing or wrong; this is the fix it points to. Run it after adding or
// removing quiz questions:  npm run fix:counts
//
// Only files whose counts change are rewritten, in standard 2-space JSON.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const MODEL_DATA = path.join(process.cwd(), "public", "model-data");
const changes = [];

for (const model of readdirSync(MODEL_DATA).sort()) {
  const indexFile = path.join(MODEL_DATA, model, "index.json");
  if (!existsSync(indexFile) || !statSync(indexFile).isFile()) continue;

  const index = JSON.parse(readFileSync(indexFile, "utf8"));
  if (!Array.isArray(index.sections)) continue;

  let changed = false;
  for (const section of index.sections) {
    const sectionFile = path.join(MODEL_DATA, model, "sections", `${section.id}.json`);
    // No model file: the section is served from quiz-data or derived — nothing to count.
    if (!existsSync(sectionFile)) continue;
    const data = JSON.parse(readFileSync(sectionFile, "utf8"));
    const items = Array.isArray(data) ? data : data.items;
    if (!Array.isArray(items)) continue;

    if (section.count !== items.length) {
      changes.push(`${model}/${section.id}: ${section.count ?? "(none)"} -> ${items.length}`);
      section.count = items.length;
      changed = true;
    }
  }

  if (changed) writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\n");
}

if (changes.length) {
  console.log(`Updated ${changes.length} quiz section count(s):`);
  for (const c of changes) console.log(`  ${c}`);
} else {
  console.log("All quiz section counts already match their files.");
}
