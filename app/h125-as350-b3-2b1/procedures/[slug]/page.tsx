"use client";

import { Suspense, type ReactNode } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";

import AppTopBar from "@/components/AppTopBar";

type ProcedureStep = {
  left: string;
  right: ReactNode;
};

type ProcedureDefinition = {
  title: string;
  subtitle?: string;
  rfmReference?: string;
  steps: ProcedureStep[];
};

const PROCEDURES: Record<string, ProcedureDefinition> = {
  "before-start-and-pre-start-checks": {
    title: "BEFORE START / PREFLIGHT AND PRE-START CHECKS",
    rfmReference: "AS350 B3 2B1 RFM Section 4.2–4.3",
    steps: [
      {
        left: "Flight manual / documents",
        right: <>On board and current. Verify all required documents and check that applicable revisions are incorporated.</>,
      },
      {
        left: "Corrective maintenance",
        right: <>Confirm that all corrective maintenance necessary for flightworthiness is completed (Section 4.2).</>,
      },
      {
        left: "Exterior inspection",
        right: <>
          Perform preflight inspection per RFM Section 4.2, including MGB and TGB oil levels, rotor blades, controls, cowls and
          leaks. If parked &gt; 2 days or in case of doubt, open cowls.
        </>,
      },
      {
        left: "Weight and balance",
        right: <>Check weight, CG and loading are within Section 2 limitations; record any exceedance as required by Section 4.1.</>,
      },
      {
        left: "Fuel tank drain (first flight)",
        right: <>
          Before the first flight of the day and if OAT is at or above 0&nbsp;°C, bleed the fuel tank at the drain point and confirm no
          leakage at the bleed valve.
        </>,
      },
      {
        left: "Cabin and cargo",
        right: <>Secure baggage and cabin freight in accordance with cabin loading instructions and placards.</>,
      },
      {
        left: "ELT and avionics",
        right: <>
          Check ELT in <span className="font-semibold">ARMED</span> position and configure radios, transponder and navigation equipment as required.
        </>,
      },
      {
        left: "Battery / external power",
        right: <>Select [BAT/EPU] or external power as applicable. Verify DC voltages within limits.</>,
      },
      {
        left: "Rotor brake",
        right: <>Rotor brake released, lever fully forward before engine start (Section 4.3).</>,
      },
    ],
  },
  "engine-start-normal": {
    title: "ENGINE START – NORMAL PROCEDURE",
    rfmReference: "AS350 B3 2B1 RFM Section 4.3",
    steps: [
      {
        left: "Fuel shut-off lever",
        right: <>
          Forward, with guard in place. Confirm fuel system configured for start, fuel quantity sufficient and approved fuel per
          Section 2.5.
        </>,
      },
      {
        left: "Twist grip",
        right: <>IDLE position for prestart checks.</>,
      },
      {
        left: "[MASTER SW] / [EMER SW]",
        right: <>UP position. Verify engine control and VEMD powered.</>,
      },
      {
        left: "Engine starting selector",
        right: <>OFF, then select START according to RFM procedure, monitoring Ng, t4 and oil pressure.</>,
      },
      {
        left: "Start monitoring",
        right: <>
          Monitor t4 and Ng during start; abort in case of abnormal rise or failure to accelerate as per limitations and
          emergency procedures.
        </>,
      },
      {
        left: "Stabilization",
        right: <>Allow engine to stabilize in ground idle. Check VEMD indications and absence of abnormal warnings.</>,
      },
      {
        left: "Before flight",
        right: <>Complete remaining checks and progress to rotor engagement according to Section 4.3.</>,
      },
    ],
  },
  "before-take-off-and-hover-check": {
    title: "BEFORE TAKE-OFF / HOVER CHECK",
    rfmReference: "AS350 B3 2B1 RFM Section 4.3–4.4",
    steps: [
      {
        left: "Engine / rotor parameters",
        right: <>At ground idle and then flight condition, verify Ng, Nf/NR, Tq and t4 within normal operating ranges.</>,
      },
      {
        left: "Flight controls",
        right: <>Check full and free movement in all axes, friction adjusted as required, no abnormal forces or stops.</>,
      },
      {
        left: "Warnings and cautions",
        right: <>No red warnings; only expected advisories on CWP and VEMD before lift-off.</>,
      },
      {
        left: "Hover",
        right: <>
          Establish a stable hover in HIGE at around 5&nbsp;ft (1.5&nbsp;m). Check attitude, power required and control response.
        </>,
      },
      {
        left: "Engine power check (hover)",
        right: <>
	          In HIGE at about 5&nbsp;ft (1.5&nbsp;m) before initiating forward flight, raise collective slightly to confirm that Ng can
	          increase by at least 1&nbsp;% without exceeding the maximum transient rating, and that the torque required is compatible
	          with the take-off/landing environment and weight (Section&nbsp;5.1).
        </>,
      },
      {
        left: "Before take-off checks",
        right: <>Complete remaining checklist items (instruments, doors, harnesses, lights) prior to forward flight.</>,
      },
    ],
  },
  "take-off-and-initial-climb": {
    title: "TAKE-OFF AND INITIAL CLIMB",
    rfmReference: "AS350 B3 2B1 RFM Section 4.4 and 5.1",
    steps: [
      {
        left: "Take-off profile",
        right: <>From a stabilized hover or low-speed run, smoothly accelerate while maintaining NR within limits.</>,
      },
      {
        left: "Airspeed",
        right: <>
          Accelerate towards Vy for best rate of climb. As a guide, Vy is approximately 65&nbsp;kt IAS at sea level and decreases by
          about 1&nbsp;kt for each 1000&nbsp;ft of pressure altitude (≈ 120&nbsp;km/h minus 2&nbsp;km/h per 300&nbsp;m).
        </>,
      },
      {
        left: "HV avoidance (high gross weight)",
        right: <>
	          At high internal gross weight, use HIGE power to accelerate along the take-off path until IAS reaches about
	          40&nbsp;kt, then begin the climb so as to clear roughly 20&nbsp;ft (6&nbsp;m) at around 50&nbsp;kt (93&nbsp;km/h), in line with
	          the height–velocity diagram guidance (SUP.28).
        </>,
      },
      {
        left: "Power management",
        right: <>Maintain power within MCP or applicable take-off limits; monitor Tq and t4 margins.</>,
      },
      {
        left: "Climb",
        right: <>Establish climb at Vy or as required by obstacle and terrain; monitor Hp and temperature limits.</>,
      },
      {
        left: "After take-off checks",
        right: <>Complete after take-off checklist when safely established in climb.</>,
      },
    ],
  },
	  "climb": {
	    title: "CLIMB",
	    rfmReference: "AS350 B3 2B1 RFM Section 4.5 §1 and Section 5.1",
	    steps: [
	      {
	        left: "Climb configuration",
	        right: <>
          Above about 100&nbsp;ft (30&nbsp;m) AGL, establish a stable climb attitude with NR in the normal range and power within
          the recommended continuous or take-off ratings.
	        </>,
	      },
	      {
	        left: "Airspeed",
	        right: <>
          For maximum climb performance, use Vy. As a guide, Vy ≈ 65&nbsp;kt IAS at sea level, reducing by about 1&nbsp;kt per 1000&nbsp;ft
          of pressure altitude (≈ 120&nbsp;km/h minus 2&nbsp;km/h per 300&nbsp;m). Adjust as required for obstacles and ATC.
	        </>,
	      },
	      {
	        left: "Power management",
	        right: <>
	          Monitor Tq and t4, keeping margins to transient and maximum limits. Adjust collective to keep a steady climb rate and
	          avoid over-torque or over-temperature.
	        </>,
	      },
	      {
	        left: "Level-off",
	        right: <>
	          Approaching cruise altitude, smoothly reduce collective while adjusting cyclic to accelerate or decelerate to desired
	          cruise speed, avoiding abrupt attitude changes.
	        </>,
	      },
	      {
	        left: "After-climb checks",
	        right: <>Complete any after-climb checklist items when stabilized in cruise (pressurization, engine instruments, fuel).</>,
	      },
	    ],
	  },
	  "cruise-and-maneuvers": {
	    title: "CRUISE FLIGHT AND MANEUVERS",
	    rfmReference: "AS350 B3 2B1 RFM Section 4.5 §2 and Section 5.1",
	    steps: [
	      {
	        left: "Cruise power and speed",
	        right: <>
	          Establish cruise at a speed and torque setting compatible with fuel planning and limitations; use Section 5.1 tables as
	          a reference.
	        </>,
	      },
      {
        left: "Noise abatement (sensitive areas)",
        right: <>
          Over noise-sensitive areas, the complementary manual recommends IAS ≈ 110&nbsp;kt (204&nbsp;km/h) for OAT +25&nbsp;°C, adjusted
          slightly with temperature, and at least 1000&nbsp;ft AGL where possible.
        </>,
      },
	      {
	        left: "Trim and workload",
	        right: <>Trim the helicopter for hands-light flight where possible to reduce pilot workload and improve stability.</>,
	      },
	      {
	        left: "Turns and maneuvers",
	        right: <>
	          Perform turns and basic maneuvers with smooth, coordinated control inputs, respecting bank angle, load factor and speed
	          limitations given in Sections 2 and 4.5.
	        </>,
	      },
	      {
	        left: "Monitoring",
	        right: <>
	          Continuously monitor engine/vehicle instruments, fuel balance, and navigation; adjust power and attitude to maintain
	          stable flight.
	        </>,
	      },
	      {
	        left: "Preparation for descent",
	        right: <>Plan top-of-descent and brief the approach, taking into account terrain, airspace and weather.</>,
	      },
	    ],
	  },
	  "descent-and-approach": {
	    title: "DESCENT AND APPROACH",
	    rfmReference: "AS350 B3 2B1 RFM Section 4.5 §3 and Section 5.1",
	    steps: [
	      {
	        left: "Initiating descent",
	        right: <>
	          Reduce collective smoothly to start descent, keeping NR within normal range and avoiding abrupt power changes.
	        </>,
	      },
	      {
	        left: "Speed and rate of descent",
	        right: <>
          Adjust cyclic and collective to achieve a stabilized descent profile. For noise-sensitive helipads, use about
          60&nbsp;kt (111&nbsp;km/h) with a rate of descent close to 1000&nbsp;ft/min; for approaches near sensitive areas but landing
          elsewhere, use Vy with around 500&nbsp;ft/min as a reference.
	        </>,
	      },
	      {
	        left: "Engine and rotor monitoring",
	        right: <>
	          Monitor Tq, t4, Ng and NR; avoid prolonged low-power descents outside of the conditions allowed by the RFM, and respect
	          all limitations.
	        </>,
	      },
	      {
	        left: "Joining the approach",
	        right: <>
          Transition from en-route descent to the final approach by aligning with the landing site, confirming wind and
          obstacles and configuring lights and avionics as required. Plan to be around 100&nbsp;ft (30&nbsp;m) AGL when reducing
          towards a HIGE hover at roughly 5&nbsp;ft (1.5&nbsp;m).
	        </>,
	      },
	      {
	        left: "Approach checks",
	        right: <>Complete approach/landing checks before entering low-level or confined-area segments of the approach.</>,
	      },
	    ],
	  },
  "approach-and-landing-normal": {
    title: "APPROACH AND LANDING – NORMAL",
    rfmReference: "AS350 B3 2B1 RFM Section 4.4",
    steps: [
      {
        left: "Briefing and site assessment",
        right: <>Assess landing site, slope and wind; ensure slope and surface are within limitations (Section 2.3).</>,
      },
      {
        left: "Descent and approach speed",
        right: <>
          Plan a stabilized approach, managing airspeed and rate of descent within normal envelopes. As a guide, begin the
          approach around Vy (see climb section) and, in noise-sensitive areas, consider 60&nbsp;kt (111&nbsp;km/h) with a rate of
          descent close to 1000&nbsp;ft/min or Vy with about 500&nbsp;ft/min when approaching a helipad near sensitive areas.
        </>,
      },
      {
        left: "Hover and positioning",
        right: <>Transition to hover as needed; maintain safe clearance and cross-check instruments and power.</>,
      },
      {
        left: "Landing",
        right: <>
	          Lower collective smoothly to touch down, maintaining attitude and heading with cyclic and pedals. For any planned
	          running landing in normal operations, keep ground speed well below the 40&nbsp;kt (74&nbsp;km/h) running landing
	          limitation (Section&nbsp;2.3).
        </>,
      },
      {
        left: "After landing",
        right: <>Stabilize helicopter on ground, then complete post-landing checks and prepare for shutdown as applicable.</>,
      },
    ],
  },
  "shutdown-and-securing-helicopter": {
    title: "ENGINE SHUTDOWN AND SECURING THE HELICOPTER",
    rfmReference: "AS350 B3 2B1 RFM Section 4.5",
    steps: [
      {
        left: "Post-flight checks",
        right: <>At ground idle, verify engine and vehicle parameters within limits and note any abnormal indications.</>,
      },
      {
        left: "Engine shutdown",
        right: <>Apply normal shutdown procedure from the RFM, including twist grip to IDLE then OFF as prescribed.</>,
      },
      {
        left: "Rotor stop",
        right: <>
	          Allow rotor to decelerate per limitations. If rotor brake is used, apply it below approximately 170&nbsp;rpm in high
	          wind conditions or below 140&nbsp;rpm in normal conditions, as specified in Section 4.6. In high-wind operations,
	          starting and stopping the rotor has been demonstrated up to about 40&nbsp;kt (74&nbsp;km/h) from any direction and
	          50&nbsp;kt (93&nbsp;km/h) headwind; for winds above roughly 40&nbsp;kt, park the helicopter into wind and tie it down
	          per Section&nbsp;4.8.
        </>,
      },
      {
        left: "Electrical power",
        right: <>Switch off unnecessary consumers, then [GEN], [BAT/EPU] or external power according to shutdown sequence.</>,
      },
      {
        left: "Securing the helicopter",
        right: <>Install control locks or collective friction as required, fit covers and blade tie-downs per Section 4.2 guidance.</>,
      },
    ],
  },
  "engine-health-check": {
    title: "ENGINE HEALTH CHECK PROCEDURE",
    rfmReference: "AS350 B3 2B1 RFM Section 5.1 §3.2",
    steps: [
      {
        left: "Flight condition",
        right: <>Stabilized level flight at a power rating close to MCP with Hp ≤ 12000 ft and heating/demisting OFF.</>,
      },
      {
        left: "VEMD engine power check",
        right: <>
          Select the ENGINE POWER CHECK page on the VEMD and perform the check according to Section 5.1.
        </>,
      },
      {
        left: "Evaluate margins (VEMD mode)",
        right: <>
          Check that TRQ MARGIN is positive and T4 MARGIN is negative with <span className="font-semibold">GOOD</span> displayed; engine
          health check is satisfactory in this case.
        </>,
      },
      {
        left: "Manual procedure (if required)",
        right: <>
          If VEMD result is not clearly satisfactory, record Tq, Ng, NR, Hp, OAT and t4 and apply the manual ENGINE POWER CHECK and
          t4 CHECK charts per RFM.
        </>,
      },
      {
        left: "Corrected t4 margin",
        right: <>
	          When necessary, compute corrected t4 margin using the Hp/OAT correction table. This correction only applies when the
	          initial T4 margin is ≥ +35&nbsp;°C; if the corrected margin is negative the result is acceptable, whereas a
	          T4 margin greater than +35&nbsp;°C means the engine condition is unsatisfactory.
        </>,
      },
      {
        left: "VEMD screen failure (both screens)",
        right: <>
	          If both VEMD screens fail, the maximum authorized power is the power required to maintain level flight while
	          following the law IAS = 100&nbsp;kt at 0&nbsp;Hp minus 2&nbsp;kt per 1000&nbsp;ft (or 185&nbsp;km/h minus 4&nbsp;km/h per
	          300&nbsp;m), as described in Section&nbsp;3.5.
        </>,
      },
      {
        left: "Follow-up",
        right: <>If margins are unsatisfactory, treat as an engine performance issue and follow maintenance/operational guidance.</>,
      },
    ],
  },
  "cranking-procedure": {
    title: "CRANKING PROCEDURE",
    rfmReference: "AS350 B3 2B1 RFM – Normal revision 6 / related procedure",
    steps: [
      {
        left: "Purpose",
        right: <>Use cranking only for the purposes and under the conditions specified in the RFM (e.g. maintenance, engine drying).
        </>,
      },
      {
        left: "Configuration",
        right: <>Set fuel system, twist grip and engine controls to the positions specified for cranking (no fuel to combustion).
        </>,
      },
      {
        left: "Starter engagement",
        right: <>Engage starter according to the RFM, monitoring Ng and respecting starter duty cycle limitations.</>,
      },
      {
        left: "Monitoring",
        right: <>Monitor t4, oil pressure and electrical parameters; abort if any abnormal indication occurs.</>,
      },
      {
        left: "Completion",
        right: <>Allow starter to cool according to limitations before any subsequent start or cranking cycle.</>,
      },
    ],
  },
  "after-cockpit-fire-extinguisher-use": {
    title: "AFTER COCKPIT FIRE EXTINGUISHER USE",
    rfmReference: "AS350 B3 2B1 RFM Section 3.4 §3",
    steps: [
      {
        left: "Agent inhalation",
        right: <>Avoid inhalation of extinguisher agent as much as possible (RFM Section 3.4).</>,
      },
      {
        left: "Ventilation",
        right: <>Ventilate the cabin thoroughly to clear smoke and extinguishing agent before continuing operations.</>,
      },
      {
        left: "Follow-on checks",
        right: <>Check affected systems and wiring as required; coordinate with maintenance before next flight.</>,
      },
    ],
  },
  "tail-rotor-failure-handling-and-landing": {
    title: "TAIL ROTOR FAILURE – HANDLING AND LANDING",
    rfmReference: "AS350 B3 2B1 RFM Section 3.3",
    steps: [
      {
        left: "Symptom awareness",
        right: <>Recognize uncontrolled yaw (typically to the left) and differentiate between loss of thrust and loss of control.</>,
      },
      {
        left: "Hover IGE / confined area",
        right: <>
          LAND IMMEDIATELY. Reduce twist grip to IDLE and increase collective as required to cushion touch-down as per Section
          3.3 §1.1.
        </>,
      },
      {
        left: "Hover OGE (clear area)",
        right: <>
          Simultaneously reduce collective depending on available height, move cyclic forward to gain speed and maintain Vy or
          higher, adjusting collective to minimize sideslip (Section 3.3 §1.2).
        </>,
      },
      {
        left: "Cruise flight",
        right: <>
          Maintain Vy or higher and adjust collective to obtain minimum sideslip; LAND AS SOON AS POSSIBLE on a site suitable for
          autorotation (Section 3.3 §1.3).
        </>,
      },
      {
        left: "Autorotative landing",
        right: <>
	          On a suitable area, perform an autorotative landing according to the ENGINE FLAME-OUT autorotation procedure (Section
	          3.2): maintain about Vy in the descent, flare at roughly 70&nbsp;ft (21&nbsp;m), level at around 20	625&nbsp;ft
	          (6	628&nbsp;m) and cushion the touchdown with collective. Over water, aim to ditch with IAS below 30&nbsp;kt
	          (56&nbsp;km/h) and minimum rate of descent, and keep the twist grip at IDLE during the descent.
        </>,
      },
      {
        left: "Loss of tail rotor control",
        right: <>
          In case of pedal jamming/loss of control, avoid airspeeds below about 20&nbsp;kt, especially near the ground. Set IAS
          around 70&nbsp;kt (130&nbsp;km/h) in level flight, use HYD TEST / ACCU TST as described in Section 3.3 §2 and carry out a
          shallow running landing with slight left sideslip.
        </>,
      },
    ],
  },
};

