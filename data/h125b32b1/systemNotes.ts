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

const VEMD: SystemNote = {
  slug: "vemd",
  title: "VEMD: Vehicle and Engine Management Display",
  subtitle: "One duplex indicator, three modes, and the page flow behind ENGINE, VEHICLE, FLI, Flight Report, Engine Power Check, and Performance.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Section 7.4 (Vehicle and Engine Management Display — General, Characteristics, Operating Modes, VEMD Controls, Operation, Operational Mode).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The VEMD is a duplex indicator with two matrix LCD screens, centered on the instrument panel, built from three modules: two processing modules (LANE 1 and LANE 2) and one display module holding both screens and the control pushbuttons. It runs on a dual 28 VDC supply, protected by fuses or circuit breakers.",
      ],
    },
    {
      heading: "Three modes",
      table: {
        columns: ["Mode", "Access", "Purpose"],
        rows: [
          ["OPERATIONAL", "Ground or flight", "Main operating mode — ENGINE, VEHICLE, FLI, FLIGHT REPORT, and ENGINE POWER CHECK pages"],
          ["CONFIGURATION", "Ground only", "Press and hold OFF1/OFF2, then SELECT+ENTER, then OFF1/OFF2 again, hold until RELEASE KEY appears — used to configure the VEMD"],
          ["MAINTENANCE", "Ground only", "Same sequence as CONFIGURATION but with SCROLL+RESET in place of SELECT+ENTER — accesses Flight report, Failure report, Overlimits, Engine Health Check, Operating times, EECU data, and Data loading"],
        ],
      },
      note: "At power-up (triggered by EXT PWR/BAT or BAT/EPU), the VEMD runs an initialization test on both processing lines. Either line can be cut off during the test by pressing its OFF1/OFF2 button, which validates the test and switches the remaining line to operating mode. A successful test goes automatically to OPERATIONAL mode.",
    },
    {
      heading: "Controls",
      table: {
        columns: ["Control", "Function"],
        rows: [
          ["OFF1 / OFF2", "Switch processing module 1/2 and its screen ON/OFF"],
          ["SCROLL", "Step through pages"],
          ["RESET", "Return to the nominal display configuration"],
          ["SELECT", "Select a data field"],
          ["+ / −", "Increase/decrease a selected numeric value"],
          ["ENTER", "Validate the selected data, or step through a list of available data"],
          ["BRT +/−", "Screen brightness"],
        ],
      },
    },
    {
      heading: "The pages",
      paragraphs: [
        "FLI (First Limitation Indicator) is the default summary page. If any FLI parameter becomes invalid, the ENGINE page displays automatically instead, showing the same parameters on independent scales. The VEHICLE page shows aircraft-level parameters and is automatically replaced by the FLIGHT REPORT page once the VEMD detects engine shutdown with NR below 70 rpm — a flight number (auto-incrementing), flight time (Ng > 60% after start to Ng < 50% at shutdown), generator and free-turbine cycle counts, and a yellow message area if a discrepancy was detected during the flight.",
        "The Engine Power Check (EPC) page runs in three phases — value stabilization, a more restrictive stabilization, then margin computation — and its second page reports the result across six parameters (Ng, Nf, T4, Hp/Zp, Tq, OAT) with the positive or negative differences in T4 and torque.",
        "The PERFORMANCE page computes takeoff weights (IGE and OGE) from equipped empty weight, crew weight (default 80 kg at power-up), and payload (defaults to the maximum internal takeoff weight), combined with Hp and OAT — both of which can be manually adjusted for mission planning; changing Hp automatically decreases OAT per the standard atmosphere law. IGE/OGE values below the aircraft's all-up weight display in yellow; if actual hover performance exceeds the demonstrated envelope on the HIGE/HOGE charts, IGE/OGE shows in white with the corresponding weight in yellow instead.",
      ],
    },
  ],
};

const CENTRAL_WARNING_PANEL: SystemNote = {
  slug: "central-warning-panel",
  title: "Central Warning Panel and Ancillary Systems",
  subtitle: "Three ASU cards behind the caution/warning lights — including the one that runs the engine fuel back-up system, not just the annunciators.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Section 7.3 (Central Warning and Ancillary Systems — Description, Characteristics, Ancillary Systems).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The caution and warning panel (CWP) carries red warning lights (immediate action required) and amber caution lights (action can be delayed), backed by an audio warning system activated via the HORN switch on the central console. It runs on a dual 28 VDC supply, protected by fuses or circuit breakers.",
      ],
    },
    {
      heading: "Three Ancillary Systems Unit (ASU) cards",
      paragraphs: [
        "The ancillary systems aren't just annunciator logic — three ASU cards handle audio warnings, some visual warnings, specific electrical signal processing, and the engine fuel control back-up system. Each is dual-28VDC-supplied and fuse-protected.",
      ],
      table: {
        columns: ["Card", "Function"],
        rows: [
          ["ASU No.1", "Manages the ENG FIRE light; generates the audio high and low NR warnings; manages other audio warnings — a 'Gong' for red alarms, a continuous low tone for an MTOP overlimit"],
          ["ASU No.2", "Manages the caution lights (BATT TEMP, ENG CHIP, MGB CHIP, TGB CHIP among them) and a warning light; processes and filters the VEMD's electrical supply"],
          ["ASU No.3 (part of the Engine Back-up Control Ancillary Unit, EBCAU)", "Acquires the engine Nf indicator signal; computes and processes the signal for the back-up fuel metering valve; provides the 'back to neutral' function for that valve (a safety device, also used after maintenance testing)"],
        ],
      },
    },
  ],
};

