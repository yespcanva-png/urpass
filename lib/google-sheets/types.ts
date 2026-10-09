export type GoogleSheetsSyncTab =
  | "registrations"
  | "ticket_distribution"
  | "gate_entry_exit"
  | "session_attendance"
  | "analytics_summary";

export type GoogleSheetsSyncMode = "manual" | "realtime" | "hourly";

export interface GoogleSheetsConnection {
  eventId: string;
  connected: boolean;
  accountEmail?: string | null;
  spreadsheetId?: string | null;
  spreadsheetTitle?: string | null;
  spreadsheetUrl?: string | null;
  selectedTabs: GoogleSheetsSyncTab[];
  syncMode: GoogleSheetsSyncMode;
  lastSyncedAt?: string | null;
  lastSyncStatus?: "success" | "partial" | "failed" | null;
  lastErrorMessage?: string | null;
  autoSyncEnabled: boolean;
  retryCount: number;
}

export interface GoogleSheetsSyncConfig {
  enabled: boolean;
  spreadsheetId?: string | null;
  spreadsheetTitle?: string | null;
  selectedTabs: GoogleSheetsSyncTab[];
  syncMode: GoogleSheetsSyncMode;
  autoSyncEnabled: boolean;
}

export interface GoogleSheetsSyncJob {
  jobId: string;
  eventId: string;
  triggeredBy: string; // 'manual' | 'webhook' | 'cron'
  tabsToSync: GoogleSheetsSyncTab[];
  status: "pending" | "in_progress" | "completed" | "failed";
  recordsProcessed: number;
  recordsFailed: number;
  startedAt: string;
  completedAt?: string | null;
  error?: string | null;
}

export interface SheetRowData {
  tab: GoogleSheetsSyncTab;
  headers: string[];
  rows: (string | number | boolean | null)[][];
}
