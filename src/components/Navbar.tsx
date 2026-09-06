"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#how-it-works" },
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
];

function MenuDots({ open }: { open: boolean }) {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg width="30" height="30" viewBox="0 0 24 24" className="overflow-visible" data-menu-dots>
        {[
          { cx: 6, cy: 6 }, { cx: 12, cy: 6 }, { cx: 18, cy: 6 },
          { cx: 6, cy: 12 }, { cx: 12, cy: 12, large: true }, { cx: 18, cy: 12 },
          { cx: 6, cy: 18 }, { cx: 12, cy: 18 }, { cx: 18, cy: 18 },
        ].map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.large ? 2.8 : 1.8} fill="currentColor" />
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
  const [inFooter, setInFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setInHero(window.scrollY < window.innerHeight * 0.6);

      const footer = document.querySelector("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        setInFooter(footerRect.top < window.innerHeight);
      }

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
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      dark
        ? "bg-[#0d0a0a]/65 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10"
        : "bg-white/65 backdrop-blur-2xl backdrop-saturate-150 border-b border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    }`}>
      <nav className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className={`flex items-center gap-2.5 transition-colors duration-500 ${dark ? "text-white" : "text-navy"}`}>
          <svg width="26" height="26" viewBox="0 0 66 66" fill="none">
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
          <span className="font-semibold text-[16px] tracking-tight">The Ready</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={`text-[14px] transition-colors duration-500 ${dark ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-navy"}`}>{l.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop CTA — hidden in hero */}
          <a
            href="/contact"
            className={`hidden md:inline-flex relative text-[13px] font-semibold px-6 py-2.5 rounded-xl transition-all duration-500 overflow-hidden ${
              inHero ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
            } cta-btn text-white`}
          >
            <span className="absolute inset-0 cta-shimmer" />
            <span className="relative z-10">Sign up &rarr;</span>
          </a>
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden rounded-lg transition-colors duration-500 ${dark ? "text-white" : "text-navy"}`}
            aria-label="Menu" aria-expanded={open}
          >
            <MenuDots open={open} />
          </button>
        </div>
      </nav>

    </header>

      {/* Black overlay — outside header for proper z-index */}
      <div
        className={`fixed inset-0 bg-black/70 z-[9998] md:hidden transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* Slide-in menu — outside header for proper z-index */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[9999] md:hidden transition-transform duration-300 ease-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ boxShadow: open ? "-20px 0 60px rgba(0,0,0,0.3)" : "none" }}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 shrink-0">
          <span className="font-semibold text-navy text-[14px]">Menu</span>
          <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-navy hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-10 space-y-7 flex-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-[18px] font-medium text-navy hover:text-teal transition-colors">{l.label}</a>
          ))}
        </div>
        <div className="px-6 pb-12 shrink-0">
          <a
            href="/contact"
            onClick={() => setOpen(false)}
            className="cta-btn relative block text-center text-white font-semibold text-[14px] px-6 py-4 rounded-2xl overflow-hidden"
          >
            <span className="absolute inset-0 cta-shimmer" />
            <span className="relative z-10">Sign up &rarr;</span>
          </a>
        </div>
      </div>

      {/* Fixed bottom CTA — mobile only, hides in hero, footer, and when menu open */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden transition-all duration-500 ${
          inHero || inFooter || open ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        <a
          href="/contact"
          className="cta-btn relative inline-flex items-center gap-2 text-white font-semibold text-[12px] sm:text-[14px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl overflow-hidden hover:scale-[1.03] active:scale-[0.97] transition-transform duration-200"
          style={{ boxShadow: "0 10px 40px -8px rgba(0,0,0,0.4), 0 4px 12px -4px rgba(0,0,0,0.2)" }}
        >
          <span className="absolute inset-0 cta-shimmer" />
          <span className="relative z-10">Sign up &rarr;</span>
        </a>
      </div>
    </>
  );
}
