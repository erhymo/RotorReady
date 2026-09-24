# RotorReady — how to work in this repo

Read this first. It is the single entry point: the architecture facts that are easy to get
wrong, the fixed recipes for routine work, and pointers to the deeper docs. If something here
disagrees with a memory or an old plan, **this file wins** — it sits next to the code and
changes in the same diff.

## What this is

A training app for helicopter pilots, covering 12 aircraft models. Next.js, deployed to
`rotor-ready.com` on Vercel, and wrapped with Capacitor as native iOS and Android apps.
~95% of use is on phones — test at phone width, not desktop.

`lib/models/catalog.ts` is the single source of truth for which models exist and what
features each one has.

---

## The rule that matters most: how a change reaches users

The app ships through **two channels that update at completely different speeds**. Getting
this wrong is the single most expensive mistake in this repo, so it is worth being precise.

| | Reaches users | How |
|---|---|---|
| **Content** (anything under `public/`: quiz JSON, System Notes, Quick Reference, Procedures, audio) | **Immediately**, on push | Fetched at runtime from the live site |
| **Code** (anything that compiles into the app bundle) | **Web: on push. Native app: only on a new store release** | Frozen into the native binary at build time |

The native app has **no `server.url`** — it boots from a bundled copy of the site
(`public-native/`, built by `scripts/build-native-shell.mjs`) so it starts instantly with or
without a connection. That bundle includes a snapshot of all content, taken at build time.

**Therefore: every fetch of a file under `public/` must go through `lib/contentUrl.ts`**
(`fetchContentJson`, `fetchContentText`, or `contentUrl`). A plain relative `fetch()` resolves
against the bundled snapshot inside the native app, so it silently serves whatever was current
at the last store release — looking perfectly fine on the web the whole time.

This is enforced mechanically by `scripts/check-content-fetch.mjs` (runs in `npm run check`,
in the pre-push hook, and in `npm run release:check`). Deliberate exceptions carry a
`content-fetch-ok: <reason>` comment. Do not add one without a real reason.

The same applies to the few `/api/*` routes the app needs: `app/api` is stripped out of the
native bundle entirely, so those calls must use `apiUrl()` from `lib/contentUrl.ts` and the
route must send CORS headers via `lib/server/nativeCors.ts`.

**Content format must stay backward compatible.** Installed apps run older code against today's
content. A content change that needs new code to render will silently break or be ignored on
every phone until the next store release.

---

## Recipes

### Verify a change

```
npm run check:fast   # while working — typecheck, lint, validate:content, content-fetch guard (~20s)
npm run check        # before pushing — all of the above plus build and nav:smoke (~5 min)
```

`npm run check` is the one that decides whether a change is good. `check:fast` is for tightening
the loop while working; it is never a substitute for the full run before a push. Do not
hand-pick individual scripts instead.

For UI changes, also look at the actual page at phone width (390px) before calling it done.
A passing type check is not evidence that a screen looks right.

Added or removed quiz questions? Run `npm run fix:counts` first. The quiz list shows each
section's size from `count` in `public/model-data/<MODEL>/index.json`, not from the section
file, and it does not update itself; `validate:content` fails when a count is missing or wrong.

### Commit and push

1. `npm run check` — must be green (the full one, not `check:fast`).
2. `git status` — every file listed should be one you meant to change. The native tooling
   rewrites two files on its own: `cap sync` rewrites `ios/App/App/Info.plist` (and drops its
   comments), and `pod install` re-indents `ios/App/App.xcodeproj/project.pbxproj`. If
   `git diff -w <file>` is empty, the change is formatting only — `git checkout -- <file>`.
3. Stage by name (`git add <files>`), never `git add -A`. Then read what is actually staged:
   `git diff --cached --stat`, and `git diff --cached <file>` for anything you are unsure of.
4. Commit with the message in a heredoc, `git commit -F - <<'EOF' … EOF`. Write **why**, not
   what: if the change fixes something subtle, say what the failure looked like and what the
   root cause was, so the next person does not re-derive it.
5. `git push origin main` — the pre-push hook runs the content-fetch guard and the
   manual-verification gate. If the gate blocks, fix the content rather than pushing with
   `--no-verify`; if you ever do bypass it, say so out loud.
