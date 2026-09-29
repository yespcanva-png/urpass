import { describe, it, expect, beforeEach } from "vitest";
import { recordLiveOpsEvent, getLiveOpsEvents } from "@/lib/ops/events";

describe("Live Ops Event Bus & Telemetry Stream", () => {
  beforeEach(() => {
    if (globalThis.__urpass_ops_event_buffer) {
      globalThis.__urpass_ops_event_buffer = [];
    }
  });

  it("records and retrieves live login and signup events", () => {
    recordLiveOpsEvent({
      level: "SUCCESS",
      category: "AUTH",
      message: "Live user signup: neworganizer@example.com (Jane Doe) registered",
      details: { email: "neworganizer@example.com", name: "Jane Doe" },
    });

    recordLiveOpsEvent({
      level: "SUCCESS",
      category: "AUTH",
      message: "Live user login: neworganizer@example.com session started",
      details: { email: "neworganizer@example.com" },
    });

    const events = getLiveOpsEvents();
    expect(events.length).toBe(2);
    expect(events[0].message).toContain("Live user login");
    expect(events[1].message).toContain("Live user signup");
    expect(events[0].category).toBe("AUTH");
  });

  it("records and retrieves event creations", () => {
    recordLiveOpsEvent({
      level: "SUCCESS",
      category: "EVENT",
      message: 'New event created: "London Tech Festival" (ExCeL London)',
      details: { name: "London Tech Festival", venue: "ExCeL London" },
    });

    const events = getLiveOpsEvents();
    expect(events.length).toBe(1);
    expect(events[0].category).toBe("EVENT");
    expect(events[0].level).toBe("SUCCESS");
    expect(events[0].message).toContain("London Tech Festival");
  });

  it("bounds the ring buffer to 250 items maximum", () => {
    for (let i = 0; i < 300; i++) {
      recordLiveOpsEvent({
        level: "INFO",
        category: "SYSTEM",
        message: `Heartbeat probe ${i}`,
      });
    }

    const events = getLiveOpsEvents();
    expect(events.length).toBe(250);
    expect(events[0].message).toBe("Heartbeat probe 299");
  });
});
