Data layout

- New normalized datasets live under:
  - `sections/*.json` — question banks per section (e.g. `afm.json`, `qrh.json`)
  - `QuickTen/*` — light definitions and mapping to QRH procedures
  - `QRH/procedures.json` — structured procedures (steps, notes)
  - `versions/data-version.json` — simple version marker

- Legacy file kept for reference:
  - `all-questions.json` — deprecated, inconsistent structure; no runtime usage.

Consumers in app:
- `app/quiz/[section]/[amount]/page.tsx` loads from `sections/{id}.json` and renders an interactive client quiz.
- `app/quick-ten/quiz/page.tsx` maps `QuickTen/lights.json` → `QRH/procedures.json` and renders via `QRHProcedureLayout`.

