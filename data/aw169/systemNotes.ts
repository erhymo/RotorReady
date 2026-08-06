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

const AFCS_EP: SystemNote = {
  slug: "afcs",
  title: "AFCS: The Flight Control Stack",
  subtitle: "How the AW169 EP's Automatic Flight Control System is built up, and every number worth having cold.",
  rfmReference:
    "AW169 EP RFM Section 1 (Limitations — AFCS Mode Limitations, Envelope of Engagement and Minimum Use Height, Approach Modes Limitations), Section 2 (Normal Procedures — AFCS General Information, AFCS Modes Operations, Collective Safety Function), Section 7 (System Description, Chap 22)",
  sections: [
    {
      heading: "The foundation",
      paragraphs: [
        "One duplex electro-hydraulic system, two main functions underneath everything else. Auto-stabilization is the short-term one — it corrects turbulence-driven attitude disturbances continuously, quickly enough that it just reads as a smoother ride. The Autopilot layer on top of it is long-term: Attitude Hold (ATT) holds pitch and roll, and below 40 knots it adds heading hold too, with its own datum bug on the HSI.",
        "Separate from that general auto-stabilization function, there is a specifically-named one called SAS, Stability Augmentation — and this one really is only for degraded operation. It provides short-term rate damping whenever the pilot is actually hands-on, in fly-through or trim-release. Do not conflate the two: general auto-stabilization runs continuously; SAS is the degraded-operation fallback specifically.",
        "Wing-Level (WLVL), on the cyclic, resets and holds pitch at 6.5° nose-up, roll at 0° — once level there, ALT engages automatically to hold that altitude.",
      ],
    },
    {
      heading: "Always-on control functions",
      paragraphs: [
        "Running underneath all of the above, not pilot-selected: Collective Decoupling (C-DCPL) corrects pitch, roll and yaw for collective pitch cross-coupling. Auto-Trim (ATRIM) re-centers the lateral and longitudinal cyclic trims and the yaw trim. Stability Command Augmentation in Fly-Through (SAF/SCAS) adjusts attitude damping as a function of control displacement. Turn-Coordination (TC) provides automatic ball centering during turns.",
      ],
    },
    {
      heading: "Collective Safety Function",
      paragraphs: [
        "Activates automatically whenever any collective upper mode is active, and provides three protections.",
      ],
      table: {
        caption: "AFCS Power Limiting — maximum PI value",
        columns: ["Condition", "Maximum PI"],
        rows: [
          ["AEO, IAS < 90 KIAS", "119%"],
          ["AEO, IAS > 90 KIAS", "97%"],
          ["OEI", "145%"],
        ],
      },
      note: "When actively capping, the amber caption PWR LIM shows on the PFD. Autorotation protection activates when engine TQ drops below 15% in a descent. GSPD mode carries its own Airspeed Envelope Protection (AEP): it prevents true airspeed decaying below Vmini (50 KIAS) or exceeding Vne − 5 KIAS, regardless of the groundspeed reference.",
    },
    {
      heading: "Low height protection",
      paragraphs: [
        "A separate floor under each collective mode — distinct from the engagement Minimum Use Height (MUH) numbers below. If breached inadvertently, the system adds collective automatically to return to the floor. This protection is inoperative while Power Limiting is actively working the collective axis.",
      ],
      table: {
        columns: ["Mode(s)", "Low height floor"],
        rows: [
          ["ALT", "120 ft cruise / 30 ft hover"],
          ["ALTA, VS", "120 ft"],
          ["RHT, GA", "90 ft cruise / 18 ft hover / 35 ft approach"],
          ["TD, GATE", "90 ft"],
          ["TDH, TU", "18 ft"],
          ["Approach modes (GS, NGS, NAPP)", "35 ft"],
        ],
      },
      note: "Hover/low speed = below 55 KIAS or HOV/TDH engaged. Cruise = above 55 KIAS with neither engaged.",
    },
    {
      heading: "Engagement envelope & minimum use height (MUH)",
      paragraphs: [
        "Where each upper mode can be turned on, and the minimum use height it carries once engaged.",
      ],
      table: {
        columns: ["Mode", "Engagement range", "MUH"],
        rows: [
          ["ALT", "0 KIAS to Vne", "200 ft cruise / 50 ft hover"],
          ["ALTA", "40 KIAS to Vne", "200 ft"],
          ["VS (descent)", "40 KIAS to Vne", "200 ft"],
          ["RHT", "0 KIAS to Vne, 15–2050 ft AGL", "150 ft cruise / 30 ft hover"],
          ["GA", "0–130 KIAS (<5000 ft, −2 kt/1000 ft), 40 KIAS–Vne (>200 ft)", "150 ft cruise / 30 ft hover / 160 ft approach"],
          ["TD", "75 KIAS–Vne or 0–75 KIAS, 150–200 ft band", "150 ft"],
          ["TDH", "0–85 KIAS, 30–150 ft band", "30 ft"],
          ["TU", "0–80 KIAS", "30 ft climbing to 200 ft"],
          ["IAS", "40 KIAS to Vne", "150 ft cruise / 160 ft approach"],
          ["GSPD", "30–220 kt groundspeed (40 KIAS–Vne true)", "150 ft cruise / 160 ft approach"],
          ["DCL", "85 KIAS to Vne", "230 ft (highest floor of any mode)"],
          ["HOV", "<60 kt fwd / <40 kt lateral-aft, <80 KIAS", "30 ft"],
          ["HDG", "0 KIAS to Vne", "150 ft cruise / 30 ft hover / 160 ft approach"],
          ["NAV (NAV, VOR)", "40 KIAS to Vne", "150 ft cruise / 160 ft approach"],
          ["Approach (VAPP, LOC, NLOC, NGS, NAPP, NDCL)", "40–130 KIAS (<5000 ft, −2 kt/1000 ft)", "160 ft, flat"],
        ],
      },
      note: "ALTA and VS share a selectable vertical-speed datum, −1500 to +2000 fpm. RHT's selectable height datum is 30–2000 ft. IAS's selectable airspeed datum is 45 KIAS to Vne − 5. RHT, TU and TDH may only engage over a flat surface clear of obstructions — absolute, not situational. Across the HOV/NAV/Approach group: hover/low speed = below 55 KIAS or HOV/TDH engaged, cruise = above 55 KIAS with neither engaged; all of them disengage automatically below 35 KIAS.",
    },
    {
      heading: "Approach limits",
      table: {
        columns: ["Limit", "Value"],
        rows: [
          ["Maximum rate of descent, coupled approach", "900 fpm"],
          ["Maximum ROD, FMS-coupled approach", "800 fpm"],
          ["Maximum airspeed profile", "130 KIAS below 5000 ft, −2 kt/1000 ft above"],
          ["Uncoupled on pitch axis below 50 KIAS", "IAS mode must be engaged"],
          ["ILS certification", "Category I, up to 7° glideslope"],
        ],
      },
    },
    {
      heading: "What survives a fault",
      paragraphs: [
        "All upper modes disengage on: AP off or fail, AHRS fail, ADI-standby fail (AP DEGR), a main rotor or tail rotor series actuator fail, loss of the CAS messages and their aural tone, or an AFCS oscillatory malfunction.",
        "Four things are built to survive that list on purpose: HOV, TDH, TU, and the coupled approach modes themselves (VAPP, LOC/GS, NAPP, NLOC/NGS). It is the set a pilot is most likely to be in on a confined-area approach when something else fails, so the aircraft stays coupled rather than handing back a raw approach at the worst moment.",
      ],
    },
    {
      heading: "Permanently inoperative",
      paragraphs: [
        "VNAV, MOT and WTR are wired inoperative on this configuration — selecting them displays FUNCTION UNAVL on the PFD. The same message appears for TD, TDH or TU if their own option file has not been enabled on the aircraft.",
      ],
    },
  ],
};

const PLUS_MODE_EP: SystemNote = {
  slug: "plus-mode",
  title: "PLUS Mode: The Adaptive Rotor Speed Governor",
  subtitle: "What AVSR actually governs, what PLUS mode is within it, and every NR number on the envelope.",
  rfmReference:
    "AW169 EP RFM Section 1 (Limitations — Rotor Speed Limitations, Figure 1-10), Section 2 (Normal Procedures — After Engine Start Checks), Section 3 (Emergency and Malfunction Procedures — Drive System: AVSR FAIL, AVSR Oscillatory Malfunction), Section 3 alert index (AVSR FAIL definition), Section 4 (Performance Data — Enhanced Performance / PLUS Mode charts)",
  sections: [
    {
      heading: "AVSR, and where PLUS mode sits inside it",
      paragraphs: [
        "AVSR — Adaptive Variable Speed Rotor — is the system that governs main rotor speed (NR). It does not hold NR at one fixed number; it varies the governing datum with airspeed (IAS), and that governing law itself varies linearly with density altitude between 8000 and 10000 ft (Figure 1-10, Operative NR envelope). Because the datum moves, the PFD markings move with it: a ±2% green band is shown around whatever the current datum is, with red indication and an aural warning at ±3% off datum.",
        "PLUS mode is the elevated governing state within that system — it is the normal state once both engines are running: After Engine Start Checks has the crew confirm PLUS mode with NR/NF at 103%, shown as a green PLUS mode legend on the PFD. It is also the regime the Category A and Enhanced Performance charts are built around — the Safe OEI Vertical Reject chart in Section 4 is explicitly titled for Enhanced Performance / PLUS mode, with a 200 ft maximum hover height limit noted on that chart.",
      ],
    },
    {
      heading: "Rotor speed limits (NR%)",
      table: {
        caption: "AEO power-on",
        columns: ["Limit", "NR %"],
        rows: [
          ["Minimum transient", "90"],
          ["Maximum transient", "107"],
        ],
      },
      note: "AEO governing datum and green band vary with IAS and density altitude per Figure 1-10 — these are the outer transient limits, not the datum itself.",
    },
    {
      paragraphs: [],
      table: {
        caption: "OEI power-on",
        columns: ["Limit", "NR %"],
        rows: [
          ["Minimum transient", "85"],
          ["Minimum cautionary", "90"],
          ["Cautionary range (OEI landing/flyaway only)", "90–100"],
          ["Minimum continuous", "101"],
          ["Continuous operation range", "101–105"],
          ["Maximum continuous", "105"],
          ["Maximum transient", "107"],
        ],
      },
    },
    {
      paragraphs: [],
      table: {
        caption: "Power-off",
        columns: ["Limit", "NR %"],
        rows: [
          ["Minimum transient", "85"],
          ["Minimum continuous", "90"],
          ["Continuous operation", "90–110"],
          ["Maximum continuous", "110"],
          ["Maximum transient", "115"],
        ],
      },
    },
    {
      heading: "When AVSR itself fails",
      paragraphs: [
        "AVSR FAIL: NR control automatically reverts to a fixed value of 103% — the same number PLUS mode normally targets. Continue flight; the system has simply stopped varying the datum with IAS and altitude, it has not stopped governing.",
        "AVSR Oscillatory Malfunction shows as NR/NF oscillatory indications on the PFD/MFD. The procedure is to disengage the AFCS upper mode, then select ADS2 on the RCP (Reconfiguration Control Panel). If the oscillation remains, select ADS1 instead and continue flight — the logic points at a bad Air Data System (ADS) feed into the governing law as the likely cause, so the fix is reconfiguring which of the two ADS units is feeding it, not a rotor problem itself.",
      ],
    },
    {
      heading: "ECO mode, briefly",
      paragraphs: [
        "“ECO MODE” exists as a separate aural annunciation, distinct from PLUS mode. The RFM notes it is available only during the AWG (Aural Warning Generator) test procedure. Beyond that, the RFM does not describe when ECO mode is otherwise selected or used operationally.",
      ],
    },
  ],
};

