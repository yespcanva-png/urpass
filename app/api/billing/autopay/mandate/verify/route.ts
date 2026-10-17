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
    const paymentStatus = String(payment?.status || "").toLowerCase();

    if (!isFreeTrial) {
      if (paymentStatus !== "captured" && paymentStatus !== "authorized") {
        return NextResponse.json(
          {
            error: `First payment confirmation failed (payment status: ${paymentStatus}). Your subscription can only be activated after successful payment confirmation of ₹34.22.`,
          },
          { status: 400 }
        );
      }

      if (paymentStatus === "authorized") {
        try {
          await (razorpay.payments as any).capture(paymentId, payment.amount, payment.currency || "INR");
        } catch {
          // Auto-capture in progress or handled by gateway
        }
      }
    }

    const tokenId = String(payment?.token_id || payment?.token?.id || "");
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

    const maxAmountPaise = notes.max_amount ? Number(notes.max_amount) : null;
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

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

      const planSlug = notes.plan_slug || "pro";
      const { data: planData } = await admin
        .from("plans")
        .select("id, name, slug")
        .eq("slug", planSlug)
        .maybeSingle();
      targetPlan = planData;
    } else {
      const planSlug = String(notes.plan_slug || "starter").toLowerCase();
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
      updatePayload.cancel_at_period_end = false;
      updatePayload.registrations_used = 0;
      updatePayload.is_trial = false;
      updatePayload.free_event_trial_active = false;
      updatePayload.free_event_trial_consumed = false;
    }

    const { data: updatedSub, error } = await admin
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!isFreeTrial && targetPlan) {
      try {
        await createInvoiceForPayment({
          userId: user.id,
          subscriptionId: updatedSub?.id ?? null,
          paymentId,
          description: `${targetPlan.name} Plan — Monthly AutoPay Subscription (Introductory Offer Cycle 1)`,
          baseAmountRupees: 29,
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

