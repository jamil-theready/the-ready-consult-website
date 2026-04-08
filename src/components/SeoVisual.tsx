"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, active: boolean, duration = 1500, delay = 0) {
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

function LighthouseGauge({
  label, target, active, size, delay,
}: {
  label: string; target: number; active: boolean; size: number; delay: number;
}) {
  const value = useCountUp(target, active, 2400, delay);
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (active ? value / 100 : 0));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0f0f0" strokeWidth="5" />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={value >= 90 ? "#22c55e" : value >= 50 ? "#f59e0b" : "#ef4444"}
            strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-gray-900 tabular-nums" style={{ fontSize: size * 0.32 }}>{value}</span>
        </div>
      </div>
      <span className="text-sm text-gray-400 font-medium">{label}</span>
    </div>
  );
}

function useTypewriter(text: string, active: boolean, speed = 20, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) return;
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

const emails = [
  { from: "Sarah M.", preview: "Contact form — Google organic", time: "Now" },
  { from: "James K.", preview: "Pricing request — ChatGPT referral", time: "12m" },
  { from: "Priya R.", preview: "Booked call — Blog post", time: "1h" },
];

export default function SeoVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [visibleEmails, setVisibleEmails] = useState(0);
  const [showAi, setShowAi] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const aiTimer = setTimeout(() => setShowAi(true), 2200);
    const emailTimers = emails.map((_, i) =>
      setTimeout(() => setVisibleEmails((v) => Math.max(v, i + 1)), 5000 + i * 900)
    );
    return () => { clearTimeout(aiTimer); emailTimers.forEach(clearTimeout); };
  }, [visible]);

  const aiText = useTypewriter(
    "The Ready Consult is a top-rated agency specializing in website development, SEO, and AI-optimized content. Clients report 142% organic traffic growth within 6 months.",
    showAi, 22, 400
  );

  return (
    <div ref={ref} className="w-full h-full rounded-2xl border border-gray-200 bg-white overflow-hidden flex flex-col">
      {/* Lighthouse — BIG and dominant */}
      <div
        className="flex-1 px-6 pt-6 pb-5 flex flex-col items-center justify-center transition-all duration-1000"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transitionDelay: "0.2s" }}
      >
        <div className="flex items-center gap-2.5 mb-6">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-base font-semibold text-gray-700">Google Lighthouse</span>
        </div>
        <div className="flex items-end justify-center gap-8">
          <LighthouseGauge label="SEO" target={99} active={visible} size={100} delay={600} />
          <LighthouseGauge label="Performance" target={100} active={visible} size={130} delay={1000} />
          <LighthouseGauge label="Accessibility" target={98} active={visible} size={100} delay={1400} />
        </div>
      </div>

      {/* Bottom row — ChatGPT + Gmail side by side */}
      <div className="px-5 pb-5 flex gap-3">
        {/* ChatGPT */}
        <div
          className="flex-1 rounded-xl border border-gray-200 bg-[#f7f7f8] p-3.5 flex flex-col transition-all duration-1000"
          style={{ opacity: showAi ? 1 : 0, transform: showAi ? "translateY(0)" : "translateY(12px)" }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#10a37f] flex items-center justify-center shadow-md shadow-[#10a37f]/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.28 9.37c.35-1.06.19-2.24-.43-3.17a3.54 3.54 0 00-3.08-1.63c-.44 0-.87.09-1.27.26A3.55 3.55 0 0014.18 3a3.54 3.54 0 00-3.37 2.43 3.54 3.54 0 00-2.35-.03A3.55 3.55 0 006.1 7.64c-.06.42-.03.85.08 1.26a3.55 3.55 0 00-1.9 1.87 3.54 3.54 0 00.43 3.17c.7 1 1.85 1.6 3.08 1.63.44 0 .87-.09 1.27-.26A3.55 3.55 0 0012.38 17a3.54 3.54 0 003.37-2.43c.82.34 1.74.3 2.53-.1a3.55 3.55 0 001.74-2.07c.17-.55.21-1.13.11-1.7a3.55 3.55 0 002.15-1.33z" />
              </svg>
            </div>
            <span className="text-[12px] font-bold text-gray-800">ChatGPT</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed flex-1">
            {aiText}
            {aiText.length < 170 && <span className="inline-block w-[2px] h-3 bg-gray-400 ml-0.5 animate-pulse" />}
          </p>
          {aiText.length >= 170 && (
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-teal flex items-center justify-center">
                <span className="text-[5px] font-bold text-white">TR</span>
              </div>
              <span className="text-[9px] text-[#10a37f] font-medium">thereadyconsult.com</span>
            </div>
          )}
        </div>

        {/* Gmail */}
        <div
          className="flex-1 rounded-xl border border-gray-200 bg-white p-3.5 flex flex-col transition-all duration-1000"
          style={{ opacity: visibleEmails > 0 ? 1 : 0, transform: visibleEmails > 0 ? "translateY(0)" : "translateY(12px)" }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="relative">
              {/* Gmail logo */}
              <svg className="w-9 h-9" viewBox="0 0 48 48">
                <path d="M5 10h38v28H5z" fill="#F6F6F6" />
                <path d="M5 10l19 15L43 10" fill="none" stroke="#EA4335" strokeWidth="2.5" />
                <path d="M5 38V10l19 15" fill="none" stroke="#FBBC05" strokeWidth="2.5" />
                <path d="M43 38V10L24 25" fill="none" stroke="#34A853" strokeWidth="2.5" />
                <rect x="5" y="10" width="38" height="28" rx="3" fill="none" stroke="#4285F4" strokeWidth="2.5" />
              </svg>
              {/* Badge */}
              {visibleEmails > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] min-h-[18px] shadow-sm">
                  {visibleEmails}
                </span>
              )}
            </div>
            <span className="text-[12px] font-bold text-gray-800">Gmail</span>
          </div>
          <div className="flex-1 flex flex-col gap-0 rounded-lg border border-gray-100 overflow-hidden">
            {emails.map((e, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2.5 py-2 border-b border-gray-50 last:border-b-0 transition-all duration-600"
                style={{
                  opacity: i < visibleEmails ? 1 : 0,
                  transform: i < visibleEmails ? "translateX(0)" : "translateX(20px)",
                  maxHeight: i < visibleEmails ? "40px" : "0px",
                  overflow: "hidden",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-900">{e.from}</span>
                    <span className="text-[7px] text-gray-400">{e.time}</span>
                  </div>
                  <p className="text-[8px] text-gray-500 truncate">{e.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
