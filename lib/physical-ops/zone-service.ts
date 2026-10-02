import type {
  EventZone,
  AccessRule,
  ZoneScanRecord,
  ScanDirection,
  ScanValidationStatus,
  BadgeRoleType,
} from "./types";

export const DEFAULT_PRESET_ZONES = [
  { name: "Main Keynote Hall", zoneType: "main_hall" as const, color: "#6D28D9", capacity: 800 },
  { name: "VIP Lounge & Speakers Room", zoneType: "vip" as const, color: "#F59E0B", capacity: 80 },
  { name: "Exhibition & Startup Expo", zoneType: "expo" as const, color: "#EC4899", capacity: 1200 },
  { name: "Backstage & Production", zoneType: "backstage" as const, color: "#DC2626", capacity: 40 },
  { name: "Staff Operations Office", zoneType: "staff_only" as const, color: "#059669", capacity: 25 },
  { name: "Dining & Catering Pavilion", zoneType: "dining" as const, color: "#D97706", capacity: 600 },
];

declare global {
  // eslint-disable-next-line no-var
  var __urpass_zones: Record<string, EventZone[]> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_access_rules: Record<string, AccessRule[]> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_zone_scans: Record<string, ZoneScanRecord[]> | undefined;
}

if (!globalThis.__urpass_zones) {
  globalThis.__urpass_zones = {};
}
if (!globalThis.__urpass_access_rules) {
  globalThis.__urpass_access_rules = {};
}
if (!globalThis.__urpass_zone_scans) {
  globalThis.__urpass_zone_scans = {};
}

export function getEventZones(eventId: string): EventZone[] {
  const store = globalThis.__urpass_zones!;
  if (!store[eventId] || store[eventId].length === 0) {
    store[eventId] = DEFAULT_PRESET_ZONES.map((pz, idx) => ({
      id: `zone-${eventId}-${pz.zoneType}`,
      eventId,
      name: pz.name,
      description: `Default zone for ${pz.name}`,
      zoneType: pz.zoneType,
      color: pz.color,
      capacity: pz.capacity,
      currentOccupancy: 0,
      peakOccupancy: 0,
      position: idx,
      createdAt: new Date().toISOString(),
    }));
  }
  return store[eventId];
}

export function saveEventZone(zone: Partial<EventZone> & { eventId: string; name: string }): EventZone {
  const store = globalThis.__urpass_zones!;
  const list = getEventZones(zone.eventId);
  const now = new Date().toISOString();

  if (zone.id) {
    const idx = list.findIndex((z) => z.id === zone.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...zone };
      store[zone.eventId] = list;
      return list[idx];
    }
  }

  const newZone: EventZone = {
    id: zone.id || `zone-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: zone.eventId,
    name: zone.name,
    description: zone.description || "",
    zoneType: zone.zoneType || "custom",
    color: zone.color || "#6D28D9",
    capacity: zone.capacity || 100,
    currentOccupancy: 0,
    peakOccupancy: 0,
    position: list.length,
    createdAt: now,
  };
  list.push(newZone);
  store[zone.eventId] = list;
  return newZone;
}

export function deleteEventZone(eventId: string, zoneId: string): boolean {
  const store = globalThis.__urpass_zones!;
  const list = getEventZones(eventId);
  const filtered = list.filter((z) => z.id !== zoneId);
  store[eventId] = filtered;
  return true;
}

export function getAccessRules(eventId: string, zoneId?: string): AccessRule[] {
  const store = globalThis.__urpass_access_rules!;
  if (!store[eventId]) {
    // Generate default baseline rules
    store[eventId] = [
      {
        id: `rule-${eventId}-vip`,
        eventId,
        zoneId: `zone-${eventId}-vip`,
        name: "VIP Lounge Exclusive Entry",
        ruleType: "badge_type",
        allowedTicketTypeIds: [],
        allowedBadgeTypes: ["vip", "speaker", "sponsor"],
        allowedRoles: ["Organizer", "VIP Guest"],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `rule-${eventId}-backstage`,
        eventId,
        zoneId: `zone-${eventId}-backstage`,
        name: "Backstage & Production Clearance",
        ruleType: "badge_type",
        allowedTicketTypeIds: [],
        allowedBadgeTypes: ["staff", "speaker"],
        allowedRoles: ["Crew", "Audio-Visual Lead"],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
  const rules = store[eventId];
  return zoneId ? rules.filter((r) => r.zoneId === zoneId) : rules;
}

export function saveAccessRule(rule: Partial<AccessRule> & { eventId: string; zoneId: string; name: string }): AccessRule {
  const store = globalThis.__urpass_access_rules!;
  const list = getAccessRules(rule.eventId);
  const now = new Date().toISOString();

  if (rule.id) {
    const idx = list.findIndex((r) => r.id === rule.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...rule };
      store[rule.eventId] = list;
      return list[idx];
    }
  }

  const newRule: AccessRule = {
    id: rule.id || `rule-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: rule.eventId,
    zoneId: rule.zoneId,
    name: rule.name,
    ruleType: rule.ruleType || "ticket_type",
    allowedTicketTypeIds: rule.allowedTicketTypeIds || [],
    allowedBadgeTypes: rule.allowedBadgeTypes || [],
    allowedRoles: rule.allowedRoles || [],
    sessionId: rule.sessionId,
    startTime: rule.startTime,
    endTime: rule.endTime,
    dayOfEvent: rule.dayOfEvent,
    isActive: rule.isActive ?? true,
    createdAt: now,
  };
  list.push(newRule);
  store[rule.eventId] = list;
  return newRule;
}

