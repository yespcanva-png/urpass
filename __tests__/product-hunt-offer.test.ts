import { afterEach, describe, expect, it } from "vitest";
import {
  getProductHuntOfferId,
  PRODUCT_HUNT_CODE,
  PRODUCT_HUNT_CYCLES,
  PRODUCT_HUNT_DISCOUNTED_PAISE,
  PRODUCT_HUNT_REGULAR_PAISE,
} from "@/lib/billing/product-hunt-offer";

const originalId = process.env.RAZORPAY_PRODUCTHUNT50_OFFER_ID;
const originalVerified = process.env.RAZORPAY_PRODUCTHUNT50_OFFER_VERIFIED;

afterEach(() => {
  if (originalId === undefined) delete process.env.RAZORPAY_PRODUCTHUNT50_OFFER_ID;
  else process.env.RAZORPAY_PRODUCTHUNT50_OFFER_ID = originalId;
  if (originalVerified === undefined) delete process.env.RAZORPAY_PRODUCTHUNT50_OFFER_VERIFIED;
  else process.env.RAZORPAY_PRODUCTHUNT50_OFFER_VERIFIED = originalVerified;
});

describe("Product Hunt subscription offer", () => {
  it("describes 50% off exactly three Pro monthly charges", () => {
    expect(PRODUCT_HUNT_CODE).toBe("PRODUCTHUNT50");
    expect(PRODUCT_HUNT_CYCLES).toBe(3);
    expect(PRODUCT_HUNT_DISCOUNTED_PAISE * 2).toBe(PRODUCT_HUNT_REGULAR_PAISE);
  });

  it("stays unavailable until a provider offer is configured and verified", () => {
    delete process.env.RAZORPAY_PRODUCTHUNT50_OFFER_ID;
    delete process.env.RAZORPAY_PRODUCTHUNT50_OFFER_VERIFIED;
    expect(getProductHuntOfferId()).toBeNull();
    process.env.RAZORPAY_PRODUCTHUNT50_OFFER_ID = "offer_test123";
    expect(getProductHuntOfferId()).toBeNull();
    process.env.RAZORPAY_PRODUCTHUNT50_OFFER_VERIFIED = "true";
    expect(getProductHuntOfferId()).toBe("offer_test123");
  });
});
