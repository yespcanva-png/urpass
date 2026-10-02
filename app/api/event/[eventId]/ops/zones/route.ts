import { NextResponse } from "next/server";
import {
  getEventZones,
  saveEventZone,
  deleteEventZone,
  getAccessRules,
  saveAccessRule,
  deleteAccessRule,
} from "@/lib/physical-ops/zone-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const zones = getEventZones(eventId);
    const rules = getAccessRules(eventId);
    return NextResponse.json({ success: true, zones, rules });
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
    const { type, zone, rule, zoneId, ruleId } = body;

    if (type === "save_zone" && zone) {
      const saved = saveEventZone({ ...zone, eventId });
      return NextResponse.json({ success: true, zone: saved });
    }

    if (type === "delete_zone" && zoneId) {
      deleteEventZone(eventId, zoneId);
      return NextResponse.json({ success: true });
    }

    if (type === "save_rule" && rule) {
      const saved = saveAccessRule({ ...rule, eventId });
      return NextResponse.json({ success: true, rule: saved });
    }

    if (type === "delete_rule" && ruleId) {
      deleteAccessRule(eventId, ruleId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Zone operation failed" },
      { status: 500 }
    );
  }
}
