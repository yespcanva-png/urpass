import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  verifyRazorpaySignature,
  verifyRazorpaySubscriptionSignature,
} from "@/lib/razorpay";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { sendTrialStartedEmail, notifyOwnerPaymentSuccess } from "@/lib/email";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const TRIAL_PLAN_PRICES_PAISE: Record<string, number> = {
  starter: 49900,
  pro: 99900,
  business: 249900,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { planSlug, subscriptionId, orderId, paymentId, signature } = body ?? {};

  if (!planSlug || !["starter", "pro", "business"].includes(planSlug)) {
    return NextResponse.json(
      { error: "Invalid trial plan selected." },
      { status: 400 }
    );
  }

  if (!paymentId || !signature) {
    return NextResponse.json(
      { error: "Payment verification details are missing." },
      { status: 400 }
    );
  }

  // Check if trial has already been redeemed permanently
  const admin = adminClient();
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, trial_used")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingSub?.trial_used) {
    return NextResponse.json(
      { error: "Your account has already redeemed its one free 30-day trial." },
      { status: 400 }
    );
  }

  // Verify HMAC signature
  let isValid = false;
  if (subscriptionId) {
    isValid = verifyRazorpaySubscriptionSignature(
      subscriptionId,
      paymentId,
      signature
    );
  } else if (orderId) {
    isValid = verifyRazorpaySignature(orderId, paymentId, signature);
  }

  if (!isValid) {
    return NextResponse.json(
      { error: "AutoPay verification failed: invalid signature." },
      { status: 400 }
    );
  }

  // Find plan row
  const { data: targetPlan } = await admin
    .from("plans")
    .select("id, name, slug")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .single();

  if (!targetPlan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const mandateId = subscriptionId || paymentId;

  // Activate 30-day free trial atomically
  const { error: upsertError } = await admin.from("subscriptions").upsert(
    {
      user_id: user.id,
      plan_id: targetPlan.id,
      status: "trialing",
      provider: "razorpay",
      billing_cycle: "monthly",
      provider_subscription_id: mandateId,
      current_period_start: now.toISOString(),
      current_period_end: trialEndsAt.toISOString(),
      cancel_at_period_end: false,
      registrations_used: 0,
      trial_used: true,
      is_trial: true,
      trial_plan: planSlug,
      trial_starts_at: now.toISOString(),
      trial_ends_at: trialEndsAt.toISOString(),
      autopay_mandate_id: mandateId,
      autopay_status: "active",
      reminded_7_days: false,
      reminded_3_days: false,
      reminded_1_day: false,
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (upsertError) {
    console.error("[verify-trial] DB update failed:", upsertError);
    return NextResponse.json(
      { error: "Failed to activate free trial in database: " + upsertError.message },
      { status: 500 }
    );
  }

  const pricePaise = TRIAL_PLAN_PRICES_PAISE[planSlug] ?? 49900;
  const formattedEndDate = trialEndsAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Send trial started email
  if (user.email) {
    void sendTrialStartedEmail({
      to: user.email,
      userName: user.user_metadata?.full_name,
      planName: targetPlan.name,
      monthlyPricePaise: pricePaise,
      trialEndsAt: formattedEndDate,
    }).catch((err) => console.error("[email] Error sending trial start email:", err));
  }

  // Notify owner
  void notifyOwnerPaymentSuccess({
    kind: "subscription",
    buyerName: user.user_metadata?.full_name,
    buyerEmail: user.email,
    itemName: `30-Day Free Trial: ${targetPlan.name}`,
    amountPaise: 0,
    paymentId,
    orderId: orderId ?? undefined,
  }).catch((err) => console.error("[email] Error notifying owner of trial:", err));

  revalidatePath("/billing");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");

  return NextResponse.json({
    success: true,
    planSlug,
    planName: targetPlan.name,
    trialEndsAt: trialEndsAt.toISOString(),
  });
}
