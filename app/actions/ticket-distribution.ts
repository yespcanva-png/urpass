"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  type DistributionSettings,
  type OrderDistributionSummary,
  type AssignTicketInput,
  type ClaimTicketInput,
  type ClaimTicketResult,
  type TicketDistributionItem,
  getDistributionSettings,
  getOrderDistributionSummary,
  assignTicketToRecipient,
  claimTicketWithToken,
  revokeTicketAssignment,
} from "@/lib/bulk-distribution";
import { updateEventFeatureFlag } from "@/app/actions/event-features";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type DistributionEventRow = {
  id: string;
  name?: string;
  organizer_id: string;
  organization_id?: string | null;
  custom_pass_design?: Record<string, unknown> | null;
  custom_fields?: Array<{ id: string; label: string; required?: boolean }> | null;
};

function canManageDistribution(event: DistributionEventRow, userId: string, memberRole?: string | null) {
  return (
    event.organizer_id === userId ||
    memberRole === "owner" ||
    memberRole === "admin" ||
    memberRole === "event_manager"
  );
}

function canReadDistribution(
  event: DistributionEventRow,
  order: Record<string, unknown>,
  user: { id: string; email?: string | null },
  memberRole?: string | null
) {
  const buyerEmail = String(order.buyer_email || "").toLowerCase().trim();
  const userEmail = (user.email || "").toLowerCase().trim();
  return buyerEmail === userEmail || canManageDistribution(event, user.id, memberRole);
}

async function getActiveOrgRole(
  db: ReturnType<typeof adminClient>,
  organizationId: string | null | undefined,
  userId: string
) {
  if (!organizationId) return null;
  const { data: member } = await db
    .from("organization_members")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  return member?.role ?? null;
}

async function persistAssignmentHistory(
  db: ReturnType<typeof adminClient>,
  orderId: string,
  eventId: string,
  history: unknown
) {
  if (!Array.isArray(history) || history.length === 0) return;
  const last = history[history.length - 1] as Record<string, unknown>;

  try {
    await db.from("ticket_assignment_history").insert({
      order_id: orderId,
      event_id: eventId,
      attendee_id: last.attendeeId || null,
      actor_email: last.actorEmail || null,
      action: last.action,
      details: last.details || {},
      created_at: last.timestamp || new Date().toISOString(),
    });
  } catch {
    // Table may be absent in isolated tests before migration 089.
  }
}

/**
 * Retrieves the distribution summary for an order.
 */
export async function getDistributionSummaryAction(
  orderId: string
): Promise<{ success: boolean; summary?: OrderDistributionSummary; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "AUTHENTICATION_REQUIRED" };
  }

  const db = adminClient();
  const { data: order, error: orderErr } = await db
    .from("ticket_orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    return {
      success: false,
      error: "ORDER_NOT_FOUND",
    };
  }

  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, organization_id, custom_pass_design, custom_fields")
    .eq("id", order.event_id)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      error: "EVENT_NOT_FOUND",
    };
  }

  const memberRole = await getActiveOrgRole(db, event.organization_id, user.id);
  if (!canReadDistribution(event as DistributionEventRow, order, user, memberRole)) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  const summary = getOrderDistributionSummary({ order, event });
  return {
    success: true,
    summary,
  };
}

/**
 * Assigns or sends an invite for a purchased bulk ticket.
 */
export async function assignTicketAction(
  input: AssignTicketInput
): Promise<{
  success: boolean;
  ticket?: TicketDistributionItem;
  error?: string;
  message?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const actorEmail = user?.email || input.recipientEmail;

  const db = adminClient();
  const { data: order, error: orderErr } = await db
    .from("ticket_orders")
    .select("*")
    .eq("id", input.orderId)
    .maybeSingle();

  if (orderErr || !order) {
    return {
      success: false,
      error: "ORDER_NOT_FOUND",
      message: "Order not found.",
    };
  }

  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, organization_id, custom_pass_design, custom_fields")
    .eq("id", order.event_id)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      error: "EVENT_NOT_FOUND",
      message: "Event not found.",
    };
  }

  const memberRole = user
    ? await getActiveOrgRole(db, event.organization_id, user.id)
    : null;
  const effectiveActorEmail = canManageDistribution(event as DistributionEventRow, user?.id || "", memberRole)
    ? String(event.organizer_id)
    : actorEmail || "";

  const result = assignTicketToRecipient({
    order,
    event,
    input,
    actorEmail: effectiveActorEmail,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      message: result.message,
    };
  }

  // Persist updated order in DB
  if (result.updatedOrder) {
    await db
      .from("ticket_orders")
      .update({
        group_members: result.updatedOrder.group_members,
        _distributionHistory: result.updatedOrder._distributionHistory,
        updated_at: result.updatedOrder.updated_at,
      })
      .eq("id", input.orderId);

    await persistAssignmentHistory(
      db,
      input.orderId,
      String(order.event_id),
      result.updatedOrder._distributionHistory
    );
  }

  return {
    success: true,
    ticket: result.ticket,
  };
}

