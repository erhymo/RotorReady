import type { SystemNote } from "../h125b32b1/systemNotes";
import {
  VEMD,
  CENTRAL_WARNING_PANEL,
  AFCS,
  HYDRAULIC_SYSTEM,
  ELECTRICAL_SYSTEM,
  POWER_TRANSMISSION,
  HEATING_VENTILATION,
  EMERGENCY_FLOATATION,
  HOIST,
  EXTERNAL_LOAD,
  BAMBI_BUCKET,
  SAND_FILTER,
} from "../h125b32b1/systemNotes";

// The AS350 B3e shares its airframe, transmission, hydraulics, electrical
// system, VEMD, warning panel, AFCS and mission-kit installations with the
// AS350 B3 (2B1). Those notes are reused verbatim below. The engine and its
// fuel-flow control are the real difference — the B3e has the Arriel 2D with
// N1/N2 terminology and a more automated FADEC — so the Power Plant and Fuel
// System notes are written specifically for the B3e Flight Manual.

const POWER_PLANT_2D: SystemNote = {
  slug: "power-plant",
  title: "Power Plant and Engine Control",
  subtitle: "The Arriel 2D — a 700 kW-class engine in the same airframe as the 2B1 — its dual-channel FADEC governing N2, the automatic second-chance start, and the EBCAU back-up governor holding N2 388–400 rpm after a total FADEC failure.",
  rfmReference:
    "AS350 B3e Flight Manual Section 7.7 (Power Plant — General, Engine Oil System), Section 7.8 §5 (Fuel Flow Control — FADEC functions, N2 governing, FADEC failures, Fuel governor back-up system, Automatic 2nd chance engine start), and Section 7.1 §2 (Descriptive Data — engine ratings).",
  sections: [
    {
      heading: "The engine",
      paragraphs: [
        "A single Turbomeca (Safran) Arriel 2D, a 700 kW (937 SHP) class turboshaft, in its own fireproof compartment aft of the MGB and above the rear cargo hold, connected to the MGB by a shaft between two flexible couplings. Maximum take-off power (MTOP) is 641 kW (860 SHP); maximum continuous power (MCP) is 551 kW (739 SHP) — meaningfully more installed power than the 2B1 in the same airframe.",
        "It is a modular free-wheel engine of five independent modules: an accessory drive gearbox / transmission shaft, an axial compressor, a gas generator HP section, a power turbine, and a reduction gearbox. The oil system is in two parts — an external system in the engine and MGB compartments with one tank and one cooler (fireproof hoses in the engine bay), and an internal system inside the engine with one pressure pump, three scavenge pumps, a filter with a by-pass valve, and one electrical magnetic chip detector.",
      ],
    },
    {
      heading: "The FADEC",
      paragraphs: [
        "Fuel flow is managed by a FADEC built around a dual-channel Electronic Engine Control Unit (EECU) in the rear cargo bay. It holds power turbine speed N2 constant regardless of the power drawn, by adjusting gas generator speed N1, metering fuel through a stepper motor on a valve in the engine's hydro-mechanical unit (HMU). At every engine start the FADEC automatically swaps which channel — A or B — drives the HMU, to expose any dormant failure.",
        "The EECU also handles automatic starting with TOT overlimit prevention, proportional-integral N2 control, surge and flame-out protection during transients, bleed-valve monitoring, N1/TOT/torque overlimit protection, failure detection and indication, the Engine Health Check, and usage/N1/N2 cycle counting. Post-MOD 07-4831/07-20015 it adds automatic engine shutdown on an N2 overspeed above 120% (463 rpm) — the FADEC fires the engine stop electrovalve, cutting fuel for an immediate shutdown; restart capability is unaffected, and the function self-tests at every start (a detected failure flashes GOV).",
      ],
    },
    {
      heading: "N2 governing",
      paragraphs: [
        "The FADEC stabilises N2 on an N2 datum (N2*) sent from the VEMD over the crosstalk link. If that datum is not received, the FADEC reverts to an N2 of 394 rpm (NR equivalent) and GOV comes on. If the FADEC detects autorotation or a very low power setting, it automatically raises N2 in FLIGHT mode to about 400 rpm, to sharpen engine response and reduce the NR droop after a fast power demand.",
        "Once gas generator speed is established (N1 > 60%), normal engine running is independent of the helicopter electrical system — the FADEC is then fed by a gas-generator-driven alternator with two independent channels. Helicopter 28 VDC is still needed for the starting sequence and monitoring, and as a back-up source for the EECU fuel control section.",
      ],
    },
    {
      heading: "FADEC failure levels",
      table: {
        columns: ["Level", "Indication", "Effect"],
        rows: [
          ["1", "GOV flashing (at idle, starting, or engine stopped)", "No effect on engine control — loss of redundancy only; refer to Section 3"],
          ["2", "GOV steady", "Degraded engine control, or the back-up governing system out of neutral — in some cases engine control and monitoring are degraded; refer to Section 3"],
          ["3", "GOV (total FADEC failure)", "The FADEC main metering valve is frozen at its last computed value, the back-up system activates automatically, automatic start is impossible; refer to Section 3"],
        ],
      },
    },
    {
      heading: "The EBCAU back-up governor and automatic restart",
      paragraphs: [
        "The fuel governor back-up system is an electronic computer — the Engine Back-up Control Ancillary Unit (EBCAU) — completely independent of the FADEC. On detection of a total FADEC failure it takes over fuel governing immediately, holding N2 between 388 and 400 rpm through a DC actuator on a back-up metering valve whose slots sit partly in series and partly in parallel with the HMU's main metering valve, adding or subtracting fuel relative to the flow the frozen FADEC valve is still passing. Whenever the FADEC works, the back-up valve is held in neutral as a safety device.",
        "During start, if ignition has not occurred 5 seconds after N1 passes 17%, the EECU stops the sequence on its own, lets N1 fall back to 10%, and then launches a fresh start sequence — a second-chance start managed entirely by the EECU with no pilot action.",
      ],
      note: "In-flight engine power reduction using the twist grip is prohibited except for engine failure training and the emergency procedures that call for it. Heating and demisting must not be used above the engine maximum continuous rating.",
    },
  ],
};

