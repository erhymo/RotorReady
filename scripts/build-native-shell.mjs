#!/usr/bin/env node
// Builds a static export of the offline-critical route tree (home, quiz, AW169
// training/lights, audio, reference/training content) and copies it into
// public-native/, which Capacitor bundles directly into the native app so it
// boots from local files every time — online or offline, no network or service
// worker activation required to start.
//
// Routes that inherently need a live server (auth, admin, billing, weather,
// airports) are temporarily moved out of app/ for the duration of this build so
// `next build` with output: 'export' only has to deal with the static-safe tree,
// then moved back — the normal Vercel build (which serves those routes) is
// completely untouched by this script.
//
// Large reference files (RFM/QRH PDFs, podcast mp3s) are deliberately excluded
// from the copy — same reasoning as next.config.mjs's publicExcludes for the
// service worker: they're fetched on demand and cached from the live site
// instead of bloating every app install. Everything else, including all the
// (small, ~8MB total) quiz-data/model-data/training JSON and the AW169 lights
// procedure images, is bundled in so the app never needs a network round-trip
// just to have content to show.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, cpSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const EXCLUDE_FROM_EXPORT = [
  "app/api",
  "app/admin",
  "app/login",
  "app/signup",
  "app/weather",
  "app/airports",
  "middleware.ts",
];

const HOLDING_DIR = path.join(root, ".native-shell-excluded");
// With output: 'export', Next writes the final static site straight into
// distDir (see next.config.mjs's NATIVE_EXPORT branch) — there's no separate
// "out/" copy step the way the legacy `next export` command used to have.
const EXPORT_OUT_DIR = path.join(root, ".next-native");
const NATIVE_DIR = path.join(root, "public-native");

const COPY_EXCLUDE_EXT = new Set([".pdf", ".mp3"]);
const COPY_EXCLUDE_NAMES = new Set([".DS_Store"]);

function log(msg) {
  console.log(`[build-native-shell] ${msg}`);
}

function moveOut() {
  rmSync(HOLDING_DIR, { recursive: true, force: true });
  mkdirSync(HOLDING_DIR, { recursive: true });
  for (const rel of EXCLUDE_FROM_EXPORT) {
    const src = path.join(root, rel);
    if (!existsSync(src)) continue;
    const dest = path.join(HOLDING_DIR, rel);
    mkdirSync(path.dirname(dest), { recursive: true });
    cpSync(src, dest, { recursive: true });
    rmSync(src, { recursive: true, force: true });
  }
  log(`moved out: ${EXCLUDE_FROM_EXPORT.join(", ")}`);
}

function restore() {
  for (const rel of EXCLUDE_FROM_EXPORT) {
    const src = path.join(HOLDING_DIR, rel);
    if (!existsSync(src)) continue;
    const dest = path.join(root, rel);
    rmSync(dest, { recursive: true, force: true });
    mkdirSync(path.dirname(dest), { recursive: true });
    cpSync(src, dest, { recursive: true });
  }
  rmSync(HOLDING_DIR, { recursive: true, force: true });
  log("restored excluded routes");
}

function copyFiltered(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyFiltered(s, d);
      continue;
    }
    if (COPY_EXCLUDE_EXT.has(path.extname(entry.name).toLowerCase())) continue;
    if (COPY_EXCLUDE_NAMES.has(entry.name)) continue;
    // native-error.html is maintained by hand directly in public-native/ (it's
    // Capacitor's errorPath insurance page) and must never be clobbered by
    // whatever the static export happens to produce for that filename.
    if (entry.name === "native-error.html" && d === path.join(NATIVE_DIR, "native-error.html")) continue;
    cpSync(s, d);
  }
}

let failed = false;
try {
  moveOut();
  rmSync(EXPORT_OUT_DIR, { recursive: true, force: true });
  execFileSync("npx", ["next", "build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, NATIVE_EXPORT: "1" },
  });

  if (!existsSync(EXPORT_OUT_DIR)) {
    throw new Error(`expected static export output at ${EXPORT_OUT_DIR}, not found`);
  }

  // Keep native-error.html — it stays as Capacitor's errorPath insurance file —
  // but replace everything else with the fresh export.
  for (const entry of readdirSync(NATIVE_DIR)) {
    if (entry === "native-error.html") continue;
    rmSync(path.join(NATIVE_DIR, entry), { recursive: true, force: true });
  }
  copyFiltered(EXPORT_OUT_DIR, NATIVE_DIR);
  rmSync(EXPORT_OUT_DIR, { recursive: true, force: true });
  log(`copied static export into ${NATIVE_DIR}`);
} catch (err) {
  failed = true;
  console.error(err);
} finally {
  restore();
}

process.exit(failed ? 1 : 0);
