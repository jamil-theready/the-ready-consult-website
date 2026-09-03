export type Plan = {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
};

// Two tiers. The entry price is public as of 2026-09-03; the enterprise tier
// stays call gated on purpose.
export const PLANS: Plan[] = [
  {
    name: "Ready System",
    price: "$103",
    period: "per month",
    desc: "Everything you need to get found and get called.",
    features: [
      "Website",
      "Google Business Profile",
      "Automated monthly SEO",
      "Maintenance and hosting",
      "Dashboard",
    ],
    cta: "Get started",
    href: "/start",
  },
  {
    name: "Acquisition System",
    price: "Let's talk",
    period: "built around your crew",
    desc: "The full system for contractors who want more work than word of mouth brings in.",
    features: [
      "AI video generation for social",
      "Meta Ads",
      "Google Ads",
      "Lead generation",
      "Data structure",
      "Follow up automation",
    ],
    cta: "Book a call",
    href: "https://calendly.com/thereadyconsult/30min",
  },
];
