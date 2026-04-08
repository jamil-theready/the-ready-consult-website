"use client";

import { useEffect, useRef, useState } from "react";

const words = "We build your website, rank you on Google and AI search, produce content that converts, and automate everything else.".split(" ");

export default function Mission() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.15;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={ref} className="bg-white py-16 sm:py-28 lg:py-40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <p className="text-[clamp(2rem,4.5vw,3.75rem)] font-medium leading-[1.15] tracking-tight max-w-[900px]">
          {words.map((word, i) => {
            const wordProgress = Math.max(0, Math.min(1, (progress * words.length - i) / 1.5));
            return (
              <span
                key={i}
                className="inline-block mr-[0.3em] transition-none"
                style={{
                  color: `rgba(10, 37, 64, ${0.1 + wordProgress * 0.9})`,
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
