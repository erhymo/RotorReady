# Podcast / study-audio master prompt

The single spec every RotorReady study-audio episode is written and produced against —
any model, any topic (system deep-dives, limitations, procedures, and the CWP
"tap the light, hear the explanation" clips). It consolidates the older scattered
notes (minimal-filler style, abbreviation spoken forms, file naming, the
script-pipeline trial) into one place. If this document and an older note disagree,
this document wins.

Two audiences, both served by the same rules: a line pilot who already knows the
drill and wants the *reasoning* as a refresher, and a type-rating candidate who
needs the numbers and the failure logic cold.

---

## A. Sourcing — non-negotiable

1. **One source only: the model's own approved documents already in `_source/`** —
   RFM / POH / QRH / FLM / PCL and their full-text extractions. Never the web,
   never memory, never another model's manual, never NotebookLM's own report /
   compendium generator.
2. **Every number, limit, threshold, mode, caption and procedure step must be
   traceable to a specific section and page** of that document. Keep the segment
   map (section E) so the trace is written down.
3. **Config-specific values:** use the values for the *exact* variant. AW169 EP is
   document `169F0290X012`; AW169 Standard is `169F0290X001`; they differ in
   places (e.g. ENG FAIL FIXED shutdown time, power-index limits). Note where the
   variant differs *if the manual flags it*. Do not pull a value from a different
   variant or model to fill a gap.
4. **The "why" you may add, and how.** The source often gives an instruction with
   no reason. You may explain the reason using, in this order of preference:
   (a) the source's own adjacent text (a CAUTION usually *is* the reasoning);
   (b) another section of the *same* manual (e.g. Section 7 system description);
   (c) a principle that is universally true for turbine engines, rotor
   aerodynamics, hydraulics or electrical systems and is not config-specific.
   When the reason comes from (c) — or from your own logical reading rather than a
   stated mechanism — **say so out loud**: "the manual doesn't state why; the
   general principle is…". 
5. **Never invent.** No number, threshold, step, branch, mode, caption, system
   behaviour, or "you'll feel a yaw / hear a bang" that is not in the source.
   A flattened or re-ordered branch structure counts as inventing.

---

## B. Content & structure

- **Two hosts.** A lead (`ASH`) who walks the material, and a co-host (`SAGE`) who
  asks the question a line pilot would actually ask and adds the engineering
  logic. Neither cheerleads; the co-host is not there to agree.
- **Procedures:** the numbered / immediate-action items first, **in their real
  numbers, in order**, before any branch. Then the named conditional paths
  ("if it clears" / "if it remains" / "if TQ ≤ 50%") as branches that follow.
  Never renumber the branch content into one flat list with the numbered items,
  and never open with a branch step.
- **Systems and modes:** a fixed frame every time — (1) what it holds or
  commands; (2) where / when it applies — engagement envelope, limits, minimum
  use height; (3) what it does **not** do, and what disables or drops it.
- **Numbers, for audio recall:** state the number → anchor it to a picture
  ("230 feet for DCL — the highest floor on the list, because…") → contrast it
  with its neighbours rather than reading a flat list → repeat the load-bearing
  numbers across segments so they compound → end every segment with a tight
  spoken recap of *just* the numbers.
- **Length is proportional to the source.** A one-step drill is ~2 minutes; a
  multi-branch system is longer. Do not pad to hit a target length. Split a large
  topic (AFCS, electrical) into a short series of independently-useful parts under
  one `group`, plus a "cold recap" part that is numbers and fault-set only, no
  explanation — for the night before a checkride.
- **Cues.** For the CWP clip format: the segment's first spoken words are
  `Light: <panel legend exactly as printed>` and the last are `End of light.`,
  each with a clear pause, woven into no sentence — they exist so the audio can be
  cut. For topic episodes: a defined short open and a defined close, no preamble
  that restates this brief, no "in this episode / segment / clip", no mention of
  cutting or production.
- **Self-contained segments.** A listener who hears one segment and nothing else
  must never sense that another segment exists or touches the same system. No
  "as we covered / like the other one / similarly / circles back / earlier we".

---

## C. Tone & delivery

- **Minimal filler.** Every sentence carries information. No "right / exactly /
  yeah / you know / kind of / so anyway", no banter, no padding analogies. One
  precise analogy is fine when it genuinely lands; three are noise.
