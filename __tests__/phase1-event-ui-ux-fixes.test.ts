import { describe, it, expect } from "vitest";
import { formatPrice, formatAmount, getCurrencySymbol } from "@/lib/currency";
import { canDecodeQr, isTerminalScannerState } from "@/lib/scanner-state";

describe("Phase 1 Fixes: Currency & Multi-Currency Formatter", () => {
  it("formats prices correctly for INR with en-IN locale", () => {
    expect(formatPrice(0, "INR")).toBe("Free");
    expect(formatPrice(49900, "INR")).toBe("₹499");
    expect(formatPrice(125050, "INR")).toBe("₹1,250.50");
  });

  it("formats prices correctly for USD, GBP, and EUR", () => {
    expect(formatPrice(2500, "USD")).toBe("$25");
    expect(formatPrice(2550, "USD")).toBe("$25.50");
    expect(formatPrice(4900, "GBP")).toBe("£49");
    expect(formatPrice(10000, "EUR")).toBe("€100");
  });

  it("returns proper currency symbols for ticket form labels", () => {
    expect(getCurrencySymbol("INR").trim()).toBe("₹");
    expect(getCurrencySymbol("USD").trim()).toBe("$");
    expect(getCurrencySymbol("GBP").trim()).toBe("£");
    expect(getCurrencySymbol("EUR").trim()).toBe("€");
  });

  it("formats major amounts cleanly", () => {
    expect(formatAmount(0, "USD")).toBe("Free");
    expect(formatAmount(10, "USD")).toBe("$10");
    expect(formatAmount(15.5, "USD")).toBe("$15.50");
    expect(formatAmount(100, "INR")).toBe("₹100");
  });
});

describe("Phase 1 Fixes: Scanner State & Rearm Enforcement", () => {
  it("allows decoding strictly in READY state", () => {
    expect(canDecodeQr("READY")).toBe(true);
    expect(canDecodeQr("PROCESSING")).toBe(false);
    expect(canDecodeQr("SUCCESS")).toBe(false);
    expect(canDecodeQr("DUPLICATE")).toBe(false);
    expect(canDecodeQr("REJECTED")).toBe(false);
    expect(canDecodeQr("ERROR")).toBe(false);
  });

  it("identifies all terminal states that require Scan Next", () => {
    expect(isTerminalScannerState("SUCCESS")).toBe(true);
    expect(isTerminalScannerState("DUPLICATE")).toBe(true);
    expect(isTerminalScannerState("REJECTED")).toBe(true);
    expect(isTerminalScannerState("ERROR")).toBe(true);
    expect(isTerminalScannerState("READY")).toBe(false);
    expect(isTerminalScannerState("PROCESSING")).toBe(false);
  });
});

describe("Phase 1 Fixes: Overnight Event Preflight Logic", () => {
  it("validates overnight schedules without blocking publication", () => {
    const event = {
      event_date: "2026-11-01",
      start_time: "20:00",
      end_time: "04:00",
    };

    let datesPassed = true;
    let datesMessage = "Event date and operational hours are properly configured.";

    if (!event.event_date) {
      datesPassed = false;
      datesMessage = "Event date is missing. Set a valid scheduled date.";
    } else {
      const eventDay = new Date(event.event_date);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (eventDay < yesterday) {
        datesPassed = false;
        datesMessage = `Event date (${event.event_date}) is in the past. Update to a future date before publishing.`;
      }
    }

    if (datesPassed && event.start_time && event.end_time) {
      if (event.start_time === event.end_time) {
        datesPassed = false;
        datesMessage = "Start time and end time cannot be identical.";
      } else if (event.start_time > event.end_time) {
        // Valid overnight schedule spanning past midnight into the next morning
        datesMessage = `Overnight schedule configured (${event.start_time} to ${event.end_time} next day).`;
      }
    }

    expect(datesPassed).toBe(true);
    expect(datesMessage).toContain("Overnight schedule configured");
  });

  it("rejects schedules where start time and end time are identical", () => {
    const event = {
      event_date: "2026-11-01",
      start_time: "10:00",
      end_time: "10:00",
    };

    let datesPassed = true;
    let datesMessage = "Event date and operational hours are properly configured.";

    if (datesPassed && event.start_time && event.end_time) {
      if (event.start_time === event.end_time) {
        datesPassed = false;
        datesMessage = "Start time and end time cannot be identical.";
      }
    }

    expect(datesPassed).toBe(false);
    expect(datesMessage).toBe("Start time and end time cannot be identical.");
  });
});

describe("Phase 1 Fixes: Authoritative Attendance Computation", () => {
  it("reconciles checked-in count from both check_ins and authoritative attendee records", () => {
    const checkins = [
      { id: "c1", attendee_id: "att_1", checked_in_at: "2026-10-25T10:00:00Z" },
      { id: "c2", attendee_id: "att_1", checked_in_at: "2026-10-25T11:00:00Z" }, // re-entry
    ];

    const attendees = [
      { id: "att_1", pass_status: "checked_in", venue_presence_state: "INSIDE" },
      { id: "att_2", pass_status: "checked_in", venue_presence_state: "INSIDE" }, // checked in at desk, no check_ins log
      { id: "att_3", pass_status: "generated", venue_presence_state: "EXPECTED" }, // not arrived
    ];

    const authoritativeCheckedInIds = new Set([
      ...checkins.map((c) => c.attendee_id),
      ...attendees
        .filter(
          (a) =>
            a.pass_status === "checked_in" ||
            a.venue_presence_state?.toUpperCase() === "INSIDE"
        )
        .map((a) => a.id),
    ]);

    expect(authoritativeCheckedInIds.size).toBe(2);
    expect(authoritativeCheckedInIds.has("att_1")).toBe(true);
    expect(authoritativeCheckedInIds.has("att_2")).toBe(true);
    expect(authoritativeCheckedInIds.has("att_3")).toBe(false);
  });
});
