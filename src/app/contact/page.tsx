import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntakeForm from "@/components/IntakeForm";
import { OFFER, ONBOARDING_STEPS } from "@/lib/offer";

export const metadata: Metadata = {
  title: "Get Your Website | The Ready Consult",
  description: "Start your $103/month website subscription inquiry. No minimum term. One-business-day construction after confirmed onboarding, with monthly SEO improvements.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <>
    <Navbar />
    <main id="main-content" className="pt-32 pb-24 sm:pt-40">
      <section className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="t-display text-navy">Let&apos;s build your website.</h1>
          <p className="t-lead mt-8">{OFFER.price}/month. {OFFER.commitment}</p>
          <p className="mt-5 max-w-2xl leading-relaxed text-gray-500">{OFFER.description}</p>
          <p className="mt-4 max-w-2xl leading-relaxed text-gray-500">{OFFER.buildCondition}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-500">{OFFER.subscriptionSummary} <a className="underline" href="/terms">Read the terms before subscribing</a>.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-gray-200 pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7"><h2 className="text-2xl font-semibold text-navy mb-6">Start with your business details.</h2><p className="mb-8 leading-relaxed text-gray-500">This is an inquiry, not checkout or completed onboarding. We confirm fit and scope, then send the subscription and onboarding details. Submitting does not charge you or start the one-day build clock.</p><IntakeForm /></div>
          <aside className="lg:col-span-5"><h2 className="text-2xl font-semibold text-navy mb-8">What happens next</h2><ol className="space-y-8">{ONBOARDING_STEPS.map(step => <li key={step.title}><h3 className="text-lg font-semibold text-navy">{step.title}</h3><p className="mt-2 text-gray-500 leading-relaxed">{step.body}</p></li>)}</ol></aside>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
