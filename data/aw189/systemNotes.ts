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

// All notes are sourced from the AW189 RFM (Issue 2), Part II — Manufacturer's
// Data, Section 7 (System Description), which is organised by ATA chapter.

const INTEGRATED_AVIONICS: SystemNote = {
  slug: "integrated-avionics",
  title: "Integrated Avionics: AMMS and the Cockpit Display System",
  subtitle: "Two Aircraft and Mission Management Computers on an AFDX backbone, four interchangeable display units, and the reconfiguration panel that re-routes a failed AHRS, air data source or display.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Systems Integration and Display, Chapter 46: AMMS, AMMC, MCDU, Data Transfer Device, Cockpit Display System).",
  sections: [
    {
      heading: "The management system",
      paragraphs: [
        "The Aircraft Mission Management System (AMMS) is the core the rest of the aircraft plugs into: two identical Aircraft and Mission Management Computers (AMMC1, AMMC2) in the nose bay, synchronised over a dedicated line so both run the same function on the same data at the same time, with redundancy managed by the MCDU. They handle vehicle monitoring (real-time warnings and cautions), the flight management system, communication and navigation preset, digital map generation (one Digital Map Generator per AMMC), HUMS, maintenance data, and built-in test.",
        "The crew interface is two Multi-function Control and Display Units (MCDU1, MCDU2) in the interseat console — each a LCD with line-select, fixed-function and basic-function keys for navigating the menu tree and entering data through a scratch pad. A Data Transfer Device (DTD) moves maintenance and database data between the aircraft and ground support.",
      ],
    },
    {
      heading: "The displays",
      paragraphs: [
        "A glass cockpit of four identical Display Units (DU1–DU4, left to right: PFD, MFD, MFD, PFD). The DUs are physically identical and can show any format; position decides what they display. An Integrated Standby Instrument System (ISIS) sits centrally above the pilot and co-pilot MFDs. The CDS talks to the AMMS over an Avionic Full Duplex (AFDX) databus carrying CAS messages, FMS data, radio-nav tuning, maintenance data, power-plant parameters and synoptic pages.",
        "Supporting controls: two Display Control Panels (DCP) for course, CAS scroll, baro, range and decision height; two Cursor Control Devices (CCD) plus a Cursor Control Joystick on the cyclic as backup; a Display Dimming Panel (four NVG-compatible brightness knobs); and two Master Caution / Master Warning light panels.",
      ],
    },
    {
      heading: "Reversion",
      paragraphs: [
        "The Reversionary Control Panel (RCP) reconfigures the aircraft after a sensor or display failure. Its AHRS and ADS selectors are normally in NORM — AHRS 1 / ADS 1 feed the co-pilot displays and AFCS channel 1, AHRS 2 / ADS 2 feed the pilot displays and AFCS channel 2. Selecting '1' or '2' forces that single source to feed all displays and both AFCS channels. The PLT/CPLT selector handles display reversion: NORM runs both DUs normally; PFD powers off that side's MFD and reverts the PFD to composite format; MFD powers off the PFD and reverts the MFD to composite. A DCP-backup menu on the PFD covers course, range, baro and DH if a DCP fails.",
      ],
    },
  ],
};

const AUTO_FLIGHT: SystemNote = {
  slug: "afcs",
  title: "Automatic Flight Control System",
  subtitle: "A four-axis dual-duplex AFCS — two Flight Control Computer channels each in two sections, pitch/roll/yaw linear actuators plus four trim actuators — with ATT and SAS as the basic modes under the upper modes and Flight Director.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Auto Flight, Chapter 22: general, controls and displays, basic modes) and Section 2A (Normal Procedures — Primary Upper Modes, Flight Director Modes).",
  sections: [
    {
      heading: "Architecture",
      paragraphs: [
        "A four-axis, dual-duplex AFCS providing stabilisation and control augmentation, Primary Upper modes and Flight Director modes. The Flight Control Computer (FCC) has two independent channels (Channel 1, Channel 2), each built from two sections (A, B), each channel on its own Power Supply Unit. Actuation is two sets of two linear actuators (a pitch and a roll linear actuator per FCC channel), one tail-rotor linear actuator independently driven by each channel, and one set of four trim actuators. The controls are the Autopilot Control Panel, the cyclic, collective and pedal grips, and the Display Control Panels; status, mode and fault information and aural annunciations come up on the Cockpit Display System.",
      ],
    },
    {
      heading: "The two basic modes",
      table: {
        columns: ["Mode", "What it does"],
        rows: [
          ["ATT (Attitude Retention)", "Long-term stabilisation for hands-off flying — holds the reference attitude and returns to it after a disturbance. Small changes via the cyclic beep switch, larger ones by holding Force Trim Correct and flying manually. Can be coupled to the Flight Director for Two-Cue (roll + pitch) or Three-Cue (adding collective / power) operation."],
          ["SAS (Stability Augmentation System)", "Short-term damping for hands-on flying with extensive manoeuvring — no attitude retention. In SAS the cyclic beep sets Flight Director references only, not attitude, and it can run with force trim ON or OFF."],
        ],
      },
      note: "Yaw control engages automatically when an autopilot is selected and stays active in both ATT and SAS; dual yaw is provided with both autopilots engaged. The collective axis drives through a parallel actuator and a force-feel assembly. Auto-trim keeps the linear actuators centred and works in every mode except SAS.",
    },
    {
      heading: "The mode set",
      paragraphs: [
        "Primary Upper modes: Altitude Hold (ALT), Altitude Acquire (ALTA), Heading Hold (HDG), Indicated Airspeed Hold (IAS), Groundspeed (GSPD), Radar Height Hold (RHT), Vertical Speed Hold (VS), Go Around (GA), and Hover Hold (HOV).",
        "Flight Director modes: VOR Navigation (VOR), Long Range 2D-Navigation (NAV), VOR Approach (VAPP), Localizer Lateral Approach (LOC), Glideslope Vertical Approach (GS), Back Course (BC), FMS Approach (NAPP), and Deceleration mode (DCL/NDCL).",
        "The AFCS annunciator area on the PFD has six fields — captured box, captured mode, excessive deviation and armed mode for each of the collective, yaw/roll and pitch axes.",
      ],
    },
  ],
};

