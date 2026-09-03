# Homepage redesign — scroll-craft engine, trade niche, two-tier pricing

Date: 2026-09-03
Status: approved, ready for implementation plan

## Goal

Rebuild thereadyconsult.com's homepage as a five-section, light-mode,
scroll-driven page that sells two named offers to high-ticket construction and
landscaping contractors.

Three inputs drove this:

- **Reference site** — aiautomationsociety.ai, for structure and craft.
- **Motion engine** — `nateherkai/scroll-craft`, for the scroll behaviour.
- **New offer** — Ready System at $103/mo, Acquisition System at "let's talk".

## Decisions already made

| Decision | Choice | Why |
|---|---|---|
| scroll-craft usage | Port the engine into Next.js | Its native output is standalone vanilla HTML. Replacing the homepage would cost the blog, `/work`, sitemap, GA4, `/start` intake and JSON-LD. |
| Theme | Light | Explicit. Note the reference site is dark (`--bg: #050506`); we take its craft, not its palette. |
| Public pricing | Publish $103 | Reverses the 2026-05-14 "no public pricing" rule. Memory file retired in the same pass. |
| Pricing layout | Two cards, side by side | Ready System / Acquisition System. |
| Homepage proof | Numbers, no client names | One mono line in Mission + real screenshots inside the Services tabs. |
| Portfolio rework | Deferred | Separate phase. Not in this build. |

## Target audience

High-ticket **construction and landscaping** companies — masonry, concrete,
hardscape, gunite, pools, insulation, precast, painting, landscaping. This
matches the agency niche set 2026-08-26 (Hispanic-owned exterior trades).

Copy obeys `client-voice.md`: short, simple basic words, no jargon, no dashes as
punctuation, few exclamation marks, solution oriented.

**Banned from all copy and schema** (currently present, all must go): fractional
CMO, growth partner, AI-first execution, outcome-driven pricing, 72-hour test
loops, B2B SaaS, ecommerce, funded startups, traditional agency.

**Language that lands instead:** more calls, book more jobs, show up on Google,
near me, free estimate, service area, quotes, crew, job site, before and after.

## Page structure

Five sections. `WorkSection`, `CaseStudyStats` and `Testimonial` come off the
homepage; their components and the `/work` routes stay intact and in the sitemap.

### 1. Hero
Line-mask headline that assembles as it enters, over a layered visual moving at
three depths. Speaks to a contractor: the website and Google profile that get the
phone ringing.

**The existing `$2,400,000+` counter is removed.** It is an unverifiable revenue
claim, it is not sourced anywhere in the repo, and the agency's verified book is
$1,740.99/mo recurring across 8 paying clients. Per `feedback_testimonials_real_only`
and `feedback_verify_public_facts_yourself`, an unsourced number does not ship.
Replace with a claim that is true and checkable, or no number at all. Jamil to
supply the real figure if he wants one there.

### 2. Mission
Page ground shifts from `#ffffff` to `#f6f9fc` as it scrolls through. Carries the
single proof line — a count of businesses running the system, no names. **The
count must be verified against Stripe before ship**, not taken from memory or the
status digest.

### 3. Services + How It Works (combined)
Modelled on the reference site's "inside the community" block: mono chip eyebrow,
two-part animated `h2`, a four-button tab strip, a stage holding a parallax
background image behind swappable slides, and a prev / caption / next bar.

Pins under the scroll; the four tabs advance as you travel. Tabs stay clickable.

| Tab | Content | Services covered |
|---|---|---|
| 01 Diagnosis | What a customer sees searching your trade in your area, and where calls leak | entry point |
| 02 Build | Website and Google Business Profile. Work photos, service area, tap-to-call | website, GBP |
| 03 Get Found | Monthly SEO for "masonry contractor near me" and the equivalent for each trade. AI video for social. Ads when you want more | SEO, AI video, Google/Meta ads |
| 04 Follow Up | Every call and form logged, automatic follow-up, dashboard | automation, dashboard |

Each stage slide is a **real screenshot** of live client work, not a graphic.
No client is named in visible copy or alt text.

### 4. Pricing
Two cards, light.

**Ready System — $103/mo**
Website · Google Business Profile · automated monthly SEO · maintenance and
hosting · dashboard. CTA: Get started.

**Acquisition System — Let's talk**
Everything in Ready, plus: AI video generation for social · Meta Ads · Google
Ads · lead generation · data structure · follow-up automation.
CTA: Book a call.

**Signature move.** Scrolling the Acquisition card assembles its six pieces into
one connected diagram, then the pointer moves it. Built from `reveal` with a
stagger for the pieces, connectors drawn on `--sc-p`, and a pointer `magnet` so
the assembled system tilts toward the cursor once it has landed. The system
becomes visible instead of listed. This is the page's engineered peak and the one
moment a visitor would describe to someone.

### 5. FAQ + contact
Tabbed FAQ in the reference's style. All five current questions are rewritten for
the trade audience. Closes with a band: "Still have a question?" and a Reach out
button. No scroll device here — deliberate rest after the peak.

## Engine integration

`scrollcraft.js` and `scrollcraft.css` are copied verbatim into `public/`. **The
engine is never edited** — the skill forbids it, and it is themed through tokens.

### Colour roles
The engine rebrands through six variables, mapped onto existing site tokens so
nothing new is invented:

```
--sc-canvas:     #ffffff   /* --background */
--sc-surface:    #f6f9fc   /* --gray-50   */
--sc-ink:        #0a2540   /* --navy      */
--sc-ink-soft:   #525f7f   /* --gray-600  */
--sc-accent:     #dc2626   /* TRC red     */
--sc-accent-ink: #ffffff
```

