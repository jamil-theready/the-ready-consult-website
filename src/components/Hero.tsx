"use client";

import HeroVisual from "./HeroVisual";
import RotatingWord from "./RotatingWord";

// Entrance is driven by the scroll-craft engine (data-sc-in / data-sc-stagger),
// which mounts only after the loading screen resolves, so the reveal is not
// spent behind the splash. No local reveal state, no timers.
export default function Hero() {
  return (
    <section
      id="hero"
      className="sc-section relative bg-background min-h-[100vh] flex flex-col overflow-x-clip lg:overflow-hidden"
      data-sc-act="flow"
      data-sc-in
      data-sc-stagger="70"
    >
      {/* The faint workflow graphic and the HeroDiorama town both lived here.
          Removed 2026-09-06: the hero sits on the bare ground now. Both are
          still in the tree (HeroDiorama.tsx, and the .hd rules in globals.css)
          so either can be put back by re-adding one line. */}

      <div className="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 w-full pt-20 sm:pt-28 pb-0 flex-1 flex flex-col justify-start items-center text-center">
        <h1
          className="t-display max-w-[900px] text-navy"
          data-sc-cue="0 0.78 0"
        >
          <span className="block">AI solutions for your</span>
          <span className="block">
            <RotatingWord /> business.
          </span>
        </h1>

        <p className="mt-5 text-[15px] text-gray-500 max-w-[540px] leading-relaxed">
          We build the site, run the Google profile, and keep the content
          coming, so the people searching for your trade find you first.
        </p>

        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4">
          <a
            href="/contact"
            className="cta-btn relative inline-flex items-center gap-2.5 text-foreground font-semibold text-[15px] px-8 py-3.5 hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 overflow-hidden group rounded-[6px]"
          >
            <span className="absolute inset-0 cta-shimmer" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              boxShadow: "inset 0 0 20px rgba(255,255,255,0.08), 0 0 40px rgba(255,255,255,0.06)",
            }} />
            <span className="relative z-10">Sign up</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 text-gray-500 font-semibold text-[14px] px-6 py-3.5 border border-gray-200 hover:bg-gray-50 hover:text-navy transition-all rounded-[6px]"
          >
            See how it works
          </a>
        </div>

        <div className="hero-stage mt-24 sm:mt-28 lg:mt-32 w-full" data-sc-parallax="-0.28">
          <div className="hidden lg:block hero-stage__scale">
            <HeroVisual />
          </div>
          <div className="block lg:hidden mx-auto w-full" style={{ height: "540px", overflow: "visible" }}>
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
