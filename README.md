# RotorReady

En treningsplattform for AW169 (og flere modeller) med lys-trening og quiz.

Viktig: Dette er en uavhengig treningsapplikasjon. Den er ikke en offisielt godkjent trener og skal ikke brukes som eneste grunnlag for operative beslutninger. Verifiser alltid mot operatørens prosedyrer og offisielle dokumenter (QRH/AFM/OM). RotorReady er ikke tilknyttet eller godkjent av noen helikopterprodusent eller luftfartsmyndighet.

## Status
- Aktiv utvikling. Funksjonalitet og innhold kan endres hyppig.
- Produksjon: Appen er tilgjengelig i produksjon, men anses kontinuerlig forbedret. Rapportér gjerne feil via Min side.

## Innhold
- Training Lights (warning/caution)
  - Fullskjerm prosedyrevisning på mobil
  - Prev/Next og Flag med toggle
  - Restart bygger nytt tilfeldig sett med samme filter/antall; unngår å repetere de to siste rekkefølgene
- Quizer (Emergency, Engine Systems, Limitations, Avionics & FMS, + generiske seksjoner)
  - Tilfeldig rekkefølge per økt, unngår de to siste rekkefølgene
  - Tilfeldige svaralternativer med riktig remapping av fasit
  - “Øv kun på feil” tilgjengelig fra Min side (utvikles videre)

## Slik bruker du appen
- Velg modell på Min side
- Training Lights
  - Velg kategori (warning/caution) og antall
  - Trykk på et lys for prosedyrevisning; bruk Prev/Next nederst
  - Flag for å gi beskjed til admin om noe må forbedres
  - Restart for ny tilfeldig runde (samme filter/antall)
- Quiz
  - Velg seksjon og antall spørsmål
  - Spørsmål og alternativer er randomisert; vi forsøker å unngå nylig identisk rekkefølge
  - Resultatside og historikk vises; “Øv kun på feil” kan startes fra Min side

## Personvern og analyse
- Feilsporing: Vi planlegger å bruke Sentry for å fange tekniske feil (stacktrace, nettleser/URL). Sensitive data logges ikke.
- Bruksinnsikt: Vi planlegger å bruke PostHog for anonym bruksdata (f.eks. start/avslutt quiz). Ingen personlig identifiserbar info samles uten samtykke.
- Du kan be om innsyn/sletting via kontaktseksjonen på Min side.

## Teknisk
- Next.js App Router
- TypeScript og Tailwind CSS
- Firebase (auth/firestore)
- Vercel-plattform

### Lokalt
- Node 18+
- npm install
- npm run dev

## Ansvarsfraskrivelse (disclaimer)
Denne applikasjonen er kun for trening og læring. Innholdet kan inneholde feil, være ufullstendig eller ikke oppdatert. All operativ virksomhet skal følge QRH/AFM, operatørens prosedyrer og myndighetskrav. Utviklerne og bidragsyterne fraskriver seg ethvert ansvar for tap, skader eller hendelser som følge av bruk av applikasjonen.

## Kontakt
- Bruk “Kontakt RotorReady” på Min side for å sende meldinger/tilbakemeldinger.
- Rapporter gjerne feil eller forslag.

