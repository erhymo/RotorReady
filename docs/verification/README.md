# Content verification against the manuals

App content (System Notes, Quick Reference, later quiz/procedures) is checked against the official RFM/QRH **page images**
by `scripts/verify/verify_claims.py`. Text dumps (`pdftotext`) are never used as evidence: they scramble multi-row tables,
and on 2026-09-21 that let a wrong AFCS engagement table (GA/TD/TDH) live in the app while text-based checks passed.

## Run

```
npm run verify:content -- --model AW169_EP --kind quick-reference
npm run verify:content -- --model AW169_EP --kind system-notes
npm run verify:content -- --model AW169 --kind quick-reference
npm run verify:content -- ... --require-strong     # re-check units that only flash-class readers have judged

npm run verify:coverage      # table: per model/kind, how much is ok/strong/flash/reviewed/never-checked/stale/unregistered
npm run verify:gate          # what a `git push` right now would block on (what THIS push changes, not the backlog)
```

Needs `GEMINI_API_KEY` in `.env` (project needs Gemini credits) and, since 2026-09-23, `ANTHROPIC_API_KEY` (project
needs Anthropic credits) for the default `--readers`. Daily request quota per model applies: `gemini-3.1-pro-preview`
allowed 250 requests/day on 2026-09-21, so a Gemini-pro-only pass has to be spread over days.

**Two independent readers, on purpose.** The default is `gemini-3.1-pro-preview,claude-sonnet-5` — a Gemini reader and
a Claude reader, not two tiers of the same family. Claude wrote much of this app's content, so having Claude also be
the sole judge of whether it's correct risks the same blind spots that caused the original AFCS error; an unrelated
model reading the page image fresh is a real second opinion, not a formality. When the Gemini pro quota is exhausted
for the day, pass `--readers claude-sonnet-5,gemini-3.7-flash` to keep going without waiting — Claude then also
satisfies `strong` (see `is_strong()`: any pro-class Gemini or any Claude model counts, not the same-family flash
tier). A `claude-*` model name is dispatched to the Anthropic Messages API; note Claude 5 models reject a
`temperature` parameter (omitted, not set to 0, unlike the Gemini call).

## Coverage report (`--report`) and the push gate (`--gate`)

`--report` never contacts Gemini — it's a static read of the ledgers, so it's cheap and safe to run anytime, and it is
the answer whenever anyone asks "is the app content correct" or "what have you actually checked": it always prints,
per model+kind, how many claims are `ok` (split strong pro-model vs flash-only), `reviewed`, `never_checked`, `stale`
(content edited since it was last checked), and whether the model/kind is registered at all. An unregistered
model/kind is never silently skipped — it prints as `NOT REGISTERED (never verified)`.

`--gate` is what `.githooks/pre-push` runs on every `git push` (installed automatically by `npm install`, see
`scripts/setup-hooks.mjs` — this repo uses `core.hooksPath .githooks` instead of the untracked `.git/hooks/`, so the
hook travels with clones). It diffs the content files against the push's base commit, and for every claim that is
genuinely new or edited by the push (not the rest of a file that happens to also be touched), requires it to be `ok`
or `reviewed` in the ledger for the currently-registered models. Pre-existing backlog elsewhere in the file — e.g. the
145 AW169 Standard System Notes units that have never been run through the tool at all — does not block unrelated
pushes; `--report` is how that backlog stays visible instead of being forgotten. A push can be forced past the gate
with `git push --no-verify`, which should be rare and worth mentioning when it happens.

This was added 2026-09-22 after the gate itself caught a real case: an earlier hand-edit to the ditching liferaft note
(fixing one flagged phrase) had introduced an unsupported detail ("hinged-doors configuration", not in the RFM at
all) while never re-running the verifier on the edit. `--gate` flagged it as `stale`; it was corrected against the
RFM Section 7 system description and Supplement 11 pages and is `ok` again. Exactly the failure mode this exists to
catch: an edit made without re-verification, sitting unnoticed in the published app.

## How it works

1. Every content unit (a Quick Reference item, a table row, a paragraph containing numbers, a table note) is one *claim*.
2. Candidate manual pages are retrieved from the text dump (retrieval only), rendered to PNG, and shown to a vision model.
3. Two different models judge the claim; each issue has a severity (`material`, `omission`, `minor`) and a quoted page.
4. Status: `ok` (all readers pass), `flag` (all found a problem), `disputed` (readers disagree), `unlocated` (no page found),
   `error` (technical). A pass with no cited page is treated as `unlocated`, never as `ok`.
5. `ledger` files (`<model>/<kind>.json`) key each unit on a hash of its text plus the source revision, so a scheduled run
   only re-checks what changed, or everything after a new RFM/QRH revision.
6. Every `flag`/`disputed` unit must be reviewed by a person or Claude **against the page image**. The decision goes into
   `<model>/reviews.json` (`accepted` with the page evidence, or the content is fixed and re-verified).

## What this does NOT guarantee

- It flags; a model can miss an error (flash-class readers are more lenient than pro) or flag a correct claim when retrieval
  did not find the right page. The regression test (old AFCS table, `git show ff1f4f82~1`) is the bar: GA, TD, TDH rows and
  the 35 KIAS note must be flagged. Re-run it after changing prompts or retrieval.
- Only paragraphs containing digits are checked in System Notes. Pure explanations ("why") are not verified.
- Sources registered so far: `AW169_EP` (RFM EP Rev 5 + QRH EP Rev 3) and `AW169` (RFM Standard Issue 3 Rev 1, no QRH).
  Other models, quiz sections, procedures and podcast scripts are not covered yet.
