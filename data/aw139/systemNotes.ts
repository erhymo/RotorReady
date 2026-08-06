export type SystemNoteSection = {
  heading?: string;
  paragraphs?: string[];
  table?: {
    caption?: string;
    columns: string[];
    rows: (string | number)[][];
  };
  note?: string;
};

export type SystemNote = {
  slug: string;
  title: string;
  subtitle?: string;
  rfmReference: string;
  sections: SystemNoteSection[];
};

const WEATHER_RADAR_HONEYWELL: SystemNote = {
  slug: "weather-radar-honeywell",
  title: "Honeywell Weather Radar Series",
  subtitle: "One RFM supplement, five different radar fits — what each one actually does, and the modes common across them.",
  rfmReference:
    "AW139 RFM Supplement 21 (Honeywell Weather Radar Series — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures) and Section 7 (System Description).",
  sections: [
    {
      heading: "Five radars under one supplement",
      paragraphs: [
        "Supplement 21 covers a family of optional weather radar fits, not one fixed system — which one is on a given aircraft depends on which kit was installed. All share a 12 in flat-plate antenna and transmitter/receiver unit, displaying on both PFDs and MFD.",
      ],
      table: {
        columns: ["Fit", "What it adds"],
        rows: [
          ["WX P660", "The base radar: storm intensity detection and ground mapping."],
          ["WX P701", "P660 functions plus interrogation and decoding of ground/airborne X-band beacon transponders — up to six coded pulses transmitted, controlled from a separate Beacon Controller panel. Beacon data is not available on the PFDs, only the MFD."],
          ["RDR-7000 (P660 Clone Mode / Real Beam)", "A direct drop-in replacement for the P660, identical in function."],
          ["RDR-7000 Vertical Buffer", "Scans the entire sky ahead and saves reflectivity into a 3-D volumetric buffer out to 320 NM and from the ground to 60,000 ft, using aircraft position/attitude and an internal terrain database to separate ground returns from weather. Tilt is always automatic. Displayed returns are capped at 30,000 ft to keep the picture relevant to helicopter operations."],
          ["RDR-7000 Vertical Buffer with Maritime", "Everything the Vertical Buffer does, plus a real-beam, high-resolution ground-mapping mode (GMAP2) with a light-search/Target Overlay capability aimed at offshore operations — showing vessels on the water."],
        ],
      },
    },
    {
      heading: "Operating modes",
      table: {
        columns: ["Mode", "What it does"],
        rows: [
          ["OFF / STBY", "Standby — system powered but not transmitting. On the Vertical Buffer variants, STBY still transmits in flight to keep filling the 3-D buffer; no data is shown on the displays either way."],
          ["FSTBY (Forced Standby)", "Automatic, non-selectable — on the ground the radar is held out of transmission by the WOW interlock."],
          ["TEST", "On the ground, runs a full self-test with a test pattern. In the air, shows the test pattern, configuration and current fault information, but does not run an actual test."],
          ["FP (Flight Plan)", "Prioritizes the flight-plan display; Weather, Turbulence and/or REACT are still shown if selected. The Weather-Ahead (TGT) function is only active if armed."],
          ["WX-ALL", "Automatic weather mode showing both On-Path and Off-Path weather — On-Path in solid colors, Off-Path in a strip pattern."],
          ["WX-PATH", "Automatic weather mode showing On-Path weather only."],
          ["WX-MAN", "Constant-elevation weather analysis — shows only the weather at a single altitude slice, manually set by the pilot (0–30,000 ft) via the Manual Altitude/Elevation knob."],
          ["GMAP / GMAP1", "Full-coverage ground map for terrain features, coastlines, lakes, large built-up areas. On the Vertical Buffer variants this is sourced from the 3-D buffered data rather than a live sweep."],
          ["GMAP2 (Vertical Buffer + Maritime only)", "Real-beam ground mapping — higher resolution, shorter range, with the maritime overlay indicating vessels on the water."],
          ["BCN", "Beacon-only — no primary radar weather or ground-mapping data, cyan beacon returns."],
          ["BOTH", "Beacon and primary radar simultaneously; beacon target shown in cyan over WX or green over GMAP1/GMAP2."],
        ],
      },
      note: "RCT (REACT) and HZD add further layers on top of the weather modes: REACT flags areas where the radar signal has been attenuated with magenta arcs — a warning that severe weather may be hiding behind mild-looking reflectivity. HZD is REACT plus turbulence detection (out to 40 or 60 NM within the flight-path envelope, shown in magenta) and, where fitted, predictive hail/lightning icons. TGT arms the Weather-Ahead function: it watches ±7.5° either side of the aircraft heading, 0–100 NM ahead, and flashes an amber TGT indication if red weather or turbulence is detected beyond the current display range.",
    },
    {
      heading: "Controls common to the family",
      paragraphs: [
        "VAR — manual gain, active in all weather and map modes. TILT — sets antenna tilt relative to the horizon (on Vertical Buffer + Maritime in GMAP2, tilt is instead set via the ELEVATION knob). SECT — reduces the antenna sweep from ±60° to ±30°. STAB OFF — de-selects horizon stabilization, so the antenna instead stabilizes relative to the aircraft's longitudinal axis. *CR — clutter reduction: Ground Clutter Reduction in weather mode, or a choice of Sea Clutter Reduction / Ground Clutter Reduction 1 / Ground Clutter Reduction 2 in GMAP1. SCR (GMAP2 only) — Sea Clutter Reduction, with detected targets marked by green diamonds.",
        "Color coding is consistent across the family: for weather, green/yellow/red for light/medium/strong returns (very light or none shows black, or transparent on Primus Epic Phase 8); for ground mapping, cyan/yellow/magenta for the same three strengths.",
      ],
    },
    {
      heading: "The hard limitation",
      paragraphs: [
        "The weather radar must not be used for terrain avoidance.",
      ],
    },
    {
      heading: "Startup synchronization",
      paragraphs: [
        "The radar defaults to a 50 NM range (25 NM half-range ring) on startup. If it instead starts in the 100 NM range, it must be manually synchronized by changing the range setting — weather information will not display correctly until that's done.",
      ],
    },
    {
      heading: "AHRS miscompare",
      paragraphs: [
        "AHRS 1 is used by default for antenna stabilization. On an AHRS miscompare, the standby instruments are used to determine which AHRS is correct: if AHRS 2 is selected (meaning AHRS 1 had the bad data — the one the radar was using), switch the weather radar OFF/STBY. If AHRS 1 is selected (AHRS 2 was bad), the radar's stabilization source is unaffected and the flight continues normally.",
      ],
    },
    {
      heading: "Ground transmission and double DC generator failure",
      paragraphs: [
        "The radar does not transmit on the ground due to the WOW safety interlock. If the WOW microswitch fails and the radar transmits anyway, the response is to switch the weather radar OFF and note it for maintenance — not simply to reselect Standby.",
        "On a confirmed double DC generator failure, the weather radar must be switched OFF as part of the load-shedding response.",
      ],
    },
  ],
};

const WEATHER_RADAR_TELEPHONICS: SystemNote = {
  slug: "weather-radar-telephonics-rdr",
  title: "Weather Radar Telephonics RDR-1500B+ / RDR-1700A",
  subtitle: "A maritime multi-mode radar sharing its nose fit with the KTA 970 traffic system — the RFM names its three modes but leaves the operating detail to the manufacturer's guide.",
  rfmReference:
    "AW139 RFM Supplement 42 (Radar Telephonics RDR Series and TAS KTA 970 — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures). No Section 7 system description exists for this radar beyond the supplement itself.",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The Telephonics RDR-1500B+ (or its updated version, the RDR-1700A) is a surveillance and weather radar built for maritime missions. It shares Supplement 42 with the KTA 970 traffic system because the two antennas — the radar's and the TCAS's upper antenna — are installed together in a dedicated nose configuration.",
        "Hardware: a flat-plate antenna and drive unit, a receiver/transmitter unit, an interface unit, and a radar controller in the interseat console with a joystick for cursor/target-marker control. Information displays on the central 5th display and, if fitted, the Mission Console Display — or on the MFD if the VMU kit is installed.",
      ],
    },
    {
      heading: "The three primary modes",
      paragraphs: [
        "The RFM names three primary modes but does not detail their operating logic beyond this — full functionality is documented only in the Telephonics RDR-1500B+ / RDR-1700A Weather Radar Pilot's Guide, not the RFM itself.",
      ],
      table: {
        columns: ["Mode family", "Purpose"],
        rows: [
          ["Sea surface search and terrain mapping", "Surface search and ground mapping for maritime operations."],
          ["Weather avoidance", "Standard weather-detection function."],
          ["Beacon detection and navigation", "Interrogates I-band transponders (beacon type SST-181E only) for navigation."],
        ],
      },
    },
    {
      heading: "The hard limitation",
      paragraphs: [
        "The radar must not be used for navigation or terrain avoidance — this is the one item the RFM states without qualification, even though beacon mode is described as a \"navigation\" function above; treat that as a targeting aid, not a navigation source.",
      ],
    },
    {
      heading: "Ground transmission and double DC generator failure",
      paragraphs: [
        "The radar does not transmit on the ground due to the WOW safety interlock. If the WOW microswitches fail while the radar is switched ON, it will transmit — the response is simply to confirm the radar is switched OFF.",
        "On a confirmed double DC generator failure, ensure the radar is switched OFF as part of the load-shedding response.",
      ],
    },
  ],
};