const AFCS: SystemNote = {
  slug: "afcs",
  title: "AFCS: SFIM 85 T 31 (3-Axis)",
  subtitle: "Pitch, roll, and yaw channel damping and attitude hold, plus every automatic-disengagement failure mode and exactly what stays alive when one channel drops.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Supplement 16 (Automatic Flight Control System 3 Axis SFIM 85 T 31 — General, Description of the Installation, Limitations, Emergency Procedures, Normal Procedures).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The SFIM 85 T 31 holds pitch, roll, and yaw attitudes and heading as set by the pilot, with four additional modes: A/S (holds present airspeed), ALT (holds present pressure altitude), HDG (acquires and holds the HSI-selected heading), and T/C (automatic yaw/roll coordination in turns).",
        "The installation: an AFCS computer fed by a vertical gyro, the HSI, a directional gyro and flux valve, an air data unit, a yaw pedal displacement detector, and a lateral accelerometer (sideslip detector); a yaw pedal friction adjustment system; three series actuators (one per channel, each with its own 'channel disengaged' galvanometer); two parallel trim actuators (pitch and roll) tied to the artificial-load-release (trim release) function; an AFCS warning and monitoring panel; a control panel with P/R/Y/ALT/A-S/HDG/T-C/MONIT engagement buttons (each shows green ON when engaged); and a dedicated static inverter (115/26 VAC, 400 Hz) for AC power.",
        "A failure monitoring unit compares the vertical gyro against the instrument-panel gyro horizon across attitude sensors, the control input generating system, and the control actuators — on discrepancy or abnormal operation, it warns the pilot and disengages the faulty channel. It switches on automatically as soon as a pitch or roll channel engages.",
      ],
    },
    {
      heading: "Limitations",
      table: {
        columns: ["Limit", "Value"],
        rows: [
          ["Minimum height for hands-off operation", "400 ft (120 m)"],
          ["Minimum all-up weight with AFCS in operation", "1,300 kg (2,866 lb)"],
        ],
      },
      note: "The AFCS must be disengaged on the ground except when performing checks, and must not be engaged for takeoff if the trim test wasn't satisfactory.",
    },
    {
      heading: "Flying modes",
      table: {
        columns: ["Mode", "Envelope"],
        rows: [
          ["T/C (coordinated turns)", "Airspeed >50 KIAS, bank angle >7°"],
          ["HDG", "Airspeed >50 KIAS"],
          ["ALT", "Airspeed >60 KIAS, engagement with rate of climb/descent <1,000 fpm"],
          ["A/S", "Airspeed >50 KIAS"],
        ],
      },
      note: "Hands off, the AFCS holds attitude. With the cyclic trim released, it operates purely as a damper — the trim actuators are inhibited and the series actuators counteract disturbances within their limited authority. Cyclic beep trim changes the attitude reference directly. On yaw: 'feet off' holds present heading within the channel's authority; working the pedals shifts the heading reference; after a deliberate heading change, once turn rate drops below 1.5°/sec the new heading is captured and 'feet off' flying resumes.",
    },
    {
      heading: "Failure modes — what disengages and what doesn't",
      table: {
        columns: ["Failure", "What happens", "What still works"],
        rows: [
          ["Vertical gyro, gyro horizon, or monitoring unit failure", "AP flashes 10 s; pitch channel, roll channel, and the monitoring unit all disengage automatically. Hands on.", "HDG, ALT, and A/S go inoperative — but the yaw channel remains operative"],
          ["Hardover", "AP flashes 10 s; the faulty channel disengages automatically. Hands on — a power reduction may be needed to stay within limits.", "The other channels are unaffected"],
          ["Gyro-compass failure", "AP flashes 10 s, HDG flag on the HSI; yaw channel and the HDG function disengage automatically. Feet on.", "Pitch and roll channels remain operative"],
          ["Trim failure", "The affected trim light comes on for 10 s and disengages automatically; before disengagement, the cyclic tends to move toward the failure direction. Hands on, press trim release momentarily to deactivate the faulty channel, then re-engage AFCS.", "The AFCS continues operating on the remaining channels — the faulty one is simply left untrimmed"],
          ["Artificial load system seizure (cyclic stick seizure)", "Press cyclic trim release. If the seizure doesn't clear, apply 10 kg (22 lb) of force on the affected cyclic channel to break the trim mechanical shear device.", "—"],
          ["AC power supply failure", "AP flashes 10 s; AFCS disengages automatically. Hands on — check the inverter is genuinely ON before assuming total failure.", "—"],
          ["Complete electrical power failure", "AFCS disengages automatically and cannot be re-engaged.", "—"],
        ],
      },
    },
  ],
};

