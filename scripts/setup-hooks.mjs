#!/usr/bin/env node
// Points git at the repo's tracked hooks (.githooks/) instead of the untracked, per-clone .git/hooks/.
// Runs automatically on `npm install` (see package.json "prepare"), so the content-verification
// pre-push gate (scripts/verify/verify_claims.py --gate, docs/verification/README.md) is on by
// default for every clone/checkout without anyone remembering to install it by hand.
import { execFileSync } from "node:child_process";

try {
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "pipe" });
  console.log("git hooks -> .githooks (content-verification pre-push gate is active; bypass a single push with --no-verify)");
} catch {
  // not a git checkout (e.g. installed as a dependency) - nothing to do
}
