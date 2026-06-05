import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AUTHORS, getAuthorBySlug, getAllAuthors } from "@/lib/authors";
import { getAllBlogPosts } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  const url = `https://www.thereadyconsult.com/author/${slug}`;
  return {
    title: `${author.name} — ${author.jobTitle}`,
    description: author.bio,
    alternates: { canonical: url },
    openGraph: {
      title: `${author.name} — The Ready Consult`,
      description: author.bio,
      url,
      type: "profile",
      images: [{ url: `https://www.thereadyconsult.com${author.image}`, alt: author.name }],
    },
  };
}

function personSchema(author: ReturnType<typeof getAuthorBySlug>) {
  if (!author) return null;
  const url = `https://www.thereadyconsult.com/author/${author.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.bioLong,
    url,
    image: `https://www.thereadyconsult.com${author.image}`,
    email: author.email,
    knowsAbout: author.knowsAbout,
    sameAs: author.sameAs,
    worksFor: {
      "@type": "Organization",
      name: "The Ready Consult",
      url: "https://www.thereadyconsult.com",
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const allPosts = getAllBlogPosts();
  const authorPosts = allPosts.filter((p) => p.author === author.name);

  const CONTAINER = "max-w-[1280px] mx-auto px-6";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema(author)) }}
      />

      <Navbar />
      <main id="main-content" className="pt-32 sm:pt-40 pb-24">
        <section className={CONTAINER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4">
              <div className="aspect-square overflow-hidden bg-navy flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              <p className="text-[11px] tracking-[0.24em] uppercase text-cyan font-semibold mb-4">
                The Ready Consult Partner
              </p>
              <h1 className="text-[clamp(2.5rem,4.8vw,4rem)] font-semibold text-navy leading-[1.02] tracking-[-0.03em]">
                {author.name}
              </h1>
              <p className="text-xl text-gray-500 mt-3">{author.jobTitle}</p>

              <p className="text-navy text-lg leading-relaxed mt-8 max-w-2xl">
                {author.bioLong}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-navy text-white text-[15px] font-semibold px-7 py-3.5 hover:bg-cyan transition-colors"
                >
                  Book a Call with {author.name.split(" ")[0]}
                  <span aria-hidden="true">→</span>
                </Link>
                {author.sameAs.map((url) => {
                  const isLinkedIn = url.includes("linkedin");
                  const isTwitter = url.includes("twitter") || url.includes("x.com");
                  const label = isLinkedIn ? "LinkedIn" : isTwitter ? "X / Twitter" : "Profile";
                  return (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-gray-300 text-navy text-[15px] font-semibold px-6 py-3.5 hover:border-cyan hover:text-cyan transition-colors"
                    >
                      {label}
                    </a>
                  );
                })}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-[11px] tracking-[0.24em] uppercase text-gray-400 font-semibold mb-3">
                  Areas of expertise
                </p>
                <ul className="flex flex-wrap gap-2">
                  {author.knowsAbout.map((topic) => (
                    <li
                      key={topic}
                      className="text-sm text-navy bg-gray-50 px-3 py-1.5 border border-gray-200"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {authorPosts.length > 0 && (
          <section className={`${CONTAINER} mt-24 pt-12 border-t border-navy`}>
            <h2 className="text-3xl sm:text-4xl font-semibold text-navy tracking-[-0.02em] mb-10">
              Posts by {author.name.split(" ")[0]}
            </h2>
            <ol className="divide-y divide-gray-200">
              {authorPosts.map((post, i) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group grid grid-cols-12 gap-6 py-8 items-start">
                    <span className="col-span-1 text-2xl font-semibold text-cyan leading-none pt-1 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="col-span-12 sm:col-span-11">
                      {post.category && (
                        <p className="text-[10px] tracking-[0.24em] uppercase text-gray-400 mb-1">
                          {post.category}
                        </p>
                      )}
                      <h3 className="text-2xl font-semibold text-navy leading-tight tracking-[-0.02em] group-hover:text-cyan transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {post.metaDescription}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
