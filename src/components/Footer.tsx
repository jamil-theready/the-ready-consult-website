"use client";

import LogoAnimation from "./LogoAnimation";


export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-[#f5f5f3]">
      {/* CTA banner */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-semibold text-navy leading-[1.2] tracking-tight max-w-lg">
              #1 AI-native agency that builds, ranks, and automates.
            </h2>
            <p className="text-gray-400 text-lg mt-2 max-w-md">
              Try The Ready Consult for your next project.
            </p>
            <a
              href="https://calendly.com/d/ct8x-wk4-gsx/the-ready-consult-execs"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn relative inline-flex items-center gap-2.5 text-white font-semibold text-[15px] px-8 py-3.5 rounded-xl hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 overflow-hidden mt-6"
            >
              <span className="absolute inset-0 cta-shimmer" />
              <svg className="w-4.5 h-4.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="relative z-10">Book a Call</span>
            </a>
          </div>

          <div className="hidden md:block">
            <LogoAnimation size={140} color="#dc2626" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="border-t border-gray-300/50" />
      </div>

      {/* Footer links */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 66 66" fill="none">
              <circle cx="10.5" cy="10.5" r="8" fill="#dc2626"/>
              <circle cx="32.5" cy="10.5" r="8" fill="#dc2626"/>
              <circle cx="54.5" cy="10.5" r="8" fill="#dc2626"/>
              <circle cx="10.5" cy="32.5" r="8" fill="#dc2626"/>
              <circle cx="32.5" cy="32.5" r="8" fill="#dc2626"/>
              <circle cx="54.5" cy="32.5" r="8" fill="#dc2626" opacity="0.2"/>
              <circle cx="10.5" cy="54.5" r="8" fill="#dc2626"/>
              <circle cx="32.5" cy="54.5" r="8" fill="#dc2626" opacity="0.2"/>
              <circle cx="54.5" cy="54.5" r="8" fill="#dc2626"/>
            </svg>
            <span className="font-semibold text-navy text-[18px] tracking-tight">The Ready</span>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-16 lg:gap-24">
            <div>
              <p className="text-[13px] font-semibold text-navy mb-4">Services</p>
              <div className="space-y-3">
                {["Websites", "SEO", "Video", "AI Automations"].map((l) => (
                  <a key={l} href="#services" className="block text-[13px] text-gray-500 hover:text-navy transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-navy mb-4">Company</p>
              <div className="space-y-3">
                {[
                  { l: "Pricing", h: "#pricing" },
                  { l: "Process", h: "#how-it-works" },
                  { l: "Work", h: "/work" },
                  { l: "Team", h: "#team" },
                  { l: "FAQ", h: "#faq" },
                ].map((i) => (
                  <a key={i.l} href={i.h} className="block text-[13px] text-gray-500 hover:text-navy transition-colors">{i.l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-navy mb-4">Connect</p>
              <div className="space-y-3">
                <a href="mailto:team@thereadyconsult.com" className="block text-[13px] text-gray-500 hover:text-navy transition-colors">Email</a>
                <a href="https://calendly.com/d/ct8x-wk4-gsx/the-ready-consult-execs" target="_blank" rel="noopener noreferrer" className="block text-[13px] text-gray-500 hover:text-navy transition-colors">Book a Call</a>
                <a href="#contact" className="block text-[13px] text-gray-500 hover:text-navy transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-300/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-400">&copy; {new Date().getFullYear()} The Ready Consult. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            <span className="text-[12px] text-gray-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
