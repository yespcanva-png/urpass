"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AnalyticsEventSummary {
  id: string;
  name: string;
  venue: string;
  event_date: string;
  start_time: string;
  end_time: string;
  attendee_limit: number;
  status: string;
}

export interface HourlyBucket {
  hour: string;
  label: string;
  scans: number;
  pct: number;
  cumulative: number;
}

export interface GateStat {
  gateId: string | null;
  name: string;
  scans: number;
  pct: number;
}

export interface PassTypeStat {
  type: string;
  label: string;
  total: number;
  checkedIn: number;
  pct: number;
  revenue: number;
}

export interface RecentScan {
  id: string;
  attendeeId: string;
  name: string;
  email: string;
  passType: string;
  gateName: string;
  method: string;
  checkedInAt: string;
}

export interface EventComparisonItem {
  id: string;
  name: string;
  venue: string;
  date: string;
  status: string;
  attendeeLimit: number;
  totalRegistrations: number;
  approvedCount: number;
  passesGenerated: number;
  checkedInCount: number;
  attendanceRate: number;
  peakVelocityPerHour: number;
}

export interface AnalyticsData {
  eventId: string;
  eventName?: string;
  venue?: string;
  eventDate?: string;
  attendeeLimit?: number;
  status?: string;
  eventsList: AnalyticsEventSummary[];
  totalEvents: number;
  totalRegistrations: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  passesGeneratedCount: number;
  checkedInCount: number;
  notArrivedCount: number;
  attendanceRate: number;
  acceptanceRate: number;
  passDeliveryRate: number;
  noShowRate: number;
  peakVelocity: number;
  peakVelocityTime: string;
  avgScansPerHour: number;
  totalRevenue: number;
  hourlyTimeline: HourlyBucket[];
  gateBreakdown: GateStat[];
  methodBreakdown: { qr: number; manual: number; search: number };
  passTypeBreakdown: PassTypeStat[];
  recentScans: RecentScan[];
  eventComparison: EventComparisonItem[];
}

interface RawAttendee {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone?: string | null;
  pass_type: string;
  application_status: string;
  pass_status: string;
  created_at: string;
  ticket_type_id?: string | null;
}

interface RawCheckin {
  id: string;
  attendee_id: string;
  event_id: string;
  checked_in_at: string;
  gate_id: string | null;
  check_in_method: string | null;
  gate?: { name: string } | { name: string }[] | null;
}

function resolveGateName(gate: RawCheckin["gate"]): string | undefined {
  if (!gate) return undefined;
  if (Array.isArray(gate)) return gate[0]?.name;
  return gate.name;
}

interface RawGate {
  id: string;
  event_id: string;
  name: string;
  zone_id?: string | null;
}

interface RawTicketType {
  id: string;
  event_id: string;
  name: string;
  price: number;
  category: string;
}

const PASS_LABELS: Record<string, string> = {
  participant: "Participant",
  vip: "VIP",
  speaker: "Speaker",
  organizer: "Organizer",
  student: "Student",
  general: "General",
};

