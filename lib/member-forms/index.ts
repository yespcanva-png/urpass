export * from "./types";
import { isFeatureEnabled, type EventLike } from "@/lib/feature-flags";
import {
  type MemberFieldType,
  type MemberFormField,
  type MemberFormConfig,
  type SerialNumberType,
  type SerialNumberScope,
  type SerialNumberConfig,
  type MemberFormSubmission,
  type MemberFormValidationResult,
} from "./types";

export const DEFAULT_MEMBER_FORM_CONFIG: MemberFormConfig = {
  enabled: false,
  fields: [],
  allowUpdateAfterClaim: true,
  retroactivePolicy: "preserve_validity",
};

export const DEFAULT_SERIAL_NUMBER_CONFIG: SerialNumberConfig = {
  enabled: false,
  type: "manual",
  required: false,
  prefix: "URP-REG-",
  suffix: "",
  digitPadding: 6,
  startNumber: 1,
  continuationOffset: 0,
  scope: "event",
  caseSensitive: false,
};

/**
 * Extracts member form configuration from event metadata or returns defaults.
 */
export function getMemberFormConfig(event?: EventLike | null): MemberFormConfig {
  const isFlagActive = isFeatureEnabled(event, "member_registration_forms");

  if (!event || !event.custom_pass_design) {
    return {
      ...DEFAULT_MEMBER_FORM_CONFIG,
      enabled: isFlagActive,
    };
  }

  const raw = (event.custom_pass_design as Record<string, unknown>)?._memberFormConfig;

  if (raw && typeof raw === "object") {
    const c = raw as Partial<MemberFormConfig>;
    const fields: MemberFormField[] = Array.isArray(c.fields)
      ? c.fields.map((f) => ({
          id: String(f.id),
          label: String(f.label),
          type: (f.type as MemberFieldType) || "text",
          placeholder: f.placeholder ? String(f.placeholder) : undefined,
          required: Boolean(f.required),
          options: Array.isArray(f.options) ? f.options.map(String) : undefined,
          applicableTicketTypeIds: Array.isArray(f.applicableTicketTypeIds)
            ? f.applicableTicketTypeIds.map(String)
            : undefined,
          validationPattern: f.validationPattern ? String(f.validationPattern) : undefined,
          helpText: f.helpText ? String(f.helpText) : undefined,
        }))
      : [];

    return {
      enabled: typeof c.enabled === "boolean" ? c.enabled && isFlagActive : isFlagActive,
      fields,
      allowUpdateAfterClaim:
        typeof c.allowUpdateAfterClaim === "boolean" ? c.allowUpdateAfterClaim : true,
      retroactivePolicy: c.retroactivePolicy || "preserve_validity",
    };
  }

  // Fallback: Convert legacy event.custom_fields if available
  if (Array.isArray(event.custom_fields) && event.custom_fields.length > 0) {
    const fields: MemberFormField[] = event.custom_fields.map((f) => ({
      id: String(f.id),
      label: String(f.label),
      type: (f.type as MemberFieldType) || "text",
      placeholder: f.placeholder ? String(f.placeholder) : undefined,
      required: Boolean(f.required),
      options: Array.isArray(f.options) ? f.options.map(String) : undefined,
    }));

    return {
      enabled: isFlagActive,
      fields,
      allowUpdateAfterClaim: true,
      retroactivePolicy: "preserve_validity",
    };
  }

  return {
    ...DEFAULT_MEMBER_FORM_CONFIG,
    enabled: isFlagActive,
  };
}

/**
 * Extracts serial number validation configuration from event metadata or returns defaults.
 */
export function getSerialNumberConfig(event?: EventLike | null): SerialNumberConfig {
  const isFlagActive = isFeatureEnabled(event, "serial_number_validation");

  if (!event || !event.custom_pass_design) {
    return {
      ...DEFAULT_SERIAL_NUMBER_CONFIG,
      enabled: isFlagActive,
    };
  }

  const raw = (event.custom_pass_design as Record<string, unknown>)?._serialNumberConfig;

  if (raw && typeof raw === "object") {
    const c = raw as Partial<SerialNumberConfig>;
    const allowedList = Array.isArray(c.allowedList)
      ? c.allowedList.map((s) => String(s).trim()).filter(Boolean)
      : undefined;

    return {
      enabled: typeof c.enabled === "boolean" ? c.enabled && isFlagActive : isFlagActive,
      type: (c.type as SerialNumberType) || "manual",
      required: Boolean(c.required),
      prefix: typeof c.prefix === "string" ? c.prefix : "URP-REG-",
      suffix: typeof c.suffix === "string" ? c.suffix : "",
      digitPadding: typeof c.digitPadding === "number" ? Math.max(1, c.digitPadding) : 6,
      startNumber: typeof c.startNumber === "number" ? Math.max(1, c.startNumber) : 1,
      continuationOffset: typeof c.continuationOffset === "number" ? Math.max(0, c.continuationOffset) : 0,
      pattern: typeof c.pattern === "string" && c.pattern.trim() ? c.pattern.trim() : undefined,
      allowedList,
      scope: (c.scope as SerialNumberScope) || "event",
      caseSensitive: Boolean(c.caseSensitive),
    };
  }

  return {
    ...DEFAULT_SERIAL_NUMBER_CONFIG,
    enabled: isFlagActive,
  };
}

