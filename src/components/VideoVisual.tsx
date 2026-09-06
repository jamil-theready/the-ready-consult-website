"use client";

import { useRef, useEffect, useState } from "react";

function useCountUp(target: number, active: boolean, duration = 1400, delay = 0) {
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

function TickerStats({ visible }: { visible: boolean }) {
  const stats = [
    { label: "Reach", target: 42000, suffix: "", format: true },
    { label: "Shares", target: 3200, suffix: "", format: true },
    { label: "Avg Watch", target: 18, suffix: "s", format: false },
    { label: "CTR", target: 124, suffix: "%", format: false, divide: 10 },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((s, i) => (
        <StatTile key={s.label} stat={s} index={i} visible={visible} />
      ))}
    </div>
  );
}

type Stat = { label: string; target: number; suffix: string; format?: boolean; divide?: number };

// One tile, one hook call. Calling useCountUp inside the map broke the rules of
// hooks: the call count changed with the array, so React could mismatch state
// between renders.
function StatTile({ stat: s, index: i, visible }: { stat: Stat; index: number; visible: boolean }) {
  const raw = useCountUp(s.target, visible, 1600, 100 + i * 150);
  const display = s.divide
    ? (raw / s.divide).toFixed(1)
    : s.format
      ? raw >= 1000 ? `${(raw / 1000).toFixed(1)}K` : String(raw)
      : String(raw);

  return (
    <div
      className="bg-background p-4 text-center transition-all duration-700 rounded-[12px]"
      style={{
        boxShadow: "0 10px 30px -5px rgba(0,0,0,0.08), 0 4px 10px -4px rgba(0,0,0,0.04)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${0.1 + i * 0.12}s`,
      }}
    >
      <p className="text-2xl font-bold text-gray-900 tabular-nums leading-none">
        {display}{s.suffix}
      </p>
      <p className="text-[10px] text-gray-400 mt-1.5">{s.label}</p>
    </div>
  );
}

