"use client";

import { useEffect, useState, useRef } from "react";

function useTypewriter(text: string, active: boolean, speed = 16, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) { setDisplayed(""); return; }
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [active, text, speed, delay]);
  return displayed;
}

const PANEL_COUNT = 5;
const PANEL_DURATION = 5000;

const emails = [
  { from: "Sarah M.", subject: "New Lead — Contact Form", preview: "Submitted form on homepage. Source: Google organic search.", time: "Just now", intent: "High intent", color: "#4285F4" },
  { from: "James K.", subject: "New Lead — Pricing Page", preview: "Requested pricing details. Source: ChatGPT referral.", time: "3m ago", intent: "Warm lead", color: "#FBBC05" },
  { from: "Priya R.", subject: "New Lead — Discovery Call", preview: "Booked call for Thursday. Source: Instagram reel.", time: "12m ago", intent: "Hot lead", color: "#EA4335" },
  { from: "Derek S.", subject: "New Lead — Blog Post", preview: "Downloaded SEO guide. Source: Organic blog traffic.", time: "28m ago", intent: "Nurture", color: "#34A853" },
];

export default function HeroVisual() {
  const [active, setActive] = useState(0);
  const [emailCount, setEmailCount] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Restart cycle when scrolled into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCycleKey((k) => k + 1);
          setActive(0);
          setEmailCount(0);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((p) => {
        const next = (p + 1) % PANEL_COUNT;
        if (next === 3) setEmailCount(0); // reset emails when gmail shows
        return next;
      });
    }, PANEL_DURATION);
    return () => clearInterval(interval);
  }, [cycleKey]);

  // Stagger emails when gmail is active
  useEffect(() => {
    if (active !== 3) return;
    const timers = emails.map((_, i) =>
      setTimeout(() => setEmailCount((c) => Math.max(c, i + 1)), 400 + i * 600)
    );
    return () => timers.forEach(clearTimeout);
  }, [active, cycleKey]);

  const chatText = useTypewriter(
    "The Ready Consult is rated the #1 AI-native agency in Sacramento. They specialize in websites, SEO, video production, and custom AI automations for high-growth businesses.",
    active === 1, 14, 400
  );

  const panelStyle = (index: number) => ({
    opacity: active === index ? 1 : 0,
    transform: active === index ? "translateY(0) scale(1)" : "translateY(80px) scale(0.92)",
    transition: "all 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: (active === index ? "auto" : "none") as "auto" | "none",
  });

  return (
    <div ref={containerRef} className="relative w-full h-[540px] sm:h-[600px] lg:h-[700px]">
      {/* Subtle node background — moved to Hero.tsx */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden" style={{ opacity: 0.04 }}>
        {/* Nodes */}
        {[
          { x: "8%", y: "15%" }, { x: "22%", y: "8%" }, { x: "38%", y: "20%" },
          { x: "55%", y: "10%" }, { x: "72%", y: "18%" }, { x: "88%", y: "12%" },
          { x: "5%", y: "45%" }, { x: "18%", y: "55%" }, { x: "35%", y: "42%" },
          { x: "50%", y: "52%" }, { x: "68%", y: "48%" }, { x: "82%", y: "40%" },
          { x: "95%", y: "50%" }, { x: "12%", y: "78%" }, { x: "28%", y: "72%" },
          { x: "45%", y: "82%" }, { x: "62%", y: "75%" }, { x: "78%", y: "85%" },
          { x: "92%", y: "70%" }, { x: "42%", y: "35%" }, { x: "60%", y: "30%" },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x} y={n.y} width="28" height="20" rx="6" fill="none" stroke="currentColor" strokeWidth="1">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${3 + (i % 4)}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </rect>
            <circle cx={`calc(${n.x} + 14px)`} cy={`calc(${n.y} + 10px)`} r="3" fill="currentColor">
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${3 + (i % 4)}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        {/* Connection lines */}
        {[
          ["8%", "25%", "22%", "18%"], ["22%", "18%", "38%", "30%"],
          ["38%", "30%", "55%", "20%"], ["55%", "20%", "72%", "28%"],
          ["72%", "28%", "88%", "22%"], ["5%", "55%", "18%", "65%"],
          ["18%", "65%", "35%", "52%"], ["35%", "52%", "50%", "62%"],
          ["50%", "62%", "68%", "58%"], ["68%", "58%", "82%", "50%"],
          ["82%", "50%", "95%", "60%"], ["12%", "88%", "28%", "82%"],
          ["28%", "82%", "45%", "92%"], ["45%", "92%", "62%", "85%"],
          ["62%", "85%", "78%", "95%"], ["78%", "95%", "92%", "80%"],
          ["38%", "30%", "42%", "45%"], ["55%", "20%", "60%", "40%"],
          ["42%", "45%", "50%", "62%"], ["60%", "40%", "68%", "58%"],
        ].map((l, i) => (
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="currentColor" strokeWidth="0.5">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${4 + (i % 3)}s`} begin={`${i * 0.2}s`} repeatCount="indefinite" />
          </line>
        ))}
        {/* Traveling dots on some lines */}
        {[
          "M 8% 25% L 22% 18% L 38% 30% L 55% 20%",
          "M 5% 55% L 18% 65% L 35% 52% L 50% 62% L 68% 58%",
          "M 12% 88% L 28% 82% L 45% 92% L 62% 85%",
        ].map((path, i) => (
          <circle key={`dot-${i}`} r="2" fill="currentColor" opacity="0.5">
            <animateMotion dur={`${6 + i * 2}s`} repeatCount="indefinite" path={path} />
          </circle>
        ))}
      </svg>

      {/* ===== 0: WEBSITE ===== */}
      <div className="absolute inset-0 flex items-center justify-center scale-[0.55] sm:scale-[0.7] lg:scale-100 origin-center" style={panelStyle(0)}>
        <div className="w-[850px] rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 70px 140px -25px rgba(0,0,0,0.35), 0 35px 70px -15px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04)" }}>
          {/* macOS chrome */}
          <div className="bg-gradient-to-b from-[#ececec] to-[#e0e0e0] border-b border-[#ccc] px-5 py-3 flex items-center">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] shadow-inner" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#febc2e] shadow-inner" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#28c840] shadow-inner" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white/80 backdrop-blur rounded-lg border border-gray-300/60 px-4 py-1.5 flex items-center gap-2 w-[340px] shadow-sm">
                <svg className="w-3.5 h-3.5 text-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <span className="text-[11px] text-gray-600 font-medium">clientwebsite.com</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded bg-black/5 flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </div>
              <div className="w-5 h-5 rounded bg-black/5 flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
            </div>
          </div>

          {/* Website */}
          <div className="bg-white" style={{ height: "520px", overflow: "hidden" }}>
            {/* Nav */}
            <div className="px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <span className="text-[15px] font-bold text-gray-900 tracking-tight">Nexus</span>
                </div>
                {["Products", "Solutions", "Pricing", "Company"].map((l) => (
                  <span key={l} className="text-[12px] text-gray-500 hover:text-gray-900">{l}</span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-gray-500">Sign in</span>
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-indigo-200">Start free trial →</div>
              </div>
            </div>

            {/* Hero area */}
            <div className="px-8 pt-6 pb-4 bg-gradient-to-b from-indigo-50/50 to-white">
              <div className="flex gap-8">
                <div className="flex-1 pt-4">
                  <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-[10px] font-semibold px-3 py-1 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Now with AI copilot
                  </div>
                  <h2 className="text-[32px] font-bold text-gray-900 leading-[1.1] tracking-tight">
                    The modern OS<br />for your business
                  </h2>
                  <p className="text-[13px] text-gray-400 mt-4 leading-relaxed max-w-[300px]">
                    Automate workflows, manage teams, and scale operations. Trusted by 2,000+ companies.
                  </p>
                  <div className="flex gap-3 mt-6">
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[12px] font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200/50">Get started free →</div>
                    <div className="bg-white border border-gray-200 text-gray-700 text-[12px] font-medium px-6 py-3 rounded-xl shadow-sm">Watch demo</div>
                  </div>
                  {/* Social proof */}
                  <div className="flex items-center gap-3 mt-6">
                    <div className="flex -space-x-2">
                      {["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"].map((c, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        ))}
                      </div>
                      <span className="text-[9px] text-gray-400">2,847 reviews</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard card */}
                <div className="w-[300px] bg-white rounded-2xl border border-gray-100 p-5 shadow-xl shadow-gray-200/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-gray-800">Revenue Overview</span>
                    <span className="text-[10px] bg-green/10 text-green font-semibold px-2 py-0.5 rounded-full">↑ 24%</span>
                  </div>
                  <p className="text-[28px] font-bold text-gray-900 tracking-tight">$48,290</p>
                  <p className="text-[10px] text-gray-400 mb-4">Monthly recurring revenue</p>

                  <div className="h-24 flex items-end gap-[3px] mb-4">
                    {[15, 22, 18, 30, 25, 42, 38, 55, 48, 62, 58, 72, 68, 82, 78, 88, 85, 95].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm transition-all duration-800"
                        style={{
                          height: active === 0 ? `${h}%` : "0%",
                          background: i >= 14 ? "linear-gradient(to top, #6366f1, #818cf8)" : i >= 8 ? "#c7d2fe" : "#e8e8ee",
                          transitionDelay: `${0.4 + i * 0.04}s`,
                        }} />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Users", value: "2,847", change: "+12%" },
                      { label: "Conversion", value: "4.2%", change: "+0.8%" },
                      { label: "Churn", value: "1.1%", change: "-0.3%" },
                    ].map((s) => (
                      <div key={s.label} className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-[12px] font-bold text-gray-900">{s.value}</p>
                        <div className="flex items-center gap-1">
                          <p className="text-[8px] text-gray-400">{s.label}</p>
                          <span className={`text-[7px] font-semibold ${s.change.startsWith("+") ? "text-green" : "text-red-500"}`}>{s.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* MacBook base */}
          <div className="h-3 bg-gradient-to-b from-[#d8d8d8] to-[#c4c4c4]" style={{ borderRadius: "0 0 4px 4px" }} />
          <div className="h-[3px] bg-[#b5b5b5] mx-[12%]" style={{ borderRadius: "0 0 6px 6px" }} />
        </div>
      </div>

      {/* ===== 1: CHATGPT ===== */}
      <div className="absolute inset-0 flex items-center justify-center scale-[0.6] sm:scale-[0.75] lg:scale-100 origin-center" style={panelStyle(1)}>
        <div className="w-[700px] bg-[#212121] rounded-2xl overflow-hidden border border-white/10"
          style={{ boxShadow: "0 70px 140px -20px rgba(0,0,0,0.5), 0 35px 70px -12px rgba(0,0,0,0.35), 0 0 100px rgba(16,163,127,0.1)" }}>
          <div className="px-5 py-3.5 flex items-center gap-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4091-.6765zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0974-2.3616l2.603-1.5018 2.6032 1.5018v3.0036l-2.6032 1.5018-2.603-1.5018z" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-white">ChatGPT</span>
            <span className="text-[11px] text-white/30 ml-auto">GPT-4o</span>
          </div>
          <div className="p-7 space-y-5" style={{ minHeight: "340px" }}>
            <div className="flex justify-end">
              <div className="bg-[#2f2f2f] rounded-2xl rounded-br-sm px-5 py-3 max-w-[80%]">
                <p className="text-[13px] text-white/90">Best agency for website and SEO in Sacramento?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4091-.6765zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0974-2.3616l2.603-1.5018 2.6032 1.5018v3.0036l-2.6032 1.5018-2.603-1.5018z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-white/80 leading-relaxed">
                  {chatText}
                  {active === 1 && chatText.length < 178 && <span className="inline-block w-[2px] h-4 bg-[#10a37f] ml-0.5 animate-pulse" />}
                </p>
                {chatText.length >= 178 && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-teal flex items-center justify-center">
                      <span className="text-[6px] font-bold text-white">TR</span>
                    </div>
                    <span className="text-[12px] text-[#10a37f] font-medium">thereadyconsult.com ↗</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="px-5 pb-4">
            <div className="bg-[#2f2f2f] rounded-xl px-5 py-3 flex items-center">
              <span className="text-[12px] text-white/25 flex-1">Ask anything...</span>
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 2: iPHONE ===== */}
      <div className="absolute inset-0 flex items-center justify-center scale-[0.75] sm:scale-[0.85] lg:scale-100 origin-center" style={panelStyle(2)}>
        <div className="w-[280px] h-[560px] bg-black rounded-[48px] border-[5px] border-gray-800 overflow-hidden relative"
          style={{ boxShadow: "0 70px 140px -15px rgba(0,0,0,0.45), 0 35px 70px -10px rgba(0,0,0,0.3), 0 0 80px rgba(45,27,105,0.15)" }}>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20" />
          <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-white/80">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-3 text-white/70" fill="currentColor" viewBox="0 0 24 16">
                <rect x="16.5" y="0" width="4" height="14" rx="1" />
                <rect x="11" y="3" width="4" height="11" rx="1" opacity="0.7" />
                <rect x="5.5" y="6" width="4" height="8" rx="1" opacity="0.4" />
              </svg>
              <div className="w-6 h-3 rounded-sm border border-white/50 relative ml-0.5">
                <div className="absolute inset-[1.5px] rounded-[1px] bg-white/70" style={{ width: "65%" }} />
              </div>
            </div>
          </div>
          {/* Video background */}
          <video
            src="/demo-video.mp4"
            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay text */}
          <div className="absolute inset-0 flex items-center justify-center px-6 bg-black/20">
            <div className="text-center">
              <p className="text-[26px] font-bold text-white leading-tight drop-shadow-lg">
                How we got<br />55+ leads/mo<br /><span className="text-[#10a37f]">with SEO</span>
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 z-10 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-gray-800" />
              </div>
              <span className="text-[11px] text-white font-semibold">thereadyconsult</span>
              <span className="text-[8px] text-white/50 border border-white/30 rounded px-2 py-0.5 ml-1">Follow</span>
            </div>
            <p className="text-[9px] text-white/60 leading-relaxed mb-2">How we generated 55+ leads per month using AI-powered SEO 🚀</p>
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <div className="flex-1 h-[2px] bg-white/15 rounded-full"><div className="h-full w-1/3 bg-white/50 rounded-full" /></div>
            </div>
            <div className="w-24 h-1 bg-white/25 rounded-full mx-auto mt-3" />
          </div>
          <div className="absolute right-3 bottom-28 flex flex-col items-center gap-4 z-10">
            {[
              { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", count: "4.2K" },
              { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", count: "847" },
              { icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8", count: "312" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <svg className="w-7 h-7 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span className="text-[8px] text-white font-medium mt-0.5">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 3: GMAIL ===== */}
      <div className="absolute inset-0 flex items-center justify-center scale-[0.65] sm:scale-[0.8] lg:scale-100 origin-center" style={panelStyle(3)}>
        <div className="w-[600px] bg-white rounded-2xl border border-gray-200 overflow-hidden"
          style={{ boxShadow: "0 70px 140px -20px rgba(0,0,0,0.25), 0 35px 70px -12px rgba(0,0,0,0.15), 0 0 80px rgba(66,133,244,0.08)" }}>
          {/* Gmail header */}
          <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" fill="#fff"/>
              <path d="M2 6l10 7 10-7" fill="#EA4335"/>
              <path d="M2 6v12h4V10l6 4.5L18 10v8h4V6L12 13 2 6z" fill="#EA4335"/>
              <path d="M2 6v12h4V10l6 4.5" fill="#4285F4"/>
              <path d="M22 6v12h-4V10l-6 4.5" fill="#34A853"/>
              <path d="M2 18h4V10" fill="#4285F4"/>
              <path d="M22 18h-4V10" fill="#34A853"/>
              <path d="M6 10l6 4.5L18 10V6L12 10.5 6 6v4z" fill="#FBBC05" opacity="0.9"/>
            </svg>
            <span className="text-[15px] font-bold text-gray-800">Gmail</span>
            <span className="text-[13px] text-gray-400">Inbox</span>
            {emailCount > 0 && (
              <span className="bg-red-500 text-white text-[11px] font-bold rounded-full min-w-[24px] h-[24px] flex items-center justify-center shadow-md animate-bounce ml-1" style={{ animationDuration: "1.5s", animationIterationCount: 2 }}>
                {emailCount}
              </span>
            )}
            <div className="ml-auto flex gap-2">
              <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </div>
              <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
              </div>
            </div>
          </div>

          {/* Email rows */}
          <div className="divide-y divide-gray-50">
            {emails.map((email, i) => (
              <div
                key={`${cycleKey}-${i}`}
                className="px-6 py-4 flex items-center gap-4 transition-all duration-600"
                style={{
                  opacity: i < emailCount ? 1 : 0,
                  transform: i < emailCount ? "translateY(0) translateX(0)" : "translateY(20px) translateX(-10px)",
                  transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1)`,
                  backgroundColor: i < emailCount ? (i === 0 ? "#f8faff" : "white") : "white",
                }}
              >
                {/* Unread indicator */}
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: i < emailCount ? email.color : "#e5e7eb" }} />

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[12px]"
                  style={{ backgroundColor: email.color }}>
                  {email.from.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-bold text-gray-900">{email.from}</span>
                    <span className="text-[11px] text-gray-400 shrink-0">{email.time}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-gray-700 truncate">{email.subject}</p>
                  <p className="text-[11px] text-gray-400 truncate">{email.preview}</p>
                </div>

                {/* Intent badge */}
                <div className="shrink-0">
                  <span className="text-[9px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${email.color}15`,
                      color: email.color,
                    }}>
                    {email.intent}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 4: STATS — full analytics cards ===== */}
      <div className="absolute inset-0 flex items-center justify-center px-6 scale-[0.5] sm:scale-[0.65] lg:scale-100 origin-center" style={panelStyle(4)}>
        <div className="flex gap-4 max-w-[900px]">
          {/* Leads — bar chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-[200px]"
            style={{
              boxShadow: "0 40px 80px -10px rgba(0,0,0,0.18), 0 20px 40px -8px rgba(0,0,0,0.12)",
              opacity: active === 4 ? 1 : 0, transform: active === 4 ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.7s ease 0s",
            }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400">Leads/mo</span>
              <span className="text-[9px] font-semibold text-green">↑ 142%</span>
            </div>
            <p className="text-[42px] font-bold text-gray-900 tabular-nums leading-none">55+</p>
            <p className="text-[11px] text-gray-400 mt-1 mb-4">from SEO</p>
            <div className="h-16 flex items-end gap-[3px]">
              {[12, 18, 15, 28, 22, 35, 30, 45, 40, 55, 50, 68, 62, 78, 72, 88].map((h, j) => (
                <div key={j} className="flex-1 rounded-t-sm transition-all ease-out"
                  style={{
                    height: active === 4 ? `${h}%` : "0%",
                    background: j >= 12 ? "#1a1a1a" : j >= 8 ? "#888" : "#ddd",
                    transitionDuration: "800ms",
                    transitionDelay: `${0.3 + j * 0.04}s`,
                  }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[7px] text-gray-300">Jan</span>
              <span className="text-[7px] text-gray-300">Now</span>
            </div>
          </div>

          {/* Views — area chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-[200px]"
            style={{
              boxShadow: "0 40px 80px -10px rgba(0,0,0,0.18), 0 20px 40px -8px rgba(0,0,0,0.12)",
              opacity: active === 4 ? 1 : 0, transform: active === 4 ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.7s ease 0.12s",
            }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400">Views</span>
              <span className="text-[9px] font-semibold text-green">↑ 234%</span>
            </div>
            <p className="text-[42px] font-bold text-gray-900 tabular-nums leading-none">135K</p>
            <p className="text-[11px] text-gray-400 mt-1 mb-4">video content</p>
            <div className="h-16 relative">
              <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M0 55 Q20 50 40 44 T80 35 T120 24 T160 15 T200 6 V60 H0 Z" fill="rgba(0,0,0,0.04)"
                  style={{ opacity: active === 4 ? 1 : 0, transition: "opacity 1s ease 0.5s" }} />
                <path d="M0 55 Q20 50 40 44 T80 35 T120 24 T160 15 T200 6" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="320" strokeDashoffset={active === 4 ? "0" : "320"}
                  style={{ transition: "stroke-dashoffset 1.8s ease 0.4s" }} />
                <circle cx="200" cy="6" r="3" fill="#1a1a1a"
                  style={{ opacity: active === 4 ? 1 : 0, transition: "opacity 0.3s ease 2s" }} />
              </svg>
            </div>
          </div>

          {/* Hours saved — donut */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-[200px]"
            style={{
              boxShadow: "0 40px 80px -10px rgba(0,0,0,0.18), 0 20px 40px -8px rgba(0,0,0,0.12)",
              opacity: active === 4 ? 1 : 0, transform: active === 4 ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.7s ease 0.24s",
            }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400">Hrs saved</span>
              <span className="text-[9px] font-semibold text-green">weekly</span>
            </div>
            <p className="text-[42px] font-bold text-gray-900 tabular-nums leading-none">20+</p>
            <p className="text-[11px] text-gray-400 mt-1 mb-3">automations</p>
            <div className="flex items-center justify-center">
              <div className="relative w-16 h-16">
                <svg className="-rotate-90 w-full h-full" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#eee" strokeWidth="5" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={active === 4 ? `${2 * Math.PI * 26 * 0.17}` : `${2 * Math.PI * 26}`}
                    style={{ transition: "stroke-dashoffset 1.5s ease 0.5s" }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[13px] font-bold text-gray-900">83%</span>
                </div>
              </div>
              <div className="ml-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                  <span className="text-[8px] text-gray-500">Automated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#eee]" />
                  <span className="text-[8px] text-gray-500">Manual</span>
                </div>
              </div>
            </div>
          </div>

          {/* Speed — gauge */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-[200px]"
            style={{
              boxShadow: "0 40px 80px -10px rgba(0,0,0,0.18), 0 20px 40px -8px rgba(0,0,0,0.12)",
              opacity: active === 4 ? 1 : 0, transform: active === 4 ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.7s ease 0.36s",
            }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400">Site speed</span>
              <span className="text-[9px] font-semibold text-green">3x faster</span>
            </div>
            <p className="text-[42px] font-bold text-gray-900 tabular-nums leading-none">0.8s</p>
            <p className="text-[11px] text-gray-400 mt-1 mb-3">load time</p>
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-gray-500">Before</span>
                  <span className="text-[8px] text-gray-400">2.4s</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gray-300 transition-all duration-1000"
                    style={{ width: active === 4 ? "80%" : "0%", transitionDelay: "0.5s" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-gray-900 font-semibold">After</span>
                  <span className="text-[8px] text-gray-900 font-semibold">0.8s</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#1a1a1a] transition-all duration-1000"
                    style={{ width: active === 4 ? "27%" : "0%", transitionDelay: "0.8s" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-50">
        {[0, 1, 2, 3, 4].map((i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-500 ${active === i ? "w-7 h-2.5 bg-gray-900" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
}
