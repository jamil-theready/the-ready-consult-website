"use client";

import { useEffect, useRef, useState } from "react";

const words = "We build your website, rank you on Google and AI search, produce content that converts, and automate everything else.".split(" ");
const keywordIndexes = new Set([1, 4, 14, 16]);

export default function Mission() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const sectionHeight = el.offsetHeight;
      const vh = window.innerHeight;
      const stickyRange = Math.max(1, sectionHeight - vh);
      const p = Math.max(0, Math.min(1, -rect.top / stickyRange));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={ref} className="bg-white relative" style={{ height: "220vh" }}>
      {/* Subtle background dots */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.025 }}>
        <svg className="w-full h-full">
          {Array.from({ length: 40 }).map((_, i) => {
            const x = `${8 + (i % 8) * 12}%`;
            const y = `${10 + Math.floor(i / 8) * 18}%`;
            return (
              <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor">
                <animate attributeName="opacity" values="0.3;1;0.3" dur={`${4 + (i % 3)}s`} begin={`${i * 0.2}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        </svg>
      </div>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 w-full">
        <p className="text-[clamp(2rem,5.5vw,4.5rem)] font-medium leading-[1.2] tracking-tight max-w-[900px]">
          {words.map((word, i) => {
            const wordProgress = Math.max(0, Math.min(1, (progress * words.length - i) / 1.5));
            const isKeyword = keywordIndexes.has(i);
            const color = isKeyword
              ? `rgba(220, 38, 38, ${0.15 + wordProgress * 0.85})`
              : `rgba(10, 37, 64, ${0.1 + wordProgress * 0.9})`;
            return (
              <span
                key={i}
                className="inline-block mr-[0.3em] transition-none"
                style={{ color }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
      </div>
    </section>
  );
}
