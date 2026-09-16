import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Prices in paise. Must match EVENT_PASSES in PlanGrid.tsx.
const PASS_PRICES_PAISE: Record<string, number> = {
  event:       29900,
  event_plus:  59900,
  event_pro:   99900,
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

function getRazorpay() {
  return new Razorpay({
    key_id:    process.env.RAZORPAY_KEY_ID    || "dummy_key_id",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_key_secret",
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { passType } = body ?? {};

  const basePaise = PASS_PRICES_PAISE[passType];
  if (!basePaise) {
    return NextResponse.json({ error: "Invalid pass type." }, { status: 400 });
  }

  const gstPaise   = Math.round(basePaise * 0.18);
  const totalPaise = basePaise + gstPaise;

  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId || keyId === "dummy_key_id") {
    return NextResponse.json({ error: "Payment gateway is not configured." }, { status: 503 });
  }

  let order;
  try {
    const razorpay = getRazorpay();
    order = await razorpay.orders.create({
      amount:   totalPaise,
      currency: "INR",
      receipt:  `evpass_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        user_id:            user.id,
        pass_type:          passType,
        registration_limit: PASS_REG_LIMITS[passType],
        base_paise:         basePaise,
        gst_paise:          gstPaise,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: msg }, { status: 502 });
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
