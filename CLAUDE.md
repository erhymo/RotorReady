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
| **Code** (anything that compiles into the app bundle) | **Only on a new store release** | Frozen into the native binary at build time |

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

Do not commit or push without being asked to.

### Ship a native release

Code fixes only reach installed apps this way, so this is the slow path — batch changes rather
than releasing per fix.

1. `npm run check` — green.
2. Bump versions in `android/app/build.gradle` (`versionCode` **and** `versionName`) and
   `ios/App/App.xcodeproj` (`MARKETING_VERSION`). Both must be higher than what is already in
   the stores, or the upload is rejected.
3. `npm run release:check` — this catches the classic mistake of archiving without rebuilding
   the bundled shell.
4. `npm run ios:sync` / `npm run android:sync` — rebuilds `public-native/` and syncs.
5. Build and submit: see `docs/app-store-ios.md` and `docs/google-play-android.md`.

Read-only status, safe to run any time:
`cd ios && fastlane status` (App Store version states), `npm run appstore:doctor`,
`npm run googleplay:doctor`.

### Check what is actually live in the stores

Never assume from memory or from the repo's version numbers — those are what will be shipped
next, not what users have. Ask the stores: `cd ios && fastlane status`, and for Android the
`google_play_track_version_codes` lane. Everything committed after the live build's commit is
**not** on anyone's phone.

---

## Content verification against the manuals — mandatory workflow

Background: on 2026-09-21 a wrong AFCS engagement table lived in the published app and in two
podcast episodes despite repeated requests to check it against the RFM/QRH, because the checks
compared text against a scrambled `pdftotext` dump instead of the manual's page images, and a
plain "ok" was returned with no evidence. Full story: `docs/verification/README.md`.

**Whenever asked to check, verify, or audit app content (System Notes, Quick Reference, quiz,
procedures, podcast scripts) against the RFM/QRH/POH — do all of this, every time:**

1. Run `npm run verify:content -- --model <model> --kind <kind>`. This reads the manual's
   rendered page images, never a text dump.
2. Run `npm run verify:coverage` and report the table: what was actually checked, what is
   `reviewed`, and — just as important — what is **not covered at all**. Never claim "all good"
   without this table.
3. Review every `flag`/`disputed`/`unlocated` unit against the page image yourself before
   deciding. Record the decision with evidence in `docs/verification/<model>/reviews.json`, or
   fix the content and re-run so it becomes `ok`.
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
- New content is not done when it reads well. It is done when it has been through the verifier,
  exactly as a re-check of old content would be.

---

## Where the deeper docs are

| Topic | File |
|---|---|
| Content verification, in full | `docs/verification/README.md` |
| Writing quiz questions | `docs/quiz-oppskrift.md`, `docs/question-authoring.md` |
| Podcast scripts and voicing | `docs/podcast-master-prompt.md` |
| iOS / App Store | `docs/app-store-ios.md` |
| Android / Google Play | `docs/google-play-android.md` |
| H125 SVG conventions | `docs/h125-svg-standards.md` |
| Why the native shell is built the way it is | the comment at the top of `capacitor.config.ts` |