function H125AS350B3ProcedureInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const params = useParams();

  const rawSlug = (params && (params as any).slug) || "";
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : String(rawSlug || "");
  const def = PROCEDURES[slug];

  const plist = sp.get("plist");
  const compactList = !!plist && plist !== "0" && plist !== "false";
  const compact = compactList;

  if (!def) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
	        <AppTopBar title="Procedure" backHref="/training/procedures/h125-as350-b3-2b1" backLabel="Procedures" />
        <main className="mx-auto max-w-3xl p-6">
          <div className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
            <div className="text-slate-900 dark:text-zinc-100 font-semibold mb-2">Procedure not found</div>
            <p className="text-sm text-slate-700 dark:text-zinc-300">
              This H125 / AS350 B3 (2B1) procedure is not defined. Use the RFM directly for reference.
            </p>
          </div>
        </main>
      </div>
    );
  }

  function renderContent() {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">{def.title}</h1>
          {(def.subtitle || def.rfmReference) && (
            <div className="mt-3 text-sm text-slate-700 dark:text-zinc-300 space-y-1">
              {def.subtitle && <div>{def.subtitle}</div>}
              {def.rfmReference && (
                <div>
                  <span className="font-semibold">RFM reference:</span> {def.rfmReference}
                </div>
              )}
            </div>
          )}
        </header>

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm text-slate-800 dark:text-zinc-100">Perform as follows:</div>
          <div className="mt-2 divide-y divide-slate-200/70 dark:divide-zinc-700/60">
            {def.steps.map((s, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 py-2">
                <div className="text-sm text-slate-700 dark:text-zinc-300">
                  <span className="inline-block w-6 text-right mr-2">{i + 1}.</span>
                  <span className="font-medium">{s.left}</span>
                </div>
                <div className="text-sm text-slate-800 dark:text-zinc-100 sm:mt-0 mt-1">
                  {"\u00b7"} {s.right}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">
          H125 / AS350 B3 (2B1) training reference. For training use only. Always cross-check with the latest approved RFM.
        </footer>
      </main>
    );
  }

  if (compact) {
    return (
      <div
        className="fixed left-0 right-0 bottom-0 top-0 z-40 bg-white dark:bg-zinc-900 cursor-pointer"
        role="button"
        aria-label="Close procedure"
        onClick={() => {
          try {
            const before = window.location.pathname + window.location.search;
            router.back();
            setTimeout(() => {
              try {
                if (window.location.pathname + window.location.search === before) {
                  router.push("/training/procedures/h125-as350-b3-2b1");
                }
              } catch {}
            }, 120);
          } catch {}
        }}
      >
        <div
          className="h-full w-full overflow-y-auto"
          onClickCapture={(e) => {
            const t = e.target as HTMLElement;
            if (t && t.closest("a,button,input,textarea,select,[data-prevent-back]")) {
              e.stopPropagation();
            }
          }}
          onMouseDownCapture={(e) => {
            const t = e.target as HTMLElement;
            if (t && t.closest("a,button,input,textarea,select,[data-prevent-back]")) {
              e.stopPropagation();
            }
          }}
          onTouchStartCapture={(e) => {
            const t = e.target as HTMLElement;
            if (t && t.closest("a,button,input,textarea,select,[data-prevent-back]")) {
              e.stopPropagation();
            }
          }}
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
	      <AppTopBar title="Procedure" backHref="/training/procedures/h125-as350-b3-2b1" backLabel="Procedures" />
      {renderContent()}
    </div>
  );
}

export default function H125AS350B3ProcedurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-zinc-900" />}>
      <H125AS350B3ProcedureInner />
    </Suspense>
  );
}