const POWER_PLANT: SystemNote = {
  slug: "power-plant",
  title: "Power Plant",
  subtitle: "Two GE CT7-2E1 turboshafts in the 2,100 shp class, each with variable inlet guide vanes, two variable stator stages, a start bleed valve and an integral inlet particle separator, in titanium-firewalled bays on a five-point iso-static mount.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Power Plant, Chapter 71: engine installation, cowling, firewall, engine mount, air intakes, drains).",
  sections: [
    {
      heading: "The engines",
      paragraphs: [
        "Two General Electric CT7-2E1 turboshafts with a sea-level power output in the 2,100 horsepower range, in a compartment aft of the transmission. Front and rear firewalls enclose the compartment and a central firewall separates the two engines. Each engine has a five-stage axial plus one-stage centrifugal compressor, an annular combustor, a two-stage air-cooled gas generator turbine, and a two-stage uncooled power turbine whose drive shaft runs forward coaxially through the gas generator to the engine output drive.",
        "The compressor carries one stage of variable inlet guide vanes and two stages of variable stator vanes which, with an engine-mounted start bleed valve, keep the engine surge-free across its whole range. An integral inlet particle separator protects it from foreign-object damage and sand/dust ingestion.",
      ],
    },
    {
      heading: "Bays, mounts and intakes",
      paragraphs: [
        "Each engine bay is a set of titanium firewalls with a metallic cowling over a titanium inner skin; the bottom-hinged cowlings become working platforms when open. Each engine attaches to the airframe on a five-point iso-static structure — one front, four rear. The front mount is a torque tube bolted to the engine output face and joined through a gimbal ring (the crosshead) to the MGB input housing; it carries horizontal and torsional loads but very little engine weight. The four rear link assemblies interface with dedicated lugs on the engine casing and allow axial and radial thermal expansion; all links are machined from titanium and fireproof by design.",
        "Each engine draws air through its own inlet — a two-piece composite forward inlet outside the fire zone, and a two-piece metallic fireproof rear ring mounted to the engine against a firewall seal. The bay floors carry drains routed to airframe drain pipes to prevent fluid accumulation.",
      ],
    },
  ],
};

const ENGINE_CONTROLS: SystemNote = {
  slug: "engine-controls-fadec",
  title: "Engine Controls (FADEC)",
  subtitle: "A dual-channel FADEC per engine — EECU plus Fuel Management Unit — collective LVDT power anticipation, and the engine control panel logic behind ENG MODE, the OEI training mode, load sharing and the AEO/OEI torque limiters.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Engine Controls, Chapter 76: EECU, FMU, engine control panel) and Engine Indicating, Chapter 77; Section 1 (Limitations — Power Plant / GE CT7-2E1) for the ratings.",
  sections: [
    {
      heading: "The FADEC",
      paragraphs: [
        "Each engine has a dual-channel Full Authority Digital Electronic Control (FADEC) built from an Electronic Engine Control Unit (EECU) and a Fuel Management Unit (FMU). The EECU holds all the computations and control laws and has full authority over every control input to the engine across its range, controlling gas generator and power turbine speeds against the load demanded by the rotor. Its dual-channel architecture with electrical redundancy of all critical functions means it keeps running after virtually any single detected electrical failure.",
        "The FMU sits on each engine's accessory gearbox — an electro-mechanical unit with its own fuel pump that governs fuel flow across the whole engine envelope from the EECU signals and ambient pressure. Two LVDTs on the left end of the collective torsion tube send collective position to the EECUs (and the AFCS) for power anticipation.",
      ],
    },
    {
      heading: "The engine control panel",
      table: {
        columns: ["Control", "Function"],
        rows: [
          ["ENG 1(2) MODE selector", "OFF / IDLE / FLT — the automatic-mode operating condition, and the fuel solenoid valve. The knob must be pushed to select OFF from IDLE. CRANK selects that engine's crank function"],
          ["TNG guarded push-button", "Enables One Engine Inoperative Training Mode; green light when selected"],
          ["LD SHARE switch", "TORQUE — EECUs match engine torques. TEMP — EECUs match inter-turbine temperatures"],
          ["AEO LIM SEL push-button", "Push/release arms 30 seconds of the all-engines torque limiter — total AEO torque limited to a combined 232% TQ. Push/release again to de-activate"],
          ["OEI LIM SEL push-button", "Push/release arms 30 seconds of the one-engine-inoperative torque limiter. Push/release again to de-activate"],
        ],
      },
    },
    {
      heading: "The ratings and indications",
      table: {
        caption: "GE CT7-2E1 power index (PI %) ratings",
        columns: ["Condition", "PI %"],
        rows: [
          ["AEO Maximum Continuous", "100"],
          ["AEO 30 min / 5 min range", "101 to 116"],
          ["AEO transient (5 s)", "123"],
          ["OEI Maximum Continuous", "142"],
          ["OEI 2.5 min range", "143 to 172 (max 30 s above 164 — automatic power reduction then limits to 164%)"],
          ["OEI transient (5 s)", "180"],
        ],
      },
      note: "Engine parameters on the PFD: Ng (gas generator speed), Np/Nf (free power turbine speed), Tq, ITT/T4.5, oil pressure and temperature, PI, and the Nf/Nr triple tacho. The PWR PLANT page shows all scales and limits; the ENGINE page shows the power-check result, the EECU channel in command, and the fuel feed/cross-feed status side by side.",
    },
  ],
};

