import type { EventExhibitor, ExhibitorStaff, ExhibitorStatus, ExhibitorStaffRole } from "./types";
import { getAdminClient } from "./db";
import crypto from "crypto";

declare global {
  // eslint-disable-next-line no-var
  var __urpass_exhibitors: Record<string, EventExhibitor[]> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_exhibitor_staff: Record<string, ExhibitorStaff[]> | undefined;
}

if (!globalThis.__urpass_exhibitors) {
  globalThis.__urpass_exhibitors = {};
}
if (!globalThis.__urpass_exhibitor_staff) {
  globalThis.__urpass_exhibitor_staff = {};
}

export function generatePortalToken(): string {
  return `exh_${crypto.randomBytes(16).toString("hex")}`;
}

export function getEventExhibitors(eventId: string): EventExhibitor[] {
  const store = globalThis.__urpass_exhibitors!;
  return store[eventId] || [];
}

export async function getEventExhibitorsDb(eventId: string): Promise<EventExhibitor[]> {
  const admin = getAdminClient();
  if (!admin) return getEventExhibitors(eventId);

  try {
    const [{ data: exhibitors, error }, { data: staffList }, { data: leadsList }] = await Promise.all([
      admin
        .from("event_exhibitors")
        .select(`
          *,
          event_booths ( id, booth_number )
        `)
        .eq("event_id", eventId)
        .order("created_at", { ascending: true }),
      admin.from("exhibitor_staff").select("id, exhibitor_id").eq("event_id", eventId),
      admin.from("exhibitor_leads").select("id, exhibitor_id").eq("event_id", eventId),
    ]);

    if (error || !exhibitors) return getEventExhibitors(eventId);

    const staffCounts = new Map<string, number>();
    (staffList || []).forEach((s) => {
      staffCounts.set(s.exhibitor_id, (staffCounts.get(s.exhibitor_id) || 0) + 1);
    });

    const leadCounts = new Map<string, number>();
    (leadsList || []).forEach((l) => {
      leadCounts.set(l.exhibitor_id, (leadCounts.get(l.exhibitor_id) || 0) + 1);
    });

    const mapped: EventExhibitor[] = exhibitors.map((row: any) => ({
      id: row.id,
      eventId: row.event_id,
      boothId: row.booth_id || undefined,
      boothNumber: row.event_booths?.booth_number || undefined,
      name: row.name,
      companyName: row.company_name,
      logoUrl: row.logo_url || undefined,
      description: row.description || undefined,
      websiteUrl: row.website_url || undefined,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone || undefined,
      category: row.category || "Technology",
      productsServices: row.products_services || [],
      portalToken: row.portal_token,
      status: row.status as ExhibitorStatus,
      boothCheckedIn: row.booth_checked_in,
      boothCheckedInAt: row.booth_checked_in_at || null,
      staffCount: staffCounts.get(row.id) || 0,
      leadsCount: leadCounts.get(row.id) || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    globalThis.__urpass_exhibitors![eventId] = mapped;
    return mapped;
  } catch (err) {
    console.warn("[exhibitor-service] Error reading exhibitors from DB:", err);
    return getEventExhibitors(eventId);
  }
}

export function saveEventExhibitor(
  exhibitor: Partial<EventExhibitor> & { eventId: string; companyName: string; contactEmail: string }
): EventExhibitor {
  const store = globalThis.__urpass_exhibitors!;
  if (!store[exhibitor.eventId]) store[exhibitor.eventId] = [];
  const list = store[exhibitor.eventId];
  const now = new Date().toISOString();

  if (exhibitor.id) {
    const idx = list.findIndex((e) => e.id === exhibitor.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...exhibitor, updatedAt: now };
      store[exhibitor.eventId] = list;
      return list[idx];
    }
  }

  const newExhibitor: EventExhibitor = {
    id: exhibitor.id || `exh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: exhibitor.eventId,
    boothId: exhibitor.boothId,
    boothNumber: exhibitor.boothNumber,
    name: exhibitor.name || exhibitor.companyName,
    companyName: exhibitor.companyName,
    logoUrl: exhibitor.logoUrl,
    description: exhibitor.description,
    websiteUrl: exhibitor.websiteUrl,
    contactEmail: exhibitor.contactEmail,
    contactPhone: exhibitor.contactPhone,
    category: exhibitor.category || "Technology",
    productsServices: exhibitor.productsServices || [],
    portalToken: exhibitor.portalToken || generatePortalToken(),
    status: exhibitor.status || "active",
    boothCheckedIn: false,
    staffCount: 0,
    leadsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  list.push(newExhibitor);
  store[exhibitor.eventId] = list;
  return newExhibitor;
}

export async function saveEventExhibitorDb(
  exhibitor: Partial<EventExhibitor> & { eventId: string; companyName: string; contactEmail: string }
): Promise<EventExhibitor> {
  const local = saveEventExhibitor(exhibitor);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload = {
      event_id: exhibitor.eventId,
      booth_id: exhibitor.boothId || null,
      name: exhibitor.name || exhibitor.companyName,
      company_name: exhibitor.companyName,
      logo_url: exhibitor.logoUrl || null,
      description: exhibitor.description || null,
      website_url: exhibitor.websiteUrl || null,
      contact_email: exhibitor.contactEmail,
      contact_phone: exhibitor.contactPhone || null,
      category: exhibitor.category || "Technology",
      products_services: exhibitor.productsServices || [],
      portal_token: local.portalToken,
      status: exhibitor.status || "active",
      updated_at: new Date().toISOString(),
    };

    if (exhibitor.id && !exhibitor.id.startsWith("exh-")) {
      await admin.from("event_exhibitors").update(payload).eq("id", exhibitor.id);
    } else {
      const { data } = await admin.from("event_exhibitors").insert(payload).select().single();
      if (data?.id) local.id = data.id;
    }
  } catch (err) {
    console.warn("[exhibitor-service] Error saving exhibitor to DB:", err);
  }

  return local;
}

export function deleteEventExhibitor(eventId: string, exhibitorId: string): boolean {
  const store = globalThis.__urpass_exhibitors!;
  const list = getEventExhibitors(eventId);
  store[eventId] = list.filter((e) => e.id !== exhibitorId);
  return true;
}

export async function deleteEventExhibitorDb(eventId: string, exhibitorId: string): Promise<boolean> {
  deleteEventExhibitor(eventId, exhibitorId);
  const admin = getAdminClient();
  if (!admin) return true;

  try {
    await admin.from("event_exhibitors").delete().eq("id", exhibitorId);
    return true;
  } catch (err) {
    console.warn("[exhibitor-service] Error deleting exhibitor from DB:", err);
    return false;
  }
}

export async function getExhibitorByTokenDb(token: string): Promise<EventExhibitor | null> {
  const admin = getAdminClient();
  if (!admin) {
    for (const eventId of Object.keys(globalThis.__urpass_exhibitors || {})) {
      const found = (globalThis.__urpass_exhibitors![eventId] || []).find((e) => e.portalToken === token);
      if (found) return found;
    }
    return null;
  }

  try {
    const { data, error } = await admin
      .from("event_exhibitors")
      .select(`
        *,
        event_booths ( id, booth_number, hall_name, size_sqft )
      `)
      .eq("portal_token", token)
      .maybeSingle();

    if (error || !data) return null;

    const mapped: EventExhibitor = {
      id: data.id,
      eventId: data.event_id,
      boothId: data.booth_id || undefined,
      boothNumber: data.event_booths?.booth_number || undefined,
      name: data.name,
      companyName: data.company_name,
      logoUrl: data.logo_url || undefined,
      description: data.description || undefined,
      websiteUrl: data.website_url || undefined,
      contactEmail: data.contact_email,
      contactPhone: data.contact_phone || undefined,
      category: data.category || "Technology",
      productsServices: data.products_services || [],
      portalToken: data.portal_token,
      status: data.status as ExhibitorStatus,
      boothCheckedIn: data.booth_checked_in,
      boothCheckedInAt: data.booth_checked_in_at || null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return mapped;
  } catch (err) {
    console.warn("[exhibitor-service] Error finding exhibitor by token:", err);
    return null;
  }
}

export async function getExhibitorStaffDb(exhibitorId: string): Promise<ExhibitorStaff[]> {
  const admin = getAdminClient();
  if (!admin) {
    return globalThis.__urpass_exhibitor_staff![exhibitorId] || [];
  }

  try {
    const { data, error } = await admin
      .from("exhibitor_staff")
      .select("*")
      .eq("exhibitor_id", exhibitorId)
      .order("created_at", { ascending: true });

    if (error || !data) return globalThis.__urpass_exhibitor_staff![exhibitorId] || [];

    const mapped: ExhibitorStaff[] = data.map((d: any) => ({
      id: d.id,
      exhibitorId: d.exhibitor_id,
      eventId: d.event_id,
      name: d.name,
      email: d.email,
      phone: d.phone || undefined,
      role: d.role as ExhibitorStaffRole,
      pinCode: d.pin_code || undefined,
      canCaptureLeads: d.can_capture_leads,
      isCheckedIn: d.is_checked_in,
      checkedInAt: d.checked_in_at || null,
      createdAt: d.created_at,
    }));

    globalThis.__urpass_exhibitor_staff![exhibitorId] = mapped;
    return mapped;
  } catch (err) {
    console.warn("[exhibitor-service] Error reading staff from DB:", err);
    return globalThis.__urpass_exhibitor_staff![exhibitorId] || [];
  }
}

export async function saveExhibitorStaffDb(
  staff: Partial<ExhibitorStaff> & { exhibitorId: string; eventId: string; name: string; email: string }
): Promise<ExhibitorStaff> {
  const admin = getAdminClient();
  const now = new Date().toISOString();
  const local: ExhibitorStaff = {
    id: staff.id || `staff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    exhibitorId: staff.exhibitorId,
    eventId: staff.eventId,
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    role: staff.role || "booth_staff",
    pinCode: staff.pinCode || Math.floor(1000 + Math.random() * 9000).toString(),
    canCaptureLeads: staff.canCaptureLeads ?? true,
    isCheckedIn: staff.isCheckedIn ?? false,
    checkedInAt: staff.checkedInAt || null,
    createdAt: now,
  };

  if (!globalThis.__urpass_exhibitor_staff![staff.exhibitorId]) {
    globalThis.__urpass_exhibitor_staff![staff.exhibitorId] = [];
  }
  globalThis.__urpass_exhibitor_staff![staff.exhibitorId].push(local);

  if (!admin) return local;

  try {
    const payload = {
      exhibitor_id: staff.exhibitorId,
      event_id: staff.eventId,
      name: staff.name,
      email: staff.email,
      phone: staff.phone || null,
      role: staff.role || "booth_staff",
      pin_code: local.pinCode,
      can_capture_leads: local.canCaptureLeads,
      is_checked_in: local.isCheckedIn,
    };

    if (staff.id && !staff.id.startsWith("staff-")) {
      await admin.from("exhibitor_staff").update(payload).eq("id", staff.id);
    } else {
      const { data } = await admin.from("exhibitor_staff").insert(payload).select().single();
      if (data?.id) local.id = data.id;
    }
  } catch (err) {
    console.warn("[exhibitor-service] Error saving staff to DB:", err);
  }

  return local;
}

export async function toggleBoothCheckInDb(
  eventId: string,
  exhibitorId: string,
  checkedIn: boolean
): Promise<boolean> {
  const admin = getAdminClient();
  const now = new Date().toISOString();

  if (admin) {
    try {
      await admin
        .from("event_exhibitors")
        .update({
          booth_checked_in: checkedIn,
          booth_checked_in_at: checkedIn ? now : null,
        })
        .eq("id", exhibitorId);
    } catch (err) {
      console.warn("[exhibitor-service] Error toggling booth checkin:", err);
    }
  }

  const list = globalThis.__urpass_exhibitors![eventId] || [];
  const exh = list.find((e) => e.id === exhibitorId);
  if (exh) {
    exh.boothCheckedIn = checkedIn;
    exh.boothCheckedInAt = checkedIn ? now : null;
  }
  return true;
}

export function getExhibitorByToken(token: string): EventExhibitor | null {
  for (const eventId of Object.keys(globalThis.__urpass_exhibitors || {})) {
    const found = (globalThis.__urpass_exhibitors![eventId] || []).find((e) => e.portalToken === token);
    if (found) return found;
  }
  return null;
}

export function getExhibitorStaff(exhibitorId: string): ExhibitorStaff[] {
  return globalThis.__urpass_exhibitor_staff?.[exhibitorId] || [];
}

export function saveExhibitorStaff(
  staff: Partial<ExhibitorStaff> & { exhibitorId: string; eventId: string; name: string; email: string }
): ExhibitorStaff {
  const now = new Date().toISOString();
  const local: ExhibitorStaff = {
    id: staff.id || `staff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    exhibitorId: staff.exhibitorId,
    eventId: staff.eventId,
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    role: staff.role || "booth_staff",
    pinCode: staff.pinCode || Math.floor(1000 + Math.random() * 9000).toString(),
    canCaptureLeads: staff.canCaptureLeads ?? true,
    isCheckedIn: staff.isCheckedIn ?? false,
    checkedInAt: staff.checkedInAt || null,
    createdAt: now,
  };

  if (!globalThis.__urpass_exhibitor_staff![staff.exhibitorId]) {
    globalThis.__urpass_exhibitor_staff![staff.exhibitorId] = [];
  }
  globalThis.__urpass_exhibitor_staff![staff.exhibitorId].push(local);
  return local;
}

export function toggleBoothCheckIn(eventId: string, exhibitorId: string, checkedIn: boolean): boolean {
  const list = globalThis.__urpass_exhibitors![eventId] || [];
  const exh = list.find((e) => e.id === exhibitorId);
  if (exh) {
    exh.boothCheckedIn = checkedIn;
    exh.boothCheckedInAt = checkedIn ? new Date().toISOString() : null;
  }
  return true;
}

