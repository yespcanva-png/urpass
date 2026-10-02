import { NextResponse } from "next/server";
import {
  queueBadgePrintDb,
  updateBadgePrintStatusDb,
  recordBadgeReprintDb,
  getBadgePrintQueueDb,
  getBadgePrintLogsDb,
  saveBadgeTemplateDb,
  bulkQueueApprovedAttendeesDb,
} from "@/lib/physical-ops/badge-service";
import { logOpsAuditDb } from "@/lib/physical-ops/audit-alert-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const queue = await getBadgePrintQueueDb(eventId);
    const logs = await getBadgePrintLogsDb(eventId);
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
    const { action, attendee, queueId, status, reprintReason, staffName, printerId, template } = body;

    if (action === "save_template" && template) {
      const saved = await saveBadgeTemplateDb({ ...template, eventId });
      await logOpsAuditDb(
        eventId,
        "badge_reprint",
        "badge",
        saved.id,
        { action: "save_template", templateName: saved.name, badgeType: saved.badgeType },
        staffName || "Badge Studio"
      );
      return NextResponse.json({ success: true, template: saved });
    }

    if (action === "bulk_queue") {
      const queuedCount = await bulkQueueApprovedAttendeesDb(eventId);
      const queue = await getBadgePrintQueueDb(eventId);
      return NextResponse.json({ success: true, queuedCount, queue });
    }

    if (action === "queue_single" && attendee) {
      const item = await queueBadgePrintDb({
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
      const updated = await updateBadgePrintStatusDb(eventId, queueId, status, staffName);
      return NextResponse.json({ success: true, item: updated });
    }

    if (action === "reprint" && attendee) {
      const reprintLog = await recordBadgeReprintDb({
        eventId,
        attendeeId: attendee.id,
        attendeeName: attendee.name,
        printerId,
        printType: "reprint",
        reprintReason: reprintReason || "Damaged/Lost Badge",
        printedByName: staffName || "Desk Staff",
      });

      // Queue for reprinting
      const queueItem = await queueBadgePrintDb({
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
      await logOpsAuditDb(
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
