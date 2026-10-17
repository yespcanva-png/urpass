import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  formatRazorpayErrorMessage,
  getRazorpayClient,
  getRazorpayCredentials,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  AUTOPAY_AUTH_AMOUNT_PAISE,
  AUTOPAY_INTRO_CHARGE_PAISE,
  getRazorpayAutopayDisclosure,
  isRazorpayAutopayPlan,
} from "@/lib/billing/razorpay-autopay";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function cleanNotes(raw: Record<string, string | number | null | undefined>): Record<string, string> {
  const result: Record<string, string> = {};
  let count = 0;
  for (const [key, value] of Object.entries(raw)) {
    if (value !== null && value !== undefined && value !== "") {
      result[key] = String(value).slice(0, 255);
      count += 1;
      if (count >= 15) break;
    }
  }
  return result;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const isFreeTrial = Boolean(body?.isFreeTrial || body?.trial);
  const rawSlug = String(body?.planSlug || (isFreeTrial ? "pro" : "")).toLowerCase().trim();
  const planSlug = (rawSlug || (isFreeTrial ? "pro" : ""))
    .replace("_monthly", "")
    .replace("_yearly", "")
    .replace("_annual", "")
    .replace("_lifetime", "");
  const billingCycle = String(body?.billingCycle || "monthly").toLowerCase();

  if (!isRazorpayAutopayPlan(planSlug)) {
    return NextResponse.json({ error: "AutoPay setup is available for Starter, Pro, and Business monthly plans." }, { status: 400 });
  }
  if (billingCycle !== "monthly") {
    return NextResponse.json({ error: "AutoPay setup is only available for monthly INR plans." }, { status: 400 });
  }

  let keyId: string;
  try {
    keyId = getRazorpayCredentials().keyId;
  } catch {
    return NextResponse.json({ error: "Razorpay credentials are not configured." }, { status: 503 });
  }

  const admin = adminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("id, status, billing_cycle, current_period_end, autopay_status, provider_customer_id, trial_used, free_event_trial_consumed, plan:plans(slug)")
    .eq("user_id", user.id)
    .maybeSingle();

  const billingDetails = (body?.billingDetails ?? {}) as Record<string, unknown>;

  if (isFreeTrial) {
    // Strict Anti-abuse: verify user has not previously consumed or used their free trial
    const { data: existingTrialEvent } = await admin
      .from("user_trial_events")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingTrialEvent || sub?.free_event_trial_consumed || sub?.trial_used) {
      return NextResponse.json(
        {
          error:
            "You have already used your 1 free event trial. Deleting or recreating events is strictly not permitted under the trial. Please choose a paid subscription plan.",
        },
        { status: 400 }
      );
    }
  } else {
    const plan = Array.isArray(sub?.plan) ? sub?.plan[0] : sub?.plan;
    const currentPlanSlug = String(plan?.slug || "").toLowerCase();
    const periodEnd = sub?.current_period_end ? new Date(sub.current_period_end) : null;
    const hasValidAccess = sub?.status === "active" && periodEnd && periodEnd.getTime() > Date.now();

    if (hasValidAccess && currentPlanSlug === planSlug && sub?.autopay_status === "active") {
      return NextResponse.json(
        { error: "AutoPay is already active for this subscription." },
        { status: 409 }
      );
    }
  }

  const disclosure = getRazorpayAutopayDisclosure(planSlug);
  const companyName = String(billingDetails?.companyName || user.user_metadata?.full_name || user.email || "UrPass customer").slice(0, 80);
  const email = String(user.email || "");

  // Resolve mobile number / contact for Razorpay mandate
  let rawPhone = String(
    body?.phone ||
    billingDetails?.phone ||
    billingDetails?.contact ||
    user.phone ||
    user.user_metadata?.phone ||
    ""
  ).replace(/[^\d]/g, "");

  if (rawPhone.length < 10) {
    const { data: profile } = await admin
      .from("profiles")
      .select("phone")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profile?.phone) {
      rawPhone = String(profile.phone).replace(/[^\d]/g, "");
    }
  }

  if (rawPhone.length < 10) {
    return NextResponse.json(
      { error: "A valid 10-digit mobile number is required to authorize recurring AutoPay mandates." },
      { status: 400 }
    );
  }

  const contact = rawPhone.slice(-10);
  void admin.from("profiles").update({ phone: contact }).eq("user_id", user.id);

  const billingAddress = String(billingDetails?.billingAddress || "").slice(0, 200);
  const customerGstin = String(billingDetails?.gstin || "").slice(0, 20);
  const billingState = String(billingDetails?.state || "").slice(0, 60);
  const billingStateCode = String(billingDetails?.stateCode || "").slice(0, 10);
  const orderAmount = isFreeTrial ? AUTOPAY_AUTH_AMOUNT_PAISE : AUTOPAY_INTRO_CHARGE_PAISE;

  try {
    const razorpay = getRazorpayClient();
    const customerPayload: Record<string, unknown> = {
      name: companyName,
      email,
      contact,
      fail_existing: "0",
      notes: cleanNotes({ user_id: user.id, purpose: "urpass_autopay" }),
    };

    let customer: { id: string };
    if (sub?.provider_customer_id) {
      try {
        await (razorpay.customers as any).edit(sub.provider_customer_id, {
          name: companyName,
          email,
          contact,
        });
        customer = { id: sub.provider_customer_id };
      } catch (editErr) {
        console.warn("[autopay/mandate] Customer edit failed, creating new customer:", editErr);
        customer = await (razorpay.customers as any).create(customerPayload);
      }
    } else {
      customer = await (razorpay.customers as any).create(customerPayload);
    }

    const now = new Date();
    const recurringDay = Math.min(28, Math.max(1, now.getDate()));
    const expireAt = Math.floor(now.getTime() / 1000) + (10 * 365 * 24 * 60 * 60);
    const receipt = `up_auto_${user.id.slice(0, 8)}_${Date.now()}`.slice(0, 40);

    const orderPayload: any = {
      amount: orderAmount,
      currency: "INR",
      customer_id: customer.id,
      receipt,
      token: {
        max_amount: disclosure.maxAmountPaise,
        expire_at: expireAt,
        frequency: "monthly",
        recurring_value: recurringDay,
        recurring_type: "on",
        notes: cleanNotes({
          user_id: user.id,
          plan_slug: planSlug,
          max_amount: disclosure.maxAmountPaise,
          is_free_event_trial: isFreeTrial ? "true" : "false",
        }),
      },
      notes: cleanNotes({
        kind: "urpass_autopay_mandate",
        is_free_event_trial: isFreeTrial ? "true" : "false",
        user_id: user.id,
        plan_slug: planSlug,
        billing_cycle: "monthly",
        regular_base_amount: disclosure.regularBasePaise,
        tax_amount: disclosure.taxPaise,
        max_amount: disclosure.maxAmountPaise,
        intro_charge_paise: orderAmount,
        company_name: companyName,
        billing_address: billingAddress,
        customer_gstin: customerGstin,
        billing_state: billingState,
        billing_state_code: billingStateCode,
      }),
    };

    const order: any = await (razorpay.orders.create as any)(orderPayload);

    if (sub?.id) {
      await admin
        .from("subscriptions")
        .update({
          provider_customer_id: customer.id,
          autopay_status: "pending",
          autopay_max_amount_paise: disclosure.maxAmountPaise,
          autopay_currency: "INR",
          updated_at: new Date().toISOString(),
        })
        .eq("id", sub.id);
    } else {
      await admin.from("subscriptions").upsert(
        {
          user_id: user.id,
          provider_customer_id: customer.id,
          autopay_status: "pending",
          autopay_max_amount_paise: disclosure.maxAmountPaise,
          autopay_currency: "INR",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    return NextResponse.json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      customerId: customer.id,
      maxAmountPaise: disclosure.maxAmountPaise,
      regularBasePaise: disclosure.regularBasePaise,
      taxPaise: disclosure.taxPaise,
      todayAmountWithGst: isFreeTrial ? 1 : disclosure.todayAmountWithGst,
      month2AmountWithGst: isFreeTrial ? 1 : disclosure.month2AmountWithGst,
      month3OnwardAmountWithGst: disclosure.month3OnwardAmountWithGst,
      isTrial: isFreeTrial,
    });
  } catch (err) {
    console.error("[api/billing/autopay/mandate] Razorpay error:", err);
    const msg = formatRazorpayErrorMessage(err, "Failed to create AutoPay mandate");
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