6. Confirm it landed — a push is not done until both are green:
   - GitHub: `gh run list --limit 3` — Playwright E2E, Lighthouse and CodeQL, ~3–4 min.
     (Do not filter with `--commit <short-sha>`: it needs the full SHA and silently returns
     nothing, so a wait loop on it never ends.)
   - Vercel: the production deploy for the commit reaches READY, ~2–3 min. The surest sign the
     new code is serving is to request something only the new code does.

Do not commit or push without being asked to. Several unrelated changes go in separate
commits, one per theme.

**Splitting one file across two commits.** Avoid it when you can. When you cannot, build the
first commit's version of the file from `HEAD` and write it straight into the index, then check
it: `git show HEAD:<file>` → apply only the first change → `git hash-object -w <tmp>` →
`git update-index --cacheinfo 100644,<blob>,<file>` → `git diff --cached <file>`. Do not stage
hunks with `git diff -U0` + `git apply --cached --unidiff-zero`: once an earlier commit has
landed, git re-aligns the diff and that path once staged a duplicate line instead of the
intended one.

**If git itself refuses to run:**
- *"You have not agreed to the Xcode license agreements"* — the user has to run
  `sudo xcodebuild -license` in a terminal; it needs their password. Running fastlane or Xcode
  tools can trigger this.
- *`.git/index.lock` exists* — check first: `ps aux | grep "[g]it "`. Right after a commit,
  `git maintenance run --auto` often runs in the background and holds the lock for a moment;
  wait for it. Never delete the lock while a git process is running.

### Ship a native release

Code fixes only reach installed apps this way, so this is the slow path — batch changes rather
than releasing per fix.

1. `npm run appstore:status` and `npm run googleplay:status` — see what is live now.
2. `npm run check` — green.
3. Bump versions above what the stores have, or the upload is rejected:
   - Android: `versionCode` **and** `versionName` in `android/app/build.gradle`.
   - iOS: `MARKETING_VERSION` in `ios/App/App.xcodeproj/project.pbxproj` (both build
     configurations). Re-uploading the same marketing version needs a higher
     `CURRENT_PROJECT_VERSION` instead.
4. Release notes — both platforms, user-facing, what changed for a pilot:
   - iOS: replace the contents of `docs/release-notes/ios.txt` (one file, overwritten each release).
   - Android: a **new** file `android/fastlane/metadata/android/en-US/changelogs/<versionCode>.txt`.
     Without it the release ships with no notes.
5. `npm run ios:sync` and `npm run android:sync` — rebuild `public-native/` and copy it into both
   native projects. Always through these scripts, never raw `npx cap sync`: `pod install` fails
   without the UTF-8 locale the iOS script sets.
6. `npm run release:check` — **after** the sync; before it, it correctly fails with "the bundled
   shell is older than your sources". Then restore any formatting-only rewrite of `Info.plist`
   / `project.pbxproj` (see *Commit and push*).
   Then build both locally before the slow fastlane path: a simulator build for iOS and
   `(cd android && ./gradlew assembleDebug)` (see *See the native app in a simulator*), and look
   at the start screen and a couple of changed screens. A new Xcode can refuse a project that
   built last month — the iOS 15.0 pod deployment-target fix in `ios/App/Podfile` was only
   found this way.
7. Commit the version bump and release notes (recipe above).
8. iOS: `npm run ios:beta` (Release build, upload to TestFlight, ~3 min). Apple then processes
   the build; `npm run ios:submit` can only pick it once `npm run appstore:status` shows
   `Uploaded build <version> (<build>) — processing: VALID` (took ~2 min for 1.0.15). Then
   `npm run ios:submit` (screenshots, release notes, precheck, sent to review). Submission uses
   `automatic_release: false`, so **an approved version does not go live by itself** — it waits
   in `PENDING_DEVELOPER_RELEASE` until `npm run ios:release`.
9. Android: `npm run android:submit` (builds the AAB and uploads it to production as a
   **draft**, with `changelogs/<versionCode>.txt`, ~1 min). It goes live only when the rollout is
   started in Play Console. iOS and Android can run back to back but **not at the same time**:
   both rebuild the native shell, which moves `app/api` out of the tree while it builds.
