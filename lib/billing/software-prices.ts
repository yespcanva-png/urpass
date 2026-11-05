/** Software access prices in the smallest currency unit, excluding tax. */
export const SOFTWARE_PRICES = {
  free: { inrMonthly: 0, inrAnnual: 0, gbpMonthly: 0, gbpAnnual: 0 },
  starter: { inrMonthly: 49_900, inrAnnual: 499_000, gbpMonthly: 1_500, gbpAnnual: 12_000 },
  pro: { inrMonthly: 99_900, inrAnnual: 999_000, gbpMonthly: 3_500, gbpAnnual: 30_000 },
  business: { inrMonthly: 249_900, inrAnnual: 2_499_000, gbpMonthly: 7_900, gbpAnnual: 69_900 },
} as const;

export type SoftwarePlanSlug = keyof typeof SOFTWARE_PRICES;
