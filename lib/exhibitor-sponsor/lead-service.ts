import type { ExhibitorLead, LeadQualification, LeadFollowUpStatus } from "./types";
import { getAdminClient } from "./db";

declare global {
  // eslint-disable-next-line no-var
  var __urpass_exhibitor_leads: Record<string, ExhibitorLead[]> | undefined;
}

if (!globalThis.__urpass_exhibitor_leads) {
  globalThis.__urpass_exhibitor_leads = {};
}

export interface CaptureLeadInput {
  eventId: string;
  exhibitorId: string;
  staffId?: string;
  staffName?: string;
  tokenOrAttendeeId: string;
  qualificationRating?: LeadQualification;
  notes?: string;
  interestedProducts?: string[];
  tags?: string[];
  customFields?: Record<string, string>;
}

export async function captureLeadFromQrDb(input: CaptureLeadInput): Promise<ExhibitorLead> {
  const admin = getAdminClient();
  const now = new Date().toISOString();
  let attendeeRecord: any = null;

  if (admin) {
    try {
      const cleanToken = input.tokenOrAttendeeId.trim();

      // First try finding pass by token
      const { data: pass } = await admin
        .from("passes")
        .select(`
          id,
          token,
          attendee:attendees (
            id,
            name,
            email,
            phone,
            ticket_types ( name )
          )
        `)
        .eq("token", cleanToken)
        .maybeSingle();

      if (pass?.attendee) {
        attendeeRecord = pass.attendee;
      } else {
        // Fallback: try finding attendee by id
        const { data: att } = await admin
          .from("attendees")
          .select(`
            id,
            name,
            email,
            phone,
            ticket_types ( name )
          `)
          .eq("id", cleanToken)
          .maybeSingle();

        if (att) attendeeRecord = att;
      }
    } catch (err) {
      console.warn("[lead-service] Error resolving attendee for lead scan:", err);
    }
  }

  const attendeeName = attendeeRecord?.name || "Trade Delegate";
  const attendeeEmail = attendeeRecord?.email || `attendee-${Date.now()}@event.urpass.space`;
  const attendeePhone = attendeeRecord?.phone || undefined;
  const attendeeId = attendeeRecord?.id || input.tokenOrAttendeeId;
  const ticketName = attendeeRecord?.ticket_types?.name || "Delegate Pass";

  const lead: ExhibitorLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: input.eventId,
    exhibitorId: input.exhibitorId,
    staffId: input.staffId,
    staffName: input.staffName || "Booth Scanner",
    attendeeId,
    attendeeName,
    attendeeEmail,
    attendeePhone,
    attendeeCompany: "Verified Visitor",
    ticketName,
    qualificationRating: input.qualificationRating || "warm",
    notes: input.notes || "",
    interestedProducts: input.interestedProducts || [],
    tags: input.tags || ["Booth Visitor"],
    followUpStatus: "pending",
    followUpRequired: true,
    consentConfirmed: true,
    customFields: input.customFields || {},
    capturedAt: now,
  };

  if (!globalThis.__urpass_exhibitor_leads![input.exhibitorId]) {
    globalThis.__urpass_exhibitor_leads![input.exhibitorId] = [];
  }
  globalThis.__urpass_exhibitor_leads![input.exhibitorId].unshift(lead);

  if (!admin) return lead;

  try {
    const { data: inserted } = await admin
      .from("exhibitor_leads")
      .insert({
        event_id: input.eventId,
        exhibitor_id: input.exhibitorId,
        staff_id: input.staffId || null,
        attendee_id: attendeeId && !attendeeId.startsWith("PASS-") ? attendeeId : null,
        attendee_name: attendeeName,
        attendee_email: attendeeEmail,
        attendee_phone: attendeePhone || null,
        attendee_company: lead.attendeeCompany || null,
        ticket_name: ticketName,
        qualification_rating: lead.qualificationRating,
        notes: lead.notes || null,
        interested_products: lead.interestedProducts,
        tags: lead.tags,
        follow_up_status: lead.followUpStatus,
        follow_up_required: lead.followUpRequired,
        consent_confirmed: true,
        custom_fields: lead.customFields,
      })
      .select()
      .single();

    if (inserted?.id) lead.id = inserted.id;
  } catch (err) {
    console.warn("[lead-service] Error saving lead to DB:", err);
  }

  return lead;
}

export async function getExhibitorLeadsDb(
  eventId: string,
  exhibitorId?: string,
  filters?: { staffId?: string; rating?: LeadQualification; followUpStatus?: LeadFollowUpStatus }
): Promise<ExhibitorLead[]> {
  const admin = getAdminClient();
  if (!admin) {
    const list = exhibitorId
      ? globalThis.__urpass_exhibitor_leads![exhibitorId] || []
      : Object.values(globalThis.__urpass_exhibitor_leads || {}).flat();
    return list;
  }

  try {
    let query = admin
      .from("exhibitor_leads")
      .select(`
        *,
        exhibitor_staff ( name )
      `)
      .eq("event_id", eventId)
      .order("captured_at", { ascending: false });

    if (exhibitorId) query = query.eq("exhibitor_id", exhibitorId);
    if (filters?.staffId) query = query.eq("staff_id", filters.staffId);
    if (filters?.rating) query = query.eq("qualification_rating", filters.rating);
    if (filters?.followUpStatus) query = query.eq("follow_up_status", filters.followUpStatus);

    const { data, error } = await query;
    if (error || !data) {
      const list = exhibitorId
        ? globalThis.__urpass_exhibitor_leads![exhibitorId] || []
        : Object.values(globalThis.__urpass_exhibitor_leads || {}).flat();
      return list;
    }

    const mapped: ExhibitorLead[] = data.map((d: any) => ({
      id: d.id,
      eventId: d.event_id,
      exhibitorId: d.exhibitor_id,
      staffId: d.staff_id || undefined,
      staffName: d.exhibitor_staff?.name || "Booth Staff",
      attendeeId: d.attendee_id || undefined,
      attendeeName: d.attendee_name,
      attendeeEmail: d.attendee_email,
      attendeePhone: d.attendee_phone || undefined,
      attendeeCompany: d.attendee_company || undefined,
      attendeeDesignation: d.attendee_designation || undefined,
      ticketName: d.ticket_name || undefined,
      qualificationRating: d.qualification_rating as LeadQualification,
      notes: d.notes || "",
      interestedProducts: d.interested_products || [],
      tags: d.tags || [],
      followUpStatus: d.follow_up_status as LeadFollowUpStatus,
      followUpRequired: d.follow_up_required,
      consentConfirmed: d.consent_confirmed,
      customFields: d.custom_fields || {},
      capturedAt: d.captured_at,
    }));

    return mapped;
  } catch (err) {
    console.warn("[lead-service] Error reading leads from DB:", err);
    return [];
  }
}

