import type {
  BadgeTemplate,
  BadgeRoleType,
  BadgeOrientation,
  BadgeSizePreset,
  BadgeTemplateLayout,
  BadgePrintQueueItem,
  BadgePrintLog,
} from "./types";
import { BADGE_SIZE_PRESETS } from "./types";
import { getAdminClient } from "./db";

export const DEFAULT_ROLE_COLORS: Record<
  BadgeRoleType,
  { headerColor: string; accentColor: string; textColor: string; label: string }
> = {
  attendee: {
    headerColor: "#1E293B",
    accentColor: "#3B82F6",
    textColor: "#0F172A",
    label: "ATTENDEE",
  },
  vip: {
    headerColor: "#78350F",
    accentColor: "#F59E0B",
    textColor: "#451A03",
    label: "VIP ALL-ACCESS",
  },
  speaker: {
    headerColor: "#4C1D95",
    accentColor: "#8B5CF6",
    textColor: "#2E1065",
    label: "SPEAKER / KEYNOTE",
  },
  staff: {
    headerColor: "#065F46",
    accentColor: "#10B981",
    textColor: "#064E3B",
    label: "EVENT STAFF",
  },
  sponsor: {
    headerColor: "#1E1B4B",
    accentColor: "#6366F1",
    textColor: "#312E81",
    label: "SPONSOR PARTNER",
  },
  exhibitor: {
    headerColor: "#831843",
    accentColor: "#EC4899",
    textColor: "#700735",
    label: "EXHIBITOR BOOTH",
  },
  custom: {
    headerColor: "#18181B",
    accentColor: "#6D28D9",
    textColor: "#18181B",
    label: "DELEGATE PASS",
  },
};

export function createDefaultBadgeLayout(
  role: BadgeRoleType,
  orientation: BadgeOrientation = "portrait"
): BadgeTemplateLayout {
  const cfg = DEFAULT_ROLE_COLORS[role] || DEFAULT_ROLE_COLORS.attendee;
  const isPortrait = orientation === "portrait";

  return {
    headerColor: cfg.headerColor,
    headerTextColor: "#FFFFFF",
    headerTitle: cfg.label,
    badgeTypeTag: role,
    accentColor: cfg.accentColor,
    backgroundColor: "#FFFFFF",
    textColor: cfg.textColor,
    showLanyardSlot: isPortrait,
    showQrCode: true,
    elements: [
      {
        id: "badge-header-band",
        type: "shape",
        label: "Header Role Band",
        xPercent: 0,
        yPercent: 0,
        fontSizePx: 14,
        fontWeight: "bold",
        color: cfg.headerColor,
        align: "center",
        widthPercent: 100,
        heightPercent: isPortrait ? 14 : 18,
        backgroundColor: cfg.headerColor,
        visible: true,
      },
      {
        id: "badge-role-title",
        type: "text",
        label: "Role Title",
        staticText: cfg.label,
        xPercent: 50,
        yPercent: isPortrait ? 7 : 9,
        fontSizePx: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        align: "center",
        visible: true,
      },
      {
        id: "badge-attendee-name",
        type: "dynamic",
        label: "Attendee Full Name",
        field: "attendee.name",
        xPercent: 50,
        yPercent: isPortrait ? 28 : 34,
        fontSizePx: 22,
        fontWeight: "bold",
        color: "#0F172A",
        align: "center",
        visible: true,
      },
      {
        id: "badge-attendee-company",
        type: "dynamic",
        label: "Company / Organization",
        field: "attendee.company",
        xPercent: 50,
        yPercent: isPortrait ? 38 : 46,
        fontSizePx: 14,
        fontWeight: "normal",
        color: "#475569",
        align: "center",
        visible: true,
      },
      {
        id: "badge-ticket-tier",
        type: "dynamic",
        label: "Ticket Tier",
        field: "ticket.name",
        xPercent: 50,
        yPercent: isPortrait ? 46 : 56,
        fontSizePx: 12,
        fontWeight: "bold",
        color: cfg.accentColor,
        align: "center",
        visible: true,
      },
      {
        id: "badge-qr-code",
        type: "qr",
        label: "Pass QR Code",
        xPercent: 50,
        yPercent: isPortrait ? 68 : 65,
        fontSizePx: 10,
        fontWeight: "normal",
        color: "#000000",
        align: "center",
        widthPercent: isPortrait ? 34 : 26,
        heightPercent: isPortrait ? 22 : 32,
        visible: true,
      },
      {
        id: "badge-event-footer",
        type: "dynamic",
        label: "Event Name & Venue",
        field: "event.name",
        xPercent: 50,
        yPercent: isPortrait ? 92 : 90,
        fontSizePx: 11,
        fontWeight: "normal",
        color: "#64748B",
        align: "center",
        visible: true,
      },
    ],
  };
}