export async function getAnalyticsData(targetEventId?: string): Promise<AnalyticsData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch all events the user owns or is an active org member of
  const [{ data: ownedEvents }, { data: orgMemberships }] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, venue, event_date, start_time, end_time, attendee_limit, status, organization_id, created_at")
      .eq("organizer_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .eq("status", "active"),
  ]);

  const orgIds = (orgMemberships ?? []).map((m) => m.organization_id).filter(Boolean);
  let orgEvents: AnalyticsEventSummary[] = [];

  if (orgIds.length > 0) {
    const { data } = await supabase
      .from("events")
      .select("id, name, venue, event_date, start_time, end_time, attendee_limit, status, organization_id, created_at")
      .in("organization_id", orgIds)
      .order("created_at", { ascending: false });
    orgEvents = (data ?? []) as unknown as AnalyticsEventSummary[];
  }

  // Combine and deduplicate events
  const eventMap = new Map<string, AnalyticsEventSummary>();
  (ownedEvents ?? []).forEach((e) => eventMap.set(e.id, e as unknown as AnalyticsEventSummary));
  orgEvents.forEach((e) => eventMap.set(e.id, e));

  const allEvents = Array.from(eventMap.values()).sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  const isSpecificEvent = targetEventId && targetEventId !== "all" && eventMap.has(targetEventId);
  const activeEventId = isSpecificEvent ? targetEventId! : "all";
  const selectedEvent = isSpecificEvent ? eventMap.get(activeEventId) : null;

  const eventIdsToQuery = isSpecificEvent
    ? [activeEventId]
    : allEvents.map((e) => e.id);

  if (eventIdsToQuery.length === 0) {
    return {
      eventId: "all",
      eventsList: [],
      totalEvents: 0,
      totalRegistrations: 0,
      approvedCount: 0,
      pendingCount: 0,
      rejectedCount: 0,
      passesGeneratedCount: 0,
      checkedInCount: 0,
      notArrivedCount: 0,
      attendanceRate: 0,
      acceptanceRate: 0,
      passDeliveryRate: 0,
      noShowRate: 0,
      peakVelocity: 0,
      peakVelocityTime: "N/A",
      avgScansPerHour: 0,
      totalRevenue: 0,
      hourlyTimeline: [],
      gateBreakdown: [],
      methodBreakdown: { qr: 0, manual: 0, search: 0 },
      passTypeBreakdown: [],
      recentScans: [],
      eventComparison: [],
    };
  }

  // 2. Fetch attendees, check_ins, gates, and ticket types
  const [
    { data: attendeesData },
    { data: checkinsData },
    { data: gatesData },
    { data: ticketTypesData },
  ] = await Promise.all([
    supabase
      .from("attendees")
      .select("id, event_id, name, email, phone, pass_type, application_status, pass_status, created_at, ticket_type_id")
      .in("event_id", eventIdsToQuery)
      .order("created_at", { ascending: false }),
    supabase
      .from("check_ins")
      .select("id, attendee_id, event_id, checked_in_at, gate_id, check_in_method, gate:scanner_gates(name)")
      .in("event_id", eventIdsToQuery)
      .order("checked_in_at", { ascending: false }),
    supabase
      .from("scanner_gates")
      .select("id, event_id, name, zone_id")
      .in("event_id", eventIdsToQuery),
    supabase
      .from("ticket_types")
      .select("id, event_id, name, price, category")
      .in("event_id", eventIdsToQuery),
  ]);

  const attendees = (attendeesData ?? []) as unknown as RawAttendee[];
  const checkins = (checkinsData ?? []) as unknown as RawCheckin[];
  const gates = (gatesData ?? []) as unknown as RawGate[];
  const ticketTypes = (ticketTypesData ?? []) as unknown as RawTicketType[];

  // 3. Core KPI Computations
  const totalRegistrations = attendees.length;
  const approvedCount = attendees.filter((a) => a.application_status === "approved").length;
  const pendingCount = attendees.filter((a) => a.application_status === "pending").length;
  const rejectedCount = attendees.filter((a) => a.application_status === "rejected").length;
  const passesGeneratedCount = attendees.filter(
    (a) => a.pass_status === "generated" || a.pass_status === "checked_in"
  ).length;
  const checkedInCount = checkins.length;
  const notArrivedCount = Math.max(0, approvedCount - checkedInCount);

  const attendanceRate =
    approvedCount > 0 ? Math.round((checkedInCount / approvedCount) * 1000) / 10 : 0;
  const acceptanceRate =
    totalRegistrations > 0 ? Math.round((approvedCount / totalRegistrations) * 1000) / 10 : 0;
  const passDeliveryRate =
    approvedCount > 0 ? Math.round((passesGeneratedCount / approvedCount) * 1000) / 10 : 0;
  const noShowRate =
    approvedCount > 0 ? Math.round((notArrivedCount / approvedCount) * 1000) / 10 : 0;

  // 4. Hourly Scan Timeline & Peak Velocity
  const hourBuckets = new Map<number, number>();
  // Initialize standard daytime hours if there are check-ins, or base around actual checkin range
  let minHour = 9;
  let maxHour = 18;

  if (checkins.length > 0) {
    const hours = checkins.map((c) => new Date(c.checked_in_at).getHours());
    minHour = Math.max(0, Math.min(...hours) - 1);
    maxHour = Math.min(23, Math.max(...hours) + 1);
  }

  for (let h = minHour; h <= maxHour; h++) {
    hourBuckets.set(h, 0);
  }

  checkins.forEach((c) => {
    const h = new Date(c.checked_in_at).getHours();
    hourBuckets.set(h, (hourBuckets.get(h) ?? 0) + 1);
  });

  let cumulative = 0;
  let peakHour = minHour;
  let maxScans = 0;

  const sortedHours = Array.from(hourBuckets.keys()).sort((a, b) => a - b);
  const hourlyTimeline: HourlyBucket[] = sortedHours.map((h) => {
    const count = hourBuckets.get(h) ?? 0;
    cumulative += count;
    if (count > maxScans) {
      maxScans = count;
      peakHour = h;
    }
    const h12 = h % 12 || 12;
    const ampm = h >= 12 ? "PM" : "AM";
    const nextH = (h + 1) % 24;
    const nextH12 = nextH % 12 || 12;
    const nextAmpm = nextH >= 12 ? "PM" : "AM";
    const label = `${h12} ${ampm}`;
    const hourRange = `${h12}:00 ${ampm} – ${nextH12}:00 ${nextAmpm}`;

    return {
      hour: hourRange,
      label,
      scans: count,
      pct: checkedInCount > 0 ? Math.round((count / checkedInCount) * 100) : 0,
      cumulative,
    };
  });

  const peakH12 = peakHour % 12 || 12;
  const peakAmpm = peakHour >= 12 ? "PM" : "AM";
  const nextPeakH = (peakHour + 1) % 24;
  const nextPeakH12 = nextPeakH % 12 || 12;
  const nextPeakAmpm = nextPeakH >= 12 ? "PM" : "AM";
  const peakVelocityTime =
    maxScans > 0 ? `${peakH12}:00 ${peakAmpm} – ${nextPeakH12}:00 ${nextPeakAmpm}` : "No check-ins yet";

  const activeHours = hourlyTimeline.filter((b) => b.scans > 0).length || 1;
  const avgScansPerHour =
    checkedInCount > 0 ? Math.round((checkedInCount / activeHours) * 10) / 10 : 0;

  // 5. Gate Breakdown
  const gateMap = new Map<string, { name: string; count: number }>();
  // Prepopulate gates
  gates.forEach((g) => {
    gateMap.set(g.id, { name: g.name, count: 0 });
  });

  checkins.forEach((c) => {
    const gateId = c.gate_id ?? "default";
    const gateName = resolveGateName(c.gate) || (c.gate_id && gateMap.get(c.gate_id)?.name) || "Main Entrance";
    const existing = gateMap.get(gateId) ?? { name: gateName, count: 0 };
    existing.count += 1;
    gateMap.set(gateId, existing);
  });

  const gateBreakdown: GateStat[] = Array.from(gateMap.entries())
    .map(([gateId, { name, count }]) => ({
      gateId: gateId === "default" ? null : gateId,
      name,
      scans: count,
      pct: checkedInCount > 0 ? Math.round((count / checkedInCount) * 100) : 0,
    }))
    .filter((g) => g.scans > 0 || gates.length > 0)
    .sort((a, b) => b.scans - a.scans);

  // 6. Method Breakdown
  const methodBreakdown = { qr: 0, manual: 0, search: 0 };
  checkins.forEach((c) => {
    const m = (c.check_in_method ?? "qr") as "qr" | "manual" | "search";
    if (m === "manual") methodBreakdown.manual += 1;
    else if (m === "search") methodBreakdown.search += 1;
    else methodBreakdown.qr += 1;
  });

  // 7. Pass Types & Ticket Tiers Breakdown
  const checkedInAttendeeIds = new Set(checkins.map((c) => c.attendee_id));
  const ticketTypeMap = new Map<string, RawTicketType>();
  ticketTypes.forEach((t) => ticketTypeMap.set(t.id, t));

  const passMap = new Map<string, { label: string; total: number; checkedIn: number; revenue: number }>();

  attendees.forEach((a) => {
    let key = a.pass_type || "participant";
    let label = PASS_LABELS[key] ?? key;
    let pricePaise = 0;

    if (a.ticket_type_id && ticketTypeMap.has(a.ticket_type_id)) {
      const tt = ticketTypeMap.get(a.ticket_type_id)!;
      key = `ticket-${tt.id}`;
      label = tt.name;
      pricePaise = tt.price;
    }

    const existing = passMap.get(key) ?? { label, total: 0, checkedIn: 0, revenue: 0 };
    existing.total += 1;
    if (checkedInAttendeeIds.has(a.id)) {
      existing.checkedIn += 1;
    }
    if (a.application_status === "approved" && pricePaise > 0) {
      existing.revenue += Math.round(pricePaise / 100);
    }
    passMap.set(key, existing);
  });

  const passTypeBreakdown: PassTypeStat[] = Array.from(passMap.entries())
    .map(([type, { label, total, checkedIn, revenue }]) => ({
      type,
      label,
      total,
      checkedIn,
      pct: total > 0 ? Math.round((checkedIn / total) * 100) : 0,
      revenue,
    }))
    .sort((a, b) => b.total - a.total);

  const totalRevenue = passTypeBreakdown.reduce((sum, p) => sum + p.revenue, 0);

  // 8. Recent Check-ins
  const attendeeMap = new Map<string, RawAttendee>();
  attendees.forEach((a) => attendeeMap.set(a.id, a));

  const recentScans: RecentScan[] = checkins.slice(0, 15).map((c) => {
    const att = attendeeMap.get(c.attendee_id);
    const gateName = resolveGateName(c.gate) || (c.gate_id && gateMap.get(c.gate_id)?.name) || "Main Entrance";
    const passType = att?.pass_type ? PASS_LABELS[att.pass_type] ?? att.pass_type : "Participant";

    return {
      id: c.id,
      attendeeId: c.attendee_id,
      name: att?.name ?? "Unknown Attendee",
      email: att?.email ?? "",
      passType,
      gateName,
      method: c.check_in_method ?? "qr",
      checkedInAt: c.checked_in_at,
    };
  });

  // 9. Event Comparison Table (for multi-event view)
  const eventComparison: EventComparisonItem[] = allEvents.map((evt) => {
    const evtAttendees = attendees.filter((a) => a.event_id === evt.id);
    const evtCheckins = checkins.filter((c) => c.event_id === evt.id);

    const regCount = evtAttendees.length;
    const appCount = evtAttendees.filter((a) => a.application_status === "approved").length;
    const passCount = evtAttendees.filter(
      (a) => a.pass_status === "generated" || a.pass_status === "checked_in"
    ).length;
    const checkCount = evtCheckins.length;
    const rate = appCount > 0 ? Math.round((checkCount / appCount) * 1000) / 10 : 0;

    // Peak velocity for this event
    const evtHourCounts = new Map<number, number>();
    evtCheckins.forEach((c) => {
      const h = new Date(c.checked_in_at).getHours();
      evtHourCounts.set(h, (evtHourCounts.get(h) ?? 0) + 1);
    });
    let evtPeak = 0;
    evtHourCounts.forEach((v) => {
      if (v > evtPeak) evtPeak = v;
    });

    return {
      id: evt.id,
      name: evt.name,
      venue: evt.venue,
      date: evt.event_date,
      status: evt.status,
      attendeeLimit: evt.attendee_limit,
      totalRegistrations: regCount,
      approvedCount: appCount,
      passesGenerated: passCount,
      checkedInCount: checkCount,
      attendanceRate: rate,
      peakVelocityPerHour: evtPeak,
    };
  });

  return {
    eventId: activeEventId,
    eventName: selectedEvent?.name,
    venue: selectedEvent?.venue,
    eventDate: selectedEvent?.event_date,
    attendeeLimit: selectedEvent?.attendee_limit,
    status: selectedEvent?.status,
    eventsList: allEvents,
    totalEvents: allEvents.length,
    totalRegistrations,
    approvedCount,
    pendingCount,
    rejectedCount,
    passesGeneratedCount,
    checkedInCount,
    notArrivedCount,
    attendanceRate,
    acceptanceRate,
    passDeliveryRate,
    noShowRate,
    peakVelocity: maxScans,
    peakVelocityTime,
    avgScansPerHour,
    totalRevenue,
    hourlyTimeline,
    gateBreakdown,
    methodBreakdown,
    passTypeBreakdown,
    recentScans,
    eventComparison,
  };
}
