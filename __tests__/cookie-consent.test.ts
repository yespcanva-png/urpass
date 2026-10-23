import { describe, it, expect } from "vitest";
import { isLandingPageRoute, isPublicEventRoute } from "@/components/ui/CookieConsentBanner";

describe("CookieConsentBanner route restriction", () => {
  describe("isLandingPageRoute", () => {
    it("identifies landing page routes to show cookie consent banner", () => {
      expect(isLandingPageRoute("/")).toBe(true);
      expect(isLandingPageRoute("")).toBe(true);
      expect(isLandingPageRoute(null)).toBe(true);
      expect(isLandingPageRoute(undefined)).toBe(true);
      expect(isLandingPageRoute("/?ref=google")).toBe(true);
      expect(isLandingPageRoute("/#features")).toBe(true);

      // Regional landing pages
      expect(isLandingPageRoute("/in")).toBe(true);
      expect(isLandingPageRoute("/in/")).toBe(true);
      expect(isLandingPageRoute("/uk")).toBe(true);
      expect(isLandingPageRoute("/uk/")).toBe(true);
    });

    it("removes cookie consent on all other pages", () => {
      // Platform dashboard & organizer settings
      expect(isLandingPageRoute("/dashboard")).toBe(false);
      expect(isLandingPageRoute("/dashboard/events")).toBe(false);
      expect(isLandingPageRoute("/event/123/settings")).toBe(false);
      expect(isLandingPageRoute("/event/123/attendees")).toBe(false);
      expect(isLandingPageRoute("/event/123/communications")).toBe(false);
      expect(isLandingPageRoute("/create-event")).toBe(false);
      expect(isLandingPageRoute("/billing")).toBe(false);
      expect(isLandingPageRoute("/onboarding")).toBe(false);

      // Auth flows
      expect(isLandingPageRoute("/login")).toBe(false);
      expect(isLandingPageRoute("/signup")).toBe(false);
      expect(isLandingPageRoute("/forgot-password")).toBe(false);

      // Other marketing and info pages
      expect(isLandingPageRoute("/pricing")).toBe(false);
      expect(isLandingPageRoute("/about")).toBe(false);
      expect(isLandingPageRoute("/features")).toBe(false);
      expect(isLandingPageRoute("/contact")).toBe(false);
      expect(isLandingPageRoute("/careers")).toBe(false);
      expect(isLandingPageRoute("/privacy")).toBe(false);
      expect(isLandingPageRoute("/terms")).toBe(false);

      // Public event, booking, and pass views
      expect(isLandingPageRoute("/events/tech-summit")).toBe(false);
      expect(isLandingPageRoute("/events")).toBe(false);
      expect(isLandingPageRoute("/apply/kaqq-dwgi")).toBe(false);
      expect(isLandingPageRoute("/pass/pass_abc123")).toBe(false);
      expect(isLandingPageRoute("/claim-ticket/tok-123")).toBe(false);
      expect(isLandingPageRoute("/scan")).toBe(false);
      expect(isLandingPageRoute("/verify")).toBe(false);
    });
  });

  describe("isPublicEventRoute (backward-compatibility alias)", () => {
    it("returns true (suppressed) for all non-landing routes", () => {
      expect(isPublicEventRoute("/dashboard")).toBe(true);
      expect(isPublicEventRoute("/events/tech-summit")).toBe(true);
      expect(isPublicEventRoute("/login")).toBe(true);
      expect(isPublicEventRoute("/pricing")).toBe(true);
      expect(isPublicEventRoute("/")).toBe(false);
    });
  });
});
