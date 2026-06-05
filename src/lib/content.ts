import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

const contentDirectory = path.join(process.cwd(), "content");

export interface BlogFrontmatter {
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  date: string;
  image: string;
  imageAlt: string;
  category?: string;
  author?: string;
  quickAnswer?: string;
  keyTakeaways?: string[];
  faqTitle?: string;
  faq?: { question: string; answer: string }[];
  howToTitle?: string;
  howToDescription?: string;
  howToSteps?: { name: string; text: string }[];
  tags?: string[];
  featured?: boolean;
  draft?: boolean;
}

function getContentFiles(subdir: string): string[] {
  const dir = path.join(contentDirectory, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

export function getAllBlogPosts(): (BlogFrontmatter & { content: string })[] {
  const files = getContentFiles("blog");
  return files
    .map((filename) => {
      const filePath = path.join(contentDirectory, "blog", filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      return { ...(data as BlogFrontmatter), content };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(
  slug: string
): (BlogFrontmatter & { content: string }) | null {
  const posts = getAllBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(
  markdown: string
): { text: string; id: string }[] {
  const lines = markdown.split("\n");
  const headings: { text: string; id: string }[] = [];
  for (const line of lines) {
    const match = line.match(/^## (.+)/);
    if (match) {
      const text = match[1].trim();
      headings.push({ text, id: slugifyHeading(text) });
    }
  }
  return headings;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(gfm).use(html).process(markdown);
  const withIds = result
    .toString()
    .replace(/<h2>(.*?)<\/h2>/g, (_match, text: string) => {
      const id = slugifyHeading(text.replace(/<[^>]+>/g, ""));
      return `<h2 id="${id}">${text}</h2>`;
    })
    .replace(/<h3>(.*?)<\/h3>/g, (_match, text: string) => {
      const id = slugifyHeading(text.replace(/<[^>]+>/g, ""));
      return `<h3 id="${id}">${text}</h3>`;
    });
  return withIds;
}

export function calcReadTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
