// Procedure content for the H125 / AS350 B3e trainer. Plain data module (no
// "use client") so both the client UI (ProcedureClient.tsx) and the server
// page.tsx (generateStaticParams) can import it — a "use client" file's exports
// are not reliably visible to Next's build-time param collection worker.
import type { ReactNode } from "react";

type ProcedureStep = {
  left: string;
  right: ReactNode;
};

type ProcedureDefinition = {
  title: string;
  subtitle?: string;
  rfmReference?: string;
  warnings?: string[];
  cautions?: string[];
  notes?: string[];
  steps: ProcedureStep[];
};

export const PROCEDURES: Record<string, ProcedureDefinition> = {
  "before-start-and-pre-start-checks": {
    title: "ENGINE PRESTART CHECK",
    rfmReference: "H125 / AS350 B3e RFM Section 4.3 §1",
    steps: [
      { left: "Seats and control pedals", right: <>ADJUST and SECURE.</> },
      { left: "Seat belts", right: <>FASTEN. Copilot seat belts shall be fastened in all cases.</> },
      { left: "1. Rotor brake", right: <>RELEASE, fully forward.</> },
      { left: "2. Fuel shut-off lever", right: <>FORWARD, check plastic guard condition.</> },
      { left: "3. Twist grip", right: <>IDLE position.</> },
      { left: "4. Hydraulic cut-off switch (collective grip)", right: <>ON.</> },
      { left: "5. Engine starting selector", right: <>OFF.</> },
      { left: "6. [BATT]", right: <>ON.</> },
      { left: "7. Instrument lighting system", right: <>OFF/DAY/NIGHT as required.</> },
      { left: "8. [COM1/NAV1]", right: <>ON.</> },
      { left: "9. Electric mirror (if installed)", right: <>SET to avoid dazzling on night flights.</> },
      { left: "10. [W/LT TST]", right: <>PERFORM; check TRQ indicates 100% for 2 seconds, then 0.</> },
      { left: "11. FIRE TST", right: <>PERFORM, CHECK.</> },
      { left: "12. [ACCU TST]", right: <>ON for 2 seconds then OFF (or PRESS for 2 seconds on dual-hydraulic aircraft).</> },
      { left: "13. CWP and overhead panel lights", right: <>CHECK — with battery power: GENE, PITOT, ENG P, FUEL P, HORN, MGB P, HYDR, TWT GRIP; with EPU power, the same lights plus BATT.</> },
      {
        left: "14. VEMD",
        right: (
          <>
            CHECK: 3-data page shows no message, Vehicle page shows no message, battery voltage above 22&nbsp;V, fuel
            quantity checked (bleed valve open).
          </>
        ),
      },
      { left: "15. Control pedals", right: <>Free travel, then left pedal 2 cm (0.8 in) forward.</> },
      { left: "16. Cyclic", right: <>CENTER, friction adjusted.</> },
      { left: "17. Collective", right: <>LOCK, friction adjusted.</> },
      { left: "18. Heating, demisting, air conditioning (if installed)", right: <>OFF.</> },
    ],
  },
  "engine-start-normal": {
    title: "ENGINE STARTING",
    rfmReference: "H125 / AS350 B3e RFM Section 4.3 §2",
    steps: [
      { left: "1. CWP", right: <>CHECK GOV.</> },
      { left: "2. [FUEL P] / [FUEL PUMP]", right: <>ON.</> },
      { left: "3. [A/COL LT] / [A/COL]", right: <>ON.</> },
      { left: "4. Cyclic control", right: <>HAND ON.</> },
      { left: "5. Engine starting selector", right: <>ON position.</> },
      {
        left: "6. Engine parameters",
        right: (
          <>
            CHECK: N1 increases, TOT remains below limits, rotor turns at N1 ≥ 25%, engine oil pressure increases. When
            N1 ≥ 67%:
          </>
        ),
      },
      { left: "7. [GENE]", right: <>ON.</> },
      { left: "8. CWP", right: <>CHECK: ENG P, MGB P, HYDR extinguished.</> },
      { left: "9. [PITOT]", right: <>ON.</> },
      { left: "10. [FUEL P] / [FUEL PUMP]", right: <>OFF, check FUEL P extinguished.</> },
      { left: "11. Engine starting selector guard", right: <>SET.</> },
      { left: "12. [AVIONIC] / [AVIONICS]", right: <>ON.</> },
      { left: "13. All necessary systems", right: <>ON — tested (avionics, lights, etc.).</> },
      { left: "14. EPU (if used)", right: <>DISCONNECT; confirm EPU door closed and locked.</> },
      { left: "15. CWP", right: <>CHECK: GENE, BATT extinguished.</> },
    ],
  },
  "before-take-off-and-hover-check": {
    title: "RUN-UP CHECK & BEFORE TAKEOFF CHECK",
    rfmReference: "H125 / AS350 B3e RFM Section 4.3 §3, 4.4 §1",
    steps: [
      { left: "Accumulator check — Collective", right: <>CHECK correctly locked.</> },
      { left: "[ACCU TST]", right: <>ON; CWP — check HYDR flashes.</> },
      {
        left: "Collective / cyclic",
        right: <>Hands on; move the cyclic 2–3 times on each axis (~10% of total travel) and check accumulator hydraulic assistance on pitch and roll (no control loads).</>,
      },
      { left: "[ACCU TST]", right: <>RESET to OFF; CWP — check HYDR.</> },
      { left: "Hydraulic cut-off test — Collective", right: <>CHECK correctly locked.</> },
      { left: "Hydraulic cut-off switch (collective grip)", right: <>OFF; CWP — check HYDR; confirm loads are felt immediately and cyclic can be moved with normal feedback.</> },
      {
        left: "Hydraulic cut-off switch",
        right: <>ON; CWP — check HYDR extinguishes after 3–4 seconds (maintenance required if less than 1 second or more than 4 seconds).</>,
      },
      { left: "Twist grip", right: <>FLIGHT position.</> },
      { left: "HORN (when NR ≥ 340 rpm)", right: <>ON; check audio warning sounds for NR ≤ 360 rpm and is OFF above 360 rpm.</> },
      { left: "NR indication", right: <>CHECK in lower normal operating range.</> },
      { left: "[FIRE TST]", right: <>PERFORM, CHECK gong sounds.</> },
      { left: "Parameter checks", right: <>No warning light illuminated; electrical system voltage/current and engine oil pressure normal.</> },
      { left: "Before takeoff — Doors", right: <>CLOSED or sliding doors OPEN and LOCKED.</> },
      { left: "Cyclic and collective frictions", right: <>As required.</> },
      { left: "Landing/taxi lights or pulse light", right: <>As required.</> },
      { left: "Temperatures and pressures", right: <>Normal range.</> },
      { left: "CWP and overhead panel", right: <>All lights OFF.</> },
      { left: "Collective (once minimum engine oil temperature reached)", right: <>UNLOCK.</> },
    ],
  },
  "take-off-and-initial-climb": {
    title: "TAKEOFF CHECK AND PROCEDURE",
    rfmReference: "H125 / AS350 B3e RFM Section 4.4 §2",
    cautions: ["For safe operation, the takeoff path should avoid the HV diagram (refer to Section 5)."],
    steps: [
      { left: "1", right: <>Gradually increase collective to hover at 5 ft (1.5 m).</> },
      { left: "2", right: <>Check engine and mechanical parameters — no warning/caution light.</> },
      { left: "3", right: <>Increase airspeed with HIGE power until IAS = 40 kt (74 km/h), then begin to climb so as to clear 40 ft (12 m) at IAS = 50 kt (93 km/h).</> },
    ],
  },
  "climb-cruise-approach-landing": {
    title: "CLIMB, CRUISE, APPROACH & LANDING",
    rfmReference: "H125 / AS350 B3e RFM Section 4.5",
    steps: [
      {
        left: "Climb",
        right: <>Above 100 ft (30 m), select up to Maximum Continuous Power and Vy: 65 KIAS at 0 Hp, decreasing 1 kt per 1000 ft (120 km/h at 0 Hp, decreasing 2 km/h per 300 m).</>,
      },
      {
        left: "Cruising flight",
        right: <>Fast cruise is obtained at the first limitation reached, corresponding to the start of the FLI amber area (TRQ, N1 or TOT, shown underlined).</>,
      },
      { left: "Load factor / servo transparency", right: <>Avoid combining high TAS, altitude and gross weight with high collective — this can reach the servo-control transparency limit.</> },
      { left: "Maximum power configuration", right: <>Decrease collective slightly before initiating a turn, since the power requirement increases.</> },
      { left: "Hover turns", right: <>Avoid rotation faster than 6 seconds per full rotation.</> },
      { left: "Turbulence", right: <>Reduce IAS.</> },
      { left: "Approach", right: <>Begin approach at Vy; at approximately 100 ft (30 m), reduce airspeed down to HIGE at 5 ft (1.5 m).</> },
      { left: "Approach check", right: <>Landing/taxi lights or pulse light as required; check all parameters.</> },
      { left: "Landing", right: <>In hover, gradually reduce collective until touchdown, then fully reduce collective.</> },
    ],
  },
  "shutdown-and-securing-helicopter": {
    title: "ENGINE AND ROTOR SHUTDOWN",
    rfmReference: "H125 / AS350 B3e RFM Section 4.6",
    steps: [
      { left: "1. Cyclic", right: <>CENTER.</> },
      { left: "2. Collective", right: <>LOCK.</> },
      { left: "3. Twist grip", right: <>IDLE position.</> },
      { left: "4. Engine oil cooling", right: <>WAIT 30 seconds.</> },
      { left: "5. [PITOT], [HORN], landing light", right: <>OFF.</> },
      { left: "6. Non-required systems, [AVIONIC]/[AVIONICS]", right: <>OFF.</> },
      { left: "7. Engine starting selector", right: <>OFF position.</> },
      { left: "8. [GENE]", right: <>OFF.</> },
      { left: "9. Rotor brake", right: <>APPLY at NR ≤ 170 rpm (high wind) or ≤ 140 rpm (normal conditions).</> },
      { left: "10. [A/COL LT] / [A/COL]", right: <>OFF once rotor is stopped.</> },
      {
        left: "11. Yaw load compensator check",
        right: <>Confirm the right pedal moves forward without pilot input (or with low force); cycle [ACCU TST]; confirm pedals re-center and remain centered.</>,
      },
      {
        left: "Before leaving the helicopter — VEMD",
        right: <>Check Flight Report page: operating time, usage counter, N1/N2 cycles, and any FAILURE DETECTED / OVERLIMIT DETECTED messages.</>,
      },
      { left: "[DCT/BAT] / [BAT/EPU] / [BATT]", right: <>OFF.</> },
      { left: "Covers", right: <>Fit pitot, static port, air intake and exhaust covers, and blade socks as required.</> },
    ],
  },
  "engine-health-check": {
    title: "ENGINE HEALTH CHECK PROCEDURE",
    rfmReference: "H125 / AS350 B3e RFM Section 5.1 §3",
    steps: [
      {
        left: "Before takeoff",
        right: <>In HIGE at 5 ft (1.5 m), before initiating forward flight, pull collective slightly to confirm N1 can increase by at least 1% without exceeding the max transient rating.</>,
      },
      {
        left: "FADEC engine health check",
        right: (
          <>
            Perform in level flight at MCP, heating/demisting OFF, at an altitude where the engine operates close to the
            N1 MCP limit. Stabilize for at least 2 minutes, then read the VEMD result.
          </>
        ),
      },
      {
        left: "Satisfactory result",
        right: <>TRQ MARGIN ISO TOT ≥ 0% (&ldquo;GOOD&rdquo; displayed) and TRQ MARGIN ISO N1 ≥ 0% (&ldquo;GOOD&rdquo; displayed).</>,
      },
      {
        left: "Manual procedure (if needed)",
        right: (
          <>
            Stabilize level flight MCP for 2 minutes and record TRQ, N1, NR, Hp, OAT and TOT; plot the Torque Margin ISO
            N1 and ISO TOT charts to determine TRQ min and compare against TRQ flight.
          </>
        ),
      },
      {
        left: "Result",
        right: <>The manual check is satisfactory if both TRQ MARGIN ISO N1 and TRQ MARGIN ISO TOT are positive. Prefer the FADEC procedure; use the manual method only if the FADEC result looks doubtful.</>,
      },
    ],
  },
  "cranking-procedure": {
    title: "CRANKING PROCEDURE",
    rfmReference: "H125 / AS350 B3e RFM Section 4.3 §4",
    steps: [
      { left: "1. Engine starting selector", right: <>OFF.</> },
      { left: "2. Emergency fuel shut-off lever", right: <>FORWARD.</> },
      { left: "3. N1", right: <>CHECK below 10%.</> },
      { left: "4. [FUEL P] / [FUEL PUMP]", right: <>ON.</> },
      { left: "5. [CRANK]", right: <>PRESS for 30 seconds maximum.</> },
      { left: "6. [FUEL P] / [FUEL PUMP]", right: <>OFF.</> },
    ],
  },
  "engine-flame-out-and-autorotation": {
    title: "ENGINE FLAME-OUT & AUTOROTATION",
    subtitle: "Cruise, hover IGE, hover OGE, in-flight relighting",
    rfmReference: "H125 / AS350 B3e RFM Section 3.2",
    steps: [
      { left: "Cruise — 1", right: <>Collective — REDUCE to maintain NR in normal operating range.</> },
      { left: "Cruise — 2", right: <>IAS — Vy.</> },
      { left: "Cruise — 3–4 (after loss of tail rotor thrust)", right: <>Twist grip IDLE; maneuver into the wind on final approach.</> },
      { left: "Cruise — 5 (at ≥70 ft/21 m)", right: <>Cyclic — FLARE.</> },
      { left: "Cruise — 6 (at 20–25 ft/6–8 m, constant attitude)", right: <>Collective — gradually increase to reduce rate of descent and forward speed.</> },
      { left: "Cruise — 7", right: <>Cyclic forward for a slightly nose-up landing attitude (below 10°).</> },
      { left: "Cruise — 8", right: <>Pedals — adjust to cancel any sideslip.</> },
      { left: "Cruise — 9", right: <>Collective — increase to cushion touchdown.</> },
      { left: "Cruise — 10 (after touchdown)", right: <>Cyclic, collective, pedals — adjust to control the ground run.</> },
      { left: "Cruise — 11–12 (once stopped)", right: <>Collective full low pitch; apply rotor brake below 170 rotor rpm.</> },
      { left: "Over water", right: <>Same procedure except after touchdown: maintain collective, pull forward door jettison handles, jettison or open doors, apply rotor brake; abandon once the rotor has stopped. Ditch below 30 KIAS with minimum rate of descent.</> },
      { left: "Hover IGE — 1–3", right: <>Maintain collective; control yaw with pedals; increase collective as needed to cushion touchdown.</> },
      { left: "Hover OGE — 1", right: <>Collective full low pitch. When NR stops decreasing, cyclic forward to gain airspeed according to available height, then apply the autorotation procedure.</> },
      { left: "In-flight relighting — 1", right: <>[FUEL P]/[FUEL PUMP] ON.</> },
      { left: "In-flight relighting — 2", right: <>[GENE] OFF.</> },
      { left: "In-flight relighting — 3", right: <>Engine starting selector OFF then ON — relighting runs automatically once N1 below 10%.</> },
      { left: "In-flight relighting — 4–5 (after relighting)", right: <>[GENE] ON, then [FUEL P]/[FUEL PUMP] OFF. At least 1000 ft (300 m) are needed to complete the relighting procedure.</> },
    ],
  },
  "tail-rotor-failures": {
    title: "TAIL ROTOR FAILURES",
    subtitle: "Complete loss of thrust & loss of control",
    rfmReference: "H125 / AS350 B3e RFM Section 3.3",
    warnings: ["Safe autorotative landing cannot be ensured for a failure in HOGE below the top point of the HV diagram, or in a confined area."],
    steps: [
      { left: "Hover IGE (or OGE within HV diagram)", right: <>LAND IMMEDIATELY: twist grip to IDLE, increase collective to cushion touchdown.</> },
      { left: "Hover OGE (clear area, outside HV diagram)", right: <>Simultaneously reduce collective per available height, cyclic forward to gain speed, maintain Vy or higher, adjust collective for minimum sideslip; land as soon as possible. If a go-around was flown, carry out an autorotative landing on a suitable area.</> },
      { left: "Cruise flight", right: <>Maintain Vy or higher, adjust collective for minimum sideslip; land as soon as possible.</> },
      { left: "Approach and landing", right: <>On a suitable area, carry out an autorotative landing per the engine flame-out procedure; twist grip IDLE during descent.</> },
      {
        left: "Loss of tail rotor control",
        right: (
          <>
            Adjust cyclic and collective to set 70 KIAS (130 km/h) level flight; [ACCU TST] ON to depressurize the load
            compensator, then RESET to OFF after 5 seconds. On a suitable area, make a shallow approach with slight left
            sideslip and perform a running landing — a right-hand wind component makes this easier.
          </>
        ),
      },
    ],
    notes: ["When airspeed is below 20 kt (37 km/h) and particularly near the ground, a go-around may be impossible due to loss of vertical fin efficiency."],
  },
  "smoke-in-cabin": {
    title: "SMOKE IN THE CABIN",
    subtitle: "Source not identified, source identified, after extinguisher use",
    rfmReference: "H125 / AS350 B3e RFM Section 3.4",
    steps: [
      { left: "Source not identified — 1", right: <>Heating/demisting OFF.</> },
      { left: "If smoke does not clear", right: <>[BATT] EMER SHED, [GENE] OFF, [AVIONICS] OFF, ventilate the cabin.</> },
      {
        left: "When smoke clears",
        right: <>All consumers OFF, then restore [BATT] ON, [GENE] ON, checking DC parameters each time; continue flight depending on atmospheric conditions.</>,
      },
      {
        left: "If smoke still doesn't clear",
        right: <>[BATT] and [GENE] OFF — land as soon as possible. If DC parameters are not correct, apply the GENE off-line procedure case A. If correct, bring [AVIONIC] and minimum required consumers back ON one by one — land as soon as practicable or continue flight depending on conditions.</>,
      },
      { left: "Source identified", right: <>Switch the corresponding system OFF, ventilate the cabin, continue flight depending on the failed system.</> },
      { left: "After cockpit fire extinguisher use — 1", right: <>Avoid inhaling the extinguisher agent as much as possible.</> },
      { left: "After cockpit fire extinguisher use — 2", right: <>Ventilate the cabin.</> },
    ],
    cautions: ["When [BATT] is set to EMER SHED, the VEMD goes off — apply the failure-of-both-screens procedure."],
  },
  "engine-fire-and-governor-failures": {
    title: "ENGINE FIRE, GOVERNOR & FADEC FAILURES",
    subtitle: "Fire in engine bay, EBCAU governor failure, minor FADEC failure, oil pressure, chip detection",
    rfmReference: "H125 / AS350 B3e RFM Section 3.6 §1",
    warnings: ["Do not remove this reference from use until confirming the aircraft's actual modification state for the fire-shutdown sequence."],
    steps: [
      { left: "Engine fire at start-up", right: <>Engine starting selector OFF, emergency fuel shut-off handle AFT, [FUEL PUMP] OFF, [CRANK] press 10 seconds, rotor brake apply (≤170 rpm), [BATT] OFF, evacuate and fight fire from outside.</> },
      { left: "Engine fire — hover, takeoff, final", right: <>LAND IMMEDIATELY with a no-hover powered landing; once on the ground, apply the start-up fire sequence.</> },
      { left: "Engine fire — in flight", right: <>LAND IMMEDIATELY: collective lower, IAS Vy, apply autorotation procedure, emergency fuel shut-off handle AFT, check [FUEL PUMP] OFF, engine starting selector OFF; after landing apply rotor brake, [BATT] OFF, evacuate and fight fire from outside.</> },
      {
        left: "Major governor failure (EBCAU engaged)",
        right: (
          <>
            Check flight parameters; EBCAU self-engages, GOV illuminates. Avoid abrupt collective changes. If N1 is still
            available, maintain N1 &gt; 80% below 20000 ft (or &gt; 85% above) and land as soon as practicable; if not
            available, lower collective to keep NR in range and make a powered approach avoiding a steep angle. After
            touchdown, lower collective slowly and select engine starting selector OFF.
          </>
        ),
      },
      { left: "Minor FADEC failure — continuously on", right: <>Governing degraded — avoid abrupt power changes, maintain IAS below VNE power-off, land as soon as practicable; do not start the engine on the ground.</> },
      { left: "Minor FADEC failure — flashing", right: <>Governor redundancy failure with no impact on governing — abort start-up per the maintenance manual, or cancel autorotation training and return to base.</> },
      { left: "Engine oil pressure low", right: <>Check the gauge — if low or nil, LAND IMMEDIATELY (apply autorotation procedure, shut down engine time permitting); if normal, land as soon as practicable.</> },
      { left: "Twist grip out of FLIGHT position", right: <>Turn twist grip back to FLIGHT position, continue flight.</> },
      { left: "Metal particles in engine oil circuit", right: <>Reduce power, land as soon as possible with a low-power approach; takeoff is prohibited until maintenance checks are completed.</> },
    ],
  },
  "transmission-and-hydraulic-failures": {
    title: "TRANSMISSION & HYDRAULIC FAILURES",
    subtitle: "MGB/TGB oil pressure, overheat, chip detection, hydraulic pressure loss",
    rfmReference: "H125 / AS350 B3e RFM Section 3.6 §2–3",
    warnings: ["Do not use [ACCU TST] during a hydraulic failure — it depressurizes the yaw load compensator, producing heavy pedal loads."],
    steps: [
      { left: "MGB low oil pressure (< 1 bar)", right: <>Reduce power, land as soon as possible; if a safe landing isn&apos;t possible, continue at Vy (minimum power speed) to the nearest suitable site.</> },
      { left: "MGB oil overheating (> 115°C)", right: <>Set IAS to Vy, monitor CWP, land as soon as practicable or as soon as possible depending on trend.</> },
      { left: "Metal particles in MGB oil circuit", right: <>Reduce power and monitor, land as soon as possible.</> },
      { left: "Metal particles in TGB oil circuit", right: <>Avoid prolonged hovering, continue flight.</> },
      {
        left: "Hydraulic failure — HIGE, takeoff, final (landing within 30 s possible)",
        right: <>Land normally, then collective LOCK, twist grip IDLE, apply shutdown procedure.</>,
      },
      {
        left: "Hydraulic failure — in flight",
        right: (
          <>
            Set and maintain bank angle below 30°, avoid abrupt maneuvers, smoothly set IAS between 40–60 KIAS (hydraulic
            failure safety speed), then select the hydraulic cut-off switch OFF. Be careful not to inadvertently move the
            twist grip out of FLIGHT as control loads increase. Land as soon as possible.
          </>
        ),
      },
      {
        left: "Hydraulic failure — approach and landing",
        right: <>Do not attempt hover flight or low-speed maneuvers. Over a clear flat area, keep 40–60 KIAS, fly a flat approach into wind, and make a slow no-hover running landing at around 10 kt groundspeed. After landing, collective LOCK, twist grip IDLE, apply shutdown.</>,
      },
      { left: "Main servo unit max load reached (LIMIT)", right: <>In high-speed cruise or steep maneuvers, reduce power and/or speed/load factor — continue flight.</> },
    ],
  },
  "electrical-and-fuel-alarms": {
    title: "ELECTRICAL & FUEL ALARMS",
    subtitle: "Battery, generator, AC/inverter, fuel quantity, pressure and filter",
    rfmReference: "H125 / AS350 B3e RFM Section 3.6 §4–5",
    steps: [
      { left: "Battery temperature above maximum", right: <>[BATT] OFF, check U bus voltage — if above Umax, [BATT] ON, [GENE] OFF, unnecessary equipment OFF, land as soon as practicable.</> },
      { left: "Battery off line", right: <>Check [BATT] ON and VEMD voltage — if not correcting, land as soon as practicable; otherwise continue flight.</> },
      {
        left: "DC generator off line",
        right: (
          <>
            Check U bus on VEMD and [GENE] ON; check the GENE RST breaker not popped, press [GENE RST]. If parameters
            don&apos;t recover, switch unnecessary equipment OFF, monitor U bus, and land as soon as practicable; otherwise
            continue flight.
          </>
        ),
      },
      { left: "AC power supply failure (inverter)", right: <>Check [INV] ON — if OFF, all AC consumers are lost; select [INV] ON. AFCS disengages automatically. Continue flight, hands on controls.</> },
      { left: "Fuel quantity low (≤48 kg/106 lb)", right: <>Land as soon as possible; approximately 15 minutes of flight remain at MCP. Avoid large attitude changes that could cause a flame-out.</> },
      { left: "Low fuel pressure — in flight", right: <>Reduce power, [FUEL P]/[FUEL PUMP] ON, land as soon as possible with a low-power approach; be prepared for a flame-out.</> },
      { left: "Fuel filter pre-clogged — level 2 (continuous)", right: <>Do not open the fuel filter bypass — land as soon as practicable, monitor N1 on VEMD; land immediately if N1 oscillations occur.</> },
      { left: "Fuel filter pre-clogged — level 1 (flashing)", right: <>Maximum one flight of 3 hours before maintenance action.</> },
    ],
  },
  "vemd-and-instrument-failures": {
    title: "VEMD SCREEN, NR/N2 & PARAMETER FAILURES",
    subtitle: "VEMD screen failures, abnormal NR/N2, engine and electrical parameter indications",
    rfmReference: "H125 / AS350 B3e RFM Section 3.5",
    steps: [
      { left: "Failure of one VEMD screen", right: <>[OFF1] or [OFF2] OFF; read remaining information via [SCROLL]. If the top screen fails, the 3-parameter engine page moves automatically to the lower screen.</> },
      { left: "Failure of both VEMD screens", right: <>Maximum authorized power follows IAS = 100 kt at 0 Hp minus 2 kt/1000 ft (185 km/h minus 4 km/h per 300 m); land as soon as practicable with a no-hover landing. NR is constant at 394 rpm.</> },
      { left: "NR indication failure", right: <>Maintain collective with TRQ above 10% (NR reading is then given by N2); land as soon as practicable.</> },
      { left: "N2 indication failure", right: <>Check NR in the normal operating range with TRQ above 0; continue flight (note: EBCAU may not be available).</> },
      { left: "Engine oil temperature over limit", right: <>Set 80 KIAS — if temperature decreases, land as soon as practicable; if not, check oil cooler fan and land as soon as possible.</> },
      { left: "Low engine oil pressure (CWP ENG P)", right: <>If confirmed on CWP test, LAND IMMEDIATELY — apply autorotation procedure and shut down engine time permitting.</> },
      {
        left: "Loss of N1/TRQ/TOT parameters",
        right: (
          <>
            The FLI is replaced by 3-data symbology. For N1 failure, respect max TRQ and a TOT limit of 842°C. For
            torquemeter failure, comply with the N1-vs-OAT/altitude limit table. For TOT failure, comply with N1/TRQ
            limits and switch off heating/demisting; do not start the engine on the ground. Land as soon as practicable.
          </>
        ),
      },
      { left: "Generator overvoltage (>31.5 V)", right: <>[GENE] OFF, monitor CWP, apply GENE procedure case A; land as soon as practicable.</> },
      { left: "DC bus undervoltage (≤26.0 V)", right: <>Apply the GENE procedure; if U bus remains below 26 V, apply case A and land as soon as practicable, otherwise continue flight.</> },
      { left: "Generator current over limit (flashing)", right: <>Switch off unnecessary equipment; continue flight.</> },
    ],
  },
  "flight-control-and-misc-warnings": {
    title: "FLIGHT CONTROL HARDOVER & OTHER WARNINGS",
    subtitle: "Rotor brake, hardover/servojam, bleed valve, ICS, servo transparency",
    rfmReference: "H125 / AS350 B3e RFM Section 3.7",
    warnings: ["Wait until the rotor comes to a complete standstill before leaving the aircraft."],
    steps: [
      { left: "Rotor brake inoperative, wind blowing", right: <>Head the aircraft into the wind; hold the cyclic slightly into the wind while the rotor stops.</> },
      { left: "Hardover/servojam — HIGE, takeoff, final", right: <>LAND IMMEDIATELY if possible; after landing, hydraulic cut-off switch OFF, apply the engine and rotor shutdown procedure.</> },
      {
        left: "Hardover/servojam — in flight",
        right: <>Set IAS between 40–60 KIAS (entering sideslip if necessary), then hydraulic cut-off switch OFF and apply the hydraulic-failure procedure; land as soon as possible.</>,
      },
      { left: "Bleed valve failure", right: <>Reduced maximum power available, especially in cold weather; avoid abrupt power changes to prevent surge/compressor stall; land as soon as practicable (results in GOV caption).</> },
      { left: "ICS inoperative", right: <>Check COM 1 ON, adjust volume — VHF and audio warnings remain available via COM 1 for the right-hand pilot only; abort or cancel hoisting operations if ICS fails during a hoist.</> },
      {
        left: "Servo transparency",
        right: <>Self-correcting — reduce the severity of the maneuver, follow the aircraft&apos;s natural reaction, let collective decrease naturally (avoid low pitch) and smoothly counteract the right cyclic motion.</>,
      },
    ],
  },
};
