"use client";

import { useEffect, useRef, useState } from "react";

const buildLogs = [
  "$ npx create-next-app client-site",
  "Installing dependencies...",
  "✓ Tailwind CSS configured",
  "✓ TypeScript ready",
  "Building components...",
  "✓ Navbar.tsx",
  "✓ Hero.tsx",
  "✓ Features.tsx — dashboard cards",
  "✓ Team.tsx",
  "✓ Pricing.tsx",
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
    <div ref={ref} className="w-full h-full rounded-2xl border border-gray-200 bg-[#f8f8f8] overflow-hidden flex flex-col">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-200">
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
            {showSite ? "yoursite.com" : "localhost:3000"}
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
            <span className="text-[10px] text-white/30 font-mono">main</span>
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

        {/* Site — Wedge-style SaaS */}
        <div className="absolute inset-0 flex flex-col bg-white" style={{ opacity: showSite ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
          {/* Navbar */}
          <div className="px-5 py-2.5 flex items-center justify-between border-b border-gray-100" style={show(1)}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-[#3b2fc9] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="text-[11px] font-bold text-gray-900">Wedge</span>
              </div>
              {["Features", "Pricing", "Blog", "About", "Contact"].map((l) => (
                <span key={l} className="text-[8px] text-gray-400">{l}</span>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[8px] text-gray-500">Log in</span>
              <div className="bg-[#3b2fc9] text-white text-[7px] font-semibold px-2.5 py-1 rounded-full">Get started →</div>
            </div>
          </div>

          {/* Hero — centered */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-[#f4f3ff] to-white">
            <h2
              className="text-[22px] font-bold text-gray-900 leading-tight mb-2.5 tracking-tight"
              style={show(2)}
            >
              Streamline your<br />growing startup
            </h2>
            <p
              className="text-[9px] text-gray-400 leading-relaxed max-w-[260px] mb-4"
              style={show(3)}
            >
              Say goodbye to admin headaches and say hello to efficiency. Onboard employees, track projects, and manage performance.
            </p>
            <div className="flex gap-2" style={show(4)}>
              <div className="bg-[#3b2fc9] text-white text-[8px] font-semibold px-4 py-2 rounded-full">Get started →</div>
              <div className="border border-gray-200 text-gray-600 text-[8px] font-medium px-4 py-2 rounded-full">Learn more →</div>
            </div>

            {/* Dashboard cards row */}
            <div className="flex gap-2.5 mt-6 w-full px-2" style={show(5)}>
              {/* Card 1 — avatars */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 p-3 shadow-sm" style={showScale(6)}>
                <div className="flex -space-x-2 mb-2">
                  {["#e9d5ff", "#bfdbfe", "#fde68a", "#bbf7d0", "#fecaca"].map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="text-[7px] text-gray-400">Active team members</p>
              </div>

              {/* Card 2 — progress */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 p-3 shadow-sm" style={showScale(7)}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded bg-[#3b2fc9]/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-sm bg-[#3b2fc9]" />
                  </div>
                  <span className="text-[8px] text-gray-700">Finance reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#3b2fc9] transition-all duration-1000" style={{ width: step >= 7 ? "84%" : "0%" }} />
                  </div>
                  <span className="text-[7px] text-gray-400">84%</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 rounded bg-green/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-sm bg-green" />
                  </div>
                  <span className="text-[8px] text-gray-700">Business proposal</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-green transition-all duration-1000 delay-200" style={{ width: step >= 7 ? "62%" : "0%" }} />
                  </div>
                  <span className="text-[7px] text-gray-400">62%</span>
                </div>
              </div>

              {/* Card 3 — team list */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 p-3 shadow-sm" style={showScale(8, 0.1)}>
                {[
                  { name: "Freddy", role: "Marketing", color: "#e9d5ff" },
                  { name: "Iliana", role: "Design", color: "#bfdbfe" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-b-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-[8px] font-medium text-gray-700">{p.name}</span>
                    </div>
                    <span className="text-[7px] text-gray-400">{p.role}</span>
                  </div>
                ))}
              </div>

              {/* Card 4 — expense categories */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 p-3 shadow-sm" style={showScale(9, 0.2)}>
                <span className="text-[8px] font-semibold text-gray-700 block mb-2">Expense categories</span>
                <div className="flex gap-1 mb-2">
                  {[60, 25, 15].map((w, i) => (
                    <div
                      key={i}
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: step >= 9 ? `${w}%` : "0%",
                        backgroundColor: i === 0 ? "#3b2fc9" : i === 1 ? "#818cf8" : "#c4b5fd",
                        transitionDelay: `${0.3 + i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-2 text-[6px] text-gray-400">
                  <span>Payroll 60%</span>
                  <span>Tools 25%</span>
                  <span>Other 15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
