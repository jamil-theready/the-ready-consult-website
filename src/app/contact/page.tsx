import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntakeForm from "@/components/IntakeForm";

export const metadata: Metadata = {
  title: "Contact | The Ready Consult",
  description:
    "Get in touch with The Ready Consult — AI-first growth, content systems, and paid media for $1M–$20M companies.",
  alternates: { canonical: "/contact" },
};

const CALENDLY_URL = "https://calendly.com/thereadyconsult/30min";

export default function ContactPage() {
  const CONTAINER = "max-w-[1280px] mx-auto px-6";

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 sm:pt-40 pb-24">
        <section className={CONTAINER}>
          <div className="max-w-3xl">
            <p className="text-[11px] tracking-[0.24em] uppercase text-cyan font-semibold mb-6">
              Get in touch
            </p>
            <h1 className="t-display text-navy">
              Let&apos;s talk about your growth motion.
            </h1>
            <p className="t-lead mt-8 max-w-2xl">
              The fastest path is a 30-minute call. We&apos;ll walk through where your pipeline actually leaks and whether we&apos;re the right partner.
            </p>
          </div>
        </section>

        <section className={`${CONTAINER} mt-16`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-navy pt-12">
            <div className="lg:col-span-7">
              <p className="text-[11px] tracking-[0.24em] uppercase text-gray-400 font-semibold mb-4">
                01 · Book a discovery call
              </p>
              <h2 className="t-h2 text-navy mb-4">
                30 minutes, no pitch deck.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">
                Bring your current funnel, your team shape, and the bottleneck that&apos;s frustrating you. We&apos;ll tell you what we&apos;d run, in what order, and whether an engagement makes sense.
              </p>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-navy text-white text-[15px] font-semibold px-7 py-4 hover:bg-cyan transition-colors"
              >
                Book a Call
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-12 pt-12 lg:pt-0">
              <p className="text-[11px] tracking-[0.24em] uppercase text-gray-400 font-semibold mb-4">
                02 · Or send a note
              </p>
              <h2 className="t-h2 text-navy mb-4">
                Email works too.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                For partnerships, press, or general questions.
              </p>
              <a
                href="mailto:team@thereadyconsult.com"
                className="text-cyan text-lg font-semibold hover:underline underline-offset-4"
              >
                team@thereadyconsult.com
              </a>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-[11px] tracking-[0.24em] uppercase text-gray-400 font-semibold mb-3">
                  The partners
                </p>
                <ul className="space-y-2 text-navy">
                  <li>
                    <span className="font-semibold">Jamil Gonzales</span>{" "}
                    <span className="text-gray-500">— CEO & Growth Strategist</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className={`${CONTAINER} mt-20`} id="write">
          <div className="border-t border-navy pt-12">
            <p className="text-[11px] tracking-[0.24em] uppercase text-gray-400 font-semibold mb-4">
              03 · Or just tell us what&apos;s going on
            </p>
            <h2 className="t-h2 text-navy mb-4">
              No call needed.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-10 max-w-2xl">
              Tell us about the business and what isn&apos;t working. We&apos;ll come back with
              what we&apos;d do about it.
            </p>
            <div className="max-w-3xl">
              <IntakeForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