const AUTOROTATION_PROTECTION_EP: SystemNote = {
  slug: "autorotation-protection",
  title: "How Autorotation Protection Works",
  subtitle: "One of the three Collective Safety Function protections — what it actually does, and the limits of what the RFM specifies about it.",
  rfmReference: "AW169 EP RFM Section 2 (Normal Procedures — AFCS General Information, Collective Safety Function)",
  sections: [
    {
      heading: "What it does",
      paragraphs: [
        "AFCS Autorotation Protection is one of three functions inside the Collective Safety Function (alongside Power Limiting and Low Height protection), and it is automatically active whenever a collective upper mode is engaged. Its job: limit the minimum collective pitch the AFCS itself is allowed to demand during a steep descent, to prevent the aircraft from being driven into an unintended entry into autorotation.",
        "The trigger is specific and single-valued: it activates when engine torque (TQ) drops below 15%.",
      ],
    },
    {
      heading: "Why torque is the trigger",
      paragraphs: [
        "In a steep, collective-mode-coupled descent, an AFCS chasing a vertical speed or approach path can keep reducing collective pitch to hold the demanded flight path. Torque below 15% means the engine is barely driving the rotor at all — pitch is being carried almost entirely by rotor inertia and airflow rather than engine power at that point. Reducing collective further from there is exactly the input that would tip the rotor system from powered flight into an actual autorotative state, without the pilot having deliberately chosen to enter one. The function puts a floor under how low the AFCS itself will command collective once torque is already that low, rather than let the automation walk the aircraft into autorotation on its own.",
      ],
    },
    {
      heading: "What the RFM does not say",
      paragraphs: [
        "This is the complete extent of what the AW169 EP RFM states about this specific function — one paragraph, no separate system-description chapter, no numeric floor value for the collective pitch limit itself, and no dedicated malfunction/caption entry distinct from the general Collective Safety Function.",
        "General power-off NR limits and autorotation flying technique are a separate topic and are not covered here.",
      ],
    },
  ],
};

const WEATHER_RADAR_SHARED: SystemNote = {
  slug: "weather-radar",
  title: "Weather Radar RTA-4112",
  subtitle: "Modes, ranges, controls, and the one hard limitation on what this radar is allowed to be used for.",
  rfmReference:
    "AW169 / AW169 EP RFM Supplement 12 (Weather Radar RTA-4112 — General Information, Limitations, Normal Procedures, Malfunction Procedures) and Section 7 (System Description, OES — Weather Radar RTA-4112). Verified identical between AW169 and AW169 EP.",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "A fully automatic radar that displays significant weather data at all available ranges and altitudes, at all times, with a clutter-free display. It also does beacon detection and terrain mapping. Hardware: a 12 in flat-plate antenna in the nose radome, an antenna drive unit (moves the antenna up to 120° in azimuth, 32° in elevation), and a transceiver with separate receivers for weather and beacon signals, feeding the PFDs and MFD.",
        "Two independent configurations exist side by side: L WXR (co-pilot's side) and R WXR (pilot's side). Controlled through the MFD drop-down menu (TILT and GAIN are also replicated on the MFD FPLN format bottom bezel).",
      ],
    },
    {
      heading: "Operating modes",
      table: {
        columns: ["Mode", "What it does", "Range"],
        rows: [
          ["Auto", "Scans automatically, controls antenna tilt for optimal detection based on elevation/location, processes multiple scans to minimize ground clutter", "320 NM"],
          ["Manual", "Secondary mode / used after an automatic-mode failure — tilt and gain controlled manually", "320 NM"],
          ["WX (Weather)", "Weather returns for the selected tilt and gain", "320 NM"],
          ["Turb (Turbulence)", "Azimuth/range of hazardous turbulent areas", "40 NM"],
          ["WX + T", "Weather out to 320 NM combined with turbulence out to 40 NM — turbulent weather display takes priority over normal weather where they overlap", "320 / 40 NM"],
          ["Map", "Disables ground clutter suppression to show ground returns — coastlines, lakes, larger cities", "320 NM"],
          ["Self-test", "Checks display colors and system connections only", "—"],
          ["Standby", "Antenna holds at bore-sight, transmitter off", "—"],
        ],
      },
    },
    {
      heading: "The one hard limitation",
      paragraphs: [
        "The radar must not be used for navigation or terrain avoidance. Everything else about the system — the automatic mode, the clutter suppression, the mapping mode — describes what it is good at showing, not a substitute for navigation or terrain awareness systems.",
      ],
    },
    {
      heading: "Ground transmission",
      paragraphs: [
        "The radar does not transmit while the helicopter is on the ground, unless the operator commands it to. Do not set it to transmit within 17 ft (5 m) of personnel or containers holding flammable or explosive material.",
        "If the helicopter is on the ground with the radar set to anything other than Standby or Test, and the weight-on-wheels (WOW) microswitches fail, the radar will transmit unexpectedly — the caption WX TRANSMITTING displays. The response is simply to confirm the radar is set back to Standby.",
      ],
    },
  ],
};

const WEATHER_RADAR_RDR1600_SHARED: SystemNote = {
  slug: "weather-radar-rdr-1600",
  title: "Weather Radar RDR-1600",
  subtitle: "A separate, optional maritime/SAR radar kit — the one with the SR1/SR2/SR3 surface-search modes, beacon detection, and its own tighter ground-transmission distance.",
  rfmReference:
    "AW169 / AW169 EP RFM Supplement 35 (Weather Radar RDR-1600 — General Information, Limitations, Normal Procedures, Malfunction Procedures) and Section 7 (System Description, OES — Kit Weather Radar RDR-1600). Verified identical between AW169 and AW169 EP. This is a different, alternative radar installation from the RTA-4112 covered in the Weather Radar RTA-4112 note — the two are not fitted together.",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The Telephonics RDR-1600 is a multi-mode surveillance and weather radar built for maritime missions. Hardware: a 12 in flat-plate antenna and drive unit, a receiver/transmitter unit, an interface unit, and a static inverter. ADAHRS 1/2 data are used for antenna stabilization. Controlled through the MFD drop-down menu and the CCD, displayed on the PFDs and/or MFD.",
        "It provides three families of modes: air-to-surface search and detection (SR1/SR2/SR3), weather avoidance (WX/WXA), and beacon detection/navigation (BCN).",
      ],
    },
    {
      heading: "Operating modes",
      table: {
        columns: ["Mode", "What it does", "Notes"],
        rows: [
          ["SR1 (Search 1)", "Sea clutter rejection — short transmitted pulse with clutter-rejection circuitry, for short-range mapping of targets in a sea-clutter environment. Detects surface targets down to 500 ft minimum range.", "Active only at 10 NM range or below; at 20 NM or greater the transmitter switches to a long pulse and clutter rejection disengages (behaves like SR3)"],
          ["SR2 (Search 2)", "Short-range precision ground mapping — short transmitted pulse. Detects surface targets down to 500 ft minimum range.", "Active only at 10 NM range or below; at 20 NM or greater it effectively becomes SR3"],
          ["SR3 (Search 3)", "Long-range ground mapping / searching for topographical features (bodies of water, islands, high ground, bridges). Returns the greatest amount of ground clutter of the three. Can also be used for oil slick detection in calm to moderate sea states.", "—"],
          ["WX (Weather)", "Continuous enroute weather — rain, thunderstorms, icing areas. Red/yellow/green display by rainfall density; a sensitivity timing control keeps echo intensity roughly equal from near-zero range to ~45 NM. Gain is preset, not operator-selectable.", "~45 NM"],
          ["WXA (Weather Alert)", "As WX, but red storm-cell areas flash, and the Target Alert function activates: it warns the pilot if a red storm cell is detected within 25 NM beyond the selected range and within ±10° of boresight — including when the pilot isn't looking at the weather display.", "Alert range 25 NM beyond selected range, ±10° boresight"],
          ["BCN (Beacon)", "Interrogates and receives pulses from a fixed transponder on a dedicated beacon frequency. Selectable Mode A (0–9) or DO-172 Mode B (0–15) code.", "Up to 160 NM, depending on beacon sensitivity/power"],
          ["STBY (Standby)", "No radar data displayed — used during system warm-up and whenever the helicopter is on the ground.", "—"],
          ["TEST", "Checks system operability. No transmission occurs.", "—"],
        ],
      },
      note: "Weather and search modes cannot run at the same time, but any of them can be paired with Beacon: WX/BCN, WXA/BCN, SR1/BCN, SR2/BCN, or SR3/BCN. The antenna scans 120° in azimuth by default, selectable down to a 60° sector (SCAN 120 / SCAN 60), with ±15° selectable tilt and a combined ±30° pitch/roll/tilt stabilization system (deselectable via STAB OFF).",
    },
    {
      heading: "The one hard limitation",
      paragraphs: [
        "The radar must not be used for navigation or terrain avoidance — the same restriction as the RTA-4112.",
      ],
    },
    {
      heading: "Ground transmission",
      paragraphs: [
        "The weather radar does not transmit on the ground due to the weight-on-wheels (WOW) safety interlock, unless commanded to. Do not turn the radar on within 30 ft (9 m) of personnel or containers holding flammable or explosive material — a wider clearance than the RTA-4112's 17 ft (5 m).",
        "Should the WOW switch fail on the ground, the radar will transmit if it is selected to transmit. The response is to confirm the radar is switched OFF.",
      ],
    },
  ],
};