const TAS_KTA970: SystemNote = {
  slug: "tas-kta-970",
  title: "Traffic Advisory System KTA 970 (TCAS I)",
  subtitle: "A Traffic-Advisory-only system — no Resolution Advisories, no maneuver guidance. The numbers behind when it alerts and what its symbols mean.",
  rfmReference:
    "AW139 RFM Supplement 25 (Traffic Advisory System KTA 970 — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures, Section 7 System Description) and Supplement 42 (bundled fit sharing a nose configuration with the Telephonics RDR radar — same system, same limitations, plus the WX P660 caveat below).",
  sections: [
    {
      heading: "What it is — and what it isn't",
      paragraphs: [
        "The KTA 970 is TCAS I: it detects and tracks nearby transponder-equipped traffic and issues Traffic Advisories (TAs) — it does not issue Resolution Advisories and gives no maneuver guidance. This is the key distinction from TCAS II (see the TCAS II note): the pilot must maneuver based only on ATC guidance or positive visual acquisition of the conflicting traffic, never on the TCAS I display alone.",
        "It interrogates transponders (Mode A/C ATCRBS or Mode S) of nearby aircraft and computes range, relative bearing, closure rate, and — if the intruder reports it — altitude and vertical speed, to predict time to and separation at Closest Point of Approach (CPA).",
      ],
    },
    {
      heading: "Range, altitude coverage, and capacity",
      paragraphs: [
        "Nominal tracking range is 18 NM, though intruders can occasionally be seen out to 36 NM. TCAS I tracks up to 45 aircraft and displays up to 30 of them simultaneously. Tracking altitude coverage is ±9,000 ft relative to the helicopter.",
      ],
    },
    {
      heading: "Sensitivity levels — when a TA is issued",
      paragraphs: [
        "TCAS I splits the surrounding airspace into two sensitivity levels, so it doesn't over-alert in busy low-level traffic near terminal areas.",
      ],
      table: {
        columns: ["Level", "When it applies", "TA triggers"],
        rows: [
          ["SL A", "In flight below 2,000 ft AGL, or with RAD ALT failed and landing gear extended", "Altitude separation closing to <600 ft within 20 s at current rate; OR separation <1,200 ft altitude AND <0.20 NM range; OR a non-altitude-reporting (NAR) intruder within 15 s or 0.20 NM"],
          ["SL B", "All other flight conditions — above 2,000 ft AGL, or RAD ALT failed with gear retracted", "Altitude separation closing to <800 ft within 30 s at current rate; OR separation <800 ft altitude AND <0.55 NM range; OR a NAR intruder within 20 s or 0.55 NM"],
        ],
      },
    },
    {
      heading: "Traffic symbols",
      table: {
        columns: ["Symbol", "Meaning"],
        rows: [
          ["Open cyan diamond", "Non-Threat Traffic — relative altitude beyond ±1,200 ft or range beyond 5 NM. Not yet a threat."],
          ["Filled cyan diamond", "Proximity Intruder Traffic — within ±1,200 ft and 5 NM, but still not considered a threat."],
          ["Filled yellow circle", "Traffic Advisory — considered potentially hazardous. Triggers the aural 'TRAFFIC, TRAFFIC' warning."],
        ],
      },
      note: "An altitude tag in hundreds of feet appears above (+) or below (−) the symbol; a trend arrow appears if the intruder's vertical rate is 500 ft/min or greater. Non-altitude-reporting intruders show no altitude tag or trend arrow. If TCAS I can't resolve an intruder's bearing, it shows a text line above the TCAS status window instead of a symbol: type, range, and relative altitude.",
    },
    {
      heading: "Aural inhibit near the ground",
      paragraphs: [
        "The aural annunciation is inhibited below 400 ft AGL (or whenever RAD ALT has failed with the landing gear extended), and re-enabled once the helicopter climbs above 600 ft AGL.",
      ],
    },
    {
      heading: "Display controls",
      paragraphs: [
        "ALT toggles the altitude tag between relative and absolute (FLT LEVEL — shown for 15 seconds after selection). VIEW selects the surveillance volume shown: NRM (−2,700/+2,700 ft), ABV (−2,700/+9,000 ft), BLW (+2,700/−9,000 ft), or EXP (±9,000 ft).",
        "Self-test runs for about 8 seconds, during which normal TCAS I operation is inhibited; it forces the display to 2.5 NM range and generates a fixed test picture — a TA at 9 o'clock, 2 NM, 200 ft below and climbing, plus (selecting 5 NM range) proximity traffic at 1 o'clock and non-threat traffic at 11 o'clock.",
      ],
    },
    {
      heading: "Limitations",
      paragraphs: [
        "Intruder traffic within ±45° of the aft direction and above the helicopter's altitude may not be visualized. Beyond 5 NM, double images of a real intruder can occasionally appear for a few seconds. With the landing gear extended, the lower TCAS antenna operates omnidirectionally, so bearing information is unavailable for traffic below the helicopter. Reliability may be degraded during Primus HF 1050 or V/UHF FLEXCOMM II radio transmissions, and — on the standalone Supplement 25 fit — while the Honeywell WX P660 weather radar is in use.",
      ],
    },
  ],
};

const WEATHER_RADAR_GABBIANO: SystemNote = {
  slug: "weather-radar-selex-gabbiano",
  title: "Weather Radar Selex Gabbiano T20N / TS20N",
  subtitle: "The full SAR mission radar — ISAR, Track While Scan, Strip and Spot search patterns — plus the real quirks the RFM documents by name.",
  rfmReference:
    "AW139 RFM Supplement 73 (Radar Selex Gabbiano Series — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures). No Section 7 system description exists for this radar beyond the supplement itself.",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The Selex-Galileo Gabbiano T20N (and TS20N) is a surveillance and weather radar built for maritime missions, with the broadest search-and-rescue mode set of the AW139's three radar options. Hardware: a flat-plate antenna and drive unit, a receiver-exciter processor, a transmitter front-end unit, and a radar control panel in the interseat console with a joystick for cursor/target-marker control. Displays on the MFDs or, if fitted, the central 5th display.",
      ],
    },
    {
      heading: "Modes available",
      paragraphs: [
        "As with the Telephonics radar, the RFM names these modes but does not detail their operating logic — full functionality is documented only in the manufacturer's radar guide.",
      ],
      table: {
        columns: ["Mode", "Purpose"],
        rows: [
          ["Sea surface search", "Maritime surveillance."],
          ["ISAR (Inverse Search and Rescue)", "Search and rescue mode."],
          ["Track While Scan (TWS)", "Continues tracking marked targets while the antenna keeps scanning."],
          ["Strip SAR", "Search and rescue along a defined strip/corridor."],
          ["Spot SAR", "Search and rescue focused on a localized area."],
          ["Weather", "Standard weather-avoidance function."],
          ["Ground mapping", "Terrain/surface mapping."],
          ["Beacon", "Interrogates beacon transponders."],
        ],
      },
    },
    {
      heading: "The hard limitation",
      paragraphs: [
        "The radar must not be used for navigation, or weather/terrain avoidance — a broader restriction than the other two radar fits, which permit weather avoidance as an intended function.",
      ],
    },
    {
      heading: "Documented quirks",
      paragraphs: [
        "The RFM lists several real operating discrepancies by name, worth knowing before relying on the system in a live SAR tasking:",
      ],
      table: {
        columns: ["Situation", "What to know"],
        rows: [
          ["Control panel button presses", "Must be held depressed for at least half a second to register."],
          ["Beacon detection range", "SART: less than 5 NM. SST-181E (two-pulse): less than 10 NM. The DO-172 six-pulse beacon has not been tested. Reducing antenna scan to ±30° improves detection stability."],
          ["STS caption in weather mode", "May illuminate sporadically — not a system malfunction."],
          ["HSS mode", "TWS function is inoperative."],
          ["SRV mode", "A temporarily lost TWS track may not be automatically recovered."],
          ["Entering a Segmented Strip SAR", "Ensure a segment greater than 0 is entered, or the radar may fail and require a full restart."],
        ],
      },
    },
    {
      heading: "Ground transmission and double DC generator failure",
      paragraphs: [
        "The radar does not transmit on the ground due to the WOW safety interlock — but during the Power-Up Built-In Test (PBIT), it's recommended that personnel stay clear of a 17 m (55 ft) radius from the aircraft's nose regardless. If the WOW microswitches fail while the radar is switched ON and it starts transmitting on the ground, the response is to switch the radar OFF.",
        "On a confirmed double DC generator failure, ensure the radar is switched OFF as part of the load-shedding response.",
      ],
    },
  ],
};

