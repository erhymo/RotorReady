#!/usr/bin/env node
// Mobile-first navigation smoke test.
//
// Drives the app in Chromium emulating a phone (Pixel 7, touch, 412 px wide) and
// walks realistic sequences for every model: open a detail, close it, then leave
// with Home / Back / Close. It checks that each exit control ends up where its
// label promises, that the hardware back button does not re-open something that was
// just closed, and that no page scrolls sideways or throws.
//
//   node scripts/nav-smoke.mjs                       # starts `next dev` on :3111
//   node scripts/nav-smoke.mjs --base http://localhost:3000
//   node scripts/nav-smoke.mjs --native              # builds public-native and serves that
//   node scripts/nav-smoke.mjs --native --skip-build # reuse the existing public-native
//   node scripts/nav-smoke.mjs --only h125,r22       # filter by variant id / slug substring
//
// --native is the closest thing to the installed app that runs without a device:
// the same static export the store builds bundle, not the dev server. Prefer it: `next dev`
// compiles each page on first visit, so against the dev server use `--jobs 1` and expect
// the odd timing flake. Run `npm run nav:smoke -- --native` before every store release.

import { spawn, execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };

const NATIVE = flag("--native");
const only = (opt("--only") || "").toLowerCase().split(",").filter(Boolean);
const CONCURRENCY = Number(opt("--jobs") || 3);

// ---------------------------------------------------------------- variants ----
function loadVariants() {
  const src = readFileSync(path.join(root, "lib/models/catalog.ts"), "utf8");
  const out = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?routeSlug:\s*"([^"]+)"([\s\S]*?)features:\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const feats = Object.fromEntries([...m[4].matchAll(/(\w+):\s*true/g)].map((x) => [x[1], true]));
    const calc = /calcSlug:\s*"([^"]+)"/.exec(m[3]);
    out.push({ id: m[1], slug: m[2], calcSlug: calc ? calc[1] : m[2], features: feats });
  }
  return out.filter((v) => !only.length || only.some((o) => v.id.toLowerCase().includes(o) || v.slug.includes(o)));
}

// ------------------------------------------------------------------ server ----
let devProc = null;
let staticServer = null;

async function up(url) {
  try { const r = await fetch(url); return r.status < 500; } catch { return false; }
}

async function startBase() {
  const given = opt("--base");
  if (given) return given.replace(/\/$/, "");
  if (NATIVE) {
    if (!flag("--skip-build")) {
      console.log("Building the native shell (npm run native:shell)…");
      execFileSync("npm", ["run", "native:shell"], { cwd: root, stdio: "inherit", env: { ...process.env, LC_ALL: "en_US.UTF-8" } });
    }
    const dir = path.join(root, "public-native");
    if (!existsSync(dir)) throw new Error("public-native/ missing — run without --skip-build");
    const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".txt": "text/plain", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };
    const resolveFile = (p) => {
      const clean = decodeURIComponent(p.split("?")[0]);
      for (const c of [clean, clean + ".html", path.join(clean, "index.html")]) {
        const f = path.join(dir, c);
        if (f.startsWith(dir) && existsSync(f) && statSync(f).isFile()) return f;
      }
      return null;
    };
    staticServer = createServer((req, res) => {
      const f = resolveFile(req.url || "/") ;
      if (!f) { res.statusCode = 404; res.setHeader("content-type", "text/html"); res.end(readFileSync(path.join(dir, "404.html"))); return; }
      res.setHeader("content-type", types[path.extname(f)] || "application/octet-stream");
      res.end(readFileSync(f));
    }).listen(3112);
    return "http://localhost:3112";
  }
  const base = "http://localhost:3111";
  if (!(await up(base))) {
    console.log("Starting next dev on :3111…");
    devProc = spawn("npx", ["next", "dev", "-p", "3111"], { cwd: root, stdio: "ignore" });
    for (let i = 0; i < 90 && !(await up(base)); i++) await new Promise((r) => setTimeout(r, 2000));
    if (!(await up(base))) throw new Error("dev server did not come up");
  }
  return base;
}

function stopBase() {
  if (devProc) devProc.kill("SIGTERM");
  if (staticServer) staticServer.close();
}

