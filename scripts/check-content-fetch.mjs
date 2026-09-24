#!/usr/bin/env node
// Guards the single rule that decides whether a content fix reaches installed
// native apps: every fetch of a file under public/ must go through
// lib/contentUrl.ts (contentUrl / fetchContentJson / fetchContentText).
//
// Why this exists: the native app has no server.url — it boots from the bundled
// shell in public-native/ (see capacitor.config.ts). A relative fetch there
// resolves against that bundle, i.e. a snapshot frozen at the last store build,
// not the live site. Code that skips contentUrl therefore looks fine on the web
// and silently serves months-old content on a phone, with nothing to notice.
//
// That is not hypothetical. On 2026-09-23 a user reported the S92 limitations
// quiz stuck at 20 questions after 48 were published. Cause: loadAllQuestions.ts
// fetched with { cache: "force-cache" } instead of fetchContentJson. The same
// class of bug was then found sitting unnoticed in seven CWP light pages.
//
// Deliberate exception: put `content-fetch-ok: <reason>` in a comment on the
// offending line or the line above it.

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// Directories whose code never runs in the native app's bundled shell:
// server routes, and the surfaces build-native-shell.mjs strips out entirely
// (EXCLUDE_FROM_EXPORT). A raw fetch there can only ever run against a real server.
const SKIP_DIRS = new Set([
  "node_modules", ".next", ".next-native", ".git", "public", "public-native",
  "app/api", "app/admin", "app/login", "app/signup",
  "app/dev",
]);

const SCAN_DIRS = ["app", "components", "lib"];
const SCAN_EXT = new Set([".ts", ".tsx"]);

// Path prefixes that are plain files under public/ — the things that must stay
// fresh without a store release.
const CONTENT_PREFIXES = [
  "/model-data/", "/quiz-data/", "/audio/", "/system-notes/",
  "/quick-reference/", "/procedures/", "/abbreviations/", "/training/",
];

function walk(dir, out = []) {
  const rel = path.relative(root, dir);
  if (rel && SKIP_DIRS.has(rel)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || SKIP_DIRS.has(path.relative(root, full))) continue;
      walk(full, out);
    } else if (SCAN_EXT.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

const findings = [];

for (const file of SCAN_DIRS.flatMap((d) => walk(path.join(root, d)))) {
  const rel = path.relative(root, file);
  if (rel === "lib/contentUrl.ts") continue; // the helper itself does the real fetching

  const raw = readFileSync(file, "utf8");
  // Blank out comments before scanning: commented-out code is not code, and a
  // comment that merely quotes a bad fetch (including the ones in this repo
  // explaining why a fetch was changed) must not read as a violation. Line
  // positions are preserved so reported line numbers stay accurate.
  const source = raw
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/.*$/gm, (m, p1) => p1 + " ".repeat(m.length - p1.length));
  const lines = source.split("\n");
  // The allow-marker lives in a comment, so it has to be read from the original.
  const rawLines = raw.split("\n");

  // A file that never mentions a content path cannot be fetching one, whether by
  // literal or by variable. This keeps the variable check below from flagging
  // every ordinary fetch in the app.
  const mentionsContent = CONTENT_PREFIXES.some((p) => source.includes(p));
  if (!mentionsContent) continue;

  lines.forEach((line, i) => {
    if (/contentUrl\s*\(/.test(line)) return; // fetch(contentUrl(...)) is correct

    const literal = /\bfetch\(\s*([`"'][^`"')]*)/.exec(line);
    // The variable form — `fetch(url, ...)` where url came from a content-path
    // array. This is how the Offline page's section lookup escaped an earlier,
    // literals-only version of this check.
    const variable = /\bfetch\(\s*([A-Za-z_$][\w$]*)\s*[,)]/.exec(line);

    let why = null;
    if (literal && CONTENT_PREFIXES.some((p) => literal[1].slice(1).startsWith(p))) {
      why = "content path";
    } else if (variable) {
      why = `fetch(${variable[1]}) in a file that references content paths`;
    }
    if (!why) return;

    const allowed = /content-fetch-ok/.test(rawLines[i] || "") || /content-fetch-ok/.test(rawLines[i - 1] || "");
    if (allowed) return;

    findings.push({ file: rel, line: i + 1, text: (rawLines[i] || "").trim().slice(0, 100), why });
  });
}

if (!findings.length) {
  console.log("content-fetch guard: every content fetch goes through lib/contentUrl.ts. OK.");
  process.exit(0);
}

console.error("\ncontent-fetch guard: raw fetch() on a content path.\n");
console.error("These read the bundled snapshot inside the native app, so edits to this");
console.error("content would never reach installed apps without a new store release.\n");
for (const f of findings) console.error(`  ${f.file}:${f.line}  (${f.why})\n    ${f.text}`);
console.error(`\nUse fetchContentJson / fetchContentText / contentUrl from "@/lib/contentUrl".`);
console.error(`If a raw fetch is genuinely intended, add a "content-fetch-ok: <reason>" comment.\n`);
process.exit(1);
