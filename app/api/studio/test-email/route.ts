import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  type TicketDesignConfig,
  sanitizeTicketDesign,
  DEFAULT_TICKET_DESIGN,
} from "@/lib/pass-design";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { toEmail, eventName, config } = body as {
      toEmail?: string;
      eventName?: string;
      config?: TicketDesignConfig;
    };

    if (!toEmail || !toEmail.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const safeConfig: TicketDesignConfig = config
      ? sanitizeTicketDesign(config)
      : DEFAULT_TICKET_DESIGN;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey.startsWith("re_your")) {
      console.log(`[test-ticket-email] RESEND_API_KEY not configured. Simulated test ticket to: ${toEmail}`);
      return NextResponse.json({ success: true, simulated: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from = process.env.EMAIL_FROM || "URPASS <noreply@urpass.space>";

    const isDark = safeConfig.template === "dark";
    const radius =
      safeConfig.shape === "rounded" ? "28px" : safeConfig.shape === "compact" ? "12px" : "18px";
    const logoHtml = safeConfig.logoUrl
      ? `<img src="${safeConfig.logoUrl}" alt="Logo" style="max-height: 36px; max-width: 140px; margin: 0 auto 12px; display: block; object-fit: contain;" />`
      : `<div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: ${safeConfig.primaryColor}; text-transform: uppercase; margin-bottom: 12px;">URPASS</div>`;
    const customMsgHtml = safeConfig.customMessage
      ? `<div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #e5e7eb; font-size: 11px; font-style: italic; color: #6b7280;">&ldquo;${safeConfig.customMessage}&rdquo;</div>`
      : "";

    await resend.emails.send({
      from,
      to: toEmail,
      subject: `[TEST TICKET] Your entry pass for ${eventName || "Your Event"}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
          <div style="max-width: 360px; margin: 0 auto; background: ${isDark ? "#121216" : "#ffffff"}; color: ${isDark ? "#ffffff" : "#111827"}; border-radius: ${radius}; border: 1px solid ${isDark ? "#262626" : "#e5e7eb"}; overflow: hidden; padding: 32px 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
            ${logoHtml}
            <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 8px; text-transform: uppercase; color: ${isDark ? "#ffffff" : "#111827"};">
              ${eventName || "Your Event"}
            </h2>
            <p style="font-size: 12px; color: #6b7280; margin: 0 0 16px;">
              24 OCT 2026 | 10:00 AM
            </p>
            <div style="background: ${isDark ? "#1e1e24" : "#f3f4f6"}; border-radius: 12px; padding: 24px; margin: 16px 0; font-size: 12px; color: #9ca3af; font-family: monospace;">
              [ QR CODE - SAMPLE TICKET ]
            </div>
            <p style="font-size: 16px; font-weight: 700; margin: 12px 0 4px; color: ${isDark ? "#ffffff" : "#111827"};">
              Haarishmitha
            </p>
            <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background: ${safeConfig.primaryColor}15; color: ${safeConfig.primaryColor}; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">
              VIP PASS
            </div>
            <div style="border-top: 1px solid ${isDark ? "#262626" : "#e5e7eb"}; margin-top: 16px; padding-top: 12px; font-size: 10px; font-family: monospace; color: #9ca3af;">
              TICKET ID: #URP-02891
            </div>
            ${customMsgHtml}
          </div>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 20px;">
            This is a test ticket email sent from Urpass Ticket Studio.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send test ticket email:", err);
    return NextResponse.json(
      { error: "Failed to dispatch test email. Please check email address." },
      { status: 500 }
    );
  }
}
