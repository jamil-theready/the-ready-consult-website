"use client";

import { useEffect, useRef, useState } from "react";
import N8nFlow from "./N8nFlow";
import VideoVisual from "./VideoVisual";
import SeoVisual from "./SeoVisual";
import WebsiteVisual from "./WebsiteVisual";
import MetaAdsVisual from "./MetaAdsVisual";

const features = [
  {
    title: "Websites That Convert",
    desc: "Custom-built, blazing fast sites designed to turn visitors into customers. Mobile-first, SEO-ready from day one.",
    visual: <WebsiteVisual />,
  },
  {
    title: "Rank Everywhere Online",
    desc: "We get you found on Google, ChatGPT, Perplexity, and AI Overviews. Traditional SEO meets AI search optimization.",
    visual: <SeoVisual />,
  },
  {
    title: "Scroll Stopping Videos",
    desc: "Brand stories and short-form content that drive engagement. 48hr turnaround, color grading, captions included.",
    visual: <VideoVisual />,
  },
  {
    title: "Automate Your Growth",
    desc: "Custom AI agents and workflows that eliminate busywork and scale your operations without adding headcount.",
    visual: <N8nFlow />,
  },
  {
    title: "Meta Ads That Convert",
    desc: "Facebook and Instagram campaigns built on real competitive research, not guesswork. Targeted, tested, and optimized for cost per lead.",
    visual: <MetaAdsVisual />,
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
      const idx = Math.min(features.length - 1, Math.floor(progress * features.length));
      setActive(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: `${(features.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 lg:gap-16 items-start lg:items-center pt-0 lg:pt-0">
          {/* Left — feature list */}
          <div>
            <p className="text-gray-400 text-xs tracking-[0.3em] uppercase mb-6 flex items-center gap-2"><span className="text-[10px]">&#10022;</span> Services <span className="text-[10px]">&#10022;</span></p>
            <div className="space-y-0">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`border-t border-gray-200 ${i === features.length - 1 ? "border-b" : ""}`}
                >
                  <button
                    onClick={() => {
                      if (!sectionRef.current) return;
                      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
                      const sectionHeight = sectionRef.current.scrollHeight - window.innerHeight;
                      const target = sectionTop + (i / features.length) * sectionHeight + 1;
                      window.scrollTo({ top: target, behavior: "smooth" });
                    }}
                    className="w-full text-left py-5"
                  >
                    <h3
                      className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 ${
                        i === active ? "text-navy" : "text-gray-300"
                      }`}
                    >
                      {f.title}
                    </h3>

                    <div
                      className="overflow-hidden transition-all duration-500 ease-out"
                      style={{
                        maxHeight: i === active ? "200px" : "0px",
                        opacity: i === active ? 1 : 0,
                      }}
                    >
                      <p className="text-gray-500 text-[15px] leading-relaxed mt-3 pr-8">
                        {f.desc}
                      </p>
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-1.5 text-navy font-semibold text-[15px] mt-4 hover:text-teal transition-colors"
                      >
                        Learn more
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </a>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual */}
          <div className="hidden lg:block">
            <div className="relative w-full" style={{ height: "75vh", maxHeight: "700px" }}>
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="absolute inset-0"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: i === active
                      ? "translateX(0) scale(1)"
                      : "translateX(60px) scale(0.97)",
                    transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    pointerEvents: i === active ? "auto" : "none",
                  }}
                >
                  {f.visual}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile visual */}
          <div className="block lg:hidden mt-4">
            <div className="relative w-full overflow-hidden rounded-xl" style={{ height: "350px" }}>
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="absolute inset-0 scale-[0.55] origin-top-left"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    pointerEvents: i === active ? "auto" : "none",
                    width: "182%",
                    height: "182%",
                  }}
                >
                  {f.visual}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
