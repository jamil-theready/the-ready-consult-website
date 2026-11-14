# Focused intake refinement verification — 2026-11-14

Jamil approved focused browser/form checks and publication for this release.
This is not a new full TRC Gate run.

## Change

- Split stage 03 into website, website-domain and Google Maps questions while retaining 03 / 04 progress.
- Increase question/field-label text and clarify website-domain ownership with a small example.
- Correct inherited white background on the final call/subscription choice screen.
- Self-host intl-tel-input 29.5.11 with searchable country/calling-code selection; normalize WhatsApp numbers to E.164 before the existing intake transport.
- Preserve a manual full-international-number fallback if the lazy phone library cannot load.

## Evidence

- Production static export completed with `npm run build -- --webpack` after the final controller patch; 26 routes generated.
- Vitest: 7 files / 64 tests passed with the configured receiver module.
- Controller syntax and `git diff --check` passed.
- Built-site browser checks at 375×667 and 1440×900 passed: required/invalid inputs blocked, conditional domain/Maps inputs, domain reuse, all three subquestions, backward navigation and retained values.
- Heading, body and action-button coordinates matched across all six visible input screens at each tested size.
- Expanded stage 03 follow-ups fit without inner scrolling at 375×667.
- US, Spain and Morocco national-number examples normalized to the expected international format. Country search was checked by country name and calling code; Escape closed the picker without closing the intake.
- Intercepted local failure/accepted-retry simulations preserved the submission ID, locked controls during send, and showed the next choices only after exact accepted receipt.
- Final choice card computed background is transparent over the dark panel, with readable light heading text.
- Email preference check passed without requiring a WhatsApp number, using an intercepted response.

No real lead, customer message, calendar booking or payment was created by these browser simulations. Existing communication and payment automation settings were not changed. Jamil's own practice submission remains the delivery acceptance test. The optional free-audit idea is discussion only.
