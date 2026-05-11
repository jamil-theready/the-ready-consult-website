"use client";

import { useEffect, useState } from "react";

const LOGO_STATE = [1, 1, 1, 1, 1, 0.2, 1, 0.2, 1];

function randomState(): number[] {
  return Array.from({ length: 9 }, () => Math.random() > 0.4 ? 0.15 + Math.random() * 0.85 : 0.06);
}

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"loading" | "fadeout" | "done">("loading");
  const [opacities, setOpacities] = useState<number[]>(LOGO_STATE);
  const [isLogo, setIsLogo] = useState(true);

  // Scramble animation — starts immediately, runs 2 full cycles
  useEffect(() => {
    const runCycle = () => {
      setIsLogo(false);
      let scrambleCount = 0;
      const scrambleInterval = setInterval(() => {
        setOpacities(randomState());
        scrambleCount++;
        if (scrambleCount >= 6) {
          clearInterval(scrambleInterval);
          setTimeout(() => {
            setOpacities(LOGO_STATE);
            setIsLogo(true);
          }, 200);
        }
      }, 150);
    };

    // First scramble at 500ms
    const t1 = setTimeout(runCycle, 500);
    // Second scramble at 2200ms
    const t2 = setTimeout(runCycle, 2200);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Phase transitions
  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fadeout"), 3800);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 4600);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  if (phase === "done") return null;

  const gap = 80 / 3;
  const sq = gap * 0.75;
  const r = sq * (8 / 17);
  const pad = (gap - sq) / 2;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
      style={{
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      <svg width={80} height={80} viewBox="0 0 80 80" fill="none">
        {Array.from({ length: 9 }).map((_, i) => {
          const cx = (i % 3) * gap + pad + sq / 2;
          const cy = Math.floor(i / 3) * gap + pad + sq / 2;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="#dc2626"
              opacity={opacities[i]}
              style={{
                transition: isLogo
                  ? "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "opacity 0.12s ease",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
