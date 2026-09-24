# RFM / POH chapter map

Where each topic lives in each model's own manual — so a verification pass or a
podcast segment map starts from the right pages instead of searching from scratch.
Moved out of memory 2026-09-23 so it sits next to the manuals it describes.


Per-model RFM structure, learned by directly reading each manual's dump this session. Use this to write the source-pointer paragraph in new NotebookLM instruks (see `docs/podcast-master-prompt.md`) — phrase pointers as "typically found under X — synthesize whatever is relevant" rather than asserting exact page numbers, since revisions shift pagination.

**Leonardo AW1xx family** (AW139 doc 139G0290X002, AW169/AW169 EP/AW189 doc 169G0290X002-style — same manual architecture across the family):
- Section 1 = Limitations (per-system subsections, e.g. "Automatic Flight Control System Limitations") — **but user corrected this 2026-07-29 for AW169 EP specifically: Limitations is Chapter/Section 2 in that manual, not Section 1.** Don't assume section numbering is identical across every AW1xx family member/revision — when in doubt, phrase source-pointers generically ("Chapter/Section 2 (Limitations)") rather than asserting a number with false confidence, and trust the user's direct correction over this note if they conflict.
- Section 2 = Normal Procedures
- Section 3 = Emergency and Malfunction Procedures (per-system subsections; AW139 AFCS was pages 3-129 to 3-137)
- Section 5 = Optional Equipment Supplements (numbered supplements, e.g. AW169 EP Supplement 15 = Crash Position Indicator/ADELT, Supplement 12 = TCAS II — full list runs 1–54+)
- Section 7 = System Description, organized by ATA-style chapter number within the section (AW189 confirmed: Chapter 22 = AFCS/Auto Flight, Chapter 24 = Electrical Power, Chapter 26 = Fire, Chapter 29 = Hydraulics; AW139 AFCS system description was "Auto-Flight, part of Primus Epic integrated avionics system")
- Supplement 12 (AW139) / similar-numbered supplement on other family members = Category A Operations, itself internally split into Parts A–L (takeoff/landing profiles by type, common performance, training)

**Sikorsky S-92A** (SA S92A-RFM-001 through -006):
- Part 1 Section I = Operating Limitations
- Part 1 Section III = Emergency Procedures
- Part 2 Section I = Systems Description
- AFCS architecture (as last read from source): three layers — SAS (rate damping via SAS servos, no cockpit control movement), AP (attitude hold via trim actuators, cockpit controls DO move), CFD (hands-off coupled flight director with many sub-modes: airspeed hold, altitude hold, radar altitude hold, VS, ALTP, GA, NAV, VOR/ILS/LOC-BC/FMS/P-ILS approaches)

**Airbus Helionix family** (H135 T3 / EC135T3H, H145 D2 / BK117 D-2, H145 D3 / BK117 D-3 — same avionics generation, decimal section numbering, NOT the same document family as the legacy AS350):
- Section 3 = Emergency and Malfunction Procedures, with decimal sub-sections per system (3.7 = Electrics, 3.8 = Engine, 3.9 = Fire, 3.10 = Fuel [H135] / Fuel and Weight [H145], 3.11 = Gearbox and Drive System, 3.12-ish = Avionics/Displays area)
- Manuals contain MULTIPLE revision copies of Section 3 in the same PDF dump (one per Helionix Step software revision) — always confirm the "EFFECTIVITY Helionix Step X.X Rev. NN" footer and use the HIGHEST revision number as canonical, never the first match found.
- H135 T3 is genuinely different from H145 in several Engine/Hydraulics numbers (manual twist-grip throttles alongside FADEC, different single-engine-landing speed, two-part engine overspeed procedure) — don't assume identical figures across the family even though structure matches.

**Airbus legacy family (AS350 B3 2B1)** — different document architecture from Helionix, NOT decimal-numbered the same way:
- Section 2 = Limitations (2.1 General, 2.2 Weight and Balance, 2.3 Flight Envelope incl. slope/temperature/altitude, 2.4 Vehicle Limitations incl. main rotor/transmission/engine/electrical, 2.5 Miscellaneous incl. fuel/baggage/starter cycle)
- Section 3 = Emergency Procedures (3.2 Engine Flame-Out/Autorotation, 3.3 Tail Rotor Failures, 3.6 Caution and Warning Panel — the CWP alarm-trigger table, 3.7 Various Warnings/Failures/Incidents Not Indicated on the CWP)
- Section 7 = Description and Systems (7.1 = Main Aircraft Dimensions — overall length/height/rotor diameters are in an embedded technical drawing/figure that does NOT extract as PDF text; had to read the actual PDF page as an image to get the numbers)

**Robinson R44 II** (POH, not RFM — dump at `R44 2 POH/r44ii_poh_full_book_0586eefd22.txt`, ~6.9MB PDF, small enough to upload whole, no Ghostscript split needed): standard Robinson 10-section POH layout, decimal-free:
- Section 1 = General (dimensions, descriptive data incl. powerplant: Lycoming IO-540-AE1A5, fuel-injected — NOT carbureted, so Robinson's carb-ice Safety Notices SN-25/SN-31 do not apply to this variant, only to the carbureted R44/Raven I)
- Section 2 = Limitations (airspeed/Vne by weight band, rotor RPM power-on vs power-off, engine limits, weight/CG, flight and maneuver limitations incl. the low-G pushover prohibition, fuel, instrument markings, placards)
- Section 3 = Emergency Procedures (power failure by altitude band, autorotation configs, water landings, tail rotor thrust loss, fires, tachometer/hydraulic/governor failure, then Warning/Caution Lights and Audio Alerts tables, 3-8 to 3-11)
- Section 4 = Normal Procedures (recommended airspeeds, preflight, starting, takeoff, cruise, practice autorotation, hydraulics-off training, descent/approach/landing)
- Section 5 = Performance, Section 6 = Weight and Balance
- Section 7 = Systems Description (Rotor Systems, Drive System incl. clutch actuator/sprag clutch/belts, Powerplant, Flight Controls, RPM Governor, Hydraulic System, Engine Controls, Fuel/Electrical/Lighting, Instrument Panel, Warning/Caution Lights, Audio Alerts)
- Section 8 = Handling and Maintenance
- Section 9 = Supplements (optional equipment, e.g. floats, HeliSAS autopilot, lithium-ion battery)
- Section 10 = Safety Tips and Notices — a uniquely rich Robinson-specific body of accident-derived material (SN-1 through SN-44+), especially SN-11 (low-G pushovers) and SN-10/SN-24 (low-RPM rotor stall) — excellent, concrete podcast source material not present in this form in any other model's manual.

**Splitting large RFM PDFs for NotebookLM upload**: use Ghostscript directly on the original source (`gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dFirstPage=N -dLastPage=M`), never pypdf's page-extraction (it clones far more than the selected pages and produces near-original-size output regardless of range — confirmed on AW169 EP RFM where a 10-page pypdf extract was still ~313MB). Some manuals compress unevenly per-section (AW169 EP's Section 7 System Description resisted /ebook compression far more than the main body — likely dense embedded diagrams) — check output size after each range and re-split further if a piece is still too large rather than assuming even page-count splitting gives even file sizes.
