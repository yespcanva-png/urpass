import { NextRequest, NextResponse } from "next/server";
import {
  getRazorpayClient,
  getRazorpayCredentials,
  formatRazorpayErrorMessage,
} from "@/lib/razorpay";
import {
  STUDIO_TEMPLATES,
  SINGLE_TEMPLATE_PRICE_INR,
  ALL_ACCESS_BUNDLE_PRICE_INR,
} from "@/lib/studio/templates";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const { templateId, templateName, isBundle = false, userEmail = "" } = body ?? {};

    // Authenticate user via Supabase
    let user: { id: string; email?: string } | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data?.user ?? null;
    } catch {
      // Handled below
    }

    if (!user && process.env.NODE_ENV === "test") {
      user = { id: "test-user-id", email: userEmail || "organizer@example.com" };
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          requireAuth: true,
          error: "Please sign in or create an organizer account to unlock ticket templates.",
        },
        { status: 401 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid template ID." },
        { status: 400 }
      );
    }

    const isAllAccess = isBundle || templateId === "all-access-bundle";
    const tpl = isAllAccess ? null : STUDIO_TEMPLATES.find((t) => t.id === templateId);

    if (!isAllAccess && !tpl) {
      return NextResponse.json(
        { success: false, error: "Requested ticket template was not found." },
        { status: 404 }
      );
    }

    const priceINR = isAllAccess
      ? ALL_ACCESS_BUNDLE_PRICE_INR
      : (tpl?.priceINR ?? SINGLE_TEMPLATE_PRICE_INR);

    const amountPaise = priceINR * 100;
    const finalTemplateName = isAllAccess
      ? "All-Access 12 Ticket Template Pack"
      : (templateName || tpl?.name || "Premium Ticket Template");

    const effectiveEmail = user.email || userEmail || "organizer@urpass.space";

    let orderId: string;
    let keyId: string;

    try {
      const creds = getRazorpayCredentials();
      keyId = creds.keyId;
      const razorpay = getRazorpayClient();
      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt: `rcpt_tpl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        notes: {
          product: "ticket_template",
          template_id: isAllAccess ? "all" : templateId,
          template_name: finalTemplateName,
          user_id: user.id,
          user_email: effectiveEmail,
        },
      });
      orderId = order.id;
    } catch (err) {
      if (process.env.NODE_ENV === "test" || !process.env.RAZORPAY_KEY_ID) {
        orderId = `order_tpl_test_${Date.now()}`;
        keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_urpass";
      } else {
        const errorMsg = formatRazorpayErrorMessage(
          err,
          "Failed to initialize Razorpay template order"
        );
        console.error("[template-order] Razorpay error:", err);
        return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: amountPaise,
      currency: "INR",
      keyId,
      templateId: isAllAccess ? "all" : templateId,
      templateName: finalTemplateName,
      priceINR,
      userId: user.id,
      userEmail: effectiveEmail,
    });
  } catch (error) {
    console.error("[template-order] Server error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process template order",
      },
      { status: 500 }
    );
  }
}
