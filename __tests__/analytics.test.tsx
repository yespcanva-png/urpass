import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), back: vi.fn(), push: vi.fn() }),
  usePathname: () => "/dashboard/analytics",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase server & client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    channel: () => ({
      on: () => ({
        subscribe: () => ({}),
      }),
    }),
    removeChannel: () => ({}),
  }),
}));

import { createClient } from "@/lib/supabase/server";
import { getAnalyticsData, type AnalyticsData } from "@/app/actions/analytics";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

const mockedCreateClient = vi.mocked(createClient);

describe("Analytics Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAnalyticsData Server Action", () => {
    it("returns empty fallback structure when user has no events", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } } }),
        },
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({ data: [] }),
                }),
              }),
            };
          }
          if (table === "organization_members") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({ data: [] }),
                }),
              }),
            };
          }
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockResolvedValue({ data: [] }),
            }),
          };
        }),
      };

      mockedCreateClient.mockResolvedValue(mockSupabase as never);

      const res = await getAnalyticsData();
      expect(res.totalEvents).toBe(0);
      expect(res.totalRegistrations).toBe(0);
      expect(res.checkedInCount).toBe(0);
      expect(res.attendanceRate).toBe(0);
      expect(res.eventsList).toEqual([]);
    });

    it("correctly aggregates attendees, check-ins, velocity, and gate metrics", async () => {
      const mockEvents = [
        {
          id: "evt-1",
          name: "Tech Summit 2026",
          venue: "Auditorium Hall",
          event_date: "2026-09-20",
          start_time: "09:00:00",
          end_time: "18:00:00",
          attendee_limit: 100,
          status: "active",
          created_at: "2026-09-01T00:00:00Z",
        },
      ];

      const mockAttendees = [
        {
          id: "att-1",
          event_id: "evt-1",
          name: "Alex Smith",
          email: "alex@example.com",
          pass_type: "participant",
          application_status: "approved",
          pass_status: "checked_in",
          created_at: "2026-09-02T00:00:00Z",
          ticket_type_id: null,
        },
        {
          id: "att-2",
          event_id: "evt-1",
          name: "Beth Jones",
          email: "beth@example.com",
          pass_type: "vip",
          application_status: "approved",
          pass_status: "checked_in",
          created_at: "2026-09-03T00:00:00Z",
          ticket_type_id: null,
        },
        {
          id: "att-3",
          event_id: "evt-1",
          name: "Charlie Brown",
          email: "charlie@example.com",
          pass_type: "participant",
          application_status: "approved",
          pass_status: "generated",
          created_at: "2026-09-04T00:00:00Z",
          ticket_type_id: null,
        },
        {
          id: "att-4",
          event_id: "evt-1",
          name: "David Miller",
          email: "david@example.com",
          pass_type: "participant",
          application_status: "pending",
          pass_status: "not_generated",
          created_at: "2026-09-05T00:00:00Z",
          ticket_type_id: null,
        },
      ];

      const mockCheckins = [
        {
          id: "chk-1",
          attendee_id: "att-1",
          event_id: "evt-1",
          checked_in_at: "2026-09-20T10:15:00Z",
          gate_id: "gate-1",
          check_in_method: "qr",
          gate: { name: "VIP North Gate" },
        },
        {
          id: "chk-2",
          attendee_id: "att-2",
          event_id: "evt-1",
          checked_in_at: "2026-09-20T10:25:00Z",
          gate_id: "gate-1",
          check_in_method: "qr",
          gate: { name: "VIP North Gate" },
        },
      ];

      const mockGates = [
        { id: "gate-1", event_id: "evt-1", name: "VIP North Gate", zone_id: null },
      ];

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } } }),
        },
        from: vi.fn((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({ data: mockEvents }),
                }),
              }),
            };
          }
          if (table === "organization_members") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({ data: [] }),
                }),
              }),
            };
          }
          if (table === "attendees") {
            return {
              select: vi.fn().mockReturnValue({
                in: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({ data: mockAttendees }),
                }),
              }),
            };
          }
          if (table === "check_ins") {
            return {
              select: vi.fn().mockReturnValue({
                in: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({ data: mockCheckins }),
                }),
              }),
            };
          }
          if (table === "scanner_gates") {
            return {
              select: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ data: mockGates }),
              }),
            };
          }
          if (table === "ticket_types") {
            return {
              select: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ data: [] }),
              }),
            };
          }
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockResolvedValue({ data: [] }),
            }),
          };
        }),
      };

      mockedCreateClient.mockResolvedValue(mockSupabase as never);

      const res = await getAnalyticsData("evt-1");
      expect(res.totalRegistrations).toBe(4);
      expect(res.approvedCount).toBe(3);
      expect(res.pendingCount).toBe(1);
      expect(res.passesGeneratedCount).toBe(3);
      expect(res.checkedInCount).toBe(2);
      expect(res.notArrivedCount).toBe(1);
      // attendanceRate: 2 / 3 = 66.7%
      expect(res.attendanceRate).toBe(66.7);
      expect(res.acceptanceRate).toBe(75);
      expect(res.passDeliveryRate).toBe(100);
      expect(res.noShowRate).toBe(33.3);
      expect(res.peakVelocity).toBe(2);
      expect(res.gateBreakdown.length).toBeGreaterThan(0);
      expect(res.gateBreakdown[0].name).toBe("VIP North Gate");
      expect(res.methodBreakdown.qr).toBe(2);
    });
  });

  describe("AnalyticsDashboard Component", () => {
    const sampleData: AnalyticsData = {
      eventId: "evt-1",
      eventName: "Demo Conference",
      venue: "Convention Center",
      eventDate: "2026-09-20",
      attendeeLimit: 500,
      status: "active",
      eventsList: [
        {
          id: "evt-1",
          name: "Demo Conference",
          venue: "Convention Center",
          event_date: "2026-09-20",
          start_time: "09:00:00",
          end_time: "18:00:00",
          attendee_limit: 500,
          status: "active",
        },
      ],
      totalEvents: 1,
      totalRegistrations: 250,
      approvedCount: 200,
      pendingCount: 40,
      rejectedCount: 10,
      passesGeneratedCount: 190,
      checkedInCount: 160,
      notArrivedCount: 40,
      attendanceRate: 80,
      acceptanceRate: 80,
      passDeliveryRate: 95,
      noShowRate: 20,
      peakVelocity: 45,
      peakVelocityTime: "10:00 AM – 11:00 AM",
      avgScansPerHour: 32,
      totalRevenue: 24000,
      hourlyTimeline: [
        { hour: "10:00 AM – 11:00 AM", label: "10 AM", scans: 45, pct: 28, cumulative: 45 },
        { hour: "11:00 AM – 12:00 PM", label: "11 AM", scans: 30, pct: 19, cumulative: 75 },
      ],
      gateBreakdown: [
        { gateId: "g1", name: "Main Entrance", scans: 120, pct: 75 },
        { gateId: "g2", name: "VIP Lane", scans: 40, pct: 25 },
      ],
      methodBreakdown: { qr: 155, manual: 5, search: 0 },
      passTypeBreakdown: [
        { type: "participant", label: "Participant", total: 180, checkedIn: 130, pct: 72, revenue: 0 },
        { type: "vip", label: "VIP Pass", total: 70, checkedIn: 30, pct: 43, revenue: 24000 },
      ],
      recentScans: [
        {
          id: "scan-1",
          attendeeId: "att-1",
          name: "Rohan Sharma",
          email: "rohan@test.com",
          passType: "VIP Pass",
          gateName: "VIP Lane",
          method: "qr",
          checkedInAt: new Date().toISOString(),
        },
      ],
      eventComparison: [],
    };

    it("renders core KPI cards with correct stats", () => {
      render(<AnalyticsDashboard initialData={sampleData} />);

      expect(screen.getByText("Demo Conference")).toBeTruthy();
      expect(screen.getByText("250")).toBeTruthy(); // total registrations
      expect(screen.getByText("190")).toBeTruthy(); // passes issued
      expect(screen.getAllByText("160").length).toBeGreaterThan(0); // checked in
      expect(screen.getByText("80% turnout")).toBeTruthy();
      expect(screen.getByText("45")).toBeTruthy(); // peak velocity
    });

    it("renders Gate Velocity & Rush Hour curve section", () => {
      render(<AnalyticsDashboard initialData={sampleData} />);

      expect(screen.getByText(/Gate Velocity & Rush Hour Curve/i)).toBeTruthy();
      expect(screen.getByText("Main Entrance")).toBeTruthy();
      expect(screen.getAllByText("VIP Lane").length).toBeGreaterThan(0);
    });

    it("renders Attendee Conversion Funnel", () => {
      render(<AnalyticsDashboard initialData={sampleData} />);

      expect(screen.getByText(/Attendee Conversion Funnel/i)).toBeTruthy();
      expect(screen.getByText(/1. Applications Received/i)).toBeTruthy();
      expect(screen.getByText(/4. Arrived at Venue/i)).toBeTruthy();
    });

    it("renders Recent Scans activity feed", () => {
      render(<AnalyticsDashboard initialData={sampleData} />);

      expect(screen.getByText(/Real-Time Scan Activity Stream/i)).toBeTruthy();
      expect(screen.getByText("Rohan Sharma")).toBeTruthy();
      expect(screen.getByText("rohan@test.com")).toBeTruthy();
    });
  });
});
