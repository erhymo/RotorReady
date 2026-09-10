export type Abbreviation = { abbr: string; meaning: string };

// Sourced from R22 POH Section 1 (Performance Definitions, Weight and Balance
// Definitions) plus the abbreviations used on the R22 instrument panel, caution
// lights and in Sections 2–4.
export const R22_ABBREVIATIONS: Abbreviation[] = [
  { abbr: "AD", meaning: "Airworthiness Directive — e.g. FAA AD 95-26-04 on main rotor blade / fuselage contact" },
  { abbr: "AGL", meaning: "Above Ground Level" },
  { abbr: "ALT", meaning: "Alternator (also the low-voltage caution light)" },
  { abbr: "BHP", meaning: "Brake Horsepower — actual power output of the engine" },
  { abbr: "CAT", meaning: "Carburetor Air Temperature" },
  { abbr: "CG", meaning: "Center of Gravity" },
  { abbr: "CHT", meaning: "Cylinder Head Temperature" },
  { abbr: "CO", meaning: "Carbon Monoxide" },
  { abbr: "Critical Altitude", meaning: "Altitude at which full throttle produces maximum allowable power (MCP or TOP)" },
  { abbr: "Density Altitude", meaning: "Pressure altitude corrected for OAT — the ISA altitude at which air has the same density" },
  { abbr: "EMU", meaning: "Engine Monitoring Unit — records engine/rotor overspeed and overtemp exceedances" },
  { abbr: "GPH", meaning: "Gallons Per Hour" },
  { abbr: "IGE", meaning: "In Ground Effect" },
  { abbr: "ISA", meaning: "International Standard Atmosphere (29.92 in. Hg and 15 °C at sea level, lapse 1.98 °C per 1000 ft)" },
  { abbr: "KCAS", meaning: "Knots Calibrated Airspeed — KIAS corrected for instrument and position error" },
  { abbr: "KIAS", meaning: "Knots Indicated Airspeed — speed shown on the airspeed indicator" },
  { abbr: "KTAS", meaning: "Knots True Airspeed — KCAS corrected for pressure altitude and temperature" },
  { abbr: "MAP", meaning: "Manifold Pressure — absolute pressure in the engine intake manifold, in inches of mercury" },
  { abbr: "MCP", meaning: "Maximum Continuous Power" },
  { abbr: "MR", meaning: "Main Rotor (MR TEMP, MR CHIP caution lights)" },
  { abbr: "MSL", meaning: "Mean Sea Level — altimeter altitude with the subscale set to sea-level pressure" },
  { abbr: "OAT", meaning: "Outside Air Temperature" },
  { abbr: "OGE", meaning: "Out of Ground Effect" },
  { abbr: "Pressure Altitude", meaning: "Altimeter altitude with the barometric subscale set to 29.92 in. Hg (1013.2 mb)" },
  { abbr: "RPM", meaning: "Revolutions Per Minute — engine or main rotor speed, shown on the tachometer as a percentage of 2550 engine RPM / 510 main rotor RPM" },
  { abbr: "SFAR", meaning: "Special Federal Aviation Regulation — SFAR No. 73 awareness training for R22/R44 pilots" },
  { abbr: "TOGW", meaning: "Takeoff Gross Weight" },
  { abbr: "TOP", meaning: "Takeoff Power — usually limited to a maximum of 5 minutes" },
  { abbr: "TR", meaning: "Tail Rotor (TR CHIP caution light)" },
  { abbr: "VNE", meaning: "Never-Exceed Airspeed" },
  { abbr: "VY", meaning: "Speed for best rate of climb" },
];

export default R22_ABBREVIATIONS;
