import { NextRequest, NextResponse } from "next/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";

export const dynamic = "force-dynamic";

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Fetch checkins with attendee, pass, session, room, and reservations
  const { data: checkins, error } = await auth.supabase
    .from("session_checkins")
    .select(`
      id,
      checkin_time,
      checkout_time,
      scanner_user_id,
      device_id,
      attendee:attendees (
        id,
        name,
        email,
        phone,
        pass_type
      ),
      session:event_sessions (
        id,
        title,
        session_date,
        room:event_rooms (
          id,
          name
        )
      ),
      reservation:session_reservations (
        status
      )
    `)
    .eq("event_id", eventId)
    .order("checkin_time", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // CSV Columns matching Stage 1 UAT Section 34
  // Attendee Name, Email, Phone, Ticket Type, Session, Room, Reservation Status, Check-In Time, Check-Out Time, Scanner
  const headers = [
    "Attendee Name",
    "Email",
    "Phone",
    "Ticket Type",
    "Session",
    "Room",
    "Reservation Status",
    "Check-In Time",
    "Check-Out Time",
    "Scanner",
  ];

  const rows = (checkins || []).map((c: any) => {
    const attendee = Array.isArray(c.attendee) ? c.attendee[0] : c.attendee;
    const session = Array.isArray(c.session) ? c.session[0] : c.session;
    const room = session && (Array.isArray(session.room) ? session.room[0] : session.room);
    const reservation = Array.isArray(c.reservation) ? c.reservation[0] : c.reservation;

    const checkInLocal = c.checkin_time
      ? new Date(c.checkin_time).toLocaleString("en-IN")
      : "";
    const checkOutLocal = c.checkout_time
      ? new Date(c.checkout_time).toLocaleString("en-IN")
      : "";

    return [
      escapeCsv(attendee?.name || "Anonymous"),
      escapeCsv(attendee?.email || ""),
      escapeCsv(attendee?.phone || ""),
      escapeCsv(attendee?.pass_type || "Standard"),
      escapeCsv(session?.title || "Conference Session"),
      escapeCsv(room?.name || "Main Venue"),
      escapeCsv(reservation?.status || "walk-in"),
      escapeCsv(checkInLocal),
      escapeCsv(checkOutLocal),
      escapeCsv(c.scanner_user_id ? `Staff (${c.scanner_user_id.slice(0, 8)})` : c.device_id || "UrPass Scanner"),
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const fileName = `session-attendance-${eventId.slice(0, 8)}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
