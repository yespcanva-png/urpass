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

  const rawInput = input.tokenOrAttendeeId.trim();
  const cleanToken = rawInput
    .replace(/^https?:\/\/[^\/]+\/pass\//i, "")
    .replace(/^pass\//i, "")
    .trim();

  if (admin) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanToken);

      // 1. First try finding pass by pass_token or pass id
      let passQuery = admin
        .from("passes")
        .select(`
          id,
          pass_token,
          attendee_id,
          attendees (
            id,
            name,
            email,
            phone,
            custom_responses,
            ticket_types ( name )
          )
        `);

      if (isUuid) {
        passQuery = passQuery.or(`pass_token.eq.${cleanToken},id.eq.${cleanToken}`);
      } else {
        passQuery = passQuery.eq("pass_token", cleanToken);
      }

      const { data: pass } = await passQuery.maybeSingle();

      if (pass?.attendees) {
        attendeeRecord = pass.attendees;
      } else {
        // Fallback: try finding attendee directly by ID if cleanToken is UUID
        if (isUuid) {
          const { data: att } = await admin
            .from("attendees")
            .select(`
              id,
              name,
              email,
              phone,
              custom_responses,
              ticket_types ( name )
            `)
            .eq("id", cleanToken)
            .maybeSingle();

          if (att) attendeeRecord = att;
        }
      }
    } catch (err) {
      console.warn("[lead-service] Error resolving attendee for lead scan:", err);
    }
  }

  const customResponses = (attendeeRecord?.custom_responses as Record<string, unknown>) || {};
  let extractedCompany = "";
  let extractedDesignation = "";

  if (typeof customResponses === "object" && customResponses !== null) {
    for (const [key, val] of Object.entries(customResponses)) {
      const lowerKey = key.toLowerCase();
      if (typeof val === "string" && val.trim()) {
        if (!extractedCompany && (lowerKey.includes("company") || lowerKey.includes("org") || lowerKey.includes("college") || lowerKey.includes("work") || lowerKey.includes("university") || lowerKey.includes("institution"))) {
          extractedCompany = val.trim();
        }
        if (!extractedDesignation && (lowerKey.includes("designation") || lowerKey.includes("role") || lowerKey.includes("title") || lowerKey.includes("job") || lowerKey.includes("position"))) {
          extractedDesignation = val.trim();
        }
      }
    }
  }

  const attendeeName = attendeeRecord?.name || (cleanToken ? `Attendee (${cleanToken.slice(0, 8)})` : "Attendee");
  const attendeeEmail = attendeeRecord?.email || "";
  const attendeePhone = attendeeRecord?.phone || undefined;
  const rawAttendeeId = attendeeRecord?.id || input.tokenOrAttendeeId;
  const isAttendeeUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawAttendeeId);
  const attendeeId = isAttendeeUuid ? rawAttendeeId : undefined;
  const ticketName = attendeeRecord?.ticket_types?.name || (attendeeRecord ? "Standard Pass" : "Delegate Pass");
  const attendeeCompany = extractedCompany || attendeeRecord?.company || "";
  const attendeeDesignation = extractedDesignation || attendeeRecord?.designation || "";

  const lead: ExhibitorLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: input.eventId,
    exhibitorId: input.exhibitorId,
    staffId: input.staffId,
    staffName: input.staffName || "Booth Scanner",
    attendeeId: rawAttendeeId,
    attendeeName,
    attendeeEmail,
    attendeePhone,
    attendeeCompany: attendeeCompany || undefined,
    attendeeDesignation: attendeeDesignation || undefined,
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
    const isStaffUuid = input.staffId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.staffId);

    if (input.eventId && input.exhibitorId) {
      const { data: inserted, error: insertErr } = await admin
        .from("exhibitor_leads")
        .insert({
          event_id: input.eventId,
          exhibitor_id: input.exhibitorId,
          staff_id: isStaffUuid ? input.staffId : null,
          attendee_id: attendeeId || null,
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

      if (!insertErr && inserted?.id) {
        lead.id = inserted.id;
      }
    }
  } catch (err) {
    console.warn("[lead-service] Error saving lead to relational DB:", err);
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
  const rawInput = input.tokenOrAttendeeId.trim();
  const cleanToken = rawInput
    .replace(/^https?:\/\/[^\/]+\/pass\//i, "")
    .replace(/^pass\//i, "")
    .trim();
  const lead: ExhibitorLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: input.eventId,
    exhibitorId: input.exhibitorId,
    staffId: input.staffId,
    staffName: input.staffName || "Booth Scanner",
    attendeeId: cleanToken,
    attendeeName: "Trade Delegate",
    attendeeEmail: "",
    attendeePhone: undefined,
    attendeeCompany: undefined,
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