const TCAS_II_SHARED: SystemNote = {
  slug: "tcas-ii",
  title: "TCAS II: Traffic Advisory System",
  subtitle: "How Traffic Advisories and Resolution Advisories actually work, the exact power/airspeed technique for each RA, and every inhibit altitude.",
  rfmReference:
    "AW169 / AW169 EP RFM Supplement 14 (Traffic Advisory System II — General Information, Resolution Advisory Manoeuvres, Limitations, Normal Procedures, Emergency and Malfunction Procedures). Verified identical between AW169 and AW169 EP.",
  sections: [
    {
      heading: "What it does",
      paragraphs: [
        "The Rockwell Collins TCAS II monitors a nominal 14 NM radius around the helicopter, interrogating ICAO-compliant transponders on other aircraft. Hardware: a processor in the aft avionic bay and two directional antennas — one on top of the nose radome, one under the rear belly.",
        "From the replies it computes range, bearing, closure rate, and altitude (if the intruder's transponder reports it) — from which it derives time to Closest Point of Approach (CPA), the main parameter driving alerts. It issues Traffic Advisories (TAs) to help the pilot visually acquire the intruder and prepare for a possible RA, and Resolution Advisories (RAs) that define a vertical maneuver to increase or maintain separation. If the intruder is also TCAS II-equipped, the two systems coordinate their RAs over Mode S data link so the resolution senses are complementary — not both aircraft climbing, for example.",
      ],
    },
    {
      heading: "Flying a Resolution Advisory",
      paragraphs: [
        "No banking maneuvers on an RA — fly to the indication on the VSI. If AFCS upper modes are engaged, press and hold the cyclic and collective FTR (Force Trim Release) buttons throughout the maneuver — this keeps the IAS and vertical-mode reference bugs synchronized with the aircraft's actual airspeed and altitude as you fly, rather than fighting the AFCS's prior targets.",
      ],
      table: {
        caption: "RA technique",
        columns: ["RA", "Technique"],
        rows: [
          ["Climb, IAS above 90 KIAS", "Cyclic to reduce airspeed toward (not below) 90 KIAS, collective simultaneously to MCP 100% PI"],
          ["Climb, IAS 90 KIAS or below", "Collective to Take-Off Power, let IAS increase toward (not above) 90 KIAS"],
          ["Descend", "Collective to decrease torque as required — but not into autorotation; minimum 10% PI"],
        ],
      },
      note: "If the required rate cannot be achieved within aircraft limits, hold the maximum achievable rate instead. After Clear of Conflict, return promptly to the previous ATC clearance unless otherwise directed. TCAS II keeps monitoring after the RA — if the intruder's flight path changes, it can issue a revised RA; follow it.",
    },
    {
      heading: "Limitations",
      paragraphs: [
        "Never maneuver on a TA alone — it is for visual acquisition, not a maneuver instruction. Compliance with an RA is mandatory, and the pilot is authorized to deviate temporarily from the current ATC clearance to comply with one — but not authorized to exceed the aircraft's flight envelope limits chasing an RA. TCAS II must be selected to TA ONLY during underslung load operations, and should be selected to TA ONLY with one engine inoperative (OEI) as well — reselect TA/RA once that condition no longer applies.",
      ],
      table: {
        caption: "Automatic inhibits, by height",
        columns: ["Function", "Inhibited below"],
        rows: [
          ["Increase Descent RA", "1650 ft AGL climbing / 1450 ft AGL descending"],
          ["Descend RA", "1200 ft AGL climbing / 1000 ft AGL descending"],
          ["TA voice messages", "600 ft AGL climbing / 400 ft AGL descending"],
          ["All RAs (reverts to TA only)", "1100 ft AGL climbing / 900 ft AGL descending"],
          ["Climb RA", "inhibited above 14,000 ft"],
          ["Increase Climb RA", "always inhibited"],
        ],
      },
      note: "TCAS II also automatically reverts to TA-only whenever a higher-priority HTAWS or CAS warning is present, and stays in TA-only for 10 seconds after that warning clears — a current RA becomes a TA during that window.",
    },
    {
      heading: "What you see and hear",
      paragraphs: [
        "TA: PFD attitude indicator shows TRAFFIC flashing then steady amber, aural “Traffic, Traffic.” RA: PFD shows TRAFFIC flashing then steady red, plus a specific aural instruction and a climb/descend cue on the VSI — fly to keep the vertical speed needle inside the green arc. TCAS STBY / TCAS TEST / TCAS FAIL show as status-window messages on both PFD and MFD.",
      ],
    },
  ],
};

const HTAWS_EP: SystemNote = {
  slug: "htaws",
  title: "HTAWS: Terrain Awareness and Warning",
  subtitle: "FLTA and GPWS, every alert and what triggers it, and the OFFSHORE modes that make the EP version genuinely different from Standard.",
  rfmReference: "AW169 EP RFM Supplement 13 (Helicopter Terrain Awareness and Warning System). This system differs meaningfully from AW169 Standard — see the separate AW169 Standard note.",
  sections: [
    {
      heading: "What it does",
      paragraphs: [
        "HTAWS, embedded in the Collins MFD-2810, gives terrain and obstacle awareness through two independent functions: Forward Looking Terrain (and Obstacle) Alerting (FLTA), which looks ahead of the aircraft's flight path, and Ground Proximity Warning System (GPWS), which reacts to the aircraft's actual proximity to terrain. Terrain/obstacle display is selectable on PFD and MFD; an obstacle is defined as any human-made structure higher than 50 ft AGL.",
      ],
    },
    {
      heading: "Operating modes",
      paragraphs: [
        "Onshore modes: Mode 3 (descent after take-off or missed approach), Mode 4 (flight into terrain when not in landing configuration), Mode 5 (excessive downward deviation from an ILS glideslope), Mode 6 (altitude callout).",
        "Offshore modes (EP-specific, only with the option installed): Mode 1 OFFSHORE (excessive rate of descent), Mode 3A OFFSHORE (inadvertent loss of height after take-off), Mode 3B OFFSHORE (inadvertent loss of airspeed after take-off), Mode 4A OFFSHORE (too low gear / too low terrain), Mode 4B OFFSHORE (too low terrain), Mode 6 (altitude callout), Mode 7 OFFSHORE (deactivated on this configuration).",
      ],
    },
    {
      heading: "Alerts",
      table: {
        columns: ["Priority", "Aural", "Red caption", "Amber caption"],
        rows: [
          ["1", "PULL UP", "PULL UP", "—"],
          ["2", "WARNING TERRAIN", "TERRAIN", "—"],
          ["2", "WARNING OBSTACLE", "OBSTACLE", "—"],
          ["3", "CAUTION TERRAIN", "—", "TERRAIN"],
          ["3", "CAUTION OBSTACLE", "—", "OBSTACLE"],
          ["3", "TOO LOW TERRAIN (OFFSHORE mode only)", "—", "TOO LOW TERRAIN"],
          ["4", "THREE HUNDRED / active height callouts", "—", "—"],
          ["5", "TOO LOW GEAR", "—", "TOO LOW GEAR"],
          ["6", "SINKRATE", "—", "SINKRATE"],
          ["6", "CHECK AIRSPEED (OFFSHORE mode only)", "—", "CHECK AIRSPEED"],
          ["7", "DON'T SINK", "—", "DON'T SINK"],
          ["8", "GLIDESLOPE", "—", "GLIDESLOPE"],
        ],
      },
      note: "Height callouts (200/100/50/40/30/20/10 ft) are aural only, no caption. Cautionary alerts annunciate once; warning alerts repeat until the condition clears. TOO LOW TERRAIN and CHECK AIRSPEED only exist when OFFSHORE mode is selected — SINKRATE covers the equivalent onshore case (excessive descent rate relative to terrain, when FLTA isn't available or groundspeed is below 40 kt).",
    },
    {
      heading: "SAR mode and the offshore approach exception",
      paragraphs: [
        "SAR mode reduces the FLTA height threshold down to as low as 30 ft AGL, for genuinely low-height flight. Like the other reduced-sensitivity modes (LOW ALT, TACT ALT, OFF AIRPORT), SAR must not be selected under IMC — except when performing an offshore-platform IFR approach or other special IFR procedure, which is exactly the case this EP option exists to support.",
        "On an offshore approach with OFFSHORE mode selected, SINK RATE / PULL UP alerts (GPWS Mode 1 OFSH caution/warning) can be generated at glide path angles greater than 3°.",
      ],
    },
    {
      heading: "Database limitation",
      paragraphs: [
        "The terrain/obstacle database must be the latest update for the region being flown, and it only covers a defined latitude interval (per the HTAWS Pilot's Guide). Outside that interval, the aircraft displays TAWS FAIL.",
      ],
    },
    {
      heading: "Inhibiting and status messages",
      paragraphs: [
        "TAWS INHIBIT disables all alerts except altitude callouts (the terrain map image stays up). AUDIO INHIB mutes cautions only — not callouts, not warnings — and clears itself after 5 minutes if not deselected first. OFF APT reduces nuisance alerts when landing somewhere not in the database, without disabling the system. G/S CANCEL suppresses the glideslope-deviation alert when the ILS isn't in the database — it has no effect when OFFSHORE mode is selected.",
        "Failure captions: TAWS FAIL (no valid HTAWS info — both FLTA and GPWS gone), TERRAIN (terrain data unavailable), GPWS INOP, FLTA INOP, OBST INOP (obstacle database missing, or too many obstacles in view — the system only ever displays the 100 nearest above the altitude clearance level).",
      ],
    },
  ],
};

