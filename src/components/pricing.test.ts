import { describe, it, expect } from "vitest";
import { PLANS } from "./pricing-data";

describe("PLANS", () => {
  it("has exactly two tiers, named as agreed", () => {
    expect(PLANS.map((p) => p.name)).toEqual(["Ready System", "Acquisition System"]);
  });

  it("prices the entry tier at 103 and gates the enterprise tier", () => {
    expect(PLANS[0].price).toBe("$103");
    expect(PLANS[1].price).toBe("Let's talk");
  });

  it("lists every Ready System feature", () => {
    expect(PLANS[0].features).toEqual([
      "Website",
      "Google Business Profile",
      "Automated monthly SEO",
      "Maintenance and hosting",
      "Dashboard",
    ]);
  });

  it("lists every Acquisition System feature", () => {
    expect(PLANS[1].features).toEqual([
      "AI video generation for social",
      "Meta Ads",
      "Google Ads",
      "Lead generation",
      "Data structure",
      "Follow up automation",
    ]);
  });

  it("uses no dash punctuation in any copy", () => {
    const copy = PLANS.flatMap((p) => [p.desc, ...p.features, p.cta, p.period]).join(" ");
    expect(copy).not.toMatch(/\s[—–-]\s/);
  });
});
