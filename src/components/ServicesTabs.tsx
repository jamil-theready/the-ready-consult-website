"use client";

import { useEffect, useRef, useState } from "react";
import SeoVisual from "./SeoVisual";
import WebsiteVisual from "./WebsiteVisual";

import N8nFlow from "./N8nFlow";

type Tab = {
  n: string;
  name: string;
  line: string;
  body: string;
  visual: React.ReactNode;
};

// Services and how-it-works, combined into one journey. Order is the order a
// contractor actually experiences it, and between them the four tabs carry
// every service on the books.
const TABS: Tab[] = [
  {
    n: "01",
    name: "Research",
    line: "Find your opportunity.",
    body: "We look at your services, local searches, competitors, and current website to agree what your new site needs to do.",
    visual: <SeoVisual />,
  },
  {
    n: "02",
    name: "Build",
    line: "Your website. Built in one day.",
    body: "After confirmed onboarding, we construct your agreed website within one business day. Clear services, real photos, and an easy way for customers to contact you. Launch follows your approval and domain connection.",
    visual: <WebsiteVisual />,
  },
  {
    n: "03",
    name: "Monthly SEO",
    line: "Your SEO. Handled every month.",
    body: "We review performance and improve your pages, content, and technical SEO each month. The goal is to help more local customers find your business over time.",
    visual: <SeoVisual />,
  },
  {
    n: "04",
    name: "Lead alerts",
    line: "A new lead? You will know.",
    body: "New website inquiries go straight to your WhatsApp with the customer details and message, so you can follow up. Your dashboard shows traffic and inquiries.",
    visual: <N8nFlow />,
  },
];

export default function ServicesTabs() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);

  // The engine publishes act progress as --sc-p on the section. Reading it once
  // a frame and only committing state when the index actually changes keeps
  // this to one rAF and no React work while a tab is holding.
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const p = parseFloat(getComputedStyle(el).getPropertyValue("--sc-p")) || 0;
        const i = Math.min(TABS.length - 1, Math.max(0, Math.round(p * (TABS.length - 1))));
        if (i !== last) { last = i; setActive(i); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Clicking a tab scrolls to that tab's slice of the act. Geometry is read at
  // click time, so this costs no persistent listener; the highlight is CSS,
  // driven by the --sc-p the engine publishes on the section.
  const goTo = (i: number) => {
    const act = document.getElementById("services");
    if (!act) return;
    const top = act.getBoundingClientRect().top + window.scrollY;
    const range = act.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (range * i) / (TABS.length - 1), behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="services"
      className="sc-section services"
      data-sc-act="pan"
      data-sc-span="5"
      data-sc-drift="#0B0804"
    >
      <div data-sc-stage className="services__stage">
        <div className="services__head">
          {/* The heading IS the card you are on. It was a fixed line that sat
              still while four cards panned past it, so it stopped meaning
              anything after the first one. Keyed on `active` so React swaps the
              node and the CSS fade runs on every change. */}
          <h2 className="services__title services__title--live" data-sc-cue="0 1 0 0">
            <span key={active} className="services__titleline">
              {TABS[active].line}
            </span>
          </h2>

          <div role="tablist" aria-label="How it works" className="services__tabs">
            {TABS.map((t, i) => (
              <button
                key={t.name}
                role="tab"
                type="button"
                onClick={() => goTo(i)}
                className={`services__tab${active === i ? " is-active" : ""}`}
                aria-selected={active === i}
              >
                <span className="sc-label services__tabn">{t.n}</span>
                <span className="services__tabname">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="services__rail" data-sc-pan="0">
          {TABS.map((t) => (
            <figure key={t.name} className="services__item">
              <div className="services__visual" data-sc-tilt="6">
                {t.visual}
              </div>
              <figcaption className="services__cap">
                <strong className="services__capline">{t.line}</strong>
                <span className="services__capbody">{t.body}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
