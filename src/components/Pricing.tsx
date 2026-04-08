const plans = [
  {
    name: "Website & SEO",
    price: "$1,200",
    period: "/mo",
    desc: "Custom website build with ongoing SEO to drive organic growth.",
    features: ["Custom Next.js website", "On-page & technical SEO", "Content strategy", "Monthly performance reports", "Core Web Vitals optimization", "Google Business Profile setup"],
    accent: "from-teal to-cyan",
    pop: false,
  },
  {
    name: "Video Production",
    price: "$700",
    period: "/video",
    desc: "Concept to delivery. Scroll-stopping content.",
    features: ["Up to 30 minutes", "Color grading", "Captions & graphics", "2 revision rounds", "48hr turnaround", "Social-ready formats"],
    accent: "from-cyan to-green",
    pop: false,
  },
  {
    name: "Enterprise Bundle",
    price: "Custom",
    period: "",
    desc: "Website, SEO, video, and growth strategy — tailored to your scale.",
    features: ["Everything in Website & SEO", "Everything in Video Production", "Dedicated growth strategist", "AI-powered automation", "Priority support & SLAs", "Custom reporting dashboards"],
    accent: "from-purple to-blue",
    pop: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-navy py-24 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple/5 rounded-full blur-[120px]" />

      <div className="relative max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-cyan font-semibold text-[15px] mb-4">Pricing</p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-white leading-[1.1] tracking-tight">
            Pricing that pays for itself
          </h2>
          <p className="mt-4 text-white/40 text-lg">No hidden fees. No lock-ins.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-2xl p-8 border ${p.pop ? "bg-white/[0.08] border-white/20" : "bg-white/[0.03] border-white/10"}`}>
              {p.pop && (
                <div className={`absolute -top-px left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r ${p.accent}`} />
              )}
              <p className="text-[13px] text-white/40 uppercase tracking-wider">{p.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[2.5rem] font-bold text-white tracking-tight">{p.price}</span>
                <span className="text-white/30 text-[15px]">{p.period}</span>
              </div>
              <p className="mt-2 text-[15px] text-white/40">{p.desc}</p>

              <a href="https://calendly.com/thereadyconsult/discovery" target="_blank" rel="noopener noreferrer" className={`mt-6 block text-center text-[14px] font-semibold py-3 rounded-full transition-colors ${p.pop ? "bg-white text-navy hover:bg-gray-100" : "bg-white/10 text-white hover:bg-white/15"}`}>
                {p.price === "Custom" ? "Contact us" : "Get started"} <span>&rarr;</span>
              </a>

              <ul className="mt-6 pt-6 border-t border-white/10 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[14px] text-white/60">
                    <svg className="w-4 h-4 text-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
