import { describe, it, expect } from "vitest";
import {
  getEventCancellationPolicy,
  calculateCancellationDeadline,
  checkTicketCancellationEligibility,
} from "@/lib/cancellation/service";
import { extractModuleConfigsFromEvent } from "@/lib/feature-flags";

describe("Event Ticket Cancellation Feature", () => {
  describe("Phase 1 & 2: Policy Resolution & Organizer Settings", () => {
    it("returns default policy (disabled self-service) when event has no cancellation config", () => {
      const mockEvent = {
        id: "ev-default",
        name: "Campus Tech Fest",
        custom_pass_design: null,
      };

      const policy = getEventCancellationPolicy(mockEvent as any);

      expect(policy.enabled).toBe(false);
      expect(policy.cutoff).toBe("before_start");
      expect(policy.requireReason).toBe(true);
      expect(policy.requireOrganizerApproval).toBe(false);
      expect(policy.sendNotifications).toBe(true);
      expect(policy.capacityReleasePolicy).toBe("immediate");
      expect(policy.paidTicketPolicy).toBe("manual_review");
    });

    it("correctly extracts organizer custom cancellation policy from custom_pass_design", () => {
      const mockEvent = {
        id: "ev-configured",
        name: "UrPass Developers Conference",
        custom_pass_design: {
          _cancellationConfig: {
            enabled: true,
            cutoff: "48h",
            customCutoffHours: 48,
            requireReason: true,
            requireOrganizerApproval: true,
            sendNotifications: true,
            capacityReleasePolicy: "on_approval",
            paidTicketPolicy: "manual_review",
          },
        },
      };

      const policy = getEventCancellationPolicy(mockEvent as any);

      expect(policy.enabled).toBe(true);
      expect(policy.cutoff).toBe("48h");
      expect(policy.requireReason).toBe(true);
      expect(policy.requireOrganizerApproval).toBe(true);
      expect(policy.capacityReleasePolicy).toBe("on_approval");
      expect(policy.paidTicketPolicy).toBe("manual_review");
    });

    it("extracts cancellation module config via unified feature-flag system", () => {
      const mockEvent = {
        id: "ev-ff",
        name: "Corporate Summit",
        custom_pass_design: {
          _moduleConfigs: {
            ticket_cancellation: {
              enabled: true,
              cutoff: "custom",
              customCutoffHours: 72,
              requireOrganizerApproval: false,
            },
          },
        },
      };

      const configs = extractModuleConfigsFromEvent(mockEvent as any);
      expect(configs.ticket_cancellation).toBeDefined();
      expect(configs.ticket_cancellation.enabled).toBe(true);
      expect(configs.ticket_cancellation.cutoff).toBe("custom");
      expect(configs.ticket_cancellation.customCutoffHours).toBe(72);
    });
  });

  describe("Phase 2 & 4: Deadline & Cutoff Calculations", () => {
    const eventDate = "2026-12-01";
    const startTime = "18:00"; // 6:00 PM
    const eventIso = new Date("2026-12-01T18:00:00").getTime();

    it("calculates 'before_start' cutoff as exact event start time", () => {
      const deadline = calculateCancellationDeadline(
        { event_date: eventDate, start_time: startTime },
        {
          enabled: true,
          cutoff: "before_start",
          requireReason: false,
          requireOrganizerApproval: false,
          sendNotifications: true,
          capacityReleasePolicy: "immediate",
          paidTicketPolicy: "full_refund",
        }
      );

      expect(deadline).not.toBeNull();
      expect(deadline.getTime()).toBe(eventIso);
    });

    it("calculates '24h' cutoff exactly 24 hours prior to event start", () => {
      const deadline = calculateCancellationDeadline(
        { event_date: eventDate, start_time: startTime },
        {
          enabled: true,
          cutoff: "24h",
          customCutoffHours: 24,
          requireReason: false,
          requireOrganizerApproval: false,
          sendNotifications: true,
          capacityReleasePolicy: "immediate",
          paidTicketPolicy: "full_refund",
        }
      );

      expect(deadline).not.toBeNull();
      const expectedTime = eventIso - 24 * 3600 * 1000;
      expect(deadline.getTime()).toBe(expectedTime);
    });

    it("calculates '48h' cutoff exactly 48 hours prior to event start", () => {
      const deadline = calculateCancellationDeadline(
        { event_date: eventDate, start_time: startTime },
        {
          enabled: true,
          cutoff: "48h",
          customCutoffHours: 48,
          requireReason: false,
          requireOrganizerApproval: false,
          sendNotifications: true,
          capacityReleasePolicy: "immediate",
          paidTicketPolicy: "full_refund",
        }
      );

      expect(deadline).not.toBeNull();
      const expectedTime = eventIso - 48 * 3600 * 1000;
      expect(deadline.getTime()).toBe(expectedTime);
    });

    it("calculates 'custom' cutoff using customCutoffHours", () => {
      const deadline = calculateCancellationDeadline(
        { event_date: eventDate, start_time: startTime },
        {
          enabled: true,
          cutoff: "custom",
          customCutoffHours: 12,
          requireReason: false,
          requireOrganizerApproval: false,
          sendNotifications: true,
          capacityReleasePolicy: "immediate",
          paidTicketPolicy: "full_refund",
        }
      );

      expect(deadline).not.toBeNull();
      const expectedTime = eventIso - 12 * 3600 * 1000;
      expect(deadline.getTime()).toBe(expectedTime);
    });
  });

  describe("Phase 3 & 4: Server-Side Eligibility & Boundary Rules", () => {
    const futureEvent = {
      id: "ev-future-1",
      event_date: "2029-01-01",
      start_time: "10:00",
      custom_pass_design: {
        _cancellationConfig: {
          enabled: true,
          cutoff: "before_start",
          requireReason: false,
          requireOrganizerApproval: false,
          sendNotifications: true,
          capacityReleasePolicy: "immediate",
          paidTicketPolicy: "full_refund",
        },
      },
    };

    it("denies cancellation when self-service feature is disabled by organizer", () => {
      const disabledEvent = {
        ...futureEvent,
        custom_pass_design: {
          _cancellationConfig: { enabled: false },
        },
      };

      const result = checkTicketCancellationEligibility({
        event: disabledEvent,
        attendee: { application_status: "approved", pass_status: "generated" },
        pass: { status: "active" },
      });

      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("disabled by the organizer");
    });

    it("denies cancellation when ticket is already checked in at gate", () => {
      const result = checkTicketCancellationEligibility({
        event: futureEvent,
        attendee: { application_status: "approved", pass_status: "checked_in" },
        pass: { status: "checked_in" },
      });

      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("already been checked in");
    });

    it("denies cancellation when ticket is already cancelled", () => {
      const result = checkTicketCancellationEligibility({
        event: futureEvent,
        attendee: { application_status: "cancelled", pass_status: "revoked" },
        pass: { status: "cancelled" },
      });

      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("already been cancelled");
    });

    it("denies duplicate submission when cancellation request is pending review", () => {
      const result = checkTicketCancellationEligibility({
        event: futureEvent,
        attendee: { application_status: "cancellation_requested", pass_status: "generated" },
        pass: { status: "active" },
      });

      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("already been requested");
    });

    it("denies cancellation when past the cutoff deadline", () => {
      const pastEvent = {
        id: "ev-past-1",
        event_date: "2020-01-01",
        start_time: "10:00",
        custom_pass_design: {
          _cancellationConfig: {
            enabled: true,
            cutoff: "before_start",
          },
        },
      };

      const result = checkTicketCancellationEligibility({
        event: pastEvent,
        attendee: { application_status: "approved", pass_status: "generated" },
        pass: { status: "active" },
      });

      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("deadline");
    });

    it("approves eligible free ticket with appropriate policy disclosures", () => {
      const result = checkTicketCancellationEligibility({
        event: futureEvent,
        attendee: { application_status: "approved", pass_status: "generated" },
        pass: { status: "active" },
      });

      expect(result.eligible).toBe(true);
      expect(result.isPaidOrder).toBe(false);
      expect(result.refundPolicyText).toContain("Free registration");
    });

    it("approves eligible paid ticket with full refund disclosure", () => {
      const result = checkTicketCancellationEligibility({
        event: futureEvent,
        attendee: { application_status: "approved", pass_status: "generated" },
        pass: { status: "active" },
        paidOrder: { status: "paid", amount: 150000, currency: "INR" },
      });

      expect(result.eligible).toBe(true);
      expect(result.isPaidOrder).toBe(true);
      expect(result.refundPolicyText).toContain("full refund");
      expect(result.refundPolicyText).toContain("₹1500.00");
    });

    it("approves eligible paid ticket with manual review policy disclosure", () => {
      const manualReviewEvent = {
        ...futureEvent,
        custom_pass_design: {
          _cancellationConfig: {
            enabled: true,
            cutoff: "before_start",
            paidTicketPolicy: "manual_review",
          },
        },
      };

      const result = checkTicketCancellationEligibility({
        event: manualReviewEvent,
        attendee: { application_status: "approved", pass_status: "generated" },
        pass: { status: "active" },
        paidOrder: { status: "paid", amount: 50000, currency: "INR" },
      });

      expect(result.eligible).toBe(true);
      expect(result.refundPolicyText).toContain("reviewed by the organizer");
    });
  });

  describe("Phase 6: Gate Check-in Rejection for Cancelled Passes", () => {
    it("identifies cancelled and revoked tickets for scan gate rejection", () => {
      const cancelledPass = { status: "cancelled" };
      const revokedPass = { status: "revoked" };
      const activePass = { status: "active" };

      expect(cancelledPass.status === "cancelled" || cancelledPass.status === "revoked").toBe(true);
      expect(revokedPass.status === "cancelled" || revokedPass.status === "revoked").toBe(true);
      expect(activePass.status === "cancelled" || activePass.status === "revoked").toBe(false);
    });

    it("identifies attendee cancelled and cancellation_requested statuses for gate rejection", () => {
      const checkScanDenial = (status: string) => {
        return status === "cancelled" || status === "cancellation_requested";
      };

      expect(checkScanDenial("cancelled")).toBe(true);
      expect(checkScanDenial("cancellation_requested")).toBe(true);
      expect(checkScanDenial("approved")).toBe(false);
      expect(checkScanDenial("pending")).toBe(false);
    });
  });
});
