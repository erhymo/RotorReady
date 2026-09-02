// Simplified side-profile illustration of the AW169 — not a technical drawing,
// just enough shape/detail (windows, engine intakes, tail rotor, retractable
// gear) to serve as a base for the exterior hotspot map. Shared by both AW169
// and AW169 EP since the airframe is identical.
export default function AW169Silhouette() {
  return (
    <g>
      <rect width="900" height="360" fill="none" />
      <line x1="30" y1="300" x2="870" y2="300" stroke="#c7cdd6" strokeWidth={2} />

      {/* exhaust stubs */}
      <path d="M 448 120 L 470 116 L 472 128 L 450 132 Z" fill="#1e293b" />

      {/* tail boom */}
      <path
        d="M 460 178 C 600 173, 710 178, 775 189 C 796 193, 796 206, 775 209 C 710 218, 600 216, 460 208 Z"
        fill="#334155"
      />

      {/* horizontal stabilizer */}
      <path d="M 705 189 L 780 165 L 790 173 L 730 197 Z" fill="#334155" />

      {/* vertical fin */}
      <path
        d="M 752 128 C 786 133, 803 152, 806 192 C 807 206, 797 215, 779 211 L 770 148 Z"
        fill="#334155"
      />

      {/* tail rotor gearbox + blades */}
      <circle cx="797" cy="150" r="8" fill="#1e293b" />
      <path d="M 797 150 L 797 104 M 797 150 L 797 195" stroke="#1e293b" strokeWidth={6} strokeLinecap="round" />

      {/* main cabin body */}
      <path
        d="M 118 218
           C 108 172, 132 128, 195 112
           C 250 99, 340 95, 420 100
           C 458 103, 470 118, 466 138
           L 462 203
           C 420 226, 300 233, 205 229
           C 165 226, 128 224, 118 218 Z"
        fill="#1e293b"
      />

      {/* nose */}
      <path
        d="M 195 112 C 150 108, 100 118, 72 148 C 55 167, 58 192, 82 208 C 95 216, 108 219, 118 218
           L 118 165 C 128 138, 158 120, 195 112 Z"
        fill="#1e293b"
      />
      <path d="M 72 148 C 90 140, 118 133, 150 128" stroke="#0f172a" strokeWidth={2} fill="none" opacity={0.5} />

      {/* cockpit window */}
      <path d="M 88 158 L 128 150 L 130 182 L 96 190 Z" fill="#9fd8f2" />

      {/* cabin window strip */}
      <path d="M 150 148 L 448 132 L 446 172 L 152 184 Z" fill="#9fd8f2" opacity={0.92} />
      <line x1="212" y1="140" x2="211" y2="180" stroke="#1e293b" strokeWidth={3} />
      <line x1="278" y1="137" x2="276" y2="177" stroke="#1e293b" strokeWidth={3} />
      <line x1="345" y1="135" x2="342" y2="174" stroke="#1e293b" strokeWidth={3} />
      <line x1="405" y1="133" x2="402" y2="172" stroke="#1e293b" strokeWidth={3} />

      {/* engine cowling */}
      <path
        d="M 280 100 C 282 82, 310 68, 355 66 C 400 64, 432 76, 434 96
           L 434 104 C 434 108, 430 110, 424 110 L 290 110 C 284 110, 280 106, 280 100 Z"
        fill="#475569"
      />
      <line x1="305" y1="80" x2="305" y2="102" stroke="#334155" strokeWidth={3} />
      <line x1="325" y1="76" x2="325" y2="102" stroke="#334155" strokeWidth={3} />
      <line x1="345" y1="74" x2="345" y2="102" stroke="#334155" strokeWidth={3} />
      <line x1="365" y1="74" x2="365" y2="102" stroke="#334155" strokeWidth={3} />
      <line x1="385" y1="76" x2="385" y2="102" stroke="#334155" strokeWidth={3} />
      <line x1="405" y1="82" x2="405" y2="103" stroke="#334155" strokeWidth={3} />

      {/* rotor mast + head */}
      <line x1="357" y1="66" x2="357" y2="36" stroke="#1e293b" strokeWidth={8} />
      <circle cx="357" cy="34" r="7" fill="#0f172a" />
      <path d="M 357 34 L 640 20 L 640 26 L 357 40 Z" fill="#0f172a" />
      <path d="M 357 34 L 100 46 L 100 40 L 357 28 Z" fill="#0f172a" />

      {/* sponson */}
      <path
        d="M 178 210 C 178 224, 200 231, 260 231 C 320 231, 358 225, 372 214
           L 372 224 C 358 234, 320 240, 260 240 C 200 240, 178 233, 178 220 Z"
        fill="#475569"
      />

      {/* landing gear */}
      <line x1="112" y1="215" x2="108" y2="266" stroke="#1e293b" strokeWidth={6} />
      <ellipse cx="105" cy="280" rx="19" ry="17" fill="#1e293b" />
      <line x1="238" y1="230" x2="232" y2="270" stroke="#1e293b" strokeWidth={7} />
      <ellipse cx="228" cy="284" rx="23" ry="19" fill="#1e293b" />
      <line x1="322" y1="228" x2="330" y2="270" stroke="#1e293b" strokeWidth={7} />
      <ellipse cx="334" cy="284" rx="23" ry="19" fill="#1e293b" />
    </g>
  );
}
