"use client";

import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/lib/useCountUp";

const stats = [
  {
    value: 55,
    suffix: "+",
    unit: "leads/mo",
    label: "from SEO & content",
    service: "SEO",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal",
    barHeights: [15, 22, 18, 30, 25, 42, 38, 55, 48, 65, 60, 78],
  },
  {
    value: 135,
    suffix: "K+",
    unit: "views",
    label: "across video content",
    service: "Video",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-600",
    barHeights: [20, 35, 28, 45, 40, 58, 52, 70, 65, 82, 78, 95],
  },
  {
    value: 20,
    suffix: "+",
    unit: "hrs saved",
    label: "weekly with AI workflows",
    service: "Automations",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
    barHeights: [30, 42, 38, 55, 48, 62, 58, 72, 68, 80, 75, 90],
  },
  {
    value: 3,
    suffix: "x",
    unit: "faster",
    label: "site speed after rebuild",
    service: "Websites",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    gradient: "from-blue-500 to-indigo-600",
    barHeights: [10, 15, 12, 20, 18, 28, 25, 40, 35, 55, 50, 85],
  },
];

export default function CaseStudyStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(false);
          requestAnimationFrame(() => setVisible(true));
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-white py-16 sm:py-24 lg:py-36 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="max-w-2xl mb-10 sm:mb-16">
          <p className="text-gray-400 text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-2"><span className="text-[10px]">&#10022;</span> Case study <span className="text-[10px]">&#10022;</span></p>
          <h2 className="text-[clamp(2rem,4.5vw,3.75rem)] font-medium text-navy leading-[1.08] tracking-tight">
            The results behind<br />the partnership
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {stats.map((s, i) => (
            <StatCard
              key={s.service}
              stat={s}
              index={i}
              visible={visible}
              hovered={hovered === i}
              onEnter={() => setHovered(i)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type Stat = (typeof stats)[number];

// One card, one hook call. useCountUp was being called inside the map, which
// makes the hook count depend on the array and breaks the rules of hooks.
function StatCard({
  stat: s,
  index: i,
  visible,
  hovered: isHovered,
  onEnter,
  onLeave,
}: {
  stat: Stat;
  index: number;
  visible: boolean;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const count = useCountUp(s.value, visible, 2200, 300 + i * 250);

  return (
    <div
      className="relative rounded-2xl border border-gray-200 p-4 sm:p-6 cursor-pointer overflow-hidden group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
        transition: `all 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 + i * 0.12}s`,
        boxShadow: isHovered
          ? "0 20px 50px -12px rgba(0,0,0,0.15), 0 8px 20px -8px rgba(0,0,0,0.1)"
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

      <div className="flex items-center justify-between mb-5 relative">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-lg transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
          style={{ boxShadow: isHovered ? `0 8px 20px -4px rgba(0,0,0,0.2)` : undefined }}
        >
          {s.icon}
        </div>
        <span className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all duration-300 ${isHovered ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>
          {s.service}
        </span>
      </div>

      <div className="relative">
        <span className="text-[2rem] sm:text-[3rem] font-bold tracking-tight leading-none tabular-nums text-navy">
          {count}{s.suffix}
        </span>
      </div>

      <p className="text-sm font-medium text-navy/70 mt-1">{s.unit}</p>
      <p className="text-[13px] text-gray-400 mt-0.5">{s.label}</p>

      <div className="h-12 flex items-end gap-[3px] mt-5 relative">
        {s.barHeights.map((h, j) => (
          <div
            key={j}
            className={`flex-1 rounded-t-sm bg-gradient-to-t ${s.gradient} transition-all ease-out`}
            style={{
              height: visible ? `${h}%` : "0%",
              opacity: visible ? (j >= 8 ? 1 : 0.3 + (j / 12) * 0.7) : 0,
              transitionDuration: "900ms",
              transitionDelay: `${0.5 + i * 0.15 + j * 0.04}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
