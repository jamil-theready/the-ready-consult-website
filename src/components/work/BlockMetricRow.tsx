"use client";

import { useEffect, useRef, useState } from "react";
import type { Metric } from "@/lib/work-types";
import { useCountUp } from "@/lib/useCountUp";

function Stat({ m, active }: { m: Metric; active: boolean }) {
  const value = useCountUp(m.value, active);
  return (
    <div className="text-center px-4">
      <div className="text-6xl sm:text-7xl font-semibold text-navy tracking-tight tabular-nums leading-none">
        {m.prefix}{value.toLocaleString()}{m.suffix}
      </div>
      {m.unit && <div className="mt-2 text-lg text-gray-500">{m.unit}</div>}
      <div className="mt-4 text-base text-navy/80">{m.label}</div>
      <div className="mt-2 text-[11px] uppercase tracking-wider text-gray-400">{m.source} · {m.asOf}</div>
    </div>
  );
}

export default function BlockMetricRow({ stats }: { stats: Metric[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setActive(true), { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} className="bg-gray-50 my-16 sm:my-24 py-16 sm:py-24">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-14 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
        {stats.map((m, i) => (
          <div key={i} className="pt-14 first:pt-0 sm:pt-0">
            <Stat m={m} active={active} />
          </div>
        ))}
      </div>
    </section>
  );
}
