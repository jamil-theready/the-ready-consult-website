"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SubscriptionStory from "@/components/SubscriptionStory";
import OfferTimeline from "@/components/OfferTimeline";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import { FAQS } from "@/components/faq-data";
import ScrollToTop from "@/components/ScrollToTop";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollCraft from "@/components/ScrollCraft";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "The Ready Consult",
  description:
    "Managed websites and monthly SEO for small businesses serving local customers. $103 per month, no minimum term.",
  url: "https://www.thereadyconsult.com",
  email: "jamil@thereadyconsult.com",
  sameAs: [
    "https://www.linkedin.com/in/jamilgonzales/",
    "https://github.com/The-Ready-Collective",
  ],
  serviceType: [
    "Small business website subscriptions",
    "Local SEO",
    "Google Business Profile management",
    "Website lead notifications",
  ],
  areaServed: "United States",
  founder: [{ "@type": "Person", name: "Jamil Gonzales" }],
};

// Generated from the same array the page renders. A FAQPage whose questions do
// not appear on the page is a structured data violation, so they cannot be
// allowed to drift apart.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  const [ready, setReady] = useState(false);
  const handleLoadingComplete = useCallback(() => setReady(true), []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <LoadingScreen onComplete={handleLoadingComplete} />
      <ScrollCraft ready={ready} />
      <span data-sc-progress />
      <Navbar />
      <main id="main-content">
        <Hero />
        <SubscriptionStory />
        <OfferTimeline />
        <Pricing />
        <FAQ />
        <section className="offer-final sc-section" data-sc-act="flow">
          <h2>Ready for your next customer?</h2>
          <p>Your website. Built in one day. Improved every month.</p>
          <a className="plan__cta" href="/contact">Get my website &rarr;</a>
          <p>$103/month. No minimum term. One-business-day construction starts after confirmed onboarding.</p>
          <nav aria-label="Legal"><a href="/terms">Subscription terms</a><a href="/privacy">Privacy</a><a href="/data-deletion">Data deletion</a></nav>
        </section>
      </main>
      <ScrollToTop />
    </>
  );
}
