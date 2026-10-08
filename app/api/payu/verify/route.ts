import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { verifyPayUResponseHash, type PayUResponsePayload } from "@/lib/payments/payu";
import { resolveEventRazorpayCredentials } from "@/lib/razorpay";
import { releaseReservation } from "@/lib/capacity-reservation";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const jsonBody = !formData ? await req.json().catch(() => null) : null;

  const payload: PayUResponsePayload = {
    key: "",
    txnid: "",
    amount: "0",
    productinfo: "",
    firstname: "",
    email: "",
    status: "",
    hash: "",
  };

  if (formData) {
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });
  } else if (jsonBody) {
    Object.assign(payload, jsonBody);
  }

  const { status, txnid, hash, key, mihpayid, udf1, udf2, udf3, udf4, udf5 } = payload;

  if (!txnid || !hash || !status) {
    return NextResponse.json(
      { error: "Invalid PayU response callback parameters." },
      { status: 400 }
    );
  }

  const admin = adminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";

  // ── Handle Single Event Pass Purchases ──
  const isEventPass = udf4 === "event_pass_purchase" || txnid.startsWith("ep_");
  if (isEventPass) {
    const merchantSalt = process.env.PAYU_MERCHANT_SALT || "";
    const isValidHash = verifyPayUResponseHash(payload, merchantSalt);

    if (!isValidHash) {
      console.error("[payu-verify] Event pass hash mismatch on transaction:", txnid);
      return NextResponse.redirect(`${appUrl}/billing?pass=failed&error=hash_verification_failed&gateway=payu`, 303);
    }

    const isSuccess = status.toLowerCase() === "success";
    if (isSuccess) {
      const passType = udf2 || "event";
      const userId = udf1;
      const paymentId = mihpayid || txnid;

      const PASS_REG_LIMITS: Record<string, number> = {
        event: 250,
        event_plus: 1000,
        event_pro: 2500,
      };
      const PASS_PRICES: Record<string, number> = {
        event: 299,
        event_plus: 599,
        event_pro: 999,
      };

      const regLimit = Number(udf3) || PASS_REG_LIMITS[passType] || 250;
      const priceRupees = PASS_PRICES[passType] || 299;

      if (userId) {
        const { data: existingPass } = await admin
          .from("event_passes")
          .select("id")
          .eq("payment_id", paymentId)
          .maybeSingle();

        if (!existingPass) {
          await admin.from("event_passes").insert({
            user_id: userId,
            pass_type: passType,
            registration_limit: regLimit,
            price_rupees: priceRupees,
            payment_id: paymentId,
            status: "available",
          });
        }
      }

      return NextResponse.redirect(
        `${appUrl}/billing?pass=purchased&plan=${encodeURIComponent(passType)}&txnid=${encodeURIComponent(txnid)}&gateway=payu`,
        303
      );
    } else {
      return NextResponse.redirect(
        `${appUrl}/billing?pass=failed&error=${encodeURIComponent(payload.error_Message || "Payment failed")}&gateway=payu`,
        303
      );
    }
  }

  // ── Handle Ticket Orders ──
  const eventId = udf1;
  const reservationId = udf3;

  // Find associated ticket order
  const { data: order } = await admin
    .from("ticket_orders")
    .select("*, event:events(id, organizer_id, organization_id)")
    .eq("razorpay_order_id", txnid)
    .maybeSingle();

  // Resolve Salt
  let merchantSalt = process.env.PAYU_MERCHANT_SALT || "";
  const eventOrgId = (order?.event as { organization_id?: string })?.organization_id;
  const eventOrganizerId = (order?.event as { organizer_id?: string })?.organizer_id;

  if (eventOrgId) {
    const { data: orgPay } = await admin
      .from("org_payment_settings")
      .select("payu_merchant_salt")
      .eq("organization_id", eventOrgId)
      .maybeSingle();
    if (orgPay?.payu_merchant_salt) merchantSalt = orgPay.payu_merchant_salt;
  }

  if (!merchantSalt && eventOrganizerId) {
    const { data: userPay } = await admin
      .from("payment_settings")
      .select("payu_merchant_salt")
      .eq("user_id", eventOrganizerId)
      .maybeSingle();
    if (userPay?.payu_merchant_salt) merchantSalt = userPay.payu_merchant_salt;
  }

  // Verify reverse hash
  const isValidHash = verifyPayUResponseHash(payload, merchantSalt);

  if (!isValidHash) {
    console.error("[payu-verify] Hash mismatch on transaction:", txnid);
    return NextResponse.redirect(`${appUrl}/e/${eventId || ""}?payment_status=hash_failed`, 303);
  }

  const isSuccess = status.toLowerCase() === "success";

  if (isSuccess) {
    // Update order to paid
    await admin
      .from("ticket_orders")
      .update({
        status: "paid",
        razorpay_payment_id: mihpayid || txnid,
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", txnid);

    return NextResponse.redirect(
      `${appUrl}/e/${eventId || ""}?payment_status=success&txnid=${encodeURIComponent(txnid)}`,
      303
    );
  } else {
    // Failed
    await admin
      .from("ticket_orders")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", txnid);

    if (reservationId) {
      await releaseReservation(admin, { reservationId });
    }

    return NextResponse.redirect(
      `${appUrl}/e/${eventId || ""}?payment_status=failed&error=${encodeURIComponent(payload.error_Message || "Payment failed")}`,
      303
    );
  }
}
