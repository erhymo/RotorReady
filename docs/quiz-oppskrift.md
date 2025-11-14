# Oppskrift for å lage quiz-spørsmål til modellene

## 1. Formål

Standard arbeidsflyt for å hente ut og lage quiz‑spørsmål fra POH/RFM/QRH for hver helikoptermodell, slik at alt innhold er sporbart, konsistent og modellspesifikt.

- Alltid kun én kilde: filer i repoet (PDF, TXT, PAGES.JSON, eksisterende JSON)
- Ingen innhold fra web-søk eller hukommelse
- Ingen blanding av modeller (AW169, AW189, AW139, H125, R44 II holdes helt adskilt)

---

## 2. Forberede kildedata

1. Legg POH/RFM/QRH‑PDF i egen mappe på rot (f.eks. `R44 2 POH`, `AW139`, `AW189`).
2. Sørg for at det finnes, per dokument:
   - en ren tekstfil (`*.txt`), og gjerne
   - en sideindeks (`*.pages.json`) for side‑referanser.
3. Notér for hver runde:
   - Modell (f.eks. `R44_II`)
   - Kapittel (f.eks. *Section 4 – Normal Procedures*)
   - Side‑område som skal dekkes (start–slutt i POH).

---

## 3. Seksjoner og filstruktur per modell

Per modell og kapittel bruker vi en egen *seksjon*.

- Eksempler på seksjons‑ID‑er:
  - `limitations`
  - `emergency_procedures`
  - `normal_procedures`
  - `engine-systems`
  - `avionics_fms_limitations`

**Filstruktur:**

- `public/model-data/<MODEL_ID>/index.json`
  - Liste over seksjoner for modellen, kun kapitler som faktisk har innhold.
- `public/model-data/<MODEL_ID>/sections/<seksjons-id>.json`
  - Selve spørsmålene for den seksjonen.

**Regel:**
- Ikke legg seksjoner i `index.json` før det finnes en ferdig (eller nesten ferdig) `sections/<seksjons-id>.json`.

---

## 4. JSON‑format for spørsmål

Hver seksjonsfil har formen:

- Rotobjekt med `items: [...]`
- Hvert element i `items` er ett spørsmål.

Felt per spørsmål:

- `id`: stabil ID, f.eks. `r44ii-ep-001`
- `section`: menneskelig seksjonsnavn i POH, f.eks. `EMERGENCY PROCEDURES`
- `type`: `"single"` eller `"multi"`
- `question`: tekst på spørsmålet
- `options`: liste med 3–4 svaralternativer
- `answer`: liste med 0‑baserte indekser (ofte én indeks for single)
- `explanation`: kort begrunnelse/utdrag/parafrase fra POH
- `references`: f.eks. `R44 II POH Sec 4: DAILY OR PREFLIGHT CHECKS (p.4-2)`
- `tags`: korte nøkkelord, f.eks. `["preflight", "daily-checks"]`
- `source`: alltid noe som peker til faktisk dokument, f.eks. `"R44 II POH"`
- `modelIds`: liste over modell‑ID‑er, f.eks. `["R44_II"]`

**Viktige konvensjoner:**

1. **Stabile ID‑er**
   - Format: `<modellprefix>-<seksjonskode>-NNN`
   - Eksempler: `r44ii-lims-001`, `r44ii-ep-017`, `r44ii-np-003`.
   - Ingen hull i nummerrekkene per seksjon hvis det kan unngås.

2. **Alternativer**
   - Lik stil og omtrent lik lengde.
   - Ikke gjør korrekt alternativ systematisk lengst eller mest detaljert.

3. **Modell‑scoping**
   - Aldri blande modeller i samme spørsmål.
   - `modelIds` skal alltid inneholde *kun* riktig modell.

---

## 5. Lage spørsmål fra POH‑tekst

Per spørsmål:

1. Finn en konkret POH‑bit (setning, punktliste, tabellrad, definisjon, prosedyre‑steg).
2. Formuler et presist spørsmål om akkurat dette.
3. Lag 3–4 alternativer hvor bare ett (eller noen få for `multi`) er korrekt.
4. Sett `answer` til indeksen(e) til korrekt(e) alternativ(er) (0‑basert).
5. Skriv en kort forklaring som forklarer *hvorfor* det riktige er riktig.
6. Legg inn nøyaktig referanse til seksjon og side.
7. Gi 2–4 relevante tags.
8. Sett `modelIds` til riktig modell, f.eks. `["R44_II"]`.

Målet er at hvert spørsmål skal kunne spores direkte tilbake til én tydelig POH‑passasje.

---

## 6. Kobling mot appen

For at en seksjon skal vises i appen:

1. Legg seksjonen inn i `public/model-data/<MODEL_ID>/index.json` under `sections`.
2. Sørg for at det finnes en route i `app/` for seksjons‑ID‑en:
   - Mappes i `app/quiz/page.tsx` sin `SECTION_ROUTE_MAP`.
   - Route‑komponenten filtrerer spørsmål på riktig `sectionId` når det trengs (f.eks. `"emergency_procedures"`).
3. `loadAllQuestions` brukes til å hente alle spørsmål for en modell og filtrerer på `modelIds`/`productIds`.

**Regel:**
- Kapitler uten innhold skal ikke vises i appen (ingen tomme kapitler i `index.json`).

---

## 7. Arbeidsdeling i praksis

Typisk arbeidsflyt mellom menneske og assistent:

1. **Du** sier: modell, kapittel, hvilke sider og hvor mange spørsmål (f.eks. bolker på 15).
2. **Assistenten**:
   - Leser relevant POH‑tekst fra repoet.
   - Foreslår spørsmål/alternativer/forklaringer med referanser.
   - Oppdaterer/lagrer riktig `sections/<seksjons-id>.json`.
   - Oppdaterer `index.json` og routing ved behov.
   - Kjør `npm run lint` og tester det i appen.

Denne oppskriften skal brukes hver gang vi legger til eller utvider quiz‑innhold for en modell.

