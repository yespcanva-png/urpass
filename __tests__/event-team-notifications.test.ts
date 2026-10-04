import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock("resend", () => {
  return {
    Resend: class {
      emails = {
        send: mockSend,
      };
    },
  };
});

import { notifyEventTeamNewApplication } from "@/lib/email";
import { notifyEventTeamOnApplication } from "@/lib/notifications/event-team-notification";

describe("Event Team Notifications on Attendee Application", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "re_test_key_12345";
    mockSend.mockResolvedValue({ data: { id: "msg_team_notif_123" }, error: null });
  });

  describe("notifyEventTeamNewApplication (Email Rendering & Dispatch)", () => {
    it("renders and sends approved registration email with attendee & event details", async () => {
      const result = await notifyEventTeamNewApplication({
        teamEmails: ["organizer@college.edu", "lead@techsummit.in"],
        eventName: "HackCon 2026",
        eventDate: "2026-11-20",
        venue: "Convention Center Hall A",
        attendeeName: "Priya Sundaram",
        attendeeEmail: "priya@example.com",
        attendeePhone: "+919876543210",
        passType: "vip",
        ticketTierName: "VIP Pass",
        ticketPricePaise: 49900,
        status: "approved",
        customResponses: {
          college_name: "IIT Madras",
          tshirt_size: "M",
        },
        customFields: [
          { id: "college_name", label: "College / University" },
          { id: "tshirt_size", label: "T-Shirt Size" },
        ],
        eventId: "evt-12345",
      });

      expect(result).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(1);

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.to).toEqual(["organizer@college.edu", "lead@techsummit.in"]);
      expect(callArgs.replyTo).toBe("priya@example.com");
      expect(callArgs.subject).toContain("Priya Sundaram applied for HackCon 2026");
      expect(callArgs.subject).toContain("APPROVED & PASS ISSUED");

      // Check HTML content
      expect(callArgs.html).toContain("Priya Sundaram");
      expect(callArgs.html).toContain("priya@example.com");
      expect(callArgs.html).toContain("+919876543210");
      expect(callArgs.html).toContain("HackCon 2026");
      expect(callArgs.html).toContain("Convention Center Hall A");
      expect(callArgs.html).toContain("VIP Pass");
      expect(callArgs.html).toContain("₹499.00");
      expect(callArgs.html).toContain("College / University");
      expect(callArgs.html).toContain("IIT Madras");
      expect(callArgs.html).toContain("T-Shirt Size");
      expect(callArgs.html).toContain("M");
      expect(callArgs.html).toContain("/event/evt-12345/attendees");
    });

    it("renders and sends pending review alert with action badge", async () => {
      const result = await notifyEventTeamNewApplication({
        teamEmails: "manager@summit.org",
        eventName: "AI Summit 2026",
        eventDate: "2026-12-05",
        venue: "Virtual Stage",
        attendeeName: "Rahul Sharma",
        attendeeEmail: "rahul@startup.io",
        passType: "speaker",
        status: "pending",
        eventId: "evt-9999",
      });

      expect(result).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(1);

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.to).toBe("manager@summit.org");
      expect(callArgs.subject).toContain("ACTION REQUIRED: PENDING REVIEW");
      expect(callArgs.html).toContain("New Application Awaiting Review");
      expect(callArgs.html).toContain("Rahul Sharma");
      expect(callArgs.html).toContain("Free / Complimentary");
    });

    it("renders waitlist notification when event is at capacity", async () => {
      const result = await notifyEventTeamNewApplication({
        teamEmails: ["admin@expo.in"],
        eventName: "Design Workshop",
        eventDate: "2026-10-15",
        venue: "Studio Lab 4",
        attendeeName: "Ananya Roy",
        attendeeEmail: "ananya@design.co",
        status: "waitlisted",
        eventId: "evt-777",
      });

      expect(result).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(1);

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.subject).toContain("WAITLISTED (CAPACITY REACHED)");
      expect(callArgs.html).toContain("New Waitlist Entry");
      expect(callArgs.html).toContain("Ananya Roy");
    });
  });

  describe("notifyEventTeamOnApplication Service Integration", () => {
    it("dispatches notifications to organizer and team members cleanly", async () => {
      const outcome = await notifyEventTeamOnApplication({
        eventId: "3c84be2e-4b2a-4819-a9a3-5c5f49e19d77",
        eventName: "National DevFest 2026",
        eventDate: "2026-11-15",
        venue: "Bengaluru Tech Park",
        organizerId: "usr-org-111",
        organizationId: "org-222",
        attendeeName: "Kavitha R",
        attendeeEmail: "kavitha@example.com",
        attendeePhone: "+919123456789",
        passType: "participant",
        ticketTierName: "Standard Pass",
        ticketPricePaise: 0,
        status: "approved",
      });

      expect(outcome.success).toBe(true);
      expect(outcome.recipientCount).toBeGreaterThan(0);
      expect(mockSend).toHaveBeenCalledTimes(1);
      const emailCall = mockSend.mock.calls[0][0];
      expect(emailCall.subject).toContain("Kavitha R applied for National DevFest 2026");
    });
  });
});
