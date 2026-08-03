"use client";

import { BackButton } from "@/app/components/BackButton";

const groups = [
  {
    title: "Clear Area — engine failure before TDP",
    source: "AW169 QRH EP Emerg-Malfunc p. 227",
    steps: [
      "Adjust collective to stop climb and establish descent; adjust pitch attitude to reduce speed.",
      "Perform a running landing, increasing collective to cushion touchdown; maximum nose-up attitude at touchdown 15°.",
      "After touchdown centralize cyclic, lower collective to MPOG, apply wheel brakes as required.",
      "On affected engine, carry out ENGINE SHUTDOWN IN EMERGENCY; consider EMERGENCY GROUND EGRESS.",
    ],
  },
  {
    title: "Clear Area — engine failure at/after TDP",
    source: "AW169 QRH EP Emerg-Malfunc p. 228",
    steps: [
      "Continue acceleration, using collective to maintain NR close to 93%; accelerate to VTOSS 45 KIAS and start climb.",
      "At VTOSS adjust pitch to maintain speed; after positive climb, lower collective to recover 101% NR.",
      "Continue climb to 200 ft ATS using 2.5 min power, then accelerate to VY using 2.5 min power.",
      "Reduce to continuous OEI power (148% PI) before expiry of 2.5 min power; select landing gear UP when reaching VY.",
      "At 1000 ft ATS, shut down affected engine, complete AFTER TAKE-OFF checks and refer SINGLE ENGINE PROCEDURE.",
    ],
  },
  {
    title: "Landing approach — engine failure before LDP",
    source: "AW169 QRH EP Emerg-Malfunc p. 229",
    steps: [
      "Apply collective to set 2.5 min power and maintain NR close to 93%; adjust pitch to accelerate to VBLSS 45 KIAS.",
      "At VBLSS with positive climb, lower collective to recover 101% NR and climb to 200 ft ALS using 2.5 min power.",
      "At 200 ft ALS, accelerate to VY using 2.5 min power and continue climb toward 1000 ft ATS.",
      "Reduce to continuous OEI power (148% PI) before expiry of 2.5 min power; gear UP when reaching VY but not below 200 ft ATS.",
      "At 1000 ft ALS, shut down affected engine, complete AFTER TAKE-OFF checks and refer SINGLE ENGINE PROCEDURE.",
    ],
  },
  {
    title: "Clear Area — engine failure at/after LDP",
    source: "AW169 QRH EP Emerg-Malfunc p. 230",
    steps: [
      "Adjust collective to continue descent; adjust pitch attitude as required to reduce speed.",
      "Perform a running landing, increasing collective to cushion touchdown; maximum nose-up attitude at touchdown 15°.",
      "After touchdown centralize cyclic, lower collective to MPOG, then shut down the affected engine.",
      "Set PARK BRAKE as required, complete POST LANDING CHECKS and consider EMERGENCY GROUND EGRESS.",
    ],
  },
  {
    title: "G&E H/H — engine failure recognized in hover",
    source: "AW169 QRH EP Emerg-Malfunc p. 231",
    steps: [
      "Maintain collective setting or lower collective slightly if required to land.",
      "Increase collective to cushion touchdown; maximum permitted ground speed at touchdown is 5 kt.",
      "After touchdown centralize cyclic and simultaneously reduce collective to MPOG.",
      "Shut down the affected engine and set PARK BRAKE as required.",
    ],
  },
  {
    title: "G&E H/H Variable TDP — engine failure before/at TDP",
    source: "AW169 QRH EP Emerg-Malfunc p. 232",
    steps: [
      "Adjust collective to stop climb and establish descent, maintaining rotor speed close to 100% NR.",
      "Maintain the centre of the helipad in sight between yaw pedals as the aircraft descends.",
      "At approximately 10–5 ft ATS, increase collective to cushion landing; maximum allowed GS at touchdown is 5 kt.",
      "After touchdown centralize cyclic, lower collective to MPOG, shut down the affected engine and set PARK BRAKE as required.",
      "Consider EMERGENCY GROUND EGRESS.",
    ],
  },
  {
    title: "G&E H/H Variable TDP — engine failure at/after TDP",
    source: "AW169 QRH EP Emerg-Malfunc pp. 233–234",
    steps: [
      "Rotate pitch down to -15°; maintain until 15 kt GS, then rotate nose-up to level attitude for 1 second.",
      "After 1 second continue rotation to 5° nose-up and accelerate to VTOSS 45 KIAS; maintain NR close to 93%.",
      "At VTOSS maintain speed; after positive climb, lower collective to recover 101% NR.",
      "Continue climb to 200 ft ATS or TDP height +90 ft ATS using 2.5 min power.",
      "At 200 ft ATS or TDP height +105 ft ATS, whichever is higher, accelerate to VY and continue to 1000 ft ATS.",
      "Reduce to continuous OEI power (148% PI) before expiry of 2.5 min power; gear UP at VY, release PARK BRAKE, then shut down the failed engine at 1000 ft ATS.",
    ],
  },
  {
    title: "G&E H/H Variable LDP — engine failure before LDP",
    source: "AW169 QRH EP Emerg-Malfunc pp. 235–236",
    steps: [
      "Rotate pitch down to -15°; maintain until 15 kt GS, then rotate nose-up to level attitude for 1 second.",
      "Continue rotation to 5° nose-up and accelerate to VBLSS 45 KIAS; maintain NR close to 93%.",
      "At VBLSS with positive climb, lower collective to recover 101% NR.",
      "Continue climb to 200 ft ALS or LDP height +70 ft ALS using 2.5 min power.",
      "At 200 ft ALS or LDP height +70 ft ALS, whichever is higher, accelerate to VY and continue toward 1000 ft.",
      "Reduce to continuous OEI power (148% PI), gear UP at VY, release PARK BRAKE and shut down the failed engine at 1000 ft ALS.",
    ],
  },
  {
    title: "G&E H/H Variable LDP — engine failure at/after LDP",
    source: "AW169 QRH EP Emerg-Malfunc p. 237",
    steps: [
      "Adjust collective to establish descent, maintaining rotor speed close to 100% NR.",
      "Adjust pitch attitude to keep the centre of the helipad between the pilot's ankles.",
      "At approximately 10–5 ft ALS, increase collective to cushion landing; maximum allowed GS at touchdown is 5 kt.",
      "After touchdown centralize cyclic, lower collective to MPOG, shut down the failed engine and set PARK BRAKE as required.",
      "Consider EMERGENCY GROUND EGRESS.",
    ],
  },
  {
    title: "Offshore / Elevated Helideck — engine failure recognized in hover",
    source: "AW169 QRH EP Emerg-Malfunc p. 238",
    steps: [
      "Maintain collective setting or lower collective slightly if required to land.",
      "Increase collective to cushion landing as touchdown becomes imminent; maximum permitted GS at touchdown is 5 kt.",
      "After touchdown centralize cyclic and simultaneously reduce collective to MPOG.",
      "Shut down the affected engine and consider EMERGENCY GROUND EGRESS.",
    ],
  },
  {
    title: "Offshore / Elevated Helideck — engine failure before TDP",
    source: "AW169 QRH EP Emerg-Malfunc p. 239",
    steps: [
      "Adjust collective to establish descent and maintain rotor speed approximately 100% NR.",
      "Maintain aircraft position over the take-off point while descending.",
      "At approximately 10–5 ft ATS, increase collective to cushion landing; maximum allowed GS at touchdown is 5 kt.",
      "After touchdown centralize cyclic and simultaneously reduce collective to MPOG.",
      "Shut down the affected engine and consider EMERGENCY GROUND EGRESS.",
    ],
  },
  {
    title: "Offshore / Elevated Helideck — engine failure at/after TDP",
    source: "AW169 QRH EP Emerg-Malfunc pp. 240–241",
    steps: [
      "Continue rotation to 12° nose-down to achieve 15 kt GS, using collective to maintain NR close to 93%.",
      "Increase attitude to 6° nose-up and continue acceleration to VTOSS; after positive climb, lower collective to recover 101% NR.",
      "At VTOSS 45 KIAS, maintain speed and climb to 200 ft ATS using OEI 2.5 min power.",
      "At 200 ft ATS, select landing gear UP while accelerating to VY using OEI 2.5 min power.",
      "Continue climb to 1000 ft ATS or cruise level, reducing to continuous OEI power (148% PI) before 2.5 min power expires.",
      "Release PARK BRAKE, shut down the affected engine at 1000 ft ATS, complete AFTER TAKE-OFF checks, select PFD MAG and refer SINGLE ENGINE PROCEDURE.",
    ],
  },
  {
    title: "Offshore / Elevated Helideck — engine failure before LDP",
    source: "AW169 QRH EP Emerg-Malfunc pp. 244–245",
    steps: [
      "Apply collective to set OEI 2.5 min power and maintain NR close to 93%; set pitch 10° nose-down from present attitude to accelerate to VBLSS 45 KIAS.",
      "At VBLSS with positive climb, lower collective to recover 101% NR and continue climb to 200 ft ALS using OEI 2.5 min power.",
      "At 200 ft ALS, select landing gear UP while accelerating to VY using OEI 2.5 min power.",
      "Continue to 1000 ft ALS or cruise level, reducing to continuous OEI power (148% PI) before 2.5 min power expires.",
      "Release PARK BRAKE, shut down the failed engine, complete AFTER TAKE-OFF checks, select PFD MAG and refer SINGLE ENGINE PROCEDURE.",
    ],
  },
  {
    title: "Offshore / Elevated Helideck — engine failure at/after LDP",
    source: "AW169 QRH EP Emerg-Malfunc p. 246",
    steps: [
      "Adjust collective to continue descent while reducing rate of descent; adjust pitch attitude as required to reduce speed.",
      "At approximately 15–10 ft ATS, increase collective to cushion landing; maximum nose-up attitude at touchdown 15° and maximum GS 5 kt.",
      "After touchdown centralize cyclic and reduce collective to MPOG.",
      "Set PARK BRAKE as required, shut down the affected engine and consider EMERGENCY GROUND EGRESS.",
    ],
  },
];

export default function EpCatAOeiContingenciesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div
        className="sticky z-10 border-b bg-white/80 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/90"
        style={{ top: "calc(4rem + env(safe-area-inset-top, 0px))" }}
      >
        <div className="mx-auto max-w-3xl px-6 py-3">
          <BackButton label="Procedures" to="/training/procedures/aw169" />
        </div>
      </div>

      <main className="mx-auto max-w-3xl space-y-5 p-6">
        <header className="rounded-xl border bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">AW169 Enhanced Performance</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900 dark:text-zinc-100">CAT A OEI contingency procedures</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
            EP-specific training summary extracted from the AW169 QRH EP. Use the official QRH/RFM as the controlling source.
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

        <footer className="text-center text-xs text-slate-500 dark:text-zinc-400">AW169 EP training reference. For training use only.</footer>
      </main>
    </div>
  );
}