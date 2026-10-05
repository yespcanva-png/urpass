import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { notifyOwnerPaymentAttempt } from "@/lib/email";
import { getRazorpayCredentials, resolveEventRazorpayCredentials } from "@/lib/razorpay";
import { getEventPaymentConfigService } from "@/lib/payments/service";
import { calculateTicketFees } from "@/lib/payments/fees";
import type { FeeBearer, PaymentMode } from "@/lib/payments/types";
import {
  reserveEventCapacity,
  linkOrderToReservation,
  releaseReservation,
} from "@/lib/capacity-reservation";

export const dynamic = "force-dynamic";

type TicketTypeRow = {
  id: string;
  event_id: string;
  name: string;
  price: number;
  capacity: number | null;
  status: string;
  sales_start: string | null;
  sales_end: string | null;
  is_group_pass?: boolean;
  included_guests?: number;
  min_guests?: number;
  max_guests?: number;
  allow_extra_guests?: boolean;
  extra_guest_price?: number;
  max_extra_guests?: number;
};

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function isSalesWindowOpen(ticketType: TicketTypeRow) {
  const now = Date.now();
  const startsAt = ticketType.sales_start ? new Date(ticketType.sales_start).getTime() : null;
  const endsAt = ticketType.sales_end ? new Date(ticketType.sales_end).getTime() : null;
  return (startsAt == null || startsAt <= now) && (endsAt == null || endsAt >= now);
}

