"use client";

import { useEffect, useState } from "react";
import HeroVisual from "./HeroVisual";

export default function Hero({ ready }: { ready?: boolean }) {
  const [count, setCount] = useState(0);
  const [reveal, setReveal] = useState(0);

  useEffect(() => {
    if (!ready) return;
    // Stagger reveal: 0=stat, 1=headline, 2=ctas, 3=visual, 4=logos
    [0, 200, 400, 700, 1000].forEach((d, i) => {
      setTimeout(() => setReveal(i + 1), d);
    });

    let current = 0;
    const target = 2400000;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      setCount(Math.floor(current));
    }, interval);
    return () => clearInterval(timer);
  }, [ready]);

  const r = (step: number) => ({
    opacity: reveal >= step ? 1 : 0,
    transform: reveal >= step ? "translateY(0)" : "translateY(30px)",
    transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  });

  return (
    <section className="relative bg-white min-h-[100vh] flex flex-col overflow-hidden">
      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 w-full pt-24 sm:pt-32 pb-12 sm:pb-20 flex-1 flex flex-col justify-center items-center text-center">
        <p className="text-[14px] text-gray-500 mb-6" style={r(1)}>
          Revenue influenced for clients:{" "}
          <span className="text-blue font-medium">
            ${count.toLocaleString()}+
          </span>
        </p>

        <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] max-w-[860px]" style={r(2)}>
          <span className="text-navy">#1 AI-native agency</span>
          <br />
          <span className="text-gray-400">that builds, ranks,</span>
          <br />
          <span className="text-gray-400">and automates.</span>
        </h1>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4" style={r(3)}>
          <a
            href="https://calendly.com/thereadyconsult/discovery"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn relative inline-flex items-center gap-2.5 text-white font-semibold text-[16px] px-10 py-4.5 rounded-2xl hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 overflow-hidden group"
          >
            <span className="absolute inset-0 cta-shimmer" />
            <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              boxShadow: "inset 0 0 20px rgba(255,255,255,0.08), 0 0 40px rgba(255,255,255,0.06)",
            }} />
            <svg className="w-5 h-5 relative z-10 group-hover:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="relative z-10">Book a Call</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 text-gray-500 font-semibold text-[15px] px-7 py-4 rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-navy transition-all"
          >
            See how it works
          </a>
        </div>

        <div className="mt-12 w-full" style={r(4)}>
          <div className="hidden lg:block">
            <HeroVisual />
          </div>
          <div className="block lg:hidden overflow-hidden rounded-2xl border border-gray-200 mx-auto max-w-[340px]" style={{ height: "320px" }}>
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
