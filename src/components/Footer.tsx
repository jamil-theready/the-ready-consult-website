"use client";

import LogoAnimation from "./LogoAnimation";


export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-void border-t border-seam">
      {/* CTA banner */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <h2 className="t-h2 text-navy max-w-lg">
              Your website. Built in one day. Improved every month.
            </h2>
            <p className="text-gray-400 text-lg mt-2 max-w-md">
              $103.30/month. No minimum term. Construction starts after confirmed onboarding.
            </p>
            <a
              href="/#signup"
              className="cta-btn relative inline-flex items-center gap-2.5 text-foreground font-semibold text-[14px] px-8 py-3.5 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 overflow-hidden mt-6 rounded-[12px]"
            >
              <span className="absolute inset-0 cta-shimmer" />
              <svg className="w-4.5 h-4.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="relative z-10">Get my website</span>
            </a>
          </div>

          <div className="hidden md:block">
            <LogoAnimation size={140} color="var(--amber)" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="border-t border-gray-300/50" />
      </div>

      {/* Footer links */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12 pb-20 sm:pb-24">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* The brand block was a 22px mark and a wordmark and nothing else, so
              justify-between stranded the link columns against the right edge
              with half the row empty. It now carries a line of copy and holds
              its side. The mark uses .lit/.unlit like everywhere else — this
              one was still drawing unlit cells as opacity="0.2". */}
          <div className="max-w-[300px]">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 66 66" fill="none" className="overflow-visible">
                <circle className="lit"   cx="10.5" cy="10.5" r="8"/>
                <circle className="lit"   cx="32.5" cy="10.5" r="8"/>
                <circle className="lit"   cx="54.5" cy="10.5" r="8"/>
                <circle className="lit"   cx="10.5" cy="32.5" r="8"/>
                <circle className="lit"   cx="32.5" cy="32.5" r="8"/>
                <circle className="unlit" cx="54.5" cy="32.5" r="8"/>
                <circle className="lit"   cx="10.5" cy="54.5" r="8"/>
                <circle className="unlit" cx="32.5" cy="54.5" r="8"/>
                <circle className="lit"   cx="54.5" cy="54.5" r="8"/>
              </svg>
              <span className="font-semibold text-navy text-[16px] tracking-tight">The Ready</span>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-gray-400">
              Managed websites and monthly SEO for small businesses serving local customers.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-16 lg:gap-24">
            <div>
              <p className="text-[12px] font-semibold text-navy mb-4">Services</p>
              <div className="space-y-3">
                {["Websites", "Monthly SEO", "Hosting", "Lead alerts", "Dashboard"].map((l) => (
                  <a key={l} href="/#services" className="block text-[12px] text-gray-500 hover:text-navy transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-navy mb-4">Company</p>
              <div className="space-y-3">
                {[
                  { l: "Pricing", h: "/#pricing" },
                  { l: "Process", h: "/#how-it-works" },
                  { l: "Work", h: "/work" },
                  { l: "Get started", h: "/#signup" },
                  { l: "FAQ", h: "/#faq" },
                ].map((i) => (
                  <a key={i.l} href={i.h} className="block text-[12px] text-gray-500 hover:text-navy transition-colors">{i.l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-navy mb-4">Connect</p>
              <div className="space-y-3">
                <a href="mailto:jamil@thereadyconsult.com" className="block text-[12px] text-gray-500 hover:text-navy transition-colors">Email</a>
                <a href="/#signup" className="block text-[12px] text-gray-500 hover:text-navy transition-colors">Get started</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar.
            Only handles that actually exist are linked. TRC has no brand
            Instagram or Facebook on file, so none is invented here — an icon
            pointing at a dead profile is worse than no icon. Shawn's LinkedIn
            is deliberately absent (out 2026-06-23). */}
        <div className="mt-12 pt-6 border-t border-seam flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-[11px] text-gray-400 order-3 sm:order-1">
            &copy; {new Date().getFullYear()} The Ready Consult. All rights reserved.
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <a href="https://www.linkedin.com/in/jamilgonzales/" target="_blank" rel="noopener noreferrer"
               aria-label="The Ready Consult on LinkedIn"
               className="w-9 h-9 flex items-center justify-center border border-seam rounded-[8px] text-gray-400 hover:text-amber hover:border-amber transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C20.6 8.75 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.3-2.02-3.3-2.02 0-2.33 1.57-2.33 3.2V21H9z"/>
              </svg>
            </a>
            <a href="https://x.com/jamilgonzales" target="_blank" rel="noopener noreferrer"
               aria-label="The Ready Consult on X"
               className="w-9 h-9 flex items-center justify-center border border-seam rounded-[8px] text-gray-400 hover:text-amber hover:border-amber transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23zm-1.16 17.52h1.83L7.01 4.13H5.05z"/>
              </svg>
            </a>
            <a href="mailto:jamil@thereadyconsult.com"
               aria-label="Email The Ready Consult"
               className="w-9 h-9 flex items-center justify-center border border-seam rounded-[8px] text-gray-400 hover:text-amber hover:border-amber transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <rect x="2.5" y="5" width="19" height="14" rx="2" />
                <path d="m3 6.5 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-1.5 order-2 sm:order-3">
            <span className="w-2 h-2 rounded-full bg-glow animate-pulse" />
            <span className="text-[11px] text-gray-400">Month to month. No minimum.</span>
          </div>
        </div>
        <nav aria-label="Legal" className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-gray-400">
          <a href="/privacy" className="hover:text-navy transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-navy transition-colors">Terms</a>
          <a href="/data-deletion" className="hover:text-navy transition-colors">Data deletion</a>
        </nav>
      </div>
    </footer>
  );
}
