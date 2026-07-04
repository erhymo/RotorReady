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
];

export function findS92Procedure(slug: string): ProcedureDefinition | undefined {
  return S92_PROCEDURES.find((p) => p.slug === slug);
}
