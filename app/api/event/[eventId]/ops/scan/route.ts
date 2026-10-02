import { NextResponse } from "next/server";
import {
  getEventZones,
  getAccessRules,
  evaluateZoneAccess,
  recordZoneScan,
} from "@/lib/physical-ops/zone-service";
import { logOpsAudit, triggerOpsAlert } from "@/lib/physical-ops/audit-alert-service";
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

    const zones = getEventZones(eventId);
    const targetZone = zones.find((z) => z.id === zoneId);
    if (!targetZone) {
      return NextResponse.json(
        { success: false, error: `Zone ${zoneId} not found for this event` },
        { status: 404 }
      );
    }

    const rules = getAccessRules(eventId, zoneId);

    // Evaluate rules & capacity
    const evaluation = evaluateZoneAccess({
      attendee,
      zoneId,
      direction: direction as ScanDirection,
      currentZone: targetZone,
      rules,
      override,
    });

    // If capacity reached 100% and blocked
    if (evaluation.isCapacityFull) {
      triggerOpsAlert(
        eventId,
        "zone_full",
        "critical",
        `Zone "${targetZone.name}" has reached capacity (${targetZone.currentOccupancy}/${targetZone.capacity}). Entry blocked for ${attendee.name}.`,
        targetZone.name,
        gateName,
        deviceId
      );
    } else if (evaluation.occupancyPercent >= 85 && evaluation.occupancyPercent < 100) {
      triggerOpsAlert(
        eventId,
        "zone_nearly_full",
        "warning",
        `Zone "${targetZone.name}" is nearly full (${evaluation.occupancyPercent}% - ${targetZone.currentOccupancy}/${targetZone.capacity}).`,
        targetZone.name,
        gateName,
        deviceId
      );
    }

    // Record the scan in the zone logs
    const scanRecord = recordZoneScan({
      eventId,
      zoneId,
      zoneName: targetZone.name,
      gateId,
      gateName,
      attendeeId: attendee.id,
      attendeeName: attendee.name,
      direction: direction as ScanDirection,
      status: evaluation.status,
      rejectionReason: evaluation.reason,
      deviceId,
      staffName: staffName || "Scanner Staff",
    });

    // If override was granted, log to audit log
    if (override) {
      logOpsAudit(
        eventId,
        "capacity_override",
        "zone",
        zoneId,
        {
          zoneName: targetZone.name,
          attendeeId: attendee.id,
          attendeeName: attendee.name,
          reason: overrideReason || "Supervisor Authorized",
          occupancy: targetZone.currentOccupancy,
          capacity: targetZone.capacity,
        },
        staffName || "Door Supervisor"
      );
    }

    return NextResponse.json({
      success: true,
      allowed: evaluation.allowed,
      status: evaluation.status,
      reason: evaluation.reason,
      occupancy: targetZone.currentOccupancy,
      capacity: targetZone.capacity,
      occupancyPercent: evaluation.occupancyPercent,
      scanRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Zone scan verification failed" },
      { status: 500 }
    );
  }
}
