import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createInvoiceForPayment } from "@/lib/invoices";

export const dynamic = "force-dynamic";

// Use service-role client — webhook runs outside user session
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type BillingCycle = "monthly" | "annual";

function getBillingCycle(value: unknown): BillingCycle {
  return value === "annual" ? "annual" : "monthly";
}

function addBillingPeriod(start: Date, cycle: BillingCycle) {
  const end = new Date(start);
  if (cycle === "annual") {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  // Verify HMAC-SHA256 signature
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  // timingSafeEqual requires equal-length buffers; a length mismatch is itself
  // proof of an invalid signature so we can short-circuit safely.
  const expectedBuf = Buffer.from(expected, "hex");
  const sigBuf = Buffer.from(signature, "hex");
  const valid =
    expectedBuf.length === sigBuf.length &&
    crypto.timingSafeEqual(expectedBuf, sigBuf);

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const payment = event.payload?.payment?.entity;
  if (!payment) return NextResponse.json({ received: true });

  const notes = payment.notes ?? {};
  const supabase = adminClient();

  // Ticket payment
  if (notes.type === "ticket") {
    const razorpayOrderId: string = payment.order_id;
    if (!razorpayOrderId) return NextResponse.json({ received: true });

    const { error } = await supabase
      .from("ticket_orders")
      .update({
        status: "paid",
        razorpay_payment_id: payment.id,
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpayOrderId);

    if (error) {
      console.error("ticket_orders update failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  }

  // Event Pass payment
  if (notes.pass_type) {
    const userId: string = notes.user_id;
    const passType: string = notes.pass_type;
    const regLimit = Number(notes.registration_limit) || 250;
    const basePaise = Number(notes.base_paise) || (payment.amount ? Math.round(payment.amount / 1.18) : 29900);
    const priceRupees = Math.round(basePaise / 100);

    const { data: existingPass } = await supabase
      .from("event_passes")
      .select("id")
      .eq("payment_id", payment.id)
      .maybeSingle();

    if (!existingPass) {
      await supabase.from("event_passes").insert({
        user_id: userId,
        pass_type: passType,
        registration_limit: regLimit,
        price_rupees: priceRupees,
        payment_id: payment.id,
        status: "available",
      });
    }

    void createInvoiceForPayment({
      userId,
      paymentId: payment.id,
      description: `Event Pass (${passType.replace("_", " ").toUpperCase()})`,
      baseAmountRupees: priceRupees,
      discountRupees: 0,
      customerEmail: payment.email,
      customerName: notes.customer_name,
    });

    return NextResponse.json({ received: true });
  }

  // Subscription payment
  const userId: string = notes.user_id;
  const planId: string = notes.plan_id;
  const billingCycle = getBillingCycle(notes.billing_cycle);

  if (!userId || !planId) {
    return NextResponse.json({ error: "Missing notes" }, { status: 400 });
  }

  const now = new Date();
  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id, provider_subscription_id, current_period_start, current_period_end, registrations_used")
    .eq("user_id", userId)
    .maybeSingle();

  const isDuplicatePayment = existingSubscription?.provider_subscription_id === payment.id;
  const existingPeriodEnd = existingSubscription?.current_period_end
    ? new Date(existingSubscription.current_period_end)
    : null;
  const periodStart = isDuplicatePayment && existingSubscription?.current_period_start
    ? new Date(existingSubscription.current_period_start)
    : existingPeriodEnd && existingPeriodEnd > now
      ? existingPeriodEnd
      : now;
  const periodEnd = isDuplicatePayment && existingPeriodEnd
    ? existingPeriodEnd
    : addBillingPeriod(periodStart, billingCycle);

  const { data: updatedSub, error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan_id: planId,
        status: "active",
        provider: "razorpay",
        billing_cycle: billingCycle,
        provider_subscription_id: payment.id,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        registrations_used: isDuplicatePayment
          ? (existingSubscription?.registrations_used ?? 0)
          : 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("subscription update failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Issue invoice for subscription payment
  const basePaise = notes.base_amount
    ? Number(notes.base_amount)
    : payment.amount
      ? Math.round(payment.amount / 1.18)
      : 0;
  const discountPaise = notes.discount_paise ? Number(notes.discount_paise) : 0;

  void createInvoiceForPayment({
    userId,
    subscriptionId: updatedSub?.id ?? existingSubscription?.id ?? null,
    paymentId: payment.id,
    description: `${(notes.plan_slug || "Subscription").toString().toUpperCase()} Plan (${billingCycle})`,
    baseAmountRupees: basePaise / 100,
    discountRupees: discountPaise / 100,
    customerEmail: payment.email,
    customerName: notes.customer_name,
    billingPeriodStart: periodStart,
    billingPeriodEnd: periodEnd,
  });

  return NextResponse.json({ received: true });
}
