import type { DynamicFieldKey } from "./types";

export interface DummyAttendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  ticketCategory: string;
  ticketId: string;
  zone: string;
  seat: string;
}

export interface SampleEventData {
  name: string;
  date: string;
  time: string;
  venue: string;
}

export const DUMMY_ATTENDEES: DummyAttendee[] = [
  {
    id: "att-standard",
    name: "Arjun Kumar",
    email: "arjun.kumar@gmail.com",
    phone: "+91 98765 43210",
    company: "Stripe India",
    ticketCategory: "VIP ACCESS",
    ticketId: "#URP-10284",
    zone: "GATE 2 · MAIN HALL",
    seat: "ROW C · SEAT 18",
  },
  {
    id: "att-vip",
    name: "Priya Sharma",
    email: "priya.sharma@razorpay.com",
    phone: "+91 98401 23456",
    company: "Razorpay",
    ticketCategory: "VVIP ALL-ACCESS",
    ticketId: "#URP-10285",
    zone: "VIP ENTRANCE · LOUNGE",
    seat: "ROW A · SEAT 04",
  },
  {
    id: "att-long-name",
    name: "Dr. Christopher Montgomery-Vanderbilt III",
    email: "c.montgomery-vanderbilt@ai-research.cam.ac.uk",
    phone: "+44 7700 900077",
    company: "Department of Autonomous Intelligent Systems, Cambridge University",
    ticketCategory: "KEYNOTE SPEAKER",
    ticketId: "#URP-10286",
    zone: "STAGE ACCESS · GREEN ROOM",
    seat: "SPEAKER FRONT ROW",
  },
  {
    id: "att-student",
    name: "Ananya Ramesh",
    email: "ananya.r@psgtech.ac.in",
    phone: "+91 94432 11098",
    company: "PSG College of Technology",
    ticketCategory: "STUDENT PASS",
    ticketId: "#URP-10287",
    zone: "STUDENT GATE 4",
    seat: "BALCONY ROW G",
  },
];

export const DEFAULT_SAMPLE_EVENT: SampleEventData = {
  name: "URPASS TECH SUMMIT 2026",
  date: "24 OCT 2026",
  time: "10:00 AM - 5:00 PM",
  venue: "The Residency, Coimbatore",
};

/**
 * Resolves a dynamic field token into realistic display text.
 */
export function resolveDynamicField(
  key: DynamicFieldKey,
  attendee: DummyAttendee = DUMMY_ATTENDEES[0],
  event: SampleEventData = DEFAULT_SAMPLE_EVENT
): string {
  switch (key) {
    case "attendee.name":
      return attendee.name;
    case "attendee.email":
      return attendee.email;
    case "attendee.phone":
      return attendee.phone;
    case "attendee.company":
      return attendee.company;
    case "ticket.category":
      return attendee.ticketCategory;
    case "ticket.id":
      return attendee.ticketId;
    case "ticket.zone":
      return attendee.zone;
    case "ticket.seat":
      return attendee.seat;
    case "event.name":
      return event.name;
    case "event.date":
      return event.date;
    case "event.time":
      return event.time;
    case "event.venue":
      return event.venue;
    default:
      return "";
  }
}

/**
 * Interpolates string templates with merge tokens like {{attendee.name}}
 */
export function interpolateTokens(
  template: string,
  attendee: DummyAttendee = DUMMY_ATTENDEES[0],
  event: SampleEventData = DEFAULT_SAMPLE_EVENT
): string {
  if (!template) return "";
  return template.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (_match, key: DynamicFieldKey) => {
    return resolveDynamicField(key, attendee, event) || _match;
  });
}
