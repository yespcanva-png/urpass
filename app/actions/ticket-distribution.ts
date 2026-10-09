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

/**
 * Retrieves the distribution summary for an order.
 */
export async function getDistributionSummaryAction(
  orderId: string
): Promise<{ success: boolean; summary?: OrderDistributionSummary; error?: string }> {
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
    .select("id, name, organizer_id, custom_pass_design, custom_fields")
    .eq("id", order.event_id)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      error: "EVENT_NOT_FOUND",
    };
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
    .select("id, name, organizer_id, custom_pass_design, custom_fields")
    .eq("id", order.event_id)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      error: "EVENT_NOT_FOUND",
      message: "Event not found.",
    };
  }

  const result = assignTicketToRecipient({
    order,
    event,
    input,
    actorEmail: actorEmail || "",
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

  // Find the order that contains this claim token in group_members
  const { data: orders, error: ordersErr } = await db
    .from("ticket_orders")
    .select("*");

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
    .select("id, name, organizer_id, custom_pass_design, custom_fields")
    .eq("id", targetOrder.event_id)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      error: "EVENT_NOT_FOUND",
      message: "Event associated with this ticket could not be found.",
    };
  }

  return claimTicketWithToken({
    order: targetOrder,
    event,
    input,
    adminClient: db,
  });
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
    .select("id, name, organizer_id, custom_pass_design")
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

  const result = revokeTicketAssignment({
    order,
    event,
    attendeeId,
    actorEmail,
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
    .select("id, organizer_id, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (!event || event.organizer_id !== user.id) {
    return { error: "Unauthorized to update event settings." };
  }

  if (typeof settings.enabled === "boolean") {
    await updateEventFeatureFlag(eventId, "ticket_distribution", settings.enabled);
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