/**
 * Public action for recipients to claim an allocated ticket using a token.
 */
export async function claimTicketAction(
  input: ClaimTicketInput
): Promise<ClaimTicketResult> {
  const db = adminClient();

  // Find the order that contains this claim token in group_members.
  // The JSON containment query is backed by migration 089's GIN index in production.
  const orderQuery = db.from("ticket_orders").select("*");
  const { data: orders, error: ordersErr } =
    typeof orderQuery.contains === "function"
      ? await orderQuery.contains("group_members", [{ claimToken: input.claimToken }])
      : await orderQuery;

  if (ordersErr || !orders) {
    return {
      success: false,
      error: "DATABASE_ERROR",
      message: "Failed to locate ticket invitation.",
    };
  }

  const targetOrder = orders.find(
    (o) =>
      Array.isArray(o.group_members) &&
      o.group_members.some((m: Record<string, unknown>) => m.claimToken === input.claimToken)
  );

  if (!targetOrder) {
    return {
      success: false,
      error: "INVALID_CLAIM_TOKEN",
      message: "Invalid or expired ticket invitation token.",
    };
  }

  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, organization_id, custom_pass_design, custom_fields")
    .eq("id", targetOrder.event_id)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      error: "EVENT_NOT_FOUND",
      message: "Event associated with this ticket could not be found.",
    };
  }

  const result = await claimTicketWithToken({
    order: targetOrder,
    event,
    input,
    adminClient: db,
  });

  if (result.success) {
    await persistAssignmentHistory(
      db,
      String(targetOrder.id),
      String(targetOrder.event_id),
      result.updatedOrder?._distributionHistory
    );
  }

  return result;
}

/**
 * Revokes a ticket assignment and returns it to the pool of available tickets.
 */
export async function revokeAssignmentAction({
  orderId,
  attendeeId,
}: {
  orderId: string;
  attendeeId: string;
}): Promise<{ success: boolean; error?: string; message?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const db = adminClient();
  const { data: order, error: orderErr } = await db
    .from("ticket_orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    return {
      success: false,
      error: "ORDER_NOT_FOUND",
      message: "Order not found.",
    };
  }

  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, organization_id, custom_pass_design")
    .eq("id", order.event_id)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      error: "EVENT_NOT_FOUND",
      message: "Event not found.",
    };
  }

  const actorEmail = user?.email || String(order.buyer_email || "");
  const memberRole = user
    ? await getActiveOrgRole(db, event.organization_id, user.id)
    : null;
  const effectiveActorEmail = canManageDistribution(event as DistributionEventRow, user?.id || "", memberRole)
    ? String(event.organizer_id)
    : actorEmail;

  const result = revokeTicketAssignment({
    order,
    event,
    attendeeId,
    actorEmail: effectiveActorEmail,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      message: result.message,
    };
  }

  if (result.updatedOrder) {
    await db
      .from("ticket_orders")
      .update({
        group_members: result.updatedOrder.group_members,
        _distributionHistory: result.updatedOrder._distributionHistory,
        updated_at: result.updatedOrder.updated_at,
      })
      .eq("id", orderId);

    await persistAssignmentHistory(
      db,
      orderId,
      String(order.event_id),
      result.updatedOrder._distributionHistory
    );
  }

  return {
    success: true,
  };
}

/**
 * Updates event distribution settings (Organizer activation & deadline controls).
 */
export async function updateEventDistributionSettingsAction({
  eventId,
  settings,
}: {
  eventId: string;
  settings: Partial<DistributionSettings>;
}): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  const db = adminClient();
  const { data: event } = await db
    .from("events")
    .select("id, organizer_id, organization_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    return { error: "Event not found." };
  }

  const memberRole = await getActiveOrgRole(db, event.organization_id, user.id);
  if (!canManageDistribution(event as DistributionEventRow, user.id, memberRole)) {
    return { error: "Unauthorized to update event settings." };
  }

  if (
    settings.claimTokenTtlHours !== undefined &&
    (!Number.isFinite(settings.claimTokenTtlHours) || settings.claimTokenTtlHours < 1)
  ) {
    return { error: "Claim token expiry must be at least 1 hour." };
  }

  if (typeof settings.enabled === "boolean") {
    const flagResult = await updateEventFeatureFlag(eventId, "ticket_distribution", settings.enabled);
    if (flagResult.error) {
      return { error: flagResult.error };
    }
  }

  const existingDesign =
    event.custom_pass_design && typeof event.custom_pass_design === "object"
      ? event.custom_pass_design
      : {};

  const currentSettings = getDistributionSettings(event);
  const updatedSettings: DistributionSettings = {
    ...currentSettings,
    ...settings,
  };

  const updatedDesign = {
    ...existingDesign,
    _distributionSettings: updatedSettings,
  };

  const { error } = await db
    .from("events")
    .update({
      custom_pass_design: updatedDesign,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/event/${eventId}/settings`);
  return { success: true };
}
