# Verification report: AW169_EP / system-notes
Sources: RFM EP Issue 1 Rev 5; QRH EP Issue 1 Rev 3. Generated 2026-09-21 10:48. Status counts: {'ok': 216, 'reviewed-ok': 10, 'flag': 1}

## FLAG: ditching/0/p2
*System note 'Ditching Configurations', section 'What the system is', paragraph*

> There are three alternate liferaft installations. Carry-On (stowed on a seat, deployed manually through a Type IV emergency exit, reduces passenger capacity from 8 to 7). Sponson (a liferaft mounted on each sponson, no seating impact, with an external activation handle accessible from outside the aircraft for a water-side deployment). And the emergency liferaft system that is part of the emergency flotation system kit with integrated 12-pax liferaft: one liferaft packed inside each aft flotation assembly, inflated from two bottles in the tail cone, with activation handles for both pilots.

- **gemini-3.7-flash**: partially_supported
  - `Carry-On (stowed on a seat, deployed manually through a Type IV emergency exit, reduces passenger capacity from 8 to 7)` -> The manual states the carry-on liferaft stowage is a free-standing installation mounted to seat rails, not stowed on a seat. Additionally, specific mention of a 'Type IV emergency exit' and reducing passenger capacity from 8 to 7 are not found on the provided pages. (page 7-669: "The carry on liferaft stowage is a self-contained free standing installation which is installed to seat rails supplied as part of the passenger seat kit.")
- **gemini-3.5-flash**: partially_supported
  - `with an external activation handle accessible from outside the aircraft for a water-side deployment` -> The manual does not mention 'water-side deployment' or that the handle is specifically for water-side deployment. (page 7-671: "The secondary activation handle is mounted on the leading edge of each sponson mounted liferaft container under an orange/red flap marked LIFERAFT HANDLE – PULL TO INFLATE.")
  - `Sponson (a liferaft mounted on each sponson, no seating impact...)` -> The claim attributes 'no seating impact' to the Sponson installation, but the manual only states this ('no negative impact upon possible passenger seating arrangements') for the Kit Integrated Liferaft Stowage Location. (page S11C-5: "This configuration has no negative impact upon possible passenger seating arrangements.")
- candidate pages: QRH:12, QRH:303, QRH:305, QRH:47, RFM:1435, RFM:1467, RFM:1499, RFM:3393, RFM:3394, RFM:3395, RFM:3396
