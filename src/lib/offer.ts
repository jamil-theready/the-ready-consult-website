export const OFFER = {
  name: "Ready System",
  price: "$103",
  period: "per month",
  commitment: "Month to month. No minimum term.",
  headline: "Your website. Built in one day. Improved every month.",
  description: "A professional website, monthly SEO improvements, and new website leads sent straight to your WhatsApp. For small businesses serving local customers.",
  buildCondition: "Within one business day after we confirm your onboarding is complete. Launch follows your approval and domain connection.",
  subscriptionSummary: "Your paid subscription keeps your website online and monthly services running. Cancel before your next renewal; service ends at the end of your paid period. Website handover is not included.",
  cta: "Get my website",
  href: "/contact",
  features: [
    "Your website, built or improved",
    "Hosting and maintenance",
    "Monthly website and SEO improvements",
    "Website lead alerts on WhatsApp",
    "A dashboard for traffic, inquiries, and progress",
  ],
} as const;

export const ONBOARDING_STEPS = [
  { title: "Tell us about your business.", body: "Send your services, service areas, contact details, photos, and preferences. We confirm the website scope, subscription, and anything still needed." },
  { title: "Built in one business day.", body: "Once the required materials, access, agreed scope, and payment are ready, we confirm your onboarding is complete and give you a build deadline. Your completed website is sent for review within one business day." },
  { title: "Approve it. Go live.", body: "You review your website. We connect your domain and verify a real form submission reaches your agreed lead destination. Approval, revisions, and domain connection can extend the launch date." },
  { title: "Improve every month.", body: "We review performance and make website and SEO improvements each month. Your dashboard shows traffic and inquiries so you can see progress." },
] as const;
