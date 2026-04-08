const plans = [
  {
    name: "Video Production",
    desc: "Scroll-stopping content",
    price: "$1,200",
    period: "per month",
    features: ["4 videos per month", "Color grading & captions", "Social-ready formats", "48hr turnaround", "2 revision rounds", "Content calendar"],
    pop: false,
    cta: "Start with Video",
  },
  {
    name: "Website & SEO",
    desc: "Growing online presence",
    price: "$2,400",
    period: "per month",
    features: ["Everything from Video, plus:", "Custom Next.js website", "On-page & technical SEO", "Content strategy", "Monthly performance reports", "Google Business Profile"],
    pop: false,
    cta: "Start with Website",
  },
  {
    name: "Enterprise",
    desc: "Full-service, custom scope",
    price: "Custom",
    period: "tailored pricing",
    features: ["Everything from Website, plus:", "AI-powered automations", "Dedicated growth strategist", "Priority support & SLAs", "Custom reporting dashboards", "Unlimited revisions"],
    pop: true,
    cta: "Start with Enterprise",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" data-dark className="bg-[#0c0c0f] py-16 sm:py-24 lg:py-36 relative overflow-hidden">
      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2"><span className="text-[10px]">&#10022;</span> Pricing <span className="text-[10px]">&#10022;</span></p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-medium text-white leading-[1.1] tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-white/30 text-lg">No hidden fees. No lock-ins.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-5xl mx-auto rounded-2xl overflow-hidden border border-[#1e2230]">
          {plans.map((p, i) => (
            <div
              key={p.name}
              className={`relative p-7 flex flex-col group transition-all duration-500 hover:bg-[#151a28] ${
                p.pop
                  ? "bg-[#131825] md:border-x border-[#1e2230]"
                  : "bg-[#0f1118]"
              }`}
              style={p.pop ? {
                boxShadow: "0 0 60px rgba(59,130,246,0.06), inset 0 1px 0 rgba(59,130,246,0.1)",
              } : undefined}
            >
              {p.pop && (
                <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent" />
              )}
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold text-white">{p.name}</p>
              </div>
              <p className="text-[12px] text-white/30 mt-0.5">{p.desc}</p>

              <div className="h-px bg-[#1e2230] my-5" />

              <div className="flex items-baseline gap-1.5">
                <span className="text-[2rem] font-semibold text-white tracking-tight">{p.price}</span>
                <span className="text-[13px] text-white/25">{p.period}</span>
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f, j) => (
                  <li key={f} className="flex items-start gap-3 text-[13px]">
                    {j === 0 && f.includes("Everything") ? (
                      <span className="text-white/25 text-[12px]">{f}</span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="3.5" />
                        </svg>
                        <span className="text-white/45">{f}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <a
                href="https://calendly.com/thereadyconsult/discovery"
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 block text-center text-[14px] font-semibold py-3 rounded-xl transition-all ${
                  p.pop
                    ? "bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white hover:from-[#1d4ed8] hover:to-[#2563eb] shadow-[0_8px_30px_-4px_rgba(59,130,246,0.4)]"
                    : "bg-[#1a1f2e] text-white/70 hover:bg-[#242a3a] hover:text-white border border-[#1e2230]"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Enterprise bar */}
        <div className="max-w-5xl mx-auto mt-4 rounded-2xl bg-[#0f1118] border border-[#1e2230] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-[14px] font-semibold text-white">Enterprise</span>
            <span className="text-[12px] sm:text-[13px] text-white/25 ml-2">For teams that need custom limits, dedicated support, and SLAs.</span>
          </div>
          <a
            href="https://calendly.com/thereadyconsult/discovery"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-semibold text-white/60 border border-[#1e2230] px-5 py-2 rounded-xl hover:bg-[#1a1f2e] hover:text-white transition-all shrink-0"
          >
            Request trial
          </a>
        </div>
      </div>
    </section>
  );
}
