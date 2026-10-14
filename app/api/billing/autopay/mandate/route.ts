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
  const rawSlug = String(body?.planSlug || "").toLowerCase().trim();
  const planSlug = rawSlug
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
    .select("id, status, billing_cycle, current_period_end, autopay_status, provider_customer_id, plan:plans(slug)")
    .eq("user_id", user.id)
    .maybeSingle();

  const plan = Array.isArray(sub?.plan) ? sub?.plan[0] : sub?.plan;
  const currentPlanSlug = String(plan?.slug || "").toLowerCase();
  const periodEnd = sub?.current_period_end ? new Date(sub.current_period_end) : null;
  const hasValidAccess = sub?.status === "active" && periodEnd && periodEnd.getTime() > Date.now();

  if (!sub || !hasValidAccess || currentPlanSlug !== planSlug || sub.billing_cycle !== "monthly") {
    return NextResponse.json(
      { error: "Activate the selected monthly plan before setting up AutoPay." },
      { status: 409 }
    );
  }

  if (sub.autopay_status === "active") {
    return NextResponse.json({ error: "AutoPay is already active for this subscription." }, { status: 409 });
  }

  const disclosure = getRazorpayAutopayDisclosure(planSlug);
  const name = String(user.user_metadata?.full_name || user.email || "UrPass customer").slice(0, 80);
  const email = String(user.email || "");
  const contact = String(user.phone || user.user_metadata?.phone || "").replace(/[^\d+]/g, "");

  try {
    const razorpay = getRazorpayClient();
    const customerPayload: Record<string, unknown> = {
      name,
      email,
      fail_existing: "0",
      notes: cleanNotes({ user_id: user.id, purpose: "urpass_autopay" }),
    };
    if (contact) customerPayload.contact = contact;

    const customer = sub.provider_customer_id
      ? { id: sub.provider_customer_id }
      : await (razorpay.customers as any).create(customerPayload);

    const now = new Date();
    const recurringDay = Math.min(28, Math.max(1, now.getDate()));
    const expireAt = Math.floor(now.getTime() / 1000) + (10 * 365 * 24 * 60 * 60);
    const receipt = `up_auto_${user.id.slice(0, 8)}_${Date.now()}`.slice(0, 40);

    const order: any = await (razorpay.orders.create as any)({
      amount: AUTOPAY_AUTH_AMOUNT_PAISE,
      currency: "INR",
      method: "upi",
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
        }),
      },
      notes: cleanNotes({
        kind: "urpass_autopay_mandate",
        user_id: user.id,
        plan_slug: planSlug,
        regular_base_amount: disclosure.regularBasePaise,
        tax_amount: disclosure.taxPaise,
        max_amount: disclosure.maxAmountPaise,
      }),
    });

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

    return NextResponse.json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      customerId: customer.id,
      maxAmountPaise: disclosure.maxAmountPaise,
      regularBasePaise: disclosure.regularBasePaise,
      taxPaise: disclosure.taxPaise,
    });
  } catch (err) {
    console.error("[api/billing/autopay/mandate] Razorpay error:", err);
    const msg = formatRazorpayErrorMessage(err, "Failed to create AutoPay mandate");
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

