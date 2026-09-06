#!/usr/bin/env node
// Builds a static export of the offline-critical route tree (home, quiz, AW169
// training/lights, audio, reference/training content) and copies it into
// public/native-shell/, which serves two purposes from one build:
//  1. Capacitor bundles it directly into the native binary (webDir in
//     capacitor.config.ts), so the app boots from local files every time —
//     online or offline, no network or service worker activation required.
//  2. Because it's a normal subdirectory of public/, the live Vercel deploy
//     also serves it as plain static files (no Next.js route, no serverless
//     function — same mechanism as public/audio, public/quiz-data etc.), which
//     is what lets @capgo/capacitor-updater fetch newer content in the
//     background (lib/nativeUpdater.ts) without a new store build.
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
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, cpSync } from "node:fs";
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
const NATIVE_DIR = path.join(root, "public", "native-shell");

const COPY_EXCLUDE_EXT = new Set([".pdf", ".mp3"]);
const COPY_EXCLUDE_NAMES = new Set([".DS_Store"]);
// Files @capgo/capacitor-updater should never manage — native-error.html is
// Capacitor's errorPath insurance page (the fallback for when even the JS
// bundle can't load, so it deliberately sits outside the OTA-managed layer)
// and version.json is the manifest describing everything else.
const MANIFEST_EXCLUDE_NAMES = new Set(["native-error.html", "version.json"]);

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
    cpSync(s, d);
  }
}

function hashFile(p) {
  return createHash("sha256").update(readFileSync(p)).digest("hex");
}

const LIVE_BASE_URL = "https://rotor-ready.com/native-shell/";
const LIVE_ZIP_URL = "https://rotor-ready.com/native-shell.zip";

// lib/nativeUpdater.ts polls this file (via @capgo/capacitor-updater) to decide
// whether a newer bundle exists and, if so, which files actually changed —
// that's what lets a small content fix download a few KB instead of the whole
// ~100MB shell. Field names (file_name/file_hash/download_url) match the
// plugin's own ManifestEntry shape exactly, so nativeUpdater.ts can pass this
// straight through without remapping. `version` just needs to be monotonically
// comparable across builds; a build-time timestamp is sufficient.
function writeManifest(dir) {
  const files = [];
  function walk(current, relBase) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (MANIFEST_EXCLUDE_NAMES.has(entry.name)) continue;
      const abs = path.join(current, entry.name);
      const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(abs, rel);
      } else {
        files.push({
          file_name: rel,
          file_hash: hashFile(abs),
          download_url: `${LIVE_BASE_URL}${rel}`,
        });
      }
    }
  }
  walk(dir, "");
  const manifest = { version: String(Date.now()), url: LIVE_ZIP_URL, files };
  writeFileSync(path.join(dir, "version.json"), JSON.stringify(manifest));
  log(`wrote version.json — ${files.length} files, version ${manifest.version}`);
}

// @capgo/capacitor-updater's DownloadOptions always takes a full-bundle zip
// `url` alongside the per-file `manifest` (the manifest is what actually
// drives which files get fetched for a delta update — see lib/nativeUpdater.ts
// — but the plugin's API still requires `url` to be a real, fetchable zip).
// Excludes native-error.html/version.json for the same reason the manifest
// does: they're outside the OTA-managed layer.
function writeZip(dir, zipPath) {
  rmSync(zipPath, { force: true });
  const args = ["-r", "-X", "-q", zipPath, "."];
  for (const name of MANIFEST_EXCLUDE_NAMES) args.push("-x", name);
  execFileSync("zip", args, { cwd: dir, stdio: "inherit" });
  log(`wrote ${zipPath}`);
}

const NATIVE_ERROR_HTML = path.join(NATIVE_DIR, "native-error.html");
const ZIP_PATH = path.join(root, "public", "native-shell.zip");

let failed = false;
try {
  moveOut();

  // NATIVE_DIR now lives inside public/, and `next build`'s static export
  // automatically copies the *current* contents of public/ into its output —
  // including whatever native-shell/ already held from the last run. Left in
  // place, that means every rebuild nests the previous build one level deeper
  // inside itself (confirmed: a run produced public/native-shell/native-shell/
  // and doubled in size). Preserve just the hand-maintained native-error.html,
  // then clear the rest before building so the export starts from nothing.
  const preservedErrorHtml = existsSync(NATIVE_ERROR_HTML) ? readFileSync(NATIVE_ERROR_HTML) : null;
  rmSync(NATIVE_DIR, { recursive: true, force: true });
  rmSync(ZIP_PATH, { force: true });

  rmSync(EXPORT_OUT_DIR, { recursive: true, force: true });
  execFileSync("npx", ["next", "build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, NATIVE_EXPORT: "1" },
  });

  if (!existsSync(EXPORT_OUT_DIR)) {
    throw new Error(`expected static export output at ${EXPORT_OUT_DIR}, not found`);
  }

  copyFiltered(EXPORT_OUT_DIR, NATIVE_DIR);
  if (preservedErrorHtml) {
    writeFileSync(NATIVE_ERROR_HTML, preservedErrorHtml);
  } else {
    log("WARNING: no pre-existing native-error.html found to preserve — add one by hand before shipping");
  }
  rmSync(EXPORT_OUT_DIR, { recursive: true, force: true });
  log(`copied static export into ${NATIVE_DIR}`);
  writeManifest(NATIVE_DIR);
  writeZip(NATIVE_DIR, path.join(root, "public", "native-shell.zip"));
} catch (err) {
  failed = true;
  console.error(err);
} finally {
  restore();
}

process.exit(failed ? 1 : 0);
