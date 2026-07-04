export type RuleGroup = {
  heading?: string;
  bullets: string[];
};

export type RuleTopic = {
  slug: string;
  title: string;
  intro?: string;
  groups: RuleGroup[];
  reference: string;
};

export const VFR_TOPICS: RuleTopic[] = [
  {
    slug: "vmc-minima",
    title: "VMC minima (visibility & cloud clearance)",
    groups: [
      {
        heading: "At or above 3000 ft AMSL, or 1000 ft above terrain (whichever is higher)",
        bullets: [
          "Flight visibility: 8 km at/above FL100; 5 km below FL100.",
          "Distance from cloud: 1500 m horizontally, 300 m (1000 ft) vertically.",
        ],
      },
      {
        heading: "At or below 3000 ft AMSL, or 1000 ft above terrain (whichever is higher)",
        bullets: [
          "Flight visibility: 5 km.",
          "Clear of cloud and in sight of the surface.",
          "Helicopters may be operated in flight visibility down to 800 m (but not less) when flown at a speed that gives adequate opportunity to see other traffic or obstacles in time to avoid a collision.",
        ],
      },
    ],
    reference: "SERA.5001 – VMC visibility and distance from cloud minima",
  },
  {
    slug: "special-vfr",
    title: "Special VFR in control zones",
    groups: [
      {
        bullets: [
          "May be authorized by ATC for a VFR flight within a control zone when weather is below VMC minima.",
          "Ground visibility at least 1500 m (800 m for helicopters); clear of cloud and in sight of the surface.",
          "At night, normally limited to take-off/climb-out or approach/landing only, unless the competent authority permits otherwise.",
          "Subject to ATC clearance and traffic conditions — it is not a right, only a possibility.",
        ],
      },
    ],
    reference: "SERA.5010 – Special VFR in control zones",
  },
  {
    slug: "vfr-cruising-levels",
    title: "VFR cruising levels (semicircular rule)",
    groups: [
      {
        bullets: [
          "Applies above 3000 ft AMSL (or the applicable transition altitude, if higher) when a cruising level is required.",
          "Track 000°–179° (magnetic): odd flight level/altitude + 500 ft (e.g. FL035, FL055, 3500 ft, 5500 ft).",
          "Track 180°–359° (magnetic): even flight level/altitude + 500 ft (e.g. FL045, FL065, 4500 ft, 6500 ft).",
          "The +500 ft offset from IFR levels is what keeps VFR traffic vertically separated from IFR traffic on the same semicircular scheme.",
        ],
      },
    ],
    reference: "SERA.5015 – Table of cruising levels",
  },
  {
    slug: "minimum-heights",
    title: "Minimum heights for VFR flight",
    groups: [
      {
        bullets: [
          "Over congested areas of cities, towns or settlements: not below 300 m (1000 ft) above the highest obstacle within 600 m of the aircraft.",
          "Elsewhere: not below 150 m (500 ft) above the ground or water, except when necessary for take-off or landing.",
          "Helicopters may be operated at lower heights than the fixed-wing minima above, provided this is done safely and in accordance with the applicable operating rules and any local restrictions.",
        ],
      },
    ],
    reference: "SERA.5005(f)/(g) – Minimum heights",
  },
  {
    slug: "right-of-way",
    title: "Right-of-way rules",
    groups: [
      {
        bullets: [
          "Converging at approximately the same level: the aircraft that has the other on its right gives way.",
          "Head-on or approximately so: both aircraft alter course to the right.",
          "Overtaking: the overtaken aircraft has right of way; the overtaking aircraft alters course to the right and keeps clear until well past and clear.",
          "An aircraft that must give way shall avoid passing over, under, or crossing ahead of the other aircraft, unless well clear.",
          "General priority order: airships give way to nothing powered listed below them; power-driven heavier-than-air aircraft give way to airships, gliders and balloons; all give way to aircraft that are towing or being towed.",
          "An aircraft aware that another is compelled to land has priority and shall give way.",
        ],
      },
    ],
    reference: "SERA.3201–SERA.3210 – Right of way",
  },
  {
    slug: "light-signals",
    title: "Light signals from the control tower",
    groups: [
      {
        heading: "To aircraft in flight",
        bullets: [
          "Steady green: cleared to land.",
          "Flashing green: return for landing (expect a landing clearance).",
          "Steady red: give way to other aircraft and continue circling.",
          "Flashing red: aerodrome unsafe — do not land.",
          "Flashing white: land at this aerodrome and proceed to the apron.",
          "Series of red pyrotechnic lights: notwithstanding any previous instructions, do not land for the time being.",
        ],
      },
      {
        heading: "To aircraft on the ground",
        bullets: [
          "Steady green: cleared for take-off.",
          "Flashing green: cleared to taxi.",
          "Steady red: stop.",
          "Flashing red: taxi clear of the landing area in use.",
          "Flashing white: return to the starting point on the aerodrome.",
        ],
      },
    ],
    reference: "SERA Appendix 1 – Signals",
  },
  {
    slug: "airspace-classes",
    title: "Airspace classes (A–G) overview",
    groups: [
      {
        bullets: [
          "Class A: IFR only. ATC clearance required. Separated from all other traffic.",
          "Class B: IFR & VFR. ATC clearance required. Separated from all other traffic.",
          "Class C: IFR & VFR. ATC clearance required. IFR separated from IFR and VFR; VFR separated from IFR and given traffic information on other VFR flights.",
          "Class D: IFR & VFR. ATC clearance required. IFR separated from IFR, traffic information on VFR flights; VFR flights get traffic information only.",
          "Class E: IFR & VFR. ATC clearance required for IFR only. IFR separated from IFR, traffic information as far as practical; no clearance needed for VFR.",
          "Class F: IFR & VFR. Air traffic advisory service for IFR, traffic information as far as practical; no clearance required.",
          "Class G: IFR & VFR. Flight information service only; no clearance and no separation service provided.",
        ],
      },
    ],
    reference: "ICAO Annex 11 / SERA – Airspace classification",
  },
  {
    slug: "vfr-flight-plan",
    title: "When a VFR flight plan is required",
    groups: [
      {
        bullets: [
          "Before operating across international borders.",
          "When operating within, into, or along routes/areas designated by the competent authority for flight-plan purposes.",
          "When search and rescue (SAR) alerting service may need to be triggered for the flight.",
          "At night, or when operating outside sight of the surface, per local/State requirements.",
          "When departing from an aerodrome without ATC where local procedures require notifying a flight plan or booking-out.",
          "Even when not mandatory, filing or notifying a flight plan is good practice for SAR alerting on any flight over remote or offshore terrain.",
        ],
      },
    ],
    reference: "SERA.4001 – Submission of a flight plan",
  },
];

