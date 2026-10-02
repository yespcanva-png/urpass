import { getEventZones, getZoneScans, getEventZonesDb, getZoneScansDb } from "./zone-service";
import { getBadgePrintLogs, getBadgePrintQueue, getBadgePrintLogsDb, getBadgePrintQueueDb } from "./badge-service";
import { getOpsAuditLogs, getOpsAuditLogsDb } from "./audit-alert-service";

export interface Stage2OpsAnalytics {
  totalBadgePrints: number;
  totalReprints: number;
  reprintReasons: Record<string, number>;
  zoneOccupancyBreakdown: Array<{
    zoneId: string;
    zoneName: string;
    capacity: number;
    currentOccupancy: number;
    occupancyPercent: number;
    peakOccupancy: number;
    color: string;
  }>;
  totalEntries: number;
  totalExits: number;
  rejectedAccessAttempts: number;
  rejectionBreakdown: Record<string, number>;
  gateTrafficBreakdown: Record<string, number>;
  auditLogSummary: {
    totalOverrides: number;
    totalManualCheckins: number;
    totalWalkins: number;
  };
}

export function computeStage2Analytics(eventId: string): Stage2OpsAnalytics {
  const zones = getEventZones(eventId);
  const scans = getZoneScans(eventId);
  const printLogs = getBadgePrintLogs(eventId);
  const printQueue = getBadgePrintQueue(eventId);
  const auditLogs = getOpsAuditLogs(eventId);

  return calculateMetrics(zones, scans, printLogs, printQueue, auditLogs);
}

export async function computeStage2AnalyticsDb(eventId: string): Promise<Stage2OpsAnalytics> {
  const [zones, scans, printLogs, printQueue, auditLogs] = await Promise.all([
    getEventZonesDb(eventId),
    getZoneScansDb(eventId),
    getBadgePrintLogsDb(eventId),
    getBadgePrintQueueDb(eventId),
    getOpsAuditLogsDb(eventId),
  ]);

  return calculateMetrics(zones, scans, printLogs, printQueue, auditLogs);
}

function calculateMetrics(
  zones: any[],
  scans: any[],
  printLogs: any[],
  printQueue: any[],
  auditLogs: any[]
): Stage2OpsAnalytics {
  const reprintLogs = printLogs.filter((l) => l.printType === "reprint");
  const reprintReasons: Record<string, number> = {};
  reprintLogs.forEach((l) => {
    const reason = l.reprintReason || "General Reprint";
    reprintReasons[reason] = (reprintReasons[reason] || 0) + 1;
  });

  const zoneOccupancyBreakdown = zones.map((z) => ({
    zoneId: z.id,
    zoneName: z.name,
    capacity: z.capacity,
    currentOccupancy: z.currentOccupancy,
    occupancyPercent: z.capacity > 0 ? Math.round((z.currentOccupancy / z.capacity) * 100) : 0,
    peakOccupancy: z.peakOccupancy,
    color: z.color,
  }));

  let totalEntries = 0;
  let totalExits = 0;
  let rejectedAccessAttempts = 0;
  const rejectionBreakdown: Record<string, number> = {};
  const gateTrafficBreakdown: Record<string, number> = {};

  scans.forEach((s) => {
    if (s.direction === "in" && (s.status === "allowed" || s.status === "capacity_override")) {
      totalEntries++;
    } else if (s.direction === "out") {
      totalExits++;
    }

    if (s.status === "denied") {
      rejectedAccessAttempts++;
      const reason = s.rejectionReason || "Unauthorized Zone";
      rejectionBreakdown[reason] = (rejectionBreakdown[reason] || 0) + 1;
    }

    const gate = s.gateName || "Main Gate";
    gateTrafficBreakdown[gate] = (gateTrafficBreakdown[gate] || 0) + 1;
  });

  const totalOverrides = auditLogs.filter((a) => a.actionType.includes("override")).length;
  const totalManualCheckins = auditLogs.filter((a) => a.actionType === "manual_checkin").length;
  const totalWalkins = auditLogs.filter((a) => a.actionType === "walkin_registration").length;

  return {
    totalBadgePrints: printLogs.length + printQueue.filter((q) => q.status === "printed").length,
    totalReprints: reprintLogs.length,
    reprintReasons,
    zoneOccupancyBreakdown,
    totalEntries,
    totalExits,
    rejectedAccessAttempts,
    rejectionBreakdown,
    gateTrafficBreakdown,
    auditLogSummary: {
      totalOverrides,
      totalManualCheckins,
      totalWalkins,
    },
  };
}