const HYDRAULIC_SYSTEM: SystemNote = {
  slug: "hydraulic-system",
  title: "Hydraulic System — Single and Dual",
  subtitle: "One servo circuit or two independent ones — the safety-unit accumulators that buy time after a pressure loss, the SAMM-vs-Dunlop servo quirk, and the exact caution logic for each configuration.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Section 7.10 (Hydraulic System — General, System Description, Normal Operation, Abnormal Operation) and Supplement 23 (Dual Hydraulic System — General, Limitations, Emergency Procedures, Normal Procedures).",
  sections: [
    {
      heading: "Single hydraulic system — the baseline",
      paragraphs: [
        "Three main rotor servos (one longitudinal, two lateral) plus a tail rotor servo provide hydraulic assistance, fed by a single constant-flow gear pump belt-driven off the engine power drive shaft near the MGB input. Total fluid volume is 3 liters (0.79 US gal) to the reservoir's max mark; the regulator holds 40 bars (580 psi).",
        "Each main rotor servo carries its own safety unit — a hydraulic accumulator, a non-return valve, and a solenoid electrovalve — that keeps hydraulic assistance alive for a limited time after a pressure loss, long enough to reach a flight regime where unassisted control forces are manageable. The tail rotor's load compensating system reduces pedal feedback loads for an indefinite period after a pressure loss, not just briefly, and can only be dumped by selecting the accumulator test switch to TEST.",
      ],
    },
    {
      heading: "SAMM vs. Dunlop servos",
      paragraphs: [
        "The AS350 can be fitted with lateral servos from either supplier, and they behave differently at the unpowered/powered transition. SAMM servos include an input clearance locking system that reduces control freeplay in bypass mode — but because the two lateral servos' unlock pressures can differ slightly (unequal control loads, or manufacturing tolerance in the unlock threshold), pressurizing the system with the collective locked can produce a large, sudden cyclic movement to one side; the pilot should hold the cyclic firmly (about 5 daN / 11 lbf) through pressurization to prevent it, and expect a small cyclic movement on any powered/unpowered transition in flight. Dunlop servos have no input locking device and aren't subject to this asymmetric-unlock behavior, though a small cyclic movement on transition can still occur.",
      ],
    },
    {
      heading: "Pre-flight tests and what they check",
      paragraphs: [
        "The accumulator test (HYD TEST / ACCU TST, pressed) checks that the accumulators still provide assistance if the hydraulic power system fails — i.e. no significant leaks — flagged by the HYDR light and Gong. The hydraulic cut-off test (collective switch to OFF) checks the main servo dump electrovalves that the emergency procedures rely on; setting cut-off depressurizes all three accumulators simultaneously via their electrovalves. Repressurization on returning the switch to ON should take about 3 seconds to reach nominal pressure — this becomes the diagnostic for accumulator health (see Abnormal Operation below).",
      ],
    },
    {
      heading: "Abnormal operation — single system",
      table: {
        columns: ["Situation", "Detail"],
        rows: [
          ["Accumulator malfunction", "Normal repressurization after a cut-off test is 2–3 s; less than 1 s or more than 4 s means at least one accumulator is faulty — maintenance is required before flight"],
          ["Hydraulic pressure loss", "HYDR + Gong, controls still powered by the accumulators. Average time to reach the recommended safety speed (40–60 kt) from VNE or hover is under 30 seconds if the accumulators are properly serviced. Cut off hydraulics as soon as the safety speed is reached — even if the accumulators still have assistance left — to depressurize all three simultaneously and avoid an asymmetric lateral-accumulator depletion"],
        ],
      },
      note: "At the 40–60 kt safety speed with collective near neutral (~40% torque), expect to hold roughly 4 daN (9 lbf) left lateral cyclic and 5 daN (11 lbf) forward longitudinal cyclic continuously. In a running landing around 10 kt, forward longitudinal force can reach 17 daN (38 lbf) for under 30 seconds. In a hover, expect up to 5 daN (11 lbf) changing rapidly in direction — high workload, and prolonging flight after a hydraulic failure isn't recommended due to fatigue. Other malfunctions (individual component failures rather than a clean pressure loss) can show unusual symptoms: lateral loads pulling LEFT (requiring a RIGHT pull to counter), feedback that varies unusually with airspeed, or a cut-off switch that doesn't fully dump pressure — if the switch itself is inoperative, forces should still normalize once the accumulators deplete naturally, up to roughly 15 daN (34 lbf) lateral and 17 daN (38 lbf) longitudinal at the extremes of the speed envelope.",
    },
    {
      heading: "Dual hydraulic system (optional)",
      paragraphs: [
        "Two fully independent circuits share the same main-rotor architecture — each with its own reservoir (2 liters / 0.53 US gal to max level), gear pump, and regulator at 35 bars (507 psi), each supplying the three dual-body main rotor servos. Only the RH circuit additionally supplies the accumulator, load compensator, and yaw servo. The two pumps are driven differently — one gear-driven directly off the MGB, the other belt-driven off the engine power drive shaft — so a single drive-path fault can't take out both.",
        "A yaw hydraulic switch on the collective isolates the yaw circuit independently. SERVO TEST checks for servo distributor jamming; HYD TEST/ACCU TST runs the yaw servo accumulator test. Post-modification 07-4622, separate HYD1 and HYD2 caution lights (rather than one shared HYDR) identify which circuit has lost pressure — HYD2 also flashes if the yaw cut-off switch is OFF. A SERVO light indicates distributor seizure; a LIMIT light means the maximum lateral servo load has been reached.",
      ],
    },
    {
      heading: "Dual system — malfunction logic",
      table: {
        columns: ["Indication", "Meaning", "Action"],
        rows: [
          ["HYD1 or HYD2 + SERVO", "Pressure loss in the corresponding circuit", "Avoid abrupt maneuvers, bank <30°, IAS below 110 kt (or VNE if less); one remaining circuit allows continued safe flight and landing"],
          ["HYD2 + LIMIT possibly present", "Loss of the RH circuit — tail rotor control hydraulic power is lost", "Do not press HYD TEST/ACCU TST — this would discharge the yaw load compensator and significantly increase right pedal loads. Land as soon as practicable"],
          ["SERVO alone", "Distributor valve jamming on a main servo unit", "Land as soon as practicable"],
          ["LIMIT alone", "Main servo unit at max load, in high-speed cruise or steep maneuvers", "Reduce power (collective) and speed/load factor (cyclic); continue flight"],
        ],
      },
    },
    {
      heading: "Loss of tail rotor control (dual system)",
      paragraphs: [
        "Symptom: pedals jammed or ineffective — tail rotor thrust can't be controlled with the pedals. Set IAS to 70 kt in level flight, hydraulic cut-off switch OFF, then press ACCU TST for 2 seconds to depressurize the load compensator. Fly a shallow approach with a slight left sideslip onto a suitable running-landing area — the sideslip reduces progressively as airspeed decreases and collective is applied to cushion the landing. A right crosswind component makes the landing easier. Below 20 kt and especially near the ground, a go-around may be impossible due to loss of vertical fin efficiency.",
      ],
    },
  ],
};

