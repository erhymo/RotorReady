#!/usr/bin/env node
// Pre-submission check. Run this immediately before archiving in Xcode or
// building the Android bundle:  npm run release:check
//
// The failure it exists to prevent: archiving without rebuilding the bundled
// shell. The native app ships a static export of the app (public-native/), so
// an archive taken without re-running native:shell ships whatever that folder
// last contained — the build looks fine, the store accepts it, and none of the
// work since the last shell build actually reaches users.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SHELL_DIR = path.join(ROOT, "public-native");
const WATCHED = ["app", "public", "lib", "components"];
const IGNORED_DIRS = new Set(["node_modules", ".next", ".next-native", ".git", "public-native"]);
// build-native-shell.mjs moves these out and puts them back, which updates their
// mtime every run, and they are excluded from the shell anyway — so their age
// says nothing about whether the bundled shell is current.
const NOT_IN_SHELL = [
  "app/api", "app/admin", "app/login", "app/signup", "app/weather", "app/airports",
].map((p) => path.join(ROOT, p));

let failed = false;
const ok = (m) => console.log(`  ok    ${m}`);
const bad = (m) => {
  console.log(`  FAIL  ${m}`);
  failed = true;
};
const note = (m) => console.log(`  note  ${m}`);

console.log("\nRelease check\n");

// 1. content validation
try {
  execFileSync("node", [path.join("scripts", "validate-content.mjs")], { cwd: ROOT, stdio: "pipe" });
  ok("content files are valid");
} catch (err) {
  bad("content validation failed — run npm run validate:content to see what");
}

// 1b. does every content fetch still go through lib/contentUrl.ts?
// This matters most at release time: a raw fetch ships frozen content to every
// installed app until the *next* store release, which is the slowest possible
// bug to correct. See scripts/check-content-fetch.mjs.
try {
  execFileSync("node", [path.join("scripts", "check-content-fetch.mjs")], { cwd: ROOT, stdio: "pipe" });
  ok("every content fetch goes through lib/contentUrl.ts");
} catch (err) {
  bad("a raw fetch bypasses lib/contentUrl.ts — run npm run check:content-fetch to see which");
}

// 2. is the bundled shell newer than the sources it is built from?
function newestFile(dir, state = { time: 0, file: null }) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return state;
  }
  for (const e of entries) {
    if (e.name.startsWith(".") || IGNORED_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (NOT_IN_SHELL.some((p) => full === p)) continue;
      newestFile(full, state);
    }
    else {
      const m = statSync(full).mtimeMs;
      if (m > state.time) {
        state.time = m;
        state.file = path.relative(ROOT, full);
      }
    }
  }
  return state;
}

if (!existsSync(SHELL_DIR)) {
  bad("public-native/ does not exist — run npm run native:shell");
} else {
  const shellBuilt = statSync(path.join(SHELL_DIR, "index.html")).mtimeMs;
  const newest = WATCHED.map((d) => newestFile(path.join(ROOT, d))).reduce(
    (a, b) => (b.time > a.time ? b : a),
    { time: 0, file: null }
  );
  if (newest.time > shellBuilt) {
    const mins = Math.round((newest.time - shellBuilt) / 60000);
    bad(
      `the bundled shell is older than your sources (${newest.file} is ${mins} min newer) — ` +
        `run npm run ios:sync / android:sync before archiving`
    );
  } else {
    ok(`bundled shell is up to date (built ${new Date(shellBuilt).toLocaleString()})`);
  }
}

// 3. versions, for eyeballing against what is already live in the stores
try {
  const pbx = readFileSync(path.join(ROOT, "ios/App/App.xcodeproj/project.pbxproj"), "utf8");
  const marketing = [...new Set([...pbx.matchAll(/MARKETING_VERSION = ([^;]+);/g)].map((m) => m[1]))];
  const build = [...new Set([...pbx.matchAll(/CURRENT_PROJECT_VERSION = ([^;]+);/g)].map((m) => m[1]))];
  note(`iOS ${marketing.join("/")} (build ${build.join("/")})`);
  if (marketing.length > 1 || build.length > 1) bad("iOS version numbers are inconsistent across build configurations");
} catch {
  note("could not read the iOS version");
}
try {
  const gradle = readFileSync(path.join(ROOT, "android/app/build.gradle"), "utf8");
  const code = gradle.match(/versionCode\s+(\d+)/)?.[1];
  const name = gradle.match(/versionName\s+"([^"]+)"/)?.[1];
  note(`Android ${name} (versionCode ${code})`);
} catch {
  note("could not read the Android version");
}
note("both must be higher than the versions already in the stores, or the upload is rejected");

// 4. the shell is what Capacitor actually ships
try {
  const cfg = readFileSync(path.join(ROOT, "capacitor.config.ts"), "utf8");
  const webDir = cfg.match(/webDir:\s*"([^"]+)"/)?.[1];
  if (webDir !== "public-native") bad(`capacitor webDir is "${webDir}", expected "public-native"`);
  else ok('capacitor webDir is "public-native"');
  if (/^\s*url:/m.test(cfg.split("server:")[1]?.slice(0, 200) ?? "")) {
    bad("capacitor server.url is set — the app would load the live site instead of booting locally");
  } else {
    ok("no server.url — the app boots from the bundled shell");
  }
} catch {
  bad("could not read capacitor.config.ts");
}

console.log(
  failed
    ? "\nNot ready to submit — fix the items marked FAIL.\n"
    : "\nReady to archive.\n"
);
process.exit(failed ? 1 : 0);
