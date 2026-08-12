import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/content";
import { getAllCases } from "@/lib/work";
import { getAllAuthors } from "@/lib/authors";

const SITE = "https://www.thereadyconsult.com";

// Required by `output: "export"` — without it Next refuses to collect page data
// for the /sitemap.xml route handler.
export const dynamic = "force-static";

/**
 * Native Next sitemap, emitted by `next build` itself.
 *
 * Previously the sitemap came from `next-sitemap`, chained in package.json as
 * `next build && next-sitemap`. That worked locally but the deployed sitemap
 * 404'd, because the Pages build never ran the second half of the chain — while
 * robots.txt (a static file in public/) shipped fine and kept advertising the
 * missing URL. Generating it here removes the dependency on the build command
 * matching, so the sitemap ships whenever the site does.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const posts: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    // Real publish date, so Google sees genuine freshness signals rather than
    // every URL claiming it changed at build time.
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cases: MetadataRoute.Sitemap = getAllCases().map((c) => ({
    url: `${SITE}/work/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const authors: MetadataRoute.Sitemap = getAllAuthors().map((a) => ({
    url: `${SITE}/author/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...posts, ...cases, ...authors];
}