export default function VideoVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  useEffect(() => {
    const el = containerRef.current;
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
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden flex gap-4 p-2">
      {/* iPhone mockup */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="relative w-[270px] h-full bg-void rounded-[44px] overflow-hidden"
          style={{
            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.4), 0 10px 20px -8px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(255,255,255,0.08)",
            border: "4px solid #2a2a2a",
          }}
        >
          {/* iPhone frame highlights */}
          <div className="absolute inset-0 rounded-[40px] pointer-events-none z-20" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }} />

          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-void rounded-full z-20 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-seam ring-1 ring-seam" />
          </div>

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-[14px] flex items-center justify-between">
            <span className="text-[10px] font-semibold text-foreground/80">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-foreground/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
              </svg>
              <svg className="w-4 h-3 text-foreground/80" fill="currentColor" viewBox="0 0 24 16">
                <rect x="0" y="2" width="4" height="12" rx="1" opacity="0.4" />
                <rect x="5.5" y="1" width="4" height="13" rx="1" opacity="0.6" />
                <rect x="11" y="0" width="4" height="14" rx="1" opacity="0.8" />
                <rect x="16.5" y="0" width="4" height="14" rx="1" />
              </svg>
              <div className="w-6 h-3 border border-white/60 relative ml-0.5">
                <div className="absolute inset-[1.5px] rounded-[1px] bg-background/80" style={{ width: "65%" }} />
              </div>
            </div>
          </div>

          {/* Video content */}
          <video
            ref={videoRef}
            src="/demo-video.mp4"
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Instagram Reels UI overlay */}
          <div className="absolute bottom-0 inset-x-0 z-10">
            {/* Bottom content */}
            <div className="px-4 pb-3">
              {/* Username + description */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-gray-300" />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground">thereadyconsult</span>
                  <button className="text-[9px] font-semibold text-foreground border border-white/40 px-2 py-0.5 ml-1 rounded-[12px]">Follow</button>
                </div>
                <p className="text-[10px] text-foreground/80 leading-relaxed">Your brand deserves better content 🎥</p>
              </div>

              {/* Audio bar */}
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-3 h-3 text-foreground/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                <div className="flex-1 h-[2px] bg-background/20 rounded-full overflow-hidden">
                  <div className="h-full w-2/5 bg-background/60 rounded-full" />
                </div>
              </div>

              {/* Home indicator */}
              <div className="w-28 h-1 bg-background/30 rounded-full mx-auto" />
            </div>
          </div>

          {/* Right side actions */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
            {[
              { path: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", count: "4.2K", filled: false },
              { path: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", count: "847", filled: false },
              { path: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8", count: "312", filled: false },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <svg className="w-6 h-6 text-foreground drop-" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.path} />
                </svg>
                <span className="text-[9px] text-foreground font-medium mt-1 drop-">{item.count}</span>
              </div>
            ))}
            {/* Album cover */}
            <div className="w-7 h-7 bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-white/20 " />
          </div>
        </div>
      </div>

      {/* Right side — floating analytics */}
      <div className="w-[220px] shrink-0 flex flex-col gap-3 self-stretch">
        {/* Ticker stats */}
        <TickerStats visible={visible} />

        {/* Accounts Reached — bar chart */}
        <div
          className="flex-1 bg-background p-3.5 flex flex-col transition-all duration-800 rounded-[12px]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "0.5s",
            boxShadow: "0 15px 40px -8px rgba(0,0,0,0.1), 0 6px 16px -6px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-semibold text-gray-900">Accounts Reached</span>
            <span className="text-[9px] font-bold text-blue">142.8K</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[8px] text-blue font-medium">+234%</span>
            <span className="text-[8px] text-gray-400">vs last 30 days</span>
          </div>
          <div className="flex-1 flex gap-1.5">
            <div className="flex flex-col justify-between text-[7px] text-gray-400 py-0.5">
              <span>150K</span>
              <span>100K</span>
              <span>50K</span>
              <span>0</span>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-t border-gray-50" />
                ))}
              </div>
              <div className="relative h-full flex items-end gap-[3px]">
                {[8, 12, 10, 18, 15, 24, 20, 32, 28, 40, 35, 48, 44, 56, 52, 65, 60, 75, 72, 85, 80, 92, 88, 97].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 transition-all ease-out"
                    style={{
                      height: visible ? `${h}%` : "0%",
                      background: i >= 18 ? "#635bff" : i >= 12 ? "#818cf8" : "#e0e0ee",
                      transitionDuration: "900ms",
                      transitionDelay: `${0.6 + i * 0.03}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-1 pl-6">
            {["Mon", "Wed", "Fri", "Sun"].map((d) => (
              <span key={d} className="text-[7px] text-gray-400">{d}</span>
            ))}
          </div>
        </div>

        {/* Engagement Rate — line chart with constant animation */}
        <div
          className="flex-1 bg-background p-3.5 flex flex-col transition-all duration-800 rounded-[12px]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "0.7s",
            boxShadow: "0 15px 40px -8px rgba(0,0,0,0.1), 0 6px 16px -6px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-semibold text-gray-900">Engagement Rate</span>
            <span className="text-[9px] font-bold text-blue">8.4%</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-[2px] bg-blue inline-block" />
              <span className="text-[7px] text-gray-400">This month</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-[2px] bg-blue/30 inline-block" />
              <span className="text-[7px] text-gray-400">Last month</span>
            </div>
          </div>
          <div className="flex-1 flex gap-1.5">
            <div className="flex flex-col justify-between text-[7px] text-gray-400 py-0.5">
              <span>12%</span>
              <span>8%</span>
              <span>4%</span>
              <span>0%</span>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-t border-gray-50" />
                ))}
              </div>
              <svg className="relative w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                {/* Last month line */}
                <path
                  d="M0 60 Q15 55 30 58 T60 50 T90 52 T120 46 T150 48 T180 42 T200 44"
                  fill="none" stroke="#635bff" strokeWidth="1.5" opacity="0.2"
                  strokeDasharray="400" strokeDashoffset={visible ? "0" : "400"}
                  style={{ transition: "stroke-dashoffset 2s ease 0.8s" }}
                />
                {/* This month area */}
                <path
                  d="M0 65 Q15 58 30 52 T60 45 T90 38 T120 28 T150 20 T180 14 T200 8 V80 H0 Z"
                  fill="rgba(99,91,255,0.06)"
                  style={{ opacity: visible ? 1 : 0, transition: "opacity 1.5s ease 1s" }}
                />
                {/* This month line */}
                <path
                  d="M0 65 Q15 58 30 52 T60 45 T90 38 T120 28 T150 20 T180 14 T200 8"
                  fill="none" stroke="#635bff" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="400" strokeDashoffset={visible ? "0" : "400"}
                  style={{ transition: "stroke-dashoffset 2s ease 1s" }}
                />
                {/* Animated pulse dot that travels along the line */}
                {visible && (
                  <circle r="3" fill="#635bff">
                    <animateMotion
                      dur="4s"
                      repeatCount="indefinite"
                      path="M0 65 Q15 58 30 52 T60 45 T90 38 T120 28 T150 20 T180 14 T200 8"
                    />
                  </circle>
                )}
                {/* End dot */}
                <circle cx="200" cy="8" r="3.5" fill="#635bff"
                  style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease 2.8s" }}
                />
              </svg>
            </div>
          </div>
          <div className="flex justify-between mt-1 pl-6">
            {["Week 1", "Week 2", "Week 3", "Week 4"].map((w) => (
              <span key={w} className="text-[7px] text-gray-400">{w}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