const TCAS_II: SystemNote = {
  slug: "tcas-ii",
  title: "TCAS II: Traffic Advisory System II (TPA 100B)",
  subtitle: "Full Resolution Advisory capability — the sensitivity-level table that decides when an RA fires, the exact climb/descend technique, and the complete aural phraseology.",
  rfmReference:
    "AW139 RFM Supplement 82 (Traffic Advisory System II (TCAS II) TPA 100B — General Information, Resolution Advisory Manoeuvres, Limitations, Normal Procedures, Emergency and Malfunction Procedures, Section 7 System Description).",
  sections: [
    {
      heading: "What it does",
      paragraphs: [
        "The TPA 100B monitors a nominal 14 NM radius around the helicopter, interrogating ICAO-compliant transponders. Hardware: a TCAS II processor in the aft avionic bay, plus a directional antenna on top of the nose radome and a second under the rear belly. Interfaced and controlled by Primus Epic software version 7 or later.",
        "From transponder replies it computes range, bearing, closure rate, and — if reported — altitude, deriving the time to Closest Point of Approach (CPA), the main trigger for alerts. It issues Traffic Advisories (TAs) to help the pilot visually acquire the intruder, and Resolution Advisories (RAs) defining a vertical maneuver to increase or maintain separation. RAs are only computed against altitude-reporting intruders — non-altitude-reporting (NAR) traffic gets TAs only. If the intruder is also TCAS II-equipped, the two systems coordinate RAs over Mode S data link so the resolution senses are complementary.",
      ],
    },
    {
      heading: "Sensitivity levels — Tau, DMOD, and ALIM",
      paragraphs: [
        "The operating sensitivity level (SL) is selected automatically from radar or pressure altitude. Below 1,000 ft AGL (±100 ft, from RAD ALT), SL2 applies and RAs are inhibited entirely — TAs only. Above that, SL3 through SL6 scale the alert thresholds with altitude: Tau is the time-to-CPA threshold, DMOD is the range threshold, and ALIM (RA only) is the target vertical separation at CPA.",
      ],
      table: {
        caption: "TCAS II sensitivity levels",
        columns: ["Altitude AGL", "SL", "Tau TA / RA (s)", "DMOD TA / RA (NM)", "ALIM RA (ft)"],
        rows: [
          ["<1,000 ft", "SL2", "20 / N/A", "0.30 / N/A", "N/A — RA inhibited"],
          ["1,000–2,350 ft", "SL3", "25 / 15", "0.33 / 0.20", "300"],
          ["2,350–5,000 ft", "SL4", "30 / 20", "0.48 / 0.35", "300"],
          ["5,000–10,000 ft", "SL5", "40 / 25", "0.75 / 0.55", "350"],
          ["10,000–20,000 ft", "SL6", "45 / 30", "1.00 / 0.80", "400"],
        ],
      },
    },
    {
      heading: "Flying a Resolution Advisory",
      paragraphs: [
        "No banking maneuvers on an RA — fly to the green (fly-to) arc on the VSI. Press and hold the cyclic and collective FTR (Force Trim Release) buttons throughout the maneuver if FD modes are engaged — this keeps the IAS and vertical-mode bugs synchronized with the aircraft's actual airspeed and altitude as you fly, rather than fighting the AFCS's prior targets.",
      ],
      table: {
        caption: "RA technique",
        columns: ["RA", "Technique"],
        rows: [
          ["Climb, IAS above 80 KIAS", "Cyclic to reduce airspeed toward (not below) 80 KIAS, collective simultaneously to MCP 100% PI, or TOP 110% PI when below 90 KIAS"],
          ["Climb, IAS 80 KIAS or below", "Collective to TOP 110% PI, let IAS increase toward (not above) 80 KIAS"],
          ["Descend", "Collective to decrease torque as required — but not into autorotation; minimum 10% PI"],
        ],
      },
      note: "If the required rate can't be achieved within aircraft limits, hold the maximum achievable rate instead. After Clear of Conflict, return promptly to the previous ATC clearance unless otherwise directed. TCAS II keeps monitoring after the RA — if the intruder's flight path changes, it can issue a revised RA; follow it.",
    },
    {
      heading: "Aural phraseology",
      table: {
        columns: ["Phrase", "Meaning"],
        rows: [
          ["Traffic, Traffic", "TA — attempt visual acquisition, prepare for a possible RA"],
          ["Climb, Climb / Descend, Descend", "Fly to the green arc on the VSI, nominally 1,500–2,000 fpm"],
          ["Monitor Vertical Speed", "Keep vertical speed out of the red arc on the VSI until the RA completes"],
          ["Climb, Crossing Climb / Descend, Crossing Descend", "As above, but the maneuver crosses through the intruder's flight path — that's still the best-separation option"],
          ["Maintain Vertical Speed, Maintain / Crossing Maintain", "Hold the current vertical speed shown on the green arc — do not alter it"],
          ["Level Off, Level Off", "Reduce climb/descent rate to level flight"],
          ["Climb – Climb Now / Descend – Descend Now", "A reversal: received after the opposite RA, when the intruder maneuvers and the direction must flip for safe separation"],
          ["Increase Descent, Increase Descent", "Descend at 2,500–3,000 fpm — received after a Descend RA when more separation is needed"],
          ["Clear Of Conflict", "Separation is adequate and increasing — return to the applicable ATC clearance unless otherwise directed"],
        ],
      },
    },
    {
      heading: "Inhibit altitudes",
      table: {
        columns: ["Advisory", "Inhibited below"],
        rows: [
          ["Increase Descent RA", "1,650 ft AGL while climbing / 1,450 ft AGL while descending"],
          ["Descend RA", "1,200 ft AGL while climbing / 1,000 ft AGL while descending"],
          ["All RAs", "1,100 ft AGL while climbing / 900 ft AGL while descending — TCAS II automatically reverts to TA only"],
          ["TA voice messages", "600 ft AGL while climbing / 400 ft AGL while descending"],
          ["Increase Climb RA", "Always inhibited"],
          ["Self-test", "Inhibited whenever airborne"],
        ],
      },
      note: "RAs also automatically revert to TA only whenever a higher-priority advisory — such as an EGPWS/TAWS alert — is active, and RA voice messages are inhibited while EGPWS voice annunciations are playing.",
    },
    {
      heading: "Limitations",
      paragraphs: [
        "Never maneuver on a TA alone — it is for visual acquisition, not a maneuver instruction. Compliance with an RA should be prompt even if it deviates from the current ATC clearance — report the deviation to ATC as soon as operationally possible — but the pilot is not authorized to exceed the aircraft's flight envelope limits chasing an RA. TCAS II must be selected to TA ONLY during underslung load operations, and should be selected to TA ONLY with one engine inoperative (OEI) as well — reselect TA/RA once that condition no longer applies. With the landing gear extended, the lower antenna operates omnidirectionally, so bearing information is unavailable for traffic below the helicopter.",
      ],
    },
    {
      heading: "RA FAIL and system failure",
      paragraphs: [
        "RA FAIL on the PFD means loss of VSI indications has taken the RA audio/visual cues with it — select an alternative ADS source; if the message persists, fall back to visual acquisition and be ready to maneuver on sighting the traffic. TCAS FAIL means the system has failed outright: no traffic information, TAs, or RAs are available.",
      ],
    },
  ],
};

const EGPWS: SystemNote = {
  slug: "egpws",
  title: "EGPWS MK XXII",
  subtitle: "AW139's terrain awareness and warning system — six GPWS modes, Look-Ahead alerting, and the LOW ALT/OFFSHORE/SAR modes that trade envelope sensitivity for fewer nuisance warnings.",
  rfmReference:
    "AW139 RFM Supplement 81 (Enhanced Ground Proximity Warning System MK XXII — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures, Section 7 System Description).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The Honeywell MK XXII EGPWS is TSO C194-compliant and comes in five software versions (-024, -026, -030, -034, -036), each with different available functionality depending on which version and which Primus Epic software phase is installed — -036 is the most capable, adding sub-modes and OEI-specific logic the earlier versions don't have. It provides three outputs: a Terrain/Obstacle Awareness Display, voice alerts/warnings/callouts, and visual caution/warning messages, through two independent functions — Ground Proximity Warning System (GPWS) and Terrain Awareness Display with Look-Ahead alerting.",
        "The system merges barometric altitude, radio altitude, and GPS-derived altitude into a 'Geometric Altitude' — this is what drives the terrain display and alerting, not raw barometric altitude, making it less susceptible to altimeter-setting errors, cold-temperature effects, or altimeter malfunctions.",
      ],
    },
    {
      heading: "GPWS — six modes",
      table: {
        columns: ["Mode", "What it catches", "Key numbers"],
        rows: [
          ["1 — Excessive Descent Rate", "Descending too fast for the altitude.", "'SINK RATE' caution (repeats faster as it worsens) escalates to continuous 'PULL UP' warning if the boundary is penetrated."],
          ["2 — Excessive Terrain Closure Rate", "Closing with terrain too fast — descending, level, or even climbing.", "'TERRAIN TERRAIN' caution escalates to continuous 'PULL UP'. De-sensitized (Mode 2B) with gear down, on an ILS approach, or within 60 s of takeoff."],
          ["3 — Loss of Altitude After Takeoff", "Losing significant altitude after takeoff/go-around with gear up, or above 50 KIAS.", "'DON'T SINK' caution until a positive climb rate is established. Inhibited above 100 ft AGL in LOW ALT mode. On -036, split into 3A (altitude loss) and 3B (airspeed loss below 55 kt after exceeding 60 kt — 'CHECK AIRSPEED')."],
          ["4 — Unsafe Terrain Clearance", "Insufficient clearance for phase of flight and speed.", "Subdivided into 4A (cruise/approach, gear up), 4B (cruise/approach, gear down — 'TOO LOW TERRAIN' above 120 KIAS below 100 ft, tightening to 10 ft by 80 KIAS), 4C (takeoff, gear up). Disabled in SAR mode."],
          ["5 — Descent Below Glideslope", "Flight path drops below the ILS or LPV glideslope.", "Half-volume 'GLIDESLOPE' caution at >1.3 dots low; full-volume below 300 ft radio altitude with >2 dots deviation."],
          ["6 — Advisory Alerts", "Excessive bank, tail strike risk, autorotation altitude callouts.", "'BANK ANGLE' beyond 30° (10–50 ft AGL) sloping to 55° by 1,000 ft. 'TAIL TOO LOW' beyond 15° pitch-up at 3 ft AGL sloping to 48.5° by 50 ft. Autorotation callouts at 200/100/80/60/40/20/10 ft radio altitude."],
        ],
      },
    },
    {
      heading: "Terrain Awareness and Look-Ahead",
      paragraphs: [
        "Using GPS position, attitude, heading, ground speed/track, and the terrain/obstacle database, the system projects the flight path roughly 30 seconds ahead. A threat there paints solid yellow and triggers 'Caution Terrain, Caution Terrain' (or 'Caution Obstacle'), repeating every ~7 seconds if the threat persists. Inside about 20 seconds, it escalates to continuous 'Warning Terrain, Warning Terrain' (or 'Warning Obstacle') with the threat area shown in solid red.",
        "The look-ahead envelope shrinks below 100 knots and is fully inhibited below 70 knots — it's a forward-looking function tied to groundspeed, not a low-speed safety net.",
      ],
    },
    {
      heading: "Terrain display colors",
      paragraphs: [
        "Up to and including EPIC Phase 7, the display uses three colors relative to aircraft altitude: green (terrain ≥250 ft below — safe clearance), yellow (250 ft below to 500 ft above — clearance not assured), red (≥500 ft above — no safe clearance, may be unable to escape). Bodies of water below 100 ft show as cyan.",
        "EPIC Phase 8 replaces this with 5-level Situational Awareness (SA) Terrain coloring: Level 1 (>500 ft above, red high-density) through Level 5 (500–1,500 ft below, green low-density). Terrain more than 1,500 ft below reverts to plain Absolute Terrain coloring.",
      ],
    },
    {
      heading: "LOW ALT, OFFSHORE, and SAR — desensitized modes",
      paragraphs: [
        "These three modes are mutually exclusive with each other and with normal operation, and exist to reduce nuisance warnings during specialized low-level flying — the RFM is explicit that they must not be selected during conventional approved IFR procedures, since desensitizing the envelope for these operations makes it inappropriate for IFR terrain protection.",
      ],
      table: {
        columns: ["Mode", "Intended for", "What it changes"],
        rows: [
          ["LOW ALT", "Low-altitude VFR operations (below 500 ft AGL)", "Inhibits Mode 1 and Mode 2 entirely. Mode 3 'DON'T SINK' inhibited above 100 ft. Mode 4 boundaries reduced (or inhibited outright on -030/-034/-036). TA caution/warning timing tightened from 26±5 s/18±5 s to 25±5 s/15±5 s."],
          ["OFFSHORE (Phase 7/8 only)", "Offshore operations", "Modifies forward-looking boundaries to cut nuisance alerts; sea-level water shown blue unless a terrain alert is active. Mode 2 'TERRAIN TERRAIN' inhibited."],
          ["SAR (Phase 7/8 only)", "Search and rescue", "Modifies forward-looking boundaries; sea-level water normally shown cyan (blue on Phase 8), but while flying low over water it colors by actual vertical separation (green/amber/red) unless OFFSHORE is also active. Mode 1 and Mode 2 inhibited; Mode 4 'TOO LOW TERRAIN' also inhibited on -030/-034/-036."],
        ],
      },
    },
    {
      heading: "Other selectable functions",
      paragraphs: [
        "G/S CANCEL suppresses nuisance glideslope alerts when receiving an active ILS signal without flying an ILS approach — it re-arms automatically above 2,000 ft AGL, below 50 ft AGL, or on tuning a different NAV frequency. TERR INHIBIT (TAWS INHIBIT) mutes all Look-Ahead visual/aural cautions and warnings while leaving the terrain display itself running. MUTE silences all EGPWS aural alerts for five minutes, except the Mode 6 advisory alerts (bank angle, tail too low, autorotation callouts) — deselecting it restores audio immediately.",
      ],
    },
    {
      heading: "Self-test",
      paragraphs: [
        "Running the TAWS self-test should produce, in sequence: a TAWS TEST message, a momentary TERR N/A (or TAWS N/A), a momentary TAWS LOW ALT advisory, momentary TAWS AUDIO MUTE and TAWS GS CANCEL advisories, GLIDESLOPE and PULL UP audio for both pilots, a terrain self-test display pattern (or an SA Terrain brightness change on Phase 8 with -034/-036), and a WARNING! TERRAIN audio message. On conclusion, confirm the test pattern clears and no TAWS messages remain active.",
      ],
    },
    {
      heading: "Failure indications",
      table: {
        columns: ["Message", "Meaning"],
        rows: [
          ["GPWS INOP", "Ground Proximity Warning System inoperative."],
          ["TAWS FAIL", "Loss of valid TAWS information."],
          ["TERR (half-range ring)", "Loss of terrain video data."],
          ["TERR INOP / TAWS INOP (Phase 8)", "Terrain awareness function inoperative."],
          ["TERR N/A / TAWS N/A (Phase 8)", "Terrain display unavailable due to loss of valid satellite information — accompanied by the 'BE ALERT TERRAIN INOP' audio alert."],
        ],
      },
      note: "For any of these, terrain and obstacle indications and alerts are not available or not reliable — treat the terrain display as gone, not degraded.",
    },
    {
      heading: "Limitations",
      paragraphs: [
        "EGPWS must not be used for navigation — the terrain/obstacle display and database may not have the accuracy to base routine navigation or route-planning decisions on. The database covers terrain and obstacles higher than 100 ft AGL only; power lines and wires are not included.",
      ],
    },
  ],
};

