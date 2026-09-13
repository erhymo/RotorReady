#!/usr/bin/env node
// Checks everything under public/ that the app fetches at runtime.
//
// This matters more than it used to. Content no longer waits for an app
// release: the native app fetches these files live (lib/contentUrl.ts), so a
// malformed or half-written file pushed to main reaches every installed app
// within minutes, with no review in between. This is the gate that replaces
// the one the store used to provide.
//
// Run it before pushing content (npm run validate:content); CI runs it too.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");

const problems = [];
let filesChecked = 0;

const fail = (file, message) => problems.push(`${file}: ${message}`);

function readJson(file) {
  const rel = path.relative(ROOT, file);
  try {
    const raw = readFileSync(file, "utf8");
    if (!raw.trim()) {
      fail(rel, "file is empty");
      return null;
    }
    filesChecked++;
    return JSON.parse(raw);
  } catch (err) {
    fail(rel, `not valid JSON — ${err.message}`);
    return null;
  }
}

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

function requireFields(rel, items, fields, label) {
  items.forEach((item, i) => {
    for (const f of fields) {
      if (!isNonEmptyString(item?.[f])) fail(rel, `${label}[${i}] is missing "${f}"`);
    }
  });
}

function requireUnique(rel, items, key, label) {
  const seen = new Set();
  for (const item of items) {
    const v = item?.[key];
    if (!v) continue;
    if (seen.has(v)) fail(rel, `${label} has a duplicate ${key}: "${v}"`);
    seen.add(v);
  }
}

function subdirs(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    return [];
  }
}

// ---------- audio ----------
for (const variant of subdirs(path.join(PUBLIC, "audio"))) {
  const dir = path.join(PUBLIC, "audio", variant);

  const indexFile = path.join(dir, "index.json");
  if (existsSync(indexFile)) {
    const rel = path.relative(ROOT, indexFile);
    const data = readJson(indexFile);
    if (data) {
      const items = data.items;
      if (!Array.isArray(items)) fail(rel, '"items" must be an array');
      else {
        requireFields(rel, items, ["id", "title", "filename"], "items");
        requireUnique(rel, items, "id", "items");
        items.forEach((it, i) => {
          if (typeof it?.durationSeconds !== "number" || it.durationSeconds <= 0)
            fail(rel, `items[${i}] ("${it?.id}") needs a positive durationSeconds`);
          if (it?.filename && !existsSync(path.join(dir, it.filename)))
            fail(rel, `items[${i}] ("${it.id}") points at a missing file: ${it.filename}`);
        });
      }
    }
  }

  const lightsFile = path.join(dir, "lights", "index.json");
  if (existsSync(lightsFile)) {
    const rel = path.relative(ROOT, lightsFile);
    const data = readJson(lightsFile);
    if (data) {
      const items = data.items;
      if (!Array.isArray(items)) fail(rel, '"items" must be an array');
      else {
        requireFields(rel, items, ["lightId", "title", "filename"], "items");
        requireUnique(rel, items, "lightId", "items");
        items.forEach((it, i) => {
          if (it?.filename && !existsSync(path.join(dir, "lights", it.filename)))
            fail(rel, `items[${i}] ("${it.lightId}") points at a missing file: ${it.filename}`);
        });
      }
    }
  }
}

// ---------- procedures ----------
for (const file of jsonFilesIn(path.join(PUBLIC, "procedures"))) {
  const rel = path.relative(ROOT, file);
  const data = readJson(file);
  if (!data) continue;
  const procs = data.procedures;
  if (!Array.isArray(procs) || procs.length === 0) {
    fail(rel, '"procedures" must be a non-empty array');
    continue;
  }
  requireFields(rel, procs, ["slug", "title"], "procedures");
  requireUnique(rel, procs, "slug", "procedures");
  const slugs = new Set(procs.map((p) => p.slug));

  procs.forEach((p, i) => {
    const where = `procedures[${i}] ("${p?.slug}")`;
    const isDocument = typeof p?.html === "string";
    if (isDocument) {
      if (!p.html.trim()) fail(rel, `${where} has empty html`);
      if (!isNonEmptyString(p.mainClass)) fail(rel, `${where} is missing mainClass`);
    } else if (Array.isArray(p?.groups)) {
      p.groups.forEach((g, gi) => {
        if (!Array.isArray(g?.steps) || g.steps.length === 0)
          fail(rel, `${where} group[${gi}] has no steps`);
      });
    } else if (!Array.isArray(p?.steps)) {
      fail(rel, `${where} has neither groups, steps nor html`);
    }
  });

  for (const g of data.listGroups ?? []) {
    for (const slug of g.slugs ?? []) {
      if (!slugs.has(slug)) fail(rel, `listGroups names "${slug}", which is not a procedure in this file`);
    }
  }
}

// ---------- system notes ----------
for (const file of jsonFilesIn(path.join(PUBLIC, "system-notes"))) {
  const rel = path.relative(ROOT, file);
  const data = readJson(file);
  if (!data) continue;
  const notes = data.notes;
  if (!Array.isArray(notes)) {
    fail(rel, '"notes" must be an array');
    continue;
  }
  requireFields(rel, notes, ["slug", "title", "rfmReference"], "notes");
  requireUnique(rel, notes, "slug", "notes");
  notes.forEach((n, i) => {
    if (!Array.isArray(n?.sections) || n.sections.length === 0)
      fail(rel, `notes[${i}] ("${n?.slug}") has no sections`);
  });
}

