"use client";

import { BackButton } from "@/app/components/BackButton";

const groups = [
  {
    title: "Clear Area — engine failure before TDP",
    source: "AW139 QRH Emerg-Malfunc p. 111",
    steps: [
      "Adjust collective to maintain rotor droop within 90% NR, or lower collective slightly to establish descent.",
      "Adjust pitch attitude as required to reduce speed below 30 kts GS.",
      "At approximately 5–10 ft AGL, level the aircraft and increase collective to cushion touchdown; maximum nose-up attitude at touchdown 15°.",
      "After touchdown centralize cyclic, lower collective to MPOG and apply wheel brakes as required.",
      "On the affected engine, carry out ENGINE SHUTDOWN IN EMERGENCY, then set PARK BRAKE as required.",
    ],
  },
  {
    title: "Clear Area — engine failure at/after TDP",
    source: "AW139 QRH Emerg-Malfunc p. 113",
    steps: [
      "Continue the acceleration, using collective to droop NR to a minimum of 90% and set 2.5 min power.",
      "Adjust pitch attitude to 5° nose-up and continue acceleration to VTOSS (50 KIAS).",
      "At VTOSS with a positive rate of climb, lower collective to recover 102% NR and continue the climb to 200 ft using 2.5 min power.",
      "At 200 ft, accelerate to Vy and continue the climb to 1000 ft AGL, reducing to OEI MCP power (140% PI) before the 2.5 min rating expires.",
      "Select landing gear UP and rotor speed 100% at Vy; at 1000 ft, shut down the affected engine (ENGINE SHUTDOWN IN EMERGENCY) and monitor the PWR PLANT page every 30 minutes during OEI cruise.",
    ],
  },
  {
    title: "Clear Area — engine failure before LDP",
    source: "AW139 QRH Emerg-Malfunc p. 115",
    steps: [
      "Apply collective to control NR droop to a minimum of 90% and adjust pitch attitude 5° nose-up to accelerate to VBLSS (50 KIAS).",
      "At VBLSS with a positive rate of climb, lower collective to recover 102% NR and continue the climb to 200 ft AGL using 2.5 min power.",
      "At 200 ft AGL, accelerate to Vy while climbing; after reaching Vy continue to 1000 ft ATS, reducing to OEI MCP power (140% PI) before the 2.5 min rating expires.",
      "Select landing gear UP and rotor speed 100% at Vy; at 1000 ft, shut down the affected engine (ENGINE SHUTDOWN IN EMERGENCY) and monitor the PWR PLANT page every 30 minutes during OEI cruise.",
    ],
  },
  {
    title: "Clear Area — engine failure at/after LDP",
    source: "AW139 QRH Emerg-Malfunc p. 119",
    steps: [
      "Continue to the landing point, applying collective to control rotor droop to a minimum of 90% NR while adjusting pitch attitude to decelerate.",
      "At 20 ft AGL, apply collective to cushion the touchdown; maximum nose-up attitude at touchdown 15°, maximum groundspeed 30 kts.",
      "After touchdown centralize cyclic, lower collective to MPOG and apply wheel brakes as required.",
      "On the affected engine, carry out ENGINE SHUTDOWN IN EMERGENCY, then set PARK BRAKE as required.",
    ],
  },
  {
    title: "All Cat A profiles — engine failure recognized in hover (5 ft ATS)",
    source: "AW139 QRH Emerg-Malfunc p. 110",
    steps: [
      "Maintain the collective pitch setting, or lower collective slightly if required to land.",
      "Increase collective to cushion touchdown as it becomes imminent; maximum permitted groundspeed at touchdown 5 kts.",
      "After touchdown centralize cyclic and simultaneously reduce collective to MPOG, applying wheel brakes if necessary.",
      "On the affected engine, carry out ENGINE SHUTDOWN IN EMERGENCY, then set PARK BRAKE as required.",
    ],
  },
  {
    title: "Ground/Elevated Heliport & Helideck — engine failure before TDP",
    source: "AW139 QRH Emerg-Malfunc p. 110",
    steps: [
      "Adjust collective gently to stop the climb and establish a descent, maintaining rotor speed close to 100% NR.",
      "Adjust pitch attitude as required to maintain position over the helipad.",
      "At approximately 5–10 ft ATS, increase collective to cushion touchdown as it becomes imminent; maximum groundspeed at touchdown 5 kts.",
      "After touchdown centralize cyclic and simultaneously reduce collective to MPOG.",
      "On the affected engine, carry out ENGINE SHUTDOWN IN EMERGENCY, then set PARK BRAKE as required.",
    ],
  },
  {
    title: "Ground/Elevated Heliport & Helideck — engine failure at/after TDP",
    source: "AW139 QRH Emerg-Malfunc pp. 112–113",
    steps: [
      "Rotate nose down to -10° in 1 second, hold for 1 second, then recover pitch attitude to 0° while using collective to droop NR to a minimum of 90% and set 2.5 min power.",
      "Maintain 0° pitch and continue acceleration to VTOSS (40 KIAS).",
      "At VTOSS with a positive rate of climb, adjust pitch to approximately 5° nose-up and lower collective to recover 102% NR; continue the climb to 200 ft ATS using 2.5 min power.",
      "At 200 ft ATS, accelerate to Vy and continue to 1000 ft ATS, reducing to OEI MCP power (140% PI) before the 2.5 min rating expires.",
      "Select landing gear UP and rotor speed 100% at Vy; at 1000 ft, release PARK BRAKE, shut down the affected engine (ENGINE SHUTDOWN IN EMERGENCY) and monitor the PWR PLANT page every 30 minutes during OEI cruise.",
    ],
  },
  {
    title: "Ground/Elevated Heliport & Helideck — engine failure before LDP",
    source: "AW139 QRH Emerg-Malfunc p. 115",
    steps: [
      "Apply collective to control NR droop to a minimum of 90% and adjust pitch attitude 5° nose-up to accelerate to VBLSS (40 KIAS).",
      "At VBLSS with a positive rate of climb, lower collective to recover 102% NR; continue the climb to 200 ft (or variable LDP height +150 ft) ALS using 2.5 min power.",
      "At 200 ft ALS, reduce to 2° nose-up and accelerate to Vy, continuing to 1000 ft while reducing to OEI MCP power (140% PI) before the 2.5 min rating expires.",
      "Select landing gear UP and rotor speed 100% at Vy; at 1000 ft, release PARK BRAKE, shut down the affected engine (ENGINE SHUTDOWN IN EMERGENCY) and monitor the PWR PLANT page every 30 minutes during OEI cruise.",
    ],
  },
  {
    title: "Ground/Elevated Heliport & Helideck — engine failure at/after LDP",
    source: "AW139 QRH Emerg-Malfunc p. 119",
    steps: [
      "Continue the descent; at 50 ft ALS increase pitch attitude to reduce speed and apply collective to reduce the rate of descent.",
      "At 20 ft ALS, apply collective to cushion touchdown; minimum rotor speed 90% NR, maximum nose-up attitude at touchdown 15°, maximum groundspeed 5 kts.",
      "After touchdown centralize cyclic and simultaneously reduce collective to MPOG.",
      "On the affected engine, carry out ENGINE SHUTDOWN IN EMERGENCY, then set PARK BRAKE as required.",
    ],
  },
  {
    title: "Offshore Helideck — engine failure before TDP",
    source: "AW139 QRH Emerg-Malfunc p. 112",
    steps: [
      "Decrease collective to arrest the climb and adjust pitch attitude 2°–3° nose-down to commence vertical movement toward the helideck, maintaining rotor speed close to 100% NR.",
      "At approximately 5–10 ft ATS, increase collective to cushion touchdown as it becomes imminent; maximum groundspeed at touchdown 5 kts.",
      "After touchdown centralize cyclic and simultaneously reduce collective to MPOG.",
      "On the affected engine, carry out ENGINE SHUTDOWN IN EMERGENCY, then set PARK BRAKE as required.",
    ],
  },
  {
    title: "Offshore Helideck — engine failure at/after TDP",
    source: "AW139 QRH Emerg-Malfunc pp. 114–114A",
    steps: [
      "Maintain collective and continue the climb to 30 ft ATS.",
      "At 30 ft ATS, rotate nose down to -10° for 1 second, then recover to 0° while using collective to droop NR to a minimum of 90% and set 2.5 min power; maintain 0° and accelerate to VTOSS (40 KIAS).",
      "At VTOSS, adjust pitch to approximately 5° nose-up and lower collective to recover 102% NR; continue the climb to 200 ft ATS using 2.5 min power.",
      "Accelerate to Vy and continue to 1000 ft ATS, reducing to OEI MCP power (140% PI) before the 2.5 min rating expires.",
      "Select rotor speed 100% and landing gear UP at Vy; release PARK BRAKE, shut down the affected engine (ENGINE SHUTDOWN IN EMERGENCY) at 1000 ft and monitor the PWR PLANT page every 30 minutes during OEI cruise.",
    ],
  },
  {
    title: "Offshore Helideck — engine failure before LDP",
    source: "AW139 QRH Emerg-Malfunc pp. 117–118",
    steps: [
      "Simultaneously adjust pitch attitude nose-down to 0° to initiate acceleration to VBLSS (40 KIAS) and apply collective to control NR droop to a minimum of 90%.",
      "At VBLSS, select 5° nose-up attitude and lower collective to recover 102% NR; continue the climb to 200 ft ALS using 2.5 min power.",
      "At 200 ft ALS, accelerate to Vy and continue to 1000 ft ALS, reducing to OEI MCP power (140% PI) before the 2.5 min rating expires.",
      "Select landing gear UP and rotor speed 100% at Vy; release PARK BRAKE, shut down the affected engine (ENGINE SHUTDOWN IN EMERGENCY) and monitor the PWR PLANT page every 30 minutes during OEI cruise.",
      "Note: an OEI landing using the Level Approach procedure is not possible after a before-LDP failure — a Balked Landing must be flown. A helideck landing instead requires the Descending Approach Procedure, limited to a WAT weight of 6400 kg or less.",
    ],
  },
  {
    title: "Offshore Helideck — engine failure at/after LDP",
    source: "AW139 QRH Emerg-Malfunc p. 120",
    steps: [
      "Fly the aircraft forwards, sideways and downwards toward the landing point, decreasing collective slightly.",
      "Descending through 30 ft ALS, reduce nose-up attitude to a maximum of 10°.",
      "At approximately 15 ft ALS, apply collective (using up to 2.5 min power if required) to cushion touchdown, landing with a 30°–45° heading offset; minimum rotor speed 90% NR, maximum nose-up attitude at touchdown 15°, maximum groundspeed 5 kts.",
      "After touchdown centralize cyclic and reduce collective to MPOG; on the affected engine carry out ENGINE SHUTDOWN IN EMERGENCY, then set PARK BRAKE as required.",
    ],
  },
];

export default function AW139CatAOeiContingenciesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div
        className="sticky z-10 border-b bg-white/80 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/90"
        style={{ top: "calc(4rem + env(safe-area-inset-top, 0px))" }}
      >
        <div className="mx-auto max-w-3xl px-6 py-3">
          <BackButton label="Procedures" to="/training/procedures/aw139" />
        </div>
      </div>

      <main className="mx-auto max-w-3xl space-y-5 p-6">
        <header className="rounded-xl border bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">AW139</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900 dark:text-zinc-100">CAT A OEI contingency procedures</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
            Training summary extracted from the AW139 QRH &ldquo;CAT A/B Procedures&rdquo; tab. Use the official QRH/RFM as the
            controlling source.
          </p>
        </header>

        {groups.map((group) => (
          <section key={group.title} className="rounded-xl border bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">{group.title}</h2>
              <span className="text-xs text-slate-500 dark:text-zinc-400">{group.source}</span>
            </div>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-800 dark:text-zinc-100">
              {group.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        ))}

        <footer className="text-center text-xs text-slate-500 dark:text-zinc-400">AW139 training reference. For training use only.</footer>
      </main>
    </div>
  );
}
