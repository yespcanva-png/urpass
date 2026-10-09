import { createClient } from '@/lib/supabase/server';
import { isFeatureEnabled } from '@/lib/feature-flags';
import type {
  EventAnalyticsSummary,
  GateAnalytics,
  SessionAnalytics,
  DemographicBreakdown,
  DemographicCount,
  TimeSeriesDataPoint,
  AnalyticsFilter,
  FullEventAnalyticsReport,
} from './types';

/**
 * Pure helper: Calculate net presence from scan records.
 * Ensures re-entries do not inflate the total headcount inside venue.
 */
export function calculateNetPresence(
  scanEvents: Array<{
    attendee_id: string;
    operation_type: string; // 'entry' | 'exit' | 're_entry' | 'verification'
    scan_result?: string; // 'success' | 'denied' | 'duplicate'
    created_at?: string;
  }>
): {
  netInside: number;
  uniqueAttendeesEntered: number;
  totalEntries: number;
  totalExits: number;
  totalReEntries: number;
  totalDenied: number;
  insideAttendeeIds: Set<string>;
} {
  const attendeeStatus = new Map<string, boolean>(); // attendeeId -> isInside
  const everEnteredAttendees = new Set<string>();

  let totalEntries = 0;
  let totalExits = 0;
  let totalReEntries = 0;
  let totalDenied = 0;

  // Sort events chronologically to properly trace presence state
  const sorted = [...scanEvents].sort((a, b) => {
    const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return tA - tB;
  });

  for (const ev of sorted) {
    if (ev.scan_result === 'denied') {
      totalDenied++;
      continue;
    }

    if (ev.scan_result && ev.scan_result !== 'success' && ev.scan_result !== 'duplicate') {
      continue;
    }

    if (ev.operation_type === 'entry') {
      totalEntries++;
      attendeeStatus.set(ev.attendee_id, true);
      everEnteredAttendees.add(ev.attendee_id);
    } else if (ev.operation_type === 're_entry') {
      totalReEntries++;
      attendeeStatus.set(ev.attendee_id, true);
      everEnteredAttendees.add(ev.attendee_id);
    } else if (ev.operation_type === 'exit') {
      totalExits++;
      attendeeStatus.set(ev.attendee_id, false);
    }
  }

  const insideAttendeeIds = new Set<string>();
  for (const [attendeeId, isInside] of attendeeStatus.entries()) {
    if (isInside) {
      insideAttendeeIds.add(attendeeId);
    }
  }

  return {
    netInside: insideAttendeeIds.size,
    uniqueAttendeesEntered: everEnteredAttendees.size,
    totalEntries,
    totalExits,
    totalReEntries,
    totalDenied,
    insideAttendeeIds,
  };
}

/**
 * Pure helper: Calculate per-gate metrics.
 */
export function calculateGateAnalytics(
  scanEvents: Array<{
    gate_id?: string | null;
    operation_type: string;
    scan_result?: string;
    created_at?: string;
  }>,
  gates: Array<{ id: string; name: string; zone_id?: string | null; zone_name?: string | null }>
): GateAnalytics[] {
  const gateMap = new Map<string, GateAnalytics>();

  for (const g of gates) {
    gateMap.set(g.id, {
      gateId: g.id,
      gateName: g.name,
      zoneId: g.zone_id || null,
      zoneName: g.zone_name || null,
      totalEntries: 0,
      totalExits: 0,
      totalReEntries: 0,
      totalDenied: 0,
      scansByHour: [],
    });
  }

  // Default bucket for unassigned gate
  if (!gateMap.has('default')) {
    gateMap.set('default', {
      gateId: 'default',
      gateName: 'Main / Unassigned Gate',
      zoneId: null,
      zoneName: null,
      totalEntries: 0,
      totalExits: 0,
      totalReEntries: 0,
      totalDenied: 0,
      scansByHour: [],
    });
  }

  const hourlyScans = new Map<string, Map<string, { entries: number; exits: number }>>();

  for (const ev of scanEvents) {
    const gId = ev.gate_id || 'default';
    const gateObj = gateMap.get(gId) || gateMap.get('default')!;

    if (ev.scan_result === 'denied') {
      gateObj.totalDenied++;
      continue;
    }

    if (ev.operation_type === 'entry') {
      gateObj.totalEntries++;
    } else if (ev.operation_type === 're_entry') {
      gateObj.totalReEntries++;
    } else if (ev.operation_type === 'exit') {
      gateObj.totalExits++;
    }

    if (ev.created_at) {
      const hour = new Date(ev.created_at).toISOString().slice(11, 13) + ':00';
      if (!hourlyScans.has(gId)) {
        hourlyScans.set(gId, new Map());
      }
      const hourMap = hourlyScans.get(gId)!;
      const current = hourMap.get(hour) || { entries: 0, exits: 0 };
      if (ev.operation_type === 'entry' || ev.operation_type === 're_entry') {
        current.entries++;
      } else if (ev.operation_type === 'exit') {
        current.exits++;
      }
      hourMap.set(hour, current);
    }
  }

  for (const [gId, gateObj] of gateMap.entries()) {
    const hourMap = hourlyScans.get(gId);
    if (hourMap) {
      gateObj.scansByHour = Array.from(hourMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([hour, counts]) => ({
          hour,
          entries: counts.entries,
          exits: counts.exits,
        }));
    }
  }

  return Array.from(gateMap.values()).filter((g) => g.totalEntries + g.totalExits + g.totalReEntries + g.totalDenied > 0 || g.gateId !== 'default');
}

