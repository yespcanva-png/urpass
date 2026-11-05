/** Prices exclude tax. These capacities are written to payment order metadata. */
export const EVENT_PASSES = {
  event: { pricePaise: 29_900, pricePence: 500, registrations: 250, name: "Event Pass" },
  event_plus: { pricePaise: 59_900, pricePence: 1_000, registrations: 1_000, name: "Event Plus Pass" },
  event_pro: { pricePaise: 99_900, pricePence: 1_900, registrations: 2_500, name: "Event Pro Pass" },
} as const;

export type EventPassSlug = keyof typeof EVENT_PASSES;

export function isEventPassSlug(value: string): value is EventPassSlug {
  return Object.prototype.hasOwnProperty.call(EVENT_PASSES, value);
}

/**
 * Event-scoped features unlocked by a Single Event Pass (event, event_plus, event_pro).
 * These features are granted strictly to the specific event with the attached pass.
 * Account-level features (e.g. cross_event_analytics, custom_domain, creating multiple concurrent events)
 * remain strictly governed by the user's base subscription (e.g. Free).
 */
export const EVENT_PASS_PRO_FEATURES = [
  "remove_branding",
  "custom_pass_design",
  "csv_import",
  "csv_export",
  "custom_fields_unlimited",
  "standard_checkin",
  "paid_events",
  "advanced_analytics",
  "email_notifications_full",
  "standard_analytics",
  "team_permissions_basic",
] as const;

export type EventPassProFeature = (typeof EVENT_PASS_PRO_FEATURES)[number];

export function isEventPassProFeature(feature: string): boolean {
  return (EVENT_PASS_PRO_FEATURES as readonly string[]).includes(feature);
}
