import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntakeForm from "@/components/IntakeForm";

export const metadata: Metadata = {
  title: "Get more jobs from Google | The Ready Consult",
  description:
    "Tell us about your business and we'll send you a free 90-second review of your Google listing — what's costing you calls, and how to fix it.",
  alternates: { canonical: "/start" },
};

const CONTAINER = "max-w-[1280px] mx-auto px-6";

const STEPS = [
  {
    n: "01",
    t: "You fill this in",
    d: "Two minutes. We need your trade, your city and a number to reach you on.",
  },
  {
    n: "02",
    t: "We look at your Google listing",
    d: "Not a template. We open your actual profile and find what's wrong with it.",
  },
  {
    n: "03",
    t: "You get a 90-second video",
    d: "Us walking through your listing, showing exactly what's costing you calls. Free, no catch.",
  },
];

export default function StartPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 pb-24 sm:pt-40">
        <section className={CONTAINER}>
          <div className="max-w-3xl">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan">
              Free Google review
            </p>
            <h1 className="text-[clamp(2.5rem,5.2vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-navy">
              Find out what&rsquo;s costing you calls.
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-snug text-gray-500 sm:text-2xl">
              Most contractors are invisible on Google and don&rsquo;t know why. Tell us about your
              business and we&rsquo;ll send you a 90-second video showing exactly what&rsquo;s broken
              on your listing. No charge, no call required.
            </p>
          </div>
        </section>

        <section className={`${CONTAINER} mt-16`}>
          <div className="grid grid-cols-1 gap-12 border-t border-navy pt-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <IntakeForm />
            </div>

            <aside className="lg:col-span-5">
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                How it works
              </p>
              <ol className="space-y-8">
                {STEPS.map((s) => (
                  <li key={s.n} className="flex gap-5">
                    <span className="shrink-0 text-[13px] font-semibold tabular-nums text-cyan">
                      {s.n}
                    </span>
                    <span>
                      <span className="block text-[17px] font-semibold tracking-[-0.01em] text-navy">
                        {s.t}
                      </span>
                      <span className="mt-1 block leading-relaxed text-gray-600">{s.d}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-12 rounded-2xl bg-gray-50 p-6">
                <p className="text-[15px] leading-relaxed text-gray-600">
                  <span className="font-semibold text-navy">We work with trades.</span> Masonry,
                  concrete, hardscape, pools, landscaping, painting. If you run the crew and answer
                  the phone yourself, you&rsquo;re who we build for.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