// ------------------------------------------------------------------- tests ----
const results = []; // { variant, scenario, status: PASS|FAIL|WARN|SKIP, detail }
const record = (variant, scenario, status, detail = "") => results.push({ variant, scenario, status, detail });

const pathOf = (page) => new URL(page.url()).pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
const settle = (page, ms = 700) => page.waitForTimeout(ms);

async function openPage(browser, base, variant, route) {
  const ctx = await browser.newContext({ ...devices["Pixel 7"] });
  const page = await ctx.newPage();
  const problems = [];
  page.on("pageerror", (e) => problems.push(`uncaught: ${String(e.message).slice(0, 120)}`));
  await page.addInitScript((id) => { try { localStorage.setItem("rr_active_model_variant", id); } catch {} }, variant.id);
  // Land on Home first, so history looks like a real session (Home → screen).
  await page.goto(base + "/", { waitUntil: "load" });
  await settle(page, 500);
  await page.goto(base + route, { waitUntil: "load" });
  await settle(page, 1200);
  return { ctx, page, problems };
}

// The exit controls a phone user can reach, in the order we prefer them.
const homeButton = (page) => page.locator('a[aria-label="Home"]').last(); // top bar, not the site header
const topBarHome = async (page) => (await page.locator('a[aria-label="Home"]').count()) > 1;

async function overflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

async function tapIfVisible(loc, timeout = 4000) {
  try { await loc.first().waitFor({ state: "visible", timeout }); await loc.first().tap(); return true; } catch { return false; }
}

async function check(variant, scenario, run) {
  try {
    const r = await run();
    if (r && r.skip) record(variant.id, scenario, "SKIP", r.skip);
    else record(variant.id, scenario, r?.warn ? "WARN" : "PASS", r?.warn || "");
  } catch (e) {
    record(variant.id, scenario, "FAIL", String(e.message || e).split("\n")[0].slice(0, 200));
  }
}

const expectPath = (page, want, why) => {
  const got = pathOf(page);
  if (got !== want) throw new Error(`${why}: expected ${want}, ended on ${got}`);
};

