"use client";

import { getFeaturedCases } from "@/lib/work";
import WorkShowcase from "./WorkShowcase";

// Homepage "Our work" section: heading → full-bleed case scroll with tracking pill.
export default function WorkSection() {
  const featured = getFeaturedCases();
  if (featured.length === 0) return null;

  return (
    <section aria-label="Our work">
      <div className="min-h-[68vh] flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue mb-6">Selected work</p>
        <h2 className="text-6xl sm:text-8xl font-semibold text-navy leading-[0.95] tracking-tight">Our work</h2>
        <p className="mt-6 max-w-xl text-lg text-gray-500">
          Websites, brand, and growth systems we have designed, built, and scaled for real businesses.
        </p>
        <a
          href="/work"
          className="group mt-8 inline-flex items-center gap-2 text-base font-medium text-navy no-underline"
        >
          See all work
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
      <WorkShowcase cases={featured} />
    </section>
  );
}
