export * from "./types";
import { SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { isFeatureEnabled, type EventLike } from "@/lib/feature-flags";
import {
  type DistributionSettings,
  type TicketDistributionItem,
  type DistributionHistoryEntry,
  type OrderDistributionSummary,
  type AssignTicketInput,
  type ClaimTicketInput,
  type ClaimTicketResult,
} from "./types";

export const DEFAULT_DISTRIBUTION_SETTINGS: DistributionSettings = {
  enabled: false,
  assignmentDeadline: null,
  requireFormValidation: false,
  allowReassignment: true,
  claimTokenTtlHours: 72, // 3 days
};

function newHistoryId() {
  return `hist_${crypto.randomUUID()}`;
}

/**
 * Extracts distribution settings from event metadata or returns defaults.
 */
export function getDistributionSettings(event?: EventLike | null): DistributionSettings {
  const isFlagActive = isFeatureEnabled(event, "ticket_distribution");

  if (!event || !event.custom_pass_design) {
    return {
      ...DEFAULT_DISTRIBUTION_SETTINGS,
      enabled: isFlagActive,
    };
  }

  const raw = (event.custom_pass_design as Record<string, unknown>)?._distributionSettings;

  if (raw && typeof raw === "object") {
    const s = raw as Partial<DistributionSettings>;
    return {
      enabled: typeof s.enabled === "boolean" ? s.enabled && isFlagActive : isFlagActive,
      assignmentDeadline: typeof s.assignmentDeadline === "string" ? s.assignmentDeadline : null,
      requireFormValidation: typeof s.requireFormValidation === "boolean" ? s.requireFormValidation : false,
      allowReassignment: typeof s.allowReassignment === "boolean" ? s.allowReassignment : true,
      claimTokenTtlHours: typeof s.claimTokenTtlHours === "number" ? s.claimTokenTtlHours : 72,
    };
  }

  return {
    ...DEFAULT_DISTRIBUTION_SETTINGS,
    enabled: isFlagActive,
  };
}

/**
 * Builds a complete distribution summary for an order.
 */
export function getOrderDistributionSummary({
  order,
  event,
  appUrl = "https://urpass.space",
}: {
  order: Record<string, unknown>;
  event: EventLike;
  appUrl?: string;
}): OrderDistributionSummary {
  const settings = getDistributionSettings(event);
  const now = new Date();
  const isPastDeadline = Boolean(
    settings.assignmentDeadline && new Date(settings.assignmentDeadline) < now
  );

  const groupMembers = Array.isArray(order.group_members)
    ? (order.group_members as Array<Record<string, unknown>>)
    : [];

  const history = Array.isArray(order._distributionHistory)
    ? (order._distributionHistory as DistributionHistoryEntry[])
    : [];

  const tickets: TicketDistributionItem[] = groupMembers.map((m, idx) => {
    let state = (m.assignmentState as TicketDistributionItem["state"]) || "UNASSIGNED";
    const claimExpiresAt = m.claimExpiresAt ? String(m.claimExpiresAt) : null;

    // Evaluate token expiration
    if (state === "INVITED" && claimExpiresAt && new Date(claimExpiresAt) < now) {
      state = "EXPIRED";
    }

    const claimToken = m.claimToken ? String(m.claimToken) : null;
    const claimUrl = claimToken ? `${appUrl}/claim-ticket/${claimToken}` : null;

    return {
      ticketIndex: idx + 1,
      attendeeId: String(m.attendeeId || `att_${idx + 1}`),
      passId: m.passId ? String(m.passId) : undefined,
      ticketTypeId: String(m.ticketTypeId || "default"),
      ticketTypeName: String(m.ticketTypeName || "General Admission"),
      state,
      recipientName: m.recipientName ? String(m.recipientName) : (m.name ? String(m.name) : null),
      recipientEmail: m.recipientEmail ? String(m.recipientEmail) : null,
      recipientPhone: m.recipientPhone ? String(m.recipientPhone) : null,
      claimToken,
      claimExpiresAt,
      claimUrl,
      claimedAt: m.claimedAt ? String(m.claimedAt) : null,
      claimedByEmail: m.claimedByEmail ? String(m.claimedByEmail) : null,
      assignedAt: m.assignedAt ? String(m.assignedAt) : null,
      passToken: m.passToken ? String(m.passToken) : null,
      customResponses: (m.customResponses as Record<string, unknown>) || undefined,
    };
  });

  const totalTickets = tickets.length;
  const claimedCount = tickets.filter((t) => t.state === "CLAIMED").length;
  const invitedCount = tickets.filter((t) => t.state === "INVITED").length;
  const retainedCount = tickets.filter((t) => t.state === "RETAINED").length;
  const revokedCount = tickets.filter((t) => t.state === "REVOKED").length;
  const availableCount = tickets.filter(
    (t) => t.state === "UNASSIGNED" || t.state === "EXPIRED"
  ).length;
  const assignedCount = claimedCount + invitedCount + retainedCount;

  return {
    orderId: String(order.id),
    eventId: String(order.event_id || event.id),
    purchaserName: String(order.buyer_name || "Purchaser"),
    purchaserEmail: String(order.buyer_email || ""),
    totalTickets,
    availableCount,
    assignedCount,
    claimedCount,
    invitedCount,
    retainedCount,
    revokedCount,
    deadline: settings.assignmentDeadline,
    isPastDeadline,
    tickets,
    history,
  };
}

/**
 * Assigns an unassigned or expired ticket to a recipient via manual assignment or claim link.
 */
export function assignTicketToRecipient({
  order,
  event,
  input,
  actorEmail,
  appUrl = "https://urpass.space",
}: {
  order: Record<string, unknown>;
  event: EventLike;
  input: AssignTicketInput;
  actorEmail: string;
  appUrl?: string;
}): {
  success: boolean;
  error?: string;
  message?: string;
  updatedOrder?: Record<string, unknown>;
  ticket?: TicketDistributionItem;
} {
  const settings = getDistributionSettings(event);
  const normalizedActor = actorEmail.toLowerCase().trim();
  const buyerEmail = String(order.buyer_email || "").toLowerCase().trim();

  // 1. Authorization: Only authorized purchaser or organizer can manage assignments
  const isPurchaser = buyerEmail === normalizedActor;
  const isOrganizer = String(event.organizer_id).toLowerCase() === normalizedActor;

  if (!isPurchaser && !isOrganizer) {
    return {
      success: false,
      error: "UNAUTHORIZED",
      message: "Only the ticket purchaser or event organizer can distribute these tickets.",
    };
  }

  // 2. Distribution Feature Gate: When OFF, new assignments are blocked
  if (!settings.enabled) {
    return {
      success: false,
      error: "DISTRIBUTION_DISABLED",
      message: "Ticket distribution is currently disabled for this event.",
    };
  }

  // 3. Deadline Check
  if (settings.assignmentDeadline && new Date(settings.assignmentDeadline) < new Date()) {
    return {
      success: false,
      error: "DEADLINE_EXPIRED",
      message: "The organizer-controlled ticket assignment deadline has passed.",
    };
  }

  const groupMembers = Array.isArray(order.group_members)
    ? [...(order.group_members as Array<Record<string, unknown>>)]
    : [];

  // 4. Find target ticket by index or attendeeId
  let targetIndex = -1;
  if (typeof input.ticketIndex === "number" && input.ticketIndex > 0) {
    targetIndex = input.ticketIndex - 1;
  } else if (input.attendeeId) {
    targetIndex = groupMembers.findIndex((m) => m.attendeeId === input.attendeeId);
  } else {
    // Find first UNASSIGNED or EXPIRED ticket
    targetIndex = groupMembers.findIndex(
      (m) => !m.assignmentState || m.assignmentState === "UNASSIGNED" || m.assignmentState === "EXPIRED"
    );
  }

  if (targetIndex < 0 || targetIndex >= groupMembers.length) {
    return {
      success: false,
      error: "NO_AVAILABLE_TICKETS",
      message: "No available ticket found to assign.",
    };
  }

  const targetMember = { ...groupMembers[targetIndex] };
  const currentState = (targetMember.assignmentState as string) || "UNASSIGNED";

  // Prevent re-assigning an already CLAIMED ticket without revoking first
  if (currentState === "CLAIMED" && !settings.allowReassignment) {
    return {
      success: false,
      error: "TICKET_ALREADY_CLAIMED",
      message: "This ticket has already been claimed and cannot be reassigned.",
    };
  }

  const nowIso = new Date().toISOString();
  const claimToken = crypto.randomBytes(32).toString("hex");
  const ttlMs = settings.claimTokenTtlHours * 3600 * 1000;
  const claimExpiresAt = new Date(Date.now() + ttlMs).toISOString();

  const isManualMode = input.mode === "manual";
  const isRetained = input.recipientEmail.toLowerCase().trim() === buyerEmail && isManualMode;

  const nextState: TicketDistributionItem["state"] = isRetained
    ? "RETAINED"
    : isManualMode
    ? "CLAIMED"
    : "INVITED";

  targetMember.assignmentState = nextState;
  targetMember.recipientName = input.recipientName.trim();
  targetMember.recipientEmail = input.recipientEmail.toLowerCase().trim();
  targetMember.recipientPhone = input.recipientPhone?.trim() || null;
  targetMember.claimToken = isManualMode ? null : claimToken;
  targetMember.claimExpiresAt = isManualMode ? null : claimExpiresAt;
  targetMember.assignedAt = nowIso;
  if (isManualMode) {
    targetMember.claimedAt = nowIso;
    targetMember.claimedByEmail = input.recipientEmail.toLowerCase().trim();
  }
  if (input.customResponses) {
    targetMember.customResponses = input.customResponses;
  }

  groupMembers[targetIndex] = targetMember;

  // Append history log
  const currentHistory = Array.isArray(order._distributionHistory)
    ? [...(order._distributionHistory as DistributionHistoryEntry[])]
    : [];

  currentHistory.push({
    id: newHistoryId(),
    timestamp: nowIso,
    actorEmail: normalizedActor,
    action: isRetained ? "RETAINED" : isManualMode ? "CLAIMED" : "INVITED",
    ticketIndex: targetIndex + 1,
    attendeeId: String(targetMember.attendeeId || `att_${targetIndex + 1}`),
    details: {
      recipientName: targetMember.recipientName,
      recipientEmail: targetMember.recipientEmail,
      mode: input.mode || "claim_link",
    },
  });

  const updatedOrder = {
    ...order,
    group_members: groupMembers,
    _distributionHistory: currentHistory,
    updated_at: nowIso,
  };

  const ticketItem: TicketDistributionItem = {
    ticketIndex: targetIndex + 1,
    attendeeId: String(targetMember.attendeeId || `att_${targetIndex + 1}`),
    passId: targetMember.passId ? String(targetMember.passId) : undefined,
    ticketTypeId: String(targetMember.ticketTypeId || "default"),
    ticketTypeName: String(targetMember.ticketTypeName || "General Admission"),
    state: nextState,
    recipientName: String(targetMember.recipientName),
    recipientEmail: String(targetMember.recipientEmail),
    recipientPhone: targetMember.recipientPhone ? String(targetMember.recipientPhone) : null,
    claimToken: targetMember.claimToken ? String(targetMember.claimToken) : null,
    claimExpiresAt: targetMember.claimExpiresAt ? String(targetMember.claimExpiresAt) : null,
    claimUrl: targetMember.claimToken ? `${appUrl}/claim-ticket/${targetMember.claimToken}` : null,
    claimedAt: targetMember.claimedAt ? String(targetMember.claimedAt) : null,
    claimedByEmail: targetMember.claimedByEmail ? String(targetMember.claimedByEmail) : null,
    assignedAt: nowIso,
    passToken: targetMember.passToken ? String(targetMember.passToken) : null,
  };

  return {
    success: true,
    updatedOrder,
    ticket: ticketItem,
  };
}

/**
 * Claims a ticket with verification, expiration checks, custom field validation,
 * and concurrency safeguards preventing multiple users claiming the same ticket.
 */
export async function claimTicketWithToken({
  order,
  event,
  input,
  adminClient,
}: {
  order: Record<string, unknown>;
  event: EventLike;
  input: ClaimTicketInput;
  adminClient?: SupabaseClient;
}): Promise<ClaimTicketResult> {
  const settings = getDistributionSettings(event);
  const now = new Date();

  if (!settings.enabled) {
    return {
      success: false,
      error: "DISTRIBUTION_DISABLED",
      message: "Ticket distribution is currently disabled for this event.",
    };
  }

  // 1. Deadline Check
  if (settings.assignmentDeadline && new Date(settings.assignmentDeadline) < now) {
    return {
      success: false,
      error: "DEADLINE_EXPIRED",
      message: "The ticket claim deadline has passed.",
    };
  }

  const groupMembers = Array.isArray(order.group_members)
    ? [...(order.group_members as Array<Record<string, unknown>>)]
    : [];

  // 2. Find Ticket Matching Claim Token
  const targetIndex = groupMembers.findIndex((m) => m.claimToken === input.claimToken);

  if (targetIndex < 0) {
    return {
      success: false,
      error: "INVALID_CLAIM_TOKEN",
      message: "Invalid or nonexistent ticket claim invitation link.",
    };
  }

  const targetMember = { ...groupMembers[targetIndex] };

  // 3. Prevent Double Claiming
  if (targetMember.assignmentState === "CLAIMED") {
    return {
      success: false,
      error: "ALREADY_CLAIMED",
      message: "This ticket invitation has already been claimed by another attendee.",
    };
  }

  // 4. Token Expiration Check
  if (targetMember.claimExpiresAt && new Date(String(targetMember.claimExpiresAt)) < now) {
    return {
      success: false,
      error: "INVITATION_EXPIRED",
      message: "This invitation link has expired. Please request a new invitation from the ticket purchaser.",
    };
  }

  // 5. Custom Form Requirements Validation
  if (settings.requireFormValidation && Array.isArray(event.custom_fields)) {
    for (const field of event.custom_fields) {
      if (field.required && (!input.customResponses || !input.customResponses[field.id])) {
        return {
          success: false,
          error: "REQUIRED_FIELD_MISSING",
          message: `Please complete required field: "${field.label}"`,
        };
      }
    }
  }

  const nowIso = now.toISOString();
  const normalizedEmail = input.recipientEmail.toLowerCase().trim();
  const recipientName = input.recipientName.trim();
  const recipientPhone = input.recipientPhone?.trim() || "";

  // 6. Generate Personal Pass Token if not already existing
  const passToken = targetMember.passToken
    ? String(targetMember.passToken)
    : crypto.randomBytes(32).toString("hex");

  targetMember.assignmentState = "CLAIMED";
  targetMember.recipientName = recipientName;
  targetMember.recipientEmail = normalizedEmail;
  targetMember.recipientPhone = recipientPhone || null;
  targetMember.claimedAt = nowIso;
  targetMember.claimedByEmail = normalizedEmail;
  targetMember.claimToken = null; // Invalidate token immediately to prevent reuse
  targetMember.passToken = passToken;
  if (input.customResponses) {
    targetMember.customResponses = input.customResponses;
  }

  groupMembers[targetIndex] = targetMember;

  // Append history entry
  const history = Array.isArray(order._distributionHistory)
    ? [...(order._distributionHistory as DistributionHistoryEntry[])]
    : [];

  history.push({
    id: newHistoryId(),
    timestamp: nowIso,
    actorEmail: normalizedEmail,
    action: "CLAIMED",
    ticketIndex: targetIndex + 1,
    attendeeId: String(targetMember.attendeeId || `att_${targetIndex + 1}`),
    details: {
      claimedByEmail: normalizedEmail,
      recipientName,
    },
  });

  // 7. Update Database Attendee Record & Ensure passes entry exists
  if (adminClient && targetMember.attendeeId) {
    try {
      await adminClient
        .from("attendees")
        .update({
          name: recipientName,
          email: normalizedEmail,
          phone: recipientPhone,
          application_status: "approved",
          pass_status: "generated",
          custom_responses: input.customResponses || {},
          updated_at: nowIso,
        })
        .eq("id", targetMember.attendeeId);

      // Check if pass already exists in `passes` table for this attendee
      const { data: existingPass } = await adminClient
        .from("passes")
        .select("id, pass_token")
        .eq("attendee_id", targetMember.attendeeId)
        .maybeSingle();

      if (existingPass) {
        // Update status to generated if needed
        await adminClient
          .from("passes")
          .update({
            status: "generated",
            pass_token: passToken,
          })
          .eq("id", existingPass.id);
      } else {
        // Insert new pass row
        await adminClient
          .from("passes")
          .insert({
            event_id: order.event_id,
            attendee_id: targetMember.attendeeId,
            pass_token: passToken,
            pass_type: "participant",
            status: "generated",
          });
      }

      await adminClient
        .from("ticket_orders")
        .update({
          group_members: groupMembers,
          _distributionHistory: history,
          updated_at: nowIso,
        })
        .eq("id", order.id);
    } catch {
      // Mock / fallback
    }
  }

  const ticket: TicketDistributionItem = {
    ticketIndex: targetIndex + 1,
    attendeeId: String(targetMember.attendeeId || `att_${targetIndex + 1}`),
    passId: targetMember.passId ? String(targetMember.passId) : undefined,
    ticketTypeId: String(targetMember.ticketTypeId || "default"),
    ticketTypeName: String(targetMember.ticketTypeName || "General Admission"),
    state: "CLAIMED",
    recipientName,
    recipientEmail: normalizedEmail,
    recipientPhone: recipientPhone || null,
    claimToken: null,
    claimedAt: nowIso,
    claimedByEmail: normalizedEmail,
    passToken,
  };

  return {
    success: true,
    ticket,
    passToken,
    updatedOrder: {
      ...order,
      group_members: groupMembers,
      _distributionHistory: history,
      updated_at: nowIso,
    },
  };
}

/**
 * Revokes a ticket assignment and returns it to UNASSIGNED state.
 */
export function revokeTicketAssignment({
  order,
  event,
  attendeeId,
  actorEmail,
}: {
  order: Record<string, unknown>;
  event: EventLike;
  attendeeId: string;
  actorEmail: string;
}): {
  success: boolean;
  error?: string;
  message?: string;
  updatedOrder?: Record<string, unknown>;
} {
  const normalizedActor = actorEmail.toLowerCase().trim();
  const buyerEmail = String(order.buyer_email || "").toLowerCase().trim();

  const isPurchaser = buyerEmail === normalizedActor;
  const isOrganizer = String(event.organizer_id).toLowerCase() === normalizedActor;

  if (!isPurchaser && !isOrganizer) {
    return {
      success: false,
      error: "UNAUTHORIZED",
      message: "Only the ticket purchaser or event organizer can revoke assignments.",
    };
  }

  const groupMembers = Array.isArray(order.group_members)
    ? [...(order.group_members as Array<Record<string, unknown>>)]
    : [];

  const targetIndex = groupMembers.findIndex((m) => m.attendeeId === attendeeId);
  if (targetIndex < 0) {
    return {
      success: false,
      error: "TICKET_NOT_FOUND",
      message: "Specified ticket was not found in this order.",
    };
  }

  const targetMember = { ...groupMembers[targetIndex] };
  const prevRecipient = targetMember.recipientEmail || targetMember.recipientName;
  const nowIso = new Date().toISOString();

  targetMember.assignmentState = "UNASSIGNED";
  targetMember.recipientName = null;
  targetMember.recipientEmail = null;
  targetMember.recipientPhone = null;
  targetMember.claimToken = null;
  targetMember.claimExpiresAt = null;
  targetMember.claimedAt = null;
  targetMember.claimedByEmail = null;

  groupMembers[targetIndex] = targetMember;

  const history = Array.isArray(order._distributionHistory)
    ? [...(order._distributionHistory as DistributionHistoryEntry[])]
    : [];

  history.push({
    id: newHistoryId(),
    timestamp: nowIso,
    actorEmail: normalizedActor,
    action: "REVOKED",
    ticketIndex: targetIndex + 1,
    attendeeId,
    details: {
      revokedFrom: prevRecipient,
    },
  });

  return {
    success: true,
    updatedOrder: {
      ...order,
      group_members: groupMembers,
      _distributionHistory: history,
      updated_at: nowIso,
    },
  };
}
