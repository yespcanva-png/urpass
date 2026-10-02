import { NextResponse } from "next/server";
import {
  getEventZonesDb,
  saveEventZoneDb,
  deleteEventZoneDb,
  getAccessRulesDb,
  saveAccessRuleDb,
  deleteAccessRuleDb,
} from "@/lib/physical-ops/zone-service";
import {
  getFloorPlansDb,
  saveFloorPlanDb,
  addMarkerDb,
  deleteMarkerDb,
} from "@/lib/physical-ops/floor-plan-service";
import { logOpsAuditDb } from "@/lib/physical-ops/audit-alert-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const [zones, rules, floorPlans] = await Promise.all([
      getEventZonesDb(eventId),
      getAccessRulesDb(eventId),
      getFloorPlansDb(eventId),
    ]);
    return NextResponse.json({
      success: true,
      zones,
      rules,
      floorPlan: floorPlans[0] || null,
      markers: floorPlans[0]?.markers || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load zones" },
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
    const { type, zone, rule, zoneId, ruleId, marker, markerId, staffName } = body;

    if (type === "save_zone" && zone) {
      const saved = await saveEventZoneDb({ ...zone, eventId });
      await logOpsAuditDb(
        eventId,
        "zone_override",
        "zone",
        saved.id,
        { action: "save_zone", name: saved.name, capacity: saved.capacity },
        staffName || "Zone Manager"
      );
      return NextResponse.json({ success: true, zone: saved });
    }

    if (type === "delete_zone" && zoneId) {
      await deleteEventZoneDb(eventId, zoneId);
      return NextResponse.json({ success: true });
    }

    if (type === "save_rule" && rule) {
      const saved = await saveAccessRuleDb({ ...rule, eventId });
      return NextResponse.json({ success: true, rule: saved });
    }

    if (type === "delete_rule" && ruleId) {
      await deleteAccessRuleDb(eventId, ruleId);
      return NextResponse.json({ success: true });
    }

    if (type === "add_marker" && marker) {
      const updatedPlan = await addMarkerDb(eventId, marker);
      return NextResponse.json({ success: true, floorPlan: updatedPlan, markers: updatedPlan.markers });
    }

    if (type === "delete_marker" && markerId) {
      const updatedPlan = await deleteMarkerDb(eventId, markerId);
      return NextResponse.json({ success: true, floorPlan: updatedPlan, markers: updatedPlan.markers });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Zone operation failed" },
      { status: 500 }
    );
  }
}
