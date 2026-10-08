import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { buildPayUPaymentParams } from "@/lib/payments/payu";
import { reserveEventCapacity, linkOrderToReservation, releaseReservation } from "@/lib/capacity-reservation";
import { calculateTicketFees } from "@/lib/payments/fees";
import { getEventPaymentConfigService } from "@/lib/payments/service";
import type { FeeBearer, PaymentMode } from "@/lib/payments/types";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const {
    eventId,
    buyerName,
    buyerEmail,
    buyerPhone,
    buyerAge,
    ticketTypeId,
    guestCount,
    surl,
    furl,
  } = body ?? {};

  if (!eventId || !buyerName || !buyerEmail) {
    return NextResponse.json(
      { error: "Missing required fields (eventId, buyerName, buyerEmail)" },
      { status: 400 }
    );
  }

  const admin = adminClient();

  // Resolve Event
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);
  const eventQuery = admin
    .from("events")
    .select("id, name, is_paid_event, ticket_price, status, application_enabled, organizer_id, organization_id");

  const { data: event } = await (isUuid
    ? eventQuery.eq("id", eventId)
    : eventQuery.eq("apply_slug", eventId)
  ).maybeSingle();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const canonicalEventId = event.id;

  // Resolve Ticket Price
  let amountINR = Number(event.ticket_price || 0);
  let ticketName = event.name;

  if (ticketTypeId && ticketTypeId !== "default") {
    const { data: ticketType } = await admin
      .from("ticket_types")
      .select("id, name, price, status")
      .eq("id", ticketTypeId)
      .eq("event_id", canonicalEventId)
      .maybeSingle();

    if (ticketType) {
      amountINR = Number(ticketType.price) / 100;
      ticketName = `${event.name} — ${ticketType.name}`;
    }
  }

  if (amountINR <= 0) {
    return NextResponse.json(
      { error: "This ticket does not require payment." },
      { status: 400 }
    );
  }

  // Resolve PayU Credentials (Org level -> User level -> Env fallback)
  let merchantKey = process.env.PAYU_MERCHANT_KEY || "";
  let merchantSalt = process.env.PAYU_MERCHANT_SALT || "";
  let environment: "production" | "sandbox" =
    (process.env.PAYU_ENVIRONMENT as "production" | "sandbox") || "production";

  if (event.organization_id) {
    const { data: orgPay } = await admin
      .from("org_payment_settings")
      .select("payu_merchant_key, payu_merchant_salt, payu_environment")
      .eq("organization_id", event.organization_id)
      .maybeSingle();

    if (orgPay?.payu_merchant_key && orgPay?.payu_merchant_salt) {
      merchantKey = orgPay.payu_merchant_key;
      merchantSalt = orgPay.payu_merchant_salt;
      environment = (orgPay.payu_environment as "production" | "sandbox") || environment;
    }
  }

  if (!merchantKey && event.organizer_id) {
    const { data: userPay } = await admin
      .from("payment_settings")
      .select("payu_merchant_key, payu_merchant_salt, payu_environment")
      .eq("user_id", event.organizer_id)
      .maybeSingle();

    if (userPay?.payu_merchant_key && userPay?.payu_merchant_salt) {
      merchantKey = userPay.payu_merchant_key;
      merchantSalt = userPay.payu_merchant_salt;
      environment = (userPay.payu_environment as "production" | "sandbox") || environment;
    }
  }

  if (!merchantKey || !merchantSalt) {
    return NextResponse.json(
      { error: "PayU Payment Gateway credentials are not configured for this organizer." },
      { status: 500 }
    );
  }

  // Capacity Reservation
  const reservation = await reserveEventCapacity({
    adminClient: admin,
    eventId: canonicalEventId,
    ticketTypeId: ticketTypeId ?? null,
    buyerEmail,
    buyerName,
  });

  if (!reservation.success) {
    return NextResponse.json(
      { error: reservation.message || "Capacity full for this event." },
      { status: 409 }
    );
  }

  // Fees calculation
  const paymentConfig = await getEventPaymentConfigService(canonicalEventId, event.organizer_id);
  const feeBearer = (paymentConfig.fee_bearer || "ATTENDEE") as FeeBearer;
  const fees = calculateTicketFees({
    basePrice: amountINR,
    feeBearer,
    platformFeePercent: Number(paymentConfig.platform_fee_percent || 2),
    platformFeeFixedINR: Number(paymentConfig.platform_fee_fixed_inr || 0),
    gatewayFeePercent: Number(paymentConfig.gateway_fee_percent || 2),
    gatewayFeeFixedINR: Number(paymentConfig.gateway_fee_fixed_inr || 0),
    currency: "INR",
  });

  const txnid = `payu_${canonicalEventId.slice(0, 6)}_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
  const totalPayable = fees.attendeeTotalPayable;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";
  const defaultSurl = `${appUrl}/api/payu/verify`;
  const defaultFurl = `${appUrl}/api/payu/verify`;

  const payuParams = buildPayUPaymentParams({
    merchantKey,
    merchantSalt,
    environment,
    txnid,
    amount: totalPayable,
    productinfo: ticketName.replace(/[^a-zA-Z0-9 _-]/g, "").slice(0, 100) || "Event Ticket",
    firstname: (buyerName.split(" ")[0] || "Attendee").replace(/[^a-zA-Z0-9]/g, "") || "Attendee",
    email: buyerEmail,
    phone: buyerPhone || "9999999999",
    surl: surl || defaultSurl,
    furl: furl || defaultFurl,
    udf1: canonicalEventId,
    udf2: ticketTypeId || "",
    udf3: reservation.reservationId || "",
    udf4: event.organization_id || "",
    udf5: "ticket_order",
  });

  // Create pending order record in database
  await admin.from("ticket_orders").insert({
    event_id: canonicalEventId,
    ticket_type_id: ticketTypeId ?? null,
    razorpay_order_id: txnid, // Store gateway reference
    amount: Math.round(totalPayable * 100),
    currency: "INR",
    buyer_name: buyerName,
    buyer_email: buyerEmail,
    status: "created",
    total_attendee_count: Number(guestCount || 1),
  });

  if (reservation.reservationId) {
    await linkOrderToReservation(admin, reservation.reservationId, txnid);
  }

  return NextResponse.json({
    success: true,
    txnid,
    amount: totalPayable,
    currency: "INR",
    actionUrl: payuParams.actionUrl,
    fields: payuParams.fields,
    reservationId: reservation.reservationId,
  });
}
