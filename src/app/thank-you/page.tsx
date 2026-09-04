import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// The site had no /thank-you at all — it 404'd, which is where a form redirect
// would have landed and where the site monitor looks for one.
export const metadata: Metadata = {
  title: "Thanks | The Ready Consult",
  description: "We got your message and we'll come back to you shortly.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  const CONTAINER = "max-w-[1280px] mx-auto px-6";

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 sm:pt-40 pb-24">
        <section className={CONTAINER}>
          <div className="max-w-2xl">
            <p className="text-[11px] tracking-[0.24em] uppercase text-cyan font-semibold mb-6">
              Message received
            </p>
            <h1 className="t-display text-navy">
              Got it. We&apos;ll be in touch.
            </h1>
            <p className="t-lead mt-8">
              Someone reads every one of these — usually the same day, always within one
              business day.
            </p>

            <div className="mt-12 border-t border-gray-200 pt-10">
              <p className="text-[11px] tracking-[0.24em] uppercase text-gray-400 font-semibold mb-4">
                While you wait
              </p>
              <ul className="space-y-3 text-navy">
                <li>
                  <Link href="/work" className="text-cyan font-semibold hover:underline underline-offset-4">
                    See what we&apos;ve built &rarr;
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-cyan font-semibold hover:underline underline-offset-4">
                    Read the blog &rarr;
                  </Link>
                </li>
                <li>
                  <a
                    href="https://calendly.com/thereadyconsult/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan font-semibold hover:underline underline-offset-4"
                  >
                    Book a 30-minute call instead &rarr;
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