export function buildDefaultBadgeTemplates(eventId: string): BadgeTemplate[] {
  const roles: BadgeRoleType[] = ["attendee", "vip", "speaker", "staff", "sponsor", "exhibitor"];
  const now = new Date().toISOString();

  return roles.map((role, idx) => {
    const sizeConfig = BADGE_SIZE_PRESETS.lanyard_100x150;
    return {
      id: `tmpl-${eventId}-${role}`,
      eventId,
      name: `${DEFAULT_ROLE_COLORS[role].label} Badge`,
      badgeType: role,
      orientation: "portrait",
      sizePreset: "lanyard_100x150",
      widthMm: sizeConfig.widthMm,
      heightMm: sizeConfig.heightMm,
      layout: createDefaultBadgeLayout(role, "portrait"),
      isDefault: idx === 0,
      createdAt: now,
      updatedAt: now,
    };
  });
}

// In-memory fallback repository for badge templates
declare global {
  // eslint-disable-next-line no-var
  var __urpass_badge_templates: Record<string, BadgeTemplate[]> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_badge_queue: Record<string, BadgePrintQueueItem[]> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_badge_logs: Record<string, BadgePrintLog[]> | undefined;
}

if (!globalThis.__urpass_badge_templates) {
  globalThis.__urpass_badge_templates = {};
}
if (!globalThis.__urpass_badge_queue) {
  globalThis.__urpass_badge_queue = {};
}
if (!globalThis.__urpass_badge_logs) {
  globalThis.__urpass_badge_logs = {};
}

export function getBadgeTemplates(eventId: string): BadgeTemplate[] {
  const store = globalThis.__urpass_badge_templates!;
  if (!store[eventId] || store[eventId].length === 0) {
    store[eventId] = buildDefaultBadgeTemplates(eventId);
  }
  return store[eventId];
}

