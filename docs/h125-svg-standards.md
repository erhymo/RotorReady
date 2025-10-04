# H125 / AS350 SVG – Standard and Checklist

This checklist keeps procedure-card SVGs consistent across web and mobile (including dark mode).

Reference file: public/training/lights/pages/h125-door.svg

Goals
- Always render on a white “paper” card
- Preserve semantic colors (red, orange, green) as authored
- No runtime dark-mode switching inside the SVG files

Checklist (apply to each SVG)
- Background
  - Add a white background rectangle at the very top of the SVG
    - <rect width="100%" height="100%" fill="white"/>
- Do NOT include any @media (prefers-color-scheme: dark) blocks
  - Remove any such CSS so colors don’t change based on OS theme
- Frame and layout
  - Outer frame uses black stroke
  - Left label panel: black rectangle with yellow text (same proportions as h125-door.svg)
- Text colors (keep semantic intent)
  - Body/steps text: black (e.g., #111)
  - WARNING emphasis: red
  - “LAND AS SOON AS …” emphasis: orange
  - “CONTINUE FLIGHT” emphasis: green
- Fonts
  - System sans/Arial/Helvetica are fine; match sizes/weights with h125-door.svg where practical
- ViewBox
  - Differences are allowed; aim for similar proportions so cards scale consistently
- No external dependencies
  - Avoid external fonts/URLs that may fail offline

Quick test
- Open on desktop in both light and dark modes → card should stay white, text readable
- Open on iOS/Android with system dark mode enabled → still identical to desktop
- Compare with h125-door.svg visually for spacing, label panel, and emphasis colors

Notes
- If a source SVG has the wrong semantic color (e.g., orange text where it should be red), correct it to match the conventions above.
- Keep the SVGs simple: embedded CSS is OK for layout, but avoid theme logic.

