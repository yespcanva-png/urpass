import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { notifyOwnerPaymentAttempt } from "@/lib/email";
import { getRazorpayCredentials } from "@/lib/razorpay";
import { getEventPaymentConfigService } from "@/lib/payments/service";
import { calculateTicketFees } from "@/lib/payments/fees";
import type { FeeBearer, PaymentMode } from "@/lib/payments/types";
import {
  reserveEventCapacity,
  linkOrderToReservation,
  releaseReservation,
} from "@/lib/capacity-reservation";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  let { eventId, ticketTypeId, buyerName, buyerEmail } = body ?? {};

  if (!eventId || !buyerName || !buyerEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const admin = adminClient();

  // Fetch event + organizer_id and organization_id
  const { data: event } = await admin
    .from("events")
    .select("id, name, is_paid_event, ticket_price, currency, status, application_enabled, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 400 });
  }
  if (event.status !== "active" || !event.application_enabled) {
    return NextResponse.json({ error: "Event is not accepting applications" }, { status: 400 });
  }

  const eventCurrency = ((event as { currency?: string })?.currency || "INR").toUpperCase();
  let amountPaise = event.is_paid_event ? Math.round(event.ticket_price * 100) : 0;
  let ticketName = event.name;

  if (ticketTypeId && ticketTypeId !== "default") {
    const { data: ticketType } = await admin
      .from("ticket_types")
      .select("id, event_id, name, price, capacity, status, sales_start, sales_end")
      .eq("id", ticketTypeId)
      .eq("event_id", eventId)
      .single();

    if (!ticketType || ticketType.status !== "on_sale") {
      return NextResponse.json({ error: "Selected ticket is not available." }, { status: 400 });
    }

    const now = Date.now();
    const startsAt = ticketType.sales_start ? new Date(ticketType.sales_start).getTime() : null;
    const endsAt = ticketType.sales_end ? new Date(ticketType.sales_end).getTime() : null;
    if ((startsAt != null && startsAt > now) || (endsAt != null && endsAt < now)) {
      return NextResponse.json({ error: "Selected ticket is not on sale right now." }, { status: 400 });
    }

    amountPaise = ticketType.price;
    ticketName = `${event.name} — ${ticketType.name}`;
  } else if (ticketTypeId === "default") {
    const { data: defaultTT } = await admin
      .from("ticket_types")
      .select("id, event_id, name, price, capacity, status, sales_start, sales_end")
      .eq("event_id", eventId)
      .eq("status", "on_sale")
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (defaultTT) {
      amountPaise = defaultTT.price;
      ticketName = `${event.name} — ${defaultTT.name}`;
      ticketTypeId = defaultTT.id;
    }
  }

  if (amountPaise <= 0) {
    return NextResponse.json({ error: "Selected ticket does not require payment" }, { status: 400 });
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

  // Fetch Razorpay credentials. URPASS managed events use platform credentials;
  // organizer-gateway events use organization/user credentials.
  let keyId: string | null = null;
  let keySecret: string | null = null;

  if (paymentMode === "URPASS_MANAGED") {
    try {
      const creds = getRazorpayCredentials();
      keyId = creds.keyId;
      keySecret = creds.keySecret;
    } catch {
      // handled below with managed-specific error
    }
  }

  if (paymentMode === "ORGANIZER_GATEWAY" && event.organization_id) {
    const { data: orgSettings } = await admin
      .from("org_payment_settings")
      .select("razorpay_key_id, razorpay_key_secret")
      .eq("organization_id", event.organization_id)
      .maybeSingle();

    if (orgSettings?.razorpay_key_id && orgSettings?.razorpay_key_secret) {
      keyId = orgSettings.razorpay_key_id;
      keySecret = orgSettings.razorpay_key_secret;
    }
  }

  if (paymentMode === "ORGANIZER_GATEWAY" && (!keyId || !keySecret)) {
    const { data: userSettings } = await admin
      .from("payment_settings")
      .select("razorpay_key_id, razorpay_key_secret")
      .eq("user_id", event.organizer_id)
      .maybeSingle();

    if (userSettings?.razorpay_key_id && userSettings?.razorpay_key_secret) {
      keyId = userSettings.razorpay_key_id;
      keySecret = userSettings.razorpay_key_secret;
    }
  }

  if (!keyId || !keySecret) {
    // Release the capacity reservation before failing
    if (reservation.reservationId) {
      await releaseReservation(admin, { reservationId: reservation.reservationId });
    }
    return NextResponse.json(
      {
        error:
          paymentMode === "URPASS_MANAGED"
            ? "URPASS Managed Payments are not configured. Please set platform Razorpay credentials."
            : "The event organizer has not connected a payment gateway yet.",
      },
      { status: 400 }
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
        platform_fee: String(Math.round(feeBreakdown.platformFee * 100)),
        gateway_fee: String(Math.round(feeBreakdown.gatewayFee * 100)),
        organizer_share: String(Math.round(feeBreakdown.organizerNetShare * 100)),
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
