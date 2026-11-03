import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  formatRazorpayErrorMessage,
  getRazorpayClient,
  verifyRazorpaySignature,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { createInvoiceForPayment } from "@/lib/invoices";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const orderId = String(body?.orderId || "");
  const paymentId = String(body?.paymentId || "");
  const signature = String(body?.signature || "");
  const customerId = String(body?.customerId || "");

  if (!orderId || !paymentId || !signature || !customerId) {
    return NextResponse.json({ error: "AutoPay verification details are missing." }, { status: 400 });
  }

  if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
    return NextResponse.json({ error: "AutoPay verification failed: invalid signature." }, { status: 400 });
  }

  const admin = adminClient();

  try {
    const razorpay = getRazorpayClient();
    const [order, payment] = await Promise.all([
      razorpay.orders.fetch(orderId),
      (razorpay.payments as any).fetch(paymentId),
    ]);

    const notes = (order?.notes ?? {}) as Record<string, string>;
    if (notes.kind !== "urpass_autopay_mandate") {
      return NextResponse.json({ error: "This Razorpay order is not an UrPass AutoPay mandate." }, { status: 400 });
    }
    if (notes.user_id && notes.user_id !== user.id) {
      return NextResponse.json({ error: "AutoPay mandate does not belong to this account." }, { status: 403 });
    }

    const paymentCustomerId = String(payment?.customer_id || "");
    if (paymentCustomerId && paymentCustomerId !== customerId) {
      return NextResponse.json({ error: "AutoPay customer verification failed." }, { status: 400 });
    }

    const isFreeTrial = notes.is_free_event_trial === "true";
    const planSlug = String(notes.plan_slug || "").toLowerCase();
    const { getRazorpayAutopayDisclosure, AUTOPAY_AUTH_AMOUNT_PAISE, isRazorpayAutopayPlan } =
      await import("@/lib/billing/razorpay-autopay");
    if (!isRazorpayAutopayPlan(planSlug) || notes.user_id !== user.id) {
      return NextResponse.json({ error: "Mandate payment does not match this account and plan." }, { status: 403 });
    }
    if (notes.billing_cycle && notes.billing_cycle !== "monthly") {
      return NextResponse.json({ error: "Mandate payment is not monthly." }, { status: 400 });
    }
    if (order?.currency && String(order.currency).toUpperCase() !== "INR") {
      return NextResponse.json({ error: "Invalid currency." }, { status: 400 });
    }
    if (payment?.currency && String(payment.currency).toUpperCase() !== "INR") {
      return NextResponse.json({ error: "Invalid currency." }, { status: 400 });
    }
    if (payment?.order_id && payment.order_id !== orderId) {
      return NextResponse.json({ error: "Payment order mismatch." }, { status: 400 });
    }
    const orderCustomerId = (order as { customer_id?: string } | null)?.customer_id;
    if (orderCustomerId && String(orderCustomerId) !== customerId) {
      return NextResponse.json({ error: "Customer mismatch." }, { status: 400 });
    }

    const expectedAmount = isFreeTrial ? AUTOPAY_AUTH_AMOUNT_PAISE : getRazorpayAutopayDisclosure(planSlug).maxAmountPaise;
    const paymentStatus = String(payment?.status || "").toLowerCase();
    if (paymentStatus === "authorized") {
      try {
        await (razorpay.payments as any).capture(paymentId, payment.amount || expectedAmount, "INR");
      } catch {
        // Auto-capture can race the callback; the following fetch is authoritative.
      }
    }
    const confirmedPayment = await (razorpay.payments as any).fetch(paymentId);
    const confirmedStatus = String(confirmedPayment?.status || paymentStatus).toLowerCase();
    if (confirmedStatus !== "captured" && confirmedStatus !== "authorized") {
      return NextResponse.json({ error: "Payment capture is pending; access will activate after confirmation." }, { status: 202 });
    }

    const tokenId = String(confirmedPayment?.token_id || confirmedPayment?.token?.id || payment?.token_id || payment?.token?.id || "");
    if (!tokenId) {
      await admin
        .from("subscriptions")
        .update({
          provider_customer_id: customerId,
          autopay_status: "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      return NextResponse.json(
        {
          error:
            "Razorpay accepted the authorization payment, but the recurring token is not available yet. Please try again after Razorpay confirms the mandate.",
        },
        { status: 409 }
      );
    }

    const maxAmountPaise = getRazorpayAutopayDisclosure(planSlug).maxAmountPaise;
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    try {
      const { data: priorPayment } = await admin.from("token_mandate_payments")
        .select("user_id, provider_order_id, is_trial")
        .eq("provider_payment_id", paymentId).maybeSingle();
      if (priorPayment) {
        if (priorPayment.user_id !== user.id || priorPayment.provider_order_id !== orderId ||
            priorPayment.is_trial !== isFreeTrial) {
          return NextResponse.json({ error: "Payment belongs to another checkout." }, { status: 403 });
        }
        return NextResponse.json({ success: true, idempotent: true, tokenId, customerId,
          maxAmountPaise, isTrial: isFreeTrial, redirect: isFreeTrial ? "/create-event" : "/dashboard" });
      }
    } catch {
      // Table may not exist or mock client doesn't support token_mandate_payments
    }

    let targetPlan: { id: string; name: string; slug: string } | null = null;
    if (isFreeTrial) {
      // Anti-abuse: verify user_trial_events
      const { data: existingTrial } = await admin
        .from("user_trial_events")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingTrial) {
        return NextResponse.json(
          {
            error:
              "You have already used your 1 free event trial. Deleting or recreating events is strictly not permitted under the trial. Please upgrade to a paid subscription.",
          },
          { status: 400 }
        );
      }

      const { data: planData } = await admin
        .from("plans")
        .select("id, name, slug")
        .eq("slug", planSlug)
        .maybeSingle();
      targetPlan = planData;
    } else {
      const { data: planData } = await admin
        .from("plans")
        .select("id, name, slug")
        .eq("slug", planSlug)
        .maybeSingle();

      if (!planData) {
        return NextResponse.json({ error: `Plan '${planSlug}' not found in database.` }, { status: 400 });
      }
      targetPlan = planData;
    }

    if (!targetPlan?.id) return NextResponse.json({ error: "Plan is unavailable." }, { status: 503 });

    let updatedSub: { id: string } | null = null;
    let isReplayed = false;

    if (typeof (admin as any).rpc === "function") {
      try {
        const { data: activation, error: rpcError } = await admin.rpc("activate_token_mandate_payment", {
          p_user_id: user.id,
          p_payment_id: paymentId,
          p_order_id: orderId,
          p_customer_id: customerId,
          p_token_id: tokenId,
          p_plan_id: targetPlan.id,
          p_amount_paise: expectedAmount,
          p_is_trial: isFreeTrial,
          p_period_start: now.toISOString(),
          p_period_end: periodEnd.toISOString(),
        });
        if (!rpcError && activation?.[0]) {
          updatedSub = { id: activation[0].subscription_id };
          isReplayed = Boolean(activation[0].replayed);
        }
      } catch {
        // Fall back to direct table upsert below
      }
    }

    if (!updatedSub) {
      const updatePayload: Record<string, unknown> = {
        provider_customer_id: customerId,
        autopay_mandate_id: tokenId,
        autopay_status: "active",
        autopay_max_amount_paise: Number.isFinite(maxAmountPaise) ? maxAmountPaise : null,
        autopay_currency: "INR",
        autopay_confirmed_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      if (isFreeTrial) {
        updatePayload.status = "trialing";
        updatePayload.provider = "razorpay";
        updatePayload.billing_cycle = "monthly";
        if (targetPlan?.id) updatePayload.plan_id = targetPlan.id;
        updatePayload.free_event_trial_active = true;
        updatePayload.free_event_trial_consumed = false;
        updatePayload.trial_events_quota = 1;
        updatePayload.trial_events_created = 0;
        updatePayload.is_trial = true;
        updatePayload.trial_plan = notes.plan_slug || "pro";
        updatePayload.trial_starts_at = now.toISOString();
        updatePayload.trial_ends_at = periodEnd.toISOString();
      } else {
        updatePayload.status = "active";
        updatePayload.provider = "razorpay";
        updatePayload.billing_cycle = "monthly";
        if (targetPlan?.id) updatePayload.plan_id = targetPlan.id;
        updatePayload.current_period_start = now.toISOString();
        updatePayload.current_period_end = periodEnd.toISOString();
        updatePayload.next_billing_date = periodEnd.toISOString();
        updatePayload.cancel_at_period_end = false;
        updatePayload.cancellation_state = "none";
        updatePayload.cancellation_error = null;
        updatePayload.registrations_used = 0;
        updatePayload.is_trial = false;
        updatePayload.free_event_trial_active = false;
        updatePayload.free_event_trial_consumed = false;
      }

      const { data: upsertedSub, error: upsertError } = await admin
        .from("subscriptions")
        .upsert(
          {
            user_id: user.id,
            ...updatePayload,
          },
          { onConflict: "user_id" }
        )
        .select("id")
        .single();

      if (upsertError) {
        return NextResponse.json({ error: upsertError.message }, { status: 500 });
      }
      updatedSub = upsertedSub;
    }

    if (isReplayed) {
      return NextResponse.json({ success: true, idempotent: true, tokenId, customerId,
        maxAmountPaise, isTrial: isFreeTrial, redirect: isFreeTrial ? "/create-event" : "/dashboard" });
    }

    if (!isFreeTrial && targetPlan) {
      try {
        const baseAmountRupees = notes.base_amount
          ? Number(notes.base_amount) / 100
          : payment?.amount
          ? Math.round(Number(payment.amount) / 1.18) / 100
          : targetPlan.slug === "starter"
          ? 1499
          : targetPlan.slug === "pro"
          ? 3499
          : 7999;

        await createInvoiceForPayment({
          userId: user.id,
          subscriptionId: updatedSub?.id ?? null,
          paymentId,
          description: `${targetPlan.name} Plan — Monthly AutoPay Subscription`,
          baseAmountRupees,
          discountRupees: 0,
          currency: "INR",
          docType: "SUB",
          customerEmail: user.email,
          customerName: notes.company_name || user.user_metadata?.full_name,
          customerAddress: notes.billing_address || null,
          customerGstin: notes.customer_gstin || null,
          customerState: notes.billing_state || null,
          customerStateCode: notes.billing_state_code || null,
          billingPeriodStart: now,
          billingPeriodEnd: periodEnd,
        });
      } catch (invErr) {
        console.error("[api/billing/autopay/mandate/verify] Error generating invoice:", invErr);
      }
    }

    return NextResponse.json({
      success: true,
      tokenId,
      customerId,
      maxAmountPaise,
      isTrial: isFreeTrial,
      redirect: isFreeTrial ? "/create-event" : "/dashboard",
    });
  } catch (err) {
    console.error("[api/billing/autopay/mandate/verify] Razorpay error:", err);
    const msg = formatRazorpayErrorMessage(err, "Failed to verify AutoPay mandate");
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

