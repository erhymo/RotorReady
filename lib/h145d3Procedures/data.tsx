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

function b(text: string) {
  return <span className="font-semibold">{text}</span>;
}

export const H145D3_PROCEDURES: ProcedureDefinition[] = [
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
