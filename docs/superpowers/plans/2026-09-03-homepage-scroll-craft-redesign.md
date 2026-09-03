# Homepage scroll-craft Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the thereadyconsult.com homepage as a five-section, light-mode, scroll-driven page selling two named offers to construction and landscaping contractors.

**Architecture:** The `nateherkai/scroll-craft` engine (`scrollcraft.js` + `scrollcraft.css`) is copied verbatim into `public/` and mounted once from a client component after the loading screen resolves. Existing React sections are annotated with `data-sc-*` attributes rather than rewritten as vanilla HTML, so the blog, `/work`, sitemap, GA4 and `/start` intake all survive untouched.

**Tech Stack:** Next.js 16.2.1 (App Router, static export), React 19.2.4, TypeScript 5, Tailwind CSS 4, Vitest 4, scroll-craft engine (vanilla, unmodified).

**Spec:** `docs/superpowers/specs/2026-09-03-homepage-scroll-craft-redesign-design.md`

## Global Constraints

- **Never edit `public/scrollcraft.js` or `public/scrollcraft.css`.** The skill forbids it; the engine is themed through tokens only. Do not restyle `.sc-stage`, `.sc-copy`, or any `[data-sc-*]` selector — those are the mechanism.
- **Light mode.** The engine's default tokens are dark; the six colour roles must be overridden or the page ships dark.
- Colour roles, exact values: `--sc-canvas: #ffffff`, `--sc-surface: #f6f9fc`, `--sc-ink: #0a2540`, `--sc-ink-soft: #525f7f`, `--sc-accent: #dc2626`, `--sc-accent-ink: #ffffff`.
- Ease, exact value: `cubic-bezier(.22, 1, .36, 1)`.
- Fonts: Inter for prose (already loaded), Roboto Mono for eyebrows, labels, counters and captions.
- **Audience is construction and landscaping contractors.** Copy follows `~/trc/playbooks/trc-workflow/client-voice.md`: short, simple basic words, no jargon, **no dashes as punctuation**, few exclamation marks, solution oriented.
- **Banned strings in all copy, metadata and JSON-LD:** `fractional CMO`, `growth partner`, `AI-first`, `outcome-driven`, `72-hour test loop`, `B2B SaaS`, `ecommerce`, `funded startups`, `traditional agency`, `product-market fit`. Task 8 enforces this with a test.
- **No unverifiable numbers.** Any figure on the page must be checkable against Stripe or a live API. The existing `$2,400,000+` hero counter is removed.
- **No client names** in visible copy or image alt text on the homepage.
- Act types must not repeat back to back: `flow` → `pin` → `pan` → `flow` → `pin`.
- No `scrub` acts. There are no video assets and no `KIE_AI_API_KEY`.
- Do not deploy. Cloudflare Pages is bot-check walled per `feedback_deploy_handoff`; Jamil runs it.

---

### Task 1: Land pending work and install the engine

**Files:**
- Commit: `src/components/Services.tsx`, `src/components/Footer.tsx`, `src/components/MetaAdsVisual.tsx`
- Create: `public/scrollcraft.js`, `public/scrollcraft.css`, `src/components/ScrollCraft.tsx`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `<ScrollCraft ready={boolean} />` — a client component rendering nothing, which calls `ScrollCraft.mount(document.body)` exactly once after `ready` turns true, and `api.layout()` on every later `ready` transition. Global `window.ScrollCraft` typed as `{ mount(root: Element | Document | string, opts?: { lerp?: number }): ScrollCraftApi; instances: ScrollCraftApi[] }` where `ScrollCraftApi = { layout(): void; read(): void }`.

- [ ] **Step 1: Commit the pending Meta Ads work on its own branch**

The tree has uncommitted work from 2026-09-02. Land it first so the redesign diff stays readable.

```bash
cd ~/trc/sites/the-ready-consult-website
git checkout -b homepage-scroll-craft
git add src/components/Services.tsx src/components/Footer.tsx src/components/MetaAdsVisual.tsx
git commit -m "feat: add Meta Ads service and visual to Services section"
```

- [ ] **Step 2: Copy the engine in, verbatim**

```bash
cd ~/trc/sites/the-ready-consult-website
SC=/tmp/sc-probe/plugins/nateherk-design/skills/scroll-craft
cp "$SC/engine/scrollcraft.js"  public/scrollcraft.js
cp "$SC/engine/scrollcraft.css" public/scrollcraft.css
shasum -a 256 "$SC/engine/scrollcraft.js" public/scrollcraft.js
```

Expected: both hashes identical. If `/tmp/sc-probe` is gone, re-clone with
`git clone --depth 1 https://github.com/nateherkai/scroll-craft.git /tmp/sc-probe`.

- [ ] **Step 3: Write the failing test for the mount guard**

