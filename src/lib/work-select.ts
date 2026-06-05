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
