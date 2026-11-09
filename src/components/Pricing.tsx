import { PLANS } from "./pricing-data";
import { OFFER } from "@/lib/offer";

export default function Pricing() {
  return (
    <section id="pricing" className="sc-section pricing" data-sc-act="flow" data-sc-drift="#080603">
      <div className="pricing__wrap">
        <h2 className="pricing__title" data-sc-cue="0 1 0 0" data-sc-kinetic="lines">
          One subscription. Everything connected.
        </h2>

        <div className="pricing__grid" data-sc-in data-sc-stagger="90">
          {PLANS.map((p) => (
            <div key={p.name} className="plan">
              <h3 className="plan__name">{p.name}</h3>
              <p className="plan__price">
                <span className="plan__figure">{p.price}</span>
                <span className="plan__period">{p.period}</span>
              </p>
              <p className="plan__desc">{p.desc}</p>

              <p className="plan__commitment">{OFFER.commitment}</p>

              <ul className="plan__features">
                {p.features.map((f) => (
                  <li key={f}>
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a className="plan__cta" href={p.href}>
                {p.cta}
              </a>
              <p className="plan__terms">{OFFER.subscriptionSummary} <a href="/terms">Read the subscription terms</a>.</p>
              <p className="plan__terms">Start with an inquiry. This form does not charge you or activate a subscription.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
