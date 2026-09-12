export type RuleGroup = {
  heading?: string;
  bullets: string[];
};

export type RuleTopic = {
  slug: string;
  title: string;
  intro?: string;
  groups: RuleGroup[];
  reference: string;
};

export const VFR_TOPICS: RuleTopic[] = [
  {
    slug: "vmc-minima",
    title: "VMC minima (visibility & cloud clearance)",
    groups: [
      {
        heading: "At or above 3000 ft AMSL, or 1000 ft above terrain (whichever is higher)",
        bullets: [
          "Flight visibility: 8 km at/above FL100; 5 km below FL100.",
          "Distance from cloud: 1500 m horizontally, 300 m (1000 ft) vertically.",
        ],
      },
      {
        heading: "At or below 3000 ft AMSL, or 1000 ft above terrain (whichever is higher)",
        bullets: [
          "Flight visibility: 5 km.",
          "Clear of cloud and in sight of the surface.",
          "Helicopters may be operated in flight visibility down to 800 m (but not less) when flown at a speed that gives adequate opportunity to see other traffic or obstacles in time to avoid a collision.",
        ],
      },
    ],
    reference: "SERA.5001 – VMC visibility and distance from cloud minima",
  },
  {
    slug: "special-vfr",
    title: "Special VFR in control zones",
    groups: [
      {
        bullets: [
          "May be authorized by ATC for a VFR flight within a control zone when weather is below VMC minima.",
          "Ground visibility at least 1500 m (800 m for helicopters); clear of cloud and in sight of the surface.",
          "At night, normally limited to take-off/climb-out or approach/landing only, unless the competent authority permits otherwise.",
          "Subject to ATC clearance and traffic conditions — it is not a right, only a possibility.",
        ],
      },
    ],
    reference: "SERA.5010 – Special VFR in control zones",
  },
  {
    slug: "hems-minima",
    title: "HEMS operating minima",
    intro: "Helicopter Emergency Medical Service (HEMS) approval lets a crew fly to lower weather minima than normal VFR — but the reduction depends on performance class, crew size, and day/night, not a single number.",
    groups: [
      {
        heading: "Performance Class 1/2 — by day",
        bullets: [
          "Two pilots: 500 ft ceiling or above uses normal VFR minima; 400–499 ft needs 1000 m visibility; 300–399 ft (the lowest published band) needs 2000 m visibility.",
          "Single pilot: 500 ft or above uses normal VFR minima; 400–499 ft needs 2000 m visibility; 300–399 ft needs 3000 m — a single pilot needs more visibility than a two-pilot crew at the same height.",
        ],
      },
      {
        heading: "Performance Class 1/2 — by night",
        bullets: [
          "Cloud base: 1200 ft minimum.",
          "Visibility: 2500–3000 m with NVIS; without NVIS the required visibility is higher (up to 5000 m) — check the operator's approved table for the exact figure, since it depends on equipment and approval.",
        ],
      },
      {
        heading: "Performance Class 3",
        bullets: [
          "Dispatch and en-route: 600 ft ceiling, 1500 m visibility.",
          "En-route only, for short periods, in sight of land, at a speed allowing obstacles to be seen in time to avoid them: reducible to 1000 ft ceiling, or 800 m visibility.",
        ],
      },
      {
        heading: "If weather falls below minima en-route",
        bullets: [
          "A VFR-only certified helicopter must abandon the flight or return to base — there is no other option.",
          "An IMC-equipped helicopter with a suitably qualified crew may instead convert the flight to IFR, in addition to those two options.",
        ],
      },
    ],
    reference: "EASA Air Ops – SPA.HEMS.120 – HEMS operating minima",
  },
  {
    slug: "vfr-cruising-levels",
    title: "VFR cruising levels (semicircular rule)",
    groups: [
      {
        bullets: [
          "Applies above 3000 ft AMSL (or the applicable transition altitude, if higher) when a cruising level is required.",
          "Track 000°–179° (magnetic): odd flight level/altitude + 500 ft (e.g. FL035, FL055, 3500 ft, 5500 ft).",
          "Track 180°–359° (magnetic): even flight level/altitude + 500 ft (e.g. FL045, FL065, 4500 ft, 6500 ft).",
          "The +500 ft offset from IFR levels is what keeps VFR traffic vertically separated from IFR traffic on the same semicircular scheme.",
          "Unlike for IFR, compliance with the VFR cruising level table outside controlled airspace is good practice but is not itself mandatory — always follow any ATC instruction or established traffic pattern first.",
        ],
      },
    ],
    reference: "SERA.5015 / SERA.5025 – Table of cruising levels",
  },
  {
    slug: "airspace-special-areas",
    title: "Aerodrome traffic zones & prohibited/restricted/danger areas",
    groups: [
      {
        heading: "Aerodrome Traffic Zone (ATZ)",
        bullets: [
          "Protects traffic near an aerodrome; vertical extent from the surface up to 2000 ft.",
          "Radius centred on the mid-point of the longest runway: 2 nm if that runway is up to 1850 m long, 2.5 nm if longer (check the AIP for the exact local dimensions).",
          "Active only during notified hours of watch, and has the same airspace status as the surrounding airspace outside those hours.",
          "You may not enter an ATZ without permission from the relevant ATS unit — even outside notified hours, there may still be traffic.",
        ],
      },
      {
        heading: "Prohibited, restricted & danger areas",
        bullets: [
          "Prohibited area: flight is prohibited within specified limits.",
          "Restricted area: flight is restricted, subject to specified conditions.",
          "Danger area: hazardous activity may be occurring — flight through is not itself prohibited, but is inadvisable without checking activity status first.",
        ],
      },
    ],
    reference: "ICAO Annex 11 / national AIP – Airspace and special-use areas",
  },
  {
    slug: "notam-basics",
    title: "NOTAM basics",
    groups: [
      {
        bullets: [
          "A NOTAM (Notice to Airmen) is a warning about anything temporary, or issued too late to be charted, that could affect a flight — e.g. navaid outages, runway/lighting closures, temporary danger areas.",
          "NOTAMs don't amend the AIP, but they can override or supplement what it says (e.g. a temporary change to a permanent danger area's hours).",
          "Category letter: N = new NOTAM, R = replacing an earlier one, C = cancelling one.",
          "Standard fields: A) location/FIR, B) start date/time (UTC), C) end date/time (UTC, \"EST\" = estimated, remains active until cancelled/replaced), E) the free-text NOTAM content in ICAO abbreviations.",
          "Always check current NOTAMs as part of flight preparation, in addition to charts and the AIP.",
        ],
      },
    ],
    reference: "ICAO Annex 15 – Aeronautical Information Services",
  },
  {
    slug: "minimum-heights",
    title: "Minimum heights for VFR flight",
    groups: [
      {
        bullets: [
          "Over congested areas of cities, towns or settlements: not below 300 m (1000 ft) above the highest obstacle within 600 m of the aircraft.",
          "Elsewhere: not below 150 m (500 ft) above the ground or water, except when necessary for take-off or landing.",
          "Helicopters may be operated at lower heights than the fixed-wing minima above, provided this is done safely and in accordance with the applicable operating rules and any local restrictions.",
        ],
      },
    ],
    reference: "SERA.5005(f)/(g) – Minimum heights",
  },
  {
    slug: "right-of-way",
    title: "Right-of-way rules",
    groups: [
      {
        bullets: [
          "Converging at approximately the same level: the aircraft that has the other on its right gives way.",
          "Head-on or approximately so: both aircraft alter course to the right.",
          "Overtaking: the overtaken aircraft has right of way; the overtaking aircraft alters course to the right and keeps clear until well past and clear.",
          "An aircraft that must give way shall avoid passing over, under, or crossing ahead of the other aircraft, unless well clear.",
          "General priority order: airships give way to nothing powered listed below them; power-driven heavier-than-air aircraft give way to airships, gliders and balloons; all give way to aircraft that are towing or being towed.",
          "An aircraft aware that another is compelled to land has priority and shall give way.",
        ],
      },
    ],
    reference: "SERA.3201–SERA.3210 – Right of way",
  },
  {
    slug: "light-signals",
    title: "Light signals from the control tower",
    groups: [
      {
        heading: "To aircraft in flight",
        bullets: [
          "Steady green: cleared to land.",
          "Flashing green: return for landing (expect a landing clearance).",
          "Steady red: give way to other aircraft and continue circling.",
          "Flashing red: aerodrome unsafe — do not land.",
          "Flashing white: land at this aerodrome and proceed to the apron.",
          "Series of red pyrotechnic lights: notwithstanding any previous instructions, do not land for the time being.",
        ],
      },
      {
        heading: "To aircraft on the ground",
        bullets: [
          "Steady green: cleared for take-off.",
          "Flashing green: cleared to taxi.",
          "Steady red: stop.",
          "Flashing red: taxi clear of the landing area in use.",
          "Flashing white: return to the starting point on the aerodrome.",
        ],
      },
    ],
    reference: "SERA Appendix 1 – Signals",
  },
  {
    slug: "airspace-classes",
    title: "Airspace classes (A–G) overview",
    groups: [
      {
        bullets: [
          "Class A: IFR only. ATC clearance required. Separated from all other traffic.",
          "Class B: IFR & VFR. ATC clearance required. Separated from all other traffic.",
          "Class C: IFR & VFR. ATC clearance required. IFR separated from IFR and VFR; VFR separated from IFR and given traffic information on other VFR flights.",
          "Class D: IFR & VFR. ATC clearance required. IFR separated from IFR, traffic information on VFR flights; VFR flights get traffic information only.",
          "Class E: IFR & VFR. ATC clearance required for IFR only. IFR separated from IFR, traffic information as far as practical; no clearance needed for VFR.",
          "Class F: IFR & VFR. Air traffic advisory service for IFR, traffic information as far as practical; no clearance required.",
          "Class G: IFR & VFR. Flight information service only; no clearance and no separation service provided.",
        ],
      },
    ],
    reference: "ICAO Annex 11 / SERA – Airspace classification",
  },
  {
    slug: "vfr-flight-plan",
    title: "When a VFR flight plan is required",
    groups: [
      {
        bullets: [
          "Before operating across international borders.",
          "When operating within, into, or along routes/areas designated by the competent authority for flight-plan purposes.",
          "When search and rescue (SAR) alerting service may need to be triggered for the flight.",
          "At night, or when operating outside sight of the surface, per local/State requirements.",
          "When departing from an aerodrome without ATC where local procedures require notifying a flight plan or booking-out.",
          "Even when not mandatory, filing or notifying a flight plan is good practice for SAR alerting on any flight over remote or offshore terrain.",
        ],
      },
    ],
    reference: "SERA.4001 – Submission of a flight plan",
  },
];

