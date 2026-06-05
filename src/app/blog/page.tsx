import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog | The Ready Consult",
  description:
    "Field notes on AI-first growth, content systems, paid media, and the operating playbooks behind sustainable revenue.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | The Ready Consult",
    description:
      "Field notes on AI-first growth, content systems, paid media, and the operating playbooks behind sustainable revenue.",
    url: "https://www.thereadyconsult.com/blog",
    type: "website",
  },
};

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

function readMinutes(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export default function BlogIndex() {
  const posts = getAllBlogPosts();
  const [featured, ...rest] = posts;
  const CONTAINER = "max-w-[1280px] mx-auto px-6";

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 sm:pt-40">
        {/* FEATURED — magazine cover, asymmetric */}
        {posts.length === 0 ? (
          <section className={`${CONTAINER} py-24 text-center`}>
            <p className="text-[11px] tracking-[0.24em] uppercase text-gray-400 mb-4">In the works</p>
            <h2 className="text-3xl font-semibold text-navy">More dispatches coming shortly.</h2>
          </section>
        ) : featured ? (
          <section className={`${CONTAINER} pb-20`}>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 order-2 lg:order-1">
                  <p className="text-[11px] tracking-[0.24em] uppercase text-cyan font-semibold mb-6">
                    Latest dispatch{featured.category ? ` · ${featured.category}` : ""}
                  </p>
                  <h1 className="text-[clamp(2.75rem,5.5vw,4.75rem)] font-semibold text-navy leading-[0.98] tracking-[-0.03em] group-hover:text-cyan transition-colors">
                    {featured.title}
                  </h1>
                  {featured.quickAnswer && (
                    <p className="text-gray-500 text-xl leading-snug mt-6 max-w-xl">
                      {featured.quickAnswer}
                    </p>
                  )}
                  <div className="mt-8 flex items-center gap-4 text-[11px] tracking-[0.18em] uppercase text-gray-400">
                    <span>{formatDate(featured.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-cyan" />
                    <span>{readMinutes(featured.content)} min read</span>
                    {featured.author && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-cyan" />
                        <span>{featured.author}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 order-1 lg:order-2">
                  {featured.image ? (
                    <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featured.image}
                        alt={featured.imageAlt || featured.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-[1200ms]"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </Link>
          </section>
        ) : null}

        {/* MORE POSTS — numbered editorial list */}
        {rest.length > 0 && (
          <section className={`${CONTAINER} pb-24`}>
            <div className="border-t border-navy pt-6 flex items-baseline justify-between mb-2">
              <h2 className="text-2xl font-semibold text-navy tracking-[-0.02em]">More from the field</h2>
              <span className="text-[11px] tracking-[0.24em] uppercase text-gray-400">{rest.length} entries</span>
            </div>

            <ol className="divide-y divide-gray-200">
              {rest.map((post, i) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group grid grid-cols-12 gap-6 py-8 items-start">
                    <span className="col-span-1 text-2xl font-semibold text-cyan leading-none pt-1 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="col-span-12 sm:col-span-7 lg:col-span-7">
                      {post.category && (
                        <p className="text-[10px] tracking-[0.24em] uppercase text-gray-400 mb-1">
                          {post.category}
                        </p>
                      )}
                      <h3 className="text-2xl sm:text-3xl font-semibold text-navy leading-tight tracking-[-0.02em] group-hover:text-cyan transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {post.metaDescription}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-[10px] tracking-[0.18em] uppercase text-gray-400">
                        <span>{formatDate(post.date)}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{readMinutes(post.content)} min</span>
                      </div>
                    </div>
                    {post.image && (
                      <div className="hidden sm:block sm:col-span-4 lg:col-span-4">
                        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.image}
                            alt={post.imageAlt || post.title}
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                          />
                        </div>
                      </div>
                    )}
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
