# Portfolio Case Studies — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/work` portfolio section — block-rendered case studies with a next-case chain — as the structural groundwork (no decoration/animation polish yet).

**Architecture:** Each case study is a typed `CaseStudy` object in `content/work/<slug>.ts`, listed in a registry whose order drives the next-case chain. A `<CaseRenderer>` maps ordered `Block`s to isolated block components. Pure selector logic is unit-tested with vitest; pages/components are verified by `tsc --noEmit` + the static-export build. Reuses the existing `useCountUp` hook.

**Tech Stack:** Next.js 15 (App Router, `output: export`), TypeScript, Tailwind, vitest (new, for pure logic only).

**Spec:** `docs/superpowers/specs/2026-06-05-portfolio-case-studies-design.md`

---

## File Structure

```
content/work/
  index.ts                 # registry: CASES array (order = chain order)
  team-nebula.ts           # sample CaseStudy (assets already in repo)
src/lib/
  work-types.ts            # CaseStudy, Block union, Media/Metric/Milestone
  work-select.ts           # PURE selectors (unit-tested)
  work.ts                  # binds selectors to the CASES registry
  work-select.test.ts      # vitest unit tests
  useCountUp.ts            # extracted from CaseStudyStats.tsx
src/app/work/
  page.tsx                 # /work index
  [slug]/page.tsx          # case study page
src/components/work/
  CaseRenderer.tsx
  BlockHero.tsx BlockText.tsx BlockImage.tsx BlockGallery.tsx
  BlockMetricRow.tsx BlockTimeline.tsx BlockAdGallery.tsx
  BlockVideo.tsx BlockQuote.tsx BlockNextCase.tsx
```

Touched: `src/components/CaseStudyStats.tsx` (use extracted hook), `src/components/CaseStudies.tsx` (rewire to registry), `src/components/Navbar.tsx` + `src/components/Footer.tsx` (add Work link), `package.json` (vitest), `vitest.config.ts` (new).

---

## Task 1: Extract the `useCountUp` hook for reuse

**Files:**
- Create: `src/lib/useCountUp.ts`
- Modify: `src/components/CaseStudyStats.tsx` (replace inline hook with import)

- [ ] **Step 1: Create the shared hook**

```ts
// src/lib/useCountUp.ts
"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, active: boolean, duration = 2000, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [active, target, duration, delay]);
  return value;
}
```

- [ ] **Step 2: Replace the inline hook in CaseStudyStats.tsx**

Delete the local `function useCountUp(...) { ... }` definition (currently near the top of `src/components/CaseStudyStats.tsx`) and add this import after the existing `"use client";` / React import lines:

```ts
import { useCountUp } from "@/lib/useCountUp";
```

- [ ] **Step 3: Verify it compiles and builds**

Run: `npx tsc --noEmit`
Expected: no errors.
Run: `npm run build`
Expected: build completes, `out/` regenerated, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/useCountUp.ts src/components/CaseStudyStats.tsx
git commit -m "refactor: extract useCountUp hook for reuse"
```

---

## Task 2: Define the content types

**Files:**
- Create: `src/lib/work-types.ts`

- [ ] **Step 1: Write the types**

```ts
// src/lib/work-types.ts
export type Tier = "A" | "grid";

export interface CaseMeta {
  year: string;
  services: string[];
  role?: string;
  location?: string;
}

export interface Media {
  src: string;        // repo path ("/work/...") OR full Cloudinary URL
  alt: string;
  kind?: "image" | "video";
}

export interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  unit?: string;
  label: string;
  source: string;     // "GA4" | "Search Console" | "Meta Ads" | ...
  asOf: string;       // "Jan–Apr 2026"
}

export interface Milestone {
  date: string;
  title: string;
  desc: string;
  media?: Media;
}

