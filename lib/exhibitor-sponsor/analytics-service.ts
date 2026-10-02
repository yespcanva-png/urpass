import type { Stage3DashboardStats, ExhibitorLead } from "./types";
import { getAdminClient } from "./db";
import { getEventExhibitorsDb } from "./exhibitor-service";
import { getEventSponsorsDb } from "./sponsor-service";
import { getEventBoothsDb } from "./booth-service";
import { getExhibitorLeadsDb } from "./lead-service";
import { getExhibitorMeetingsDb } from "./meeting-service";

export function computeStage3Stats(
  exhibitors: any[],
  sponsors: any[],
  booths: any[],
  leads: any[],
  meetings: any[]
): Stage3DashboardStats {
  return {
    totalExhibitors: exhibitors.length,
    activeExhibitors: exhibitors.filter((e) => e.status === "active").length,
    totalSponsors: sponsors.length,
    totalBooths: booths.length,
    assignedBooths: booths.filter((b) => b.status === "assigned" || b.status === "occupied").length,
    totalLeadsCaptured: leads.length,
    hotLeadsCount: leads.filter((l) => l.qualificationRating === "hot").length,
    totalMeetingsRequested: meetings.length,
    confirmedMeetingsCount: meetings.filter((m) => m.status === "accepted" || m.status === "completed").length,
    sponsorImpressions: sponsors.reduce(
      (acc, s) => acc + (s.pageViews || 0) + (s.bannerClicks || 0) + (s.boothVisits || 0),
      0
    ),
  };
}

export async function getStage3DashboardStatsDb(eventId: string): Promise<Stage3DashboardStats> {
  const admin = getAdminClient();
  if (!admin) {
    const exhibitors = await getEventExhibitorsDb(eventId);
    const sponsors = await getEventSponsorsDb(eventId);
    const booths = await getEventBoothsDb(eventId);
    const leads = await getExhibitorLeadsDb(eventId);
    const meetings = await getExhibitorMeetingsDb(eventId);

    return computeStage3Stats(exhibitors, sponsors, booths, leads, meetings);
  }

  try {
    const [
      { count: totalExhibitors },
      { count: activeExhibitors },
      { count: totalSponsors },
      { count: totalBooths },
      { count: assignedBooths },
      { count: totalLeadsCaptured },
      { count: hotLeadsCount },
      { count: totalMeetingsRequested },
      { count: confirmedMeetingsCount },
      { data: sponsorStats },
    ] = await Promise.all([
      admin.from("event_exhibitors").select("id", { count: "exact", head: true }).eq("event_id", eventId),
      admin.from("event_exhibitors").select("id", { count: "exact", head: true }).eq("event_id", eventId).eq("status", "active"),
      admin.from("event_sponsors").select("id", { count: "exact", head: true }).eq("event_id", eventId),
      admin.from("event_booths").select("id", { count: "exact", head: true }).eq("event_id", eventId),
      admin.from("event_booths").select("id", { count: "exact", head: true }).eq("event_id", eventId).in("status", ["assigned", "occupied"]),
      admin.from("exhibitor_leads").select("id", { count: "exact", head: true }).eq("event_id", eventId),
      admin.from("exhibitor_leads").select("id", { count: "exact", head: true }).eq("event_id", eventId).eq("qualification_rating", "hot"),
      admin.from("exhibitor_b2b_meetings").select("id", { count: "exact", head: true }).eq("event_id", eventId),
      admin.from("exhibitor_b2b_meetings").select("id", { count: "exact", head: true }).eq("event_id", eventId).in("status", ["accepted", "completed"]),
      admin.from("event_sponsors").select("page_views, banner_clicks, booth_visits").eq("event_id", eventId),
    ]);

    const sponsorImpressions = (sponsorStats || []).reduce(
      (acc: number, s: any) => acc + (s.page_views || 0) + (s.banner_clicks || 0) + (s.booth_visits || 0),
      0
    );

    return {
      totalExhibitors: totalExhibitors || 0,
      activeExhibitors: activeExhibitors || 0,
      totalSponsors: totalSponsors || 0,
      totalBooths: totalBooths || 0,
      assignedBooths: assignedBooths || 0,
      totalLeadsCaptured: totalLeadsCaptured || 0,
      hotLeadsCount: hotLeadsCount || 0,
      totalMeetingsRequested: totalMeetingsRequested || 0,
      confirmedMeetingsCount: confirmedMeetingsCount || 0,
      sponsorImpressions,
    };
  } catch (err) {
    console.warn("[analytics-service] Error calculating Stage 3 metrics:", err);
    return {
      totalExhibitors: 0,
      activeExhibitors: 0,
      totalSponsors: 0,
      totalBooths: 0,
      assignedBooths: 0,
      totalLeadsCaptured: 0,
      hotLeadsCount: 0,
      totalMeetingsRequested: 0,
      confirmedMeetingsCount: 0,
      sponsorImpressions: 0,
    };
  }
}

export interface ExhibitorLeadAnalytics {
  totalLeads: number;
  uniqueAttendees: number;
  ratingBreakdown: {
    hot: number;
    warm: number;
    cold: number;
  };
  leadsByStaff: Record<string, number>;
  leadsByHour: Record<string, number>;
  followUpBreakdown: Record<string, number>;
}

export function computeExhibitorLeadAnalytics(leads: ExhibitorLead[]): ExhibitorLeadAnalytics {
  const uniqueAttendeeIds = new Set(leads.map((l) => l.attendeeId || l.attendeeEmail));

  const ratingBreakdown = { hot: 0, warm: 0, cold: 0 };
  const leadsByStaff: Record<string, number> = {};
  const leadsByHour: Record<string, number> = {};
  const followUpBreakdown: Record<string, number> = {};

  leads.forEach((l) => {
    ratingBreakdown[l.qualificationRating] = (ratingBreakdown[l.qualificationRating] || 0) + 1;

    const staff = l.staffName || "Booth Scanner";
    leadsByStaff[staff] = (leadsByStaff[staff] || 0) + 1;

    const hour = new Date(l.capturedAt).toLocaleTimeString([], { hour: "2-digit", hour12: true });
    leadsByHour[hour] = (leadsByHour[hour] || 0) + 1;

    followUpBreakdown[l.followUpStatus] = (followUpBreakdown[l.followUpStatus] || 0) + 1;
  });

  return {
    totalLeads: leads.length,
    uniqueAttendees: uniqueAttendeeIds.size,
    ratingBreakdown,
    leadsByStaff,
    leadsByHour,
    followUpBreakdown,
  };
}
