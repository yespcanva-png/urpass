import { NextRequest, NextResponse } from "next/server";
import {
  getRazorpayClient,
  getRazorpayCredentials,
  formatRazorpayErrorMessage,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
  const { planSlug } = body ?? {};

  if (!planSlug || !["starter", "pro", "business"].includes(planSlug)) {
    return NextResponse.json(
      { error: "Free trial is only available for Starter, Pro, or Business plans." },
      { status: 400 }
    );
  }

  // Check if account has already redeemed its one free trial
  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("id, trial_used, is_trial, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingSub?.trial_used) {
    return NextResponse.json(
      { error: "Your account has already used its one free 30-day trial." },
      { status: 400 }
    );
  }

  // Look up plan in DB
  const { data: plan } = await supabase
    .from("plans")
    .select("id, name, slug")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .single();

  if (!plan) {
    return NextResponse.json({ error: "Target plan not found" }, { status: 404 });
  }

  const pricePaise = TRIAL_PLAN_PRICES_PAISE[planSlug];

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

  const razorpay = getRazorpayClient();
  const nowSec = Math.floor(Date.now() / 1000);
  const startAtSec = nowSec + 30 * 24 * 60 * 60; // Starts in exactly 30 days

  let subscriptionId: string | null = null;
  let orderId: string | null = null;
  let amount = 0; // ₹0 charged today

  // Attempt 1: Try creating Razorpay recurring subscription with start_at = 30 days
  // If razorpay account has a plan_id configured or supports on-the-fly subscriptions
  try {
    // Check if an env variable for plan ID exists (e.g. RAZORPAY_PLAN_PRO)
    const envPlanId = process.env[`RAZORPAY_PLAN_${planSlug.toUpperCase()}`];
    if (envPlanId) {
      const sub = await razorpay.subscriptions.create({
        plan_id: envPlanId,
        total_count: 60,
        quantity: 1,
        start_at: startAtSec,
        customer_notify: 1,
        notes: {
          user_id: user.id,
          plan_id: plan.id,
          plan_slug: planSlug,
          is_trial: "true",
          customer_name: user.user_metadata?.full_name ?? "",
          customer_email: user.email ?? "",
        },
      });
      subscriptionId = sub.id;
    }
  } catch (subErr) {
    console.warn("[trial-subscription] Subscription create skipped, falling back to mandate order:", subErr);
  }

  // Attempt 2: Fallback to mandate verification order (₹0 or token auth)
  if (!subscriptionId) {
    try {
      // Create Razorpay order with notes specifying trial and AutoPay setup
      const order = await razorpay.orders.create({
        amount: 0, // ₹0 today
        currency: "INR",
        receipt: `trial_${user.id.slice(0, 8)}_${Date.now()}`,
        notes: {
          user_id: user.id,
          plan_id: plan.id,
          plan_slug: planSlug,
          is_trial: "true",
          trial_days: "30",
          recurring_amount_paise: pricePaise.toString(),
          customer_name: user.user_metadata?.full_name ?? "",
          customer_email: user.email ?? "",
        },
      });
      orderId = order.id;
      amount = Number(order.amount ?? 0);
    } catch (orderErr) {
      // If gateway rejects 0-amount orders without active zero-auth permission,
      // create nominal ₹2 token auth order (standard for Indian mandate setups):
      console.warn("[trial-subscription] 0-amount order failed, creating nominal ₹2 mandate auth order:", orderErr);
      try {
        const order = await razorpay.orders.create({
          amount: 200, // ₹2 token verification
          currency: "INR",
          receipt: `trial_auth_${user.id.slice(0, 8)}_${Date.now()}`,
          notes: {
            user_id: user.id,
            plan_id: plan.id,
            plan_slug: planSlug,
            is_trial: "true",
            trial_days: "30",
            recurring_amount_paise: pricePaise.toString(),
            customer_name: user.user_metadata?.full_name ?? "",
            customer_email: user.email ?? "",
          },
        });
        orderId = order.id;
        amount = Number(order.amount ?? 200);
      } catch (authErr) {
        const msg = authErr instanceof Error ? authErr.message : "Failed to initialize AutoPay setup.";
        return NextResponse.json({ error: msg }, { status: 502 });
      }
    }
  }

  return NextResponse.json({
    keyId,
    subscriptionId,
    orderId,
    amount,
    currency: "INR",
    planName: plan.name,
    planSlug,
    trialDays: 30,
    monthlyPricePaise: pricePaise,
  });
}
