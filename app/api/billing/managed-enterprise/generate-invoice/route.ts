import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { createInvoiceForPayment } from "@/lib/invoices";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isNiveditha = (user.email || "").toLowerCase() === "niveditha@client.urpass.space";
  if (!isNiveditha) {
    return NextResponse.json({ error: "This endpoint is restricted to authorized managed accounts." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const admin = adminClient();

  // Find business plan
  let { data: businessPlan } = await admin
    .from("plans")
    .select("id, name, slug")
    .eq("slug", "business")
    .maybeSingle();

  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const paymentId = String(body.paymentId || `pay_business_wa_${Date.now()}`);

  // Activate subscription
  const { data: updatedSub, error: subError } = await admin
    .from("subscriptions")
    .upsert(
      {
        user_id: user.id,
        plan_id: businessPlan?.id,
        status: "active",
        provider: "razorpay",
        billing_cycle: "monthly",
        provider_subscription_id: paymentId,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        registrations_used: 0,
        is_trial: false,
        free_event_trial_active: false,
        has_lifetime_access: false,
        updated_at: now.toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("id")
    .single();

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }

  // Remove branding
  await admin
    .from("profiles")
    .update({ hide_urpass_branding: true })
    .eq("user_id", user.id);

  // Generate GST tax invoice (₹2,499 Business + ₹500 WhatsApp = ₹2,999 + 18% GST = ₹3,538.82)
  const invoice = await createInvoiceForPayment({
    userId: user.id,
    subscriptionId: updatedSub?.id ?? null,
    paymentId,
    description: "URPASS Business Plan + WhatsApp Delivery Integration (Monthly)",
    baseAmountRupees: 2999,
    discountRupees: 0,
    currency: "INR",
    docType: "SUB",
    customerEmail: user.email,
    customerName: body.customerName || "Niveditha",
    customerAddress: body.customerAddress || null,
    customerGstin: body.customerGstin || null,
    customerState: body.customerState || "Tamil Nadu",
    customerStateCode: body.customerStateCode || "33",
    billingPeriodStart: now,
    billingPeriodEnd: periodEnd,
  });

  return NextResponse.json({
    success: true,
    invoice,
    downloadUrl: invoice ? `/api/invoices/${invoice.id}/pdf?download=1` : null,
  });
}