const ELECTRICAL_POWER: SystemNote = {
  slug: "electrical-power",
  title: "Electrical Power (EPGDS)",
  subtitle: "Two 25 kVA starter-generators plus a 25 kVA APU generator making 115/200 VAC, three TRUs and two NiCd batteries for 28 VDC, a start rectifier making 270 VDC for engine start, and a solid-state plant-management layer replacing the breaker panels.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Electrical Power, Chapter 24: AC generation, DC generation, AC/DC load distribution, SSEPMS, emergency power supply); Section 1 (Limitations — Electrical / Hydraulic).",
  sections: [
    {
      heading: "What it does",
      paragraphs: [
        "The Electrical Power Generation and Distribution System (EPGDS) generates 115 VAC 400 Hz, converts it to the 28 VDC the loads need, provides 270 VDC to start each main engine through its starter-generator, provides 28 VDC to start the APU, and distributes 28 VDC to the loads. It is grouped into four subsystems: AC Start-Generation, DC Generation, AC/DC Power Distribution and Control, and the Solid State Electrical Plant Management System.",
      ],
    },
    {
      heading: "AC generation and engine start",
      paragraphs: [
        "Two 25 kVA 115/200 VAC starter-generators (SG 1, SG 2), each with its own on-side Starter-Generator Converter Unit (SGCU) that controls it for both generation and main engine start. A single Start Rectifier Unit between the two SGCUs passively rectifies AC to 270 VDC for the start, one engine then the other. The APU carries its own 25 kVA generator (115/200 VAC, 400 Hz) managed by a Digital Generator Control Unit. AC power from the starter-generators feeds AC PDU GEN (which holds AC MAIN BUS 1 and AC MAIN BUS 2); APU generator power feeds AC PDU APU.",
      ],
    },
    {
      heading: "DC generation and distribution",
      paragraphs: [
        "Three 28 VDC Transformer Rectifier Units (VCU/TRU 1, 2, 3) convert 115/200 VAC to 28 VDC. Two 17 Ah nickel-cadmium batteries — a main battery and an optional auxiliary battery, both in the nose avionic bay — provide starting and emergency power; the main battery can start the APU. Two DC Power Distribution Units (DC PDU1, DC PDU2) feed the circuit breaker panels and three Remote Electrical Power Units (REPU), with contactor logic, current and voltage monitoring, and over/under-voltage protection. Two circuit breaker panels on the overhead console protect the feeders.",
        "The Solid State Electrical Plant Management System (SSEPMS) replaces most of the circuit breaker panel and its control panels, switches and relays with assemblies of solid-state power controllers, driven from two dedicated electrical display units (E-DU).",
      ],
    },
    {
      heading: "Controls, load shedding and emergency power",
      paragraphs: [
        "The EPGDS control panel carries BATT MASTER, MAIN BATT, AUX BATT, EMER GEN and AC/DC EXT POWER. The ECDU ELEC page lets the crew take a generator or TRU on/off line, reset the bus-tie contactors, and override the non-essential bus shed to restore power to the non-essential loads — the non-essential shed is otherwise automatic. A synoptic page (MFD, on ground or in flight) shows the electrical system graphically.",
        "The optional emergency power supply — two six-cell battery packs in the nose bay — normally floats on the No. 1 emergency bus and, on a total loss of 28 VDC, automatically supplies the emergency bus (28 VDC and 5 VDC to the ISIS) for at least 30 minutes, with a front-panel push-button test.",
      ],
    },
  ],
};

const FUEL_SYSTEM: SystemNote = {
  slug: "fuel-system",
  title: "Fuel System",
  subtitle: "Two L-shaped bladder tanks joined by an interconnection flange, each keeping an independent collector below that flange, two boosted distribution circuits with an auto/manual cross-feed, and engines that will run on suction alone if the boost pumps fail.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Fuel System, Chapter 28: storage, distribution, indicating, venting, pressure refuel/defuel).",
  sections: [
    {
      heading: "Storage",
      paragraphs: [
        "Two L-shaped bladder-type main tanks, symmetrical, with the airframe frames and honeycomb panels forming a fume-proof enclosure. A 100 mm interconnection flange between the left and right tanks sits on the central airframe panel; below its level the fuel volume in each tank is completely independent and forms a collector from which that side's engine is supplied — so a leak above the flange cannot drain the whole system. The filler for gravity refuelling is on the left tank.",
      ],
    },
    {
      heading: "Distribution and cross-feed",
      paragraphs: [
        "Two independent boosted circuits, one per engine, plus the APU feed. Each tank has an electric boost pump at its sump low point (kept clear of air ingestion; leakage drains overboard at the aircraft centreline). The boost pumps are switched from the ECDU. A cross-feed line with an electric valve lets one circuit supply both engines — it opens automatically on a low-pressure signal from a feed-line pressure switch, and can also be operated manually from the ECDU. The engine high-pressure pumps can maintain an adequate supply in pure suction mode if the boost pumps fail.",
        "The shut-off and cross-feed valves are grouped in two manifolds: the No. 1 (left) manifold holds the No. 1 engine SOV and the APU SOV, the No. 2 (right) manifold holds the No. 2 engine SOV and the cross-feed valve. There are 10 cautions and 2 advisories for the fuel system and no fuel-system warnings.",
      ],
    },
    {
      heading: "Indicating and venting",
      paragraphs: [
        "The Fuel Quantity Gauging System has two totally independent channels for gauging and low-level sensing, so a failure of one does not affect the other. It is pre-calibrated with no on-aircraft calibration; it uses a lower probe as a reference to compensate for fuel density whenever the upper probe shows enough fuel to keep the lower probe immersed. Two independent tank vent systems prevent over-pressure, siphoning and roll-over leakage.",
      ],
    },
    {
      heading: "Pressure refuel / defuel (optional)",
      paragraphs: [
        "An optional kit with an adapter on the right side (with a pressure-relief button on its cap), a pressure refuel/defuel shut-off valve on the No. 2 tank sump, a vent valve limiting internal pressure to 2 psi, and a high-level valve as a back-up refuelling shut-off if the indicating system fails. Refuelling is controlled from the refuel/defuel panel or the MCDU — set the target quantity on the MCDU, switch on, and the AMMC removes the 28 VDC from the valve when the pre-set level is reached.",
      ],
    },
  ],
};