const HTAWS_STANDARD: SystemNote = {
  slug: "htaws",
  title: "HTAWS: Terrain Awareness and Warning",
  subtitle: "FLTA and GPWS, and every alert and what triggers it — the onshore-only baseline version of this system.",
  rfmReference: "AW169 RFM Supplement 13 (Helicopter Terrain Awareness and Warning System). This AW169 Standard configuration has no OFFSHORE operating modes and no SAR mode — see the separate AW169 EP note for that configuration.",
  sections: [
    {
      heading: "What it does",
      paragraphs: [
        "HTAWS, embedded in the Collins MFD-2810, gives terrain and obstacle awareness through two independent functions: Forward Looking Terrain (and Obstacle) Alerting (FLTA), which looks ahead of the aircraft's flight path, and Ground Proximity Warning System (GPWS), which reacts to the aircraft's actual proximity to terrain. Terrain/obstacle display is selectable on PFD and MFD; an obstacle is defined as any human-made structure higher than 50 ft AGL.",
        "This configuration provides four operating modes: Mode 1 (excessive rate of descent), Mode 3 (descent after take-off or missed approach), Mode 4 (flight into terrain when not in landing configuration), Mode 5 (excessive downward deviation from an ILS glideslope). There is no OFFSHORE option and no SAR mode on this configuration.",
      ],
    },
    {
      heading: "Alerts",
      table: {
        columns: ["Priority", "Aural", "Red caption", "Amber caption"],
        rows: [
          ["1", "PULL UP", "PULL UP", "—"],
          ["2", "WARNING TERRAIN", "TERRAIN", "—"],
          ["2", "WARNING OBSTACLE", "OBSTACLE", "—"],
          ["3", "CAUTION TERRAIN", "—", "TERRAIN"],
          ["3", "CAUTION OBSTACLE", "—", "OBSTACLE"],
          ["4", "THREE HUNDRED / active height callouts", "—", "—"],
          ["5", "TOO LOW GEAR", "—", "TOO LOW GEAR"],
          ["6", "SINKRATE", "—", "SINKRATE"],
          ["7", "DON'T SINK", "—", "DON'T SINK"],
          ["8", "GLIDESLOPE", "—", "GLIDESLOPE"],
        ],
      },
      note: "Height callouts (200/100/50/40/30/20/10 ft) are aural only, no caption. Cautionary alerts annunciate once; warning alerts repeat until the condition clears.",
    },
    {
      heading: "Reduced-sensitivity modes",
      paragraphs: [
        "LOW ALT, TACT ALT and OFF AIRPORT reduce the alert envelope for low-altitude or non-airport operations. None of them may be selected under IMC, except where a specific approved procedure allows it — the RFM names the FMS Oil Rig Approach as an example.",
      ],
    },
    {
      heading: "Database limitation",
      paragraphs: [
        "The terrain/obstacle database must be the latest update for the region being flown, and it only covers a defined latitude interval, per the HTAWS Pilot's Guide.",
      ],
    },
    {
      heading: "Inhibiting and status messages",
      paragraphs: [
        "TAWS INHIBIT disables all alerts except altitude callouts (the terrain map image stays up). AUDIO INHIB mutes cautions only — not callouts, not warnings — and clears itself after 5 minutes if not deselected first. OFF APT reduces nuisance alerts when landing somewhere not in the database, without disabling the system. G/S CANCEL suppresses the glideslope-deviation alert when the ILS isn't in the database.",
        "Failure captions: TAWS FAIL (no valid HTAWS info — both FLTA and GPWS gone), TERRAIN (terrain data unavailable), GPWS INOP, FLTA INOP, OBST INOP (obstacle database missing, or too many obstacles in view — the system only ever displays the 100 nearest above the altitude clearance level).",
      ],
    },
  ],
};

const SVS_SHARED: SystemNote = {
  slug: "svs",
  title: "Synthetic Vision System (SVS)",
  subtitle: "A 3D terrain picture on the PFD — what it's built from, when it turns itself off, and the one rule about attitude.",
  rfmReference: "AW169 / AW169 EP RFM Supplement 18 (Synthetic Vision System). Same avionics suite (Collins MFD-2810) on both configurations.",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "SVS, embedded in the Collins MFD-2810, builds a three-dimensional synthetic view of the terrain around the aircraft from precise navigation sensor inputs plus a high-resolution terrain, obstacle and runway/heliport database. It displays airport runways and helipads, obstacles higher than 50 ft, and a Flight Path Vector (FPV) showing the aircraft's actual trajectory. Selected on the PFD's attitude/navigation area via the PFD menu or the on-side DCP; the FPV and obstacle layers can be switched off independently.",
      ],
    },
    {
      heading: "The one rule that matters most",
      paragraphs: [
        "Pitch and roll attitude are read from the basic PFD symbology, never from the SVS picture itself. The SVS terrain image is a situational-awareness layer drawn on top of the real attitude display, not a replacement for it.",
      ],
    },
    {
      heading: "When it turns off on its own",
      paragraphs: [
        "SVS must not be used for navigation, and must not be selected ON during approach and landing. It won't display at all with the central MFD powered off or reverted to PFD format. It is automatically inhibited whenever aircraft attitude exceeds 30° nose up/down or 50° bank left/right, and re-selects itself automatically once attitude comes back within ±10° pitch and ±5° roll.",
      ],
    },
    {
      heading: "Failures",
      paragraphs: [
        "SVS FAIL: total loss of the function. SVS DEGR: partial loss — obstacles, FPV, or runway/airport/helipad data missing, rather than everything. SVS is not available at all if the PFD itself has failed. GPS POS and GPS HT messages mean the SVS detected a mismatch between the two GPS receivers' position or height solutions — the response in both cases is the same: deactivate the SVS.",
      ],
    },
  ],
};

const DIGITAL_MAP_SHARED: SystemNote = {
  slug: "digital-map",
  title: "Digital Map System",
  subtitle: "A moving-map underlay for the MFD — small system, but nine distinct failure messages worth being able to tell apart.",
  rfmReference: "AW169 / AW169 EP RFM Supplement 17 (Digital Map System). Same avionics suite on both configurations.",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "A moving-map display selectable to underlay the FPLN page on the MFD (DMAP item on the MFD menu). The system can receive two DMAP video sources, DMAP1 and DMAP2, either selectable from the DMAP menu. Like the weather radar and HTAWS, it must not be used for navigation — it is an awareness tool, and the display/database may not have the accuracy to base routine navigation decisions or route planning on.",
      ],
    },
    {
      heading: "Failure and mismatch messages",
      table: {
        columns: ["Message", "Trigger"],
        rows: [
          ["DMAP FAIL", "Digital map database failure — map data removed"],
          ["DMAP1(2) RNG MSCP", "Range scale requested on one display doesn't match the other, while the same DMAP source is overlaid on both MFD and copilot PFD"],
          ["DMAP1(2) POS MSCP", "ARC/ROSE format selected on one display while the opposite (ROSE/ARC) is already showing on the other, same dual-overlay condition"],
          ["DMAP1(2) HDG MSCP", "PLAN format selected on one display while ARC or ROSE is already showing on the other, same dual-overlay condition"],
          ["DMAP HDG FAIL", "Heading data for the map lost"],
          ["DMAP POS FAIL", "Helicopter's current position missing"],
          ["NO MAP AVAIL", "Operating outside the digital map database's coverage area"],
          ["MISSION FAIL", "Mission data becomes invalid while on the DMAP presentation"],
        ],
      },
      note: "The three MSCP (miscompare) messages only apply when the same DMAP source is overlaid on both the MFD and the copilot's PFD at once — the system is checking that both displays agree on range, position format, and heading format, and clears the data from one side if they stop matching.",
    },
  ],
};

const OPLS_SHARED: SystemNote = {
  slug: "opls",
  title: "OPLS: Obstacle Proximity LiDAR System",
  subtitle: "Three LiDAR units, a 360° ring of distance awareness in one plane only, and the color/sound logic that goes with it.",
  rfmReference: "AW169 / AW169 EP RFM Supplement 38 (Obstacle Proximity LiDAR System).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "OPLS gives visual and audio obstacle-distance awareness while hovering or in low-speed flight. Three LiDAR (Laser Imaging Detection and Ranging) units are mounted around the transmission cowling below the rotor head; their three overlapping beams are digitally mixed to produce 360° obstacle coverage — but only in the plane of the sensor units. Nothing above or below that plane is detected.",
        "Controlled from a dedicated OPLS page on the EDCU (Home → KITS → MIS tab → OPLS tab): POWER, MAINT, MUTE, INFO buttons, plus a status indicator. Displayed on the MFD as a plan-view polar grid of the obstacle profile around the helicopter, selected via the cursor control device (VIDEO → OPLS) or the MFD's T4 top bezel key.",
      ],
    },
    {
      heading: "Color and sound",
      paragraphs: [
        "The nearest obstacle's distance is shown as a color-coded radial line with the range at the top of the display: green (safe), yellow (caution), red (critical). An audio tone in the intercom rises in frequency as distance decreases. Crossing green into yellow triggers “APPROACHING”; crossing yellow into red triggers “CHECK DISTANCE.”",
        "MUTE only works from the yellow band — selecting it while in green or red does nothing. Once muted, deselect MUTE (EDCU OPLS page, or CAS RST on the collective) to bring the audio back.",
      ],
    },
    {
      heading: "Limitations",
      paragraphs: [
        "OPLS is a hover/low-speed obstacle awareness aid only — the primary means of avoiding obstacles remains see-and-avoid technique. It may not detect large glass surfaces, and fog, mist, rain, cloud or snow can generate spurious signals or degrade the distance information. If an HTAWS aural alert and an OPLS aural alert occur together, HTAWS has priority and the OPLS aural can be suppressed.",
      ],
    },
    {
      heading: "Failure",
      paragraphs: [
        "On a system failure, the obstacle display is replaced by a red cross, the audio deactivates, and the EDCU OPLS page shows FAIL.",
      ],
    },
  ],
};

