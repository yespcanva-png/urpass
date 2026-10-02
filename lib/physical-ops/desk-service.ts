import type { BadgeRoleType } from "./types";
import { queueBadgePrint } from "./badge-service";

export interface OnsiteAttendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  designation?: string;
  ticketTypeId?: string;
  ticketName?: string;
  badgeType: BadgeRoleType;
  paymentStatus: "paid" | "pending" | "waived";
  paymentMethod?: "cash" | "upi" | "card" | "complimentary";
  amountPaid?: number;
  passToken?: string;
  isCheckedIn: boolean;
  checkedInAt?: string | null;
  badgePrinted: boolean;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __urpass_desk_attendees: Record<string, OnsiteAttendee[]> | undefined;
}

if (!globalThis.__urpass_desk_attendees) {
  globalThis.__urpass_desk_attendees = {};
}

export function searchDeskAttendees(eventId: string, query: string): OnsiteAttendee[] {
  const store = globalThis.__urpass_desk_attendees!;
  const attendees = store[eventId] || [];
  if (!query.trim()) return attendees.slice(0, 50);

  const q = query.toLowerCase().trim();
  return attendees.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.phone && a.phone.includes(q)) ||
      (a.company && a.company.toLowerCase().includes(q)) ||
      (a.passToken && a.passToken.toLowerCase().includes(q))
  );
}

export interface WalkInPayload {
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  designation?: string;
  ticketTypeId?: string;
  ticketName?: string;
  badgeType: BadgeRoleType;
  paymentMethod: "cash" | "upi" | "card" | "complimentary";
  amountPaid?: number;
  autoCheckIn?: boolean;
  autoQueuePrint?: boolean;
  staffName?: string;
}

export function registerWalkIn(payload: WalkInPayload): OnsiteAttendee {
  const store = globalThis.__urpass_desk_attendees!;
  if (!store[payload.eventId]) store[payload.eventId] = [];

  const now = new Date().toISOString();
  const passToken = `PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const attendee: OnsiteAttendee = {
    id: `desk-att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: payload.eventId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    company: payload.company,
    designation: payload.designation,
    ticketTypeId: payload.ticketTypeId,
    ticketName: payload.ticketName || "General Admission",
    badgeType: payload.badgeType || "attendee",
    paymentStatus: payload.paymentMethod === "complimentary" ? "waived" : "paid",
    paymentMethod: payload.paymentMethod,
    amountPaid: payload.amountPaid || 0,
    passToken,
    isCheckedIn: payload.autoCheckIn ?? true,
    checkedInAt: payload.autoCheckIn ? now : null,
    badgePrinted: payload.autoQueuePrint ?? false,
    createdAt: now,
  };

  store[payload.eventId].unshift(attendee);

  if (payload.autoQueuePrint) {
    queueBadgePrint({
      eventId: payload.eventId,
      attendeeId: attendee.id,
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      attendeeCompany: attendee.company,
      ticketName: attendee.ticketName,
      badgeType: attendee.badgeType,
    });
  }

  return attendee;
}

export function updateDeskAttendee(
  eventId: string,
  attendeeId: string,
  updates: Partial<OnsiteAttendee>
): OnsiteAttendee | null {
  const store = globalThis.__urpass_desk_attendees!;
  const list = store[eventId] || [];
  const idx = list.findIndex((a) => a.id === attendeeId);
  if (idx < 0) return null;

  list[idx] = { ...list[idx], ...updates };
  return list[idx];
}

export function checkInDeskAttendee(eventId: string, attendeeId: string): OnsiteAttendee | null {
  return updateDeskAttendee(eventId, attendeeId, {
    isCheckedIn: true,
    checkedInAt: new Date().toISOString(),
  });
}
