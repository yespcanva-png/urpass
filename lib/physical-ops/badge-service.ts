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
        fontWeight: "black",
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
        yPercent: isPortrait ? 30 : 36,
        fontSizePx: isPortrait ? 26 : 22,
        fontWeight: "black",
        color: "#0F172A",
        align: "center",
        visible: true,
      },
      {
        id: "badge-attendee-company",
        type: "dynamic",
        label: "Company / Affiliation",
        field: "attendee.company",
        xPercent: 50,
        yPercent: isPortrait ? 39 : 47,
        fontSizePx: isPortrait ? 15 : 14,
        fontWeight: "bold",
        color: "#475569",
        align: "center",
        visible: true,
      },
      {
        id: "badge-ticket-name",
        type: "dynamic",
        label: "Ticket Tier",
        field: "ticket.name",
        xPercent: 50,
        yPercent: isPortrait ? 47 : 56,
        fontSizePx: 12,
        fontWeight: "bold",
        color: cfg.accentColor,
        align: "center",
        visible: true,
      },
      {
        id: "badge-qr-code",
        type: "qr",
        label: "Validation QR Code",
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

export function getBadgePrintQueue(eventId: string): BadgePrintQueueItem[] {
  const store = globalThis.__urpass_badge_queue!;
  return store[eventId] || [];
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

export function getBadgePrintLogs(eventId: string): BadgePrintLog[] {
  const store = globalThis.__urpass_badge_logs!;
  return store[eventId] || [];
}
