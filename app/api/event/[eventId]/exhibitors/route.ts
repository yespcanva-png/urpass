import { NextResponse } from "next/server";
import {
  getEventExhibitorsDb,
  saveEventExhibitorDb,
  deleteEventExhibitorDb,
  toggleBoothCheckInDb,
} from "@/lib/exhibitor-sponsor/exhibitor-service";
import { logOpsAuditDb } from "@/lib/physical-ops/audit-alert-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const q = url.searchParams.get("q")?.toLowerCase();

    let exhibitors = await getEventExhibitorsDb(eventId);

    if (category && category !== "all") {
      exhibitors = exhibitors.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    if (q) {
      exhibitors = exhibitors.filter(
        (e) =>
          e.companyName.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          e.productsServices.some((p) => p.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, exhibitors });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load exhibitors" },
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
    const { action, exhibitor, exhibitorId, checkedIn, staffName } = body;

    if (action === "save" && exhibitor) {
      const saved = await saveEventExhibitorDb({ ...exhibitor, eventId });
      await logOpsAuditDb(
        eventId,
        "manual_checkin",
        "staff",
        saved.id,
        { action: "save_exhibitor", companyName: saved.companyName, boothId: saved.boothId },
        staffName || "Exhibitor Manager"
      );
      return NextResponse.json({ success: true, exhibitor: saved });
    }

    if (action === "delete" && exhibitorId) {
      await deleteEventExhibitorDb(eventId, exhibitorId);
      return NextResponse.json({ success: true });
    }

    if (action === "toggle_booth_checkin" && exhibitorId) {
      await toggleBoothCheckInDb(eventId, exhibitorId, Boolean(checkedIn));
      return NextResponse.json({ success: true, boothCheckedIn: Boolean(checkedIn) });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Exhibitor operation failed" },
      { status: 500 }
    );
  }
}