/**
 * Filters the member form fields applicable to a specific ticket category.
 */
export function getFormFieldsForTicket(
  event: EventLike,
  ticketTypeId?: string
): MemberFormField[] {
  const config = getMemberFormConfig(event);
  if (!config.enabled) {
    return [];
  }

  return config.fields.filter((field) => {
    if (!field.applicableTicketTypeIds || field.applicableTicketTypeIds.length === 0) {
      return true; // Applies to all ticket categories
    }
    if (!ticketTypeId) {
      return true;
    }
    return field.applicableTicketTypeIds.includes(ticketTypeId);
  });
}

/**
 * Validates a serial number against pattern, approved whitelist, and scope uniqueness.
 */
export function validateSerialNumber({
  serial,
  config,
  eventId,
  existingSerials = [],
  currentAttendeeId,
}: {
  serial?: string | null;
  config: SerialNumberConfig;
  eventId: string;
  existingSerials?: Array<string | { serial_number?: string; attendeeId?: string; id?: string }>;
  currentAttendeeId?: string;
}): {
  valid: boolean;
  error?: string;
  message?: string;
  formattedSerial?: string | null;
} {
  void eventId;

  if (!config.enabled) {
    return { valid: true, formattedSerial: serial || null };
  }

  const raw = typeof serial === "string" ? serial.trim() : "";

  // 1. Check optional vs required serials
  if (!raw) {
    if (config.required) {
      return {
        valid: false,
        error: "SERIAL_REQUIRED",
        message: "A serial number is required for registration.",
      };
    }
    // Optional serial left blank -> passes cleanly
    return { valid: true, formattedSerial: null };
  }

  const formattedSerial = config.caseSensitive ? raw : raw.toUpperCase();

  // 2. Type-Specific Validation
  if (config.type === "manual") {
    if (config.pattern) {
      try {
        const regex = new RegExp(config.pattern);
        if (!regex.test(formattedSerial)) {
          return {
            valid: false,
            error: "INVALID_SERIAL_FORMAT",
            message: `Serial number "${formattedSerial}" does not match the required format (${config.pattern}).`,
          };
        }
      } catch {
        // Fallback pattern error
      }
    }
  } else if (config.type === "verified_input") {
    if (!config.allowedList || config.allowedList.length === 0) {
      return {
        valid: false,
        error: "SERIAL_WHITELIST_EMPTY",
        message: "No approved member serial list configured for this event.",
      };
    }

    const normalizedAllowed = config.caseSensitive
      ? config.allowedList
      : config.allowedList.map((s) => s.toUpperCase().trim());

    if (!normalizedAllowed.includes(formattedSerial)) {
      return {
        valid: false,
        error: "SERIAL_NOT_IN_APPROVED_LIST",
        message: `Serial number "${formattedSerial}" is not in the approved member dataset.`,
      };
    }
  }

  // 3. Uniqueness Enforcement (Event, Organization or Dataset scope)
  const normalizedExisting = existingSerials.map((item) => {
    if (typeof item === "string") {
      return {
        serial: config.caseSensitive ? item.trim() : item.trim().toUpperCase(),
        id: undefined,
      };
    }
    const val = item.serial_number ? String(item.serial_number).trim() : "";
    return {
      serial: config.caseSensitive ? val : val.toUpperCase(),
      id: item.attendeeId || item.id,
    };
  });

  const duplicate = normalizedExisting.find(
    (e) => e.serial === formattedSerial && (!currentAttendeeId || e.id !== currentAttendeeId)
  );

  if (duplicate) {
    return {
      valid: false,
      error: "DUPLICATE_SERIAL_NUMBER",
      message: `Serial number "${formattedSerial}" is already assigned to another attendee.`,
    };
  }

  return {
    valid: true,
    formattedSerial,
  };
}

/**
 * Atomically generates next sequential serial number based on database sequence / offset.
 * Never counts rows; computes monotonic sequence index.
 */
export function generateNextAtomicSerial({
  config,
  existingHighestSequence = 0,
}: {
  config: SerialNumberConfig;
  existingHighestSequence?: number;
}): string {
  const startNum = config.startNumber || 1;
  const offset = config.continuationOffset || 0;
  const padding = config.digitPadding || 6;
  const prefix = config.prefix || "URP-REG-";
  const suffix = config.suffix || "";

  const nextSeq = Math.max(startNum + offset, existingHighestSequence + 1);
  const formattedNumber = String(nextSeq).padStart(padding, "0");

  return `${prefix}${formattedNumber}${suffix}`;
}

/**
 * Validates a member form submission against event configuration and ticket category rules.
 */