export function deleteAccessRule(eventId: string, ruleId: string): boolean {
  const store = globalThis.__urpass_access_rules!;
  const list = getAccessRules(eventId);
  store[eventId] = list.filter((r) => r.id !== ruleId);
  return true;
}

export interface ZoneEvaluationInput {
  attendee: {
    id: string;
    name: string;
    ticketTypeId?: string;
    badgeType?: BadgeRoleType;
    role?: string;
  };
  zoneId: string;
  direction: ScanDirection;
  currentZone: EventZone;
  rules: AccessRule[];
  override?: boolean;
}

export interface ZoneEvaluationResult {
  allowed: boolean;
  status: ScanValidationStatus;
  reason?: string;
  isCapacityFull?: boolean;
  occupancyPercent: number;
}

/**
 * High-speed atomic rule validation for Zone entry/exit
 */
export function evaluateZoneAccess(input: ZoneEvaluationInput): ZoneEvaluationResult {
  const { currentZone, direction, attendee, rules, override } = input;
  const occupancy = currentZone.currentOccupancy;
  const capacity = currentZone.capacity;
  const occupancyPercent = capacity > 0 ? Math.round((occupancy / capacity) * 100) : 0;

  // Exit scans are always allowed
  if (direction === "out") {
    return {
      allowed: true,
      status: "allowed",
      occupancyPercent,
    };
  }

  // Check capacity limits (if capacity > 0)
  if (capacity > 0 && occupancy >= capacity && !override) {
    return {
      allowed: false,
      status: "denied",
      isCapacityFull: true,
      reason: `Zone "${currentZone.name}" has reached maximum capacity (${occupancy}/${capacity}).`,
      occupancyPercent,
    };
  }

  // If override is granted by staff
  if (override) {
    return {
      allowed: true,
      status: "capacity_override",
      occupancyPercent,
    };
  }

  // Active rules for this zone
  const activeRules = rules.filter((r) => r.isActive && r.zoneId === currentZone.id);
  if (activeRules.length === 0) {
    // Open access zone
    return {
      allowed: true,
      status: "allowed",
      occupancyPercent,
    };
  }

  // Check if attendee satisfies at least one rule (or all specified conditions)
  let satisfiesAccess = false;
  let denialReason = "Access restricted for this zone.";

  for (const rule of activeRules) {
    if (rule.ruleType === "badge_type") {
      if (attendee.badgeType && rule.allowedBadgeTypes.includes(attendee.badgeType)) {
        satisfiesAccess = true;
        break;
      }
      denialReason = `Requires ${rule.allowedBadgeTypes.join(" or ").toUpperCase()} badge credentials.`;
    } else if (rule.ruleType === "ticket_type") {
      if (attendee.ticketTypeId && rule.allowedTicketTypeIds.includes(attendee.ticketTypeId)) {
        satisfiesAccess = true;
        break;
      }
      denialReason = `Your ticket tier does not include access to "${currentZone.name}".`;
    } else if (rule.ruleType === "role") {
      if (attendee.role && rule.allowedRoles.includes(attendee.role)) {
        satisfiesAccess = true;
        break;
      }
      denialReason = `Restricted to authorized roles: ${rule.allowedRoles.join(", ")}.`;
    } else if (rule.ruleType === "time_window") {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
      if (rule.startTime && currentHours < rule.startTime) {
        denialReason = `Zone opens at ${rule.startTime}. Current time is ${currentHours}.`;
      } else if (rule.endTime && currentHours > rule.endTime) {
        denialReason = `Zone closed at ${rule.endTime}.`;
      } else {
        satisfiesAccess = true;
        break;
      }
    } else {
      satisfiesAccess = true;
      break;
    }
  }

  return {
    allowed: satisfiesAccess,
    status: satisfiesAccess ? "allowed" : "denied",
    reason: satisfiesAccess ? undefined : denialReason,
    occupancyPercent,
  };
}

export function recordZoneScan(scan: Omit<ZoneScanRecord, "id" | "scannedAt">): ZoneScanRecord {
  const store = globalThis.__urpass_zone_scans!;
  if (!store[scan.eventId]) store[scan.eventId] = [];

  const record: ZoneScanRecord = {
    ...scan,
    id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    scannedAt: new Date().toISOString(),
  };

  store[scan.eventId].unshift(record);

  // Update occupancy if scan was allowed or overridden
  if (record.status === "allowed" || record.status === "capacity_override") {
    const zones = getEventZones(scan.eventId);
    const targetZone = zones.find((z) => z.id === scan.zoneId);
    if (targetZone) {
      if (scan.direction === "in") {
        targetZone.currentOccupancy = Math.max(0, targetZone.currentOccupancy + 1);
        if (targetZone.currentOccupancy > targetZone.peakOccupancy) {
          targetZone.peakOccupancy = targetZone.currentOccupancy;
        }
      } else if (scan.direction === "out") {
        targetZone.currentOccupancy = Math.max(0, targetZone.currentOccupancy - 1);
      }
    }
  }

  return record;
}

export function getZoneScans(eventId: string, zoneId?: string): ZoneScanRecord[] {
  const store = globalThis.__urpass_zone_scans!;
  const list = store[eventId] || [];
  return zoneId ? list.filter((s) => s.zoneId === zoneId) : list;
}
