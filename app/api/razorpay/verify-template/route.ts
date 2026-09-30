import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { recordLiveOpsEvent } from "@/lib/ops/events";
import { UNLOCKED_TEMPLATES_COOKIE, parseUnlockedCookie } from "@/lib/studio/purchases";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const { orderId, paymentId, signature, templateId, templateName, userEmail = "" } = body ?? {};

    if (!orderId || !paymentId || !templateId) {
      return NextResponse.json(
        { success: false, error: "Payment verification details are incomplete." },
        { status: 400 }
      );
    }

    // Verify cryptographic signature if secret is available and not in pure test mode
    if (process.env.RAZORPAY_KEY_SECRET && !orderId.startsWith("order_tpl_test_")) {
      const isValid = verifyRazorpaySignature(orderId, paymentId, signature);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Payment verification failed. Invalid digital signature." },
          { status: 400 }
        );
      }
    }

    // Record live ops telemetry
    recordLiveOpsEvent({
      level: "SUCCESS",
      category: "BILLING",
      message: `💳 Ticket template unlocked: "${templateName || templateId}" via Razorpay [Payment ID: ${paymentId.slice(0, 12)}]`,
      details: { orderId, paymentId, templateId, email: userEmail },
    });

    // Read and update the unlocked templates cookie
    const currentCookie = req.cookies.get(UNLOCKED_TEMPLATES_COOKIE)?.value;
    const unlockedList = parseUnlockedCookie(currentCookie);

    if (!unlockedList.includes(templateId)) {
      unlockedList.push(templateId);
    }

    const response = NextResponse.json({
      success: true,
      templateId,
      message: "Ticket template has been unlocked!",
    });

    response.cookies.set({
      name: UNLOCKED_TEMPLATES_COOKIE,
      value: encodeURIComponent(JSON.stringify(unlockedList)),
      path: "/",
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: "lax",
      httpOnly: false, // accessible to client for instant UI reflection
    });

    return response;
  } catch (error) {
    console.error("[verify-template] Verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify template purchase",
      },
      { status: 500 }
    );
  }
}