The engine has no teardown, so a second `mount()` attaches a second rAF loop permanently. The guard is the one piece of this build with real logic, so it gets a real test.

Create `src/components/scroll-craft-guard.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { mountOnce, resetForTests } from "./scroll-craft-guard";

describe("mountOnce", () => {
  beforeEach(() => resetForTests());

  it("mounts on first call and returns the api", () => {
    const calls: string[] = [];
    const api = { layout: () => calls.push("layout"), read: () => {} };
    const engine = { mount: () => { calls.push("mount"); return api; }, instances: [] };
    expect(mountOnce(engine)).toBe(api);
    expect(calls).toEqual(["mount"]);
  });

  it("does not mount twice, it re-layouts instead", () => {
    const calls: string[] = [];
    const api = { layout: () => calls.push("layout"), read: () => {} };
    const engine = { mount: () => { calls.push("mount"); return api; }, instances: [] };
    mountOnce(engine);
    mountOnce(engine);
    mountOnce(engine);
    expect(calls).toEqual(["mount", "layout", "layout"]);
  });

  it("returns null when the engine has not loaded yet", () => {
    expect(mountOnce(undefined)).toBeNull();
  });
});
```

- [ ] **Step 4: Run it and watch it fail**

Run: `npx vitest run src/components/scroll-craft-guard.test.ts`
Expected: FAIL, cannot resolve `./scroll-craft-guard`.

- [ ] **Step 5: Write the guard**

Create `src/components/scroll-craft-guard.ts`:

```ts
export type ScrollCraftApi = { layout: () => void; read: () => void };
export type ScrollCraftEngine = {
  mount: (root?: Element | Document | string, opts?: { lerp?: number }) => ScrollCraftApi;
  instances: ScrollCraftApi[];
};

// The engine attaches a rAF loop, scroll and resize listeners and
// IntersectionObservers, and exposes no destroy path. Mounting twice leaks a
// second loop for the life of the page, so the guard is module level rather
// than a ref: a ref resets on remount, which is exactly the case we guard.
let mounted: ScrollCraftApi | null = null;

export function mountOnce(engine: ScrollCraftEngine | undefined): ScrollCraftApi | null {
  if (!engine) return null;
  if (mounted) {
    mounted.layout();
    return mounted;
  }
  mounted = engine.mount(document.body);
  return mounted;
}

export function resetForTests() {
  mounted = null;
}
```

- [ ] **Step 6: Run it and watch it pass**

Run: `npx vitest run src/components/scroll-craft-guard.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 7: Write the React wrapper**

Create `src/components/ScrollCraft.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import Script from "next/script";
import { mountOnce, type ScrollCraftEngine } from "./scroll-craft-guard";

declare global {
  interface Window { ScrollCraft?: ScrollCraftEngine }
}

// Mounting before the loading screen resolves measures every act at zero
// height, which is the failure this repo already hit once. Gate on `ready`.
export default function ScrollCraft({ ready }: { ready: boolean }) {
  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const attempt = () => {
      if (mountOnce(window.ScrollCraft)) return;
      raf = requestAnimationFrame(attempt);
    };
    attempt();
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return <Script src="/scrollcraft.js" strategy="afterInteractive" />;
}
```

- [ ] **Step 8: Theme the engine light and remove the scroll-snap conflict**

In `src/app/globals.css`, add the six overrides after the existing `:root` block:

```css
/* scroll-craft engine, rebranded light. These six roles are the whole theme;
   everything else in scrollcraft.css derives from them. Never edit the engine. */
:root {
  --sc-canvas:      #ffffff;
  --sc-surface:     #f6f9fc;
  --sc-ink:         #0a2540;
  --sc-ink-soft:    #525f7f;
  --sc-accent:      #dc2626;
  --sc-accent-ink:  #ffffff;
  --sc-font-display: var(--font-inter), system-ui, sans-serif;
  --sc-font-text:    var(--font-inter), system-ui, sans-serif;
  --sc-font-mono:    var(--font-roboto-mono), ui-monospace, monospace;
  --trc-ease: cubic-bezier(.22, 1, .36, 1);
}
```

Then change the `html` rule. `scroll-snap-type` fights every pinned act:

```css
/* was: html { scroll-behavior: smooth; scroll-snap-type: y proximity; } */
html { scroll-behavior: smooth; }
```

- [ ] **Step 9: Load the engine CSS before globals, and add Roboto Mono**

In `src/app/layout.tsx`, the engine declares a bare `body {}` rule. Import it
*before* `./globals.css` so the site's own body rule wins on conflict.

```tsx
import { Inter, Roboto_Mono } from "next/font/google";
import "../../public/scrollcraft.css";
import "./globals.css";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
```

and add the variable to the `html` className:

```tsx
<html lang="en" className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}>
```

- [ ] **Step 10: Verify the engine mounts exactly once**

```bash
npm run dev
```

In a browser at `http://localhost:3000`, console:

