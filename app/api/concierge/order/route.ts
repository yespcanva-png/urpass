import { NextRequest, NextResponse } from "next/server";
import {
  getRazorpayClient,
  getRazorpayCredentials,
  formatRazorpayErrorMessage,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { notifyOwnerConciergeSetupRequest } from "@/lib/email";

export const dynamic = "force-dynamic";

const CONCIERGE_PRICE_INR = 999;
const CONCIERGE_BASE_PAISE = 99900;
const GST_RATE = 0.18;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const {
      eventName,
      eventDate,
      city,
      attendeeCount,
      organizerName,
      organizerEmail,
      whatsappNumber,
      notes,
      posterUrl,
    } = body;

    if (!eventName?.trim()) {
      return NextResponse.json({ error: "Event name is required." }, { status: 400 });
    }
    if (!whatsappNumber?.trim()) {
      return NextResponse.json({ error: "WhatsApp phone number is required." }, { status: 400 });
    }

    const finalOrganizerEmail = (organizerEmail || user?.email || "").trim();
    const finalOrganizerName = (organizerName || user?.user_metadata?.full_name || "Organizer").trim();

    const admin = adminClient();

    // Check if organizer has 0 existing events -> Free First-Time Setup!
    let isFirstTime = false;
    if (user?.id) {
      const { count } = await admin
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("organizer_id", user.id);
      isFirstTime = (count ?? 0) === 0;
    } else {
      isFirstTime = true; // Guest requesting first setup
    }

    // If first-time organizer: 100% Free setup!
    if (isFirstTime) {
      const { data: requestRow, error: insertErr } = await admin
        .from("concierge_setup_requests")
        .insert({
          user_id: user?.id || null,
          event_name: eventName.trim(),
          event_date: eventDate?.trim() || null,
          city: city?.trim() || null,
          attendee_count: attendeeCount?.trim() || null,
          organizer_name: finalOrganizerName,
          organizer_email: finalOrganizerEmail,
          whatsappNumber: whatsappNumber.trim(),
          notes: notes?.trim() || null,
          poster_url: posterUrl || null,
          is_first_time: true,
          status: "pending",
          payment_status: "free",
          amount_inr: 0,
        })
        .select("id")
        .single();

      if (insertErr) {
        console.warn("[concierge/order] insert error:", insertErr);
      }

      // Notify owner immediately for 24h turnaround
      notifyOwnerConciergeSetupRequest({
        organizerName: finalOrganizerName,
        organizerEmail: finalOrganizerEmail,
        whatsappNumber: whatsappNumber.trim(),
        eventName: eventName.trim(),
        eventDate: eventDate?.trim() || null,
        city: city?.trim() || null,
        attendeeCount: attendeeCount?.trim() || null,
        notes: notes?.trim() || null,
        isFirstTime: true,
        amountInr: 0,
        paymentStatus: "Free (First-Time Organizer)",
      }).catch((e) => console.error("[concierge/order] notifyOwner error:", e));

      return NextResponse.json({
        success: true,
        isFree: true,
        requestId: requestRow?.id,
        message: "Your free concierge setup request has been received! Our team will contact your WhatsApp within 2-4 hours to begin configuration.",
      });
    }

    // Otherwise: Paid VIP Concierge Setup at ₹999 + GST
    const taxPaise = Math.round(CONCIERGE_BASE_PAISE * GST_RATE);
    const totalPaise = CONCIERGE_BASE_PAISE + taxPaise;

    let keyId: string;
    try {
      const creds = getRazorpayCredentials();
      keyId = creds.keyId;
    } catch {
      return NextResponse.json(
        {
          error: "Payment gateway credentials are not configured. Please contact support@urpass.space.",
        },
        { status: 503 }
      );
    }

    const razorpay = getRazorpayClient();
    const receipt = `cn_${(user?.id || "guest").slice(0, 8)}_${Date.now()}`.slice(0, 40);

    const order = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt,
      notes: {
        user_id: String(user?.id || ""),
        service: "concierge_24h_setup",
        event_name: String(eventName).slice(0, 50),
        organizer_name: String(finalOrganizerName).slice(0, 50),
        whatsapp: String(whatsappNumber).slice(0, 20),
        customer_email: String(finalOrganizerEmail).slice(0, 50),
      },
    });

    await admin.from("concierge_setup_requests").insert({
      user_id: user?.id || null,
      event_name: eventName.trim(),
      event_date: eventDate?.trim() || null,
      city: city?.trim() || null,
      attendee_count: attendeeCount?.trim() || null,
      organizer_name: finalOrganizerName,
      organizer_email: finalOrganizerEmail,
      whatsappNumber: whatsappNumber.trim(),
      notes: notes?.trim() || null,
      poster_url: posterUrl || null,
      is_first_time: false,
      status: "pending",
      payment_status: "unpaid",
      amount_inr: CONCIERGE_PRICE_INR,
      razorpay_order_id: order.id,
    });

    return NextResponse.json({
      success: true,
      isFree: false,
      orderId: order.id,
      amountPaise: totalPaise,
      amountRupees: CONCIERGE_PRICE_INR,
      taxRupees: Math.round(CONCIERGE_PRICE_INR * GST_RATE),
      totalRupees: Math.round(totalPaise / 100),
      keyId,
    });
  } catch (err) {
    console.error("[concierge/order] Error creating concierge order:", err);
    return NextResponse.json(
      { error: formatRazorpayErrorMessage(err, "Failed to initiate concierge setup.") },
      { status: 500 }
    );
  }
}

