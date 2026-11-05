/** Prices exclude tax. These capacities are written to payment order metadata. */
export const EVENT_PASSES = {
  event: { pricePaise: 29_900, registrations: 250, name: "Event Pass" },
  event_plus: { pricePaise: 59_900, registrations: 1_000, name: "Event Plus Pass" },
  event_pro: { pricePaise: 99_900, registrations: 2_500, name: "Event Pro Pass" },
} as const;

export type EventPassSlug = keyof typeof EVENT_PASSES;

export function isEventPassSlug(value: string): value is EventPassSlug {
  return Object.prototype.hasOwnProperty.call(EVENT_PASSES, value);
}
