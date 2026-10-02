import type { OpsStaffAssignment, OpsDevice, StaffRole } from "./types";

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
  if (!store[eventId] || store[eventId].length === 0) {
    store[eventId] = [
      {
        id: `staff-${eventId}-1`,
        eventId,
        staffName: "Priya Sharma",
        staffEmail: "priya@example.com",
        pinCode: "1234",
        role: "registration_desk",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `staff-${eventId}-2`,
        eventId,
        staffName: "Arun Kumar",
        staffEmail: "arun@example.com",
        pinCode: "5678",
        role: "gate_scanner",
        gateName: "Gate A (Main Entrance)",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `staff-${eventId}-3`,
        eventId,
        staffName: "David Chen",
        staffEmail: "david@example.com",
        pinCode: "9988",
        role: "zone_monitor",
        zoneName: "VIP Lounge",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return store[eventId];
}

export function saveStaffAssignment(
  staff: Partial<OpsStaffAssignment> & { eventId: string; staffName: string; role: StaffRole }
): OpsStaffAssignment {
  const store = globalThis.__urpass_staff_assignments!;
  const list = getStaffAssignments(staff.eventId);

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

export function deleteStaffAssignment(eventId: string, staffId: string): boolean {
  const store = globalThis.__urpass_staff_assignments!;
  const list = getStaffAssignments(eventId);
  store[eventId] = list.filter((s) => s.id !== staffId);
  return true;
}

export function getOpsDevices(eventId: string): OpsDevice[] {
  const store = globalThis.__urpass_devices!;
  if (!store[eventId] || store[eventId].length === 0) {
    const now = new Date().toISOString();
    store[eventId] = [
      {
        id: `dev-${eventId}-1`,
        eventId,
        deviceId: "ipad-gate-a",
        deviceName: "Main Entrance iPad #1",
        deviceType: "tablet",
        assignedGateName: "Gate A (Main Entrance)",
        appVersion: "2.4.0",
        isOnline: true,
        batteryLevel: 94,
        lastHeartbeatAt: now,
        createdAt: now,
      },
      {
        id: `dev-${eventId}-2`,
        eventId,
        deviceId: "pixel-vip",
        deviceName: "VIP Gate Scanner (Pixel 8)",
        deviceType: "smartphone",
        assignedGateName: "Gate C (VIP Entrance)",
        assignedZoneName: "VIP Lounge",
        appVersion: "2.4.0",
        isOnline: true,
        batteryLevel: 81,
        lastHeartbeatAt: now,
        createdAt: now,
      },
      {
        id: `dev-${eventId}-3`,
        eventId,
        deviceId: "zebra-printer-desk",
        deviceName: "Registration Desk Zebra ZD621",
        deviceType: "printer_station",
        appVersion: "1.2.0",
        isOnline: true,
        lastHeartbeatAt: now,
        createdAt: now,
      },
    ];
  }
  return store[eventId];
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
  const list = getOpsDevices(eventId);
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
    deviceType: "smartphone",
    assignedGateName: gateName,
    assignedZoneName: zoneName,
    appVersion: "2.4.0",
    isOnline: true,
    batteryLevel,
    lastHeartbeatAt: now,
    createdAt: now,
  };

  list.push(newDevice);
  store[eventId] = list;
  return newDevice;
}