export type Block =
  | { type: "hero"; client: string; headline: string; meta: CaseMeta; media: Media }
  | { type: "text"; subheading?: string; body: string }
  | { type: "image"; media: Media; caption?: string; fullBleed?: boolean }
  | { type: "gallery"; items: Media[]; layout?: "grid" | "scroll" }
  | { type: "metricRow"; stats: Metric[] }
  | { type: "timeline"; milestones: Milestone[] }
  | { type: "adGallery"; ads: Media[]; note?: string }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "quote"; text: string; author: string; role?: string }
  | { type: "nextCase" };

export interface CaseStudy {
  slug: string;
  client: string;
  headline: string;
  meta: CaseMeta;
  tier: Tier;
  liveUrl?: string;
  thumbnail: string;
  draft?: boolean;
  blocks: Block[];
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/work-types.ts
git commit -m "feat: add portfolio case-study types"
```

---

## Task 3: Add vitest + failing tests for the selectors

**Files:**
- Modify: `package.json` (add vitest devDep + `test` script)
- Create: `vitest.config.ts`
- Create: `src/lib/work-select.test.ts`

- [ ] **Step 1: Install vitest**

Run: `npm install -D vitest`
Expected: vitest added to devDependencies.

- [ ] **Step 2: Add a test script to package.json**

In `package.json`, add to the `"scripts"` object:

```json
"test": "vitest run"
```

- [ ] **Step 3: Create vitest config**

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 4: Write the failing tests**

```ts
// src/lib/work-select.test.ts
import { describe, it, expect } from "vitest";
import type { CaseStudy } from "./work-types";
import { published, featured, grid, bySlug, nextCase } from "./work-select";

const mk = (slug: string, tier: "A" | "grid", draft = false): CaseStudy => ({
  slug,
  client: slug,
  headline: "h",
  meta: { year: "2026", services: [] },
  tier,
  thumbnail: "/x.png",
  draft,
  blocks: [],
});

const cases: CaseStudy[] = [
  mk("a", "A"),
  mk("b", "A"),
  mk("c", "grid"),
  mk("d", "A", true), // draft
];

describe("work-select", () => {
  it("published excludes drafts", () => {
    expect(published(cases).map((c) => c.slug)).toEqual(["a", "b", "c"]);
  });
  it("featured returns only published A-tier in order", () => {
    expect(featured(cases).map((c) => c.slug)).toEqual(["a", "b"]);
  });
  it("grid returns only published grid-tier", () => {
    expect(grid(cases).map((c) => c.slug)).toEqual(["c"]);
  });
  it("bySlug finds a published case, null for draft/missing", () => {
    expect(bySlug(cases, "a")?.slug).toBe("a");
    expect(bySlug(cases, "d")).toBeNull();
    expect(bySlug(cases, "zzz")).toBeNull();
  });
  it("nextCase advances within the featured chain", () => {
    expect(nextCase(cases, "a")?.slug).toBe("b");
  });
  it("nextCase wraps from last featured back to first", () => {
    expect(nextCase(cases, "b")?.slug).toBe("a");
  });
  it("nextCase returns null for a non-featured slug", () => {
    expect(nextCase(cases, "c")).toBeNull();
  });
});
```

- [ ] **Step 5: Run tests to verify they fail**

Run: `npx vitest run src/lib/work-select.test.ts`
Expected: FAIL — `work-select` module not found / functions undefined.

- [ ] **Step 6: Commit the failing tests**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/work-select.test.ts
git commit -m "test: add failing selector tests + vitest setup"
```

---

## Task 4: Implement the pure selectors

**Files:**
- Create: `src/lib/work-select.ts`

- [ ] **Step 1: Implement the selectors**

```ts
// src/lib/work-select.ts
import type { CaseStudy } from "./work-types";

export const published = (cases: CaseStudy[]): CaseStudy[] =>
  cases.filter((c) => !c.draft);

export const featured = (cases: CaseStudy[]): CaseStudy[] =>
  published(cases).filter((c) => c.tier === "A");

export const grid = (cases: CaseStudy[]): CaseStudy[] =>
  published(cases).filter((c) => c.tier === "grid");

export const bySlug = (cases: CaseStudy[], slug: string): CaseStudy | null =>
  published(cases).find((c) => c.slug === slug) ?? null;

export function nextCase(cases: CaseStudy[], slug: string): CaseStudy | null {
  const chain = featured(cases);
  if (chain.length === 0) return null;
  const i = chain.findIndex((c) => c.slug === slug);
  if (i === -1) return null;
  return chain[(i + 1) % chain.length];
}
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx vitest run src/lib/work-select.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 3: Commit**

```bash
git add src/lib/work-select.ts
git commit -m "feat: implement portfolio case selectors"
```

---

## Task 5: Create the registry, a sample case, and the bound loader

**Files:**
- Create: `content/work/team-nebula.ts`
- Create: `content/work/index.ts`
- Create: `src/lib/work.ts`

> Sample copy below is real, placeholder-free starter text to be refined later from the Google Doc; assets (`/case-study-nebula.png`, `/case-study-nebula.jpg`) already exist in `public/`.

- [ ] **Step 1: Create the sample case**

```ts
// content/work/team-nebula.ts
import type { CaseStudy } from "@/lib/work-types";

export const teamNebula: CaseStudy = {
  slug: "team-nebula",
  client: "Team Nebula AI",
  headline: "Scaling an AI operations team with automation and SEO content.",
  meta: {
    year: "2026",
    services: ["Web design", "SEO", "Automation"],
    role: "Design, build, content",
    location: "Remote",
  },
  tier: "A",
  liveUrl: "https://teamnebula.ai",
  thumbnail: "/case-study-nebula.jpg",
  blocks: [
    {
      type: "hero",
      client: "Team Nebula AI",
      headline: "Scaling an AI operations team with automation and SEO content.",
      meta: {
        year: "2026",
        services: ["Web design", "SEO", "Automation"],
        role: "Design, build, content",
        location: "Remote",
      },
      media: { src: "/case-study-nebula.png", alt: "Team Nebula website", kind: "image" },
    },
    {
      type: "text",
      subheading: "The challenge",
      body: "Team Nebula needed a site that matched the sophistication of their AI product and a content engine to build search authority in a crowded space.",
    },
    {
      type: "image",
      media: { src: "/case-study-nebula.jpg", alt: "Team Nebula homepage design" },
      fullBleed: true,
    },
    {
      type: "text",
      subheading: "What we did",
      body: "We designed and built a fast, modern marketing site and stood up an automated SEO content workflow to publish consistently without manual effort.",
    },
    {
      type: "quote",
      text: "The site and content engine gave us a credibility step-change with enterprise prospects.",
      author: "Team Nebula",
      role: "Founding team",
    },
    { type: "nextCase" },
  ],
};
```

- [ ] **Step 2: Create the registry**

```ts
// content/work/index.ts
import type { CaseStudy } from "@/lib/work-types";
import { teamNebula } from "./team-nebula";

// Order here = order of the next-case chain and featured listing.
export const CASES: CaseStudy[] = [teamNebula];
```

- [ ] **Step 3: Create the bound loader**

```ts
// src/lib/work.ts
import { CASES } from "../../content/work";
import * as S from "./work-select";
import type { CaseStudy } from "./work-types";

export const getAllCases = (): CaseStudy[] => S.published(CASES);
export const getFeaturedCases = (): CaseStudy[] => S.featured(CASES);
export const getGridCases = (): CaseStudy[] => S.grid(CASES);
export const getCaseBySlug = (slug: string): CaseStudy | null => S.bySlug(CASES, slug);
export const getNextCase = (slug: string): CaseStudy | null => S.nextCase(CASES, slug);
```

- [ ] **Step 4: Verify compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add content/work src/lib/work.ts
git commit -m "feat: add case registry, sample Team Nebula case, bound loader"
```

---

## Task 6: Build the block components + renderer

**Files:**
- Create all under `src/components/work/`

- [ ] **Step 1: BlockHero**

```tsx
// src/components/work/BlockHero.tsx
import type { CaseMeta, Media } from "@/lib/work-types";

export default function BlockHero({
  client, headline, meta, media,
}: { client: string; headline: string; meta: CaseMeta; media: Media }) {
  return (
    <header className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-12">
      <p className="text-sm uppercase tracking-wide text-gray-500">{client}</p>
      <h1 className="mt-3 text-3xl sm:text-5xl font-semibold text-navy max-w-4xl">{headline}</h1>
      <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
        <div><dt className="text-gray-400">Year</dt><dd className="text-navy">{meta.year}</dd></div>
        <div className="col-span-1 sm:col-span-2"><dt className="text-gray-400">Services</dt><dd className="text-navy">{meta.services.join(", ")}</dd></div>
        {meta.location && <div><dt className="text-gray-400">Location</dt><dd className="text-navy">{meta.location}</dd></div>}
      </dl>
      {media.src && (
        <div className="mt-10">
          <img src={media.src} alt={media.alt} className="w-full rounded-xl" />
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: BlockText**

```tsx
// src/components/work/BlockText.tsx
export default function BlockText({ subheading, body }: { subheading?: string; body: string }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {subheading && <h2 className="text-sm uppercase tracking-wide text-teal mb-3">{subheading}</h2>}
      <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">{body}</p>
    </section>
  );
}
```

- [ ] **Step 3: BlockImage**

```tsx
// src/components/work/BlockImage.tsx
import type { Media } from "@/lib/work-types";

