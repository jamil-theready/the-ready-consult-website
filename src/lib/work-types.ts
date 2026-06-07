// src/lib/work-types.ts
export type Tier = "A" | "grid";

export interface CaseMeta {
  year: string;
  services: string[];
  role?: string;
  location?: string;
}

export interface Media {
  src: string;        // repo path ("/work/...") OR full Cloudinary URL
  alt: string;
  kind?: "image" | "video";
}

export interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  unit?: string;
  label: string;
  source: string;     // "GA4" | "Search Console" | "Meta Ads" | ...
  asOf: string;       // "Jan–Apr 2026"
}

export interface Milestone {
  date: string;
  title: string;
  desc: string;
  media?: Media;
}

export type Block =
  | { type: "hero"; client: string; headline: string; meta: CaseMeta; media: Media }
  | { type: "text"; subheading?: string; body: string }
  | { type: "image"; media: Media; caption?: string; fullBleed?: boolean; mockup?: "browser" }
  | { type: "devices"; desktop: Media; mobile?: Media; tone?: "light" | "dark" }
  | { type: "statement"; text: string; tone?: "light" | "dark" }
  | { type: "split"; subheading?: string; body: string; media: Media; flip?: boolean; tone?: "light" | "dark" }
  | { type: "grid"; items: Media[]; columns?: 2 | 3 }
  | { type: "gallery"; items: Media[]; layout?: "grid" | "scroll" }
  | { type: "metricRow"; stats: Metric[] }
  | { type: "timeline"; milestones: Milestone[] }
  | { type: "adGallery"; ads: Media[]; note?: string }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "quote"; text: string; author: string; role?: string }
  | { type: "nextCase" };

export interface CaseStudy {
  slug: string;
  client: string;
  headline: string;
  meta: CaseMeta;
  tier: Tier;
  liveUrl?: string;
  thumbnail: string;
  draft?: boolean;
  blocks: Block[];
}
