"use client";

import { useState } from "react";
import Footer from "./Footer";
import { FAQS } from "./faq-data";

// The closing act. Per the engine's own template the last act is the last
// element on the page, with the footer inside its stage so there is no dead
// scroll after the call to action.
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="sc-section faq" data-sc-act="pin" data-sc-span="1.6" data-sc-drift="#050302">
      <div data-sc-stage className="faq__stage" data-sc-spotlight>
        <div className="faq__inner">
          <h2 className="faq__title">Common questions</h2>

          <div className="faq__list">
            {FAQS.map((f, i) => (
              <div key={f.q} className="faq__item">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="faq__q"
                  aria-expanded={open === i}
                >
                  <span>{f.q}</span>
                  <span className={`faq__plus${open === i ? " is-open" : ""}`} aria-hidden="true">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className={`faq__a${open === i ? " is-open" : ""}`}>
                  <div><p>{f.a}</p></div>
                </div>
              </div>
            ))}
          </div>

          <div className="faq__close">
            <h3 className="faq__closeh">Still have a question?</h3>
            <a className="faq__cta" href="/start" data-sc-magnet="0.22">
              Reach out
            </a>
          </div>
        </div>

        <Footer />
      </div>
    </section>
  );
}
