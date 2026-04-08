"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "We listen. Tell us what's working, what's not, and where you want to be.",
    tags: ["AUDIT", "DEEP DIVE"],
  },
  {
    num: "02",
    title: "Strategy",
    desc: "We analyze your market, competitors, and data to build a plan unique to you.",
    tags: ["RESEARCH", "ROADMAP"],
  },
  {
    num: "03",
    title: "Execution",
    desc: "We launch campaigns, build systems, and deploy AI agents — fast.",
    tags: ["CAMPAIGNS", "AUTOMATION"],
  },
  {
    num: "04",
    title: "Measurement",
    desc: "Real-time dashboards and weekly reports so you always know what's moving.",
    tags: ["ANALYTICS", "REPORTING"],
  },
  {
    num: "05",
    title: "Optimization",
    desc: "We refine, test, and enhance to drive ongoing growth and impact.",
    tags: ["TESTING", "CONTINUOUS IMPROVEMENT"],
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolled / sectionHeight));

      const stepIndex = Math.min(
        steps.length - 1,
        Math.floor(rawProgress * steps.length)
      );
      setActiveStep(stepIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const prevStep = activeStep > 0 ? activeStep - 1 : null;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative bg-[#f5f4f0]"
      style={{ height: `${(steps.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center overflow-hidden">
        {/* Header — stays static */}
        <div className="text-center pt-16 md:pt-20 lg:pt-24">
          <p className="text-gray-400 text-xs md:text-sm tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2">
            <span className="text-[10px]">&#10022;</span>
            Process
            <span className="text-[10px]">&#10022;</span>
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-navy tracking-tight leading-tight">
            A collaborative approach
          </h2>
        </div>

        {/* Step badge */}
        <div className="text-center mt-6 md:mt-8 z-10">
          <p className="text-[10px] md:text-xs tracking-[0.2em] text-gray-500 uppercase font-medium mb-2">
            Step
          </p>
          <div className="w-13 h-13 md:w-14 md:h-14 rounded-xl bg-teal text-white flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg mx-auto">
            {steps[activeStep].num}
          </div>
        </div>

        {/* Arc + content */}
        <div className="relative flex-1 w-full flex items-start justify-center">
          {/* Arc SVG — full width, curves up */}
          <svg
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px]"
            viewBox="0 0 1200 500"
            fill="none"
            preserveAspectRatio="xMidYMax meet"
          >
            {/* Outer arc */}
            <path
              d="M 20 490 A 580 580 0 0 1 1180 490"
              stroke="#ddd9d2"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Mid arc */}
            <path
              d="M 100 490 A 520 520 0 0 1 1100 490"
              stroke="#e5e2dc"
              strokeWidth="1"
              fill="none"
            />
            {/* Inner arc */}
            <path
              d="M 200 490 A 440 440 0 0 1 1000 490"
              stroke="#eae7e2"
              strokeWidth="0.8"
              fill="none"
            />
            {/* Progress arc */}
            <path
              d="M 20 490 A 580 580 0 0 1 1180 490"
              stroke="var(--teal)"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="1820"
              strokeDashoffset={
                1820 - 1820 * ((activeStep + 1) / steps.length)
              }
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
          </svg>

          {/* Previous step indicator — left, on the arc */}
          {prevStep !== null && (
            <div
              className="absolute left-[6%] md:left-[10%] lg:left-[12%] bottom-[30%] md:bottom-[35%] z-10 transition-opacity duration-500"
              style={{ opacity: 0.5 }}
            >
              <div className="w-11 h-11 md:w-13 md:h-13 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-base md:text-lg font-bold text-gray-400 shadow-sm backdrop-blur-sm">
                {steps[prevStep].num}
              </div>
            </div>
          )}

          {/* Center content inside the arc */}
          <div className="relative z-10 text-center max-w-lg mt-6 md:mt-10 px-6">
            <h3
              key={`title-${activeStep}`}
              className="text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-navy mb-3 md:mb-4 animate-fade-in"
            >
              {steps[activeStep].title}
            </h3>
            <p
              key={`desc-${activeStep}`}
              className="text-gray-500 text-base md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-8 animate-fade-in"
              style={{ animationDelay: "0.05s" }}
            >
              {steps[activeStep].desc}
            </p>

            {/* Tags with dashed borders */}
            <div
              key={`tags-${activeStep}`}
              className="animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="border-t border-dashed border-gray-300 mx-auto max-w-sm" />
              <div className="flex items-center justify-center gap-4 py-4 text-xs md:text-sm tracking-[0.2em] text-gray-400 font-medium">
                {steps[activeStep].tags.map((tag, i) => (
                  <span key={tag} className="flex items-center gap-4">
                    {i > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    )}
                    {tag}
                  </span>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-300 mx-auto max-w-sm" />
            </div>

            {/* CTA on last step */}
            {activeStep === steps.length - 1 && (
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-teal text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-teal-light transition-all hover:scale-105 animate-fade-in mt-6"
              >
                Start your project
              </a>
            )}
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="pb-6 md:pb-8 flex flex-col items-center gap-2.5">
          <span className="text-sm text-gray-400 tabular-nums font-medium tracking-wide">
            {steps[activeStep].num}/{String(steps.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!sectionRef.current) return;
                  const sectionTop =
                    sectionRef.current.getBoundingClientRect().top +
                    window.scrollY;
                  const sectionHeight =
                    sectionRef.current.scrollHeight - window.innerHeight;
                  const target =
                    sectionTop + (i / steps.length) * sectionHeight + 1;
                  window.scrollTo({ top: target, behavior: "smooth" });
                }}
                aria-label={`Go to step ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeStep
                    ? "w-3 h-3 bg-teal scale-110"
                    : i < activeStep
                      ? "w-2.5 h-2.5 bg-teal/30"
                      : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
