"use client";

const mainQuote = {
  text: "Our partnership works perfectly. They genuinely understand growth and execute faster than any agency we\u2019ve worked with.",
  name: "AJ Green",
  role: "Head of Growth",
  result: "2x sales increase",
  initials: "AJ",
};

const ticker = [
  { text: "Revenue up 140% in 6 months.", name: "Maria L.", role: "CEO, Perfecto Homes" },
  { text: "Best video content we\u2019ve ever had. Period.", name: "Derek S.", role: "Marketing Director" },
  { text: "They replaced three vendors for us.", name: "Priya K.", role: "Founder, SaaS Startup" },
  { text: "SEO traffic tripled in one quarter.", name: "Carlos M.", role: "VP Marketing" },
  { text: "Finally an agency that actually ships.", name: "Nina T.", role: "COO, Ampere Computing" },
  { text: "Our CAC dropped 40% with their strategy.", name: "James R.", role: "Growth Lead" },
];

const tickerItems = [...ticker, ...ticker];

export default function Testimonial() {
  return (
    <section data-dark className="bg-[#0d0a0a] py-16 sm:py-24 lg:py-36 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="max-w-4xl">
          <div className="flex gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-cyan" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <blockquote className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold text-foreground leading-[1.2] tracking-tight">
            &ldquo;{mainQuote.text}&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
              <span className="text-foreground font-bold text-sm">{mainQuote.initials}</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{mainQuote.name}</p>
              <p className="text-[14px] text-foreground/40">
                {mainQuote.role} &middot;{" "}
                <span className="text-cyan font-medium">{mainQuote.result}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conveyor belt */}
      <div className="mt-20 relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0d0a0a] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0d0a0a] to-transparent z-10" />

        <div className="flex gap-5 animate-ticker">
          {tickerItems.map((t, i) => (
            <div
              key={i}
              className="shrink-0 w-[260px] sm:w-[320px] border border-white/10 bg-slab/[0.04] p-4 sm:p-5"
            >
              <p className="text-foreground/60 text-sm leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center">
                  <span className="text-foreground/60 text-xs font-bold">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-foreground/80 text-xs font-semibold">{t.name}</p>
                  <p className="text-foreground/30 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