const FIRE_PROTECTION: SystemNote = {
  slug: "fire-protection",
  title: "Fire Protection",
  subtitle: "A continuous fire wire in each engine bay and an independent one for the APU bay, two cross-connected HALON 1301 bottles for the engines and one dedicated bottle for the APU, and a baggage smoke detector with no fixed extinguisher.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Fire Protection, Chapter 26: controls and displays, fire detection system, baggage smoke detection, fire extinguisher systems).",
  sections: [
    {
      heading: "Detection",
      paragraphs: [
        "Each engine bay and the APU bay carry an independent fire wire — a sealed tube of inert helium with an internal metal core of active gas and a pressure transducer. When any short length of the wire gets hot, the core releases active gas, pressure rises, and the transducer trips, so a hot spot anywhere along the run is detected. The baggage compartment has a roof-mounted photoelectric smoke detector working on light scattering (the Tyndall effect); there is no fixed extinguishing system for the baggage bay.",
        "An engine bay fire gives the ENG 1(2) FIRE CAS message, the audio tone with the master warning flashing, a red FIRE on the fire control panel, a red light on that engine's control panel, and a red engine silhouette with a FIRE message on the MFD PWR PLANT format. An APU bay fire gives APU FIRE with the audio tone, master warning, and a red light on the APU control panel plus a red APU silhouette on the PWR PLANT format.",
      ],
    },
    {
      heading: "Extinguishing",
      paragraphs: [
        "Two identical, interchangeable stainless-steel bottles charged with HALON 1301 and nitrogen sit between the engine ejectors under the rear sliding fairing, cross-connected so either bottle can discharge into either engine bay, each with a temperature-compensated pressure sensor for a low-pressure indication. One dedicated stainless bottle for the APU sits behind the APU forward firewall, with a single outlet and a single electrically-actuated cartridge.",
        "Pushing the ENG 1(2) FIRE/ARM button shuts that engine down by closing its fuel shut-off valve and also closes the heating-system bleed shut-off valve; the FIRE EXTING switch then discharges bottle 1 or bottle 2. For the APU, the FIRE EXT push-button shuts the APU down (fuel SOV) and closes its heating bleed SOV, and the BTL switch (moved up) discharges the APU bay bottle.",
      ],
    },
  ],
};

const HYDRAULIC_SYSTEM: SystemNote = {
  slug: "hydraulic-system",
  title: "Hydraulic System",
  subtitle: "Two independent 3,000 psi circuits built around Power Control Modules, No. 1 also driving emergency landing-gear extension and No. 2 the utility circuit and the tail-rotor shut-off valve, with an interlock that will not let both circuits be excluded at once.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Hydraulic System, Chapter 29: controls and displays, main hydraulic system, auxiliary hydraulic system).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "Two independent circuits at a nominal 3,000 psi (207 bar) operate the main and tail-rotor servo-actuators and the landing gear. The Power Control Module (PCM) — reservoir, shut-off valves, filters and sensors — is the main module of each circuit, mounted on the upper deck in front of the MGB; it stores, filters and supplies the fluid and monitors pressure and temperature. The Tail Rotor Shut-Off Valve (TRSOV) is the only component outside the PCMs — it isolates the circuit 2 tail-rotor actuator line if it leaks.",
        "Each circuit powers one channel of the three main-rotor actuators and the one tail-rotor actuator. In the main-rotor actuators, circuit 1 feeds the upper body and circuit 2 the lower body. The two circuits are routed on opposite sides of the fuselage and tail for physical segregation.",
      ],
    },
    {
      heading: "The pumps",
      paragraphs: [
        "System 1 has one MGB-driven self-regulating mechanical pump (HPS1) plus a 28 VDC electric pump (HPS3) — a variable-delivery axial-piston pump for ground pre-flight flight-control checks only, on a 2-minute timer. System 2 has two MGB-driven self-regulating mechanical pumps (HPS2 and HPS4), driven separately so one drive fault cannot lose both; HPS4 sits on the MGB auxiliary pad next to the forward main-rotor actuator and is identical to HPS1 and HPS2.",
        "System 1 also feeds emergency landing-gear extension; system 2 feeds the utility circuit — normal landing-gear extension and retraction.",
      ],
    },
    {
      heading: "Interlock and automatic protection",
      paragraphs: [
        "The ECDU hydraulic page has a NORM / 1CLSD / 2CLSD toggle (default NORM, both SOVs open) and an ELEC PUMP toggle. The two circuits are interlocked so both can never be excluded at once, and an excluded circuit is automatically re-activated if the other loses pressure.",
      ],
      table: {
        caption: "PCM reservoir level switches",
        columns: ["Trigger", "Action"],
        rows: [
          ["PCM 1 minimum level (0.7 L)", "Closes the PCM emergency-circuit SOV to stop further pressure loss"],
          ["PCM 2 LOW1 (1.3 L)", "Closes the utility SOV to stop further pressure loss"],
          ["PCM 2 LOW2 (0.9 L)", "Opens the utility SOV and closes the TRSOV; if the flight-control SOV was closed it re-opens and its closure is inhibited"],
          ["PCM 2 minimum level (0.7 L)", "Closes the utility SOV again"],
        ],
      },
      note: "HYD1 and HYD2 pressure and temperature show as digital readouts on the PFD, on the PWR PLANT format and on the HYDRAULIC synoptic page. There are no hydraulic-system warnings, only cautions.",
    },
  ],
};

