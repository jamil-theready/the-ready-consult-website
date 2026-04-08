export default function Contact() {
  return (
    <section id="contact" className="bg-white py-16 sm:py-24 lg:py-36">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold text-navy leading-[1.05] tracking-tight">
            Let&rsquo;s cook.
          </h2>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://calendly.com/thereadyconsult/discovery"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn relative inline-flex items-center gap-2.5 text-white font-semibold text-[16px] px-10 py-4.5 rounded-2xl hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 overflow-hidden group"
            >
              <span className="absolute inset-0 cta-shimmer" />
              <span className="relative z-10">Book a Call</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </a>
            <a
              href="mailto:team@thereadyconsult.com"
              className="inline-flex items-center gap-2 text-gray-500 font-semibold text-[15px] px-7 py-4 rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-navy transition-all"
            >
              Email us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
