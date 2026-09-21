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
```

Needs `GEMINI_API_KEY` in `.env` (project needs Gemini credits). Daily request quota per model applies: `gemini-3.1-pro`
allowed 250 requests/day on 2026-09-21, so the strong pass is spread over days.

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
