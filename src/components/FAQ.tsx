"use client";

import { useState } from "react";
import { FAQS } from "./faq-data";

// Normal document flow keeps every subscription answer reachable on small screens.
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="sc-section faq" data-sc-act="flow" data-sc-drift="#050302">
      <div className="faq__stage">
        <div className="faq__inner">
          <div className="faq__aside">
            <h2 className="faq__title">A few questions, answered.</h2>
            <p className="faq__lede">
              If yours is not here, ask it. You will get a straight answer from the
              person who would do the work, not a sales call.
            </p>
            <div className="faq__actions">
              <a href="/#signup" className="cta-btn">Get my website &rarr;</a>
              <a href="tel:+19169122080" className="faq__phone">Talk it through</a>
            </div>
          </div>

          <div className="faq__list">
            {FAQS.map((f, i) => (
              <div key={f.q} className="faq__item">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="faq__q"
                  id={`faq-question-${i}`}
                  aria-controls={`faq-answer-${i}`}
                  aria-expanded={open === i}
                >
                  <span>{f.q}</span>
                  <span className={`faq__plus${open === i ? " is-open" : ""}`} aria-hidden="true">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`} className={`faq__a${open === i ? " is-open" : ""}`}>
                  <div><p>{f.a}</p></div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
