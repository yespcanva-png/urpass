import { NextRequest, NextResponse } from "next/server";
import {
  getRazorpayClient,
  getRazorpayCredentials,
  formatRazorpayErrorMessage,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { notifyOwnerPaymentAttempt } from "@/lib/email";

export const dynamic = "force-dynamic";

// V1 plan prices in paise (INR) and pence (GBP) — source of truth for what Razorpay charges.
// Must stay in sync with PLANS in app/billing/page.tsx and PLAN_PRICES in CheckoutButton.tsx.
const V1_PRICES_PAISE: Record<string, number> = {
  starter:          49900,
  pro:              99900,
  business:        249900,
  founder:        1999900,
  lifetime:       1999900,
  founder_lifetime: 1999900,
};

const UK_PRICES_PENCE: Record<string, { monthly: number; annual: number }> = {
  starter:          { monthly: 1500,  annual: 12000 },
  pro:              { monthly: 3500,  annual: 30000 },
  business:         { monthly: 7900,  annual: 69900 },
  founder:          { monthly: 24900, annual: 24900 },
  lifetime:         { monthly: 24900, annual: 24900 },
  founder_lifetime: { monthly: 24900, annual: 24900 },
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { planSlug, billingCycle = "monthly", couponCode, currency: requestedCurrency = "INR" } = body ?? {};
  if (!planSlug) return NextResponse.json({ error: "Missing planSlug" }, { status: 400 });

  const isUk = (requestedCurrency || "").toUpperCase() === "GBP";
  const currencyCode = isUk ? "GBP" : "INR";
  const taxRate = isUk ? 0.20 : 0.18;
  const taxName = isUk ? "VAT" : "GST";

  const rawSlug = String(planSlug).toLowerCase().trim();
  let normalizedSlug = rawSlug
    .replace("_monthly", "")
    .replace("_yearly", "")
    .replace("_annual", "")
    .replace("_lifetime", "");

  if (normalizedSlug === "founder_lifetime" || normalizedSlug === "lifetime") {
    normalizedSlug = "founder";
  }

  const isFounder = normalizedSlug === "founder";
  const effectiveBillingCycle = isFounder ? "lifetime" : billingCycle;

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

    if (!plan && isFounder) {
      const { data: seededFounder } = await admin
        .from("plans")
        .upsert(
          {
            name: "Founder Lifetime",
            slug: "founder",
            price_monthly: 1999900,
            price_yearly: 1999900,
            max_events: 999999,
            max_attendees: 999999,
            features: ["all_access", "lifetime"],
            is_active: true,
          },
          { onConflict: "slug" }
        )
        .select("id, name, slug")
        .single();
      plan = seededFounder;
    }
  }

  if (!plan) {
    return NextResponse.json({ error: `Plan '${normalizedSlug}' not found in database` }, { status: 400 });
  }

  // Founder = ₹19,999 or £249 one-time. Annual = 10 months (2 months free).
  let baseAmount: number;
  if (isUk) {
    const ukPrices = UK_PRICES_PENCE[normalizedSlug] ?? { monthly: 3500, annual: 30000 };
    baseAmount = isFounder
      ? 24900
      : effectiveBillingCycle === "annual"
      ? ukPrices.annual
      : ukPrices.monthly;
  } else {
    baseAmount = isFounder
      ? 1999900
      : effectiveBillingCycle === "annual"
      ? priceMonthlyPaise * 10
      : priceMonthlyPaise;
  }

  // Re-validate coupon server-side to compute the trusted charged amount
  let discountAmount = 0;
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
          discountAmount = Math.round((baseAmount * coupon.discount_value) / 100);
          if (coupon.max_discount_amount) {
            discountAmount = Math.min(discountAmount, Math.round(coupon.max_discount_amount * 100));
          }
        } else if (coupon.discount_type === "fixed") {
          discountAmount = Math.min(Math.round(coupon.discount_value * 100), baseAmount);
        } else if (coupon.discount_type === "free_months") {
          const unitMonthly = isUk ? (UK_PRICES_PENCE[normalizedSlug]?.monthly ?? 3500) : priceMonthlyPaise;
          discountAmount = Math.min(unitMonthly * coupon.discount_value, baseAmount);
        }
      }
    }
  }

  const discountedBase = Math.max(0, baseAmount - discountAmount);
  const taxAmount = Math.round(discountedBase * taxRate);
  const totalAmount = Math.round(discountedBase + taxAmount);

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
      currency: currencyCode,
      receipt,
      notes: {
        user_id: String(user.id),
        plan_id: String(plan.id),
        plan_slug: String(normalizedSlug),
        billing_cycle: String(effectiveBillingCycle),
        currency: currencyCode,
        base_amount: String(baseAmount),
        discount_amount: String(discountAmount),
        tax_amount: String(taxAmount),
        tax_name: taxName,
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

  try {
    await notifyOwnerPaymentAttempt({
      kind: isFounder ? "one_time" : "subscription",
      buyerName: user.user_metadata?.full_name,
      buyerEmail: user.email,
      itemName: isFounder
        ? isUk ? "URPASS Founder Lifetime Access (£249)" : "URPASS Founder Lifetime Access (₹19,999)"
        : `${plan.name} Plan (${effectiveBillingCycle}) [${currencyCode}]`,
      amountPaise: totalAmount,
      orderId: order.id,
      currency: currencyCode,
    });
  } catch (err: unknown) {
    console.error("[api/razorpay/order] notifyOwnerPaymentAttempt error:", err);
  }

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
    planName: plan.name,
    billingCycle: effectiveBillingCycle,
  });
}
