import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  getRazorpayClient,
  getRazorpayCredentials,
  formatRazorpayErrorMessage,
} from "@/lib/razorpay";
import { getBillingPlan, resolveBillingPlanKey } from "@/lib/billing-plans";
import { getSupabaseUrl } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Accept either { plan: "PRO_MONTHLY" } or { planSlug: "pro", cycle: "monthly" }
    const rawPlan = body.plan || resolveBillingPlanKey(body.planSlug || "pro", body.cycle || "monthly");
    const plan = getBillingPlan(rawPlan);

    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan selected. Must be Starter, Pro, or Business." },
        { status: 400 }
      );
    }

    const admin = adminClient();

    // 1. Trial abuse protection check: one trial per account/workspace permanently
    const { data: existingSub } = await admin
      .from("subscriptions")
      .select("id, trial_used, status, is_trial, provider")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingSub?.trial_used) {
      return NextResponse.json(
        {
          error:
            "Your account has already used its one free 30-day trial. Changing plans does not grant a new trial.",
        },
        { status: 400 }
      );
    }

    if (existingSub && existingSub.status === "trialing") {
      return NextResponse.json(
        { error: "You already have an active 30-day free trial in progress." },
        { status: 400 }
      );
    }

    if (
      existingSub &&
      existingSub.status === "active" &&
      existingSub.provider === "razorpay" &&
      !existingSub.is_trial
    ) {
      return NextResponse.json(
        {
          error:
            "You already have an active paid subscription. Please manage your plan from the billing dashboard.",
        },
        { status: 400 }
      );
    }

    // 2. Look up the plan row in DB
    const { data: planRow } = await admin
      .from("plans")
      .select("id, name, slug")
      .eq("slug", plan.planSlug)
      .eq("is_active", true)
      .maybeSingle();

    const planId = planRow?.id || null;

    let keyId: string;
    try {
      const creds = getRazorpayCredentials();
      keyId = creds.keyId;
    } catch {
      return NextResponse.json(
        {
          error:
            "Payment gateway credentials are not configured on the server. Please ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in your environment variables (e.g. Vercel Project Settings).",
        },
        { status: 503 }
      );
    }

    // 3. Create Razorpay subscription with start_at = Today + 30 days
    const razorpay = getRazorpayClient();
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const startAtSec = Math.floor(trialEndsAt.getTime() / 1000);
    const totalCount = plan.interval === "MONTHLY" ? 12 : 5;

    let rzpSubscription;
    try {
      rzpSubscription = await razorpay.subscriptions.create({
        plan_id: plan.razorpayPlanId,
        total_count: totalCount,
        start_at: startAtSec,
        customer_notify: 1,
        notes: {
          user_id: user.id,
          workspace_id: body.workspaceId || "",
          plan_key: rawPlan,
          tier: plan.tier,
          interval: plan.interval,
          customer_email: user.email ?? "",
          customer_name: user.user_metadata?.full_name ?? "",
        },
      });
    } catch (rzpErr: unknown) {
      const msg = formatRazorpayErrorMessage(rzpErr, "Failed to create Razorpay subscription");
      console.error("[billing-subscriptions] Razorpay subscription create error:", rzpErr);
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    // 4. Save state as MANDATE_PENDING (AutoPay not yet authorized)
    const { error: dbError } = await admin.from("subscriptions").upsert(
      {
        user_id: user.id,
        plan_id: planId,
        status: "MANDATE_PENDING",
        provider: "razorpay",
        billing_cycle: plan.interval.toLowerCase(),
        provider_subscription_id: rzpSubscription.id,
        current_period_start: now.toISOString(),
        current_period_end: trialEndsAt.toISOString(),
        cancel_at_period_end: false,
        registrations_used: 0,
        trial_used: false,
        is_trial: true,
        trial_plan: plan.planSlug,
        trial_starts_at: now.toISOString(),
        trial_ends_at: trialEndsAt.toISOString(),
        autopay_mandate_id: rzpSubscription.id,
        autopay_status: "pending",
        updated_at: now.toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (dbError) {
      console.warn("[billing-subscriptions] DB save warning:", dbError.message);
    }

    return NextResponse.json({
      subscriptionId: rzpSubscription.id,
      keyId,
      plan: rawPlan,
      tier: plan.tier,
      interval: plan.interval,
      price: plan.price,
      trialEndsAt: trialEndsAt.toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
