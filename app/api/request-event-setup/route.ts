import { NextRequest, NextResponse } from "next/server";
import { getFromEmail, isEmailProviderConfigured, sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const {
      name,
      phoneNumber,
      email,
      emailOrPhone,
      eventName,
      eventDate,
      eventType,
      expectedAttendees,
      city,
      notes,
    } = body ?? {};

    const contactMethod = (phoneNumber || emailOrPhone || email || "").toString().trim();
    if (!contactMethod) {
      return NextResponse.json({ error: "Contact phone or email is required" }, { status: 400 });
    }

    const cleanName = (name || "Event Organizer").toString().trim();
    const cleanContact = contactMethod;
    const cleanEventType = (eventType || "Not specified").toString().trim();
    const cleanEventName = (eventName || `${cleanEventType} Event`).toString().trim();
    const cleanEventDate = (eventDate || "To be decided").toString().trim();
    const cleanAttendees = (expectedAttendees || "Not specified").toString().trim();
    const cleanCity = (city || "Not specified").toString().trim();
    const cleanNotes = (notes || "").toString().trim();

    const emailSubject = `[UrPass Managed Event Setup] ${cleanEventName} — ${cleanName}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px; color: #111827; }
            .card { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #111827; padding: 24px 28px; color: #ffffff; }
            .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
            .header p { margin: 0; font-size: 13px; color: #9ca3af; }
            .content { padding: 28px; }
            .row { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6; }
            .row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
            .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px; }
            .value { font-size: 15px; font-weight: 600; color: #111827; }
            .value a { color: #6d28d9; text-decoration: none; }
            .footer { padding: 16px 28px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>UrPass — New Managed Setup Request</h1>
              <p>Submitted from UrPass Managed Event Setup landing page</p>
            </div>
            <div class="content">
              <div class="row">
                <div class="label">Organizer Name</div>
                <div class="value">${escapeHtml(cleanName)}</div>
              </div>
              <div class="row">
                <div class="label">Contact (Phone / Email)</div>
                <div class="value">${escapeHtml(cleanContact)}</div>
              </div>
              <div class="row">
                <div class="label">Event Name</div>
                <div class="value">${escapeHtml(cleanEventName)}</div>
              </div>
              <div class="row">
                <div class="label">Event Type</div>
                <div class="value">${escapeHtml(cleanEventType)}</div>
              </div>
              <div class="row">
                <div class="label">Expected Attendees</div>
                <div class="value">${escapeHtml(cleanAttendees)}</div>
              </div>
              <div class="row">
                <div class="label">Event City</div>
                <div class="value">${escapeHtml(cleanCity)}</div>
              </div>
              <div class="row">
                <div class="label">Event Date</div>
                <div class="value">${escapeHtml(cleanEventDate)}</div>
              </div>
              ${
                cleanNotes
                  ? `<div class="row">
                      <div class="label">Additional Notes</div>
                      <div class="value" style="font-weight: 400; font-size: 14px;">${escapeHtml(cleanNotes)}</div>
                    </div>`
                  : ""
              }
              <div class="row">
                <div class="label">Submission Timestamp</div>
                <div class="value" style="font-size: 13px; color: #4b5563;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</div>
              </div>
            </div>
            <div class="footer">
              UrPass Automated Lead Dispatch · Sent directly to srinithin@yespstudio.com
            </div>
          </div>
        </body>
      </html>
    `;

    if (isEmailProviderConfigured()) {
      await sendEmail({
        from: getFromEmail(),
        to: ["srinithin@yespstudio.com"],
        subject: emailSubject,
        html: htmlContent,
        text: `New UrPass Managed Event Setup Request:\n\nName: ${cleanName}\nContact: ${cleanContact}\nEvent Name: ${cleanEventName}\nEvent Type: ${cleanEventType}\nExpected Attendees: ${cleanAttendees}\nCity: ${cleanCity}\nDate: ${cleanEventDate}\nNotes: ${cleanNotes}\n`,
      });
    } else {
      console.warn("[request-event-setup] Email provider not configured, simulated sending to srinithin@yespstudio.com");
    }

    return NextResponse.json({
      ok: true,
      message: "Thank you for your request! Our team will contact you shortly to review your event requirements and provide a custom quote.",
    });
  } catch (error) {
    console.error("[request-event-setup] Error processing setup request:", error);
    return NextResponse.json(
      { error: "Failed to process request. Please try again or reach out to support." },
      { status: 500 }
    );
  }
}
