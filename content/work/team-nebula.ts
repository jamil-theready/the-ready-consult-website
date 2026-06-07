// content/work/team-nebula.ts
// Full case study — Team Nebula AI (TRC-built site; Team Nebula CEO = Shawn Reddy, TRC co-founder).
// Feature-led: written around the site's specific design decisions. Visuals = retina captures
// of the live site (gstack browse) in public/work/team-nebula/.
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
      media: { src: "/work/team-nebula/hero.jpg", alt: "Team Nebula AI homepage hero", kind: "image" },
    },
    {
      type: "text",
      subheading: "The brief",
      body: "Team Nebula AI helps legacy businesses connect their data and deploy AI that compounds. The name is the idea: a nebula is where stars are born, and the promise is helping a business reach its North Star. Our job was to turn that metaphor into a site that felt as advanced as the product it was selling.",
    },
    {
      type: "devices",
      desktop: { src: "/work/team-nebula/device-desktop.jpg", alt: "Team Nebula AI on desktop" },
      mobile: { src: "/work/team-nebula/device-mobile.jpg", alt: "Team Nebula AI on mobile" },
      tone: "dark",
    },
    {
      type: "text",
      subheading: "A brand world built from the name",
      body: "Every section lives in space. A deep navy canvas, gold-accented headlines, and a recurring cosmic system — drifting constellations, Earth from orbit, warp-speed starfields — give the whole site one continuous universe instead of a stack of unrelated sections.",
    },
    {
      type: "image",
      media: { src: "/work/team-nebula/problem.jpg", alt: "Problem section set over Earth from orbit" },
      fullBleed: true,
    },
    {
      type: "text",
      subheading: "An interactive constellation hero",
      body: "The hero isn't a static image — it's a live network of connected nodes drifting behind the headline: a literal picture of the product, siloed systems wired into one constellation. It makes the argument before you read a word of copy.",
    },
    {
      type: "text",
      subheading: "Making the abstract tangible — the Transformation Stack",
      body: "The core offering is invisible infrastructure, so we gave it a shape: four modular glass cards — unified data infrastructure, autonomous AI agents, intelligent lead generation, real-time analytics — each with its own capability list, floating over the space backdrop like instruments on a console.",
    },
    {
      type: "image",
      media: { src: "/work/team-nebula/stack.jpg", alt: "The Team Nebula AI Transformation Stack cards" },
      fullBleed: true,
    },
    {
      type: "text",
      subheading: "Letting design make the argument — the compound effect",
      body: "The hardest idea to sell is that connected data compounds. We gave it its own chapter — “Your data is your moat” — and a single piece of notation, N², to make the math feel inevitable: every new connected system multiplies the value of every other one.",
    },
    {
      type: "image",
      media: { src: "/work/team-nebula/compound.jpg", alt: "The Data Compound Effect section, N-squared" },
      fullBleed: true,
    },
    {
      type: "text",
      subheading: "A platform, not a page",
      body: "This is a full multi-page platform — home, AI Transformation, HyperScale OS, case studies, and team — tied together by a persistent section switcher. Animated live-metrics, an interactive comparison matrix, a five-phase process timeline, and tabbed client case studies all carry the same cosmic system and the same story.",
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