export function validateMemberFormSubmission({
  event,
  submission,
  ticketTypeId,
  existingSerials = [],
  currentAttendeeId,
  existingHighestSequence = 0,
}: {
  event: EventLike;
  submission: MemberFormSubmission;
  ticketTypeId?: string;
  existingSerials?: Array<string | { serial_number?: string; attendeeId?: string; id?: string }>;
  currentAttendeeId?: string;
  existingHighestSequence?: number;
}): MemberFormValidationResult {
  const formConfig = getMemberFormConfig(event);
  const serialConfig = getSerialNumberConfig(event);
  const errors: Record<string, string> = {};

  // Standard attendee identity validation
  if (!submission.name || !submission.name.trim()) {
    errors.name = "Full name is required.";
  }
  if (!submission.email || !submission.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // Member form fields validation if feature is enabled
  if (formConfig.enabled) {
    const applicableFields = getFormFieldsForTicket(event, ticketTypeId);
    const customResp = submission.customResponses || {};
    const decls = submission.declarations || {};

    for (const field of applicableFields) {
      let val: unknown = undefined;

      // Check standard mapped properties first
      if (field.id === "college_org") val = submission.college_org;
      else if (field.id === "department") val = submission.department;
      else if (field.id === "course") val = submission.course;
      else if (field.id === "roll_or_employee_id") val = submission.roll_or_employee_id;
      else if (field.id === "phone") val = submission.phone;
      else if (field.id === "document_url") val = submission.documentUrl;
      else if (decls[field.id] !== undefined) val = decls[field.id];
      else if (customResp[field.id] !== undefined) val = customResp[field.id];

      // 1. Required Check
      if (field.required) {
        if (field.type === "checkbox") {
          if (val !== true && val !== "true" && val !== 1) {
            errors[field.id] = `Declaration "${field.label}" must be accepted.`;
          }
        } else if (val === undefined || val === null || String(val).trim() === "") {
          errors[field.id] = `${field.label} is required.`;
        }
      }

      // 2. Pattern Check if provided
      if (val && typeof val === "string" && field.validationPattern) {
        try {
          const reg = new RegExp(field.validationPattern);
          if (!reg.test(val.trim())) {
            errors[field.id] = `${field.label} format is invalid.`;
          }
        } catch {
          // Ignore bad regex syntax
        }
      }
    }
  }

  // Serial Number Validation if feature is enabled
  let resolvedSerial: string | null = null;

  if (serialConfig.enabled) {
    if (serialConfig.type === "auto_generated") {
      // Generate serial atomically
      resolvedSerial = generateNextAtomicSerial({
        config: serialConfig,
        existingHighestSequence,
      });
    } else {
      const serialRes = validateSerialNumber({
        serial: submission.serialNumber,
        config: serialConfig,
        eventId: event.id,
        existingSerials,
        currentAttendeeId,
      });

      if (!serialRes.valid) {
        errors.serialNumber = serialRes.message || "Invalid serial number.";
      } else {
        resolvedSerial = serialRes.formattedSerial || null;
      }
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    valid: isValid,
    errors: isValid ? undefined : errors,
    message: isValid ? undefined : Object.values(errors).join(" "),
    formattedData: {
      name: submission.name.trim(),
      email: submission.email.toLowerCase().trim(),
      phone: submission.phone?.trim() || null,
      college_org: submission.college_org?.trim() || null,
      department: submission.department?.trim() || null,
      course: submission.course?.trim() || null,
      roll_or_employee_id: submission.roll_or_employee_id?.trim() || null,
      serial_number: resolvedSerial,
      custom_responses: submission.customResponses || {},
      declarations: submission.declarations || {},
      document_url: submission.documentUrl?.trim() || null,
    },
    serialNumber: resolvedSerial || undefined,
  };
}

/**
 * Binds validated member form data and serial number to an attendee record payload.
 */
export function bindMemberDataToAttendee(
  attendee: Record<string, unknown>,
  submission: MemberFormSubmission,
  serialNumber?: string
): Record<string, unknown> {
  const customResponses = {
    ...(typeof attendee.custom_responses === "object" && attendee.custom_responses !== null
      ? (attendee.custom_responses as Record<string, unknown>)
      : {}),
    ...(submission.customResponses || {}),
    ...(submission.college_org ? { college_org: submission.college_org } : {}),
    ...(submission.department ? { department: submission.department } : {}),
    ...(submission.course ? { course: submission.course } : {}),
    ...(submission.roll_or_employee_id ? { roll_or_employee_id: submission.roll_or_employee_id } : {}),
    ...(submission.declarations ? { declarations: submission.declarations } : {}),
    ...(submission.documentUrl ? { document_url: submission.documentUrl } : {}),
  };

  return {
    ...attendee,
    name: submission.name.trim(),
    email: submission.email.toLowerCase().trim(),
    phone: submission.phone ? submission.phone.trim() : attendee.phone,
    serial_number: serialNumber || submission.serialNumber || attendee.serial_number || null,
    custom_responses: customResponses,
    updated_at: new Date().toISOString(),
  };
}
