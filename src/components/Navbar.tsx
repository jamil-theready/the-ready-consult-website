"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Process", href: "#how-it-works" },
  { label: "Team", href: "#team" },
];

function MenuDots({ open }: { open: boolean }) {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center group/dots">
      <svg width="24" height="24" viewBox="0 0 24 24" className="overflow-visible" data-menu-dots>
        {/* 3x3 dot grid — each dot animates independently on hover */}
        {[
          // row 1
          { cx: 6, cy: 6, delay: 0 },
          { cx: 12, cy: 6, delay: 0.05 },
          { cx: 18, cy: 6, delay: 0.1 },
          // row 2
          { cx: 6, cy: 12, delay: 0.15 },
          { cx: 12, cy: 12, delay: 0.2, large: true },
          { cx: 18, cy: 12, delay: 0.25 },
          // row 3
          { cx: 6, cy: 18, delay: 0.3 },
          { cx: 12, cy: 18, delay: 0.35 },
          { cx: 18, cy: 18, delay: 0.4 },
        ].map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.large ? 2.5 : 1.5}
            fill="currentColor"
            className="origin-center"
            style={{
              transition: `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${dot.delay}s, r 0.3s ease ${dot.delay}s`,
            }}
          >
            {!open && (
              <animate
                attributeName="r"
                values={`${dot.large ? 2.5 : 1.5};${dot.large ? 3.5 : 2.5};${dot.large ? 2.5 : 1.5}`}
                dur="1.5s"
                begin={`${dot.delay * 2}s`}
                repeatCount="0"
                className="dot-pulse"
              />
            )}
          </circle>
        ))}

        {/* X overlay when open */}
        <line
          x1="6" y1="6" x2="18" y2="18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        />
        <line
          x1="18" y1="6" x2="6" y2="18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        />
      </svg>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : ""}`}>
      <nav className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 66 66" fill="none">
            <rect x="2" y="2" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="24" y="2" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="46" y="2" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="2" y="24" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="24" y="24" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="2" y="46" width="17" height="17" rx="5" fill="currentColor"/>
            <rect x="46" y="46" width="17" height="17" rx="5" fill="currentColor"/>
          </svg>
          <span className="font-semibold text-navy text-[15px]">The Ready Consult</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[15px] text-gray-600 hover:text-navy transition-colors">{l.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#contact" className="hidden sm:block text-[15px] text-gray-600 hover:text-navy transition-colors border border-gray-200 rounded-full px-4 py-2">Contact</a>
          <a href="https://calendly.com/thereadyconsult/discovery" target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold bg-blue text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
            Get Started <span className="ml-0.5">&rarr;</span>
          </a>
          <button
            onClick={() => setOpen(!open)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`md:hidden text-navy rounded-lg border border-gray-200 transition-colors ${hovered ? "bg-gray-50" : ""}`}
            aria-label="Menu"
            aria-expanded={open}
          >
            <MenuDots open={open} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
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
