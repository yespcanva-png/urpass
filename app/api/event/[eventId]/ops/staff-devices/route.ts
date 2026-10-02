import { NextResponse } from "next/server";
import {
  getStaffAssignmentsDb,
  saveStaffAssignmentDb,
  deleteStaffAssignmentDb,
  getOpsDevicesDb,
  recordDeviceHeartbeatDb,
} from "@/lib/physical-ops/staff-device-service";
import { logOpsAuditDb } from "@/lib/physical-ops/audit-alert-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const [staff, devices] = await Promise.all([
      getStaffAssignmentsDb(eventId),
      getOpsDevicesDb(eventId),
    ]);
    return NextResponse.json({ success: true, staff, devices });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load staff/devices" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const { type, staff, staffId, heartbeat, device, staffName } = body;

    if (type === "save_staff" && staff) {
      const saved = await saveStaffAssignmentDb({ ...staff, eventId });
      await logOpsAuditDb(
        eventId,
        "manual_checkin",
        "staff",
        saved.id,
        { action: "provision_staff", staffName: saved.staffName, role: saved.role },
        staffName || "Staff Operations"
      );
      return NextResponse.json({ success: true, staff: saved });
    }

    if (type === "delete_staff" && staffId) {
      await deleteStaffAssignmentDb(eventId, staffId);
      return NextResponse.json({ success: true });
    }

    if (type === "register_device" && device) {
      const dev = await recordDeviceHeartbeatDb(
        eventId,
        device.deviceId,
        device.deviceName || "Hardware Terminal",
        device.batteryLevel,
        device.assignedGateName,
        device.assignedZoneName
      );
      return NextResponse.json({ success: true, device: dev });
    }

    if (type === "heartbeat" && heartbeat) {
      const dev = await recordDeviceHeartbeatDb(
        eventId,
        heartbeat.deviceId,
        heartbeat.deviceName || "Scanner Device",
        heartbeat.batteryLevel,
        heartbeat.gateName,
        heartbeat.zoneName
      );
      return NextResponse.json({ success: true, device: dev });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Staff/device operation failed" },
      { status: 500 }
    );
  }
}
