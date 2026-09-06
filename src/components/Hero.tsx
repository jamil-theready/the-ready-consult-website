"use client";

import HeroVisual from "./HeroVisual";
import HeroDiorama from "./HeroDiorama";
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
      {/* n8n-style workflow lines */}
      <svg
        className="absolute -inset-y-[18%] inset-x-0 w-full h-[136%] pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.06 }}
        data-sc-parallax="2.4"
        aria-hidden="true"
      >
        {/* Nodes */}
        {[
          { x: 80, y: 120 }, { x: 250, y: 80 }, { x: 440, y: 150 },
          { x: 650, y: 60 }, { x: 860, y: 130 }, { x: 1060, y: 70 },
          { x: 1250, y: 140 }, { x: 1380, y: 90 },
          { x: 60, y: 380 }, { x: 200, y: 450 }, { x: 400, y: 350 },
          { x: 1100, y: 400 }, { x: 1300, y: 350 }, { x: 1400, y: 450 },
          { x: 100, y: 650 }, { x: 300, y: 720 }, { x: 500, y: 680 },
          { x: 950, y: 700 }, { x: 1150, y: 750 }, { x: 1350, y: 680 },
          { x: 120, y: 850 }, { x: 380, y: 830 },
          { x: 1050, y: 850 }, { x: 1320, y: 820 },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x} y={n.y} width="40" height="28" rx="8" fill="none" stroke="currentColor" strokeWidth="1.2">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${4 + (i % 3)}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </rect>
            <circle cx={n.x + 20} cy={n.y + 14} r="4" fill="currentColor" opacity="0.4">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${4 + (i % 3)}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        {/* Bezier connections */}
        {[
          "M 120 134 C 180 134 190 94 250 94",
          "M 290 94 C 360 94 370 164 440 164",
          "M 480 164 C 560 164 570 74 650 74",
          "M 690 74 C 770 74 780 144 860 144",
          "M 900 144 C 980 144 990 84 1060 84",
          "M 1100 84 C 1170 84 1180 154 1250 154",
          "M 1290 154 C 1340 154 1350 104 1380 104",
          "M 100 394 C 150 394 150 464 200 464",
          "M 240 464 C 320 464 320 364 400 364",
          "M 1140 414 C 1220 414 1220 364 1300 364",
          "M 1340 364 C 1370 364 1370 464 1400 464",
          "M 140 664 C 220 664 220 734 300 734",
          "M 340 734 C 420 734 420 694 500 694",
          "M 990 714 C 1070 714 1070 764 1150 764",
          "M 1190 764 C 1270 764 1270 694 1350 694",
          "M 160 864 C 270 864 270 844 380 844",
          "M 1090 864 C 1200 864 1200 834 1320 834",
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="1.2">
            <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${5 + (i % 4)}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </path>
        ))}
        {/* Traveling dots */}
        {[
          "M 120 134 C 180 134 190 94 250 94 C 360 94 370 164 440 164 C 560 164 570 74 650 74 C 770 74 780 144 860 144",
          "M 860 144 C 980 144 990 84 1060 84 C 1170 84 1180 154 1250 154 C 1340 154 1350 104 1380 104",
          "M 140 664 C 220 664 220 734 300 734 C 420 734 420 694 500 694",
          "M 990 714 C 1070 714 1070 764 1150 764 C 1270 764 1270 694 1350 694",
        ].map((d, i) => (
          <circle key={`dot-${i}`} r="3" fill="currentColor" opacity="0.5">
            <animateMotion dur={`${8 + i * 2}s`} repeatCount="indefinite" path={d} />
          </circle>
        ))}
        {/* Connector dots on nodes */}
        {[
          { x: 80, y: 134 }, { x: 120, y: 134 }, { x: 250, y: 94 }, { x: 290, y: 94 },
          { x: 440, y: 164 }, { x: 480, y: 164 }, { x: 650, y: 74 }, { x: 690, y: 74 },
          { x: 860, y: 144 }, { x: 900, y: 144 }, { x: 1060, y: 84 }, { x: 1100, y: 84 },
        ].map((c, i) => (
          <circle key={`conn-${i}`} cx={c.x} cy={c.y} r="2.5" fill="currentColor" opacity="0.3" />
        ))}
      </svg>

      <HeroDiorama />

      <div className="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 w-full pt-20 sm:pt-28 pb-0 flex-1 flex flex-col justify-start items-center text-center">
        <h1
          className="text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-[1.12] tracking-[-0.03em] max-w-[900px] text-navy"
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
            <svg className="w-5 h-5 relative z-10 group-hover:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
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

        <div className="hero-stage mt-14 sm:mt-16 lg:mt-6 w-full" data-sc-parallax="-0.7">
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
