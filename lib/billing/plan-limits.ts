/** Public numerical limits. The same values feed enforcement and plan disclosure. */
export const SELF_SERVICE_PLAN_LIMITS = {
  free: { eventsPerMonth: 1, registrationsPerMonth: 50, organizerSeats: 1, customFields: 3 },
  starter: { eventsPerMonth: 3, registrationsPerMonth: 1_000, organizerSeats: 2, customFields: 10 },
  pro: { eventsPerMonth: 10, registrationsPerMonth: 5_000, organizerSeats: 5, customFields: 999_999 },
  business: { eventsPerMonth: 999_999, registrationsPerMonth: 15_000, organizerSeats: 15, customFields: 999_999 },
} as const;

export const PLAN_LIMITS = SELF_SERVICE_PLAN_LIMITS;

export const UNLIMITED_PLAN_LIMIT = 999_999;

export function formatPlanLimit(value: number): string {
  return value >= UNLIMITED_PLAN_LIMIT ? "Unlimited" : value.toLocaleString("en-IN");
}
