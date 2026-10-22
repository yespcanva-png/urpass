import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { whatsAppProvider } from "@/lib/communications/providers/whatsapp/provider";
import { normalizePhone, isValidE164, maskPhone } from "@/lib/communications/utils";
import { APPROVED_TEMPLATES, WhatsAppTemplateType } from "@/lib/communications/providers/whatsapp/templates";
import { formatTimeWithAmPm } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Diagnostic & Testing Route for Meta WhatsApp Cloud API (Admin Only)
 *
 * GET: Verifies connectivity with Meta Graph API, phone number registration,
 *      webhook configuration, and approved message templates.
 * POST: Sends an authenticated test WhatsApp message to a verified recipient phone
 *       without generating fake attendee registrations.
 */

const ADMIN_EMAILS = [
  "srinithinsomasundaram@gmail.com",
  "yespcorpindia@gmail.com",
  "srinithin.260011193@jainuniversity.ac.in",
  "srinithin002@gmail.com",
  ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()) : []),
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyAdminAuthorization(supabase: any, user: { id: string; email?: string }): Promise<boolean> {
  const email = (user.email || "").toLowerCase();
  if (ADMIN_EMAILS.includes(email)) return true;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_admin")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile?.is_admin === true || profile?.role === "admin" || profile?.role === "owner") {
      return true;
    }
  } catch {}

  return false;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in to UrPass." }, { status: 401 });
    }

    const isAdmin = await verifyAdminAuthorization(supabase, user);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: WhatsApp diagnostics and credentials management require UrPass administrator privileges." },
        { status: 403 }
      );
    }

    const token = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN || process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID;
    const wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || process.env.WHATSAPP_WABA_ID;
    const verifyTokenSet = Boolean(process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || process.env.WHATSAPP_VERIFY_TOKEN);
    const appSecretSet = Boolean(process.env.WHATSAPP_APP_SECRET);
    const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "v21.0";

    const configStatus = {
      provider: "whatsapp_cloud",
      graphVersion,
      webhookEndpoint: "https://urpass.space/api/webhooks/whatsapp",
      webhookVerifyTokenConfigured: verifyTokenSet,
      appSecretConfigured: appSecretSet,
      accessTokenConfigured: Boolean(token),
      phoneNumberIdConfigured: Boolean(phoneId),
      wabaIdConfigured: Boolean(wabaId),
      registeredTemplates: Object.keys(APPROVED_TEMPLATES),
    };

    // If live credentials are present, query Meta Graph API
    if (token && phoneId) {
      try {
        // 1. Phone number status & quality rating
        const phoneRes = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const phoneData = await phoneRes.json().catch(() => null);

        if (!phoneRes.ok) {
          return NextResponse.json({
            ...configStatus,
            metaConnection: "failed",
            metaError: phoneData?.error?.message || `Meta Graph API HTTP ${phoneRes.status}`,
          });
        }

        // 2. Query approved templates if WABA ID is configured
        let approvedTemplatesList: Array<Record<string, unknown>> = [];
        if (wabaId) {
          try {
            const tplRes = await fetch(`https://graph.facebook.com/${graphVersion}/${wabaId}/message_templates?limit=50`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (tplRes.ok) {
              const tplData = await tplRes.json().catch(() => null);
              if (Array.isArray(tplData?.data)) {
                approvedTemplatesList = tplData.data.map((t: any) => ({
                  name: t.name,
                  status: t.status,
                  language: t.language,
                  category: t.category,
                }));
              }
            }
          } catch {}
        }

        return NextResponse.json({
          ...configStatus,
          metaConnection: "connected",
          metaPhoneDetails: {
            id: phoneData?.id,
            displayPhoneNumber: phoneData?.display_phone_number,
            verifiedName: phoneData?.verified_name,
            qualityRating: phoneData?.quality_rating,
            codeVerificationStatus: phoneData?.code_verification_status,
          },
          wabaTemplates: approvedTemplatesList.length > 0 ? approvedTemplatesList : "Templates available via Graph API",
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
      note: "Configure WHATSAPP_CLOUD_ACCESS_TOKEN and WHATSAPP_CLOUD_PHONE_NUMBER_ID to activate live Meta Cloud API sending.",
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
    const isAdmin = await verifyAdminAuthorization(supabase, user);

    let isAuthorized = isAdmin;
    let eventName = "UrPass Production Verification";
    let eventDate: string | undefined = undefined;
    let eventTime: string | undefined = undefined;
    let eventVenue: string | undefined = undefined;

    if (!isAuthorized && body?.eventId) {
      const { data: eventData } = await supabase
        .from("events")
        .select("id, name, organizer_id, organization_id, event_date, start_time, venue")
        .eq("id", body.eventId)
        .maybeSingle();

      if (eventData) {
        eventName = eventData.name || eventName;
        eventDate = eventData.event_date || undefined;
        eventTime = formatTimeWithAmPm(eventData.start_time) || undefined;
        eventVenue = eventData.venue || undefined;
        if (eventData.organizer_id === user.id) {
          isAuthorized = true;
        } else if (eventData.organization_id) {
          const { data: member } = await supabase
            .from("organization_members")
            .select("role")
            .eq("organization_id", eventData.organization_id)
            .eq("user_id", user.id)
            .eq("status", "active")
            .in("role", ["owner", "admin", "event_manager"])
            .maybeSingle();
          if (member) isAuthorized = true;
        }
      }
    } else if (body?.eventId) {
      const { data: eventData } = await supabase
        .from("events")
        .select("id, name, event_date, start_time, venue")
        .eq("id", body.eventId)
        .maybeSingle();
      if (eventData) {
        eventName = eventData.name || eventName;
        eventDate = eventData.event_date || undefined;
        eventTime = formatTimeWithAmPm(eventData.start_time) || undefined;
        eventVenue = eventData.venue || undefined;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Forbidden: Test messages may only be dispatched by the event organizer or UrPass system administrators." },
        { status: 403 }
      );
    }

    const rawPhone = String(body?.phone || body?.toPhone || "").trim();
    const templateName = body?.templateName || process.env.WHATSAPP_TEMPLATE_NAME || "urpass_space";

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
      eventId: body?.eventId || "test-event-001",
      eventName,
      eventDate,
      eventTime,
      venue: eventVenue,
      ticketId: `TEST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      passToken: `test_token_${Date.now()}`,
      attendeeId: user.id,
      attendeeName: user.user_metadata?.full_name || (isAdmin ? "Admin Verifier" : "Organizer"),
      email: user.email || "organizer@urpass.space",
      phone: normalizedPhone,
      passType: "Test Pass",
      ticketUrl: `https://urpass.space/pass/test_token_${Date.now()}`,
      templateName,
      templateLanguage: body?.templateLang || body?.templateLanguage || (templateName.includes("urpass_ticket") ? "en_US" : "en"),
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
            destination: maskPhone(normalizedPhone),
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
      destination: maskPhone(normalizedPhone),
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
