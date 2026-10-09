export * from "./types";
import crypto from "crypto";
import { isFeatureEnabled, type EventLike } from "@/lib/feature-flags";
import {
  type ScannerOperationMode,
  type VenuePresenceState,
  type GateType,
  type EventZone,
  type EventGate,
  type StaffGateAssignment,
  type GateTrackingConfig,
  type GateScanRecord,
  type GateScanRequest,
  type GateScanResult,
  type VenuePresenceSummary,
} from "./types";

export const DEFAULT_GATE_TRACKING_CONFIG: GateTrackingConfig = {
  enabled: false,
  allowReEntry: true,
  duplicateEntryPolicy: "reject",
  duplicateWindowSeconds: 60,
  unmatchedExitPolicy: "flag_and_record",
  offlineSyncPolicy: "queue_and_reconcile",
  zones: [],
  gates: [],
  staffAssignments: [],
};

/**
 * Extracts gate tracking configuration from event metadata or returns defaults.
 */
export function getGateTrackingConfig(event?: EventLike | null): GateTrackingConfig {
  const isFlagActive = isFeatureEnabled(event, "advanced_entry_tracking");

  if (!event || !event.custom_pass_design) {
    return {
      ...DEFAULT_GATE_TRACKING_CONFIG,
      enabled: isFlagActive,
    };
  }

  const raw = (event.custom_pass_design as Record<string, unknown>)?._gateTrackingConfig;

  if (raw && typeof raw === "object") {
    const c = raw as Partial<GateTrackingConfig>;
    const zones: EventZone[] = Array.isArray(c.zones)
      ? c.zones.map((z) => ({
          id: String(z.id),
          name: String(z.name),
          capacity_limit: typeof z.capacity_limit === "number" ? z.capacity_limit : null,
          description: z.description ? String(z.description) : undefined,
        }))
      : [];

    const gates: EventGate[] = Array.isArray(c.gates)
      ? c.gates.map((g) => ({
          id: String(g.id),
          name: String(g.name),
          code: String(g.code || g.name),
          zone_id: g.zone_id ? String(g.zone_id) : null,
          type: (g.type as GateType) || "bidirectional",
          allowedTicketTypeIds: Array.isArray(g.allowedTicketTypeIds)
            ? g.allowedTicketTypeIds.map(String)
            : undefined,
          is_active: typeof g.is_active === "boolean" ? g.is_active : true,
        }))
      : [];

    const staffAssignments: StaffGateAssignment[] = Array.isArray(c.staffAssignments)
      ? c.staffAssignments.map((s) => ({
          operator_id: String(s.operator_id),
          operator_email: String(s.operator_email).toLowerCase().trim(),
          allowed_gate_ids: Array.isArray(s.allowed_gate_ids) ? s.allowed_gate_ids.map(String) : [],
        }))
      : [];

    return {
      enabled: typeof c.enabled === "boolean" ? c.enabled && isFlagActive : isFlagActive,
      allowReEntry: typeof c.allowReEntry === "boolean" ? c.allowReEntry : true,
      duplicateEntryPolicy: c.duplicateEntryPolicy || "reject",
      duplicateWindowSeconds: typeof c.duplicateWindowSeconds === "number" ? c.duplicateWindowSeconds : 60,
      unmatchedExitPolicy: c.unmatchedExitPolicy || "flag_and_record",
      offlineSyncPolicy: c.offlineSyncPolicy || "queue_and_reconcile",
      zones,
      gates,
      staffAssignments,
    };
  }

  return {
    ...DEFAULT_GATE_TRACKING_CONFIG,
    enabled: isFlagActive,
  };
}

/**
 * Processes a gate scanning operation (Entry, Exit, Re-Entry, or Verification)
 * with staff permission checks, zone tier access control, presence transitions,
 * anti-passback duplicate policies, and server-authoritative timestamps.
 */
