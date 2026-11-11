import type { Metadata } from "next";
import Link from "next/link";

import ThankYouActions from "@/components/ThankYouActions";

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
    <div className="thank-you-light">
      <header className="absolute left-0 right-0 top-0 z-10 mx-auto max-w-[1280px] px-6 py-6">
        <Link href="/" className="text-sm font-semibold text-[#1a130a]">← The Ready</Link>
      </header>
      <main id="main-content" className="min-h-screen bg-[#f5f6f7] pt-32 pb-24 text-[#1a130a] sm:pt-40">
        <section className={CONTAINER}>
          <div className="max-w-2xl">
            <p className="mb-6 text-sm text-[#626b75]">Your next move</p>
            <h1 className="t-display text-[#1a130a]">
              Your details are in.
            </h1>
            <p className="t-lead mt-8 text-[#4f5863]">
              We got your inquiry and will follow up by the contact method you chose. You can set up a call below, or use secure checkout if it is available for your inquiry. Your build starts after payment and complete onboarding.
            </p>
            <ThankYouActions />

            <div className="mt-12 border-t border-gray-200 pt-10">
              <p className="text-[11px] tracking-[0.24em] uppercase text-gray-400 font-semibold mb-4">
                While you wait
              </p>
              <ul className="space-y-3 text-[#1a130a]">
                <li>
                  <Link href="/work" className="font-semibold hover:underline underline-offset-4">
                    See what we&apos;ve built &rarr;
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="font-semibold hover:underline underline-offset-4">
                    Review the subscription terms &rarr;
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
