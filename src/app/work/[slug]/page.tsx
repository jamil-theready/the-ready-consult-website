// src/app/work/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCases, getCaseBySlug } from "@/lib/work";
import CaseRenderer from "@/components/work/CaseRenderer";

export function generateStaticParams() {
  return getAllCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.client} — Case Study | The Ready Consult`,
    description: c.headline,
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
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaseRenderer blocks={c.blocks} currentSlug={c.slug} />
    </main>
  );
}
