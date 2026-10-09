export type MemberFieldType =
  | "text"
  | "number"
  | "select"
  | "checkbox"
  | "file"
  | "date"
  | "textarea"
  | "radio";

export interface MemberFormField {
  id: string;
  label: string;
  type: MemberFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
  applicableTicketTypeIds?: string[]; // If omitted or empty, applies to all ticket types
  validationPattern?: string; // Regex pattern string
  helpText?: string;
}

export interface MemberFormConfig {
  enabled: boolean;
  fields: MemberFormField[];
  allowUpdateAfterClaim?: boolean;
  retroactivePolicy?: "preserve_validity" | "require_completion";
}

export type SerialNumberType = "manual" | "auto_generated" | "verified_input";
export type SerialNumberScope = "event" | "organization" | "global";

export interface SerialNumberConfig {
  enabled: boolean;
  type: SerialNumberType;
  required: boolean; // If false, optional serial field can be left blank
  prefix?: string;
  suffix?: string;
  digitPadding?: number; // e.g. 6 -> 000123
  startNumber?: number; // e.g. 1
  continuationOffset?: number; // e.g. 0
  pattern?: string; // Regex pattern for manual entry validation, e.g. "^[A-Z]{3}[0-9]{7}$"
  allowedList?: string[]; // Whitelist of valid serials (e.g. from CSV upload) for verified_input
  scope: SerialNumberScope; // "event" | "organization" | "global"
  caseSensitive?: boolean;
}

export interface MemberFormSubmission {
  name: string;
  email: string;
  phone?: string | null;
  ticketTypeId?: string;
  college_org?: string | null;
  department?: string | null;
  course?: string | null;
  roll_or_employee_id?: string | null;
  serialNumber?: string | null;
  customResponses?: Record<string, unknown>;
  declarations?: Record<string, boolean>;
  documentUrl?: string | null;
}

export interface MemberFormValidationResult {
  valid: boolean;
  errors?: Record<string, string>;
  message?: string;
  formattedData?: Record<string, unknown>;
  serialNumber?: string;
}
