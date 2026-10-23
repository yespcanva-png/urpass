export type RazorpayAutopayPlanSlug = "starter" | "pro" | "business";

const REGULAR_MONTHLY_PAISE: Record<RazorpayAutopayPlanSlug, number> = {
  starter: 49900,
  pro: 99900,
  business: 249900,
};

export const AUTOPAY_AUTH_AMOUNT_PAISE = 100;
export const INDIA_GST_RATE = 0.18;

export function isRazorpayAutopayPlan(slug: string): slug is RazorpayAutopayPlanSlug {
  return slug === "starter" || slug === "pro" || slug === "business";
}

export function getRazorpayAutopayDisclosure(planSlug: RazorpayAutopayPlanSlug) {
  const regularBasePaise = REGULAR_MONTHLY_PAISE[planSlug];
  const taxPaise = Math.round(regularBasePaise * INDIA_GST_RATE);
  const maxAmountPaise = regularBasePaise + taxPaise;
  const standardMonthlyWithGst = Math.round(maxAmountPaise) / 100;

  return {
    planSlug,
    currency: "INR" as const,
    authAmountPaise: AUTOPAY_AUTH_AMOUNT_PAISE,
    introChargePaise: maxAmountPaise,
    todayAmountWithGst: standardMonthlyWithGst,
    month2AmountWithGst: standardMonthlyWithGst,
    month3OnwardAmountWithGst: standardMonthlyWithGst,
    regularBasePaise,
    taxPaise,
    maxAmountPaise,
  };
}

