"use client";

import { useEffect, useRef, useState } from "react";

// Big centered statement with a scroll-triggered word-by-word reveal.
export default function BlockStatement({ text, tone = "light" }: { text: string; tone?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const dark = tone === "dark";
  const words = text.split(" ");

  return (
    <section ref={ref} className={(dark ? "bg-void" : "bg-slab") + " py-28 sm:py-40 px-6"}>
      <p
        className={
          "max-w-5xl mx-auto text-center text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.12] tracking-tight " +
          (dark ? "text-white" : "text-navy")
        }
      >
        {words.map((w, i) => (
          <span
            key={i}
            className="inline-block mr-[0.26em] transition-all duration-700 ease-out will-change-transform"
            style={{
              transitionDelay: `${i * 38}ms`,
              opacity: shown ? 1 : 0,
              transform: shown ? "translateY(0)" : "translateY(0.5em)",
            }}
          >
            {w}
          </span>
        ))}
      </p>
    </section>
  );
}
