import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  formatRazorpayErrorMessage,
  getRazorpayClient,
  getRazorpayCredentials,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { validateGstin } from "@/lib/validations/gstin";
import { evaluateOfferEligibility } from "@/lib/billing/engine/pricing-engine";
import {
  getIntroOfferDisclosure,
  getIntroOfferId,
  getMonthlyRazorpayPlanId,
  isIntroOfferPlan,
} from "@/lib/billing/razorpay-subscription-offers";
import type { IntroOfferPlanSlug } from "@/lib/billing/razorpay-subscription-offers";

export const dynamic = "force-dynamic";

interface BillingDetailsInput {
  companyName?: string | null;
  billingAddress?: string | null;
  gstin?: string | null;
  state?: string | null;
  stateCode?: string | null;
}

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function hasValidAccess(sub: {
  status?: string | null;
  current_period_end?: string | null;
  has_lifetime_access?: boolean | null;
  is_trial?: boolean | null;
}) {
  if (sub.has_lifetime_access) return true;
  const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
  const unexpired = periodEnd ? periodEnd.getTime() > Date.now() : false;
  return unexpired && ["active", "trialing"].includes(String(sub.status || ""));
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const planSlug = String(body?.planSlug || "").toLowerCase().trim();
  const billingCycle = String(body?.billingCycle || "monthly").toLowerCase();
  const currency = String(body?.currency || "INR").toUpperCase();
  const billingDetails = (body?.billingDetails ?? null) as BillingDetailsInput | null;

  if (!isIntroOfferPlan(planSlug)) {
    return NextResponse.json({ error: "Razorpay subscriptions are available for Starter, Pro, and Business." }, { status: 400 });
  }
  if (billingCycle !== "monthly" || currency !== "INR") {
    return NextResponse.json({ error: "Recurring Razorpay offer subscriptions are available only for INR monthly plans." }, { status: 400 });
  }

  const billingAddress = billingDetails?.billingAddress?.trim() || "";
  const billingState = billingDetails?.state?.trim() || "";
  const billingStateCode = billingDetails?.stateCode?.trim() || "";
  const companyName = billingDetails?.companyName?.trim() || "";
  const gstin = billingDetails?.gstin?.trim().toUpperCase() || "";

  if (!billingAddress) {
    return NextResponse.json({ error: "Billing address is required before payment." }, { status: 400 });
  }
  if (!billingStateCode) {
    return NextResponse.json({ error: "Billing state is required for GST invoicing." }, { status: 400 });
  }
  if (gstin && !validateGstin(gstin)) {
    return NextResponse.json({ error: "Invalid GSTIN format." }, { status: 400 });
  }

  const admin = adminClient();
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, status, current_period_end, has_lifetime_access, is_trial")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingSub && hasValidAccess(existingSub)) {
    return NextResponse.json(
      { error: "This account already has a valid subscription or legacy entitlement." },
      { status: 409 }
    );
  }

  const { data: plan } = await admin
    .from("plans")
    .select("id, name, slug")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (!plan) {
    return NextResponse.json({ error: `Plan '${planSlug}' not found in database.` }, { status: 400 });
  }

  const razorpayPlanId = getMonthlyRazorpayPlanId(planSlug);
  if (!razorpayPlanId) {
    return NextResponse.json(
      { error: `Razorpay monthly plan ID is not configured for ${planSlug}.` },
      { status: 503 }
    );
  }

  const eligibility = await evaluateOfferEligibility({
    userId: user.id,
    planSlug: planSlug as IntroOfferPlanSlug,
    billingCycle: "monthly",
    currency: "INR",
  });
  const introDisclosure = getIntroOfferDisclosure(planSlug);
  const offerId = eligibility.isEligibleForIntroOffer ? getIntroOfferId(planSlug) : null;

  if (eligibility.isEligibleForIntroOffer && !offerId) {
    return NextResponse.json(
      {
        error:
          `The ${plan.name} introductory Razorpay offer ID is not configured. Add RAZORPAY_${planSlug.toUpperCase()}_INTRO_OFFER_ID before enabling this intro checkout.`,
      },
      { status: 503 }
    );
  }

  let keyId: string;
  try {
    keyId = getRazorpayCredentials().keyId;
  } catch {
    return NextResponse.json(
      { error: "Payment gateway credentials are not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const razorpay = getRazorpayClient();
    const totalCount = Number(process.env.RAZORPAY_SUBSCRIPTION_TOTAL_COUNT || 120);
    const subscriptionPayload = {
      plan_id: razorpayPlanId,
      total_count: Number.isFinite(totalCount) && totalCount > 0 ? totalCount : 120,
      quantity: 1,
      customer_notify: 1,
      ...(offerId ? { offer_id: offerId } : {}),
      notes: {
        user_id: String(user.id),
        plan_id: String(plan.id),
        plan_slug: String(planSlug),
        billing_cycle: "monthly",
        currency: "INR",
        intro_offer_id: String(offerId || ""),
        intro_cycles: offerId ? "2" : "0",
        regular_amount: String(introDisclosure.regularAmountPaise),
        expected_intro_amount: String(offerId ? introDisclosure.introAmountPaise : ""),
        expected_discount: String(offerId ? introDisclosure.discountPaise : ""),
        billing_address: billingAddress,
        billing_state: billingState,
        billing_state_code: billingStateCode,
        customer_gstin: gstin,
        company_name: companyName,
      },
    };

    const subscription = await (razorpay.subscriptions as any).create(subscriptionPayload);

    await admin
      .from("profiles")
      .update({
        company_name: companyName || null,
        billing_address: billingAddress,
        gstin: gstin || null,
      })
      .eq("user_id", user.id);

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId,
      planName: plan.name,
      planSlug,
      billingCycle: "monthly",
      currency: "INR",
      hasIntroOffer: Boolean(offerId),
      offerId,
      expectedIntroAmountPaise: offerId ? introDisclosure.introAmountPaise : null,
      expectedDiscountPaise: offerId ? introDisclosure.discountPaise : null,
      regularAmountPaise: introDisclosure.regularAmountPaise,
      taxRatePercent: introDisclosure.taxRatePercent,
    });
  } catch (err: unknown) {
    console.error("[api/billing/subscriptions] Razorpay subscription error:", err);
    const msg = formatRazorpayErrorMessage(err, "Failed to create Razorpay subscription");
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
