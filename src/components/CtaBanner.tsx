export default function CtaBanner() {
  return (
    <section className="relative gradient-mesh py-16 sm:py-24 lg:py-36 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan/10 rounded-full blur-[100px]" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold text-white leading-[1.1] tracking-tight">
          Stop paying for activity.<br />
          <span className="text-cyan">Start paying for outcomes.</span>
        </h2>
        <p className="mt-6 text-white/40 text-lg">One conversation to start. No pitch decks, no pressure.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="https://calendly.com/thereadyconsult/discovery" target="_blank" rel="noopener noreferrer" className="bg-white text-navy font-semibold text-[15px] px-6 py-3.5 rounded-full hover:bg-gray-100 transition-colors">
            Book a discovery call <span>&rarr;</span>
          </a>
          <a href="mailto:team@thereadyconsult.com" className="text-white/60 font-semibold text-[15px] px-6 py-3.5 rounded-full border border-white/15 hover:text-white hover:border-white/30 transition-all">
            team@thereadyconsult.com
          </a>
        </div>
      </div>
    </section>
  );
}
