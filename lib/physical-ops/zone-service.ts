import type {
  EventZone,
  AccessRule,
  ZoneScanRecord,
  ScanDirection,
  ScanValidationStatus,
  BadgeRoleType,
} from "./types";
import { getAdminClient } from "./db";
import { triggerOpsAlertDb } from "./audit-alert-service";

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

export async function getEventZonesDb(eventId: string): Promise<EventZone[]> {
  const admin = getAdminClient();
  if (!admin) return getEventZones(eventId);

  try {
    const { data, error } = await admin
      .from("event_zones")
      .select("*")
      .eq("event_id", eventId)
      .order("position", { ascending: true });

    if (error || !data) return getEventZones(eventId);

    if (data.length === 0) {
      globalThis.__urpass_zones![eventId] = [];
      return [];
    }

    const zones: EventZone[] = data.map((row: any) => ({
      id: row.id,
      eventId: row.event_id,
      name: row.name,
      description: row.description || "",
      zoneType: row.zone_type || "custom",
      color: row.color || "#6D28D9",
      capacity: row.capacity || 100,
      currentOccupancy: row.current_occupancy || 0,
      peakOccupancy: row.peak_occupancy || 0,
      position: row.position || 0,
      createdAt: row.created_at,
    }));

    globalThis.__urpass_zones![eventId] = zones;
    return zones;
  } catch (err) {
    console.warn("[zone-service] Error fetching zones from DB:", err);
    return getEventZones(eventId);
  }
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

export async function saveEventZoneDb(
  zone: Partial<EventZone> & { eventId: string; name: string }
): Promise<EventZone> {
  const local = saveEventZone(zone);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload = {
      event_id: zone.eventId,
      name: zone.name,
      capacity: zone.capacity || 100,
      zone_type: zone.zoneType || "custom",
      color: zone.color || "#6D28D9",
    };

    if (zone.id && !zone.id.startsWith("zone-")) {
      await admin.from("event_zones").update(payload).eq("id", zone.id);
    } else {
      const { data } = await admin.from("event_zones").insert(payload).select().single();
      if (data?.id) local.id = data.id;
    }
  } catch (err) {
    console.warn("[zone-service] Error saving zone to DB:", err);
  }

  return local;
}

export function deleteEventZone(eventId: string, zoneId: string): boolean {
  const store = globalThis.__urpass_zones!;
  const list = getEventZones(eventId);
  const filtered = list.filter((z) => z.id !== zoneId);
  store[eventId] = filtered;
  return true;
}

export async function deleteEventZoneDb(eventId: string, zoneId: string): Promise<boolean> {
  deleteEventZone(eventId, zoneId);
  const admin = getAdminClient();
  if (!admin) return true;

  try {
    await admin.from("event_zones").delete().eq("id", zoneId);
    return true;
  } catch (err) {
    console.warn("[zone-service] Error deleting zone from DB:", err);
    return false;
  }
}

