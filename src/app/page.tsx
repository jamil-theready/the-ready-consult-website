import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CaseStudyStats from "@/components/CaseStudyStats";
import Pricing from "@/components/Pricing";
import Testimonial from "@/components/Testimonial";
import HowItWorks from "@/components/HowItWorks";
import Team from "@/components/Team";
import FAQ from "@/components/FAQ";
import CtaBanner from "@/components/CtaBanner";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CaseStudies from "@/components/CaseStudies";
import ScrollToTop from "@/components/ScrollToTop";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "The Ready Consult",
  description: "AI-first consulting agency fusing strategy, content, and automation to convert attention into sustainable revenue.",
  url: "https://www.thereadyconsult.com",
  email: "team@thereadyconsult.com",
  serviceType: ["Growth Consulting", "Fractional CMO", "Video Production", "SEO", "Paid Ads Management", "Email Marketing"],
  founder: [
    { "@type": "Person", name: "Jamil Gonzales", jobTitle: "CEO & Growth Strategist" },
    { "@type": "Person", name: "Shawn Reddy", jobTitle: "Co-Founder & AI Architect" },
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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Services />
        <CaseStudyStats />
        <Testimonial />
        <CaseStudies />
        <HowItWorks />
        <Pricing />
        <Team />
        <FAQ />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