const ELECTRICAL_SYSTEM: SystemNote = {
  slug: "electrical-power-systems",
  title: "Electrical Power Systems",
  subtitle: "Battery, generator, and EPU coupling logic — what stays powered on the direct battery bus-bar when everything else goes dark.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Section 7.11 (Electrical Power Systems — DC Electrical Power: General, Description and Distribution, Control and Monitoring, Operation; AC Electrical Power: General, Description and Distribution, Operation, Control and Monitoring).",
  sections: [
    {
      heading: "DC power sources",
      paragraphs: [
        "Three sources feed the 28 VDC network: a starter-generator (150 A, 200 A optional) on the engine accessory gearbox, a 15 A/h battery in the RH rear cargo bay (an optional second battery may be fitted), and a 28 V external power unit (EPU) receptacle rated 400 A max. All three connect through the Electrical Master Box (EMB), which regulates the starter-generator, connects power sources to the network via line contactors, handles distribution and fault protection, and interfaces with the indicating/control/monitoring system.",
      ],
    },
    {
      heading: "Coupling logic",
      table: {
        columns: ["Source", "Couples when", "Isolates when"],
        rows: [
          ["EPU", "28 VDC available at the plug, MASTER SW/EMER SW normal (ON), EXT PWR BATT/BAT-EPU pressed", "Disconnected — battery and generator stay isolated from the DC system until then"],
          ["Battery", "28 VDC not available at EPU plug, MASTER SW/EMER SW normal (ON), EXT PWR BATT/BAT-EPU pressed", "Automatically via EPU power, or manually via MASTER SW/EXT PWR BATT off"],
          ["Generator", "Engine running, no EPU power, MASTER SW/EMER SW normal (ON), GEN/GENE switched ON, generator voltage exceeds battery voltage by ≥0.5 V", "Manually (GEN/GENE off, or MASTER SW/EMER SW off), or automatically via EPU power, reverse current battery→generator, generator voltage >31.5 V, or CRANK activation — GENE light comes on"],
        ],
      },
    },
    {
      heading: "The direct battery bus-bar — what survives an emergency",
      paragraphs: [
        "A direct battery linkage keeps a short list of vital consumers alive even through a circuit failure or a MASTER SW/EMER SW disconnection: the transponder, the NR/Nf instrument, instrument lighting circuit 2, the crew's adjustable reading light, and the start-stop engine switch to FADEC (via a relay box) — post-MOD 07-3273/3274 aircraft add VHF1/NAV1 and one ICS power line to this list via the DCT/BATT pushbutton, and drop the reading light. This lets ground crew monitor radio and plan navigation on battery power alone without powering the whole aircraft.",
        "After actuating EMER SW to OFF in an electrical emergency, all DC power is cut except the vital consumers fed directly by the battery: the NR/Nf instrument, the crew's adjustable spot light, and the FADEC start-stop switch path.",
      ],
    },
    {
      heading: "AC power — optional, for the AFCS and gyros",
      paragraphs: [
        "AC power is only fitted when the aircraft carries an autopilot, gyroscopic instruments, or other equipment that needs it, supplied by a static inverter running off DC. Two capacities exist: a 250 VA system (115 VAC/150 VA plus 26 VAC/150 VA, max combined 250 VA) and a 10 VA system (26 VAC), both at 400 Hz. The inverter is switched on via the INVERT/INV pushbutton on the SCU; an amber INV caution light means the inverter isn't running, or the AC generating system has failed.",
      ],
    },
  ],
};

