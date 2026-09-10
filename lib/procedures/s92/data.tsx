import type { ReactNode } from "react";

export type ProcedureStep = {
  left: string;
  right: ReactNode;
};

export type ProcedureGroup = {
  heading?: string;
  steps: ProcedureStep[];
};

export type ProcedureDefinition = {
  slug: string;
  title: string;
  subtitle?: string;
  reference: string;
  intro?: ReactNode;
  cautions?: string[];
  warnings?: string[];
  groups: ProcedureGroup[];
  notes?: string[];
};

function b(text: string) {
  return <span className="font-semibold">{text}</span>;
}

export const S92_PROCEDURES: ProcedureDefinition[] = [
  {
    slug: "cat-a-horizontal-takeoff",
    title: "CATEGORY A HORIZONTAL TAKEOFF",
    reference: "S-92 RFM Part 1, Section II — Normal Procedures",
    intro: (
      <>
        Category A takeoff and landing procedures, flown at the approved weight, altitude, temperature, field length and wind
        conditions, guarantee continued safe flight and landing after an engine failure.
      </>
    ),
    cautions: [
      "The nose wheel will not self-center after liftoff if it has swiveled about 180° just before liftoff. If retracted in this position, the nose wheel will jam in the up position. If swiveled more than 90°, taxi forward slightly to align it with the fuselage.",
    ],
    groups: [
      {
        steps: [
          { left: "TDP / Vtoss", right: <>Refer to RFM Section IV, Figures 4-8 and 4-9 for TDP and {b("Vtoss")} (TDP + 15 knots) determination.</> },
          { left: "Airspeed bug", right: <>Set the green airspeed bug at the TDP speed.</> },
          { left: "Hover", right: <>Establish a 10 ft hover and note the stabilized hover torque required.</> },
          { left: "Collective", right: <>Increase collective to achieve 10% torque greater than hover.</> },
          { left: "Acceleration", right: <>Lower the nose as necessary to result in a 10–15 ft wheel height acceleration to the TDP speed.</> },
          { left: "At TDP", right: <>Rotate nose up to attain a climbing acceleration to {b("Vtoss")}.</> },
          { left: "After obstacles", right: <>Continue acceleration to {b("Vy")} and retract the landing gear.</> },
        ],
      },
    ],
    notes: ["Vy (best rate of climb speed) is 80 KIAS at sea level, decreasing 1 knot per 1000 ft of altitude above sea level."],
  },
  {
    slug: "cat-a-rolling-takeoff",
    title: "CATEGORY A ROLLING TAKEOFF",
    reference: "S-92 RFM Part 1, Section II — Normal Procedures",
    warnings: ["Excessive aft cyclic movements during takeoff could cause main rotor to airframe contact or tail to ground contact."],
    notes: [
      "Rejected/continued takeoff distances are longer than the values in Section IV when a rolling takeoff is used — add the initial ground-roll distance to the rejected/continued takeoff distance from Figure 4-8. Headwind credit should not be used during a rolling takeoff.",
      "Vy (best rate of climb speed) is 80 KIAS at sea level, decreasing 1 knot per 1000 ft of altitude above sea level.",
    ],
    groups: [
      {
        steps: [
          { left: "Vtoss", right: <>Refer to RFM Section IV for {b("Vtoss")} determination and set it on the airspeed gauge.</> },
          { left: "Ground roll", right: <>Initiate forward taxi, not exceeding 35 kt.</> },
          { left: "Liftoff", right: <>Increase collective to lift off while maintaining a level to slightly nose-low attitude.</> },
          { left: "Acceleration", right: <>Accelerate to {b("Vtdp")} at an altitude between 5 and 15 ft.</> },
          { left: "Climb", right: <>Adjust pitch attitude to climb at {b("Vtoss")}.</> },
          { left: "After obstacles", right: <>Accelerate to {b("Vy")} and retract the landing gear.</> },
        ],
      },
    ],
  },
  {
    slug: "cat-a-approach-and-landing",
    title: "CATEGORY A APPROACH AND LANDING",
    reference: "S-92 RFM Part 1, Section II — Normal Procedures",
    cautions: ["To prevent tail cone contact with the ground during landing and operations near the ground, avoid attitudes of greater than 10° nose-up."],
    groups: [
      {
        steps: [
          { left: "Approach", right: <>Establish an approach to arrive at the LDP — 200 ft above touchdown elevation, at 50 KIAS, rate of descent no more than 600 fpm.</> },
          { left: "Flare", right: <>At 50 ft and 50 KIAS, initiate a deceleration flare.</> },
          { left: "Touchdown", right: <>Continue approach and deceleration to a running touchdown, a spot landing, or a hover.</> },
        ],
      },
    ],
  },
  {
    slug: "cat-a-vertical-takeoff-ground-level-helipad",
    title: "CATEGORY A VERTICAL TAKEOFF — GROUND LEVEL HELIPAD",
    reference: "S-92 RFM Part 1, Section II — Normal Procedures",
    intro: (
      <>
        Based on a 102 ft square helipad. Before takeoff, identify visual alignment cues (buildings, fences, trees, light poles,
        painted lines) several hundred feet from the pad, both ahead of and on the flying pilot&apos;s side, to provide lateral and
        longitudinal drift cues. For night operations, the helipad and alignment cues must be illuminated.
      </>
    ),
    cautions: ["The nose wheel will not self-center after liftoff if it has swiveled about 180° just before liftoff. If retracted in this position, the nose wheel will jam in the up position. If swiveled more than 90°, taxi forward slightly to align it with the fuselage."],
    groups: [
      {
        steps: [
          { left: "Max gross weight", right: <>Determine from Figure 4-17.</> },
          { left: "Vtoss / TDP height", right: <>Determine {b("Vtoss")} and TDP height from Figure 4-18 and set the bug on the airspeed indicator.</> },
          { left: "Hover", right: <>Hover at 10 ft wheel height and note the torque.</> },
          { left: "Wheels light", right: <>Descend to a wheels-light hover.</> },
          { left: "Vertical climb", right: <>Establish a vertical climb with power set approximately 20% above HIGE torque. Do not exceed maximum takeoff power; do not droop the rotor below 105%.</> },
          { left: "Rate of climb", right: <>Adjust collective to attain 850–1150 fpm rate of climb at the TDP.</> },
          { left: "After TDP", right: <>Rotate to a pitch attitude 5–10° below the horizon and accelerate toward {b("Vtoss")}.</> },
          { left: "Approaching Vtoss", right: <>Rotate to approximately 5° nose up and climb at {b("Vtoss")} or above.</> },
          { left: "After obstacles", right: <>Accelerate to {b("Vy")} and retract the landing gear.</> },
        ],
      },
    ],
    notes: [
      "Maximum TDP = maximum height for a successful rejected takeoff (vertical land-back). Minimum TDP = minimum height for a successful continued takeoff (fly-away) with 15 ft clearance from the takeoff surface. Near obstacles, the TDP should not be lower than the minimum TDP plus the obstacle height (for obstacles within takeoff distance of the helipad).",
      "Vy (best rate of climb speed) is 80 KIAS at sea level, decreasing 1 knot per 1000 ft of altitude above sea level.",
    ],
  },
  {
    slug: "cat-a-ground-level-helipad-approach-and-landing",
    title: "CATEGORY A GROUND LEVEL HELIPAD APPROACH AND LANDING",
    reference: "S-92 RFM Part 1, Section II — Normal Procedures",
    cautions: ["To prevent tail-to-ground contact, complete the flare before descending below 20 ft."],
    groups: [
      {
        steps: [
          { left: "Max landing weight", right: <>Determine from Figure 4-21.</> },
          { left: "LDP height", right: <>Determine from Figure 4-22.</> },
          { left: "Approach", right: <>Establish an approach to arrive at the LDP no slower than 35 KIAS, rate of descent no more than 500 fpm. In high headwinds, increase approach speed to keep at least 20 kt of ground speed.</> },
          { left: "Descent", right: <>Maintain airspeed at or above 35 KIAS and rate of descent at or below 500 fpm until the flare.</> },
          { left: "Flare", right: <>At approximately 50 ft, initiate a decelerating flare to position the aircraft over the landing spot with approximately zero ground speed at about 20 ft.</> },
          { left: "Landing", right: <>Descend vertically to a hover or landing.</> },
        ],
      },
    ],
    notes: [
      "Minimum LDP is the lowest height from which a balked landing can be performed with 25 ft clearance from the landing surface (15 ft clearance from a 10 ft obstacle). Where obstacles taller than 10 ft lie in the balked-landing path, the LDP must not be lower than the published minimum plus the excess obstacle height.",
      "When entering the flare, the pad may be blocked from view — identify cues outside the immediate landing area beforehand, and/or slightly yaw the aircraft to maintain cueing.",
    ],
  },
  {
    slug: "cat-b-takeoff",
    title: "CATEGORY B TAKEOFF",
    reference: "S-92 RFM Part 1, Section II — Normal Procedures",
    intro: <>Category B operations do not guarantee a safe continued takeoff or landing after an engine failure at every point in the profile — unlike Category A.</>,
    groups: [
      {
        steps: [
          { left: "Hover", right: <>Establish a 10 ft hover and note the stabilized hover torque required.</> },
          { left: "Collective", right: <>Increase collective to achieve 10% torque greater than hover.</> },
          { left: "Acceleration", right: <>Lower the nose as necessary to result in a 10–15 ft wheel height acceleration to 45 KIAS.</> },
          { left: "At 45 KIAS", right: <>Rotate nose up to attain a climbing acceleration to 70 KIAS.</> },
          { left: "After obstacles", right: <>Continue acceleration to {b("Vy")} and retract the landing gear.</> },
        ],
      },
    ],
    notes: ["Vy (best rate of climb speed) is 80 KIAS at sea level, decreasing 1 knot per 1000 ft of altitude above sea level."],
  },
  {
    slug: "cat-b-landing",
    title: "CATEGORY B LANDING",
    reference: "S-92 RFM Part 1, Section II — Normal Procedures",
    cautions: ["To prevent tail cone contact with the ground during landing and operations near the ground, avoid attitudes of greater than 10° nose-up."],
    groups: [
      {
        steps: [
          { left: "Approach", right: <>Establish an approach to arrive at the LDP — 200 ft above touchdown elevation, at 50 KIAS, rate of descent no more than 600 fpm.</> },
          { left: "Flare", right: <>At 50 ft and 50 KIAS, initiate a deceleration flare.</> },
          { left: "Touchdown", right: <>Continue approach and deceleration to a running touchdown, a spot landing, or a hover.</> },
        ],
      },
    ],
  },
  {
    slug: "elevated-helideck-vertical-takeoff",
    title: "ELEVATED HELIDECK VERTICAL TAKEOFF",
    subtitle: "Limited exposure profile",
    reference: "S-92 RFM Part 2, Section III — Supplemental Performance Data",
    intro: (
      <>
        Two elevated-helideck profiles exist: <b>Limited Exposure</b> (performance permits continued OEI flight except for an
        engine failure very early in the takeoff, which may require a forced landing) and <b>No Exposure</b> (continued OEI
        flight or landing is available at all times, at a more restrictive weight). This page covers the Limited Exposure profile.
      </>
    ),
    cautions: ["The nose wheel will not self-center after liftoff if it has swiveled about 180° just before liftoff. If retracted in this position, the nose wheel will jam in the up position. If swiveled more than 90°, taxi forward slightly to align it with the fuselage."],
    groups: [
      {
        steps: [
          { left: "Max takeoff weight", right: <>Determine from Figure 3-22.</> },
          { left: "Vtoss", right: <>Determine from Figure 3-25 and set on the airspeed gauge.</> },
          { left: "Delta torque", right: <>Determine the delta torque above HIGE torque from Figure 3-26.</> },
          { left: "TDP", right: <>Set 30 ft TDP on the Cat A radar altimeter.</> },
          { left: "Hover", right: <>Hover at 10 ft wheel height and note the HIGE torque.</> },
          { left: "Takeoff torque", right: <>Sum the delta torque and the HIGE torque from the previous two steps.</> },
          { left: "Wheels light", right: <>Descend to a wheels-light hover.</> },
          { left: "Vertical climb", right: <>Rapidly increase collective to achieve the calculated takeoff torque. Do not exceed maximum takeoff power.</> },
          { left: "At TDP (30 ft AGL)", right: <>Rotate the aircraft 10–20° nose down.</> },
          { left: "Approaching Vtoss", right: <>Rotate to approximately 5° nose up and climb at {b("Vtoss")}.</> },
          { left: "After obstacles", right: <>Accelerate to 80 KIAS and retract the landing gear.</> },
        ],
      },
    ],
  },
  {
    slug: "elevated-helideck-approach-and-landing",
    title: "ELEVATED HELIDECK APPROACH AND LANDING",
    reference: "S-92 RFM Part 2, Section III — Supplemental Performance Data",
    intro: <>Offset the approach path to the side of the deck whenever possible, to keep an unobstructed go-around path available in case of an engine failure.</>,
    groups: [
      {
        steps: [
          { left: "Max landing weight", right: <>Determine from Figure 3-22.</> },
          { left: "Vtoss", right: <>Determine from Figure 3-25 and set on the airspeed gauge.</> },
          { left: "Approach", right: <>Fly the approach at 40 KIAS with a descent rate no more than 600 fpm.</> },
          { left: "Flare", right: <>At 50 ft above the landing surface, flare to reduce airspeed and descent rate, maneuvering over the landing pad.</> },
        ],
      },
    ],
    notes: ["Landing Decision Point (LDP) is 200 ft above the surface of the ground/water below the helideck."],
  },
  {
    slug: "single-engine-failure-on-takeoff",
    title: "SINGLE ENGINE FAILURE ON TAKEOFF",
    subtitle: "Category A horizontal & ground level helipad vertical",
    reference: "S-92 RFM Part 1, Section III — Emergency Procedures",
    intro: <>The correct response depends on where in the takeoff sequence the failure occurs. Failure at or before the TDP means a rejected takeoff; after the TDP, the takeoff may be continued.</>,
    groups: [
      {
        heading: "Category A horizontal — prior to reaching TDP",
        steps: [
          { left: "Rotate", right: <>Rotate nose up to decrease forward speed and attain a landing attitude.</> },
          { left: "Nr", right: <>Maintain Nr with collective until required to cushion the landing.</> },
          { left: "Cushion", right: <>Apply collective to cushion ground contact.</> },
          { left: "After contact", right: <>Neutralize cyclic, reduce collective to minimum, apply brakes to stop within available distance.</> },
        ],
      },
      {
        heading: "Category A horizontal — after TDP",
        steps: [
          { left: "Pitch", right: <>Adjust pitch attitude to establish {b("Vtoss")}.</> },
          { left: "Nr", right: <>Adjust collective to maintain 100% Nr.</> },
          { left: "Gear", right: <>Retract landing gear once a positive rate of climb is established.</> },
          { left: "Power", right: <>When obstacles are cleared, select two-minute power, continue climb and accelerate to {b("Vy")}, then select maximum continuous power.</> },
          { left: "Land", right: <>Land as soon as practical.</> },
        ],
      },
      {
        heading: "Ground level helipad vertical — prior to or at TDP",
        steps: [
          { left: "Stop climb", right: <>Sharply decrease collective to stop the vertical climb.</> },
          { left: "Descend", right: <>Descend vertically to the helipad, maintaining 100–104% Nr.</> },
          { left: "Cushion", right: <>At about 20–30 ft above the ground, cushion the landing with collective, then use the brakes to remain on the landing surface.</> },
          { left: "After contact", right: <>Neutralize cyclic and simultaneously reduce collective to minimum.</> },
        ],
      },
      {
        heading: "Ground level helipad vertical — after TDP",
        steps: [
          { left: "Pitch", right: <>Decrease collective to maintain Nr above 95% while rotating the aircraft to 20° below the horizon.</> },
          { left: "Approaching Vtoss", right: <>Rotate to approximately 5° nose above the horizon.</> },
          { left: "Climb", right: <>Climb at {b("Vtoss")} or above at 100% Nr, retract landing gear once a positive rate of climb is established.</> },
          { left: "Power", right: <>When obstacles are cleared, select two-minute power, continue climb and accelerate to {b("Vy")}, then select continuous power when conditions permit.</> },
          { left: "Land", right: <>Land as soon as practical.</> },
        ],
      },
    ],
    warnings: ["Do not select two-minute power until obstacle clearance is assured."],
  },
  {
    slug: "single-engine-landing",
    title: "SINGLE ENGINE LANDING",
    subtitle: "Category A/B & ground level helipad",
    reference: "S-92 RFM Part 1, Section III — Emergency Procedures",
    groups: [
      {
        heading: "Category A or B",
        steps: [
          { left: "Power", right: <>Confirm 30-second power is armed.</> },
          { left: "Deceleration", right: <>Initiate deceleration passing 50 ft and 50 KIAS.</> },
          { left: "Cushion", right: <>Use collective to cushion touchdown.</> },
          { left: "After contact", right: <>Neutralize cyclic and simultaneously reduce collective to minimum.</> },
          { left: "Stop", right: <>Apply brakes as necessary to stop within the confines of the landing area.</> },
        ],
      },
      {
        heading: "Ground level helipad — after LDP",
        steps: [
          { left: "Approach", right: <>Maintain at least 35 KIAS and no more than 500 fpm rate of descent prior to the flare.</> },
          { left: "Flare", right: <>Initiate flare at 50 ft to slow the rate of descent and reduce ground speed to zero; complete the flare before descending below 20 ft.</> },
          { left: "Descent", right: <>Descend vertically in a landing attitude.</> },
          { left: "Cushion", right: <>Cushion the landing with collective, using brakes to remain on the landing surface.</> },
          { left: "After contact", right: <>Neutralize cyclic and simultaneously reduce collective to minimum.</> },
        ],
      },
    ],
  },
  {
    slug: "single-engine-failure-elevated-helideck",
    title: "SINGLE ENGINE FAILURE — ELEVATED HELIDECK",
    subtitle: "Takeoff and approach",
    reference: "S-92 RFM Part 2, Section III — Supplemental Performance Data",
    groups: [
      {
        heading: "Takeoff — forced landing (if Vtoss cannot be reached)",
        steps: [
          { left: "Attitude", right: <>Decrease collective to maintain Nr at 100% while rotating the aircraft to 20° nose down.</> },
          { left: "Accelerate", right: <>Accelerate until approaching 50 ft AGL.</> },
          { left: "Flare", right: <>Initiate a flare to slow airspeed and rate of descent, then cushion the landing with collective.</> },
          { left: "After touchdown", right: <>Neutralize cyclic, simultaneously reduce collective to minimum, apply brakes — or initiate ditching procedures for a water landing.</> },
        ],
      },
      {
        heading: "Takeoff — fly-away (continued takeoff)",
        steps: [
          { left: "Attitude", right: <>Decrease collective to maintain Nr at 100% while rotating to 20° nose down.</> },
          { left: "Arrest descent", right: <>Rotate to approximately 5° nose up approaching {b("Vtoss")} or 50 ft AGL, whichever comes first.</> },
          { left: "Climb", right: <>Accelerate to {b("Vtoss")} and climb, retract landing gear once a positive rate of climb is established.</> },
          { left: "Power", right: <>Select two-minute power once obstacle clearance is assured, continue climb and accelerate to 80 KIAS, then select maximum continuous OEI power.</> },
          { left: "Land", right: <>Land as soon as practical.</> },
        ],
      },
      {
        heading: "Approach — balked landing (go-around), prior to or at LDP",
        steps: [
          { left: "Power", right: <>Adjust collective to maintain 100% Nr (ensure 30-second power is activated).</> },
          { left: "Pitch", right: <>Adjust pitch attitude to maintain {b("Vtoss")}.</> },
          { left: "Gear", right: <>Retract landing gear once a positive rate of climb is established.</> },
          { left: "Power", right: <>When obstacles are cleared, select two-minute power, continue climb and accelerate to 80 KIAS.</> },
        ],
      },
    ],
    notes: [
      "LDP is 200 ft above the ground/water surface below the helideck. An engine failure above the LDP allows a go-around or continued landing; after the LDP, the approach must continue to touchdown.",
    ],
    warnings: ["Do not select two-minute power until obstacle clearance is assured."],
  },
  {
    slug: "dual-engine-failure-autorotation",
    title: "DUAL ENGINE FAILURE & AUTOROTATIVE LANDINGS",
    reference: "S-92 RFM Part 1, Section III — Emergency Procedures",
    warnings: ["Nr will decay rapidly to an unrecoverable state, with loss of aircraft control, unless autorotation is entered immediately after a dual engine failure."],
    intro: (
      <>
        Upon dual engine failure the nose swings left as torque reduces. Immediate collective reduction is required to keep Nr
        within safe limits — hold full-down collective until Nr recovers to the normal range, then modulate collective to
        maintain it. Use pedals to hold heading.
      </>
    ),
    groups: [
      {
        heading: "Hovering or on takeoff at 10 ft or less",
        steps: [
          { left: "Attitude", right: <>Hold the aircraft level.</> },
          { left: "Cushion", right: <>Increase collective as required to cushion the landing.</> },
          { left: "After contact", right: <>Lower collective to minimum, apply wheel brakes.</> },
        ],
      },
      {
        heading: "During takeoff and initial climb",
        steps: [
          { left: "Glide", right: <>Immediately decrease collective; if altitude permits, establish a glide between 80 and 100 KIAS.</> },
          { left: "Nr", right: <>Adjust collective pitch to maintain Nr at 105%.</> },
          { left: "Gear", right: <>Landing gear — DOWN.</> },
          { left: "Cabin", right: <>Alert cabin occupants.</> },
          { left: "Landing", right: <>Perform an autorotative landing.</> },
        ],
      },
      {
        heading: "During cruise",
        steps: [
          { left: "Collective", right: <>Reduce collective immediately, maintain Nr at 105%.</> },
          { left: "Glide", right: <>Establish autorotative glide between 80 and 100 KIAS.</> },
          { left: "Gear", right: <>Landing gear — DOWN.</> },
          { left: "Fuel", right: <>Fuel and engine throttles — OFF.</> },
          { left: "Cabin", right: <>Alert cabin occupants.</> },
          { left: "Restart", right: <>If time and altitude permit, try to restart one or both engines.</> },
        ],
      },
      {
        heading: "Autorotative landing",
        steps: [
          { left: "Glide", right: <>Establish an 80–100 KIAS autorotative glide (minimum recommended flare airspeed 85 KIAS); maintain Nr at 105%.</> },
          { left: "Gear", right: <>Landing gear — DOWN.</> },
          { left: "Flare", right: <>At 100 ft, flare to decrease airspeed, decrease sink rate and increase Nr.</> },
          { left: "Settle", right: <>As the flare loses effectiveness and the helicopter starts to settle, reduce the flare to a maximum 10° nose up.</> },
          { left: "Cushion", right: <>Just before ground contact, increase collective to cushion the landing.</> },
          { left: "After landing", right: <>Immediately decrease collective, neutralize cyclic, apply wheel brakes.</> },
        ],
      },
    ],
    notes: [
      "Practice touchdown autorotations are prohibited.",
      "Minimum rate of descent (2200–2400 fpm) is attained at 80 KIAS and 100–105% Nr. Maximum glide distance (0.6 NM per 1000 ft) is attained at 100 KIAS and 100–105% Nr.",
    ],
  },

  // ---------------------------------------------------------------------
  // NORMAL PROCEDURES
  // ---------------------------------------------------------------------
  {
    slug: "exterior-check",
    title: "EXTERIOR CHECK",
    subtitle: "Normal procedure",
    reference: "S-92 RFM Part 1, Section II — Exterior Check",
    intro: (
      <>
        Performed before the first flight of the day, or before the next flight after extended maintenance, beginning at the
        entrance door and proceeding clockwise around the helicopter.
      </>
    ),
    groups: [
      {
        heading: "Right Sponson",
        steps: [
          { left: "Tie-downs & ground wire", right: <>Aircraft/blade tie-downs and ground wire — removed.</> },
          { left: "Fuel & sample", right: <>Gravity fuel cap secure; right tank fuel sample clear and bright; environmental collector emptied as required.</> },
          { left: "Strut, brakes, tires", right: <>Strut — no leaks, minimum 2 in. chrome visible; blow-down bottle gauge in the green; brake wear-indicator pins and tire condition checked.</> },
          { left: "Doors & lights", right: <>Position light, aft emergency egress light, right emergency exit window handle and all windows — condition and security.</> },
          { left: "No. 2 engine", right: <>Inlet and exhaust duct — free of FOD.</> },
        ],
      },
      {
        heading: "Airframe Top Front & Main Rotor Head",
        steps: [
          { left: "Hydraulic reservoirs", right: <>Hand-fill pump, utility supply module and No. 1/No. 2 pump reservoir levels — green; filter buttons not popped.</> },
          { left: "Servos & controls", right: <>SAS/boost servos, trim actuators, flight controls and mixing unit — condition and security, no leaks.</> },
          { left: "Fairing", right: <>Sliding fairing and access door — closed and latched.</> },
          { left: "Main rotor head", right: <>Damper reservoirs, RIPS harnesses, elastomeric bearings, blades, swashplate and primary servos — condition, security, no leaks.</> },
        ],
      },
      {
        heading: "No. 2 Engine, Fire Bottle & APU Compartments",
        steps: [
          { left: "No. 2 engine", right: <>Inlet free of FOD, ice-rate probe secure, proper oil level, general condition/leaks checked, exhaust cowling secure.</> },
          { left: "Fire bottle", right: <>Compartment door open; fire bottle gauges show proper pressure; door secured.</> },
          { left: "APU & air conditioning", right: <>Compartment doors open; APU oil level and condition, no leaks; lines and air conditioner condition checked; doors secure.</> },
          { left: "Rotor brake & oil cooler", right: <>Compartment door open; no leaks; pucks, disc and clearance checked; door secure.</> },
        ],
      },
      {
        heading: "Main Gearbox & Tail Section",
        steps: [
          { left: "Main gearbox", right: <>Oil level checked, filter button not popped, No. 3 hydraulic pump secure with no leaks.</> },
          { left: "Tail rotor drive", right: <>Drive cowling, shaft and tunnel — condition, all fasteners secured.</> },
          { left: "Tail rotor hub & blades", right: <>Blades and tail rotor — no obvious damage; RIPS harnesses secure; upper anti-collision light condition and security.</> },
        ],
      },
      {
        heading: "No. 1 Engine & Tail Pylon",
        steps: [
          { left: "No. 1 engine", right: <>APU exhaust duct and inlet free of FOD; ice-rate probe secure; proper oil level; general condition/leaks; exhaust plug removed, free of FOD.</> },
          { left: "Tail pylon & stabilizer", right: <>Inspection panels secure; stabilizer and strut condition checked; float aft cover/bottles serviced; tail and intermediate gearbox oil levels checked, no leaks; ramp and cargo hatch condition and security.</> },
        ],
      },
      {
        heading: "Left Sponson & Aircraft Belly",
        steps: [
          { left: "Left sponson", right: <>Cabin windows and emergency exit handle secure; strut — no leaks, minimum 2 in. chrome; brakes and tires checked; left tank fuel sample clear and bright; fuel caps closed and secure; grounding cable removed.</> },
          { left: "Aircraft belly", right: <>Antennas — condition and security; no signs of fluid leakage.</> },
        ],
      },
      {
        heading: "Nose Section",
        steps: [
          { left: "Left forward fuselage", right: <>Avionics exhaust ports clear; pitot tubes clear of obstructions, covers removed, static ports clear.</> },
          { left: "Nose electronics compartment", right: <>Radome opened, avionics condition checked, washer reservoir fluid level checked, wipers condition and security, radome closed and secured.</> },
          { left: "Nose landing gear", right: <>Landing/search lights and OAT probe secure; strut — no leaks, minimum 2 in. chrome visible; blow-down bottle gauge in the green; tires checked.</> },
          { left: "Right forward fuselage", right: <>Pitot tube clear of obstructions, cover removed, static port clear; emergency egress light and entrance door — condition and security.</> },
        ],
      },
      {
        heading: "Cabin Interior",
        steps: [
          { left: "Safety equipment", right: <>Forward float bottles serviced; portable fire extinguisher and first aid kit — security and proper charge/seal.</> },
          { left: "Cabin", right: <>Windows and doors — condition and security; APU accumulator charge checked; heater registers clear; emergency egress handles secure.</> },
        ],
      },
    ],
    cautions: ["Do not walk on the tail pylon in windy, wet or icy conditions."],
  },
  {
    slug: "before-starting-and-starting-engines",
    title: "BEFORE STARTING ENGINES & ENGINE START",
    subtitle: "Normal procedure",
    reference: "S-92 RFM Part 1, Section II — Before Starting Engines, Cockpit Equipment Checks, Starting Engines",
    groups: [
      {
        heading: "Before starting engines",
        steps: [
          { left: "Seat & harness", right: <>Seat and pedals — adjust; shoulder harness locks — check; parking brake — set.</> },
          { left: "Egress handles", right: <>Pilot and copilot emergency egress handles — full forward and safetied.</> },
          { left: "Center console", right: <>REVERSION CONTROL panel — NORM; OEI TRAIN — OFF; LDG GEAR handle — DN; EMER DN — UP; backup attitude indicator — caged.</> },
          { left: "Side & overhead console", right: <>Compass — slaved; audio panels set; rotor brake — OFF; ECS CONT PANEL — OFF; FIRE DET/EXTG TEST — NORM; SERVO BST — ON, SERVO — BOTH; engine ignition — AUTO; fuel prime — AUTO.</> },
          { left: "Power sources", right: <>APU CTRL/GEN — OFF; battery — OFF; AC/DC external power — OFF; DC CONV BACKUP — NORM; DC CONV NO. 1 and NO. 2 — ON; AC GEN NO. 1 and NO. 2 — OFF.</> },
          { left: "Circuit breakers", right: <>IN.</> },
        ],
      },
      {
        heading: "Cockpit equipment checks",
        steps: [
          { left: "Battery & power", right: <>BATT — ON; AC EXT PWR — as required.</> },
          { left: "Fire detection test", right: <>Cycle INBD / NORM / OUTB / SMOKE, confirming FIRE/ARMED pushbutton illumination and aural alerts at each position, then return to NORM.</> },
          { left: "APU start", right: <>AIR SRCE HEAT/START — ENG; wait at least 15 seconds for the APU GCU preflight test; APU CTRL — ON; APU GEN — ON.</> },
          { left: "Avionics", right: <>CMFDs, RTUs and FMS — ON and set; compass — slaved and set; flotation system test once daily if over-water flight is planned.</> },
          { left: "Flight controls", right: <>Hydraulic GND PUMP — ON; with SERVO on NO. 1 then NO. 2, move cyclic, collective and pedals through full range checking for freedom of movement and no binding; repeat with SERVO BST OFF to confirm full range with increased force; SERVO BST — ON, SERVO — BOTH.</> },
          { left: "AFCS check", right: <>Center all flight controls; SAS 1 &amp; 2 and AP 1 &amp; 2 — ON; rotor brake — ON; disengage then re-engage YAW/CYCLIC/COLL TRIM; run the Preflight Built-In Test via AFCS MODE SEL — TEST; AP PWR RESET — press AP 1 and AP 2 buttons.</> },
          { left: "Hydraulic leak test", right: <>Rotor brake — ON; select LDI on the HEALTH &amp; STATUS page; confirm LDI PASS.</> },
          { left: "Trim & MGB pressure", right: <>GND PUMP — OFF; YAW/CYCLIC/COLL TRIM — ON; SAS 1 &amp; 2 — ON/PRI; AP 1 &amp; 2 — ON/ATT; backup attitude indicator — TEST then ARM; on EICAS SHOW OBE, confirm a functioning MGB oil pressure gauge (no red dashes) and that the MGB OIL PRES warning illuminates, then HIDE OBE.</> },
        ],
      },
      {
        heading: "Starting engines",
        steps: [
          { left: "Setup", right: <>NO. 1 and NO. 2 FUEL — as required; ENG IGN NO. 1 and NO. 2 — AUTO; rotor brake — as required; fire guard posted if available; rotor blades — clear.</> },
          { left: "No. 1 engine", right: <>Throttle — STOP; NO. 1 ENG START button — press; throttle — IDLE when TGT is below 150°C.</> },
          { left: "No. 2 engine", right: <>Throttle — STOP; NO. 2 ENG START button — press; throttle — IDLE when TGT is below 150°C.</> },
        ],
      },
    ],
    notes: [
      "Both engines may be started simultaneously when OAT is below 25°C at sea level, decreasing the allowable OAT by 2°C per 1000 ft of altitude.",
      "Do not take off if red dashes are shown in place of an MGB pressure indication, or if the MGB OIL PRES warning does not illuminate during the static check.",
    ],
    cautions: [
      "Avoid prolonged periods with Nr between 36–49% and 56–67%.",
      "Restarting a hot engine that was not properly cooled for 2 minutes may cause a bowed compressor rotor and rubs of airfoils and seals — the damage is cumulative and may result in future hot starts.",
    ],
  },
  {
    slug: "rotor-engagement-and-before-takeoff",
    title: "ROTOR ENGAGEMENT, RUNUP & BEFORE TAKEOFF",
    subtitle: "Normal procedure",
    reference: "S-92 RFM Part 1, Section II — Rotor Engagement/Runup, Before Taxi/Taxi, Before Takeoff",
    groups: [
      {
        heading: "Rotor engagement and engine runup",
        steps: [
          { left: "Controls & brake", right: <>Flight controls — hold; release rotor brake if set.</> },
          { left: "Hydraulic pressure", right: <>Confirm system 1 and 2 pressure green by 40% Nr; throttles — adjust Nr to 54%.</> },
          { left: "MGB oil bypass", right: <>MGB OIL BYP — TEST, confirm MGB BYP caution illuminates, then NORM (caution extinguishes).</> },
          { left: "Fly", right: <>Confirm engine and MGB oil pressure green; throttles — FLY; droop stops check out by 70% Nr.</> },
          { left: "Generators", right: <>AC GEN NO. 2 — ON, then (after about 1 second) AC GEN NO. 1 — ON; AC and DC external power — OFF, cable removed.</> },
          { left: "After start", right: <>APU CTRL — OFF; GND PUMP — OFF; AIR SRCE HEAT/START — ENG; VIB CTRL — ON; NO. 1 and NO. 2 FUEL — DIRECT.</> },
        ],
      },
      {
        heading: "Before taxi and taxi checks",
        steps: [
          { left: "Lights & seatbelts", right: <>EMERG LTS — ARM; INT and EXT lights — as required; seat belts — ON.</> },
          { left: "Chocks & doors", right: <>Chocks — removed; doors, ramp and hatch — secured.</> },
          { left: "Brakes", right: <>Parking brake — released; wheel brakes — checked.</> },
        ],
      },
      {
        heading: "Before takeoff",
        steps: [
          { left: "Anti-ice", right: <>Engine and windshield anti-ice — as required.</> },
          { left: "Weight & lights", right: <>Aircraft gross weight page — adjusted for current load; INT and EXT lights — as required.</> },
          { left: "Fly", right: <>Throttles — FLY; backup attitude indicator — uncage.</> },
          { left: "Systems check", right: <>Nr — 105%; all EICAS parameters — green; no cautions or warnings; advisories noted; AFCS — all buttons green.</> },
          { left: "Final checks", right: <>Wheel brakes — as required; crew and passengers — alerted; weather radar — as required.</> },
        ],
      },
    ],
    cautions: [
      "Engine anti-ice operation is limited to 60 seconds on the ground, except when OAT is below 5°C with visible moisture present.",
      "The weather radar has a weight-on-wheels override that forces standby on the ground — unless STBY or OFF is selected, it will radiate once the helicopter lifts to a hover. If an active mode is selected, keep everyone at least 100 ft clear of the forward 270° arc before takeoff.",
    ],
  },
  {
    slug: "after-takeoff-and-landing-checks",
    title: "AFTER TAKEOFF, BEFORE LANDING & AFTER LANDING",
    subtitle: "Normal procedure",
    reference: "S-92 RFM Part 1, Section II — After Takeoff, Before Landing, After Landing",
    groups: [
      {
        heading: "After takeoff",
        steps: [
          { left: "Landing gear", right: <>As required.</> },
          { left: "Power assurance", right: <>Check, if not already performed on the ground (accomplished once each day).</> },
        ],
      },
      {
        heading: "Before landing",
        steps: [
          { left: "Landing gear", right: <>DN.</> },
          { left: "Parking brake", right: <>As required.</> },
          { left: "Crew & radar", right: <>Crew and passengers — alerted; weather radar — as required.</> },
        ],
      },
      {
        heading: "After landing",
        steps: [
          { left: "Lights & anti-ice", right: <>INT and EXT lights — as required; engine and windshield anti-ice — OFF.</> },
          { left: "Pitot heat & radar", right: <>PITOT HT switches — OFF; weather radar — OFF.</> },
        ],
      },
    ],
    cautions: [
      "If the approach, landing or subsequent hover will place any person within 100 ft of the forward 270° arc of the aircraft, place the weather radar in OFF or STBY.",
    ],
  },
  {
    slug: "shutdown",
    title: "SHUTDOWN",
    subtitle: "Normal procedure",
    reference: "S-92 RFM Part 1, Section II — Shutdown",
    groups: [
      {
        heading: "",
        steps: [
          { left: "Park & chock", right: <>Parking brake — set; landing gear — chocked.</> },
          { left: "APU start", right: <>APU CTRL — ON; APU GEN — ON; AC EXT PWR — as required; VIB CTRL — OFF.</> },
          { left: "Power transfer", right: <>DC CONV NO. 1 or 2 — OFF; AC GEN NO. 1 — OFF, then AC GEN NO. 2 — OFF; both DC CONV — ON.</> },
          { left: "Cooldown", right: <>Throttles — IDLE; run at idle for at least 2 minutes (or below 90% Ng for at least 2 minutes, including 60 seconds at idle) before shutdown.</> },
          { left: "Fire detection test", right: <>Once per day, cycle INBD / NORM / OUTB, confirming FIRE/ARMED pushbutton illumination and aural alerts at each position, then NORM.</> },
          { left: "Droop stops & stop", right: <>Verify droop stops in by 50% Nr; throttles — STOP after the required cooldown.</> },
          { left: "Fuel & rotor brake", right: <>NO. 1 and NO. 2 FUEL — OFF; rotor brake — apply below 40% Nr (150–200 psi).</> },
          { left: "Systems off", right: <>ENVIRO CTRL, EMERG LTS, INT/EXT lights, FMS — OFF; backup attitude indicator — caged, BU ATT IND PWR — OFF; APU GEN — OFF, APU CTRL — OFF; AC EXT PWR — OFF; BATT — OFF.</> },
        ],
      },
    ],
    notes: [
      "If an engine was not cooled for 2 minutes prior to shutdown (emergency shutdown), motor it for 1 minute until TGT is below 150°C, restart within 5 minutes, and run 2 minutes at idle before shutting down or continuing operations. If it was not properly cooled and not restarted within 5 minutes, do not restart it for 4 hours.",
    ],
    cautions: ["Guard flight controls against unwanted movement while setting the parking brake."],
  },

  // ---------------------------------------------------------------------
  // FIRE / ELECTRICAL / HYDRAULIC EMERGENCY PROCEDURES
  // ---------------------------------------------------------------------
  {
    slug: "emergency-engine-shutdown",
    title: "EMERGENCY ENGINE SHUTDOWN",
    subtitle: "Emergency procedure",
    reference: "S-92 RFM Part 1, Section III — 1.1 Emergency Engine Shutdown",
    intro: <>Used for an engine malfunction on the ground, or in flight for certain engine malfunctions requiring immediate shutdown.</>,
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>Throttle (affected engine) — STOP.</> },
          { left: "2", right: <>FUEL (affected engine) — OFF.</> },
          { left: "3", right: <>If TGT remains above 540°C, or there is other evidence of combustion after shutdown — ENG START button — press to engage the starter with the throttle in STOP.</> },
          { left: "4", right: <>When TGT is below 150°C — ENG START button — press again to turn the starter off.</> },
        ],
      },
    ],
  },
  {
    slug: "engine-and-apu-fire",
    title: "ENGINE & APU FIRE",
    subtitle: "Emergency procedure",
    reference: "S-92 RFM Part 1, Section III — 13.1–13.3 Engine Fires, Post Shutdown Fire, APU Fire",
    intro: (
      <>
        Symptom: FIRE — the affected engine or APU FIRE/ARMED pushbutton illuminates with the corresponding aural alert.
        Pressing the FIRE/ARMED pushbutton and deploying the MAIN extinguisher should put out most fires; select RESERVE if
        the FIRE warning remains on for several seconds after the first bottle is deployed.
      </>
    ),
    groups: [
      {
        heading: "Engine fire — on the ground",
        steps: [
          { left: "1", right: <>Throttle (affected engine) — STOP.</> },
          { left: "2", right: <>FIRE/ARMED pushbutton (affected engine) — push in.</> },
          { left: "3", right: <>FIRE EXTG — MAIN, then RESERVE as required.</> },
          { left: "If not extinguished", right: <>Both throttles — OFF; rotor brake — apply; BATT and APU CTRL — OFF; evacuate the aircraft.</> },
        ],
      },
      {
        heading: "Engine fire — in flight",
        steps: [
          { left: "1", right: <>Confirm fire; collective — adjust to single-engine power.</> },
          { left: "2", right: <>Throttle (affected engine) — STOP; FIRE/ARMED pushbutton — push in; FIRE EXTG — MAIN/RESERVE as required.</> },
          { left: "3", right: <>Accomplish SINGLE ENGINE FAILURE procedure; land as soon as possible.</> },
          { left: "If not extinguished", right: <>Land immediately.</> },
        ],
      },
      {
        heading: "Post-shutdown fire",
        steps: [
          { left: "Symptom", right: <>Smoke/flames, or post-shutdown TGT of 540°C or higher.</> },
          { left: "1", right: <>Throttle — STOP; ENG START button — press to motor the engine.</> },
          { left: "If smoke/flames persist", right: <>Continue motoring the engine; fire guard (if available) discharges an extinguisher into the engine compartment.</> },
        ],
      },
      {
        heading: "APU fire",
        steps: [
          { left: "1", right: <>Confirm fire; APU CTRL — OFF.</> },
          { left: "2", right: <>APU FIRE pushbutton — push; FIRE EXTG — MAIN/RESERVE as required.</> },
          { left: "3", right: <>Land as soon as possible.</> },
          { left: "If not extinguished", right: <>Land immediately.</> },
        ],
      },
    ],
    notes: ["A momentary FIRE warning and APU FIRE pushbutton illumination can occur when starting the APU in some flight regimes."],
  },
  {
    slug: "cabin-cockpit-fire-and-smoke",
    title: "CABIN / COCKPIT FIRE & SMOKE",
    subtitle: "Emergency procedure",
    reference: "S-92 RFM Part 1, Section III — 13.4–13.6 Cabin/Cockpit Fire, Baggage Smoke, Smoke and Fumes",
    groups: [
      {
        heading: "Cabin or cockpit fire",
        steps: [
          { left: "1", right: <>Begin descent.</> },
          { left: "2", right: <>ECS CONT PANEL: CABIN and COCKPIT — VENT.</> },
          { left: "3", right: <>Fight fire with the portable fire extinguisher; land as soon as possible.</> },
          { left: "If fire persists", right: <>Land immediately.</> },
        ],
      },
      {
        heading: "Baggage compartment smoke detected",
        steps: [
          { left: "1", right: <>ECS CONT PANEL: CABIN and COCKPIT — VENT.</> },
          { left: "2", right: <>Land as soon as possible.</> },
          { left: "3", right: <>Inspect the baggage compartment and fight the fire if required.</> },
        ],
      },
      {
        heading: "Smoke and fumes in the cockpit",
        steps: [
          { left: "1", right: <>Pilot/copilot side window — open.</> },
          { left: "2", right: <>ECS CONT PANEL: CABIN and COCKPIT — VENT.</> },
          { left: "3", right: <>Land as soon as possible.</> },
        ],
      },
    ],
    notes: [
      "If smoke from a baggage compartment fire is observed in the cabin, decreasing airspeed below 140 KIAS may slow or stop the intrusion — weigh this against the need for speed to reach the nearest safe landing zone.",
    ],
  },
  {
    slug: "electrical-fire-in-flight",
    title: "ELECTRICAL FIRE IN FLIGHT",
    subtitle: "Emergency procedure",
    reference: "S-92 RFM Part 1, Section III — 13.7 Electrical Fire In Flight",
    intro: <>Symptom: smell of burning insulation, acrid smoke.</>,
    cautions: ["Before shutting off electrical power, consider what equipment is essential for continued safe flight."],
    groups: [
      {
        heading: "",
        steps: [
          { left: "1", right: <>Attain VFR conditions while continuing with the following steps.</> },
          { left: "2", right: <>Turn off all non-essential electrical systems.</> },
          { left: "3", right: <>Land as soon as possible.</> },
          { left: "If fire persists", right: <>DC CONV NO. 1 and NO. 2 — OFF.</> },
          { left: "If fire persists", right: <>AC GEN NO. 1 and NO. 2, APU GEN — OFF.</> },
          { left: "If fire persists", right: <>BATT — OFF.</> },
        ],
      },
    ],
  },
  {
    slug: "electrical-system-malfunctions",
    title: "ELECTRICAL SYSTEM MALFUNCTIONS",
    subtitle: "Dual AC generator / DC converter failure, battery hot",
    reference: "S-92 RFM Part 1, Section III — 8.2, 8.5–8.6, 8.8 Electrical System Malfunctions",
    groups: [
      {
        heading: "Dual AC generator failure",
        steps: [
          { left: "Confirm", right: <>Loss of all electrical systems except those powered by the battery buses, including loss of the copilot&apos;s displays.</> },
          { left: "1", right: <>APU CTRL — ON; APU GEN — ON.</> },
          { left: "2", right: <>AC GEN NO. 1 and NO. 2 — RESET/OFF then ON.</> },
          { left: "If generators recover", right: <>Continue the flight.</> },
          { left: "If not", right: <>AC GEN NO. 1 and NO. 2 — RESET/OFF; PLT WDSHLD ANTI-ICE — as required; land as soon as practical.</> },
          { left: "If APU FAULT/GEN FAIL/GCU FAIL follows", right: <>LDG GEAR — DN; land as soon as possible.</> },
        ],
      },
      {
        heading: "Dual DC converter failure",
        steps: [
          { left: "Confirm", right: <>Loss of all DC primary buses, including loss of the copilot&apos;s displays.</> },
          { left: "1", right: <>Confirm DC CONV BACKUP — NORM.</> },
          { left: "2", right: <>DC CONV NO. 1 and NO. 2 — RESET/OFF then ON.</> },
          { left: "If recovered", right: <>Continue the flight.</> },
          { left: "If not", right: <>Land as soon as practical.</> },
          { left: "If BACKUP CONV also fails", right: <>LDG GEAR — DN before battery power is depleted; land as soon as possible.</> },
        ],
      },
      {
        heading: "Battery hot",
        steps: [
          { left: "1", right: <>Land as soon as practical.</> },
        ],
      },
    ],
    notes: [
      "With the loss of both main DC converters, the battery will not recharge — the BATTERY UTILITY and BATTERY HOLD UP buses will be powered by the battery alone.",
      "BATT CHARGE FAIL will accompany BATT HOT; sufficient battery power may not remain for a subsequent APU start.",
    ],
    cautions: [
      "Normal and emergency landing gear extension is not possible without electrical power — when operating on battery power only, lower the gear before it is depleted.",
    ],
  },
  {
    slug: "hydraulic-system-malfunctions",
    title: "HYDRAULIC SYSTEM MALFUNCTIONS",
    subtitle: "Dual pump failure, No. 3 pump failure, tail rotor system leak",
    reference: "S-92 RFM Part 1, Section III — 9.1, 9.3, 9.6 Hydraulic System Malfunctions",
    groups: [
      {
        heading: "Dual hydraulic pump failure (HYD 1 & HYD 2 PUMP FAIL)",
        steps: [
          { left: "Confirm", right: <>No. 1 and No. 2 hydraulic pressure gauges below normal.</> },
          { left: "1", right: <>Restrict control inputs to moderate rates.</> },
          { left: "2", right: <>Monitor the No. 3 hydraulic system.</> },
          { left: "3", right: <>Land as soon as possible.</> },
        ],
      },
      {
        heading: "No. 3 hydraulic pump failure (HYD 3 PUMP FAIL)",
        steps: [
          { left: "Confirm", right: <>No. 3 hydraulic pressure below 500 psi in depress mode, or below 2000 psi in high mode.</> },
          { left: "1", right: <>Land as soon as practical.</> },
          { left: "2", right: <>LDG GEAR — DN.</> },
          { left: "3", right: <>EMER DN — activate, below 90 KIAS.</> },
        ],
      },
      {
        heading: "Hydraulic system leak prior to the tail rotor shutoff",
        steps: [
          { left: "Confirm", right: <>Decreasing pressure on the appropriate gauge, with a HYD RSVR LOW, MR/TR SVO PRES, HYD PUMP FAIL, SAS PRES or BOOST PRES caution illuminated.</> },
          { left: "1", right: <>Do not exceed 30° angle of bank.</> },
          { left: "2", right: <>Do not exceed 120 KIAS.</> },
          { left: "3", right: <>Avoid abrupt maneuvering.</> },
          { left: "4", right: <>Land as soon as possible.</> },
        ],
      },
    ],
    notes: [
      "With No. 3 hydraulics inoperative the primary systems have no backup, the ramp is inoperative and normal landing gear operation is not possible — use the emergency blow-down system.",
      "A No. 2 hydraulic system leak prior to the tail rotor servo also disables the boost system, increasing flight control forces.",
    ],
    cautions: ["Once the landing gear is blown down, do not raise it until maintenance has inspected and bled the landing gear hydraulic lines."],
  },
];

export function findS92Procedure(slug: string): ProcedureDefinition | undefined {
  return S92_PROCEDURES.find((p) => p.slug === slug);
}