export function getAccessRules(eventId: string, zoneId?: string): AccessRule[] {
  const store = globalThis.__urpass_access_rules!;
  if (!store[eventId]) {
    store[eventId] = [
      {
        id: `rule-${eventId}-vip`,
        eventId,
        zoneId: `zone-${eventId}-vip`,
        name: "VIP Lounge Exclusive Access",
        ruleType: "badge_type",
        allowedTicketTypeIds: [],
        allowedBadgeTypes: ["vip", "speaker", "sponsor"],
        allowedRoles: [],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
  const rules = store[eventId];
  return zoneId ? rules.filter((r) => r.zoneId === zoneId) : rules;
}

export async function getAccessRulesDb(eventId: string, zoneId?: string): Promise<AccessRule[]> {
  const admin = getAdminClient();
  if (!admin) return getAccessRules(eventId, zoneId);

  try {
    let query = admin.from("access_rules").select("*").eq("event_id", eventId);
    if (zoneId) query = query.eq("zone_id", zoneId);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getAccessRules(eventId, zoneId);
    }

    const rules: AccessRule[] = data.map((d: any) => ({
      id: d.id,
      eventId: d.event_id,
      zoneId: d.zone_id,
      name: d.name,
      ruleType: d.rule_type,
      allowedTicketTypeIds: d.allowed_ticket_type_ids || [],
      allowedBadgeTypes: d.allowed_badge_types || [],
      allowedRoles: d.allowed_roles || [],
      sessionId: d.session_id || undefined,
      gateId: d.gate_id || undefined,
      dayNumber: d.day_number || undefined,
      startTime: d.start_time || undefined,
      endTime: d.end_time || undefined,
      isActive: d.is_active,
      createdAt: d.created_at,
    }));

    globalThis.__urpass_access_rules![eventId] = rules;
    return rules;
  } catch (err) {
    console.warn("[zone-service] Error fetching access rules from DB:", err);
    return getAccessRules(eventId, zoneId);
  }
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
    ruleType: rule.ruleType || "badge_type",
    allowedTicketTypeIds: rule.allowedTicketTypeIds || [],
    allowedBadgeTypes: rule.allowedBadgeTypes || [],
    allowedRoles: rule.allowedRoles || [],
    sessionId: rule.sessionId,
    gateId: rule.gateId,
    dayNumber: rule.dayNumber,
    startTime: rule.startTime,
    endTime: rule.endTime,
    isActive: rule.isActive ?? true,
    createdAt: now,
  };
  list.push(newRule);
  store[rule.eventId] = list;
  return newRule;
}

export async function saveAccessRuleDb(
  rule: Partial<AccessRule> & { eventId: string; zoneId: string; name: string }
): Promise<AccessRule> {
  const local = saveAccessRule(rule);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload = {
      event_id: rule.eventId,
      zone_id: rule.zoneId,
      name: rule.name,
      rule_type: rule.ruleType || "badge_type",
      allowed_badge_types: rule.allowedBadgeTypes || [],
      allowed_ticket_type_ids: rule.allowedTicketTypeIds || [],
      start_time: rule.startTime || null,
      end_time: rule.endTime || null,
      is_active: rule.isActive ?? true,
    };

    if (rule.id && !rule.id.startsWith("rule-")) {
      await admin.from("access_rules").update(payload).eq("id", rule.id);
    } else {
      const { data } = await admin.from("access_rules").insert(payload).select().single();
      if (data?.id) local.id = data.id;
    }
  } catch (err) {
    console.warn("[zone-service] Error saving access rule to DB:", err);
  }

  return local;
}

export function deleteAccessRule(eventId: string, ruleId: string): boolean {
  const store = globalThis.__urpass_access_rules!;
  const list = getAccessRules(eventId);
  store[eventId] = list.filter((r) => r.id !== ruleId);
  return true;
}

export async function deleteAccessRuleDb(eventId: string, ruleId: string): Promise<boolean> {
  deleteAccessRule(eventId, ruleId);
  const admin = getAdminClient();
  if (!admin) return true;

  try {
    await admin.from("access_rules").delete().eq("id", ruleId);
    return true;
  } catch (err) {
    console.warn("[zone-service] Error deleting access rule from DB:", err);
    return false;
  }
}

