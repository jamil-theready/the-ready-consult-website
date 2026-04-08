"use client";

import { useRef, useState } from "react";

const studies = [
  {
    name: "Team Nebula AI",
    tag: "AI",
    desc: "Team Nebula scales AI-powered operations with a full-funnel growth strategy from The Ready Consult.",
    link: "Read Team Nebula's story",
    image: "/case-study-nebula.jpg",
  },
  {
    name: "Perfecto Homes",
    tag: "Real Estate",
    desc: "Perfecto Homes doubles qualified leads with SEO, content automation, and listing syndication.",
    link: "Read Perfecto's story",
    image: "/case-study-perfecto.png",
  },
  {
    name: "Ampere Computing",
    tag: "Video",
    desc: "Ampere Computing elevates brand storytelling with cinematic video production and distribution.",
    link: "Read Ampere's story",
    image: "/case-study-ampere.png",
    fallback: {
      gradient: "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
      pattern: "radial-gradient(circle at 60% 40%, rgba(255,107,138,0.3) 0%, transparent 45%), radial-gradient(circle at 25% 75%, rgba(99,91,255,0.25) 0%, transparent 45%)",
      icon: (
        <svg viewBox="0 0 120 120" fill="none" className="w-24 h-24 md:w-32 md:h-32 opacity-80">
          <rect x="15" y="28" width="90" height="64" rx="8" stroke="rgba(255,107,138,0.5)" strokeWidth="2" fill="rgba(255,107,138,0.06)" />
          <path d="M50 44V76L80 60L50 44Z" fill="rgba(255,107,138,0.6)" />
        </svg>
      ),
    },
  },
];

export default function CaseStudies() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector("article")?.offsetWidth ?? 400;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -cardWidth - 20 : cardWidth + 20,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header row */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-teal font-semibold text-[15px] mb-3">Case studies</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
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
            <article
              key={s.name}
              className="snap-start shrink-0 group cursor-pointer"
              style={{
                width: hovered === i ? "420px" : "400px",
                transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Card image area */}
              <div
                className={`relative rounded-2xl overflow-hidden border border-gray-200 mb-5 ${s.fallback?.gradient ?? "bg-navy"}`}
                style={{ height: "530px" }}
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

                {/* Fallback only — renders behind image, visible if image fails */}
                {s.fallback && (
                  <>
                    <div
                      className="absolute inset-0 opacity-80"
                      style={{ background: s.fallback.pattern }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {s.fallback.icon}
                    </div>
                  </>
                )}

                {/* Bottom gradient for text legibility */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Company name bottom-left */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="text-white font-bold text-xl md:text-2xl tracking-wide uppercase">
                    {s.name}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-[15px] md:text-base leading-relaxed mb-3 pr-4">
                {s.desc}
              </p>

              {/* Link */}
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-teal font-semibold text-[15px] group-hover:gap-2.5 transition-all"
              >
                {s.link}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