export function processGateScan({
  event,
  request,
  attendee,
  passRecord,
  currentPresence = "OUTSIDE",
  recentScans = [],
}: {
  event: EventLike;
  request: GateScanRequest;
  attendee?: {
    id: string;
    name: string;
    email: string;
    ticketTier?: string;
    ticketTypeId?: string;
    pass_status?: string;
  } | null;
  passRecord?: {
    id: string;
    pass_token: string;
    status: string;
    pass_type?: string;
    ticket_type_id?: string;
  } | null;
  currentPresence?: VenuePresenceState;
  recentScans?: GateScanRecord[];
}): {
  result: GateScanResult;
  newScanRecord?: GateScanRecord;
  nextPresence: VenuePresenceState;
} {
  const config = getGateTrackingConfig(event);
  const nowIso = new Date().toISOString();
  const scanEventId = `scan_${crypto.randomUUID()}`;

  // 1. Basic fallback when advanced tracking is OFF (Scenario 9)
  if (!config.enabled) {
    if (!passRecord || passRecord.status === "revoked") {
      return {
        result: {
          success: false,
          status: "INVALID_CREDENTIAL",
          operationMode: request.operationMode,
          presenceState: currentPresence,
          serverTimestamp: nowIso,
          scanEventId,
          error: "INVALID_CREDENTIAL",
          message: "Pass is invalid or revoked.",
        },
        nextPresence: currentPresence,
      };
    }

    return {
      result: {
        success: true,
        status: "GRANTED",
        operationMode: request.operationMode,
        presenceState: "INSIDE",
        attendee: attendee ? { id: attendee.id, name: attendee.name, email: attendee.email } : undefined,
        serverTimestamp: nowIso,
        scanEventId,
        message: "Basic check-in verified successfully.",
      },
      nextPresence: "INSIDE",
    };
  }

  // 2. Pass and Credential Validation
  if (!passRecord) {
    return {
      result: {
        success: false,
        status: "INVALID_CREDENTIAL",
        operationMode: request.operationMode,
        presenceState: currentPresence,
        serverTimestamp: nowIso,
        scanEventId,
        error: "PASS_NOT_FOUND",
        message: "Digital pass could not be found or verified.",
      },
      nextPresence: currentPresence,
    };
  }

  if (passRecord.status === "revoked" || attendee?.pass_status === "reassigned_revoked") {
    return {
      result: {
        success: false,
        status: "REVOKED_CREDENTIAL",
        operationMode: request.operationMode,
        presenceState: currentPresence,
        serverTimestamp: nowIso,
        scanEventId,
        error: "CREDENTIAL_REVOKED",
        message: "This pass has been revoked following ticket reassignment or cancellation.",
      },
      nextPresence: currentPresence,
    };
  }

  // 3. Gate Resolution & Staff Permissions
  const gate = config.gates.find((g) => g.id === request.gateId) || {
    id: request.gateId,
    name: "Main Entrance",
    code: "GATE_MAIN",
    type: "bidirectional" as GateType,
    is_active: true,
  };

  const normalizedOperator = request.operatorEmail.toLowerCase().trim();
  const staffAssignment = config.staffAssignments.find(
    (s) => s.operator_email === normalizedOperator || s.operator_id === request.operatorId
  );

  if (staffAssignment && staffAssignment.allowed_gate_ids.length > 0) {
    if (!staffAssignment.allowed_gate_ids.includes(request.gateId)) {
      return {
        result: {
          success: false,
          status: "GATE_UNAUTHORIZED",
          operationMode: request.operationMode,
          presenceState: currentPresence,
          gate: { id: gate.id, name: gate.name, code: gate.code },
          serverTimestamp: nowIso,
          scanEventId,
          error: "OPERATOR_NOT_PERMITTED_FOR_GATE",
          message: `Staff member "${request.operatorEmail}" is not authorized to operate gate "${gate.name}".`,
        },
        nextPresence: currentPresence,
      };
    }
  }

  // 4. Ticket Tier & Zone Access Control (Scenario 6)
  const ticketTypeId = attendee?.ticketTypeId || passRecord.ticket_type_id || passRecord.pass_type;
  if (gate.allowedTicketTypeIds && gate.allowedTicketTypeIds.length > 0) {
    const isAllowedTier = ticketTypeId && gate.allowedTicketTypeIds.includes(ticketTypeId);
    if (!isAllowedTier) {
      return {
        result: {
          success: false,
          status: "TIER_MISMATCH",
          operationMode: request.operationMode,
          presenceState: currentPresence,
          attendee: attendee ? { id: attendee.id, name: attendee.name, email: attendee.email, ticketTypeId } : undefined,
          gate: { id: gate.id, name: gate.name, code: gate.code },
          serverTimestamp: nowIso,
          scanEventId,
          error: "ZONE_TIER_ACCESS_DENIED",
          message: `Access denied. Gate "${gate.name}" requires specific ticket tier access. Your pass (${ticketTypeId || "General"}) is not permitted.`,
        },
        nextPresence: currentPresence,
      };
    }
  }

  // 5. Operation-Specific Presence Transitions & Policies
  let nextPresence: VenuePresenceState = currentPresence;
  let status: GateScanResult["status"] = "GRANTED";
  let isSuccess = true;
  let errorMsg: string | undefined = undefined;
  let warningMsg: string | undefined = undefined;

  switch (request.operationMode) {
    case "verify_only": {
      // Non-mutating verification
      status = "GRANTED";
      nextPresence = currentPresence;
      break;
    }

    case "entry": {
      if (currentPresence === "INSIDE") {
        // Immediate / accidental duplicate entry attempt (Scenario 2)
        if (config.duplicateEntryPolicy === "reject") {
          isSuccess = false;
          status = "ALREADY_INSIDE";
          errorMsg = "DUPLICATE_ENTRY";
          break;
        } else if (config.duplicateEntryPolicy === "warn") {
          status = "WARNING";
          warningMsg = "Duplicate entry scan recorded (attendee was already marked INSIDE).";
          nextPresence = "INSIDE";
        }
      } else {
        // Normal first entry (Scenario 1)
        nextPresence = "INSIDE";
        status = "GRANTED";
      }
      break;
    }

    case "exit": {
      if (currentPresence === "OUTSIDE") {
        // Exit without prior entry (Scenario 4)
        if (config.unmatchedExitPolicy === "reject") {
          isSuccess = false;
          status = "ALREADY_OUTSIDE";
          errorMsg = "UNMATCHED_EXIT";
          break;
        } else {
          status = "WARNING";
          warningMsg = "Exit recorded without prior entry record (unmatched exit).";
          nextPresence = "OUTSIDE";
        }
      } else {
        // Valid exit (Scenario 3)
        nextPresence = "OUTSIDE";
        status = "GRANTED";
      }
      break;
    }

    case "re_entry": {
      if (!config.allowReEntry) {
        isSuccess = false;
        status = "RE_ENTRY_NOT_PERMITTED";
        errorMsg = "RE_ENTRY_DENIED";
        break;
      }

      if (currentPresence === "INSIDE") {
        status = "WARNING";
        warningMsg = "Re-entry scanned while attendee was already marked INSIDE.";
        nextPresence = "INSIDE";
      } else {
        // Successful re-entry (Scenario 5)
        nextPresence = "INSIDE";
        status = "GRANTED";
      }
      break;
    }
  }

  const scanRecord: GateScanRecord = {
    scan_id: scanEventId,
    event_id: event.id,
    credential_id: passRecord.pass_token,
    ticket_id: passRecord.id,
    attendee_id: attendee?.id || "unknown",
    gate_id: gate.id,
    operator_id: request.operatorId,
    operator_email: normalizedOperator,
    device_id: request.deviceId,
    operation_mode: request.operationMode,
    presence_before: currentPresence,
    presence_after: isSuccess ? nextPresence : currentPresence,
    result: isSuccess ? (status === "WARNING" ? "WARNING" : "GRANTED") : "DENIED",
    reason_code: errorMsg || warningMsg,
    timestamp: nowIso,
    is_offline_reconciled: Boolean(request.isOffline),
  };

  return {
    result: {
      success: isSuccess,
      status,
      operationMode: request.operationMode,
      presenceState: isSuccess ? nextPresence : currentPresence,
      attendee: attendee
        ? {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            ticketTier: attendee.ticketTier,
            ticketTypeId,
          }
        : undefined,
      gate: {
        id: gate.id,
        name: gate.name,
        code: gate.code,
      },
      serverTimestamp: nowIso,
      scanEventId,
      error: errorMsg,
      warning: warningMsg,
      message: isSuccess
        ? `Scan successful (${request.operationMode.toUpperCase()}) at ${gate.name}.`
        : errorMsg || "Gate access denied.",
    },
    newScanRecord: scanRecord,
    nextPresence: isSuccess ? nextPresence : currentPresence,
  };
}