10. Confirm with `npm run appstore:status` (the new version `WAITING_FOR_REVIEW`) and
    `npm run googleplay:status` (the new release `draft`, the live one `completed`).

The store APIs occasionally stall: a status call that sits for over a minute on almost no CPU
is waiting on the network, not working. Stop it and run it again.

Always run fastlane through these npm scripts, never as a bare `fastlane <lane>`: they set
`LANG`/`LC_ALL=en_US.UTF-8`. Without it, `xcpretty` crashes on the `➜` characters in
`xcodebuild`'s own output ("invalid byte sequence in US-ASCII"), the build is cut off, and
fastlane's error handler crashes on the same character — so the real log looks like a build
failure with no error in it. The full build log is `~/Library/Logs/gym/App-App.log`.
A background run's exit status only reflects the wrapper; read the `EXIT=` line or the log.

Setup, signing and credentials: `docs/app-store-ios.md` and `docs/google-play-android.md`.
Environment health: `npm run appstore:doctor`, `npm run googleplay:doctor`.

### Remove code or a dependency

1. **Prove it is unused.** For a file: nothing imports it and it is not a route or a config the
   tooling loads. For a dependency: search source files, config files, npm scripts,
   `.github/workflows` and the native projects — and **exclude `package.json` and
   `package-lock.json`**, which contain every dependency's name (an earlier check that did not
   exclude them reported "0 unused" when there were six). Things loaded by tooling are not dead
   even without an import: `react-dom`, `@capacitor/ios`/`android`, `@types/*`, ESLint and
   PostCSS plugins.
2. **Trace the chain before deleting.** What does the file import, and who else imports those?
   Removing the Stripe routes orphaned `lib/server/subscriptions/service.ts` (so it went too, in
   `6617925c`), but `firestore.ts`
   and `models.ts` had to stay because the admin dashboard reads them through `metrics.ts`.
   Also think about callers grep cannot see — a webhook is called by an outside service.
3. **Read commented-out blocks before removing them.** A detector flagged `sections/*.json`
   inside an ordinary `//` comment as a dead block.
4. Delete. For a dependency use `npm uninstall <pkg…>`, which keeps the lockfile consistent.
5. **Verify:** `npm run check`; on a dev server, removed routes answer 404 and the ones that
   stay answer as before; `npm run ios:sync` plus a simulator build, and `npm run android:sync`
   plus `(cd android && ./gradlew assembleDebug)`; the app still starts in the simulator.

### Check what is actually live in the stores

Never assume from memory or from the repo's version numbers — those are what will be shipped
next, not what users have. `npm run appstore:status` and `npm run googleplay:status` (both
read-only) ask the stores directly. Everything committed after the live build's commit is
**not** on anyone's phone.

### See the native app in a simulator

This Xcode has no Simulator GUI app, so the iOS simulator runs headless: `npm run ios:sync`,
`xcrun simctl boot "iPhone 17 Pro"`, build with `xcodebuild -workspace ios/App/App.xcworkspace
-scheme App -sdk iphonesimulator -destination 'id=<udid>' CODE_SIGNING_ALLOWED=NO build`, then
`simctl install` / `simctl launch com.rotorready.app` / `simctl io <udid> screenshot`. To see a
specific screen, copy that page's `.html` over `ios/App/App/public/index.html` before building,
and run `npm run ios:sync` afterwards to put the real start page back. `simctl ui <udid>
appearance dark` checks dark mode. Text that renders on a Mac can still break on iOS — look at
the screenshots, don't assume. (Six corrupted dashes showed as empty boxes on iOS for nine
months and were invisible in a desktop browser.)

**Prove the native app reads live content, not the bundle.** Since the shell is rebuilt from
the current sources, the bundled copy usually matches the live one and a screen alone proves
nothing. Make them differ: empty a bundled file under `ios/App/App/public/` (e.g. set `items`
to `[]` in `audio/<MODEL>/index.json`), build and launch. If the screen still shows the live
content, the fetch went to the live site. Put the file back and `npm run ios:sync` afterwards.

