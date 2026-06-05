"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseStudy } from "@/lib/work-types";

// Full-bleed vertical scroll of case panels with a floating pill that tracks
// whichever case is currently in view (Analogue-style /work index).
export default function WorkShowcase({ cases }: { cases: CaseStudy[] }) {
  const [current, setCurrent] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setCurrent(Number((e.target as HTMLElement).dataset.idx));
          }
        });
      },
      { threshold: 0.5 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const active = cases[current];

  return (
    <>
      {/* Floating tracking pill */}
      {active && (
        <a
          href={`/work/${active.slug}`}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full bg-white/90 backdrop-blur px-3 py-2 pr-5 shadow-lg ring-1 ring-black/5 no-underline transition-all"
        >
          <img src={active.thumbnail} alt="" className="w-9 h-9 rounded-full object-cover" />
          <span className="text-sm font-semibold text-navy">{active.client}</span>
          <span className="text-xs uppercase tracking-wide text-gray-400 ml-2">See case →</span>
        </a>
      )}

      {/* Full-screen case panels */}
      {cases.map((c, i) => (
        <section
          key={c.slug}
          data-idx={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="relative h-screen w-full"
        >
          <a href={`/work/${c.slug}`} className="block w-full h-full">
            <img src={c.thumbnail} alt={c.client} className="w-full h-full object-cover" />
          </a>
        </section>
      ))}
    </>
  );
}
