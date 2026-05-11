"use client";

import { useEffect, useState, useCallback } from "react";

// 3x3 grid — R shape has these indices ON: 0,1,2,3,4,6,8
const LOGO_STATE = [1, 1, 1, 1, 1, 0.2, 1, 0.2, 1];

function randomState(): number[] {
  return Array.from({ length: 9 }, () => Math.random() > 0.4 ? 0.15 + Math.random() * 0.85 : 0.06);
}

export default function LogoAnimation({ size = 140, color = "#dc2626" }: { size?: number; color?: string }) {
  const [opacities, setOpacities] = useState<number[]>(LOGO_STATE);
  const [isLogo, setIsLogo] = useState(true);

  const scramble = useCallback(() => {
    setIsLogo(false);
    // Run 5 rapid scrambles
    let count = 0;
    const interval = setInterval(() => {
      setOpacities(randomState());
      count++;
      if (count >= 6) {
        clearInterval(interval);
        // Settle back to logo
        setTimeout(() => {
          setOpacities(LOGO_STATE);
          setIsLogo(true);
        }, 200);
      }
    }, 180);
  }, []);

  useEffect(() => {
    // Initial delay then cycle
    const timeout = setTimeout(() => {
      scramble();
      const interval = setInterval(scramble, 5000);
      return () => clearInterval(interval);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [scramble]);

  const gap = size / 3;
  const sq = gap * 0.75;
  const r = sq * (8 / 17);
  const pad = (gap - sq) / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {Array.from({ length: 9 }).map((_, i) => {
        const cx = (i % 3) * gap + pad + sq / 2;
        const cy = Math.floor(i / 3) * gap + pad + sq / 2;

        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill={color}
            opacity={opacities[i]}
            style={{
              transition: isLogo
                ? "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                : "opacity 0.15s ease",
            }}
          />
        );
      })}
    </svg>
  );
}
