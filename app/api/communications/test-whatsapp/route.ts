import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { whatsAppProvider } from "@/lib/communications/providers/whatsapp/provider";
import { normalizePhone, isValidE164 } from "@/lib/communications/utils";

export const dynamic = "force-dynamic";

/**
 * Diagnostic & Testing Route for Meta WhatsApp Cloud API
 *
 * GET: Verifies connectivity with Meta Graph API and reports configuration status.
 * POST: Sends an authenticated test WhatsApp ticket dispatch to a verified phone number.
 */

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in to UrPass." }, { status: 401 });
    }

    const token = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN || process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID;
    const verifyTokenSet = Boolean(process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || process.env.WHATSAPP_VERIFY_TOKEN);
    const appSecretSet = Boolean(process.env.WHATSAPP_APP_SECRET);
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "ticket_confirmation";
    const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "v21.0";

    const configStatus = {
      provider: "whatsapp_cloud",
      graphVersion,
      webhookEndpoint: "https://urpass.space/api/webhooks/whatsapp",
      webhookVerifyTokenConfigured: verifyTokenSet,
      appSecretConfigured: appSecretSet,
      accessTokenConfigured: Boolean(token),
      phoneNumberIdConfigured: Boolean(phoneId),
      templateConfigured: templateName,
    };

    // If live credentials are present, query Meta Graph API to verify live phone connection
    if (token && phoneId) {
      try {
        const metaRes = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const metaData = await metaRes.json().catch(() => null);

        if (!metaRes.ok) {
          return NextResponse.json({
            ...configStatus,
            metaConnection: "failed",
            metaError: metaData?.error?.message || `Meta Graph API HTTP ${metaRes.status}`,
          });
        }

        return NextResponse.json({
          ...configStatus,
          metaConnection: "connected",
          metaPhoneDetails: {
            id: metaData?.id,
            displayPhoneNumber: metaData?.display_phone_number,
            verifiedName: metaData?.verified_name,
            qualityRating: metaData?.quality_rating,
            codeVerificationStatus: metaData?.code_verification_status,
          },
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({
          ...configStatus,
          metaConnection: "unreachable",
          metaError: msg,
        });
      }
    }

    return NextResponse.json({
      ...configStatus,
      metaConnection: "credentials_missing",
      note: "Set WHATSAPP_CLOUD_ACCESS_TOKEN and WHATSAPP_CLOUD_PHONE_NUMBER_ID to enable live Meta Cloud API sending.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in to UrPass." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const rawPhone = String(body?.phone || body?.toPhone || "").trim();
    const templateName = body?.templateName || process.env.WHATSAPP_TEMPLATE_NAME || "ticket_confirmation";

    if (!rawPhone) {
      return NextResponse.json(
        { error: "Recipient phone number is required (e.g. +919876543210)" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(rawPhone);
    if (!normalizedPhone || !isValidE164(normalizedPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Please provide a valid E.164 phone number with country code (e.g. +91...)" },
        { status: 400 }
      );
    }

    const testPayload = {
      eventId: "test-event-001",
      eventName: "UrPass Production Verification",
      ticketId: `TEST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      passToken: `test_token_${Date.now()}`,
      attendeeId: user.id,
      attendeeName: user.user_metadata?.full_name || "Organizer",
      email: user.email || "organizer@urpass.space",
      phone: normalizedPhone,
      passType: "VIP Pass",
      ticketUrl: `https://urpass.space/pass/test_token_${Date.now()}`,
      templateName,
      whatsappConsent: true,
      customMessage: body?.customMessage,
    };

    const result = await whatsAppProvider.sendTicketWhatsApp(testPayload);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          provider: result.provider,
          payload: {
            destination: normalizedPhone,
            templateName,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      provider: result.provider,
      destination: normalizedPhone,
      templateName,
      ticketId: testPayload.ticketId,
      ticketUrl: testPayload.ticketUrl,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/communications/test-whatsapp] Error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
