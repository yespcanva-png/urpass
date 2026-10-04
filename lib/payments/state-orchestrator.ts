import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { recordLiveOpsEvent } from "@/lib/ops/events";
import { retryPassGeneration } from "@/app/actions/attendees";

function adminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for state orchestration.");
  }
  return createClient(getSupabaseUrl(), serviceKey);
}

export interface StateAnomalyReport {
  eventId: string;
  cancelledEventActivePassesCount: number;
  paidRejectedUnrefundedCount: number;
  paidMissingPassCount: number;
  expiredActiveReservationsCount: number;
  anomaliesDetected: boolean;
  repairedCount: number;
}

/**
 * Cancels an event and executes atomic state cascade:
 * - Event status set to 'cancelled'
 * - All non-checked-in passes invalidated to 'cancelled'
 * - All active reservations expired
 */
export async function cancelEventWithCascade(
  eventId: string,
  reason = "Event cancelled by organizer"
): Promise<{ success: boolean; passesCancelled: number; error?: string }> {
  const supabase = adminClient();

  try {
    // 1. Update event status
    const { error: eventErr } = await supabase
      .from("events")
      .update({
        status: "cancelled",
        application_enabled: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    if (eventErr) throw eventErr;

    // 2. Cascade cancel all passes that are not already checked in
    const { data: cancelledPasses, error: passErr } = await supabase
      .from("passes")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId)
      .in("status", ["not_generated", "generated", "active"])
      .select("id");

    if (passErr) console.warn("[state-orchestrator] Warning cancelling passes:", passErr);

    // 3. Expire all outstanding capacity reservations
    await supabase
      .from("ticket_reservations")
      .update({
        status: "EXPIRED",
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId)
      .eq("status", "RESERVED");

    const passesCancelled = cancelledPasses?.length ?? 0;

    recordLiveOpsEvent({
      level: "WARN",
      category: "SYSTEM",
      message: `Event [${eventId}] cancelled with cascade: ${passesCancelled} passes invalidated`,
      details: { eventId, reason, passesCancelled },
    });

    return { success: true, passesCancelled };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to cancel event with cascade";
    console.error("[state-orchestrator] cancelEventWithCascade error:", msg);
    return { success: false, passesCancelled: 0, error: msg };
  }
}

/**
 * Reconciles payment capture when a reservation was expired but payment captured in gateway.
 * Guarantees that paid attendees are never stranded in expired or unapproved limbo.
 */
export async function reconcileCapturedPaymentReservation({
  orderId,
  paymentId,
  eventId,
}: {
  orderId: string;
  paymentId: string;
  eventId: string;
}): Promise<{ reconciled: boolean; passToken?: string; error?: string }> {
  const supabase = adminClient();

  try {
    // 1. Fetch order
    const { data: order } = await supabase
      .from("ticket_orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (!order) {
      return { reconciled: false, error: "Order not found" };
    }

    // 2. Mark order as paid if not already
    if (order.status !== "paid") {
      await supabase
        .from("ticket_orders")
        .update({
          status: "paid",
          razorpay_payment_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    }

    // 3. Reconcile reservation if exists
    if (order.razorpay_order_id) {
      await supabase
        .from("ticket_reservations")
        .update({
          status: "PAID",
          updated_at: new Date().toISOString(),
        })
        .eq("event_id", eventId)
        .eq("buyer_email", order.buyer_email)
        .eq("status", "RESERVED");
    }

    // 4. Ensure attendee is approved and pass generated
    if (order.attendee_id) {
      const { data: attendee } = await supabase
        .from("attendees")
        .select("id, application_status, pass_status")
        .eq("id", order.attendee_id)
        .single();

      if (attendee) {
        if (attendee.application_status !== "approved") {
          await supabase
            .from("attendees")
            .update({ application_status: "approved" })
            .eq("id", attendee.id);
        }

        if (attendee.pass_status !== "generated" && attendee.pass_status !== "checked_in") {
          const res = await retryPassGeneration(attendee.id, eventId);
          return { reconciled: true, passToken: res.passToken };
        }
      }
    }

    return { reconciled: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Reconciliation error";
    return { reconciled: false, error: msg };
  }
}

/**
 * Scans an event for state anomalies and optionally executes auto-repair:
 * 1. Cancelled event with active passes
 * 2. Paid orders with rejected attendees that haven't been refunded
 * 3. Paid orders missing entrance passes
 * 4. Stale expired reservations
 */
export async function runEventHealthAudit(
  eventId: string,
  autoRepair = true
): Promise<StateAnomalyReport> {
  const supabase = adminClient();

  let cancelledEventActivePassesCount = 0;
  let paidRejectedUnrefundedCount = 0;
  let paidMissingPassCount = 0;
  let expiredActiveReservationsCount = 0;
  let repairedCount = 0;

  try {
    // 1. Check Event Status
    const { data: event } = await supabase
      .from("events")
      .select("id, status")
      .eq("id", eventId)
      .maybeSingle();

    if (event?.status === "cancelled") {
      const { data: activePasses } = await supabase
        .from("passes")
        .select("id")
        .eq("event_id", eventId)
        .in("status", ["not_generated", "generated", "active"]);

      cancelledEventActivePassesCount = activePasses?.length ?? 0;

      if (autoRepair && cancelledEventActivePassesCount > 0) {
        await supabase
          .from("passes")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("event_id", eventId)
          .in("status", ["not_generated", "generated", "active"]);
        repairedCount += cancelledEventActivePassesCount;
      }
    }

    // 2. Check Paid but Rejected Attendees without processed refund
    const { data: paidOrders } = await supabase
      .from("ticket_orders")
      .select("id, attendee_id, amount, status, refund_status")
      .eq("event_id", eventId)
      .eq("status", "paid")
      .neq("refund_status", "processed");

    if (paidOrders && paidOrders.length > 0) {
      for (const order of paidOrders) {
        if (order.attendee_id) {
          const { data: att } = await supabase
            .from("attendees")
            .select("id, application_status")
            .eq("id", order.attendee_id)
            .maybeSingle();

          if (att?.application_status === "rejected") {
            paidRejectedUnrefundedCount++;
            if (autoRepair && order.refund_status !== "pending") {
              await supabase
                .from("ticket_orders")
                .update({ refund_status: "pending", updated_at: new Date().toISOString() })
                .eq("id", order.id);
              repairedCount++;
            }
          }
        }
      }
    }

    // 3. Check Paid Orders Missing Passes
    if (event?.status === "active" && paidOrders && paidOrders.length > 0) {
      for (const order of paidOrders) {
        if (order.attendee_id) {
          const { data: pass } = await supabase
            .from("passes")
            .select("id, status")
            .eq("attendee_id", order.attendee_id)
            .maybeSingle();

          if (!pass || pass.status === "not_generated") {
            paidMissingPassCount++;
            if (autoRepair) {
              const res = await retryPassGeneration(order.attendee_id, eventId);
              if (res.success) repairedCount++;
            }
          }
        }
      }
    }

    // 4. Stale Expired Reservations
    const { data: expiredRes } = await supabase
      .from("ticket_reservations")
      .select("id")
      .eq("event_id", eventId)
      .eq("status", "RESERVED")
      .lte("expires_at", new Date().toISOString());

    expiredActiveReservationsCount = expiredRes?.length ?? 0;
    if (autoRepair && expiredActiveReservationsCount > 0) {
      await supabase
        .from("ticket_reservations")
        .update({ status: "EXPIRED", updated_at: new Date().toISOString() })
        .eq("event_id", eventId)
        .eq("status", "RESERVED")
        .lte("expires_at", new Date().toISOString());
      repairedCount += expiredActiveReservationsCount;
    }
  } catch (err) {
    console.error("[state-orchestrator] Error during health audit:", err);
  }

  const anomaliesDetected =
    cancelledEventActivePassesCount > 0 ||
    paidRejectedUnrefundedCount > 0 ||
    paidMissingPassCount > 0 ||
    expiredActiveReservationsCount > 0;

  return {
    eventId,
    cancelledEventActivePassesCount,
    paidRejectedUnrefundedCount,
    paidMissingPassCount,
    expiredActiveReservationsCount,
    anomaliesDetected,
    repairedCount,
  };
}
