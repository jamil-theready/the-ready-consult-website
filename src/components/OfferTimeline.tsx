import { ONBOARDING_STEPS, OFFER } from "@/lib/offer";

export default function OfferTimeline() {
  return <section id="how-it-works" className="sc-section offer-timeline" data-sc-act="flow">
    <div className="offer-timeline__inner">
      <h2>One day to build.<br />Every month to improve.</h2>
      <p className="offer-timeline__intro">A clear start. A working website. Ongoing improvements.</p>
      <div className="offer-timeline__steps">
        {ONBOARDING_STEPS.map(step => <article key={step.title}><h3>{step.title}</h3><p>{step.body}</p></article>)}
      </div>
      <div className="offer-timeline__ready">
        <h3>What we need before your build starts</h3>
        <p>Your business name, services, locations, hours, contact details, lead-alert destination, website preferences, and the photos or materials you want us to use. We also confirm the page scope, required access, and payment. If anything is missing, you get one clear checklist.</p>
        <p>The one-day promise covers construction of your agreed website for review. Google indexing, rankings, and third-party account approvals follow their own timelines.</p>
        <a className="plan__cta" href={OFFER.href}>{OFFER.cta} &rarr;</a>
      </div>
    </div>
  </section>;
}
