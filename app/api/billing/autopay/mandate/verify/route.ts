import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  formatRazorpayErrorMessage,
  getRazorpayClient,
  verifyRazorpaySignature,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase/config";

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
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const orderId = String(body?.orderId || "");
  const paymentId = String(body?.paymentId || "");
  const signature = String(body?.signature || "");
  const customerId = String(body?.customerId || "");

  if (!orderId || !paymentId || !signature || !customerId) {
    return NextResponse.json({ error: "AutoPay verification details are missing." }, { status: 400 });
  }

  if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
    return NextResponse.json({ error: "AutoPay verification failed: invalid signature." }, { status: 400 });
  }

  const admin = adminClient();

  try {
    const razorpay = getRazorpayClient();
    const [order, payment] = await Promise.all([
      razorpay.orders.fetch(orderId),
      (razorpay.payments as any).fetch(paymentId),
    ]);

    const notes = (order?.notes ?? {}) as Record<string, string>;
    if (notes.kind !== "urpass_autopay_mandate") {
      return NextResponse.json({ error: "This Razorpay order is not an UrPass AutoPay mandate." }, { status: 400 });
    }
    if (notes.user_id && notes.user_id !== user.id) {
      return NextResponse.json({ error: "AutoPay mandate does not belong to this account." }, { status: 403 });
    }

    const paymentCustomerId = String(payment?.customer_id || "");
    if (paymentCustomerId && paymentCustomerId !== customerId) {
      return NextResponse.json({ error: "AutoPay customer verification failed." }, { status: 400 });
    }

    const tokenId = String(payment?.token_id || payment?.token?.id || "");
    if (!tokenId) {
      await admin
        .from("subscriptions")
        .update({
          provider_customer_id: customerId,
          autopay_status: "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      return NextResponse.json(
        {
          error:
            "Razorpay accepted the authorization payment, but the recurring token is not available yet. Please try again after Razorpay confirms the mandate.",
        },
        { status: 409 }
      );
    }

    const maxAmountPaise = notes.max_amount ? Number(notes.max_amount) : null;

    const { error } = await admin
      .from("subscriptions")
      .update({
        provider_customer_id: customerId,
        autopay_mandate_id: tokenId,
        autopay_status: "active",
        autopay_max_amount_paise: Number.isFinite(maxAmountPaise) ? maxAmountPaise : null,
        autopay_currency: "INR",
        autopay_confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tokenId,
      customerId,
      maxAmountPaise,
    });
  } catch (err) {
    console.error("[api/billing/autopay/mandate/verify] Razorpay error:", err);
    const msg = formatRazorpayErrorMessage(err, "Failed to verify AutoPay mandate");
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

