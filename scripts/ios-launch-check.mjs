#!/usr/bin/env node
// Proves that the iOS app actually starts on the newest iOS this Mac can simulate:
// builds the Release configuration for the simulator, installs it on a dedicated
// simulator running the newest installed iOS runtime, launches it, and fails if the
// process is gone after LAUNCH_WAIT_MS.
//
// Why this exists: 1.0.15 was the first build made with Xcode 27 (iOS 27 SDK). It
// passed every check, installed, and was approved — and then refused to launch at all
// on iOS 27 ("UIScene life cycle is required for apps built with this SDK"), while
// running fine on iOS 26, where it had been looked at. A screenshot on an older iOS
// proves nothing about a newer one, and a successful build proves nothing about launch.
// Run by `npm run release:check`, so a release cannot skip it.
//
// Usage: node scripts/ios-launch-check.mjs   (needs a synced ios/ project: npm run ios:sync)

import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const BUNDLE_ID = "com.rotorready.app";
const DEVICE_NAME = "RotorReady launch check";
const LAUNCH_WAIT_MS = 15_000;

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function newestIosRuntime() {
  const { runtimes } = JSON.parse(run("xcrun", ["simctl", "list", "runtimes", "-j"]));
  const ios = runtimes
    .filter((r) => r.platform === "iOS" && r.isAvailable)
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
  if (!ios.length) throw new Error("no available iOS simulator runtime");
  return ios[0];
}

function deviceFor(runtime) {
  const { devices } = JSON.parse(run("xcrun", ["simctl", "list", "devices", "-j"]));
  const existing = (devices[runtime.identifier] || []).find((d) => d.name === DEVICE_NAME && d.isAvailable);
  if (existing) return existing.udid;
  const iphone = runtime.supportedDeviceTypes.filter((t) => t.productFamily === "iPhone").pop();
  if (!iphone) throw new Error(`runtime ${runtime.name} supports no iPhone`);
  return run("xcrun", ["simctl", "create", DEVICE_NAME, iphone.identifier, runtime.identifier]).trim();
}

const runtime = newestIosRuntime();
const udid = deviceFor(runtime);
console.log(`[ios-launch-check] ${runtime.name} on "${DEVICE_NAME}" (${udid})`);

spawnSync("xcrun", ["simctl", "boot", udid], { stdio: "ignore" }); // fails harmlessly if already booted
run("xcrun", ["simctl", "bootstatus", udid, "-b"]);

const derived = mkdtempSync(path.join(os.tmpdir(), "rr-launch-check-"));
let failed = false;
try {
  console.log("[ios-launch-check] building Release for the simulator...");
  const build = spawnSync(
    "xcodebuild",
    ["-workspace", "App.xcworkspace", "-scheme", "App", "-configuration", "Release",
      "-sdk", "iphonesimulator", "-destination", `id=${udid}`, "-derivedDataPath", derived,
      "CODE_SIGNING_ALLOWED=NO", "build"],
    { cwd: path.join(ROOT, "ios/App"), encoding: "utf8", env: { ...process.env, LANG: "en_US.UTF-8", LC_ALL: "en_US.UTF-8" } }
  );
  if (build.status !== 0) {
    console.error((build.stdout || "").split("\n").filter((l) => /error:/.test(l)).slice(0, 20).join("\n"));
    throw new Error("simulator build failed");
  }
  const app = path.join(derived, "Build/Products/Release-iphonesimulator/App.app");

  spawnSync("xcrun", ["simctl", "terminate", udid, BUNDLE_ID], { stdio: "ignore" });
  run("xcrun", ["simctl", "install", udid, app]);
  run("xcrun", ["simctl", "launch", udid, BUNDLE_ID]);
  await sleep(LAUNCH_WAIT_MS);

  const running = run("xcrun", ["simctl", "spawn", udid, "launchctl", "list"]).includes(BUNDLE_ID);
  if (!running) {
    failed = true;
    const log = spawnSync("xcrun", ["simctl", "spawn", udid, "log", "show", "--last", "1m", "--style", "compact",
      "--predicate", 'process == "App" AND messageType == error'], { encoding: "utf8" }).stdout || "";
    console.error(log.split("\n").filter((l) => /failed|fatal|required|exception/i.test(l)).slice(-10).join("\n"));
    console.error(`[ios-launch-check] FAIL: the app was not running ${LAUNCH_WAIT_MS / 1000}s after launch on ${runtime.name}.`);
  } else {
    console.log(`[ios-launch-check] ok: still running ${LAUNCH_WAIT_MS / 1000}s after launch on ${runtime.name}`);
  }
  spawnSync("xcrun", ["simctl", "terminate", udid, BUNDLE_ID], { stdio: "ignore" });
} catch (err) {
  failed = true;
  console.error(`[ios-launch-check] FAIL: ${err.message}`);
} finally {
  rmSync(derived, { recursive: true, force: true });
  spawnSync("xcrun", ["simctl", "shutdown", udid], { stdio: "ignore" });
}
process.exit(failed ? 1 : 0);
