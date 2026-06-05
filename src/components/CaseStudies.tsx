"use client";

import { useRef, useState, useEffect } from "react";
import { getAllCases } from "@/lib/work";

const studies = getAllCases().map((c) => ({
  slug: c.slug,
  name: c.client,
  tag: c.meta.services[0] ?? "Work",
  desc: c.headline,
  link: `Read ${c.client}'s story`,
  image: c.thumbnail,
}));

export default function CaseStudies() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector("article")?.offsetWidth ?? 400;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -cardWidth - 20 : cardWidth + 20,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header row */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-gray-400 text-xs tracking-[0.3em] uppercase mb-3 flex items-center gap-2"><span className="text-[10px]">&#10022;</span> Case studies <span className="text-[10px]">&#10022;</span></p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-navy tracking-tight">
              Results that speak
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous case study"
              className="w-11 h-11 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-navy hover:border-gray-400 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next case study"
              className="w-11 h-11 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-navy hover:border-gray-400 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-6 px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {studies.map((s, i) => (
            <a
              key={s.name}
              href={`/work/${s.slug}`}
              className="block snap-start shrink-0 group cursor-pointer no-underline"
              style={{
                width: isMobile ? "280px" : hovered === i ? "420px" : "400px",
                transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <article>
                {/* Card image area */}
                <div
                  className="relative rounded-2xl overflow-hidden mb-5 bg-black h-[360px] sm:h-[440px] md:h-[530px]"
                  style={{ boxShadow: "0 20px 50px -12px rgba(0,0,0,0.15), 0 8px 20px -8px rgba(0,0,0,0.1)" }}
                >
                  {/* Background image */}
                  <img
                    src={s.image}
                    alt={s.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />

                  {/* Bottom gradient for text legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Company name bottom-left */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <span className="text-white font-semibold text-base md:text-lg tracking-tight">
                      {s.name}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-[15px] md:text-base leading-relaxed mb-3 pr-4">
                  {s.desc}
                </p>

                {/* Link */}
                <span className="inline-flex items-center gap-1.5 text-teal font-semibold text-[15px] group-hover:gap-2.5 transition-all">
                  {s.link}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </article>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
