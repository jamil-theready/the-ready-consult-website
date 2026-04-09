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
    title: "Build & Launch",
    desc: "We build your website, SEO, content, and automations — then ship it fast.",
    tags: ["EXECUTION", "AUTOMATION"],
  },
  {
    num: "03",
    title: "Scale",
    desc: "We measure, optimize, and compound your results month over month.",
    tags: ["ANALYTICS", "GROWTH"],
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
      className="relative bg-white"
      style={{ height: `${(steps.length + 3) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center overflow-hidden">
        {/* Background dot grid animation */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }}>
          <svg className="w-full h-full">
            {Array.from({ length: 80 }).map((_, i) => {
              const x = `${5 + (i % 10) * 10}%`;
              const y = `${5 + Math.floor(i / 10) * 12}%`;
              return (
                <circle key={i} cx={x} cy={y} r="2" fill="currentColor">
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${3 + (i % 5)}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
                </circle>
              );
            })}
          </svg>
        </div>

        {/* Header — stays static */}
        <div className="text-center pt-24 sm:pt-28 md:pt-32 lg:pt-36">
          <p className="text-gray-400 text-xs md:text-sm tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2">
            <span className="text-[10px]">&#10022;</span>
            Process
            <span className="text-[10px]">&#10022;</span>
          </p>
          <h2 className="text-[clamp(2rem,4.5vw,3.75rem)] font-medium text-navy tracking-tight leading-tight">
            A collaborative approach
          </h2>
        </div>

        {/* Step badge */}
        <div className="text-center mt-6 md:mt-8 z-10">
          <p className="text-[10px] md:text-xs tracking-[0.2em] text-gray-500 uppercase font-medium mb-2">
            Step
          </p>
          <div
            key={`badge-${activeStep}`}
            className="w-13 h-13 md:w-14 md:h-14 rounded-xl bg-navy text-white flex items-center justify-center text-xl md:text-2xl font-bold mx-auto animate-fade-in"
            style={{ boxShadow: "0 10px 30px -5px rgba(10,37,64,0.3)" }}
          >
            {steps[activeStep].num}
          </div>
        </div>

        {/* Content — directly after badge */}
        <div className="relative z-10 text-center max-w-lg mx-auto px-4 sm:px-6 mt-6 md:mt-8">
          <div className="relative z-10 text-center">
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

          </div>
        </div>

        {/* Arc — right behind content */}
        <div className="flex-1 relative w-full -mt-60 sm:-mt-72 md:-mt-80 lg:-mt-80">
          <svg
            className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-[130%] max-w-[1500px]"
            viewBox="0 0 1200 500"
            fill="none"
            preserveAspectRatio="xMidYMax meet"
          >
            <path d="M 20 490 A 580 580 0 0 1 1180 490" stroke="#e8e8e8" strokeWidth="1.5" fill="none" />
            <path d="M 100 490 A 520 520 0 0 1 1100 490" stroke="#f0f0f0" strokeWidth="1" fill="none" />
            <path d="M 200 490 A 440 440 0 0 1 1000 490" stroke="#f5f5f5" strokeWidth="0.8" fill="none" />
            <path
              d="M 20 490 A 580 580 0 0 1 1180 490"
              stroke="var(--teal)" strokeWidth="2.5" fill="none"
              strokeDasharray="1820"
              strokeDashoffset={1820 - 1820 * ((activeStep + 1) / steps.length)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
          </svg>
          {prevStep !== null && (
            <div className="absolute left-[6%] md:left-[10%] lg:left-[12%] bottom-[30%] md:bottom-[35%] z-10 transition-opacity duration-500 hidden sm:block" style={{ opacity: 0.5 }}>
              <div className="w-11 h-11 md:w-13 md:h-13 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-base md:text-lg font-bold text-gray-400 shadow-sm backdrop-blur-sm">
                {steps[prevStep].num}
              </div>
            </div>
          )}
        </div>

        {/* Bottom indicator */}
        <div className="pb-4 md:pb-6 -mt-16 sm:-mt-12 flex flex-col items-center gap-2.5 z-10">
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