const FUEL_SYSTEM_2D: SystemNote = {
  slug: "fuel-system",
  title: "Fuel System",
  subtitle: "A single spin-moulded (or crash-resistant) tank of roughly 425 kg usable, a priming pump used only for the start, and an engine side that heats the fuel enough to run at −20°C with no anti-ice additive.",
  rfmReference:
    "AS350 B3e Flight Manual Section 7.8 (Fuel System — General, Helicopter Supply System, Engine Fuel Supply System, Controls and Monitoring); Section 7.1 §2 (fuel capacity); Section 2.5 (approved fuels).",
  sections: [
    {
      heading: "What it is",
      paragraphs: [
        "The fuel system has a helicopter part and an engine part. The helicopter part is a spin-moulded tank (or a crash-resistant tank on modified aircraft), a supply system, a gravity refuelling filler, and a monitoring system. The engine part — an LP pump, a fuel filter, an HP pump, and the fuel-control hydro-mechanical unit — is integral with the engine, and the hydro-mechanical unit is driven by the FADEC and its back-up system.",
        "Total capacity is 540 litres (427 kg); usable fuel with the crash-resistant tank is 538 litres / 425 kg (937 lb).",
      ],
    },
    {
      heading: "Helicopter supply side",
      paragraphs: [
        "The tank sits in the body structure beneath the transmission deck, with a fuel level transmitter, a priming pump, and a decanting sump with a water drain valve. A vent is on the right side, the filler on the left. Fuel reaches the engine through a fuel shut-off valve. The priming pump only primes the fuel line for starting — the engine draws its fuel by suction in normal running.",
      ],
    },
    {
      heading: "Engine supply side",
      paragraphs: [
        "The engine LP pump draws fuel through the filter to the HP pump. The filter carries a by-pass, a pressure transmitter, and a pressure/temperature transmitter that together determine the pre-clogging level. The fuel is warmed by the combined fuel/oil heat exchanger on the oil filter assembly — enough to allow operation down to −20°C with no anti-ice additive in the fuel — then delivered to the FADEC hydro-mechanical unit.",
        "From there the fuel passes a shut-off solenoid valve (the means of shutting the engine down) and a pressurizing valve before reaching the main injector and injection wheel. A three-way electrovalve feeds two starting injectors during the start; once the start ends they are fed with P3 air to prevent carbonisation. On shutdown a purge valve drains the fuel left in the main injection system.",
      ],
    },
    {
      heading: "Controls and monitoring",
      paragraphs: [
        "The FUEL PUMP (FUEL P) indicator light shows the priming pump state — selected ON for start and purge, OFF once the engine is running. An engine fuel control back-up system (see the Power Plant note) can meter fuel through a back-up valve if the FADEC fails completely.",
      ],
      note: "If the fuel contains no freezing inhibitor and OAT is below −20°C, an anti-icing additive is mandatory. Only the fuels listed in Section 2.5 may be used.",
    },
  ],
};

export const H125B3E_SYSTEM_NOTES: SystemNote[] = [
  VEMD,
  CENTRAL_WARNING_PANEL,
  AFCS,
  POWER_PLANT_2D,
  FUEL_SYSTEM_2D,
  HYDRAULIC_SYSTEM,
  ELECTRICAL_SYSTEM,
  POWER_TRANSMISSION,
  HEATING_VENTILATION,
  EMERGENCY_FLOATATION,
  HOIST,
  EXTERNAL_LOAD,
  BAMBI_BUCKET,
  SAND_FILTER,
];