// Tap, then wait (up to 20 s — the dev server compiles pages on first visit) for the URL to satisfy `want`.
// It never throws on a miss: the caller asserts on where we actually ended up, which makes a clearer failure.
async function tapTo(page, loc, want) {
  await loc.first().tap({ timeout: 20000 });
  const test = typeof want === "string" ? (p) => p === want : (p) => want.test(p);
  await page.waitForURL((u) => test(new URL(u).pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/"), { timeout: 20000 }).catch(() => {});
  await settle(page, 400);
}
const isDetail = (p) => /procedures\/detail|procedures\/single-engine/.test(p);
const hasProcedureList = (page) => page.locator('a[href*="plist=1"]').first().waitFor({ state: "visible", timeout: 20000 }).then(() => true, () => false);

async function closeProcedure(page, listPath) {
  const overlay = page.locator('[aria-label="Close procedure"]');
  if (await overlay.count()) await tapTo(page, overlay, (p) => !isDetail(p));
  else await tapTo(page, page.locator('a[aria-label="Procedures"]'), (p) => !isDetail(p));
  if (isDetail(pathOf(page))) throw new Error("closing the procedure left you on it");
}

async function scenarios(browser, base, v) {
  const F = v.features;
  const list = `/training/procedures/${v.slug}`;

  // 1. Procedures: open two procedures from the list, closing each, then Home and hardware back.
  await check(v, "procedures: open, close, open, close, Home", async () => {
    const { ctx, page, problems } = await openPage(browser, base, v, list);
    try {
      if (!(await hasProcedureList(page))) return { skip: "no procedure list on this model" };
      const links = page.locator('a[href*="plist=1"]');
      for (const idx of [0, 1]) {
        await tapTo(page, links.nth(idx), (p) => isDetail(p));
        if (!isDetail(pathOf(page))) throw new Error("tapping a procedure did not open it");
        await closeProcedure(page, list);
      }
      await tapTo(page, homeButton(page), "/");
      expectPath(page, "/", "Home after closing procedures");
      if (problems.length) return { warn: problems[0] };
    } finally { await ctx.close(); }
  });

  await check(v, "procedures: hardware back after closing does not reopen it", async () => {
    const { ctx, page } = await openPage(browser, base, v, list);
    try {
      if (!(await hasProcedureList(page))) return { skip: "no procedure list" };
      await tapTo(page, page.locator('a[href*="plist=1"]'), (p) => isDetail(p));
      await closeProcedure(page, list);
      await page.goBack(); await settle(page, 900);
      if (isDetail(pathOf(page))) throw new Error("system back returned to the closed procedure");
    } finally { await ctx.close(); }
  });

  // 2. System notes: open a note, come back, Close.
  if (F.systemNotes) {
    await check(v, "system notes: open note, Close, Close", async () => {
      const { ctx, page } = await openPage(browser, base, v, `/${v.slug}/system-notes`);
      try {
        const note = page.locator('a[href*="note?slug="]');
        if (!(await note.first().waitFor({ state: "visible", timeout: 20000 }).then(() => true, () => false))) throw new Error("no notes listed");
        await tapTo(page, note, /\/note$/);
        if (!/\/note$/.test(pathOf(page))) throw new Error(`tapping a note ended on ${pathOf(page)}`);
        const close = page.getByRole("button", { name: /^Close$/ });
        await tapTo(page, close, /system-notes$/);
        if (!/system-notes$/.test(pathOf(page))) throw new Error(`closing a note ended on ${pathOf(page)}`);
        await tapTo(page, close, "/");
        expectPath(page, "/", "Close on the notes list");
      } finally { await ctx.close(); }
    });
  }

  // 3. Quick reference, abbreviations.
  if (F.quickReference) {
    await check(v, "quick reference: Home", async () => {
      const { ctx, page } = await openPage(browser, base, v, `/${v.slug}/quick-reference`);
      try {
        if (!(await topBarHome(page))) throw new Error("no Home button in the top bar");
        await tapTo(page, homeButton(page), "/");
        expectPath(page, "/", "Home on quick reference");
      } finally { await ctx.close(); }
    });
  }
  if (F.abbreviations) {
    await check(v, "abbreviations: Close", async () => {
      const { ctx, page } = await openPage(browser, base, v, `/${v.slug}/abbreviations`);
      try {
        await tapTo(page, page.getByRole("button", { name: /^Close$/ }), "/");
        expectPath(page, "/", "Close on abbreviations");
      } finally { await ctx.close(); }
    });
  }

  // 4. Calculations: /calculations is the hub; each model's calculators are sub-pages of it.
  if (F.calculations) {
    await check(v, "calculations: open a calculator, back, Home", async () => {
      const { ctx, page } = await openPage(browser, base, v, `/calculations`);
      try {
        const calc = page.locator(`a[href^="/calculations/${v.calcSlug}/"]`);
        if (!(await calc.first().waitFor({ state: "visible", timeout: 20000 }).then(() => true, () => false))) throw new Error("no calculators listed for this model");
        await tapTo(page, calc, (p) => p.startsWith(`/calculations/${v.calcSlug}/`));
        if (!pathOf(page).startsWith(`/calculations/${v.calcSlug}/`)) throw new Error("tapping a calculator did not open it");
        await page.goBack(); await settle(page, 900);
        expectPath(page, "/calculations", "system back from a calculator");
        if (!(await topBarHome(page))) throw new Error("no Home button in the top bar");
        await tapTo(page, homeButton(page), "/");
        expectPath(page, "/", "Home on calculations");
      } finally { await ctx.close(); }
    });
  }

  // 5. Lights trainer (turbine models): reach the CWP page from the lights hub, as a user does.
  if (F.lights) {
    await check(v, "lights: Home", async () => {
      const { ctx, page } = await openPage(browser, base, v, `/training/lights`);
      try {
        if (!(await topBarHome(page))) throw new Error("no Home button in the top bar");
        await tapTo(page, homeButton(page), "/");
        expectPath(page, "/", "Home on the lights hub");
      } finally { await ctx.close(); }
    });
    await check(v, "CWP trainer: Lights button returns to the hub", async () => {
      const { ctx, page } = await openPage(browser, base, v, `/training/lights`);
      try {
        const cwp = page.locator(`a[href*="/training/lights/cwp/${v.slug}"]`);
        if (!(await cwp.first().waitFor({ state: "visible", timeout: 10000 }).then(() => true, () => false))) return { skip: "no CWP link on the lights hub for this model" };
        await tapTo(page, cwp, /\/cwp\//);
        await tapTo(page, page.locator('a[aria-label="Lights"]'), "/training/lights");
        expectPath(page, "/training/lights", "Lights button on the CWP trainer");
      } finally { await ctx.close(); }
    });
  }

  // 6. Audio: open an episode, back to the list, then back to Home.
  if (F.audio) {
    await check(v, "audio: open episode, Back, Back", async () => {
      const { ctx, page } = await openPage(browser, base, v, `/audio`);
      try {
        const ep = page.locator('a[href*="/audio/play"]');
        if (!(await ep.first().waitFor({ state: "visible", timeout: 20000 }).then(() => true, () => false))) return { skip: "no episodes listed" };
        await tapTo(page, ep, /\/audio\/play$/);
        if (!/\/audio\/play$/.test(pathOf(page))) throw new Error("tapping an episode did not open the player");
        await tapTo(page, page.locator('a[aria-label="Back"]').last(), "/audio");
        expectPath(page, "/audio", "Back from the player");
        // On a phone the list's only exit is its Back button (the site header's Home is hidden below md).
        await tapTo(page, page.locator('a[aria-label="Back"]').last(), "/");
        expectPath(page, "/", "Back from the audio list");
      } finally { await ctx.close(); }
    });
  }
}

async function generic(browser, base, v0) {
  // Once per run, on the first variant: pages that are not model-specific.
  const v = { ...v0 };
  await check(v, "settings: Home", async () => {
    const { ctx, page } = await openPage(browser, base, v, `/account`);
    try {
      if (!(await topBarHome(page))) throw new Error("no Home button in the top bar");
      await tapTo(page, homeButton(page), "/");
      expectPath(page, "/", "Home on settings");
    } finally { await ctx.close(); }
  });
  await check(v, "quiz start: Back", async () => {
    const { ctx, page } = await openPage(browser, base, v, `/quiz`);
    try {
      await tapTo(page, page.locator('a[aria-label="Back"]'), "/");
      expectPath(page, "/", "Back on the quiz start page");
    } finally { await ctx.close(); }
  });
}

// Every page a phone user lands on should fit the screen. Cheap, catches the classic mobile regressions.
async function overflowSweep(browser, base, v) {
  const routes = [`/`, `/${v.slug}/quick-reference`, `/${v.slug}/system-notes`, `/${v.slug}/abbreviations`, `/training/procedures/${v.slug}`, `/audio`, `/quiz`];
  for (const r of routes) {
    await check(v, `fits phone width: ${r}`, async () => {
      const { ctx, page } = await openPage(browser, base, v, r);
      try {
        const over = await overflow(page);
        if (over > 2) throw new Error(`page is ${over}px wider than the screen`);
      } finally { await ctx.close(); }
    });
  }
}

// ------------------------------------------------------------------- main ----
async function pool(items, n, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: n }, async () => { while (queue.length) await fn(queue.shift()); }));
}

const base = await startBase();
const variants = loadVariants();
if (!variants.length) { console.error("No variants matched."); stopBase(); process.exit(2); }
console.log(`\nNavigation smoke test — ${NATIVE ? "static native export" : "web"} at ${base}, phone viewport, ${variants.length} variants\n`);

const browser = await chromium.launch();
try {
  if (!only.length) await generic(browser, base, variants[0]);
  await pool(variants, CONCURRENCY, async (v) => {
    await scenarios(browser, base, v);
    await overflowSweep(browser, base, v);
  });
} finally {
  await browser.close();
  stopBase();
}

const order = { FAIL: 0, WARN: 1, SKIP: 2, PASS: 3 };
const bad = results.filter((r) => r.status === "FAIL" || r.status === "WARN").sort((a, b) => order[a.status] - order[b.status]);
const count = (s) => results.filter((r) => r.status === s).length;
for (const r of bad) console.log(`${r.status.padEnd(4)}  ${r.variant.padEnd(18)} ${r.scenario} — ${r.detail}`);
console.log(`\n${count("PASS")} passed, ${count("FAIL")} failed, ${count("WARN")} warnings, ${count("SKIP")} skipped (${results.length} checks)`);
process.exit(count("FAIL") ? 1 : 0);
