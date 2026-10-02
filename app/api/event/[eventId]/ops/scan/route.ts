import { NextResponse } from "next/server";
import {
  getEventZonesDb,
  getAccessRulesDb,
  evaluateZoneAccess,
  recordZoneScanDb,
} from "@/lib/physical-ops/zone-service";
import { logOpsAuditDb, triggerOpsAlertDb } from "@/lib/physical-ops/audit-alert-service";
import type { ScanDirection } from "@/lib/physical-ops/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const {
      zoneId,
      gateId,
      gateName,
      attendee,
      direction = "in",
      override = false,
      overrideReason,
      deviceId,
      staffName,
    } = body;

    if (!zoneId || !attendee || !attendee.id) {
      return NextResponse.json(
        { success: false, error: "Missing required scan parameters (zoneId, attendee)" },
        { status: 400 }
      );
    }

    const zones = await getEventZonesDb(eventId);
    const targetZone = zones.find((z) => z.id === zoneId);
    if (!targetZone) {
      return NextResponse.json(
        { success: false, error: `Zone ${zoneId} not found for this event` },
        { status: 404 }
      );
    }

    const rules = await getAccessRulesDb(eventId, zoneId);

    // Record the scan in the zone logs & database
    const scanResult = await recordZoneScanDb(
      eventId,
      zoneId,
      attendee.id,
      direction as ScanDirection,
      {
        badgeType: attendee.badgeType || "attendee",
        ticketTypeId: attendee.ticketTypeId,
      },
      {
        isOverride: override,
        overrideReason,
        overrideBy: staffName,
        gateName,
        gateId,
      }
    );

    if (override) {
      await logOpsAuditDb(
        eventId,
        "zone_override",
        "zone",
        zoneId,
        {
          zoneName: targetZone.name,
          attendeeId: attendee.id,
          attendeeName: attendee.name,
          reason: overrideReason || "Supervisor Authorized Override",
          gateName,
        },
        staffName || "Gate Supervisor"
      );
    }

    return NextResponse.json({
      success: true,
      allowed: scanResult.allowed,
      status: scanResult.status,
      rejectionReason: scanResult.rejectionReason,
      currentOccupancy: scanResult.currentOccupancy,
      capacity: scanResult.capacity,
      occupancyPercent: scanResult.occupancyPercent,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Zone scan operation failed" },
      { status: 500 }
    );
  }
}
