import { describe, it, expect } from "vitest";
import { eventSchema } from "@/lib/validations/event";

describe("Event Type Editing and Validation", () => {
  const baseEvent = {
    name: "Tech Innovation Conference 2026",
    description: "Annual keynote and networking summit",
    event_date: "2026-11-20",
    start_time: "09:00",
    end_time: "17:00",
    attendee_limit: 500,
    status: "active" as const,
    application_enabled: true,
    auto_approve: false,
    is_paid_event: false,
    ticket_price: 0,
    currency: "INR" as const,
    timezone: "Asia/Kolkata",
  };

  it("should validate a physical event with venue", () => {
    const parsed = eventSchema.safeParse({
      ...baseEvent,
      event_type: "physical",
      venue: "Grand Ballroom, Bangalore",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.event_type).toBe("physical");
      expect(parsed.data.venue).toBe("Grand Ballroom, Bangalore");
    }
  });

  it("should reject physical event if venue is empty", () => {
    const parsed = eventSchema.safeParse({
      ...baseEvent,
      event_type: "physical",
      venue: "",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const venueIssue = parsed.error.issues.find((i) => i.path.includes("venue"));
      expect(venueIssue).toBeDefined();
    }
  });

  it("should validate an online event without physical venue", () => {
    const parsed = eventSchema.safeParse({
      ...baseEvent,
      event_type: "online",
      venue: "Online",
      meeting_platform: "google_meet",
      meeting_url: "https://meet.google.com/abc-defg-hij",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.event_type).toBe("online");
      expect(parsed.data.meeting_platform).toBe("google_meet");
      expect(parsed.data.meeting_url).toBe("https://meet.google.com/abc-defg-hij");
    }
  });

  it("should allow editing an active event to online without blocking on empty meeting url", () => {
    const parsed = eventSchema.safeParse({
      ...baseEvent,
      event_type: "online",
      venue: "Online",
      meeting_platform: "zoom",
      meeting_url: "",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.event_type).toBe("online");
      expect(parsed.data.meeting_url).toBeNull();
    }
  });

  it("should validate a hybrid event with physical venue and meeting URL", () => {
    const parsed = eventSchema.safeParse({
      ...baseEvent,
      event_type: "hybrid",
      venue: "Convention Center & Zoom",
      meeting_platform: "zoom",
      meeting_url: "https://zoom.us/j/987654321",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.event_type).toBe("hybrid");
      expect(parsed.data.venue).toBe("Convention Center & Zoom");
      expect(parsed.data.meeting_platform).toBe("zoom");
      expect(parsed.data.meeting_url).toBe("https://zoom.us/j/987654321");
    }
  });

  it("should reject hybrid event if physical venue is missing", () => {
    const parsed = eventSchema.safeParse({
      ...baseEvent,
      event_type: "hybrid",
      venue: "",
      meeting_platform: "teams",
      meeting_url: "https://teams.microsoft.com/l/meetup-join/123",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const venueIssue = parsed.error.issues.find((i) => i.path.includes("venue"));
      expect(venueIssue).toBeDefined();
    }
  });
});
