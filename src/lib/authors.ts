export interface Author {
  slug: string;
  name: string;
  jobTitle: string;
  bio: string;
  bioLong: string;
  image: string;
  knowsAbout: string[];
  sameAs: string[];
  email: string;
}

export const AUTHORS: Record<string, Author> = {
  "jamil-gonzales": {
    slug: "jamil-gonzales",
    name: "Jamil Gonzales",
    jobTitle: "CEO & Growth Strategist, The Ready Consult",
    bio: "Co-founder of The Ready Consult. Runs growth operations, paid media, and AI workflows for $1M–$20M companies.",
    bioLong:
      "Jamil Gonzales is the co-founder and CEO of The Ready Consult. He spent the last decade running growth for SaaS, ecommerce, and service businesses, designing the content engines, paid-media systems, and AI workflows that move pipeline. He leads client strategy and day-to-day operations.",
    image: "/team/jamil.jpg",
    knowsAbout: [
      "Growth Marketing",
      "Paid Media (Meta, Google, LinkedIn)",
      "AI Content Workflows",
      "n8n Automation",
      "Fractional CMO",
      "SEO and AEO",
      "B2B SaaS Marketing",
    ],
    sameAs: [
      "https://www.linkedin.com/in/jamilgonzales/",
      "https://twitter.com/jamilgonzales",
    ],
    email: "jamil@thereadyconsult.com",
  },
  "shawn-reddy": {
    slug: "shawn-reddy",
    name: "Shawn Reddy",
    // Shawn departed The Ready Consult in June 2026. The entry is kept so his
    // existing byline keeps a valid Person/author reference (and /author/
    // shawn-reddy does not 404), but the copy is past tense — he is no longer
    // presented as current staff on the team or contact pages.
    jobTitle: "Former Co-Founder & AI Architect, The Ready Consult",
    bio: "Former co-founder of The Ready Consult. Wrote on AI content systems, automation, and growth experimentation.",
    bioLong:
      "Shawn Reddy is a former co-founder and AI architect of The Ready Consult, where he designed agentic systems, automation graphs, and AI infrastructure for client engagements. He contributed writing on automation and B2B growth strategy.",
    image: "/team/shawn.jpg",
    knowsAbout: [
      "AI Architecture",
      "Multi-Agent Systems",
      "Marketing Automation",
      "n8n and Workflow Orchestration",
      "Prompt Engineering",
      "AI Content Systems",
      "B2B Growth Strategy",
    ],
    sameAs: [
      "https://www.linkedin.com/in/shawnreddy/",
    ],
    email: "shawn@thereadyconsult.com",
  },
};

export function getAuthorBySlug(slug: string): Author | null {
  return AUTHORS[slug] || null;
}

export function getAuthorByName(name: string): Author | null {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return AUTHORS[slug] || null;
}

export function getAllAuthors(): Author[] {
  return Object.values(AUTHORS);
}
