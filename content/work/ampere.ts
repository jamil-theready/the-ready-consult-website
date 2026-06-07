// content/work/ampere.ts
// Ampere = VIDEO PRODUCTION / EDITING work (TRC edit team, Shawn-sourced). NOT the chip
// company "Ampere Computing" — this is a different "Ampere" (mountain/arch logo, red brand).
// ⚠️ Copy below is HONEST-MINIMAL pending real details (industry, what the video was, the
// actual video file). Do not fabricate the company type or results.
import type { CaseStudy } from "@/lib/work-types";

export const ampere: CaseStudy = {
  slug: "ampere",
  client: "Ampere",
  headline: "Brand video production for Ampere.",
  meta: {
    year: "2026",
    services: ["Video production", "Editing"],
    role: "Video editing",
    location: "United States",
  },
  tier: "A",
  liveUrl: "",
  thumbnail: "/work/ampere/hero.jpg",
  blocks: [
    {
      type: "hero",
      client: "Ampere",
      headline: "Brand video production for Ampere.",
      meta: {
        year: "2026",
        services: ["Video production", "Editing"],
        role: "Video editing",
        location: "United States",
      },
      media: { src: "/work/ampere/hero.jpg", alt: "Ampere brand video still", kind: "image" },
    },
    {
      type: "text",
      subheading: "The work",
      body: "Our edit team produced brand video for Ampere as a production partner. This is video work, not a full agency engagement.",
    },
    // TODO: embed the actual Ampere video (video block) once the file/link is provided.
    { type: "nextCase" },
  ],
};
