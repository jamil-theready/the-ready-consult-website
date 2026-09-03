"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesTabs from "@/components/ServicesTabs";
import Mission from "@/components/Mission";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import ScrollToTop from "@/components/ScrollToTop";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollCraft from "@/components/ScrollCraft";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "The Ready Consult",
  description: "AI-first consulting agency fusing strategy, content, and automation to convert attention into sustainable revenue.",
  url: "https://www.thereadyconsult.com",
  email: "jamil@thereadyconsult.com",
  sameAs: [
    "https://www.linkedin.com/in/jamilgonzales/",
    "https://twitter.com/jamilgonzales",
    "https://github.com/The-Ready-Collective",
  ],
  serviceType: ["Growth Consulting", "Fractional CMO", "Video Production", "SEO", "Paid Ads Management", "Email Marketing"],
  founder: [
    { "@type": "Person", name: "Jamil Gonzales", jobTitle: "CEO & Growth Strategist" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What makes The Ready Consult different?", acceptedAnswer: { "@type": "Answer", text: "We operate as an embedded growth partner with AI-first execution and outcome-driven pricing." } },
    { "@type": "Question", name: "How do fractional growth services work?", acceptedAnswer: { "@type": "Answer", text: "CMO-level strategy at a fraction of a full-time hire. Ideal for $1M-$20M companies." } },
    { "@type": "Question", name: "What industries do you work with?", acceptedAnswer: { "@type": "Answer", text: "B2B SaaS, ecommerce, professional services, and funded startups with $1M-$50M revenue." } },
    { "@type": "Question", name: "How do you use AI?", acceptedAnswer: { "@type": "Answer", text: "Custom agents for research, drafting, analysis, and optimization. 72-hour test loops." } },
    { "@type": "Question", name: "What are your minimum engagements?", acceptedAnswer: { "@type": "Answer", text: "Monthly retainers, per-asset video, quarterly SEO sprints. No long-term lock-in." } },
  ],
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
