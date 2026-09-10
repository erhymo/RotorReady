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

export const H135T3_PROCEDURES: ProcedureDefinition[] = [
  {
    slug: "exterior-check",
    title: "EXTERIOR CHECK",
    subtitle: "Normal procedure",
    reference: "FLM EC135 T3H Sect. 4.3.2 / 4.3.2.1 (Helionix Step 3.5)",
    intro: (
      <>
        The exterior check is laid out as a walk-around check, starting forward right at the pilot&apos;s door,
        proceeding clockwise to the tail boom, to the left-hand side, and completed at the helicopter nose area.
      </>
    ),
    image: {
      src: "/training/procedures/pages/h135t3-exterior-check.png",
      alt: "EC135 T3H exterior check walk-around sequence diagram",
      caption: "Fig. 4-1 Exterior Check Sequence — FLM EC135 T3H Sect. 4.3.2.1",
    },
    groups: [
      {
        heading: "Before exterior check",
        steps: [
          { left: "★", right: <>Helicopter and mission documents — Check, complete</> },
          { left: "★", right: <>Weight, CG — Check</> },
          { left: "★", right: <>Covers and tie-downs — Removed</> },
          { left: "★", right: <>Ice and snow (if any) — Removed</> },
          { left: "★", right: <>Ground handling wheels — Removed</> },
          { left: "", right: <>Fuel tanks / drain valves (4) — Drained</> },
          { left: "★", right: <>Fuselage underside / drain ports — Condition, no fuel / oil leaks</> },
          { left: "★", right: <>Equipment and cargo — Secured</> },
          { left: "", right: <>Hand fire extinguisher(s) (if installed) — Condition (no damage, no corrosion and wear), secured; check pressure indicator (in green area)</> },
        ],
      },
      {
        heading: "Walk-around sequence",
        steps: [
          { left: "1", right: <>Fuselage RH</> },
          { left: "2", right: <>Rear structure</> },
          { left: "3", right: <>Fuselage LH</> },
          { left: "4", right: <>Cabin roof</> },
          { left: "5", right: <>Nose area</> },
        ],
      },
    ],
    notes: [
      "Items marked ★ need only be checked before the first flight of the day; unmarked items shall be checked before every flight.",
      "To avoid excessive drain on the helicopter battery, particularly during cold weather, all ground operations should be conducted using an external power unit (EPU) whenever possible.",
    ],
  },
  {
    slug: "engine-start",
    title: "STARTING ENGINES AND SYSTEM CHECKS",
    subtitle: "Normal procedure",
    reference: "FLM EC135 T3H Sect. 4.4.1 (Helionix Step 3.5, 3 MFD)",
    notes: [
      "The fire protection test must be performed at least once before the first flight of the day.",
      "Fuel prime pumps must be on for at least 10 seconds before starting engines, to ensure the engines are supplied sufficiently with fuel.",
      "The hydraulic check must be performed at least once before the first flight of the day.",
    ],
    cautions: [
      "TEST HYD sw must not be operated during flight. Observe mast moment limits during the hydraulic check.",
    ],
    groups: [
      {
        heading: "Starting first engine",
        steps: [
          { left: "1", right: <>FUEL PRIME PUMP 1 and 2 sw&apos;s — ON (FUEL1/2 PRIME PUMP ON)</> },
          { left: "2", right: <>Fire guard (if available) — Posted; rotor area — Clear</> },
          { left: "3", right: <>FND ML — Acknowledge; check no ELEC OVERLIMIT</> },
          { left: "4", right: <>ENG 1 or 2 MAIN sw — IDLE, start clock</> },
          { left: "5", right: <>N1 — Check increase; TOT — Monitor, check increase (≥720°C)</> },
          { left: "6", right: <>N2/NR — Monitor increase; engine and MGB oil pressure — Check positive indication</> },
          { left: "7", right: <>At approx. 50% N1 — START (VMS page) extinguishes; N2/NR approx. 70% in IDLE mode, check matched</> },
        ],
      },
      {
        heading: "Hydraulic check",
        steps: [
          { left: "1", right: <>TEST HYD sw — SYS 1 and hold; check LOW PRESS HYD2; perform small cyclic/collective/pedal movements, check forces</> },
          { left: "2", right: <>TEST HYD sw — SYS 2 and hold; check HYD1 LOW PRESS; perform small cyclic/collective/pedal movements, check forces</> },
          { left: "3", right: <>Cyclic TRIM REL sw — Release; TEST HYD sw — Release</> },
        ],
      },
      {
        heading: "Starting second engine",
        steps: [
          { left: "1", right: <>Start second engine following the same procedure as the first</> },
          { left: "2", right: <>When IDLE speed of N2 ≥76% is reached (within ≤45 sec): FND ML — Check START-UP TST OK</> },
          { left: "3", right: <>EPU (if still connected) — Disconnect</> },
        ],
      },
      {
        heading: "System checks",
        steps: [
          { left: "1", right: <>STBY BAT and AVIO MSTR 1 and 2 sw&apos;s — ON; PT/STATIC HTG COPILOT and PILOT sw&apos;s — ON</> },
          { left: "2", right: <>FUEL PRIME PUMP 1 and 2 sw&apos;s — OFF; FUEL XFER PUMP A and F sw&apos;s — ON</> },
          { left: "3", right: <>Ventilation — Set as required (maximum ventilation required if OAT ≥ +30°C)</> },
          { left: "4", right: <>Heating system check — Perform once a day if heating is intended to be used</> },
        ],
      },
    ],
  },
  {
    slug: "takeoff",
    title: "PRE-TAKEOFF CHECK, TAKEOFF CHECK AND TAKEOFF",
    subtitle: "Normal procedure",
    reference: "FLM EC135 T3H Sect. 4.6 / 4.7 / 4.8 (Helionix Step 3.5, 3 MFD)",
    cautions: [
      "To avoid damage on optional equipment (e.g. wire strike protection system, HISL, EOS, external mirror) during operation near ground, sufficient clearance should be considered to prevent this equipment striking the ground.",
    ],
    groups: [
      {
        heading: "Pre-takeoff check",
        steps: [
          { left: "1", right: <>ENG1/2 MAIN sw&apos;s — Check FLIGHT, guards closed</> },
          { left: "2", right: <>If gross mass &gt; 2850 kg: HI NR pb — Push, check &quot;ON&quot; illuminates; check N2/NR normal, 100-105% depending on density altitude</> },
          { left: "3", right: <>Pressure and temperature indications — Check; cautions, warnings, alerts — Check; fuel quantity — Check</> },
          { left: "4", right: <>IESI — Check aligned, IAS and ALT valid; AP/BKUP SAS — Check on</> },
          { left: "5", right: <>Cyclic stick — Check centering device secured</> },
        ],
      },
      {
        heading: "Takeoff check",
        steps: [
          { left: "1", right: <>Hover flight — Perform; N2/NR — Check; FLI — Check AEO indication</> },
          { left: "2", right: <>Hover power — Check at 4 ft skid height; note position of blue line on FLI</> },
          { left: "3", right: <>All warnings and cautions, ML — Check off</> },
        ],
      },
      {
        heading: "Takeoff",
        steps: [
          { left: "1", right: <>Acceleration and climb — Start nose-down pitch rotation, simultaneously increase power smoothly; observe the height-velocity diagram (Sect. 5)</> },
          { left: "2", right: <>When reaching 50 KIAS — Maintain airspeed until reaching 50 ft AGL, then accelerate to VY and climb through 100 ft AGL</> },
          { left: "3", right: <>Takeoff with gross mass &gt; 2850 kg: when IAS above 55 KIAS, check decrease in NR to nominal value (NRHI label stays on)</> },
        ],
      },
      {
        heading: "Recommended slope takeoff procedure",
        steps: [
          { left: "1", right: <>A.TRIM sw (APCP) — Press; check A.TRIM OFF (DSAS shown on FND)</> },
          { left: "2", right: <>Collective — Increase gently to ≈30% TQ</> },
          { left: "3", right: <>Mast moment — Increase in direction of slope (use no more than normal MM range)</> },
          { left: "4", right: <>Collective — Increase to lift from slope, maintain MM within limits</> },
          { left: "5", right: <>A.TRIM sw — Press to re-engage</> },
        ],
      },
    ],
  },
  {
    slug: "landing",
    title: "PRE-LANDING CHECK AND LANDING",
    subtitle: "Normal procedure",
    reference: "FLM EC135 T3H Sect. 4.9 / 4.10 (Helionix Step 3.5, 3 MFD)",
    cautions: [
      "An oscillation which could be unintentionally induced/assisted by the pilot (PIO/PAO) may be experienced during running landings or harder vertical landings. In case of PIO/PAO, rapidly increase or decrease the collective lever, whatever the situation allows, until the oscillation has stopped.",
    ],
    groups: [
      {
        heading: "Pre-landing check",
        steps: [
          { left: "1", right: <>All instruments — Check; all warnings, cautions, ML — Check</> },
          { left: "2", right: <>Landing with gross mass &gt; 2850 kg: HIGH NR — Select; when IAS below 50 KIAS, check increase in NR to 103-105% depending on density altitude</> },
          { left: "3", right: <>Decision height (DH) — As required</> },
        ],
      },
      {
        heading: "Recommended landing procedure",
        steps: [
          { left: "1", right: <>After reaching 50 ft AGL — Descend with 300 ft/min ≤ R/D &lt; 500 ft/min at 40 KIAS</> },
          { left: "2", right: <>Before touchdown — Establish flare attitude to reduce ground speed, raise collective lever to cushion landing</> },
          { left: "3", right: <>Touchdown — Establish with zero groundspeed</> },
          { left: "4", right: <>After landing: cyclic stick — Neutral position, press TRIM REL sw</> },
          { left: "5", right: <>HIGH NR pb (if active) — Push; check &quot;ON&quot; extinguishes and NR decreases to nominal value</> },
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
    notes: ["Prior to landing in sandy conditions, close NACA inlets by selecting recirculated air."],
  },
  {
    slug: "engine-shutdown-normal",
    title: "ENGINE SHUTDOWN",
    subtitle: "Normal procedure",
    reference: "FLM EC135 T3H Sect. 4.11 (Helionix Step 3.5, 3 MFD)",
    cautions: [
      "If after engine shutdown a fire in the engine compartment due to undrained/residual fuel is detected (smoke observed exiting the exhaust pipe), an engine ventilation (dry crank) shall be performed. Maintenance action is required.",
      "Activate rotor brake carefully when parked on ice or snow covered surfaces.",
    ],
    groups: [
      {
        heading: "Procedure",
        steps: [
          { left: "1", right: <>Cyclic stick — Neutral position; collective lever — Latch</> },
          { left: "2", right: <>ENG1/2 MAIN sw&apos;s — IDLE; wait 30 sec for engines to cool down</> },
          { left: "3", right: <>All consumers — OFF, except EXT LIGHTS ACOL sw</> },
          { left: "4", right: <>ENG1/2 MAIN sw&apos;s — OFF; TOT and N1 — Monitor decrease</> },
          { left: "5", right: <>If TOT is rising abnormally: respective twist grip — Turn to SHUT-OFF</> },
          { left: "6", right: <>Rotor brake (if required and installed) — Apply below 50% NR</> },
          { left: "7", right: <>When rotor has stopped: EXT LIGHTS ACOL sw — OFF; MFD VMS — Check FLIGHT REPORT page</> },
          { left: "8", right: <>Rotor brake (if used) — Release; FND ML — Check DOWNLOAD COMPLETE; BAT MSTR sw — OFF</> },
        ],
      },
    ],
  },
  {
    slug: "ifr-approach",
    title: "IFR APPROACH PROCEDURES",
    subtitle: "Normal procedure",
    reference: "FLM EC135 T3H Sect. 4.14.4 (Helionix Step 3.5, 3 MFD)",
    cautions: [
      "When using altitude constrained legs, the baro setting must be identical on MFD1 and MFD2. The crew must remember to synchronize the baro setting whenever it was changed.",
      "Before engaging the autopilot via the CPL button on the MFD, the course pointer (CRS) must be set to the published approach course. An incorrectly set course pointer may lead to significant track deviations.",
    ],
    groups: [
      {
        heading: "ILS approach",
        steps: [
          { left: "1", right: <>Before intercepting the final approach course: both GTN units — Set ILS frequency</> },
          { left: "2", right: <>NAV sk on MFD1 — Select ILS1; NAV sk on MFD2 — Select ILS2</> },
          { left: "3", right: <>At the decision altitude/height: if safe landing using visual references is assured, perform landing; if not, perform missed approach</> },
        ],
      },
      {
        heading: "LNAV or LP approach",
        steps: [
          { left: "1", right: <>Before the IAF: approach procedure — Select and activate; navigation mode (FND/NAVD) — Check GPS or SBAS</> },
          { left: "2", right: <>Baro settings — Check; DA and DH — Set to LNAV or LP minima; autopilot NAV mode — CPL</> },
          { left: "3", right: <>Less than 60 sec before FAF: FND or NAVD page — Check LNAV/LNAV+V/LP/LP+V is indicated</> },
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
      "AFCS will decouple 10 seconds after activating the GPS missed approach via the GTN; recouple via the MFD CPL switch is required. Using the GA pb on the collective instead keeps the autopilot NAV mode coupled with automatic waypoint sequencing.",
    ],
  },
  {
    slug: "single-engine-failure",
    title: "SINGLE ENGINE FAILURE",
    reference: "FLM EC135 T3H Sect. 3.8.1 / 3.8.1.1-3.8.1.4 (Helionix Step 3.5, 3 MFD)",
    intro: (
      <>
        One engine has failed or is showing power loss. Possible indications: Warning Unit {b("ROTOR RPM")} light and warning
        tone (if NR low), Master List {b("GEN1 DISCONNECTED")} or {b("GEN2 DISCONNECTED")} for the affected engine, a red
        {" "}{b("OEI")} flag on the FLI, a jerk in the yaw axis (nose left), and VMS instruments showing power loss on the
        affected engine.
      </>
    ),
    notes: [
      "Above 40 KIAS in AFCS 4-axis mode, NR stabilization is supported by AFCS collective inputs, depending on selected topping (OEI 30 sec/2 min).",
      "If the last position of the \"blue line\" is known, use that information for the initial collective adjustment.",
    ],
    groups: [
      {
        heading: "HIGE (hover in ground effect)",
        steps: [
          { left: "1", right: <>Landing attitude — Establish.</> },
          { left: "2", right: <>Collective lever — Raise to cushion landing. Below 95% rotor RPM, torque could increase from 128% up to 133%.</> },
          { left: "3", right: <>After landing: Double engine emergency shutdown — Perform.</> },
        ],
      },
      {
        heading: "HOGE (hover out of ground effect)",
        steps: [
          { left: "1", right: <>Collective lever — Adjust to maintain NR in normal range.</> },
          { left: "Forced landing", right: <>Landing attitude — Establish, raise collective to cushion landing, then perform double engine emergency shutdown.</> },
          { left: "Transition to OEI", right: <>Airspeed — Accelerate to Vy; Collective lever — Reduce power to OEI 2 min limit (at the latest when the red OEI counter flashes), then OEI MCP or below (amber counter flashes).</> },
          { left: "Then", right: <>Affected engine — Identify; Single engine emergency shutdown — Perform; LAND AS SOON AS PRACTICABLE.</> },
        ],
      },
      {
        heading: "Takeoff",
        steps: [
          { left: "1", right: <>Collective lever — Adjust to maintain NR in normal range.</> },
          { left: "Rejected takeoff", right: <>Landing attitude — Establish, raise collective to cushion landing, then perform double engine emergency shutdown.</> },
          { left: "Transition to OEI", right: <>Airspeed — Accelerate to Vy; Collective lever — Reduce power to OEI 2 min limit, then OEI MCP or below.</> },
          { left: "Then", right: <>Affected engine — Identify; Single engine emergency shutdown — Perform; LAND AS SOON AS PRACTICABLE.</> },
        ],
      },
      {
        heading: "In flight",
        steps: [
          { left: "1", right: <>OEI flight condition — Establish.</> },
          { left: "2", right: <>Affected engine — Identify.</> },
          { left: "3", right: <>Single engine emergency shutdown — Perform.</> },
          { left: "4", right: <>LAND AS SOON AS PRACTICABLE.</> },
        ],
      },
    ],
  },
  {
    slug: "double-engine-failure-autorotation",
    title: "DOUBLE ENGINE FAILURE — AUTOROTATION",
    reference: "FLM EC135 T3H Sect. 3.8.1 / 3.8.4.6 / 3.8.4.7 (Helionix Step 3.5, 3 MFD)",
    intro: (
      <>
        Both engines have failed. Warning Unit {b("ROTOR RPM")} light and warning tone (NR low). Yawing motion nose left as NR
        and both N2 decrease; VMS shows power loss on both engines.
      </>
    ),
    groups: [
      {
        heading: "HIGE (hover in ground effect)",
        steps: [
          { left: "1", right: <>Right pedal — Apply as necessary to stop yaw.</> },
          { left: "2", right: <>Landing attitude — Establish.</> },
          { left: "3", right: <>Collective lever — Raise to cushion landing.</> },
          { left: "4", right: <>After steady ground contact: Collective lever — Lower rapidly.</> },
        ],
      },
      {
        heading: "In flight — Autorotation",
        steps: [
          { left: "1", right: <>Collective lever — Reduce to maintain NR within limits. Amber/red chevrons on the FLI indicate the direction of corrective collective movement.</> },
          { left: "2", right: <>Airspeed — 75 KIAS recommended (max range 90 KIAS, min rate-of-descent 60 KIAS).</> },
          { left: "3", right: <>If situation permits: EMER SHD BUS sw — Lift guard, ON.</> },
          { left: "4", right: <>Double engine emergency shutdown — Perform.</> },
          { left: "At approx. 100 ft AGL", right: <>Flare attitude — Establish.</> },
          { left: "Touchdown", right: <>Landing attitude — Establish; Heading — Maintain; Collective lever — Raise to stop descent and cushion landing.</> },
          { left: "After touchdown", right: <>Collective lever — Lower slowly to prevent an abrupt stop; Cyclic stick — Maintain neutral position; BAT MSTR sw — OFF.</> },
        ],
      },
    ],
    notes: [
      "Autorotation minimum rotor RPM area (60-68% NR) is a lead-lag resonance range — keep cyclic neutral and collective full down if transiting through it on the ground.",
    ],
  },
  {
    slug: "single-engine-emergency-shutdown",
    title: "SINGLE ENGINE EMERGENCY SHUTDOWN",
    reference: "FLM EC135 T3H Sect. 3.8.4.2 (Helionix Step 3.5, 3 MFD)",
    warnings: [
      "Prior to performing the engine emergency shutdown in flight, double-check that the affected engine will be shut down. The Master List indicates which engine is affected. Additional indications: N1 below 60%, N2 below NR and below the other engine&apos;s N2, zero oil pressure. In case of doubt, do not perform a single engine emergency shutdown until after landing.",
    ],
    groups: [
      {
        steps: [
          { left: "1", right: <>ENG MAIN sw (affected engine) — IDLE, check N2, {b("ENGi IDLE")} indicated — OFF.</> },
          { left: "If still running / TOT rising abnormally", right: <>Respective TWIST GRIP — Turn to minimum fuel stop, verify correct engine, then shut off.</> },
        ],
      },
    ],
    notes: [
      "Before performing an inflight shutdown, confirm the situation allows for OEI flight, and that the collective is adjusted to keep the normal engine within OEI limits.",
      "A single engine failure/emergency shutdown automatically switches off bleed air heating; it may be re-engaged (BLD HTG EMER switch) depending on the power margin of the normal engine.",
      "Ventilation is only possible when the START cb is not pulled.",
    ],
  },
  {
    slug: "inflight-restart",
    title: "INFLIGHT RESTART",
    reference: "FLM EC135 T3H Sect. 3.8.4.3 (Helionix Step 3.5, 3 MFD)",
    cautions: [
      "Do not attempt an inflight restart if the cause of engine failure is obviously mechanical.",
    ],
    intro: <>An inflight restart may be attempted after a flameout or shutdown, subject to the pilot&apos;s evaluation of the cause.</>,
    groups: [
      {
        steps: [
          { left: "1", right: <>Collective lever — Adjust to OEI MCP or below.</> },
          { left: "2", right: <>Electrical consumption — Reduce.</> },
          { left: "3", right: <>ENG MAIN sw (affected engine) — Check OFF.</> },
          { left: "4", right: <>ENG MANUAL MODE sw — Check OFF.</> },
          { left: "5", right: <>Engine PRIME PUMP sw (affected engine) — ON.</> },
          { left: "6", right: <>Engine TWIST GRIP — NEUTRAL.</> },
          { left: "7", right: <>When N1 reaches 0% (wait 10 sec if fuel temp below -30°C and PA &gt; 10,000 ft): ENG MAIN sw (affected engine) — FLIGHT.</> },
          { left: "8-9", right: <>When N1 ≤ 50%: Engine PRIME PUMP sw (affected engine) — OFF; Electrical consumption — As required.</> },
          { left: "If restart is not successful", right: <>Single engine emergency shutdown — Perform; LAND AS SOON AS PRACTICABLE.</> },
        ],
      },
    ],
  },
  {
    slug: "engine-fire",
    title: "ENGINE FIRE",
    reference: "FLM EC135 T3H Sect. 3.9.1 (Helionix Step 3.5, 3 MFD)",
    intro: <>Overtemperature detected in the engine compartment. Voice message &quot;FIRE, ENGINE ONE/TWO FIRE&quot;.</>,
    groups: [
      {
        heading: "On ground",
        steps: [
          { left: "1", right: <>EMER OFF sw (affected engine) — Raise guard, press and release.</> },
          { left: "2", right: <>Both FUEL PRIME PUMP sw&apos;s — Check OFF.</> },
          { left: "3", right: <>Both ENG MAIN sw&apos;s — OFF.</> },
          { left: "4", right: <>Passengers — Alert / evacuate.</> },
          { left: "5", right: <>BAT MSTR sw — OFF.</> },
        ],
      },
      {
        heading: "In flight",
        steps: [
          { left: "1", right: <>OEI flight condition — Establish.</> },
          { left: "2", right: <>EMER OFF sw (affected engine) — Raise guard, press and release.</> },
          { left: "3", right: <>VMS page — Select.</> },
          { left: "4", right: <>Affected engine — Identify.</> },
          { left: "5", right: <>Single engine emergency shutdown — Perform.</> },
          { left: "If FIRE warning off", right: <>LAND AS SOON AS POSSIBLE.</> },
          { left: "If FIRE warning remains on", right: <>LAND IMMEDIATELY. Alert / evacuate passengers.</> },
        ],
      },
    ],
    notes: [
      "Pressing EMER OFF automatically shuts down the affected engine (ACTIVE illuminates, FUEL VALVE CLSD caution appears). The extinguisher bottle (if installed) automatically discharges when N1 < 50%.",
    ],
  },
  {
    slug: "cabin-fire",
    title: "CABIN FIRE",
    reference: "FLM EC135 T3H Sect. 3.9.3.1 (Helionix Step 3.5, 3 MFD)",
    intro: <>Indications: smoke, burning odor, or flames in the cabin.</>,
    cautions: ["Avoid inhalation of fumes, smoke, or fire-extinguishing fumes/gas."],
    groups: [
      {
        heading: "On ground",
        steps: [
          { left: "1", right: <>Double engine emergency shutdown — Perform.</> },
          { left: "2", right: <>Passengers — Alert / evacuate.</> },
          { left: "3", right: <>Fire — Extinguish if possible.</> },
        ],
      },
      {
        heading: "In flight",
        steps: [
          { left: "1", right: <>Airspeed — Reduce if necessary (Vy recommended).</> },
          { left: "2", right: <>Passengers — Alert.</> },
          { left: "3", right: <>Heating / air conditioning (if installed) — OFF.</> },
          { left: "4", right: <>Fire — Extinguish if possible.</> },
          { left: "5", right: <>Fumes / smoke — Eliminate: open doors, windows and vents (fresh air) if possible.</> },
          { left: "6", right: <>LAND AS SOON AS POSSIBLE.</> },
          { left: "After landing", right: <>Double engine emergency shutdown — Perform.</> },
        ],
      },
    ],
  },
  {
    slug: "electrical-fire",
    title: "ELECTRICAL FIRE / SHORT CIRCUIT",
    reference: "FLM EC135 T3H Sect. 3.9.3.2 (Helionix Step 3.5, 3 MFD)",
    intro: <>Indications: odor of burning insulation and/or acrid smoke.</>,
    warnings: [
      "Be prepared for loss of all electrical systems and indications, except IESI, if the escalating isolation steps below are needed.",
    ],
    groups: [
      {
        heading: "On ground",
        steps: [
          { left: "1", right: <>Double engine emergency shutdown — Perform.</> },
          { left: "2", right: <>Passengers — Alert / evacuate.</> },
          { left: "3", right: <>EPU, if connected — Disconnect.</> },
          { left: "4", right: <>Fire — Extinguish if possible.</> },
        ],
      },
      {
        heading: "In flight — if source can be identified",
        steps: [
          { left: "1", right: <>Electrical power — Remove from source (equipment OFF or C/B pull), then LAND AS SOON AS POSSIBLE.</> },
        ],
      },
      {
        heading: "In flight — if source cannot be identified (escalating isolation)",
        steps: [
          { left: "1", right: <>Both BUS TIE sw&apos;s — OFF; check both BUS TIE OPEN cautions on. If fire/smoke eliminated, LAND AS SOON AS POSSIBLE.</> },
          { left: "2", right: <>Compare DC VOLTS / GEN AMPS / BAT AMPS, note the higher load, then BAT MSTR sw — OFF.</> },
          { left: "3", right: <>If fire/smoke continues: Respective GEN sw (higher load) — OFF; check GEN DISCONNECTED on. If eliminated, LAND AS SOON AS POSSIBLE.</> },
          { left: "4", right: <>If fire/smoke continues: Both GEN sw&apos;s — NORM (check GEN DISCONNECTED cautions off), then other GEN sw — OFF. If eliminated, LAND AS SOON AS POSSIBLE.</> },
          { left: "5", right: <>If fire/smoke still continues: Both GEN sw&apos;s — OFF (black cockpit) — LAND AS SOON AS POSSIBLE.</> },
        ],
      },
    ],
    notes: [
      "HYD PRESS caution will illuminate when power is lost to the respective essential bus — the hydraulic system itself is not turned off.",
    ],
  },
  {
    slug: "tail-rotor-drive-failure",
    title: "TAIL ROTOR DRIVE FAILURE",
    reference: "FLM EC135 T3H Sect. 3.11.2.1 / 3.11.2.2 (Helionix Step 3.5, 3 MFD)",
    intro: (
      <>
        Complete loss of tail rotor thrust. In power-on flight, indicated by a yawing motion nose right, with yaw rate
        depending on power at the time of failure.
      </>
    ),
    groups: [
      {
        heading: "Hover in ground effect",
        steps: [
          { left: "1", right: <>Both TWIST GRIPS — Turn to minimum, and simultaneously establish landing attitude and apply collective as necessary.</> },
          { left: "After landing", right: <>Double engine emergency shutdown — Perform.</> },
        ],
      },
      {
        heading: "Hover out of ground effect",
        steps: [
          { left: "1", right: <>Collective lever — Lower immediately.</> },
          { left: "2", right: <>Both TWIST GRIPS — Turn to minimum.</> },
          { left: "3", right: <>If height permits: Airspeed — Increase; Collective lever — Raise to stop descent.</> },
          { left: "After landing", right: <>Double engine emergency shutdown — Perform.</> },
        ],
      },
      {
        heading: "Forward flight (drive failure or fixed-pitch control failure)",
        steps: [
          { left: "1", right: <>Collective lever — Reduce to obtain minimum sideslip angle.</> },
          { left: "2", right: <>Airspeed — Maintain 70 KIAS or higher.</> },
          { left: "3", right: <>Suitable landing area — Select (hard, flat surface; running landing preferable; crosswind from the left is advantageous).</> },
          { left: "4", right: <>Shallow approach with nose left — Perform.</> },
          { left: "If airspeed can be reduced below 40 kt with nose still left", right: <>Reduce airspeed close to the ground until nose aligns with flight direction, then land.</> },
          { left: "If nose swings from left to right above 40 kt", right: <>Increase airspeed, abort approach, climb to sufficient height, establish autorotation glide, turn both TWIST GRIPS to minimum, and perform an autorotation landing.</> },
        ],
      },
    ],
    notes: [
      "In autorotation, zero sideslip can be expected at about 60-70 kt. Reduce groundspeed to a minimum before touchdown. In the final phase of flare the helicopter can yaw left due to friction effects.",
    ],
  },
  {
    slug: "slope-takeoff",
    title: "SLOPE TAKEOFF",
    reference: "FLM EC135 T3H Sect. 4.8 (Helionix Step 3.5)",
    subtitle: "Recommended procedure — observe slope limitations in Sect. 2",
    groups: [
      {
        steps: [
          { left: "1", right: <>A.TRIM sw (APCP) — Press to switch off, check {b("DSAS")} indicated on FND.</> },
          { left: "2", right: <>Collective — Increase gently to approx. 30% TQ.</> },
          { left: "3", right: <>Mast moment — Monitor, increase in direction of slope (use no more than normal MM range).</> },
          { left: "4", right: <>Collective — Increase to lift from slope, maintaining MM within limits.</> },
          { left: "5", right: <>A.TRIM sw — Press to re-engage.</> },
        ],
      },
    ],
    notes: [
      "Slope limits: max 14° sloping down left/right, max 12° nose up, max 8° nose down (tail clearance permitting), or max 6° if mast moment indication has failed.",
    ],
  },
  {
    slug: "slope-landing",
    title: "SLOPE LANDING",
    reference: "FLM EC135 T3H Sect. 4.10 (Helionix Step 3.5)",
    subtitle: "Recommended procedure — observe slope limitations in Sect. 2",
    cautions: [
      "An oscillation unintentionally induced/assisted by the pilot (PIO/PAO) may be experienced during running or harder vertical landings. Rapidly increase or decrease the collective lever, whatever the situation allows, until the oscillation stops.",
    ],
    groups: [
      {
        heading: "Prior to touchdown",
        steps: [
          { left: "1", right: <>A.TRIM sw (APCP) — Press to switch off, check {b("DSAS")} indicated on FND.</> },
        ],
      },
      {
        heading: "Upon initial ground contact",
        steps: [
          { left: "1", right: <>Mast moment — Increase towards slope as required (use no more than normal MM range).</> },
          { left: "2", right: <>Collective — Lower gently for full touchdown, monitoring mast moment and reducing if necessary to stay within limits.</> },
          { left: "3", right: <>Cyclic — Center after collective is fully lowered, as required.</> },
        ],
      },
    ],
  },
  {
    slug: "low-fuel-emergency",
    title: "LOW FUEL EMERGENCY",
    reference: "FLM EC135 T3H Sect. 3.10.1 (Helionix Step 3.5, 3 MFD)",
    intro: <>Respective supply tank fuel quantity is below the threshold value. Voice message &quot;FUEL ONE/TWO, LOW&quot;.</>,
    warnings: [
      "Irrespective of fuel quantity indications, the low fuel warning procedure shall be obeyed.",
    ],
    groups: [
      {
        steps: [
          { left: "1", right: <>Clock — Start stopwatch.</> },
          { left: "If both FUEL LOW warnings are on", right: <>LAND WITHIN 10 MINUTES. After 10 minutes, a flame-out of both engines must be expected — consider a power-on immediate landing if no site is found within 8 minutes.</> },
          { left: "If one FUEL LOW warning is on", right: <>Expect single engine failure (after approx. 10 minutes); check fuel quantity indication.</> },
          { left: "If positive fuel indication in main tank", right: <>Both FUEL XFER PUMP sw&apos;s (F+A) — Check ON; both fuel pump XPMP cb&apos;s — Check in.</> },
          { left: "If both warnings remain on", right: <>LAND WITHIN 10 MINUTES.</> },
          { left: "If one warning remains on", right: <>Expect single engine failure; air condition — OFF; bleed air — OFF (if OAT &gt; 5°C).</> },
        ],
      },
    ],
    notes: [
      "Due to fuel sloshing the indication may flicker; the master list indication is automatically latched for 60 seconds.",
    ],
  },
];

export function findH135T3Procedure(slug: string) {
  return H135T3_PROCEDURES.find((p) => p.slug === slug);
}
