// content/work/team-nebula.ts
import type { CaseStudy } from "@/lib/work-types";

export const teamNebula: CaseStudy = {
  slug: "team-nebula",
  client: "Team Nebula AI",
  headline: "Scaling an AI operations team with automation and SEO content.",
  meta: {
    year: "2026",
    services: ["Web design", "SEO", "Automation"],
    role: "Design, build, content",
    location: "Remote",
  },
  tier: "A",
  liveUrl: "https://teamnebula.ai",
  thumbnail: "/case-study-nebula.jpg",
  blocks: [
    {
      type: "hero",
      client: "Team Nebula AI",
      headline: "Scaling an AI operations team with automation and SEO content.",
      meta: {
        year: "2026",
        services: ["Web design", "SEO", "Automation"],
        role: "Design, build, content",
        location: "Remote",
      },
      media: { src: "/case-study-nebula.png", alt: "Team Nebula website", kind: "image" },
    },
    {
      type: "text",
      subheading: "The challenge",
      body: "Team Nebula needed a site that matched the sophistication of their AI product and a content engine to build search authority in a crowded space.",
    },
    {
      type: "image",
      media: { src: "/case-study-nebula.jpg", alt: "Team Nebula homepage design" },
      fullBleed: true,
    },
    {
      type: "text",
      subheading: "What we did",
      body: "We designed and built a fast, modern marketing site and stood up an automated SEO content workflow to publish consistently without manual effort.",
    },
    {
      type: "quote",
      text: "The site and content engine gave us a credibility step-change with enterprise prospects.",
      author: "Team Nebula",
      role: "Founding team",
    },
    { type: "nextCase" },
  ],
};
