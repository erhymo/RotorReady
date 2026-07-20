# Google Play appeal: Webviews and Affiliate Spam

Use this as a working note if Google Play flags RotorReady for the Webviews and Affiliate Spam policy.

## Status log

- **2026-07-20 (Dean reply)**: Received a substantive reply from "Dean, Google Play
  Developer Support" on the new support case. Unlike Jamie's replies, this
  one is clearly not templated — it correctly summarizes the specific
  evidence submitted (assetlinks.json + Search Console verification under
  the same Google account as the Play Console developer profile) and
  explains the actual mechanism: the new support case generated its own
  appeal ticket (**0-6452000041488**), which was auto-marked as a duplicate
  of the original **2-5376000040345**. Dean asks us to "send the documents
  to the original appeal ticket" so the appeals team (a different team from
  Developer Support, which cannot reverse suspensions itself) can review
  them. Problem: there is still no self-service way to attach anything to
  case 2-5376000040345 — "Submit an appeal" only redirects to the Policy
  Status overview, confirmed multiple times already. Replying to Dean
  directly pointing out this exact gap and asking him to either forward the
  evidence internally himself or give literal step-by-step instructions for
  attaching something to an already-decided case, since the self-service UI
  provides no path to do so.
- **2026-07-20 (night)**: Filed a genuinely new **support case** via Play
  Console → Help → "Få hjelp fra brukerstøtteteamet vårt" → "Opprett en
  brukerstøttehenvendelse", category **"Retningslinjer for Google Play"**.
  This is a distinct channel from both the Policy Status appeal button and
  the Jamie email thread — Google's own AI assistant tried to deflect back to
  the "File an appeal" flow first (the one already exhausted), but choosing
  "Nei, opprett en brukerstøttehenvendelse" got past that and created a real
  new case. Message: short (<1000 char) summary referencing case
  2-5376000040345, linking the two new verifiable proofs (assetlinks.json +
  Search Console domain verification). Status: **Venter** (pending), reply
  will come via email to myhre.oyvind@gmail.com. This is the most promising
  open thread right now — check for a reply.
- **2026-07-20 (evening)**: Verified `rotor-ready.com` in **Google Search
  Console** (property type: Domain, method: DNS TXT record via Vercel's DNS
  zone for the domain — nameservers are Vercel's, so the record was added
  under Vercel → Domains → rotor-ready.com → DNS Records → type TXT, name
  empty/root, value `google-site-verification=...`). Confirmed: "Eierskapet
  er bekreftet". This is a second independent, Google-native ownership proof
  alongside `assetlinks.json` — both machine-checkable by Google, unlike the
  self-signed PDF. Worth noting if/when next contacting Google: the same
  Google account that verified this domain is the one used for the Play
  Console developer account, which cross-links the two identities directly
  within Google's own systems.
- **2026-07-20 (later same day)**: Confirmed hands-on in Play Console: both
  **"Test og publiser" (Test and release)** and, within it, **App
  integrity / App signing key certificate**, are greyed out and
  unclickable while the app is suspended. So the Play App Signing
  certificate fingerprint is **not retrievable right now** — Google locks
  this section for suspended apps. Proceeding with only the upload-keystore
  fingerprint already published in `assetlinks.json` (see entry below); will
  add the Play App Signing fingerprint as a second array entry once/if the
  suspension lifts and that page becomes accessible again. Not a dead end —
  the upload-key entry is still real, verifiable, Mayday AS-controlled proof.
