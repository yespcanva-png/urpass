import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  sendSupportTicketNotificationToTeam,
  sendSupportTicketAcknowledgement,
  SupportAttachmentPayload,
} from "@/lib/email";

export const dynamic = "force-dynamic";

const VALID_TOPICS = [
  "Account & Login",
  "Event Setup",
  "Registration & Tickets",
  "QR / Check-in",
  "Billing & Payments",
  "Technical Issue",
  "Feature Request",
  "Other",
];

function generateTicketId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return String(num);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const { email, topic, message, attachment, pageUrl } = body ?? {};

    // 1. Validation
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!topic || typeof topic !== "string" || !VALID_TOPICS.includes(topic)) {
      return NextResponse.json({ error: "Please select a valid support topic." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a message with at least 5 characters." }, { status: 400 });
    }

    if (message.length > 10000) {
      return NextResponse.json({ error: "Message cannot exceed 10,000 characters." }, { status: 400 });
    }

    let attachmentPayload: SupportAttachmentPayload | null = null;
    let attachmentMeta: { name: string; size: number; type: string } | null = null;

    if (attachment && typeof attachment === "object") {
      const { name, size, type, data } = attachment;
      if (size && typeof size === "number" && size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Attachment size must be under 10MB." }, { status: 400 });
      }

      if (data && typeof data === "string") {
        // Strip data:image/...;base64, prefix if present
        const base64Content = data.includes(",") ? data.split(",")[1] : data;
        attachmentPayload = {
          filename: name || "attachment",
          content: base64Content,
          contentType: type || "application/octet-stream",
        };
        attachmentMeta = {
          name: String(name || "attachment"),
          size: Number(size || 0),
          type: String(type || "application/octet-stream"),
        };
      }
    }

    // 2. Generate unique ticket ID
    const ticketId = generateTicketId();
    const cleanEmail = email.trim();
    const cleanTopic = topic.trim();
    const cleanMessage = message.trim();
    const cleanPageUrl = typeof pageUrl === "string" ? pageUrl.slice(0, 1000) : "";

    // 3. Identify user ID if authenticated
    let userId: string | null = null;
    try {
      const supabase = await createServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch (authErr) {
      console.warn("[support] Could not read user session:", authErr);
    }

    // 4. Store in database (with graceful fallback if table not yet migrated)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && serviceRoleKey) {
        const adminClient = createAdminClient(supabaseUrl, serviceRoleKey);
        const { error: insertError } = await adminClient.from("support_tickets").insert({
          ticket_id: ticketId,
          user_id: userId,
          email: cleanEmail,
          topic: cleanTopic,
          message: cleanMessage,
          attachment_name: attachmentMeta?.name ?? null,
          attachment_size: attachmentMeta?.size ?? null,
          attachment_type: attachmentMeta?.type ?? null,
          page_url: cleanPageUrl || null,
          status: "OPEN",
        });

        if (insertError) {
          console.warn("[support] DB insert error into support_tickets:", insertError.message);
        }
      }
    } catch (dbErr) {
      console.warn("[support] Failed to store support ticket in database:", dbErr);
    }

    // 5. Send notification to Urpass support team
    try {
      await sendSupportTicketNotificationToTeam({
        ticketId,
        customerEmail: cleanEmail,
        topic: cleanTopic,
        message: cleanMessage,
        pageUrl: cleanPageUrl,
        userId,
        attachment: attachmentPayload,
      });
    } catch (teamMailErr) {
      console.error("[support] Failed to send support ticket email to team:", teamMailErr);
    }

    // 6. Send acknowledgement email to customer
    try {
      await sendSupportTicketAcknowledgement({
        ticketId,
        customerEmail: cleanEmail,
        topic: cleanTopic,
        message: cleanMessage,
      });
    } catch (ackMailErr) {
      console.warn("[support] Failed to send ticket acknowledgement to customer:", ackMailErr);
    }

    return NextResponse.json({
      ok: true,
      ticketId,
      message: "Support request created successfully",
    });
  } catch (error) {
    console.error("[support] Unexpected error in /api/support:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while submitting your request. Please try again." },
      { status: 500 }
    );
  }
}
