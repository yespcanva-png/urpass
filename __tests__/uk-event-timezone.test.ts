import { describe, expect, it } from "vitest";
import { eventUtcRange, localEventTimeToUtc } from "@/lib/markets/timezone";

const london = "Europe/London";

describe("event wall-clock to UTC persistence", () => {
  it("uses GMT in winter and BST in summer", () => {
    expect(localEventTimeToUtc("2026-01-15", "12:00", london)).toBe("2026-01-15T12:00:00.000Z");
    expect(localEventTimeToUtc("2026-07-15", "12:00", london)).toBe("2026-07-15T11:00:00.000Z");
    expect(localEventTimeToUtc("2026-07-15", "12:00", "Asia/Kolkata")).toBe("2026-07-15T06:30:00.000Z");
  });

  it("rejects nonexistent and ambiguous UK clock-change times", () => {
    expect(() => localEventTimeToUtc("2026-03-29", "01:30", london)).toThrow(/does not exist/);
    expect(() => localEventTimeToUtc("2026-10-25", "01:30", london)).toThrow(/occurs twice/);
    expect(localEventTimeToUtc("2026-03-29", "02:30", london)).toBe("2026-03-29T01:30:00.000Z");
    expect(localEventTimeToUtc("2026-10-25", "02:30", london)).toBe("2026-10-25T02:30:00.000Z");
  });

  it("stores overnight end on the following local date", () => {
    expect(eventUtcRange({ event_date: "2026-07-15", start_time: "23:00", end_time: "01:00", timezone: london })).toEqual({
      startsAtUtc: "2026-07-15T22:00:00.000Z",
      endsAtUtc: "2026-07-16T00:00:00.000Z",
    });
  });

  it("rejects invalid calendar dates and equal start/end", () => {
    expect(() => localEventTimeToUtc("2026-02-30", "12:00", london)).toThrow();
    expect(() => eventUtcRange({ event_date: "2026-07-15", start_time: "12:00", end_time: "12:00", timezone: london })).toThrow();
  });
});
