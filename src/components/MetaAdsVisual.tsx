"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, active: boolean, duration = 1500, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target * 10) / 10);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [active, target, duration, delay]);
  return value;
}

const metrics = [
  { label: "Reach", target: 48200, prefix: "", decimals: 0, format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}` },
  { label: "CTR", target: 4.8, prefix: "", decimals: 1, format: (v: number) => `${v.toFixed(1)}%` },
  { label: "Cost / Lead", target: 6.10, prefix: "$", decimals: 2, format: (v: number) => `$${v.toFixed(2)}` },
];

export default function MetaAdsVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(false);
          setShowMetrics(false);
          requestAnimationFrame(() => setVisible(true));
        } else {
          setVisible(false);
          setShowMetrics(false);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setShowMetrics(true), 900);
    return () => clearTimeout(timer);
  }, [visible]);

  const reach = useCountUp(metrics[0].target, showMetrics, 1800, 0);
  const ctr = useCountUp(metrics[1].target, showMetrics, 1800, 250);
  const costPerLead = useCountUp(metrics[2].target, showMetrics, 1800, 500);

  return (
    <div ref={ref} className="w-full h-full overflow-hidden flex flex-col gap-3 p-1">
      {/* Ad card — Instagram-style */}
      <div
        className="bg-background overflow-hidden transition-all duration-1000"
        style={{
          boxShadow: "0 25px 60px -12px rgba(0,0,0,0.12), 0 8px 20px -8px rgba(0,0,0,0.08)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal to-navy flex items-center justify-center">
            <span className="text-foreground text-[10px] font-bold">TR</span>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-gray-900 leading-none">Your Business</p>
            <p className="text-[9px] text-gray-400 mt-0.5">Sponsored</p>
          </div>
          <svg className="w-4 h-4" viewBox="0 0 36 36" fill="none">
            <path d="M18 1c9.4 0 17 7.6 17 17s-7.6 17-17 17S1 27.4 1 18 8.6 1 18 1z" fill="#1877F2" />
            <path d="M25 18.1c0-3.9-3.1-7-7-7s-7 3.1-7 7c0 3.5 2.6 6.5 6 7v-4.9h-1.8v-2.1H17v-1.6c0-1.8 1-2.8 2.7-2.8.8 0 1.6.1 1.6.1v1.8h-.9c-.9 0-1.2.6-1.2 1.1v1.4h2l-.3 2.1h-1.7V25c3.4-.5 6-3.5 6-7z" fill="var(--foreground)" />
          </svg>
        </div>
        <div className="h-32 bg-gradient-to-br from-navy/90 to-teal/80 flex items-center justify-center relative overflow-hidden">
          <span className="text-foreground text-[13px] font-bold text-center px-6 leading-snug">
            Now Booking — Limited Spots This Month
          </span>
        </div>
        <div className="px-4 py-3">
          <p className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">yourbusiness.com</p>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-gray-800">Get Your Free Quote Today</p>
            <div className="bg-gray-100 text-gray-700 text-[9px] font-semibold px-3 py-1.5 shrink-0 rounded-[12px]">Learn More</div>
          </div>
        </div>
      </div>

      {/* Ads Manager metrics strip */}
      <div
        className="bg-background px-4 py-3 flex items-center justify-between transition-all duration-1000 rounded-[12px]"
        style={{
          opacity: showMetrics ? 1 : 0,
          transform: showMetrics ? "translateY(0)" : "translateY(12px)",
        }}
      >
        {[reach, ctr, costPerLead].map((value, i) => (
          <div key={metrics[i].label} className="flex flex-col items-center flex-1">
            <span className="text-[15px] font-bold text-navy tabular-nums">{metrics[i].format(value)}</span>
            <span className="text-[9px] text-gray-400 mt-0.5">{metrics[i].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
