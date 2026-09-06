const rows = [
  { us: "Revenue targets", them: "Vanity metrics" },
  { us: "72-hour test loops", them: "Weeks per campaign" },
  { us: "Live dashboards", them: "Monthly PDF reports" },
  { us: "Custom AI agents", them: "Manual everything" },
  { us: "High-converting craft", them: "Template creative" },
];

export default function WhyUs() {
  return (
    <section className="bg-void py-24 lg:py-36 relative overflow-hidden rounded-[12px]">
      {/* Stripe-style gradient accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan/5 rounded-full blur-[100px]" />

      <div className="relative max-w-[1280px] mx-auto px-6">
        <p className="text-cyan font-semibold text-[15px] mb-4">Why us</p>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-foreground leading-[1.1] tracking-tight max-w-xl mb-16">
          The difference is measurable
        </h2>

        <div className="border border-white/10 overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-5 lg:p-6 bg-background/5 rounded-[12px]">
              <p className="text-[13px] font-semibold text-teal-light uppercase tracking-wider">The Ready Consult</p>
            </div>
            <div className="p-5 lg:p-6 border-l border-white/10 bg-slab/[0.02] rounded-[12px]">
              <p className="text-[13px] font-semibold text-foreground/30 uppercase tracking-wider">Traditional Agencies</p>
            </div>
          </div>
          {rows.map((r) => (
            <div key={r.us} className="grid grid-cols-2 border-t border-white/10">
              <div className="p-5 lg:p-6 flex items-center gap-3">
                <svg className="w-5 h-5 text-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[15px] text-foreground font-medium">{r.us}</span>
              </div>
              <div className="p-5 lg:p-6 border-l border-white/10 flex items-center gap-3 rounded-[12px]">
                <svg className="w-5 h-5 text-foreground/20 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-[15px] text-foreground/40">{r.them}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
