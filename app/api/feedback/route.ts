import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  support: "🛟 Event Support & Assistance",
  bug: "🐛 Bug report",
  feature: "💡 Feature request",
  compliment: "👍 Compliment",
  other: "💬 Other",
};

const RATING_LABELS = ["", "Poor ⭐", "Fair ⭐⭐", "Good ⭐⭐⭐", "Great ⭐⭐⭐⭐", "Excellent ⭐⭐⭐⭐⭐"];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, email, category, rating, message, eventId, eventName, urgency } = body ?? {};

  if (!message || typeof message !== "string" || message.trim().length < 5) {
    return NextResponse.json({ error: "Message must be at least 5 characters" }, { status: 400 });
  }
  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating is required (1–5)" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const categoryLabel = CATEGORY_LABELS[category] ?? "💬 Feedback / Support";
  const ratingLabel = RATING_LABELS[rating] ?? rating;
  const senderName = name?.trim() || "Event Creator";
  const replyToHeader = email ? [email] : undefined;

  const isUrgent = urgency === "urgent" || urgency === "critical";
  const subjectPrefix = isUrgent
    ? "🚨 [URGENT Event Support]"
    : eventName
    ? `[Event Creator Feedback - ${eventName}]`
    : "[URPASS Feedback]";

  const subject = `${subjectPrefix} ${categoryLabel} — ${ratingLabel}`;

  // Log in organizer notifications if user is authenticated
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("organizer_notifications").insert({
        user_id: user.id,
        event_id: eventId || null,
        title: "Support Request Received",
        message: `Your inquiry for "${eventName || "your event"}" (${categoryLabel}) has been logged. Our team is on it!`,
        type: "feedback",
        link: eventId ? `/event/${eventId}` : "/dashboard",
      });
    }
  } catch (err) {
    console.warn("Could not insert organizer notification:", err);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_your")) {
    console.warn("[email] RESEND_API_KEY not configured — feedback email skipped in development");
    return NextResponse.json({ ok: true, devMode: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "URPASS Support <noreply@urpass.space>",
    to: ["srinithin@yespstudio.com"],
    ...(replyToHeader ? { replyTo: replyToHeader } : {}),
    subject,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;font-size:14px;color:#1e293b;max-width:580px;line-height:1.6">
        <div style="background:#6D28D9;color:#ffffff;padding:16px 20px;border-radius:12px 12px 0 0">
          <h2 style="margin:0;font-size:18px;font-weight:700">Event Creator Support & Feedback</h2>
          <p style="margin:4px 0 0 0;font-size:12px;opacity:0.85">Submitted via URPASS Event Management Console</p>
        </div>
        
        <div style="border:1px solid #e2e8f0;border-top:none;padding:20px;border-radius:0 0 12px 12px;background:#ffffff">
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            ${eventName ? `
            <tr>
              <td style="padding:6px 0;color:#64748b;width:120px;font-weight:600">Event:</td>
              <td style="padding:6px 0;font-weight:700;color:#0f172a">${escapeHtml(eventName)} ${eventId ? `<span style="font-size:11px;color:#94a3b8;font-weight:400">(${escapeHtml(eventId)})</span>` : ""}</td>
            </tr>` : ""}
            ${urgency ? `
            <tr>
              <td style="padding:6px 0;color:#64748b;font-weight:600">Priority:</td>
              <td style="padding:6px 0"><span style="background:${isUrgent ? "#fee2e2" : "#f1f5f9"};color:${isUrgent ? "#b91c1c" : "#475569"};padding:3px 8px;border-radius:6px;font-size:12px;font-weight:700;text-transform:uppercase">${escapeHtml(urgency)}</span></td>
            </tr>` : ""}
            <tr>
              <td style="padding:6px 0;color:#64748b;font-weight:600">Category:</td>
              <td style="padding:6px 0;font-weight:600;color:#0f172a">${escapeHtml(categoryLabel)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-weight:600">Rating:</td>
              <td style="padding:6px 0;font-weight:600;color:#f59e0b">${escapeHtml(String(ratingLabel))}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-weight:600">Creator Name:</td>
              <td style="padding:6px 0;font-weight:600">${escapeHtml(senderName)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-weight:600">Creator Email:</td>
              <td style="padding:6px 0"><a href="mailto:${email ? escapeHtml(email) : ""}" style="color:#6D28D9;font-weight:600">${email ? escapeHtml(email) : "not provided"}</a></td>
            </tr>
          </table>

          <div style="margin-top:16px">
            <strong style="color:#0f172a;display:block;margin-bottom:8px">Message / Request:</strong>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;white-space:pre-wrap;color:#334155;font-size:13px">${escapeHtml(message.trim())}</div>
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("feedback email error:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