export const IFR_TOPICS: RuleTopic[] = [
  {
    slug: "ifr-cruising-levels",
    title: "IFR cruising levels (semicircular rule)",
    groups: [
      {
        bullets: [
          "Track 000°–179° (magnetic): odd flight level/altitude (FL010, FL030, FL050… / 1000, 3000, 5000 ft).",
          "Track 180°–359° (magnetic): even flight level/altitude (FL020, FL040, FL060… / 2000, 4000, 6000 ft).",
          "Above the applicable transition altitude, levels are flown and reported as flight levels; at or below it, as altitudes on QNH.",
        ],
      },
    ],
    reference: "SERA.5015 – Table of cruising levels",
  },
  {
    slug: "transition-altitude-level",
    title: "Transition altitude & transition level",
    groups: [
      {
        bullets: [
          "Transition altitude: the altitude at or below which vertical position is given as an altitude (QNH).",
          "Transition level: the lowest flight level available for use above the transition altitude (reference pressure 1013.2 hPa).",
          "Climbing through the transition altitude: set 1013.2 hPa and report subsequent levels as flight levels.",
          "Descending through the transition level: set QNH (or QFE if used locally) and report as altitude/height.",
          "The transition altitude is published per aerodrome or FIR and varies by State — do not assume a fixed value.",
        ],
      },
    ],
    reference: "ICAO Annex 2 / SERA – Transition altitude and level",
  },
  {
    slug: "alternate-aerodromes",
    title: "Alternate aerodrome requirements",
    groups: [
      {
        heading: "Destination alternate",
        bullets: [
          "Required unless destination weather is forecast to remain at or above planning minima around the ETA, the destination has an instrument approach procedure (or is otherwise suitable), and no other operational reason requires one.",
          "To be used as an alternate, forecast weather at the destination alternate must be at or above the applicable alternate minima at the estimated time of use.",
        ],
      },
      {
        heading: "Take-off alternate",
        bullets: [
          "Required when weather at the departure aerodrome is below the applicable landing minima, or when it would otherwise not be possible to return there.",
          "For helicopters, normally selected within a limited distance or flight time of the departure point, as defined in the operator's operations manual.",
        ],
      },
      {
        heading: "Isolated aerodrome",
        bullets: [
          "A destination with no suitable alternate is treated as an isolated aerodrome for fuel planning purposes.",
          "Instead of standard alternate fuel, extra fuel is carried to cover a defined additional holding/diversion contingency.",
        ],
      },
    ],
    reference: "EASA Air Ops – Part-NCC/SPA – Alternate aerodrome selection & fuel policy",
  },
  {
    slug: "fuel-planning",
    title: "IFR fuel planning (reserves)",
    groups: [
      {
        bullets: [
          "Trip fuel: fuel from start of taxi to landing at the destination.",
          "Contingency fuel: covers deviations from the planned operation (e.g. wind, routing changes).",
          "Alternate fuel: fuel to fly a missed approach at the destination, climb, route to, and approach/land at the alternate (when one is required).",
          "Final reserve fuel: fuel for a specified holding time at 1500 ft above the alternate (or destination) elevation in standard conditions — 20 minutes for helicopters under EASA rules (aeroplanes use 30 minutes).",
          "Additional/extra fuel: any further fuel the commander judges necessary (isolated aerodrome, extended holding, etc.).",
          "Declare \"MINIMUM FUEL\" to ATC if usable fuel is expected to be less than final reserve on landing; declare a fuel emergency (\"MAYDAY MAYDAY MAYDAY FUEL\") if it will be, or already is, below final reserve.",
        ],
      },
    ],
    reference: "EASA Air Ops – CAT.OP.MPA.150 / NCC.OP – Fuel policy",
  },
  {
    slug: "holding-procedures",
    title: "Holding procedures",
    groups: [
      {
        bullets: [
          "Standard holding pattern uses right-hand turns unless the published procedure or ATC specifies left-hand turns.",
          "Standard bank angle: 25°, or the rate giving a 3°/second turn, whichever requires the lesser bank.",
          "Outbound leg timing: 1 minute at or below 14 000 ft; 1.5 minutes above 14 000 ft.",
          "Entry technique (direct, teardrop, or parallel/offset) depends on the aircraft's inbound heading relative to the holding course.",
          "Maintain the last assigned altitude/level and the speed limit for the aircraft category unless otherwise cleared by ATC.",
        ],
      },
    ],
    reference: "ICAO Doc 8168 (PANS-OPS) – Holding procedures",
  },
  {
    slug: "approach-ban-rvr",
    title: "Approach ban & RVR/visibility minima",
    groups: [
      {
        bullets: [
          "The \"approach ban\" prohibits continuing an approach past the final approach fix (or below 1000 ft AAL if there is none) when the reported RVR/visibility is below the minimum published for that procedure.",
          "If RVR/visibility is at or above minima at that point, the approach may be continued even if conditions later deteriorate, down to the applicable decision point.",
          "Minima are published per approach type and category, and depend on approach lighting, runway markings, and aircraft approach category.",
        ],
      },
    ],
    reference: "EASA Air Ops – Part-CAT/NCC.OP – Approach ban",
  },
  {
    slug: "missed-approach",
    title: "Missed approach & obstacle clearance",
    groups: [
      {
        bullets: [
          "Initiate at or before the missed approach point (MAPt), or immediately if the required visual reference is not established or maintained at the decision altitude/height (DA/DH) or minimum descent altitude/height (MDA/MDH).",
          "Missed approach obstacle clearance is normally based on a minimum climb gradient of 2.5% from the MAPt, unless a steeper gradient is published.",
          "Category A helicopters generally benefit from tighter obstacle clearance areas than fixed-wing categories, due to lower approach and missed-approach speeds.",
          "Fly the published missed approach track and altitude/level precisely, unless ATC issues other instructions.",
        ],
      },
    ],
    reference: "ICAO Doc 8168 (PANS-OPS) – Missed approach criteria",
  },
  {
    slug: "ils-glideslope",
    title: "ILS glideslope, localizer & DA/DH",
    groups: [
      {
        heading: "Glideslope",
        bullets: [
          "Standard/nominal ILS glideslope angle: 3° above horizontal.",
          "Steeper glideslopes (commonly up to about 4°–4.5°, and higher still on some dedicated helicopter or steep/noise-abatement approach procedures) may be published where obstacles or noise abatement require it — always fly the published angle, never assume 3°.",
        ],
      },
      {
        heading: "Localizer",
        bullets: [
          "Provides lateral guidance aligned with the runway centreline.",
          "Course width is designed so that full-scale deflection corresponds to a roughly fixed distance either side of the runway centreline at the threshold — the angular width therefore varies with runway length rather than being one fixed number of degrees for every installation.",
        ],
      },
      {
        heading: "Decision altitude/height (DA/DH)",
        bullets: [
          "The altitude/height on a precision or APV approach at which a missed approach must be initiated if the required visual reference has not been established.",
          "Contrast with MDA/MDH (minimum descent altitude/height), used on non-precision approaches — a floor you may level off at and continue toward, rather than a single go/no-go instant.",
        ],
      },
    ],
    reference: "ICAO Annex 10 / Doc 8168 – ILS characteristics & approach criteria",
  },
  {
    slug: "intercept-angles",
    title: "Intercept angles (radial / localizer / radar vectors)",
    groups: [
      {
        bullets: [
          "Typical practical intercept angle to acquire a VOR radial or airway: about 30°–45°, adjusted for closing speed and distance to the fix.",
          "Procedure design (PANS-OPS) generally keeps the intercept angle onto the final approach course at 30° or less for a stabilized intercept near the final approach fix; larger angles are only used further out, on initial/intermediate segments.",
          "For an ILS localizer, an intercept angle much greater than about 30° close to the runway makes it difficult to establish before the glideslope/final approach fix — ATC radar vectors are normally planned within this guidance.",
          "These are design and technique values, not one fixed legal number in every case — always fly the angle implied by the published procedure or the actual ATC vector given, not a rule of thumb, when the two differ.",
        ],
      },
    ],
    reference: "ICAO Doc 8168 (PANS-OPS) – Instrument approach procedure construction",
  },
  {
    slug: "lost-comms-squawk",
    title: "Lost communications & transponder codes",
    groups: [
      {
        heading: "Transponder codes",
        bullets: [
          "7500: unlawful interference (hijack).",
          "7600: radio communication failure.",
          "7700: general emergency.",
        ],
      },
      {
        heading: "Lost communications (IFR, in controlled airspace)",
        bullets: [
          "Attempt contact on other frequencies, via other aircraft, or by other means; select 7600 on the transponder.",
          "If in VMC: continue in VMC, land at the nearest suitable aerodrome, and report arrival by the most expeditious means.",
          "If in IMC: continue per the flight plan — the route and level last assigned, or if none, as filed — then commence descent/approach at the expected approach time if one was given, otherwise at the ETA from the flight plan.",
          "Squawk 7600 as soon as a communications failure is recognized, so ATC can apply their own lost-comm procedures.",
        ],
      },
    ],
    reference: "SERA.8020 / ICAO Annex 2 Appendix 2 – Communication failure",
  },
];

export function findTopic(topics: RuleTopic[], slug: string): RuleTopic | undefined {
  return topics.find((t) => t.slug === slug);
}