/**
 * Pure helper: Calculate session fill rates and attendance.
 */
export function calculateSessionAnalytics(
  sessionLogs: Array<{
    session_id: string;
    attendee_id: string;
    action: string; // 'check_in' | 'check_out'
    duration_minutes?: number | null;
    created_at?: string;
  }>,
  sessions: Array<{ id: string; title: string; capacity?: number | null; registered_count?: number }>
): SessionAnalytics[] {
  const result: SessionAnalytics[] = [];

  for (const s of sessions) {
    const logs = sessionLogs.filter((l) => l.session_id === s.id);
    const checkedInAttendeeIds = new Set<string>();
    let totalDuration = 0;
    let durationCount = 0;

    for (const l of logs) {
      if (l.action === 'check_in') {
        checkedInAttendeeIds.add(l.attendee_id);
      }
      if (l.duration_minutes && l.duration_minutes > 0) {
        totalDuration += l.duration_minutes;
        durationCount++;
      }
    }

    const totalAttended = checkedInAttendeeIds.size;
    const totalRegistered = s.registered_count || totalAttended;
    let fillRatePercentage = 0;
    if (s.capacity && s.capacity > 0) {
      fillRatePercentage = Math.min(100, Math.round((totalAttended / s.capacity) * 100));
    } else if (totalRegistered > 0) {
      fillRatePercentage = Math.min(100, Math.round((totalAttended / totalRegistered) * 100));
    }

    result.push({
      sessionId: s.id,
      sessionName: s.title,
      capacity: s.capacity || null,
      totalRegistered,
      totalAttended,
      fillRatePercentage,
      avgDurationMinutes: durationCount > 0 ? Math.round(totalDuration / durationCount) : null,
    });
  }

  return result;
}

/**
 * Pure helper: Calculate demographic breakdowns.
 */