const OPLS: SystemNote = {
  slug: "opls",
  title: "OPLS: Obstacle Proximity LiDAR System",
  subtitle: "Three LiDAR heads, 360° coverage in one plane only — what the color bands and tones mean, and the one thing it can't see.",
  rfmReference:
    "AW139 RFM Supplement 84 (Obstacle Proximity LiDAR System — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "OPLS gives the pilot a visual and audio indication of obstacle distances around the aircraft during hover and low-speed flight. Three LiDAR (Laser Imaging Detection and Ranging) units are mounted around the transmission cowling below the rotor head, each transmitting a low-power, eye-safe laser and receiver. Their three overlapping beams are digitally mixed by a processing unit to build a 360° obstacle profile — but only in the single horizontal plane of the sensor units. Nothing above or below that plane is detected.",
        "The obstacle profile displays on the MFD or central 5th display as a helicopter plan view on a polar range grid, with the nearest obstacle's distance called out at the top of the display and shown as a color-coded radial line.",
      ],
    },
    {
      heading: "Color bands and audio",
      table: {
        columns: ["Band", "Meaning", "Audio"],
        rows: [
          ["Green", "Safe", "—"],
          ["Yellow", "Caution", "'APPROACHING' on transition from Green"],
          ["Red", "Critical", "'CHECK DISTANCE' on transition from Yellow"],
        ],
      },
      note: "An intercom tone also rises in frequency as distance decreases. MUTE (panel button or the collective's CAS RST button) can be selected while in the Yellow band — it does nothing if pressed in Green or Red. Muted audio reactivates automatically the moment the aircraft enters the Red band, or manually via the panel MUTE button.",
    },
    {
      heading: "Controls",
      paragraphs: [
        "The OPLS Controller switches the system ON/OFF and shows status: OFF, STBY, ON, or ERROR. The display itself is brought up on the MFD via the cursor control device, selecting SYSTEM then VIDEO.",
      ],
    },
    {
      heading: "Limitations",
      paragraphs: [
        "OPLS is a hover and low-speed obstacle awareness aid only — the primary means of obstacle avoidance remains see-and-avoid. Its symbology must not be used as the basis for takeoff, landing, or any in-flight maneuver; the display may not have the accuracy or fidelity for that.",
        "It can detect obstacles of any material except large glass surfaces, which it may miss entirely. Fog, mist, rain, cloud, or snow can generate spurious signals or degrade the distance information. And as noted above, it only sees the single plane the sensors sit in — nothing above or below the aircraft.",
      ],
    },
    {
      heading: "Failure and double DC generator failure",
      paragraphs: [
        "Any OPLS failure removes the display and replaces it with a red cross, deactivates the audio, and illuminates ERROR on the control panel.",
        "On a confirmed double DC generator failure, ensure OPLS is switched OFF as part of the load-shedding response.",
      ],
    },
  ],
};

const RNP_OPERATIONS: SystemNote = {
  slug: "rnp-operations",
  title: "RNP Operations (LPV, RNP AR APCH, RNP APCH)",
  subtitle: "Every navigation specification the AW139 is certified for, the DA(H) and glideslope limits behind them, and how a lost GPS or FD actually plays out mid-approach.",
  rfmReference:
    "AW139 RFM Supplement 80 (RNP Operations, EPIC Phase 7 and later — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures, Section 7 System Description).",
  sections: [
    {
      heading: "What's certified",
      paragraphs: [
        "With Primus Epic Phase 7 or later, the AW139 is certified for a specific set of RNP navigation specifications per ICAO Doc 9613 (PBN Manual). RF (Radius to Fix) legs are supported in terminal procedures, including approaches, for RNP 1, RNP 0.3, RNP APCH, and RNP (AR) APCH.",
      ],
      table: {
        columns: ["Specification", "Dep", "En-route", "Arrival", "Initial", "Intermediate", "Final", "Missed"],
        rows: [
          ["RNP 2", "—", "2", "—", "—", "—", "—", "—"],
          ["RNP 1", "1", "1", "1", "1", "—", "1", "1"],
          ["RNP APCH — LNAV & LNAV/VNAV minima", "—", "—", "—", "1", "1", "0.3", "1"],
          ["RNP APCH — LPV minima", "—", "—", "—", "1", "1", "Angular", "1"],
          ["RNP AR APCH — RNP 0.3 NM minima", "—", "—", "—", "0.3", "0.3", "0.3", "1"],
          ["RNP 0.3", "0.3", "0.3", "0.3", "0.3", "—", "0.3", "0.3"],
        ],
      },
      note: "RNP APCH approaches with LP minima are not supported. Procedures with RNP lower than 0.3 NM in the approach segment, or 1.0 NM in the missed approach, are not authorized. RNP AR APCH 0.3/MA 1.0 certification approval does not by itself constitute operational approval.",
    },
    {
      heading: "The numbers",
      table: {
        columns: ["Limit", "Value"],
        rows: [
          ["Max glideslope angle — LPV approaches", "9°"],
          ["Max glideslope angle — RNP AR APCH, LNAV/VNAV, LNAV", "8.3°"],
          ["Min APP mode engagement airspeed — RNP APCH", "50 KIAS"],
          ["Max rate of descent approaching the MAP", "1,000 fpm"],
          ["Min DA(H) — RNP AR APCH, LNAV/VNAV, LNAV", "250 ft"],
          ["Min DA(H) — LPV approaches", "200 ft"],
        ],
      },
      note: "IAS mode is recommended for RNP APCH and RNP AR APCH approaches below 60 KIAS — for airspeeds below 60 KIAS engage IAS mode. The airspeed at the FAF and MAP shown on the approach plate must not be exceeded.",
    },
    {
      heading: "AFCS coupling requirements",
      paragraphs: [
        "RNP operations must be flown on the default Flight Director coupled mode, or by following raw data — flying RNP procedures with the FD in uncoupled mode is not approved. For RNP APCH approaches with a glideslope steeper than 7.5°, the final segment (FAF to MAP) must be flown with AFCS approach modes coupled; if a failure decouples the FD after the FAF, discontinue the approach. RNP procedures using RF legs must be flown with LNAV coupled — the same rule applies if a failure decouples it.",
        "The FMS offset function is forbidden during RNP 0.3 operations.",
      ],
    },
    {
      heading: "Flying an LPV approach",
      paragraphs: [
        "Before the FAF: confirm the white/green 'LPV' advisory and the correct LPV Approach Reference Path Identifier on the PFD, set DA(H) per the chart, and complete PERF INIT. Arm LNAV & VGP via APP or DCL on the guidance controller if flying it coupled — don't mix engaged LNAV with hands-flown vertical deviation and no VGP engaged; that combination isn't used for LPV.",
        "During the final segment: once APP shows green, confirm 'LPV' also turns green and — if coupled — that lateral mode transitions automatically from LNAV to NLOC. Confirm NGS engaged, and IAS or DCL as required (IAS below 60 KIAS). Adjust airspeed for wind so the rate of descent stays under 1,000 fpm approaching the MAP.",
        "At or before DA(H): with the required visual references acquired, press STBY to disengage the FD modes and fly manually to landing. Without those references, fly the missed approach: press GA on the collective, confirm LNAV engages and stays engaged — GA mode does not target altitude constraints, so the pilot must manage altitude per the published missed approach procedure.",
      ],
    },
    {
      heading: "Flying an RNP AR APCH / RNP APCH (LNAV, LNAV/VNAV)",
      paragraphs: [
        "At the IAF: check the lateral deviation indicator on the HSI after sequencing, and cross-check pilot/copilot (or standby) altimeters agree within ±100 ft — if that cross-check fails, the procedure must not continue.",
        "Before the FAF: confirm the green APP advisory and 'P' in the vertical deviation bug. Lateral deviation must stay within the RNP limit with no 'DGR' message displayed, or the procedure must be discontinued. During an RNP AR APCH, the aural 'RNP RNP' message with the expanded lateral deviation indicator turning amber on the ADI is itself the signal to discontinue.",
        "During the final segment and missed approach, the flow mirrors the LPV procedure above: VGP (rather than NLOC) engaged, IAS below 60 KIAS, ROD under 1,000 fpm to the MAP; STBY to hand-fly once visual, or GA with manual altitude management if not.",
      ],
    },
    {
      heading: "When it degrades — GPS, LPV, and FD failures",
      table: {
        columns: ["Failure", "Result", "Action"],
        rows: [
          ["GPS FAIL (single-GPS aircraft)", "FMS reverts to non-GNSS sensors — loss of RNP capability entirely", "Discontinue the current RNP procedure and notify ATC"],
          ["Single GPS FAIL (dual-GPS aircraft)", "Loss of GPS redundancy only", "Continue flight"],
          ["Double GPS FAIL (dual-GPS aircraft)", "FMS reverts to non-GNSS sensors — loss of RNP and LPV capability", "Discontinue the current RNP procedure and notify ATC"],
          ["Single LPV UNAVAIL", "Loss of LPV redundancy on one side", "Before the FAF: select an alternative LNAV source, continue. After the FAF: if LPV/NLOC (or LNAV/VGP) disengages with a chime, discontinue; otherwise re-engage APP or DCL and continue"],
          ["Double LPV UNAVAIL", "LPV approach unavailable on both sides", "Before the FAF: continue using LNAV/VNAV minima or another approved means, if available — otherwise discontinue. After the FAF: discontinue"],
        ],
      },
      note: "Even in degraded mode, or once reverted to non-GNSS sensors, the FMS keeps providing position, groundspeed, and ground track, and procedure waypoints stay on the PFD — degraded navigation guidance is still displayed, it's just no longer valid for RNP.",
    },
  ],
};

