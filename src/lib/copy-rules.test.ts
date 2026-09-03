import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// The homepage used to sell to B2B SaaS and funded startups. These phrases are
// easy to reintroduce by copy and paste, so the build fails on them instead of
// relying on anyone remembering.
const BANNED = [
  "fractional CMO",
  "growth partner",
  "AI-first",
  "AI-native",
  "outcome-driven",
  "72-hour test loop",
  "B2B SaaS",
  "funded startups",
  "traditional agency",
  "product-market fit",
];

const HOMEPAGE_FILES = [
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/components/Hero.tsx",
  "src/components/HeroVisual.tsx",
  "src/components/Mission.tsx",
  "src/components/ServicesTabs.tsx",
  "src/components/Pricing.tsx",
  "src/components/pricing-data.ts",
  "src/components/SystemDiagram.tsx",
  "src/components/FAQ.tsx",
  "src/components/faq-data.ts",
  "src/components/Footer.tsx",
];

describe("homepage copy", () => {
  it.each(HOMEPAGE_FILES)("%s carries no off-niche jargon", (file) => {
    const text = readFileSync(join(process.cwd(), file), "utf8").toLowerCase();
    const found = BANNED.filter((phrase) => text.includes(phrase.toLowerCase()));
    expect(found).toEqual([]);
  });

  it("does not publish a revenue figure anywhere on the homepage", () => {
    const offenders = HOMEPAGE_FILES.filter((file) =>
      /\$\s?[\d,]{4,}/.test(readFileSync(join(process.cwd(), file), "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
