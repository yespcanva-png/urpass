import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js & external dependencies ─────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  getDistributionSettings,
  getOrderDistributionSummary,
  assignTicketToRecipient,
  claimTicketWithToken,
  revokeTicketAssignment,
} from "@/lib/bulk-distribution";
import {
  getDistributionSummaryAction,
  assignTicketAction,
  claimTicketAction,
  revokeAssignmentAction,
  updateEventDistributionSettingsAction,
} from "@/app/actions/ticket-distribution";
import type { EventLike } from "@/lib/feature-flags";
import type { OrderDistributionSummary } from "@/lib/bulk-distribution/types";

describe("Module 02 — Bulk Ticket Distribution (Test 02 Suite)", () => {
  const activeEvent: EventLike = {
    id: "event-dist-001",
    organizer_id: "organizer@yespstudio.com",
    name: "Garba Night Pilani Season 2",
    attendee_limit: 500,
    status: "active",
    application_enabled: true,
    custom_fields: [
      { id: "cf_col", label: "College / Company", type: "text", required: true },
      { id: "cf_ts", label: "T-Shirt Size", type: "select", required: false },
    ],
    custom_pass_design: {
      _featureFlags: {
        features: {
          ticket_distribution: true,
          bulk_ticket_booking: true,
        },
        version: 1,
      },
      _distributionSettings: {
        enabled: true,
        assignmentDeadline: null,
        requireFormValidation: true,
        allowReassignment: true,
        claimTokenTtlHours: 72,
      },
    },
  };

  const distDisabledEvent: EventLike = {
    id: "event-dist-off",
    organizer_id: "organizer@yespstudio.com",
    name: "Private Gala",
    attendee_limit: 100,
    status: "active",
    custom_pass_design: {
      _featureFlags: {
        features: {
          ticket_distribution: false, // OFF
        },
      },
      _distributionSettings: {
        enabled: false,
      },
    },
  };

  // Helper to generate a 10-ticket order for Arun
  function create10TicketOrder(): Record<string, unknown> {
    return {
      id: "order_arun_10",
      event_id: "event-dist-001",
      buyer_name: "Arun Kumar",
      buyer_email: "arun@example.com",
      buyer_phone: "+919876543210",
      total_attendee_count: 10,
      amount: 500000,
      status: "paid",
      group_members: Array.from({ length: 10 }, (_, i) => ({
        attendeeId: `att_${i + 1}`,
        passId: `pass_${i + 1}`,
        ticketTypeId: "tt_general",
        ticketTypeName: "General Admission",
        assignmentState: "UNASSIGNED",
        recipientName: null,
        recipientEmail: null,
        recipientPhone: null,
        claimToken: null,
        claimExpiresAt: null,
        claimedAt: null,
        claimedByEmail: null,
        assignedAt: null,
        passToken: null,
      })),
      _distributionHistory: [],
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Scenario 1: Arun buys 10 and assigns 9, leaving 1 available ──────────────
  it("Scenario 1: Arun buys 10 tickets and assigns 9, leaving exactly 1 available", () => {
    let order = create10TicketOrder();

    // Initial summary check
    const initialSummary = getOrderDistributionSummary({ order, event: activeEvent });
    expect(initialSummary.totalTickets).toBe(10);
    expect(initialSummary.availableCount).toBe(10);
    expect(initialSummary.assignedCount).toBe(0);

    // Arun assigns 9 tickets to 9 members
    for (let i = 1; i <= 9; i++) {
      const result = assignTicketToRecipient({
        order,
        event: activeEvent,
        actorEmail: "arun@example.com",
        input: {
          orderId: "order_arun_10",
          ticketIndex: i,
          recipientName: `Member ${i}`,
          recipientEmail: `member${i}@example.com`,
          mode: "claim_link",
        },
      });

      expect(result.success).toBe(true);
      expect(result.ticket?.state).toBe("INVITED");
      expect(result.ticket?.claimToken).toBeDefined();
      expect(result.ticket?.claimUrl).toContain("/claim-ticket/");
      order = result.updatedOrder!;
    }

    const summary = getOrderDistributionSummary({ order, event: activeEvent });
    expect(summary.totalTickets).toBe(10);
    expect(summary.assignedCount).toBe(9);
    expect(summary.invitedCount).toBe(9);
    expect(summary.availableCount).toBe(1); // Exactly 1 left available!
    expect(summary.tickets[9].state).toBe("UNASSIGNED");
    expect(summary.history.length).toBe(9);
  });

  // ── Scenario 2: Arun can distribute all 10 without keeping one ────────────────
  it("Scenario 2: Arun distributes all 10 tickets without retaining any for himself", () => {
    let order = create10TicketOrder();

    for (let i = 1; i <= 10; i++) {
      const result = assignTicketToRecipient({
        order,
        event: activeEvent,
        actorEmail: "arun@example.com",
        input: {
          orderId: "order_arun_10",
          ticketIndex: i,
          recipientName: `Colleague ${i}`,
          recipientEmail: `colleague${i}@company.org`,
          mode: "claim_link",
        },
      });

      expect(result.success).toBe(true);
      order = result.updatedOrder!;
    }

    const summary = getOrderDistributionSummary({ order, event: activeEvent });
    expect(summary.totalTickets).toBe(10);
    expect(summary.assignedCount).toBe(10);
    expect(summary.availableCount).toBe(0); // 0 remaining available
    expect(summary.retainedCount).toBe(0); // None retained by Arun
  });

  // ── Scenario 3: Recipient claims the correct ticket ───────────────────────────
  it("Scenario 3: Recipient claims their allocated ticket using the unique claim token", async () => {
    let order = create10TicketOrder();

    // Assign ticket 1 to Priyansh
    const assignResult = assignTicketToRecipient({
      order,
      event: activeEvent,
      actorEmail: "arun@example.com",
      input: {
        orderId: "order_arun_10",
        ticketIndex: 1,
        recipientName: "Priyansh Sharma",
        recipientEmail: "priyansh@example.com",
        mode: "claim_link",
      },
    });

    expect(assignResult.success).toBe(true);
    const token = assignResult.ticket?.claimToken!;
    expect(token).toBeTruthy();
    order = assignResult.updatedOrder!;

    // Priyansh claims ticket
    const claimResult = await claimTicketWithToken({
      order,
      event: activeEvent,
      input: {
        claimToken: token,
        recipientName: "Priyansh Sharma",
        recipientEmail: "priyansh@example.com",
        recipientPhone: "+919988776655",
        customResponses: {
          cf_col: "BITS Pilani",
          cf_ts: "L",
        },
      },
    });

    expect(claimResult.success).toBe(true);
    expect(claimResult.ticket?.state).toBe("CLAIMED");
    expect(claimResult.ticket?.recipientName).toBe("Priyansh Sharma");
    expect(claimResult.ticket?.recipientEmail).toBe("priyansh@example.com");
    expect(claimResult.ticket?.passToken).toBeDefined();
    expect(claimResult.passToken).toBeTruthy();
  });

  // ── Scenario 4: Two recipients cannot claim the same ticket ───────────────────
  it("Scenario 4: Second recipient is rejected when attempting to claim an already claimed ticket token", async () => {
    let order = create10TicketOrder();

    const assignResult = assignTicketToRecipient({
      order,
      event: activeEvent,
      actorEmail: "arun@example.com",
      input: {
        orderId: "order_arun_10",
        ticketIndex: 2,
        recipientName: "Neha Verma",
        recipientEmail: "neha@example.com",
        mode: "claim_link",
      },
    });
    const token = assignResult.ticket?.claimToken!;
    order = assignResult.updatedOrder!;

    // Neha claims the ticket
    const claim1 = await claimTicketWithToken({
      order,
      event: activeEvent,
      input: {
        claimToken: token,
        recipientName: "Neha Verma",
        recipientEmail: "neha@example.com",
        customResponses: { cf_col: "IIT Delhi" },
      },
    });
    expect(claim1.success).toBe(true);

    // Simulated updated order where token is cleared & state is CLAIMED
    const updatedMembers = (order.group_members as any[]).map((m) =>
      m.attendeeId === "att_2"
        ? { ...m, assignmentState: "CLAIMED", claimToken: null, claimedByEmail: "neha@example.com" }
        : m
    );
    const claimedOrder = { ...order, group_members: updatedMembers };

    // Impostor tries to use the same token
    const claim2 = await claimTicketWithToken({
      order: claimedOrder,
      event: activeEvent,
      input: {
        claimToken: token,
        recipientName: "Impostor",
        recipientEmail: "impostor@example.com",
        customResponses: { cf_col: "Fake University" },
      },
    });

    expect(claim2.success).toBe(false);
    expect(claim2.error).toBe("INVALID_CLAIM_TOKEN");
  });

  // ── Scenario 5: Expired invitations are rejected ──────────────────────────────
  it("Scenario 5: Expired ticket invitations are rejected and returned to available state", async () => {
    const expiredOrder = create10TicketOrder();
    const pastDate = new Date(Date.now() - 3600 * 1000 * 24).toISOString(); // 24h ago

    // Manually set an expired invite
    (expiredOrder.group_members as any[])[0] = {
      ...(expiredOrder.group_members as any[])[0],
      assignmentState: "INVITED",
      recipientEmail: "expired@example.com",
      claimToken: "expired_token_123",
      claimExpiresAt: pastDate,
    };

    // 1. Summary should recognize expired ticket as available
    const summary = getOrderDistributionSummary({ order: expiredOrder, event: activeEvent });
    expect(summary.tickets[0].state).toBe("EXPIRED");
    expect(summary.availableCount).toBe(10); // Expired count folded into available

    // 2. Claim attempt should fail with INVITATION_EXPIRED
    const claimRes = await claimTicketWithToken({
      order: expiredOrder,
      event: activeEvent,
      input: {
        claimToken: "expired_token_123",
        recipientName: "Late User",
        recipientEmail: "expired@example.com",
        customResponses: { cf_col: "Pilani" },
      },
    });

    expect(claimRes.success).toBe(false);
    expect(claimRes.error).toBe("INVITATION_EXPIRED");
    expect(claimRes.message).toContain("invitation link has expired");
  });

  // ── Scenario 6: Unauthorized users cannot modify distribution ────────────────
  it("Scenario 6: Unauthorized users are blocked from distributing or revoking tickets", () => {
    const order = create10TicketOrder();

    // An arbitrary user attempts to assign Arun's ticket
    const assignRes = assignTicketToRecipient({
      order,
      event: activeEvent,
      actorEmail: "hacker@malicious.com",
      input: {
        orderId: "order_arun_10",
        ticketIndex: 1,
        recipientName: "Hacker Recipient",
        recipientEmail: "hacker_target@example.com",
      },
    });

    expect(assignRes.success).toBe(false);
    expect(assignRes.error).toBe("UNAUTHORIZED");
    expect(assignRes.message).toContain("Only the ticket purchaser or event organizer");

    // An arbitrary user attempts to revoke a ticket
    const revokeRes = revokeTicketAssignment({
      order,
      event: activeEvent,
      attendeeId: "att_1",
      actorEmail: "hacker@malicious.com",
    });

    expect(revokeRes.success).toBe(false);
    expect(revokeRes.error).toBe("UNAUTHORIZED");
  });

  // ── Scenario 7: Repeated notification delivery does not create duplicate tickets
  it("Scenario 7: Repeated invitation or notification delivery does not create duplicate tickets or alter assignment count", () => {
    let order = create10TicketOrder();

    // First assignment
    const res1 = assignTicketToRecipient({
      order,
      event: activeEvent,
      actorEmail: "arun@example.com",
      input: {
        orderId: "order_arun_10",
        ticketIndex: 1,
        recipientName: "Kavya Nair",
        recipientEmail: "kavya@example.com",
      },
    });
    expect(res1.success).toBe(true);
    order = res1.updatedOrder!;

    // Re-assigning or resending notification to same ticket
    const res2 = assignTicketToRecipient({
      order,
      event: activeEvent,
      actorEmail: "arun@example.com",
      input: {
        orderId: "order_arun_10",
        ticketIndex: 1,
        recipientName: "Kavya Nair",
        recipientEmail: "kavya@example.com",
      },
    });
    expect(res2.success).toBe(true);
    order = res2.updatedOrder!;

    const summary = getOrderDistributionSummary({ order, event: activeEvent });
    expect(summary.totalTickets).toBe(10); // Total tickets never increases
    expect((order.group_members as any[]).length).toBe(10);
    expect(summary.assignedCount).toBe(1);
    expect(summary.availableCount).toBe(9);
  });

  // ── Scenario 8: Distribution OFF prevents new assignments but preserves previously claimed access
  it("Scenario 8: When distribution feature is OFF, new assignments are blocked but previously claimed tickets remain valid", () => {
    let order = create10TicketOrder();

    // Pre-populate ticket 1 as CLAIMED with a valid passToken
    (order.group_members as any[])[0] = {
      ...(order.group_members as any[])[0],
      assignmentState: "CLAIMED",
      recipientName: "Pooja Hegde",
      recipientEmail: "pooja@example.com",
      passToken: "pass_token_pooja_valid",
      claimedAt: new Date().toISOString(),
    };

    // Attempt new assignment on event where distribution is disabled
    const assignRes = assignTicketToRecipient({
      order,
      event: distDisabledEvent,
      actorEmail: "arun@example.com",
      input: {
        orderId: "order_arun_10",
        ticketIndex: 2,
        recipientName: "Rohan Das",
        recipientEmail: "rohan@example.com",
      },
    });

    expect(assignRes.success).toBe(false);
    expect(assignRes.error).toBe("DISTRIBUTION_DISABLED");
    expect(assignRes.message).toContain("disabled for this event");

    // Existing claimed pass is preserved
    const summary = getOrderDistributionSummary({ order, event: distDisabledEvent });
    expect(summary.tickets[0].state).toBe("CLAIMED");
    expect(summary.tickets[0].passToken).toBe("pass_token_pooja_valid");
    expect(summary.tickets[0].recipientEmail).toBe("pooja@example.com");
  });

  it("Scenario 8B: When distribution is OFF, pending invitation claims are blocked without deleting the invite", async () => {
    const order = create10TicketOrder();
    (order.group_members as any[])[1] = {
      ...(order.group_members as any[])[1],
      assignmentState: "INVITED",
      recipientName: "Pending Invite",
      recipientEmail: "pending@example.com",
      claimToken: "pending_token_123",
      claimExpiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    };

    const claimRes = await claimTicketWithToken({
      order,
      event: distDisabledEvent,
      input: {
        claimToken: "pending_token_123",
        recipientName: "Pending Invite",
        recipientEmail: "pending@example.com",
      },
    });

    expect(claimRes.success).toBe(false);
    expect(claimRes.error).toBe("DISTRIBUTION_DISABLED");

    const summary = getOrderDistributionSummary({ order, event: distDisabledEvent });
    expect(summary.tickets[1].state).toBe("INVITED");
    expect(summary.tickets[1].claimToken).toBe("pending_token_123");
  });

  // ── Scenario 9: Claims respect member form requirements if enabled ───────────
  it("Scenario 9: Claiming fails when required member form fields are missing, and succeeds when provided", async () => {
    let order = create10TicketOrder();

    const assignRes = assignTicketToRecipient({
      order,
      event: activeEvent, // requires "cf_col" (College / Company)
      actorEmail: "arun@example.com",
      input: {
        orderId: "order_arun_10",
        ticketIndex: 1,
        recipientName: "Sameer Joshi",
        recipientEmail: "sameer@example.com",
      },
    });
    const token = assignRes.ticket?.claimToken!;
    order = assignRes.updatedOrder!;

    // 1. Attempt claim without required custom field "cf_col"
    const missingFieldClaim = await claimTicketWithToken({
      order,
      event: activeEvent,
      input: {
        claimToken: token,
        recipientName: "Sameer Joshi",
        recipientEmail: "sameer@example.com",
        customResponses: {}, // Empty responses!
      },
    });

    expect(missingFieldClaim.success).toBe(false);
    expect(missingFieldClaim.error).toBe("REQUIRED_FIELD_MISSING");
    expect(missingFieldClaim.message).toContain('Please complete required field: "College / Company"');

    // 2. Claim with required custom field provided
    const validClaim = await claimTicketWithToken({
      order,
      event: activeEvent,
      input: {
        claimToken: token,
        recipientName: "Sameer Joshi",
        recipientEmail: "sameer@example.com",
        customResponses: {
          cf_col: "BITS Pilani, Goa Campus",
        },
      },
    });

    expect(validClaim.success).toBe(true);
    expect(validClaim.ticket?.state).toBe("CLAIMED");
    expect(validClaim.passToken).toBeTruthy();
  });

  // ── Pass Condition & Revocation Verification ──────────────────────────────────
  describe("Pass Condition: Single Attendee Identity & Revocation Lifecycle", () => {
    it("allows organizer or purchaser to revoke an assignment and return ticket to available pool", () => {
      let order = create10TicketOrder();

      // Assign ticket 3
      const assignRes = assignTicketToRecipient({
        order,
        event: activeEvent,
        actorEmail: "arun@example.com",
        input: {
          orderId: "order_arun_10",
          ticketIndex: 3,
          recipientName: "Revoke Target",
          recipientEmail: "target@example.com",
        },
      });
      order = assignRes.updatedOrder!;

      let summary = getOrderDistributionSummary({ order, event: activeEvent });
      expect(summary.assignedCount).toBe(1);
      expect(summary.availableCount).toBe(9);

      // Purchaser revokes ticket 3
      const revokeRes = revokeTicketAssignment({
        order,
        event: activeEvent,
        attendeeId: "att_3",
        actorEmail: "arun@example.com",
      });

      expect(revokeRes.success).toBe(true);
      order = revokeRes.updatedOrder!;

      summary = getOrderDistributionSummary({ order, event: activeEvent });
      expect(summary.assignedCount).toBe(0);
      expect(summary.availableCount).toBe(10);
      expect(summary.tickets[2].state).toBe("UNASSIGNED");
      expect(summary.tickets[2].recipientEmail).toBeNull();
      expect(summary.tickets[2].claimToken).toBeNull();

      // Verify audit log has the REVOKED action
      const lastHistory = summary.history[summary.history.length - 1];
      expect(lastHistory.action).toBe("REVOKED");
      expect(lastHistory.actorEmail).toBe("arun@example.com");
      expect(lastHistory.ticketIndex).toBe(3);
    });

    it("enforces organizer-controlled assignment deadline", () => {
      const pastDeadlineEvent: EventLike = {
        ...activeEvent,
        custom_pass_design: {
          ...activeEvent.custom_pass_design,
          _distributionSettings: {
            enabled: true,
            assignmentDeadline: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            requireFormValidation: false,
            allowReassignment: true,
            claimTokenTtlHours: 24,
          },
        },
      };

      const order = create10TicketOrder();

      const assignRes = assignTicketToRecipient({
        order,
        event: pastDeadlineEvent,
        actorEmail: "arun@example.com",
        input: {
          orderId: "order_arun_10",
          ticketIndex: 1,
          recipientName: "Late Recipient",
          recipientEmail: "late@example.com",
        },
      });

      expect(assignRes.success).toBe(false);
      expect(assignRes.error).toBe("DEADLINE_EXPIRED");
      expect(assignRes.message).toContain("assignment deadline has passed");
    });
  });
});
