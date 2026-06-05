// content/work/ampere.ts
// NOTE: demo stub content. Ampere = VIDEO work (subcontract), NOT a full agency
// engagement. Grid-tier so it appears in "More work". Replace copy + real video later.
import type { CaseStudy } from "@/lib/work-types";

export const ampere: CaseStudy = {
  slug: "ampere",
  client: "Ampere Computing",
  headline: "Cinematic brand video for an enterprise compute company.",
  meta: {
    year: "2026",
    services: ["Video production"],
    role: "Video",
    location: "Remote",
  },
  tier: "grid",
  thumbnail: "/ampere.png",
  blocks: [
    {
      type: "hero",
      client: "Ampere Computing",
      headline: "Cinematic brand video for an enterprise compute company.",
      meta: {
        year: "2026",
        services: ["Video production"],
        role: "Video",
        location: "Remote",
      },
      media: { src: "/ampere.png", alt: "Ampere brand video", kind: "image" },
    },
    {
      type: "text",
      subheading: "The work",
      body: "Brand video production for Ampere, delivered as a video partner — not a full agency engagement.",
    },
    { type: "nextCase" },
  ],
};
