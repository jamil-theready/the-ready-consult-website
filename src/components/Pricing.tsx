import { PLANS } from "./pricing-data";
import SystemDiagram from "./SystemDiagram";

export default function Pricing() {
  return (
    <section id="pricing" className="sc-section pricing" data-sc-act="flow" data-sc-drift="#ffffff">
      <div className="pricing__wrap">
        <p className="sc-label pricing__eyebrow">Pricing</p>
        <h2 className="pricing__title" data-sc-cue="0 1 0 0" data-sc-kinetic="lines">
          Two ways to work with us.
        </h2>

        <div className="pricing__grid" data-sc-in data-sc-stagger="90">
          {PLANS.map((p, i) => (
            <div key={p.name} className={`plan${i === 1 ? " is-featured" : ""}`}>
              <p className="sc-label plan__name">{p.name}</p>
              <p className="plan__price">
                <span className="plan__figure">{p.price}</span>
                <span className="sc-label plan__period">{p.period}</span>
              </p>
              <p className="plan__desc">{p.desc}</p>

              {i === 1 && <SystemDiagram />}

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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