const TRANSMISSION: SystemNote = {
  slug: "main-rotor-drive-and-transmission",
  title: "Main Rotor Drive and Transmission",
  subtitle: "Two input modules with sprag freewheels feeding a three-stage MGB that steps 21,420 rpm down to 290 at the mast, drives every hydraulic pump and the rotor brake, and runs on its own forced-oil lubrication.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Main Rotor Drive, Chapter 63: MGB, engine/gearbox couplings, lubricating system, rotor brake).",
  sections: [
    {
      heading: "Engine to gearbox",
      paragraphs: [
        "Each engine has its own identical coupling to the MGB: a drive shaft inside a torque tube, a gimbal assembly, and an input module. The flexible coupling accommodates angular and axial misalignment and provides the engine-disconnect function. Each input module changes the axis of rotation, provides the first stage of speed reduction, and contains a sprag-type freewheel unit that lets the MGB overspeed an engine while still driving the accessories. Each input module keeps a small local oil reservoir, normally recharged by the main system.",
      ],
    },
    {
      heading: "The main gearbox",
      paragraphs: [
        "A three-stage reduction gearbox turning the horizontal drive from the two engines into a vertical drive to the mast and main-rotor hub. First stage is a spiral bevel gear in the input stage, second stage a spiral bevel, third stage an epicyclic planetary in the upper module. The 21,420 rpm engine input becomes 290.45 rpm at the mast; the tail-rotor take-off drives the tail-rotor drive shafts at 4,645 rpm. The MGB also drives the No. 1, No. 2 and No. 3 hydraulic pumps, the optional AC generators, the oil cooler and fan, the two lubrication pumps, and the rotor brake, and carries the three main-rotor actuators. It is secured to the airframe by a mounting installation including an anti-torque beam.",
        "Lubrication is an integral forced-oil system: cored oil ducts feed screened directional jets aimed at every gear mesh and bearing, each pump output passes a pressure-regulating valve holding a maximum 5.1 psi (bypassing excess back to the sump), and the oil cooler assembly carries the filter (with an anti-spill valve and differential-pressure monitoring) and the temperature/pressure sensors. The MFD annunciates MGB oil pressure and temperature, chip detection, low oil level, impending filter block and input-bearing temperature — 11 cautions and 2 warnings for the main rotor drive.",
      ],
    },
    {
      heading: "Rotor brake",
      paragraphs: [
        "The rotor brake stops the main rotor after shutdown and holds it parked for up to 8 hours. It may only be used with both engines OFF and rotor speed (NR) below 40%. Moving the cockpit Rotor Brake Control Lever from its OFF detent actuates a dual-stage pump in the Rotor Brake Control Module on the upper deck, which sends hydraulic pressure from the Rotor Brake Reservoir Assembly to pistons in the Rotor Brake Assembly; the pistons drive pads onto a rotating disc, braking the rotor through the MGB via the tail-rotor drive shaft.",
      ],
    },
  ],
};

const TAIL_ROTOR_DRIVE: SystemNote = {
  slug: "tail-rotor-drive",
  title: "Tail Rotor Drive",
  subtitle: "Four drive shafts — a fire-resistant titanium No. 1 shaft between the engine exhausts, three aluminium-alloy shafts aft — a 49° intermediate gearbox and a single-stage tail gearbox that also takes the anti-torque load into the boom.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Tail Rotor Drive, Chapter 65: controls and displays, tail rotor drive shaft installation, intermediate gearbox, tail gearbox).",
  sections: [
    {
      heading: "The drive shafts",
      paragraphs: [
        "Four drive shafts carry power from the MGB tail take-off to the tail rotor. The No. 1 shaft is a critical shaft — flow-formed titanium for fire resistance, electron-beam welded — running rearward between the two engine exhaust ducts, connected forward through a flexible coupling to the MGB tail take-off flange. Shafts No. 2, 3 and 4 are anodised aluminium alloy with welded end fittings. The shafts are joined through forward and rear bearing-housing assemblies and flexible couplings; No. 3 connects to the IGB, No. 4 to the TGB.",
      ],
    },
    {
      heading: "The gearboxes",
      table: {
        caption: "Tail rotor drive gearbox speeds",
        columns: ["Gearbox", "Input", "Output"],
        rows: [
          ["Intermediate Gearbox (IGB) — bevel, at the base of the fin, turns the drive up 49° to the TGB", "4,354 rpm", "3,323 rpm"],
          ["Tail Gearbox (TGB) — single-stage, on top of the fin, drives the tail rotor and takes anti-torque loads into the boom", "3,389 rpm", "1,407.3 rpm (tail-rotor nominal speed)"],
        ],
      },
      note: "Both gearboxes have an oil temperature sensor at the bottom of the casing, displayed on the PFD under IGB or TGB labels (green normal, amber out of range, red requires action), plus static low-oil-level sensors that only work on the ground with NR below 5%. There are 12 cautions for the tail rotor drive. The ECDU runs a transmission oil-level test (7 seconds, cautions shown only in the last 2), and an IGB CHIP caution can be answered by a CHIP BURN switch on the ECDU transmission page.",
    },
  ],
};

