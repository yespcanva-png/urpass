import { describe, it, expect } from "vitest";

describe("Retention & Organizer Onboarding Logic", () => {
  it("calculates onboarding steps correctly from zero to full completion", () => {
    function computeChecklistProgress(state: {
      hasEvents: boolean;
      isEventActive: boolean;
      totalPasses: number;
      totalCheckedIn: number;
    }) {
      const steps = [
        { id: "create_event", completed: state.hasEvents },
        { id: "customize_pass", completed: state.hasEvents },
        { id: "publish_event", completed: state.isEventActive },
        { id: "register_attendee", completed: state.totalPasses > 0 },
        { id: "test_scanner", completed: state.totalCheckedIn > 0 },
      ];
      const completedCount = steps.filter((s) => s.completed).length;
      return {
        completedCount,
        total: steps.length,
        percentage: Math.round((completedCount / steps.length) * 100),
        allCompleted: completedCount === steps.length,
      };
    }

    // Brand new user
    const p0 = computeChecklistProgress({
      hasEvents: false,
      isEventActive: false,
      totalPasses: 0,
      totalCheckedIn: 0,
    });
    expect(p0.completedCount).toBe(0);
    expect(p0.percentage).toBe(0);
    expect(p0.allCompleted).toBe(false);

    // Event created & customized
    const p1 = computeChecklistProgress({
      hasEvents: true,
      isEventActive: false,
      totalPasses: 0,
      totalCheckedIn: 0,
    });
    expect(p1.completedCount).toBe(2);
    expect(p1.percentage).toBe(40);

    // Event published & active
    const p2 = computeChecklistProgress({
      hasEvents: true,
      isEventActive: true,
      totalPasses: 0,
      totalCheckedIn: 0,
    });
    expect(p2.completedCount).toBe(3);
    expect(p2.percentage).toBe(60);

    // Test attendee registered
    const p3 = computeChecklistProgress({
      hasEvents: true,
      isEventActive: true,
      totalPasses: 1,
      totalCheckedIn: 0,
    });
    expect(p3.completedCount).toBe(4);
    expect(p3.percentage).toBe(80);

    // Check-in verified
    const p4 = computeChecklistProgress({
      hasEvents: true,
      isEventActive: true,
      totalPasses: 1,
      totalCheckedIn: 1,
    });
    expect(p4.completedCount).toBe(5);
    expect(p4.percentage).toBe(100);
    expect(p4.allCompleted).toBe(true);
  });

  it("calculates post-event turnout and retention rate accurately", () => {
    function calculatePostEventSummary(registered: number, checkedIn: number) {
      const turnoutRate = registered > 0 ? Math.round((checkedIn / registered) * 100) : 0;
      return {
        registered,
        checkedIn,
        turnoutRate,
        isSuccessful: turnoutRate >= 50,
      };
    }

    const res = calculatePostEventSummary(150, 128);
    expect(res.turnoutRate).toBe(85);
    expect(res.isSuccessful).toBe(true);

    const empty = calculatePostEventSummary(0, 0);
    expect(empty.turnoutRate).toBe(0);
  });
});
