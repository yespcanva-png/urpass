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
  apply_slug?: string | null;
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
  uniqueAttendees?: number;
  reEntries?: number;
  firstEntries?: number;
  reEntryPct?: number;
  peakHourLabel?: string;
  peakHourScans?: number;
  avgScansPerHour?: number;
  methodBreakdown?: { qr: number; manual: number; search: number };
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
  scanSequence?: number;
  isReEntry?: boolean;
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
  uniqueCheckedInCount?: number;
  totalScansCount?: number;
  reEntryCount?: number;
  reEntryRate?: number;
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

  // Enhanced Multi-Checkin & Gate Telemetry
  uniqueCheckedInCount?: number;
  totalScansCount?: number;
  multipleCheckinsCount?: number;
  reEntryCount?: number;
  reEntryRate?: number;
  avgScansPerAttendee?: number;
  singleScanCount?: number;
  multiScanCount?: number;
  highFrequencyScanCount?: number;
  currentInsideCount?: number;
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
  venue_presence_state?: string | null;
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

interface RawPass {
  id: string;
  attendee_id: string;
  event_id: string;
  total_guests?: number | null;
  checked_in_guests?: number | null;
  is_group_master?: boolean | null;
  is_group_pass?: boolean | null;
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
      .select("id, name, venue, event_date, start_time, end_time, attendee_limit, status, organization_id, created_at, apply_slug")
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
      .select("id, name, venue, event_date, start_time, end_time, attendee_limit, status, organization_id, created_at, apply_slug")
      .in("organization_id", orgIds)
      .order("created_at", { ascending: false });
    orgEvents = (data ?? []) as unknown as AnalyticsEventSummary[];
  }

  // Combine and deduplicate events by UUID id
  const eventMap = new Map<string, AnalyticsEventSummary>();
  (ownedEvents ?? []).forEach((e) => eventMap.set(e.id, e as unknown as AnalyticsEventSummary));
  orgEvents.forEach((e) => eventMap.set(e.id, e));

  // If a specific targetEventId was provided, resolve by UUID or apply_slug
  let resolvedEvent: AnalyticsEventSummary | null = null;
  if (targetEventId && targetEventId !== "all") {
    // 1. Direct match on id
    if (eventMap.has(targetEventId)) {
      resolvedEvent = eventMap.get(targetEventId)!;
    } else {
      // 2. Match on apply_slug
      for (const evt of eventMap.values()) {
        if (evt.apply_slug === targetEventId) {
          resolvedEvent = evt;
          break;
        }
      }
    }

    // 3. Fallback: If not in owned or org-joined lists, fetch directly in case user has gate manager/staff role or scoped access
    if (!resolvedEvent) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetEventId);
      const query = supabase
        .from("events")
        .select("id, name, venue, event_date, start_time, end_time, attendee_limit, status, organization_id, created_at, apply_slug");
      const { data: directEvent } = isUUID
        ? await query.eq("id", targetEventId).maybeSingle()
        : await query.eq("apply_slug", targetEventId).maybeSingle();

      if (directEvent) {
        resolvedEvent = directEvent as unknown as AnalyticsEventSummary;
        eventMap.set(resolvedEvent.id, resolvedEvent);
      }
    }
  }

  const allEvents = Array.from(eventMap.values()).sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  const isSpecificEvent = Boolean(resolvedEvent);
  const activeEventId = resolvedEvent ? resolvedEvent.id : "all";
  const selectedEvent = resolvedEvent;

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
      uniqueCheckedInCount: 0,
      totalScansCount: 0,
      multipleCheckinsCount: 0,
      reEntryCount: 0,
      reEntryRate: 0,
      avgScansPerAttendee: 0,
      singleScanCount: 0,
      multiScanCount: 0,
      highFrequencyScanCount: 0,
      currentInsideCount: 0,
    };
  }

  // 2. Fetch attendees, check_ins, gates, and ticket types
  const [
    { data: attendeesData },
    { data: checkinsData },
    { data: gatesData },
    { data: ticketTypesData },
    { data: ticketOrdersData },
    { data: passesData },
  ] = await Promise.all([
    supabase
      .from("attendees")
      .select("id, event_id, name, email, phone, pass_type, application_status, pass_status, venue_presence_state, created_at, ticket_type_id")
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
    supabase
      .from("ticket_orders")
      .select("id, event_id, ticket_type_id, amount, status")
      .in("event_id", eventIdsToQuery),
    supabase
      .from("passes")
      .select("id, attendee_id, event_id, total_guests, checked_in_guests, is_group_master, is_group_pass")
      .in("event_id", eventIdsToQuery),
  ]);

  const attendees = (attendeesData ?? []) as unknown as RawAttendee[];
  const checkins = (checkinsData ?? []) as unknown as RawCheckin[];
  const gates = (gatesData ?? []) as unknown as RawGate[];
  const ticketTypes = (ticketTypesData ?? []) as unknown as RawTicketType[];
  const passes = (passesData ?? []) as unknown as RawPass[];
  const rawOrders = (ticketOrdersData ?? []) as Array<{ id: string; event_id: string; ticket_type_id: string | null; amount: number; status: string }>;
  const paidOrders = rawOrders.filter((o) => o.status === "paid");

  const entitlementUnitsByAttendee = new Map<string, number>();
  for (const pass of passes) {
    const isExplicitGroupCredential = Boolean(pass.is_group_master || pass.is_group_pass);
    const units = isExplicitGroupCredential ? Math.max(1, Number(pass.total_guests || 1)) : 1;
    entitlementUnitsByAttendee.set(pass.attendee_id, Math.max(entitlementUnitsByAttendee.get(pass.attendee_id) ?? 1, units));
  }

  const checkinsByAttendee = new Map<string, number>();
  for (const checkin of checkins) {
    checkinsByAttendee.set(checkin.attendee_id, (checkinsByAttendee.get(checkin.attendee_id) ?? 0) + 1);
  }

  // Chronologically sort checkins to trace 1st entry vs subsequent re-entries
  const sortedCheckins = [...checkins].sort(
    (a, b) => new Date(a.checked_in_at).getTime() - new Date(b.checked_in_at).getTime()
  );

  const attendeeScanSeqMap = new Map<string, number>();
  const checkinSeqMap = new Map<string, number>();
  sortedCheckins.forEach((c) => {
    const seq = (attendeeScanSeqMap.get(c.attendee_id) ?? 0) + 1;
    attendeeScanSeqMap.set(c.attendee_id, seq);
    checkinSeqMap.set(c.id, seq);
  });

  // Calculate unique checked in attendees:
  const authoritativeCheckedInIds = new Set([
    ...checkins.map((c) => c.attendee_id),
    ...attendees
      .filter(
        (a) =>
          a.pass_status === "checked_in" ||
          a.venue_presence_state?.toUpperCase() === "INSIDE"
      )
      .map((a) => a.id),
  ]);
  const uniqueCheckedInCount = authoritativeCheckedInIds.size;
  const totalScansCount = Math.max(checkins.length, uniqueCheckedInCount);

  let singleScanCount = 0;
  let multiScanCount = 0;
  let highFrequencyScanCount = 0;

  attendeeScanSeqMap.forEach((count) => {
    if (count === 1) singleScanCount += 1;
    else if (count === 2) multiScanCount += 1;
    else if (count >= 3) {
      multiScanCount += 1;
      highFrequencyScanCount += 1;
    }
  });

  const multipleCheckinsCount = Array.from(attendeeScanSeqMap.values()).filter((c) => c > 1).length;
  const reEntryCount = Math.max(0, totalScansCount - uniqueCheckedInCount);
  const reEntryRate =
    uniqueCheckedInCount > 0 ? Math.round((multipleCheckinsCount / uniqueCheckedInCount) * 1000) / 10 : 0;
  const avgScansPerAttendee =
    uniqueCheckedInCount > 0 ? Math.round((totalScansCount / uniqueCheckedInCount) * 10) / 10 : 1.0;

  // Active presence / inside count
  const insideAttendees = attendees.filter(
    (a) => a.venue_presence_state?.toUpperCase() === "INSIDE" || (a.pass_status === "checked_in" && (checkinsByAttendee.get(a.id) ?? 0) > 0)
  );
  const currentInsideCount = insideAttendees.length > 0 ? insideAttendees.length : uniqueCheckedInCount;

  // 3. Core KPI Computations
  const totalRegistrations = attendees.length;
  const approvedAttendees = attendees.filter((a) => a.application_status === "approved");
  const approvedCount = approvedAttendees.reduce((sum, a) => sum + (entitlementUnitsByAttendee.get(a.id) ?? 1), 0);
  const pendingCount = attendees.filter((a) => a.application_status === "pending").length;
  const rejectedCount = attendees.filter((a) => a.application_status === "rejected").length;
  const passesGeneratedCount = attendees.reduce(
    (sum, a) =>
      a.pass_status === "generated" || a.pass_status === "checked_in"
        ? sum + (entitlementUnitsByAttendee.get(a.id) ?? 1)
        : sum,
    0
  );
  const checkedInCount = Array.from(authoritativeCheckedInIds).reduce(
    (sum, id) => sum + (entitlementUnitsByAttendee.get(id) ?? 1),
    0
  );
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

  // 5. Gate Breakdown with Deep Multi-Checkin & Lane Metrics
  interface GateDataTracker {
    name: string;
    totalScans: number;
    uniqueAttendees: Set<string>;
    firstEntries: number;
    reEntries: number;
    hourlyCounts: Map<number, number>;
    methodCounts: { qr: number; manual: number; search: number };
  }

  const gateMap = new Map<string, GateDataTracker>();
  // Prepopulate gates
  gates.forEach((g) => {
    gateMap.set(g.id, {
      name: g.name,
      totalScans: 0,
      uniqueAttendees: new Set(),
      firstEntries: 0,
      reEntries: 0,
      hourlyCounts: new Map(),
      methodCounts: { qr: 0, manual: 0, search: 0 },
    });
  });

  checkins.forEach((c) => {
    const gateId = c.gate_id ?? "default";
    const gateName = resolveGateName(c.gate) || (c.gate_id && gateMap.get(c.gate_id)?.name) || "Main Entrance";
    const tracker = gateMap.get(gateId) ?? {
      name: gateName,
      totalScans: 0,
      uniqueAttendees: new Set(),
      firstEntries: 0,
      reEntries: 0,
      hourlyCounts: new Map(),
      methodCounts: { qr: 0, manual: 0, search: 0 },
    };

    tracker.totalScans += 1;
    tracker.uniqueAttendees.add(c.attendee_id);

    const seq = checkinSeqMap.get(c.id) ?? 1;
    if (seq === 1) {
      tracker.firstEntries += 1;
    } else {
      tracker.reEntries += 1;
    }

    const h = new Date(c.checked_in_at).getHours();
    tracker.hourlyCounts.set(h, (tracker.hourlyCounts.get(h) ?? 0) + 1);

    const m = (c.check_in_method ?? "qr") as "qr" | "manual" | "search";
    if (m === "manual") tracker.methodCounts.manual += 1;
    else if (m === "search") tracker.methodCounts.search += 1;
    else tracker.methodCounts.qr += 1;

    gateMap.set(gateId, tracker);
  });

  const gateBreakdown: GateStat[] = Array.from(gateMap.entries())
    .map(([gateId, tracker]) => {
      let gatePeakHour = 0;
      let gatePeakScans = 0;
      tracker.hourlyCounts.forEach((cnt, hr) => {
        if (cnt > gatePeakScans) {
          gatePeakScans = cnt;
          gatePeakHour = hr;
        }
      });
      const h12 = gatePeakHour % 12 || 12;
      const ampm = gatePeakHour >= 12 ? "PM" : "AM";
      const nextH = (gatePeakHour + 1) % 24;
      const nextH12 = nextH % 12 || 12;
      const nextAmpm = nextH >= 12 ? "PM" : "AM";
      const peakHourLabel = gatePeakScans > 0 ? `${h12} ${ampm} – ${nextH12} ${nextAmpm}` : "N/A";

      const activeGateHours = Array.from(tracker.hourlyCounts.values()).filter((c) => c > 0).length || 1;
      const avgVelocity = tracker.totalScans > 0 ? Math.round((tracker.totalScans / activeGateHours) * 10) / 10 : 0;
      const reEntryPct = tracker.totalScans > 0 ? Math.round((tracker.reEntries / tracker.totalScans) * 100) : 0;

      return {
        gateId: gateId === "default" ? null : gateId,
        name: tracker.name,
        scans: tracker.totalScans,
        pct: totalScansCount > 0 ? Math.round((tracker.totalScans / totalScansCount) * 100) : 0,
        uniqueAttendees: tracker.uniqueAttendees.size,
        reEntries: tracker.reEntries,
        firstEntries: tracker.firstEntries,
        reEntryPct,
        peakHourLabel,
        peakHourScans: gatePeakScans,
        avgScansPerHour: avgVelocity,
        methodBreakdown: tracker.methodCounts,
      };
    })
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
  const ticketTypeMap = new Map<string, RawTicketType>();
  ticketTypes.forEach((t) => ticketTypeMap.set(t.id, t));

  // Map verified paid revenue from paidOrders
  const paidOrdersByTier = new Map<string, number>();
  let totalVerifiedRevenuePaise = 0;
  for (const po of paidOrders) {
    const amount = Number(po.amount || 0);
    totalVerifiedRevenuePaise += amount;
    if (po.ticket_type_id) {
      paidOrdersByTier.set(
        po.ticket_type_id,
        (paidOrdersByTier.get(po.ticket_type_id) ?? 0) + amount
      );
    }
  }

  const passMap = new Map<string, { label: string; total: number; checkedIn: number; revenue: number }>();
  attendees.forEach((a) => {
    let key = a.pass_type || "participant";
    let label = PASS_LABELS[key] ?? key;

    if (a.ticket_type_id && ticketTypeMap.has(a.ticket_type_id)) {
      const tt = ticketTypeMap.get(a.ticket_type_id)!;
      key = `ticket-${tt.id}`;
      label = tt.name;
    }

    const tierRevenuePaise = (a.ticket_type_id && paidOrdersByTier.get(a.ticket_type_id)) || 0;
    const existing = passMap.get(key) ?? {
      label,
      total: 0,
      checkedIn: 0,
      revenue: Math.round(tierRevenuePaise / 100),
    };
    const entitlementUnits = entitlementUnitsByAttendee.get(a.id) ?? 1;
    existing.total += entitlementUnits;
    existing.checkedIn += Math.min(checkinsByAttendee.get(a.id) ?? 0, entitlementUnits);
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

  const totalRevenue = Math.round(totalVerifiedRevenuePaise / 100);

  // 8. Recent Check-ins with Scan Sequence & Re-entry telemetry
  const attendeeMap = new Map<string, RawAttendee>();
  attendees.forEach((a) => attendeeMap.set(a.id, a));

  const recentScans: RecentScan[] = checkins.slice(0, 25).map((c) => {
    const att = attendeeMap.get(c.attendee_id);
    const gateName = resolveGateName(c.gate) || (c.gate_id && gateMap.get(c.gate_id)?.name) || "Main Entrance";
    const passType = att?.pass_type ? PASS_LABELS[att.pass_type] ?? att.pass_type : "Participant";
    const seq = checkinSeqMap.get(c.id) ?? 1;

    return {
      id: c.id,
      attendeeId: c.attendee_id,
      name: att?.name ?? "Unknown Attendee",
      email: att?.email ?? "",
      passType,
      gateName,
      method: c.check_in_method ?? "qr",
      checkedInAt: c.checked_in_at,
      scanSequence: seq,
      isReEntry: seq > 1,
    };
  });

  // 9. Event Comparison Table (for multi-event view)
  const eventComparison: EventComparisonItem[] = allEvents.map((evt) => {
    const evtAttendees = attendees.filter((a) => a.event_id === evt.id);
    const evtCheckins = checkins.filter((c) => c.event_id === evt.id);

    const regCount = evtAttendees.length;
    const appCount = evtAttendees
      .filter((a) => a.application_status === "approved")
      .reduce((sum, a) => sum + (entitlementUnitsByAttendee.get(a.id) ?? 1), 0);
    const passCount = evtAttendees.reduce(
      (sum, a) =>
        a.pass_status === "generated" || a.pass_status === "checked_in"
          ? sum + (entitlementUnitsByAttendee.get(a.id) ?? 1)
          : sum,
      0
    );

    const evtUniqueIds = new Set(evtCheckins.map((c) => c.attendee_id));
    const evtUniqueCount = evtUniqueIds.size;
    const evtTotalScans = evtCheckins.length;
    const evtReEntries = Math.max(0, evtTotalScans - evtUniqueCount);
    const evtReEntryRate = evtUniqueCount > 0 ? Math.round((evtReEntries / evtUniqueCount) * 1000) / 10 : 0;
    const rate = appCount > 0 ? Math.round((evtUniqueCount / appCount) * 1000) / 10 : 0;

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
      checkedInCount: evtUniqueCount,
      attendanceRate: rate,
      peakVelocityPerHour: evtPeak,
      uniqueCheckedInCount: evtUniqueCount,
      totalScansCount: evtTotalScans,
      reEntryCount: evtReEntries,
      reEntryRate: evtReEntryRate,
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

    // Enhanced Multi-Checkin & Gate Telemetry
    uniqueCheckedInCount,
    totalScansCount,
    multipleCheckinsCount,
    reEntryCount,
    reEntryRate,
    avgScansPerAttendee,
    singleScanCount,
    multiScanCount,
    highFrequencyScanCount,
    currentInsideCount,
  };
}

export async function exportFullEventAttendanceAction(eventId?: string): Promise<{
  success: boolean;
  rows?: Array<{
    name: string;
    email: string;
    passType: string;
    gateName: string;
    seqText: string;
    method: string;
    checkedInAt: string;
    istDate: string;
  }>;
  summary?: Record<string, any>;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const analyticsData = await getAnalyticsData(eventId);
    let eventIds: string[] = [];
    if (eventId) {
      eventIds = [eventId];
    } else {
      const { data: userEvents } = await supabase
        .from("events")
        .select("id")
        .eq("organizer_id", user.id);
      eventIds = (userEvents ?? []).map((e) => e.id);
    }

    const [att, chk, gts] = await Promise.all([
      supabase
        .from("attendees")
        .select("id, name, email, pass_type, pass_status, venue_presence_state")
        .in("event_id", eventIds),
      supabase
        .from("check_ins")
        .select("id, attendee_id, checked_in_at, gate_id, check_in_method, gate:scanner_gates(name)")
        .in("event_id", eventIds)
        .order("checked_in_at", { ascending: true }),
      supabase
        .from("scanner_gates")
        .select("id, name")
        .in("event_id", eventIds),
    ]);

    const attendeesData = att.data || [];
    const checkinsData = chk.data || [];
    const gatesData = gts.data || [];

    const attendeeMap = new Map<string, any>();
    attendeesData.forEach((a) => attendeeMap.set(a.id, a));
    const gateMap = new Map<string, string>();
    gatesData.forEach((g) => gateMap.set(g.id, g.name));

    const attendeeScanSeq = new Map<string, number>();
    const rows: Array<{
      name: string;
      email: string;
      passType: string;
      gateName: string;
      seqText: string;
      method: string;
      checkedInAt: string;
      istDate: string;
    }> = [];

    const recordedAttendeeIds = new Set<string>();

    for (const c of checkinsData) {
      recordedAttendeeIds.add(c.attendee_id);
      const seq = (attendeeScanSeq.get(c.attendee_id) ?? 0) + 1;
      attendeeScanSeq.set(c.attendee_id, seq);

      const a = attendeeMap.get(c.attendee_id);
      const gateName = resolveGateName(c.gate) || (c.gate_id && gateMap.get(c.gate_id)) || "Main Entrance";
      const passType = a?.pass_type ? PASS_LABELS[a.pass_type] ?? a.pass_type : "Participant";
      const seqText = seq > 1 ? `Re-Entry #${seq - 1} (Scan ${seq})` : "1st Entry";
      const istDate = new Date(c.checked_in_at).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "medium",
      });

      rows.push({
        name: a?.name ?? "Unknown Attendee",
        email: a?.email ?? "",
        passType,
        gateName,
        seqText,
        method: (c.check_in_method ?? "qr").toUpperCase(),
        checkedInAt: c.checked_in_at,
        istDate,
      });
    }

    // Include attendees marked checked_in who do not have a log in check_ins
    for (const a of attendeesData) {
      if (
        !recordedAttendeeIds.has(a.id) &&
        (a.pass_status === "checked_in" || a.venue_presence_state?.toUpperCase() === "INSIDE")
      ) {
        rows.push({
          name: a.name ?? "Unknown Attendee",
          email: a.email ?? "",
          passType: a.pass_type ? PASS_LABELS[a.pass_type] ?? a.pass_type : "Participant",
          gateName: "Direct Admission",
          seqText: "1st Entry",
          method: "DESK",
          checkedInAt: new Date().toISOString(),
          istDate: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "medium",
          }),
        });
      }
    }

    return {
      success: true,
      rows,
      summary: {
        eventName: analyticsData.eventName,
        totalRegistrations: analyticsData.totalRegistrations,
        approvedCount: analyticsData.approvedCount,
        passesGeneratedCount: analyticsData.passesGeneratedCount,
        uniqueCheckedInCount: analyticsData.uniqueCheckedInCount ?? analyticsData.checkedInCount,
        totalScansCount: analyticsData.totalScansCount ?? analyticsData.checkedInCount,
        multipleCheckinsCount: analyticsData.multipleCheckinsCount ?? 0,
        reEntryCount: analyticsData.reEntryCount ?? 0,
        reEntryRate: analyticsData.reEntryRate ?? 0,
        avgScansPerAttendee: analyticsData.avgScansPerAttendee ?? 1.0,
        attendanceRate: analyticsData.attendanceRate,
        peakVelocity: analyticsData.peakVelocity,
        peakVelocityTime: analyticsData.peakVelocityTime,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to generate comprehensive attendance export",
    };
  }
}
