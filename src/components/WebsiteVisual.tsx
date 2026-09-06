"use client";

import { useEffect, useRef, useState } from "react";

const buildLogs = [
  "Building yoursite.com",
  "Setting up hosting...",
  "Mobile layout ready",
  "Fast on phone data",
  "Adding your pages...",
  "Service area pages",
  "Tap to call button",
  "Photos of your work",
  "Google Business Profile",
  "Quote request form",
  "Optimizing assets...",
  "Running lighthouse audit...",
  "✓ Performance: 100",
  "✓ SEO: 99",
  "✓ Build complete — deploying...",
  "✓ Live → yoursite.com",
];

export default function WebsiteVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [showSite, setShowSite] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          buildLogs.forEach((_, i) => {
            setTimeout(() => setLogIndex(i + 1), i * 180);
          });
          const siteStart = buildLogs.length * 180 + 500;
          setTimeout(() => setShowSite(true), siteStart - 100);
          [0, 300, 550, 800, 1050, 1300, 1550, 1800, 2100].forEach((d, i) => {
            setTimeout(() => setStep(i + 1), siteStart + d);
          });
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const show = (n: number) => ({
    opacity: step >= n ? 1 : 0,
    transform: step >= n ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.5s ease, transform 0.5s ease",
  });

  const showScale = (n: number, delay = 0) => ({
    opacity: step >= n ? 1 : 0,
    transform: step >= n ? "scale(1) translateY(0)" : "scale(0.94) translateY(10px)",
    transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
  });

  return (
    <div ref={ref} className="w-full h-full bg-[#16110A] overflow-hidden flex flex-col" style={{ boxShadow: "0 25px 60px -12px rgba(0,0,0,0.12), 0 8px 20px -8px rgba(0,0,0,0.08)" }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slab border-b border-gray-200 rounded-[12px]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 bg-gray-100 rounded-full h-7 ml-2 flex items-center px-3 gap-2">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[10px] text-gray-500">
            {showSite ? "goldengunitepools.com" : "localhost:3000"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {/* Terminal */}
        <div
          className="absolute inset-0 bg-[#0d0d0d] p-4 overflow-hidden z-10 flex flex-col"
          style={{ opacity: showSite ? 0 : 1, pointerEvents: showSite ? "none" : "auto", transition: "opacity 0.6s ease" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-green font-mono font-medium">~/client-site</span>
            <span className="text-[10px] text-foreground/30 font-mono">main</span>
          </div>
          <div className="flex-1 overflow-hidden font-mono text-[9px] leading-relaxed space-y-0.5">
            {buildLogs.slice(0, logIndex).map((log, i) => (
              <div key={i} className={log.startsWith("✓") ? "text-green" : log.startsWith("$") ? "text-white" : "text-white/40"}>
                {log}
              </div>
            ))}
            {logIndex < buildLogs.length && <span className="inline-block w-2 h-3 bg-green/70 animate-pulse" />}
          </div>
        </div>

        {/* The example site is Golden Gunite Pools — a real TRC build, not an
            invented brand. Its palette is the CLIENT's, deliberately outside the
            TRC amber (design rule 28: colour comes from the client's real
            assets), so these values are literals rather than tokens.
            gold #9C8430 · cream #F2EDE4 · ink #151515 · 2px radius · Lato. */}
        <div className="absolute inset-0 flex flex-col" style={{ background: "#F2EDE4", opacity: showSite ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
          {/* utility bar */}
          <div className="flex items-center justify-between px-4 py-1.5" style={{ ...show(1), background: "#151515" }}>
            <span className="text-[6px] tracking-[0.14em]" style={{ color: "#C9BFA8" }}>
              SERVING SACRAMENTO, ROSEVILLE &amp; FOLSOM
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[6px]" style={{ color: "#C9BFA8" }}>goldengunitepools@gmail.com</span>
              <span className="text-[6px]" style={{ color: "#C9BFA8" }}>916-349-6558</span>
            </div>
          </div>

          {/* header */}
          <div className="flex items-center justify-between gap-2 px-3 py-2" style={show(2)}>
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                   style={{ border: "1.5px solid #9C8430" }}>
                <span className="text-[3px] font-bold tracking-tight" style={{ color: "#9C8430" }}>GG</span>
              </div>
              <span className="text-[6px] font-semibold tracking-[0.08em] truncate" style={{ color: "#151515" }}>
                GOLDEN GUNITE POOLS
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {["SERVICES", "AREAS", "ABOUT", "BLOG", "CONTACT"].map((l) => (
                <span key={l} className="text-[4px] tracking-[0.1em]" style={{ color: "#151515" }}>{l}</span>
              ))}
              <span className="text-[4px] font-medium tracking-[0.1em] px-1.5 py-1"
                    style={{ background: "#9C8430", color: "#151515", borderRadius: "2px" }}>
                REQUEST A QUOTE
              </span>
            </div>
          </div>

          {/* hero: photography under a dark scrim, copy bottom-left */}
          <div className="flex-1 relative overflow-hidden" style={show(3)}>
            <div className="absolute inset-0" style={{
              background:
                "linear-gradient(180deg, rgba(21,21,21,.72) 0%, rgba(21,21,21,.45) 45%, rgba(21,21,21,.85) 100%)," +
                "radial-gradient(120% 90% at 70% 40%, #4a5a52 0%, #2b3630 55%, #1d2521 100%)",
            }} />
            {/* watermark, as on the real site */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[15px] font-bold tracking-[0.12em] select-none"
                  style={{ color: "#9C8430", opacity: 0.16 }}>GOLDEN</span>

            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <span className="text-[6px] tracking-[0.28em] mt-6" style={{ ...show(4), color: "#E8E2D4" }}>
                GUNITE CONSTRUCTION
              </span>
              <div style={show(5)}>
                <p className="text-[11px] font-medium leading-snug max-w-[230px]" style={{ color: "#F4F1E8" }}>
                  Gunite pools built and repaired in Sacramento.
                </p>
                <p className="text-[7px] leading-relaxed max-w-[240px] mt-1.5" style={{ color: "#D8D2C4" }}>
                  Steel, gunite, tile and stone, in that order. Structural pool shells,
                  raised spas and custom water features across the Sacramento area.
                </p>
                <div className="flex gap-2 mt-2.5" style={show(6)}>
                  <span className="text-[6px] font-medium tracking-[0.1em] px-3 py-1.5"
                        style={{ background: "#9C8430", color: "#151515", borderRadius: "2px" }}>
                    REQUEST A QUOTE
                  </span>
                  <span className="text-[6px] font-medium tracking-[0.1em] px-3 py-1.5"
                        style={{ border: "1px solid rgba(244,241,232,.5)", color: "#F4F1E8", borderRadius: "2px" }}>
                    916-349-6558
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