export async function getBadgeTemplatesDb(eventId: string): Promise<BadgeTemplate[]> {
  const admin = getAdminClient();
  if (!admin) return getBadgeTemplates(eventId);

  try {
    const { data, error } = await admin
      .from("event_badge_templates")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      // Seed default templates into DB
      const defaults = buildDefaultBadgeTemplates(eventId);
      const rows = defaults.map((d) => ({
        event_id: eventId,
        name: d.name,
        badge_type: d.badgeType,
        orientation: d.orientation,
        size_preset: d.sizePreset,
        width_mm: d.widthMm,
        height_mm: d.heightMm,
        layout_json: d.layout,
        is_default: d.isDefault,
      }));

      const { data: inserted } = await admin.from("event_badge_templates").insert(rows).select();
      if (inserted && inserted.length > 0) {
        const seeded = inserted.map((row: any) => ({
          id: row.id,
          eventId: row.event_id,
          name: row.name,
          badgeType: row.badge_type as BadgeRoleType,
          orientation: row.orientation as BadgeOrientation,
          sizePreset: row.size_preset as BadgeSizePreset,
          widthMm: Number(row.width_mm),
          heightMm: Number(row.height_mm),
          layout: row.layout_json,
          isDefault: row.is_default,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        globalThis.__urpass_badge_templates![eventId] = seeded;
        return seeded;
      }

      return getBadgeTemplates(eventId);
    }

    const templates: BadgeTemplate[] = data.map((row: any) => ({
      id: row.id,
      eventId: row.event_id,
      name: row.name,
      badgeType: row.badge_type as BadgeRoleType,
      orientation: row.orientation as BadgeOrientation,
      sizePreset: row.size_preset as BadgeSizePreset,
      widthMm: Number(row.width_mm),
      heightMm: Number(row.height_mm),
      layout: row.layout_json,
      isDefault: row.is_default,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    globalThis.__urpass_badge_templates![eventId] = templates;
    return templates;
  } catch (err) {
    console.warn("[badge-service] Error reading templates from DB:", err);
    return getBadgeTemplates(eventId);
  }
}

export function saveBadgeTemplate(template: BadgeTemplate): BadgeTemplate {
  const store = globalThis.__urpass_badge_templates!;
  const list = getBadgeTemplates(template.eventId);
  const existingIdx = list.findIndex((t) => t.id === template.id);
  const updated = { ...template, updatedAt: new Date().toISOString() };

  if (existingIdx >= 0) {
    list[existingIdx] = updated;
  } else {
    list.push(updated);
  }
  store[template.eventId] = list;
  return updated;
}

export async function saveBadgeTemplateDb(template: BadgeTemplate): Promise<BadgeTemplate> {
  const local = saveBadgeTemplate(template);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload = {
      event_id: template.eventId,
      name: template.name,
      badge_type: template.badgeType,
      orientation: template.orientation,
      size_preset: template.sizePreset,
      width_mm: template.widthMm,
      height_mm: template.heightMm,
      layout_json: template.layout,
      is_default: template.isDefault,
      updated_at: new Date().toISOString(),
    };

    if (template.id && !template.id.startsWith("tmpl-")) {
      await admin.from("event_badge_templates").update(payload).eq("id", template.id);
    } else {
      const { data } = await admin.from("event_badge_templates").insert(payload).select().single();
      if (data?.id) {
        local.id = data.id;
      }
    }
  } catch (err) {
    console.warn("[badge-service] Error saving badge template to DB:", err);
  }

  return local;
}

export function getBadgePrintQueue(eventId: string): BadgePrintQueueItem[] {
  const store = globalThis.__urpass_badge_queue!;
  return store[eventId] || [];
}

export async function getBadgePrintQueueDb(eventId: string): Promise<BadgePrintQueueItem[]> {
  const admin = getAdminClient();
  if (!admin) return getBadgePrintQueue(eventId);

  try {
    const { data, error } = await admin
      .from("badge_print_queue")
      .select(`
        id,
        event_id,
        attendee_id,
        template_id,
        status,
        printer_id,
        printed_by,
        printed_at,
        created_at,
        attendees ( id, name, email, phone, pass_type, ticket_type_id, ticket_types ( name ) )
      `)
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error || !data) return getBadgePrintQueue(eventId);

    const mapped: BadgePrintQueueItem[] = data.map((row: any) => {
      const att = row.attendees;
      let badgeRole: BadgeRoleType = "attendee";
      if (att?.pass_type === "vip") badgeRole = "vip";
      else if (att?.pass_type === "speaker") badgeRole = "speaker";
      else if (att?.pass_type === "organizer" || att?.pass_type === "staff") badgeRole = "staff";

      return {
        id: row.id,
        eventId: row.event_id,
        attendeeId: row.attendee_id,
        attendeeName: att?.name || "Attendee",
        attendeeEmail: att?.email || "",
        ticketName: att?.ticket_types?.name || "General Admission",
        badgeType: badgeRole,
        templateId: row.template_id || undefined,
        status: row.status as BadgePrintQueueItem["status"],
        printerId: row.printer_id || undefined,
        printedAt: row.printed_at || undefined,
        printedBy: row.printed_by || undefined,
        createdAt: row.created_at,
      };
    });

    // Merge in-memory queue items that haven't been pushed to DB yet
    const memList = globalThis.__urpass_badge_queue![eventId] || [];
    const seen = new Set(mapped.map((m) => m.id));
    for (const mem of memList) {
      if (!seen.has(mem.id)) mapped.unshift(mem);
    }

    return mapped;
  } catch (err) {
    console.warn("[badge-service] Error fetching badge print queue from DB:", err);
    return getBadgePrintQueue(eventId);
  }
}

export function queueBadgePrint(item: Omit<BadgePrintQueueItem, "id" | "createdAt" | "status">): BadgePrintQueueItem {
  const store = globalThis.__urpass_badge_queue!;
  if (!store[item.eventId]) store[item.eventId] = [];
  const newItem: BadgePrintQueueItem = {
    ...item,
    id: `print-q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    status: "queued",
    createdAt: new Date().toISOString(),
  };
  store[item.eventId].unshift(newItem);
  return newItem;
}

export async function queueBadgePrintDb(
  item: Omit<BadgePrintQueueItem, "id" | "createdAt" | "status">
): Promise<BadgePrintQueueItem> {
  const local = queueBadgePrint(item);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const { data } = await admin
      .from("badge_print_queue")
      .insert({
        event_id: item.eventId,
        attendee_id: item.attendeeId,
        template_id: item.templateId || null,
        status: "queued",
      })
      .select()
      .single();

    if (data?.id) local.id = data.id;
  } catch (err) {
    console.warn("[badge-service] Error inserting print queue into DB:", err);
  }

  return local;
}

export async function bulkQueueApprovedAttendeesDb(eventId: string): Promise<number> {
  const admin = getAdminClient();
  if (!admin) return 0;

  try {
    const [{ data: attendees }, { data: existingQueue }] = await Promise.all([
      admin
        .from("attendees")
        .select("id, name, email, pass_type")
        .eq("event_id", eventId)
        .eq("application_status", "approved"),
      admin.from("badge_print_queue").select("attendee_id").eq("event_id", eventId),
    ]);

    if (!attendees || attendees.length === 0) return 0;

    const queuedSet = new Set((existingQueue || []).map((q) => q.attendee_id));
    const toInsert = attendees
      .filter((a) => !queuedSet.has(a.id))
      .map((a) => ({
        event_id: eventId,
        attendee_id: a.id,
        status: "queued",
      }));

    if (toInsert.length === 0) return 0;

    await admin.from("badge_print_queue").insert(toInsert);
    return toInsert.length;
  } catch (err) {
    console.warn("[badge-service] Error bulk queueing attendees in DB:", err);
    return 0;
  }
}

export function updateBadgePrintStatus(
  eventId: string,
  queueId: string,
  status: BadgePrintQueueItem["status"],
  printedBy?: string
): BadgePrintQueueItem | null {
  const store = globalThis.__urpass_badge_queue!;
  const list = store[eventId] || [];
  const item = list.find((q) => q.id === queueId);
  if (!item) return null;
  item.status = status;
  if (status === "printed") {
    item.printedAt = new Date().toISOString();
    if (printedBy) item.printedBy = printedBy;
  }
  return item;
}

export async function updateBadgePrintStatusDb(
  eventId: string,
  queueId: string,
  status: BadgePrintQueueItem["status"],
  printedBy?: string
): Promise<BadgePrintQueueItem | null> {
  const local = updateBadgePrintStatus(eventId, queueId, status, printedBy);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (status === "printed") {
      payload.printed_at = new Date().toISOString();
    }
    await admin.from("badge_print_queue").update(payload).eq("id", queueId);
  } catch (err) {
    console.warn("[badge-service] Error updating badge status in DB:", err);
  }

  return local;
}

export function recordBadgeReprint(log: Omit<BadgePrintLog, "id" | "createdAt">): BadgePrintLog {
  const store = globalThis.__urpass_badge_logs!;
  if (!store[log.eventId]) store[log.eventId] = [];
  const newLog: BadgePrintLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  store[log.eventId].unshift(newLog);
  return newLog;
}

export async function recordBadgeReprintDb(
  log: Omit<BadgePrintLog, "id" | "createdAt">
): Promise<BadgePrintLog> {
  const local = recordBadgeReprint(log);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const { data } = await admin
      .from("badge_print_logs")
      .insert({
        event_id: log.eventId,
        attendee_id: log.attendeeId,
        template_id: log.templateId || null,
        printer_id: log.printerId || null,
        print_type: log.printType,
        reprint_reason: log.reprintReason || null,
        printed_by_name: log.printedByName || "Desk Staff",
      })
      .select()
      .single();

    if (data?.id) local.id = data.id;
  } catch (err) {
    console.warn("[badge-service] Error inserting reprint log into DB:", err);
  }

  return local;
}

export function getBadgePrintLogs(eventId: string): BadgePrintLog[] {
  const store = globalThis.__urpass_badge_logs!;
  return store[eventId] || [];
}

export async function getBadgePrintLogsDb(eventId: string): Promise<BadgePrintLog[]> {
  const admin = getAdminClient();
  if (!admin) return getBadgePrintLogs(eventId);

  try {
    const { data, error } = await admin
      .from("badge_print_logs")
      .select(`
        id,
        event_id,
        attendee_id,
        template_id,
        printer_id,
        print_type,
        reprint_reason,
        printed_by_name,
        created_at,
        attendees ( name )
      `)
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) return getBadgePrintLogs(eventId);

    const mapped: BadgePrintLog[] = data.map((d: any) => ({
      id: d.id,
      eventId: d.event_id,
      attendeeId: d.attendee_id,
      attendeeName: d.attendees?.name || "Attendee",
      templateId: d.template_id || undefined,
      printerId: d.printer_id || undefined,
      printType: d.print_type as BadgePrintLog["printType"],
      reprintReason: d.reprint_reason || undefined,
      printedByName: d.printed_by_name || undefined,
      createdAt: d.created_at,
    }));

    return mapped;
  } catch (err) {
    console.warn("[badge-service] Error reading reprint logs from DB:", err);
    return getBadgePrintLogs(eventId);
  }
}