const ROTORS: SystemNote = {
  slug: "main-and-tail-rotors",
  title: "Main and Tail Rotors",
  subtitle: "A five-blade main rotor on a one-piece forged titanium hub with elastomeric bearings and hydraulic lag dampers, and a four-blade articulated 2.9 m tail rotor with elastomeric bearings and dampers.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Main Rotor, Chapter 62: blades, head, rotating controls; Tail Rotor, Chapter 64: blades, head, rotating controls).",
  sections: [
    {
      heading: "Main rotor",
      paragraphs: [
        "Five composite blades — nickel and titanium leading-edge erosion shields, a D-section spar of unidirectional carbon and glass laminate, honeycomb-cored glass-fibre tip, root and tip balance-weight pockets, and a bendable metal trim tab for tracking. The head is a one-piece forged hub (splined to the mast, with a titanium flange for the scissor drive links and the sliding ring), graphite cross-ply tension links carrying the blade attachments, elastomeric bearings (aluminium inner, titanium outer, rubber and metal discs) that allow blade motion while reacting centrifugal force, conventional hydraulic lag dampers, and multi-function control levers.",
        "The rotating controls transfer pilot inputs from the fixed controls to the head: a stationary and a rotating swashplate on a duplex ball bearing, the pair mounted on a central spherical bearing on the swashplate guide tube so they can tilt (cyclic) and translate (collective); an aluminium spherical pivot on top of the MGB that slides vertically against four centring plates; two rotating scissor links driving the rotating swashplate from the hub; and one pitch link per blade.",
      ],
    },
    {
      heading: "Tail rotor",
      paragraphs: [
        "A four-blade articulated rotor, 2.9 m diameter. Each blade attaches through an elastomeric bearing that permits lead-lag, flap and pitch change and carries the blade loads into the hub, with an elastomeric damper per blade. The blade spar is D-shaped carbon/glass over a Rohacell foam core. The rotating controls are a control rod inside the mast, driven by the servo at one end and connected at the other to a spider that drives the four blades through elastomeric-ended pitch links; two rotating scissors give the spider its rotation, and a duplex ball bearing allows relative motion between spider and control rod.",
      ],
    },
  ],
};

const ROTOR_FLIGHT_CONTROLS: SystemNote = {
  slug: "rotor-flight-controls",
  title: "Rotor Flight Controls",
  subtitle: "Mechanical rod-and-bellcrank linkages from the crew controls through a mixing unit to three fixed-body dual-tandem main-rotor actuators and a tail-rotor actuator carrying the SCAS — no control panel, status only through a 1/2 SERVO caution.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Rotors Flight Control, Chapter 67: main rotor control system, tail rotor control system, servo control system).",
  sections: [
    {
      heading: "Main rotor controls",
      paragraphs: [
        "The pilot and co-pilot collective levers connect to a carbon-fibre torsion tube behind the cockpit seats, with a factory-set fixed friction, a pilot-adjustable friction knob, non-adjustable balancing springs, a collective trim actuator in parallel (under the co-pilot floor, interfacing the AFCS), and two LVDTs feeding collective position to the engines and AFCS.",
        "The cyclic is a mechanical dual rod-and-bellcrank linkage from the two identical sticks, making a common input to the mixing unit for pitch and roll. It carries fixed friction on the lower bellcrank, two-channel pitch and roll linear actuators between the upper bellcrank and the mixing unit (fast AFCS response), and cyclic trim actuators in parallel under the co-pilot floor. The mixing unit on the cabin under-roof combines cyclic push-pull inputs and collective rotary inputs and drives the three main-rotor actuators.",
      ],
    },
    {
      heading: "Tail rotor controls",
      paragraphs: [
        "Each crew member has a yaw pedal assembly that also works the wheel brakes (both pedals forward together on the ground). A micro-switch under each pedal gives a trim that is active only with no pilot force applied — as soon as force is applied the trim stops and the pilot has full authority. There is a factory-set fixed friction on the first yaw bellcrank and a pedal trim actuator that, with the AFCS engaged and trim on, also provides force feel.",
      ],
    },
    {
      heading: "Servo actuators",
      paragraphs: [
        "Three identical fixed-body main-rotor servo-actuators — LEFT, RIGHT, FORWARD — each two separate cylinder assemblies bolted at the centre with tandem pistons, the upper piston eye on the fixed swashplate and the lower cylinder eye on a MGB support. Each actuator runs on both hydraulic systems, kept completely separate within the actuator. The tail-rotor servo-actuator on the 90° tail gearbox is the same two-separate-systems design and carries the Stability Control Augmentation System (SCAS) in the body fed by hydraulic circuit 2; loss of one hydraulic system does not degrade handling.",
        "A pressure switch on each main- and tail-rotor actuator control valve watches for a jammed spool. If one locks, that switch signals the PFD and a 1 SERVO or 2 SERVO indication comes up.",
      ],
    },
  ],
};