export default function BlockImage({ media, caption, fullBleed }: { media: Media; caption?: string; fullBleed?: boolean }) {
  return (
    <figure className={fullBleed ? "w-full my-12" : "max-w-[1400px] mx-auto px-4 sm:px-6 my-12"}>
      <img src={media.src} alt={media.alt} className={fullBleed ? "w-full" : "w-full rounded-xl"} />
      {caption && <figcaption className="mt-3 text-sm text-gray-500 text-center">{caption}</figcaption>}
    </figure>
  );
}
```

- [ ] **Step 4: BlockGallery**

```tsx
// src/components/work/BlockGallery.tsx
import type { Media } from "@/lib/work-types";

export default function BlockGallery({ items, layout = "grid" }: { items: Media[]; layout?: "grid" | "scroll" }) {
  if (layout === "scroll") {
    return (
      <div className="my-12 flex gap-4 overflow-x-auto px-4 sm:px-6 snap-x">
        {items.map((m, i) => (
          <img key={i} src={m.src} alt={m.alt} className="h-[60vh] w-auto rounded-xl snap-center" />
        ))}
      </div>
    );
  }
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 my-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((m, i) => (
        <img key={i} src={m.src} alt={m.alt} className="w-full rounded-xl" />
      ))}
    </div>
  );
}
```

- [ ] **Step 5: BlockMetricRow** (reuses `useCountUp`)

```tsx
// src/components/work/BlockMetricRow.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { Metric } from "@/lib/work-types";
import { useCountUp } from "@/lib/useCountUp";

