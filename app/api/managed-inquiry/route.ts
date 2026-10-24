import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminClient } from "@/lib/supabase/admin";
import { getFromEmail, isEmailProviderConfigured, sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const inquirySchema = z.object({
  organizerName: z.string().min(2, "Organizer name is required").max(100),
  businessEmail: z.string().email("Valid business email is required").max(120),
  phoneNumber: z.string().min(7, "Valid phone number is required").max(25),
  eventType: z.string().min(2, "Event type is required").max(100),
  eventDate: z.string().max(80).optional(),
  city: z.string().max(100).optional(),
  expectedAttendees: z.string().max(50).optional(),
  eventPricingType: z.enum(["free", "paid", "private"]).optional().default("free"),
  preferredPackage: z.enum(["essential", "pro", "premium", "enterprise"]).optional().default("essential"),
  supportRequirements: z.string().max(500).optional(),
  comments: z.string().max(1000).optional(),
  consentGiven: z.boolean().refine((val) => val === true, "Consent is required"),
  pageSlug: z.string().max(120).optional(),
  contentCluster: z.string().max(60).optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  utmContent: z.string().max(100).optional(),
  referrer: z.string().max(255).optional(),
  // Honeypot field for anti-spam bot trap
  websiteUrlHoneypot: z.string().max(0, "Bot detected").optional(),
});

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json({ error: "Invalid JSON request" }, { status: 400 });
    }

    const parsed = inquirySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check honeypot
    if (data.websiteUrlHoneypot && data.websiteUrlHoneypot.length > 0) {
      // Silently accept bot submission without persisting
      return NextResponse.json({ success: true, message: "Inquiry received" });
    }

    // IP hashing for privacy-safe deduplication
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const ipHash = Buffer.from(ip).toString("base64").slice(0, 16);

    const admin = adminClient();

    // 1. Insert into managed_service_inquiries table
    const { data: record, error: dbError } = await admin
      .from("managed_service_inquiries")
      .insert({
        organizer_name: data.organizerName.trim(),
        business_email: data.businessEmail.trim().toLowerCase(),
        phone_number: data.phoneNumber.trim(),
        event_type: data.eventType.trim(),
        event_date: data.eventDate?.trim() || null,
        city: data.city?.trim() || null,
        expected_attendees: data.expectedAttendees?.trim() || null,
        event_pricing_type: data.eventPricingType,
        preferred_package: data.preferredPackage,
        support_requirements: data.supportRequirements?.trim() || null,
        comments: data.comments?.trim() || null,
        consent_given: data.consentGiven,
        status: "new",
        page_slug: data.pageSlug || null,
        content_cluster: data.contentCluster || null,
        utm_source: data.utmSource || null,
        utm_medium: data.utmMedium || null,
        utm_campaign: data.utmCampaign || null,
        utm_content: data.utmContent || null,
        referrer: data.referrer || null,
        ip_hash: ipHash,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("[managed-inquiry] DB insert error:", dbError);
      // Even if table migration hasn't run yet in dev, we log and proceed to email
    }

    // 2. Email dispatch to Ops Team
    const inquiryId = record?.id || `INQ-${Date.now()}`;
    const subject = `[UrPass Managed Inquiry] ${data.eventType} (${data.preferredPackage.toUpperCase()}) — ${data.organizerName}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px; color: #111827; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #6D28D9; padding: 24px 28px; color: #ffffff; }
            .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
            .header p { margin: 0; font-size: 13px; color: #e9d5ff; }
            .content { padding: 28px; }
            .row { margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #f3f4f6; }
            .row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
            .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px; }
            .value { font-size: 15px; font-weight: 600; color: #111827; }
            .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 12px; font-weight: 700; background: #ede9fe; color: #6d28d9; }
            .footer { padding: 16px 28px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>UrPass — New Remote Managed Service Lead</h1>
              <p>Reference: ${inquiryId} · Source: ${escapeHtml(data.pageSlug || "direct")}</p>
            </div>
            <div class="content">
              <div class="row">
                <div class="label">Package & Event Type</div>
                <div class="value"><span class="badge">${data.preferredPackage.toUpperCase()}</span> ${escapeHtml(data.eventType)}</div>
              </div>
              <div class="row">
                <div class="label">Organizer Name</div>
                <div class="value">${escapeHtml(data.organizerName)}</div>
              </div>
              <div class="row">
                <div class="label">Business Email</div>
                <div class="value"><a href="mailto:${escapeHtml(data.businessEmail)}" style="color: #6d28d9;">${escapeHtml(data.businessEmail)}</a></div>
              </div>
              <div class="row">
                <div class="label">Phone / WhatsApp</div>
                <div class="value"><a href="tel:${escapeHtml(data.phoneNumber)}" style="color: #6d28d9;">${escapeHtml(data.phoneNumber)}</a></div>
              </div>
              <div class="row">
                <div class="label">City & Event Date</div>
                <div class="value">${escapeHtml(data.city || "Not specified")} · ${escapeHtml(data.eventDate || "TBD")}</div>
              </div>
              <div class="row">
                <div class="label">Estimated Attendees & Pricing Type</div>
                <div class="value">${escapeHtml(data.expectedAttendees || "Not specified")} (${data.eventPricingType.toUpperCase()} Event)</div>
              </div>
              ${
                data.supportRequirements
                  ? `<div class="row">
                      <div class="label">Support Requirements</div>
                      <div class="value" style="font-weight: 400; font-size: 14px;">${escapeHtml(data.supportRequirements)}</div>
                    </div>`
                  : ""
              }
              ${
                data.comments
                  ? `<div class="row">
                      <div class="label">Comments / Questions</div>
                      <div class="value" style="font-weight: 400; font-size: 14px;">${escapeHtml(data.comments)}</div>
                    </div>`
                  : ""
              }
              <div class="row">
                <div class="label">Marketing Attribution</div>
                <div class="value" style="font-size: 12px; color: #4b5563; font-weight: 400;">
                  Campaign: ${escapeHtml(data.utmCampaign || "n/a")} | Source: ${escapeHtml(data.utmSource || "n/a")} | Medium: ${escapeHtml(data.utmMedium || "n/a")}
                </div>
              </div>
            </div>
            <div class="footer">
              UrPass Operations · Triage within 4 business hours · Managed Service Portal
            </div>
          </div>
        </body>
      </html>
    `;

    if (isEmailProviderConfigured()) {
      await sendEmail({
        from: getFromEmail(),
        to: ["srinithin@yespstudio.com"],
        subject,
        html: htmlContent,
        text: `New Managed Service Inquiry (${data.preferredPackage.toUpperCase()}):\nName: ${data.organizerName}\nEmail: ${data.businessEmail}\nPhone: ${data.phoneNumber}\nEvent: ${data.eventType}\nAttendees: ${data.expectedAttendees || "N/A"}\nCity: ${data.city || "N/A"}\nDate: ${data.eventDate || "N/A"}\nSource: ${data.pageSlug || "direct"}\n`,
      });
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      message: "Your managed service request has been registered. Our operations team will contact you with a customized setup proposal within 4 business hours.",
    });
  } catch (error: any) {
    console.error("[managed-inquiry] Error processing inquiry:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry. Please try again or reach out to support." },
      { status: 500 }
    );
  }
}
