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

export const R44_PROCEDURES: ProcedureDefinition[] = [
  // ---------------------------------------------------------------------
  // NORMAL PROCEDURES
  // ---------------------------------------------------------------------
  {
    slug: "daily-preflight-check",
    title: "DAILY OR PREFLIGHT CHECKS",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Daily or Preflight Checks",
    intro: (
      <>
        Remove ground handling wheels, covers and tiedowns; clear frost, ice or snow, especially from the rotor blades.
        Check general condition, fretting at rivets/seams, Telatemp indicators and torque stripes before working through
        the 14 station-by-station checks below.
      </>
    ),
    cautions: [
      "Do not pull down on blades to teeter the rotor — to lower a blade, push up on the opposite blade.",
      "Verify erosion on the lower surface of the main rotor blades has not exposed the skin-to-spar bond line.",
      "Fill baggage compartments under unoccupied seats to capacity before using compartments under occupied seats; avoid objects that could injure an occupant in a hard landing.",
      "Ensure all doors are unlocked before flight to allow rescue or exit in an emergency.",
      "Remove left seat controls if the person in that seat is not a rated helicopter pilot.",
    ],
    groups: [
      {
        heading: "1 — Upper forward cowl doors, right side",
        steps: [
          { left: "", right: <>Battery switch ON; oil pressure, alt and aux fuel pump lights ON; push warning light test switches to test; check fuel gages; battery switch OFF.</> },
          { left: "", right: <>Aux fuel tank quantity checked, filler cap tight, no leaks; fuel lines no leaks; fuel tank sump and gascolator drains sampled.</> },
          { left: "", right: <>Gearbox oil full, no leaks; hydraulic system fluid full, no leaks; rotor brake actuation normal.</> },
          { left: "", right: <>Flex coupling — no cracks, nuts secure; yoke flanges no cracks; gearbox/hydraulic pump Telatemps normal.</> },
          { left: "", right: <>Control rod ends free without looseness; steel tube frame no cracks; all fasteners secure; tail rotor control no interference.</> },
        ],
      },
      {
        heading: "2 — Main rotor",
        steps: [
          { left: "", right: <>Blades clean, no damage or cracks; pitch change boots no leaks; main hinge bolts have cotter pins installed.</> },
          { left: "", right: <>All rod ends free without looseness; all fasteners secure; swashplate scissors no excessive looseness; upper forward cowl doors latched.</> },
        ],
      },
      {
        heading: "3 — Lower cowl door, right side",
        steps: [
          { left: "", right: <>Air box and duct secure; engine sheet metal no cracks; fuel lines no leaks; oil lines no leaks or chafing.</> },
          { left: "", right: <>Exhaust system no cracks; throttle linkage operable; cowl door latched.</> },
        ],
      },
      {
        heading: "4 — Aft cowl door, right side",
        steps: [
          { left: "", right: <>Oil cooler door and V-belt condition checked; V-belt slack 1.5 in (4 cm) maximum; sprag clutch and upper bearing no leaks; Telatemp normal.</> },
          { left: "", right: <>Sheave condition checked; flex coupling no cracks, nuts secure; yoke flanges no cracks; steel tube frame no cracks.</> },
          { left: "", right: <>Tail rotor control no interference; tailcone attachment bolts checked; cowl door latched.</> },
        ],
      },
      {
        heading: "5 — Engine rear",
        steps: [{ left: "", right: <>Cooling fan nut pin in line with marks; cooling fan and fan scroll no cracks; tailpipe hanger no cracks.</> }],
      },
      {
        heading: "6 — Empennage",
        steps: [{ left: "", right: <>Tail surfaces no cracks; fasteners secure; position light checked; tail rotor guard no cracks.</> }],
      },
      {
        heading: "7 — Tail rotor",
        steps: [
          { left: "", right: <>Gearbox Telatemp normal, oil visible, no leaks; blades clean, no damage or cracks; pitch links no looseness.</> },
          { left: "", right: <>Teeter bearings checked, teeter bearing bolt does not rotate; control bellcrank free without looseness.</> },
        ],
      },
      {
        heading: "8 — Tailcone",
        steps: [{ left: "", right: <>Skins no cracks or dents; strobe light condition checked; antenna checked.</> }],
      },
      {
        heading: "9 — Cowl door, left side",
        steps: [
          { left: "", right: <>Engine oil 7–9 qts; oil filter secure, no leaks; battery and relay secure (if located here).</> },
          { left: "", right: <>Steel tube frame no cracks; engine sheet metal no cracks; exhaust system no cracks; cowl door latched.</> },
        ],
      },
      {
        heading: "10 — Main fuel tank",
        steps: [{ left: "", right: <>Quantity checked; filler cap tight; no leakage.</> }],
      },
      {
        heading: "11 — Fuselage, left side",
        steps: [
          { left: "", right: <>Baggage compartments checked; removable controls secure if installed; collective controls clear.</> },
          { left: "", right: <>Seat belts checked and fastened; doors unlocked and latched, hinge safety pins installed.</> },
          { left: "", right: <>Landing gear checked; position light checked; static port clear.</> },
        ],
      },
      {
        heading: "12 — Nose section",
        steps: [{ left: "", right: <>Pitot tube clear; windshield condition and cleanliness checked; landing lights checked; yaw string checked.</> }],
      },
      {
        heading: "13 — Fuselage, right side",
        steps: [
          { left: "", right: <>Baggage compartments checked; seat belts checked and fastened; aft door unlocked and latched, hinge safety pins installed.</> },
          { left: "", right: <>Landing gear checked; position light checked; static port clear.</> },
        ],
      },
      {
        heading: "14 — Cabin interior",
        steps: [
          { left: "", right: <>Loose articles removed or stowed; instruments, switches and controls condition checked; clock functioning; adjustable pedal pins secure.</> },
        ],
      },
    ],
  },
  {
    slug: "before-starting-and-engine-start",
    title: "BEFORE STARTING ENGINE & ENGINE START",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Before Starting Engine, Engine Starting Tips, Starting Engine and Run-Up",
    groups: [
      {
        heading: "Before starting engine",
        steps: [
          { left: "", right: <>Seat belts fastened; fuel shut-off valve ON; cyclic/collective friction OFF; cyclic, collective and pedals full travel free; throttle full travel free.</> },
          { left: "", right: <>Collective full down, friction ON; cyclic neutral, friction ON; pedals neutral; rotor brake disengaged; circuit breakers in.</> },
          { left: "", right: <>Landing lights OFF; avionics switch OFF (if installed); clutch disengaged; altimeter set; HYD and governor switches ON.</> },
        ],
      },
      {
        heading: "Starting engine and run-up",
        steps: [
          { left: "", right: <>Throttle closed; battery and strobe switches ON; area clear; mixture rich; ignition switch to Prime then Both.</> },
          { left: "", right: <>Mixture pull OFF; engage starter until engine fires; mixture move full rich; install mixture guard; confirm Starter-On light out.</> },
          { left: "", right: <>Set engine RPM 50–60%; engage clutch switch (blades turning in less than 5 seconds); alternator switch ON; confirm oil pressure ≥25 psi within 30 seconds.</> },
          { left: "", right: <>Avionics and headsets ON; test annunciator panel (if equipped) — all lights on; test audio alert (if equipped).</> },
          { left: "", right: <>Wait for clutch light out, circuit breakers in; warm up at 60–70% RPM; confirm engine gages green.</> },
          { left: "", right: <>Mag drop at 75% RPM — 7% maximum in 2 seconds; sprag clutch check — needles split; doors closed and latched (if installed).</> },
          { left: "", right: <>Check limit MAP chart; cyclic/collective friction OFF; check hydraulic system.</> },
          { left: "", right: <>Governor ON, increase throttle to RPM 101–102%; confirm warning lights out; lift collective slightly and reduce RPM — confirm horn/light activate at 97%.</> },
        ],
      },
    ],
    notes: [
      "Prime 3 to 5 seconds after the fuel pump caution light extinguishes. If the engine does not fire after 5–7 seconds of cranking, repeat the priming sequence. If it fails to start after three attempts, allow the starter to cool for ten minutes.",
      "For a hot engine, running the fuel pump for 30 seconds with mixture OFF before starting can help cool the fuel in the lines.",
      "With hydraulics OFF, expect about half an inch of freeplay before control stiffness and feedback; with hydraulics ON, controls should be free with no feedback or uncommanded motion.",
    ],
    cautions: [
      "On slippery surfaces, be prepared to counter nose-right rotation with left pedal as the governor increases RPM.",
    ],
  },
  {
    slug: "takeoff-and-cruise",
    title: "TAKEOFF PROCEDURE, DOORS-OFF & CRUISE",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Takeoff Procedure, Doors-Off Operation, Cruise",
    groups: [
      {
        heading: "Takeoff procedure",
        steps: [
          { left: "1", right: <>Verify doors latched, governor and hydraulics ON, and RPM stabilized at 101–102%.</> },
          { left: "2", right: <>Clear the area; slowly raise collective until the aircraft is light on skids; reposition cyclic for equilibrium, then gently lift into a hover.</> },
          { left: "3", right: <>Check gages in the green and note hover MAP.</> },
          { left: "4", right: <>Lower the nose and accelerate to climb speed following the height-velocity diagram profile; avoid exceeding 2 in MAP above IGE hover power. If RPM drops below 101%, lower collective.</> },
        ],
      },
      {
        heading: "Doors-off operation",
        steps: [
          { left: "", right: <>Maximum airspeed with any door(s) off is 100 KIAS. Warn passengers to secure loose objects and keep head/arms inside the cabin.</> },
        ],
      },
      {
        heading: "Cruise",
        steps: [
          { left: "1", right: <>Verify RPM in the green arc.</> },
          { left: "2", right: <>Set manifold pressure as desired with collective, observing MAP and airspeed limits; maximum recommended cruise speed is 110 KIAS.</> },
          { left: "3", right: <>Verify gages in the green and warning lights out.</> },
        ],
      },
    ],
    cautions: [
      "Ensure all seat belts are buckled during door-off flight — unrestrained rear seat bottoms may lift, and items in baggage compartments could be blown out.",
      "Flight with left door(s) removed is not recommended — loose objects exiting a left door may damage the tail rotor.",
      "Do not exceed 110 KIAS except in smooth air, and then only with caution; use 60–70 KIAS in significant turbulence.",
      "In-flight leaning with the mixture control is not allowed — mixture must be full rich during flight.",
    ],
    notes: ["When loaded near the aft CG limit, a slight yaw oscillation in cruise can be stopped with a small amount of left pedal."],
  },
  {
    slug: "practice-autorotation-and-hydraulics-off",
    title: "PRACTICE AUTOROTATION & HYDRAULICS-OFF TRAINING",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Practice Autorotation (Power Recovery / With Ground Contact), Hydraulics-Off Training",
    groups: [
      {
        heading: "Practice autorotation — power recovery",
        steps: [
          { left: "1", right: <>Lower collective to the down stop and reduce throttle as desired for tachometer needle separation.</> },
          { left: "2", right: <>Adjust collective to keep rotor RPM within limits and adjust throttle for needle separation.</> },
          { left: "3", right: <>Keep airspeed 60–70 KIAS.</> },
          { left: "4", right: <>At about 40 ft AGL, begin cyclic flare to reduce rate of descent and forward speed.</> },
          { left: "5", right: <>At about 8 ft AGL, apply forward cyclic to level the aircraft and raise collective to control descent, adding throttle if required to keep RPM in the green arc.</> },
        ],
      },
      {
        heading: "Practice autorotation — with ground contact",
        steps: [
          { left: "", right: <>Perform as for a power-recovery autorotation, except: prior to the cyclic flare, roll throttle off into the overtravel spring and hold against the hard stop until the autorotation is complete. Always contact the ground with skids level and nose straight ahead.</> },
        ],
      },
      {
        heading: "Hydraulics-off training",
        steps: [
          { left: "", right: <>Simulate a hydraulic system failure using the cyclic-mounted hydraulic switch.</> },
        ],
      },
    ],
    warnings: [
      "To avoid inadvertent engine stoppage, do not chop the throttle to simulate a power failure — always roll it off smoothly, and recover immediately if the engine runs rough or RPM continues to drop.",
      "Simulated engine failures require prompt lowering of collective to avoid dangerously low rotor RPM. Catastrophic rotor stall could occur if rotor RPM drops below 80% plus 1% per 1000 ft of altitude.",
    ],
    notes: [
      "The governor is inactive below 80% engine RPM regardless of governor switch position.",
      "When entering autorotation from above 6000 ft, reduce throttle slightly before lowering collective to prevent engine overspeed.",
      "Have landing gear skid shoes inspected frequently when practicing ground-contact autorotations — rapid wear can occur.",
    ],
    cautions: [
      "With hydraulics switched OFF, controlling the helicopter in a hover may be difficult due to control feedback forces.",
      "Before switching hydraulics from OFF to ON, relax force on cyclic and collective to avoid over-controlling.",
    ],
  },
  {
    slug: "descent-approach-landing",
    title: "DESCENT, APPROACH & LANDING",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Descent, Approach, and Landing",
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>Reduce power with collective as desired, observing airspeed limits; maximum recommended airspeed is 110 KIAS except in smooth air.</> },
          { left: "2", right: <>Make final approach into wind at the lowest practical rate of descent, with an initial airspeed of 60 KIAS.</> },
          { left: "3", right: <>Reduce airspeed and altitude smoothly to a hover; ensure rate of descent is less than 300 fpm before airspeed is reduced below 30 KIAS.</> },
          { left: "4", right: <>From the hover, lower collective gradually until ground contact.</> },
          { left: "5", right: <>After initial ground contact, lower collective to the full-down position.</> },
        ],
      },
    ],
    cautions: [
      "Do not initiate a descent with forward cyclic — this can produce a low-G condition. Always initiate a descent by lowering collective.",
      "When landing on a slope, return cyclic to neutral before reducing rotor RPM.",
      "Never leave the helicopter's flight controls unattended while the engine is running.",
      "Hold the throttle closed if a passenger is entering or exiting with the engine running and the left-seat collective installed.",
    ],
  },
  {
    slug: "shutdown-procedure",
    title: "SHUTDOWN PROCEDURE",
    subtitle: "Normal procedure",
    reference: "POH Sect. 4 — Shutdown Procedure",
    groups: [
      {
        heading: "",
        steps: [
          { left: "", right: <>Collective down, RPM 60–70% — apply friction.</> },
          { left: "", right: <>Cyclic and pedals neutral — apply friction.</> },
          { left: "", right: <>Wait for CHT to drop, then throttle closed.</> },
          { left: "", right: <>Clutch switch — disengage.</> },
          { left: "", right: <>Wait 30 seconds, then mixture OFF.</> },
          { left: "", right: <>Wait 30 seconds, then apply rotor brake.</> },
          { left: "", right: <>Confirm clutch light extinguishes.</> },
          { left: "", right: <>Avionics, alt, battery and ignition switches — OFF.</> },
        ],
      },
    ],
    notes: [
      "If ambient temperature is above 100°F (38°C), cool down at 60–70% RPM for at least one minute before reducing to idle.",
      "During idle and after shutdown, uncover one ear and listen for unusual noise that may indicate an impending bearing or component failure.",
      "Leave the HYD switch ON for startup and shutdown to reduce the chance of an unintentional hydraulics-off liftoff — switch OFF only for the pre-takeoff controls check or hydraulics-off training.",
      "Leave the rotor brake engaged after shutdown to disable the starter buttons and reduce the chance of unintentional starter engagement.",
    ],
    cautions: ["Do not slow the rotor by raising collective during shutdown — blades may flap and strike the tailcone."],
  },

  // ---------------------------------------------------------------------
  // EMERGENCY PROCEDURES
  // ---------------------------------------------------------------------
  {
    slug: "power-failure-and-autorotation",
    title: "POWER FAILURE & AUTOROTATION",
    subtitle: "Above 500 ft, 8–500 ft, below 8 ft AGL",
    reference: "POH Sect. 3 — Power Failure, Maximum Glide/Minimum Rate of Descent, Air Restart",
    intro: (
      <>
        A power failure may be an engine or drive-system failure, usually indicated by the low RPM horn. An engine
        failure may show as a noise change, nose-left yaw, an oil pressure light, or decreasing engine RPM; a drive
        system failure may show as unusual noise/vibration, nose yaw, or decreasing rotor RPM while engine RPM
        increases. Immediately lower collective to enter autorotation and reduce airspeed to power-off V<sub>NE</sub> or below.
      </>
    ),
    cautions: [
      "Aft cyclic is required when collective is lowered at high airspeed.",
      "Do not apply aft cyclic during touchdown or ground slide — this could cause a blade strike to the tailcone.",
      "Increase rotor RPM to 97% minimum when autorotating below 500 ft AGL.",
      "Do not attempt an air restart if engine malfunction is suspected or before safe autorotation is established. Air restarts are not recommended below 2000 ft AGL.",
    ],
    groups: [
      {
        heading: "Above 500 ft AGL",
        steps: [
          { left: "1", right: <>Lower collective immediately to maintain rotor RPM.</> },
          { left: "2", right: <>Establish a steady glide at approximately 70 KIAS.</> },
          { left: "3", right: <>Adjust collective to keep RPM between 97–108%, or apply full down collective if light weight prevents attaining above 97%.</> },
          { left: "4", right: <>Select a landing spot and, if altitude permits, maneuver into wind.</> },
          { left: "5", right: <>A restart may be attempted at the pilot&apos;s discretion if sufficient time is available.</> },
          { left: "6", right: <>If unable to restart, turn unnecessary switches and the fuel valve off.</> },
          { left: "7", right: <>At about 40 ft AGL, begin cyclic flare to reduce rate of descent and forward speed.</> },
          { left: "8", right: <>At about 8 ft AGL, apply forward cyclic to level the ship and raise collective just before touchdown; touch down level with nose straight ahead.</> },
        ],
      },
      {
        heading: "Between 8 ft and 500 ft AGL",
        steps: [
          { left: "1", right: <>Lower collective immediately to maintain rotor RPM.</> },
          { left: "2", right: <>Adjust collective to keep RPM between 97–108%, or apply full down collective if light weight prevents attaining above 97%.</> },
          { left: "3", right: <>Maintain airspeed until the ground is approached, then begin cyclic flare.</> },
          { left: "4", right: <>At about 8 ft AGL, apply forward cyclic to level the ship and raise collective just before touchdown; touch down level with nose straight ahead.</> },
        ],
      },
      {
        heading: "Below 8 ft AGL",
        steps: [
          { left: "1", right: <>Apply right pedal as required to prevent yawing.</> },
          { left: "2", right: <>Allow the rotorcraft to settle.</> },
          { left: "3", right: <>Raise collective just before touchdown to cushion the landing.</> },
        ],
      },
      {
        heading: "Maximum glide distance configuration",
        steps: [
          { left: "", right: <>Airspeed approximately 90 KIAS, rotor RPM approximately 90%. Best glide ratio is about 4.7:1, or one nautical mile per 1300 ft AGL.</> },
        ],
      },
      {
        heading: "Minimum rate of descent configuration",
        steps: [
          { left: "", right: <>Airspeed approximately 55 KIAS, rotor RPM approximately 90%. Minimum rate of descent is about 1350 fpm; glide ratio is about 4:1, or one nautical mile per 1500 ft AGL.</> },
        ],
      },
      {
        heading: "Air restart procedure",
        steps: [
          { left: "1", right: <>Mixture — Off.</> },
          { left: "2", right: <>Throttle — Closed.</> },
          { left: "3", right: <>Starter — Engage.</> },
          { left: "4", right: <>Mixture — Move slowly rich while cranking.</> },
        ],
      },
    ],
  },
  {
    slug: "emergency-water-landing",
    title: "EMERGENCY WATER LANDING",
    subtitle: "Power off & power on",
    reference: "POH Sect. 3 — Emergency Water Landing",
    groups: [
      {
        heading: "Power off",
        steps: [
          { left: "1", right: <>Follow the same procedure as a power failure over land until contacting water; if time permits, unlatch doors prior to water contact.</> },
          { left: "2", right: <>Apply lateral cyclic when the aircraft contacts water to stop the rotors.</> },
          { left: "3", right: <>Release seat belt and quickly clear the aircraft once the rotors stop.</> },
        ],
      },
      {
        heading: "Power on",
        steps: [
          { left: "1", right: <>Descend to a hover above the water.</> },
          { left: "2", right: <>Unlatch doors.</> },
          { left: "3", right: <>Passengers exit the aircraft.</> },
          { left: "4", right: <>Fly to a safe distance from passengers to avoid possible rotor injury.</> },
          { left: "5", right: <>Battery and alternator switches — OFF.</> },
          { left: "6", right: <>Roll throttle off into the overtravel spring.</> },
          { left: "7", right: <>Keep the aircraft level and apply full collective as it contacts water.</> },
          { left: "8", right: <>Apply lateral cyclic to stop the rotors.</> },
          { left: "9", right: <>Release seat belt and quickly clear the aircraft once the rotors stop.</> },
        ],
      },
    ],
  },
  {
    slug: "loss-of-tail-rotor-thrust",
    title: "LOSS OF TAIL ROTOR THRUST",
    subtitle: "Forward flight & hover",
    reference: "POH Sect. 3 — Loss of Tail Rotor Thrust",
    groups: [
      {
        heading: "In forward flight",
        steps: [
          { left: "1", right: <>Immediately enter autorotation.</> },
          { left: "2", right: <>Maintain at least 70 KIAS if practical.</> },
          { left: "3", right: <>Select a landing site, roll throttle off into the overtravel spring, and perform an autorotation landing.</> },
        ],
      },
      {
        heading: "In hover",
        steps: [
          { left: "1", right: <>Immediately roll throttle off into the overtravel spring and allow the aircraft to settle.</> },
          { left: "2", right: <>Raise collective just before touchdown to cushion the landing.</> },
        ],
      },
    ],
    notes: [
      "Both failures are usually indicated by nose-right yaw that cannot be corrected with left pedal.",
      "When no suitable landing site is available, the vertical stabilizers may permit limited controlled flight at low power and airspeeds above 70 KIAS — enter full autorotation before reducing airspeed below that.",
    ],
  },
  {
    slug: "engine-and-electrical-fire",
    title: "ENGINE FIRE & ELECTRICAL FIRE",
    subtitle: "Start on ground, in flight, electrical fire",
    reference: "POH Sect. 3 — Engine Fire During Start, Engine Fire in Flight, Electrical Fire in Flight",
    groups: [
      {
        heading: "Engine fire during start on ground",
        steps: [
          { left: "1", right: <>Cranking — Continue and attempt to start, which would suck flames and excess fuel into the engine.</> },
          { left: "2", right: <>If the engine starts, run at 60–70% RPM for a short time.</> },
          { left: "3", right: <>Fuel mixture — OFF.</> },
          { left: "4", right: <>Fuel valve — OFF.</> },
          { left: "5", right: <>Battery switch — OFF.</> },
          { left: "6", right: <>If time permits, apply rotor brake to stop the rotors.</> },
          { left: "7", right: <>Exit the helicopter.</> },
        ],
      },
      {
        heading: "Engine fire in flight",
        steps: [
          { left: "1", right: <>Enter autorotation.</> },
          { left: "2", right: <>Cabin heat — OFF (if time permits).</> },
          { left: "3", right: <>Cabin vent — ON (if time permits).</> },
          { left: "4", right: <>If the engine is running, perform a normal landing then fuel mixture and fuel valve OFF. If the engine stops running, fuel valve OFF and complete the autorotation landing.</> },
          { left: "5", right: <>Battery switch — OFF.</> },
          { left: "6", right: <>If time permits, apply rotor brake to stop the rotors.</> },
          { left: "7", right: <>Exit the helicopter.</> },
        ],
      },
      {
        heading: "Electrical fire in flight",
        steps: [
          { left: "1", right: <>Battery and alternator switches — OFF.</> },
          { left: "2", right: <>Open cabin vents.</> },
          { left: "3", right: <>Land immediately.</> },
          { left: "4", right: <>Fuel mixture and fuel valve — OFF.</> },
          { left: "5", right: <>If time permits, apply rotor brake to stop the rotors.</> },
          { left: "6", right: <>Exit the helicopter.</> },
        ],
      },
    ],
    notes: ["The low RPM warning system and governor are inoperative with the battery and alternator switches both off."],
  },
  {
    slug: "systems-failures",
    title: "TACHOMETER, HYDRAULIC & GOVERNOR FAILURES",
    subtitle: "Headset audio, tachometer, hydraulic system, governor",
    reference: "POH Sect. 3 — Headset Audio Failure, Tachometer Failure, Hydraulic System Failure, Governor Failure",
    groups: [
      {
        heading: "Headset audio failure",
        steps: [{ left: "", right: <>If headset audio fails, land as soon as practical.</> }],
      },
      {
        heading: "Tachometer failure",
        steps: [
          { left: "", right: <>If a rotor or engine tach malfunctions in flight, use the remaining tach to monitor RPM. If it&apos;s unclear which tach is malfunctioning, or both malfunction, allow the governor to control RPM and land as soon as practical.</> },
        ],
      },
      {
        heading: "Hydraulic system failure",
        steps: [
          { left: "1", right: <>HYD switch — verify ON.</> },
          { left: "2", right: <>If hydraulics are not restored, HYD switch — OFF.</> },
          { left: "3", right: <>Adjust airspeed and flight condition as desired for comfortable control.</> },
          { left: "4", right: <>Land as soon as practical.</> },
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
      "Hydraulic system failure is indicated by heavy or stiff cyclic and collective controls; loss of hydraulic fluid may cause intermittent or vibrating feedback. Control remains normal apart from increased stick forces.",
      "Each tach, the governor and the low RPM horn are on separate power circuits — a special circuit allows the battery to supply the tachs with battery and alternator switches both off.",
    ],
  },
  {
    slug: "warning-caution-lights-and-audio-alerts",
    title: "WARNING/CAUTION LIGHTS & AUDIO ALERTS",
    subtitle: "CWP light-by-light reference",
    reference: "POH Sect. 3 — Warning/Caution Lights, Audio Alerts",
    groups: [
      {
        heading: "Engine & powerplant",
        steps: [
          { left: "OIL", right: <>Loss of engine power or oil pressure. Check the engine tach for power loss; check the oil pressure gage and, if pressure loss is confirmed, land immediately — continued operation without oil pressure causes serious engine damage.</> },
          { left: "ENG FIRE", right: <>Possible fire in the engine compartment — see Engine Fire During Start / In Flight.</> },
          { left: "LOW FUEL", right: <>Approximately three gallons of usable fuel remaining; the engine will run out of fuel after ten minutes at cruise power. Do not use this as a working fuel-quantity indication.</> },
          { left: "AUX FUEL PUMP", right: <>Low auxiliary fuel pump pressure. Land as soon as practical; land immediately if accompanied by erratic engine operation.</> },
          { left: "FUEL FILTER", right: <>Fuel strainer contamination. Land as soon as practical; land immediately if accompanied by the aux fuel pump light or erratic engine operation.</> },
        ],
      },
      {
        heading: "Drive system",
        steps: [
          { left: "MR TEMP", right: <>Excessive main rotor gearbox temperature. Land immediately if accompanied by noise, vibration or temperature rise; otherwise land as soon as practical.</> },
          { left: "MR CHIP", right: <>Metallic particles in the main rotor gearbox. Same guidance as MR TEMP.</> },
          { left: "TR CHIP", right: <>Metallic particles in the tail rotor gearbox. Same guidance as MR TEMP; break-in fuzz can occasionally trigger this light.</> },
          { left: "CLUTCH", right: <>Clutch actuator engaging or disengaging — never take off before the light goes out. If it flickers or stays on in flight for more than 10 seconds, pull the CLUTCH breaker and land as soon as practical; reduce power and land immediately if other drive-system symptoms are present.</> },
          { left: "BRAKE", right: <>Rotor brake is engaged — release immediately in flight or before starting the engine.</> },
        ],
      },
      {
        heading: "Electrical & rotor speed",
        steps: [
          { left: "ALT", right: <>Low voltage / possible alternator failure. Turn off nonessential electrical equipment and cycle ALT off then on after one second to reset the control unit; land as soon as practical if the light stays on.</> },
          { left: "STARTER ON", right: <>Starter motor engaged. If the light doesn&apos;t go out when the starter button is released, immediately pull mixture off and turn the battery switch off; have the starter serviced.</> },
          { left: "LOW RPM (light + horn)", right: <>Rotor speed below 97%. Immediately lower collective, roll throttle on and, in forward flight, apply aft cyclic. Disabled when collective is full down.</> },
          { left: "HIGH RPM WARBLE", right: <>Rotor speed approaching the 108% limit — raise collective as required to control RPM.</> },
          { left: "GOV OFF", right: <>Engine RPM governor is switched off.</> },
        ],
      },
      {
        heading: "Cabin & other",
        steps: [
          { left: "CARBON MONOXIDE", right: <>Elevated CO in the cabin — shut off the heater, open nose and door vents; if hovering, land or transition to forward flight; land immediately if CO-poisoning symptoms (headache, drowsiness, dizziness) accompany the light.</> },
          { left: "FULL THROTTLE (if installed)", right: <>Engine near full throttle — the governor cannot increase throttle further; lower collective as required to extinguish the light.</> },
          { left: "HYD (if installed)", right: <>Hydraulic system is switched off.</> },
        ],
      },
    ],
    notes: [
      "If a light causes excessive glare at night, the bulb may be unscrewed or the circuit breaker pulled to eliminate glare during landing.",
      "For chip lights: if no metal chips or slivers are found on the detector plug, clean and reinstall (refill the tail rotor gearbox with new oil) and hover for at least 30 minutes — replace the gearbox before further flight if the light returns.",
    ],
  },
];

export function findR44Procedure(slug: string): ProcedureDefinition | undefined {
  return R44_PROCEDURES.find((p) => p.slug === slug);
}