const DIGITAL_MAP: SystemNote = {
  slug: "digital-map",
  title: "Digital Map Systems: Skyforce Observer & EURONAV",
  subtitle: "Two alternate moving-map fits — both are awareness tools only, and the RFM's coverage of either is genuinely thin.",
  rfmReference:
    "AW139 RFM Supplement 27 (Skyforce Observer Digital Map System — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures) and Supplement 28 (EURONAV Digital Map System — same structure). Neither supplement has a Section 7 system description; both defer fully to the manufacturer's own operator's manual for functionality.",
  sections: [
    {
      heading: "Two alternate fits",
      paragraphs: [
        "Skyforce Observer and EURONAV (IV, V, or 7) are alternative digital moving-map installations — an aircraft has one or the other, not both. Both display on the central 5th display (and, depending on configuration, the MFD), take GPS data primarily from the onboard FMS with an internal GPS receiver as backup, and show the aircraft as a fixed icon with the map moving underneath in north-up or track-up orientation.",
        "EURONAV V and 7 are functional upgrades over EURONAV IV, adding flight-plan display, FLIR and AIS transponder interfaces, and keyboard operation — EURONAV IV cannot show FMS flight-plan data at all. Both V and 7 can also be installed in the cabin Mission Console, operated by a Mission Systems Operator, with the display optionally repeated in the cockpit.",
      ],
    },
    {
      heading: "The hard limitation",
      paragraphs: [
        "Neither system may be used for navigation. Both are explicitly awareness tools only — the display and database may not have the accuracy or fidelity to base routine navigation decisions or route planning on. On the Skyforce Observer fit specifically, the full ARINC FMS option must not be selected.",
      ],
    },
    {
      heading: "Data retention",
      paragraphs: [
        "To make sure pilot-entered data is retained, enter it after engine start — or, if entered on external power before start, switch the digital map system off before engine start. Either way, switch it off again before rotorcraft shutdown.",
      ],
    },
    {
      heading: "Double DC generator failure",
      paragraphs: [
        "On a confirmed double DC generator failure, ensure the digital map system is switched OFF as part of the load-shedding response.",
      ],
    },
  ],
};

const FD_SAR_MODES: SystemNote = {
  slug: "fd-sar-modes",
  title: "4-Axis Enhanced Flight Director — SAR Modes",
  subtitle: "RHT, HOV, TD/TDH, MOT and WTR — the coupled autopilot modes that fly an automatic approach to a hover over a marked target, and the PI/height-protection numbers behind them.",
  rfmReference:
    "AW139 RFM Supplement 69 (4 Axis Enhanced Flight Director with SAR Modes, EPIC Software Phase 5 and later — General Information, Limitations, Normal Procedures: SAR Operations, Mode Descriptions, FMS Search Patterns).",
  sections: [
    {
      heading: "What this supplement adds",
      paragraphs: [
        "This is the full version of the AW139's 4-axis coupled Flight Director — everything the standard IFR/enroute mode set does (HDG, ALT, IAS, ALTA, NAV, APP, DCL, BC, VS, GA, ALVL) plus a dedicated family of SAR modes that couple the collective and cyclic to fly the aircraft down to, and hold, a stabilized low-level hover — the core capability behind a coupled search-and-rescue approach.",
        "SAR mode operation has been demonstrated up to 40 kt wind speed (20 kt tailwind component) and wave heights up to 5.5 m (18 ft). Before flying a MOT (Mark on Target) pattern, FMS PERF INIT must be initialized on the MCDU, and both PFD barometric altimeters should be set to the same setting.",
      ],
    },
    {
      heading: "The SAR mode chain",
      table: {
        columns: ["Mode", "What it does"],
        rows: [
          ["RHT — Radar Height Hold", "Holds the radar height existing at engagement, shown as a bug/digital readout on the radar altimeter tape. Adjustable via collective FTR-and-fly or the beep trim. Collective PI limiting is active whenever RHT is coupled."],
          ["HOV — Hover/Velocity Hold", "Uses AHRS ground velocities to hold a hover or low-speed flight condition. Sets groundspeed reference to zero at engagement and auto-engages RHT if radar altimeter data is valid. Above 2,000 ft AGL, ALT does not auto-engage with HOV — the pilot must manage collective manually or select ALT."],
          ["TD — Transition Down", "From 300–2,050 ft AGL and above 60 KIAS, flies a coupled descent/deceleration to 200 ft AGL and 80 KIAS level flight, then auto-engages IAS and RHT."],
          ["TDH — Transition Down to Hover", "From 50–300 ft AGL and below 90 KIAS, flies a coupled descent/deceleration to a 50 ft AGL, zero-groundspeed hover, then auto-engages RHT and HOV."],
          ["MOT — Mark on Target", "Marks the current position as a waypoint, then flies a downwind leg and an upwind turn to establish a 0 kt, 50 ft AGL hover 150 ft to the left and 150 ft downwind of the marked point — see the three-phase breakdown below."],
          ["WTR — Winchman Trim", "Available in HOV only. Hands lateral/longitudinal groundspeed control (up to 10 kt from the pilot-set HOV value) to the Hoist Operator via the hoist pendant's 5-position switch. Pilot input always overrides the HO's."],
        ],
      },
      note: "TD, TDH, and MOT are each exited only by pressing their own mode button again, selecting a different vertical FD mode, or putting the FD to STBY. Both TDH and MOT inhibit the CAS 'LANDING GEAR' caution and audio while engaged.",
    },
    {
      heading: "Flying a MOT approach",
      paragraphs: [
        "MOT breaks into three phases. First, Approach to FHAF (Final Hover Approach Fix) — the aircraft flies FMS commands to a point about 0.8 NM downwind of the target, headed into wind, arriving at roughly 250 ft AGL and 60 kt groundspeed. Second, Approach to Final Hover Fix — a 3° descent path from the FHAF down to the hover waypoint. Third, Approach to Final Target — the pilot flies the aircraft from the hover waypoint to the actual target.",
        "Collective mode annunciation tracks the phase: VRHT during the level-flight intercept of the vertical path, VPTH once established on the 3° slope, then PTH for the final segment after the FHAF. On the pitch axis, VIAS shows before the FHAF (adjusting IAS to make 60 kt groundspeed at the FHAF), switching to DCL at the FHAF as the aircraft decelerates from 60 kt to 0 kt. A magenta vertical path indicator on the PFD centers when tracking the 3° path.",
        "After the FHAF, pressing the collective FTR button re-synchronizes the final hover height to whatever height the aircraft is actually at when pressed (with RHT engaging); pressing the cyclic FTR button does the same for groundspeed (with HOV engaging).",
      ],
    },
    {
      heading: "Collective PI limiting",
      table: {
        columns: ["Limit", "Value"],
        rows: [
          ["Max AEO", "97% (95% above 10,000 ft Hp)"],
          ["Max AEO below 60 KIAS", "106% (5-minute limited — 'LIM' caption shown)"],
          ["Max OEI", "140%"],
          ["Min AEO", "5%"],
          ["Min OEI", "10%"],
        ],
      },
      note: "If PI limiting is active with IAS engaged and the collective mode's reference (VS, ALTA, RHT, GA, or ALT) can't be met, airspeed automatically reduces to compensate — down to a floor of 80 KIAS, below which the collective reference itself is relaxed instead. If ALT/RHT is engaged and the reference height still can't be held under PI limiting, the aural 'Altitude Altitude' warns once the allowed deviation is exceeded. Above 15,000 ft, select Load Share to TORQUE on the MISC panel to improve automatic-turn handling.",
    },
    {
      heading: "Fly-Up safety function",
      paragraphs: [
        "Whenever a collective FD mode is engaged and coupled with at least one valid Rad Alt, a height-protection function watches a mode-dependent Safety Height and flies the aircraft back up to it automatically if breached. A separate, fixed Ultimate Fly-Up Limit sits below that as a hard backstop.",
      ],
      table: {
        columns: ["Collective mode", "Safety height", "Ultimate fly-up limit"],
        rows: [
          ["VS / ALTA", "150 ft AGL", "150 ft AGL"],
          ["ALT — below 55 KIAS or in HOV", "35 ft AGL", "35 ft AGL"],
          ["ALT — all other conditions", "150 ft AGL", "150 ft AGL"],
          ["RHT — below 55 KIAS, HOV, MOT-DCL, or TDH-pitch", "Variable*", "15 ft AGL"],
          ["RHT — all other conditions", "Variable*", "75 ft AGL"],
          ["TDH / MOT / VPTH", "Variable*", "35 / 35 / 150 ft AGL respectively"],
          ["TD", "Variable*", "75 ft AGL"],
        ],
      },
      note: "*Safety Height = Rad Alt Reference − (7 + ⅛ × Rad Alt Reference). A breach triggers the aural 'Altitude Altitude' with an HTLM message top-left of the attitude indicator — even when flying uncoupled. During the automatic recovery, PI limits temporarily raise to 121% AEO / 176% OEI below 60 KIAS, or 110% AEO / 160% OEI above 60 KIAS. Treat 'Altitude Altitude' + HTLM as a terrain-proximity event: confirm visual separation, or if that's not possible, establish a positive rate of climb immediately.",
    },
    {
      heading: "FMS search patterns",
      paragraphs: [
        "Four SAR search patterns are available in the FMS, inserted into the flight plan via the MCDU and flown using the NAV function: Expanding Square, Sector, Creeping Ladder, and Parallel.",
      ],
    },
  ],
};

