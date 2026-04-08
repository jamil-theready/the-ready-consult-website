"use client";

import { useEffect, useState } from "react";

const logos = [
  "Perfecto Homes",
  "Gina Notary",
  "Ameca Plumbing",
  "Justo Cleaning",
  "TNN Precast",
  "Mai Niti",
];

export default function Hero() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = 2400000;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-white min-h-[100vh] flex flex-col overflow-hidden">

      {/* Content */}
      <div className="relative max-w-[1280px] mx-auto px-6 w-full pt-32 pb-20 flex-1 flex flex-col justify-center">
        <p className="text-[14px] text-gray-500 mb-6">
          Revenue influenced for clients:{" "}
          <span className="text-blue font-medium">
            ${count.toLocaleString()}+
          </span>
        </p>

        <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] max-w-[860px]">
          <span className="text-navy">AI-native studio </span>
          <span className="text-gray-400">
            building websites, SEO, video, and automations for high-growth businesses.
          </span>
        </h1>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="https://calendly.com/thereadyconsult/discovery"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn relative inline-flex items-center gap-2.5 text-white font-semibold text-[16px] px-10 py-4.5 rounded-2xl hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 overflow-hidden group"
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 cta-shimmer" />
            {/* Border glow */}
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
      </div>

      {/* Logo bar */}
      <div className="relative border-t border-gray-100 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex items-center justify-between overflow-x-auto gap-10">
          {logos.map((name) => (
            <span
              key={name}
              className="text-[14px] font-semibold text-gray-300 tracking-wide uppercase whitespace-nowrap select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
