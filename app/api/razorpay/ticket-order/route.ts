import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { notifyOwnerPaymentAttempt } from "@/lib/email";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { eventId, ticketTypeId, buyerName, buyerEmail } = body ?? {};

  if (!eventId || !buyerName || !buyerEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const admin = adminClient();

  // Fetch event + organizer_id and organization_id
  const { data: event } = await admin
    .from("events")
    .select("id, name, is_paid_event, ticket_price, status, application_enabled, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 400 });
  }
  if (event.status !== "active" || !event.application_enabled) {
    return NextResponse.json({ error: "Event is not accepting applications" }, { status: 400 });
  }

  let amountPaise = event.is_paid_event ? Math.round(event.ticket_price * 100) : 0;
  let ticketName = event.name;

  if (ticketTypeId) {
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

    if (ticketType.capacity != null) {
      const { count } = await admin
        .from("attendees")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("ticket_type_id", ticketTypeId)
        .neq("application_status", "rejected");

      if ((count ?? 0) >= ticketType.capacity) {
        return NextResponse.json({ error: "Selected ticket is sold out." }, { status: 400 });
      }
    }

    amountPaise = ticketType.price;
    ticketName = `${event.name} — ${ticketType.name}`;
  }

  if (amountPaise <= 0) {
    return NextResponse.json({ error: "Selected ticket does not require payment" }, { status: 400 });
  }

  // Fetch Razorpay credentials (check organization settings first, then user settings)
  let keyId: string | null = null;
  let keySecret: string | null = null;

  if (event.organization_id) {
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

  if (!keyId || !keySecret) {
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
    return NextResponse.json(
      { error: "The event organizer has not connected a payment gateway yet." },
      { status: 400 }
    );
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `ticket_${eventId.slice(0, 8)}_${Date.now()}`,
    notes: {
      event_id: eventId,
      ticket_type_id: ticketTypeId ?? "",
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      ticket_name: ticketName,
      type: "ticket",
    },
  });

  await admin.from("ticket_orders").insert({
    event_id: eventId,
    ticket_type_id: ticketTypeId ?? null,
    razorpay_order_id: order.id,
    amount: amountPaise,
    currency: "INR",
    buyer_name: buyerName,
    buyer_email: buyerEmail,
    status: "created",
  });

  notifyOwnerPaymentAttempt({
    kind: "ticket",
    buyerName,
    buyerEmail,
    itemName: ticketName,
    amountPaise,
    orderId: order.id,
  }).catch((err: unknown) => console.error("[email]", err));

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
    eventName: ticketName,
  });
}
