import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mock supabase server ──────────────────────────────────────
const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

vi.mock("@/lib/supabase/config", () => ({
  getSupabaseUrl: () => "https://mock.supabase.co",
}));

import { GET as getTracks, POST as postTrack } from "@/app/api/events/[eventId]/tracks/route";
import { GET as getRooms, POST as postRoom } from "@/app/api/events/[eventId]/rooms/route";
import { GET as getSessions, POST as postSession } from "@/app/api/events/[eventId]/sessions/route";
import { GET as getAgenda } from "@/app/api/events/[eventId]/agenda/route";
import { POST as reserveSession, DELETE as cancelReservation } from "@/app/api/sessions/[sessionId]/reserve/route";
import { POST as checkinSession } from "@/app/api/sessions/[sessionId]/checkin/route";

describe("Conference API Routes", () => {
  const eventId = "evt-123";
  const userId = "usr-owner";

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: userId, email: "owner@urpass.space" } },
    });
  });

  describe("Tracks API", () => {
    it("returns 401 when user is not authenticated", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } });
      const req = new NextRequest("http://localhost/api/events/evt-123/tracks");
      const res = await getTracks(req, { params: Promise.resolve({ eventId }) });
      expect(res.status).toBe(401);
    });

    it("creates a new track when user is organizer", async () => {
      // Mock event authorization check
      const eventSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: eventId, organizer_id: userId, name: "Summit" },
          error: null,
        }),
      };

      // Mock track insert
      const trackInsertChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: "track-1",
            event_id: eventId,
            name: "Artificial Intelligence",
            colour: "#6C63FF",
            sort_order: 1,
          },
          error: null,
        }),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "events") return eventSelectChain;
        if (table === "event_tracks") return trackInsertChain;
        return {};
      });

      const req = new NextRequest("http://localhost/api/events/evt-123/tracks", {
        method: "POST",
        body: JSON.stringify({
          name: "Artificial Intelligence",
          colour: "#6C63FF",
          sort_order: 1,
        }),
      });

      const res = await postTrack(req, { params: Promise.resolve({ eventId }) });
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.data.name).toBe("Artificial Intelligence");
      expect(json.data.colour).toBe("#6C63FF");
    });
  });

  describe("Rooms API", () => {
    it("validates required room fields", async () => {
      const eventSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: eventId, organizer_id: userId, name: "Summit" },
          error: null,
        }),
      };

      mockFrom.mockReturnValue(eventSelectChain);

      const req = new NextRequest("http://localhost/api/events/evt-123/rooms", {
        method: "POST",
        body: JSON.stringify({ name: "" }),
      });

      const res = await postRoom(req, { params: Promise.resolve({ eventId }) });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("Room name is required");
    });
  });

  describe("Sessions API", () => {
    it("rejects session when end_time is before or equal to start_time", async () => {
      const eventSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: eventId, organizer_id: userId, name: "Summit" },
          error: null,
        }),
      };
      mockFrom.mockReturnValue(eventSelectChain);

      const req = new NextRequest("http://localhost/api/events/evt-123/sessions", {
        method: "POST",
        body: JSON.stringify({
          title: "Invalid Timing Talk",
          session_date: "2026-10-10",
          start_time: "14:00",
          end_time: "13:00", // Invalid!
        }),
      });

      const res = await postSession(req, { params: Promise.resolve({ eventId }) });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("Session end time must be after start time");
    });
  });

  describe("Session Reservation API", () => {
    it("returns 400 when missing passToken or attendeeId or email", async () => {
      const req = new NextRequest("http://localhost/api/sessions/sess-1/reserve", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const res = await reserveSession(req, { params: Promise.resolve({ sessionId: "sess-1" }) });
      expect(res.status).toBe(400);
    });

    it("detects conflict when attendee already has overlapping reservation", async () => {
      // 1. Session to reserve: 14:00 to 15:00
      const sessionSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: "sess-cand",
            event_id: eventId,
            title: "Candidate Workshop",
            session_date: "2026-10-10",
            start_time: "14:00",
            end_time: "15:00",
            capacity: 50,
            allow_waitlist: true,
            status: "published",
          },
          error: null,
        }),
      };

      // 2. Attendee lookup
      const attendeeSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: {
            id: "att-1",
            name: "Haarishmitha S",
            email: "haarish@example.com",
            application_status: "approved",
          },
        }),
      };

      // 3. Existing reservation that overlaps: 14:30 to 15:30
      const existingReservationsChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({
          data: [
            {
              session_id: "sess-prior",
              status: "reserved",
              session: {
                id: "sess-prior",
                title: "Prior Existing Keynote",
                session_date: "2026-10-10",
                start_time: "14:30",
                end_time: "15:30",
              },
            },
          ],
        }),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "event_sessions") return sessionSelectChain;
        if (table === "attendees") return attendeeSelectChain;
        if (table === "session_reservations") return existingReservationsChain;
        return {};
      });

      const req = new NextRequest("http://localhost/api/sessions/sess-cand/reserve", {
        method: "POST",
        body: JSON.stringify({ email: "haarish@example.com" }),
      });

      const res = await reserveSession(req, { params: Promise.resolve({ sessionId: "sess-cand" }) });
      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error).toBe("Schedule Conflict");
      expect(json.message).toContain("Prior Existing Keynote");
    });
  });

  describe("Session QR Check-In API", () => {
    it("validates pass against event and session reservation rules", async () => {
      // 1. Session: reservation_required = true
      const sessionChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: "sess-vip",
            event_id: eventId,
            title: "AI Future Summit",
            room_id: "hall-b",
            capacity: 300,
            registration_required: true,
            checkin_enabled: true,
            require_checkout: false,
            status: "published",
            start_time: "14:00",
            end_time: "15:00",
            room: { id: "hall-b", name: "Hall B", capacity: 300 },
          },
          error: null,
        }),
      };

      // 2. Valid pass for attendee
      const passChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: {
            id: "pass-1",
            pass_token: "UP-29383",
            pass_type: "participant",
            event_id: eventId,
            attendee_id: "att-1",
            attendee: {
              id: "att-1",
              name: "Haarishmitha S",
              email: "haarish@example.com",
              application_status: "approved",
            },
          },
        }),
      };

      // 3. Existing check-in check: none
      const existingCheckInChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      };

      // 4. Reservation check: not reserved!
      const reservationChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "event_sessions") return sessionChain;
        if (table === "passes") return passChain;
        if (table === "session_checkins") return existingCheckInChain;
        if (table === "session_reservations") return reservationChain;
        return {};
      });

      const req = new NextRequest("http://localhost/api/sessions/sess-vip/checkin", {
        method: "POST",
        body: JSON.stringify({ passToken: "UP-29383" }),
      });

      const res = await checkinSession(req, { params: Promise.resolve({ sessionId: "sess-vip" }) });
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.status).toBe("ACCESS_NOT_ALLOWED");
      expect(json.error).toContain("This attendee has not reserved this session");
    });

    it("successfully checks in attendee when reserved and returns remaining capacity", async () => {
      const sessionChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: "sess-vip",
            event_id: eventId,
            title: "AI Future Summit",
            room_id: "hall-b",
            capacity: 300,
            registration_required: true,
            checkin_enabled: true,
            require_checkout: false,
            status: "published",
            start_time: "14:00",
            end_time: "15:00",
            room: { id: "hall-b", name: "Hall B", capacity: 300 },
          },
          error: null,
        }),
      };

      const passChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: {
            id: "pass-1",
            pass_token: "UP-29383",
            pass_type: "participant",
            event_id: eventId,
            attendee_id: "att-1",
            attendee: {
              id: "att-1",
              name: "Haarishmitha S",
              email: "haarish@example.com",
              application_status: "approved",
            },
          },
        }),
      };

      // Not checked in yet
      const checkinChain = {
        select: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockImplementation(() => ({
            eq: vi.fn().mockImplementation(() => ({
              maybeSingle: vi.fn().mockResolvedValue({ data: null }),
            })),
            // For count query
            select: vi.fn().mockReturnThis(),
            count: 173,
          })),
        })),
        insert: vi.fn().mockResolvedValue({ error: null }),
      };

      // Valid reservation
      const reservationChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { id: "res-1", status: "reserved" },
        }),
        update: vi.fn().mockReturnThis(),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "event_sessions") return sessionChain;
        if (table === "passes") return passChain;
        if (table === "session_checkins") return checkinChain;
        if (table === "session_reservations") return reservationChain;
        return {};
      });

      const req = new NextRequest("http://localhost/api/sessions/sess-vip/checkin", {
        method: "POST",
        body: JSON.stringify({ passToken: "UP-29383" }),
      });

      const res = await checkinSession(req, { params: Promise.resolve({ sessionId: "sess-vip" }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.status).toBe("CHECKED_IN");
      expect(json.attendee.name).toBe("Haarishmitha S");
      expect(json.session.title).toBe("AI Future Summit");
      expect(json.session.room).toBe("Hall B");
      expect(json.capacity).toBe(300);
    });

    it("detects duplicate scan and returns ALREADY_CHECKED_IN with timestamp", async () => {
      const sessionChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: "sess-vip",
            event_id: eventId,
            title: "AI Future Summit",
            room_id: "hall-b",
            capacity: 300,
            registration_required: false,
            checkin_enabled: true,
            require_checkout: false,
            status: "published",
            start_time: "14:00",
            end_time: "15:00",
            room: { id: "hall-b", name: "Hall B", capacity: 300 },
          },
          error: null,
        }),
      };

      const passChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: {
            id: "pass-1",
            pass_token: "UP-29383",
            pass_type: "participant",
            event_id: eventId,
            attendee_id: "att-1",
            attendee: {
              id: "att-1",
              name: "Haarishmitha S",
              email: "haarish@example.com",
              application_status: "approved",
            },
          },
        }),
      };

      // Already checked in at 2:04 PM
      const existingCheckIn = {
        id: "checkin-prev",
        checkin_time: "2026-10-10T14:04:00.000Z",
        scanner_user_id: "Gate Staff 03",
        device_id: "scanner-device-01",
      };

      const checkinChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: existingCheckIn }),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "event_sessions") return sessionChain;
        if (table === "passes") return passChain;
        if (table === "session_checkins") return checkinChain;
        return {};
      });

      const req = new NextRequest("http://localhost/api/sessions/sess-vip/checkin", {
        method: "POST",
        body: JSON.stringify({ passToken: "UP-29383" }),
      });

      const res = await checkinSession(req, { params: Promise.resolve({ sessionId: "sess-vip" }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.status).toBe("ALREADY_CHECKED_IN");
      expect(json.attendee.name).toBe("Haarishmitha S");
      expect(json.message).toContain("ALREADY CHECKED IN");
    });
  });
});
