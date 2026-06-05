"use client";

import { useEffect, useRef, useState } from "react";
import type { Metric } from "@/lib/work-types";
import { useCountUp } from "@/lib/useCountUp";

function Stat({ m, active }: { m: Metric; active: boolean }) {
  const value = useCountUp(m.value, active);
  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl font-semibold text-navy">
        {m.prefix}{value.toLocaleString()}{m.suffix}{m.unit ? ` ${m.unit}` : ""}
      </div>
      <div className="mt-2 text-gray-700">{m.label}</div>
      <div className="mt-1 text-xs text-gray-400">{m.source} · {m.asOf}</div>
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
    <section ref={ref} className="max-w-[1400px] mx-auto px-4 sm:px-6 my-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
      {stats.map((m, i) => <Stat key={i} m={m} active={active} />)}
    </section>
  );
}