const EVS_CAMERA_SHARED: SystemNote = {
  slug: "evs-camera",
  title: "EVS Camera",
  subtitle: "An infrared nose camera for reduced visibility — what it shows, what it doesn't, and why it fights the SVS for screen time.",
  rfmReference: "AW169 / AW169 EP RFM Supplement 22 (EVS Camera).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "Two possible installations: the MAX-VIZ EVS-1500, IR image only, or the EVS-2300, which adds a color image alongside the IR one. A Long Wave Infrared camera is mounted facing forward under the right-hand nose compartment, feeding the MFD as a visual aid in reduced visibility. Selected on and off from the EDCU KITS → CAMERA tab; a video test pattern shows for about 5 seconds after power-on, then an OK message, then an IR image after about 20 seconds total.",
        "The camera automatically recalibrates its IR sensor (NUC) every 4 minutes — a 1-second screen blank with CAL displayed — which can be inhibited from the same EDCU page if needed. It's self-anti-iced with internal heaters whenever powered on, fed from Main Bus 1 (REPU 1 Channel A), a bus not shown on the DC ELEC synoptic page.",
      ],
    },
    {
      heading: "Display and field of view",
      paragraphs: [
        "Shown full-size on the MFD VIDEO page, or as picture-in-picture on VIDEO or DMAP pages. Brightness/contrast adjust via the VIDEO page bezel buttons — on the EVS-2300, the IR and color channels have independent brightness/contrast controls. Field of view (Narrow/Wide) is selected from the PFD EVS menu or the DCP EVS button, and on the EVS-2300 that selection applies to both the IR and color image together. Zooming is available via PFD controls or the DCP.",
        "Selecting a field-of-view change removes the SVS from the PFD — the two compete for the same display space. SVS has to be manually reselected afterward (DCP SVS button, or the SVS bezel key on the PFD SVS menu). Since the EVS image itself is not shown on the PFD, the PFD EVS menu's BRT/CNST bezel keys have no effect.",
      ],
    },
    {
      heading: "Limitations",
      paragraphs: [
        "Do not use the EVS image for takeoff, landing, or navigation. It is an obstacle-awareness aid only — the display may not have the accuracy or fidelity to base takeoff, landing, or navigation decisions on.",
      ],
    },
  ],
};

const EHPS_SHARED: SystemNote = {
  slug: "ehps",
  title: "EHPS: Electric Motor-Driven Hydraulic Power Supply",
  subtitle: "A ground-only electric hydraulic pump that changes the order you're allowed to do things in — why it lets engine 1 start straight into MAIN mode.",
  rfmReference: "AW169 / AW169 EP RFM Supplement 42 (Electric Motor-Driven Hydraulic Power Supply).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "A 28 VDC electric motor-driven hydraulic pump installed on hydraulic system 1, ground use only. It provides just enough hydraulic pressure to do the full-and-free flight-controls check on the servo-actuators before either engine — and its mechanically-driven hydraulic power supply — is even running. Controlled from the EDCU HYD page, powered from the helicopter battery, and limited by AMMC logic to 2 minutes of operation maximum. In flight, switching it on is inhibited by design.",
      ],
    },
    {
      heading: "Why it changes the start sequence",
      paragraphs: [
        "Without EHPS, engine 1 normally has to start in ACC (accessory) mode first, because the flight-controls check needs mechanically-driven hydraulic pressure that only comes from a running engine. EHPS removes that dependency: run the electric pump on the ground, do the flight-controls check off it, then engine 1 can be started directly in MAIN mode, either engine first. The equivalent flight-controls check step later in the normal Engines Start procedure is skipped, since it's already been done.",
        "Same logic applies in reverse at shutdown — with EHPS installed, engine and rotor shutdown can be done in MAIN mode, since the next flight-controls check will again be available from the electric pump rather than requiring a mechanically-driven source.",
      ],
    },
    {
      heading: "The check itself",
      paragraphs: [
        "ELEC PUMP switch on, confirm HYD 1 pressure reads 80–120 bar (this is genuinely in the pump's normal red zone on the gauge — don't read that as a fault). Exercise the controls progressively and slowly: collective to about 50% then cyclic to full displacement, cyclic centered then collective to full displacement, then pedals to full displacement. Deselect ELEC PUMP when done — it also disengages on its own after 2 minutes regardless.",
        "Using EHPS does draw down battery power that would otherwise be available for engine start, so it isn't purely free.",
      ],
    },
  ],
};

const ADI_STBY_BATTERY_SHARED: SystemNote = {
  slug: "adi-stby-battery",
  title: "ADI STBY Emergency Battery",
  subtitle: "30 minutes of backup power for one instrument, and the three-position switch that controls it.",
  rfmReference: "AW169 / AW169 EP RFM Supplement 31 (ADI STBY Emergency Battery).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "A dedicated Li-Ion battery, installed in the left side of the nose avionics bay, that automatically feeds the standby attitude indicator for at least 30 minutes after a total failure of the electrical generating system. It connects through the CB panel to EMER BUS 1, protected by a 7.5A ADI STBY circuit breaker — a self-contained backup for exactly one instrument, not the wider emergency bus.",
        "Controlled by a Control Switch Annunciator on the right side of the interseat console, three positions: ARM (battery powered through EMER BUS 1, ready to supply output), OFF (disconnected from both EMER BUS 1 and the ADI STBY), and TEST (press and hold — checks state of charge is above 80% plus the internal heater and temperature monitoring; TEST illuminates green if it passes). The STBY annunciator itself lights amber whenever the battery is actually delivering power to the ADI.",
      ],
    },
    {
      heading: "The only procedure that touches it",
      paragraphs: [
        "Engine pre-start checks: press and hold ADI STBY BATT TEST until TEST illuminates, release, then set the switch to ARM. That's the entire normal-procedures footprint of this system — it's a check-and-arm item, nothing more.",
      ],
    },
  ],
};

const AUTOMATIC_SEARCH_MODES_EP: SystemNote = {
  slug: "automatic-search-modes",
  title: "Automatic Search Modes",
  subtitle: "An overview of the AFCS SAR mode chain — HOV, TU, TD, GATE, TDH, MOT and WTR — and what happens when GPS or ADS drops out mid-search. EP-only; this option does not exist on AW169 Standard.",
  rfmReference:
    "AW169 EP RFM Supplement 54 (Automatic Search Modes) — an 80-page supplement. This note covers the operational overview: mode purposes, the engagement/MUH table, and the failure categories. The per-mode axis-by-axis control logic, FTR/beep-switch behavior, and the full WAT performance charts go considerably deeper than covered here.",
  sections: [
    {
      heading: "What the mode chain is for",
      paragraphs: [
        "Requires the LCR110 primary flight sensors to be fitted. Together, these AFCS modes fly an automated profile from cruise down to a stabilized hover over a target, and back up again — the profile a SAR or offshore search actually flies, without the pilot hand-flying every axis through the transition.",
        "The chain: Transition Up (TU) climbs out of a hover to a preset height and airspeed. In cruise, standard AFCS modes fly the search leg. Transition Down (TD) flies an automatic descent and deceleration toward the target. GATE takes over automatically at the end of a TD or TU when the aircraft is near its target height/airspeed conditions, holding them until the next mode takes over. Transition Down to Hover (TDH) finishes the profile into an actual stabilized hover. Mark On Target (MOT) lets the pilot mark a position while overflying it and returns the aircraft to a headwind hover offset from that mark. Winchman Trim (WTR) hands limited hover control to the hoist operator once established in the hover.",
        "One important, separate limitation this option unlocks: IMC flight below Vmini (50 KIAS) is only permitted when Automatic Search Modes are in use — not otherwise.",
      ],
    },
    {
      heading: "HOV, MOT, and WTR in a little more detail",
      paragraphs: [
        "HOV is the underlying basic AFCS mode this all builds on — no dedicated option file required — using AHRS ground velocity to hold hover position or low-speed flight, transitioning automatically from velocity-hold to position-hold once groundspeed falls below 1.5 kt. RHT engages automatically under it if a valid radar altimeter signal is available; ALT substitutes if not.",
        "MOT engages via its own AFCS Control Panel button, available with groundspeed at or below 150 kt and selected radar height between 150 and 2000 ft AGL. It offsets the resulting hover position downwind and to the left of the marked point, adjustable in the range 0–150 ft on the EDCU.",
        "WTR only exists with the Rescue Hoist kit installed (Supplement 5). Once selected, the hoist operator can adjust the aircraft's hover groundspeed up to ±10 kt from the pilot's HOV reference, using the hoist pendant's five-position switch — pilot input always overrides the hoist operator's input.",
      ],
    },
    {
      heading: "Engagement and minimum use height",
      table: {
        columns: ["Mode", "Engagement range", "MUH"],
        rows: [
          ["MOT", "40 KIAS to Vne, or 150 kt GS, 150–2000 ft AGL", "150 ft AGL in TD phase / 30 ft AGL in TDH phase, whichever is less"],
          ["WTR", "HOV mode engaged", "30 ft AGL"],
          ["NGSPD (FMS groundspeed control)", "50–180 kt groundspeed, 50 KIAS to Vne", "150 ft AGL"],
        ],
      },
      note: "TDH, TU and MOT may only engage over flat surfaces clear of obstructions. Over the sea, MUH must be increased relative to the maximum reported/observed wave height. NGSPD carries the same Airspeed Envelope Protection logic as GSPD elsewhere in the AFCS — it intervenes if the groundspeed datum would push airspeed below Vmini or above Vne − 5.",
    },
    {
      heading: "Collective Safety Function, search-mode-specific thresholds",
      paragraphs: [
        "With search modes engaged, the low-height floor is 18 ft AGL when MOT, TU or TDH is active in hover/low-speed condition, or 90 ft AGL when MOT or TD is active in cruise condition — hover/low speed being below 55 KIAS or HOV/TDH engaged, cruise being above 55 KIAS with neither engaged. As elsewhere in the AFCS, breaching one of these inadvertently causes the system to add collective automatically back to the threshold.",
      ],
    },
    {
      heading: "What breaks a search in progress",
      paragraphs: [
        "A dedicated set of malfunction procedures exists for exactly this scenario — a sensor failure while a search mode is actively flying the aircraft. In broad terms: an ADS failure on the side in command during MOT causes the aircraft to level off and revert to RHT-IAS-HDG or RHT-HOV-HOV, losing FMS LNAV/VNAV guidance (recoverable during the TD phase by engaging NAV). An AMMC failure disengages MOT automatically if it corresponds to the FMS side selected as NAV source. A GPS/GPS miscompare can disengage HOV/TU/TDH/MOT/WTR — if that happens in IMC above Vmini, the response is to engage GA to accelerate back above Vmini first. A double GPS failure or double radar altimeter failure are both covered as their own distinct procedures, on top of the miscompare cases above.",
      ],
    },
  ],
};

