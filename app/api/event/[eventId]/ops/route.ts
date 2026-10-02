import { NextResponse } from "next/server";
import { getEventZones } from "@/lib/physical-ops/zone-service";
import { getBadgeTemplates, getBadgePrintQueue, getBadgePrintLogs } from "@/lib/physical-ops/badge-service";
import { getOpsAlerts, getOpsAuditLogs } from "@/lib/physical-ops/audit-alert-service";
import { getStaffAssignments, getOpsDevices } from "@/lib/physical-ops/staff-device-service";
import { computeStage2Analytics } from "@/lib/physical-ops/analytics-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const zones = getEventZones(eventId);
    const badgeTemplates = getBadgeTemplates(eventId);
    const printQueue = getBadgePrintQueue(eventId);
    const printLogs = getBadgePrintLogs(eventId);
    const alerts = getOpsAlerts(eventId, true);
    const auditLogs = getOpsAuditLogs(eventId);
    const staff = getStaffAssignments(eventId);
    const devices = getOpsDevices(eventId);
    const analytics = computeStage2Analytics(eventId);

    const totalCapacity = zones.reduce((acc, z) => acc + (z.capacity || 0), 0);
    const totalOccupancy = zones.reduce((acc, z) => acc + (z.currentOccupancy || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalZones: zones.length,
        totalCapacity,
        totalOccupancy,
        overallOccupancyPercent: totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0,
        queuedBadgePrints: printQueue.filter((q) => q.status === "queued").length,
        activeScanners: devices.filter((d) => d.isOnline).length,
        activeStaff: staff.filter((s) => s.isActive).length,
        unresolvedAlertsCount: alerts.length,
      },
      zones,
      badgeTemplates,
      printQueue,
      printLogs,
      alerts,
      auditLogs: auditLogs.slice(0, 30),
      staff,
      devices,
      analytics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load ops telemetry" },
      { status: 500 }
    );
  }
}
