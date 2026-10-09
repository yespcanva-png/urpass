import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateNetPresence,
  calculateGateAnalytics,
  calculateSessionAnalytics,
  calculateDemographics,
  buildTimeSeriesMetrics,
} from '@/lib/advanced-analytics';
import { getEventAdvancedAnalyticsAction } from '@/app/actions/advanced-analytics';
import * as featureFlags from '@/lib/feature-flags';
import * as supabaseServer from '@/lib/supabase/server';

describe('Module 09 — Advanced Analytics & Attendance Reports (Test 10 Suite)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Net Presence & Re-entry Calculations (No Headcount Inflation)', () => {
    it('correctly calculates net inside attendees when attendees exit and re-enter', () => {
      const scans = [
        { attendee_id: 'att_1', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T10:00:00Z' },
        { attendee_id: 'att_2', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T10:05:00Z' },
        { attendee_id: 'att_1', operation_type: 'exit', scan_result: 'success', created_at: '2026-10-10T11:00:00Z' },
        { attendee_id: 'att_1', operation_type: 're_entry', scan_result: 'success', created_at: '2026-10-10T11:30:00Z' },
        { attendee_id: 'att_3', operation_type: 'entry', scan_result: 'denied', created_at: '2026-10-10T11:35:00Z' },
      ];

      const result = calculateNetPresence(scans);

      // att_1 is inside (entered, exited, re-entered)
      // att_2 is inside (entered)
      // att_3 was denied (not inside)
      expect(result.netInside).toBe(2);
      expect(result.uniqueAttendeesEntered).toBe(2);
      expect(result.totalEntries).toBe(2);
      expect(result.totalExits).toBe(1);
      expect(result.totalReEntries).toBe(1);
      expect(result.totalDenied).toBe(1);
      expect(result.insideAttendeeIds.has('att_1')).toBe(true);
      expect(result.insideAttendeeIds.has('att_2')).toBe(true);
      expect(result.insideAttendeeIds.has('att_3')).toBe(false);
    });

    it('handles multiple exits and entries correctly for large venue flows', () => {
      const scans = [
        { attendee_id: 'u1', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T09:00:00Z' },
        { attendee_id: 'u2', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T09:05:00Z' },
        { attendee_id: 'u3', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T09:10:00Z' },
        { attendee_id: 'u1', operation_type: 'exit', scan_result: 'success', created_at: '2026-10-10T12:00:00Z' },
        { attendee_id: 'u2', operation_type: 'exit', scan_result: 'success', created_at: '2026-10-10T12:05:00Z' },
      ];

      const result = calculateNetPresence(scans);
      expect(result.netInside).toBe(1); // Only u3 remains inside
      expect(result.uniqueAttendeesEntered).toBe(3);
      expect(result.totalEntries).toBe(3);
      expect(result.totalExits).toBe(2);
    });
  });

  describe('2. Gate Analytics & Velocity Breakdown', () => {
    it('aggregates scans by gate and calculates hourly velocity', () => {
      const gates = [
        { id: 'gate_north', name: 'North VIP Gate', zone_id: 'zone_vip', zone_name: 'VIP Lounge' },
        { id: 'gate_south', name: 'South General Gate', zone_id: null, zone_name: null },
      ];

      const scans = [
        { gate_id: 'gate_north', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T10:15:00Z' },
        { gate_id: 'gate_north', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T10:45:00Z' },
        { gate_id: 'gate_north', operation_type: 're_entry', scan_result: 'success', created_at: '2026-10-10T14:15:00Z' },
        { gate_id: 'gate_north', operation_type: 'entry', scan_result: 'denied', created_at: '2026-10-10T14:20:00Z' },
        { gate_id: 'gate_south', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T10:30:00Z' },
        { gate_id: 'gate_south', operation_type: 'exit', scan_result: 'success', created_at: '2026-10-10T13:00:00Z' },
      ];

      const result = calculateGateAnalytics(scans, gates);

      const northGate = result.find((g) => g.gateId === 'gate_north');
      expect(northGate).toBeDefined();
      expect(northGate?.totalEntries).toBe(2);
      expect(northGate?.totalReEntries).toBe(1);
      expect(northGate?.totalDenied).toBe(1);
      expect(northGate?.zoneName).toBe('VIP Lounge');

      const southGate = result.find((g) => g.gateId === 'gate_south');
      expect(southGate).toBeDefined();
      expect(southGate?.totalEntries).toBe(1);
      expect(southGate?.totalExits).toBe(1);
    });
  });

  describe('3. Session Analytics & Fill Rate Computation', () => {
    it('calculates session attendance fill rates and average duration', () => {
      const sessions = [
        { id: 'sess_ai', title: 'Keynote: AI Architecture', capacity: 100, registered_count: 80 },
        { id: 'sess_workshop', title: 'Hands-on Workshop', capacity: 30, registered_count: 30 },
      ];

      const logs = [
        { session_id: 'sess_ai', attendee_id: 'att_1', action: 'check_in', duration_minutes: 60 },
        { session_id: 'sess_ai', attendee_id: 'att_2', action: 'check_in', duration_minutes: 40 },
        { session_id: 'sess_ai', attendee_id: 'att_3', action: 'check_in', duration_minutes: 50 },
        { session_id: 'sess_workshop', attendee_id: 'att_1', action: 'check_in', duration_minutes: 90 },
      ];

      const result = calculateSessionAnalytics(logs, sessions);

      const aiSession = result.find((s) => s.sessionId === 'sess_ai');
      expect(aiSession?.totalAttended).toBe(3);
      expect(aiSession?.capacity).toBe(100);
      expect(aiSession?.fillRatePercentage).toBe(3); // 3 out of 100 capacity
      expect(aiSession?.avgDurationMinutes).toBe(50); // (60 + 40 + 50) / 3

      const wsSession = result.find((s) => s.sessionId === 'sess_workshop');
      expect(wsSession?.totalAttended).toBe(1);
      expect(wsSession?.avgDurationMinutes).toBe(90);
    });
  });

  describe('4. Demographics Breakdown', () => {
    it('correctly aggregates attendees by ticket tier, college, and department', () => {
      const attendees = [
        {
          ticket_tier: 'VIP',
          college: 'MIT',
          department: 'Computer Science',
        },
        {
          ticket_tier: 'General',
          college: 'MIT',
          department: 'Electrical Engineering',
        },
        {
          ticket_tier: 'General',
          college: 'Stanford',
          department: 'Computer Science',
        },
        {
          ticket_tier: 'Student',
          member_data: { college: 'Harvard', department: 'Bioinformatics' },
        },
      ];

      const demographics = calculateDemographics(attendees);

      // Ticket tiers
      expect(demographics.byTicketTier.counts.find((c) => c.label === 'General')?.count).toBe(2);
      expect(demographics.byTicketTier.counts.find((c) => c.label === 'VIP')?.count).toBe(1);
      expect(demographics.byTicketTier.counts.find((c) => c.label === 'Student')?.count).toBe(1);

      // Colleges
      expect(demographics.byCollege.counts.find((c) => c.label === 'MIT')?.count).toBe(2);
      expect(demographics.byCollege.counts.find((c) => c.label === 'Stanford')?.count).toBe(1);
      expect(demographics.byCollege.counts.find((c) => c.label === 'Harvard')?.count).toBe(1);

      // Departments
      expect(demographics.byDepartment.counts.find((c) => c.label === 'Computer Science')?.count).toBe(2);
    });
  });

  describe('5. Time-Series Metrics', () => {
    it('builds chronological time buckets for entries, exits, and net presence', () => {
      const scans = [
        { attendee_id: 'a1', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T10:15:00Z' },
        { attendee_id: 'a2', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T10:30:00Z' },
        { attendee_id: 'a1', operation_type: 'exit', scan_result: 'success', created_at: '2026-10-10T11:10:00Z' },
        { attendee_id: 'a3', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T11:20:00Z' },
      ];

      const series = buildTimeSeriesMetrics(scans);
      expect(series.length).toBe(2);

      // Hour 10:00: 2 entries, 0 exits, netInside = 2
      expect(series[0].entries).toBe(2);
      expect(series[0].exits).toBe(0);
      expect(series[0].netInside).toBe(2);

      // Hour 11:00: 1 entry, 1 exit, netInside = 2 (2 + 1 - 1)
      expect(series[1].entries).toBe(1);
      expect(series[1].exits).toBe(1);
      expect(series[1].netInside).toBe(2);
    });
  });

  describe('6. Feature Flag Guard on Server Action', () => {
    it('rejects access if advanced_analytics feature flag is disabled', async () => {
      vi.spyOn(supabaseServer, 'createClient').mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'org_1' } } }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'evt_1', organizer_id: 'org_1' } }),
            }),
          }),
        }),
      } as any);

      vi.spyOn(featureFlags, 'isFeatureEnabled').mockReturnValue(false);

      const result = await getEventAdvancedAnalyticsAction('evt_1');
      expect(result.success).toBe(false);
      expect(result.disabled).toBe(true);
      expect(result.error).toContain('not enabled');
    });

    it('allows access and generates report when feature flag is enabled', async () => {
      vi.spyOn(supabaseServer, 'createClient').mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'org_1' } } }),
        },
        from: vi.fn((table: string) => {
          if (table === 'events') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: { id: 'evt_1', organizer_id: 'org_1' } }),
                }),
              }),
            };
          }
          if (table === 'attendees') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [
                    { id: 'att_1', name: 'Alice', email: 'alice@example.com', pass_type: 'VIP', checked_in: true },
                  ],
                }),
              }),
            };
          }
          if (table === 'tickets' || table === 'scan_events' || table === 'event_gates' || table === 'event_sessions' || table === 'session_attendance_logs') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [] }),
              }),
            };
          }
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [] }),
            }),
          };
        }),
      } as any);

      vi.spyOn(featureFlags, 'isFeatureEnabled').mockReturnValue(true);

      const result = await getEventAdvancedAnalyticsAction('evt_1');
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.summary.totalAttendees).toBe(1);
    });
  });
});
