import { NextResponse } from "next/server";
import {
  queueBadgePrint,
  updateBadgePrintStatus,
  recordBadgeReprint,
  getBadgePrintQueue,
  getBadgePrintLogs,
} from "@/lib/physical-ops/badge-service";
import { logOpsAudit } from "@/lib/physical-ops/audit-alert-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const queue = getBadgePrintQueue(eventId);
    const logs = getBadgePrintLogs(eventId);
    return NextResponse.json({ success: true, queue, logs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load badge queue" },
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
    const { action, attendee, queueId, status, reprintReason, staffName, printerId } = body;

    if (action === "queue_single") {
      const item = queueBadgePrint({
        eventId,
        attendeeId: attendee.id,
        attendeeName: attendee.name,
        attendeeEmail: attendee.email,
        attendeeCompany: attendee.company,
        ticketName: attendee.ticketName,
        badgeType: attendee.badgeType || "attendee",
        printerId,
      });

      return NextResponse.json({ success: true, item });
    }

    if (action === "update_status" && queueId && status) {
      const updated = updateBadgePrintStatus(eventId, queueId, status, staffName);
      return NextResponse.json({ success: true, item: updated });
    }

    if (action === "reprint") {
      const reprintLog = recordBadgeReprint({
        eventId,
        attendeeId: attendee.id,
        attendeeName: attendee.name,
        printerId,
        printType: "reprint",
        reprintReason: reprintReason || "Damaged/Lost Badge",
        printedByName: staffName || "Desk Staff",
      });

      // Queue for reprinting
      const queueItem = queueBadgePrint({
        eventId,
        attendeeId: attendee.id,
        attendeeName: attendee.name,
        attendeeEmail: attendee.email,
        attendeeCompany: attendee.company,
        ticketName: attendee.ticketName,
        badgeType: attendee.badgeType || "attendee",
        printerId,
      });

      // Log to Ops audit logs
      logOpsAudit(
        eventId,
        "badge_reprint",
        "badge",
        attendee.id,
        {
          attendeeName: attendee.name,
          reason: reprintReason || "Damaged/Lost Badge",
          printerId,
        },
        staffName || "Badge Desk"
      );

      return NextResponse.json({ success: true, reprintLog, queueItem });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Badge print request failed" },
      { status: 500 }
    );
  }
}