export function evaluateZoneAccess(
  arg1: any,
  arg2?: any,
  arg3?: any
): { allowed: boolean; status: "allowed" | "denied" | "capacity_override"; isCapacityFull?: boolean; reason?: string } {
  let eventId: string;
  let zoneId: string;
  let credential: any;
  let rulesToEvaluate: any[] | null = null;
  let currentZone: any = null;

  if (typeof arg1 === "object" && arg1 !== null) {
    zoneId = arg1.zoneId;
    eventId = arg1.eventId || (arg1.currentZone ? arg1.currentZone.eventId : "");
    credential = {
      badgeType: arg1.attendee?.badgeType || arg1.badgeType,
      ticketTypeId: arg1.attendee?.ticketTypeId || arg1.ticketTypeId,
    };
    rulesToEvaluate = arg1.rules || null;
    currentZone = arg1.currentZone || null;

    const isOverride = Boolean(arg1.override || arg1.isOverride);
    if (arg1.direction === "in" && currentZone && currentZone.capacity > 0) {
      if (currentZone.currentOccupancy >= currentZone.capacity) {
        if (!isOverride) {
          return {
            allowed: false,
            status: "denied",
            isCapacityFull: true,
            reason: `Zone capacity limit reached (${currentZone.capacity})`,
          };
        } else {
          return {
            allowed: true,
            status: "capacity_override" as any,
          };
        }
      }
    }
  } else {
    eventId = arg1;
    zoneId = arg2;
    credential = arg3;
  }

  const rules =
    rulesToEvaluate || (eventId && zoneId ? getAccessRules(eventId, zoneId).filter((r) => r.isActive) : []);
  if (rules.length === 0) {
    return { allowed: true, status: "allowed" };
  }

  for (const rule of rules) {
    if (rule.ruleType === "badge_type" && rule.allowedBadgeTypes && rule.allowedBadgeTypes.length > 0) {
      if (!credential?.badgeType || !rule.allowedBadgeTypes.includes(credential.badgeType)) {
        return {
          allowed: false,
          status: "denied",
          reason: `Requires one of: ${rule.allowedBadgeTypes.join(", ").toUpperCase()}`,
        };
      }
    }

    if (rule.ruleType === "ticket_type" && rule.allowedTicketTypeIds && rule.allowedTicketTypeIds.length > 0) {
      if (!credential?.ticketTypeId || !rule.allowedTicketTypeIds.includes(credential.ticketTypeId)) {
        return {
          allowed: false,
          status: "denied",
          reason: "Ticket tier does not have access to this zone",
        };
      }
    }
  }

  return { allowed: true, status: "allowed" };
}

export function recordZoneScan(
  arg1: any,
  arg2?: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any
): {
  allowed: boolean;
  status: ScanValidationStatus;
  rejectionReason?: string;
  currentOccupancy: number;
  capacity: number;
  occupancyPercent: number;
} {
  let eventId: string;
  let zoneId: string;
  let attendeeId: string;
  let direction: ScanDirection = "in";
  let credential: any;
  let options: any;

  if (typeof arg1 === "object" && arg1 !== null) {
    eventId = arg1.eventId;
    zoneId = arg1.zoneId;
    attendeeId = arg1.attendeeId;
    direction = arg1.direction || "in";
    credential = { badgeType: arg1.attendee?.badgeType || arg1.badgeType };
    options = arg1;
  } else {
    eventId = arg1;
    zoneId = arg2;
    attendeeId = arg3;
    direction = arg4;
    credential = arg5;
    options = arg6;
  }

  const zones = getEventZones(eventId);
  const zone = zones.find((z) => z.id === zoneId);
  const capacity = zone ? zone.capacity : 100;
  let currentOccupancy = zone ? zone.currentOccupancy : 0;

  if (direction === "in") {
    const accessEval = evaluateZoneAccess(eventId, zoneId, credential);
    if (!accessEval.allowed) {
      return {
        allowed: false,
        status: "denied",
        rejectionReason: accessEval.reason || "Access restricted for this credential",
        currentOccupancy,
        capacity,
        occupancyPercent: capacity > 0 ? Math.round((currentOccupancy / capacity) * 100) : 0,
      };
    }

    const isFull = capacity > 0 && currentOccupancy >= capacity;
    if (isFull && !options?.isOverride) {
      return {
        allowed: false,
        status: "denied",
        rejectionReason: `ZONE FULL (${currentOccupancy}/${capacity}) - Entry blocked`,
        currentOccupancy,
        capacity,
        occupancyPercent: 100,
      };
    }

    currentOccupancy += 1;
    if (zone) {
      zone.currentOccupancy = currentOccupancy;
      if (currentOccupancy > zone.peakOccupancy) {
        zone.peakOccupancy = currentOccupancy;
      }
    }
  } else {
    currentOccupancy = Math.max(0, currentOccupancy - 1);
    if (zone) {
      zone.currentOccupancy = currentOccupancy;
    }
  }

  const finalStatus: ScanValidationStatus = options?.isOverride
    ? "capacity_override"
    : "allowed";

  const store = globalThis.__urpass_zone_scans!;
  if (!store[eventId]) store[eventId] = [];

  const scanRecord: ZoneScanRecord = {
    id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId,
    zoneId,
    gateId: options?.gateId,
    gateName: options?.gateName,
    attendeeId,
    badgeType: credential?.badgeType || "attendee",
    direction,
    status: finalStatus,
    isOverride: options?.isOverride ?? false,
    overrideReason: options?.overrideReason,
    overrideBy: options?.overrideBy,
    scannedAt: new Date().toISOString(),
  };

  store[eventId].unshift(scanRecord);

  return {
    allowed: true,
    status: finalStatus,
    currentOccupancy,
    capacity,
    occupancyPercent: capacity > 0 ? Math.round((currentOccupancy / capacity) * 100) : 0,
  };
}

