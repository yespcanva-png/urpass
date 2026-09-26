import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { verifyRazorpaySubscriptionSignature } from "@/lib/razorpay";
import { getBillingPlan, resolveBillingPlanKey } from "@/lib/billing-plans";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { sendTrialStartedEmail, notifyOwnerTrialActivated } from "@/lib/email";
import { revalidatePath } from "next/cache";

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
    const { plan: rawPlanKey, planSlug, cycle, subscriptionId, paymentId, signature } = body ?? {};

    if (!subscriptionId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Payment verification details are missing." },
        { status: 400 }
      );
    }

    // Verify HMAC subscription signature
    const isValid = verifyRazorpaySubscriptionSignature(
      subscriptionId,
      paymentId,
      signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "AutoPay verification failed: invalid signature." },
        { status: 400 }
      );
    }

    const planKey = rawPlanKey || resolveBillingPlanKey(planSlug || "pro", cycle || "monthly");
    const plan = getBillingPlan(planKey);

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan specified." }, { status: 400 });
    }

    const admin = adminClient();

    // Check trial abuse
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

    // Find plan row in DB
    const { data: targetPlan } = await admin
      .from("plans")
      .select("id, name, slug")
      .eq("slug", plan.planSlug)
      .eq("is_active", true)
      .maybeSingle();

    const planId = targetPlan?.id || null;
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Update subscription to TRIALING
    const { error: upsertError } = await admin.from("subscriptions").upsert(
      {
        user_id: user.id,
        plan_id: planId,
        status: "trialing",
        provider: "razorpay",
        billing_cycle: plan.interval.toLowerCase(),
        provider_subscription_id: subscriptionId,
        current_period_start: now.toISOString(),
        current_period_end: trialEndsAt.toISOString(),
        cancel_at_period_end: false,
        registrations_used: 0,
        trial_used: true,
        is_trial: true,
        trial_plan: plan.planSlug,
        trial_starts_at: now.toISOString(),
        trial_ends_at: trialEndsAt.toISOString(),
        autopay_mandate_id: subscriptionId,
        autopay_status: "active",
        reminded_7_days: false,
        reminded_3_days: false,
        reminded_1_day: false,
        updated_at: now.toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (upsertError) {
      console.error("[billing-verify] DB update failed:", upsertError);
      return NextResponse.json(
        { error: "Failed to activate free trial: " + upsertError.message },
        { status: 500 }
      );
    }

    const formattedEndDate = trialEndsAt.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (user.email) {
      void sendTrialStartedEmail({
        to: user.email,
        userName: user.user_metadata?.full_name,
        planName: plan.displayName,
        monthlyPricePaise: plan.pricePaise,
        trialEndsAt: formattedEndDate,
      }).catch((err) => console.error("[email] Error sending trial start email:", err));
    }

    void notifyOwnerTrialActivated({
      buyerName: user.user_metadata?.full_name,
      buyerEmail: user.email,
      planName: plan.displayName,
      billingInterval: plan.interval,
      futurePricePaise: plan.pricePaise,
      subscriptionId,
      paymentId,
      trialEndsAt: formattedEndDate,
    }).catch((err) => console.error("[email] Error notifying owner of trial:", err));

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return NextResponse.json({
      success: true,
      plan: plan.tier,
      planSlug: plan.planSlug,
      interval: plan.interval,
      trialEndsAt: trialEndsAt.toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
