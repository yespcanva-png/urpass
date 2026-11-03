import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { adminClient } from "@/lib/supabase/admin";
import { notifyOwnerConciergeSetupRequest } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing verification parameters." }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature(orderId, paymentId, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Payment verification failed: Invalid signature." }, { status: 400 });
    }

    const admin = adminClient();

    // Find and update the concierge request
    const { data: requestRow } = await admin
      .from("concierge_setup_requests")
      .select("*")
      .eq("razorpay_order_id", orderId)
      .maybeSingle();

    if (requestRow) {
      await admin
        .from("concierge_setup_requests")
        .update({
          payment_status: "paid",
          razorpay_payment_id: paymentId,
          status: "in_progress",
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestRow.id);

      // Notify owner of paid VIP setup confirmation
      notifyOwnerConciergeSetupRequest({
        organizerName: requestRow.organizer_name,
        organizerEmail: requestRow.organizer_email,
        whatsappNumber: requestRow.whatsapp_number,
        eventName: requestRow.event_name,
        eventDate: requestRow.event_date,
        city: requestRow.city,
        attendeeCount: requestRow.attendee_count,
        notes: requestRow.notes,
        isFirstTime: false,
        amountInr: 999,
        paymentStatus: `Paid (₹999, Payment ID: ${paymentId})`,
      }).catch((e) => console.error("[concierge/verify] notifyOwner error:", e));
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully. Our concierge lead will reach out on WhatsApp within 2 hours.",
    });
  } catch (err) {
    console.error("[concierge/verify] Verification error:", err);
    return NextResponse.json({ error: "Server error verifying payment." }, { status: 500 });
  }
}

