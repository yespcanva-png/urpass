import { NextResponse } from "next/server";
import {
  getExhibitorLeadsDb,
  captureLeadFromQrDb,
  updateLeadQualificationDb,
  exportLeadsToCsv,
} from "@/lib/exhibitor-sponsor/lead-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const url = new URL(request.url);
    const exhibitorId = url.searchParams.get("exhibitorId") || undefined;
    const staffId = url.searchParams.get("staffId") || undefined;
    const rating = (url.searchParams.get("rating") as any) || undefined;
    const format = url.searchParams.get("format");

    const leads = await getExhibitorLeadsDb(eventId, exhibitorId, { staffId, rating });

    if (format === "csv") {
      const csv = exportLeadsToCsv(leads);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="leads-${eventId}-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load leads" },
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
      exhibitorId,
      tokenOrAttendeeId,
      staffId,
      staffName,
      qualificationRating,
      notes,
      interestedProducts,
      tags,
    } = body;

    if (!exhibitorId || !tokenOrAttendeeId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters (exhibitorId, tokenOrAttendeeId)" },
        { status: 400 }
      );
    }

    const lead = await captureLeadFromQrDb({
      eventId,
      exhibitorId,
      tokenOrAttendeeId,
      staffId,
      staffName,
      qualificationRating,
      notes,
      interestedProducts,
      tags,
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to capture lead" },
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
    const { leadId, updates } = body;

    if (!leadId || !updates) {
      return NextResponse.json({ success: false, error: "Missing leadId or updates" }, { status: 400 });
    }

    const ok = await updateLeadQualificationDb(leadId, updates);
    return NextResponse.json({ success: ok });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update lead" },
      { status: 500 }
    );
  }
}
