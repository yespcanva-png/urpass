import { NextResponse } from "next/server";
import { getEventZonesDb } from "@/lib/physical-ops/zone-service";
import { getBadgeTemplatesDb, getBadgePrintQueueDb, getBadgePrintLogsDb } from "@/lib/physical-ops/badge-service";
import { getOpsAlertsDb, getOpsAuditLogsDb } from "@/lib/physical-ops/audit-alert-service";
import { getStaffAssignmentsDb, getOpsDevicesDb } from "@/lib/physical-ops/staff-device-service";
import { computeStage2AnalyticsDb } from "@/lib/physical-ops/analytics-service";
import { getAdminClient } from "@/lib/physical-ops/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const admin = getAdminClient();

    const [
      zones,
      badgeTemplates,
      printQueue,
      printLogs,
      alerts,
      auditLogs,
      staff,
      devices,
      analytics,
      attendeesRes,
      checkinsRes,
    ] = await Promise.all([
      getEventZonesDb(eventId),
      getBadgeTemplatesDb(eventId),
      getBadgePrintQueueDb(eventId),
      getBadgePrintLogsDb(eventId),
      getOpsAlertsDb(eventId, true),
      getOpsAuditLogsDb(eventId),
      getStaffAssignmentsDb(eventId),
      getOpsDevicesDb(eventId),
      computeStage2AnalyticsDb(eventId),
      admin
        ? admin.from("attendees").select("id", { count: "exact", head: true }).eq("event_id", eventId)
        : Promise.resolve({ count: 0 }),
      admin
        ? admin.from("check_ins").select("id", { count: "exact", head: true }).eq("event_id", eventId)
        : Promise.resolve({ count: 0 }),
    ]);

    const totalCapacity = zones.reduce((acc, z) => acc + (z.capacity || 0), 0);
    const totalOccupancy = zones.reduce((acc, z) => acc + (z.currentOccupancy || 0), 0);
    const registeredCount = attendeesRes.count || 0;
    const checkedInCount = checkinsRes.count || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalZones: zones.length,
        totalCapacity,
        totalOccupancy,
        overallOccupancyPercent: totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0,
        registeredCount,
        checkedInCount,
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