const POWER_TRANSMISSION: SystemNote = {
  slug: "power-transmission-and-rotors",
  title: "Power Transmission System and Rotors",
  subtitle: "The engine-to-MGB coupling, the three-module gearbox, and why the STARFLEX rotor head needs no bearings or lubrication at all.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Section 7.9 (Power Transmission System and Rotors — Power Transmission, Rotors).",
  sections: [
    {
      heading: "Engine to MGB",
      paragraphs: [
        "The engine/MGB coupling — a drive shaft between two flexible couplings, a coupling tube, a connecting casing, and a gimbal ring — transmits engine power to the Main Gearbox (MGB). The MGB itself reduces speed to the main rotor, drives and supports the hydraulic pump, the MGB lubricating pump, and the rotor brake, and supports the servo-controls and suspension bar attachments. Built from three interchangeable modules, it has its own lubrication system (a pump drawing oil from the sump through a strainer, delivering it through a cooler and filter, returning by gravity) and its own monitoring systems.",
      ],
    },
    {
      heading: "Tail rotor drive train",
      paragraphs: [
        "The tail rotor drive shaft comprises a forward steel shaft and a long light-alloy shaft, connected to each other, the engine, and the tail gearbox (TGB) by three flexible couplings; the long shaft rides on five ball-bearing/support assemblies mounted on elastomeric bushes for vibration damping. The TGB, at the rear of the tail boom, combines power transmission and pitch control modules in one casing, is splash-lubricated, and carries a visual oil-level indicator plus a chip-detection caution light (TGB CHIP).",
      ],
    },
    {
      heading: "Rotors",
      paragraphs: [
        "The main rotor is the semi-rigid STARFLEX design: the hub has no ball bearings and no lubrication system at all — flapping comes from the composite 'star' arms, and lead-lag/pitch hinges work through elastomeric distortion rather than mechanical joints. Three flexible glass-resin laminate blades rotate clockwise viewed from above. The two-blade tail rotor is see-saw mounted on the TGB, rotating counterclockwise viewed from the aircraft's right side.",
      ],
    },
  ],
};

