import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { FAQS } from '@/components/faq-data';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | The Ready Consult',
  description: 'What the website subscription includes, when the build starts, ownership, cancellation, and monthly SEO.',
  alternates: { canonical: '/faq' },
};

export default function FAQPage() {
  return <>
    <Navbar />
    <main id="main-content" className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
      <h1 className="mb-12 text-4xl font-semibold tracking-tight text-navy">A few questions, answered.</h1>
      <div className="divide-y divide-gray-200">
        {FAQS.map(faq => <details key={faq.q} className="py-6">
          <summary className="cursor-pointer text-lg font-medium text-navy">{faq.q}</summary>
          <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
        </details>)}
      </div>
      <nav aria-label="More information" className="mt-12 flex flex-wrap gap-6 text-sm text-gray-600">
        <Link href="/#signup">Get started</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link>
      </nav>
    </main>
  </>;
}
