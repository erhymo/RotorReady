# Content verification against the manuals — mandatory workflow

Background: on 2026-09-21 a wrong AFCS engagement table lived in the published app and in two podcast
episodes despite the user repeatedly asking for it to be checked against RFM/QRH, because the checks used
to answer "is it correct?" compared text to a scrambled `pdftotext` dump instead of the manual's page images,
and a plain "ok" was returned with no evidence. This must never happen again. Full story and the fix:
`docs/verification/README.md` and the memory `feedback_content_audit_must_show_evidence.md`.

**Whenever the user asks to check, verify, or audit app content (System Notes, Quick Reference, quiz,
procedures, podcast scripts) against the RFM/QRH/POH — do all of this, every time:**

1. Run `npm run verify:content -- --model <model> --kind <kind>` for the content in scope. This reads the
   manual's rendered page images, never a text dump.
2. Run `npm run verify:coverage` and report the table: what was actually checked (and by a strong/pro or
   only a flash-class reader), what is `reviewed`, and — just as important — what is **not covered at all**
   (unregistered model/kind, or `never_checked`/`stale` units). Never claim "all good" without this table.
3. Review every `flag`/`disputed`/`unlocated` unit against the manual page image yourself before deciding;
   record the decision with evidence in `docs/verification/<model>/reviews.json`, or fix the content and
   re-run step 1 so it becomes `ok`.
4. Fix errors found without waiting for permission (standing rule, see `feedback_fix_errors_without_asking`),
   then tell the user afterwards what was wrong and what changed.
5. A bare "ok"/"looks fine"/"checked, no issues" reply about manual-sourced content is never acceptable
   without the ledger + coverage table behind it.

**Enforcement, not just intention:** a `pre-push` git hook (`.githooks/pre-push`, installed automatically by
`npm install` via `scripts/setup-hooks.mjs`) runs `verify_claims.py --gate` and blocks a push that edits a
System Notes/Quick Reference claim which is not verified `ok` (or reviewed) for the currently registered
models. It only gates what *changed* in the push, not pre-existing backlog — see the script's `--report`
output for backlog. A push can be forced past it with `git push --no-verify`, but that should be rare and is
its own signal that verification is being skipped; mention it if it happens.

Extending coverage (new model, quiz sections, procedures, podcast scripts) is real work — a source has to be
registered in `SOURCES`/`FILES` in `scripts/verify/verify_claims.py` and given a first full run — so treat it
as its own task, not something to silently skip past when it isn't there yet.