export const IFR_TOPICS: RuleTopic[] = [
  {
    slug: "ifr-cruising-levels",
    title: "IFR cruising levels (semicircular rule)",
    groups: [
      {
        bullets: [
          "Track 000°–179° (magnetic): odd flight level/altitude (FL010, FL030, FL050… / 1000, 3000, 5000 ft).",
          "Track 180°–359° (magnetic): even flight level/altitude (FL020, FL040, FL060… / 2000, 4000, 6000 ft).",
          "Above the applicable transition altitude, levels are flown and reported as flight levels; at or below it, as altitudes on QNH.",
        ],
      },
      {
        heading: "En-route minimum altitude (no published MEA/MOCA)",
        bullets: [
          "Over high terrain or in mountainous areas: at least 2000 ft above the highest obstacle within 8 km of the aircraft's estimated position.",
          "Elsewhere: at least 1000 ft above the highest obstacle within 8 km of the estimated position.",
          "Both figures assume normal navigational accuracy for the conditions — add margin if position uncertainty is greater than usual.",
        ],
      },
    ],
    reference: "SERA.5015 / ICAO Annex 2 – Cruising levels and minimum altitude",
  },
  {
    slug: "ifr-vfr-change",
    title: "Changing between IFR and VFR",
    groups: [
      {
        heading: "Cancelling IFR (going to VFR)",
        bullets: [
          "Only valid when the PIC transmits the specific phrase \"Cancelling my IFR flight\", together with any necessary changes to the current flight plan, to an ATS unit.",
          "ATC does not invite this change, directly or by implication — it is the pilot's decision alone.",
          "ATC's only expected reply is an acknowledgement such as \"IFR flight cancelled at (time)\".",
          "The ATS unit that receives the cancellation informs all other units the IFR flight plan was addressed to, except any it has already flown past.",
        ],
      },
      {
        heading: "Changing from VFR to IFR",
        bullets: [
          "If a flight plan was already filed, submit the necessary changes to it before or as you make the change.",
          "Within controlled airspace: fly the IFR semicircular cruising levels (SERA.5020).",
          "Outside controlled airspace, above 3000 ft AMSL or the transition altitude (whichever is higher): also fly a semicircular level appropriate to track, using 1013.25 hPa unless the competent authority requires otherwise (SERA.5025).",
        ],
      },
    ],
    reference: "ICAO Doc 4444 (PANS-ATM) 4.8 / SERA.5020–5025",
  },
  {
    slug: "transition-altitude-level",
    title: "Transition altitude & transition level",
    groups: [
      {
        bullets: [
          "Transition altitude: the altitude at or below which vertical position is given as an altitude (QNH).",
          "Transition level: the lowest flight level available for use above the transition altitude (reference pressure 1013.2 hPa).",
          "Climbing through the transition altitude: set 1013.2 hPa and report subsequent levels as flight levels.",
          "Descending through the transition level: set QNH (or QFE if used locally) and report as altitude/height.",
          "The transition altitude is published per aerodrome or FIR and varies by State — do not assume a fixed value.",
        ],
      },
    ],
    reference: "ICAO Annex 2 / SERA – Transition altitude and level",
  },
  {
    slug: "alternate-aerodromes",
    title: "Alternate aerodrome requirements",
    groups: [
      {
        heading: "Destination alternate — when one is required",
        bullets: [
          "Required unless destination weather is forecast to remain at or above planning minima around the ETA, the destination has an instrument approach procedure (or is otherwise suitable), and no other operational reason requires one.",
          "To be used as an alternate, forecast weather at the destination alternate must be at or above the applicable alternate minima (see below) at the estimated time of use.",
        ],
      },
      {
        heading: "When TWO destination alternates are required",
        bullets: [
          "One alternate is normally enough. A second destination alternate is required when either: the forecast weather cannot be shown to meet the safety margin/planning minima at ETA with confidence, or no meteorological information at all is available for the selected alternate.",
          "In practice, this means: good, confidently-forecast weather at one solid alternate → one alternate is fine. Marginal, uncertain, or missing weather information → plan two, so there is still a valid option if the first one turns out to be unusable.",
        ],
      },
      {
        heading: "How alternate minima are calculated (the margin above landing minima)",
        bullets: [
          "An alternate must show better weather than a straightforward landing minima — it needs its own, stricter \"alternate minima\", since there's no second attempt if it also turns out unusable.",
          "Precision approach (e.g. ILS): add 200 ft to the DA/H, and add 800 m to the RVR/visibility, on top of the approach's normal published minima.",
          "Non-precision approach or circling: add 400 ft to the MDA/H, and add 1500 m to the RVR/visibility, on top of the approach's normal published minima.",
          "These margins apply whether checking a destination alternate or a take-off alternate — the aerodrome only counts as usable if the forecast clears the raised bar, not just the normal landing minima.",
        ],
      },
      {
        heading: "The forecast time window: 1 hour before to 1 hour after ETA",
        bullets: [
          "An aerodrome may only be selected as an alternate (destination or take-off) when the weather reports/forecasts show conditions at or above the applicable minima throughout a window starting 1 hour before and ending 1 hour after the estimated time of arrival there — not just at the single ETA instant.",
          "A forecast that only clears minima for part of that 2-hour window does not qualify the aerodrome as usable.",
        ],
      },
      {
        heading: "Take-off alternate",
        bullets: [
          "Required when weather at the departure aerodrome is below the applicable landing minima, or when it would otherwise not be possible to return there.",
          "For helicopters, normally selected within a limited distance or flight time of the departure point, as defined in the operator's operations manual.",
          "Judged against the same raised alternate minima (see above), not the normal landing minima.",
        ],
      },
      {
        heading: "Take-off minima — the RVR floor",
        bullets: [
          "Below 550 m RVR, a departure counts as a Low Visibility Take-Off (LVTO) and needs the applicable LVTO procedures.",
          "Below 400 m RVR specifically, a specific LVTO approval (beyond standard IFR authorization) is required before departure is permitted at all — this is the hard floor without that extra approval.",
        ],
      },
      {
        heading: "Isolated aerodrome",
        bullets: [
          "A destination with no suitable alternate is treated as an isolated aerodrome for fuel planning purposes.",
          "Instead of standard alternate fuel, extra fuel is carried to cover a defined additional holding/diversion contingency.",
        ],
      },
      {
        heading: "Coastal aerodrome as an offshore alternate (helicopter-specific)",
        bullets: [
          "A coastal aerodrome can only be nominated as a reduced-fuel offshore alternate if it's within 5 NM of the coastline.",
          "It must also be reachable, within the rules of the air, either 500 ft AGL inbound from the coast or via an agreed route, landing under VFR.",
          "Day landing forecast floor: cloud base at least 400 ft above DH/MDH and 4 km visibility — or 600 ft/4 km if the descent to visual is planned over the sea.",
          "Night landing forecast floor: cloud base 1000 ft and visibility 5 km.",
          "Fuel must be enough that, at any point after crossing the coastline, the helicopter can still return to the coast, descend safely, and complete a VFR approach and landing with VFR reserves intact.",
        ],
      },
      {
        heading: "Quick numbers recap",
        bullets: [
          "Precision alternate minima: DA/H +200 ft, RVR/VIS +800 m.",
          "Non-precision/circling alternate minima: MDA/H +400 ft, RVR/VIS +1500 m.",
          "Forecast window for any alternate: ETA −1 h to ETA +1 h.",
          "LVTO applies: below 550 m RVR.",
          "LVTO needs specific approval: below 400 m RVR.",
          "Two destination alternates needed: forecast doesn't meet margin at ETA, or no met info for the one alternate.",
          "Coastal offshore alternate: within 5 NM of the coastline, day 400 ft/4 km (600 ft/4 km over-sea descent), night 1000 ft/5 km.",
        ],
      },
    ],
    reference: "EASA Air Ops – Part-NCC/SPA/CAT.OP.MPA.181/182, SPA.HOFO.100 – Alternate aerodrome selection, alternate minima, fuel policy & coastal aerodrome criteria",
  },
  {
    slug: "fuel-planning",
    title: "IFR fuel planning (reserves)",
    groups: [
      {
        bullets: [
          "Trip fuel: fuel from start of taxi to landing at the destination.",
          "Contingency fuel: covers deviations from the planned operation (e.g. wind, routing changes).",
          "Alternate fuel: fuel to fly a missed approach at the destination, climb, route to, and approach/land at the alternate (when one is required).",
          "Final reserve fuel: fuel for a specified holding time at 1500 ft above the alternate (or destination) elevation in standard conditions — 20 minutes for helicopters under EASA rules (aeroplanes use 30 minutes).",
          "Additional/extra fuel: any further fuel the commander judges necessary (isolated aerodrome, extended holding, etc.).",
          "Declare \"MINIMUM FUEL\" to ATC if usable fuel is expected to be less than final reserve on landing; declare a fuel emergency (\"MAYDAY MAYDAY MAYDAY FUEL\") if it will be, or already is, below final reserve.",
        ],
      },
    ],
    reference: "EASA Air Ops – CAT.OP.MPA.150 / NCC.OP – Fuel policy",
  },
  {
    slug: "holding-procedures",
    title: "Holding procedures",
    groups: [
      {
        bullets: [
          "Standard holding pattern uses right-hand turns unless the published procedure or ATC specifies left-hand turns.",
          "Standard bank angle: 25°, or the rate giving a 3°/second turn, whichever requires the lesser bank.",
          "Outbound leg timing: 1 minute at or below 14 000 ft; 1.5 minutes above 14 000 ft.",
          "Entry technique (direct, teardrop, or parallel/offset) depends on the aircraft's inbound heading relative to the holding course.",
          "Maintain the last assigned altitude/level and the speed limit for the aircraft category unless otherwise cleared by ATC.",
          "A holding clearance normally specifies: the fix, direction to hold from it, inbound track, DME distances (if holding on DME), the altitude/level to maintain, and an Expect Further Clearance (EFC) or Expect Approach Clearance (EAC) time.",
          "\"Shuttling\" — climbing or descending in a hold-like pattern — is used in mountainous terrain, when a descent of more than 2000 ft is needed on an initial/intermediate segment, or when required descent rates exceed normal racetrack/reversal design limits.",
          "If no further clearance arrives, hold on the inbound track at your last cleared point until the EFC/EAC time, using right-hand turns unless published otherwise; if you can't reach ATC, apply the communication-failure procedure.",
        ],
      },
    ],
    reference: "ICAO Doc 8168 (PANS-OPS) – Holding procedures",
  },
  {
    slug: "sid-departure-design",
    title: "Standard Instrument Departure (SID) design — and the default climb gradient if none is published",
    intro: "A SID is a charted departure route built to keep you clear of obstacles from lift-off into the en-route structure, on the assumption you climb at or above the procedure's climb gradient. If no gradient is charted, don't reach for the fixed-wing 3.3% figure — it doesn't apply to helicopters.",
    groups: [
      {
        heading: "Default helicopter departure design values (if nothing is published)",
        bullets: [
          "Procedure Design Gradient (PDG): 5.0% minimum for helicopters, vs 3.3% for aeroplanes — the designer uses whichever is higher: 5%, or the gradient actually needed to clear obstacles.",
          "Obstacle Identification Surface (OIS) gradient: 4.2% for helicopters, vs 2.5% for aeroplanes — obstacles must not penetrate this surface for the procedure to stand without extra restriction.",
          "Minimum height for a turn above the FATO/departure end: 90 m (295 ft) for helicopters, vs 120 m for aeroplanes.",
          "Minimum obstacle clearance (MOC) margin while turning: 65 m for helicopters, vs 75 m for aeroplanes.",
        ],
      },
      {
        heading: "What this means in practice",
        bullets: [
          "5% is roughly 300 ft/NM — noticeably steeper than the 3.3% (about 200 ft/NM) most pilots have heard quoted as 'the' PANS-OPS default; that number was never the helicopter one.",
          "A published gradient steeper than 5% on a helicopter SID means the terrain or obstacles genuinely require it — treat it as a hard performance requirement, not a suggestion.",
          "If a procedure is shared between aeroplanes and helicopters, check which criteria set built it: the helicopter minimum may already be baked in, or a separate helicopter note may apply a different gradient.",
        ],
      },
    ],
    reference: "ICAO Doc 8168 (PANS-OPS) – Cat H departure procedure design criteria, compared with Cat A/B/C/D (fixed-wing)",
  },
  {
    slug: "performance-classes",
    title: "Helicopter Performance Classes (1/2/3) — what the numbers mean for you",
    groups: [
      {
        heading: "Performance Class 1 (PC1)",
        bullets: [
          "Guarantees either a safe rejected takeoff or a safe continued takeoff after a critical engine failure at any point — no exposure gap.",
          "Takeoff Decision Point (TDP) / Landing Decision Point (LDP): the defined height/speed point that splits 'reject' from 'continue' after an engine failure.",
          "Needs an approved Category A takeoff/landing profile and, normally, a heliport or site meeting the Performance Class 1 obstacle environment.",
        ],
      },
      {
        heading: "Performance Class 2 (PC2)",
        bullets: [
          "Uses Defined Point After Takeoff (DPATO) and Defined Point Before Landing (DPBL) instead of TDP/LDP.",
          "'Exposure': a brief period, typically low and slow just after lift-off or just before touchdown, where a critical engine failure is not guaranteed to allow either a safe reject or a safe continuation — accepted as a limited, defined risk rather than eliminated.",
        ],
      },
      {
        heading: "Performance Class 3 (PC3)",
        bullets: [
          "Single-engine logic: obstacle clearance is only guaranteed with all engines operating (AEO). An engine failure at any point may require an immediate forced landing.",
          "Applies to genuinely single-engine helicopters, and to twins operated in PC3 (e.g. some single-pilot VFR operations) where PC1/2 performance isn't being used.",
        ],
      },
      {
        heading: "The 35 ft number, and what counts as an obstacle",
        bullets: [
          "Category A takeoff/landing profiles are built around at least 35 ft (10.7 m) vertical clearance above the takeoff surface (or the highest obstacle in the takeoff distance required) at the profile's reference point.",
          "An obstacle counts as 'in the path' of the helicopter if it's within 30 m, or 1.5× the helicopter's maximum dimension, of the intended flight track — whichever of those two distances is greater.",
        ],
      },
    ],
    reference: "EASA Air Ops – CAT.POL.H.305/310/315 – Helicopter performance classes",
  },
  {
    slug: "circling-approach",
    title: "Circling approach (visual manoeuvring)",
    groups: [
      {
        bullets: [
          "An extension to an instrument approach: visually manoeuvring to land on a runway other than the one the approach was flown to, or the same runway when a straight-in isn't possible (offset more than 30°).",
          "The circling area is built from arcs drawn off each runway threshold joined by tangents, sized for aircraft category, speed, a 25 kt wind assumption, and an average 20° (or Rate 1, whichever is less) bank angle.",
          "If you need more than 30° of bank to stay within the circling area, go around and set up again rather than tightening the turn.",
          "Circling minima are expressed as visibility, not RVR, and are limiting for approach-ban purposes whenever circling is required.",
          "Fly slightly above the MDA (about 50 ft) while circling, but remember you are still below a normal visual circuit height — and configure for the missed approach before reaching MDA, since the whole point of circling is that the weather is marginal.",
          "If not published, a circling height can be approximated as 300 ft above the highest obstacle within 5 NM of the aerodrome (provided that is at least 500 ft AGL); a rough circling visibility in metres is your circuit speed in knots × 20.",
          "Losing visual reference at any point means an immediate missed approach: initial turn toward the landing runway, then establish on the published missed approach track.",
        ],
      },
    ],
    reference: "ICAO Doc 8168 (PANS-OPS) Vol I, Part I, Section 4, Ch. 7 – Circling approach",
  },
  {
    slug: "rnav-rnp-approaches",
    title: "RNAV/RNP approaches (LNAV, LNAV/VNAV, LP, LPV) — what's the difference?",
    intro: "All four are flown off the same charted RNP APCH procedure, but they differ in what guidance they give you and what equipment that requires. The chart normally publishes minima for several of them on the same plate — always fly to the line that matches what your avionics are actually giving you, not the lowest one printed.",
    groups: [
      {
        heading: "LNAV — lateral only, GPS",
        bullets: [
          "Guidance: lateral (course) only, from basic GPS. No electronic vertical guidance.",
          "Dimension: 2D non-precision approach.",
          "Minima type: MDA/MDH — a floor you may level off at and continue toward the runway.",
          "Equipment: any basic IFR GPS with an RNP APCH-capable database; the most widely usable of the four.",
        ],
      },
      {
        heading: "LNAV/VNAV — lateral GPS + certified vertical (\"APV Baro\")",
        bullets: [
          "Guidance: lateral from GPS, vertical from certified barometric VNAV (or SBAS where available).",
          "Dimension: 3D approach — flown as a continuous descent, like an ILS.",
          "Minima type: DA/DH — a single go/no-go point, not a floor.",
          "Equipment: needs a certified BaroVNAV (or SBAS) capability, not just basic GPS; usable only within the aerodrome's promulgated temperature range, since cold temperatures distort barometric altitude.",
        ],
      },
      {
        heading: "LP — lateral only, GPS + SBAS",
        bullets: [
          "Guidance: lateral only, but from GPS augmented by SBAS (e.g. EGNOS in Europe, WAAS in the US) instead of basic GPS.",
          "Dimension: 2D non-precision approach, same as LNAV.",
          "Minima type: MDA/MDH.",
          "Equipment: needs an SBAS-capable receiver; more laterally precise than plain LNAV, but still no vertical guidance — used where terrain/obstacles make publishing a vertical path (LPV) impractical.",
        ],
      },
      {
        heading: "LPV — lateral + vertical, GPS + SBAS (\"APV SBAS\")",
        bullets: [
          "Guidance: both lateral and vertical from GPS + SBAS.",
          "Dimension: 3D approach, flown like an ILS, down to a DA/DH.",
          "Minima type: DA/DH, often close to Cat I ILS minima at equipped runways.",
          "Equipment: needs an SBAS-capable receiver and a FAS (Final Approach Segment) data block; not usable with a basic GPS receiver that lacks SBAS.",
        ],
      },
      {
        heading: "In practice",
        bullets: [
          "Rough precision/capability order: LNAV (least precise, most widely available) → LP → LNAV/VNAV → LPV (most precise, needs the most capable avionics).",
          "The approach must be selected and flown exactly as published from the aircraft's navigation database — if a required waypoint is missing, revert to LNAV or a conventional navaid approach if available, rather than improvising.",
          "Correct altimeter setting is critical for LNAV/VNAV (BaroVNAV) and for reading LNAV minima correctly — it is not needed for the vertical path itself on LPV, which is SBAS/GPS-based.",
        ],
      },
    ],
    reference: "ICAO Doc 9613 (PBN Manual) / EASA AMC20-27, 28 – RNP APCH approach types",
  },
  {
    slug: "pins-approach",
    title: "Helicopter Point-in-Space (PinS) approaches & departures",
    intro: "PinS is how a helicopter flies an instrument procedure to a site with no runway at all — a heliport, an offshore installation, a hospital pad. The instrument segment ends at a Missed Approach Point (MAPt) that isn't the landing site itself; from there you either land straight-in if visual, or are instructed to 'proceed VFR'/'proceed visually' the rest of the way under a defined, reduced set of VFR minima.",
    groups: [
      {
        heading: "How it's built",
        bullets: [
          "Instrument segment flown like any other approach, down to a DA (LPV-style, 3D) or MDA (LNAV-style, 2D) at the MAPt — which can sit away from the landing site, unlike a runway approach.",
          "Initial approach segment: maximum length 10 NM; the IAF is built within 25 NM of the Procedure Reference Point (PRP). Optimum descent gradient 6.5%, maximum 10%.",
          "Intermediate approach segment: minimum 2 NM, optimum 3 NM, maximum 10 NM, same 6.5%/10% gradient limits. Maximum turn at the FAF is 60° — some avionics won't arm approach mode automatically above a 30° track change there, so brief it if needed.",
        ],
      },
      {
        heading: "'Proceed VFR' — reduced minima by day",
        bullets: [
          "x is the distance from the MAPt to the heliport/operating site (approach), or from the site to the Initial Departure Fix, IDF (departure).",
          "x < 1000 m: visibility 1000 m; ceiling MDH or 300 ft, whichever is higher.",
          "1000 m ≤ x ≤ 3000 m: visibility = x, or 1500 m, whichever is lower; ceiling MDH or 400 ft.",
          "3000 m < x ≤ 5000 m: visibility 1500 m; ceiling MDH or 600 ft.",
          "At x ≥ 5000 m, normal SERA VFR minima apply instead — this reduced table only exists for the last 5 km.",
        ],
      },
      {
        heading: "'Proceed VFR' — reduced minima by night",
        bullets: [
          "x < 1000 m: visibility 2000 m; ceiling MDH or 600 ft.",
          "1000 m ≤ x ≤ 3000 m: visibility = x + 1000 m; ceiling MDH + 200 ft, or 600 ft, whichever is higher.",
          "3000 m < x ≤ 5000 m: visibility 5000 m; ceiling MDH + 200 ft, or 600 ft, whichever is higher.",
        ],
      },
      {
        heading: "Crew requirements to use the reduced minima",
        bullets: [
          "Commander: at least 1000 hours total helicopter flying time, including 100 hours of instrument time on helicopters.",
          "Initial and yearly recurrent simulator training must cover a 3D approach to minima, a 2D approach to minima, a go-around on instruments, and at least one PinS approach followed by a transition to VFR and a VFR landing.",
        ],
      },
    ],
    reference: "EASA Air Ops – AMC1 SPA.PINS-VFR.100 – Helicopter point-in-space approaches and departures with reduced VFR minima",
  },
  {
    slug: "offshore-ara-osap",
    title: "Offshore approaches (ARA / OSAP)",
    intro: "An Airborne Radar Approach (ARA), or an OEM-certified Offshore Standard Approach Procedure (OSAP), is how a helicopter flies an instrument approach to a moving or fixed offshore installation with no ground-based navaid at all — built entirely from the aircraft's own radar/GNSS picture of the target.",
    groups: [
      {
        heading: "The final segment",
        bullets: [
          "Maximum descent angle: 4°; up to 6° is acceptable only if groundspeed is reduced to 60 kt.",
          "The segment from the MAPt to the destination must never be flown with a tailwind — the approach course has to be selectable to avoid it.",
          "Maximum acceptable offset angle between the final inbound course and the installation: 30°.",
        ],
      },
      {
        heading: "Minimum descent height/altitude (MDH/MDA)",
        bullets: [
          "Never lower than 50 ft above the helideck's elevation, whatever else the calculation gives.",
          "Straight-in approach: not lower than 200 ft by day, 300 ft by night.",
          "Approach leading to a circling manoeuvre: not lower than 300 ft by day, 500 ft by night.",
          "Single-pilot ARA: add 100 ft to the calculated MDA/H.",
          "MDA (rather than MDH) may only be used if the radio altimeter is unserviceable, and must then be at least MDH + 200 ft.",
        ],
      },
      {
        heading: "Decision range & navigation performance",
        bullets: [
          "Decision range: not less than 1 NM — or not less than 0.75 NM specifically if groundspeed at the MAPt is 80 kt or less.",
          "Lateral guidance: at least RNP 0.3 NM performance monitoring/alerting up to the MAPt, then RNP 1.0 NM to the missed approach holding point.",
        ],
      },
      {
        heading: "If the radar picture isn't clear",
        bullets: [
          "Before the final approach, confirm a clear radar path exists for both the final and missed approach segments.",
          "If lateral clearance from any obstacle is less than the required navigation performance: either approach a nearby clear structure first and proceed visually to the destination, or fly the approach from a different direction using a circling manoeuvre instead.",
        ],
      },
      {
        heading: "Coastal aerodrome fuel planning (a related offshore number)",
        bullets: [
          "A coastal aerodrome nominated for reduced offshore alternate requirements must be within 5 NM of the coastline.",
          "Day landing forecast floor: cloud base at least 400 ft above DH/MDH and 4 km visibility — or 600 ft/4 km if the descent to visual is planned over the sea.",
          "Night landing forecast floor: cloud base 1000 ft and visibility 5 km.",
        ],
      },
    ],
    reference: "EASA Air Ops – AMC1/AMC2 SPA.HOFO.125 – Airborne radar approach & offshore standard approach procedures",
  },
  {
    slug: "approach-ban-rvr",
    title: "Approach ban & RVR/visibility minima",
    groups: [
      {
        bullets: [
          "The \"approach ban\" prohibits continuing an approach past the final approach fix (or below 1000 ft AAL if there is none) when the reported RVR/visibility is below the minimum published for that procedure.",
          "If RVR/visibility is at or above minima at that point, the approach may be continued even if conditions later deteriorate, down to the applicable decision point.",
          "Minima are published per approach type and category, and depend on approach lighting, runway markings, and aircraft approach category.",
        ],
      },
    ],
    reference: "EASA Air Ops – Part-CAT/NCC.OP – Approach ban",
  },
  {
    slug: "lvto-helicopters",
    title: "Low-Visibility Takeoff (LVTO) for helicopters",
    groups: [
      {
        heading: "When it applies",
        bullets: [
          "A takeoff counts as 'normal' at or above 550 m RVR; below that, it's an LVTO and needs LVTO procedures.",
          "Below 400 m RVR specifically requires a dedicated LVTO approval beyond standard IFR authorization — the hard floor without it.",
        ],
      },
      {
        heading: "Onshore RVR floor by facility",
        bullets: [
          "No lights, no markings, by day only: 250 m, or the rejected-takeoff distance, whichever is greater.",
          "No markings, at night: 800 m.",
          "Runway/FATO edge lights + centreline marking: 200 m.",
          "Runway/FATO edge lights + centreline marking + RVR reporting available: 150 m.",
        ],
      },
      {
        heading: "Offshore helideck",
        bullets: [
          "Two-pilot operations: 250 m RVR.",
          "Single-pilot operations: 500 m RVR.",
          "Both figures only apply when the takeoff flight path is free of obstacles.",
        ],
      },
      {
        heading: "PinS departure to an Initial Departure Fix (IDF)",
        bullets: [
          "Visibility must never be below 800 m, and ceiling never below 250 ft, regardless of the facility-based numbers above.",
        ],
      },
    ],
    reference: "EASA Air Ops – AMC2 SPA.LVO.100(a) – Low-visibility takeoff operations, helicopters",
  },
  {
    slug: "missed-approach",
    title: "Missed approach & obstacle clearance",
    groups: [
      {
        bullets: [
          "Initiate at or before the missed approach point (MAPt), or immediately if the required visual reference is not established or maintained at the decision altitude/height (DA/DH) or minimum descent altitude/height (MDA/MDH).",
          "Missed approach obstacle clearance is normally based on a minimum climb gradient of 2.5% from the MAPt, unless a steeper gradient is published.",
          "Category A helicopters generally benefit from tighter obstacle clearance areas than fixed-wing categories, due to lower approach and missed-approach speeds.",
          "Fly the published missed approach track and altitude/level precisely, unless ATC issues other instructions.",
        ],
      },
      {
        heading: "Cat H (helicopter) design numbers, compared with fixed-wing",
        bullets: [
          "Optimum approach/missed-approach segment gradient: 6.5% for helicopters vs 4% for fixed-wing; maximum 10% vs 8%.",
          "Minimum DME arc radius: 5 NM for helicopters vs 7 NM for fixed-wing.",
          "Lead distance before a turn greater than 70°: 1 NM for helicopters vs 2 NM for fixed-wing.",
          "These tighter helicopter numbers are why a procedure shared with aeroplanes sometimes publishes separate helicopter minima, or a steeper missed-approach gradient than the fixed-wing version of the same approach.",
        ],
      },
    ],
    reference: "ICAO Doc 8168 (PANS-OPS) – Missed approach criteria, incl. Cat H helicopter design values",
  },
  {
    slug: "ils-glideslope",
    title: "ILS glideslope, localizer & DA/DH",
    groups: [
      {
        heading: "Glideslope",
        bullets: [
          "Standard/nominal ILS glideslope angle: 3° above horizontal.",
          "Steeper glideslopes (commonly up to about 4°–4.5°, and higher still on some dedicated helicopter or steep/noise-abatement approach procedures) may be published where obstacles or noise abatement require it — always fly the published angle, never assume 3°.",
        ],
      },
      {
        heading: "Localizer",
        bullets: [
          "Provides lateral guidance aligned with the runway centreline.",
          "Course width is designed so that full-scale deflection corresponds to a roughly fixed distance either side of the runway centreline at the threshold — the angular width therefore varies with runway length rather than being one fixed number of degrees for every installation.",
        ],
      },
      {
        heading: "Decision altitude/height (DA/DH)",
        bullets: [
          "The altitude/height on a precision or APV approach at which a missed approach must be initiated if the required visual reference has not been established.",
          "Contrast with MDA/MDH (minimum descent altitude/height), used on non-precision approaches — a floor you may level off at and continue toward, rather than a single go/no-go instant.",
        ],
      },
    ],
    reference: "ICAO Annex 10 / Doc 8168 – ILS characteristics & approach criteria",
  },
  {
    slug: "intercept-angles",
    title: "Intercept angles (radial / localizer / radar vectors)",
    groups: [
      {
        bullets: [
          "Typical practical intercept angle to acquire a VOR radial or airway: about 30°–45°, adjusted for closing speed and distance to the fix.",
          "Procedure design (PANS-OPS) generally keeps the intercept angle onto the final approach course at 30° or less for a stabilized intercept near the final approach fix; larger angles are only used further out, on initial/intermediate segments.",
          "For an ILS localizer, an intercept angle much greater than about 30° close to the runway makes it difficult to establish before the glideslope/final approach fix — ATC radar vectors are normally planned within this guidance.",
          "These are design and technique values, not one fixed legal number in every case — always fly the angle implied by the published procedure or the actual ATC vector given, not a rule of thumb, when the two differ.",
        ],
      },
    ],
    reference: "ICAO Doc 8168 (PANS-OPS) – Instrument approach procedure construction",
  },
  {
    slug: "lost-comms-squawk",
    title: "Lost communications & transponder codes",
    groups: [
      {
        heading: "Transponder codes",
        bullets: [
          "7500: unlawful interference (hijack).",
          "7600: radio communication failure.",
          "7700: general emergency.",
        ],
      },
      {
        heading: "Lost communications (IFR, in controlled airspace)",
        bullets: [
          "Attempt contact on other frequencies, via other aircraft, or by other means; select 7600 on the transponder.",
          "If in VMC: continue in VMC, land at the nearest suitable aerodrome, and report arrival by the most expeditious means.",
          "If in IMC: continue per the flight plan — the route and level last assigned, or if none, as filed — then commence descent/approach at the Expected Approach Time (EAT) if one was given, otherwise at the ETA from the flight plan.",
          "You must land within 30 minutes of that ETA, or the last EAT received, whichever is later.",
          "Squawk 7600 as soon as a communications failure is recognized, so ATC can apply their own lost-comm procedures.",
        ],
      },
      {
        heading: "Expected Approach Time (EAT)",
        bullets: [
          "The time ATC estimates an aircraft delayed by 10 minutes or more can leave the holding fix to begin its approach — not a clearance, but what ATC expects to be able to grant.",
          "Issued when a delay of 10 minutes or more is expected, or an anticipated hold of 30 minutes or more.",
          "A revision of 5 minutes or more from a previously given EAT should be passed to the aircraft as soon as possible.",
        ],
      },
    ],
    reference: "SERA.8020 / ICAO Annex 2 Appendix 2, Doc 4444 §6.5.7 – Communication failure & EAT",
  },
];

export function findTopic(topics: RuleTopic[], slug: string): RuleTopic | undefined {
  return topics.find((t) => t.slug === slug);
}
