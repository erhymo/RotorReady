# TASKS

En enkel TODO-mal du kan fylle ut (gjerne via ChatGPT i nettleseren). Hold oppgavene korte og konkrete. Jeg plukker dem herfra og leverer endringer fortløpende.

## Prosjektkontekst
- Produkt: RotorReady
- Kort kontekst: Hva jobber vi mot nå?

## Mål (Q1/Q2/uke)
- [ ] Overordnet mål 1
- [ ] Overordnet mål 2

## Prioriterte oppgaver (kanban)

### To Do
// REMINDERS (Stripe/Portal)
- [ ] Stripe Checkout: aktiver når STRIPE_PRICE_ID er klar
  - Når du har `STRIPE_PRICE_ID`, kobler vi `POST /api/stripe/checkout` til ekte pris og viser «Kjøp tilgang» på forsiden (viser allerede når NEXT_PUBLIC_STRIPE_PRICE_ID er satt)
  - Valider `STRIPE_PORTAL_RETURN_URL`
- [ ] Stripe Customer Portal
  - Legg til `/api/stripe/portal` + knapp «Administrer abonnement» (krever at vi lagrer `customer`-id på bruker)

- [ ] Oppgave: <beskriv hva, hvorfor, akseptanse>
  - Prioritet: Høy/Middels/Lav
  - Eier: <navn>
  - Akseptansekriterier:
    - [ ] Kriterium 1
    - [ ] Kriterium 2
  - Notater/lenker: <ev. design/issue/PR>

- [ ] Oppgave: <f.eks. «Quick Ten – forbedre introflow»>
  - Prioritet: Middels
  - Akseptansekriterier:
    - [ ] Viser intro ved første besøk
    - [ ] «Start quiz» leder til riktig route

### In Progress
- [ ] (flyttes hit når jeg starter)

### Review/QA
- [ ] (jeg fyller inn PR-lenker her)

### Done
- [ ] (flytt ferdige oppgaver hit)

## Definisjon av ferdig (DoD)
- [ ] Kode bygger uten feil
- [ ] Grunnleggende manuell test OK
- [ ] Relevant dokumentasjon oppdatert (README/komponent/kommentar der det gir mening)

## Veiledning for gode oppgaver
- **Konkret:** beskriv ønsket atferd, ikke implementeringsdetaljer hvis ikke nødvendig
- **Sjekkbar:** inkluder 2–4 akseptansekriterier jeg kan verifisere
- **Avgrenset:** helst 1–4 timer arbeid per oppgave

## Eksempel
- [ ] «Limitations-quiz: neste/forrige-navigasjon med tastatur»
  - Akseptansekriterier:
    - [ ] Venstre/høyre piltast navigerer mellom spørsmål
    - [ ] Fokusindikator synlig for tilgjengelighet
    - [ ] Ingen konsollfeil i dev

---
Slik bruker du denne filen med ChatGPT i nettleseren: Be den skrive oppgaver i samme format (med checkbokser), lim dem inn her. Jeg tar første oppgave i «To Do», markerer den i «In Progress», og leverer PR-klare endringer.
