# TRC Portfolio — Case Studies Design Spec

**Date:** 2026-06-05
**Status:** Approved groundwork (decoration deferred)
**Repo:** TRC Website (Next.js 15 App Router · Tailwind · static export → Cloudflare Pages)

---

## 1. Goal

Add a portfolio section to the TRC website that showcases agency work (websites, videos, marketing results) as individual, visually rich **case studies** — inspired by [analogueagency.com](https://analogueagency.com/case/ilgm): big full-bleed visuals, narrative structure, and a continuous "doomscroll" where the end of one case becomes a full-screen takeover into the next.

This spec defines the **groundwork only**: routing, content model, the block library, asset storage, and the metrics strategy. It is the foundation that later "decoration" work (AI hero animations, scroll-takeover motion, count-up animation, per-client styling) drops into without structural changes.

## 2. Non-Goals (deferred to "decorate" phase)

- AI-generated hero animations (user will produce via AI video generator)
- The scroll-takeover motion/physics for the next-case transition
- Final per-client visual styling / distinct visual identity per case
- Count-up + scroll-reveal animation polish (the *hook* is reused now; the *tuning* is later)
- Final copywriting of each case narrative

## 3. Information Architecture

Mirrors the existing `blog/[slug]` pattern so it static-exports cleanly.

```
/work              → portfolio index: hero + featured (A-tier) cases + "more work" grid (grid-tier)
/work/[slug]       → one case study: block-rendered body + next-case takeover
```

- `generateStaticParams` enumerates all non-draft case slugs (same approach as blog).
- The existing homepage `CaseStudies.tsx` teaser (currently placeholder cards: Cluely, Ampere, Nebula) is **rewired** to pull from the real case registry and link to `/work/[slug]`.

## 4. Content Model — block-based, one typed file per case

Chosen over markdown-frontmatter (too rigid for full-bleed visuals + animated metric blocks + timelines) and over hardcoded React pages (doesn't scale past a few cases).

Each case lives in `content/work/<slug>.ts` and exports a typed `CaseStudy`. A registry file sets the order.

```ts
// src/lib/work-types.ts
export type Tier = "A" | "grid";

export interface CaseMeta {
  year: string;            // "2026"
  services: string[];      // ["Web design", "SEO", "Automation"]
  role?: string;           // "Design, build, automation"
  location?: string;       // "Sacramento, CA"
}

export interface CaseStudy {
  slug: string;
  client: string;          // "Gina Notary"
  headline: string;        // hero value-prop sentence
  meta: CaseMeta;
  tier: Tier;
  liveUrl?: string;
  thumbnail: string;       // index card image (repo path)
  draft?: boolean;
  blocks: Block[];         // ordered body
  // nextSlug is derived from the registry order, not stored here
}
```

### Registry + loader

```ts
// content/work/index.ts  — explicit order drives the doomscroll chain + featured order
import { gina } from "./gina-notary";
import { perfecto } from "./perfecto-homes";
// ...
export const CASES: CaseStudy[] = [gina, perfecto, /* ... */];

// src/lib/work.ts  — mirrors src/lib/content.ts conventions
getAllCases(): CaseStudy[]            // non-draft, registry order
getFeaturedCases(): CaseStudy[]       // tier === "A"
getGridCases(): CaseStudy[]           // tier === "grid"
getCaseBySlug(slug): CaseStudy | null
getNextCase(slug): CaseStudy | null   // next A-tier in registry order (wraps to first)
```

Only **A-tier** cases participate in the next-case chain. Grid-tier cases are excluded from the doomscroll and appear only in the "more work" grid.

## 5. Block Library

Each block is an isolated, independently-stylable React component. A single `<CaseRenderer blocks={blocks} />` maps `block.type` → component. Adding a future need = add one block type; every case can then use it.

```ts
export type Block =
  | { type: "hero"; client: string; headline: string; meta: CaseMeta; media: Media }
  | { type: "text"; subheading?: string; body: string }          // Challenge / Solution narrative
  | { type: "image"; media: Media; caption?: string; fullBleed?: boolean }
  | { type: "gallery"; items: Media[]; layout?: "grid" | "scroll" }
  | { type: "metricRow"; stats: Metric[] }                        // animated count-up
  | { type: "timeline"; milestones: Milestone[] }                 // NurtureMe "journey with us"
  | { type: "adGallery"; ads: Media[]; note?: string }            // NurtureMe ad creatives
  | { type: "video"; src: string; poster?: string; caption?: string } // Cloudinary URL
  | { type: "quote"; text: string; author: string; role?: string }
  | { type: "nextCase" };                                         // full-screen takeover (auto)

export interface Media { src: string; alt: string; kind?: "image" | "video"; } // src = repo path or Cloudinary URL
export interface Metric { value: number; prefix?: string; suffix?: string; unit?: string; label: string; source: string; asOf: string; }
export interface Milestone { date: string; title: string; desc: string; media?: Media; }
```

**Reuse:** the `useCountUp` hook already in `src/components/CaseStudyStats.tsx` is extracted to `src/lib/useCountUp.ts` and consumed by the `metricRow` block (no new animation code).

### Block → component map

| Block | Component | Notes |
|---|---|---|
| `hero` | `BlockHero` | client, headline, meta strip, hero media slot (image now / AI video later) |
| `text` | `BlockText` | optional subheading + body paragraph(s) |
| `image` | `BlockImage` | single, optional full-bleed |
| `gallery` | `BlockGallery` | grid or horizontal scroll |
| `metricRow` | `BlockMetricRow` | uses shared `useCountUp`; renders source + `asOf` |
| `timeline` | `BlockTimeline` | NurtureMe journey (text + visual milestones) |
| `adGallery` | `BlockAdGallery` | NurtureMe ad creatives |
| `video` | `BlockVideo` | Cloudinary-hosted, lazy |
| `quote` | `BlockQuote` | testimonial |
| `nextCase` | `BlockNextCase` | reads `getNextCase()`, full-screen cover + "see next case study" |

Interactive blocks (`metricRow`, `gallery` scroll, `nextCase`) are `"use client"`; static blocks stay server components. Compatible with static export.

## 6. Asset Storage

Three layers — the user's "store on the TRC folder" instinct holds for **masters**; delivery is split so the repo stays lean and Cloudflare limits are respected.

| Asset | Lives where | Referenced as |
|---|---|---|
| **Masters** (hi-res originals, raw video exports) | `The Ready/portfolio-assets/<client>/` (TRC folder, archive of truth — not in repo) | n/a |
| **Web images** (case visuals, thumbnails) | repo `public/work/<slug>/` (optimized, committed) | `/work/<slug>/<file>` |
| **Videos** (demos + AI hero animations) | **Cloudinary** (existing account; `seo_tool/integrations/cloudinary_img.py` already wired) | full Cloudinary URL |

Decision: bulk images stay in-repo (free, instant, version-controlled); Cloudinary is used for **video + any oversized hero image**. Switching an individual image to Cloudinary later is just changing its `src` string — no structural impact.

> Existing relevant assets already in `public/`: `case-study-perfecto.png`, `pefectohomes.png`, `demo-video.mp4`. Reuse where valid.

## 7. Metrics — frozen snapshots, not live feeds

A portfolio stat must be true permanently and never contradict a live dashboard. Therefore:

1. Pulled once per client via `seo_tool` GA4 (`ga4.py`) + Search Console (`gsc.py`) integrations, plus Meta Ads / Stripe where relevant.
2. **Verified against source** before inclusion.
3. **Frozen** as static values in the case file's `metricRow`, each carrying `source` + `asOf` (e.g. `"+148% organic", source "GA4", asOf "Jan–Apr 2026"`).
4. Rendered with count-up animation; the displayed window/date makes it durable.

Only real, verifiable numbers. New builds with no meaningful data (e.g. H&S, Javier Alvarado) are **design/build** cases (no `metricRow`), not results cases.

**NurtureMe special case:** no metrics block for now — showcased via `adGallery` (the ads) + `timeline` (the journey with TRC). Metrics can be added later when results mature.

## 8. Case Inventory & Tiers

Source of truth: the fill-in Google Doc ("TRC Portfolio — Work Inventory"). Tiers (`A` = full case study, `grid` = logo/thumbnail, `skip`) are finalized from the user's answers. Known candidates: Gina Notary, Perfecto Homes, Valylac, Alexa's Cleaning, JML Painting, H&S Insulation, Growth2Success/NurtureMe, Deliver Group, GreenSonqo, Justo, Javier Alvarado, **Team Nebula** (TRC-built site). Final list pending the doc.

**Production / subcontract pieces (honest framing):** Some pieces are video-production/editing work delivered as a subcontractor, NOT full agency engagements — e.g. **Cluely** (video editing) and **Ampere** (video). These are showcased as *video* cases (`video` + `gallery` blocks), labeled by the actual service rendered ("Video production / editing"), and must never be presented in a way that implies a full client relationship or results we didn't produce. Source videos come from TRC's edit team originals (preferred over Instagram re-compressions); Instagram links are reference only, never the embed source.

## 9. File / Directory Layout (new + touched)

```
content/work/
  index.ts                    # registry (order)
  gina-notary.ts              # one CaseStudy per file
  perfecto-homes.ts
  ...
src/lib/
  work-types.ts               # CaseStudy + Block types
  work.ts                     # loader (mirrors content.ts)
  useCountUp.ts               # extracted from CaseStudyStats.tsx
src/app/work/
  page.tsx                    # /work index
  [slug]/page.tsx             # case study page
src/components/work/
  CaseRenderer.tsx
  BlockHero.tsx  BlockText.tsx  BlockImage.tsx  BlockGallery.tsx
  BlockMetricRow.tsx  BlockTimeline.tsx  BlockAdGallery.tsx
  BlockVideo.tsx  BlockQuote.tsx  BlockNextCase.tsx
public/work/<slug>/           # per-case web images
docs/superpowers/specs/2026-06-05-portfolio-case-studies-design.md
```

Touched: `src/components/CaseStudies.tsx` (rewire to real registry), `src/components/CaseStudyStats.tsx` (export `useCountUp`).

## 10. Build / Export Considerations

- Static export (`output: export`) — every `/work/[slug]` pre-rendered via `generateStaticParams`.
- Interactive blocks use `"use client"`; no server-only APIs at runtime.
- JSON-LD: add `CreativeWork`/`Article`-style schema per case via existing `src/lib/schema.ts` pattern (parity with blog SEO).
- Sitemap: `next-sitemap` picks up new routes automatically.

## 11. Open Items (resolve during planning, non-blocking)

- Final tier assignments (from Google Doc).
- Whether the `/work` index hero gets its own AI animation (decoration).
- Cloudinary folder naming convention for portfolio videos.

---

## Success Criteria

- A visitor can open `/work`, see featured cases + a "more work" grid, click into a case study, scroll a block-rendered narrative with real frozen metrics, and at the bottom be pulled into the next case.
- Adding a new case = create one `content/work/<slug>.ts` file + drop assets; no component changes.
- All metrics shown are real, source-attributed, and date-anchored.
- Everything static-exports and deploys to Cloudflare Pages with no regressions.