function badRequest(error: string, code: string) {
  return NextResponse.json({ error, code }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { eventId, buyerName, buyerEmail, guestCount, numberOfPeople, groupMembers } = body ?? {};
  let { ticketTypeId } = body ?? {};
  const requestedTicketTypeId = typeof ticketTypeId === "string" ? ticketTypeId.trim() : "";
  ticketTypeId = requestedTicketTypeId || null;

  if (!eventId || !buyerName || !buyerEmail) {
    return badRequest("Missing required fields", "MISSING_REQUIRED_FIELDS");
  }

  const admin = adminClient();

  // Fetch event + organizer_id and organization_id
  const { data: event } = await admin
    .from("events")
    .select("id, name, is_paid_event, ticket_price, currency, status, application_enabled, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) {
    return badRequest("Event not found", "EVENT_NOT_FOUND");
  }
  const isEventOpen =
    (event.status === "active" || event.status === "published" || event.status === "live" || !event.status) &&
    event.application_enabled !== false;

  if (!isEventOpen) {
    return badRequest("Event is not accepting applications at this time.", "EVENT_NOT_ACCEPTING");
  }

  const eventCurrency = ((event as { currency?: string })?.currency || "INR").toUpperCase();
  let amountPaise = 0;
  let ticketName = event.name;
  let totalAttendeeCount = 1;
  let extraGuestsCount = 0;
  let extraGuestsAmountRupees = 0;

  if (ticketTypeId && ticketTypeId !== "default") {
    const { data: ticketType } = await admin
      .from("ticket_types")
      .select("id, event_id, name, price, capacity, status, sales_start, sales_end, is_group_pass, included_guests, min_guests, max_guests, allow_extra_guests, extra_guest_price, max_extra_guests")
      .eq("id", ticketTypeId)
      .eq("event_id", eventId)
      .maybeSingle<TicketTypeRow>();

    if (!ticketType) {
      return badRequest("Selected ticket is no longer available. Please refresh and choose another ticket.", "TICKET_NOT_FOUND");
    }
    if (ticketType.status !== "on_sale") {
      return badRequest("Selected ticket is not on sale.", "TICKET_NOT_ON_SALE");
    }
    if (!isSalesWindowOpen(ticketType)) {
      return badRequest("Selected ticket is not on sale right now.", "TICKET_SALES_WINDOW_CLOSED");
    }

    const requestedGuests = Number(guestCount || numberOfPeople || ticketType.included_guests || 1);
    const includedGuests = Number(ticketType.included_guests || 1);
    const minGuests = Number(ticketType.min_guests || 1);
    const allowExtra = Boolean(ticketType.allow_extra_guests);
    const maxGuests = Number(ticketType.max_guests || (allowExtra ? 10 : includedGuests));
    const clampedGuests = Math.max(minGuests, Math.min(requestedGuests, maxGuests));

    extraGuestsCount = allowExtra ? Math.max(0, clampedGuests - includedGuests) : 0;
    const extraPriceRupees = Number(ticketType.extra_guest_price || 0);
    extraGuestsAmountRupees = extraGuestsCount * extraPriceRupees;
    const extraAmountPaise = Math.round(extraGuestsAmountRupees * 100);

    const basePricePaise = Number(ticketType.price);
    amountPaise = basePricePaise + extraAmountPaise;
    totalAttendeeCount = clampedGuests;
    ticketName = `${event.name} — ${ticketType.name}`;
  } else {
    const { data: defaultTT } = await admin
      .from("ticket_types")
      .select("id, event_id, name, price, capacity, status, sales_start, sales_end, is_group_pass, included_guests, min_guests, max_guests, allow_extra_guests, extra_guest_price, max_extra_guests")
      .eq("event_id", eventId)
      .eq("status", "on_sale")
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle<TicketTypeRow>();

    if (defaultTT) {
      if (!isSalesWindowOpen(defaultTT)) {
        return badRequest("Selected ticket is not on sale right now.", "TICKET_SALES_WINDOW_CLOSED");
      }
      amountPaise = Number(defaultTT.price);
      ticketName = `${event.name} — ${defaultTT.name}`;
      ticketTypeId = defaultTT.id;
    } else if (event.is_paid_event) {
      amountPaise = Math.round(Number(event.ticket_price || 0) * 100);
    }
  }

  if (amountPaise <= 0) {
    return badRequest("Selected ticket does not require online payment.", "TICKET_IS_FREE");
  }

  // ── P0: Atomic Capacity Reservation (10-minute window) ───────────
  // Locks database rows to guarantee no two concurrent buyers claim the last seat.
  const reservation = await reserveEventCapacity({
    adminClient: admin,
    eventId,
    ticketTypeId: ticketTypeId ?? null,
    buyerEmail,
    buyerName,
  });

  if (!reservation.success) {
    return NextResponse.json(
      { error: reservation.message || "Selected ticket is sold out. Capacity reached." },
      { status: 409 }
    );
  }

  const paymentConfig = await getEventPaymentConfigService(eventId, event.organizer_id);
  const paymentMode = (paymentConfig.payment_mode || paymentConfig.paymentMode || "URPASS_MANAGED") as PaymentMode;
  const feeBearer = (paymentConfig.fee_bearer || paymentConfig.feeBearer || "ATTENDEE") as FeeBearer;
  const platformFeePercent = Number(paymentConfig.platform_fee_percent ?? paymentConfig.platformFeePercent ?? 2);
  const platformFeeFixedINR = Number(paymentConfig.platform_fee_fixed_inr ?? paymentConfig.platformFeeFixedINR ?? 0);
  const gatewayFeePercent = Number(paymentConfig.gateway_fee_percent ?? paymentConfig.gatewayFeePercent ?? 2);
  const gatewayFeeFixedINR = Number(paymentConfig.gateway_fee_fixed_inr ?? paymentConfig.gatewayFeeFixedINR ?? 0);

  const baseAmountRupees = amountPaise / 100;
  const feeBreakdown = calculateTicketFees({
    basePrice: baseAmountRupees,
    feeBearer,
    platformFeePercent,
    platformFeeFixedINR,
    gatewayFeePercent,
    gatewayFeeFixedINR,
    currency: eventCurrency,
  });
  const chargeAmountPaise = Math.round(feeBreakdown.attendeeTotalPayable * 100);

  // Authoritatively resolve event payment gateway credentials (organizer direct / org gateway / platform fallback)
  let keyId: string | null = null;
  let keySecret: string | null = null;

  try {
    const creds = await resolveEventRazorpayCredentials(admin, {
      id: event.id,
      organizer_id: event.organizer_id,
      organization_id: event.organization_id,
    });
    keyId = creds.keyId;
    keySecret = creds.keySecret;
  } catch (credErr) {
    console.error("[ticket-order] resolveEventRazorpayCredentials error:", credErr);
    if (reservation.reservationId) {
      await releaseReservation(admin, { reservationId: reservation.reservationId });
    }
    return NextResponse.json(
      {
        error: "Payment gateway is not configured for this event. Please connect a payment gateway in settings.",
      },
      { status: 500 }
    );
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    let linkedAccountId = paymentConfig.provider_linked_account_id || paymentConfig.providerLinkedAccountId || null;
    if (paymentMode === "URPASS_MANAGED" && !linkedAccountId && event.organization_id) {
      const { data: orgAccount } = await admin
        .from("organization_payment_accounts")
        .select("provider_vendor_id")
        .eq("organization_id", event.organization_id)
        .eq("provider", "RAZORPAY")
        .eq("payments_enabled", true)
        .maybeSingle();

      linkedAccountId = orgAccount?.provider_vendor_id || null;
    }

    const orderPayload: Record<string, unknown> = {
      amount: chargeAmountPaise,
      currency: eventCurrency,
      receipt: `ticket_${eventId.slice(0, 8)}_${Date.now()}`,
      notes: {
        event_id: eventId,
        ticket_type_id: ticketTypeId ?? "",
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        ticket_name: ticketName,
        currency: eventCurrency,
        type: "ticket",
        reservation_id: reservation.reservationId ?? "",
        payment_mode: paymentMode,
        fee_bearer: feeBearer,
        base_amount: String(amountPaise),
        total_attendee_count: String(totalAttendeeCount),
        extra_guests_count: String(extraGuestsCount),
        extra_guests_amount: String(extraGuestsAmountRupees),
      },
    };

    if (paymentMode === "URPASS_MANAGED" && linkedAccountId) {
      orderPayload.transfers = [
        {
          account: linkedAccountId,
          amount: Math.round(feeBreakdown.organizerNetShare * 100),
          currency: eventCurrency,
          notes: {
            purpose: "organizer_ticket_share",
            event_id: eventId,
          },
          on_hold: 0,
        },
      ];
    }

    // Razorpay Route supports `transfers`, but the SDK type is narrower.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = await (razorpay.orders as any).create(orderPayload);

    await Promise.all([
      admin.from("ticket_orders").insert({
        event_id: eventId,
        ticket_type_id: ticketTypeId ?? null,
        razorpay_order_id: order.id,
        amount: chargeAmountPaise,
        currency: eventCurrency,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        status: "created",
        total_attendee_count: totalAttendeeCount,
        extra_guests_count: extraGuestsCount,
        extra_guests_amount: extraGuestsAmountRupees,
        group_members: Array.isArray(groupMembers) ? groupMembers : [],
      }),
      reservation.reservationId
        ? linkOrderToReservation(admin, reservation.reservationId, order.id)
        : Promise.resolve(),
    ]);

    try {
      await notifyOwnerPaymentAttempt({
        kind: "ticket",
        buyerName,
        buyerEmail,
        itemName: ticketName,
        amountPaise: chargeAmountPaise,
        orderId: order.id,
      });
    } catch (err: unknown) {
      console.error("[ticket-order] notifyOwnerPaymentAttempt error:", err);
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      eventName: ticketName,
      paymentMode,
      fees: {
        baseAmount: amountPaise,
        platformFee: Math.round(feeBreakdown.platformFee * 100),
        gatewayFee: Math.round(feeBreakdown.gatewayFee * 100),
        organizerShare: Math.round(feeBreakdown.organizerNetShare * 100),
      },
      reservationId: reservation.reservationId,
      expiresAt: reservation.expiresAt,
    });
  } catch (err: unknown) {
    // Release reservation if Razorpay order creation fails
    if (reservation.reservationId) {
      await releaseReservation(admin, { reservationId: reservation.reservationId });
    }
    const message = err instanceof Error ? err.message : "Failed to create payment order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { reservationId, orderId } = body ?? {};
  if (!reservationId && !orderId) {
    return NextResponse.json({ error: "Missing reservationId or orderId" }, { status: 400 });
  }

  const admin = adminClient();
  await releaseReservation(admin, { reservationId, orderId });
  return NextResponse.json({ success: true });
}