const EXTERNAL_HOIST_SHARED: SystemNote = {
  slug: "external-hoist",
  title: "External Hoist Operations (Goodrich)",
  subtitle: "The rescue hoist system — weight and airspeed limits, the two cable-cutter systems, and how engine failure in the hover changes with a load on the hook.",
  rfmReference:
    "AW169 / AW169 EP RFM Supplement 5 (External Hoist Operations — Goodrich) — a 68-page supplement. This note covers the operational overview: the installation, key limitations, and the malfunction procedures. Full weight/CG envelope charts and hover-ceiling performance data go deeper than covered here.",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "A Goodrich hoist unit mounted on the right side of the cabin, in either a 290 ft or 165 ft usable-cable version, each with its own pendant. The pilot and copilot can operate the hoist from the collective grip; the Hoist Operator (HO) operates it from the control pendant, which also displays cable payout. Pilot control always overrides the HO's input. Maximum load: 550 lb (249 kg) above 0°C OAT, 500 lb (227 kg) at or below — maximum 2 persons plus equipment either way.",
        "Two independent ways to cut the cable in an emergency: an electrical cable cutter (PQRS), fired from a guarded HOIST CUT switch on either collective grip or from the HO control panel, and a manual cable cutter (BQRS) the HO must always have available as a backup if the electrical system fails.",
      ],
    },
    {
      heading: "Key limitations",
      paragraphs: [
        "Minimum crew: one pilot plus one Hoist Operator. Load raising/lowering is permitted in a stationary hover or forward flight up to 45 KIAS (80 KIAS with the extended main footstep kit fitted). Maximum permissible bank angle with the cable extended is 20° — exceeding 15° of lateral pendulum angle relative to the helicopter's vertical axis can cause the overload clutch to slip, and that clutch is unlikely to function correctly if actually overloaded. Takeoff and landing with a suspended load on the hoist is prohibited.",
        "During hoist operations the pilot must either fly manually, or fly attentively if HOV and RHT (or ALT) modes are engaged — the autopilot is not a substitute for monitoring during a hoist operation. Maximum weight including the hoisted load is 4800 kg (above 4600 kg for takeoff/landing, the Supplement 30 increased-gross-weight configuration is required). The HO must be harnessed throughout, wear protective gloves, and guide the cable by hand.",
      ],
    },
    {
      heading: "Cable and hoist malfunctions",
      paragraphs: [
        "HOIST CBL FOUL: the cable isn't winding correctly onto the drum, motor stops automatically. Proceed in forward flight with the load suspended (same 45/80 KIAS limits), find a suitable site, hover and slowly descend to lay the load on the ground, then recover the cable manually.",
        "HOIST OVER-TEMPERATURE: amber TEMP light on the pendant, motor current automatically limited to 80 amps — the hoist keeps working but at reduced performance. Complete the current cycle and wait for the indication to clear before resuming; prolonged operation with TEMP lit risks a hoist failure.",
        "HOIST CUT ARM: appears when a cut-system guard has been lifted. If it was intentional, continue as required. If it was unintentional, lower the guard, don't lift it again, and stop hoist operations, HOIST PWR to OFF.",
      ],
    },
    {
      heading: "Engine failure in the hover with a load on the hook",
      paragraphs: [
        "Where OEI hover performance capability is not required: the gross weight and hover height that would normally satisfy the Flyaway or Vertical Reject WAT charts may not actually give a safe flyaway or reject with a cable extended and a load hanging — that's a real, named caveat, not a generic warning. Recover aircraft control per the standard Vertical Reject or Flyaway procedure, then either raise the load back into the cabin, emergency-jettison it, or transition forward (same 45/80 KIAS limit), depending on conditions and load type.",
        "Where OEI hover performance capability is required — meaning the aircraft is being flown at the weights defined on the hover-OGE 2.5-minute-OEI charts specifically to guarantee no rotor droop or height loss on an engine failure — maintain the collective pitch setting (2.5-minute OEI rating covers the hover) and raise the load into the cabin; raising a full-length load from fully extended takes about 2 minutes.",
      ],
    },
    {
      heading: "If a double DC generator failure happens with a load on the hook",
      paragraphs: [
        "The hoist reverts to being powered by the main battery. If the battery is used to recover the load, the normal 30-minute battery endurance figure is not guaranteed once the hoist has drawn on it.",
      ],
    },
  ],
};

const CARGO_HOOK_SHARED: SystemNote = {
  slug: "cargo-hook",
  title: "Cargo Hook Operations",
  subtitle: "Electrical, mechanical, and explosive-cartridge release — three independent ways to let go of an external load, and when each one applies.",
  rfmReference:
    "AW169 / AW169 EP RFM Supplement 6 (Cargo Hook Operations) — a 76-page supplement. This note covers the operational overview: the installation, key limitations, and the release/malfunction procedures. Full weight/CG envelope charts and hover-ceiling performance data go deeper than covered here.",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "A cargo-only (Non-Human External Cargo) hook system, approved for Class B rotorcraft-load combinations — the load must be jettisonable and lifted free of land or water — Day VFR only, one pilot minimum, and only personnel actually involved in the cargo operation may be aboard. Powered from Main Bus 3; the emergency release circuit is on its own separate EMERG Bus 1, so it stays live even if the normal cargo hook power is lost.",
        "Three ways to let go of the load: the normal electrical release, a guarded CARGO REL pushbutton on either cyclic grip; a ground-personnel-only secondary manual release mounted directly on the hook; and an Emergency Cargo Release (REL EMER) guarded switch on the HOOK control panel, which fires an electrical explosive cartridge. An optional two-camera kit can show the hook and load on the MFD, though a mirror, other approved camera, or a crew member's direct observation are all acceptable alternatives.",
      ],
    },
    {
      heading: "Key limitations",
      paragraphs: [
        "Maximum weight with the external load: 4800 kg. Airspeed: 100 KIAS up to 12,000 ft density/pressure altitude (whichever is lower), 90 KIAS above that — but airspeed is really governed by controllability, since load size, shape, and strop length all affect handling, and airspeed must always be adjusted to keep the load in continuous sight.",
      ],
    },
    {
      heading: "Jettisoning the load",
      paragraphs: [
        "Confirm HOOK PWR is ON. Rotate the CARGO REL late-arm guard to the operational position — HOOK ARM illuminates, and from this point raising either release guard can release the cargo, so only do this when actually ready to let go. Press CARGO REL — HOOK OPEN illuminates, confirm the load is away, then return the late-arm guard to stowed.",
        "If that doesn't release the load, lift the CARGO REL EMERG guard on the HOOK control panel instead — confirm HOOK ARM is showing, confirm the load is away, then close the guard again and select HOOK PWR to OFF. Cargo hook operations are considered interrupted after an emergency release.",
      ],
    },
    {
      heading: "Cautions",
      paragraphs: [
        "HOOK ARM: the release system is armed. If that was intentional, continue. If it wasn't, close the guards, don't rotate the late-arm guard or lift the EMERG guard again until actually ready to release, then complete a load release and select HOOK PWR OFF.",
        "HOOK OPEN: the hook is physically open. If it stays lit after releasing the CARGO REL pushbutton, cargo hook operations must be interrupted.",
      ],
    },
    {
      heading: "Engine failure in the hover with a load on the hook",
      paragraphs: [
        "Same caveat as with the hoist: gross weights and hover heights that satisfy the standard Flyaway or Vertical Reject WAT charts may not actually give a safe flyaway or reject with an external load hanging underneath — it's a genuinely different situation from a clean aircraft, not just a heavier one. Recover aircraft control per the standard Vertical Reject or Flyaway procedure, then jettison the load and transition forward (maximum 45 KIAS) depending on conditions.",
      ],
    },
  ],
};

