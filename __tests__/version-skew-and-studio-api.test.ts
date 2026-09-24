import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST as saveStudioPOST } from "@/app/api/studio/save/route";
import { POST as testEmailPOST } from "@/app/api/studio/test-email/route";
import { GET as notificationsGET } from "@/app/api/notifications/organizer/route";

// Mock Supabase Server Client
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

// Mock Plan check
vi.mock("@/lib/plan", () => ({
  getUserPlan: vi.fn(() => ({
    canUse: (feature: string) => feature === "custom_pass_design",
  })),
}));

// Mock Next Cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Version Skew & Studio REST Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/studio/save", () => {
    it("returns 401 if unauthenticated", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } });

      const req = new NextRequest("http://localhost:3000/api/studio/save", {
        method: "POST",
        body: JSON.stringify({
          eventId: "evt-123",
          design: { primaryColor: "#635BFF" },
        }),
      });

      const res = await saveStudioPOST(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Unauthorized");
    });

    it("saves custom ticket design for an event successfully", async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: "user-123" } },
      });

      // Mock event query and update
      mockFrom.mockImplementation((table: string) => {
        if (table === "events") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn((col: string, val: string) => {
              if (col === "id" && val === "evt-123") {
                return {
                  single: vi.fn().mockResolvedValue({
                    data: {
                      id: "evt-123",
                      organizer_id: "user-123",
                      organization_id: null,
                    },
                    error: null,
                  }),
                };
              }
              // For update
              return Promise.resolve({ error: null });
            }),
            update: vi.fn().mockReturnThis(),
          };
        }
        return {};
      });

      const req = new NextRequest("http://localhost:3000/api/studio/save", {
        method: "POST",
        body: JSON.stringify({
          eventId: "evt-123",
          design: {
            primaryColor: "#4F46E5",
            template: "dark",
            shape: "rounded",
          },
        }),
      });

      const res = await saveStudioPOST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.config.primaryColor).toBe("#4F46E5");
      expect(json.config.template).toBe("dark");
    });
  });

  describe("POST /api/studio/test-email", () => {
    it("returns 400 for invalid email", async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: "user-123" } },
      });

      const req = new NextRequest("http://localhost:3000/api/studio/test-email", {
        method: "POST",
        body: JSON.stringify({
          toEmail: "invalid-email",
          eventName: "Sample Fest",
        }),
      });

      const res = await testEmailPOST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("valid email");
    });

    it("simulates email delivery when Resend key is not configured", async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: "user-123" } },
      });

      const req = new NextRequest("http://localhost:3000/api/studio/test-email", {
        method: "POST",
        body: JSON.stringify({
          toEmail: "organizer@example.com",
          eventName: "TECHFEST 2026",
          config: { primaryColor: "#635BFF" },
        }),
      });

      const res = await testEmailPOST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });

  describe("GET /api/notifications/organizer", () => {
    it("returns empty notifications when not logged in", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } });

      const req = new NextRequest("http://localhost:3000/api/notifications/organizer");
      const res = await notificationsGET(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.notifications).toEqual([]);
      expect(json.unreadCount).toBe(0);
    });

    it("returns organizer notifications list and unread count", async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: "user-123" } },
      });

      mockFrom.mockReturnValue({
        select: vi.fn((col: string, options?: { count?: string; head?: boolean }) => {
          if (options?.head) {
            return {
              eq: vi.fn().mockReturnThis(),
              then: (fn: (val: unknown) => unknown) =>
                fn({ count: 3, error: null }),
            };
          }
          return {
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({
              data: [
                {
                  id: "notif-1",
                  title: "New Registration",
                  message: "Haarishmitha registered",
                  is_read: false,
                },
              ],
              error: null,
            }),
          };
        }),
      });

      const req = new NextRequest("http://localhost:3000/api/notifications/organizer?limit=5");
      const res = await notificationsGET(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.notifications).toHaveLength(1);
      expect(json.notifications[0].title).toBe("New Registration");
    });
  });
});
