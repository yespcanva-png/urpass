import type { OpsStaffAssignment, OpsDevice, StaffRole } from "./types";
import { getAdminClient } from "./db";

declare global {
  // eslint-disable-next-line no-var
  var __urpass_staff_assignments: Record<string, OpsStaffAssignment[]> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_devices: Record<string, OpsDevice[]> | undefined;
}

if (!globalThis.__urpass_staff_assignments) {
  globalThis.__urpass_staff_assignments = {};
}
if (!globalThis.__urpass_devices) {
  globalThis.__urpass_devices = {};
}

export function getStaffAssignments(eventId: string): OpsStaffAssignment[] {
  const store = globalThis.__urpass_staff_assignments!;
  return store[eventId] || [];
}

export async function getStaffAssignmentsDb(eventId: string): Promise<OpsStaffAssignment[]> {
  const admin = getAdminClient();
  if (!admin) return getStaffAssignments(eventId);

  try {
    const { data, error } = await admin
      .from("ops_staff_assignments")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error || !data) return getStaffAssignments(eventId);

    const mapped: OpsStaffAssignment[] = data.map((d: any) => ({
      id: d.id,
      eventId: d.event_id,
      staffName: d.staff_name,
      staffEmail: d.staff_email || undefined,
      staffPhone: d.staff_phone || undefined,
      pinCode: d.pin_code,
      role: d.role as StaffRole,
      gateId: d.gate_id || undefined,
      gateName: d.gate_name || undefined,
      zoneId: d.zone_id || undefined,
      zoneName: d.zone_name || undefined,
      isActive: d.is_active,
      createdAt: d.created_at,
    }));

    globalThis.__urpass_staff_assignments![eventId] = mapped;
    return mapped;
  } catch (err) {
    console.warn("[staff-device-service] Error reading staff from DB:", err);
    return getStaffAssignments(eventId);
  }
}

