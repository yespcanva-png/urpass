import { NextRequest, NextResponse } from "next/server";
import {
  getRazorpayClient,
  getRazorpayCredentials,
  formatRazorpayErrorMessage,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { notifyOwnerPaymentAttempt } from "@/lib/email";

export const dynamic = "force-dynamic";

// Prices in paise (INR). Must match EVENT_PASSES in PlanGrid.tsx.
const PASS_PRICES_PAISE: Record<string, number> = {
  event:       29900,
  event_plus:  59900,
  event_pro:   99900,
};

const UK_PASS_PRICES_PENCE: Record<string, number> = {
  event:       500,
  event_plus:  1000,
  event_pro:   1900,
};

const PASS_NAMES: Record<string, string> = {
  event:       "Event Pass",
  event_plus:  "Event Plus Pass",
  event_pro:   "Event Pro Pass",
};

const PASS_REG_LIMITS: Record<string, number> = {
  event:       250,
  event_plus:  1000,
  event_pro:   2500,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { passType, currency: requestedCurrency = "INR" } = body ?? {};

  const isUk = (requestedCurrency || "").toUpperCase() === "GBP";
  const currencyCode = isUk ? "GBP" : "INR";
  const taxRate = isUk ? 0.20 : 0.18;
  const taxName = isUk ? "VAT" : "GST";

  const baseAmount = isUk ? UK_PASS_PRICES_PENCE[passType] : PASS_PRICES_PAISE[passType];
  if (!baseAmount) {
    return NextResponse.json({ error: "Invalid pass type." }, { status: 400 });
  }

  const taxAmount   = Math.round(baseAmount * taxRate);
  const totalAmount = baseAmount + taxAmount;

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
    const receipt = `ev_${user.id.slice(0, 8)}_${Date.now()}`.slice(0, 40);
    order = await razorpay.orders.create({
      amount:   totalAmount,
      currency: currencyCode,
      receipt,
      notes: {
        user_id:            String(user.id),
        pass_type:          String(passType),
        registration_limit: String(PASS_REG_LIMITS[passType] ?? ""),
        currency:           currencyCode,
        base_amount:        String(baseAmount),
        tax_amount:         String(taxAmount),
        tax_name:           taxName,
        customer_name:      String(user.user_metadata?.full_name ?? ""),
        customer_email:     String(user.email ?? ""),
      },
    });
  } catch (err) {
    console.error("[api/razorpay/event-pass-order] Razorpay order error:", err);
    const msg = formatRazorpayErrorMessage(err, "Failed to create order");
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  try {
    await notifyOwnerPaymentAttempt({
      kind: "event_pass",
      buyerName: user.user_metadata?.full_name,
      buyerEmail: user.email,
      itemName: `${PASS_NAMES[passType]} [${currencyCode}]`,
      amountPaise: totalAmount,
      orderId: order.id,
    });
  } catch (err: unknown) {
    console.error("[event-pass-order] notifyOwnerPaymentAttempt error:", err);
  }

  return NextResponse.json({
    orderId:  order.id,
    amount:   order.amount,
    currency: order.currency,
    keyId,
    passName: PASS_NAMES[passType],
    passType,
  });
}
