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
};

export const AW139_PROCEDURES: ProcedureDefinition[] = [
  // ---------------------------------------------------------------------
  // NORMAL PROCEDURES
  // ---------------------------------------------------------------------
  {
    slug: "exterior-check",
    title: "EXTERIOR CHECK",
    subtitle: "Normal procedure",
    reference: "RFM Sect. 2 — External Pre-Flight Checks",
    intro: (
      <>
        The inspection commences at the nose and continues clockwise around the helicopter across seven areas,
        finishing with the cabin and cockpit interior. Items marked ★ need only be checked before the first flight of
        the day; all other items are checked before every flight.
      </>
    ),
    groups: [
      {
        heading: "Before exterior check",
        steps: [
          { left: "★", right: <>Main and tail rotor tie downs (if present) — Removed</> },
        ],
      },
      {
        heading: "Area 1 — Helicopter nose",
        steps: [
          { left: "2", right: <>Nose exterior — Condition</> },
          { left: "3", right: <>Pitot-static probe (left side) — Cover removed, condition and unobstructed</> },
          { left: "4", right: <>Left side brake lines in brake pedal area — Condition</> },
          { left: "5", right: <>Nose landing gear — Condition, shock strut extension, leaks, tire pressure</> },
          { left: "6", right: <>Ventilation air intakes (landing gear bay) — Unobstructed</> },
          { left: "7", right: <>Nose compartment access door — Latched and secure</> },
          { left: "8", right: <>Pitot-static probe (right side) — Cover removed, condition and obstructions</> },
          { left: "9", right: <>Right side brake lines in brake pedal area — Condition</> },
        ],
      },
      {
        heading: "Area 2 — Fuselage, right-hand side",
        steps: [
          { left: "10", right: <>Windshield and roof transparent panel — Condition, cleanliness</> },
          { left: "11", right: <>Windscreen wiper — Condition</> },
          { left: "12", right: <>Fuselage exterior — Condition</> },
          { left: "13", right: <>Pilot cockpit door — Condition, cleanliness, window secure, check for cracks</> },
          { left: "14", right: <>Passenger cabin door — Condition, cleanliness, secure</> },
          { left: "15", right: <>Right side emergency exits — Verify secure</> },
          { left: "16", right: <>Main landing gear — Condition, shock strut extension, leaks, tire pressure</> },
          { left: "17", right: <>Drains and vent lines — Free of obstructions</> },
          { left: "18", right: <>Fuel tank sump area (right side) — Confirm no leaks</> },
          { left: "19", right: <>Baggage compartment, tie down/net — Condition, cargo correctly secure</> },
          { left: "20", right: <>Baggage door — Secure</> },
          { left: "21", right: <>Engine area — Check for fuel and/or oil leaks</> },
          { left: "22", right: <>Cowling and fairings — Condition and latched</> },
          { left: "23", right: <>Air intakes — Clear and unobstructed</> },
          { left: "24", right: <>Main rotor components and blades — General condition</> },
          { left: "25", right: <>Main rotor damper indicators — Position</> },
          { left: "26", right: <>Engine air intake screen — Cover removed, free of damage and obstruction</> },
          { left: "27", right: <>Engine cowling — Secure</> },
          { left: "28", right: <>Gravity fuel filler cap — Secure</> },
          { left: "29", right: <>Engine exhaust — Cover removed, condition</> },
          { left: "30", right: <>Fire bottle discharge indicator — Green</> },
        ],
      },
      {
        heading: "Area 3 — Tail boom, right-hand side",
        steps: [
          { left: "31", right: <>Tail boom exterior — Condition</> },
          { left: "31A", right: <>Tail rotor drive shaft cover — Secure</> },
          { left: "32", right: <>Antenna — Condition</> },
          { left: "33", right: <>Stabilizer — Condition and secure</> },
          { left: "34", right: <>Navigation light — Condition</> },
        ],
      },
      {
        heading: "Area 4 — Fin, intermediate/tail gearbox, tail rotor",
        steps: [
          { left: "35", right: <>Tail fin — Condition</> },
          { left: "36", right: <>Intermediate and tail rotor gearbox — Check for leaks</> },
          { left: "37", right: <>Tail navigation and anti-collision lights — Condition</> },
          { left: "38", right: <>Tail rotor hub and blades — Condition, cleanliness</> },
          { left: "39", right: <>Tail rotor pitch change mechanism — Condition</> },
        ],
      },
      {
        heading: "Area 5 — Tail boom, left-hand side",
        steps: [
          { left: "40", right: <>Tail boom exterior — Condition</> },
          { left: "41", right: <>Stabilizer — Condition and secure</> },
          { left: "42", right: <>Navigation light — Condition</> },
          { left: "43", right: <>Antenna — Condition</> },
          { left: "44", right: <>Tail rotor drive shaft cover — Secure</> },
        ],
      },
      {
        heading: "Area 6 — Fuselage, left-hand side",
        steps: [
          { left: "45", right: <>Fuselage exterior — Condition</> },
          { left: "46", right: <>Engine exhaust — Cover removed, condition</> },
          { left: "47", right: <>Fire bottle discharge indicator — Green</> },
          { left: "48", right: <>Baggage compartment, tie down/net — Condition, cargo correctly secure</> },
          { left: "49", right: <>Baggage door — Secure</> },
          { left: "50", right: <>Engine area — Check for fuel and/or oil leaks</> },
          { left: "51", right: <>Engine air intake screen — Cover removed, clear of damage and obstructions</> },
          { left: "52", right: <>Engine cowling — Secure</> },
          { left: "53", right: <>Air intakes — Clear and unobstructed</> },
          { left: "54", right: <>Main rotor components and blades — General condition</> },
          { left: "55", right: <>Left side emergency exits — Confirm secure</> },
          { left: "56", right: <>Drains and vent lines — Free of obstructions</> },
          { left: "57", right: <>Fuel tank sump area (left side) — Confirm no leaks</> },
          { left: "58", right: <>Main landing gear — Condition, shock strut extension, leaks, tire pressure</> },
          { left: "59", right: <>Passenger cabin door — Condition, cleanliness, secure</> },
          { left: "60", right: <>Cowling and fairings — Condition</> },
          { left: "61", right: <>Co-pilot cockpit door — Condition, cleanliness, window secure, check for cracks</> },
          { left: "62", right: <>Windshield and roof transparent panel — Condition and cleanliness</> },
          { left: "63", right: <>Windscreen wiper — Condition</> },
        ],
      },
      {
        heading: "Area 7 — Cabin and cockpit interior",
        steps: [
          { left: "64", right: <>Passenger emergency exits — Verify secure</> },
          { left: "65", right: <>Cabin interior — Equipment and cargo secure</> },
          { left: "66", right: <>First aid kit — On board</> },
          { left: "67", right: <>Cabin fire extinguisher — Secure, charge</> },
          { left: "68", right: <>Passenger doors — Closed and secure, levers fully down in locked position</> },
          { left: "69", right: <>Pilot and copilot safety belt and inertia reel — Condition</> },
          { left: "70", right: <>Pilot and copilot seat — Secure</> },
          { left: "71", right: <>Pilot and copilot flight controls — Condition and secure</> },
          { left: "72", right: <>Lower and lateral transparent panels — Integrity, cleanliness, no brake fluid</> },
          { left: "73", right: <>Pilot and copilot door — Secure</> },
          { left: "74", right: <>Instruments, panels and circuit breakers — Condition and legibility</> },
        ],
      },
    ],
    notes: [
      "A daily fuel tank drain check (10 to 20 cc from each sump water drain valve) must be carried out before the first flight of the day, by a trained person, before moving the aircraft.",
    ],
  },
  {
    slug: "pre-start-checks",
    title: "COCKPIT / ENGINE PRE-START CHECKS",
    subtitle: "Normal procedure",
    reference: "RFM Sect. 2 — Cockpit/Engine Pre-Start Checks, Safety Checks",
    groups: [
      {
        heading: "Safety checks",
        steps: [
          { left: "1", right: <>Pedals and seats — Adjust</> },
          { left: "2", right: <>Seat belt — Fasten and adjust</> },
          { left: "3", right: <>Circuit breakers — All engaged</> },
          { left: "4", right: <>ECLs — Confirm at FLIGHT</> },
          { left: "5", right: <>All switches — OFF or closed</> },
          { left: "6", right: <>ENG 1 and 2 MODE switches — OFF</> },
          { left: "7", right: <>ELT switch on instrument panel — Confirm ARM</> },
          { left: "8", right: <>LDG GEAR lever — Confirm DOWN</> },
          { left: "9", right: <>External power unit (if used) — Connect and switch ON</> },
          { left: "11", right: <>BATTERY MASTER — ON</> },
          { left: "12", right: <>★ BATTERY MAIN and AUX — ON</> },
          { left: "14", right: <>★ GEN 1 &amp; 2 — ON</> },
          { left: "15", right: <>★ BUS TIE — AUTO</> },
          { left: "17", right: <>★ ANTI-COLL lights switch — ON, confirm functioning</> },
          { left: "24", right: <>PARK BRAKE — Pull and turn handle, press pedals until PARK BRAKE ON advisory illuminates</> },
          { left: "26–27", right: <>FORCE TRIM and CLTV/YAW TRIM switches — ON</> },
          { left: "29", right: <>LD-SH switch — TORQUE</> },
          { left: "30", right: <>AFCS — Confirm not engaged</> },
          { left: "33", right: <>Flight controls — Push ELEC PUMP on HYD panel; carry out cyclic, collective and yaw pedal full and free check, one control at a time; centralize cyclic on PFD indicator; then ELEC HYD PUMP OFF</> },
          { left: "34", right: <>HYD SOV switch — Centred and guarded</> },
          { left: "35", right: <>FIRE WARNING TEST — Press BAG, ENG1, ENG2 and confirm all associated visual/audio fire warnings</> },
          { left: "36", right: <>FUEL pushbutton — Confirm fuel test runs automatically, 1(2) FCU TEST FAIL caution not illuminated</> },
          { left: "37", right: <>CHIP DETECTOR pushbuttons — Press ENG 1 then ENG 2, confirm CAS caution and MCL illuminate each time</> },
          { left: "38", right: <>AWG TEST pushbutton — Press momentarily to confirm test message; hold 6 seconds to confirm the full sequence of aural warnings</> },
          { left: "39", right: <>OIL LEVEL pushbuttons — Press MGB, IGB, TGB in turn, confirm each associated CAS caution and MCL illuminate</> },
          { left: "40", right: <>LAMP TEST pushbutton — Press, confirm full set of warning lamps illuminate</> },
          { left: "41–43", right: <>RPM switch — Set 100%; 1 ENG GOV and 2 ENG GOV — AUTO</> },
          { left: "44", right: <>ENG TRIM beep switches — Verify operation, leave engine control levers in FLIGHT position</> },
        ],
      },
    ],
    cautions: [
      "An engine battery start should not be attempted if MAIN BUS 1 voltage is below 23V.",
      "Full and free flight-control check should be carried out with slow displacement of the controls, one control at a time, to avoid overloading the electric hydraulic pump.",
    ],
    notes: [
      "If external power is not available, carry out the ★-marked checks on BATTERY power only, to conserve battery power. Complete the remaining checks after the first engine start.",
      "Both engine control levers should always be operated through the beep switches on the collective control; manual operation is only for ECL FAIL, or to position the lever to FLIGHT before starting.",
    ],
  },
  {
    slug: "engine-starting",
    title: "ENGINE STARTING",
    subtitle: "Normal procedure",
    reference: "RFM Sect. 2 — Engine Starting, Aborted Engine Start, Normal Engine Start",
    warnings: [
      "Failure to follow the abort procedure may cause damage to the engine.",
    ],
    groups: [
      {
        heading: "Aborted engine start — recognize and abort",
        steps: [
          { left: "", right: <>Light-up not within 10 seconds of ENG MODE to IDLE, abnormal noise, ITT beyond limits (HOT START caution), NG stagnation below 54%, main rotor not turning by NG 40%, or starter not disengaged by 49% NG — abort the start</> },
          { left: "1", right: <>ENG MODE switch — OFF (if engine does not shut down, ECL — OFF)</> },
          { left: "2", right: <>FUEL PUMP — OFF</> },
          { left: "3", right: <>ENG FUEL switch — OFF</> },
        ],
      },
      {
        heading: "Normal engine start — Engine 1",
        steps: [
          { left: "1", right: <>ENG 1 FUEL switch — ON, fuel valve indicator bar vertical</> },
          { left: "3", right: <>FUEL PUMP 1 switch — ON, 1 FUEL PUMP caution out, check pressure</> },
          { left: "4", right: <>ENG 1 MODE switch — IDLE</> },
          { left: "5–7", right: <>Gas producer (NG), ITT and engine oil pressure — Note increasing, rising as expected</> },
          { left: "8", right: <>Engine N°1 starter — Disengaged by 49% NG</> },
          { left: "9", right: <>Main hydraulic system — Confirm rise in pressure as the main rotor begins to rotate; cyclic centralized on PFD indicator</> },
          { left: "10", right: <>N1 engine power turbine speed (NF) and rotor speed (NR) — Confirm both stabilized at IDLE speed of 65%±1%</> },
          { left: "11", right: <>Engine and transmission oil — Check pressures and temperatures within limits</> },
          { left: "12", right: <>ENG 1 MODE switch — FLT; confirm GEN 1 ON (reset if required)</> },
        ],
      },
      {
        heading: "Engine 2 start — repeat the sequence for engine N°2",
        steps: [
          { left: "14–15", right: <>ENG 2 FUEL switch — ON; FUEL PUMP 2 switch — ON, check pressure</> },
          { left: "16", right: <>GEN 1 — Check loadmeter in green band (if external power not used)</> },
          { left: "17", right: <>Repeat the normal start sequence above for engine N°2</> },
        ],
      },
      {
        heading: "After both engines running",
        steps: [
          { left: "19–21", right: <>External power — OFF and disconnect if used; GEN 1 and GEN 2 — confirm ON; BUS TIE — confirm AUTO</> },
          { left: "22–24", right: <>RAD MSTR switch — ON; clock — set; rotor speed — confirm 100%</> },
        ],
      },
    ],
    cautions: [
      "Ensure the second engine engages as NF reaches FLIGHT condition. A failed engagement shows as positive NF with near-zero torque — shut down the non-engaged engine first, then the other once stopped. A hard engagement means shut down both engines for maintenance.",
    ],
    notes: [
      "Either engine may be started first; normal starts should be made in AUTO mode.",
      "If engine N°2 is started first, set BUS TIE to ON and confirm MAIN BUS 2 voltage is not below 23V.",
    ],
  },
  {
    slug: "take-off",
    title: "TAKE OFF",
    subtitle: "Category B take off — normal procedure",
    reference: "RFM Sect. 2 — Pre Take-Off Checks, Take Off, Category B Take Off",
    groups: [
      {
        heading: "Pre take-off checks",
        steps: [
          { left: "1", right: <>AFCS — Confirm engaged</> },
          { left: "4–5", right: <>ENG MODE and ECL — Confirm both to FLIGHT</> },
          { left: "6", right: <>TQ LIMiter pushbutton — Push if required (limits combined AEO torque to 228% TQ; OEI limit stays at 160% TQ)</> },
        ],
      },
      {
        heading: "Category B take off",
        steps: [
          { left: "1", right: <>Hover — Establish at 5 ft (1.5 m) AGL. Quartering tail winds (135°–225°) not recommended</> },
          { left: "2", right: <>NOSE WHEEL steering — Confirm LOCK</> },
          { left: "4", right: <>Engines/rotor — Check TQ/ITT matching and NR 100%</> },
          { left: "6", right: <>MFD PWR PLANT page — Check all parameters within normal limits, no matching abnormalities</> },
          { left: "8", right: <>Collective/cyclic — Apply cyclic to commence a 7° nose-down attitude change; at approximately half rotation, apply collective to increase PI to 5% above hover PI</> },
          { left: "9", right: <>Acceleration and climb — Accelerate forward, climb to 50 ft (15 m) at 50 KIAS, continuing up to 80 KIAS</> },
          { left: "10", right: <>Climb — At 80 KIAS (Vy) stabilize and climb smoothly</> },
          { left: "12", right: <>Landing gear — UP by 200 ft (61 m) AGL</> },
        ],
      },
    ],
    notes: [
      "For OAT of -30°C and below, undercarriage retraction time may double.",
    ],
  },
  {
    slug: "approach-and-landing",
    title: "APPROACH AND LANDING",
    subtitle: "Category B landing — normal procedure",
    reference: "RFM Sect. 2 — Pre-Landing Checks, Approach and Landing, Category B Landing",
    groups: [
      {
        heading: "Pre-landing checks",
        steps: [
          { left: "1–2", right: <>RPM switch and NR/NF — Confirm 100%</> },
          { left: "5", right: <>Landing gear lever — DOWN, three green lights on LDG control panel</> },
          { left: "6", right: <>NOSEWHEEL steering — LOCK</> },
        ],
      },
      {
        heading: "Category B landing",
        steps: [
          { left: "2", right: <>AWG switch — NORMAL (the &ldquo;ONE FIFTY FEET&rdquo; voice message activates below 150 ft AGL unless suppressed)</> },
          { left: "3", right: <>Landing direction — Orientate into the prevailing wind if possible</> },
          { left: "4", right: <>Initial point — Reduce airspeed gradually to arrive 200 ft (61 m) above touchdown point, rate of descent no more than 500 fpm; decelerate to 30 KIAS at 50 ft (15 m); at 50 ft rotate nose up to approximately 20° to decelerate</> },
          { left: "5", right: <>Landing — Continue deceleration and descent to hover</> },
          { left: "6", right: <>MFD PWR PLANT page — In hover, check all parameters within normal limits</> },
          { left: "7", right: <>Touch down — Maximum nose-up attitude at touchdown 15°; apply wheel brakes as required</> },
        ],
      },
    ],
    notes: [
      "Recommended approach speed: 120 KIAS for glideslope up to 4°, 100 KIAS for glideslope between 4° and 7.5°.",
      "For OAT of -30°C and below, undercarriage extension time may double.",
    ],
  },
  {
    slug: "engine-and-rotor-shutdown",
    title: "ENGINES AND ROTOR SHUTDOWN",
    subtitle: "Normal procedure",
    reference: "RFM Sect. 2 — Pre-Shutdown Checks, Engines and Rotor Shutdown",
    groups: [
      {
        heading: "Pre-shutdown checks",
        steps: [
          { left: "1", right: <>PARK BRAKE handle — Pull and turn, press pedals until PARK BRK ON advisory illuminates</> },
          { left: "3–5", right: <>Collective — MPOG; cyclic — centralized; pedals — centred</> },
          { left: "6", right: <>AFCS — Confirm disengaged</> },
        ],
      },
      {
        heading: "Engines and rotor shutdown",
        steps: [
          { left: "1", right: <>ENG 1 and 2 MODE switches — Set to IDLE (60 seconds stabilization recommended)</> },
          { left: "3–4", right: <>Fuel PUMP 1 and 2 — OFF; ENG 1 and 2 MODE switches — OFF</> },
          { left: "5–6", right: <>ENG 1 and 2 FUEL valve — OFF; fuel XFEED switch — CLOSED</> },
          { left: "10–11", right: <>BATTERY MASTER and generators — OFF; BATTERY MAIN and AUX — OFF</> },
        ],
      },
    ],
    cautions: [
      "During shutdown, confirm NG decelerates freely without abnormal noise or rapid run-down, and ITT does not rise abnormally.",
      "Ensure engine NG values are at 0% before switching electrical power OFF.",
    ],
  },

  // ---------------------------------------------------------------------
  // EMERGENCY / MALFUNCTION PROCEDURES
  // ---------------------------------------------------------------------
  {
    slug: "single-engine-failure",
    title: "SINGLE ENGINE FAILURE",
    subtitle: "Hover, take off, and cruise",
    reference: "RFM Sect. 3 — Single Engine Failure (Hover / Take Off Category B / Cruise)",
    groups: [
      {
        heading: "In hover (5 to 10 ft)",
        steps: [
          { left: "1", right: <>Collective pitch — Maintain, or lower slightly if required to establish descent</> },
          { left: "2", right: <>Touchdown — Increase collective to cushion landing as touchdown becomes imminent</> },
          { left: "3", right: <>Landing — After touchdown, centralize cyclic, reduce collective to minimum, apply wheel brakes as required</> },
        ],
      },
      {
        heading: "On take off, Category B (rejected take off)",
        steps: [
          { left: "1", right: <>Collective pitch — Reduce as necessary to maintain rotor RPM if altitude permits</> },
          { left: "2", right: <>Cyclic — Make a partial flare to reduce ground speed; limit flare to 15° when close to the ground</> },
          { left: "3", right: <>Collective pitch — Apply to cushion touchdown</> },
          { left: "4", right: <>Landing — After touchdown, centralize cyclic and simultaneously reduce collective to minimum</> },
          { left: "5", right: <>Brakes — Apply wheel brakes to minimize ground roll</> },
        ],
      },
      {
        heading: "During cruise",
        steps: [
          { left: "1", right: <>Collective — Adjust to maintain rotor RPM and torque within limits</> },
          { left: "2", right: <>Cyclic — Establish Safe OEI flight</> },
          { left: "3", right: <>Collective — Re-adjust to minimize altitude loss, applying up to maximum OEI power</> },
          { left: "4", right: <>Engine restart — Consider if the cause of the initial failure has been determined and corrected (see Engine Restart in Flight)</> },
          { left: "5", right: <>Engine — If restart fails or is not attempted, carry out Engine Shutdown in an Emergency</> },
        ],
      },
    ],
  },
  {
    slug: "single-engine-landing",
    title: "SINGLE ENGINE LANDING",
    subtitle: "Category B — emergency procedure",
    reference: "RFM Sect. 3 — Single Engine Landing Category B",
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>Pre-landing checks — Establish normal approach and carry out pre-landing checks</> },
          { left: "2", right: <>Landing direction — Orientate into the prevailing wind</> },
          { left: "3", right: <>Initial point — Reduce airspeed gradually to arrive 200 ft (61 m) above touchdown point, rate of descent no more than 500 fpm; decelerate to 30 KIAS at 50 ft (15 m); at 50 ft rotate nose up to a maximum of 20° to decelerate</> },
          { left: "4", right: <>Collective — Continue deceleration to running touchdown or hover; use collective to cushion touchdown; maximum nose-up attitude on touchdown 15°</> },
          { left: "5", right: <>Landing — After touchdown, centralize cyclic and reduce collective to minimum</> },
          { left: "6", right: <>Braking — Apply wheel brakes as required</> },
        ],
      },
    ],
  },
  {
    slug: "double-engine-failure-autorotation",
    title: "DOUBLE ENGINE FAILURE & AUTOROTATIVE LANDING",
    subtitle: "Land and water — emergency procedure",
    reference: "RFM Sect. 3 — Double Engine Failure, Entry in Autorotation, Autorotative Landing (Land / Water)",
    intro: (
      <>
        A sequential or simultaneous failure of both engines requires entry into autorotation. A simultaneous
        failure produces a large, rapid drop in rotor speed requiring an immediate, decisive collective pitch
        adjustment. At considerable height AGL there may be time to attempt an engine restart — roughly 3000 to
        4000 ft AGL is needed (at an average 2500 fpm autorotative sink rate) to complete a restart attempt safely.
      </>
    ),
    warnings: [
      "Over water: height estimation errors are considerable — use the radar altimeter for height cues during descent.",
    ],
    cautions: [
      "At high touchdown speeds over water, gyroscopic effects may cause the aircraft to roll and turn left after touchdown if allowed to pitch down rapidly — be ready to correct.",
      "If the landing gear cannot be retracted before ditching, ditch with minimum forward speed.",
    ],
    groups: [
      {
        heading: "Autorotative landing procedure — land",
        steps: [
          { left: "1", right: <>Collective pitch — Smoothly and rapidly reduce to enter autorotation</> },
          { left: "2", right: <>Cyclic — Adjust to obtain autorotation between 80 KIAS (min rate of descent) and 100 KIAS (best range)</> },
          { left: "3", right: <>Collective pitch — Adjust to obtain up to 110% NR</> },
          { left: "4", right: <>Landing gear — Extend</> },
          { left: "5", right: <>Landing site — Select and manoeuvre into wind</> },
          { left: "6–8", right: <>Brief cabin/occupants; verify radar altimeter working; broadcast Mayday if time permits</> },
          { left: "9", right: <>Shutdown — If appropriate and time available, carry out Emergency/Post Crash Shutdown</> },
          { left: "10", right: <>Cyclic — At approximately 200 ft (61 m) AGL, initiate a flare to a maximum 30° nose-up</> },
          { left: "11", right: <>Collective pitch — Adjust to maintain NR at 110% maximum during the flare</> },
          { left: "12", right: <>Cyclic/collective — At approximately 35 ft (15 m) AGL, reduce to 10° nose-up and apply collective to achieve touchdown at ~300 fpm or less</> },
          { left: "13", right: <>Touchdown speed — As required (maximum 60 kt paved, 40 kt grass)</> },
          { left: "14–15", right: <>Collective pitch — Lower promptly after touchdown; apply wheel brakes as required</> },
          { left: "16–17", right: <>Shutdown if not already carried out, then evacuate the aircraft as soon as possible</> },
        ],
      },
      {
        heading: "Autorotative landing procedure — water",
        steps: [
          { left: "1–3", right: <>Collective/cyclic — Enter autorotation, adjust for 80–100 KIAS and up to 110% NR</> },
          { left: "4", right: <>Landing gear — Confirm UP</> },
          { left: "5–9", right: <>Select landing direction into wind, brief occupants, verify radar altimeter, select windscreen wipers FAST, broadcast Mayday if time permits</> },
          { left: "11", right: <>Flare — At approximately 200 ft (61 m) AGL, initiate a flare to a maximum 30° nose-up</> },
          { left: "12–13", right: <>Adjust collective to maintain NR at 110% maximum; at ~35 ft (15 m) AGL reduce to 10° nose-up, aim for ~300 fpm or less at touchdown</> },
          { left: "14", right: <>Waves — Approach into oncoming waves if possible, depending on sea state</> },
          { left: "15", right: <>Touchdown speed — Not exceeding 30 kt</> },
          { left: "16–18", right: <>Lower collective promptly, shutdown if not already carried out, evacuate with survival equipment</> },
        ],
      },
    ],
    notes: [
      "If ENG 2 is to be started first during a restart attempt, the BUS TIE switch must be selected ON.",
    ],
  },
  {
    slug: "engine-fire",
    title: "ENGINE BAY FIRE",
    subtitle: "Ground and flight — emergency procedure",
    reference: "RFM Sect. 3 — Fire, Engine Bay Fire (Ground / Flight)",
    cautions: [
      "In case of a subsequent fire in the other engine bay, the initial ARM 1(2) pushbutton must be deselected to allow operation of the ARM 2(1) pushbutton.",
    ],
    groups: [
      {
        heading: "1(2) ENG FIRE — on ground",
        steps: [
          { left: "", right: <>Confirm engine FIRE light ON on ECL</> },
          { left: "", right: <>On affected engine: ENG MODE switch to IDLE, confirm engine FIRE, ECL to OFF</> },
          { left: "", right: <>Lift FIRE/ARM guard and press illuminated pushbutton</> },
          { left: "", right: <>Set FIRE EXTING switch to BTL1</> },
          { left: "", right: <>ENG MODE switch OFF, fuel PUMP OFF, FUEL switch OFF, XFEED CLOSED</> },
          { left: "", right: <>If fire warning clears — carry out Emergency/Post Crash Shutdown</> },
          { left: "", right: <>If fire warning persists — set FIRE EXTING switch to BTL2</> },
        ],
      },
      {
        heading: "1(2) ENG FIRE — in flight",
        steps: [
          { left: "", right: <>Confirm engine FIRE light ON on ECL; achieve safe OEI flight</> },
          { left: "", right: <>On affected engine: ENG MODE switch to IDLE, confirm engine FIRE, ECL to OFF</> },
          { left: "", right: <>Lift FIRE/ARM guard and press illuminated pushbutton</> },
          { left: "", right: <>Set FIRE EXTING switch to BTL1</> },
          { left: "", right: <>When conditions permit: ENG MODE switch OFF, fuel PUMP OFF, FUEL switch OFF, XFEED CLOSED</> },
          { left: "", right: <>If fire warning clears: deselect FIRE/ARM pushbutton, land as soon as possible</> },
          { left: "", right: <>If fire warning persists: set FIRE EXTING switch to BTL2</> },
          { left: "", right: <>If warning then clears — land as soon as possible. If it persists — LAND IMMEDIATELY and carry out Emergency/Post Crash Shutdown</> },
        ],
      },
      {
        heading: "Engine exhaust fire after shutdown",
        steps: [
          { left: "1", right: <>Fire warnings — Confirm not illuminated</> },
          { left: "2–3", right: <>ENG GOV switch — MAN; ENGINE IGN circuit breaker — Out</> },
          { left: "4–6", right: <>BUS TIE ON (for ENG 2 only); ECL — OFF; press ECL starter pushbutton</> },
          { left: "7–8", right: <>Note NG increasing; push starter pushbutton to stop when ITT decrease is noted (not more than 45 seconds)</> },
          { left: "9", right: <>Once rotors stopped — evacuate aircraft</> },
        ],
      },
    ],
    notes: [
      "When XFEED is CLOSED, the affected engine fuel tank retains up to 228 kg of unusable fuel — this can be made available via XFEED OPEN and fuel PUMP ON if the pilot is sure the fire is contained.",
    ],
  },
  {
    slug: "cabin-and-baggage-fire",
    title: "COCKPIT / CABIN / BAGGAGE BAY FIRE",
    subtitle: "Ground and flight — emergency procedure",
    reference: "RFM Sect. 3 — Cockpit/Cabin Fire (Ground/Flight), Baggage Bay Fire",
    intro: (
      <>
        No single set of detailed procedures can address every fire scenario. On the ground, the most urgent
        action is to get the aircraft shut down and evacuated immediately; in flight, the priority is landing as soon
        as possible with a reasonable degree of safety.
      </>
    ),
    cautions: [
      "If a fire is not completely extinguished, increased ventilation may aggravate the problem.",
    ],
    groups: [
      {
        heading: "Cockpit/cabin fire — on ground",
        steps: [
          { left: "", right: <>Declare an emergency</> },
          { left: "", right: <>Carry out Emergency/Post Crash Shutdown</> },
          { left: "", right: <>Evacuate aircraft at the earliest opportunity</> },
        ],
      },
      {
        heading: "Cockpit/cabin fire — in flight",
        steps: [
          { left: "", right: <>Declare an emergency, prepare to land as soon as possible, select VENT CREW FAN OFF</> },
          { left: "", right: <>If fire source is determined — use on-board hand-held extinguisher to fight fire</> },
          { left: "", right: <>If fire is extinguished — increase ventilation, land as soon as possible</> },
          { left: "", right: <>If fire persists after fighting, or source cannot be determined — LAND IMMEDIATELY and carry out Emergency/Post Crash Shutdown</> },
        ],
      },
      {
        heading: "Baggage bay fire (BAG FIRE)",
        steps: [
          { left: "", right: <>On ground — carry out Emergency/Post Crash Shutdown directly</> },
          { left: "", right: <>In flight — check BAG illuminated on FIRE EXTING panel; carry out a lamp check if not illuminated</> },
          { left: "", right: <>If illuminated — select VENT CREW FAN HIGH, VENT PAX ON</> },
          { left: "", right: <>No smoke in cabin, warning may be spurious — land as soon as practicable</> },
          { left: "", right: <>Smoke in cabin, clearing — land as soon as practicable</> },
          { left: "", right: <>Smoke persisting/increasing — open windows to ventilate cockpit, reduce airspeed below 50 KIAS, release left-side emergency windows, LAND IMMEDIATELY and carry out Emergency/Post Crash Shutdown</> },
        ],
      },
    ],
  },
  {
    slug: "electrical-fire-smoke",
    title: "ELECTRICAL FIRE / SMOKE",
    subtitle: "Ground and flight — emergency procedure",
    reference: "RFM Sect. 3 — Electrical Fire/Smoke (Ground/Flight)",
    intro: (
      <>
        An electrical fire is indicated by a smell of burning insulation and/or acrid smoke. Unnecessary electrical
        equipment must be switched off while investigating the source; if the source cannot be positively
        identified (CAS display or circuit-breaker panel) and isolated, carry out the full de-electrification sequence
        below.
      </>
    ),
    warnings: [
      "Whenever ESS BUS 2 voltage drops below 22V (yellow range) or fluctuates, carry out the associated recovery actions immediately, whether or not the smoke has cleared.",
    ],
    groups: [
      {
        heading: "On ground",
        steps: [
          { left: "", right: <>Carry out Emergency/Post Crash Shutdown</> },
        ],
      },
      {
        heading: "In flight",
        steps: [
          { left: "", right: <>Reduce speed (recommended Vy); open windows to ventilate cockpit; land as soon as possible if conditions permit</> },
          { left: "", right: <>Right pilot select on-side radio/com (N°2); switch pilot UTILITY light ON for night ops</> },
          { left: "", right: <>Set MFD to PWR PLANT page to monitor ESS BUS 2 voltage continuously</> },
          { left: "", right: <>Switch GEN 1 &amp; GEN 2 OFF, then BATTERY MAIN OFF (loses NON-ESS BUS 1 &amp; 2, MAIN 1 &amp; 2 — AP2/ATT remain engaged)</> },
          { left: "", right: <>If smoke clears — switch GEN 1 &amp; 2 ON, BATTERY MASTER OFF, BATTERY AUX OFF, re-engage AP1, land as soon as practicable</> },
          { left: "", right: <>If smoke does not clear — land as soon as possible; if severe — LAND IMMEDIATELY and carry out Emergency/Post Crash Shutdown</> },
          { left: "", right: <>To re-establish power: switch BATTERY MAIN ON — if smoke reappears, switch it back OFF and plan to land within 30 minutes (see Extended Flight Endurance After Double DC Generator Failure)</> },
          { left: "", right: <>If MAIN BUS 1 restored cleanly: switch GEN 1 ON to restore MAIN BUS 2 — if smoke reappears, switch GEN 1 OFF, BATTERY MAIN OFF, re-engage AP1, land within 30 minutes</> },
        ],
      },
    ],
  },
  {
    slug: "engine-shutdown-emergency",
    title: "ENGINE SHUTDOWN IN AN EMERGENCY",
    subtitle: "Includes Emergency / Post Crash Shutdown",
    reference: "RFM Sect. 3 — Engine Shutdown in Emergency, Emergency/Post Crash Shutdown",
    cautions: [
      "Care should be taken in confirming the failed engine before commencing this shutdown procedure.",
      "If there is evidence of combustion after an in-flight engine shutdown, carry out the dry motoring procedure as required to extinguish any possible fire.",
    ],
    groups: [
      {
        heading: "Engine shutdown in an emergency (single engine)",
        steps: [
          { left: "1", right: <>ENG MODE switch — OFF (if engine does not shut down, ECL — OFF)</> },
          { left: "2", right: <>FUEL PUMP switch — OFF, unless required for crossfeed</> },
          { left: "3", right: <>ENG FUEL switch — OFF, fuel valve indicator horizontal</> },
          { left: "4", right: <>Fuel contents — Monitor, use crossfeed as required</> },
        ],
      },
      {
        heading: "Emergency / post crash shutdown (both engines)",
        steps: [
          { left: "1", right: <>ENG MODE 1 &amp; 2 switches — OFF (if engine does not shut down, ECL 1 &amp; 2 — OFF)</> },
          { left: "2–3", right: <>FUEL PUMP 1 &amp; 2 switches — OFF; ENG FUEL 1 &amp; 2 switches — OFF</> },
          { left: "4–5", right: <>ENG 1 &amp; 2 FIRE ARM pushbuttons — Lift guard and press if required; FIRE EXTING switch — BTL 1 and/or 2 if required</> },
          { left: "6", right: <>Once rotor stopped: GEN 1 &amp; 2 and BATT MASTER switches — OFF using gang-bar</> },
        ],
      },
    ],
  },
  {
    slug: "tail-rotor-failures",
    title: "TAIL ROTOR SYSTEM FAILURES",
    subtitle: "Drive failure, control system failure, control binding",
    reference: "RFM Sect. 3 — Tail Rotor System Failures",
    intro: (
      <>
        Three distinct tail rotor failure modes present differently at the pedals: a drive failure gives pedals that
        are free but ineffective with a rapid yaw right; a control circuit failure gives pedals free but ineffective or
        partially effective, with yaw direction depending on airspeed/torque; control binding gives seized pedals
        requiring excessive force, with yaw driven by collective changes.
      </>
    ),
    groups: [
      {
        heading: "Tail rotor drive failure — in hover",
        steps: [
          { left: "", right: <>Lower collective to LAND IMMEDIATELY, maintaining attitude and minimizing lateral translation with cyclic</> },
          { left: "", right: <>Retard ENG MODE switches (or ECLs) to OFF if time available</> },
        ],
      },
      {
        heading: "Tail rotor drive failure — in forward flight",
        steps: [
          { left: "", right: <>Lower collective immediately to minimize yaw right</> },
          { left: "", right: <>Establish an airspeed/power/roll angle sufficient to reach a suitable landing site</> },
          { left: "", right: <>At the landing site, assess running-landing capability; if not possible with suitable power/speed, shut down engines and carry out an engine-off landing</> },
        ],
      },
      {
        heading: "Tail rotor control system failure — low hover",
        steps: [
          { left: "", right: <>Lower collective to LAND IMMEDIATELY, maintaining attitude and minimizing lateral translation with cyclic</> },
          { left: "", right: <>If rapid yaw right develops — retard ENG MODE switches (or ECLs) to OFF if time available</> },
        ],
      },
      {
        heading: "Tail rotor control system failure — forward flight/high hover",
        steps: [
          { left: "", right: <>Gently and progressively apply left pedal to assess response; if none, cautiously assess right pedal instead</> },
          { left: "", right: <>No response, or responds right but not left with backlash — pitch has floated to zero thrust: set up a rate of descent aligning the nose to the flight path, reduce speed, expect a low-speed rotating landing, retard ENG MODE switches (or ECLs) to OFF at low level and cushion touchdown</> },
          { left: "", right: <>Responds to both pedals but slowly — likely a mechanical AFCS yaw actuator disconnect; an IGE hover may be possible; depending on weight/altitude/wind, a power-on running landing may be carried out</> },
        ],
      },
      {
        heading: "Tail rotor control binding — low hover",
        steps: [
          { left: "", right: <>Lower collective to LAND IMMEDIATELY, maintaining attitude and minimizing lateral translation with cyclic</> },
          { left: "", right: <>Do not retard ECLs unless a severe right yaw occurs — a powered landing is safer than autorotation with binding tail rotor pitch</> },
        ],
      },
      {
        heading: "Tail rotor control binding — forward flight/high hover",
        steps: [
          { left: "", right: <>High power climb/hover (high TR thrust) — high power, low speed approach keeping nose left; power-on landing keeping the aircraft aligned; reduce collective and select ENG MODE OFF on touchdown</> },
          { left: "", right: <>High power cruise (moderate TR thrust) — keep nose left during approach; running landing at ~20 kt raising collective to straighten the nose; select ENG MODE OFF as aircraft touches down</> },
          { left: "", right: <>Descent/low power cruise (low TR thrust) — set up a rate of descent aligning nose to flight path; expect a low-speed yawing landing; select ENG MODE OFF at low level and cushion touchdown</> },
        ],
      },
    ],
    warnings: [
      "If a binding occurs in the main rotor control circuit, greater force will be required to operate the controls and the low-speed flight envelope may be restricted.",
    ],
    cautions: [
      "Do not attempt to apply maximum pedal effort against a binding — a more serious malfunction could result.",
      "Premature reduction of airspeed to low values during a control-binding approach may result in loss of directional control when increasing collective.",
    ],
    notes: [
      "Landing into wind is beneficial in most tail rotor failure scenarios; the specific favorable wind quadrant differs by failure mode — see the full RFM procedure for the exact case.",
    ],
  },
  {
    slug: "double-dc-generator-failure",
    title: "DOUBLE DC GENERATOR FAILURE",
    subtitle: "Includes extended flight endurance guidance",
    reference: "RFM Sect. 3 — Electrical System, Double DC Generator Failure, Extended Flight Endurance",
    groups: [
      {
        heading: "Double DC generator failure (1-2 DC GEN)",
        steps: [
          { left: "", right: <>Select both DC generator switches to OFF, then select one DC generator switch to ON</> },
          { left: "", right: <>Caption clears — that generator is back on line; assume the other has failed and leave it OFF</> },
          { left: "", right: <>Caption remains — that generator has failed, switch OFF; select the other generator ON</> },
          { left: "", right: <>If the caption clears on the second attempt — generator back on line, continue flight, monitor DC load</> },
          { left: "", right: <>If the caption remains on both — double DC generator failure confirmed; both switches OFF</> },
          { left: "", right: <>Right pilot select on-side radio/com (N°2); land as soon as possible (within 30 minutes) or refer to Extended Flight Endurance</> },
        ],
      },
      {
        heading: "Extended flight endurance after confirmed double failure",
        steps: [
          { left: "", right: <>Confirm BATTERY MAIN switch OFF; select FUEL XFEED CLOSED; FUEL PUMP 1 and 2 switches OFF</> },
          { left: "", right: <>On RCP, select PLT switch to PFD ONLY</> },
          { left: "", right: <>Night flight, OAT ≤4°C: confirm LT panels and POSITION LIGHTS off as applicable, PITOT HEATER 2 ON — land within 57 minutes</> },
          { left: "", right: <>Night flight, OAT &gt;4°C: PITOT HEATER OFF — land within 62 minutes</> },
          { left: "", right: <>Day flight, OAT ≤4°C: PITOT HEATER 2 ON — land within 66 minutes</> },
          { left: "", right: <>Day flight, OAT &gt;4°C: PITOT HEATER OFF — land within 75 minutes</> },
        ],
      },
    ],
    cautions: [
      "If MAIN BUS 1 power is required, BATTERY MAIN may be switched ON to supply it, reducing battery endurance to a maximum of 17 minutes — further reduced if BUS TIE is also ON.",
      "After a double DC generator failure with BATTERY MAIN OFF, do not use the ELEC and HYD synoptic pages.",
    ],
    notes: [
      "Endurance figures assume VHF2 transmission limited to a maximum of 1 minute every 15 minutes. The landing light can be turned on for 3 minutes before landing regardless of the endurance case.",
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
          { left: "", right: <>Confirm hydraulic pressure low (below 163 bar) on the hydraulic synoptic page; check the hydraulic control panel</> },
          { left: "", right: <>If HYD 1 PRESS illuminated — land as soon as practicable, aware fuel consumption will be increased due to lowered undercarriage</> },
          { left: "", right: <>If HYD 2 PRESS illuminated — on the LDG GEAR panel, lower the landing gear, then lift the EMER DOWN guard and press; land as soon as practicable</> },
        ],
      },
    ],
    notes: [
      "With one hydraulic system operating, taxi at 5 kt or less and carry out turns carefully.",
      "After EMER DOWN is selected, the amber lights stay illuminated even with gear down until the LDG GEAR lever is moved to DOWN. After landing, EMER DOWN must be de-selected to unlock the nosewheel steering.",
    ],
  },
];

export function findAW139Procedure(slug: string): ProcedureDefinition | undefined {
  return AW139_PROCEDURES.find((p) => p.slug === slug);
}
