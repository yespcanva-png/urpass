import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Next.js modules
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { exportAttendeeCheckinReportCSV } from "@/app/actions/manual-checkin";
import { getAttendeeScanMeta, type Attendee, type Checkin } from "@/app/event/[eventId]/checkins/CheckinDashboard";

const mockedCreateClient = vi.mocked(createClient);

describe("Gate Check-in Counts, Timestamps & Attendee Report", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAttendeeScanMeta", () => {
    it("correctly determines single check-in count and timestamps from custom_responses", () => {
      const attendee: Attendee = {
        id: "att-1",
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "+919876543210",
        pass_type: "participant",
        pass_status: "checked_in",
        application_status: "approved",
        custom_responses: {
          scan_count: 1,
          first_scanned_at: "2026-10-23T10:15:00.000Z",
          last_scanned_at: "2026-10-23T10:15:00.000Z",
          scan_history: [
            {
              scan_number: 1,
              scanned_at: "2026-10-23T10:15:00.000Z",
              gate_name: "Gate 1 - North Entrance",
              method: "qr",
            },
          ],
        },
      };

      const meta = getAttendeeScanMeta(attendee, []);
      expect(meta.isCheckedIn).toBe(true);
      expect(meta.scanCount).toBe(1);
      expect(meta.firstScannedAt).toBe("2026-10-23T10:15:00.000Z");
      expect(meta.lastScannedAt).toBe("2026-10-23T10:15:00.000Z");
      expect(meta.firstGate).toBe("Gate 1 - North Entrance");
      expect(meta.latestGate).toBe("Gate 1 - North Entrance");
      expect(meta.history).toHaveLength(1);
    });

    it("correctly calculates multiple check-in counts and timestamps when pass is scanned multiple times", () => {
      const attendee: Attendee = {
        id: "att-2",
        name: "Priya Nair",
        email: "priya@example.com",
        phone: "+919876543211",
        pass_type: "vip",
        pass_status: "checked_in",
        application_status: "approved",
        custom_responses: {
          scan_count: 3,
          first_scanned_at: "2026-10-23T09:30:00.000Z",
          last_scanned_at: "2026-10-23T14:45:00.000Z",
          scan_history: [
            {
              scan_number: 1,
              scanned_at: "2026-10-23T09:30:00.000Z",
              gate_name: "VIP Gate",
              method: "qr",
            },
            {
              scan_number: 2,
              scanned_at: "2026-10-23T12:00:00.000Z",
              gate_name: "Dining Gate",
              method: "qr",
            },
            {
              scan_number: 3,
              scanned_at: "2026-10-23T14:45:00.000Z",
              gate_name: "Auditorium A",
              method: "qr",
            },
          ],
        },
      };

      const meta = getAttendeeScanMeta(attendee, []);
      expect(meta.isCheckedIn).toBe(true);
      expect(meta.scanCount).toBe(3);
      expect(meta.firstScannedAt).toBe("2026-10-23T09:30:00.000Z");
      expect(meta.lastScannedAt).toBe("2026-10-23T14:45:00.000Z");
      expect(meta.firstGate).toBe("VIP Gate");
      expect(meta.latestGate).toBe("Auditorium A");
      expect(meta.history).toHaveLength(3);
      expect(meta.history[0].scan_number).toBe(1);
      expect(meta.history[2].scan_number).toBe(3);
    });

    it("handles not arrived attendee with 0 check-ins", () => {
      const attendee: Attendee = {
        id: "att-3",
        name: "Amit Patel",
        email: "amit@example.com",
        pass_type: "speaker",
        pass_status: "generated",
        application_status: "approved",
      };

      const meta = getAttendeeScanMeta(attendee, []);
      expect(meta.isCheckedIn).toBe(false);
      expect(meta.scanCount).toBe(0);
      expect(meta.firstScannedAt).toBeNull();
      expect(meta.lastScannedAt).toBeNull();
      expect(meta.history).toHaveLength(0);
    });
  });

  describe("exportAttendeeCheckinReportCSV", () => {
    it("returns error when not authenticated", async () => {
      mockedCreateClient.mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      } as never);

      const res = await exportAttendeeCheckinReportCSV("evt-1");
      expect(res).toEqual({ error: "Not authenticated." });
    });

    it("generates a comprehensive CSV report with per-attendee check-in counts and timestamp logs", async () => {
      const mockAttendees = [
        {
          id: "att-1",
          name: "Rahul Sharma",
          email: "rahul@example.com",
          phone: "+919876543210",
          pass_type: "vip",
          pass_status: "checked_in",
          application_status: "approved",
          created_at: "2026-10-20T08:00:00.000Z",
          custom_responses: {
            scan_count: 2,
            first_scanned_at: "2026-10-23T10:00:00.000Z",
            last_scanned_at: "2026-10-23T13:30:00.000Z",
            scan_history: [
              {
                scan_number: 1,
                scanned_at: "2026-10-23T10:00:00.000Z",
                gate_name: "Main Entrance",
                method: "qr",
              },
              {
                scan_number: 2,
                scanned_at: "2026-10-23T13:30:00.000Z",
                gate_name: "VIP Hall",
                method: "qr",
              },
            ],
          },
        },
        {
          id: "att-2",
          name: "Sneha Reddy",
          email: "sneha@example.com",
          phone: null,
          pass_type: "participant",
          pass_status: "generated",
          application_status: "approved",
          created_at: "2026-10-21T09:00:00.000Z",
          custom_responses: null,
        },
      ];

      const supabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-organizer" } } }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "events") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: {
                      id: "evt-1",
                      organizer_id: "user-organizer",
                      organization_id: null,
                      name: "Tech Con 2026",
                    },
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === "attendees") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    order: vi.fn().mockResolvedValue({
                      data: mockAttendees,
                      error: null,
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "check_ins") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                  }),
                }),
              }),
            };
          }
          return {};
        }),
      };

      mockedCreateClient.mockResolvedValue(supabase as never);

      const res = await exportAttendeeCheckinReportCSV("evt-1");
      expect(res.error).toBeUndefined();
      expect(res.csv).toBeDefined();

      const csv = res.csv!;
      // Verify headers
      expect(csv).toContain(
        "Attendee Name,Email,Phone,Pass Type,Check-in Status,Total Times Checked In,First Check-in Timestamp,First Gate,Latest Check-in Timestamp,Latest Gate,Check-in Method,Complete Check-in Timestamps Log,Registration Date"
      );

      // Verify Rahul Sharma checked in twice
      expect(csv).toContain('"Rahul Sharma","rahul@example.com","+919876543210","vip","Checked In","2"');
      expect(csv).toContain("Main Entrance");
      expect(csv).toContain("VIP Hall");
      expect(csv).toContain("[Scan #1:");
      expect(csv).toContain("[Scan #2:");

      // Verify Sneha Reddy not arrived
      expect(csv).toContain('"Sneha Reddy","sneha@example.com","","participant","Not Arrived","0"');
      expect(csv).toContain('"Not checked in"');
    });
  });
});
