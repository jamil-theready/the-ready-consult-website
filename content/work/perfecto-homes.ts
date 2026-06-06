// content/work/perfecto-homes.ts
// FLAGSHIP / standard-setting case study. Content is REAL (interview + GSC-verified
// metrics, pulled 2026-06-05). Visuals still use a placeholder thumbnail until live-site
// screenshots are wired in. No testimonial yet — add a real quote from Elisban Gonzales.
import type { CaseStudy } from "@/lib/work-types";

export const perfectoHomes: CaseStudy = {
  slug: "perfecto-homes",
  client: "Perfecto Homes",
  headline: "From a hacked WordPress site to page-one Google — a Peru real-estate brand rebuilt in 8 days.",
  meta: {
    year: "2026",
    services: ["Web design", "SEO", "Automation"],
    role: "Design, build, SEO, content automation",
    location: "Cusco, Peru",
  },
  tier: "A",
  liveUrl: "https://www.perfectohomesrealestate.com",
  thumbnail: "/work/perfecto-homes/showcase.jpg",
  blocks: [
    {
      type: "hero",
      client: "Perfecto Homes",
      headline: "From a hacked WordPress site to page-one Google — a Peru real-estate brand rebuilt in 8 days.",
      meta: {
        year: "2026",
        services: ["Web design", "SEO", "Automation"],
        role: "Design, build, SEO, content automation",
        location: "Cusco, Peru",
      },
      media: { src: "/work/perfecto-homes/hero.mp4", alt: "Perfecto Homes logo animation", kind: "video" },
    },
    {
      type: "text",
      subheading: "The challenge",
      body: "Perfecto Homes had no real web presence — just a broken WordPress site that had been infected with malware. There was nothing to send buyers to, nothing ranking on Google, and nothing that reflected the quality of the Sacred Valley properties they represent.",
    },
    {
      type: "text",
      subheading: "What we built",
      body: "We rebuilt the brand from zero on a fast, secure stack — an MLS-style listings experience with dedicated community pages for Cusco, Ollantaytambo, and the wider Peru market, agent profiles, and an automation layer that publishes new listings, a newsletter, and SEO content on a daily schedule. The whole thing went live in eight days.",
    },
    {
      type: "metricRow",
      stats: [
        { value: 8, unit: "days", label: "from kickoff to live site", source: "TRC", asOf: "Apr 2026" },
        { value: 12, suffix: "×", label: "more Google search impressions", source: "Search Console", asOf: "Nov 2025 – Jun 2026" },
        { value: 5, suffix: "×", label: "organic clicks since relaunch", source: "Search Console", asOf: "Apr – Jun 2026" },
      ],
    },
    {
      type: "devices",
      desktop: { src: "/work/perfecto-homes/device-desktop.jpg", alt: "Perfecto Homes listings on desktop" },
      mobile: { src: "/work/perfecto-homes/device-mobile.jpg", alt: "Perfecto Homes listings on mobile" },
      tone: "light",
    },
    {
      type: "text",
      subheading: "The result",
      body: "Within weeks of relaunch, search impressions and clicks climbed sharply, and the site now ranks on page one of Google for core Peru and Cusco real-estate searches — turning a liability into the brand's best lead source.",
    },
    { type: "nextCase" },
  ],
};
