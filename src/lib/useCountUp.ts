// src/lib/useCountUp.ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, active: boolean, duration = 2000, delay = 0) {
  const [value, setValue] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    // Resetting with a setState in the effect body triggers a cascading render.
    // The inactive value is derived on the way out instead, so the effect only
    // ever runs the animation.
    if (!active) return;

    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) frame.current = requestAnimationFrame(step);
      };
      frame.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame.current);
    };
  }, [active, target, duration, delay]);

  return active ? value : 0;
}
