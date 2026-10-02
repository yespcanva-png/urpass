import type { BadgeRoleType } from "./types";
import { queueBadgePrint } from "./badge-service";
import { getAdminClient } from "./db";
import crypto from "crypto";

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
  if (!query.trim()) return attendees.slice(0, 100);

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

export async function searchDeskAttendeesDb(eventId: string, query: string): Promise<OnsiteAttendee[]> {
  const admin = getAdminClient();
  if (!admin) {
    return searchDeskAttendees(eventId, query);
  }

  try {
    let qBuilder = admin
      .from("attendees")
      .select(`
        id,
        event_id,
        name,
        email,
        phone,
        pass_type,
        pass_status,
        application_status,
        payment_status,
        amount_paid,
        created_at,
        ticket_type_id,
        passes ( id, token, status ),
        ticket_types ( name ),
        check_ins ( id, checked_in_at )
      `)
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    const trimmed = query.trim();
    if (trimmed) {
      qBuilder = qBuilder.or(`name.ilike.%${trimmed}%,email.ilike.%${trimmed}%,phone.ilike.%${trimmed}%`);
    }

    const { data, error } = await qBuilder.limit(100);

    if (error || !data) {
      return searchDeskAttendees(eventId, query);
    }

    // Also fetch badge print queue to know if badge was printed
    const { data: queueData } = await admin
      .from("badge_print_queue")
      .select("attendee_id, status")
      .eq("event_id", eventId);

    const printedAttendeeIds = new Set(
      (queueData || []).filter((q) => q.status === "printed").map((q) => q.attendee_id)
    );

    const mapped: OnsiteAttendee[] = data.map((row: any) => {
      const pass = Array.isArray(row.passes) ? row.passes[0] : row.passes;
      const checkinList = Array.isArray(row.check_ins) ? row.check_ins : [];
      const latestCheckin = checkinList.length > 0 ? checkinList[0]?.checked_in_at : null;
      const isCheckedIn = row.pass_status === "checked_in" || Boolean(latestCheckin);

      let badgeRole: BadgeRoleType = "attendee";
      if (row.pass_type === "vip") badgeRole = "vip";
      else if (row.pass_type === "speaker") badgeRole = "speaker";
      else if (row.pass_type === "organizer" || row.pass_type === "staff") badgeRole = "staff";

      return {
        id: row.id,
        eventId: row.event_id,
        name: row.name || "Attendee",
        email: row.email || "",
        phone: row.phone || undefined,
        ticketTypeId: row.ticket_type_id || undefined,
        ticketName: row.ticket_types?.name || "General Admission",
        badgeType: badgeRole,
        paymentStatus: row.payment_status === "paid" || row.payment_status === "waived" ? row.payment_status : "paid",
        amountPaid: Number(row.amount_paid) || 0,
        passToken: pass?.token || undefined,
        isCheckedIn,
        checkedInAt: latestCheckin,
        badgePrinted: printedAttendeeIds.has(row.id),
        createdAt: row.created_at || new Date().toISOString(),
      };
    });

    // Merge in-memory newly created walk-ins that may not have propagated yet
    const memList = globalThis.__urpass_desk_attendees![eventId] || [];
    const seenIds = new Set(mapped.map((m) => m.id));
    for (const mem of memList) {
      if (!seenIds.has(mem.id)) {
        if (!trimmed || mem.name.toLowerCase().includes(trimmed.toLowerCase()) || mem.email.toLowerCase().includes(trimmed.toLowerCase())) {
          mapped.unshift(mem);
        }
      }
    }

    return mapped;
  } catch (err) {
    console.error("[desk-service] Error querying Supabase attendees:", err);
    return searchDeskAttendees(eventId, query);
  }
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

export async function registerWalkInDb(payload: WalkInPayload): Promise<OnsiteAttendee> {
  const admin = getAdminClient();
  const inMemoryAttendee = registerWalkIn(payload);

  if (!admin) {
    return inMemoryAttendee;
  }

  try {
    const now = new Date().toISOString();
    let passType = "participant";
    if (payload.badgeType === "vip") passType = "vip";
    else if (payload.badgeType === "speaker") passType = "speaker";
    else if (payload.badgeType === "staff") passType = "organizer";

    // 1. Insert into attendees table
    const { data: attData, error: attErr } = await admin
      .from("attendees")
      .insert({
        event_id: payload.eventId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        pass_type: passType,
        pass_status: payload.autoCheckIn ? "checked_in" : "generated",
        application_status: "approved",
        payment_status: payload.paymentMethod === "complimentary" ? "waived" : "paid",
        amount_paid: payload.amountPaid || 0,
        ticket_type_id: payload.ticketTypeId || null,
      })
      .select()
      .single();

    if (attErr || !attData) {
      console.warn("[desk-service] Could not insert walk-in into Supabase attendees, using in-memory:", attErr?.message);
      return inMemoryAttendee;
    }

    const realId = attData.id;
    const realPassToken = `PASS-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // 2. Insert into passes table
    await admin.from("passes").insert({
      event_id: payload.eventId,
      attendee_id: realId,
      token: realPassToken,
      status: "valid",
    });

    // 3. If auto-check in, insert into check_ins table
    if (payload.autoCheckIn) {
      await admin.from("check_ins").insert({
        event_id: payload.eventId,
        attendee_id: realId,
        checked_in_at: now,
      });
    }

    // 4. If auto queue print, insert into badge_print_queue table
    if (payload.autoQueuePrint) {
      await admin.from("badge_print_queue").insert({
        event_id: payload.eventId,
        attendee_id: realId,
        status: "queued",
      });
    }

    // 5. Update in-memory record to match real DB id and token
    const store = globalThis.__urpass_desk_attendees![payload.eventId] || [];
    const idx = store.findIndex((a) => a.id === inMemoryAttendee.id);
    const finalized: OnsiteAttendee = {
      ...inMemoryAttendee,
      id: realId,
      passToken: realPassToken,
    };
    if (idx >= 0) store[idx] = finalized;

    return finalized;
  } catch (err) {
    console.error("[desk-service] Error in registerWalkInDb:", err);
    return inMemoryAttendee;
  }
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

export async function updateDeskAttendeeDb(
  eventId: string,
  attendeeId: string,
  updates: Partial<OnsiteAttendee>
): Promise<OnsiteAttendee | null> {
  const local = updateDeskAttendee(eventId, attendeeId, updates);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload: Record<string, unknown> = {};
    if (updates.name) payload.name = updates.name;
    if (updates.email) payload.email = updates.email;
    if (updates.phone) payload.phone = updates.phone;
    if (updates.paymentStatus) payload.payment_status = updates.paymentStatus;
    if (updates.amountPaid !== undefined) payload.amount_paid = updates.amountPaid;

    if (Object.keys(payload).length > 0) {
      await admin.from("attendees").update(payload).eq("id", attendeeId);
    }
  } catch (err) {
    console.warn("[desk-service] Failed to update attendee in Supabase:", err);
  }

  return local;
}

export function checkInDeskAttendee(eventId: string, attendeeId: string): OnsiteAttendee | null {
  return updateDeskAttendee(eventId, attendeeId, {
    isCheckedIn: true,
    checkedInAt: new Date().toISOString(),
  });
}

export async function checkInDeskAttendeeDb(
  eventId: string,
  attendeeId: string,
  staffName?: string
): Promise<OnsiteAttendee | null> {
  const local = checkInDeskAttendee(eventId, attendeeId);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const now = new Date().toISOString();
    await admin.from("check_ins").insert({
      event_id: eventId,
      attendee_id: attendeeId,
      checked_in_at: now,
    });
    await admin.from("attendees").update({ pass_status: "checked_in" }).eq("id", attendeeId);
  } catch (err) {
    console.warn("[desk-service] Error inserting checkin into Supabase:", err);
  }

  return local;
}
