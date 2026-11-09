import { describe, it, expect } from "vitest";
import { PLANS } from "./pricing-data";
import { OFFER } from "@/lib/offer";

describe("public subscription offer", () => {
  it("offers one monthly plan without an acquisition upsell", () => {
    expect(PLANS).toHaveLength(1);
    expect(PLANS[0].name).toBe("Ready System");
    expect(PLANS[0].price).toBe("$103");
    expect(PLANS[0].href).toBe("/contact");
  });
  it("discloses website access and cancellation beside the offer", () => {
    expect(OFFER.commitment).toContain("No minimum term");
    expect(OFFER.subscriptionSummary).toContain("end of your paid period");
    expect(OFFER.subscriptionSummary).toContain("handover is not included");
    expect(OFFER.buildCondition).toContain("after we confirm your onboarding is complete");
  });
});
