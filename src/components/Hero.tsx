"use client";

import HeroVisual from "./HeroVisual";

// Entrance is driven by the scroll-craft engine (data-sc-in / data-sc-stagger),
// which mounts only after the loading screen resolves, so the reveal is not
// spent behind the splash. No local reveal state, no timers.
export default function Hero() {
  return (
    <section
      className="sc-section relative bg-white min-h-[100vh] flex flex-col overflow-x-clip lg:overflow-hidden"
      data-sc-act="flow"
      data-sc-drift="#ffffff"
      data-sc-in
      data-sc-stagger="70"
    >
      {/* n8n-style workflow lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.06 }}
        data-sc-parallax="0.30"
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

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 w-full pt-20 sm:pt-28 pb-4 sm:pb-12 flex-1 flex flex-col justify-start items-center text-center">
        <p className="sc-mono text-[13px] text-gray-500 mb-6 tracking-[0.18em] uppercase">
          For construction and landscaping
        </p>

        <h1
          className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] max-w-[900px] text-navy"
          data-sc-cue="0 0.78 0"
          data-sc-kinetic="lines"
        >
          The website and Google profile that get your phone ringing.
        </h1>

        <p className="mt-6 text-[17px] text-gray-500 max-w-[560px] leading-relaxed">
          We build it, keep it running, and make sure the people searching for
          your trade in your area find you first.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4">
          <a
            href="https://calendly.com/thereadyconsult/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn relative inline-flex items-center gap-2.5 text-white font-semibold text-[16px] px-10 py-4.5 rounded-2xl hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 overflow-hidden group"
          >
            <span className="absolute inset-0 cta-shimmer" />
            <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              boxShadow: "inset 0 0 20px rgba(255,255,255,0.08), 0 0 40px rgba(255,255,255,0.06)",
            }} />
            <svg className="w-5 h-5 relative z-10 group-hover:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="relative z-10">Book a call</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 text-gray-500 font-semibold text-[15px] px-7 py-4 rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-navy transition-all"
          >
            See how it works
          </a>
        </div>

        <div className="mt-20 sm:mt-24 lg:mt-12 w-full" data-sc-parallax="0.08">
          <div className="hidden lg:block">
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
