# Google Play appeal: Webviews and Affiliate Spam

Use this as a working note if Google Play flags RotorReady for the Webviews and Affiliate Spam policy.

## Status log

- **2026-05-30**: First flagged. Guidance drafted below. Code mitigation shipped
  (custom `native-error.html` branded error screen instead of the generic
  WebView network error page) — this is live at `capacitor.config.ts` /
  `public/native-error.html`, but no new Android build/version was ever
  uploaded carrying that fix (versionCode is still `1`, the original build).
- **2026-07-06**: Confirmed still suspended, both via a live Google Play
  Developer API call (`Google Api Error: Invalid request - The app is
  suspended.`) and via the actual suspension email from Google, which cites
  the same **Webviews and Affiliate Spam** policy. The notice references two
  screenshots we don't have access to (only visible inside Play Console):
  `HTTP_REQUESTS-3185.png` and `IN_APP_EXPERIENCE-8506.png` (labeled against
  "Version code 1: In-app experience" — i.e. the original, still-current
  build).
- Public WHOIS for `rotor-ready.com` is privacy-shielded (registrar: Name SRS
  AB, proxy: Shield Whois), so it does **not** show Mayday AS as registrant —
  DNS/WHOIS lookups are not usable as ownership proof here. Domain created
  2025-10-07; nameservers are Vercel's (`ns1`/`ns2.vercel-dns.com`), consistent
  with the site being hosted on Vercel.
- Google's notice is explicit: **"Screenshots, emails, and other informal
  communication are not accepted as proof."** They want one of: an agreement
  signed by both parties, a signed declaration/authorization letter/contract
  from both parties, or a signed licensing/distribution agreement. Since
  Mayday AS owns both the app and the website, the declaration below is a
  **self-attestation** (Mayday AS confirming, in one signed document, that it
  is both the website owner/administrator and the app publisher, and
  authorizes itself to use the content).
- **2026-07-06**: Declaration signed by Øyvind Myhre (CEO). Stored outside the
  repo (this repo is public on GitHub, so the signed PDF must never be
  committed here) at
  `~/Mayday/Secure/RotorReady/GooglePlay/appeal/Mayday-AS-RotorReady-Declaration-signed-2026-07-06.pdf`.
- **2026-07-13**: Discovered an appeal was already submitted earlier —
  **case 2-5376000040345, submitted 2026-05-30 11:34 by
  myhre.oyvind@gmail.com**, and Google has already responded (status: "Svar på
  anken er sendt"). This was missed in earlier notes. Details of that appeal,
  read back from Play Console's "Ankeinformasjon" panel:
  - **Reason selected**: "Jeg forstår hva som har ført til dette problemet, og
    jeg skal rette det" (I understand what caused this problem and will fix
    it) — a *concession*, not a *dispute* of the decision.
  - **Details submitted**: plain text only, no attached documentation (the
    signed declaration didn't exist yet — it wasn't signed until over a month
    later, 2026-07-06). Google's own policy is explicit that "screenshots,
    emails, and other informal communication are not accepted as proof," so
    this appeal almost certainly failed for lack of the one thing it needed.
  - The "Submit an appeal" link in the suspension email now just routes back
    to the policy status page showing this same old case — **there is no
    self-service "submit a second appeal" button**; the one-shot appeal for
    this suspension has already been used.
  - Vercel domain-ownership export saved as supplementary evidence:
    `~/Mayday/Secure/RotorReady/GooglePlay/appeal/vercel-domain-evidence-2026-07-13.txt`
    (confirms `rotor-ready.com` sits under the same Vercel account as the
    person who signed the declaration).
  - Next path being tried: since the appeal channel is exhausted, use the
    **"forhåndsvarselskjemaet" (advance notice form)** linked from the same
    policy status page instead — the suspension email's own resolution text
    frames this as the parallel channel for submitting proof documentation
    ("If you haven't already provided advance notice, submit an appeal...").
    Scenario to select: **"Intellectual Property proof of permission"**,
    package name `com.mayday.rotorready`, with the signed declaration PDF (and
    optionally the Vercel evidence) attached.

## What's needed to actually resolve this (manual steps — cannot be done by an agent)

1. ~~Put the declaration text below on Mayday AS letterhead, fill in title and
   date, and get it signed by an authorized person~~ — done 2026-07-06, see
   status log above.
2. ~~Log in to Play Console → the policy status / appeal page linked from the
   suspension email → Submit an appeal~~ — done 2026-05-30, but rejected/no
   effect (no proof attached, concession-style reason). The self-service
   appeal channel appears to be one-shot and is now exhausted for this case.
3. **Current plan**: log in to Play Console → policy status page → the
   **"forhåndsvarselskjemaet" (advance notice form)** link → package name
   `com.mayday.rotorready` → scenario **"Intellectual Property proof of
   permission"** → attach the signed declaration PDF (and optionally the
   Vercel evidence file) with an explanation that this is now-available formal
   proof that wasn't attached to the original 2026-05-30 appeal.
4. If the advance notice form doesn't produce a route back into review (e.g.
   it's meant for a different scenario than expected), fall back to Play
   Console's developer support / contact-a-human channel and reference case
   `2-5376000040345` directly, since the automated one-shot appeal is spent.
5. After submitting, wait for Google's response before re-uploading any new
   build — suspended apps typically cannot receive new releases until the
   suspension is lifted.

## Appeal message (paste into the Play Console appeal form)

Hello Google Play Policy Team,

RotorReady (`com.mayday.rotorready`) is the official Android app for RotorReady, published by Mayday AS. Mayday AS owns and administers the RotorReady web domain `https://rotor-ready.com` and the RotorReady training content served from that domain. Mayday AS is both the website owner/administrator and the app publisher.

The app is not an affiliate, referral, or traffic-arbitrage app. It does not send users to third-party shopping, advertising, or affiliate destinations, and it does not earn referral commissions. It is a first-party helicopter-pilot training and repetition app containing RotorReady quiz, procedures, limitations, systems, and offline training content — the same content Mayday AS publishes on its own website.

We have attached a signed declaration confirming that Mayday AS owns/administers `rotor-ready.com` and authorizes the RotorReady Android app (`com.mayday.rotorready`) to display and use that content in the app.

We have also updated the app to show a RotorReady-branded local error screen if it cannot connect, instead of a generic WebView network error page, and will publish an updated build once the app is reinstated.

Please reinstate the app and let us know if any additional documentation is required.

Regards,
Mayday AS / RotorReady

## Signed declaration text (put on Mayday AS letterhead before signing)

To Google Play Policy Team,

Mayday AS confirms that it owns and/or administers the RotorReady service and website at `https://rotor-ready.com`, and is the publisher of the Android application RotorReady, package name `com.mayday.rotorready`, on the Mayday AS Google Play developer account.

As both the website owner/administrator and the app publisher, Mayday AS authorizes the RotorReady Android app to load, display, cache, and use RotorReady content from `https://rotor-ready.com` inside the app.

RotorReady is a first-party training aid for helicopter pilots. It is not an affiliate/referral app and does not earn affiliate commissions or redirect users for affiliate traffic.

Signed,

Name: Øyvind Myhre
Title:
Company: Mayday AS
Date: