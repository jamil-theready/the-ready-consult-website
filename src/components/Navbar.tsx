"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Process", href: "#how-it-works" },
];

function MenuDots({ open }: { open: boolean }) {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" className="overflow-visible" data-menu-dots>
        {[
          { cx: 6, cy: 6 }, { cx: 12, cy: 6 }, { cx: 18, cy: 6 },
          { cx: 6, cy: 12 }, { cx: 12, cy: 12, large: true }, { cx: 18, cy: 12 },
          { cx: 6, cy: 18 }, { cx: 12, cy: 18 }, { cx: 18, cy: 18 },
        ].map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.large ? 2.5 : 1.5} fill="currentColor" />
        ))}
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ opacity: open ? 1 : 0, transition: "opacity 0.2s ease" }} />
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ opacity: open ? 1 : 0, transition: "opacity 0.2s ease" }} />
      </svg>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setInHero(window.scrollY < window.innerHeight * 0.6);

      const darkSections = document.querySelectorAll('[data-dark]');
      let isOverDark = false;
      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 64 && rect.bottom >= 64) {
          isOverDark = true;
        }
      });
      setDark(isOverDark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      dark
        ? "bg-[#0c0c0f]/95 backdrop-blur-xl border-b border-white/5"
        : scrolled ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : ""
    }`}>
      <nav className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className={`flex items-center gap-2.5 transition-colors duration-500 ${dark ? "text-white" : "text-navy"}`}>
          <svg width="22" height="22" viewBox="0 0 66 66" fill="none">
            <rect x="2" y="2" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="24" y="2" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="46" y="2" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="2" y="24" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="24" y="24" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="2" y="46" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="46" y="46" width="17" height="17" rx="5" fill="currentColor"/>
          </svg>
          <span className="font-semibold text-[15px]">The Ready Consult</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={`text-[15px] transition-colors duration-500 ${dark ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-navy"}`}>{l.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://calendly.com/thereadyconsult/discovery"
            target="_blank"
            rel="noopener noreferrer"
            className={`relative text-[15px] font-semibold px-7 py-2.5 rounded-2xl transition-all duration-500 overflow-hidden ${
              inHero ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
            } ${dark ? "bg-white text-black hover:bg-gray-100" : "cta-btn text-white"}`}
          >
            {!dark && <span className="absolute inset-0 cta-shimmer" />}
            <span className="relative z-10">Book a Call &rarr;</span>
          </a>
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden rounded-lg border transition-colors duration-500 ${dark ? "text-white border-white/20" : "text-navy border-gray-200"}`}
            aria-label="Menu" aria-expanded={open}
          >
            <MenuDots open={open} />
          </button>
        </div>
      </nav>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-60 bg-white/98 backdrop-blur-xl" : "max-h-0"}`}>
        <div className="px-6 py-5 space-y-4 border-t border-gray-100">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-[15px] text-gray-600 hover:text-navy">{l.label}</a>
          ))}
        </div>
      </div>
    </header>
  );
}
