import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildWhatsAppPassUrl } from "@/components/pass/WhatsAppShareButton";

// Mock server modules
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/email", () => ({
  sendEventReminderEmail: vi.fn().mockResolvedValue(undefined),
  sendPostEventThankYouEmail: vi.fn().mockResolvedValue(undefined),
}));

describe("buildWhatsAppPassUrl", () => {
  it("generates valid WhatsApp share url without phone number", () => {
    const url = buildWhatsAppPassUrl({
      eventName: "TechSummit 2026",
      eventDate: "Saturday, 25 October 2026",
      venue: "Bengaluru Hall A",
      passToken: "urp_pass_xyz123",
      attendeeName: "Rahul",
    });

    expect(url).toContain("https://wa.me/?text=");
    expect(decodeURIComponent(url)).toContain("Rahul");
    expect(decodeURIComponent(url)).toContain("TechSummit 2026");
    expect(decodeURIComponent(url)).toContain("urp_pass_xyz123");
  });

  it("normalizes 10-digit Indian phone number with 91 prefix", () => {
    const url = buildWhatsAppPassUrl({
      eventName: "Campus Hackathon",
      eventDate: "Tomorrow",
      venue: "Main Campus",
      passToken: "urp_pass_abc456",
      phone: "9876543210",
    });

    expect(url).toContain("https://wa.me/919876543210?text=");
  });

  it("handles numbers already with country code and formatting", () => {
    const url = buildWhatsAppPassUrl({
      eventName: "Design Meetup",
      eventDate: "Sunday",
      venue: "Online",
      passToken: "urp_pass_des789",
      phone: "+91 91234 56789",
    });

    expect(url).toContain("https://wa.me/919123456789?text=");
  });
});

describe("In-App Notifications and Engagement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports notification and engagement action functions", async () => {
    const engagement = await import("@/app/actions/event-engagement");
    expect(typeof engagement.broadcastEventReminders).toBe("function");
    expect(typeof engagement.broadcastPostEventThankYou).toBe("function");

    const notifications = await import("@/app/actions/in-app-notifications");
    expect(typeof notifications.getOrganizerNotifications).toBe("function");
    expect(typeof notifications.markNotificationAsRead).toBe("function");
    expect(typeof notifications.markAllNotificationsAsRead).toBe("function");
  });
});
