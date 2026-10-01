import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  timeStringToMinutes,
  formatTime12h,
  formatSessionTimeRange,
  doSessionsOverlap,
  checkRoomConflict,
  checkSpeakerConflicts,
  checkAttendeeScheduleConflict,
} from "@/lib/conference/conflict-detection";
import {
  slugify,
  groupSessionsByDate,
  computeConferenceAnalytics,
  SESSION_TYPE_CONFIG,
  SPEAKER_ROLE_CONFIG,
} from "@/lib/conference/helpers";
import type { EventSession, EventRoom, EventSpeaker } from "@/types/conference";

describe("Conference Management — Conflict Detection", () => {
  it("converts time string to minutes accurately", () => {
    expect(timeStringToMinutes("00:00")).toBe(0);
    expect(timeStringToMinutes("09:30")).toBe(570);
    expect(timeStringToMinutes("14:15:00")).toBe(855);
    expect(timeStringToMinutes("23:59")).toBe(1439);
    expect(timeStringToMinutes("")).toBe(0);
  });

  it("formats time to 12-hour AM/PM correctly", () => {
    expect(formatTime12h("09:00")).toBe("9:00 AM");
    expect(formatTime12h("12:00")).toBe("12:00 PM");
    expect(formatTime12h("14:30:00")).toBe("2:30 PM");
    expect(formatTime12h("00:15")).toBe("12:15 AM");
  });

  it("formats session time ranges correctly", () => {
    expect(formatSessionTimeRange("10:00", "11:30")).toBe("10:00 AM – 11:30 AM");
    expect(formatSessionTimeRange("14:00", "15:00")).toBe("2:00 PM – 3:00 PM");
  });

  it("accurately detects time interval overlap on the same date", () => {
    // Overlapping: 10:00-11:00 and 10:30-11:30
    expect(
      doSessionsOverlap(
        "2026-10-10",
        "10:00",
        "11:00",
        "2026-10-10",
        "10:30",
        "11:30"
      )
    ).toBe(true);

    // Contained: 10:00-12:00 and 10:30-11:00
    expect(
      doSessionsOverlap(
        "2026-10-10",
        "10:00",
        "12:00",
        "2026-10-10",
        "10:30",
        "11:00"
      )
    ).toBe(true);

    // Non-overlapping (adjacent/back-to-back): 10:00-11:00 and 11:00-12:00
    expect(
      doSessionsOverlap(
        "2026-10-10",
        "10:00",
        "11:00",
        "2026-10-10",
        "11:00",
        "12:00"
      )
    ).toBe(false);

    // Different dates: same time
    expect(
      doSessionsOverlap(
        "2026-10-10",
        "10:00",
        "11:00",
        "2026-10-11",
        "10:00",
        "11:00"
      )
    ).toBe(false);
  });

  it("detects Room conflicts when two sessions share a room at the same time", () => {
    const existingSessions: EventSession[] = [
      {
        id: "sess-1",
        event_id: "evt-1",
        title: "AI Business Keynote",
        slug: "ai-keynote",
        description: null,
        session_type: "keynote",
        session_date: "2026-10-10",
        start_time: "10:00",
        end_time: "11:00",
        room_id: "room-a",
        track_id: null,
        capacity: 200,
        allow_waitlist: true,
        registration_required: false,
        checkin_enabled: true,
        require_checkout: false,
        visibility: "public",
        status: "published",
        cover_image: null,
        tags: [],
        external_streaming_url: null,
        meeting_url: null,
        resources: [],
        created_at: "",
        updated_at: "",
        room: {
          id: "room-a",
          name: "Main Auditorium",
          capacity: 200,
          event_id: "evt-1",
          floor: "Ground",
          location: null,
          description: null,
          checkin_enabled: true,
          created_at: "",
          updated_at: "",
        },
      },
    ];

    // Conflict in room-a
    const conflict = checkRoomConflict(
      {
        room_id: "room-a",
        session_date: "2026-10-10",
        start_time: "10:30",
        end_time: "11:30",
      },
      existingSessions
    );

    expect(conflict).not.toBeNull();
    expect(conflict?.type).toBe("room");
    expect(conflict?.conflictingSessionTitle).toBe("AI Business Keynote");
    expect(conflict?.message).toContain("Main Auditorium is already occupied");

    // No conflict in room-b
    const noConflict = checkRoomConflict(
      {
        room_id: "room-b",
        session_date: "2026-10-10",
        start_time: "10:30",
        end_time: "11:30",
      },
      existingSessions
    );
    expect(noConflict).toBeNull();

    // No conflict if editing the same session
    const selfEditConflict = checkRoomConflict(
      {
        id: "sess-1",
        room_id: "room-a",
        session_date: "2026-10-10",
        start_time: "10:00",
        end_time: "11:00",
      },
      existingSessions
    );
    expect(selfEditConflict).toBeNull();
  });

  it("detects Speaker conflicts when a presenter is double-booked", () => {
    const existingSessions: EventSession[] = [
      {
        id: "sess-1",
        event_id: "evt-1",
        title: "Future of Artificial Intelligence",
        slug: "future-ai",
        description: null,
        session_type: "keynote",
        session_date: "2026-10-10",
        start_time: "14:00",
        end_time: "15:00",
        room_id: "room-a",
        track_id: null,
        capacity: 100,
        allow_waitlist: true,
        registration_required: false,
        checkin_enabled: true,
        require_checkout: false,
        visibility: "public",
        status: "published",
        cover_image: null,
        tags: [],
        external_streaming_url: null,
        meeting_url: null,
        resources: [],
        created_at: "",
        updated_at: "",
        speakers: [
          {
            id: "sp-rel-1",
            session_id: "sess-1",
            speaker_id: "speaker-john",
            role: "speaker",
            sort_order: 0,
            created_at: "",
            speaker: {
              id: "speaker-john",
              event_id: "evt-1",
              name: "John Smith",
              job_title: "Chief AI Officer",
              company: "Open Labs",
              bio: null,
              photo: null,
              linkedin_url: null,
              website_url: null,
              email: null,
              phone: null,
              country: null,
              city: null,
              topics: [],
              display_order: 0,
              visibility: "public",
              created_at: "",
              updated_at: "",
            },
          },
        ],
      },
    ];

    // Candidate session at 14:30 with John Smith
    const conflicts = checkSpeakerConflicts(
      {
        session_date: "2026-10-10",
        start_time: "14:30",
        end_time: "15:30",
      },
      ["speaker-john"],
      existingSessions
    );

    expect(conflicts.length).toBe(1);
    expect(conflicts[0].type).toBe("speaker");
    expect(conflicts[0].targetName).toBe("John Smith");
    expect(conflicts[0].message).toContain(
      'John Smith is already assigned to "Future of Artificial Intelligence"'
    );

    // Another speaker free at that time
    const noConflicts = checkSpeakerConflicts(
      {
        session_date: "2026-10-10",
        start_time: "14:30",
        end_time: "15:30",
      },
      ["speaker-alice"],
      existingSessions
    );
    expect(noConflicts.length).toBe(0);
  });

  it("detects Attendee schedule conflict when booking overlapping sessions", () => {
    const attendeeExistingReservations = [
      {
        id: "sess-1",
        title: "Startup Funding Workshop",
        session_date: "2026-10-10",
        start_time: "14:00",
        end_time: "15:00",
      },
    ];

    // Attempt to book session B from 14:30 to 15:30
    const conflict = checkAttendeeScheduleConflict(
      {
        id: "sess-2",
        title: "Product Growth Panel",
        session_date: "2026-10-10",
        start_time: "14:30",
        end_time: "15:30",
      },
      attendeeExistingReservations
    );

    expect(conflict).not.toBeNull();
    expect(conflict?.type).toBe("attendee");
    expect(conflict?.message).toContain("Schedule Conflict");
    expect(conflict?.message).toContain("Startup Funding Workshop");

    // Non-conflicting session from 15:00 to 16:00
    const noConflict = checkAttendeeScheduleConflict(
      {
        id: "sess-3",
        title: "Evening Networking",
        session_date: "2026-10-10",
        start_time: "15:00",
        end_time: "16:00",
      },
      attendeeExistingReservations
    );
    expect(noConflict).toBeNull();
  });
});