const EMERGENCY_FLOATATION: SystemNote = {
  slug: "emergency-floatation-gear",
  title: "Emergency Floatation Gear",
  subtitle: "Emergency-only, not ditching-rated — the arm/fire sequence, the autorotation-onto-water profile, and the weight-dependent minimum for cold-weather NR margin.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Supplement 17 (Emergency Floatation Gear — General, Limitations, Emergency Procedures, Normal Procedures, Performance Data).",
  sections: [
    {
      heading: "What it is — and what it isn't",
      paragraphs: [
        "This gear is approved for emergency use only — not for ditching under JAR 27 — to keep the rotorcraft sufficiently upright and trimmed for safe, orderly evacuation after an emergency water landing. It consists of two floatation units mounted parallel along each skid, inflated from two cylinders (one per float, each with a pressure indicator), a FLOAT ARM pushbutton, and a FLOAT FIRING/FLOAT FIRE pushbutton.",
      ],
    },
    {
      heading: "Limitations",
      table: {
        columns: ["Limit", "Value"],
        rows: [
          ["Minimum weight, OAT < 0°C", "1,480 kg (3,263 lb) — to preserve minimum rotor RPM margin after an engine failure"],
          ["Max IAS, gear stowed/armed/inflated, power on", "135 kt (250 km/h)"],
          ["Max IAS, gear stowed/armed/inflated, torque <40%", "100 kt (185 km/h)"],
          ["Max altitude for float inflation", "6,600 ft (2,000 m)"],
        ],
      },
      note: "Below 400 ft (122 m) over water, the gear must always be armed. Takeoff after an emergency landing on water is prohibited. Use only for emergency water landing — cylinder pressure limits are given on the adjacent placard.",
    },
    {
      heading: "Inflation",
      paragraphs: [
        "With FLOAT ARM pressed, if float inflation fails, continue flight and stay within gliding distance of the coastline — inflation is also impossible whenever MASTER SW/EMER SW is off. To inflate: press FLOAT ARM, confirm at least one of the FLOAT FIRING/FLOAT ARM lights is on, then press FLOAT FIRING/FLOAT FIRE — recommended below 80 kt IAS, since firing above that speed can produce a pitch-down deceleration.",
      ],
    },
    {
      heading: "Autorotation onto water",
      paragraphs: [
        "Reduce collective to hold NR in the normal range, fly Vy. If relight is impossible, or after a tail rotor failure, set the engine starting selector OFF. Maneuver to head the aircraft between the wind and wave direction on final. At 70 ft, flare with cyclic. At 20–25 ft, holding constant attitude, gradually increase collective to reduce descent rate and forward speed. Then ease the cyclic slightly forward for a 10° nose-up attitude and under 10 kt forward speed at touchdown, adjusting pedals to cancel sideslip, and increase collective to cushion touchdown at minimum speed. After touchdown, lower collective fully, apply the rotor brake, and evacuate once the rotor has stopped — forward doors must be opened via the jettison handles once afloat.",
      ],
    },
    {
      heading: "Performance",
      paragraphs: [
        "Stability after an emergency water landing was demonstrated up to a significant wave height of 2.5 m — sea state 4 on the World Meteorological Organization scale. Rate of climb is reduced by 50 ft/min (0.25 m/s) at Vy, and cruise speed by roughly 2 kt with the gear installed.",
      ],
    },
  ],
};

const HOIST: SystemNote = {
  slug: "hoist-installation",
  title: "Hoist Installation",
  subtitle: "Two load classes, two motor types — the operating-limit numbers that actually differ between the Breeze and Air Equipment hoists, and the escape-direction rule after an engine failure in the hover.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Supplement 18 (Hoist Installation 'Breeze' or 'Air Equipment' 136 kg), Supplement 19 (Hoist Installation 'Breeze' 204 kg), and Supplement 19.1 (same, grip with support bracket) — General, Limitations, Emergency Procedures, Normal Procedures for each.",
  sections: [
    {
      heading: "Two hoist families",
      table: {
        columns: ["Fit", "Max load", "Cable", "Motor"],
        rows: [
          ["Breeze BL 16600 or Air Equipment 76370 (Sup.18)", "136 kg (300 lb)", "33.5 m (110 ft) Breeze / 40 m (130 ft) Air Equipment", "Constant-speed electric"],
          ["Breeze 204 kg (Sup.19 / 19.1)", "204 kg (450 lb)", "50 m (164 ft)", "Variable-speed electric, winding speed proportional to the control knob's displacement, with an electronic control unit for automatic deceleration and stop"],
        ],
      },
      note: "Both share the same general architecture: a pivoting jib with a locking device (ferrying/hoisting positions) on the left side, a safety belt for the hoist operator, cable protectors on the LH skid, a hand-operated cable cutter as backup, and a pyrotechnic cable cutter. An 'up travel limit' detector cuts motor power when the hook is fully up; a 'down travel limit' cuts power with 4 m of cable left; a mechanical safety pin stops the drum at 3 m as a backup if the electrical down-limit fails.",
    },
    {
      heading: "Duty-cycle limits — where the two families genuinely differ",
      table: {
        columns: ["Fit", "Operating limitation"],
        rows: [
          ["Air Equipment hoist", "Never exceed 6 consecutive hoisting operations plus one descent at maximum load with maximum cable reel-out (or equivalent), to avoid motor overheating"],
          ["Breeze hoist", "Wait 30 seconds after each raising or lowering operation"],
        ],
      },
      note: "After 3 complete cycles (one max-load descent, two no-load descents, three max-load raises), it's recommended to rest the hoist for 40 minutes.",
    },
    {
      heading: "Controls",
      paragraphs: [
        "Pilot: a HOIST pushbutton on the console to power the installation, and a guarded cable-shear pushbutton on the collective for emergency severing. Hoist operator: a rocker switch (136 kg fit) or a knurled speed-proportional knob (204 kg fit) on the operator's control grip, plus green 'hoist moving up' and red 'up-limit microswitch test' lights (136 kg fit) or a cable-length-in-meters readout (204 kg fit, standard grip) or a simple energized indicator (204 kg fit, grip-with-bracket variant).",
      ],
    },
    {
      heading: "Limitations",
      paragraphs: [
        "Minimum crew: one pilot, one hoist operator. A hand-operated cable cutter must be within the hoist operator's reach at all times. Landing with a load suspended on the hoist cable is prohibited.",
      ],
    },
    {
      heading: "Emergency procedures",
      paragraphs: [
        "Hoist failure: manually pull the cable inside if possible, cut it, or return to base with the cable inclined slightly, VNE 60 kt (111 km/h).",
        "Engine failure in the hover: reduce collective per the height, release the load as soon as possible via the emergency cable-shear pushbutton, control yaw with the pedals, move the cyclic forward to gain speed appropriate to height, then increase collective to cushion touchdown. During a hoisting phase, the pilot should move away to the right on an engine failure — ground crew must be briefed to escape to the left.",
      ],
    },
    {
      heading: "The static-electricity warning",
      paragraphs: [
        "Before the cable is grasped, the hook must have ground contact to discharge static electricity — if an electrostatic discharge device (such as a cable) is used, remove it after the hoisting phase. If the hook forcefully contacts the upper mechanical stop (a failure of the automatic stop system), abort the hoisting mission immediately.",
      ],
    },
  ],
};

