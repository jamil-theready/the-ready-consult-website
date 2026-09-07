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
      <div data-sc-stage className="faq__stage">
        <div className="faq__inner">
          <div className="faq__aside">
            <h2 className="faq__title">Questions, before you commit.</h2>
            <p className="faq__lede">
              If yours is not here, ask it. You will get a straight answer from the
              person who would do the work, not a sales call.
            </p>
            <div className="faq__actions">
              <a href="/contact" className="cta-btn">Sign up &rarr;</a>
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

        </div>

        <Footer />
      </div>
    </section>
  );
}
