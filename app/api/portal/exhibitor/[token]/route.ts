import { NextResponse } from "next/server";
import {
  getExhibitorByTokenDb,
  saveEventExhibitorDb,
  getExhibitorStaffDb,
  saveExhibitorStaffDb,
  toggleBoothCheckInDb,
} from "@/lib/exhibitor-sponsor/exhibitor-service";
import { getExhibitorLeadsDb } from "@/lib/exhibitor-sponsor/lead-service";
import { getExhibitorMeetingsDb } from "@/lib/exhibitor-sponsor/meeting-service";
import { computeExhibitorLeadAnalytics } from "@/lib/exhibitor-sponsor/analytics-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const exhibitor = await getExhibitorByTokenDb(token);

    if (!exhibitor) {
      return NextResponse.json({ success: false, error: "Invalid or expired exhibitor portal token" }, { status: 404 });
    }

    const [staff, leads, meetings] = await Promise.all([
      getExhibitorStaffDb(exhibitor.id),
      getExhibitorLeadsDb(exhibitor.eventId, exhibitor.id),
      getExhibitorMeetingsDb(exhibitor.eventId, exhibitor.id),
    ]);

    const analytics = computeExhibitorLeadAnalytics(leads);

    return NextResponse.json({
      success: true,
      exhibitor,
      staff,
      leads,
      meetings,
      analytics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load portal" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const exhibitor = await getExhibitorByTokenDb(token);

    if (!exhibitor) {
      return NextResponse.json({ success: false, error: "Invalid exhibitor token" }, { status: 404 });
    }

    const body = await request.json();
    const { action, profile, staffMember, checkedIn } = body;

    if (action === "update_profile" && profile) {
      const updated = await saveEventExhibitorDb({
        ...exhibitor,
        ...profile,
        id: exhibitor.id,
        eventId: exhibitor.eventId,
      });
      return NextResponse.json({ success: true, exhibitor: updated });
    }

    if (action === "add_staff" && staffMember) {
      const savedStaff = await saveExhibitorStaffDb({
        ...staffMember,
        exhibitorId: exhibitor.id,
        eventId: exhibitor.eventId,
      });
      return NextResponse.json({ success: true, staffMember: savedStaff });
    }

    if (action === "toggle_booth_checkin") {
      await toggleBoothCheckInDb(exhibitor.eventId, exhibitor.id, Boolean(checkedIn));
      return NextResponse.json({ success: true, boothCheckedIn: Boolean(checkedIn) });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Portal action failed" },
      { status: 500 }
    );
  }
}