export function calculateDemographics(
  attendees: Array<{
    ticket_tier?: string | null;
    college?: string | null;
    department?: string | null;
    member_data?: Record<string, any> | null;
  }>
): {
  byTicketTier: DemographicBreakdown;
  byCollege: DemographicBreakdown;
  byDepartment: DemographicBreakdown;
} {
  const tierCounts = new Map<string, number>();
  const collegeCounts = new Map<string, number>();
  const deptCounts = new Map<string, number>();
  const total = attendees.length;

  for (const att of attendees) {
    const tier = att.ticket_tier || 'General Admission';
    tierCounts.set(tier, (tierCounts.get(tier) || 0) + 1);

    const college = att.college || att.member_data?.college || att.member_data?.organization || 'Not Specified';
    collegeCounts.set(college, (collegeCounts.get(college) || 0) + 1);

    const dept = att.department || att.member_data?.department || att.member_data?.course || 'Not Specified';
    deptCounts.set(dept, (deptCounts.get(dept) || 0) + 1);
  }

  const formatCounts = (category: string, map: Map<string, number>): DemographicBreakdown => {
    const counts: DemographicCount[] = Array.from(map.entries())
      .map(([label, count]) => ({
        label,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
    return { category, counts };
  };

  return {
    byTicketTier: formatCounts('Ticket Tier', tierCounts),
    byCollege: formatCounts('College / Organization', collegeCounts),
    byDepartment: formatCounts('Department / Course', deptCounts),
  };
}

/**
 * Pure helper: Build time-series data points from scan events.
 */
export function buildTimeSeriesMetrics(
  scanEvents: Array<{
    attendee_id: string;
    operation_type: string;
    scan_result?: string;
    created_at: string;
  }>
): TimeSeriesDataPoint[] {
  if (!scanEvents.length) return [];

  const sorted = [...scanEvents]
    .filter((e) => e.created_at && (e.scan_result === 'success' || !e.scan_result))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const bucketMap = new Map<string, { entries: number; exits: number }>();

  for (const ev of sorted) {
    const bucket = new Date(ev.created_at).toISOString().slice(0, 13) + ':00'; // Hourly bucket
    const current = bucketMap.get(bucket) || { entries: 0, exits: 0 };
    if (ev.operation_type === 'entry' || ev.operation_type === 're_entry') {
      current.entries++;
    } else if (ev.operation_type === 'exit') {
      current.exits++;
    }
    bucketMap.set(bucket, current);
  }

  let runningNet = 0;
  const timeSeries: TimeSeriesDataPoint[] = [];

  for (const [timestamp, counts] of bucketMap.entries()) {
    runningNet += counts.entries - counts.exits;
    timeSeries.push({
      timestamp,
      entries: counts.entries,
      exits: counts.exits,
      netInside: Math.max(0, runningNet),
    });
  }

  return timeSeries;
}

/**
 * Generates the complete real-time analytics report for an event.
 */
export async function getFullEventAnalytics(
  eventId: string,
  filter?: AnalyticsFilter
): Promise<FullEventAnalyticsReport> {
  const supabase = await createClient();

  // 1. Fetch tickets / attendees
  const { data: attendees } = await supabase
    .from('attendees')
    .select('id, name, email, pass_type, status, ticket_tier, college, department, member_data, checked_in')
    .eq('event_id', eventId);

  const attendeeList = attendees || [];

  // 2. Fetch individual tickets if module 01/02 records exist
  const { data: individualTickets } = await supabase
    .from('tickets')
    .select('id, status, ticket_type_id, order_id')
    .eq('event_id', eventId);

  const ticketList = individualTickets || [];
  const totalTickets = ticketList.length || attendeeList.length;
  const ticketsClaimed = ticketList.filter((t) => t.status === 'claimed' || t.status === 'issued').length || attendeeList.length;
  const ticketsUnassigned = ticketList.filter((t) => t.status === 'unassigned').length;
  const ticketsRevoked = ticketList.filter((t) => t.status === 'revoked' || t.status === 'cancelled').length;
  const ticketsSold = totalTickets - ticketsUnassigned - ticketsRevoked;

  // 3. Fetch scan events
  let scanQuery = supabase
    .from('scan_events')
    .select('id, attendee_id, operation_type, scan_result, gate_id, created_at')
    .eq('event_id', eventId);

  if (filter?.gateId) {
    scanQuery = scanQuery.eq('gate_id', filter.gateId);
  }
  if (filter?.startDate) {
    scanQuery = scanQuery.gte('created_at', filter.startDate);
  }
  if (filter?.endDate) {
    scanQuery = scanQuery.lte('created_at', filter.endDate);
  }

  const { data: scanEvents } = await scanQuery;
  const rawScans = scanEvents || [];

  // 4. Fetch gates
  const { data: gates } = await supabase
    .from('event_gates')
    .select('id, name, zone_id, zone:event_zones(name)')
    .eq('event_id', eventId);

  const gateList = (gates || []).map((g: any) => ({
    id: g.id,
    name: g.name,
    zone_id: g.zone_id,
    zone_name: g.zone?.name || null,
  }));

  // 5. Fetch sessions & session attendance
  const { data: sessions } = await supabase
    .from('event_sessions')
    .select('id, title, capacity')
    .eq('event_id', eventId);

  const sessionList = sessions || [];

  const { data: sessionLogs } = await supabase
    .from('session_attendance_logs')
    .select('session_id, attendee_id, action, duration_minutes, created_at')
    .eq('event_id', eventId);

  const rawSessionLogs = sessionLogs || [];

  // Calculations
  const netPresence = calculateNetPresence(rawScans);
  const gateBreakdown = calculateGateAnalytics(rawScans, gateList);
  const sessionBreakdown = calculateSessionAnalytics(rawSessionLogs, sessionList);
  const demographics = calculateDemographics(attendeeList);
  const timeSeries = buildTimeSeriesMetrics(rawScans);

  const totalAttendees = attendeeList.length;
  const attendanceRate = totalTickets > 0 ? Math.round((netPresence.uniqueAttendeesEntered / totalTickets) * 100) : 0;

  const summary: EventAnalyticsSummary = {
    eventId,
    totalTickets,
    ticketsSold,
    ticketsClaimed,
    ticketsUnassigned,
    ticketsRevoked,
    totalAttendees,
    netAttendeesInside: netPresence.netInside,
    totalCheckIns: netPresence.totalEntries,
    totalExits: netPresence.totalExits,
    totalReEntries: netPresence.totalReEntries,
    attendanceRate,
  };

  return {
    summary,
    gateBreakdown,
    sessionBreakdown,
    demographics,
    timeSeries,
    generatedAt: new Date().toISOString(),
  };
}
