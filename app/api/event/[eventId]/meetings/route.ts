import { NextResponse } from "next/server";
import {
  getExhibitorMeetingsDb,
  requestB2BMeetingDb,
  updateMeetingStatusDb,
  bookmarkExhibitorDb,
} from "@/lib/exhibitor-sponsor/meeting-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const url = new URL(request.url);
    const exhibitorId = url.searchParams.get("exhibitorId") || undefined;
    const meetings = await getExhibitorMeetingsDb(eventId, exhibitorId);
    return NextResponse.json({ success: true, meetings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load meetings" },
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
    const {
      action,
      exhibitorId,
      attendeeId,
      requesterName,
      requesterEmail,
      requesterCompany,
      proposedTime,
      durationMinutes,
      location,
      meetingNotes,
      callbackRequested,
      businessCardShared,
    } = body;

    if (action === "bookmark" && exhibitorId && attendeeId) {
      const bm = await bookmarkExhibitorDb(
        eventId,
        exhibitorId,
        attendeeId,
        Boolean(callbackRequested),
        Boolean(businessCardShared)
      );
      return NextResponse.json({ success: true, bookmark: bm });
    }

    if (!exhibitorId || !requesterName || !requesterEmail || !proposedTime) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (exhibitorId, requesterName, requesterEmail, proposedTime)" },
        { status: 400 }
      );
    }

    const meeting = await requestB2BMeetingDb({
      eventId,
      exhibitorId,
      attendeeId,
      requesterName,
      requesterEmail,
      requesterCompany,
      proposedTime,
      durationMinutes,
      location,
      meetingNotes,
    });

    return NextResponse.json({ success: true, meeting });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to request meeting" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const body = await request.json();
    const { meetingId, status } = body;

    if (!meetingId || !status) {
      return NextResponse.json({ success: false, error: "Missing meetingId or status" }, { status: 400 });
    }

    const ok = await updateMeetingStatusDb(meetingId, status);
    return NextResponse.json({ success: ok });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update meeting status" },
      { status: 500 }
    );
  }
}
