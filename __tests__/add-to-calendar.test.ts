import { describe, it, expect } from "vitest";
import {
  computeCalendarDateRange,
  buildGoogleCalendarUrl,
  buildIcsContent,
} from "@/components/pass/AddToCalendarButton";

describe("AddToCalendarButton helpers", () => {
  const sampleProps = {
    eventName: "Bangalore Tech Summit 2026",
    description: "Annual keynote and networking for engineers.",
    venue: "Nimhans Convention Centre, Bangalore",
    eventDate: "2026-10-15",
    startTime: "09:30 AM",
    endTime: "05:00 PM",
    passToken: "tok_test123456",
    meetingUrl: null,
    isOnline: false,
  };

  it("computes accurate start and end date ranges", () => {
    const { start, end } = computeCalendarDateRange(
      sampleProps.eventDate,
      sampleProps.startTime,
      sampleProps.endTime
    );

    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(9); // 0-indexed October
    expect(start.getDate()).toBe(15);
    expect(start.getHours()).toBe(9);
    expect(start.getMinutes()).toBe(30);

    expect(end.getHours()).toBe(17);
    expect(end.getMinutes()).toBe(0);
    expect(end.getTime()).toBeGreaterThan(start.getTime());
  });

  it("handles 24-hour military time formats", () => {
    const { start, end } = computeCalendarDateRange("2026-11-20", "14:00", "18:30");
    expect(start.getHours()).toBe(14);
    expect(start.getMinutes()).toBe(0);
    expect(end.getHours()).toBe(18);
    expect(end.getMinutes()).toBe(30);
  });

  it("falls back to 2-hour default duration when end time is missing", () => {
    const { start, end } = computeCalendarDateRange("2026-10-15", "10:00 AM", null);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    expect(diffHours).toBe(2);
  });

  it("builds a valid Google Calendar URL", () => {
    const url = buildGoogleCalendarUrl(sampleProps);
    expect(url).toContain("https://calendar.google.com/calendar/render");
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("Bangalore+Tech+Summit+2026");
    expect(url).toContain("Nimhans+Convention+Centre");
    expect(url).toContain("tok_test123456");
  });

  it("builds a valid RFC 5545 iCalendar (.ics) content string", () => {
    const ics = buildIcsContent(sampleProps);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("SUMMARY:Bangalore Tech Summit 2026");
    expect(ics).toContain("LOCATION:Nimhans Convention Centre, Bangalore");
    expect(ics).toContain("pass/tok_test123456");
    expect(ics).toContain("STATUS:CONFIRMED");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("handles online events with meeting URLs in calendar details", () => {
    const onlineProps = {
      ...sampleProps,
      isOnline: true,
      venue: null,
      meetingUrl: "https://meet.google.com/abc-defg-hij",
    };

    const googleUrl = buildGoogleCalendarUrl(onlineProps);
    expect(googleUrl).toContain(encodeURIComponent("https://meet.google.com/abc-defg-hij"));

    const ics = buildIcsContent(onlineProps);
    expect(ics).toContain("LOCATION:https://meet.google.com/abc-defg-hij");
  });
});
