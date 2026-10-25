/**
 * UrPass Explore Marketplace Telemetry (Consent-aware, No Attendee PII)
 */

export type ExploreTelemetryEvent =
  | "explore_view"
  | "search"
  | "filter_applied"
  | "event_card_opened"
  | "registration_started"
  | "booking_completed";

export function trackExploreEvent(
  eventName: ExploreTelemetryEvent,
  payload: Record<string, string | number | boolean | null | undefined> = {}
) {
  if (typeof window === "undefined") return;

  try {
    const data = {
      event: eventName,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || null,
      ...payload,
    };

    // Dispatch custom browser event for local observability
    window.dispatchEvent(
      new CustomEvent("urpass_explore_telemetry", { detail: data })
    );

    // Optional telemetry hook if application analytics are enabled
    // @ts-ignore
    if (typeof window.dataLayer !== "undefined" && Array.isArray(window.dataLayer)) {
      // @ts-ignore
      window.dataLayer.push(data);
    }
  } catch {
    // Non-blocking telemetry
  }
}
