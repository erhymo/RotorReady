import type { ExteriorHotspot } from "@/components/ExteriorMap";

// Exterior equipment/antenna locations for the AW169 airframe, sourced from the
// RFM System Description (Chapters 23/34) and Optional Equipment Supplements.
// Shared identically by AW169 and AW169 EP — the airframe and this equipment
// fit are the same between variants.
export const AW169_EXTERIOR_HOTSPOTS: ExteriorHotspot[] = [
  {
    id: "main-rotor",
    label: "Main rotor head",
    x: 42.9,
    y: 31.2,
    description:
      "Four-bladed main rotor system driving the aircraft's lift and control in pitch, roll and yaw via the swashplate.",
    note: "NR (rotor speed) is monitored on the triple-tach display; normal operating range 100% ±2%.",
  },
  {
    id: "engine-intakes",
    label: "Engine air intakes",
    x: 49.6,
    y: 39.1,
    description:
      "Twin engine intakes feeding the two turboshaft engines mounted side-by-side above the cabin roof. Each intake can be fitted with an optional EAPS (Engine Air Particle Separator) for operations in sandy/dusty environments.",
  },
  {
    id: "tail-rotor",
    label: "Tail rotor",
    x: 91.0,
    y: 27.5,
    description:
      "Conventional (non-fenestron) tail rotor mounted on the left side of the vertical fin, counteracting main rotor torque and providing yaw control.",
  },
  {
    id: "weather-radar",
    label: "Weather radar",
    x: 16.1,
    y: 58,
    description:
      "RTA-4112 weather radar — a 12-inch flatplate antenna and receiver/transmitter unit in the nose radome. Provides Weather, Weather+Turbulence, Turbulence, Terrain Mapping and Ground Clutter Suppression modes, controlled through the MFD.",
    note: "Optional supplement-fit equipment, not standard on every airframe.",
  },
  {
    id: "tcas",
    label: "TCAS II antennas",
    x: 19.7,
    y: 50.7,
    description:
      "Traffic Alert and Collision Avoidance System II. Two directional antennas: one on the top surface within the nose radome, the second under the rear of the aircraft belly. Monitors a nominal 14 NM radius around the helicopter for conflicting traffic.",
  },
  {
    id: "pitot-static",
    label: "Pitot-static probes",
    x: 22,
    y: 60.9,
    description:
      "Left and right pitot-static probes feed airspeed, altitude and vertical speed to the flight instruments. Heated to prevent icing — pitot heat must be selected AUTO or ON below +4°C indicated OAT.",
  },
  {
    id: "vhf-upper",
    label: "VHF antenna (upper)",
    x: 33.9,
    y: 40.6,
    description:
      "Number 1 VHF communication antenna, installed on the left top fuselage. Covers 118.000–151.975 MHz. Low-drag, ice-resistant blade profile, max 20 cm (8 in) high.",
  },
  {
    id: "vhf-lower",
    label: "VHF antenna (lower)",
    x: 43.3,
    y: 63.8,
    description:
      "Number 2 VHF communication antenna, installed on the bottom fuselage — paired with the upper VHF antenna for the dual VHF communication system.",
  },
  {
    id: "radalt",
    label: "Radar altimeter antennas",
    x: 66.9,
    y: 62.3,
    description:
      "Two pairs of radar altimeter antennas (transmit and receive for RAD ALT 1 and RAD ALT 2) mounted on the left and right sides of the bottom tail section, measuring height above terrain up to 2500 ft.",
  },
  {
    id: "adelt",
    label: "Emergency locator transmitter",
    x: 77.2,
    y: 47.8,
    description:
      "ADELT/CPI (Crash Position Indicator) — a locator beacon and antenna mounted on the left side of the tail cone. Automatically activates on crash or ditching, transmitting on 121.5 MHz and 406.025 MHz with encoded GPS position.",
    note: "Can also be manually activated from the ADELT control panel in the cockpit, or automatically via the water-activated switch on the left sponson.",
  },
  {
    id: "satcom",
    label: "Satcom / GPS antenna",
    x: 82.7,
    y: 36.2,
    description:
      "Combined Iridium/GPS antenna mounted on the tail fin cap, part of the optional SATCOM system providing satellite phone, messaging and position reporting via Iridium low-earth-orbit satellites.",
    note: "Optional supplement kit — SkyTrac, SATCOM or FlightCell systems.",
  },
  {
    id: "cellular",
    label: "Cellular / LTE antenna",
    x: 51.2,
    y: 62.3,
    description:
      "Cellular (3G/4G) and LTE broadband antennas mounted on the lower fuselage, part of the optional GSM/LTE Broadband Datalink kit providing crew and passenger connectivity alongside a cabin WiFi antenna.",
  },
  {
    id: "landing-gear",
    label: "Retractable landing gear",
    x: 39.4,
    y: 72.5,
    description:
      "Retractable tricycle landing gear — a steerable nose wheel and two main wheels retracting into the fuselage sponsons, reducing drag in cruise flight.",
  },
];