Android: `npm run android:sync` then `(cd android && ./gradlew assembleDebug)` checks that it
builds (~15 s once warm). An emulator exists (`Medium_Phone_API_36.0`) but has not been used.

---

## Content verification against the manuals — mandatory workflow

Background: on 2026-09-21 a wrong AFCS engagement table lived in the published app and in two
podcast episodes despite repeated requests to check it against the RFM/QRH, because the checks
compared text against a scrambled `pdftotext` dump instead of the manual's page images, and a
plain "ok" was returned with no evidence. Full story: `docs/verification/README.md`.

**Whenever asked to check, verify, or audit app content (System Notes, Quick Reference, quiz,
procedures, podcast scripts) against the RFM/QRH/POH — do all of this, every time:**

1. Check every claim against the manual's **rendered page image** — never a `pdftotext` dump.
   The default is to do this in-session: render the pages (`pdftoppm -f N -l N -r 130 -png`),
   read them, and record each decision in `docs/verification/<model>/<kind>.json` with
   `"method": "manual-claude-page-read"` and a page-cited note. It costs nothing.
   `npm run verify:content -- --model <model> --kind <kind>` does the same through paid
   Gemini/Anthropic APIs; use it only when the user asks for a batch sweep.
2. Run `npm run verify:coverage` and report the table: what was actually checked, what is
   `reviewed`, and — just as important — what is **not covered at all**. Never claim "all good"
   without this table.
3. If the paid sweep was used, review every `flag`/`disputed`/`unlocated` unit it produced
   against the page image yourself before deciding. Record the decision with evidence in
   `docs/verification/<model>/reviews.json`, or fix the content so it becomes `ok`.
4. Fix errors found without waiting for permission, then say afterwards what was wrong and what
   changed.
5. A bare "ok" / "looks fine" / "checked, no issues" about manual-sourced content is never
   acceptable without the ledger and coverage table behind it.

The `pre-push` hook runs `verify_claims.py --gate` and blocks a push that edits a claim which is
not verified for the registered models. It gates only what the push *changes*, not pre-existing
backlog.

Extending coverage to a new model or content kind is real work — a source has to be registered
in `SOURCES`/`FILES` in `scripts/verify/verify_claims.py` and given a first full run. Treat it
as its own task, never as something to quietly skip.

## Writing new content: never from pattern, always from the source

Background: on 2026-09-23, verifying 29 AS350 B3 2B1 procedures turned up 10 real errors,
several of them **fabrications with no basis in the RFM** — an invented emergency step that
reads exactly like a real one, a battery mode that appears nowhere in the document, a real RFM
phrase copied onto the wrong table. Root cause: the content was written from what that kind of
section *usually* contains, not from the page in front of us.

When writing System Notes, Quick Reference, Procedures, quiz content or podcast scripts from an
RFM/QRH/POH:

- Build every specific claim — a step, a control name, a mode, a number — from the actual
  manual page. If a step would complete the pattern but you cannot point at the page it came
  from, leave it out.
- Prefer extracting a section from its rendered page over paraphrasing from memory, especially
  for decision tables and flowcharts, where branch attachment flips easily.
- New content is not done when it reads well. It is done when every claim has been checked
  against the page image and recorded in the ledger (step 1 of the workflow above), exactly as
  a re-check of old content would be.

---

## Where the deeper docs are

| Topic | File |
|---|---|
| Content verification, in full | `docs/verification/README.md` |
| Where each topic lives in each model's manual | `docs/verification/rfm-chapter-map.md` |
| Release notes (iOS; Android is per-versionCode in `android/fastlane/metadata`) | `docs/release-notes/ios.txt` |
| Writing quiz questions | `docs/quiz-oppskrift.md`, `docs/question-authoring.md` |
| Podcast scripts and voicing | `docs/podcast-master-prompt.md` |
| iOS / App Store | `docs/app-store-ios.md` |
| Android / Google Play | `docs/google-play-android.md` |
| H125 SVG conventions | `docs/h125-svg-standards.md` |
| Why the native shell is built the way it is | the comment at the top of `capacitor.config.ts` |