```js
window.ScrollCraft.instances.length          // expect 1
document.documentElement.classList.contains("sc-ready")  // expect true
```

Then navigate to `/blog`, back to `/`, and re-check `instances.length`.
Expected: still `1`. Per `feedback_react_double_mount_guards`, this must be
confirmed in a real browser, not by reasoning about the code.

- [ ] **Step 11: Commit**

```bash
git add public/scrollcraft.js public/scrollcraft.css src/components/ScrollCraft.tsx \
        src/components/scroll-craft-guard.ts src/components/scroll-craft-guard.test.ts \
        src/app/globals.css src/app/layout.tsx
git commit -m "feat: install scroll-craft engine, light theme, single-mount guard"
```

---

### Task 2: Hero as a flow act

**Files:**
- Modify: `src/components/Hero.tsx`, `src/components/HeroVisual.tsx`

**Interfaces:**
- Consumes: `ScrollCraft` mounted by Task 1; `--trc-ease` from globals.
- Produces: `<Hero ready={boolean} />`, unchanged signature.

- [ ] **Step 1: Strip the unverifiable counter**

Remove the `count` state, its `useEffect` timer, the `target = 2400000` constant, and the `${count.toLocaleString()}+` element entirely. It is an unsourced revenue claim; per the spec it does not ship.

- [ ] **Step 2: Rewrite the headline for contractors**

Replace the headline copy with a kinetic-lines heading. Plain words, no dashes as punctuation:

```tsx
<h1 className="sc-display sc-display--xl" data-sc-kinetic="lines">
  <span>The website and Google profile</span>
  <span>that get your phone ringing.</span>
</h1>
<p className="sc-body">
  We build it, keep it running, and make sure people searching for your trade
  in your area find you first.
</p>
```

- [ ] **Step 3: Make the section a flow act and stagger the entrance**

```tsx
<section className="sc-section relative bg-white min-h-[100vh] flex flex-col overflow-x-clip lg:overflow-hidden"
         data-sc-act="flow" data-sc-drift="#ffffff">
```

Wrap the copy column in the engine's stagger instead of the hand-rolled `reveal` state and its five `setTimeout` calls:

```tsx
<div className="sc-stack" data-sc-in data-sc-stagger="70">
```

Delete the `reveal` state, the `r(step)` helper and every `style={r(n)}` usage.

- [ ] **Step 4: Give the visual three parallax depths**

In `HeroVisual.tsx`, the existing decorative SVG layers become three depth
layers. Rates descend with distance, matching the reference site's
`0.31 / 0.17 / 0.2` feel:

```tsx
<div data-sc-parallax="0.30" className="absolute inset-0 pointer-events-none">{/* far  */}</div>
<div data-sc-parallax="0.17" className="absolute inset-0 pointer-events-none">{/* mid  */}</div>
<div data-sc-parallax="0.08">{/* front, the real visual */}</div>
```

- [ ] **Step 5: Verify in the browser**

Run `npm run dev`, load `/`, scroll the hero.
Expected: headline lines rise from behind masks on load; the three layers move at
visibly different rates; no console errors; no layout shift on the CTA.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.tsx src/components/HeroVisual.tsx
git commit -m "feat(hero): kinetic headline, parallax depth, drop unsourced revenue claim"
```

---

### Task 3: Mission as a pin act with drift and the proof count

**Files:**
- Modify: `src/components/Mission.tsx`
- Delete: `src/lib/useCountUp.ts`

**Interfaces:**
- Consumes: engine `--sc-p` on the act element.
- Produces: `<Mission />`, no props.

- [ ] **Step 1: Replace the hand-rolled scroll listener with a pin act**

Mission already implements a sticky word reveal with its own `scroll` listener.
The engine drives the same thing, so the listener is deleted rather than kept
alongside. Remove the `useEffect`, the `progress` state and the `ref`.

```tsx
<section className="sc-section" data-sc-act="pin" data-sc-span="2.2" data-sc-drift="#f6f9fc">
  <div data-sc-stage>
    <p className="sc-display sc-display--lg" data-sc-cue="0 0.9 0" data-sc-kinetic="words">
      We build your website, get you found on Google, and make sure every call
      and form gets followed up.
    </p>
    <p className="sc-mono" data-sc-cue="0.55">
      <span data-sc-count="8" data-sc-count-at="0.6">0</span> businesses run on
      this system right now.
    </p>
  </div>