const DITCHING_SHARED: SystemNote = {
  slug: "ditching",
  title: "Ditching Configurations",
  subtitle: "The emergency floatation system and liferafts — arming logic, the full water-contact sequence, and what FLOAT DEGR actually means.",
  rfmReference:
    "AW169 / AW169 EP RFM Supplement 11 (Ditching Configurations), Part A — Aerosekur Emergency Floatation System. Later avionics phases also offer a DART-brand floatation kit (Parts B/C of this supplement, with an integrated-liferaft variant) — not covered in this note.",
  sections: [
    {
      heading: "What the system is",
      paragraphs: [
        "Two forward and two aft float installations in dedicated fuselage openings, two gas distribution/inflation systems, and four immersion switches. Demonstrated and approved for ditching up to Sea State 6 (significant wave height 4–6 m) at weights up to 4800 kg — well beyond the Sea State 4 that ditching regulations actually require.",
        "The Floatation Control Panel, in the interseat console, has a TEST/OFF/ARMED master switch. OFF isolates power from the water sensors and the guarded collective-grip pushbuttons. ARMED makes the discharge valves live — via water sensor immersion or the pilot/copilot's guarded FLOAT pushbutton. TEST checks the electrical activation circuit's continuity as part of preflight, and is automatically disabled in flight by the weight-on-wheels switch.",
        "Two liferafts are carried, in one of two configurations: Carry-On (stowed on a seat, deployed manually through a Type IV emergency exit, reduces passenger capacity from 8 to 7) or Sponson (mounted in the sponsons themselves, no seating impact, with an external activation handle accessible from outside the aircraft for a water-side deployment).",
      ],
    },
    {
      heading: "Hard rules",
      paragraphs: [
        "The floatation system and liferafts exist for ditching only — floatation bags and liferafts must never be inflated in flight. Takeoff after ditching is prohibited. Total occupants, crew included, must not exceed 11 when forecast sea conditions along the route exceed 2.5 m significant wave height. With retractable bear paws fitted, the gear must be retracted before extended overwater flight. Bear paws, snow pads, and snow skis (Supplements 8, 45, 50) are explicitly listed as not compliant with ditching requirements — fit any of those and the ditching approval no longer applies.",
      ],
    },
    {
      heading: "The ditching sequence",
      paragraphs: [
        "Preliminary: brief crew and passengers, notify ATC, transponder to 7700, seatbelt sign on, secure loose equipment, cabin doors confirmed closed (they stay closed throughout — opening them lets in the water that would otherwise be kept out), mute HTAWS, inhibit the low-height aural, life vests and harnesses on and tightened.",
        "Approach: set the radar altimeter (height-over-water is notoriously hard to judge by eye, hence the specific caution to use RadAlt cues), wipers fast, pitot heat off, confirm FLOATS EMER armed, assess sea state and wind, establish a ditching heading and a descent profile that targets no more than 30 kt groundspeed at water contact, emergency lights on, alert everyone for impact, transmit final position, brace order over the PA, and — if power allows — establish a hover at a safe height first. Touch down cushioning the impact with the collective, aircraft level or slightly nose-up (5°), avoiding any rearward movement.",
        "On water contact: both engine mode knobs OFF, lift the guard and press FLOAT on either collective grip (the bags inflate automatically on touchdown regardless, but this is the manual backup), survival equipment on, emergency exits open/eject, release both liferafts, deploy the ELT, initiate evacuation over the PA, and only once the rotor has fully stopped does passenger evacuation actually begin. Master Cut-Off Switch off, then abandon the helicopter.",
        "At high touchdown speeds the aircraft can roll and yaw left after touchdown from gyroscopic effects — that's a real, anticipated tendency the pilot needs to actively correct for, not a sign something's gone wrong.",
      ],
    },
    {
      heading: "FLOAT DEGR",
      paragraphs: [
        "Triggered by bottle pressure too high or too low for ambient conditions, a faulty pressure transducer, or a faulty float switch. The floats may not actually work if ditching becomes necessary with this caution showing — the response is simply to continue the flight according to operational requirements, i.e., this is a dispatch/risk-picture item, not something with its own corrective checklist.",
      ],
    },
  ],
};

const ADELT_SHARED: SystemNote = {
  slug: "adelt",
  title: "ADELT: Crash Position Indicator with Deployable ELT",
  subtitle: "Two frequencies, two purposes — the swept tone that just says \"here\" and the digital message that says \"here, precisely, from GPS.\"",
  rfmReference: "AW169 / AW169 EP RFM Supplement 15 (Crash Position Indicator with Deployable ELT) and Section 7 (System Description, OES).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "A locator beacon on the left side of the tail cone, containing its own transmitter and antenna, that ejects from the aircraft in a crash — automatically, or manually at the pilot's discretion. Once deployed it transmits on two channels for two different purposes. The standard swept tone on 121.5/243.0 MHz — the classic analog distress tone — runs until battery power is exhausted, typically around 48 hours. Separately, 406.025 MHz carries an encoded digital message of the aircraft's position, sourced from the GPS/FMS via ARINC, and runs for about 24 hours.",
        "The system comprises the beacon itself, a Beacon Release Unit, a System Interface Unit, a Cockpit Control Panel in the interseat console, a water-activated switch, and an Aircraft Identification Device.",
      ],
    },
    {
      heading: "Manual control",
      paragraphs: [
        "Two separate manual actions, not one: lifting the guard and operating the TRANSMIT switch starts transmission from the beacon without releasing it — useful for a self-test or if activation is needed without an actual beacon separation. Lifting the guard and operating DEPLOY on the cockpit control panel releases the beacon itself, confirmed by both the TX/TEST and BEACON GONE lights. Transmission alone can be stopped by moving TRANSMIT to off and pressing TEST/RESET.",
      ],
    },
    {
      heading: "Self-test discipline",
      paragraphs: [
        "The self-test should not be run more often than monthly — running it more frequently shortens the battery's life. Notify the nearest ATC facility before testing, since the 121.5 MHz tone the test actually transmits will be treated as a valid distress signal by anyone monitoring it, test or not.",
      ],
    },
  ],
};

const EAPS_EP: SystemNote = {
  slug: "eaps",
  title: "EAPS: Engine Air Particle Separator",
  subtitle: "How the vortex separator protects the PW210A1 from sand and dust, and the engine limits table that only applies with this kit installed.",
  rfmReference: "AW169 EP RFM Supplement 3 (Engine Air Particle Separator). This configuration's engine limits differ from AW169 Standard — see the separate AW169 Standard note.",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "Two particle separators sit in front of each engine air intake. Incoming air is spun by vortex generators inside the separator; the swirling action throws foreign particles (sand, dust) outward while clean air continues into the engine intake. The separated particles collect in a lower chamber and are discharged overboard through an ejector driven by engine bleed air.",
        "Each engine has its own EAPS switch on the KITS panel in the interseat console. Switched ON, bleed air actively drives the ejector. Switched OFF, the separator still works but at roughly half the efficiency — and because nothing is actively ejecting particles, the lower chamber fills up; once full, incoming particles pass straight through into the engine intake with no further separation at all.",
      ],
    },
    {
      heading: "Engine limits with EAPS installed",
      paragraphs: [
        "This kit carries its own limitations table for the PW210A1, All Engines Operating, airspeed at or below 90 KIAS — distinct from the aircraft's general Section 1 limits."
      ],
      table: {
        columns: ["Parameter", "Max continuous", "5-min Take-Off range", "Max 5-min", "Transient"],
        rows: [
          ["Power Index (PI %)", "100", "101–122", "122", "132 (10 sec)"],
          ["Gas Generator Speed (NG %)", "96.5", "96.6–98.2", "98.2", "98.9 (5 sec)"],
          ["ITT (°C / %)", "868 (100%)", "869–937 (100.1–107.9%)", "937 (107.9%)", "941 (108.4%, 5 sec)"],
          ["Torque (TQ %)", "100", "101–122", "122", "132 (10 sec)"],
        ],
      },
    },
    {
      heading: "Operating it",
      paragraphs: [
        "Switch EAPS ON for both engines after start, and leave it on for dusty or sandy conditions — expect ITT to rise slightly when it's selected on. Switch it OFF before shutdown, ahead of the engine mode switches going OFF.",
      ],
    },
    {
      heading: "Malfunction",
      paragraphs: [
        "1(2) EAPS PRESS means the bleed-air shut-off valve for that engine is stuck — closed when it should be open, or open when it should be closed. Continue flight either way, but know what it costs you: with EAPS switched ON and the valve actually closed, separation is degraded because the ejector isn't getting bleed air. With EAPS switched OFF and the valve actually open, aircraft performance may not match the EAPS-OFF performance charts — use the EAPS-ON charts instead in that case.",
        "A lightning strike's induced current can trip the EAPS circuit breakers even without any other damage — if that happens, they can simply be reset.",
      ],
    },
  ],
};