const APU: SystemNote = {
  slug: "auxiliary-power-unit",
  title: "Auxiliary Power Unit",
  subtitle: "A Safran Microturbo e-APU 60 above the cabin roof driving a 25 kVA generator on the ground and in flight, with bleed air to the ECS restricted to cold-day ground use only, and a full-authority ECU sequencing the start.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Airborne Auxiliary Power, Chapter 49: general, controls and displays, engine (APU), engine fuel system, lubricating system, ignition/starting system); Section 1 (Limitations — APU / Safran Microturbo e-APU 60).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "One Safran Microturbo e-APU 60 (e-AAP 60) — a gas turbine driving a generator — in a separate high-level fireproof compartment above the cabin roof, between the two main engines, aft of the MGB. It drives a 25 kVA generator that feeds the EPGDS on the ground and in flight. It can also supply bleed air to the ECS for cockpit and cabin heating, but only on the ground, only when OAT is below +20°C; bleed-air extraction is not allowed during main engine start or in flight.",
      ],
    },
    {
      heading: "Control and start",
      paragraphs: [
        "The APU has its own control panel on the interseat console (which also carries the APU fire-protection controls). The AAP selector has OFF, ON (a fixed 45° position), START (momentary 45°, springs back to ON) and CRANK (momentary 90° from OFF, springs back to OFF). Status lights: READY (ECU ready to start), START (starting), ON (fuel SOV open and fuel pump running), CLDWN (cool-down — the APU runs at constant RPM with no load for 1 minute before it stops, for thermal stabilisation), and FAIL (a power-up built-in-test failure — READY does not light).",
        "A digital Electronic Control Unit in the baggage compartment has full authority: it sequences the accessory commands, holds APU speed at its set value, and monitors and protects the system per the operating mode. Starting is by a 28 VDC brush starter motor off the battery bus, with a capacitor-discharge ignition exciter (28 VDC or a 24 VDC battery) feeding two igniter plugs.",
      ],
    },
    {
      heading: "Fuel and oil",
      paragraphs: [
        "The APU fuel system heats the fuel (a fuel heater with a thermostatic valve keeps it above 0°C in cold conditions), filters it through a low-pressure filter, meters it with a Fuel Metering Pump under ECU control to hold constant RPM, and distributes it through a flow-divider manifold to three standard start burners and six air-blast main burners.",
        "The APU has its own lubrication system — oil pump, high-pressure relief valve, oil filter with a by-pass relief valve and a pre-clogging indicator, an oil pressure switch, an air/oil heat exchanger integrated into the gearbox, an oil level and temperature sensor in the sump, and an electrical chip detector plug (with continuity check) that lights a warning if it detects a particle.",
      ],
    },
  ],
};

const ICE_RAIN_PROTECTION: SystemNote = {
  slug: "ice-and-rain-protection",
  title: "Ice and Rain Protection",
  subtitle: "Heated pitot-static probes on the emergency busbars, two independent windshield wipers, and an optional ice detector whose detection capability is explicitly not credited.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Ice and Rain Protection, Chapter 30: pitot tube heating, windshield wiping, ice detector system).",
  sections: [
    {
      heading: "Pitot heating",
      paragraphs: [
        "The two pitot-static probes are protected against icing by an internal-resistor heating element in the rear of each tube, controlled from the ECDU system menu and powered from the 28 VDC EMER busbars. Two icons by the helicopter silhouette on the MFD PWR PLANT format show the state: not shown when the system is off, green when energised and heated, amber when it has not been energised despite OAT below the minimum, or when a heating failure is detected.",
      ],
    },
    {
      heading: "Windshield wipers",
      paragraphs: [
        "Two identical installations, one per windshield, each a wiper motor converter, arm and blade, operable separately or together. The ECDU sets MODE (SINGLE or DUAL) and SPEED (OFF, SLOW, FAST — default OFF); with SPEED OFF the wiper cannot be started from the cyclic. A push-button on each cyclic stick then starts the motor once the mode is set on the ECDU.",
      ],
    },
    {
      heading: "Ice detector (optional)",
      paragraphs: [
        "An optional Goodrich ice detector on a fairing on the left side of the fuselage, with an ICE PROTECTION page on the ECDU (ICE DET OFF/ON and TEST). Selected ON, it shows a green ICE DET ON advisory, and a white ICING status message when the sensor detects ice; TEST briefly shows ICING to confirm the system works.",
      ],
      note: "The RFM states plainly that the ice detection capability of the system has not been assessed, so no credit is to be given to it — icing conditions may not be detected. There is no airframe or rotor anti-ice/de-ice on this configuration.",
    },
  ],
};

const ENVIRONMENTAL_CONTROL: SystemNote = {
  slug: "environmental-control-system",
  title: "Environmental Control System",
  subtitle: "Heating by mixing engine or APU bleed air with outside air through a jet pump, an APU bleed source gated by weight-on-wheels, and an engine-SOV OVERRIDE for taking bleed off the good engine after an engine failure.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Environmental Control, Chapter 21: general, controls and displays, heating system) and the Optional Equipment Supplement (air conditioning).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The ECS heats, cools and treats the air for the cockpit, cabin and avionics. Heating mixes hot bleed air — from the engines or the APU — with outside ambient air drawn from under the cabin floor. A jet pump on the rear-fuselage ceiling (a composite venturi with a stainless bleed-air injector) uses the bleed air to induce the ambient airflow and to deliver a controlled-temperature flow for heating and demisting; three check valves stop reverse flow to the APU or engine bleed ports. A Heating Control Box controls the system in AUTO, through a Temperature Control Valve. Status shows on the PWR PLANT format, the HELO display and the CAS window (four cautions, four advisories).",
      ],
    },
    {
      heading: "Controls",
      table: {
        columns: ["Control", "Function"],
        rows: [
          ["AIR COND / HEATER selector", "AIR COND — air conditioning per the temperature selector. OFF — ventilation only, per the VENT switch. APU — heating with the APU as bleed source. ENG — heating with the engines as bleed source"],
          ["Temperature selector", "AUTO — automatic air-supply temperature between cold and warm. MAN (heating only) — direct crew control of the Temperature Control Valve; holding '+' or '−' for 3–5 s fully opens or closes it; returns to centre when released"],
          ["VENT — CREW FAN / PAX FAN", "OFF / LOW / HIGH for the cockpit and cabin fans"],
          ["ENG 1(2) SOV switch", "NORMAL — the SOV opens on demand when HEATER is set to ENG; both SOVs close if HEATER is not on ENG or in an OEI condition. OVERRIDE — after an OEI condition (the engine control panel has closed both engine SOVs), the crew may open the SOV of the remaining engine if taking its bleed is acceptable; an ENG OUT signal still blocks the SOV of the failed engine"],
          ["APU SOV switch", "NORMAL — the APU SOV opens on heating demand only with the APU running and ready to load and a weight-on-wheels signal present. CLOSE — closes the APU SOV (latches back to normal when panel power is removed)"],
        ],
      },
      note: "The optional air conditioning system holds the cockpit and cabin at no more than 27°C and 65% relative humidity with an OAT of 40°C at 90% relative humidity.",
    },
  ],
};