export async function updateLeadQualificationDb(
  leadId: string,
  updates: Partial<ExhibitorLead>
): Promise<boolean> {
  const admin = getAdminClient();
  if (!admin) return true;

  try {
    const payload: Record<string, unknown> = {};
    if (updates.qualificationRating) payload.qualification_rating = updates.qualificationRating;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.followUpStatus) payload.follow_up_status = updates.followUpStatus;
    if (updates.followUpRequired !== undefined) payload.follow_up_required = updates.followUpRequired;
    if (updates.interestedProducts) payload.interested_products = updates.interestedProducts;
    if (updates.tags) payload.tags = updates.tags;

    await admin.from("exhibitor_leads").update(payload).eq("id", leadId);
    return true;
  } catch (err) {
    console.warn("[lead-service] Error updating lead qualification in DB:", err);
    return false;
  }
}

export function exportLeadsToCsv(leads: ExhibitorLead[]): string {
  const headers = [
    "Lead ID",
    "Attendee Name",
    "Email",
    "Company",
    "Phone",
    "Designation",
    "Ticket Tier",
    "Rating",
    "Follow Up Status",
    "Follow Up Required",
    "Interested Products",
    "Tags",
    "Staff Member",
    "Notes",
    "Captured At",
  ];

  const escapeCell = (val: unknown) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = leads.map((l) => [
    escapeCell(l.id),
    escapeCell(l.attendeeName),
    escapeCell(l.attendeeEmail),
    escapeCell(l.attendeeCompany || ""),
    escapeCell(l.attendeePhone || ""),
    escapeCell(l.attendeeDesignation || ""),
    escapeCell(l.ticketName || ""),
    escapeCell(l.qualificationRating.toUpperCase()),
    escapeCell(l.followUpStatus.toUpperCase()),
    escapeCell(l.followUpRequired ? "YES" : "NO"),
    escapeCell((l.interestedProducts || []).join("; ")),
    escapeCell((l.tags || []).join(", ")),
    escapeCell(l.staffName || ""),
    escapeCell(l.notes || ""),
    escapeCell(new Date(l.capturedAt).toLocaleString()),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function captureLeadFromQr(input: CaptureLeadInput): ExhibitorLead {
  const now = new Date().toISOString();
  const lead: ExhibitorLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: input.eventId,
    exhibitorId: input.exhibitorId,
    staffId: input.staffId,
    staffName: input.staffName || "Booth Scanner",
    attendeeId: input.tokenOrAttendeeId,
    attendeeName: "Verified Delegate",
    attendeeEmail: `attendee-${Date.now()}@event.urpass.space`,
    attendeePhone: undefined,
    attendeeCompany: "Verified Visitor",
    ticketName: "Delegate Pass",
    qualificationRating: input.qualificationRating || "warm",
    notes: input.notes || "",
    interestedProducts: input.interestedProducts || [],
    tags: input.tags || ["Booth Visitor"],
    followUpStatus: "pending",
    followUpRequired: true,
    consentConfirmed: true,
    customFields: input.customFields || {},
    capturedAt: now,
  };

  if (!globalThis.__urpass_exhibitor_leads![input.exhibitorId]) {
    globalThis.__urpass_exhibitor_leads![input.exhibitorId] = [];
  }
  globalThis.__urpass_exhibitor_leads![input.exhibitorId].unshift(lead);
  return lead;
}

export function getExhibitorLeads(
  eventId: string,
  exhibitorId?: string,
  filters?: { staffId?: string; rating?: LeadQualification; followUpStatus?: LeadFollowUpStatus }
): ExhibitorLead[] {
  let list = exhibitorId
    ? globalThis.__urpass_exhibitor_leads?.[exhibitorId] || []
    : Object.values(globalThis.__urpass_exhibitor_leads || {}).flat();

  if (filters?.staffId) list = list.filter((l) => l.staffId === filters.staffId);
  if (filters?.rating) list = list.filter((l) => l.qualificationRating === filters.rating);
  if (filters?.followUpStatus) list = list.filter((l) => l.followUpStatus === filters.followUpStatus);
  return list;
}

export function updateLeadQualification(
  leadId: string,
  updates: Partial<ExhibitorLead>
): boolean {
  for (const exhId of Object.keys(globalThis.__urpass_exhibitor_leads || {})) {
    const list = globalThis.__urpass_exhibitor_leads![exhId] || [];
    const target = list.find((l) => l.id === leadId);
    if (target) {
      Object.assign(target, updates);
      return true;
    }
  }
  return false;
}