- **2026-07-20**: Received a **third** reply from Jamie, word-for-word
  identical to the 2026-07-19 one (same "As explained in the previous mail"
  opener, same body). Two verbatim-identical replies to two different,
  increasingly specific emails is strong evidence this is a templated/
  automated response, not a human reading the content — revising the
  2026-07-19 "probably a human" assessment. Researched Google's actual
  published policy and process instead of guessing further:
  - Policy text (see link below) confirms the violation is specifically
    "a webview of a website **without permission** from the website owner or
    administrator" — the ownership angle is correct in principle.
  - The **advance notice form** (used 2026-07-15) is documented as a
    **proactive, pre-publication** tool for declaring IP permission — not a
    mechanism for attaching new evidence to an already-decided suspension
    case. This likely explains why it produced no real review: wrong tool.
  - Checked `https://rotor-ready.com/.well-known/assetlinks.json` — returned
    404 (didn't exist). This is Android's official machine-verifiable
    mechanism (Digital Asset Links) for proving a domain and an Android app
    are controlled by the same owner, and is a stronger signal than a
    self-signed PDF since Google can check it automatically. **Added** this
    file (`public/.well-known/assetlinks.json`) with the upload keystore's
    SHA-256 cert fingerprint
    (`E3:94:48:64:B6:9B:1F:37:7C:D5:8D:BF:F0:C7:72:D3:4E:6E:33:4E:16:6D:EF:59:40:4B:1F:07:A7:C4:03:4A`).
    **Caveat**: if Play App Signing is enabled (default for all apps
    registered since ~2021, and this app was very likely enrolled), the
    certificate actually used to sign the distributed app is a *different*
    one that only Google holds — visible in Play Console under **Setup → App
    integrity → App signing key certificate**. That fingerprint should be
    added as a second entry in the `sha256_cert_fingerprints` array once
    available; the file supports multiple.
  - Google's own official "Managing Policy Violations and Appeals" help page
    documents a separate, official channel for exactly this situation:
    **Help Center → "Contact Google Play about an account termination or app
    removal"** troubleshooter — distinct from both the Policy Status appeal
    button and the Jamie email thread. Not yet tried. This does not
    contradict Jamie's "keep everything in this case" instruction the way
    opening an arbitrary new support ticket would, since it's Google's own
    documented process for this scenario, not an invented channel.
  - Decided: pause the Jamie email thread for now (a 4th reply is unlikely
    to add anything after two identical responses) in favor of (a) the
    assetlinks.json fix (done), (b) Google Search Console domain verification
    (not yet done — needs the user's Google account), and (c) trying the
    official account/app-removal troubleshooter.
- **2026-07-19**: Received a second reply from Jamie ("As explained in the
  previous mail...") reiterating that case **2-5376000040345** is the only
  channel and all future communication happens there. Confirmed via live
  Google Play Developer API call that the app is **still suspended**.
  Re-assessed: this reads more like a human repeating an instruction than an
  autoresponder (it explicitly references "the previous mail"). The real
  disconnect: Jamie calls this "the appeal ticket," but there is no
  functioning ticket UI on our side — the Play Console "Ankeinformasjon" panel
  for this case is a static view still showing only the 2026-05-30
  submission, and "Submit an appeal" just redirects to the Policy Status
  overview. The only channel that has actually produced replies is this email
  thread — which is the opposite of what Jamie's wording suggests ("not a
  separate case"). Decided **against** opening a new Play Console "Contact
  support" channel, since that would directly contradict the instruction to
  keep everything in this one case. Instead, next reply (drafted below) asks
  one narrow, concrete procedural question — has the 2026-07-15 documentation
  actually been attached to/reviewed under case 2-5376000040345, and if the
  console gives no way to submit further evidence, how does Google want it
  delivered — rather than re-explaining the whole history again.
- **2026-07-16**: Received a reply from Google ("Jamie", Google Play Team) to
  the 2026-07-15 advance notice submission. It doesn't decide anything itself
  — it says the submission was merged into the original appeal ticket
  (**case 2-5376000040345**) and that all future communication happens there,
  not as a separate case. Confirmed via a live Google Play Developer API call
  that the app is **still suspended** as of this reply. Next: check the
  "Ankeinformasjon" panel on case 2-5376000040345 in Play Console for the
  actual updated decision/reasoning. **Checked**: the "Ankeinformasjon" panel
  for case 2-5376000040345 still shows only the original 2026-05-30
  submission — no update reflecting the 2026-07-15 advance notice submission.
  The "Submit an appeal" link now just redirects back to the Policy Status
  overview page (no way to open a new appeal or add info through the console
  — a dead-end loop). **Replied to Jamie's email 2026-07-16** explaining this
  directly, re-summarizing what was submitted 2026-07-15, re-attaching the
  signed declaration, and asking for confirmation the documentation was
  reviewed and what (if anything) is still missing. Now waiting on a reply —
  email is the live channel, not the Play Console self-service UI.
- **2026-07-15**: Submitted the advance notice form (package name
  `com.mayday.rotorready`, scenario "Intellectual Property proof of
  permission") with a ~727-character explanation referencing the earlier
  failed appeal (case 2-5376000040345) and attaching the signed declaration
  PDF plus the Vercel domain-evidence file. Now waiting on Google's response.
  Do not re-upload any build until either the suspension is lifted or Google
  asks for one.
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

## Reply to Jamie (same email thread — do NOT open a new Play Console support case, Jamie has explicitly said everything stays in this one)

Keep this on the existing thread (reply to Jamie's 2026-07-19 email), quoting
case 2-5376000040345. This is a short, narrow procedural question — not a
re-explanation of the whole history (already done on 2026-07-16) — designed
to force a concrete answer to the actual disconnect: Jamie calls it "the
appeal ticket," but there's no ticket UI we can act on from Play Console.

Message to paste:

---

Subject: Re: Action Required: com.mayday.rotorready — case 2-5376000040345

Hi Jamie,

Understood — we'll keep everything on this thread and case 2-5376000040345.

One specific question so we know what to do next: on our side, Play Console's "Ankeinformasjon" panel for this case still only shows our original 2026-05-30 submission, and the "Submit an appeal" link just redirects to the general Policy Status overview — there is no ticket view or form we can use to attach anything further.

On 2026-07-15 we submitted a signed declaration (proof that Mayday AS owns/administers rotor-ready.com and is the app's publisher) plus supporting domain-ownership evidence, via the advance notice form.

Could you confirm:
1. Has that documentation been attached to and reviewed under case 2-5376000040345?
2. If not yet reviewed, is there anything else we need to do, or do we simply wait?
3. Since Play Console gives us no way to submit further evidence ourselves, if anything else is needed, could you tell us exactly how to deliver it?

Thanks,
Mayday AS / RotorReady

---

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