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
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(false);
          setShowAi(false);
          setVisibleEmails(0);
          requestAnimationFrame(() => setVisible(true));
        } else {
          setVisible(false);
          setShowAi(false);
          setVisibleEmails(0);
        }
      },
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
    <div ref={ref} className="w-full h-full overflow-hidden flex flex-col">
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
          className="flex-1 rounded-xl bg-[#f7f7f8] shadow-lg shadow-black/5 p-3.5 flex flex-col transition-all duration-1000"
          style={{ opacity: showAi ? 1 : 0, transform: showAi ? "translateY(0)" : "translateY(12px)" }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#10a37f] flex items-center justify-center shadow-md shadow-[#10a37f]/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4091-.6765zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0974-2.3616l2.603-1.5018 2.6032 1.5018v3.0036l-2.6032 1.5018-2.603-1.5018z" />
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
          className="flex-1 rounded-xl bg-white shadow-lg shadow-black/5 p-3.5 flex flex-col transition-all duration-1000"
          style={{ opacity: visibleEmails > 0 ? 1 : 0, transform: visibleEmails > 0 ? "translateY(0)" : "translateY(12px)" }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="relative">
              {/* Gmail logo */}
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
                <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" fill="#fff"/>
                <path d="M2 6v12h4V10l6 4.5L18 10v8h4V6L12 13 2 6z" fill="#EA4335"/>
                <path d="M2 6v12h4V10l6 4.5" fill="#4285F4"/>
                <path d="M22 6v12h-4V10l-6 4.5" fill="#34A853"/>
                <path d="M6 10l6 4.5L18 10V6L12 10.5 6 6v4z" fill="#FBBC05" opacity="0.9"/>
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
          <div className="flex-1 flex flex-col gap-0 rounded-lg overflow-hidden">
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
