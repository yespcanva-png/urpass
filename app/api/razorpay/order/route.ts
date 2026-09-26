import { NextRequest, NextResponse } from "next/server";
import {
  getRazorpayClient,
  getRazorpayCredentials,
  formatRazorpayErrorMessage,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { notifyOwnerPaymentAttempt } from "@/lib/email";

export const dynamic = "force-dynamic";

// V1 plan prices in paise — source of truth for what Razorpay charges.
// Must stay in sync with PLANS in app/billing/page.tsx and PLAN_PRICES in CheckoutButton.tsx.
const V1_PRICES_PAISE: Record<string, number> = {
  starter:  49900,
  pro:      99900,
  business: 249900,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { planSlug, billingCycle = "monthly", couponCode } = body ?? {};
  if (!planSlug) return NextResponse.json({ error: "Missing planSlug" }, { status: 400 });

  const rawSlug = String(planSlug).toLowerCase().trim();
  const normalizedSlug = rawSlug.replace("_monthly", "").replace("_yearly", "").replace("_annual", "");

  const priceMonthlyPaise = V1_PRICES_PAISE[normalizedSlug];
  if (!priceMonthlyPaise) {
    return NextResponse.json({ error: `Plan '${planSlug}' not found or is free` }, { status: 400 });
  }

  // Fetch plan from DB with fallback to admin client
  let { data: plan } = await supabase
    .from("plans")
    .select("id, name, slug")
    .eq("slug", normalizedSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (!plan && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient: createAdminClient } = await import("@supabase/supabase-js");
    const { getSupabaseUrl } = await import("@/lib/supabase/config");
    const admin = createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: adminPlan } = await admin
      .from("plans")
      .select("id, name, slug")
      .eq("slug", normalizedSlug)
      .eq("is_active", true)
      .maybeSingle();
    plan = adminPlan;
  }

  if (!plan) {
    return NextResponse.json({ error: `Plan '${normalizedSlug}' not found in database` }, { status: 400 });
  }

  // Annual = 10 months (2 months free). Prices in paise.
  const baseAmount: number =
    billingCycle === "annual" ? priceMonthlyPaise * 10 : priceMonthlyPaise;

  // Re-validate coupon server-side to compute the trusted charged amount
  let discountPaise = 0;
  let appliedCouponId: string | null = null;

  if (couponCode && typeof couponCode === "string") {
    const code = couponCode.trim().toUpperCase();
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    if (coupon) {
      const notExpired = !coupon.expiry_date || new Date(coupon.expiry_date) >= new Date();
      const planApplies = !coupon.applicable_plans || coupon.applicable_plans.includes(normalizedSlug);
      const cycleApplies = !coupon.billing_cycle || coupon.billing_cycle === billingCycle;

      const { count: userCount } = await supabase
        .from("coupon_redemptions")
        .select("*", { count: "exact", head: true })
        .eq("coupon_id", coupon.id)
        .eq("user_id", user.id);

      const withinLimit = (userCount ?? 0) < coupon.per_customer_limit;

      if (notExpired && planApplies && cycleApplies && withinLimit) {
        appliedCouponId = coupon.id;

        if (coupon.discount_type === "percentage") {
          discountPaise = Math.round((baseAmount * coupon.discount_value) / 100);
          if (coupon.max_discount_amount) {
            discountPaise = Math.min(discountPaise, Math.round(coupon.max_discount_amount * 100));
          }
        } else if (coupon.discount_type === "fixed") {
          discountPaise = Math.min(Math.round(coupon.discount_value * 100), baseAmount);
        } else if (coupon.discount_type === "free_months") {
          discountPaise = Math.min(priceMonthlyPaise * coupon.discount_value, baseAmount);
        }
      }
    }
  }

  const discountedBase = Math.max(0, baseAmount - discountPaise);
  const gstAmount = Math.round(discountedBase * 0.18);
  const totalAmount = Math.round(discountedBase + gstAmount);

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

  let order;
  try {
    const razorpay = getRazorpayClient();
    const receipt = `ur_${user.id.slice(0, 8)}_${Date.now()}`.slice(0, 40);
    order = await razorpay.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt,
      notes: {
        user_id: String(user.id),
        plan_id: String(plan.id),
        plan_slug: String(normalizedSlug),
        billing_cycle: String(billingCycle),
        base_amount: String(baseAmount),
        discount_paise: String(discountPaise),
        gst_amount: String(gstAmount),
        coupon_id: String(appliedCouponId ?? ""),
        coupon_code: String(couponCode ?? ""),
        customer_name: String(user.user_metadata?.full_name ?? ""),
        customer_email: String(user.email ?? ""),
      },
    });
  } catch (err: unknown) {
    console.error("[api/razorpay/order] Razorpay error creating order:", err);
    const msg = formatRazorpayErrorMessage(err, "Failed to create payment order");
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  notifyOwnerPaymentAttempt({
    kind: "subscription",
    buyerName: user.user_metadata?.full_name,
    buyerEmail: user.email,
    itemName: `${plan.name} Plan (${billingCycle})`,
    amountPaise: totalAmount,
    orderId: order.id,
  }).catch((err: unknown) => console.error("[email]", err));

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
    planName: plan.name,
    billingCycle,
  });
}