- **Calm and procedural.** Describe warnings, alerts and failures factually —
  what triggers, what it means, what the pilot does, why. Avoid "screaming /
  blaring / shatter / nightmare / assaulting your senses / the digital brain" and
  any framing that makes the operation sound more dangerous or chaotic than the
  source conveys. State cautions the way a calm, experienced instructor would.
- **Abbreviations.** The first time one is used *within a segment*: say the
  abbreviation, then the full term, then a short plain-English gloss; then just
  the abbreviation for the rest of that segment. Re-explain it if it recurs in a
  later segment. Follow the canonical spoken-forms table
  (`reference_afcs_abbreviation_spoken_forms` memory): some revert to a word
  (HDG → heading, KIAS → knots, TOT → turbine temp), some stay a word (NAV), some
  are spelled out (SAS, VNE, N1, CG, OEI).
- **Seating.** In these aircraft the PIC / solo pilot is in the **right** seat.
  Never default to "left seat" as the normal position.
- **One aircraft.** Never mention, compare to, or reference another helicopter
  make or model, and never discuss whether a value applies relative to other
  types.

---

## D. Production pipeline

- **Script file:** `_source/podcast/Podcast/<model>/<area>/<id>-script.txt`
  (use the model's existing podcast folder). Lines are `ASH|<text>` or
  `SAGE|<text>`, one utterance per line, blank lines ignored.
- **Voices:** `verse` (lead / `ASH`) + `nova` (co-host / `SAGE`) — locked, for
  consistency across every episode and model. TTS model: `gpt-4o-mini-tts`.
  (Changed 2026-09-13 from `sage`: A/B tested against `nova`/`shimmer`/`coral`
  with the same line and instructions after repeated feedback that `sage` read
  flat/low-energy for an engaged co-host role — `nova` was the clear winner.
  Every AW169 EP episode was regenerated under this voice as the full switch-
  over; any earlier episode anywhere still using `sage` predates that change
  and should be treated as due for the same replacement, not a second style.)
- **Generator:** `scratchpad/gen_tts.sh <script> <out.mp3> [atempo] [voiceA] [voiceB]`
  — per-line call to `POST https://api.openai.com/v1/audio/speech` with a shared
  delivery `instructions` string ("engaged, present instructor, natural varied
  intonation, not monotone, not theatrical, brisk refresher pace"), concat the
  turns with ~0.30 s gaps (0.55 s after the opening cue), two-pass
  `loudnorm I=-16:TP=-1.5:LRA=11` then `libmp3lame -q:a 3`. `atempo` ~1.09–1.12
  for pace. Key from repo `.env` (`OPENAI_API_KEY`); confirm spend with the user
  first. `curl` needs `--retry` / `--max-time` and must not trip `set -e`.
- **Verify:** transcribe the finished mp3 with `whisper-cli` and check it against
  the source — full transcript for any branch-heavy script, and head/tail cue
  integrity + `-16 LUFS` on every clip.
- **Place & register:** copy the `.mp3` to `_source/podcast/Podcast/<model>/...`
  and to `public/audio/<MODEL_ID>/` (or `.../lights/`). Add or append an entry to
  the relevant `index.json`: `id`, `title`, `description`, `filename`,
  `durationSeconds`, and `group` for a multi-part topic. A new alternative for an
  existing episode goes at the **bottom / inside its group** with a distinct id so
  the incumbent can be A/B compared — do not delete the incumbent until the user
  picks. The `-16 LUFS` target and the `group` grouping in `app/audio/page.tsx`
  are the app-side contract.
- **Titles / naming:** episode `title` in `index.json` leads with the system
  abbreviation ("ADELT: …", "AFCS: …"). Multi-part titles: `AFCS · 2 — Upper
  modes` style, all sharing `"group": "AFCS"`. Staging `.m4a`/`.txt` files under
  `_source/podcast/Podcast/` are the source of truth and are never deleted after
  deploy — the folder mirrors what is live.
- **Cost:** `gpt-4o-mini-tts` ≈ USD 0.015 per minute of audio (script text is
  negligible on top). A 50-minute episode ≈ USD 0.75. The real cost is the hours
  of scriptwriting + generation + verification, not money.

---

## E. Per-topic prep (do this before writing any script)

Produce a **segment map from the source** and get it approved:

- every fact / number / rule, each tagged with its section and page;
- config-specific values flagged (which variant, and where it differs);
- the proposed split into parts, with target lengths, and which "why" points
  come from the source directly vs. from a flagged general principle;
- the open/close cues for each part.

Only after the map is approved: write the `ASH|`/`SAGE|` script, generate,
verify, register.
