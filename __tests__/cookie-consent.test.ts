import { describe, it, expect } from "vitest";
import { isPublicEventRoute } from "@/components/ui/CookieConsentBanner";

describe("CookieConsentBanner route separation", () => {
  describe("isPublicEventRoute", () => {
    it("identifies public event and registration paths to suppress cookie popup", () => {
      // Direct SEO public event routes
      expect(isPublicEventRoute("/events/pilani-grand-garba-night-2026")).toBe(true);
      expect(isPublicEventRoute("/events/tech-summit")).toBe(true);
      expect(isPublicEventRoute("/events")).toBe(true);

      // Public apply & booking routes
      expect(isPublicEventRoute("/apply/kaqq-dwgi")).toBe(true);
      expect(isPublicEventRoute("/apply/550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isPublicEventRoute("/apply")).toBe(true);

      // Public event microsite, sessions, & agenda
      expect(isPublicEventRoute("/e/pilani-grand-garba-night-2026")).toBe(true);
      expect(isPublicEventRoute("/e/tech-conf/session/keynote-1")).toBe(true);
      expect(isPublicEventRoute("/e/tech-conf/my-agenda")).toBe(true);

      // Public ticket pass views
      expect(isPublicEventRoute("/p/pass_abc123")).toBe(true);

      // Public gate scanner & ticket verification
      expect(isPublicEventRoute("/verify")).toBe(true);
      expect(isPublicEventRoute("/verify?code=xyz")).toBe(true);

      // Public attendee feedback
      expect(isPublicEventRoute("/feedback/kaqq-dwgi")).toBe(true);
    });

    it("keeps cookie consent active on platform, dashboard, auth, and marketing pages", () => {
      // Platform dashboard & organizer settings
      expect(isPublicEventRoute("/dashboard")).toBe(false);
      expect(isPublicEventRoute("/dashboard/events")).toBe(false);
      expect(isPublicEventRoute("/event/123/settings")).toBe(false);
      expect(isPublicEventRoute("/event/123/attendees")).toBe(false);
      expect(isPublicEventRoute("/create-event")).toBe(false);
      expect(isPublicEventRoute("/billing")).toBe(false);
      expect(isPublicEventRoute("/onboarding")).toBe(false);

      // Auth flows
      expect(isPublicEventRoute("/login")).toBe(false);
      expect(isPublicEventRoute("/forgot-password")).toBe(false);

      // Marketing & landing pages
      expect(isPublicEventRoute("/")).toBe(false);
      expect(isPublicEventRoute("/pricing")).toBe(false);
      expect(isPublicEventRoute("/about")).toBe(false);
      expect(isPublicEventRoute("/uk")).toBe(false);
      expect(isPublicEventRoute("/uk/qr-event-check-in-software")).toBe(false);

      // Null / empty safety
      expect(isPublicEventRoute(null)).toBe(false);
      expect(isPublicEventRoute(undefined)).toBe(false);
      expect(isPublicEventRoute("")).toBe(false);
    });
  });
});
