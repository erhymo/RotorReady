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
   **Never tell the listener that the manual is silent.** No "the manual doesn't
   say why", "we won't invent a reason", "that's as far as the manual takes it" —
   that is meta-commentary about sourcing, and the listener is a pilot learning a
   system, not an auditor of the research. Two options only: if the reason follows
   plainly from documented facts, state it as the reason; otherwise say nothing
   about the gap and just give the instruction. Grep new scripts for
   "manual does not" / "manual will not" / "not the reason" before generating.
   (Corrected 2026-09-15 — this section previously said the opposite.)
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
- **Walk a flight when the material allows it — standing default.** For topics
  whose items map onto phases of flight (Limitations, AFCS, and similar), structure
  the episode as **one continuous sortie** and introduce each limit, mode or failure
  at the point the pilot actually meets it, not in the order the manual lists them.
  AW189 Limitations (2026-09-14) is the reference implementation: loading on the
  ramp → whether the day allows it → APU and engine start with duty cycles and the
  ITT start limit → rotor brake → taxi and doors → hover wind envelope and take-off
  power → cruise airspeeds and fuel → IFR → OEI and power-off rotor bands. Fold
  failures into the moment they would appear rather than bolting a malfunction list
  on the end, and close with a numbers-only cold recap so it still works as revision.
  **Do not force it** where there is no natural sequence — Electrical works built up
  in layers then taken apart, Fire bay by bay in ground/flight pairs, Hydraulics
  around what the aircraft isolates, RNP around what you have lost. Pick the frame
  before writing.

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
  later segment. Then follow the canonical spoken-forms table in section F — it is
  genuinely mixed, not one uniform rule, which is why it is a lookup table.
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
- **Voices (standard from 2026-09-20):** Gemini `gemini-2.5-pro-preview-tts`, two speakers
  in one call so the voices react to each other — `Orus` (lead / `ASH`) + `Aoede`
  (co-host / `SAGE`). Chosen by the user after a blind comparison of five samples
  (OpenAI current settings, OpenAI looser settings, Google Chirp 3 HD, Gemini Flash,
  Gemini Pro): the Gemini Pro two-speaker sample won. Episodes published before
  this date (OpenAI `verse` + `nova`, and older `sage`) stay as they are until
  the user asks for them to be re-cut; do not mix voices inside one multi-part
  topic — re-cut the whole group.
- **Generator:** `python3 scripts/podcast-tts.py <script> <out.mp3>` (options
  `--model`, `--lead`, `--co`, `--chunk`). Sends 8 turns per request with a style
  prompt ("real podcast conversation… say every word exactly as written"), joins
  chunks with a 0.35 s gap, single-pass `loudnorm I=-16:TP=-1.5:LRA=11`, mp3.
  Key: `GEMINI_API_KEY` in the repo `.env` (project needs Gemini API credits;
  check the balance in AI Studio before a long batch). Models are `preview`, so
  Google may change them: if a new render sounds different, say so.
  **Fallback:** the previous OpenAI path (`gpt-4o-mini-tts`, `verse` + `nova`,
  ≈ USD 0.015/min) still works from a session-local `gen_tts.sh` if Gemini is
  unavailable, but tell the user before using it.
- **Verify:** transcribe the finished mp3 with `whisper-cli` and check it against
  the source — full transcript for any branch-heavy script, and head/tail cue
  integrity + `-16 LUFS` on every clip. Checking the *numbers* is necessary but not
  sufficient; two other classes reached published episodes on 2026-09-14:
  - **Outside-frame references** — text that is factually right but does not belong
    in a helicopter-only product: fixed-wing framing ("most of what pilots know
    about TCAS comes from fixed wing"), "airplane"/"aeroplane" meaning the aircraft,
    fourth-wall breaks about the app or our own past bugs, and other models.
    Grep the script *and* the transcript for
    `fixed.?wing|airplane|aeroplane|in the app|filed as|copied over|data behind`
    plus the other model names.
  - **TTS mispronunciation the numeric check cannot see** — the model designation
    came out "AW819" and "AW89" mid-sentence (fix by rewording to avoid the number,
    not by regenerating and hoping), and `Two 25-kVA starter-generators` was voiced
    "225 KVA" (any `<number> <number>-<unit>` construction is ambiguous aloud —
    write "Two starter-generators, twenty-five KVA each"). Transcribe the first 3 s
    separately to confirm the opening cue names the model correctly, and re-check
    anything suspicious at 0.6x before dismissing it as a transcription artifact.
  - The whisper model lives in the session scratchpad and is cleared between
    sessions. A missing model makes whisper fail **silently** with empty
    transcripts rather than erroring — re-download rather than assuming it is there.
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
- **Cost:** measured per episode in AI Studio, not estimated here; the real cost is the hours of
  scriptwriting + generation + verification. Gemini can drop or alter words, so the
  whisper check against the script is mandatory for every full episode.

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

---

## F. Canonical spoken forms

What the voice says on **every mention after** the first-use expansion. Built from the
user's own corrections, not from assumptions — an early guess that SAS and FMS were said
as words was wrong. **If an abbreviation is not on this list, ask rather than guess.**

### Revert to the plain word or phrase
HDG → "heading" · ALT → "altitude" · APP → "approach mode" · VS → "VS mode" ·
IAS → "airspeed" · GA → "go-around" · FD → "flight director" · YD → "yaw damper" ·
ATT → "attitude" · BC → "back course" · GS → "glideslope" · KIAS → "knots" ·
TAS → "true airspeed" · TOT → "turbine temperature" (not "turbine outlet temperature") ·
TQ → "torque" · MGB → "main gearbox" · TGB → "tail gearbox" · TR → "tail rotor" ·
AMSL → "above mean sea level" · DH → "decision height" ·
EGPWS → "ground proximity warning" (short form) · WAT → "weight altitude temperature" ·
HIGE / HOGE / IGE / OGE → the full phrase ("Hover In Ground Effect" etc.)

### Said as a word, never spelled
NAV · ALTA · VNAV ("V-NAV") · LNAV ("L-NAV") · FADEC ("fay-dek") · TCAS ("tee-kas")

### Always spelled out, even after first mention
SAS · FMS · PFD · MFD · EDCU · NVG · VNE · NR · NG · N1 ("N-one") · N2 ("N-two") ·
ITT · OAT · AGL · CG · OEI · AEO · HYD · ADF · DME · VOR · ILS · GPS · VFR · IFR

VOR is spelled despite NAV/VNAV/LNAV being spoken as words — do not reason by analogy.

### Hybrid
NVIS → "N-VIS" (N spelled, VIS as a syllable) · HTAWS → "H-TAWS"

Because this is script text fed straight to a TTS engine, write the phonetic hint in at
**every** occurrence, not just the first.

### Not yet answered — do not guess
ECU, EEC. Asked 2026-08-16; the user skipped them. Ask again before use.

**Why this table exists,** in the user's words: *"når de snakker om HDG, så sier de H D G
også sier heading … men når de fortsetter å snakke om det så sier de H D G, jeg vil at de
da sier heading, da blir det lettere å følge med for vi sier også heading, ikke H D G."*
The first-use pattern (letter it, expand it, explain it) was already right and is
unchanged — only the ongoing spoken form was wrong.
