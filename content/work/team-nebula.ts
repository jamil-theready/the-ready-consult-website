// content/work/team-nebula.ts
// Full case study — Team Nebula AI (TRC-built; Team Nebula CEO = Shawn Reddy, TRC co-founder).
// Feature-led, varied editorial layout (statements / splits / grid / full-bleed / devices).
// Visuals = retina captures of the live site (gstack browse) in public/work/team-nebula/.
// HERO: swap media.src to the Team Nebula logo-animation .mp4 when supplied.
import type { CaseStudy } from "@/lib/work-types";

export const teamNebula: CaseStudy = {
  slug: "team-nebula",
  client: "Team Nebula AI",
  headline: "A cosmic brand world — and a full AI-transformation platform to match.",
  meta: {
    year: "2026",
    services: ["Brand identity", "Web design", "Web development", "Motion design"],
    role: "Design, build, motion",
    location: "United States",
  },
  tier: "A",
  liveUrl: "https://www.teamnebula.ai",
  thumbnail: "/work/team-nebula/hero.jpg",
  blocks: [
    {
      type: "hero",
      client: "Team Nebula AI",
      headline: "A cosmic brand world — and a full AI-transformation platform to match.",
      meta: {
        year: "2026",
        services: ["Brand identity", "Web design", "Web development", "Motion design"],
        role: "Design, build, motion",
        location: "United States",
      },
      media: { src: "/work/team-nebula/hero.mp4", alt: "Team Nebula AI cosmic hero animation", kind: "video" },
    },
    {
      type: "text",
      subheading: "The brief",
      body: "Team Nebula AI helps legacy businesses connect their data and deploy AI that compounds. The name is the idea: a nebula is where stars are born, and the promise is helping a business reach its North Star. Our job was to turn that metaphor into a site that felt as advanced as the product it was selling.",
    },
    {
      type: "statement",
      text: "Your data is your advantage.",
      tone: "light",
    },
    {
      type: "split",
      subheading: "A brand world built from the name",
      body: "Every section lives in space. A deep navy canvas, gold-accented headlines, and a recurring cosmic system — drifting constellations, Earth from orbit, warp-speed starfields — give the whole site one continuous universe instead of a stack of unrelated sections.",
      media: { src: "/work/team-nebula/problem.jpg", alt: "Section set over Earth from orbit" },
    },
    {
      type: "grid",
      columns: 3,
      items: [
        { src: "/work/team-nebula/stack.jpg", alt: "The Transformation Stack" },
        { src: "/work/team-nebula/comparison.jpg", alt: "Interactive comparison and solutions" },
        { src: "/work/team-nebula/cases.jpg", alt: "Tabbed client case studies" },
      ],
    },
    {
      type: "devices",
      desktop: { src: "/work/team-nebula/device-desktop.jpg", alt: "Team Nebula AI on desktop" },
      mobile: { src: "/work/team-nebula/device-mobile.jpg", alt: "Team Nebula AI on mobile" },
      tone: "dark",
    },
    {
      type: "split",
      flip: true,
      subheading: "Making the abstract tangible",
      body: "The core offering is invisible infrastructure, so we gave it a shape: four modular glass cards — unified data, autonomous AI agents, lead generation, real-time analytics — each with its own capability list, floating over the space backdrop like instruments on a console.",
      media: { src: "/work/team-nebula/stack.jpg", alt: "The Team Nebula AI Transformation Stack cards" },
    },
    {
      type: "split",
      subheading: "An interactive constellation hero",
      body: "The hero isn't a static image — it's a live network of connected nodes drifting behind the headline: a literal picture of the product, siloed systems wired into one constellation. It makes the argument before you read a word of copy.",
      media: { src: "/work/team-nebula/hero.jpg", alt: "Animated constellation hero" },
    },
    {
      type: "statement",
      text: "Your data is your moat. We help you build it.",
      tone: "dark",
    },
    {
      type: "image",
      media: { src: "/work/team-nebula/compound.jpg", alt: "The Data Compound Effect, N-squared" },
      fullBleed: true,
    },
    {
      type: "split",
      flip: true,
      subheading: "Interactive by default",
      body: "Nothing on the site just sits there. Animated live-metrics count up on scroll, a comparison matrix toggles between competitors, a five-phase process timeline steps through the engagement, and tabbed client cases swap in real results — all carrying the same cosmic system.",
      media: { src: "/work/team-nebula/comparison.jpg", alt: "Interactive comparison matrix" },
    },
    {
      type: "text",
      subheading: "A platform, not a page",
      body: "This is a full multi-page platform — home, AI Transformation, HyperScale OS, case studies, and team — tied together by a persistent section switcher, so a deep product story never loses the thread.",
    },
    {
      type: "quote",
      text: "Nebula represents a place in space where the birth of stars happens. We're all about focusing on a business's North Star and helping them reach that star.",
      author: "Shawn Reddy",
      role: "CEO & Founder, Team Nebula AI",
    },
    { type: "nextCase" },
  ],
};
