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

// All content is from the Robinson R22 Pilot's Operating Handbook, Section 3
// (Emergency Procedures) and Section 4 (Normal Procedures). For training use only.
export const R22_PROCEDURES: ProcedureDefinition[] = [
  // ---------------------------------------------------------------------
  // NORMAL PROCEDURES (Section 4)
  // ---------------------------------------------------------------------
  {
    slug: "daily-or-preflight-checks",
    title: "DAILY OR PREFLIGHT CHECKS",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Daily or Preflight Checks",
    intro: (
      <>
        Remove ground handling wheels, covers and tiedowns; clear even small accumulations of frost, ice or snow,
        especially from the rotor blades. Check maintenance records for airworthiness. Look for fretting at rivets and
        seams (fine black powder on aluminium, reddish-brown or black residue on steel), verify Telatemps show no
        unexplained temperature rise, and check that torque stripes on critical fasteners are unbroken before working
        through the station-by-station checks.
      </>
    ),
    cautions: [
      "Do not pull down on blades to teeter the rotor — to lower a blade, push up on the opposite blade.",
      "Verify erosion on the lower surface of the main rotor blades has not exposed the skin-to-spar bond line.",
      "For helicopters with removable controls, remove the left-seat controls if the person in that seat is not a rated helicopter pilot.",
      "When flying solo, fill the left baggage compartment to capacity before using the right; avoid objects that could injure an occupant if a seat collapses in a hard landing.",
      "Shorter pilots may need a cushion for full control travel — verify aft cyclic travel is not restricted.",
    ],
    groups: [
      {
        heading: "1 — Cowl doors",
        steps: [
          { left: "", right: <>Battery switch ON; oil pressure and alternator lights ON; push the warning-light test switches to test; check EMU status (if installed); check fuel quantity gages; battery switch OFF.</> },
          { left: "", right: <>Aux fuel tank quantity checked, filler cap tight, tank and fuel lines no leaks; fuel tank sump drain(s) sampled.</> },
          { left: "", right: <>Gearbox oil full, no leaks; rotor brake actuation normal; flex coupling no cracks and nuts secure; yoke flanges no cracks; gearbox Telatemp normal; sprag clutch no leaks; static source clear.</> },
          { left: "", right: <>Control rod ends free without looseness; steel tube frame no cracks; all fasteners secure; tail rotor control no interference; cowl doors latched.</> },
        ],
      },
      {
        heading: "2 — Engine right side",
        steps: [
          { left: "", right: <>Carb air ducts and carb heat scoop secure; engine sheet metal no cracks; electrical terminals tight; fuel line no leaks; oil cooler door checked; oil lines no leaks or chafing; exhaust system no cracks.</> },
          { left: "", right: <>V-belt condition checked, slack 1.5 in (4 cm) maximum; sprag clutch and upper bearing no leaks; upper-bearing Telatemp normal; upper sheave condition checked; lower sheave groove wear smooth and uniform.</> },
          { left: "", right: <>Flex coupling no cracks and nuts secure; yoke flanges no cracks; steel tube frame no cracks; tail rotor control no interference.</> },
        ],
      },
      {
        heading: "3 — Engine rear",
        steps: [
          { left: "", right: <>Cooling fan nut pin in line with the marks; cooling fan and fan scroll no cracks; lower-bearing Telatemps normal; lower bearing no leaks.</> },
        ],
      },
      {
        heading: "4 — Empennage",
        steps: [
          { left: "", right: <>Tail surfaces no cracks; fasteners secure; position light checked.</> },
        ],
      },
      {
        heading: "5 — Tail rotor",
        steps: [
          { left: "", right: <>Gearbox Telatemp normal; gearbox oil visible, no leaks; blades clean, no damage or cracks; pitch links no looseness.</> },
          { left: "", right: <>Teeter bearings condition checked; teeter bearing bolt does not rotate; control bellcrank free without looseness.</> },
        ],
      },
      {
        heading: "6 — Tailcone",
        steps: [
          { left: "", right: <>Skins no cracks or dents; strobe light condition checked; antenna checked.</> },
        ],
      },
      {
        heading: "7 — Engine left side",
        steps: [
          { left: "", right: <>Engine oil 4–6 qt; oil filter (if installed) secure, no leaks; fuel lines no leaks; gascolator drain sampled; throttle linkage operable.</> },
          { left: "", right: <>Battery and relay secure (if located here); alternator belt tension checked; steel tube frame and engine sheet metal no cracks; exhaust system no cracks; engine general condition checked.</> },
        ],
      },
      {
        heading: "8 — Main fuel tank",
        steps: [
          { left: "", right: <>Quantity checked; filler cap tight; no leakage.</> },
        ],
      },
      {
        heading: "9 — Main rotor",
        steps: [
          { left: "", right: <>Blades clean, no damage or cracks; pitch change boots no leaks; main hinge bolts have cotter pins installed.</> },
          { left: "", right: <>All rod ends free without looseness; all fasteners secure; swashplate scissors no excessive looseness.</> },
        ],
      },
      {
        heading: "10 — Fuselage left side",
        steps: [
          { left: "", right: <>Baggage compartment checked; removable controls secure if installed; collective control clear; seat belt condition checked and fastened.</> },
          { left: "", right: <>Door unlocked and latched; door hinge safety pins installed; landing gear checked; position light checked.</> },
        ],
      },
      {
        heading: "11 — Nose section",
        steps: [
          { left: "", right: <>Pitot tube clear; windshield condition and cleanliness checked; landing lights checked; yaw string checked.</> },
        ],
      },
      {
        heading: "12 — Fuselage right side",
        steps: [
          { left: "", right: <>Landing gear checked; position light checked; door hinge safety pins installed; baggage compartment checked.</> },
        ],
      },
      {
        heading: "13 — Cabin interior",
        steps: [
          { left: "", right: <>Loose articles removed or stowed; seat belt condition checked; instruments, switches and controls condition checked; clock functioning.</> },
          { left: "", right: <>Be sure the rotor blades are approximately level to avoid a possible tailcone strike.</> },
        ],
      },
    ],
  },
  {
    slug: "before-starting-engine",
    title: "BEFORE STARTING ENGINE",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Before Starting Engine",
    groups: [
      {
        steps: [
          { left: "", right: <>Seat belts — fastened.</> },
          { left: "", right: <>Fuel shut-off valve — ON.</> },
          { left: "", right: <>Cyclic / collective friction — OFF; cyclic, collective and pedals — full travel free; throttle — full travel free.</> },
          { left: "", right: <>Collective — full down, friction ON. Cyclic — neutral, friction ON. Pedals — neutral.</> },
          { left: "", right: <>Rotor brake — disengaged.</> },
          { left: "", right: <>Circuit breakers — in.</> },
          { left: "", right: <>Carb heat — OFF.</> },
          { left: "", right: <>Mixture — full rich; mixture guard — installed (not used with a vernier mixture control on the console face).</> },
          { left: "", right: <>Primer (if installed) — down and locked.</> },
          { left: "", right: <>Landing lights — OFF; avionics switch (if installed) — OFF.</> },
          { left: "", right: <>Clutch — disengaged.</> },
          { left: "", right: <>Altimeter — set.</> },
          { left: "", right: <>Governor switch — ON.</> },
        ],
      },
    ],
  },
  {
    slug: "starting-engine-and-run-up",
    title: "STARTING ENGINE AND RUN-UP",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Starting Engine and Run-Up",
    cautions: [
      "For aircraft that provide the low RPM horn through the audio system, a headset for each pilot is required to hear the horn.",
      "Avoid continuous operation at 60–70 % rotor speed to minimise tail resonance.",
      "On slippery surfaces, be prepared to counter nose-right rotation with left pedal as the governor increases RPM.",
    ],
    groups: [
      {
        heading: "Start",
        steps: [
          { left: "1", right: <>Throttle twists for priming — as required; throttle — closed.</> },
          { left: "2", right: <>Battery and strobe switches — ON; area — clear.</> },
          { left: "3", right: <>Ignition switch — Start, then Both. Starter-On light — out.</> },
          { left: "4", right: <>Set engine RPM 50–60 %.</> },
          { left: "5", right: <>Clutch switch — engaged; blades turning in less than 5 seconds.</> },
          { left: "6", right: <>Alternator switch — ON. Oil pressure 25 psi minimum within 30 seconds.</> },
          { left: "7", right: <>Avionics and headsets — ON; audio alert (if equipped) — test.</> },
        ],
      },
      {
        heading: "Run-up",
        steps: [
          { left: "1", right: <>Wait for the clutch light to go out; circuit breakers — in.</> },
          { left: "2", right: <>Warm-up RPM 70–75 %; engine gages green.</> },
          { left: "3", right: <>Mag drop at 75 % RPM: 7 % maximum, within 2 seconds.</> },
          { left: "4", right: <>Carb heat — check CAT rise/drop, set as required.</> },
          { left: "5", right: <>Sprag clutch check — needles split.</> },
          { left: "6", right: <>Doors (if installed) — closed and latched. Limit MAP chart — check.</> },
          { left: "7", right: <>Cyclic / collective friction — OFF.</> },
          { left: "8", right: <>Governor ON, increase throttle — RPM 102–104 %. Warning lights — out.</> },
          { left: "9", right: <>Lift collective slightly and reduce RPM — verify horn/light at 97 %.</> },
        ],
      },
    ],
  },
  {
    slug: "takeoff-and-cruise",
    title: "TAKEOFF, CRUISE & DOORS-OFF",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Takeoff Procedure, Cruise, Doors-Off Operation",
    cautions: [
      "In turbulence, reduce power and use a slower than normal cruise speed; if turbulence becomes significant or uncomfortable, use 60–70 KIAS.",
      "Exercise extreme care never to inadvertently pull the mixture control — engine stoppage will result.",
      "In-flight leaning with the mixture control is not recommended; there is no propeller to keep the engine turning if overleaning occurs.",
    ],
    groups: [
      {
        heading: "Takeoff",
        steps: [
          { left: "1", right: <>Verify doors latched, governor ON, and RPM stabilised at 102–104 %.</> },
          { left: "2", right: <>Clear the area. Slowly raise collective until light on the skids; reposition cyclic as required for equilibrium, then gently lift into a hover.</> },
          { left: "3", right: <>Check gages in the green and adjust carb heat if required.</> },
          { left: "4", right: <>Lower the nose and accelerate to climb speed following the height-velocity diagram. If RPM drops below 102 %, lower collective.</> },
        ],
      },
      {
        heading: "Cruise",
        steps: [
          { left: "1", right: <>Adjust carb heat if required.</> },
          { left: "2", right: <>Verify RPM near the top of the green arc.</> },
          { left: "3", right: <>Set manifold pressure as desired with collective; observe MAP and airspeed limits.</> },
          { left: "4", right: <>Pull the RT TRIM knob.</> },
          { left: "5", right: <>Verify gages in the green and warning lights out.</> },
        ],
      },
      {
        heading: "Doors-off operation",
        steps: [
          { left: "", right: <>Avoid removing the left door to protect the tail rotor from loose objects. If the left door must be removed, warn the passenger to secure loose objects and keep head and arms inside the cabin.</> },
        ],
      },
    ],
  },
  {
    slug: "practice-autorotation",
    title: "PRACTICE AUTOROTATION & CARBURETOR HEAT",
    subtitle: "Power recovery, with ground contact, use of carb heat",
    reference: "POH Sect. 4 — Practice Autorotation (Power Recovery / With Ground Contact), Use of Carburetor Heat",
    warnings: [
      "The R22 has a light, low-inertia rotor system. Most of the energy for an autorotation is stored in the forward momentum of the aircraft, not in the rotor — a well-timed cyclic flare is required and rotor RPM must be kept in the green until just before ground contact.",
    ],
    cautions: [
      "To avoid inadvertent engine stoppage, never chop the throttle to simulate a power failure — always roll it off smoothly. Recover immediately if the engine is rough or engine RPM continues to drop.",
      "Simulated engine failures require prompt lowering of the collective — catastrophic rotor stall could occur if rotor RPM ever drops below 80 % plus 1 % per 1000 ft of altitude.",
      "The pilot may be unaware of carburetor ice forming because the governor automatically increases throttle to hold MAP and RPM — apply carb heat whenever icing conditions are suspected.",
    ],
    groups: [
      {
        heading: "Practice autorotation — power recovery",
        steps: [
          { left: "1", right: <>Adjust carb heat if required.</> },
          { left: "2", right: <>Lower collective to the down stop and reduce throttle as desired for tachometer needle separation.</> },
          { left: "3", right: <>Adjust collective to keep rotor RPM within limits; adjust throttle for needle separation.</> },
          { left: "4", right: <>Keep airspeed 60–70 KIAS.</> },
          { left: "5", right: <>At about 40 ft AGL, begin cyclic flare to reduce rate of descent and forward speed.</> },
          { left: "6", right: <>At about 8 ft AGL, apply forward cyclic to level the aircraft and raise collective to control descent; add throttle if required to keep RPM in the green arc.</> },
        ],
      },
      {
        heading: "Practice autorotation — with ground contact",
        steps: [
          { left: "", right: <>Perform as for a power-recovery autorotation except: prior to the cyclic flare, roll the throttle off into the overtravel spring and hold it against the hard stop until the autorotation is complete (this prevents the throttle correlator from adding power when collective is raised).</> },
          { left: "", right: <>Always contact the ground with skids level and nose straight ahead.</> },
        ],
      },
      {
        heading: "Use of carburetor heat",
        steps: [
          { left: "", right: <>Carburetor ice is most likely when OAT is between −4 °C and 30 °C and the OAT–dew point spread is less than 15 C°.</> },
          { left: "", right: <>During run-up: use full carb heat during warm-up to preheat the induction system.</> },
          { left: "", right: <>During takeoff, climb and cruise: use carb heat as required to keep the CAT gage out of the yellow arc.</> },
          { left: "", right: <>During descent and autorotation: below 18 in. MAP apply full carb heat regardless of CAT indication — the gage is unreliable there.</> },
        ],
      },
    ],
    notes: [
      "The governor is inactive below 80 % engine RPM regardless of the governor switch position.",
      "When entering autorotation from above 4000 ft, reduce throttle slightly before lowering collective to prevent engine overspeed.",
      "On R22s with the O-360 engine, a carb heat assist device correlates carb heat with collective position — lowering collective adds heat, raising it reduces heat; a friction clutch lets the pilot override it.",
    ],
  },
  {
    slug: "descent-approach-and-landing",
    title: "DESCENT, APPROACH & LANDING",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Descent, Approach, and Landing; Shutdown Procedure",
    cautions: [
      "Do not initiate a descent with forward cyclic — this can produce a low-G condition. Always initiate a descent by lowering collective.",
      "When landing on a slope, return cyclic to neutral before reducing rotor RPM.",
      "Never leave the flight controls unattended while the engine is running.",
      "Hold the throttle closed if a passenger is entering or exiting with the engine running and the left-seat collective installed.",
    ],
    groups: [
      {
        steps: [
          { left: "1", right: <>Reduce power with collective as desired; adjust carb heat as required; observe airspeed limits.</> },
          { left: "2", right: <>Make the final approach into wind at the lowest practical rate of descent with an initial airspeed of 60 KIAS.</> },
          { left: "3", right: <>Reduce airspeed and altitude smoothly to a hover — be sure the rate of descent is less than 300 fpm before reducing airspeed below 30 KIAS.</> },
          { left: "4", right: <>From the hover, lower collective gradually until ground contact.</> },
          { left: "5", right: <>After initial ground contact, lower collective to the full-down position.</> },
        ],
      },
    ],
  },
  {
    slug: "shutdown-procedure",
    title: "SHUTDOWN PROCEDURE",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Shutdown Procedure",
    cautions: [
      "Do not slow the rotor by raising collective during shutdown — the blades may flap and strike the tailcone.",
    ],
    groups: [
      {
        steps: [
          { left: "1", right: <>Collective down, RPM 70–75 %, friction ON; cyclic and pedals neutral, friction ON.</> },
          { left: "2", right: <>After the CHT drop, throttle — closed.</> },
          { left: "3", right: <>Clutch switch — disengage.</> },
          { left: "4", right: <>Wait 30 seconds, then mixture — OFF; mixture guard — back on the mixture.</> },
          { left: "5", right: <>Wait 30 seconds, then apply the rotor brake. Clutch light — extinguishes.</> },
          { left: "6", right: <>Avionics, alternator, battery and ignition switches — OFF.</> },
        ],
      },
    ],
    notes: [
      "If ambient temperature is above 100 °F (38 °C), cool down at 70–75 % RPM for at least one minute before reducing to idle.",
      "During idle and after shutdown, uncover one ear and listen for unusual noise that may indicate an impending bearing or component failure.",
    ],
  },

  // ---------------------------------------------------------------------
  // EMERGENCY PROCEDURES (Section 3)
  // ---------------------------------------------------------------------
  {
    slug: "power-failure-and-autorotation",
    title: "POWER FAILURE & AUTOROTATION",
    subtitle: "Above 500 ft, 8–500 ft, below 8 ft AGL",
    reference: "POH Sect. 3 — Power Failure, Maximum Glide Distance Configuration, Air Restart Procedure",
    intro: (
      <>
        A power failure may be an engine or a drive-system failure and is usually indicated by the low RPM horn. An
        engine failure may show as a change in noise level, nose-left yaw, an oil pressure light, or decreasing engine
        RPM. A drive-system failure may show as an unusual noise or vibration, nose yaw, or decreasing rotor RPM while
        engine RPM is increasing. In every case, immediately lower the collective to enter autorotation.
      </>
    ),
    cautions: [
      "Aft cyclic is required when collective is lowered at high airspeed.",
      "Do not apply aft cyclic during touchdown or ground slide — this could cause a blade strike to the tailcone.",
      "Increase rotor RPM to 97 % minimum when autorotating below 500 ft AGL.",
      "Do not attempt a restart if an engine malfunction is suspected or before a safe autorotation is established.",
    ],
    groups: [
      {
        heading: "Power failure above 500 ft AGL",
        steps: [
          { left: "1", right: <>Lower collective immediately to maintain rotor RPM.</> },
          { left: "2", right: <>Establish a steady glide at approximately 65 KIAS (for maximum glide distance, see below).</> },
          { left: "3", right: <>Adjust collective to keep RPM between 97 and 110 %, or apply full down collective if light weight prevents attaining above 97 %.</> },
          { left: "4", right: <>Select a landing spot and, if altitude permits, manoeuvre so the landing will be into wind.</> },
          { left: "5", right: <>A restart may be attempted at the pilot&apos;s discretion if sufficient time is available.</> },
          { left: "6", right: <>If unable to restart, turn unnecessary switches and the fuel valve off.</> },
          { left: "7", right: <>At about 40 ft AGL, begin cyclic flare to reduce rate of descent and forward speed.</> },
          { left: "8", right: <>At about 8 ft AGL, apply forward cyclic to level the ship and raise collective just before touchdown to cushion the landing. Touch down level with nose straight ahead.</> },
        ],
      },
      {
        heading: "Power failure between 8 ft and 500 ft AGL",
        steps: [
          { left: "1", right: <>Lower collective immediately to maintain rotor RPM.</> },
          { left: "2", right: <>Adjust collective to keep RPM between 97 and 110 %, or apply full down collective if light weight prevents attaining above 97 %.</> },
          { left: "3", right: <>Maintain airspeed until the ground is approached, then begin cyclic flare to reduce rate of descent and forward speed.</> },
          { left: "4", right: <>At about 8 ft AGL, apply forward cyclic to level the ship and raise collective just before touchdown. Touch down level with nose straight ahead.</> },
        ],
      },
      {
        heading: "Power failure below 8 ft AGL",
        steps: [
          { left: "1", right: <>Apply right pedal as required to prevent yawing.</> },
          { left: "2", right: <>Allow the aircraft to settle.</> },
          { left: "3", right: <>Raise collective just before touchdown to cushion the landing.</> },
        ],
      },
      {
        heading: "Maximum glide distance configuration",
        steps: [
          { left: "", right: <>Airspeed approximately 75 KIAS; rotor RPM approximately 90 %. Best glide ratio is about 4:1, or one nautical mile per 1500 ft AGL. Increase rotor RPM to 97 % minimum when autorotating below 500 ft AGL.</> },
        ],
      },
      {
        heading: "Air restart procedure",
        steps: [
          { left: "1", right: <>Mixture — full rich.</> },
          { left: "2", right: <>Primer (if installed) — down and locked.</> },
          { left: "3", right: <>Throttle — closed, then cracked slightly.</> },
          { left: "4", right: <>Actuate the starter with the left hand.</> },
        ],
      },
    ],
  },
  {
    slug: "emergency-water-landing",
    title: "EMERGENCY WATER LANDING",
    subtitle: "Power off & power on",
    reference: "POH Sect. 3 — Emergency Water Landing (Power Off / Power On)",
    groups: [
      {
        heading: "Power off",
        steps: [
          { left: "1", right: <>Follow the same procedure as a power failure over land until contacting the water. If time permits, unlatch the doors prior to water contact.</> },
          { left: "2", right: <>Apply lateral cyclic when the aircraft contacts the water to stop the rotors.</> },
          { left: "3", right: <>Release the seat belt and quickly clear the aircraft once the rotors stop.</> },
        ],
      },
      {
        heading: "Power on",
        steps: [
          { left: "1", right: <>Descend to a hover above the water.</> },
          { left: "2", right: <>Unlatch the doors.</> },
          { left: "3", right: <>Passenger exits the aircraft.</> },
          { left: "4", right: <>Fly to a safe distance from the passenger to avoid possible rotor injury.</> },
          { left: "5", right: <>Battery and alternator switches — OFF.</> },
          { left: "6", right: <>Roll the throttle off into the overtravel spring.</> },
          { left: "7", right: <>Keep the aircraft level and apply full collective as it contacts the water.</> },
          { left: "8", right: <>Apply lateral cyclic to stop the rotors.</> },
          { left: "9", right: <>Release the seat belt and quickly clear the aircraft once the rotors stop.</> },
        ],
      },
    ],
  },
  {
    slug: "loss-of-tail-rotor-thrust",
    title: "LOSS OF TAIL ROTOR THRUST",
    subtitle: "Forward flight & hover",
    reference: "POH Sect. 3 — Loss of Tail Rotor Thrust (Forward Flight / Hover)",
    groups: [
      {
        heading: "In forward flight",
        steps: [
          { left: "1", right: <>Immediately enter autorotation.</> },
          { left: "2", right: <>Maintain at least 70 KIAS if practical.</> },
          { left: "3", right: <>Select a landing site, roll the throttle off into the overtravel spring, and perform an autorotation landing.</> },
        ],
      },
      {
        heading: "In hover",
        steps: [
          { left: "1", right: <>Immediately roll the throttle off into the overtravel spring and allow the aircraft to settle.</> },
          { left: "2", right: <>Raise collective just before touchdown to cushion the landing.</> },
        ],
      },
    ],
    notes: [
      "Both failures are usually indicated by nose-right yaw that cannot be corrected (forward flight) or stopped (hover) with left pedal.",
      "When no suitable landing site is available, the vertical stabilizers may permit limited controlled flight at low power and airspeeds above 70 KIAS — enter full autorotation before reducing airspeed below that.",
    ],
  },
  {
    slug: "engine-and-electrical-fire",
    title: "ENGINE FIRE & ELECTRICAL FIRE",
    subtitle: "Start on ground, in flight, electrical fire",
    reference: "POH Sect. 3 — Engine Fire During Start on Ground, Engine Fire in Flight, Electrical Fire in Flight",
    cautions: [
      "The low RPM warning system and governor are inoperative with the battery and alternator switches both off.",
    ],
    groups: [
      {
        heading: "Engine fire during start on ground",
        steps: [
          { left: "1", right: <>Cranking — continue and attempt to start, which would suck flames and excess fuel into the engine.</> },
          { left: "2", right: <>If the engine starts, run at 50–60 % RPM for a short time.</> },
          { left: "3", right: <>Fuel mixture — OFF.</> },
          { left: "4", right: <>Fuel valve — OFF.</> },
          { left: "5", right: <>Battery switch — OFF.</> },
          { left: "6", right: <>If time permits, apply the rotor brake to stop the rotors.</> },
          { left: "7", right: <>Exit the helicopter.</> },
        ],
      },
      {
        heading: "Engine fire in flight",
        steps: [
          { left: "1", right: <>Enter autorotation.</> },
          { left: "2", right: <>Cabin heat — OFF (if installed and time permits).</> },
          { left: "3", right: <>Cabin vent — ON (if time permits).</> },
          { left: "4", right: <>If the engine is running, perform a normal landing then fuel mixture OFF and fuel valve OFF. If the engine stops running, fuel valve OFF and complete the autorotation landing.</> },
          { left: "5", right: <>Battery switch — OFF.</> },
          { left: "6", right: <>If time permits, apply the rotor brake to stop the rotors.</> },
          { left: "7", right: <>Exit the helicopter.</> },
        ],
      },
      {
        heading: "Electrical fire in flight",
        steps: [
          { left: "1", right: <>Battery and alternator switches — OFF.</> },
          { left: "2", right: <>Open the cabin vents.</> },
          { left: "3", right: <>Land immediately.</> },
          { left: "4", right: <>Fuel mixture OFF and fuel valve OFF.</> },
          { left: "5", right: <>If time permits, apply the rotor brake to stop the rotors.</> },
          { left: "6", right: <>Exit the helicopter.</> },
        ],
      },
    ],
  },
  {
    slug: "tachometer-and-governor-failure",
    title: "HEADSET AUDIO, TACHOMETER & GOVERNOR FAILURES",
    subtitle: "Headset audio failure, tachometer failure, governor failure",
    reference: "POH Sect. 3 — Headset Audio Failure, Tachometer Failure, Governor Failure",
    cautions: [
      "For aircraft that provide the low RPM horn through the audio system, the pilot will not hear the horn with a failed headset.",
    ],
    groups: [
      {
        heading: "Headset audio failure",
        steps: [
          { left: "", right: <>If headset audio fails, land as soon as practical.</> },
        ],
      },
      {
        heading: "Tachometer failure",
        steps: [
          { left: "", right: <>If a rotor or engine tach malfunctions in flight, use the remaining tach to monitor RPM. If it is not clear which tach is malfunctioning, or if both malfunction, allow the governor to control RPM and land as soon as practical.</> },
        ],
      },
      {
        heading: "Governor failure",
        steps: [
          { left: "", right: <>If the engine RPM governor malfunctions, grip the throttle firmly to override the governor, then switch the governor off. Complete the flight using manual throttle control.</> },
        ],
      },
    ],
    notes: [
      "Each tach, the governor and the low RPM horn are on separate power circuits. A special circuit allows the battery to supply power to the tachs with the battery and alternator switches both off.",
    ],
  },
  {
    slug: "warning-caution-lights-and-audio-alerts",
    title: "WARNING/CAUTION LIGHTS & AUDIO ALERTS",
    subtitle: "Light-by-light reference, audio alerts, turbulence recovery",
    reference: "POH Sect. 3 — Warning/Caution Lights, Audio Alerts, Information per FAA AD 95-26-04",
    groups: [
      {
        heading: "Engine & fuel",
        steps: [
          { left: "OIL", right: <>Loss of engine power or oil pressure. Check the engine tach for power loss; check the oil pressure gage and, if pressure loss is confirmed, land immediately — continued operation without oil pressure causes serious engine damage and possible engine failure.</> },
          { left: "LOW FUEL", right: <>Approximately 1 gal usable remaining (all-aluminium tanks) or 1.5 gal (bladder tanks) — fuel exhaustion in about 5 minutes at cruise power (aluminium) or 10 minutes (bladder). Do not use as a working fuel-quantity indication.</> },
        ],
      },
      {
        heading: "Drive system",
        steps: [
          { left: "MR TEMP", right: <>Excessive main rotor gearbox temperature. If accompanied by noise, vibration or temperature rise, land immediately; otherwise land as soon as practical.</> },
          { left: "MR CHIP", right: <>Metallic particles in the main rotor gearbox — same guidance as MR TEMP.</> },
          { left: "TR CHIP", right: <>Metallic particles in the tail rotor gearbox — same guidance as MR TEMP. Break-in fuzz will occasionally activate chip lights.</> },
          { left: "CLUTCH", right: <>Clutch actuator circuit is on (engaging or disengaging). Never take off before the light goes out. If it flickers or comes on in flight and does not go out within 10 seconds, pull the CLUTCH circuit breaker and land as soon as practical; reduce power and land immediately if there are other drive-system symptoms.</> },
          { left: "BRAKE", right: <>Rotor brake is engaged — release immediately in flight or before starting the engine.</> },
        ],
      },
      {
        heading: "Electrical, rotor speed & throttle",
        steps: [
          { left: "ALT", right: <>Low voltage and possible alternator failure. Turn off nonessential electrical equipment and cycle ALT off then on after one second to reset the control unit. If the light stays on, land as soon as practical — continued flight without an alternator can cause loss of power to the tachometers.</> },
          { left: "STARTER ON", right: <>Starter motor is engaged. If the light does not go out when the ignition switch is released from Start, immediately pull the mixture off and turn the battery switch off; have the starter serviced.</> },
          { left: "LOW RPM", right: <>Rotor speed below 97 % RPM. Immediately lower collective, roll throttle on and, in forward flight, apply aft cyclic. Disabled when the collective is full down.</> },
          { left: "GOV OFF", right: <>Engine RPM governor is switched off.</> },
          { left: "FULL THROTTLE (if installed)", right: <>Engine near full throttle — the governor cannot increase throttle to maintain RPM. Lower collective as required to extinguish the light.</> },
        ],
      },
      {
        heading: "Cabin & rotor brake",
        steps: [
          { left: "CARBON MONOXIDE (if installed)", right: <>Elevated CO levels in the cabin. Shut off the heater and open the nose and door vents. If hovering, land or transition to forward flight. If symptoms of CO poisoning (headache, drowsiness, dizziness) accompany the light, land immediately.</> },
        ],
      },
      {
        heading: "Audio alerts",
        steps: [
          { left: "LOW RPM HORN", right: <>Activates with the LOW RPM caution light — rotor speed below 97 % RPM. To restore RPM, lower collective, roll throttle on and, in forward flight, apply aft cyclic. Horn and light are disabled with the collective full down.</> },
          { left: "HIGH RPM WARBLE", right: <>On later aircraft, a warble (high/low tone) indicates rotor speed approaching the 110 % RPM limit. Raise collective as required to control RPM.</> },
        ],
      },
      {
        heading: "Turbulence & low-G recovery (AD 95-26-04)",
        steps: [
          { left: "", right: <>Right roll in a low-G condition: gradually apply aft cyclic to restore positive G and main rotor thrust. Do not apply lateral cyclic until positive G is established.</> },
          { left: "", right: <>Uncommanded pitch, roll or yaw from turbulence: gradually apply controls to maintain rotor RPM, positive G and zero sideslip. Minimise cyclic inputs; do not overcontrol.</> },
          { left: "", right: <>Inadvertent encounter with moderate, severe or extreme turbulence: if isolated, depart the area; otherwise land as soon as practical.</> },
        ],
      },
    ],
    notes: [
      "If a light causes excessive glare at night, the bulb may be unscrewed or the circuit breaker pulled to eliminate glare during landing.",
      "For chip lights with no other symptoms: if no metal chips or slivers are found on the detector plug, clean and reinstall (refill the tail rotor gearbox with new oil) and hover for at least 30 minutes — replace the gearbox before further flight if the light returns.",
    ],
  },
];

export function findR22Procedure(slug: string): ProcedureDefinition | undefined {
  return R22_PROCEDURES.find((p) => p.slug === slug);
}
