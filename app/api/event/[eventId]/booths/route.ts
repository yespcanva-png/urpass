import { NextResponse } from "next/server";
import {
  getEventBoothsDb,
  saveEventBoothDb,
  deleteEventBoothDb,
} from "@/lib/exhibitor-sponsor/booth-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const booths = await getEventBoothsDb(eventId);
    return NextResponse.json({ success: true, booths });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load booths" },
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
    const { action, booth, boothId } = body;

    if (action === "save" && booth) {
      const saved = await saveEventBoothDb({ ...booth, eventId });
      return NextResponse.json({ success: true, booth: saved });
    }

    if (action === "delete" && boothId) {
      await deleteEventBoothDb(eventId, boothId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Booth operation failed" },
      { status: 500 }
    );
  }
}
