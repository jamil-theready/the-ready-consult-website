// content/work/cluely.ts
// NOTE: demo stub content. Cluely = VIDEO PRODUCTION / EDITING work (subcontract),
// NOT a full agency engagement. Frame honestly. Replace copy + swap in real video later.
import type { CaseStudy } from "@/lib/work-types";

export const cluely: CaseStudy = {
  slug: "cluely",
  client: "Cluely",
  headline: "Short-form video editing that keeps an AI brand scrolling-stopping.",
  meta: {
    year: "2026",
    services: ["Video production", "Editing"],
    role: "Video editing",
    location: "Remote",
  },
  tier: "A",
  thumbnail: "/work/cluely/hero.jpg",
  blocks: [
    {
      type: "hero",
      client: "Cluely",
      headline: "Short-form video editing that keeps an AI brand scrolling-stopping.",
      meta: {
        year: "2026",
        services: ["Video production", "Editing"],
        role: "Video editing",
        location: "Remote",
      },
      media: { src: "/work/cluely/hero.jpg", alt: "Cluely brand video still", kind: "image" },
    },
    {
      type: "text",
      subheading: "The work",
      body: "Our edit team produced short-form social video for Cluely. This is video editing work delivered as a production partner, not a full agency engagement.",
    },
    { type: "nextCase" },
  ],
};