const EAPS_STANDARD: SystemNote = {
  slug: "eaps",
  title: "EAPS: Engine Air Particle Separator",
  subtitle: "How the vortex separator protects the P&WC 210A from sand and dust, and the engine limits table that only applies with this kit installed.",
  rfmReference: "AW169 RFM Supplement 3 (Engine Air Particle Separator). This configuration's engine limits differ from AW169 EP — see the separate AW169 EP note.",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "Two particle separators sit in front of each engine air intake. Incoming air is spun by vortex generators inside the separator; the swirling action throws foreign particles (sand, dust) outward while clean air continues into the engine intake. The separated particles collect in a lower chamber and are discharged overboard through an ejector driven by engine bleed air.",
        "Each engine has its own EAPS switch on the KITS panel in the interseat console. Switched ON, bleed air actively drives the ejector. Switched OFF, the separator still works but at roughly half the efficiency — and because nothing is actively ejecting particles, the lower chamber fills up; once full, incoming particles pass straight through into the engine intake with no further separation at all.",
      ],
    },
    {
      heading: "Engine limits with EAPS installed",
      paragraphs: [
        "This kit carries its own limitations table for the P&WC 210A, All Engines Operating, airspeed at or below 90 KIAS — distinct from the aircraft's general Section 1 limits, and lower across the board than the EP configuration's version of this same table."
      ],
      table: {
        columns: ["Parameter", "Max continuous", "5-min Take-Off range", "Max 5-min", "Transient"],
        rows: [
          ["Power Index (PI %)", "100", "101–111", "111", "125 (10 sec)"],
          ["Gas Generator Speed (NG %)", "96.5", "96.6–98.2", "98.2", "98.9 (20 sec)"],
          ["ITT (°C / %)", "868 (100%)", "869–930 (100.1–107.1%)", "930 (107.1%)", "941 (108.4%, 20 sec)"],
          ["Torque (TQ %)", "100", "101–111", "—", "125 (10 sec)"],
        ],
      },
    },
    {
      heading: "Operating it",
      paragraphs: [
        "Switch EAPS ON for both engines after start, and leave it on for dusty or sandy conditions — expect ITT to rise slightly when it's selected on. Switch it OFF before shutdown, ahead of the engine mode switches going OFF.",
      ],
    },
    {
      heading: "Malfunction",
      paragraphs: [
        "1(2) EAPS PRESS means the bleed-air shut-off valve for that engine is stuck — closed when it should be open, or open when it should be closed. Continue flight either way, but know what it costs you: with EAPS switched ON and the valve actually closed, separation is degraded because the ejector isn't getting bleed air. With EAPS switched OFF and the valve actually open, aircraft performance may not match the EAPS-OFF performance charts — use the EAPS-ON charts instead in that case.",
        "A lightning strike's induced current can trip the EAPS circuit breakers even without any other damage — if that happens, they can simply be reset.",
      ],
    },
  ],
};

const FUEL_TRANSFER_PUMP_SHARED: SystemNote = {
  slug: "fuel-transfer-pump",
  title: "Fuel Transfer Pump",
  subtitle: "Why a failed engine's own fuel becomes usable again, and the one-way rule that keeps a pilot from ever feeding the wrong tank.",
  rfmReference: "AW169 / AW169 EP RFM Supplement 39 (Fuel Transfer Pump).",
  sections: [
    {
      heading: "What it's for",
      paragraphs: [
        "A single reversible pump, submerged in the LH tank sump, that can move fuel in either direction between the left and right main tanks through a pipeline routed via the existing intercommunication channel — no new tank wall interfaces. It self-primes in either direction within 10 seconds of power, self-stops once it can't pump any more fuel to the other side, and reports its health to the AMMC.",
        "Two distinct jobs: in OEI, it makes the fuel below the intercommunication channel on the failed engine's side — fuel that would otherwise be stranded and unusable — available to the engine that's still running. In AEO, if the tanks become unbalanced (a leak, uneven consumption, or fuel sloshing during unbalanced flight), it can transfer fuel to restore balance.",
      ],
    },
    {
      heading: "The one-way rule in OEI",
      paragraphs: [
        "With one engine failed, the pilot can only transfer fuel from the failed engine's tank to the operating engine's tank — never the other direction. The EDCU FUEL page only shows the button for the failed-engine side; the opposite button is inhibited by software, not just by procedure. This is a hard-wired safeguard against ever pulling fuel away from the engine that's actually keeping the aircraft flying.",
        "Direction and progress show as a green arrow over the FUEL XFER icon on EDCU, PFD and the MFD synoptic page, plus an advisory naming the direction (\"FUEL XFER 1→2\" or \"2→1\"). FUEL XFER COMPLETE displays for about 10 seconds once an OEI transfer finishes and the pump stops itself.",
      ],
    },
    {
      heading: "Why unusable fuel becomes 0 kg",
      paragraphs: [
        "Without this kit, fuel below the intercommunication channel in the tank tied to a failed engine simply can't reach the system and counts as unusable. With the Fuel Transfer Pump installed and used, that figure becomes 0 kg indicated for OEI — the pump is precisely what closes that gap. Below 160 kg is where this actually starts mattering; above that level the two tanks are already interconnected and balanced on their own.",
      ],
    },
    {
      heading: "AEO limits and stopping conditions",
      paragraphs: [
        "In AEO, transfer automatically stops the moment 1(2) FUEL LOW activates on the tank being drawn from — FUEL XFER STOPPED displays for about 10 seconds. In the two genuinely abnormal cases — a leak, or one engine burning fuel unevenly — don't use FUEL XFER unless FUEL LOW is already active on the low tank and the other tank's spare fuel is actually needed to finish the flight safely. The routine case is different: after unbalanced flight has returned to balanced, XFER can simply restore the tanks to even without any of that caution attached. On the ground, it can also be used to correct an unbalance created by single-point refueling below the intercommunication channel.",
      ],
    },
    {
      heading: "Pump failure",
      paragraphs: [
        "FUEL XFER PUMP caution: confirm XFER is actually OFF on the EDCU FUEL page. If the fuel on the failed-engine side is needed to finish the flight safely, try switching it back on. If the caution persists, that fuel has to be treated as unusable — land as soon as practicable or as soon as possible, depending on what's actually left.",
      ],
    },
  ],
};

const RNP_APCH_LPV_SHARED: SystemNote = {
  slug: "rnp-apch-lpv",
  title: "RNP APCH with LPV/LP Minima",
  subtitle: "A satellite-augmented approach down to a 200 ft decision height — the annunciation colors, the 900 fpm/900-to-1000-ft rule for a failure, and when a missed approach becomes mandatory.",
  rfmReference: "AW169 / AW169 EP RFM Supplement 43 (RNP APCH with LPV/LP Minima).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "Requires its own AMMS option file enabled. RNP approaches flown to LPV or LP minima (charted as RNAV(GPS) or RNAV(GNSS)) use Satellite Based Augmentation (SBAS) to fly an approach with vertical guidance down to a 200 ft decision height, with no airport-specific ground equipment required. LPV gives lateral and vertical angular guidance; LP gives lateral angular guidance paired with Baro-VNAV for the vertical path instead. The GNSS sensors feed the FMS pseudo-localizer (NLOC) and pseudo-glideslope (NGS) deviations that the AFCS actually couples to.",
        "Approved for day/night VFR and IFR. Maximum glide path angle 9°. Minimum airspeed to engage APP mode for these minima is 45 KIAS, and AFCS IAS mode must be engaged below 50 KIAS. Maximum ROD approaching the missed approach point is 900 fpm. Maximum airspeed at DH is 130 KIAS below 5000 ft, reducing 2 kt per 1000 ft above that — and if PWR LIM illuminates on the way down, airspeed must be reduced enough to clear it before reaching DH.",
      ],
    },
    {
      heading: "The annunciation colors",
      paragraphs: [
        "White: the LP or LPV approach loaded correctly and the path is computed with no GNSS failure. Green: the pseudo-localizer deviation has been captured. Amber: a single or dual GNSS sensor used for the approach is degraded or has failed. These are worth reading correctly in real time, since the malfunction procedures below hinge on exactly this annunciation.",
      ],
    },
    {
      heading: "Flying it",
      paragraphs: [
        "Before the FAF: confirm the white LPV or LP advisory, DA(H) set per the approach chart, PERFINIT executed, VNAV phase at CRUISE before the vertical path capture, and TOD correctly computed and shown. Arm NAPP (and NDCL if a deceleration profile is used) on the AFCS panel. If above the FAF altitude, the FMS captures the vertical path in Baro-VNAV down to FAF altitude, then transitions to pseudo-LOC/pseudo-GS guidance inside 2 NM of the FAF.",
        "During final approach: once APP shows green, confirm the LPV or LP annunciation is also green, with the lateral axis transitioning automatically from NAPP to NLOC, and NGS engaged. A missed approach couples automatically on the lateral axis when GA is pressed — the vertical profile still has to be flown manually per the published missed approach altitudes.",
      ],
    },
    {
      heading: "What a GNSS problem actually costs you",
      paragraphs: [
        "A single GNSS RAIM integrity failure, or one SBAS precision-approach channel going to standby, just means continue the approach — redundancy is reduced, not lost (SBAS integrity re-checks every 4 seconds and can recover on its own).",
        "If SBAS precision mode is lost on both GNSS sensors at once, the outcome depends on whether Baro-VNAV minima are available for that approach. If they are, FMS deviations revert automatically to LNAV/VNAV and Baro-VNAV — LPV is replaced by VGP on the PFD — and the approach can continue in coupled mode by pressing APP or DCL again, unless the aircraft is already below 1000 ft AGL, in which case discontinue regardless. If Baro-VNAV minima are not available at all, there's no fallback — discontinue the approach outright.",
      ],
    },
  ],
};

export const AW169_EP_SYSTEM_NOTES: SystemNote[] = [AFCS_EP, PLUS_MODE_EP, AUTOROTATION_PROTECTION_EP, WEATHER_RADAR_SHARED, WEATHER_RADAR_RDR1600_SHARED, TCAS_II_SHARED, HTAWS_EP, SVS_SHARED, DIGITAL_MAP_SHARED, OPLS_SHARED, EVS_CAMERA_SHARED, EHPS_SHARED, ADI_STBY_BATTERY_SHARED, AUTOMATIC_SEARCH_MODES_EP, EXTERNAL_HOIST_SHARED, CARGO_HOOK_SHARED, DITCHING_SHARED, ADELT_SHARED, EAPS_EP, FUEL_TRANSFER_PUMP_SHARED, RNP_APCH_LPV_SHARED];
export const AW169_STANDARD_SYSTEM_NOTES: SystemNote[] = [WEATHER_RADAR_SHARED, WEATHER_RADAR_RDR1600_SHARED, TCAS_II_SHARED, HTAWS_STANDARD, SVS_SHARED, DIGITAL_MAP_SHARED, OPLS_SHARED, EVS_CAMERA_SHARED, EHPS_SHARED, ADI_STBY_BATTERY_SHARED, EXTERNAL_HOIST_SHARED, CARGO_HOOK_SHARED, DITCHING_SHARED, ADELT_SHARED, EAPS_STANDARD, FUEL_TRANSFER_PUMP_SHARED, RNP_APCH_LPV_SHARED];
