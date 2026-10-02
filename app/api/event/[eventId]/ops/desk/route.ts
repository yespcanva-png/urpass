import { NextResponse } from "next/server";
import {
  registerWalkIn,
  searchDeskAttendees,
  updateDeskAttendee,
  checkInDeskAttendee,
} from "@/lib/physical-ops/desk-service";
import { logOpsAudit } from "@/lib/physical-ops/audit-alert-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const attendees = searchDeskAttendees(eventId, q);
    return NextResponse.json({ success: true, attendees });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to search attendees" },
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
    const { action, payload, attendeeId, updates, staffName } = body;

    if (action === "walkin") {
      const attendee = registerWalkIn({ ...payload, eventId, staffName });

      logOpsAudit(
        eventId,
        "walkin_registration",
        "attendee",
        attendee.id,
        {
          name: attendee.name,
          email: attendee.email,
          ticketName: attendee.ticketName,
          paymentMethod: attendee.paymentMethod,
          amountPaid: attendee.amountPaid,
          autoCheckedIn: attendee.isCheckedIn,
        },
        staffName || "Registration Desk"
      );

      return NextResponse.json({ success: true, attendee });
    }

    if (action === "update" && attendeeId) {
      const updated = updateDeskAttendee(eventId, attendeeId, updates);
      if (updates.paymentStatus) {
        logOpsAudit(
          eventId,
          "payment_status_change",
          "payment",
          attendeeId,
          { updates },
          staffName || "Registration Desk"
        );
      }
      return NextResponse.json({ success: true, attendee: updated });
    }

    if (action === "checkin" && attendeeId) {
      const checkedIn = checkInDeskAttendee(eventId, attendeeId);
      logOpsAudit(
        eventId,
        "manual_checkin",
        "attendee",
        attendeeId,
        { checkInMethod: "onsite_desk" },
        staffName || "Registration Desk"
      );
      return NextResponse.json({ success: true, attendee: checkedIn });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Desk operation failed" },
      { status: 500 }
    );
  }
}