### Type
Inter stays for prose. **Roboto Mono** is added for eyebrows, labels, counters and
captions — the most recognisable trait of the reference site, one font load, no
brand risk. Adopt the reference's ease: `cubic-bezier(.22, 1, .36, 1)`.

### Scroll score
The skill requires four or more device families with no repeat back to back.

The engine has two separate axes. **Act type** is the container
(`data-sc-act="scrub|pin|flow|pan"`); **device family** is the behaviour
(`scrub`, `pin`, `pan`, `reveal`, `kinetic`, `parallax`, `count`, `flow`/`in`,
pointer, `drift`). There is no "assemble" family; the signature move is composed
from real primitives. The no-repeat-back-to-back rule is applied to both axes.

| # | Section | Act type | Devices |
|---|---|---|---|
| 1 | Hero | `flow` | `kinetic` lines + `parallax` layers |
| 2 | Mission | `pin` | `drift` ground shift + `count` proof line |
| 3 | Services | `pan` | lateral stage travel + `parallax` bg + `tilt` |
| 4 | Pricing | `flow` | `reveal` stagger + pointer `magnet` (signature move) |
| 5 | FAQ + close | `pin` | `spotlight` + `in` |

Act sequence flow → pin → pan → flow → pin has no adjacent repeat. Ten device
families across five sections, none repeated back to back.

Two constraints from the engine's own template are honoured: **no `scrub` acts
at all** (we have no video assets and no `KIE_AI_API_KEY`, and scrub is optional),
and **the closing act is the last element on the page** with the `Footer`
rendered inside its stage so there is no dead tail after the CTA. `Footer` stays
a shared component; only its placement on the homepage changes.

Note Mission keeps the pin: it is already a hand-rolled sticky word-reveal, so
converting it to a real `pin` act removes a duplicate scroll listener rather than
adding one.

## Known traps

1. **The engine has no teardown.** `ScrollCraft.mount()` attaches a rAF loop,
   resize and scroll listeners and IntersectionObservers with no destroy path. A
   double mount attaches a second loop permanently. Guard with a module-level
   flag; mount once; call `api.layout()` on re-entry rather than re-mounting.
   Per `feedback_react_double_mount_guards`, a `useRef` flag and an unmount
   cleanup both fail in dev — verify in a real browser, not by reasoning.

2. **`LoadingScreen` gates render.** Mounting before it resolves measures acts at
   zero height. Mount only after `ready`. This repo already hit a zero-viewport
   measurement bug (obs 6138).

3. **`globals.css` sets `html { scroll-snap-type: y proximity; }`** (line ~63).
   This fights every pinned act. It must be removed.

4. **Engine CSS declares a bare `body {}` rule** that collides with `globals.css`.
   Resolve by load order — engine CSS first, globals second. No engine edit.

5. **Engine default tokens are dark.** Overriding the six colour roles is
   required, not optional, or the page ships dark.

6. **Tailwind 4 emits `oklab()`.** Per `feedback_contrast_oklab_trap`, a regex
   contrast check is worthless in both directions. Contrast is verified in a
   browser against computed values.

7. **Uncommitted work in the tree.** `Services.tsx` and `Footer.tsx` are modified
   and `MetaAdsVisual.tsx` is untracked (Meta Ads work, 2026-09-02). Build on it,
   do not overwrite it. Concretely: the Meta Ads service added to `Services.tsx`
   yesterday must land inside **tab 03 Get Found**, and `MetaAdsVisual.tsx` is
   reused as that tab's stage visual rather than being orphaned when
   `ServicesTabs.tsx` replaces `Services.tsx`. Commit the pending work on its own
   before this build starts, so the redesign diff stays readable.

## Files touched

**New**
- `public/scrollcraft.js`, `public/scrollcraft.css` — verbatim copies
- `src/components/ScrollCraft.tsx` — mount guard
- `src/components/Pricing.tsx` — rewritten
- `src/components/ServicesTabs.tsx` — the combined services/how-it-works block

**Modified**
- `src/app/layout.tsx` — engine CSS load order, Roboto Mono
- `src/app/globals.css` — six `--sc-*` overrides, remove `scroll-snap-type`
- `src/app/page.tsx` — new section order, rewritten JSON-LD and FAQ schema
- `src/components/Hero.tsx`, `HeroVisual.tsx`, `Mission.tsx`, `FAQ.tsx`

**Removed from homepage**
- `WorkSection`, `CaseStudyStats`, `Testimonial` — components and the `/work`
  routes stay intact and in the sitemap; only the homepage stops rendering them.
- `HowItWorks` — no route of its own. Its content is absorbed into the four tabs,
  so the component is left unreferenced rather than kept for reuse.
- `src/lib/useCountUp.ts` — superseded by `data-sc-count` in Mission.

**Memory**
- `~/.claude/.../memory/feedback_no_public_pricing.md` — retired, dated 2026-09-03

## Verification

1. `npm run lint`, `npx tsc --noEmit`, `npm test` all clean.
2. **Browser proof, not reasoning.** Run the plugin's `scripts/shoot.mjs`
   (Playwright) against the dev server to screenshot every scroll position and
   flag dead scroll. Satisfies the double-mount rule's "verify in a browser".
3. Confirm exactly one `ScrollCraft.instances` entry after a client-side
   navigation away from `/` and back.
4. Contrast checked in-browser on computed values, both cards and every tab.
5. Stripe-verify the business count in Mission before ship.

## Out of scope

- Rewriting `/work` case studies. RSG Masonry (Acquisition proof) and Golden
  Gunite Pools (Ready System proof) are the two worth building, both exterior
  trades, mirroring the two pricing cards. Separate phase.
- Unpublishing the Ampere and Cluely stubs. Separate phase.
- Deploy. Cloudflare Pages is bot-check walled per `feedback_deploy_handoff`;
  Jamil runs it.
