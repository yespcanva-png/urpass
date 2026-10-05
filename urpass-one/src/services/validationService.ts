import type {
  Attendee,
  Gate,
  ScanDirection,
  ScanValidationResult,
  ScanResultStatus,
  ScanFeedbackColor,
  PreviousScanInfo,
} from "../types";
import { OfflineDb } from "./offlineDb";
import { CONFIG } from "../constants/config";

export interface ValidationContext {
  eventId: string;
  gate: Gate;
  direction?: ScanDirection;
  override?: boolean;
  overrideReason?: string;
  overrideBy?: string;
  deviceId: string;
  deviceName: string;
  userId: string;
  userName: string;
}

export const ValidationService = {
  async validateScan(
    qrPayload: string,
    context: ValidationContext
  ): Promise<ScanValidationResult> {
    const timestamp = new Date().toISOString();
    const manifest = await OfflineDb.getManifest(context.eventId);

    // 1. QR Lookup
    const attendee = await OfflineDb.lookupAttendeeByQR(context.eventId, qrPayload);

    if (!attendee) {
      return {
        status: "invalid_qr",
        color: "red",
        allowed: false,
        message: "Invalid QR Code — Not found in event manifest",
        rejectionReason: "Pass payload does not match any registered attendee",
        attendee: null,
        direction: context.direction || "in",
        previousScan: null,
        canOverride: false,
        timestamp,
      };
    }

    // 2. Event Match Verification
    if (attendee.eventId !== context.eventId) {
      return {
        status: "wrong_event",
        color: "red",
        allowed: false,
        message: "Wrong Event — Pass is registered for a different event",
        rejectionReason: `Registered for event ${attendee.eventId}`,
        attendee,
        direction: context.direction || "in",
        previousScan: null,
        canOverride: false,
        timestamp,
      };
    }

    // 3. Application / Pass Status Check
    if (attendee.applicationStatus === "rejected") {
      return {
        status: "cancelled_ticket",
        color: "red",
        allowed: false,
        message: "Access Denied — Ticket / Pass has been cancelled or rejected",
        rejectionReason: "Pass has been cancelled or rejected",
        attendee,
        direction: context.direction || "in",
        previousScan: null,
        canOverride: true,
        timestamp,
      };
    }

    if (attendee.applicationStatus === "pending" || attendee.applicationStatus === "waitlisted") {
      return {
        status: "requires_review",
        color: "amber",
        allowed: false,
        message: `Application ${attendee.applicationStatus.toUpperCase()} — Requires Organizer Review`,
        rejectionReason: `Attendee is on ${attendee.applicationStatus} list`,
        attendee,
        direction: context.direction || "in",
        previousScan: null,
        canOverride: true,
        timestamp,
      };
    }

    // 4. Gate Mode & Status Check
    if (context.gate.status === "closed" && !context.override) {
      return {
        status: "wrong_gate",
        color: "red",
        allowed: false,
        message: `Gate ${context.gate.name} is Closed`,
        rejectionReason: "Gate is currently inactive or closed by administrator",
        attendee,
        direction: context.direction || "in",
        previousScan: null,
        canOverride: true,
        timestamp,
      };
    }

    // Determine direction from gate mode if not explicitly passed
    let effectiveDirection: ScanDirection = context.direction || "in";
    if (context.gate.mode === "entry") {
      effectiveDirection = "in";
    } else if (context.gate.mode === "exit") {
      effectiveDirection = "out";
    }

    // 5. Gate Access Control Rules (Category & Badge Check)
    if (context.gate.allowedTicketTypes && context.gate.allowedTicketTypes.length > 0) {
      if (
        attendee.ticketTypeId &&
        !context.gate.allowedTicketTypes.includes(attendee.ticketTypeId) &&
        !context.override
      ) {
        return {
          status: "wrong_gate",
          color: "red",
          allowed: false,
          message: `Wrong Gate — Ticket tier (${attendee.ticketName || attendee.passType}) not permitted at ${context.gate.name}`,
          rejectionReason: `Ticket tier '${attendee.ticketName || attendee.passType}' not permitted at ${context.gate.name}`,
          attendee,
          direction: effectiveDirection,
          previousScan: null,
          canOverride: true,
          timestamp,
        };
      }
    }

    if (context.gate.allowedBadgeTypes && context.gate.allowedBadgeTypes.length > 0) {
      if (!context.gate.allowedBadgeTypes.includes(attendee.passType) && !context.override) {
        return {
          status: "wrong_gate",
          color: "red",
          allowed: false,
          message: `Wrong Gate — Badge type (${attendee.passType.toUpperCase()}) not permitted at ${context.gate.name}`,
          rejectionReason: `Pass type '${attendee.passType}' not permitted at ${context.gate.name}`,
          attendee,
          direction: effectiveDirection,
          previousScan: null,
          canOverride: true,
          timestamp,
        };
      }
    }

    // 6. Duplicate Scan Protection & Presence Transition
    const previousScan: PreviousScanInfo | null = attendee.lastCheckinAt
      ? {
          timestamp: attendee.lastCheckinAt,
          gateName: attendee.lastGateName || "Main Gate",
          deviceName: attendee.lastDeviceName || context.deviceName || "Scanner Device",
          action: attendee.presenceStatus === "inside" ? "Entry Check-In" : "Exit Check-Out",
        }
      : null;

    if (effectiveDirection === "in") {
      // Entry attempt
      if (attendee.presenceStatus === "inside" && !context.override) {
        return {
          status: "already_checked_in",
          color: "amber",
          allowed: false,
          message: `Already Checked In at ${attendee.lastGateName || "Gate"} (${new Date(
            attendee.lastCheckinAt || timestamp
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`,
          rejectionReason: "Pass was previously scanned and attendee is currently inside venue",
          attendee,
          direction: "in",
          previousScan,
          canOverride: true,
          timestamp,
        };
      }

      // 7. Venue Capacity Hard Limit Check
      if (manifest && manifest.capacity.max > 0) {
        if (manifest.capacity.currentlyInside >= manifest.capacity.max && !context.override) {
          return {
            status: "capacity_exceeded",
            color: "red",
            allowed: false,
            message: `Venue at Maximum Capacity (${manifest.capacity.currentlyInside}/${manifest.capacity.max})`,
            rejectionReason: "100% capacity limit reached. Entry restricted.",
            attendee,
            direction: "in",
            previousScan,
            canOverride: true,
            timestamp,
          };
        }
      }

      // Successful Entry Validation
      await OfflineDb.updateLocalAttendeeState(context.eventId, attendee.id, {
        presenceStatus: "inside",
        checkinCount: attendee.checkinCount + 1,
        lastCheckinAt: timestamp,
        lastGateId: context.gate.id,
        lastGateName: context.gate.name,
        lastDeviceName: context.deviceName,
      });

      const entryMessage = context.override
        ? `Override Authorized: Entry Granted (${context.overrideReason || "Supervisor Approval"})`
        : "Entry Approved";

      return {
        status: "valid_entry",
        color: "green",
        allowed: true,
        message: entryMessage,
        attendee: {
          ...attendee,
          presenceStatus: "inside",
          checkinCount: attendee.checkinCount + 1,
          lastCheckinAt: timestamp,
          lastGateId: context.gate.id,
          lastGateName: context.gate.name,
          lastDeviceName: context.deviceName,
        },
        direction: "in",
        previousScan,
        canOverride: false,
        timestamp,
      };
    } else {
      // Exit attempt
      if (attendee.presenceStatus === "outside" && !context.override) {
        return {
          status: "already_checked_out",
          color: "amber",
          allowed: false,
          message: "Attendee already marked as Outside",
          rejectionReason: "Attendee is not currently recorded as inside venue",
          attendee,
          direction: "out",
          previousScan,
          canOverride: true,
          timestamp,
        };
      }

      // Successful Exit Validation
      await OfflineDb.updateLocalAttendeeState(context.eventId, attendee.id, {
        presenceStatus: "outside",
        checkoutCount: attendee.checkoutCount + 1,
        lastCheckoutAt: timestamp,
        lastGateId: context.gate.id,
        lastGateName: context.gate.name,
        lastDeviceName: context.deviceName,
      });

      return {
        status: "valid_exit",
        color: "green",
        allowed: true,
        message: "Exit Checked Out",
        attendee: {
          ...attendee,
          presenceStatus: "outside",
          checkoutCount: attendee.checkoutCount + 1,
          lastCheckoutAt: timestamp,
          lastGateId: context.gate.id,
          lastGateName: context.gate.name,
          lastDeviceName: context.deviceName,
        },
        direction: "out",
        previousScan,
        canOverride: false,
        timestamp,
      };
    }
  },
};