const DITCHING: SystemNote = {
  slug: "ditching-configurations",
  title: "Ditching Configurations",
  subtitle: "Sea State 6 approval, four flotation bags, two life raft options — and the exact AEO, OEI, and twin-engine-failure water-landing profiles, numbers included.",
  rfmReference:
    "AW139 RFM Supplement 9 (Ditching Configurations — General Information, Limitations, Normal Procedures, Emergency Procedures: Ditching AEO/OEI, Autorotative Landing Procedure on Water).",
  sections: [
    {
      heading: "What's certified",
      paragraphs: [
        "Ditching regulations require demonstrated emergency water-landing capability and buoyancy up to Sea State 4 — this installation has been demonstrated and approved to Sea State 6.",
        "The Emergency Flotation and Life Raft System comprises four flotation bags (nose left/right, lower-aft-central left/right) plus two life rafts mounted externally on the upper sponsons. Two life raft options exist: 11-man (17-man overload) or 9-man (14-man overload) — fitting the 9-man rafts caps maximum cabin passengers at 12. Life rafts may be removed entirely where not required by national operating rules, without affecting the flotation system.",
      ],
    },
    {
      heading: "Activation",
      paragraphs: [
        "Flotation bags deploy automatically on water contact via water sensors — two of the four sensors must trigger for inflation — or manually via the guarded FLOAT pushbutton on either collective grip. Either path requires the OFF/ARMED switch on the FLOATS EMER panel to be set to ARMED beforehand; that panel also has a self-test function.",
        "Life rafts inflate independently, left or right, either via a remote handle at the pilot/copilot forward door frame, or via a handle mounted directly on the life raft container itself, under a marked flap.",
      ],
    },
    {
      heading: "Limitations",
      paragraphs: [
        "Takeoff after ditching is prohibited. The flotation system is for ditching only — bags must never be inflated in flight; they deploy automatically only on water touchdown.",
      ],
    },
    {
      heading: "Ditching profile — AEO",
      paragraphs: [
        "Confirm ARMED (FLOAT ARM caution on CAS) and gear UP — if gear won't retract, ditch at minimum forward speed instead. Approach to arrive 200 ft above the touchdown point at no more than 500 fpm rate of descent, decelerating to 30 kt by 50 ft. At 50 ft, rotate nose up to approximately 20° to decelerate further into the hover, then touch down cushioning with collective in a level or slightly nose-up (5°) attitude, avoiding rearward movement.",
        "Radar altimeter should be the primary height reference during the descent — height estimation over water is unreliable by eye. Land into wind and, where possible, head-on into oncoming waves rather than into the face of a wave. At high touchdown speeds gyroscopic effects can roll and turn the aircraft left — be ready to correct. The rotor brake does not function after ditching, even with the gear extended.",
        "After touchdown: confirm flotation inflated (FLOAT override pushbutton on either collective grip if not), lower collective, brief the jettison of emergency exits, shut down engines per the emergency shutdown procedure, then gently raise collective to slow the rotor if needed — this will yaw the helicopter left. Once the rotor is stopped, generators and battery master OFF via the gang-bar, then deploy life rafts (pilot/copilot handles, or the externally marked container handle if that fails) and evacuate with life preservers.",
      ],
    },
    {
      heading: "Ditching profile — OEI",
      paragraphs: [
        "Same sequence, adjusted for reduced power: reduce speed to a recommended 80 KIAS, then fly the same 200 ft / 500 fpm initial point. Decelerate to 30 kt by 50 ft, nose up to a maximum of 20°, and continue decelerating to reach landing attitude (level or 5° nose-up) at the slowest achievable forward speed — not exceeding 30 kt — applying collective to cushion touchdown. The rest of the sequence (flotation check, engine shutdown, rotor stop, electrical isolation, life raft deployment, evacuation) is identical to the AEO profile.",
      ],
    },
    {
      heading: "Autorotative landing on water — twin engine failure",
      paragraphs: [
        "Enter autorotation promptly, trim to an airspeed between 80 KIAS (minimum rate of descent) and 100 KIAS (best range), and adjust collective to hold up to 110% NR. Confirm ARMED and gear UP as above, maneuver into wind, and shut down engines if time permits.",
        "At approximately 200 ft AGL, initiate a cyclic flare to a maximum 30° nose-up, managing collective to keep NR at a maximum of 110% through the flare. At approximately 35 ft AGL, reduce to 10° nose-up and apply collective as required to achieve touchdown at roughly 300 fpm or less, approaching into oncoming waves if possible, at a touchdown speed not exceeding 30 kt. Lower collective promptly after touchdown, then follow the same flotation-check, exit-jettison, and evacuation sequence as the AEO/OEI profiles.",
      ],
    },
  ],
};

const CPI_ELT: SystemNote = {
  slug: "cpi-elt",
  title: "Crash Position Indicator with Deployable ELT",
  subtitle: "A beacon that deploys itself off the airframe on crash or ditching — two frequencies, two battery lives, and a manual-activation quirk worth knowing before you test it.",
  rfmReference:
    "AW139 RFM Supplement 10 (Crash Position Indicator with Deployable ELT — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The CPI is a primary radio location aid for search and rescue in a distress condition. The ELT itself is mounted on the left side of the tail cone as a self-contained locator beacon (transmitter + antenna), designed to physically deploy from the aircraft in a crash. The system also comprises a Beacon Release Unit, System Interface Unit, cockpit control panel, a water-activated switch, and an Aircraft Identification Device.",
      ],
    },
    {
      heading: "Two frequencies, two endurances",
      table: {
        columns: ["Frequency", "Signal", "Typical endurance"],
        rows: [
          ["121.5 MHz", "Standard swept tone", "~48 hours"],
          ["406.025 MHz", "Encoded digital message with aircraft position, sourced from GPS/FMS via ARINC", "~24 hours"],
        ],
      },
      note: "The beacon activates automatically on crash or ditching (via the water-activated switch and impact sensing), but can also be manually activated at the pilot's discretion.",
    },
    {
      heading: "Self-test — the monthly limit",
      paragraphs: [
        "The Self-Test function must not be run more than once a month — running it more often shortens battery life. Notify the nearest ATC facility before testing, since the transmitted distress signal will be treated as valid. A correct test shows both TX/TEST and BEACON GONE lights illuminate, with TX/TEST flashing in sync with the audio tone audible on 121.5 MHz VHF, before both extinguish.",
      ],
    },
    {
      heading: "Manual activation — the one-way door on P/N 3G2560F00311",
      paragraphs: [
        "Manual transmission-only activation: lift the guard on the CPI controller and operate the TRANSMIT switch — TX/TEST illuminates with an audio tone. It can be stopped by moving TRANSMIT to OFF and pressing TEST/RESET.",
        "Manual deployment (physically releasing the beacon): lift the guard on the cockpit control panel and operate DEPLOY — both TX/TEST and BEACON GONE illuminate.",
      ],
      note: "On P/N 3G2560F00311 specifically, manually activating the beacon (transmission only, without deploying it) locks out the system from any further deployment — manual or automatic — until it's reset: TRANSMIT switch to OFF, guard lowered, then RESET pressed. Know this before testing on the ground: an unintended manual activation can leave the beacon undeployable in a real event until deliberately reset.",
    },
  ],
};

