// content/work/perfecto-homes.ts
// NOTE: demo stub content — copy + metrics to be replaced from the inventory doc.
import type { CaseStudy } from "@/lib/work-types";

export const perfectoHomes: CaseStudy = {
  slug: "perfecto-homes",
  client: "Perfecto Homes",
  headline: "An MLS-style listings site that turns browsers into qualified buyers.",
  meta: {
    year: "2026",
    services: ["Web design", "SEO", "Listings"],
    role: "Design, build, content automation",
    location: "Cusco, Peru",
  },
  tier: "A",
  liveUrl: "https://www.perfectohomesrealestate.com",
  thumbnail: "/case-study-perfecto.png",
  blocks: [
    {
      type: "hero",
      client: "Perfecto Homes",
      headline: "An MLS-style listings site that turns browsers into qualified buyers.",
      meta: {
        year: "2026",
        services: ["Web design", "SEO", "Listings"],
        role: "Design, build, content automation",
        location: "Cusco, Peru",
      },
      media: { src: "/case-study-perfecto.png", alt: "Perfecto Homes website", kind: "image" },
    },
    {
      type: "text",
      subheading: "The challenge",
      body: "Perfecto Homes needed a real-estate site that felt as polished as the listings it sold, with a search experience buyers actually trust.",
    },
    {
      type: "image",
      media: { src: "/case-study-perfecto.png", alt: "Perfecto Homes listings layout" },
      fullBleed: true,
    },
    {
      type: "text",
      subheading: "What we did",
      body: "We designed an MLS-style listings experience and layered on SEO plus automated content so the site keeps pulling in search traffic month over month.",
    },
    {
      type: "quote",
      text: "The new site finally matches the quality of the properties we represent.",
      author: "Perfecto Homes",
      role: "Brokerage",
    },
    { type: "nextCase" },
  ],
};
