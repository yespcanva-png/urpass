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
import { recordFirstEventConversion } from "@/lib/conversion/first-event";

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

type ProviderSubscription = { id: string; status?: string; offer_id?: string | null; current_end?: number | null };

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

  const { data: catalogPlan, error: catalogError } = await admin.from("billing_plans")
    .select("id").eq("slug", planSlug).eq("is_active", true).maybeSingle();
  if (catalogError || !catalogPlan) return NextResponse.json({ error: "Billing catalog is unavailable." }, { status: 503 });
  const { data: prices, error: priceError } = await admin.from("billing_plan_prices")
    .select("price_paise, tax_inclusive, tax_rate_percent, version")
    .eq("plan_id", catalogPlan.id).eq("currency", "INR")
    .eq("billing_cycle", "monthly").eq("is_active", true)
    .order("version", { ascending: false }).limit(1);
  const currentPrice = prices?.[0];
  if (priceError || !currentPrice || currentPrice.tax_inclusive || Number(currentPrice.tax_rate_percent) !== 18) {
    return NextResponse.json({ error: "Monthly plan pricing needs verification before checkout." }, { status: 503 });
  }

  const configuredOfferId = getIntroOfferId(planSlug);
  const isValidOffer = Boolean(configuredOfferId && configuredOfferId.startsWith("offer_"));
  if (body?.requireStandardPricing === true && isValidOffer) {
    return NextResponse.json({ error: "A configured promotion needs a verified checkout quote before this onboarding checkout can continue." }, { status: 503 });
  }
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
    const plansApi = razorpay.plans as unknown as { fetch: (id: string) => Promise<{
      item?: { amount?: number }; period?: string; interval?: number }> };
    const subscriptionsApi = razorpay.subscriptions as unknown as {
      create: (payload: Record<string, unknown>) => Promise<ProviderSubscription>;
      fetch: (id: string) => Promise<ProviderSubscription>;
      cancel: (id: string, payload: { cancel_at_cycle_end: number }) => Promise<unknown>;
    };
    const providerPlan = await plansApi.fetch(razorpayPlanId);
    if (Number(providerPlan?.item?.amount) !== Number(currentPrice.price_paise) ||
        providerPlan?.period !== "monthly" || Number(providerPlan?.interval) !== 1) {
      return NextResponse.json({ error: "Razorpay plan price differs from the billing catalog. Checkout is paused." }, { status: 503 });
    }
    const regularAmountPaise = Number(currentPrice.price_paise);
    const monthlyWithGst = Math.round(regularAmountPaise * 1.18) / 100;
    const { data: pending, error: pendingError } = await admin.from("subscription_checkout_intents")
      .select("id, plan_slug, provider_subscription_id, amount_paise")
      .eq("user_id", user.id).eq("status", "pending").maybeSingle();
    if (pendingError) return NextResponse.json({ error: "Checkout session storage is unavailable." }, { status: 503 });
    if (pending && (pending.plan_slug !== planSlug || Number(pending.amount_paise) !== regularAmountPaise)) {
      return NextResponse.json({ error: "Finish or cancel your existing pending subscription authorization before choosing another plan." }, { status: 409 });
    }
    if (pending && !pending.provider_subscription_id) {
      return NextResponse.json({ error: "Your checkout is being prepared. Please retry shortly; no new subscription was created." }, { status: 409 });
    }
    if (pending?.provider_subscription_id) {
      const previous = await subscriptionsApi.fetch(pending.provider_subscription_id);
      if (!["created", "authenticated", "pending", "halted"].includes(String(previous?.status || ""))) {
        return NextResponse.json({ error: `Existing checkout is ${previous?.status || "unavailable"}. Contact support before starting another mandate.` }, { status: 409 });
      }
      return NextResponse.json({ subscriptionId: pending.provider_subscription_id, keyId,
        planName: plan.name, planSlug, billingCycle: "monthly", currency: "INR",
        regularAmountPaise, firstChargePaise: regularAmountPaise,
        estimatedTotalWithGst: monthlyWithGst, taxRatePercent: 18,
        nextBillingDate: previous?.current_end ? new Date(Number(previous.current_end) * 1000).toISOString() : null,
        reused: true });
    }
    const { data: intent, error: intentError } = await admin.from("subscription_checkout_intents")
      .insert({ user_id: user.id, plan_slug: planSlug, billing_cycle: "monthly",
        currency: "INR", amount_paise: regularAmountPaise, status: "pending" })
      .select("id").single();
    if (intentError || !intent) return NextResponse.json({ error: "A checkout already exists or could not be reserved. Retry to resume it." }, { status: 409 });
    const { data: onboardingDraft } = await admin.from("events").select("id")
      .eq("organizer_id", user.id).eq("is_onboarding_draft", true).eq("status", "draft")
      .limit(1).maybeSingle();
    if (onboardingDraft) {
      await recordFirstEventConversion({ userId: user.id, eventId: onboardingDraft.id,
        eventName: "subscription_plan_selected", idempotencyKey: `plan-selected:${intent.id}`,
        planSlug, billingCycle: "monthly" });
      await recordFirstEventConversion({ userId: user.id, eventId: onboardingDraft.id,
        eventName: "checkout_started", idempotencyKey: `checkout:${intent.id}`,
        planSlug, billingCycle: "monthly" });
    }
    // Default to 36 billing cycles (3 years) instead of 120 (10 years)
    const totalCount = Number(process.env.RAZORPAY_SUBSCRIPTION_TOTAL_COUNT || 36);

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
        checkout_intent_id: intent.id,
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

    const subscription = await subscriptionsApi.create(subscriptionPayload);
    const { error: saveIntentError } = await admin.from("subscription_checkout_intents")
      .update({ provider_subscription_id: subscription.id, updated_at: new Date().toISOString() })
      .eq("id", intent.id).eq("status", "pending");
    if (saveIntentError) {
      const cancelled = await subscriptionsApi.cancel(subscription.id, { cancel_at_cycle_end: 0 }).then(() => true).catch(() => false);
      if (cancelled) await admin.from("subscription_checkout_intents")
        .update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", intent.id);
      return NextResponse.json({ error: "Checkout could not be saved. Contact support before retrying authorization." }, { status: 503 });
    }
    if (isValidOffer && configuredOfferId && subscription?.offer_id !== configuredOfferId) {
      if (subscription?.id) {
        const cancelled = await subscriptionsApi.cancel(subscription.id, { cancel_at_cycle_end: 0 }).then(() => true).catch(() => false);
        if (cancelled) await admin.from("subscription_checkout_intents")
          .update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", intent.id);
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
      firstChargePaise: introDisclosure ? introDisclosure.introAmountPaise : regularAmountPaise,
      nextBillingDate: subscription?.current_end ? new Date(Number(subscription.current_end) * 1000).toISOString() : null,
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
