"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, active: boolean, duration = 2000, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [active, target, duration, delay]);
  return value;
}

const stats = [
  {
    value: 55,
    suffix: "+",
    unit: "leads/mo",
    label: "from SEO & content",
    service: "SEO",
    color: "#425466",
  },
  {
    value: 135,
    suffix: "K+",
    unit: "views",
    label: "across video content",
    service: "Video",
    color: "#6b7b8d",
  },
  {
    value: 20,
    suffix: "+",
    unit: "hrs saved",
    label: "weekly with AI workflows",
    service: "Automations",
    color: "#6b7b8d",
  },
  {
    value: 3,
    suffix: "x",
    unit: "faster",
    label: "site speed after rebuild",
    service: "Websites",
    color: "#8494a7",
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
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-white py-24 lg:py-36">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Heading */}
        <div className="max-w-2xl mb-20">
          <p className="text-teal font-semibold text-[15px] mb-4">Case study</p>
          <h2 className="text-[clamp(2rem,4.5vw,3.75rem)] font-medium text-navy leading-[1.08] tracking-tight">
            The results behind<br />the partnership
          </h2>
        </div>

        {/* Thin gradient line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16" />

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
          {stats.map((s, i) => {
            const count = useCountUp(s.value, visible, 2200, 200 + i * 300);
            const isHovered = hovered === i;

            return (
              <div
                key={s.service}
                className={`text-left lg:border-r lg:last:border-r-0 border-gray-100 px-4 py-6 rounded-2xl lg:rounded-none cursor-pointer transition-all duration-300 ${
                  isHovered ? "bg-gray-50 scale-[1.03]" : ""
                }`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Big number */}
                <div
                  className="transition-all duration-500"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${0.1 + i * 0.15}s`,
                  }}
                >
                  <span
                    className="text-[3.5rem] lg:text-[4.5rem] font-medium tracking-tight leading-none tabular-nums transition-colors duration-300"
                    style={{ color: isHovered ? "#0a2540" : s.color }}
                  >
                    {count}{s.suffix}
                  </span>
                </div>

                {/* Unit */}
                <p
                  className="text-sm font-normal text-navy/70 mt-2 transition-all duration-500"
                  style={{
                    opacity: visible ? 1 : 0,
                    transitionDelay: `${0.2 + i * 0.15}s`,
                  }}
                >
                  {s.unit}
                </p>

                {/* Description */}
                <p
                  className="text-[13px] text-gray-400 mt-1 transition-all duration-500"
                  style={{
                    opacity: visible ? 1 : 0,
                    transitionDelay: `${0.3 + i * 0.15}s`,
                  }}
                >
                  {s.label}
                </p>

                {/* Service tag on hover */}
                <div
                  className="mt-3 transition-all duration-300 overflow-hidden"
                  style={{
                    maxHeight: isHovered ? "30px" : "0px",
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  <span className="inline-block text-[11px] font-semibold text-teal bg-teal/10 px-3 py-1 rounded-full">
                    {s.service}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
