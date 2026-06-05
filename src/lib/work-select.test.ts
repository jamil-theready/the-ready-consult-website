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
