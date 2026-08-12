// src/app/work/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCases, getCaseBySlug } from "@/lib/work";
import CaseRenderer from "@/components/work/CaseRenderer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return getAllCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.client} Case Study | The Ready Consult`,
    description: c.headline,
    // Every case study was emitting the HOMEPAGE canonical, because Next falls
    // back to metadataBase when a page declares none. Four distinct case studies
    // all telling Google "I am the homepage" is a stronger duplicate-content
    // signal than the /work index that this branch set out to fix.
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${c.client} — Case Study`,
    about: c.client,
    headline: c.headline,
    dateCreated: c.meta.year,
    creator: { "@type": "Organization", name: "The Ready Consult" },
    url: `https://www.thereadyconsult.com/work/${c.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <CaseRenderer blocks={c.blocks} currentSlug={c.slug} />
      </main>
      <Footer />
    </>
  );
}
