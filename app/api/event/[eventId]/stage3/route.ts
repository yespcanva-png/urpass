import { NextResponse } from "next/server";
import { getStage3DashboardStatsDb } from "@/lib/exhibitor-sponsor/analytics-service";
import { getEventExhibitorsDb } from "@/lib/exhibitor-sponsor/exhibitor-service";
import { getEventSponsorsDb, getSponsorshipTiersDb } from "@/lib/exhibitor-sponsor/sponsor-service";
import { getEventBoothsDb } from "@/lib/exhibitor-sponsor/booth-service";
import { getExhibitorLeadsDb } from "@/lib/exhibitor-sponsor/lead-service";
import { getExhibitorMeetingsDb } from "@/lib/exhibitor-sponsor/meeting-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const [stats, exhibitors, sponsors, tiers, booths, leads, meetings] = await Promise.all([
      getStage3DashboardStatsDb(eventId),
      getEventExhibitorsDb(eventId),
      getEventSponsorsDb(eventId),
      getSponsorshipTiersDb(eventId),
      getEventBoothsDb(eventId),
      getExhibitorLeadsDb(eventId),
      getExhibitorMeetingsDb(eventId),
    ]);

    return NextResponse.json({
      success: true,
      stats,
      exhibitors,
      sponsors,
      tiers,
      booths,
      recentLeads: leads.slice(0, 20),
      recentMeetings: meetings.slice(0, 15),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load Stage 3 telemetry" },
      { status: 500 }
    );
  }
}
