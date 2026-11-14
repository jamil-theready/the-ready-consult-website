# Embedded Calendly intake — focused release checks, 2026-11-14

Jamil approved focused form/booking checks and publication. All six existing input screens remain.

## Behavior

- Opening choice appears before the questions: “Want more information on how we can help?” / “I’m ready. Sign me up.”
- Both routes complete the same six screens. The chosen next step is included in the existing receiver message/CRM intake-details contract.
- The call route opens Calendly within the rounded intake panel only after exact accepted intake receipt. The subscription route shows the existing checkout option, without repeating the choice or loading Calendly.
- Full name and email are prefilled. The existing optional Calendly meeting-preparation field receives business name, services, areas, website status/address, domain ownership/address, Google Business status, contact preference and the chosen WhatsApp number (omitted for Email).
- The accepted submission UUID remains in utm_content for the existing signed booking webhook. Browser messages update presentation only; they do not write CRM booking state or send confirmations.
- A prefilled external booking link remains available if the embed cannot load. Back retains answers. Provider listeners/iframes are disposed on view exit/unmount.

## Verification

- Production build passed, 26 static routes. 8 Vitest files / 74 tests passed with the installed receiver validator configured.
- Checked the real public Calendly form without booking: full name, email and exactly one optional preparation textarea (10,000-character limit). The saved API token returned403 for event settings, so no event settings were changed; mapping was verified in the actual public UI.
- Fixed a real SDK URL/prefill conflict: the current official widget sends custom answers via postMessage; legacy URL name/email copies could override prefilled spaces. Those URL copies are removed from the embed configuration, while the external fallback keeps URL prefill.
- Built-site full-flow checks passed at1440x900 and375x667. Six-screen required/invalid validation, backward navigation, retained values, country-code normalization and identical heading/body/action coordinates passed.
- Intercepted failure then accepted retry kept the same submission identity and loaded the embedded calendar only after acceptance. No real intake request was made.
- Inspected Calendly’s actual iframe input values after selecting a date/time: name, email and every synthetic business answer appeared correctly. Stopped before Schedule Event; no meeting/invitation was created.
- Ready-to-subscribe / Email route reached the existing checkout link with all questions preserved and no phone requirement. No calendar script or iframe loaded on that route; no payment attempted.
- Simulated a failed Calendly script load: helpful status, complete prefilled fallback and Back/data retention passed.
- Unit coverage includes expected prefill, hidden-answer omission, accepted-reference/host validation, existing-link encoding conflict, trusted-origin + exact-iframe-source message validation and cleanup.

Existing Stripe link, payment automation, Calendly event settings, customer templates and backend workflows remain unchanged. Actual booking-to-CRM/provider confirmation delivery still requires Jamil’s own practice booking.
