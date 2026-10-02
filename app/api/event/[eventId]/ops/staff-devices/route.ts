import { NextResponse } from "next/server";
import {
  getStaffAssignments,
  saveStaffAssignment,
  deleteStaffAssignment,
  getOpsDevices,
  recordDeviceHeartbeat,
} from "@/lib/physical-ops/staff-device-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const staff = getStaffAssignments(eventId);
    const devices = getOpsDevices(eventId);
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
    const { type, staff, staffId, heartbeat } = body;

    if (type === "save_staff" && staff) {
      const saved = saveStaffAssignment({ ...staff, eventId });
      return NextResponse.json({ success: true, staff: saved });
    }

    if (type === "delete_staff" && staffId) {
      deleteStaffAssignment(eventId, staffId);
      return NextResponse.json({ success: true });
    }

    if (type === "heartbeat" && heartbeat) {
      const device = recordDeviceHeartbeat(
        eventId,
        heartbeat.deviceId,
        heartbeat.deviceName || "Scanner Device",
        heartbeat.batteryLevel,
        heartbeat.gateName,
        heartbeat.zoneName
      );
      return NextResponse.json({ success: true, device });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Staff/device operation failed" },
      { status: 500 }
    );
  }
}