const EXTERNAL_LOAD: SystemNote = {
  slug: "external-load",
  title: "External Load: Cargo Sling and Cargo Swing",
  subtitle: "750 kg on a fixed hook or 1,400 kg on a pyramid frame with three release-unit options — the CG-vs-weight limit, the 80 kt cap, and what the load indicator's LD ON light is actually telling you.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Supplement 12 (Cargo Sling 750 kg 'Breeze Eastern'), Supplement 13 (Cargo Swing 1400 kg 'SIREN' free-rotation), Supplement 13.1 (same, 'SIREN' fixed release), and Supplement 13.2 (same, 'ON-BOARD' release) — General, Limitations, Emergency Procedures, Normal Procedures for each.",
  sections: [
    {
      heading: "Two load classes",
      table: {
        columns: ["Fit", "Max load", "Hardware"],
        rows: [
          ["Cargo Sling (Sup.12)", "750 kg (1,660 lb)", "Breeze Eastern release unit and hook with a load sensor, electrical and mechanical opening"],
          ["Cargo Swing (Sup.13 / 13.1 / 13.2)", "1,400 kg (3,086 lb)", "Suspended pyramid frame with a choice of release unit: SIREN free-rotation hook, SIREN fixed hook, or ON-BOARD unit — all with electrical and mechanical opening"],
        ],
      },
      note: "Controls are identical across all four fits: a SLING pushbutton on the console/SCU to power the installation, an electrical release control on the cyclic, and a mechanical release handle under the collective. The Cargo Swing's load indicator adds a self-test sequence (ZERO, TEST) that displays the calibration value, zero offset, and filter/logic settings — useful for confirming the transmitter between aircraft and hook matches its engraved calibration value.",
    },
    {
      heading: "Limitations",
      table: {
        columns: ["Limit", "Value"],
        rows: [
          ["Max all-up weight with external load", "2,800 kg (6,173 lb), or the max weight allowing OGE hover — whichever is lower"],
          ["Max IAS with external load", "80 kt (148 km/h) — the pilot must further reduce this for bulky loads or long slings"],
        ],
      },
      note: "Longitudinal CG limits shift with load weight per the RFM's graph. External loads are limited to Non-Human External Cargo (NHEC) only. Flight with an empty net or unballasted sling is prohibited unless the operator has approved specific limits and procedures for it. Operation with a load remaining in contact with land or water is not manufacturer-demonstrated and requires separate authority approval.",
    },
    {
      heading: "Emergency procedures",
      paragraphs: [
        "Engine failure with external load, in cruise: apply the autorotation procedure, release the load as soon as possible. In hover: reduce collective per height, release the load as soon as possible, control yaw, cyclic forward to gain speed for the height, increase collective to cushion touchdown. As with the hoist, the pilot moves right on a hookup-phase failure, ground crew move left.",
        "Electrical jettison failure: actuate the mechanical release (collective handle) instead.",
        "Load indicator failure (Cargo Swing only) — if LD ON changes state unexpectedly: in hover, release electrically and check the light; no change in status means abort the mission, a status change means continue. In cruise, fly a precautionary approach to the nearest helipad and apply the hover procedure there.",
      ],
    },
    {
      heading: "Normal procedures",
      paragraphs: [
        "Train with gradually increasing sling loads before heavy or bulky operations — a swinging load changes the aircraft's flight behavior. Use the shortest practical cable for compact loads, and ensure a trailing cable or net (with no or low load) stays clear of the tail rotor. In wet weather, handlers should wear thick rubber gloves and discharge static electricity via a conductor cable/tube between ground and the release unit before touching it.",
        "On takeoff: hook and secure the load, increase collective very smoothly while staying vertically above it, dwell briefly once the cables tighten before lifting, then lift vertically and adjust the climb path forward. All load-carrying maneuvers should be smooth — gradual acceleration/deceleration, only slight bank. On approach: fly minimum rate of descent, stop translational movement while still high enough that the load isn't dragged, then descend vertically to set it down before releasing — actuate the mechanical release handle if the electrical release doesn't work.",
      ],
    },
  ],
};

