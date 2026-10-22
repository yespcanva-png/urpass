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
import {
  getIntroOfferDisclosure,
  getIntroOfferId,
  getMonthlyRazorpayPlanId,
  isIntroOfferPlan,
} from "@/lib/billing/razorpay-subscription-offers";

export const dynamic = "force-dynamic";

interface BillingDetailsInput {
  companyName?: string | null;
  billingAddress?: string | null;
  gstin?: string | null;
  state?: string | null;
  stateCode?: string | null;
}

type ExistingSubscription = {
  status?: string | null;
  provider?: string | null;
  current_period_end?: string | null;
  has_lifetime_access?: boolean | null;
  lifetime_plan_slug?: string | null;
  is_trial?: boolean | null;
  trial_used?: boolean | null;
  trial_ends_at?: string | null;
  plan?: { slug?: string | null } | Array<{ slug?: string | null }> | null;
};

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function planSlugFromSub(sub: ExistingSubscription | null | undefined) {
  const plan = Array.isArray(sub?.plan) ? sub?.plan[0] : sub?.plan;
  return (plan?.slug || "free").toLowerCase();
}

function isFuture(value: string | null | undefined) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
}

function blocksNewSubscription(sub: ExistingSubscription | null | undefined) {
  if (!sub) return false;
  const planSlug = planSlugFromSub(sub);
  const status = String(sub.status || "").toLowerCase();
  const provider = String(sub.provider || "").toLowerCase();
  const hasLifetime = Boolean(
    sub.has_lifetime_access ||
    sub.lifetime_plan_slug === "founder" ||
    planSlug === "founder" ||
    planSlug === "lifetime"
  );

  if (hasLifetime) return true;
  if (sub.is_trial || status === "trialing" || isFuture(sub.trial_ends_at)) return false;
  if (planSlug === "free" || provider === "free" || provider === "none") return false;

  return status === "active" && isFuture(sub.current_period_end);
}

function cleanRazorpayNotes(raw: Record<string, string | null | undefined>): Record<string, string> {
  const result: Record<string, string> = {};
  let count = 0;
  for (const [key, val] of Object.entries(raw)) {
    if (val !== null && val !== undefined && val !== "") {
      result[key] = String(val).slice(0, 255);
      count++;
      if (count >= 15) break; // Razorpay strictly allows maximum 15 key-value pairs
    }
  }
  return result;
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
    .select("status, provider, current_period_end, has_lifetime_access, lifetime_plan_slug, is_trial, trial_used, trial_ends_at, plan:plans(slug)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (blocksNewSubscription(existingSub as ExistingSubscription | null)) {
    return NextResponse.json(
      { error: "This account already has an active paid subscription." },
      { status: 409 }
    );
  }

  if (existingSub?.is_trial || existingSub?.trial_used || isFuture(existingSub?.trial_ends_at)) {
    return NextResponse.json(
      { error: "This account has already used a trial or legacy promotional entitlement and is not eligible for the introductory subscription offer." },
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

  const configuredOfferId = getIntroOfferId(planSlug);
  const isValidOffer = Boolean(configuredOfferId && configuredOfferId.startsWith("offer_"));
  const introDisclosure = isValidOffer ? getIntroOfferDisclosure(planSlug) : null;

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
    // Default to 36 billing cycles (3 years) instead of 120 (10 years)
    const totalCount = Number(process.env.RAZORPAY_SUBSCRIPTION_TOTAL_COUNT || 36);
    const regularAmountPaise = planSlug === "starter" ? 49900 : planSlug === "pro" ? 99900 : 249900;
    const baseRupees = regularAmountPaise / 100;
    const monthlyWithGst = Math.round(baseRupees * 1.18 * 100) / 100;

    const subscriptionPayload: Record<string, unknown> = {
      plan_id: razorpayPlanId,
      total_count: Number.isFinite(totalCount) && totalCount > 0 ? totalCount : 36,
      quantity: 1,
      customer_notify: 1,
      notes: cleanRazorpayNotes({
        user_id: String(user.id),
        plan_id: String(plan.id),
        plan_slug: String(planSlug),
        billing_cycle: "monthly",
        regular_plan_id: String(razorpayPlanId),
        billing_address: billingAddress,
        billing_state: billingState,
        billing_state_code: billingStateCode,
        customer_gstin: gstin,
        company_name: companyName,
      }),
    };

    if (isValidOffer && configuredOfferId) {
      subscriptionPayload.offer_id = configuredOfferId;
    }

    const subscription = await (razorpay.subscriptions as any).create(subscriptionPayload);
    if (isValidOffer && configuredOfferId && subscription?.offer_id !== configuredOfferId) {
      if (subscription?.id) {
        await (razorpay.subscriptions as any).cancel(subscription.id, { cancel_at_cycle_end: 0 }).catch(() => null);
      }
      return NextResponse.json(
        {
          error:
            "Razorpay did not attach the introductory offer to this subscription. Checkout was stopped to avoid an incorrect mandate.",
        },
        { status: 502 }
      );
    }

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
      hasIntroOffer: isValidOffer,
      offerId: configuredOfferId || null,
      mandatePreviewVerified: true,
      expectedIntroAmountPaise: introDisclosure ? introDisclosure.introAmountPaise : regularAmountPaise,
      expectedDiscountPaise: introDisclosure ? introDisclosure.discountPaise : 0,
      regularAmountPaise: introDisclosure ? introDisclosure.regularAmountPaise : regularAmountPaise,
      todayAmountWithGst: introDisclosure ? introDisclosure.todayAmountWithGst : monthlyWithGst,
      month2AmountWithGst: introDisclosure ? introDisclosure.month2AmountWithGst : monthlyWithGst,
      month3OnwardAmountWithGst: introDisclosure ? introDisclosure.month3OnwardAmountWithGst : monthlyWithGst,
      taxRatePercent: 18,
    });
  } catch (err: unknown) {
    console.error("[api/billing/subscriptions] Razorpay subscription error:", err);
    const msg = formatRazorpayErrorMessage(err, "Failed to create Razorpay subscription");
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
