export default function Contact() {
  return (
    <section id="contact" className="bg-background py-24 lg:py-36 rounded-[12px]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-teal font-semibold text-[15px] mb-4">Get started</p>
          <h2 className="t-h2 text-navy ">
            Ready to grow?
          </h2>
          <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-xl mx-auto">
            One conversation. No pitch decks, no pressure. Book a free discovery
            call and let&rsquo;s talk about what growth looks like for you.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://calendly.com/thereadyconsult/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal text-foreground font-semibold text-[15px] px-8 py-4 rounded-full hover:bg-teal-light transition-colors"
            >
              Book a discovery call <span>&rarr;</span>
            </a>
            <a
              href="mailto:team@thereadyconsult.com"
              className="inline-flex items-center gap-2 text-navy font-semibold text-[15px] px-8 py-4 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
            >
              Email us
            </a>
          </div>

          <div className="mt-14 p-6 bg-gray-50 max-w-md mx-auto rounded-[12px]">
            <div className="flex gap-0.5 justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-teal" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-[15px] text-gray-600 italic leading-relaxed">
              &ldquo;They execute faster than any agency we&rsquo;ve worked with.&rdquo;
            </p>
            <p className="text-[13px] text-gray-400 mt-3">AJ Green &middot; 2x sales</p>
          </div>
        </div>
      </div>
    </section>
  );
}
