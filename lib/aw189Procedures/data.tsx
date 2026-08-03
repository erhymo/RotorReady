import type { ReactNode } from "react";

export type ProcedureStep = {
  left: string;
  right: ReactNode;
};

export type ProcedureGroup = {
  heading?: string;
  steps: ProcedureStep[];
};

export type ProcedureDefinition = {
  slug: string;
  title: string;
  subtitle?: string;
  reference: string;
  intro?: ReactNode;
  cautions?: string[];
  warnings?: string[];
  groups: ProcedureGroup[];
  notes?: string[];
  image?: { src: string; alt: string; caption?: string };
};

export const AW189_PROCEDURES: ProcedureDefinition[] = [
  // ---------------------------------------------------------------------
  // NORMAL PROCEDURES
  // ---------------------------------------------------------------------
  {
    slug: "exterior-check",
    title: "EXTERIOR CHECK",
    subtitle: "Normal procedure",
    reference: "RFM Sect. 2A — External Pre-Flight Checks",
    intro: (
      <>
        The inspection commences at the nose and continues clockwise around the helicopter across seven areas, finishing
        with the cabin and cockpit interior. Check that overboard drains show no leaks, that vents/intakes/outlets and fire
        access points are clear of obstructions, and that all access panels and antennas are secure.
      </>
    ),
    groups: [
      {
        heading: "Before exterior check",
        steps: [{ left: "1", right: <>Main and tail rotor tie-downs — Removed (if present)</> }],
      },
      {
        heading: "Area 1 — Helicopter nose",
        steps: [
          { left: "2", right: <>Nose exterior — Condition</> },
          { left: "3", right: <>Pitot-static probe (left side) — Cover removed, condition and unobstructed</> },
          { left: "4", right: <>Left side brake lines in brake pedal area — Condition/leaks</> },
          { left: "5", right: <>Nose landing gear — Condition, shock strut extension, leaks, tyre pressure</> },
          { left: "6", right: <>Ventilation air intakes (underside of nose) — Unobstructed</> },
          { left: "7", right: <>Nose compartment access door — Latched and secure</> },
          { left: "8", right: <>Pitot-static probe (right side) — Cover removed, condition and unobstructed</> },
          { left: "9", right: <>Right side brake lines in brake pedal area — Condition/leaks</> },
        ],
      },
      {
        heading: "Area 2 — Fuselage, right-hand side",
        steps: [
          { left: "10", right: <>Windshield and roof transparent panel — Condition, cleanliness</> },
          { left: "11", right: <>Windscreen wiper — Condition</> },
          { left: "12", right: <>Fuselage exterior — Condition</> },
          { left: "13", right: <>Pilot cockpit door — Condition, cleanliness, window secure</> },
          { left: "14", right: <>Passenger cabin door — Condition, cleanliness</> },
          { left: "15", right: <>Right side emergency exits — Verify secure</> },
          { left: "16", right: <>Main landing gear — Condition, shock strut extension, leaks, tyre condition and pressure</> },
          { left: "17", right: <>Drains and vent lines — Free of obstructions, no leaks</> },
          { left: "18", right: <>Fuel tank sump area (right side) — No leaks</> },
          { left: "19", right: <>Baggage compartment, tie-down/net — Condition, cargo correctly secure</> },
          { left: "20", right: <>Baggage door — Latches fully engaged (no orange paint visible around handle), door secure</> },
          { left: "21", right: <>Maintenance steps — Condition, closed</> },
          { left: "22", right: <>Engine air intake — Cover removed, clear of damage and obstructions</> },
          { left: "23", right: <>APU fire bottle discharge indicator — Green</> },
          { left: "24", right: <>Engine oil level — Check</> },
          { left: "25", right: <>Engine area — Check for fuel and/or oil leaks</> },
          { left: "26", right: <>Cowling and fairings — Condition and latched</> },
          { left: "27", right: <>Vents and ports — Clear and unobstructed</> },
          { left: "28", right: <>Main rotor components and blades — General condition</> },
          { left: "29", right: <>Engine cowling — Secure</> },
          { left: "30", right: <>Gravity fuel filler cap — Secure</> },
          { left: "31", right: <>Pressure refuel point (if fitted) — Secure, control panel selected OFF</> },
          { left: "32", right: <>Engine exhaust — Cover removed, condition</> },
          { left: "33", right: <>Engine fire bottle discharge indicator — Green</> },
          { left: "34", right: <>APU exhaust — Cover removed, condition</> },
        ],
      },
      {
        heading: "Area 3 — Tail boom, right-hand side",
        steps: [
          { left: "35", right: <>Tail boom exterior — Condition</> },
          { left: "36", right: <>Antennas — Condition</> },
          { left: "37", right: <>Stabilizer — Condition and secure</> },
          { left: "38", right: <>Navigation light — Condition</> },
        ],
      },
      {
        heading: "Area 4 — Fin, intermediate/tail gearbox, tail rotor",
        steps: [
          { left: "39", right: <>Tail fin — Condition</> },
          { left: "40", right: <>Intermediate and tail rotor gearbox — Check for leaks</> },
          { left: "41", right: <>Vents and ports — Clear and unobstructed</> },
          { left: "42", right: <>Tail navigation and anticollision lights — Condition</> },
          { left: "43", right: <>Tail rotor hub and blades — Condition, cleanliness</> },
          { left: "44", right: <>Tail rotor pitch change mechanism — Condition</> },
        ],
      },
      {
        heading: "Area 5 — Tail boom, left-hand side",
        steps: [
          { left: "45", right: <>Stabilizer — Condition and secure</> },
          { left: "46", right: <>Navigation light — Condition</> },
          { left: "47", right: <>Tail boom exterior — Condition</> },
          { left: "48", right: <>Tail rotor drive shaft cover — Secure</> },
          { left: "49", right: <>Antennas — Condition</> },
        ],
      },
      {
        heading: "Area 6 — Fuselage, left-hand side",
        steps: [
          { left: "50", right: <>Fuselage exterior — Condition</> },
          { left: "51", right: <>Engine fire bottle discharge indicator — Green</> },
          { left: "52", right: <>Engine exhaust — Cover removed, condition</> },
          { left: "53", right: <>Baggage compartment, tie-down/net — Condition, cargo correctly secure</> },
          { left: "54", right: <>Baggage door — Latches fully engaged (no orange paint visible around handle), door secure</> },
          { left: "55", right: <>Engine area — Check for fuel and/or oil leaks</> },
          { left: "56", right: <>Engine oil level — Check</> },
          { left: "57", right: <>Engine air intake — Cover removed, clear of damage and obstructions</> },
          { left: "58", right: <>Engine cowling — Secure</> },
          { left: "59", right: <>Vents and ports — Clear and unobstructed</> },
          { left: "60", right: <>Main rotor components and blades — General condition</> },
          { left: "61", right: <>Gravity fuel filler cap — Secure</> },
          { left: "62", right: <>Maintenance steps — Condition, closed</> },
          { left: "63", right: <>Left side emergency exits — Confirm secure</> },
          { left: "64", right: <>Drains and vent lines — Free of obstructions, no leaks</> },
          { left: "65", right: <>Fuel tank sump area (left side) — No leaks</> },
          { left: "66", right: <>Main landing gear — Condition, shock strut extension, leaks, tyre condition and pressure</> },
          { left: "67", right: <>Passenger cabin door — Condition, cleanliness</> },
          { left: "68", right: <>Cowling and fairings — Condition and latched</> },
          { left: "69", right: <>Co-pilot cockpit door — Condition, cleanliness, window secure</> },
          { left: "70", right: <>Windshield and roof transparent panel — Condition and cleanliness</> },
          { left: "71", right: <>Windscreen wiper — Condition</> },
        ],
      },
      {
        heading: "Area 7 — Cabin and cockpit interior",
        steps: [
          { left: "72", right: <>Passenger emergency exits — Verify secure</> },
          { left: "73", right: <>Cabin interior — Equipment and cargo secure</> },
          { left: "74", right: <>First aid kit — On board</> },
          { left: "75", right: <>Emergency equipment (if any) — Check</> },
          { left: "76", right: <>Cabin fire extinguisher — Secure</> },
          { left: "77", right: <>Passenger seat belts and inertia reels — Condition</> },
          { left: "78", right: <>Passenger doors — Secure</> },
          { left: "79", right: <>Pilot and copilot safety belt and inertia reel — Condition</> },
          { left: "80", right: <>Pilot and copilot seats — Secure</> },
          { left: "81", right: <>Pilot and copilot flight controls — Condition and secure</> },
          { left: "82", right: <>Lower and lateral transparent panels — Integrity, cleanliness, no signs of brake fluid</> },
          { left: "83", right: <>Pilot and copilot doors — Secure</> },
          { left: "84", right: <>Instruments, panels and circuit breakers — Condition, legibility and IN</> },
        ],
      },
    ],
  },
  {
    slug: "cockpit-safety-checks-and-engine-starting",
    title: "COCKPIT/SAFETY CHECKS & ENGINE STARTING",
    subtitle: "Normal procedure",
    reference: "RFM Sect. 2A — Cockpit/Safety Checks, Engine Pre-Start Checks (APU), Engine Starting",
    groups: [
      {
        heading: "Cockpit/safety checks",
        steps: [
          { left: "1", right: <>Cockpit fire extinguisher — Secure</> },
          { left: "2", right: <>Pedals and seats — Adjust</> },
          { left: "3", right: <>Seat belts — Fasten and adjust</> },
          { left: "4", right: <>Circuit breakers — IN</> },
          { left: "5", right: <>Rotor brake — OFF, or BRAKE for windy conditions</> },
          { left: "6", right: <>Static source — NORMAL and guarded</> },
          { left: "7", right: <>ELT switch (if applicable) — Confirm ARM</> },
          { left: "8", right: <>EPGDS panel switches — OFF; ENG 1 &amp; 2 MODE switches — OFF; RCP panel switches — NORM</> },
          { left: "9", right: <>APU PNL SEL MODE switch — OFF; ECS PNL HEATER — OFF; ICS panel mode switch — NORM</> },
          { left: "10", right: <>LDG GEAR lever — Confirm DOWN; PARK BRAKE lever — As required</> },
        ],
      },
      {
        heading: "Engine pre-start checks (APU)",
        steps: [
          { left: "1", right: <>BATT MASTER — ON</> },
          { left: "2", right: <>APU — Confirm green STATUS READY light, select SEL MODE ON, wait 2 seconds and confirm no FAIL message, then momentarily START and release to ON. Confirm green START then ON lights (APU GEN online in approx. 40–45 seconds)</> },
          { left: "3", right: <>MAIN BATT — ON; BATT AUX (if fitted) — ON</> },
          { left: "4", right: <>ECDU — Confirm PBIT IN PROGRESS, then LIGHTS page on completion; action any LOCKED CB LIST as required</> },
          { left: "5", right: <>ECDU LIGHTS page — POS LT and A/COLL ON; CAB SIGN ON if required</> },
          { left: "6", right: <>ENG FIRE PANEL — Confirm guards closed, FIRE EXTING switch centred</> },
          { left: "7", right: <>RCP panel switches — Confirm NORM; AFCS AP1/AP2 — confirm not engaged</> },
          { left: "8", right: <>MISC PNL — 1 &amp; 2 ENG A/ICE PROTECTION OFF; EMERG LTS ON then ARM</> },
          { left: "9", right: <>Cyclic — centred (green PFD indicator); collective — full down; LDG GEAR panel — 3 greens, EMER DOWN switch secure and guarded</> },
          { left: "10", right: <>PARK BRAKE — Pull and turn, confirm PARK BRAKE ON advisory</> },
          { left: "11", right: <>ECDU FIRE test (6R) — Confirm ENG 1, ENG 2, APU and BAG FIRE audio/voice warnings and CAS/MWL indications in sequence</> },
          { left: "12", right: <>LAMP TEST — Confirm FIRE/ARM, LDG GEAR, AFCS, ECDU and APU panel lamps illuminate</> },
          { left: "13", right: <>ENG INTK TEST (if OAT below 5°C) — Select 1 &amp; 2 ENG A/ICE PROTECTION ON, run ENG INTK TEST and confirm INTAKE FAIL cautions during test then clearing after</> },
          { left: "14", right: <>Aural Warning short and long test — Confirm MWL/MCL illuminate and the full aural warning sequence is heard</> },
          { left: "15", right: <>TRANSMISSION OIL TEST — Confirm MGB/IGB/TGB OIL LOW cautions and MCL</> },
          { left: "16", right: <>ECDU HYD (6R) — ELEC PUMP ON, carry out full-and-free cyclic/collective/pedal check one control at a time, then ELEC PUMP OFF, confirm HYDRAULIC SOV NORM</> },
          { left: "17", right: <>Rotor Brake — OFF, confirm no ROTOR BRAKE ON advisory</> },
        ],
      },
      {
        heading: "Engine starting",
        steps: [
          { left: "1", right: <>MFD — Confirm PWR PLANT page; FUEL PUMP 1 &amp; 2 — confirm ON; FUEL ENG 1 &amp; 2 SOV — OPEN; FUEL XFEED — AUTO</> },
          { left: "2", right: <>Engine temperature (ITT) — Confirm less than 150°C</> },
          { left: "3", right: <>ENG 1 MODE switch — IDLE (when ITT below 150°C and NG is 0%)</> },
          { left: "4", right: <>NG — Note increasing and START legend displayed; ITT — note increasing and IGN legend displayed; oil pressure — confirm rising</> },
          { left: "5", right: <>Engine 1 starter — Disengaged by 52% ±2% NG; confirm hydraulic pressure rise and cyclic centralized as rotor begins to turn</> },
          { left: "6", right: <>NF/NR — Confirm stabilized at IDLE speed 55% ±1%</> },
          { left: "7", right: <>Repeat items 2–6 for ENG 2 MODE switch, confirming NF/NR stabilizes at 73% ±1% with both engines at idle</> },
          { left: "8", right: <>AFCS panel — Press TEST and follow MFD AFCS synoptic instructions; confirm successful completion</> },
          { left: "9", right: <>APU — SEL MODE OFF once main engines established (STATUS CLDWN caution during ~70 second shutdown)</> },
        ],
      },
      {
        heading: "After engine start checks",
        steps: [
          { left: "1", right: <>If OAT below 5°C — carry out the Engine Anti Ice Bleed Valve check on each engine (stabilize NG 90–95%, confirm ITT rise of at least 30°C with A/ICE PROTECTION ON, confirm reduction OFF)</> },
          { left: "2", right: <>ENG 1 &amp; 2 MODE switches — FLT, confirm NR/NF stabilized at 102%</> },
          { left: "3", right: <>MISC PNL — ENG and INTAKE ANTI ICE as required</> },
          { left: "4", right: <>Fuel cross-feed test — Cycle FUEL PUMP 1 OFF/ON and FUEL PUMP 2 OFF/ON with XFEED CLSD/OPEN/AUTO, confirming pressure and CAS indications at each step</> },
          { left: "5", right: <>MFD ELECTRIC synoptic — Confirm MAIN and AUX batteries not discharging; ECDU ELEC — confirm GEN 1 &amp; 2 ON, TRU 1 &amp; 2 ON, NON ESS 1 &amp; 2 AUTO, BTC 1 &amp; 2 CLSD</> },
          { left: "6", right: <>MFD HYDRAULIC synoptic — Confirm pressure and temperature within limits with small control inputs and no pressure drop</> },
          { left: "7", right: <>MFD PWR PLANT page — Check all engine parameters within limits, NR/NF 102%</> },
          { left: "8", right: <>Altimeters (Pilot, Standby, Copilot) — Set and cross-check; RAD ALT — confirm zero altitude (±5 ft), test button confirms RA1/RA2 50 ft</> },
          { left: "9", right: <>DH selector, SVS/FD SEL/EVS, MCDU COMM/NAV, ICS panels — Set as required</> },
          { left: "10", right: <>ECDU PITOT — Confirm AUTO; APU — confirm green STATUS READY, no APU ON advisory</> },
        ],
      },
    ],
  },
  {
    slug: "taxiing-and-before-takeoff",
    title: "TAXIING & BEFORE TAKE-OFF",
    subtitle: "Normal procedure",
    reference: "RFM Sect. 2A — Taxiing, Pre Take-Off Checks, Category B Take-Off (Hover IGE / Rolling)",
    cautions: [
      "Do not use aft cyclic to slow the aircraft — large cyclic displacements combined with low collective can cause main rotor hub and cowling damage.",
    ],
    groups: [
      {
        heading: "Taxiing",
        steps: [
          { left: "1", right: <>AFCS — Engaged, AP1 &amp; 2 green, ATT+ATT green on PFD</> },
          { left: "2", right: <>LH LDG LT &amp; RH LDG LT — ON</> },
          { left: "3", right: <>PARK BRAKE handle — OFF, confirm no caution/advisory</> },
          { left: "4", right: <>NOSE WHEEL lock — Press to UNLK</> },
          { left: "5", right: <>Pedal brakes — Check operation (set collective to MPOG for best braking)</> },
        ],
      },
      {
        heading: "Pre take-off checks",
        steps: [
          { left: "1", right: <>ENG MODE switches — Confirm both FLT</> },
          { left: "2", right: <>Power checks — Confirm HEATER OFF, press PWR CHECK on MFD P-PLANT page, confirm positive power margin each engine</> },
          { left: "3", right: <>AEO LIM SEL pushbutton — Push if required (limits max AEO PI to 116%/116%; OEI torque limit remains 172% TQ)</> },
          { left: "4", right: <>PARK BRAKE handle — Released/as required</> },
          { left: "5", right: <>CAS — Clear</> },
        ],
      },
      {
        heading: "Category B take-off — Hover IGE",
        steps: [
          { left: "1", right: <>Hover IGE — Establish at 7 ft AGL, respecting controllability WAT charts for prevailing wind</> },
          { left: "2", right: <>NOSE WHEEL steering — Confirm green LOCK; engines — TQ/ITT matching; CAS — clear; flight controls — check</> },
          { left: "3", right: <>PI and attitude — Note hover values</> },
          { left: "4", right: <>Collective/Cyclic — Apply cyclic to -3° nose down and hold, collective fixed; at ~15 kt GS increase collective PI by +5% above hover; return pitch to hover value over 3–4 seconds as airspeed reaches 20–25 KIAS</> },
          { left: "5", right: <>Acceleration/climb — Accelerate and climb to 50 ft above the take-off surface at 40 KIAS, continuing to 80 KIAS</> },
          { left: "6", right: <>Climb — At 80 KIAS (Vy) adjust attitude to stabilize and climb smoothly, observing PI limits for Take-Off power</> },
          { left: "7", right: <>Landing gear — UP above 200 ft AGL</> },
          { left: "8", right: <>Power — Adjust as required for cruise or continued climb</> },
        ],
      },
      {
        heading: "Category B take-off — Rolling take-off",
        steps: [
          { left: "1", right: <>Hover IGE — Establish at 7 ft AGL, avoiding winds from 090°–270°</> },
          { left: "2", right: <>PI and attitude — Note hover values; NOSE WHEEL steering — confirm green LOCK; engines — TQ/ITT matching</> },
          { left: "3", right: <>Touchdown — Touch down and prepare for ground acceleration to 30 kt GS</> },
          { left: "4", right: <>Lift off — At approximately 30 kt lift off with hover PI value to reach 50 ft above the take-off surface at 40 KIAS, returning to hover attitude, continuing to 80 KIAS</> },
          { left: "5", right: <>Climb — At 80 KIAS (Vy) adjust attitude to stabilize and climb smoothly, observing PI limits for Take-Off power</> },
          { left: "6", right: <>Landing gear — UP above 200 ft AGL</> },
          { left: "7", right: <>Power — Adjust as required for cruise or continued climb</> },
        ],
      },
    ],
    notes: ["For OAT of -30°C and below, undercarriage retraction time may increase."],
  },
  {
    slug: "in-flight-and-before-landing",
    title: "IN-FLIGHT, PRE-LANDING & APPROACH",
    subtitle: "Normal procedure",
    reference: "RFM Sect. 2A — After Take-Off, Cruise Checks, Pre-Landing Checks, Category B Landing",
    groups: [
      {
        heading: "After take-off",
        steps: [
          { left: "1", right: <>LDG GEAR lever — Confirm UP; LH/RH LDG LT — confirm OFF and stowed as required</> },
          { left: "2", right: <>Engine and transmission parameters — Normal, within limits</> },
          { left: "3", right: <>Altimeters — Check QNH and cross-check</> },
          { left: "4", right: <>ECDU MISC LD SHARE — TORQUE or TEMP as required, confirm parameters matched</> },
          { left: "5", right: <>CAS — Clear as required (fly attentive below 500 ft AGL)</> },
          { left: "6", right: <>After Take-Off checks — Complete</> },
        ],
      },
      {
        heading: "Cruise checks",
        steps: [
          { left: "1", right: <>Engine and transmission parameters — Normal, within limits</> },
          { left: "2", right: <>Altimeters — Check QNH and cross-check; compass — synchronized; radios/navigation — as required</> },
          { left: "3", right: <>FUEL — Check quantity, XFEED closed or as required</> },
          { left: "4", right: <>PITOT HEATERS — Confirm AUTO; AIR COND/HEATER/VENT FANS — as required</> },
          { left: "5", right: <>ENG and INTAKE ANTI ICE — Select ON if OAT below 5°C and visible moisture</> },
          { left: "6", right: <>Standby instruments — Cross-check against PFD; CAS — check; cruise checks — complete</> },
        ],
      },
      {
        heading: "Pre-landing checks",
        steps: [
          { left: "1", right: <>LDG GEAR — DOWN, three green lights</> },
          { left: "2", right: <>LH/RH LDG LT — ON; NOSEWHEEL steering — confirm green LOCK; PARK BRAKE handle — as required</> },
          { left: "3", right: <>APU — Start if required (as for engine pre-start checks)</> },
          { left: "4", right: <>Engine and transmission parameters, altimeters, fuel — Check</> },
          { left: "5", right: <>CAS — Clear as required; cabin — secure; pre-landing checks — complete</> },
        ],
      },
      {
        heading: "Approach and landing — Category B landing",
        steps: [
          { left: "1", right: <>Pre-landing checks — Complete</> },
          { left: "2", right: <>AWG — NORMAL</> },
          { left: "3", right: <>Landing direction — If possible orientate into the prevailing wind</> },
          { left: "4", right: <>LDG GEAR — Check 3 greens</> },
          { left: "5", right: <>Initial point — Reduce airspeed gradually to arrive at 200 ft above touchdown point at no more than 500 fpm; decelerate to stabilize 40 KIAS at 50 ft, then rotate nose up 5° to decelerate</> },
          { left: "6", right: <>Landing — Descend to a 7 ft AGL hover</> },
          { left: "7", right: <>Touchdown — Maximum nose-up attitude at touchdown 15°; apply wheel brakes as required</> },
          { left: "8", right: <>NOSE WHEEL lock — UNLK if ground taxiing is required</> },
        ],
      },
    ],
    notes: [
      "When descending below 150 ft AGL the vocal message 'ONE FIFTY FEET' is activated regardless of landing gear status, unless AWG is set to REGRADE.",
    ],
  },
  {
    slug: "shutdown",
    title: "POST LANDING, PRE-SHUTDOWN & SHUTDOWN",
    subtitle: "Normal procedure",
    reference: "RFM Sect. 2A — Post Landing Checks, Pre-Shutdown Checks, Engines and Rotor Shutdown, Post Shutdown Checks",
    groups: [
      {
        heading: "Post landing checks",
        steps: [
          { left: "1", right: <>LH/RH LDG LT — OFF and stowed if used</> },
          { left: "2", right: <>MISC PNL — EMERG LTG switch OFF; MODE — as required</> },
          { left: "3", right: <>Systems — OFF/STBY</> },
        ],
      },
      {
        heading: "Pre-shutdown checks",
        steps: [
          { left: "1", right: <>NOSE WHEEL — Push to LOCK if required</> },
          { left: "2", right: <>PARK BRAKE handle — Pull and turn, PARK BRK ON advisory illuminates</> },
          { left: "3", right: <>Collective — MPOG; cyclic — centralized on PFD indicator; pedals — centred</> },
          { left: "4", right: <>AFCS — OFF; MISC PNL — 1 &amp; 2 ENG A/ICE PROTECTION OFF if used</> },
          { left: "5", right: <>ECDU PITOT — Confirm AUTO</> },
        ],
      },
      {
        heading: "Engines and rotor shutdown",
        steps: [
          { left: "1", right: <>ENG 1 and 2 MODE switches — IDLE (mandatory 2-minute stabilization at IDLE or below 90% NG)</> },
          { left: "2", right: <>MFD — Select PWR PLANT page</> },
          { left: "3", right: <>ENG 1 and 2 MODE switches — OFF, confirming NG decelerates freely with no abnormal noise and ITT does not rise abnormally</> },
          { left: "4", right: <>Rotor Brake — Below 40% NR select BRAKE (recommended between 20–40% NR); confirm no abnormal pressure messages; move to OFF once rotor stopped</> },
          { left: "5", right: <>FUEL XFEED — CLSD; Fuel PUMP 2 — OFF</> },
          { left: "6", right: <>ECDU LT — A/COLL OFF, POS LT as required, CABIN SIGN OFF</> },
          { left: "7", right: <>APU — SEL MODE OFF (STATUS CLDWN caution during ~70 second shutdown, READY light when complete)</> },
          { left: "8", right: <>MAIN BATT and BATT AUX switches — OFF; BATT MASTER — OFF once APU READY illuminates</> },
        ],
      },
      {
        heading: "Post shutdown checks",
        steps: [
          { left: "1", right: <>Chock wheels if parked more than 1 hour, or as soon as possible on sloping ground</> },
          { left: "2", right: <>Remove Main and Auxiliary batteries and store in a heated room if OAT is at or below -20°C</> },
        ],
      },
    ],
    cautions: [
      "Avoid use of the rotor brake if the helicopter is on ice or another slippery or loose surface, to prevent rotation of the helicopter.",
    ],
  },

  // ---------------------------------------------------------------------
  // EMERGENCY PROCEDURES
  // ---------------------------------------------------------------------
  {
    slug: "single-engine-failure",
    title: "SINGLE ENGINE FAILURE",
    subtitle: "Hover, takeoff, cruise & landing — Category B",
    reference: "RFM Sect. 3 — Single Engine Failure",
    intro: (
      <>
        Recognition cues: noticeable right sideslip, illumination of the 1(2) ENG OUT warning with tone and voice alert, a
        significant PI/TQ split between engines, and possibly a drop in rotor speed depending on collective position at the
        time of failure.
      </>
    ),
    groups: [
      {
        heading: "In hover (5–10 ft)",
        steps: [
          { left: "1", right: <>Collective — Maintain setting or lower slightly if required to establish descent</> },
          { left: "2", right: <>Touchdown — Increase collective to cushion landing as touchdown becomes imminent</> },
          { left: "3", right: <>Landing — After touchdown centralize cyclic, simultaneously reduce collective to minimum, apply wheel brakes as required</> },
        ],
      },
      {
        heading: "On takeoff — Category B (rejected)",
        steps: [
          { left: "1", right: <>Collective — Reduce as necessary to maintain rotor RPM if altitude permits</> },
          { left: "2", right: <>Cyclic — Partial flare to reduce groundspeed, limited to 15° close to the ground</> },
          { left: "3", right: <>Collective — Apply to cushion touchdown</> },
          { left: "4", right: <>Landing — After touchdown centralize cyclic, simultaneously reduce collective to minimum</> },
          { left: "5", right: <>Brakes — Apply wheel brakes to minimize ground roll</> },
        ],
      },
      {
        heading: "During cruise",
        steps: [
          { left: "1", right: <>Collective — Adjust to maintain rotor RPM and PI within limits</> },
          { left: "2", right: <>Cyclic — Establish safe OEI flight</> },
          { left: "3", right: <>Collective — Re-adjust to minimize altitude loss</> },
          { left: "4", right: <>APU — Start</> },
          { left: "5", right: <>Engine — Carry out ENGINE SHUTDOWN IN EMERGENCY procedure, then refer to the Single Engine Procedure</> },
        ],
      },
      {
        heading: "Landing — Category B",
        steps: [
          { left: "1", right: <>Landing direction — Orientate into the prevailing wind</> },
          { left: "2", right: <>Initial point — Reduce airspeed gradually to arrive at 200 ft above touchdown at no more than 500 fpm; decelerate to 40 KIAS at 50 ft, then rotate nose up to a maximum of 20° to decelerate</> },
          { left: "3", right: <>Collective — Continue deceleration to a running touchdown or hover, using collective to cushion touchdown; maximum nose-up attitude at touchdown 15°</> },
          { left: "4", right: <>Landing — After touchdown centralize cyclic, reduce collective to minimum</> },
          { left: "5", right: <>Braking — Apply wheel brakes as required</> },
        ],
      },
    ],
    notes: [
      "If execution of the engine failure procedure results in the engine being shut down, consider analysing the cause with a view to restarting — refer to the Single Engine Procedure.",
    ],
  },
  {
    slug: "double-engine-failure-autorotation",
    title: "DOUBLE ENGINE FAILURE & AUTOROTATIVE LANDING",
    subtitle: "Emergency procedure",
    reference: "RFM Sect. 3 — Double Engine Failure, Autorotative Landing Procedure (Land)",
    warnings: [
      "A simultaneous engine failure produces a large and very rapid drop in rotor speed — a large, rapid, decisive collective adjustment is required to recover and maintain rotor speed within the Power Off range.",
    ],
    intro: (
      <>
        If the failure occurs with considerable height available, there may be time to attempt an engine restart — an average
        autorotative sink rate of 3000 fpm means a minimum of 5000–6000 ft AGL is needed to complete APU and restart
        procedures. If no restart is attempted, carry out ENGINE SHUTDOWN IN EMERGENCY while manoeuvring toward the
        landing area.
      </>
    ),
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>Collective — Reduce to enter autorotation</> },
          { left: "2", right: <>Cyclic — Adjust to obtain 70–100 KIAS (best glide speed)</> },
          { left: "3", right: <>Collective — Adjust to obtain up to 110% NR</> },
          { left: "4", right: <>APU — Start</> },
          { left: "5", right: <>Landing gear — Extend</> },
          { left: "6", right: <>Landing site — Select and manoeuvre into wind</> },
          { left: "7", right: <>Briefing — Cabin crew and occupants</> },
          { left: "8", right: <>Radar altimeter — Verify working</> },
          { left: "9", right: <>Distress procedure — Broadcast Mayday, time permitting</> },
          { left: "10", right: <>Flare — At approximately 200 ft AGL, initiate a cyclic flare to 15° nose-up</> },
          { left: "11", right: <>Cyclic/Collective — At approximately 35 ft AGL, reduce to 10° nose-up and apply collective to achieve touchdown at 300 fpm or less</> },
          { left: "12", right: <>Wheel brakes — Apply as required (nose wheel steering and/or differential braking may help)</> },
          { left: "13", right: <>Shutdown — Execute the Emergency Ground Egress procedure</> },
        ],
      },
    ],
  },
  {
    slug: "engine-shutdown-and-ground-egress",
    title: "ENGINE SHUTDOWN IN EMERGENCY & GROUND EGRESS",
    subtitle: "Emergency procedure",
    reference: "RFM Sect. 3 — Engine Shutdown in Emergency, Emergency Ground Egress",
    groups: [
      {
        heading: "Engine shutdown in emergency (affected engine)",
        steps: [
          { left: "1", right: <>ENG FIRE EXT guard — Confirm, lift and press</> },
          { left: "2", right: <>ENG MODE switch — Confirm and OFF</> },
          { left: "3", right: <>FUEL ENG SOV (ECDU) — Confirm and CLSD</> },
          { left: "4", right: <>XFEED — CLSD unless required for crossfeed; FUEL PUMP — OFF unless required for crossfeed</> },
          { left: "5", right: <>Fuel contents — Monitor, use crossfeed as required</> },
          { left: "6", right: <>HEATER — Select as required</> },
        ],
      },
      {
        heading: "Emergency ground egress",
        steps: [
          { left: "1", right: <>PARK BRAKE — Set</> },
          { left: "2", right: <>Evacuation — Command, prepare to evacuate</> },
          { left: "3", right: <>ENG MODE 1 &amp; 2 switches — OFF</> },
          { left: "4", right: <>ENG 1 &amp; 2 FIRE ARM — Lift guard and press pushbuttons</> },
          { left: "5", right: <>Rotor brake — Select BRAKE (if gear not extended, use collective to slow the rotor instead — the aircraft may yaw left)</> },
          { left: "6", right: <>ATC — Notify condition and intention to evacuate</> },
          { left: "7", right: <>LTG EMER lights — ON; evacuation — initiate using PA</> },
          { left: "8", right: <>Emergency exits — Open/eject</> },
          { left: "9", right: <>APU FIRE EXT pushbutton — Press if APU used</> },
          { left: "10", right: <>When rotor stopped — Assist passenger evacuation away from the helicopter</> },
          { left: "11", right: <>BATT MASTER switch — OFF; abandon the helicopter</> },
        ],
      },
    ],
    notes: [
      "If there is evidence of combustion after engine shutdown, carry out a dry motoring procedure as required to extinguish any possible fire.",
    ],
  },
  {
    slug: "apu-and-engine-bay-fire",
    title: "APU & ENGINE BAY FIRE",
    subtitle: "Emergency procedure",
    reference: "RFM Sect. 3 — APU Bay Fire, Engine Bay Fire (Ground/Flight)",
    cautions: [
      "In case of a subsequent fire in the other engine bay, the initial ARM 1(2) pushbutton must be deselected to allow operation of the ARM 2(1) pushbutton.",
    ],
    groups: [
      {
        heading: "APU bay fire — ground",
        steps: [
          { left: "1", right: <>APU FIRE EXT guard — Lift and press</> },
          { left: "2", right: <>BTL switch — Select to BTL</> },
          { left: "3", right: <>APU SEL MODE — OFF</> },
          { left: "4", right: <>Carry out Emergency Ground Egress procedure</> },
        ],
      },
      {
        heading: "APU bay fire — flight",
        steps: [
          { left: "1", right: <>Airspeed — Less than 150 KIAS</> },
          { left: "2", right: <>APU FIRE EXT guard — Lift and press; BTL switch — select BTL; APU SEL MODE — OFF</> },
          { left: "3", right: <>If warning clears — land as soon as possible. If warning remains — land immediately</> },
          { left: "4", right: <>When on ground — Carry out Emergency Ground Egress procedure</> },
        ],
      },
      {
        heading: "Engine bay fire — ground",
        steps: [
          { left: "1", right: <>PARK BRAKE — Pull; ENG 1 &amp; 2 MODE — OFF</> },
          { left: "2", right: <>APU FIRE EXT guard — Lift and press; affected ENG FIRE EXT guard — confirm, lift and press</> },
          { left: "3", right: <>Affected ENG FIRE EXTING switch — Select BTL1; if warning remains, select BTL2</> },
          { left: "4", right: <>If warning remains — Carry out Emergency Ground Egress procedure</> },
        ],
      },
      {
        heading: "Engine bay fire — flight",
        steps: [
          { left: "1", right: <>Airspeed — Between 70–80 KIAS; AIR COND/HEATER — OFF; ENG 1 &amp; 2 SOV — NORMAL/CLSD</> },
          { left: "2", right: <>Affected ENG MODE — Confirm and IDLE, confirm fire, then confirm and OFF</> },
          { left: "3", right: <>Affected ENG FIRE EXT guard — Confirm, lift and press; below 20% NG select FIRE EXTING to BTL1, then BTL2 if warning remains</> },
          { left: "4", right: <>If warning clears — deselect FIRE/ARM pushbutton, start APU, land as soon as possible, refer to Single Engine Procedure</> },
          { left: "5", right: <>If warning remains — start APU, land immediately, refer to Single Engine Procedure</> },
          { left: "6", right: <>When on ground — Carry out Emergency Ground Egress procedure</> },
        ],
      },
    ],
  },
  {
    slug: "cabin-and-baggage-fire",
    title: "BAGGAGE BAY, COCKPIT & CABIN FIRE",
    subtitle: "Emergency procedure",
    reference: "RFM Sect. 3 — Baggage Bay Fire, Cockpit/Cabin Fire",
    groups: [
      {
        heading: "Baggage bay fire — flight",
        steps: [
          { left: "1", right: <>AIR COND/HEATER — OFF; HEATER PNL ENG 1 &amp; 2 SOV — NORMAL</> },
          { left: "2", right: <>VENT CREW FAN and VENT PAX FAN — HIGH</> },
          { left: "3", right: <>If smoke in cabin — Reduce airspeed below 50 KIAS, open storm windows, push to release left-side cabin emergency windows if possible; land as soon as possible or land immediately if severe</> },
          { left: "4", right: <>When on ground — Carry out Emergency Ground Egress procedure</> },
        ],
      },
      {
        heading: "Baggage bay fire — ground",
        steps: [{ left: "1", right: <>Carry out Emergency Ground Egress procedure</> }],
      },
      {
        heading: "Cockpit/cabin fire — ground",
        steps: [{ left: "1", right: <>Carry out Emergency Ground Egress procedure without delay</> }],
      },
      {
        heading: "Cockpit/cabin fire — flight",
        steps: [
          { left: "1", right: <>AIR COND/HEATER — OFF; HEATER PNL ENG 1 &amp; 2 SOV — confirm NORMAL; VENT CREW/PAX FAN — OFF</> },
          { left: "2", right: <>If the fire source is determined — Use the on-board hand-held extinguisher to fight the fire; increase ventilation once extinguished</> },
          { left: "3", right: <>If the source cannot be determined, or the fire persists — Land immediately</> },
          { left: "4", right: <>When on ground — Carry out Emergency Ground Egress procedure</> },
        ],
      },
    ],
    cautions: ["If the fire is not completely extinguished, increased ventilation may aggravate the problem."],
    notes: ["The most urgent action for an in-flight cabin/cockpit fire is getting the aircraft on the ground as soon as possible with a reasonable degree of safety — no single procedure covers every scenario."],
  },
  {
    slug: "electrical-fire-smoke",
    title: "ELECTRICAL FIRE / SMOKE",
    subtitle: "Emergency procedure",
    reference: "RFM Sect. 3 — Electrical Fire/Smoke (Ground/Flight)",
    intro: <>An electrical fire is indicated by a smell of burning insulation and/or acrid smoke.</>,
    groups: [
      {
        heading: "On the ground",
        steps: [{ left: "1", right: <>Carry out Emergency Ground Egress procedure</> }],
      },
      {
        heading: "In flight",
        steps: [
          { left: "1", right: <>Airspeed — 50 KIAS; VENT FAN — OFF; storm window(s) — open to ventilate cockpit</> },
          { left: "2", right: <>APU — ON; right MCDU TUNE page — select COM/NAV on side 2; PILOT UTILITY LIGHT — ON</> },
          { left: "3", right: <>Land as soon as possible</> },
          { left: "4", right: <>If smoke persists — GEN 1 &amp; 2 OFF (loses NON-ESS BUS 1–4)</> },
          { left: "5", right: <>If smoke still persists — BTC 1 to AUTO (loses MAIN BUS 1 &amp; 3), then BTC 2 to AUTO (loses MAIN BUS 2 &amp; 4)</> },
          { left: "6", right: <>If smoke still persists — APU OFF (loses ESS BUS 1 &amp; 2); if smoke clears, land within 15 minutes (30 if AUX BATT installed); if smoke/fire is severe, land immediately</> },
          { left: "7", right: <>When on ground — Carry out Emergency Ground Egress procedure</> },
        ],
      },
    ],
    notes: ["Unless the source can be positively identified via CAS, the C/B panel or ECDU display and the equipment electrically isolated, work through the bus-shedding sequence above."],
  },
  {
    slug: "main-gearbox-and-rotor-controls",
    title: "MAIN GEARBOX & MAIN ROTOR CONTROLS BINDING",
    subtitle: "Emergency procedure",
    reference: "RFM Sect. 3 — MGB Oil Pressure Low, MGB Oil Temperature High, Main Rotor Controls Binding",
    groups: [
      {
        heading: "MGB oil pressure low",
        steps: [
          { left: "1", right: <>TQ 1 &amp; 2 — MAX 65%; start the clock</> },
          { left: "2", right: <>MGB oil pressure — Check on PFD</> },
          { left: "3", right: <>If low or invalid — Reduce power as operational conditions permit</> },
          { left: "4", right: <>If normal — Land as soon as practicable, monitoring MGB oil pressure and temperature; do not activate chip burner</> },
          { left: "5", right: <>If 1(2) BRG TEMP caution illuminates — Land as soon as possible; landing/ditching within 50 minutes at torque not exceeding 65/65%</> },
          { left: "6", right: <>If associated oil pressure remains permanently above 1.5 bar — Land as soon as possible; landing/ditching within 3 hours at torque not exceeding 65/65%</> },
        ],
      },
      {
        heading: "MGB oil temperature high",
        steps: [
          { left: "1", right: <>TQ 1 &amp; 2 — MAX 65%; check MGB oil temperature on PFD</> },
          { left: "2", right: <>If high or invalid — Land as soon as possible</> },
          { left: "3", right: <>If normal — Continue flight, monitoring MGB oil temperature and pressure</> },
        ],
      },
      {
        heading: "Main rotor controls binding",
        steps: [
          { left: "1", right: <>Do not attempt maximum effort against the binding — a more serious malfunction could result</> },
          { left: "2", right: <>If airspeed is above 25 KIAS — Land into wind as soon as possible using a running landing at 25 KIAS touchdown speed</> },
          { left: "3", right: <>If airspeed is below 25 KIAS — Carry out a running landing at the speed at which the binding occurred; if in a hover, land vertically</> },
        ],
      },
    ],
  },
  {
    slug: "tail-rotor-failures",
    title: "TAIL ROTOR SYSTEM FAILURES",
    subtitle: "Drive failure, control system failure, control binding",
    reference: "RFM Sect. 3 — Tail Rotor Drive Failure, Tail Rotor Control System Failure, Tail Rotor Control Binding",
    intro: (
      <>
        Yaw control diagnostics: pedals free but ineffective with rapid right yaw indicates drive failure; pedals free but
        ineffective (or partially effective) with yaw direction depending on airspeed/torque indicates a control circuit
        disconnect; seized pedals with yaw response to collective changes indicates control binding.
      </>
    ),
    groups: [
      {
        heading: "Tail rotor drive failure",
        steps: [
          { left: "In hover", right: <>Lower collective to land immediately while maintaining attitude and minimizing lateral translation with cyclic; select ENG MODE switches OFF if time available</> },
          { left: "In forward flight", right: <>Lower collective immediately to minimize yaw right, establish an airspeed/power/roll angle sufficient to reach a suitable landing site</> },
          { left: "At the landing site", right: <>Assess running-landing capability; if a running landing cannot be made with suitable power and speed, shut down the engines and carry out an engine-off landing</> },
        ],
      },
      {
        heading: "Tail rotor control system failure",
        steps: [
          { left: "In low hover", right: <>Lower collective to land immediately, maintaining attitude and minimizing lateral translation; retard ENG MODE switches to OFF/IDLE if a rapid right yaw develops and time permits</> },
          { left: "In forward flight/high hover", right: <>Gently and progressively apply left then right pedal to diagnose the failure and determine a speed/power combination that minimizes yaw</> },
          { left: "If tail rotor floats to zero thrust", right: <>Set up a rate of descent to align the nose with the flight path; a low-speed rotating landing may be required, selecting ENG MODE OFF as the aircraft rotates at low level</> },
          { left: "If a mechanical disconnect exists", right: <>An IGE hover may be possible and a power-on running landing may be carried out, depending on weight, altitude and wind</> },
        ],
      },
      {
        heading: "Tail rotor control binding",
        steps: [
          { left: "General", right: <>Do not apply maximum effort against seized pedals; select a combination of power, airspeed and sideslip to maintain controlled, fixed-heading flight</> },
          { left: "In low hover", right: <>Lower collective to land immediately, maintaining attitude and minimizing lateral translation; do not shut down engines unless a severe right yaw occurs</> },
          { left: "In forward flight/high hover", right: <>Determine the speed/power combination that minimizes yaw (power increase yaws right, power decrease yaws left); carry out a high-power low-speed approach, a running landing at ~20 kt, or a low-speed yawing landing depending on when the binding occurred</> },
        ],
      },
    ],
  },
  {
    slug: "triple-ac-generator-failure",
    title: "TRIPLE AC GENERATOR FAILURE",
    subtitle: "Emergency procedure",
    reference: "RFM Sect. 3 — Electrical System, Triple AC Generator Failure",
    intro: <>Confirmed by loss of all electrical systems except those powered by the battery buses.</>,
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>APU — Confirm ON</> },
          { left: "2", right: <>ECDU — Select ELEC page</> },
          { left: "3", right: <>GEN 1 &amp; 2 — Select OFF, then GEN 1 — Select ON</> },
          { left: "If ELEC FAIL clears", right: <>GEN 1 back on line — assume GEN 2 failed and leave OFF; reset AMMC 1 when the DBU READY advisory illuminates; select TCAS TA/RA; on ECDU set XFEED OPEN then AUTO; select APU SEL MODE OFF</> },
          { left: "If ELEC FAIL remains", right: <>GEN 1 failed — leave GEN 1 OFF, GEN 2 ON; if the caption remains, GEN 2 has also failed — DC NON ESS BUS 1 &amp; 2 are lost</> },
        ],
      },
    ],
    notes: [
      "With DC NON ESS BUS 1 & 2 lost: land as soon as possible, within 15 minutes (30 minutes if an auxiliary battery is installed).",
      "If ESS BUS 1 & 2, DC MAIN BUS 1–4 and DC NON ESS BUS 1 & 2 are all lost, the Main and Auxiliary (if installed) battery will supply EMER BUS 1 & 2 — land as soon as practicable.",
    ],
  },
  {
    slug: "hydraulic-pressure-low",
    title: "HYDRAULIC PRESSURE LOW",
    subtitle: "Emergency procedure",
    reference: "RFM Sect. 3 — Hydraulic System, Hydraulic Pressure Low",
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>Confirm hydraulic pressure low (below 163 bar) — loss of pressure in the associated hydraulic system</> },
          { left: "If HYD 1 OIL PRESS illuminated", right: <>Yaw AP channel not functional, 1-2 AP Y FAIL illuminates — fly attentive, feet on, reduce speed to 110 KIAS; when convenient select LDG GEAR LEVER down, then land as soon as practicable</> },
          { left: "If HYD 2 OIL PRESS illuminated", right: <>When convenient select LDG GEAR LEVER down, lift the EMER DWN guard and press; land as soon as practicable</> },
        ],
      },
    ],
    notes: [
      "With one hydraulic system operating, taxi at 5 kt or less and carry out turns carefully.",
      "When using the EMER DWN pushbutton, if hydraulic oil temperature is below -20°C the button must be held depressed until the landing gear down lights are green.",
      "Fuel consumption will be increased with the landing gear down.",
    ],
  },

  // ---------------------------------------------------------------------
  // CATEGORY A OPERATIONS (RFM Supplement 4)
  // ---------------------------------------------------------------------
  {
    slug: "ground-and-elevated-heliport-vertical-take-off",
    title: "GROUND / ELEVATED HELIPORT VERTICAL TAKE-OFF",
    subtitle: "Category A — Supplement 4, Part A",
    reference: "RFM Supplement 4, Part A — Section 2A Normal Procedures",
    intro: (
      <>
        Vertical Category A take-off from a ground level or elevated heliport/helideck. TDP is 110 ft ATS, reached from a
        7 ft ATS hover before rotating to accelerate through V<sub>TOSS</sub> (50 KIAS).
      </>
    ),
    image: {
      src: "/aw189/procedures/ground-and-elevated-heliport-vertical-take-off/ground-and-elevated-heliport-vertical-take-off.svg",
      alt: "Take-off profile diagram for ground/elevated heliport vertical take-off, showing 7 ft hover, TDP 110 ft and VTOSS 50 KIAS",
      caption: "Figure S4A-2 — Take-Off Profile Vertical Heliport Procedure (RFM Supplement 4, Part A)",
    },
    cautions: [
      "If this procedure is modified, it may not be possible, if an engine fails in the take-off path, to carry out a safe OEI landing or achieve the scheduled OEI performance.",
    ],
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>Climb Out Safety Speed — Select V<sub>COSS</sub> based on reported headwind component</> },
          { left: "2", right: <>PARK BRAKE — Apply; confirm pressure on brake pedals and PARK BRAKE ON advisory illuminated</> },
          { left: "3", right: <>HEATER — As required</> },
          { left: "4", right: <>Pilot Altimeter — Set 0 ft or nearest 1000 ft setting to T-O altitude, collective at MPOG</> },
          { left: "5", right: <>Rad Alt — Check</> },
          { left: "6", right: <>Power checks — Confirm HEATER OFF, press PWR CHECK on MFD P-PLANT page, confirm positive power margin each engine</> },
          { left: "7", right: <>NOSEWHEEL lock — LOCK</> },
          { left: "8", right: <>Engine/Rotor — TQ/ITT matched as required, check NF/NR 102%</> },
          { left: "9", right: <>MFD PWR PLANT page — Check all parameters within normal limits, cross-check with PFD</> },
          { left: "10", right: <>Warnings and Cautions — None/as required</> },
          { left: "11", right: <>Flight controls — Check correct functioning</> },
          { left: "12", right: <>Hover — Establish a 7 ft ATS hover, no winds from rear sectors (090°–270°)</> },
          { left: "13", right: <>Collective/Cyclic Control — Increase PI to climb slowly to TDP (110 ft ATS), maintaining hover position</> },
          { left: "14", right: <>Take-Off Decision Point (TDP) — Maintain TDP (110 ft ATS) until ready to depart, noting pitch attitude</> },
          { left: "15", right: <>Hover departure — Rotate nose down slowly for a 5° attitude change, maintaining collective position; accelerate to V<sub>TOSS</sub> (50 KIAS), then continue climb and accelerate to V<sub>Y</sub></> },
          { left: "16", right: <>Climb — At V<sub>Y</sub> adjust attitude to stabilize speed, continue climb</> },
          { left: "17", right: <>Landing gear — UP (when reaching V<sub>Y</sub> but not below 200 ft ATS)</> },
          { left: "18", right: <>Power — Adjust collective to continue climb at V<sub>Y</sub> (80 KIAS), using up to 5 min power as required, to 1000 ft ATS</> },
          { left: "19", right: <>At 1000 ft ATS — Adjust collective and cyclic to continue climb at V<sub>Y</sub> or accelerate to cruise speed as required</> },
          { left: "20", right: <>PARK BRAKE — Release; confirm PARK BRAKE ON advisory not illuminated</> },
          { left: "21", right: <>After Take-Off checks — Complete</> },
        ],
      },
    ],
  },
  {
    slug: "clear-area-take-off",
    title: "CLEAR AREA TAKE-OFF",
    subtitle: "Category A — Supplement 4, Part B",
    reference: "RFM Supplement 4, Part B — Section 2B Normal Procedures",
    intro: (
      <>
        Running/rolling-style Category A take-off from a clear area. TDP is 30 ft AGL with V<sub>TOSS</sub> (50 KIAS) achieved
        by TDP at 25 kt groundspeed.
      </>
    ),
    image: {
      src: "/aw189/procedures/clear-area-take-off/clear-area-take-off.svg",
      alt: "Take-off profile diagram for clear area take-off, showing GS 25 kts, TDP 30 ft AGL and VTOSS 50 KIAS",
      caption: "Figure S4B-2 — Take-Off Profile Clear Area (RFM Supplement 4, Part B)",
    },
    cautions: [
      "If this procedure is modified, it may not be possible, if an engine fails in the take-off path, to carry out a safe OEI landing or achieve the scheduled OEI performance.",
    ],
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>V<sub>TOSS</sub> — Select based on reported headwind component</> },
          { left: "2", right: <>PARK BRAKE — Release; confirm PARK BRAKE ON advisory not illuminated</> },
          { left: "3", right: <>HEATER — As required</> },
          { left: "4", right: <>Pilot Altimeter — Set</> },
          { left: "5", right: <>Rad Alt — Check</> },
          { left: "6", right: <>Power checks — Confirm HEATER OFF, press PWR CHECK on MFD P-PLANT page, confirm positive power margin each engine</> },
          { left: "7", right: <>NOSEWHEEL steering — LOCK</> },
          { left: "8", right: <>Engine/Rotor — TQ/ITT matched as required, check NF/NR 102%</> },
          { left: "9", right: <>MFD PWR PLANT page — Check all parameters within normal limits, cross-check with PFD</> },
          { left: "10", right: <>Warnings and Cautions — None/as required</> },
          { left: "11", right: <>Flight controls — Check correct functioning</> },
          { left: "12", right: <>Hover — Establish a 7 ft ATS hover, no winds from rear sectors (090°–270°)</> },
          { left: "13", right: <>PI/Attitude — Note PI value (PI TARGET) and pitch attitude</> },
          { left: "14", right: <>Land — Centralize cyclic and reduce collective to MPOG</> },
          { left: "15", right: <>Rolling departure — Increase collective to 50% PI (±5%) and apply forward cyclic to allow smooth acceleration</> },
          { left: "16", right: <>Lift off — At 25 kt groundspeed apply collective to PI TARGET over 3 seconds</> },
          { left: "17", right: <>Cyclic control — After lift-off rotate nose down for a -5° attitude change from hover value</> },
          { left: "18", right: <>Take-Off Decision Point (TDP) — At 30 ft AGL continue acceleration, verify V<sub>TOSS</sub> already achieved, accelerate to V<sub>Y</sub> and continue climb</> },
          { left: "19", right: <>Climb — At V<sub>Y</sub> adjust attitude to stabilize speed, continue climb</> },
          { left: "20", right: <>Landing gear — UP at or above 200 ft AGL</> },
          { left: "21", right: <>Power — Adjust collective to climb at V<sub>Y</sub> (80 KIAS), using up to 5 min power, to 1000 ft AGL</> },
          { left: "22", right: <>At 1000 ft AGL — Adjust collective and cyclic to continue climb at V<sub>Y</sub> or accelerate to cruise speed as required</> },
          { left: "23", right: <>After Take-Off checks — Complete</> },
        ],
      },
    ],
  },
  {
    slug: "offshore-helideck-take-off",
    title: "OFFSHORE HELIDECK TAKE-OFF",
    subtitle: "Category A — Supplement 4, Part C",
    reference: "RFM Supplement 4, Part C — Section 2C Normal Procedures",
    intro: (
      <>
        Vertical Category A take-off from an offshore helideck. TDP is 25 ft ATS, reached from a 5 ft ATS hover with the
        nose wheel positioned approximately 2 m from the forward edge of the helideck.
      </>
    ),
    image: {
      src: "/aw189/procedures/offshore-helideck-take-off/offshore-helideck-take-off.svg",
      alt: "Take-off profile diagram for offshore helideck take-off, showing 5 ft HIGE, vertical climb to TDP 25 ft, -12 degree nose down, and acceleration to VTOSS then VY",
      caption: "Figure S4C-4 — Offshore Helideck Normal Take-Off Profile (RFM Supplement 4, Part C)",
    },
    cautions: [
      "If this procedure is modified, it may not be possible, if an engine fails in the take-off path, to carry out a safe OEI landing or achieve the scheduled OEI performance.",
    ],
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>V<sub>COSS</sub> — Select based on reported headwind component</> },
          { left: "2", right: <>PARK BRAKE — Apply; confirm pressure on brake pedals and PARK BRAKE ON advisory illuminated</> },
          { left: "3", right: <>HEATER — As required</> },
          { left: "4", right: <>Pilot Altimeter — Set 0 ft or nearest 1000 ft setting to T-O altitude, collective at MPOG</> },
          { left: "5", right: <>Rad Alt — Check</> },
          { left: "6", right: <>Power checks — Confirm HEATER OFF, press PWR CHECK on MFD P-PLANT page, confirm positive engine power</> },
          { left: "7", right: <>NOSEWHEEL lock — LOCK</> },
          { left: "8", right: <>Engine/Rotor — TQ matched as required, check NF/NR 102%</> },
          { left: "9", right: <>MFD PWR PLANT page — Check all parameters within normal limits, cross-check with PFD</> },
          { left: "10", right: <>PFD page — Select DG</> },
          { left: "11", right: <>CAS — Clear/as required</> },
          { left: "12", right: <>Flight controls — Check correct functioning</> },
          { left: "13", right: <>Hover — Establish a 5 ft ATS hover with the nose wheel approximately 2 m from the front edge of the helideck, note hovering PI</> },
          { left: "14", right: <>Collective/Cyclic Control — Apply a PI delta (from the Delta PI Values chart for ambient temperature and AUW) over 2–3 seconds to climb vertically at 400 fpm or greater, maintaining hover position</> },
          { left: "15", right: <>Take-Off Decision Point (TDP) — At 25 ft ATS rotate nose to -12° to achieve 25 kt GS, then rotate to +5° and accelerate to V<sub>TOSS</sub></> },
          { left: "16", right: <>V<sub>TOSS</sub> — Continue and accelerate to V<sub>Y</sub> climb</> },
          { left: "17", right: <>Landing gear — UP</> },
          { left: "18", right: <>PARK BRAKE — Release; confirm PARK BRAKE ON advisory not illuminated</> },
          { left: "19", right: <>PFD page — Select MAG</> },
          { left: "20", right: <>After Take-Off checks — Complete</> },
        ],
      },
    ],
  },
  {
    slug: "heliport-landing",
    title: "GROUND HELIPORT APPROACH AND LANDING",
    subtitle: "Category A — Supplement 4, Part E",
    reference: "RFM Supplement 4, Part E — Section 2E Normal Procedures",
    intro: (
      <>
        Category A approach and landing to a ground heliport, a forward-flight shallow approach to a HIGE and landing.
        LDP is 50 ft ALS at 25 kt groundspeed, following an initial approach through 200 ft ALS at 40 KIAS.
      </>
    ),
    image: {
      src: "/aw189/procedures/heliport-landing/heliport-landing.svg",
      alt: "Landing profile diagram for ground heliport approach and landing, showing 200 ft initial point at 40 KIAS and LDP at 50 ft ALS, 25 kts",
      caption: "Figure S4E-2 — Ground Heliport Landing Profile (RFM Supplement 4, Part E)",
    },
    cautions: [
      "If this procedure is modified, it may not be possible, if an engine fails in the landing path, to carry out a safe OEI landing or achieve the scheduled OEI performance.",
    ],
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>Climb Out Safety Speed — Select V<sub>COSS</sub> based on reported headwind component</> },
          { left: "2", right: <>Pre-landing checks — Complete</> },
          { left: "3", right: <>Landing direction — If possible orientate into the prevailing wind, avoiding winds from rear sectors (090°–270°)</> },
          { left: "4", right: <>AWG (ECDU MISC page) — NORM/REGR as required</> },
          { left: "5", right: <>PARK BRAKE — Apply; confirm pressure on brake pedals and PARK BRAKE ON advisory illuminated</> },
          { left: "6", right: <>Initial point — Establish an approach through 200 ft ALS at 40 KIAS, rate of descent no more than 200 fpm; decelerate to achieve LDP (50 ft ALS) at 25 kt groundspeed</> },
          { left: "7", right: <>Landing — Continue to descend to a HIGE; maximum forward groundspeed at touchdown 5 kts</> },
          { left: "8", right: <>PARK BRAKE — As required after landing</> },
          { left: "9", right: <>LDG LTS — OFF/STOW if used</> },
          { left: "10", right: <>Post Landing Checks — Complete</> },
        ],
      },
    ],
    notes: [
      "When descending below 150 ft radio altimeter height a vocal message 'ONE FIFTY FEET' is activated regardless of landing gear status, unless AWG is set to REGR.",
    ],
  },
  {
    slug: "clear-area-landing",
    title: "CLEAR AREA APPROACH AND LANDING",
    subtitle: "Category A — Supplement 4, Part F",
    reference: "RFM Supplement 4, Part F — Section 2F Normal Procedures",
    intro: (
      <>
        Category A approach and landing to a clear area. LDP is 50 ft ALS at 50 KIAS, following an initial approach through
        200 ft ALS at no more than 500 fpm.
      </>
    ),
    image: {
      src: "/aw189/procedures/clear-area-landing/clear-area-landing.svg",
      alt: "Landing profile diagram for clear area approach and landing, showing 200 ft initial point and LDP at 50 ft ALS, 50 KIAS",
      caption: "Figure S4F-2 — Clear Area Landing Profile (RFM Supplement 4, Part F)",
    },
    cautions: [
      "If this procedure is modified, it may not be possible, if an engine fails in the landing path, to carry out a safe OEI landing or achieve the scheduled OEI performance.",
    ],
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>Balked Landing Safety Speed — Select V<sub>BLSS</sub> based on reported headwind component</> },
          { left: "2", right: <>Pre-landing checks — Complete</> },
          { left: "3", right: <>AWG (ECDU MISC) — NORM/REGR as required</> },
          { left: "4", right: <>PARK BRAKE — Confirm released</> },
          { left: "5", right: <>Initial point — Establish an approach through 200 ft AGL, rate of descent no more than 500 fpm; decelerate to achieve LDP (50 ft AGL) at 50 KIAS, rate of descent less than 400 fpm</> },
          { left: "6", right: <>Landing — Continue to cushion down for a rolling touchdown; maximum attitude at touchdown 15° nose-up, 40 kt groundspeed</> },
          { left: "7", right: <>PARK BRAKE — As required</> },
          { left: "8", right: <>Post Landing Checks — Complete</> },
        ],
      },
    ],
    notes: [
      "When descending below 150 ft radio altimeter height a vocal message 'ONE FIFTY FEET' is activated regardless of landing gear status, unless AWG is set to REGR.",
    ],
  },
  {
    slug: "offshore-helideck-landing",
    title: "OFFSHORE HELIDECK APPROACH AND LANDING",
    subtitle: "Category A — Supplement 4, Part G",
    reference: "RFM Supplement 4, Part G — Section 2G Normal Procedures",
    intro: (
      <>
        Category A approach and landing to an offshore helideck, offset to the side of the deck. LDP is 50 ft ALS at
        10–15 kt groundspeed with a 200–300 fpm rate of descent, reached approximately 45° from the centre of the
        landing point.
      </>
    ),
    image: {
      src: "/aw189/procedures/offshore-helideck-landing/offshore-helideck-landing.svg",
      alt: "Landing profile diagram for offshore helideck approach and landing, showing constant descent to LDP at 50 ft ALS, 10-15 kts GS, 45 degrees from the landing point, and vertical touchdown",
      caption: "Figure S4G-2 — Offshore Helideck Landing Profile (RFM Supplement 4, Part G)",
    },
    cautions: [
      "If this procedure is modified, it may not be possible, if an engine fails in the landing path, to carry out a safe OEI landing or achieve the scheduled OEI performance.",
    ],
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>Climb Out Safety Speed — Select V<sub>COSS</sub> based on reported headwind component and weight</> },
          { left: "2", right: <>Pre-landing checks — Complete</> },
          { left: "3", right: <>Landing direction — If possible orientate into the prevailing wind</> },
          { left: "4", right: <>AWG (ECDU MISC page) — NORM/REGR as required</> },
          { left: "5", right: <>PARK BRAKE — Apply; confirm pressure on brake pedals and PARK BRAKE ON advisory illuminated</> },
          { left: "6", right: <>PFD page — Select DG</> },
          { left: "7", right: <>Initial point — Establish a constant 200–300 fpm descent, decelerating slowly toward the LDP (50 ft ALS at 10–15 kt GS, deck at 45°), keeping the rotor tip path plane outboard but close to the helideck edge</> },
          { left: "8", right: <>LDP — Positioned with the aircraft approximately 45° from the centre of the helideck, viewed through the lower windscreen using the pitot tube as a reference</> },
          { left: "9", right: <>Landing — When passing LDP fly directly to the landing position, flare to reduce rate of descent and speed to achieve a HIGE over the landing position</> },
          { left: "10", right: <>Touchdown — Descend vertically over the landing position and use collective to cushion touchdown; maximum allowed groundspeed at touchdown 5 kts</> },
          { left: "11", right: <>PARK BRAKE — As required after landing</> },
          { left: "12", right: <>Post Landing Checks — Complete</> },
        ],
      },
    ],
  },
];

export function findAW189Procedure(slug: string): ProcedureDefinition | undefined {
  return AW189_PROCEDURES.find((p) => p.slug === slug);
}