const IPS: SystemNote = {
  slug: "ice-protection-system",
  title: "Ice Protection System (IPS) — Flight in Icing Conditions",
  subtitle: "Full known-icing certification: how the automatic de-ice cycle actually behaves, what a torque rise is telling you, and the exact severe-icing drill.",
  rfmReference:
    "AW139 RFM Supplement 71 (Ice Protection System — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures, Section 7 System Description).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The IPS enables full known-icing operations — IFR day/night — by automatically de-icing the main rotor blades and continuously anti-icing the tail rotor blades, controlled by two independent channels (A and B) that scale with icing severity in real time. Main rotor protection is electrical heating of six leading-edge zones sequenced along the blade span; tail rotor protection is continuous heating of all four blades' leading edges. Power comes from two main-gearbox-mounted AC generators, distributed through a control box, distribution boxes, and slip rings, informed by OAT sensors and Ice Detector (LWC — Liquid Water Content) sensors.",
        "Operations in icing conditions are only permitted with the aircraft configuration matching the AW139 Icing Compatibility Reference Handbook (139G3000A001) — any configuration change affecting icing that isn't in that document makes the aircraft NOT icing compatible.",
      ],
    },
    {
      heading: "Reading the torque rise",
      paragraphs: [
        "In AUTO mode, the MR de-ice system deliberately lets a small amount of ice accrete on each leading-edge zone before sequentially heating it off — so a torque increase that cycles up and down with the heating cycle is normal, not a fault. About 2–3% of that rise is just the AC generators' own power draw. The ice-driven component typically runs 5–15% depending on OAT, LWC, and droplet size (MVD), though more severe conditions (higher LWC, larger droplets) can push it higher. No rotor imbalance is expected from normal ice shedding, since heating is symmetric across the 5 MR blades and continuous on the TR — small pieces of shed ice striking the windscreen are a normal, if startling, side effect.",
        "The ICING caution on the CAS illuminates whenever OAT ≤ +4°C with the IPS OFF, or for 5 seconds when the IPS is ON and at least one ice detector confirms ice. The IPS panel's ICE SEVERITY window shows LWC directly. The SLD marker — a black-centered sphere with yellow/red rings on the right fuselage, visible through the side window — helps the pilot visually confirm ice accretion and detect Supercooled Large Droplet (SLD) conditions.",
      ],
    },
    {
      heading: "Ice types",
      paragraphs: [
        "Glaze ice is clear, forms at higher sub-zero temperatures (0°C to −5°C) with higher LWC and larger droplets, and can produce a significant drag increase from its shape. Rime ice is white and opaque, forms at colder temperatures with smaller droplets, and stays more streamlined with less drag penalty. A mix of both is called Glime or Mixed Ice.",
        "Flight in known Freezing Rain, Freezing Drizzle, or SLD conditions is prohibited outright — these fall outside the atmospheric envelope any current aircraft is certified against. If encountered inadvertently, vacate immediately.",
      ],
    },
    {
      heading: "The numbers",
      table: {
        columns: ["Limit", "Value"],
        rows: [
          ["Max airspeed in icing with IPS failed", "80 KIAS — vacate icing as soon as possible"],
          ["Max rate of descent in icing (or after, while ice remains)", "1,000 fpm"],
          ["VNE in icing", "Per the airspeed-vs-density-altitude chart — lower than the standard VNE"],
        ],
      },
      note: "Altitude and OAT are also bounded by a dedicated envelope chart for IPS operation (min/max OAT limits scaling with pressure altitude up to ISA+35°C) — outside that envelope the system isn't approved to keep up.",
    },
    {
      heading: "Failure groups — how bad is bad",
      paragraphs: [
        "Failures split into four groups, and the split matters for how urgently you need to react.",
      ],
      table: {
        columns: ["Failure", "What's lost", "Indication"],
        rows: [
          ["MR Critical Zone failure", "Complete loss of MR heating (all zones) AND loss of TR heating with it — the critical zones share dual power/control with the rest of the system", "MR FAIL warning, aural 'Warning Warning'"],
          ["MR Non-Critical Zone failure", "Partial MR heating loss — non-critical zones sit aft of the leading edge and see less ice, single power/control supply", "MR DEGRADE caution"],
          ["TR heating failure", "One or both opposing blade pairs lose heating — not critical in itself, but can cause noticeable vibration from asymmetric ice shedding, even after leaving icing", "TR DEGRADE (one pair) or TR FAIL (both pairs)"],
          ["Sensor failure — single", "Redundancy only, no functional effect", "—"],
          ["Sensor failure — double (ICE DET and/or OAT)", "IPS falls back to default values (0.8 g/m³ LWC, −12°C OAT) that may not match actual conditions, risking under- or over-heating", "Resetting the IPS can restore normal functionality"],
        ],
      },
      note: "MR FAIL / MAIN AND TAIL ROTOR HEATING FAILURE response: do not attempt a system TST/RST or cycle OFF/ON. Reduce to 80 KIAS and vacate icing as soon as possible; monitor PI and vibration, and hold 80 KIAS until there's clear evidence all ice has shed from both rotors.",
    },
    {
      heading: "Run-back ice and MAN mode",
      paragraphs: [
        "Two failure-adjacent phenomena to recognize: high accretion of ice happens when the system is under-heating for the actual conditions (e.g. running on default sensor values that underestimate the icing severity) — ice keeps building rather than shedding. Run-back ice is the opposite: over-heating (from a failed non-critical zone, MAN mode, or default values overestimating severity) melts ice locally without shedding it, and the water re-freezes further back on the blade — this shows as a steady, non-cycling PI rise rather than the normal cyclic pattern.",
        "MAN mode overrides the automatic system with maximum MR heating. It's used in some failure drills and when AUTO isn't providing enough heating for the conditions — but sustained use risks causing run-back ice, so it needs active monitoring, not a set-and-forget approach.",
        "Switching the IPS OFF then ON removes electrical power for about 15 seconds, during which no de-icing runs at all — don't cycle it as a troubleshooting reflex while still in icing.",
      ],
    },
    {
      heading: "Severe icing — recognition and the drill",
      paragraphs: [
        "Recognize severe icing by any combination of: PI rise more than 30% above normal for the flight condition, a steadily increasing base PI through the heating cycles, LWC above 1.5 g/m³, heavy water streaming across the windscreen, SLD evidence (ice on the aircraft sides, SLD marker), rising vibration, or a tendency toward significant speed loss.",
      ],
      table: {
        columns: ["Action", "Detail"],
        rows: [
          ["Reduce speed", "80 KIAS"],
          ["Rotor speed", "Select 102% NR"],
          ["Power", "Up to 110% PI is available"],
          ["Check for failures", "Confirm no MR/TR heating failure is compounding the situation"],
          ["Try MAN", "If PI reduces: select AUTO again and use MAN sparingly to manage subsequent PI rises. If PI doesn't reduce or keeps rising: return to AUTO and don't reselect MAN — that pattern points to run-back ice, not under-heating"],
          ["Change altitude", "Severe icing is usually concentrated near cloud tops"],
          ["Vacate", "If severity doesn't reduce, leave the icing conditions"],
        ],
      },
    },
  ],
};

const EXTERNAL_HOIST: SystemNote = {
  slug: "external-hoist",
  title: "External Hoist Operations",
  subtitle: "Breeze-Eastern's fixed hoist, and the two Goodrich alternatives with a rotating boom and OAT-dependent load limit — the numbers, the malfunction drills, and what a HOIST CUT ARM caution is actually telling you.",
  rfmReference:
    "AW139 RFM Supplement 11 (External Hoist Operations, Breeze-Eastern), Supplement 49 (External Hoist Operations, Goodrich single hoist), and Supplement 41 (Double External Hoist Operations, Goodrich) — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures for each.",
  sections: [
    {
      heading: "Three alternative installations",
      paragraphs: [
        "The Breeze-Eastern hoist (Supplement 11) is a fixed installation on the right side of the cabin — no boom to rotate. The Goodrich single hoist (Supplement 49) and Goodrich double hoist (Supplement 41) both mount on a common boom that rotates electrically between a stowed (minimum drag) position and the operating position; the double installation carries two identical hoist units in tandem on that boom, selectable as MAIN (rear) or SEC (secondary), each with its own dedicated pendant — giving hoist redundancy without landing to swap equipment.",
        "The external hoist's certification approval does not by itself constitute operational approval — that has to come from the Local Aviation Authority. Human External Cargo (HEC) operation requires an approved Personnel Carrying Device System (PCDS) and an approved Radio-ICS system.",
      ],
    },
    {
      heading: "Load and cable numbers",
      table: {
        columns: ["Installation", "Max load", "Usable cable"],
        rows: [
          ["Breeze-Eastern (Sup 11) — P/N ...111/112", "272 kg (600 lb)", "75 m (245 ft)"],
          ["Breeze-Eastern (Sup 11) — P/N ...113", "272 kg (600 lb)", "90 m (295 ft), plus WTR 5-position switch on the pendant"],
          ["Goodrich double (Sup 41) — each unit", "249 kg (550 lb) above 0°C OAT / 227 kg (500 lb) at or below 0°C OAT", "88.4 m (290 ft), 85 m (280 ft) usable on one cable type"],
        ],
      },
      note: "The Goodrich installations' load limit dropping in cold OAT is a real operational trap if you're used to the Breeze-Eastern's flat 600 lb figure — check which hoist is fitted before assuming the number.",
    },
    {
      heading: "Controls",
      paragraphs: [
        "The Hoist Operator (HO) controls cable speed via the pendant thumb wheel — up to 45 m/min (150 ft/min) at maximum load. The pilot has a fixed-speed override at 30 m/min (100 ft/min) via the collective grip switch, and pilot control always overrides the HO's. Both automatically slow and stop at the cable extremes. An optional copilot collective grip (kit P/N 4G2591F00511) adds a parallel hoist control with no priority logic — whoever activates first has control.",
        "On the pendant with the WTR switch fitted (Breeze-Eastern P/N ...113), the HO gets limited lateral/longitudinal groundspeed control in HOV mode when the pilot selects Winchman Trim — this only works with EPIC Phase 5+ and SAR modes installed (Supplement 69).",
      ],
    },
    {
      heading: "The numbers pilots actually need",
      table: {
        columns: ["Limit", "Value"],
        rows: [
          ["Max airspeed, load raising/lowering", "80 KIAS forward flight (stationary hover also permitted)"],
          ["Max weight with hoist load", "6,400 kg (see Supplement 50 for Increased Gross Weight above that)"],
          ["Approved NR/NF range for hoist ops (AEO and OEI)", "101–103%, max 103%"],
          ["Max pitch angle for hoist ops", "−9° to +21°"],
          ["Max roll angle for hoist ops", "±15°"],
        ],
      },
      note: "Takeoff and landing with a suspended load on the hoist is prohibited. During hoist operations the pilot must either fly manually, or — if the 4-Axis Enhanced FD is installed and HOV plus RHT (or ALT) are coupled — fly attentively rather than hands-off. H-V diagram limitations may be waived by local operating rules for hoist work specifically, but flying inside the H-V area still means no guaranteed safe landing after an engine failure.",
    },
    {
      heading: "Engine failure in the hover with a load on the hoist",
      paragraphs: [
        "Without OEI hover performance capability required: maintain or lower collective to hold rotor speed, then raise the load and recover into the cabin, jettison it, or transition forward (max 80 KIAS) depending on the load and situation.",
        "With OEI hover performance capability required: maintain collective — hover OEI is assured on the 2.5-minute rating — then raise and recover the load, or transition forward without exceeding the 2.5-minute rating (max 80 KIAS). Raising a fully extended load takes roughly 2 minutes, which eats into that 2.5-minute window fast.",
      ],
    },
    {
      heading: "Load jettison and HOIST CUT ARM",
      paragraphs: [
        "To jettison a load in an emergency: confirm HOIST ON, then lift the guard on the HOIST CUT pushbutton (pilot collective, copilot collective, or HO panel — any of the three works) and press it. If the electrical cutter (PQRS) fails, the HO cuts the cable manually with the backup cutter (BQRS), as close to the hoist as possible.",
        "A HOIST CUT ARM caution means either a guard has been intentionally lifted (in which case: don't raise it again, hoist can continue to be used as needed) or the cut system itself has malfunctioned (in which case: the hoist must not be used at all).",
      ],
    },
    {
      heading: "Cable foul and motor over-temperature",
      paragraphs: [
        "HOIST CBL FOUL means the cable isn't correctly wound and the hoist is inoperative — with a load suspended, proceed in forward flight keeping the load clear of obstacles, then find a suitable site to hover and lower the load to the ground before recovering the cable manually.",
        "An amber MTR HOT on the pendant means the hoist motor is overheating — complete the current cycle, then wait for the indication to clear before resuming. Continuing to run the hoist with MTR HOT displayed risks burning out the motor.",
      ],
    },
    {
      heading: "Double generator failure during hoist recovery",
      paragraphs: [
        "If a load must still be recovered into the cabin after a double generator failure: confirm MAIN BATTERY ON (it's what powers MAIN BUS 1 and the hoist), complete the recovery cycle, then switch MAIN BATTERY OFF or continue per the Basic RFM double generator failure procedure. Running the hoist recovery cycle this way cuts remaining battery endurance to 10 minutes — know that before committing to it.",
      ],
    },
  ],
};