export async function recordZoneScanDb(
  eventId: string,
  zoneId: string,
  attendeeId: string,
  direction: ScanDirection,
  credential: {
    badgeType?: BadgeRoleType;
    ticketTypeId?: string;
    role?: string;
    sessionId?: string;
  },
  options?: {
    isOverride?: boolean;
    overrideReason?: string;
    overrideBy?: string;
    gateName?: string;
    gateId?: string;
  }
) {
  const result = recordZoneScan(eventId, zoneId, attendeeId, direction, credential, options);
  const admin = getAdminClient();
  if (!admin) return result;

  try {
    // 1. Insert into zone_scans table
    await admin.from("zone_scans").insert({
      event_id: eventId,
      zone_id: zoneId,
      gate_id: options?.gateId || null,
      attendee_id: attendeeId,
      badge_type: credential.badgeType || "attendee",
      direction,
      status: result.status,
      rejection_reason: result.rejectionReason || null,
      is_override: options?.isOverride ?? false,
      override_reason: options?.overrideReason || null,
      override_by: options?.overrideBy || null,
    });

    // 2. Update occupancy in event_zones table
    await admin
      .from("event_zones")
      .update({
        current_occupancy: result.currentOccupancy,
        peak_occupancy: result.currentOccupancy,
      })
      .eq("id", zoneId);

    // 3. If nearly full or full, trigger operational alert
    if (result.occupancyPercent >= 100) {
      await triggerOpsAlertDb(
        eventId,
        "zone_full",
        "critical",
        `Zone reached 100% capacity (${result.currentOccupancy}/${result.capacity})`,
        options?.gateName,
        options?.gateName
      );
    } else if (result.occupancyPercent >= 85) {
      await triggerOpsAlertDb(
        eventId,
        "zone_nearly_full",
        "warning",
        `Zone at ${result.occupancyPercent}% capacity (${result.currentOccupancy}/${result.capacity})`,
        options?.gateName,
        options?.gateName
      );
    }
  } catch (err) {
    console.warn("[zone-service] Error recording scan in DB:", err);
  }

  return result;
}

export function getZoneScans(eventId: string, zoneId?: string): ZoneScanRecord[] {
  const store = globalThis.__urpass_zone_scans!;
  const scans = store[eventId] || [];
  return zoneId ? scans.filter((s) => s.zoneId === zoneId) : scans;
}

export async function getZoneScansDb(eventId: string, zoneId?: string): Promise<ZoneScanRecord[]> {
  const admin = getAdminClient();
  if (!admin) return getZoneScans(eventId, zoneId);

  try {
    let query = admin
      .from("zone_scans")
      .select("*")
      .eq("event_id", eventId)
      .order("scanned_at", { ascending: false })
      .limit(50);

    if (zoneId) query = query.eq("zone_id", zoneId);

    const { data, error } = await query;
    if (error || !data) return getZoneScans(eventId, zoneId);

    const mapped: ZoneScanRecord[] = data.map((d: any) => ({
      id: d.id,
      eventId: d.event_id,
      zoneId: d.zone_id,
      gateId: d.gate_id || undefined,
      attendeeId: d.attendee_id,
      badgeType: d.badge_type as BadgeRoleType,
      direction: d.direction as ScanDirection,
      status: d.status as ScanValidationStatus,
      rejectionReason: d.rejection_reason || undefined,
      isOverride: d.is_override,
      overrideReason: d.override_reason || undefined,
      overrideBy: d.override_by || undefined,
      scannedAt: d.scanned_at,
    }));

    return mapped;
  } catch (err) {
    console.warn("[zone-service] Error reading scans from DB:", err);
    return getZoneScans(eventId, zoneId);
  }
}
