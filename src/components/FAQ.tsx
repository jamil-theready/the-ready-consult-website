"use client";

import { useState } from "react";

const faqs = [
  { q: "What makes you different from a traditional agency?", a: "We operate as an embedded growth partner with AI-first execution and outcome-driven pricing. Live dashboards, weekly syncs, no hidden work." },
  { q: "How do fractional growth services work?", a: "CMO-level strategy, KPI tracking, and team coordination at a fraction of a full-time hire. Ideal for $1M-$20M companies." },
  { q: "What industries do you work with?", a: "B2B SaaS, ecommerce, professional services, and funded startups with product-market fit and $1M-$50M revenue." },
  { q: "Can you handle both strategy and execution?", a: "Yes. We design the plan and execute it. Content, video, ads, SEO. Nothing falls through the cracks." },
  { q: "How do you use AI?", a: "Custom agents for research, drafting, analysis, and optimization. 72-hour test loops and automated reporting." },
  { q: "What are your minimum engagements?", a: "Monthly retainers, per-asset video, quarterly SEO sprints. No long-term lock-in. 90 days recommended." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-gray-50 py-24 lg:py-36">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-teal font-semibold text-[15px] mb-4">FAQ</p>
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-navy leading-[1.1] tracking-tight mb-12">
          Common questions
        </h2>

        <div>
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-gray-200 last:border-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                aria-expanded={open === i}
              >
                <span className="text-[15px] font-medium text-navy pr-8 group-hover:text-teal transition-colors">{f.q}</span>
                <span className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${open === i ? "rotate-45" : ""}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="text-gray-500 text-[15px] leading-relaxed pb-5">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
