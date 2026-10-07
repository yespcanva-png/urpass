import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildWelcomeEmail,
  buildSubscriptionEmail,
  buildNewsletterWelcomeEmail,
  EMAIL_TEMPLATES_CATALOG,
} from "@/lib/email-engine/templates";
import {
  sendUserWelcomeEmail,
  sendUserSubscriptionActivatedEmail,
  sendNewsletterWelcomeEmail,
  notifyOwnerNewsletterSubscriber,
  sendPassEmail,
  notifyEventTeamNewApplication,
} from "@/lib/email";

// Mock Resend
vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: "mock-email-id-123" }, error: null }),
      },
    })),
  };
});

describe("Email Automation Systems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. User Welcome Email Template", () => {
    it("renders welcome email with organizer onboarding steps", () => {
      const email = buildWelcomeEmail({ name: "Srinithin" });
      expect(email.subject).toContain("Welcome to URPASS");
      expect(email.html).toContain("Hi Srinithin,");
      expect(email.html).toContain("Getting Started in 3 Steps");
      expect(email.html).toContain("Create your event");
      expect(email.html).toContain("Share registration link");
      expect(email.html).toContain("Scan at the entrance");
      expect(email.html).toContain("Create Your First Event");
    });

    it("renders welcome email with generic greeting if name is null", () => {
      const email = buildWelcomeEmail({});
      expect(email.html).toContain("Hello,");
      expect(email.html).toContain("Welcome to UrPass");
    });
  });

  describe("2. Subscription Activated Email Template", () => {
    it("renders 30-day free trial activation email", () => {
      const trialEmail = buildSubscriptionEmail({
        name: "Isha",
        planName: "Pro Workspace",
        amountFormatted: "₹2,499/mo",
        billingCycle: "monthly",
        renewalDate: "November 15, 2026",
        isTrial: true,
        trialDays: 30,
      });

      expect(trialEmail.subject).toContain("Free Trial Activated: Pro Workspace");
      expect(trialEmail.html).toContain("30-Day Free Trial Active");
      expect(trialEmail.html).toContain("Price After Trial:");
      expect(trialEmail.html).toContain("₹2,499/mo");
      expect(trialEmail.html).toContain("Trial Ends On:");
      expect(trialEmail.html).toContain("November 15, 2026");
    });

    it("renders paid active subscription email", () => {
      const paidEmail = buildSubscriptionEmail({
        name: "Srinithin",
        planName: "Founder Lifetime",
        amountFormatted: "₹4,999",
        billingCycle: "lifetime",
        renewalDate: "Lifetime Access",
        isTrial: false,
      });

      expect(paidEmail.subject).toContain("subscription is active");
      expect(paidEmail.html).toContain("Active Subscription");
      expect(paidEmail.html).toContain("Founder Lifetime");
      expect(paidEmail.html).toContain("₹4,999");
      expect(paidEmail.html).toContain("Lifetime Access");
    });
  });

  describe("3. Newsletter Welcome & Subscription Email Template", () => {
    it("renders newsletter welcome email with high-signal value props", () => {
      const newsletterEmail = buildNewsletterWelcomeEmail({
        name: "Alex",
        email: "alex@example.com",
      });

      expect(newsletterEmail.subject).toBe("Welcome to the UrPass Newsletter");
      expect(newsletterEmail.html).toContain("Hi Alex,");
      expect(newsletterEmail.html).toContain("You're on the list");
      expect(newsletterEmail.html).toContain("Product Innovations & Feature Releases");
      expect(newsletterEmail.html).toContain("Event Operations Playbooks");
      expect(newsletterEmail.html).toContain("Exclusive Community Discounts & Templates");
      expect(newsletterEmail.html).toContain("Explore UrPass Platform");
    });

    it("catalog contains all template definitions", () => {
      expect(EMAIL_TEMPLATES_CATALOG.welcome).toBeDefined();
      expect(EMAIL_TEMPLATES_CATALOG.subscription).toBeDefined();
      expect(EMAIL_TEMPLATES_CATALOG.activation).toBeDefined();
      expect(EMAIL_TEMPLATES_CATALOG.whats_new).toBeDefined();
      expect(EMAIL_TEMPLATES_CATALOG.incomplete_event).toBeDefined();
      expect(EMAIL_TEMPLATES_CATALOG.payment_failed).toBeDefined();
      expect(EMAIL_TEMPLATES_CATALOG.offer).toBeDefined();
    });
  });

  describe("4. Dual Event Registration Email Pipeline", () => {
    it("formats attendee pass email with QR credentials", async () => {
      await expect(
        sendPassEmail({
          to: "attendee@example.com",
          attendeeName: "Rahul Sharma",
          eventName: "DevFest Chennai 2026",
          eventDate: "2026-11-20T10:00:00.000Z",
          venue: "IIT Madras Research Park",
          passToken: "pass_tok_abc123xyz789",
          passType: "vip",
        })
      ).resolves.not.toThrow();
    });

    it("formats organizer team alert email with custom form responses and dashboard link", async () => {
      const result = await notifyEventTeamNewApplication({
        teamEmails: ["organizer@yespstudio.com", "lead@yespstudio.com"],
        organizerName: "Srinithin",
        eventName: "DevFest Chennai 2026",
        eventDate: "2026-11-20T10:00:00.000Z",
        venue: "IIT Madras Research Park",
        attendeeName: "Rahul Sharma",
        attendeeEmail: "rahul@example.com",
        attendeePhone: "+91 98765 43210",
        passType: "vip",
        ticketTierName: "VIP All-Access Pass",
        ticketPricePaise: 99900,
        status: "approved",
        customResponses: {
          tshirt_size: "XL",
          dietary_preference: "Vegetarian",
          github_profile: "https://github.com/rahul",
        },
        customFields: [
          { id: "tshirt_size", label: "T-Shirt Size" },
          { id: "dietary_preference", label: "Dietary Preference" },
          { id: "github_profile", label: "GitHub Profile URL" },
        ],
        eventId: "event-devfest-2026",
      });

      expect(result).toBe(true);
    });

    it("handles pending review organizer alerts", async () => {
      const result = await notifyEventTeamNewApplication({
        teamEmails: "organizer@yespstudio.com",
        eventName: "Exclusive Hackathon 2026",
        eventDate: "2026-12-01T09:00:00.000Z",
        venue: "Auditorium Hall A",
        attendeeName: "Priya Patel",
        attendeeEmail: "priya@example.com",
        status: "pending",
        eventId: "event-hack-2026",
      });

      expect(result).toBe(true);
    });
  });

  describe("5. Email Dispatch Helpers", () => {
    it("dispatches user welcome email", async () => {
      await expect(
        sendUserWelcomeEmail({
          to: "user@example.com",
          name: "Srinithin",
        })
      ).resolves.not.toThrow();
    });

    it("dispatches user subscription activated email", async () => {
      await expect(
        sendUserSubscriptionActivatedEmail({
          to: "user@example.com",
          name: "Isha",
          planName: "Pro Workspace",
          amountFormatted: "₹2,499",
          billingCycle: "monthly",
          renewalDate: "November 15, 2026",
          isTrial: true,
          trialDays: 30,
        })
      ).resolves.not.toThrow();
    });

    it("dispatches newsletter welcome email", async () => {
      await expect(
        sendNewsletterWelcomeEmail({
          to: "subscriber@example.com",
          name: "Subscriber",
        })
      ).resolves.not.toThrow();
    });

    it("dispatches owner newsletter alert", async () => {
      await expect(
        notifyOwnerNewsletterSubscriber({
          email: "subscriber@example.com",
          name: "Subscriber",
        })
      ).resolves.not.toThrow();
    });
  });
});