/**
 * Computes live venue presence counters and gate statistics.
 */
export function computeVenuePresenceSummary({
  totalRegistered = 0,
  scanRecords = [],
}: {
  totalRegistered: number;
  scanRecords: GateScanRecord[];
}): VenuePresenceSummary {
  // Track latest presence per attendee
  const attendeePresence = new Map<string, VenuePresenceState>();
  const attendeeEntries = new Set<string>();
  let totalExits = 0;
  let totalReEntries = 0;

  const gateStats: Record<string, { entries: number; exits: number; reEntries: number; denials: number }> = {};

  for (const scan of scanRecords) {
    // Gate stats
    if (!gateStats[scan.gate_id]) {
      gateStats[scan.gate_id] = { entries: 0, exits: 0, reEntries: 0, denials: 0 };
    }

    if (scan.result === "DENIED") {
      gateStats[scan.gate_id].denials++;
      continue;
    }

    if (scan.operation_mode === "entry") {
      gateStats[scan.gate_id].entries++;
      attendeeEntries.add(scan.attendee_id);
      attendeePresence.set(scan.attendee_id, "INSIDE");
    } else if (scan.operation_mode === "exit") {
      gateStats[scan.gate_id].exits++;
      totalExits++;
      attendeePresence.set(scan.attendee_id, "OUTSIDE");
    } else if (scan.operation_mode === "re_entry") {
      gateStats[scan.gate_id].reEntries++;
      totalReEntries++;
      attendeePresence.set(scan.attendee_id, "INSIDE");
    }
  }

  let currentlyInside = 0;
  attendeePresence.forEach((state) => {
    if (state === "INSIDE") currentlyInside++;
  });

  const totalEntered = attendeeEntries.size;
  const currentlyOutside = Math.max(0, totalRegistered - currentlyInside);

  return {
    totalRegistered,
    totalEntered,
    currentlyInside,
    currentlyOutside,
    totalExits,
    totalReEntries,
    gateStats,
    zoneOccupancy: {},
  };
}
