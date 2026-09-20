"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  verifyRazorpaySignature,
  getRazorpayClient,
  type PaymentVerificationInput,
} from "@/lib/razorpay";
import { createInvoiceForPayment } from "@/lib/invoices";
import { notifyOwnerPaymentSuccess, sendUserPaymentSuccessEmail } from "@/lib/email";

type ActionResult = { error: string } | undefined;

const PASS_REG_LIMITS: Record<string, number> = {
  event:      250,
  event_plus: 1000,
  event_pro:  2500,
};

const PASS_PRICES: Record<string, number> = {
  event:      299,
  event_plus: 599,
  event_pro:  999,
};

export async function activateEventPass(
  passType: string,
  payment: PaymentVerificationInput | { orderId?: string; paymentId?: string; signature?: string } | string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const registrationLimit = PASS_REG_LIMITS[passType];
  const priceRupees       = PASS_PRICES[passType];
  let orderAmountPaise    = Math.round(priceRupees * 1.18 * 100);

  if (!registrationLimit || !priceRupees) {
    return { error: "Invalid pass type." };
  }

  if (!payment || typeof payment === "string" || !payment.orderId || !payment.paymentId || !payment.signature) {
    return {
      error: "Payment verification failed: Razorpay order ID, payment ID, and signature are required.",
    };
  }

  const isValidSig = verifyRazorpaySignature(
    payment.orderId,
    payment.paymentId,
    payment.signature
  );

  if (!isValidSig) {
    return { error: "Payment verification failed: invalid signature." };
  }

  // Fetch Razorpay order to confirm metadata and amount
  try {
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.fetch(payment.orderId);
    if (!order) {
      return { error: "Payment verification failed: order not found on gateway." };
    }
    orderAmountPaise = Number(order.amount ?? orderAmountPaise);

    const notes = (order.notes ?? {}) as Record<string, string>;
    if (notes.user_id && notes.user_id !== user.id) {
      return { error: "Order does not belong to the authenticated user." };
    }
    if (notes.pass_type && notes.pass_type !== passType) {
      return { error: "Order pass type does not match requested pass." };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gateway order lookup failed";
    return { error: `Payment verification failed: ${msg}` };
  }

  // Idempotency check: guard against replay
  const { data: existingPass } = await supabase
    .from("event_passes")
    .select("id")
    .eq("payment_id", payment.paymentId)
    .maybeSingle();

  if (existingPass) {
    return;
  }

  const { error } = await supabase.from("event_passes").insert({
    user_id:            user.id,
    pass_type:          passType,
    registration_limit: registrationLimit,
    price_rupees:       priceRupees,
    payment_id:         payment.paymentId,
    status:             "available",
  });

  if (error) return { error: error.message };

  // Issue invoice for event pass
  void createInvoiceForPayment({
    userId: user.id,
    paymentId: payment.paymentId,
    description: `Event Pass (${passType.replace("_", " ").toUpperCase()})`,
    baseAmountRupees: priceRupees,
    discountRupees: 0,
    customerEmail: user.email,
    customerName: user.user_metadata?.full_name,
  });

  const itemName = `Event Pass (${passType.replace("_", " ").toUpperCase()})`;
  void Promise.allSettled([
    notifyOwnerPaymentSuccess({
      kind: "event_pass",
      buyerName: user.user_metadata?.full_name,
      buyerEmail: user.email,
      itemName,
      amountPaise: orderAmountPaise,
      paymentId: payment.paymentId,
      orderId: payment.orderId,
    }),
    user.email
      ? sendUserPaymentSuccessEmail({
          to: user.email,
          name: user.user_metadata?.full_name,
          itemName,
          amountPaise: orderAmountPaise,
          kind: "event_pass",
        })
      : Promise.resolve(),
  ]).catch((err: unknown) => console.error("[email]", err));
}