const EAPS: SystemNote = {
  slug: "eaps",
  title: "EAPS: Engine Air Particle Separator",
  subtitle: "Bleed-air-driven vortex separation ahead of each engine intake — the performance trade for turning it on, and what a failed bleed-air valve actually means for you.",
  rfmReference:
    "AW139 RFM Supplement 5 (Engine Air Particle Separator — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures, Performance).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "EAPS protects each engine from sand, dust, and other particle ingestion. One particle separator sits in front of each engine air intake; incoming air is swirled through vortex generators, which throws foreign particles outward into a lower chamber via scavenge flow while clean air continues into the engine. From that lower chamber, particles are ejected overboard by an ejector driven by engine bleed air.",
        "Each engine has its own EAPS switch on the interseat console KITS panel. Selecting a switch ON opens the bleed-air valve and runs the ejector at full efficiency. Selecting OFF still lets the separator function passively, but at roughly half efficiency — and with no active ejection, particles simply accumulate in the lower chamber until it's full, after which any further particles pass straight into the engine intake unfiltered.",
      ],
    },
    {
      heading: "The performance trade",
      paragraphs: [
        "EAPS is recommended ON for operations in dusty or sandy conditions — but it always costs something: even with the bleed-air valve closed (EAPS OFF), the separator's mere presence causes a power loss from reduced intake pressure, and that loss grows further with the valve open (EAPS ON), since bleed air is being diverted from the engine to drive the ejector. Selecting EAPS ON during the system check produces a roughly 10°C ITT rise — a visible, expected marker of that bleed-air draw, not a fault.",
        "Because performance is measurably different with EAPS fitted, the aircraft carries entirely separate CAT B W.A.T. limit charts, Height-Velocity charts, hover ceiling charts, and rate-of-climb charts for EAPS OFF vs EAPS ON — using the wrong chart set will misstate your actual performance margins. A dedicated hover power-assurance check procedure and its own power-margin trend diagram are also required whenever EAPS is fitted.",
      ],
    },
    {
      heading: "Bleed-air valve malfunction",
      paragraphs: [
        "1(2) EAPS PRESS means the affected engine's bleed-air shutoff valve isn't matching the switch — closed while the switch shows ON, or open while the switch shows OFF. Either way, continue the flight, but know what you actually have: if the switch shows ON but the valve is stuck closed, EAPS is running in degraded mode (no active particle ejection, same as if it were OFF). If the switch shows OFF but the valve is stuck open, the helicopter's actual performance may not match the EAPS-OFF charts — use the EAPS-ON performance data instead, since that's the configuration the aircraft is actually flying in.",
      ],
    },
    {
      heading: "Lightning strike",
      paragraphs: [
        "Induced current from a lightning strike can trip the EAPS circuit breakers — reset them if needed.",
      ],
    },
  ],
};

const SECOND_RAD_ALT: SystemNote = {
  slug: "second-radar-altimeter",
  title: "Second Radar Altimeter RT300",
  subtitle: "Redundancy that costs you the 150 ft aural if both fail together — and a nuisance LANDING GEAR caution if only one does.",
  rfmReference:
    "AW139 RFM Supplement 18 (Second Radar Altimeter RT300 — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "A second, independent radar altimeter: the standard (first) unit displays on the copilot's (left) PFD, the second on the pilot's (right) PFD, with the second unit connected to MAU 2. If either fails, both displays automatically reconfigure onto the surviving unit — a label on the radar altimeter scale on both PFDs then shows which equipment is actually in use, flagging that redundancy is lost.",
      ],
    },
    {
      heading: "System check",
      paragraphs: [
        "RAD ALT 2 should read zero altitude (±5 ft) on the ground. Pressing DH TEST on either remote instrument controller should show RAD ALT 100 ft (±10 ft) with 'TEST' on both PFDs, returning to zero (±5 ft) on release. Each pilot's DH selector on their own remote instrument controller sets their decision height independently.",
      ],
    },
    {
      heading: "Single failure — the nuisance LANDING GEAR caution",
      paragraphs: [
        "When either radar altimeter fails, the surviving unit feeds both displays (RAD1(2) message shown beside the indicator). The catch: the LANDING GEAR CAS caution and its audio can activate erroneously above 150 ft AGL with the gear retracted — a false alert worth recognizing for what it is rather than reacting to as a real gear problem.",
      ],
    },
    {
      heading: "Double failure — what actually goes away",
      paragraphs: [
        "With both radar altimeters failed, flight can continue, but radar altimeter functioning is gone entirely and the MIN (decision height) alert is inactive. The 150 ft aural warning no longer functions, and — the same nuisance behavior as the single-failure case, but now unconditional — the LANDING GEAR caution displays whenever the gear is retracted, regardless of actual height.",
      ],
    },
    {
      heading: "Miscompare",
      paragraphs: [
        "A RAD ALT miscompare between the two units means their outputs disagree — cross-check the pilot and copilot indications and outside visual references to determine which is correct.",
      ],
    },
  ],
};

const NVG_OPERATIONS: SystemNote = {
  slug: "nvg-operations",
  title: "Night Vision Goggle Operations",
  subtitle: "Which lights actually go dark under NVG MODE, why phosphor screens can't be mixed, and the single-pilot-ops crew requirement most people forget.",
  rfmReference:
    "AW139 RFM Supplement 60 (Night Vision Goggle Operations — General Information, Limitations, Normal Procedures, Emergency and Malfunction Procedures).",
  sections: [
    {
      heading: "What's required",
      paragraphs: [
        "NVG operations require NVIS-compatible internal/external lighting (kit P/N 4G3360F00111) and EPIC Phase 4 or later. The exact approved configuration — which lights, which reflective surfaces, which NVG models — is defined in the AW139 NVG Compatibility Reference Handbook (139G3360A001); anything outside that document makes the aircraft not NVG compatible, full stop. A cockpit/cabin dividing curtain (or an approved equivalent) may be fitted to stop non-compatible cabin light leaking forward.",
      ],
    },
    {
      heading: "What NVG MODE actually changes",
      table: {
        columns: ["Light", "NORM mode", "NVG mode"],
        rows: [
          ["Displays / instruments / MWL/MCL panels", "Full brightness via standard dimmers", "Display brightness capped at a preset level; instruments still full brightness and dimmer-adjustable; MWL/MCL fixed to a low night-ops level"],
          ["Cockpit dome (flood) light", "NVG-compatible white, standard control", "Unchanged — same panel, NVG-compatible"],
          ["Cabin lights (non-NVG-compatible fixtures)", "As selected", "Automatically switched OFF"],
          ["Cabin lights (NVG-compatible fixtures)", "As selected", "Stay ON, brightness adjustable"],
          ["STORM lights (overhead, non-NVG-compatible)", "Controlled by STORM switch", "Inoperative regardless of switch position"],
          ["EMERG lights (cabin/external)", "Independent of MODE switch", "Unchanged — non-NVG-compatible, function regardless; ARM = on only when aircraft power is removed"],
          ["Anti-collision / position lights", "Visible light, NVIS-compatible", "Unchanged — same in both modes"],
          ["Landing light (LDG LT)", "Non-NVIS-compatible white", "Automatically switched OFF"],
          ["Secondary landing light (LDG LT2)", "Selectable WHITE or IR", "Still selectable WHITE (non-compatible) or IR"],
        ],
      },
      note: "For an NVG landing, don't use LDG LT — use LDG LT 2 selected to WHITE or IR as required, since the primary landing light is unavailable in NVG mode anyway.",
    },
    {
      heading: "Crew requirements",
      paragraphs: [
        "Two-pilot operations: both pilots must use the same NVG phosphor type — green phosphor and white phosphor screens cannot be mixed on the same flight.",
        "Single-pilot operations: an additional trained crew member wearing the same phosphor-type NVGs as the pilot is required during takeoff and landing at unimproved sites, to assist with obstacle identification and clearance. That additional NVG-equipped crew member is not required for takeoff/landing at improved sites, or once above 300 ft AGL in cruise.",
      ],
    },
    {
      heading: "NVG failure in flight",
      table: {
        columns: ["Situation", "Response"],
        rows: [
          ["Two-pilot ops — partial failure of the flying pilot's NVGs", "The other pilot takes control; continue NVG operations or transition to unaided flight as the situation dictates"],
          ["Two-pilot ops — complete failure of the flying pilot's NVGs", "The other pilot takes control and transitions to unaided flight"],
          ["Single-pilot ops — partial or complete NVG failure", "Transition to unaided flight"],
          ["NVIS lighting malfunction", "Discontinue NVG use if the malfunction degrades NVIS compatibility"],
        ],
      },
      note: "Transitions between NVG and unaided (NORMAL) operation should happen during a non-critical phase of flight, one crew member at a time — and cabin occupants should be briefed before switching MODE either direction, since cabin lighting changes with it.",
    },
  ],
};

export const AW139_SYSTEM_NOTES: SystemNote[] = [WEATHER_RADAR_HONEYWELL, WEATHER_RADAR_TELEPHONICS, TAS_KTA970, WEATHER_RADAR_GABBIANO, TCAS_II, EGPWS, OPLS, RNP_OPERATIONS, DIGITAL_MAP, FD_SAR_MODES, DITCHING, CPI_ELT, IPS, EXTERNAL_HOIST, EAPS, SECOND_RAD_ALT, NVG_OPERATIONS];
