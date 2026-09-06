import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareSidebar from "@/components/ShareSidebar";
import TableOfContents from "@/components/TableOfContents";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  markdownToHtml,
  extractHeadings,
  calcReadTime,
} from "@/lib/content";
import {
  blogPostSchema,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
} from "@/lib/schema";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  const url = `https://www.thereadyconsult.com/blog/${slug}`;
  return {
    title: post.metaTitle ? { absolute: post.metaTitle } : post.title,
    description: post.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription,
      url,
      type: "article",
      images: post.image ? [{ url: post.image, alt: post.imageAlt }] : [],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const contentHtml = await markdownToHtml(post.content);
  const headings = extractHeadings(post.content);
  const readTime = calcReadTime(post.content);
  const canonicalUrl = `https://www.thereadyconsult.com/blog/${slug}`;

  const allPosts = getAllBlogPosts();
  const others = allPosts.filter((p) => p.slug !== slug);
  const sameCategory = post.category
    ? others.filter((p) => p.category === post.category)
    : [];
  const fillers = others.filter((p) => !sameCategory.includes(p));
  const recommended = [...sameCategory, ...fillers].slice(0, 3);
  const sidebarRelated = recommended[0] || null;

  const CONTAINER = "max-w-[1280px] mx-auto px-6";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home", url: "https://www.thereadyconsult.com/" },
        { name: "Blog", url: "https://www.thereadyconsult.com/blog" },
        { name: post.title, url: canonicalUrl },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema(
        post.title, post.metaDescription, canonicalUrl, post.image || "", post.date, undefined, post.author
      )) }} />
      {post.faq && post.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(post.faq)) }} />
      )}
      {post.howToSteps && post.howToSteps.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema(
          post.howToTitle || post.title, post.howToDescription || post.metaDescription, post.howToSteps
        )) }} />
      )}

      <Navbar />
      <main id="main-content" className="pt-32 sm:pt-40 pb-20">
        {/* HEADER */}
        <header className={CONTAINER}>
          <div className="max-w-3xl">
            {post.category && (
              <p className="text-[11px] tracking-[0.24em] uppercase text-cyan font-semibold mb-6">
                {post.category}
              </p>
            )}
            <h1 className="text-[clamp(2.5rem,5.2vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-navy">
              {post.title}
            </h1>
            {post.quickAnswer && (
              <p className="text-xl sm:text-2xl text-gray-500 leading-snug mt-8 max-w-2xl">
                {post.quickAnswer}
              </p>
            )}
            <div className="mt-8 flex items-center gap-4 text-[11px] tracking-[0.18em] uppercase text-gray-400">
              {post.author && (
                <>
                  <span>
                    By{" "}
                    <Link href="/contact" className="text-navy hover:text-cyan transition-colors underline underline-offset-4 decoration-cyan/30 hover:decoration-cyan">
                      {post.author}
                    </Link>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-cyan" />
                </>
              )}
              <span>{formatDate(post.date)}</span>
              <span className="w-1 h-1 rounded-full bg-cyan" />
              <span>{readTime} min read</span>
            </div>
          </div>

          {post.image && (
            <div className="mt-12 aspect-[16/8] overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.imageAlt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* BODY — article aligned to nav logo edge (left), TOC aligned to nav CTA edge (right) */}
        <div className={`${CONTAINER} mt-16`}>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-12 xl:gap-16">
            <article className="relative min-w-0 max-w-[680px] w-full">
              {/* Mobile share bar */}
              <div className="lg:hidden flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
                <span className="text-[10px] text-gray-400 font-semibold tracking-[0.24em] uppercase mr-2">Share</span>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="w-9 h-9 border border-gray-300 text-gray-500 hover:text-cyan hover:border-cyan flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2H21l-6.523 7.453L22 22h-6.84l-4.78-6.244L4.8 22H2l7-7.99L1.5 2h6.96l4.32 5.71L18.244 2Zm-1.2 18h1.882L7.05 4H5.05l11.994 16Z"/></svg>
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="w-9 h-9 border border-gray-300 text-gray-500 hover:text-cyan hover:border-cyan flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.4 0h4.37v1.92h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.48 3.04 5.48 6.99V22h-4.56v-6.21c0-1.48-.03-3.39-2.06-3.39-2.07 0-2.39 1.62-2.39 3.29V22H7.62V8z"/></svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="w-9 h-9 border border-gray-300 text-gray-500 hover:text-cyan hover:border-cyan flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/></svg>
                </a>
              </div>

              {/* Key Takeaways — numbered sidebar with red rule */}
              {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                <aside className="mb-12 border-l-2 border-cyan pl-6">
                  <p className="text-[10px] tracking-[0.24em] uppercase text-cyan font-semibold mb-4">Key Takeaways</p>
                  <ol className="space-y-3">
                    {post.keyTakeaways.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="text-cyan text-base font-semibold leading-none pt-1 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-navy leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ol>
                </aside>
              )}

              {/* Mobile-only TOC */}
              {headings.length >= 2 && (
                <aside className="xl:hidden mb-12 border-t border-b border-gray-200 py-6 rounded-[12px]">
                  <p className="text-[10px] tracking-[0.24em] uppercase text-gray-400 font-semibold mb-4">In This Article</p>
                  <ol className="space-y-2">
                    {headings.map((h, i) => (
                      <li key={h.id} className="flex items-start gap-3">
                        <span className="text-cyan text-sm font-semibold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        <a href={`#${h.id}`} className="text-navy hover:text-cyan transition-colors text-sm">{h.text}</a>
                      </li>
                    ))}
                  </ol>
                </aside>
              )}

              {/* Article body */}
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-semibold prose-headings:tracking-[-0.02em] prose-headings:text-navy prose-headings:mt-12
                  prose-h2:text-3xl sm:prose-h2:text-4xl prose-h2:leading-tight
                  prose-h3:text-2xl
                  prose-p:text-navy prose-p:leading-[1.7] prose-p:text-[17px]
                  prose-a:text-cyan prose-a:underline prose-a:underline-offset-4 prose-a:decoration-cyan/30 hover:prose-a:decoration-cyan
                  prose-strong:text-navy prose-strong:font-semibold
                  prose-blockquote:not-italic prose-blockquote:border-l-2 prose-blockquote:border-cyan prose-blockquote:text-gray-600 prose-blockquote:font-normal
                  prose-li:text-navy prose-li:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* FAQ — numbered accordion */}
              {post.faq && post.faq.length > 0 && (
                <section className="mt-20 pt-12 border-t border-navy">
                  <h2 className="text-3xl sm:text-4xl font-semibold text-navy tracking-[-0.02em] mb-8">
                    {post.faqTitle || "Frequently Asked Questions"}
                  </h2>
                  <div className="divide-y divide-gray-200 border-t border-gray-200">
                    {post.faq.map((f, i) => (
                      <details key={i} className="py-5 group">
                        <summary className="flex items-start gap-4 cursor-pointer list-none">
                          <span className="text-cyan text-sm font-semibold leading-none pt-1.5 shrink-0 tabular-nums">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-lg font-medium text-navy leading-snug flex-1 group-hover:text-cyan transition-colors">
                            {f.question}
                          </span>
                          <svg className="w-5 h-5 text-gray-400 shrink-0 group-open:rotate-180 transition-transform mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <p className="mt-3 ml-10 text-navy leading-relaxed">{f.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-16 pt-8 border-t border-gray-200">
                <Link href="/blog" className="text-cyan font-semibold hover:underline underline-offset-4">
                  ← Back to the Field Notes
                </Link>
              </div>
            </article>

            <TableOfContents headings={headings} relatedPost={sidebarRelated} />
          </div>
        </div>

        {/* RECOMMENDED — numbered editorial multi-post */}
        {recommended.length > 0 && (
          <section className={`${CONTAINER} mt-24 pt-12 border-t border-navy`}>
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-navy tracking-[-0.02em]">
                Continue reading
              </h2>
              {post.category && (
                <p className="text-[11px] tracking-[0.24em] uppercase text-gray-400">
                  More in <span className="text-cyan font-semibold">{post.category}</span>
                </p>
              )}
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {recommended.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group block">
                    {p.image ? (
                      <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.imageAlt || p.title}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1000ms]"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/5] mb-5 bg-void" />
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-cyan text-base font-semibold leading-none tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {p.category && (
                        <span className="text-[10px] tracking-[0.24em] uppercase text-gray-400">{p.category}</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-semibold text-navy leading-tight tracking-[-0.02em] group-hover:text-cyan transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {p.metaDescription}
                    </p>
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
