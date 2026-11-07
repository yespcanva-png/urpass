export const PRODUCT_HUNT_CODE = "PRODUCTHUNT50";
export const PRODUCT_HUNT_REGULAR_PAISE = 99900;
export const PRODUCT_HUNT_DISCOUNTED_PAISE = 49950;
export const PRODUCT_HUNT_CYCLES = 3;

// Only enable checkout after the Razorpay subscription offer has been tested
// for exactly three discounted charges followed by the regular plan amount.
export function getProductHuntOfferId(): string | null {
  const id = process.env.RAZORPAY_PRODUCTHUNT50_OFFER_ID?.trim();
  return process.env.RAZORPAY_PRODUCTHUNT50_OFFER_VERIFIED === "true" &&
    id?.startsWith("offer_") ? id : null;
}
