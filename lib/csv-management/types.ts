export type CsvImportType =
  | "ticket_assignment"
  | "member_details"
  | "serial_numbers"
  | "attendee_list";

export type CsvExportType =
  | "ticket_distribution"
  | "attendee_registrations"
  | "entry_exit_history"
  | "session_attendance"
  | "attendance_summary";

export interface CsvImportRow {
  rowNumber: number;
  name?: string;
  email?: string;
  phone?: string | null;
  ticketIndex?: number | null;
  ticketTypeId?: string | null;
  serialNumber?: string | null;
  college_org?: string | null;
  department?: string | null;
  course?: string | null;
  roll_or_employee_id?: string | null;
  customResponses?: Record<string, string>;
  raw: Record<string, string>;
}

export interface CsvRowValidation {
  rowNumber: number;
  valid: boolean;
  errors: string[];
  warnings: string[];
  data: CsvImportRow;
  isDuplicate?: boolean;
}

export interface CsvValidationPreview {
  valid: boolean;
  totalRows: number;
  validRowCount: number;
  errorRowCount: number;
  duplicateRowCount: number;
  availableSlots?: number;
  headers: string[];
  rows: CsvRowValidation[];
  globalErrors: string[];
}

export interface CsvProcessResult {
  success: boolean;
  totalRows: number;
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  importedRecords: Array<{
    id?: string;
    name: string;
    email: string;
    serialNumber?: string;
  }>;
  errors: string[];
  summary: string;
}

export interface CsvExportColumn {
  header: string;
  key: string;
  formatter?: (val: unknown, row: Record<string, unknown>) => string;
}
