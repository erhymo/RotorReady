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

function b(text: string) {
  return <span className="font-semibold">{text}</span>;
}

export const H145D3_PROCEDURES: ProcedureDefinition[] = [
  {
    slug: "exterior-check",
    title: "EXTERIOR CHECK",
    subtitle: "Normal procedure",
    reference: "FLM BK117 D-3 Sect. 4.3.2 / 4.3.2.1",
    intro: (
      <>
        The exterior check is laid out as a walk-around check, starting forward right at the pilot&apos;s door,
        proceeding clockwise to the tail boom, to the left-hand side, and completed at the helicopter nose area.
      </>
    ),
    image: {
      src: "/training/procedures/pages/h145d3-exterior-check.png",
      alt: "H145 D3 exterior check walk-around sequence diagram",
      caption: "Fig. 4-1 Exterior check sequence — FLM BK117 D-3 Sect. 4.3.2.1",
    },
    groups: [
      {
        heading: "Before exterior check",
        steps: [
          { left: "★", right: <>Helicopter and mission documents — Check, complete</> },
          { left: "★", right: <>Weight, CG — Check</> },
          { left: "", right: <>Fuel tanks / drain valves (5) — Drained (see Sect. 8, para 8.3)</> },
          { left: "★", right: <>Fuselage underside / drain ports — Condition, no fuel / oil leaks</> },
          { left: "★", right: <>Covers and tie-downs — Removed</> },
          { left: "★", right: <>Ice and snow (if any) — Removed</> },
          { left: "★", right: <>Ground handling wheels — Removed</> },
          { left: "★", right: <>Equipment and cargo — Secured</> },
          { left: "", right: <>Hand fire extinguisher(s) — Visual check: condition, secured; check pressure indicator (green area)</> },
        ],
      },
      {
        heading: "Walk-around sequence",
        steps: [
          { left: "1", right: <>Fuselage — Right side</> },
          { left: "2", right: <>Cabin — Roof</> },
          { left: "3", right: <>Tail boom — Aft area</> },
          { left: "4", right: <>Fuselage — Left side</> },
          { left: "5", right: <>Cabin — Front</> },
        ],
      },
    ],
    notes: [
      "Items marked ★ need only be checked before the first flight of the day; unmarked items shall be checked before every flight.",
      "Window curtains on the sliding door and emergency exits (if installed) must be removed if offshore flight is planned.",
      "To avoid excessive drain on the helicopter battery, particularly during cold weather, all ground operations should be conducted using an external power unit (EPU) whenever possible.",
    ],
  },
  {
    slug: "engine-start",
    title: "STARTING ENGINES AND SYSTEM CHECKS",
    subtitle: "Normal procedure",
    reference: "FLM BK117 D-3 Sect. 4.4.1",
    notes: [
      "The fire protection check must be performed at least once a day.",
      "The hydraulic check must be performed at least once a day.",
      "Disconnecting the EPU later in the pre-flight procedure can cause systems and the AFCS to disengage; in that case they must be re-engaged before takeoff.",
    ],
    cautions: [
      "TEST HYD sw must not be operated during flight. Observe mast moment limits during the hydraulic check.",
    ],
    groups: [
      {
        heading: "Pre-start flight control check",
        steps: [
          { left: "1", right: <>AUX PUMP sw — ON (HYD1 AUX PUMP appears); should deliver approx. 80 bar to hydraulic system 1</> },
          { left: "2", right: <>Flight controls — Press TRIM REL sw, check free movement throughout full travel</> },
          { left: "3", right: <>AUX PUMP sw — OFF and guarded (HYD1 AUX PUMP extinguished)</> },
        ],
      },
      {
        heading: "Starting first engine",
        steps: [
          { left: "1", right: <>FUEL PRIME PUMP 1 and 2 sw&apos;s — ON (FUEL1/2 PRIME PUMP ON)</> },
          { left: "2", right: <>Fire guard (if available) — Posted; rotor area — Clear</> },
          { left: "3", right: <>FND ML — Acknowledge; check no ELEC OVERLIMIT</> },
          { left: "4", right: <>ENG 1 or 2 MAIN sw — IDLE, start clock; N1 — Check increase; TOT — Monitor, check increase</> },
          { left: "5", right: <>N2/NR — Monitor increase; engine and MGB oil pressure, hydraulic pressure — Check positive indication</> },
          { left: "6", right: <>At approx. 60% N1 — STARTER ON extinguishes; N2/NR approx. 78% in IDLE mode, check matched</> },
        ],
      },
      {
        heading: "Hydraulic check",
        steps: [
          { left: "1", right: <>TEST HYD sw — SYS1 and hold; check LOW PRESS HYD2; perform small cyclic/collective/pedal movements, check forces</> },
          { left: "2", right: <>TEST HYD sw — SYS2 and hold; check HYD1 LOW PRESS and HYD1 TR SHUT OFF; perform small cyclic/collective/pedal movements, check forces</> },
          { left: "3", right: <>Cyclic TRIM REL sw — Release; TEST HYD sw — Release</> },
        ],
      },
      {
        heading: "Starting second engine",
        steps: [
          { left: "1", right: <>Start second engine following the same procedure as the first</> },
          { left: "2", right: <>FND ML — Check START-UP TST OK</> },
          { left: "3", right: <>EPU (if still connected) — Disconnect</> },
        ],
      },
      {
        heading: "System checks",
        steps: [
          { left: "1", right: <>PT/STATIC HTG COPILOT and PILOT sw&apos;s — ON; STBY BAT and AVIO MSTR 1 and 2 sw&apos;s — ON</> },
          { left: "2", right: <>FUEL PRIME PUMP 1 and 2 sw&apos;s — OFF; FUEL XFER PUMP A and F sw&apos;s — ON</> },
          { left: "3", right: <>Ventilation — Set as required (maximum ventilation required if OAT ≥ +35°C)</> },
          { left: "4", right: <>AFCS/Avionics Pre-flight Test — Perform before each IFR flight, at least once a day before VFR flights</> },
        ],
      },
    ],
  },
  {
    slug: "takeoff",
    title: "PRE-TAKEOFF CHECK, TAKEOFF CHECK AND TAKEOFF",
    subtitle: "Normal procedure",
    reference: "FLM BK117 D-3 Sect. 4.6 / 4.7 / 4.8",
    groups: [
      {
        heading: "Pre-takeoff check",
        steps: [
          { left: "1", right: <>ENG1/2 MAIN sw&apos;s — Check FLIGHT, guards closed; rotor speed — NOMINAL in FLIGHT mode</> },
          { left: "2", right: <>Pressure and temperature indications — Check; cautions, warnings, alerts — Check; fuel quantity — Check</> },
          { left: "3", right: <>IESI — Check aligned, IAS and ALT valid; AP/BCKUP SAS — Check on</> },
        ],
      },
      {
        heading: "Takeoff check",
        steps: [
          { left: "1", right: <>Hover flight — Perform; N2/NR — Check ≥102%; FLI — Check AEO indication</> },
          { left: "2", right: <>Hover power — Check at 4 ft skid height; note position of blue line on FLI</> },
          { left: "3", right: <>All warnings and cautions, ML — Check off</> },
        ],
      },
      {
        heading: "Takeoff",
        steps: [
          { left: "1", right: <>Hover — Perform with 4 ft skid height</> },
          { left: "2", right: <>Acceleration and climb — Start nose-down pitch rotation, simultaneously increase power smoothly (hover power plus 0.5-1.0 FLI, without exceeding TOP)</> },
          { left: "3", right: <>Adjust pitch attitude at about 20 KIAS to achieve 30 KIAS at 15 ft height</> },
          { left: "4", right: <>When reaching 50 KIAS — Maintain airspeed until reaching 50 ft AGL, then accelerate to VY and climb through 100 ft AGL</> },
          { left: "High DA", right: <>Above 7500 ft density altitude, if the &quot;high hover&quot; H-V diagram point is above 300 ft AGL: adjust pitch attitude at 30 KIAS to achieve 40 KIAS at 15 ft height instead</> },
        ],
      },
      {
        heading: "Recommended slope takeoff procedure",
        steps: [
          { left: "1", right: <>A.TRIM sw (APCP) — Press; check A.TRIM OFF (DSAS shown on FND)</> },
          { left: "2", right: <>Collective — Increase gently</> },
          { left: "3", right: <>Mast moment — Simultaneously increase in direction of slope, maintain MM within limits</> },
          { left: "4", right: <>Collective — Continue to increase to lift from slope</> },
          { left: "5", right: <>A.TRIM sw — Press to re-engage</> },
        ],
      },
    ],
  },
  {
    slug: "landing",
    title: "PRE-LANDING CHECK AND LANDING",
    subtitle: "Normal procedure",
    reference: "FLM BK117 D-3 Sect. 4.9 / 4.10",
    notes: ["Prior to landing in sandy conditions, close NACA inlets by selecting recirculated air."],
    groups: [
      {
        heading: "Pre-landing check",
        steps: [
          { left: "1", right: <>All instruments — Check; all warnings, cautions, ML — Check</> },
          { left: "2", right: <>N2/NR — Check increases to ≥102% below 50 KIAS</> },
          { left: "3", right: <>Decision height (DH) — As required</> },
        ],
      },
      {
        heading: "Recommended landing procedure",
        steps: [
          { left: "1", right: <>Approach — Initiate to arrive at 100 ft with a speed of 40 KIAS and a rate of descent of not more than 500 ft/min</> },
          { left: "2", right: <>After reaching 100 ft — Adjust collective pitch to maintain desired rate of descent, gradually slow down aiming for 30 KIAS at 50 ft, then proceed into ground cushion for landing</> },
          { left: "High DA", right: <>Above 7500 ft density altitude, if the &quot;high hover&quot; H-V diagram point is above 300 ft AGL: aim for 40 KIAS at 50 ft, maintain 40 KIAS to 15 ft, then proceed into ground cushion</> },
          { left: "3", right: <>After landing: collective lever — Fully down; cyclic stick — Neutral position, press TRIM REL sw</> },
        ],
      },
      {
        heading: "Recommended slope landing procedure",
        steps: [
          { left: "1", right: <>Prior to touchdown: A.TRIM sw (APCP) — Press; check A.TRIM OFF (DSAS shown on FND)</> },
          { left: "2", right: <>Upon initial ground contact: mast moment — Increase towards slope as required (use no more than normal MM range)</> },
          { left: "3", right: <>Collective — Lower gently for full touchdown (monitor mast moment, reduce if necessary to stay within limits)</> },
          { left: "4", right: <>Cyclic — Center after collective fully lowered, as required</> },
        ],
      },
    ],
  },
  {
    slug: "engine-shutdown-normal",
    title: "ENGINE SHUTDOWN",
    subtitle: "Normal procedure",
    reference: "FLM BK117 D-3 Sect. 4.11",
    groups: [
      {
        heading: "Procedure",
        steps: [
          { left: "1", right: <>Cyclic stick — Neutral position; collective lever — Latch</> },
          { left: "2", right: <>ENG1/2 MAIN sw&apos;s — IDLE; wait 30 sec for engines to cool down</> },
          { left: "3", right: <>MFD 4 — Select VMS page; all consumers — OFF, except EXT LIGHTS ACOL sw</> },
          { left: "4", right: <>ENG1/2 MAIN sw&apos;s — OFF; TOT and N1 — Monitor decrease</> },
          { left: "5", right: <>Rotor brake (if required) — Apply below 50% NR</> },
          { left: "6", right: <>When rotor has stopped: EXT LIGHTS ACOL sw — OFF; MFD VMS — Check FLIGHT REPORT page</> },
          { left: "7", right: <>Rotor brake (if used) — Release; FND ML — Check DOWNLOAD COMPLETE; BAT MSTR sw — OFF</> },
        ],
      },
    ],
  },
  {
    slug: "ifr-approach",
    title: "IFR APPROACH PROCEDURES",
    subtitle: "Normal procedure",
    reference: "FLM BK117 D-3 Sect. 4.13.4",
    cautions: [
      "When using altitude constrained legs, the baro setting must be identical on MFD1 and MFD2. The crew must remember to synchronize the baro setting whenever it was changed.",
      "Before engaging the autopilot via the CPL button on the MFD, the course pointer (CRS) must be set to the published approach course. An incorrectly set course pointer may lead to significant track deviations.",
    ],
    groups: [
      {
        heading: "ILS approach",
        steps: [
          { left: "1", right: <>Before intercepting the final approach course: both GTN units — Set ILS frequency</> },
          { left: "2", right: <>NAV sk on MFD2 — Select ILS2; minimum LOC interception distance 4 NM; automatic LOC/GS capture within 2 dots (LOC) / 0.5 dots (GS)</> },
          { left: "3", right: <>At the decision altitude/height: if safe landing using visual references is assured, perform landing; if not, perform missed approach</> },
        ],
      },
      {
        heading: "LNAV/LP or LPV/LNAV-VNAV approach",
        steps: [
          { left: "1", right: <>Before the IAF: approach procedure — Select and activate; navigation mode (FND/NAVD) — Check GPS or SBAS</> },
          { left: "2", right: <>Baro settings — Check; DA and DH — Set to approach minima; autopilot NAV mode — CPL</> },
          { left: "3", right: <>If autopilot IAS mode is engaged during LPV/LNAV-VNAV: it will automatically adjust IAS for a max rate of descent of 1000 ft/min</> },
        ],
      },
      {
        heading: "Missed approach (GPS approaches only)",
        steps: [
          { left: "1", right: <>Before the MAP but after the FAF: FLIGHT PLAN page on GTN — MENU sk — ACTIVATE GPS MISSED APPROACH sk</> },
          { left: "2", right: <>At or after the MAP: check SUSP appears; GA pb on collective — Push</> },
          { left: "3", right: <>Continue with the appropriate approach procedure for the next attempt</> },
        ],
      },
    ],
    notes: [
      "Using the GA pb on the collective to initiate a missed approach keeps the autopilot coupled on NAV mode with automatic waypoint sequencing provided.",
    ],
  },
  {
    slug: "single-engine-failure",
    title: "SINGLE ENGINE FAILURE",
    reference: "FLM BK117 D-3 Sect. 3.8.1 / 3.8.1.1-3.8.1.4",
    intro: (
      <>
        One engine has failed or is showing power loss. Possible indications: Warning Unit {b("ROTOR RPM")} light and warning
        tone (if NR low), Master List {b("GEN1 DISCONNECTED")} or {b("GEN2 DISCONNECTED")} for the affected engine, a red
        {" "}{b("OEI")} flag on the FLI, and VMS instruments showing power loss on the affected engine.
      </>
    ),
    notes: [
      "If the last position of the \"blue line\" is known, use that information for the initial collective adjustment.",
      "Bleed air heating is automatically switched off when power exceeds OEI MCP and ambient conditions are N1/TOT limited.",
    ],
    groups: [
      {
        heading: "HIGE (hover in ground effect)",
        steps: [
          { left: "1", right: <>Landing attitude — Establish.</> },
          { left: "2", right: <>Collective lever — Raise to cushion landing.</> },
          { left: "3", right: <>After landing: Double engine emergency shutdown — Perform.</> },
        ],
      },
      {
        heading: "HOGE at or above 100 ft",
        steps: [
          { left: "1", right: <>Attitude — Adjust to -15° to -25° nose down.</> },
          { left: "2", right: <>Collective lever — Adjust to maintain NR in normal range; adjust to OEI 30s limit as required.</> },
          { left: "3", right: <>Landing attitude — Establish, raise collective to cushion landing.</> },
          { left: "Transition to OEI", right: <>Airspeed — Accelerate to Vy; reduce power to OEI 2 min limit (latest when red OEI counter flashes), then OEI MCP or below (amber counter flashes).</> },
          { left: "Then", right: <>Affected engine — Identify; Single engine emergency shutdown — Perform; if situation permits, perform in-flight restart; LAND AS SOON AS PRACTICABLE.</> },
        ],
      },
      {
        heading: "HOGE below 100 ft",
        steps: [
          { left: "1", right: <>Attitude — Adjust to -5° nose down.</> },
          { left: "2", right: <>Collective lever — Adjust to maintain NR in normal range; adjust to OEI 30s limit as required.</> },
          { left: "3", right: <>Landing attitude — Establish, raise collective to cushion landing.</> },
          { left: "4", right: <>After landing: Double engine emergency shutdown — Perform.</> },
        ],
      },
      {
        heading: "Takeoff",
        steps: [
          { left: "1", right: <>Collective lever — Adjust to maintain NR in normal range.</> },
          { left: "Rejected takeoff", right: <>Landing attitude — Establish, raise collective to cushion landing, then perform double engine emergency shutdown.</> },
          { left: "Transition to OEI", right: <>Collective lever — Adjust to OEI 30 sec limit or below; airspeed — accelerate to Vy; reduce to OEI 2 min limit, then OEI MCP or below.</> },
          { left: "Then", right: <>Affected engine — Identify; Single engine emergency shutdown — Perform; if situation permits, perform in-flight restart; LAND AS SOON AS PRACTICABLE.</> },
        ],
      },
      {
        heading: "In flight",
        steps: [
          { left: "1", right: <>OEI flight condition — Establish.</> },
          { left: "2", right: <>Affected engine — Identify.</> },
          { left: "3", right: <>Single engine emergency shutdown — Perform.</> },
          { left: "4", right: <>If situation permits: Perform in-flight restart.</> },
          { left: "5", right: <>LAND AS SOON AS PRACTICABLE.</> },
        ],
      },
    ],
  },
  {
    slug: "double-engine-failure-autorotation",
    title: "DOUBLE ENGINE FAILURE — AUTOROTATION",
    reference: "FLM BK117 D-3 Sect. 3.8.1 / 3.8.4.2",
    intro: (
      <>
        Both engines have failed. Warning Unit {b("ROTOR RPM")} light and warning tone (NR low). Yawing motion nose left as NR
        and both N2 decrease; VMS shows power loss on both engines.
      </>
    ),
    notes: [
      "Maximum range airspeed: 90 KIAS. Minimum rate-of-descent airspeed: 60 KIAS. Normal target: Vy.",
      "Adjust flare height/attitude per actual gross mass, wind, and terrain.",
    ],
    groups: [
      {
        heading: "HIGE (hover in ground effect)",
        steps: [
          { left: "1", right: <>Right pedal — Apply as necessary to stop yaw.</> },
          { left: "2", right: <>Landing attitude — Establish.</> },
          { left: "3", right: <>Collective lever — Raise to cushion landing.</> },
          { left: "In flight", right: <>Autorotation — Perform.</> },
        ],
      },
      {
        heading: "Autorotation glide",
        steps: [
          { left: "1", right: <>Collective lever — Reduce to maintain NR within limits (chevrons on FLI indicate direction of corrective movement).</> },
          { left: "2", right: <>Airspeed — Vy.</> },
          { left: "3", right: <>If situation permits: EMER SHD BUS sw — Lift guard, ON.</> },
          { left: "4", right: <>Double engine emergency shutdown — Perform.</> },
          { left: "5", right: <>Perform in-flight restart, if situation permits.</> },
        ],
      },
      {
        heading: "Flare and landing",
        steps: [
          { left: "~100 ft AGL", right: <>Flare attitude — Establish (approx. 15° to 20°) to reduce forward speed and rate of descent; control NR.</> },
          { left: "~8-12 ft AGL", right: <>Flare attitude — Reduce to approx. 10°.</> },
          { left: "Then", right: <>Heading — Maintain; Collective lever — Raise to stop descent and cushion landing.</> },
          { left: "After landing", right: <>BAT MSTR sw — OFF.</> },
        ],
      },
    ],
  },
  {
    slug: "single-engine-emergency-shutdown",
    title: "SINGLE ENGINE EMERGENCY SHUTDOWN",
    reference: "FLM BK117 D-3 Sect. 3.8.4.3",
    warnings: [
      "Prior to performing engine emergency shutdown in flight, double-check that the affected engine will be shut down. The Master List indicates which engine is affected; additional indications are on the VMS page (e.g. N1 below 60%, N2 below NR and below the other engine's N2, zero oil pressure). In case of doubt, do not perform a single engine emergency shutdown until after landing.",
    ],
    notes: [
      "Before performing an in-flight single engine emergency shutdown, determine if the situation allows for OEI flight (level flight at Vy).",
      "Make certain the collective lever is adjusted to maintain the normal engine within OEI limits.",
    ],
    groups: [
      {
        heading: "Procedure",
        steps: [
          { left: "1", right: <>Affected engine ENG MAIN sw — IDLE, check NR, ENGi IDLE indicated.</> },
          { left: "2", right: <>Affected engine ENG MAIN sw — OFF, ENGi FAIL indicated.</> },
          { left: "If still running", right: <>Affected engine EMER OFF sw (labeled FIRE) — Lift guard, press and release; check FUEL VALVE CLSD comes on.</> },
        ],
      },
    ],
  },
  {
    slug: "inflight-restart",
    title: "INFLIGHT RESTART",
    reference: "FLM BK117 D-3 Sect. 3.8.4.4",
    cautions: ["Do not attempt inflight restart if the cause of engine failure is obviously mechanical."],
    notes: ["An inflight restart may be attempted after a flameout or shutdown, subject to the pilot's evaluation of the cause of flameout."],
    groups: [
      {
        heading: "Procedure",
        steps: [
          { left: "1", right: <>Collective lever — Adjust to OEI MCP or below.</> },
          { left: "2", right: <>Electrical consumption — Reduce.</> },
          { left: "3", right: <>ENG MAIN sw (affected engine) — OFF.</> },
          { left: "4", right: <>Caution indication — Check no FADEC FAIL or FADEC DEGRADED.</> },
          { left: "5", right: <>FUEL PRIME PUMP sw (affected engine) — ON, FUELi PRIME PUMP indicated.</> },
          { left: "6", right: <>ENG MAIN sw (affected engine) — FLIGHT.</> },
          { left: "7", right: <>Electrical consumers — As required.</> },
          { left: "8", right: <>FUEL PRIME PUMP sw (affected engine) — OFF.</> },
          { left: "9", right: <>LAND AS SOON AS PRACTICABLE.</> },
        ],
      },
    ],
  },
  {
    slug: "engine-fire",
    title: "ENGINE FIRE",
    reference: "FLM BK117 D-3 Sect. 3.9.1",
    intro: (
      <>
        Overtemperature detected in an engine compartment. Warning Unit shows {b("FIRE")} and audio tone, Master List shows
        {" "}{b("ENG1 FIRE")} or {b("ENG2 FIRE")}, voice message &quot;FIRE, ENGINE ONE/TWO FIRE&quot;.
      </>
    ),
    notes: ["Extinguisher bottle begins discharging when N1 ≤ 45%. After discharge, BOT 1 label and EXT light go off; BOT 2 label comes on."],
    groups: [
      {
        heading: "On ground",
        steps: [
          { left: "1", right: <>FIRE sw (affected engine) — Raise guard, press.</> },
          { left: "2", right: <>Both FUEL PRIME PUMP sw&apos;s — Check OFF.</> },
          { left: "3", right: <>BOT 1/BOT 2 pb — Press; bottle 1 activated.</> },
          { left: "4", right: <>Clock stop watch — Start, after BOT1 and EXT light extinguish.</> },
          { left: "5", right: <>Both ENG MAIN sw&apos;s — OFF.</> },
          { left: "6", right: <>Passengers — Alert/Evacuate.</> },
          { left: "If FIRE remains after 1 min", right: <>BOT 1/BOT 2 pb — Press again; bottle 2 activated; BAT MSTR sw — OFF.</> },
        ],
      },
      {
        heading: "In flight",
        steps: [
          { left: "1", right: <>OEI flight condition — Establish.</> },
          { left: "2", right: <>FIRE sw (affected engine) — Raise guard, press.</> },
          { left: "3", right: <>BOT 1/BOT 2 pb — Press; bottle 1 activated.</> },
          { left: "4", right: <>Clock stop watch — Start, after BOT1 and EXT light extinguish.</> },
          { left: "5", right: <>VMS page — Select, identify affected engine.</> },
          { left: "6", right: <>Single engine emergency shutdown — Perform.</> },
          { left: "7", right: <>Passengers — Alert.</> },
          { left: "If FIRE warning disappears", right: <>LAND AS SOON AS POSSIBLE.</> },
          { left: "If still on after 1 min", right: <>BOT 1/BOT 2 pb — Press again; bottle 2 activated.</> },
          { left: "If FIRE warning remains on", right: <>LAND IMMEDIATELY.</> },
        ],
      },
    ],
  },
  {
    slug: "cabin-fire",
    title: "CABIN FIRE",
    reference: "FLM BK117 D-3 Sect. 3.9.3.1",
    intro: <>Indications: smoke, burning odor, flames in the cabin.</>,
    cautions: ["Avoid inhalation of fumes, smoke, fire extinguishing fumes/gas."],
    groups: [
      {
        heading: "On ground",
        steps: [
          { left: "1", right: <>Double engine emergency shutdown — Perform.</> },
          { left: "2", right: <>Passengers — Alert/Evacuate.</> },
          { left: "3", right: <>Fire — Extinguish if possible.</> },
        ],
      },
      {
        heading: "In flight",
        steps: [
          { left: "1", right: <>Airspeed — Vy recommended.</> },
          { left: "2", right: <>Passengers — Alert.</> },
          { left: "3", right: <>Heating/air conditioning (if installed) — OFF.</> },
          { left: "4", right: <>Fire — Extinguish if possible.</> },
          { left: "5", right: <>Fumes, smoke, fire extinguishing fumes/gas — Eliminate; open doors, windows and vents.</> },
          { left: "6", right: <>LAND AS SOON AS POSSIBLE.</> },
          { left: "After landing", right: <>Double engine emergency shutdown — Perform.</> },
        ],
      },
    ],
  },
  {
    slug: "electrical-fire",
    title: "ELECTRICAL FIRE / SHORT CIRCUIT",
    reference: "FLM BK117 D-3 Sect. 3.9.3.2",
    intro: <>Indications: odor of burning insulation and/or acrid smoke.</>,
    warnings: [
      "Be prepared for loss of all electrical systems and indications, except IESI.",
      "In case of total electrical failure: fuel available limited to quantity in supply tanks at time of failure; IESI provides airspeed/altitude/attitude for approx. 30 min; all COM/NAV lost; all MFD indications lost; all aircraft stabilization lost.",
    ],
    groups: [
      {
        heading: "On ground",
        steps: [
          { left: "1", right: <>Double engine emergency shutdown — Perform.</> },
          { left: "2", right: <>Passengers — Alert/evacuate.</> },
          { left: "3", right: <>EPU, if connected — Disconnect.</> },
          { left: "4", right: <>Fire — Extinguish if possible.</> },
        ],
      },
      {
        heading: "In flight — source identified",
        steps: [
          { left: "1", right: <>Electrical power — Remove from source (equipment OFF or C/B pull).</> },
        ],
      },
      {
        heading: "In flight — source not identified (escalating isolation)",
        steps: [
          { left: "1", right: <>Both BUS TIE sw&apos;s — OFF (SYS1 BUS TIE OPEN SYS2 caution present).</> },
          { left: "2", right: <>GEN 1 and GEN 2 sw&apos;s — OFF (GEN1 DISCONNECTED GEN2 and BAT DISCHARGING cautions present).</> },
          { left: "3", right: <>Electrical consumers — Reduce as much as possible.</> },
          { left: "4", right: <>Passengers — Alert.</> },
          { left: "If fire/smoke continues and landing without electrical systems is possible", right: <>LAND ASAP.</> },
          { left: "If not, and landing within 30 min is possible", right: <>BAT MSTR sw — OFF; if fire/smoke continues, LAND AS SOON AS PRACTICABLE within 30 minutes.</> },
          { left: "If landing within 30 min is not possible", right: <>Attempt GEN 2 sw RESET/NORM, then GEN 1 sw RESET/NORM (fire may restart — this leads to LAND AS SOON AS PRACTICABLE or LAND ASAP depending on outcome).</> },
        ],
      },
    ],
    notes: ["The escalating flow-chart steps for generator reset are not memory items — consult the FLM flow chart (Sect. 3.9.3.2)."],
  },
  {
    slug: "tail-rotor-drive-failure",
    title: "TAIL ROTOR DRIVE FAILURE",
    reference: "FLM BK117 D-3 Sect. 3.11.1.1 / 3.11.1.2",
    groups: [
      {
        heading: "Hover — HIGE (complete loss of tail rotor thrust, severe yaw nose right)",
        steps: [
          { left: "1", right: <>Landing attitude — Establish.</> },
          { left: "2", right: <>Collective lever — Lower immediately.</> },
          { left: "After landing", right: <>Double engine emergency shutdown — Perform.</> },
        ],
      },
      {
        heading: "Hover — HOGE",
        steps: [
          { left: "1", right: <>Collective lever — Lower immediately.</> },
          { left: "2", right: <>If height permits: Airspeed — Increase.</> },
          { left: "3", right: <>Collective lever — Raise to stop descent.</> },
          { left: "After landing", right: <>Double engine emergency shutdown — Perform.</> },
        ],
      },
      {
        heading: "Forward flight (drive/fixed-pitch control failure)",
        steps: [
          { left: "1", right: <>Collective lever — Adjust to obtain minimum sideslip angle.</> },
          { left: "2", right: <>Airspeed — Maintain 70 KIAS or higher.</> },
          { left: "3", right: <>Suitable landing area — Select (hard, flat surface; running landing preferred; left crosswind advantageous).</> },
          { left: "4", right: <>Shallow approach with nose left — Perform.</> },
          { left: "If nose can be aligned near the ground", right: <>Reduce airspeed close to the ground until nose is aligned with flight direction, then land.</> },
          { left: "If nose swings right at higher speed", right: <>Increase airspeed, abort approach, climb for autorotation; establish autorotation glide; perform double engine emergency shutdown; perform autorotation landing.</> },
        ],
      },
    ],
  },
  {
    slug: "low-fuel-emergency",
    title: "LOW FUEL EMERGENCY",
    reference: "FLM BK117 D-3 Sect. 3.10.1",
    intro: (
      <>
        Respective supply tank fuel quantity below 26 kg. Warning Unit shows {b("LOW FUEL1")}/{b("LOW FUEL2")} and audio
        tone, voice message &quot;FUEL ONE/TWO, LOW&quot;. Endurance indication no longer shown.
      </>
    ),
    warnings: ["After 8 minutes (both lights on), a flameout of both engines must be expected. If no adequate landing site is found within 8 minutes, consider a power-on immediate landing."],
    groups: [
      {
        heading: "Procedure",
        steps: [
          { left: "1", right: <>Clock — Start stopwatch.</> },
          { left: "One light on", right: <>Expect single engine failure after approx. 10 minutes.</> },
          { left: "Both lights on", right: <>LAND WITHIN 8 MINUTES.</> },
          { left: "3", right: <>Fuel quantity indication — Check.</> },
          { left: "If positive main tank indication", right: <>FUEL XFER PUMP A and F sw&apos;s — Check ON; FUEL XPMP - A and - F cb&apos;s — Check in.</> },
          { left: "If warning disappears", right: <>Monitor fuel quantity, continue flight.</> },
          { left: "If warning remains", right: <>Proceed as for both lights on above.</> },
        ],
      },
    ],
  },
  {
    slug: "slope-takeoff",
    title: "SLOPE TAKEOFF",
    subtitle: "Normal procedure",
    reference: "FLM BK117 D-3 Sect. 4.8",
    notes: ["Observe slope landing limitations (Sect. 2.5.5): max 10° nose down, 12° right, 8° left, 8° nose up; max 3° if mast moment indication has failed."],
    groups: [
      {
        heading: "Procedure",
        steps: [
          { left: "1", right: <>A.TRIM sw (APCP) — Press; check A.TRIM OFF (DSAS shown on FND).</> },
          { left: "2", right: <>Collective — Increase gently.</> },
          { left: "3", right: <>Mast moment — Simultaneously increase in direction of slope, maintain MM within limits.</> },
          { left: "4", right: <>Collective — Continue to increase to lift from slope.</> },
          { left: "5", right: <>A.TRIM sw — Press to re-engage.</> },
        ],
      },
    ],
  },
  {
    slug: "slope-landing",
    title: "SLOPE LANDING",
    subtitle: "Normal procedure",
    reference: "FLM BK117 D-3 Sect. 4.10",
    notes: ["Observe slope landing limitations (Sect. 2.5.5)."],
    groups: [
      {
        heading: "Prior to touchdown",
        steps: [
          { left: "1", right: <>A.TRIM sw (APCP) — Press; check A.TRIM OFF (DSAS shown on FND).</> },
        ],
      },
      {
        heading: "Upon initial ground contact",
        steps: [
          { left: "1", right: <>Mast moment — Increase towards slope as required (use no more than normal MM range).</> },
          { left: "2", right: <>Collective — Lower gently for full touchdown (monitor mast moment, reduce if necessary to stay within limits).</> },
          { left: "3", right: <>Cyclic — Center after collective fully lowered, as required.</> },
        ],
      },
    ],
  },
];

export function findH145D3Procedure(slug: string): ProcedureDefinition | undefined {
  return H145D3_PROCEDURES.find((p) => p.slug === slug);
}
