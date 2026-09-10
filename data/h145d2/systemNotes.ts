import type { SystemNote } from "../h145d3/systemNotes";
import {
  FLIGHT_CONTROLS_AFCS,
  DUAL_HYDRAULIC,
  POWER_PLANT,
  ENGINE_FIRE,
  FUEL_SYSTEM,
  GEARBOX_DRIVE,
  ELECTRICAL_SYSTEM,
  HEATING_VENTILATION,
  AIR_DATA,
  HELIONIX,
} from "../h145d3/systemNotes";

// The BK117 D-2 shares its Section 7 systems with the D-3 — same Helionix
// SW V10, same Arriel 2E engines and FADEC, same hydraulics, fuel, electrical,
// transmission and Fenestron. The one real difference is the main rotor: the
// D-2 has a four-bladed hingeless rotor, the D-3 a five-bladed bearingless one.
// So the shared notes are reused and only the rotor note is D-2 specific.

const ROTOR_SYSTEMS_D2: SystemNote = {
  slug: "rotor-systems",
  title: "Rotor Systems",
  subtitle: "A four-bladed hingeless main rotor on a one-piece titanium cross-shaped forged head — the flexible blades take lead-lag and flap without hinges — and a shrouded ten-blade Fenestron.",
  rfmReference:
    "H145 (BK117 D-2) Flight Manual Section 7.8 (Rotor Systems — main rotor head, main rotor blades, tail rotor system, rotor systems indications).",
  sections: [
    {
      heading: "Main rotor",
      paragraphs: [
        "A four-bladed hingeless main rotor. The main rotor head is a one-piece cross-shaped titanium drop forging, bolted directly to the transmission mast, with the four blades attached by two bolts each. Four titanium inner sleeve assemblies are held in the head by flexible tension-torsion straps and two quadruple retaining nuts each at the head centre, which take the centrifugal force. Control inputs reach the head through the swashplate and rotating control rods; moving the rods changes the pitch of the inner sleeves and the attached blades. Lead-lag and flap happen without mechanical hinges through the flexible properties of the blades. A hub cap tops the head.",
        "The blades are composite fibre — a hard-foam core, a glass-roving spar, a nickel anti-erosion strip, a lead rod, and a fibreglass/carbon skin — flexible in bending vertically and horizontally. Each blade attaches to a mounting fork by a blade fitting assembly, retained by a main blade bolt (hollow, for dynamic balance weights) and a secondary blade bolt. An oil-lubricated pendulum vibration absorber at the blade root and a balancing chamber system reduce the vibration transmitted to the fuselage.",
      ],
    },
    {
      heading: "Tail rotor",
      paragraphs: [
        "A Fenestron-type shrouded tail rotor, rotating counter-clockwise seen from the right, its head on the tail gearbox output shaft. Its ten blades are held by integrated tension-torsion straps that take the centrifugal load, and yaw control is by collective pitch change of all ten blades through the tail rotor actuator, commanded by the pilot or AFCS.",
        "NR is picked up by a sensor in the main transmission and a back-up sensor in the tail rotor transmission, and shown on the FND and VMD.",
      ],
    },
  ],
};

export const H145D2_SYSTEM_NOTES: SystemNote[] = [
  FLIGHT_CONTROLS_AFCS,
  DUAL_HYDRAULIC,
  POWER_PLANT,
  ENGINE_FIRE,
  FUEL_SYSTEM,
  GEARBOX_DRIVE,
  ROTOR_SYSTEMS_D2,
  ELECTRICAL_SYSTEM,
  HEATING_VENTILATION,
  AIR_DATA,
  HELIONIX,
];
