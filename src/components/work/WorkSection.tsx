"use client";

import { getFeaturedCases } from "@/lib/work";
import WorkShowcase from "./WorkShowcase";

// Homepage "Our work" section: heading → full-bleed case scroll with tracking pill.
export default function WorkSection() {
  const featured = getFeaturedCases();
  if (featured.length === 0) return null;

  return (
    <section aria-label="Our work">
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl sm:text-7xl font-semibold text-navy leading-none">Our work</h2>
        <a
          href="/work"
          className="mt-2 text-5xl sm:text-7xl font-semibold leading-none text-gray-300 hover:text-navy no-underline transition-colors"
        >
          See all
        </a>
      </div>
      <WorkShowcase cases={featured} />
    </section>
  );
}
