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

### Commit and push

1. `npm run check` — must be green (the full one, not `check:fast`).
2. `git status` — review what is staged; add files by name, never `git add -A` blindly.
3. Commit. Write **why**, not what. If the change fixes something subtle, say what the failure
   looked like and what the root cause was, so the next person does not re-derive it.
4. `git push` — the pre-push hook runs the content-fetch guard and the manual-verification
   gate. If the gate blocks, fix the content rather than pushing with `--no-verify`; if you
   ever do bypass it, say so out loud.
5. After the push, confirm it landed: `gh run list --limit 3` (GitHub runs Playwright E2E,
   Lighthouse and CodeQL on every push to main) and the Vercel production deploy for the
   commit. A push is not done until both are green.

Do not commit or push without being asked to.

Two things the native tooling rewrites on its own — review before staging, and restore them
if the diff is only formatting: `cap sync` rewrites `ios/App/App/Info.plist` (and drops its
comments), and `pod install` re-indents `ios/App/App.xcodeproj/project.pbxproj`.

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
7. Commit the version bump and release notes (recipe above).
8. iOS: `npm run ios:beta` (Release build, upload to TestFlight), then `npm run ios:submit` (sends
   it to review). Submission uses `automatic_release: false`, so **an approved version does not
   go live by itself** — it waits in `PENDING_DEVELOPER_RELEASE` until
   `cd ios && fastlane release_pending`.
9. Android: `cd android && fastlane submit_review` (builds the AAB and uploads it to production
   as a **draft**). It goes live only when the rollout is started in Play Console.
10. When both are out, `npm run appstore:status` / `npm run googleplay:status` to confirm.

Setup, signing and credentials: `docs/app-store-ios.md` and `docs/google-play-android.md`.
Environment health: `npm run appstore:doctor`, `npm run googleplay:doctor`.

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
the screenshots, don't assume.

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
