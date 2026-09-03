"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesTabs from "@/components/ServicesTabs";
import Mission from "@/components/Mission";
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
    "Websites, Google Business Profiles, SEO and lead follow up for construction and landscaping companies.",
  url: "https://www.thereadyconsult.com",
  email: "jamil@thereadyconsult.com",
  sameAs: [
    "https://www.linkedin.com/in/jamilgonzales/",
    "https://github.com/The-Ready-Collective",
  ],
  serviceType: [
    "Website design for contractors",
    "Local SEO",
    "Google Business Profile management",
    "Google Ads",
    "Meta Ads",
    "Lead follow up automation",
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
        <Mission />
        <ServicesTabs />
        <Pricing />
        <FAQ />
      </main>
      <ScrollToTop />
    </>
  );
}
