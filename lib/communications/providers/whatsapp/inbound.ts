import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { normalizePhone, formatTicketId } from "../../utils";
import { whatsAppProvider } from "./provider";

function getAdminClient() {
  if (process.env.NODE_ENV === "test") return null;
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createAdminClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export interface InboundMessageContext {
  fromPhone: string;
  messageId: string;
  text: string;
  timestamp?: string;
}

export interface InboundProcessingResult {
  handled: boolean;
  action: "opt_out" | "opt_in" | "command" | "unrecognized" | "ignored";
  command?: string;
  replySent?: boolean;
  error?: string;
}

/**
 * Processes incoming attendee messages from Meta WhatsApp webhook
 */
export async function handleInboundWhatsAppMessage(
  ctx: InboundMessageContext
): Promise<InboundProcessingResult> {
  const normalizedPhone = normalizePhone(ctx.fromPhone);
  if (!normalizedPhone) {
    return { handled: false, action: "ignored", error: "Invalid phone number" };
  }

  const rawText = (ctx.text || "").trim();
  const lowerText = rawText.toLowerCase();

  // ── 1. Process Opt-Out ("STOP", "UNSUBSCRIBE", "CANCEL", "OPTOUT", "QUIT") ──
  const optOutKeywords = ["stop", "unsubscribe", "optout", "opt-out", "cancel", "quit", "revoke"];
  if (optOutKeywords.includes(lowerText)) {
    const admin = getAdminClient();
    if (admin) {
      try {
        // Find matching attendees by normalized phone
        const { data: attendees } = await admin
          .from("attendees")
          .select("id, event_id")
          .or(`phone.eq.${normalizedPhone},phone.eq.${normalizedPhone.replace(/^\+/, "")}`);

        if (attendees && attendees.length > 0) {
          const attendeeIds = attendees.map((a) => a.id);
          // Revoke consent
          await admin
            .from("attendees")
            .update({
              whatsapp_consent: false,
              whatsapp_consent_at: new Date().toISOString(),
            })
            .in("id", attendeeIds);

          // Record audit log entries
          const auditEntries = attendees.map((a) => ({
            attendee_id: a.id,
            event_id: a.event_id,
            channel: "WHATSAPP",
            consent_granted: false,
            disclosure_version: "urpass_wa_consent_v1",
            source: "inbound_whatsapp_stop",
          }));
          await admin.from("attendee_consent_audit").insert(auditEntries);
        }
      } catch (err) {
        console.error("[Inbound WhatsApp] Error revoking consent:", err);
      }
    }

    const replyText =
      "You have unsubscribed from WhatsApp notifications from UrPass. You will no longer receive ticket updates on WhatsApp.\n\nReply START or UNSTOP anytime to reactivate notifications.";

    const sendRes = await whatsAppProvider.sendTicketWhatsApp({
      eventId: "opt-out",
      eventName: "UrPass Notification Center",
      ticketId: "OPT-OUT",
      passToken: "opt-out",
      attendeeId: "system",
      attendeeName: "Attendee",
      email: "optout@urpass.space",
      phone: normalizedPhone,
      isSessionReply: true,
      customMessage: replyText,
      whatsappConsent: true,
    });

    return {
      handled: true,
      action: "opt_out",
      replySent: sendRes.success,
    };
  }

  // ── 2. Process Opt-In ("START", "UNSTOP", "OPTIN") ──
  const optInKeywords = ["start", "unstop", "optin", "opt-in"];
  if (optInKeywords.includes(lowerText)) {
    const admin = getAdminClient();
    if (admin) {
      try {
        const { data: attendees } = await admin
          .from("attendees")
          .select("id, event_id")
          .or(`phone.eq.${normalizedPhone},phone.eq.${normalizedPhone.replace(/^\+/, "")}`);

        if (attendees && attendees.length > 0) {
          const attendeeIds = attendees.map((a) => a.id);
          await admin
            .from("attendees")
            .update({
              whatsapp_consent: true,
              whatsapp_consent_at: new Date().toISOString(),
            })
            .in("id", attendeeIds);

          const auditEntries = attendees.map((a) => ({
            attendee_id: a.id,
            event_id: a.event_id,
            channel: "WHATSAPP",
            consent_granted: true,
            disclosure_version: "urpass_wa_consent_v1",
            source: "inbound_whatsapp_start",
          }));
          await admin.from("attendee_consent_audit").insert(auditEntries);
        }
      } catch (err) {
        console.error("[Inbound WhatsApp] Error granting consent:", err);
      }
    }

    const replyText =
      "✅ Welcome back! Your WhatsApp notifications for UrPass have been reactivated.\n\nType */pass* to retrieve your tickets or */help* to see all commands.";

    const sendRes = await whatsAppProvider.sendTicketWhatsApp({
      eventId: "opt-in",
      eventName: "UrPass Notification Center",
      ticketId: "OPT-IN",
      passToken: "opt-in",
      attendeeId: "system",
      attendeeName: "Attendee",
      email: "optin@urpass.space",
      phone: normalizedPhone,
      isSessionReply: true,
      customMessage: replyText,
      whatsappConsent: true,
    });

    return {
      handled: true,
      action: "opt_in",
      replySent: sendRes.success,
    };
  }

  // ── 3. Parse Inbound Commands ──
  const cleanCmd = lowerText.startsWith("/") ? lowerText.slice(1) : lowerText;

  let replyText = "";
  let matchedCommand = cleanCmd;

  if (cleanCmd === "pass" || cleanCmd === "ticket" || cleanCmd === "tickets") {
    matchedCommand = "/pass";
    const admin = getAdminClient();
    let passData: {
      eventName: string;
      ticketId: string;
      passToken: string;
      passType: string;
    } | null = null;

    if (admin) {
      try {
        const { data: passes } = await admin
          .from("passes")
          .select("pass_token, pass_type, event:events(name, event_date), attendee:attendees!attendee_id(name, phone)")
          .or(`attendee.phone.eq.${normalizedPhone},attendee.phone.eq.${normalizedPhone.replace(/^\+/, "")}`)
          .neq("status", "revoked")
          .order("created_at", { ascending: false })
          .limit(1);

        if (passes && passes.length > 0) {
          const p = passes[0];
          const eventObj = Array.isArray(p.event) ? p.event[0] : p.event;
          passData = {
            eventName: eventObj?.name || "Your Event",
            ticketId: formatTicketId(p.pass_token),
            passToken: p.pass_token,
            passType: p.pass_type || "Standard",
          };
        }
      } catch (err) {
        console.error("[Inbound WhatsApp] Error looking up pass:", err);
      }
    }

    if (passData) {
      replyText = `🎟️ *Your UrPass Ticket*\n\nEvent: *${passData.eventName}*\nTicket ID: *${passData.ticketId}*\nPass Type: *${passData.passType}*\n\n📱 *View & Scan QR Pass:*\nhttps://urpass.space/pass/${passData.passToken}\n\nAdd this page to your home screen or bookmark it for gate entry.`;
    } else {
      replyText = `We could not find an active ticket associated with *${normalizedPhone}*.\n\nIf you registered with another number or email, please log in at https://urpass.space to view your passes.`;
    }
  } else if (cleanCmd === "events" || cleanCmd === "myevents") {
    matchedCommand = "/events";
    const admin = getAdminClient();
    let eventList: Array<{ name: string; date: string | null; passToken?: string }> = [];

    if (admin) {
      try {
        const { data: passes } = await admin
          .from("passes")
          .select("pass_token, event:events(name, event_date), attendee:attendees!attendee_id(phone)")
          .or(`attendee.phone.eq.${normalizedPhone},attendee.phone.eq.${normalizedPhone.replace(/^\+/, "")}`)
          .neq("status", "revoked")
          .order("created_at", { ascending: false })
          .limit(5);

        if (passes) {
          eventList = passes.map((p) => {
            const ev = Array.isArray(p.event) ? p.event[0] : p.event;
            return {
              name: ev?.name || "Event",
              date: ev?.event_date || null,
              passToken: p.pass_token,
            };
          });
        }
      } catch (err) {
        console.error("[Inbound WhatsApp] Error fetching events:", err);
      }
    }

    if (eventList.length > 0) {
      replyText =
        "📅 *Your Registered Events*\n\n" +
        eventList
          .map(
            (e, idx) =>
              `${idx + 1}. *${e.name}*\n   Date: ${
                e.date ? new Date(e.date).toDateString() : "TBA"
              }\n   Pass: https://urpass.space/pass/${e.passToken}`
          )
          .join("\n\n");
    } else {
      replyText =
        "You currently have no registered events with this number.\n\nBrowse upcoming events at https://urpass.space";
    }
  } else if (cleanCmd === "status") {
    matchedCommand = "/status";
    const admin = getAdminClient();
    let statusText: string | null = null;

    if (admin) {
      try {
        const { data: attendees } = await admin
          .from("attendees")
          .select("application_status, pass_status, event:events(name)")
          .or(`phone.eq.${normalizedPhone},phone.eq.${normalizedPhone.replace(/^\+/, "")}`)
          .order("created_at", { ascending: false })
          .limit(1);

        if (attendees && attendees.length > 0) {
          const att = attendees[0];
          const ev = Array.isArray(att.event) ? att.event[0] : att.event;
          statusText = `📋 *Registration Status*\n\nEvent: *${ev?.name || "Event"}*\nApplication: *${(
            att.application_status || "approved"
          ).toUpperCase()}*\nPass Status: *${
            att.pass_status === "generated" ? "Pass Issued ✅" : "Processing"
          }*`;
        }
      } catch (err) {
        console.error("[Inbound WhatsApp] Error checking status:", err);
      }
    }

    replyText =
      statusText ||
      `No pending registrations found for ${normalizedPhone}.\nRegister at https://urpass.space`;
  } else if (cleanCmd === "register") {
    matchedCommand = "/register";
    replyText =
      "🌐 *Register for Events on UrPass*\n\nDiscover trending conferences, college fests, and concerts:\nhttps://urpass.space\n\nFast checkout with UPI & instant mobile QR passes.";
  } else if (cleanCmd === "support") {
    matchedCommand = "/support";
    replyText =
      "💬 *UrPass Attendee Support*\n\nNeed assistance with your ticket or booking?\n• Email: support@urpass.space\n• Portal: https://urpass.space/support\n\nFor event-specific questions, please refer to the organizer contact listed on your pass.";
  } else {
    // Unrecognized input or /help
    matchedCommand = "/help";
    replyText =
      "🤖 *UrPass WhatsApp Assistant*\n\nHere are available commands:\n• */pass* — Retrieve your active event pass\n• */events* — View your registered events\n• */status* — Check registration status\n• */register* — Discover & register for events\n• */support* — Contact platform support\n• *STOP* — Unsubscribe from WhatsApp notifications\n\nVisit https://urpass.space";
  }

  // Send the session reply within the 24h customer service window
  const sendRes = await whatsAppProvider.sendTicketWhatsApp({
    eventId: "inbound-reply",
    eventName: "UrPass Assistant",
    ticketId: "ASSIST",
    passToken: "assist",
    attendeeId: "system",
    attendeeName: "Attendee",
    email: "bot@urpass.space",
    phone: normalizedPhone,
    isSessionReply: true,
    customMessage: replyText,
    whatsappConsent: true,
  });

  return {
    handled: true,
    action: "command",
    command: matchedCommand,
    replySent: sendRes.success,
  };
}