const LANDING_GEAR: SystemNote = {
  slug: "landing-gear",
  title: "Landing Gear",
  subtitle: "A retractable nose-wheel tricycle held up by hydraulics alone — normal extension on hydraulic system 2, emergency on system 1 — a two-stage main-gear retraction, a free-swivelling self-centering nose wheel with an electromechanical centre-lock, and a composite crash tube in each leg.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Landing Gear, Chapter 32: controls and displays, nose landing gear, main landing gear).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "A nose-wheel tricycle gear — two single main wheels and a twin nose wheel — retractable and held up by hydraulics only. The brakes give progressive, differential, dynamic braking and a parking-brake function. The Landing Gear Control Panel in the cockpit carries the gear lever (UP starts retraction, DOWN starts extension), position lights (off retracted, amber in transit, green extended), an emergency switch (UNLCK amber, blinking when armed, LOCK green), the parking-brake selector (pull and turn right), and the nose-wheel centre-lock switch. Five CAS cautions cover the two hydraulic low-pressure conditions, emergency-system activation and absence of nose locking.",
      ],
    },
    {
      heading: "Extension and retraction",
      paragraphs: [
        "Normal extension and retraction is powered by hydraulic system 2 (the utility circuit); emergency extension takes hydraulic power from system 1. Each retraction actuator applies a mechanical lock when extended — the nose actuator also acts as the drag brace against folding. The nose gear moves in one stage; the main gear retracts in two stages, shortening the leg before it swings laterally into the bay, with the sequence reversed on extension before it locks down.",
      ],
    },
    {
      heading: "Nose wheel",
      paragraphs: [
        "The nose gear is free-swivelling with no steering motor and self-centering after take-off. An electromechanical centre-lock holds the nose wheels at 0° for high-speed ground rolling or parking: it works electrically from a cockpit push-button, or manually on the ground through a 90° up/down movement of a locking lever. A double-stage shock absorber (low and high pressure chambers) plus a composite crash tube — 80 mm stroke — absorb the loads if the sink rate exceeds 5.5 m/s; above about 10 m/s the crash tube absorbs most of the load and is destroyed.",
      ],
    },
  ],
};

const RECORDING_SYSTEMS: SystemNote = {
  slug: "recording-systems",
  title: "Recording Systems: CVFDR and HUMS",
  subtitle: "A combined voice and data recorder with an underwater beacon and its own backup power supply, and a Health and Usage Monitoring System reading thirteen transmission accelerometers into Health Indices.",
  rfmReference:
    "AW189 RFM Section 7 (System Description — Indicating/Recording, Chapter 31: recorders system, CVFDR, HUMS; Systems Integration, Chapter 46: HUMS within the AMMS).",
  sections: [
    {
      heading: "CVFDR",
      paragraphs: [
        "A combined Cockpit Voice Recorder and Flight Data Recorder recording selected aircraft parameters and audio into internal solid-state crash-survivable memory — at least the last 25 hours of aircraft data and the most recent 120 minutes of four audio sources. The main recording unit is on the tail-boom floor structure. An Underwater Locator Beacon on the memory module, powered by a water-activated lithium battery, transmits for 30 days and works to 20,000 ft depth. A tri-axial accelerometer on the tail-boom roof measures vertical, longitudinal and lateral acceleration.",
        "A Recorder Independent Power Supply (RIPS) supplies backup power to the recorder from an internal multi-cell battery pack when aircraft power is lost, and otherwise monitors the 28 VDC bus and keeps its pack charged. The control panel in the left rear avionics compartment has a BIT test, CVR FAIL and FDR FAIL indicators, an FDR RCRD ground-test switch, a headset receptacle, and an ERASE button that only works on the ground with both engines OFF.",
      ],
    },
    {
      heading: "HUMS",
      paragraphs: [
        "The Health and Usage Monitoring System is part of the Monitoring and Diagnostic System, running in AMMC 1 and 2 from the aircraft's attitude, speed, heading, height, engine torque and speed, flight-control position and air-data sensors. Its functions are maintenance database management, basic usage and operation monitoring, transmission and structural usage monitoring, transmission and structural vibration monitoring, and rotor track and balance.",
        "The vibration functions run only with the HUMS kit installed: thirteen hermetically-sealed piezoelectric accelerometers (10 mV/G) monitor the transmission, drive train and swashplate. Algorithms turn the vibration signatures into Health Indices tied to component health, stored on the Data Transfer Device for download to a ground station. No initialisation, upload or configuration is required. Maintenance data is read on the MFD via SYSTEM → MAINTENANCE → H/C MAINT.",
      ],
    },
  ],
};

export const AW189_SYSTEM_NOTES: SystemNote[] = [
  INTEGRATED_AVIONICS,
  AUTO_FLIGHT,
  POWER_PLANT,
  ENGINE_CONTROLS,
  ELECTRICAL_POWER,
  FUEL_SYSTEM,
  FIRE_PROTECTION,
  HYDRAULIC_SYSTEM,
  TRANSMISSION,
  TAIL_ROTOR_DRIVE,
  ROTORS,
  ROTOR_FLIGHT_CONTROLS,
  APU,
  ICE_RAIN_PROTECTION,
  ENVIRONMENTAL_CONTROL,
  LANDING_GEAR,
  RECORDING_SYSTEMS,
];