</section>
```

Note the copy is rewritten for contractors and drops the old jargon.

- [ ] **Step 2: Verify the count before it ships**

The `8` is not a guess. It comes from the verified paying book. Confirm against
Stripe before this task is considered done:

```bash
# via the Stripe MCP connector, count active subscriptions
```

If Stripe is unauthenticated (a recurring problem per `feedback_memory_accuracy`),
re-auth via `/mcp` and re-check. **Do not ship the number on the strength of the
status digest alone.** If it cannot be verified, remove the sentence rather than
publish an unverified figure.

- [ ] **Step 3: Delete the superseded count hook**

```bash
git rm src/lib/useCountUp.ts
grep -rn "useCountUp" src/ || echo "no remaining references"
```

Expected: no remaining references. If `CaseStudyStats.tsx` still imports it and
that component is still referenced by `/work`, keep the file and skip this step.

- [ ] **Step 4: Verify in the browser**

Expected: section pins; words colour in as you scroll through; page ground shifts
from white to `#f6f9fc`; the counter runs to 8 once and does not re-run on
scroll-back.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/Mission.tsx src/lib/
git commit -m "feat(mission): pin act with ground drift and verified proof count"
```

---

### Task 4: Services and How It Works, combined, as a pan act

**Files:**
- Create: `src/components/ServicesTabs.tsx`
- Delete from homepage: `src/components/Services.tsx`, `src/components/HowItWorks.tsx`
- Reuse: `src/components/MetaAdsVisual.tsx`, `SeoVisual.tsx`, `WebsiteVisual.tsx`, `VideoVisual.tsx`

**Interfaces:**
- Consumes: the four existing visual components.
- Produces: `<ServicesTabs />`, no props. Internal type
  `type Tab = { n: string; name: string; line: string; body: string; visual: React.ReactNode }`.

- [ ] **Step 1: Build the tab data**

Modelled on the reference site's "inside the community" block. Four tabs, journey
order, contractor language, covering every service.

```tsx
const TABS: Tab[] = [
  { n: "01", name: "Diagnosis", line: "See what your customers see.",
    body: "We search your trade in your area and show you exactly what comes up, where you rank, and where the calls are leaking.",
    visual: <SeoVisual /> },
  { n: "02", name: "Build", line: "A site that books jobs.",
    body: "Website and Google Business Profile. Photos of your work, the areas you cover, and a tap to call button on every screen.",
    visual: <WebsiteVisual /> },
  { n: "03", name: "Get Found", line: "Come up first, every month.",
    body: "Monthly SEO so you show up for people searching your trade nearby. AI video for social. Google and Meta ads when you want more.",
    visual: <MetaAdsVisual /> },
  { n: "04", name: "Follow Up", line: "No estimate goes cold.",
    body: "Every call and form is logged and followed up automatically. Your dashboard shows what is bringing work in.",
    visual: <VideoVisual /> },
];
```

The Meta Ads work committed in Task 1 lands here, in tab 03, rather than being
orphaned when `Services.tsx` stops being rendered.

- [ ] **Step 2: Build the pan act**

Span is roughly one viewport height per item plus one, per the engine template.

```tsx
export default function ServicesTabs() {
  const [active, setActive] = useState(0);
  return (
    <section id="services" className="sc-section" data-sc-act="pan"
             data-sc-span="5" data-sc-drift="#ffffff">
      <div data-sc-stage>
        <p className="sc-mono">How it works</p>
        <h2 className="sc-display sc-display--lg" data-sc-kinetic="lines">
          <span>Four steps to a phone</span>
          <span>that keeps ringing.</span>
        </h2>

        <div role="tablist" className="flex gap-2">
          {TABS.map((t, i) => (
            <button key={t.name} role="tab" aria-selected={active === i}
                    data-sc-segment={i} onClick={() => setActive(i)}
                    className="sc-mono">
              {t.n} {t.name}
            </button>
          ))}
        </div>

        <div className="rail" data-sc-pan="0.06">
          {TABS.map((t, i) => (
            <figure key={t.name} data-sc-segment={i} aria-hidden={active !== i}>
              <div data-sc-tilt="6">{t.visual}</div>
              <figcaption><strong>{t.line}</strong> {t.body}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`data-sc-segment` lets the engine advance the tabs on scroll while the buttons
stay clickable, so the section works for keyboard and screen reader users too.

- [ ] **Step 3: Swap real client screenshots into the stage**

Per the approved design, each tab shows real work rather than a graphic. Capture
live client sites into `public/services/` and reference them from each tab.
**No client is named in the alt text.** Use trade descriptions:

```tsx
<img src="/services/02-build.jpg" alt="A contractor website showing finished work and a tap to call button" />
```

Capture with the `browse` skill or Playwright at retina scale. If a capture is
not available for a tab, leave that tab's existing visual component in place
rather than shipping a placeholder.

- [ ] **Step 4: Verify in the browser**

Expected: the section pans laterally as you scroll down; tabs advance in step;
clicking a tab still switches it; the active tab is announced correctly.

- [ ] **Step 5: Commit**

```bash
git add src/components/ServicesTabs.tsx public/services/
git commit -m "feat(services): four-tab pan act combining services and how it works"
```

---

### Task 5: Pricing, two cards, with the signature move

**Files:**
- Modify: `src/components/Pricing.tsx` (full rewrite)
- Create: `src/components/pricing-data.ts`, `src/components/pricing.test.ts`, `src/components/SystemDiagram.tsx`
- Modify: `src/app/globals.css` (card and diagram classes)

**Interfaces:**
- Consumes: `--sc-accent`, `--trc-ease`, `--sc-p` (written by the engine).
- Produces: `<Pricing />`, no props. `PLANS: Plan[]` from `./pricing-data`, where
  `Plan = { name: string; price: string; period: string; desc: string; features: string[]; cta: string; href: string }`.
  `<SystemDiagram />` from `./SystemDiagram`, no props.

- [ ] **Step 1: Write the failing test for the pricing content**

This is the task most likely to drift from what was agreed, so the tier contents
are pinned by a test. Create `src/components/pricing.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { PLANS } from "./pricing-data";

describe("PLANS", () => {
  it("has exactly two tiers, named as agreed", () => {
    expect(PLANS.map(p => p.name)).toEqual(["Ready System", "Acquisition System"]);
  });

  it("prices the entry tier at 103 and gates the enterprise tier", () => {
    expect(PLANS[0].price).toBe("$103");
    expect(PLANS[1].price).toBe("Let's talk");
  });

  it("lists every Ready System feature", () => {
    expect(PLANS[0].features).toEqual([
      "Website",
      "Google Business Profile",
      "Automated monthly SEO",
      "Maintenance and hosting",
      "Dashboard",
    ]);
  });

  it("lists every Acquisition System feature", () => {
    expect(PLANS[1].features).toEqual([
      "AI video generation for social",
      "Meta Ads",
      "Google Ads",
      "Lead generation",
      "Data structure",
      "Follow up automation",
    ]);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/pricing.test.ts`
Expected: FAIL, cannot resolve `./pricing-data`.

- [ ] **Step 3: Write the data module**

Create `src/components/pricing-data.ts`:

```ts
export type Plan = {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
};

export const PLANS: Plan[] = [
  {
    name: "Ready System",
    price: "$103",
    period: "per month",
    desc: "Everything you need to get found and get called.",
    features: [
      "Website",
      "Google Business Profile",
      "Automated monthly SEO",
      "Maintenance and hosting",
      "Dashboard",
    ],
    cta: "Get started",
    href: "/start",
  },
  {
    name: "Acquisition System",
    price: "Let's talk",
    period: "built around your crew",
    desc: "The full system for contractors who want more work than word of mouth brings in.",
    features: [
      "AI video generation for social",
      "Meta Ads",
      "Google Ads",
      "Lead generation",
      "Data structure",
      "Follow up automation",
    ],
    cta: "Book a call",
    href: "https://calendly.com/thereadyconsult/30min",
  },
];
```

- [ ] **Step 4: Run it and watch it pass**

Run: `npx vitest run src/components/pricing.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Rewrite the component, light, two cards**

The section converts from `bg-[#0d0a0a]` to light and drops `data-dark`.

```tsx
<section id="pricing" className="sc-section bg-white"
         data-sc-act="flow" data-sc-drift="#ffffff">
  <div className="sc-wrap">
    <p className="sc-mono">Pricing</p>
    <h2 className="sc-display sc-display--lg" data-sc-kinetic="lines">
      <span>Two ways to work</span><span>with us.</span>
    </h2>
    <div className="grid md:grid-cols-2 gap-4" data-sc-in data-sc-stagger="90">
      {PLANS.map((p, i) => (
        <div key={p.name} className="plan" data-featured={i === 1 || undefined}>
          <p className="sc-mono plan__name">{p.name}</p>
          <p className="plan__price">
            <span className="plan__figure">{p.price}</span>
            <span className="sc-mono plan__period">{p.period}</span>
          </p>
          <p className="plan__desc">{p.desc}</p>
          <ul className="plan__features">
            {p.features.map(f => (
              <li key={f}>
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="3.5" fill="currentColor" />
                </svg>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {i === 1 && <SystemDiagram />}
          <a className="plan__cta" href={p.href}>{p.cta}</a>
        </div>
      ))}
    </div>
  </div>
</section>
```

Card styling, added to `globals.css`. Only the page's own classes are styled;
no `[data-sc-*]` selector or `.sc-` class is restyled, because those are the
mechanism:

```css
.plan {
  background: var(--sc-surface);
  border: 1px solid var(--sc-hairline);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  transition: border-color .4s var(--trc-ease);
}
.plan[data-featured] { border-color: color-mix(in oklab, var(--sc-accent) 40%, transparent); }
.plan__figure  { font-size: clamp(2rem, 4vw, 3rem); color: var(--sc-ink); letter-spacing: -0.02em; }
.plan__period  { color: var(--sc-ink-soft); margin-left: 8px; }
.plan__desc    { color: var(--sc-ink-soft); }
.plan__features { list-style: none; padding: 0; flex: 1; }
.plan__features li { display: flex; gap: 12px; align-items: flex-start; }
.plan__features svg { color: var(--sc-accent); flex: none; margin-top: 4px; }
.plan__cta {
  margin-top: 24px; text-align: center; padding: 14px; border-radius: 12px;
  background: var(--sc-surface); color: var(--sc-ink);
  border: 1px solid var(--sc-hairline);
  transition: background .3s var(--trc-ease), color .3s var(--trc-ease);
}
.plan[data-featured] .plan__cta { background: var(--sc-accent); color: var(--sc-accent-ink); border-color: transparent; }
```

- [ ] **Step 6: Build the signature move**

Inside the Acquisition card, the six features assemble into one connected
diagram, then respond to the pointer. Reveal stagger for the pieces, connectors
drawn against act progress, `data-sc-magnet` once landed. Per the engine
template, a magnet and a cue both write `transform`, so the cue's rise must be
a no-op or the entrance is lost to the race:

Create `src/components/SystemDiagram.tsx`. Six nodes on a ring around a hub,
each revealed on the stagger, connectors drawn by animating `stroke-dashoffset`
against the act progress the engine writes into `--sc-p`:

```tsx
const NODES = [
  { id: "video", label: "AI video",   x: 160, y: 24  },
  { id: "meta",  label: "Meta Ads",   x: 286, y: 78  },
  { id: "gads",  label: "Google Ads", x: 286, y: 164 },
  { id: "leads", label: "Leads",      x: 160, y: 208 },
  { id: "data",  label: "Data",       x: 34,  y: 164 },
  { id: "auto",  label: "Follow up",  x: 34,  y: 78  },
];

export default function SystemDiagram() {
  return (
    <div className="system" data-sc-magnet="0.18" data-sc-cue="0.15" data-sc-rise="0">
      <svg viewBox="0 0 320 232" role="img"
           aria-label="AI video, Meta Ads, Google Ads, lead generation, data structure and follow up automation connected into one system">
        <g className="system__wires" stroke="currentColor" fill="none" strokeWidth="1.25">
          {NODES.map(n => (
            <line key={n.id} x1="160" y1="116" x2={n.x} y2={n.y} pathLength={1} />
          ))}
        </g>
        <circle className="system__hub" cx="160" cy="116" r="26" />
        {NODES.map((n, i) => (
          <g key={n.id} className="system__node" style={{ "--i": i } as React.CSSProperties}>
            <circle cx={n.x} cy={n.y} r="6" />
            <text x={n.x} y={n.y - 12} textAnchor="middle">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
```

with the drawing driven by the engine's progress variable:

```css
.system__wires line {
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--sc-p, 0));
  stroke: color-mix(in oklab, var(--sc-accent) 55%, transparent);
}
.system__node {
  opacity: 0;
  transform: scale(.7);
  transform-origin: center;
  transition: opacity .5s var(--trc-ease), transform .5s var(--trc-ease);
  transition-delay: calc(var(--i) * 90ms);
  fill: var(--sc-accent);
}
[data-sc-in-view] .system__node { opacity: 1; transform: none; }
.system__node text { fill: var(--sc-ink-soft); font-family: var(--sc-font-mono); font-size: 9px; }
.system__hub { fill: none; stroke: var(--sc-accent); stroke-width: 1.5; }
```

Give the diagram an accessible text equivalent so it is not proof only for
sighted users:

```tsx
<p className="sr-only">
  The Acquisition System connects AI video, Meta Ads, Google Ads, lead
  generation, data structure and follow up automation into one loop.
</p>
```

- [ ] **Step 7: Verify in the browser**

Expected: both cards are light with readable contrast; the six pieces fly in and
connect once; the assembled diagram tilts toward the cursor; the move does not
replay every time you scroll past.

- [ ] **Step 8: Commit**

```bash
git add src/components/Pricing.tsx src/components/pricing-data.ts src/components/pricing.test.ts
git commit -m "feat(pricing): Ready System at 103 and Acquisition System, with the signature assemble"
```

---

### Task 6: FAQ and the closing act

**Files:**
- Modify: `src/components/FAQ.tsx`

**Interfaces:**
- Consumes: `Footer`, rendered inside the closing stage on the homepage only.
- Produces: `<FAQ />`, no props.

- [ ] **Step 1: Rewrite all six questions for contractors**

Every current question sells the wrong niche. Replace the array wholesale:

```ts
const faqs = [
  { q: "How fast can my site be live?",
    a: "Most sites go live in about two weeks once we have your photos and your service area." },
  { q: "Do I own the website?",
    a: "Yes. The site is yours. We build it, host it and keep it updated while you are with us." },
  { q: "What if I already have a website?",
    a: "We look at what you have first. Sometimes we fix it, sometimes a rebuild gets you further for the same money." },
  { q: "Do you work with my trade?",
    a: "We work with construction and landscaping companies. Masonry, concrete, hardscape, pools, insulation, painting and landscaping." },
  { q: "How do I know it is working?",
    a: "You get a dashboard showing calls, forms and where you rank. No reports to read, just the numbers." },
  { q: "Is there a contract?",
    a: "No long term lock in. It is month to month, and the site stays live as long as you are with us." },
];
```

Note the last answer matches `feedback_website_subscription_no_end_date`: pay or
the site goes down, no fixed term.

- [ ] **Step 2: Add the contact close and make it the last element**

Per the engine template, the closing act is the last element on the page and the
footer sits inside its stage so there is no dead tail after the CTA.

```tsx
<section id="faq" className="sc-section" data-sc-act="pin"
         data-sc-span="1.3" data-sc-drift="#f6f9fc">
  <div data-sc-stage data-sc-spotlight>
    {/* accordion */}
    <div className="close" data-sc-cue="0.5">
      <h3 className="sc-display sc-display--md">Still have a question?</h3>
      <a className="cta" href="/start" data-sc-magnet="0.22" data-sc-cue="0.5" data-sc-rise="0">
        Reach out
      </a>
    </div>
    <Footer />
  </div>
</section>
```

`Footer` stays a shared component; only its placement on the homepage changes.
Other routes keep rendering it as they do now.

- [ ] **Step 3: Verify in the browser**

Expected: accordion still opens and closes by click and keyboard; the close band
is visible at the end of the pin; the Reach out button is reachable by keyboard
at full opacity; there is no empty scroll after the footer.

- [ ] **Step 4: Commit**

```bash
git add src/components/FAQ.tsx
git commit -m "feat(faq): trade-focused questions and the closing contact act"
```

---

### Task 7: Wire the page and fix the schema

**Files:**
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`

- [ ] **Step 1: Rebuild the section order**

Five sections. `WorkSection`, `CaseStudyStats`, `Testimonial` and `HowItWorks`
stop being rendered. Their components and the `/work` routes stay intact and in
the sitemap.

```tsx
<LoadingScreen onComplete={handleLoadingComplete} />
<ScrollCraft ready={ready} />
<Navbar />
<span data-sc-progress />
<main id="main-content">
  <Hero ready={ready} />
  <Mission />
  <ServicesTabs />
  <Pricing />
  <FAQ />
</main>
<ScrollToTop />
```

`Footer` is no longer rendered here; it lives inside FAQ's stage per Task 6.

- [ ] **Step 2: Rewrite the JSON-LD for the real niche**

The current schema tells Google and every AI answer engine that TRC serves B2B
SaaS and funded startups. Replace both blocks:

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "The Ready Consult",
  description:
    "Websites, Google Business Profiles, SEO and lead follow up for construction and landscaping companies.",
  url: "https://www.thereadyconsult.com",
  email: "jamil@thereadyconsult.com",
  serviceType: [
    "Website design for contractors",
    "Local SEO",
    "Google Business Profile management",
    "Google Ads",
    "Meta Ads",
    "Lead follow up automation",
  ],
  founder: [{ "@type": "Person", name: "Jamil Gonzales" }],
};
```

The FAQ JSON-LD must mirror the six questions written in Task 6 exactly. A
`FAQPage` whose questions do not appear on the page is a structured data
violation, so generate it from the same array rather than retyping it.

- [ ] **Step 3: Rewrite the page metadata**

In `layout.tsx`, title, description, keywords, OG and Twitter all still sell the
old niche. Replace them:

```ts
title: "The Ready Consult | Websites and SEO for Contractors",
description:
  "We build websites and Google Business Profiles for construction and landscaping companies, then keep you showing up so the calls keep coming.",
keywords:
  "contractor website, masonry marketing, landscaping SEO, Google Business Profile, local SEO for contractors, construction lead generation",
openGraph: {
  title: "The Ready Consult | Websites and SEO for Contractors",
  description:
    "Websites, Google Business Profiles and SEO for construction and landscaping companies.",
  url: "https://www.thereadyconsult.com",
  siteName: "The Ready Consult",
  type: "website",
  locale: "en_US",
  images: [{ url: "https://www.thereadyconsult.com/og-image.png", width: 1200, height: 630,
             alt: "The Ready Consult, websites and SEO for contractors" }],
},
```

Mirror the same title and description into `twitter`. The title is 54
characters, inside the 60 character limit.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: five-section homepage and schema rewritten for the trade niche"
```

---

### Task 8: Enforce the copy rules with a test

**Files:**
- Create: `src/lib/copy-rules.test.ts`

- [ ] **Step 1: Write the test**

The banned phrases are scattered across components, metadata and schema, and are
easy to reintroduce. A test is cheaper than remembering.

```ts
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const BANNED = [
  "fractional CMO", "growth partner", "AI-first", "outcome-driven",
  "72-hour test loop", "B2B SaaS", "ecommerce", "funded startups",
  "traditional agency", "product-market fit",
];

const HOMEPAGE_FILES = [
  "src/app/page.tsx", "src/app/layout.tsx",
  "src/components/Hero.tsx", "src/components/Mission.tsx",
  "src/components/ServicesTabs.tsx", "src/components/Pricing.tsx",
  "src/components/pricing-data.ts", "src/components/FAQ.tsx",
];

describe("homepage copy", () => {
  it.each(HOMEPAGE_FILES)("%s carries no off-niche jargon", (file) => {
    const text = readFileSync(join(process.cwd(), file), "utf8").toLowerCase();
    const found = BANNED.filter(p => text.includes(p.toLowerCase()));
    expect(found).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it**

Run: `npx vitest run src/lib/copy-rules.test.ts`
Expected: PASS. If it fails, the failure names the file and the phrase. Fix the
copy, not the test.

- [ ] **Step 3: Commit**

```bash
git add src/lib/copy-rules.test.ts
git commit -m "test: fail the build on off-niche jargon in homepage copy"
```

---

### Task 9: Full verification

- [ ] **Step 1: Static checks**

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Expected: all four clean. `npm run build` matters because the site is a static
export; a client component that touches `window` at module scope fails here and
nowhere else.

- [ ] **Step 2: Browser proof of the scroll**

The plugin ships a Playwright harness that screenshots every scroll position and
flags dead scroll, which is the honest way to check this work.

```bash
npm run dev &
node /tmp/sc-probe/plugins/nateherk-design/skills/scroll-craft/scripts/shoot.mjs \
     --url http://localhost:3000
```

Expected: no dead scroll ranges reported. Any range where nothing changes is
either fixed or recorded in the spec as authored silence.

- [ ] **Step 3: Confirm the single mount survives navigation**

In the browser console on `/`:

```js
window.ScrollCraft.instances.length   // 1
```

Navigate to `/blog`, then back to `/`, re-check. Expected: still `1`.

- [ ] **Step 4: Contrast, in the browser, on computed values**

Tailwind 4 emits `oklab()`, so per `feedback_contrast_oklab_trap` a regex check
over the source proves nothing in either direction. Check computed styles on both
pricing cards, all four tab captions, the mono eyebrows and the CTA buttons.
Expected: 4.5:1 or better for body text, 3:1 for large display text.

- [ ] **Step 5: Reduced motion**

```js
matchMedia("(prefers-reduced-motion: reduce)")
```

With the OS setting on, expected: content is fully visible and readable with the
scroll devices disabled. The engine exposes `ScrollCraft.reduce` for this; confirm
nothing is stuck at opacity 0.

- [ ] **Step 6: Mobile**

Check at 390px wide. Expected: the pan act does not cause horizontal body scroll;
tabs remain tappable; the pin spans do not strand content off screen.

- [ ] **Step 7: Report, do not deploy**

Cloudflare Pages is bot-check walled. Summarise what shipped, what was verified
in a browser, and hand the deploy to Jamil.

---

### Task 10: Retire the superseded memory rule

**Files:**
- Modify: `~/.claude/projects/-Users-admin/memory/feedback_no_public_pricing.md`
- Modify: `~/.claude/projects/-Users-admin/memory/MEMORY.md`

- [ ] **Step 1: Rewrite the rule as retired**

The site now publishes $103. Leaving the old rule in place guarantees a future
session contradicts the site. Rewrite the body to record the reversal, dated
2026-09-03, keeping the file so the history is legible:

> **RETIRED 2026-09-03.** TRC now publishes the Ready System price ($103/mo) on
> the homepage. The 2026-05-14 conversation-gated pricing rule no longer applies
> to TRC's own site. The Acquisition System stays unpriced and call-gated.
> This rule was always TRC-specific; other clients are unaffected.

- [ ] **Step 2: Update the index line in `MEMORY.md`**

Change the pointer so a future session sees the reversal without opening the file.

- [ ] **Step 3: Update the TRC status block**

```bash
trc set "The Ready Consult" --next "Deploy the homepage redesign" || trc
```

If the agency has no client-style entry, append the change to
`~/Desktop/The Ready/TRC.md` instead, per the source of truth rules.