// ---------- quick reference ----------
for (const file of jsonFilesIn(path.join(PUBLIC, "quick-reference"))) {
  const rel = path.relative(ROOT, file);
  const data = readJson(file);
  if (!data) continue;
  if (!isNonEmptyString(data.title)) fail(rel, 'missing "title"');
  if (!Array.isArray(data.groups) || data.groups.length === 0) {
    fail(rel, '"groups" must be a non-empty array');
    continue;
  }
  data.groups.forEach((g, gi) => {
    if (!isNonEmptyString(g?.title)) fail(rel, `groups[${gi}] is missing "title"`);
    if (!Array.isArray(g?.items) || g.items.length === 0) {
      fail(rel, `groups[${gi}] ("${g?.title}") has no items`);
      return;
    }
    g.items.forEach((it, ii) => {
      if (!isNonEmptyString(it?.label)) fail(rel, `groups[${gi}].items[${ii}] is missing "label"`);
      if (!Array.isArray(it?.lines) || it.lines.length === 0)
        fail(rel, `groups[${gi}].items[${ii}] ("${it?.label}") has no lines`);
    });
  });
}

// ---------- abbreviations ----------
for (const file of jsonFilesIn(path.join(PUBLIC, "abbreviations"))) {
  const rel = path.relative(ROOT, file);
  const data = readJson(file);
  if (!data) continue;
  if (!Array.isArray(data.items) || data.items.length === 0) {
    fail(rel, '"items" must be a non-empty array');
    continue;
  }
  requireFields(rel, data.items, ["abbr", "meaning"], "items");
}

// ---------- exterior map ----------
for (const file of jsonFilesIn(path.join(PUBLIC, "exterior-map"))) {
  const rel = path.relative(ROOT, file);
  const data = readJson(file);
  if (!data) continue;
  if (!Array.isArray(data.hotspots)) {
    fail(rel, '"hotspots" must be an array');
    continue;
  }
  requireFields(rel, data.hotspots, ["id", "label"], "hotspots");
  requireUnique(rel, data.hotspots, "id", "hotspots");
  data.hotspots.forEach((h, i) => {
    for (const axis of ["x", "y"]) {
      if (typeof h?.[axis] !== "number" || h[axis] < 0 || h[axis] > 100)
        fail(rel, `hotspots[${i}] ("${h?.id}") needs ${axis} as a percentage between 0 and 100`);
    }
  });
}

// ---------- IFR / VFR ----------
for (const name of ["ifr", "vfr"]) {
  const file = path.join(PUBLIC, "ifr-vfr", `${name}.json`);
  if (!existsSync(file)) continue;
  const rel = path.relative(ROOT, file);
  const data = readJson(file);
  if (!data) continue;
  const topics = data.topics;
  if (!Array.isArray(topics) || topics.length === 0) {
    fail(rel, '"topics" must be a non-empty array');
    continue;
  }
  requireFields(rel, topics, ["slug", "title", "reference"], "topics");
  requireUnique(rel, topics, "slug", "topics");
  topics.forEach((t, i) => {
    if (!Array.isArray(t?.groups) || t.groups.length === 0)
      fail(rel, `topics[${i}] ("${t?.slug}") has no groups`);
  });
}

// ---------- quiz ----------
for (const dir of [
  path.join(PUBLIC, "quiz-data", "sections"),
  ...subdirs(path.join(PUBLIC, "model-data")).map((m) => path.join(PUBLIC, "model-data", m, "sections")),
]) {
  for (const file of jsonFilesIn(dir)) {
    const rel = path.relative(ROOT, file);
    const data = readJson(file);
    if (!data) continue;
    const items = Array.isArray(data) ? data : data.items;
    if (!Array.isArray(items)) {
      fail(rel, "expected an array of questions, or an object with an items array");
      continue;
    }
    items.forEach((q, i) => {
      if (!isNonEmptyString(q?.question)) fail(rel, `items[${i}] is missing "question"`);
      if (!Array.isArray(q?.options) || q.options.length < 2)
        fail(rel, `items[${i}] needs at least two options`);
      const answers = Array.isArray(q?.answer) ? q.answer : [q?.answer];
      if (!answers.length || answers.some((a) => typeof a !== "number"))
        fail(rel, `items[${i}] has no usable answer index`);
      else if (Array.isArray(q?.options) && answers.some((a) => a < 0 || a >= q.options.length))
        fail(rel, `items[${i}] has an answer index outside its options`);
    });
    requireUnique(rel, items, "id", "items");
  }
}

function jsonFilesIn(dir) {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join(dir, f))
      .filter((f) => statSync(f).isFile());
  } catch {
    return [];
  }
}

if (problems.length) {
  console.error(`\ncontent validation FAILED — ${problems.length} problem(s) across ${filesChecked} files:\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error("\nThese files are served live to installed apps. Fix before pushing.\n");
  process.exit(1);
}

console.log(`content validation passed — ${filesChecked} files checked`);