describe("Conference Management — Helpers & Analytics", () => {
  it("slugifies session and event titles into URL-safe strings", () => {
    expect(slugify("Opening Keynote: Future of AI & Tech!")).toBe(
      "opening-keynote-future-of-ai-tech"
    );
    expect(slugify("   Track A — Cloud Computing 2026   ")).toBe(
      "track-a-cloud-computing-2026"
    );
  });

  it("groups sessions correctly by date and sorts chronologically", () => {
    const mockSessions: EventSession[] = [
      {
        id: "s2",
        event_id: "evt-1",
        title: "Afternoon Workshop",
        slug: "workshop",
        description: null,
        session_type: "workshop",
        session_date: "2026-10-10",
        start_time: "14:00",
        end_time: "15:30",
        track_id: null,
        room_id: null,
        capacity: 50,
        allow_waitlist: true,
        registration_required: true,
        checkin_enabled: true,
        require_checkout: true,
        visibility: "public",
        status: "published",
        cover_image: null,
        tags: [],
        external_streaming_url: null,
        meeting_url: null,
        resources: [],
        created_at: "",
        updated_at: "",
      },
      {
        id: "s1",
        event_id: "evt-1",
        title: "Morning Keynote",
        slug: "keynote",
        description: null,
        session_type: "keynote",
        session_date: "2026-10-10",
        start_time: "09:30",
        end_time: "10:30",
        track_id: null,
        room_id: null,
        capacity: 500,
        allow_waitlist: true,
        registration_required: false,
        checkin_enabled: true,
        require_checkout: false,
        visibility: "public",
        status: "published",
        cover_image: null,
        tags: [],
        external_streaming_url: null,
        meeting_url: null,
        resources: [],
        created_at: "",
        updated_at: "",
      },
      {
        id: "s3",
        event_id: "evt-1",
        title: "Day 2 Tech Panel",
        slug: "panel",
        description: null,
        session_type: "panel",
        session_date: "2026-10-11",
        start_time: "10:00",
        end_time: "11:00",
        track_id: null,
        room_id: null,
        capacity: 100,
        allow_waitlist: true,
        registration_required: false,
        checkin_enabled: true,
        require_checkout: false,
        visibility: "public",
        status: "published",
        cover_image: null,
        tags: [],
        external_streaming_url: null,
        meeting_url: null,
        resources: [],
        created_at: "",
        updated_at: "",
      },
    ];

    const grouped = groupSessionsByDate(mockSessions);
    expect(grouped.length).toBe(2);
    expect(grouped[0].date).toBe("2026-10-10");
    expect(grouped[0].sessions[0].id).toBe("s1"); // Morning Keynote first
    expect(grouped[0].sessions[1].id).toBe("s2"); // Workshop second
    expect(grouped[1].date).toBe("2026-10-11");
    expect(grouped[1].sessions.length).toBe(1);
  });

  it("computes conference analytics correctly (attendance, popular session, no-shows)", () => {
    const mockSessions: EventSession[] = [
      {
        id: "sess-1",
        event_id: "evt-1",
        title: "Keynote A",
        slug: "keynote-a",
        description: null,
        session_type: "keynote",
        session_date: "2026-10-10",
        start_time: "09:00",
        end_time: "10:00",
        room_id: "room-1",
        track_id: null,
        capacity: 100,
        allow_waitlist: true,
        registration_required: true,
        checkin_enabled: true,
        require_checkout: false,
        visibility: "public",
        status: "published",
        cover_image: null,
        tags: [],
        external_streaming_url: null,
        meeting_url: null,
        resources: [],
        created_at: "",
        updated_at: "",
      },
      {
        id: "sess-2",
        event_id: "evt-1",
        title: "Workshop B",
        slug: "workshop-b",
        description: null,
        session_type: "workshop",
        session_date: "2026-10-10",
        start_time: "10:30",
        end_time: "12:00",
        room_id: "room-2",
        track_id: null,
        capacity: 50,
        allow_waitlist: true,
        registration_required: true,
        checkin_enabled: true,
        require_checkout: false,
        visibility: "public",
        status: "published",
        cover_image: null,
        tags: [],
        external_streaming_url: null,
        meeting_url: null,
        resources: [],
        created_at: "",
        updated_at: "",
      },
    ];

    const mockRooms: EventRoom[] = [
      {
        id: "room-1",
        event_id: "evt-1",
        name: "Main Auditorium",
        capacity: 100,
        floor: "1",
        location: null,
        description: null,
        checkin_enabled: true,
        created_at: "",
        updated_at: "",
      },
      {
        id: "room-2",
        event_id: "evt-1",
        name: "Workshop Lab",
        capacity: 50,
        floor: "2",
        location: null,
        description: null,
        checkin_enabled: true,
        created_at: "",
        updated_at: "",
      },
    ];

    const mockReservations = [
      { session_id: "sess-1", status: "reserved" },
      { session_id: "sess-1", status: "reserved" },
      { session_id: "sess-2", status: "reserved" },
      { session_id: "sess-2", status: "cancelled" }, // cancelled should not count
    ];

    const mockCheckIns = [
      { session_id: "sess-1", checkin_time: "2026-10-10T09:05:00.000Z" },
      { session_id: "sess-1", checkin_time: "2026-10-10T09:12:00.000Z" },
    ];

    const analytics = computeConferenceAnalytics(
      mockSessions,
      mockRooms,
      4, // speakersCount
      2, // tracksCount
      mockReservations,
      mockCheckIns
    );

    expect(analytics.totalSessions).toBe(2);
    expect(analytics.totalRooms).toBe(2);
    expect(analytics.totalSpeakers).toBe(4);
    expect(analytics.totalTracks).toBe(2);
    expect(analytics.totalReservations).toBe(3); // 2 + 1 (excluding cancelled)
    expect(analytics.totalCheckIns).toBe(2);
    expect(analytics.averageSessionAttendance).toBe(1); // 2 checkins / 2 sessions
    expect(analytics.mostPopularSession?.id).toBe("sess-1");
    expect(analytics.mostPopularSession?.checkIns).toBe(2);
    expect(analytics.leastAttendedSession?.id).toBe("sess-2");
    expect(analytics.leastAttendedSession?.checkIns).toBe(0);
    expect(analytics.roomUtilisation.length).toBe(2);
  });

  it("contains all 10 standard session types and 7 speaker roles", () => {
    expect(Object.keys(SESSION_TYPE_CONFIG)).toEqual([
      "keynote",
      "presentation",
      "panel",
      "workshop",
      "networking",
      "break",
      "lunch",
      "registration",
      "entertainment",
      "custom",
    ]);

    expect(Object.keys(SPEAKER_ROLE_CONFIG)).toEqual([
      "speaker",
      "moderator",
      "panelist",
      "host",
      "mc",
      "trainer",
      "guest",
    ]);
  });
});