export function saveStaffAssignment(
  staff: Partial<OpsStaffAssignment> & { eventId: string; staffName: string; role: StaffRole }
): OpsStaffAssignment {
  const store = globalThis.__urpass_staff_assignments!;
  if (!store[staff.eventId]) store[staff.eventId] = [];
  const list = store[staff.eventId];

  if (staff.id) {
    const idx = list.findIndex((s) => s.id === staff.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...staff };
      store[staff.eventId] = list;
      return list[idx];
    }
  }

  const newStaff: OpsStaffAssignment = {
    id: staff.id || `staff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: staff.eventId,
    staffName: staff.staffName,
    staffEmail: staff.staffEmail,
    staffPhone: staff.staffPhone,
    pinCode: staff.pinCode || Math.floor(1000 + Math.random() * 9000).toString(),
    role: staff.role,
    gateId: staff.gateId,
    gateName: staff.gateName,
    zoneId: staff.zoneId,
    zoneName: staff.zoneName,
    isActive: staff.isActive ?? true,
    createdAt: new Date().toISOString(),
  };

  list.push(newStaff);
  store[staff.eventId] = list;
  return newStaff;
}

export async function saveStaffAssignmentDb(
  staff: Partial<OpsStaffAssignment> & { eventId: string; staffName: string; role: StaffRole }
): Promise<OpsStaffAssignment> {
  const local = saveStaffAssignment(staff);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload = {
      event_id: staff.eventId,
      staff_name: staff.staffName,
      staff_email: staff.staffEmail || null,
      staff_phone: staff.staffPhone || null,
      pin_code: staff.pinCode || local.pinCode,
      role: staff.role,
      gate_name: staff.gateName || null,
      zone_name: staff.zoneName || null,
      is_active: staff.isActive ?? true,
    };

    if (staff.id && !staff.id.startsWith("staff-")) {
      await admin.from("ops_staff_assignments").update(payload).eq("id", staff.id);
    } else {
      const { data } = await admin.from("ops_staff_assignments").insert(payload).select().single();
      if (data?.id) local.id = data.id;
    }
  } catch (err) {
    console.warn("[staff-device-service] Error saving staff to DB:", err);
  }

  return local;
}

export function deleteStaffAssignment(eventId: string, staffId: string): boolean {
  const store = globalThis.__urpass_staff_assignments!;
  const list = getStaffAssignments(eventId);
  store[eventId] = list.filter((s) => s.id !== staffId);
  return true;
}

export async function deleteStaffAssignmentDb(eventId: string, staffId: string): Promise<boolean> {
  deleteStaffAssignment(eventId, staffId);
  const admin = getAdminClient();
  if (!admin) return true;

  try {
    await admin.from("ops_staff_assignments").delete().eq("id", staffId);
    return true;
  } catch (err) {
    console.warn("[staff-device-service] Error deleting staff from DB:", err);
    return false;
  }
}

export function getOpsDevices(eventId: string): OpsDevice[] {
  const store = globalThis.__urpass_devices!;
  return store[eventId] || [];
}

export async function getOpsDevicesDb(eventId: string): Promise<OpsDevice[]> {
  const admin = getAdminClient();
  if (!admin) return getOpsDevices(eventId);

  try {
    const { data, error } = await admin
      .from("ops_devices")
      .select("*")
      .eq("event_id", eventId)
      .order("last_heartbeat_at", { ascending: false });

    if (error || !data) return getOpsDevices(eventId);

    const mapped: OpsDevice[] = data.map((d: any) => ({
      id: d.id,
      eventId: d.event_id,
      deviceId: d.device_id,
      deviceName: d.device_name,
      deviceType: d.device_type,
      assignedGateName: d.assigned_gate_name || undefined,
      assignedZoneName: d.assigned_zone_name || undefined,
      appVersion: d.app_version || "2.4.0",
      batteryLevel: d.battery_level !== null ? Number(d.battery_level) : undefined,
      isOnline: d.is_online,
      lastHeartbeatAt: d.last_heartbeat_at,
      createdAt: d.created_at,
    }));

    globalThis.__urpass_devices![eventId] = mapped;
    return mapped;
  } catch (err) {
    console.warn("[staff-device-service] Error reading devices from DB:", err);
    return getOpsDevices(eventId);
  }
}

export function recordDeviceHeartbeat(
  eventId: string,
  deviceId: string,
  deviceName: string,
  batteryLevel?: number,
  gateName?: string,
  zoneName?: string
): OpsDevice {
  const store = globalThis.__urpass_devices!;
  if (!store[eventId]) store[eventId] = [];
  const list = store[eventId];
  const existing = list.find((d) => d.deviceId === deviceId);
  const now = new Date().toISOString();

  if (existing) {
    existing.isOnline = true;
    existing.lastHeartbeatAt = now;
    if (batteryLevel !== undefined) existing.batteryLevel = batteryLevel;
    if (gateName) existing.assignedGateName = gateName;
    if (zoneName) existing.assignedZoneName = zoneName;
    return existing;
  }

  const newDevice: OpsDevice = {
    id: `dev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId,
    deviceId,
    deviceName,
    deviceType: deviceName.toLowerCase().includes("printer")
      ? "printer_station"
      : deviceName.toLowerCase().includes("pad") || deviceName.toLowerCase().includes("tab")
      ? "tablet"
      : "smartphone",
    assignedGateName: gateName,
    assignedZoneName: zoneName,
    appVersion: "2.4.0",
    isOnline: true,
    batteryLevel: batteryLevel ?? 100,
    lastHeartbeatAt: now,
    createdAt: now,
  };

  list.push(newDevice);
  store[eventId] = list;
  return newDevice;
}

export async function recordDeviceHeartbeatDb(
  eventId: string,
  deviceId: string,
  deviceName: string,
  batteryLevel?: number,
  gateName?: string,
  zoneName?: string
): Promise<OpsDevice> {
  const local = recordDeviceHeartbeat(eventId, deviceId, deviceName, batteryLevel, gateName, zoneName);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const now = new Date().toISOString();
    const payload = {
      event_id: eventId,
      device_id: deviceId,
      device_name: deviceName,
      device_type: local.deviceType,
      assigned_gate_name: gateName || null,
      assigned_zone_name: zoneName || null,
      app_version: "2.4.0",
      battery_level: batteryLevel !== undefined ? batteryLevel : null,
      is_online: true,
      last_heartbeat_at: now,
    };

    const { data: existing } = await admin
      .from("ops_devices")
      .select("id")
      .eq("event_id", eventId)
      .eq("device_id", deviceId)
      .maybeSingle();

    if (existing?.id) {
      await admin.from("ops_devices").update(payload).eq("id", existing.id);
      local.id = existing.id;
    } else {
      const { data } = await admin.from("ops_devices").insert(payload).select().single();
      if (data?.id) local.id = data.id;
    }
  } catch (err) {
    console.warn("[staff-device-service] Error updating device heartbeat in DB:", err);
  }

  return local;
}