const BAMBI_BUCKET: SystemNote = {
  slug: "bambi-bucket",
  title: "Bambi Bucket",
  subtitle: "A 1,225-liter firefighting bucket on the Cargo Swing hardware — the two different release controls, and why a right turn helps if you have to jettison it.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Supplement 52 ('Bambi Bucket' Model 2732S — General, Limitations, Emergency Procedures, Normal Procedures, Performance Data).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "A firefighting system for carrying and dropping water (or other liquids) in flight, maximum capacity 1,225 liters, secured to the external load carrying device (Supplement 13.1 or 13.2's swing hardware) via a shackle. The bucket fills by being plunged into a water source and drops its full load in a single release; an optional SACKSAFOAM foam injection system can be fitted.",
        "Two distinct release functions exist on the cyclic: one pushbutton releases just the bucket's contents, a second releases the entire load from the sling hook. A mechanical control on the collective grip provides a full-load mechanical release as backup.",
      ],
    },
    {
      heading: "Limitations",
      table: {
        columns: ["Configuration", "VNE"],
        rows: [
          ["Empty bucket", "90 kt (167 km/h)"],
          ["Bucket full or partially filled", "80 kt (148 km/h)"],
        ],
      },
    },
    {
      heading: "Emergency jettison",
      paragraphs: [
        "If the water contents can't be jettisoned electrically, the pilot can set the bucket (filled or empty) on the ground as with a sling load, and ground staff unhook it via the release device. If the whole bucket must be jettisoned in flight, release it via the cargo sling's electrical or mechanical controls — entering a right-hand turn with a slight load factor is recommended to help clear separation.",
      ],
    },
    {
      heading: "Before takeoff",
      paragraphs: [
        "Confirm the bucket is correctly secured, and that the manufacturer's plate on the shackle and the ballast inside the bucket are both oriented forward.",
      ],
    },
  ],
};

const SAND_FILTER: SystemNote = {
  slug: "sand-filter",
  title: "Sand Filter",
  subtitle: "Engine protection for hover-in-sand and falling-snow operations — the P2 valve logic, and the ~10°C T4 rise that comes with running it.",
  rfmReference:
    "AS350 B3 2B1 Flight Manual Supplement 14 (Sand Filter, Reference QB0550/QB0777 — General, Limitations, Emergency Procedures, Normal Procedures, Performance Data).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "Protects the engine from sand ingestion during hover or flight in sand-laden air, and — without needing any bleed air for this function — also protects the air intake against snow ingestion while flying in falling snow. A filter sits on the engine air intake below the ice-protection screen; ambient air passes through separator tubes forming the filter, with filtered air forced toward the intake while sand is evacuated through scavenge tubes ventilated by P2 air. An electric valve, controlled by the SAND FILTER/SAND FILT pushbutton on the SCU, opens and closes the P2 air pressure circuit. A P2 message on the VEMD's FLI page confirms the valve is fully open.",
      ],
    },
    {
      heading: "Limitations",
      paragraphs: [
        "Heating and demisting must be switched off whenever the sand filter is active. Flight under falling snow is permitted without restriction whenever the sand filter is fitted — whether active or not.",
      ],
    },
    {
      heading: "Valve failure logic",
      table: {
        columns: ["VEMD indication", "Meaning", "Action"],
        rows: [
          ["P2 remains off", "The P2 air valve has failed to open", "Avoid flying in a sandy atmosphere"],
          ["P2 remains on", "The P2 air valve has failed to close", "Continue flight"],
        ],
      },
    },
    {
      heading: "Operating notes",
      paragraphs: [
        "Preflight requires checking the engine air intake and filter are clean, with no ice/snow accumulation or foreign objects and no stagnant water at the drain hole — ice or snow left in or around the intake can be ingested and cause a sudden in-flight engine failure. Cycle SAND FILTER/SAND FILT on then off before starting the engine to confirm P2 responds on the VEMD. When actually flying in sandy conditions, select it ON with heating/demisting OFF.",
        "Running the sand filter raises T4 by approximately 10°C — a normal, expected effect, not a fault. For the engine power check, run it with the sand filter OFF and use the dedicated power-check chart; the VEMD automatically adjusts its power-check and hover-performance calculations when the sand filter is fitted.",
      ],
    },
  ],
};

export const H125B32B1_SYSTEM_NOTES: SystemNote[] = [
  VEMD,
  CENTRAL_WARNING_PANEL,
  AFCS,
  HYDRAULIC_SYSTEM,
  ELECTRICAL_SYSTEM,
  POWER_TRANSMISSION,
  EMERGENCY_FLOATATION,
  HOIST,
  EXTERNAL_LOAD,
  BAMBI_BUCKET,
  SAND_FILTER,
];
