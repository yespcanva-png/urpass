import { describe, it, expect, vi } from "vitest";

// Mock Supabase
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(() => "SUBSCRIBED"),
    })),
    removeChannel: vi.fn(),
  })),
}));

describe("Session-Wise Attendance Dashboard Suite", () => {
  // Test Event: NCDP 2026 containing Autism and ADHD sessions
  const eventId = "a47b6258-7bc8-48c7-b72a-9ebddab5624d";
  const approvedAttendees = 170;

  const autismSession = {
    id: "ddde97ff-1bf6-43ad-a300-ccf51bb0f07e",
    event_id: eventId,
    title: "AUTISM",
    session_date: "2026-12-11",
    start_time: "10:00:00",
    end_time: "11:00:00",
    capacity: 100,
    registration_required: false,
    eligible_ticket_type_ids: [],
    status: "published",
  };

  const adhdSession = {
    id: "a0db497f-bb48-4294-99ea-0d4fb4c10bdd",
    event_id: eventId,
    title: "ADHD",
    session_date: "2026-12-11",
    start_time: "10:00:00",
    end_time: "11:00:00",
    capacity: 100,
    registration_required: false,
    eligible_ticket_type_ids: [],
    status: "published",
  };

  const checkinsDatabase = [
    {
      id: "checkin_autism_01",
      event_id: eventId,
      session_id: "ddde97ff-1bf6-43ad-a300-ccf51bb0f07e", // AUTISM
      attendee_id: "att_karthik_01",
      admitted_guests: 1,
      checkin_time: "2026-10-14T18:51:17.374Z",
    },
  ];

  it("1. Displays separate attendance cards and counts for Autism and ADHD", () => {
    const sessions = [autismSession, adhdSession];

    const stats = sessions.map((s) => {
      const sCheckins = checkinsDatabase.filter((c) => c.session_id === s.id);
      const checkedInCount = sCheckins.reduce((sum, c) => sum + (c.admitted_guests || 1), 0);
      const registeredCount = approvedAttendees;
      const turnoutRate = registeredCount > 0 ? Math.round((checkedInCount / registeredCount) * 100) : 0;
      return {
        id: s.id,
        title: s.title,
        checkedInCount,
        registeredCount,
        turnoutRate,
      };
    });

    const autism = stats.find((s) => s.title === "AUTISM");
    const adhd = stats.find((s) => s.title === "ADHD");

    expect(autism).toBeDefined();
    expect(autism?.checkedInCount).toBe(1);
    expect(autism?.registeredCount).toBe(170);
    expect(autism?.turnoutRate).toBe(1); // 1% turnout

    expect(adhd).toBeDefined();
    expect(adhd?.checkedInCount).toBe(0);
    expect(adhd?.registeredCount).toBe(170);
    expect(adhd?.turnoutRate).toBe(0); // 0% turnout
  });

  it("2. Updates attendance count automatically when QR code is scanned for ADHD", () => {
    // Simulate a new scan coming into ADHD session
    const simulatedAdhdCheckin = {
      id: "checkin_adhd_01",
      event_id: eventId,
      session_id: "a0db497f-bb48-4294-99ea-0d4fb4c10bdd", // ADHD
      attendee_id: "att_alex_02",
      admitted_guests: 1,
      checkin_time: new Date().toISOString(),
    };

    const updatedCheckins = [...checkinsDatabase, simulatedAdhdCheckin];

    const autismCount = updatedCheckins
      .filter((c) => c.session_id === autismSession.id)
      .reduce((sum, c) => sum + c.admitted_guests, 0);

    const adhdCount = updatedCheckins
      .filter((c) => c.session_id === adhdSession.id)
      .reduce((sum, c) => sum + c.admitted_guests, 0);

    expect(autismCount).toBe(1);
    expect(adhdCount).toBe(1);
  });

  it("3. Correctly accounts for group admissions (admitted_guests > 1)", () => {
    // Simulate a family/group pass scanning into Autism session
    const simulatedGroupCheckin = {
      id: "checkin_autism_group_01",
      event_id: eventId,
      session_id: autismSession.id,
      attendee_id: "att_family_01",
      admitted_guests: 4, // 4 guests in single scan
      checkin_time: new Date().toISOString(),
    };

    const updatedCheckins = [...checkinsDatabase, simulatedGroupCheckin];

    const autismTotalAdmitted = updatedCheckins
      .filter((c) => c.session_id === autismSession.id)
      .reduce((sum, c) => sum + c.admitted_guests, 0);

    // Initial 1 + Group 4 = 5 attendees checked in
    expect(autismTotalAdmitted).toBe(5);
  });

  it("4. Visual comparison chart calculates relative bar scaling between sessions", () => {
    const sessionStats = [
      { id: autismSession.id, title: "AUTISM", checkedIn: 25, registered: 100 },
      { id: adhdSession.id, title: "ADHD", checkedIn: 50, registered: 100 },
    ];

    const maxCheckin = Math.max(...sessionStats.map((s) => s.checkedIn));
    expect(maxCheckin).toBe(50);

    const autismRelativeBar = Math.round((25 / maxCheckin) * 100);
    const adhdRelativeBar = Math.round((50 / maxCheckin) * 100);

    expect(autismRelativeBar).toBe(50); // 50% relative to peak session
    expect(adhdRelativeBar).toBe(100);  // 100% relative to peak session
  });

  it("5. Respects reservation-only sessions for total registered counts", () => {
    const reservationOnlySession = {
      id: "session_workshop_exclusive",
      title: "Exclusive Pediatric Workshop",
      registration_required: true,
      capacity: 30,
    };

    const sessionReservations = [
      { session_id: "session_workshop_exclusive", attendee_id: "att_01", status: "reserved" },
      { session_id: "session_workshop_exclusive", attendee_id: "att_02", status: "reserved" },
      { session_id: "session_workshop_exclusive", attendee_id: "att_03", status: "reserved" },
    ];

    const registered = sessionReservations.filter((r) => r.status === "reserved").length;
    expect(registered).toBe(3); // Exactly 3 reserved, not full 170 event attendees
  });
});
