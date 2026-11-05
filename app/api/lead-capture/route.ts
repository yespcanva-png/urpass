import { NextRequest, NextResponse } from "next/server";
import { getFromEmail, isEmailProviderConfigured, sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, email, orgName, eventType, estimatedAttendees, market, pageSlug, source } = body ?? {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const cleanName = typeof name === "string" ? name.trim().slice(0, 100) : "Organizer";
  const cleanEmail = email.trim().toLowerCase().slice(0, 120);
  const cleanOrg = typeof orgName === "string" ? orgName.trim().slice(0, 120) : "Not specified";
  const cleanType = typeof eventType === "string" ? eventType.slice(0, 60) : "Event";
  const cleanAttendees = typeof estimatedAttendees === "string" ? estimatedAttendees.slice(0, 30) : "Unknown";

  console.info(`[UK Lead Capture] Received demo/waitlist request from ${cleanEmail} (${cleanOrg}) for page: ${pageSlug || "/"}`);

  if (isEmailProviderConfigured()) {
    try {
      await sendEmail({
        from: getFromEmail(),
        to: ["srinithin@yespstudio.com"],
        replyTo: cleanEmail,
        subject: `[UK Lead - ${market || "GB"}] Demo Request from ${cleanName} (${cleanOrg})`,
        html: `
          <h2>New UK Organizer Lead</h2>
          <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
          <p><strong>Organization / SU:</strong> ${escapeHtml(cleanOrg)}</p>
          <p><strong>Event Type:</strong> ${escapeHtml(cleanType)}</p>
          <p><strong>Estimated Attendees:</strong> ${escapeHtml(cleanAttendees)}</p>
          <p><strong>Market:</strong> ${escapeHtml(market || "GB")}</p>
          <p><strong>Source / Page:</strong> ${escapeHtml(pageSlug || "UK Organic")}</p>
        `,
      });
    } catch (err) {
      console.error("[UK Lead Capture] Failed to dispatch email notification:", err);
    }
  }

  return NextResponse.json({ ok: true, message: "Lead captured successfully" });
}
