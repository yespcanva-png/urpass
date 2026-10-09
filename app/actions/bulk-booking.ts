"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  type BulkBookingRequest,
  type BulkBookingSettings,
  type SettledBulkOrderResult,
  type RefundResult,
  getBulkBookingSettings,
  validateBulkBookingRequest,
  reserveBulkEventCapacity,
  settleBulkOrderAndIssueTickets,
  refundBulkOrderOrTicket,
} from "@/lib/bulk-booking";
import { updateEventFeatureFlag } from "@/app/actions/event-features";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Initiates bulk checkout: validates limits, reserves atomic capacity, and calculates pricing.
 */
export async function initiateBulkTicketCheckout(request: BulkBookingRequest): Promise<{
  success: boolean;
  reservationId?: string;
  expiresAt?: string;
  totalQuantity?: number;
  totalAmountPaise?: number;
  error?: string;
  message?: string;
}> {
  const db = adminClient();
  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, attendee_limit, status, application_enabled, custom_pass_design")
    .eq("id", request.eventId)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      error: "EVENT_NOT_FOUND",
      message: "The requested event could not be found.",
    };
  }

  const reservation = await reserveBulkEventCapacity({
    adminClient: db,
    event,
    request,
  });

  if (!reservation.success) {
    return {
      success: false,
      error: reservation.error,
      message: reservation.message,
    };
  }

  const validation = await validateBulkBookingRequest({
    event,
    request,
    adminClient: db,
  });

  return {
    success: true,
    reservationId: reservation.reservationId,
    expiresAt: reservation.expiresAt,
    totalQuantity: reservation.totalQuantity,
    totalAmountPaise: validation.pricing?.totalAmountPaise,
  };
}

/**
 * Settles bulk order upon payment confirmation and idempotently issues individual tickets.
 */
export async function completeBulkPaymentAndIssueTickets({
  eventId,
  request,
  paymentId,
  orderId,
  reservationId,
}: {
  eventId: string;
  request: BulkBookingRequest;
  paymentId: string;
  orderId?: string;
  reservationId?: string;
}): Promise<SettledBulkOrderResult> {
  const db = adminClient();
  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, attendee_limit, status, custom_pass_design")
    .eq("id", eventId)
    .maybeSingle();

  if (eventErr || !event) {
    return {
      success: false,
      orderId: orderId || "unknown",
      eventId,
      buyerName: request.buyerName,
      buyerEmail: request.buyerEmail,
      totalQuantity: 0,
      totalAmountPaise: 0,
      status: "failed",
      tickets: [],
      error: "Event not found.",
    };
  }

  return settleBulkOrderAndIssueTickets({
    adminClient: db,
    event,
    request,
    paymentId,
    orderId,
    reservationId,
  });
}

/**
 * Refunds full order or individual tickets.
 */
export async function cancelOrRefundBulkTickets({
  orderId,
  ticketAttendeeIds,
}: {
  orderId: string;
  ticketAttendeeIds?: string[];
}): Promise<RefundResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      orderId,
      isFullRefund: false,
      refundedCount: 0,
      remainingActiveCount: 0,
      refundedTicketIds: [],
      refundedAmountPaise: 0,
      error: "Authentication required.",
    };
  }

  const db = adminClient();
  return refundBulkOrderOrTicket({
    adminClient: db,
    orderId,
    ticketAttendeeIds,
  });
}

/**
 * Updates event bulk booking settings (organizer activation).
 */
export async function updateEventBulkSettings({
  eventId,
  settings,
}: {
  eventId: string;
  settings: Partial<BulkBookingSettings>;
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

  if (!event || event.organizer_id !== user.id) {
    return { error: "Unauthorized to update event settings." };
  }

  // Update feature flag state
  if (typeof settings.enabled === "boolean") {
    await updateEventFeatureFlag(eventId, "bulk_ticket_booking", settings.enabled);
  }

  const existingDesign = (event.custom_pass_design && typeof event.custom_pass_design === "object")
    ? event.custom_pass_design
    : {};

  const currentBulk = getBulkBookingSettings(event);
  const updatedBulk: BulkBookingSettings = {
    ...currentBulk,
    ...settings,
  };

  const updatedDesign = {
    ...existingDesign,
    _bulkBookingSettings: updatedBulk,
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
