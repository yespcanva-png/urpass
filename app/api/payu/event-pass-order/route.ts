import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildPayUPaymentParams } from "@/lib/payments/payu";
import { notifyOwnerPaymentAttempt } from "@/lib/email";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

const PASS_PRICES_INR: Record<string, number> = {
  event: 299,
  event_plus: 599,
  event_pro: 999,
};

const PASS_NAMES: Record<string, string> = {
  event: "Event Pass",
  event_plus: "Event Plus Pass",
  event_pro: "Event Pro Pass",
};

const PASS_REG_LIMITS: Record<string, number> = {
  event: 250,
  event_plus: 1000,
  event_pro: 2500,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { passType } = body ?? {};

  const basePrice = PASS_PRICES_INR[passType];
  if (!basePrice) {
    return NextResponse.json({ error: "Invalid pass type." }, { status: 400 });
  }

  const taxAmount = Math.round(basePrice * 0.18 * 100) / 100;
  const totalAmount = Math.round((basePrice + taxAmount) * 100) / 100;

  const merchantKey = process.env.PAYU_MERCHANT_KEY || "test_payu_key";
  const merchantSalt = process.env.PAYU_MERCHANT_SALT || "test_payu_salt";
  const environment = (process.env.PAYU_ENVIRONMENT as "production" | "sandbox") || "production";

  const txnid = `ep_${user.id.slice(0, 8)}_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
  const passName = PASS_NAMES[passType] || "Single Event Pass";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";
  const surl = `${appUrl}/api/payu/verify`;
  const furl = `${appUrl}/api/payu/verify`;

  const payuParams = buildPayUPaymentParams({
    merchantKey,
    merchantSalt,
    environment,
    txnid,
    amount: totalAmount,
    productinfo: `URPASS ${passName}`,
    firstname: user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Organizer",
    email: user.email || "organizer@example.com",
    surl,
    furl,
    udf1: user.id,
    udf2: passType,
    udf3: String(PASS_REG_LIMITS[passType] || 250),
    udf4: "event_pass_purchase",
  });

  try {
    await notifyOwnerPaymentAttempt({
      kind: "event_pass",
      buyerName: user.user_metadata?.full_name,
      buyerEmail: user.email,
      itemName: `${passName} [PayU Gateway]`,
      amountPaise: Math.round(totalAmount * 100),
      orderId: txnid,
    });
  } catch (err: unknown) {
    console.error("[payu/event-pass-order] notify error:", err);
  }

  return NextResponse.json({
    success: true,
    txnid,
    amount: totalAmount,
    currency: "INR",
    passName,
    passType,
    actionUrl: payuParams.actionUrl,
    fields: payuParams.fields,
  });
}