function Stat({ m, active }: { m: Metric; active: boolean }) {
  const value = useCountUp(m.value, active);
  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl font-semibold text-navy">
        {m.prefix}{value.toLocaleString()}{m.suffix}{m.unit ? ` ${m.unit}` : ""}
      </div>
      <div className="mt-2 text-gray-700">{m.label}</div>
      <div className="mt-1 text-xs text-gray-400">{m.source} · {m.asOf}</div>
    </div>
  );
}

export default function BlockMetricRow({ stats }: { stats: Metric[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setActive(true), { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} className="max-w-[1400px] mx-auto px-4 sm:px-6 my-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
      {stats.map((m, i) => <Stat key={i} m={m} active={active} />)}
    </section>
  );
}
```

- [ ] **Step 6: BlockTimeline**

```tsx
// src/components/work/BlockTimeline.tsx
import type { Milestone } from "@/lib/work-types";

export default function BlockTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 my-16">
      <ol className="relative border-l border-gray-200 ml-3">
        {milestones.map((m, i) => (
          <li key={i} className="mb-10 ml-6">
            <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-teal" />
            <time className="text-xs uppercase tracking-wide text-gray-400">{m.date}</time>
            <h3 className="text-lg font-semibold text-navy">{m.title}</h3>
            <p className="text-gray-700">{m.desc}</p>
            {m.media && <img src={m.media.src} alt={m.media.alt} className="mt-3 w-full rounded-lg" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 7: BlockAdGallery**

```tsx
// src/components/work/BlockAdGallery.tsx
import type { Media } from "@/lib/work-types";

export default function BlockAdGallery({ ads, note }: { ads: Media[]; note?: string }) {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 my-16">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ads.map((m, i) =>
          m.kind === "video"
            ? <video key={i} src={m.src} controls playsInline className="w-full rounded-lg" />
            : <img key={i} src={m.src} alt={m.alt} className="w-full rounded-lg" />
        )}
      </div>
      {note && <p className="mt-4 text-sm text-gray-500">{note}</p>}
    </section>
  );
}
```

- [ ] **Step 8: BlockVideo** (Cloudinary URL)

```tsx
// src/components/work/BlockVideo.tsx
export default function BlockVideo({ src, poster, caption }: { src: string; poster?: string; caption?: string }) {
  return (
    <figure className="max-w-[1400px] mx-auto px-4 sm:px-6 my-12">
      <video src={src} poster={poster} controls playsInline preload="none" className="w-full rounded-xl" />
      {caption && <figcaption className="mt-3 text-sm text-gray-500 text-center">{caption}</figcaption>}
    </figure>
  );
}
```

- [ ] **Step 9: BlockQuote**

```tsx
// src/components/work/BlockQuote.tsx
export default function BlockQuote({ text, author, role }: { text: string; author: string; role?: string }) {
  return (
    <blockquote className="max-w-3xl mx-auto px-4 sm:px-6 my-16 text-center">
      <p className="text-2xl sm:text-3xl font-medium text-navy leading-snug">“{text}”</p>
      <footer className="mt-4 text-gray-500">— {author}{role ? `, ${role}` : ""}</footer>
    </blockquote>
  );
}
```

- [ ] **Step 10: BlockNextCase** (reads the chain; takeover motion is decoration, later)

```tsx
// src/components/work/BlockNextCase.tsx
import { getNextCase } from "@/lib/work";

export default function BlockNextCase({ currentSlug }: { currentSlug: string }) {
  const next = getNextCase(currentSlug);
  if (!next) return null;
  return (
    <a href={`/work/${next.slug}`} className="block relative mt-24 min-h-screen overflow-hidden group">
      <img src={next.thumbnail} alt={next.client} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
        <p className="text-sm uppercase tracking-wide">Next case study</p>
        <h2 className="mt-3 text-4xl sm:text-6xl font-semibold">{next.client}</h2>
        <span className="mt-8 inline-block rounded-full bg-white text-navy px-6 py-3 text-sm">See next case study →</span>
      </div>
    </a>
  );
}
```

- [ ] **Step 11: CaseRenderer**

```tsx
// src/components/work/CaseRenderer.tsx
import type { Block } from "@/lib/work-types";
import BlockHero from "./BlockHero";
import BlockText from "./BlockText";
import BlockImage from "./BlockImage";
import BlockGallery from "./BlockGallery";
import BlockMetricRow from "./BlockMetricRow";
import BlockTimeline from "./BlockTimeline";
import BlockAdGallery from "./BlockAdGallery";
import BlockVideo from "./BlockVideo";
import BlockQuote from "./BlockQuote";
import BlockNextCase from "./BlockNextCase";

export default function CaseRenderer({ blocks, currentSlug }: { blocks: Block[]; currentSlug: string }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "hero": return <BlockHero key={i} client={b.client} headline={b.headline} meta={b.meta} media={b.media} />;
          case "text": return <BlockText key={i} subheading={b.subheading} body={b.body} />;
          case "image": return <BlockImage key={i} media={b.media} caption={b.caption} fullBleed={b.fullBleed} />;
          case "gallery": return <BlockGallery key={i} items={b.items} layout={b.layout} />;
          case "metricRow": return <BlockMetricRow key={i} stats={b.stats} />;
          case "timeline": return <BlockTimeline key={i} milestones={b.milestones} />;
          case "adGallery": return <BlockAdGallery key={i} ads={b.ads} note={b.note} />;
          case "video": return <BlockVideo key={i} src={b.src} poster={b.poster} caption={b.caption} />;
          case "quote": return <BlockQuote key={i} text={b.text} author={b.author} role={b.role} />;
          case "nextCase": return <BlockNextCase key={i} currentSlug={currentSlug} />;
        }
      })}
    </>
  );
}
```

- [ ] **Step 12: Verify all components compile**

Run: `npx tsc --noEmit`
Expected: no errors (the `switch` is exhaustive over the `Block` union).

- [ ] **Step 13: Commit**

```bash
git add src/components/work
git commit -m "feat: add case-study block components and renderer"
```

---

## Task 7: Case study page route

**Files:**
- Create: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
// src/app/work/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCases, getCaseBySlug } from "@/lib/work";
import CaseRenderer from "@/components/work/CaseRenderer";

export function generateStaticParams() {
  return getAllCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.client} — Case Study | The Ready Consult`,
    description: c.headline,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${c.client} — Case Study`,
    about: c.client,
    headline: c.headline,
    dateCreated: c.meta.year,
    creator: { "@type": "Organization", name: "The Ready Consult" },
    url: `https://www.thereadyconsult.com/work/${c.slug}`,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaseRenderer blocks={c.blocks} currentSlug={c.slug} />
    </main>
  );
}
```

- [ ] **Step 2: Verify the route builds and exports**

Run: `npm run build`
Expected: build succeeds; `out/work/team-nebula/index.html` exists.
Run: `ls out/work/team-nebula/index.html`
Expected: file path prints (no "No such file").

- [ ] **Step 3: Commit**

```bash
git add src/app/work/[slug]/page.tsx
git commit -m "feat: add /work/[slug] case study route"
```

---

## Task 8: Portfolio index route

**Files:**
- Create: `src/app/work/page.tsx`

- [ ] **Step 1: Write the index page**

```tsx
// src/app/work/page.tsx
import type { Metadata } from "next";
import { getFeaturedCases, getGridCases } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work — The Ready Consult",
  description: "Selected websites, video, and marketing work by The Ready Consult.",
};

export default function WorkIndexPage() {
  const featured = getFeaturedCases();
  const grid = getGridCases();

  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-28 pb-24">
      <h1 className="text-4xl sm:text-6xl font-semibold text-navy">Our work</h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl">
        Websites, video, and marketing systems we have designed, built, and grown.
      </p>

      <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {featured.map((c) => (
          <a key={c.slug} href={`/work/${c.slug}`} className="group block">
            <div className="overflow-hidden rounded-xl">
              <img src={c.thumbnail} alt={c.client} className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-navy">{c.client}</h2>
            <p className="text-gray-600">{c.headline}</p>
            <p className="mt-1 text-sm text-gray-400">{c.meta.services.join(" · ")}</p>
          </a>
        ))}
      </section>

      {grid.length > 0 && (
        <section className="mt-24">
          <h2 className="text-sm uppercase tracking-wide text-gray-400">More work</h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {grid.map((c) => (
              <a key={c.slug} href={`/work/${c.slug}`} className="group block">
                <img src={c.thumbnail} alt={c.client} className="w-full aspect-square object-cover rounded-lg" />
                <p className="mt-2 text-sm text-navy">{c.client}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify build/export**

Run: `npm run build`
Expected: build succeeds; `out/work/index.html` exists.
Run: `ls out/work/index.html`
Expected: file path prints.

- [ ] **Step 3: Commit**

```bash
git add src/app/work/page.tsx
git commit -m "feat: add /work portfolio index"
```

---

## Task 9: Rewire the homepage case-study teaser to the registry

**Files:**
- Modify: `src/components/CaseStudies.tsx`

> Currently `CaseStudies.tsx` has a hardcoded `studies` array (Cluely/Ampere/Perfecto/Nebula) with no links. Replace the data source with the registry and link each card to its case page. Keep the existing visual/scroll markup; only change where the data comes from and add the link.

- [ ] **Step 1: Replace the data source**

At the top of `src/components/CaseStudies.tsx`, remove the hardcoded `const studies = [ ... ];` array and derive cards from the registry instead. Add this import near the other imports:

```ts
import { getAllCases } from "@/lib/work";
```

Then, inside the component (before `return`), build the list:

```ts
const studies = getAllCases().map((c) => ({
  slug: c.slug,
  name: c.client,
  tag: c.meta.services[0] ?? "Work",
  desc: c.headline,
  link: `Read ${c.client}'s story`,
  image: c.thumbnail,
}));
```

> Note: `getAllCases` reads the filesystem-free registry (plain TS import), so it is safe to call from this `"use client"` component because the data is statically bundled. If the build complains about importing server data into a client component, hoist the `studies` mapping into the parent server component (`src/app/page.tsx`) and pass `studies` as a prop to `<CaseStudies studies={studies} />`; update the component signature to `export default function CaseStudies({ studies }: { studies: {slug:string;name:string;tag:string;desc:string;link:string;image:string}[] })`.

- [ ] **Step 2: Wrap each card in a link**

Find the card `article` element in the existing markup and wrap it (or its outer container) in an anchor to the case page. Where each card is rendered (the `.map((s, i) => ( ... ))`), make the outer element:

```tsx
<a href={`/work/${s.slug}`} key={s.name} className="block">
  {/* existing article/card markup unchanged */}
</a>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds, homepage still renders, cards link to `/work/<slug>`.

- [ ] **Step 4: Commit**

```bash
git add src/components/CaseStudies.tsx src/app/page.tsx
git commit -m "feat: wire homepage case teaser to portfolio registry"
```

---

## Task 10: Add the "Work" nav link

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Add to the Navbar links array**

In `src/components/Navbar.tsx`, add to the links array (which currently holds Services/Process/Blog):

```ts
{ label: "Work", href: "/work" },
```

Place it before the Blog entry so order reads Services · Process · Work · Blog.

- [ ] **Step 2: Add to the Footer**

In `src/components/Footer.tsx`, add a link to `/work` alongside the existing nav/footer links (match the surrounding link markup — find an existing `<a href="/blog"` and add a sibling `<a href="/work" ...>Work</a>` with the same className).

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds; "Work" appears in nav and footer.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "feat: add Work link to nav and footer"
```

---

## Task 11: Full verification pass

- [ ] **Step 1: Type-check, unit tests, and build all green**

Run: `npx tsc --noEmit && npx vitest run && npm run build`
Expected: tsc clean, vitest 7 passing, build completes with `out/work/index.html` and `out/work/team-nebula/index.html`.

- [ ] **Step 2: Manual smoke (optional, recommended)**

Run: `npx serve out` (or `npm run start` after build) and visit `/work` and `/work/team-nebula`.
Expected: index shows the Team Nebula card; the case page renders hero → text → image → text → quote → next-case takeover; the homepage teaser links into `/work/...`.

- [ ] **Step 3: Final commit (if any staged changes remain)**

```bash
git add -A
git commit -m "chore: portfolio groundwork verification pass"
```

---

## Notes for the implementer

- **Decoration is out of scope.** Hero AI videos, scroll-takeover motion, count-up tuning, and per-client styling come later. Components are intentionally minimal but functional.
- **Adding a real case** later = create `content/work/<slug>.ts`, add it to `content/work/index.ts` in the desired order, drop images in `public/work/<slug>/`, and reference Cloudinary URLs for video. No component changes.
- **Metrics** are added as a `metricRow` block with real, source-attributed, date-anchored values pulled via `seo_tool` GA4/GSC — only after verification.
- **`navy` / `teal` Tailwind colors** are used by existing components; if a class doesn't resolve, check `globals.css` / Tailwind config for the project's color tokens and match them.
