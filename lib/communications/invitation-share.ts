import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl, getSupabaseServiceRoleKey } from "@/lib/supabase/config";
import { cleanPassToken } from "@/lib/passes/public-pass";
import { formatTimeWithAmPm } from "@/lib/utils";
import type { WhatsAppNotificationToggles } from "@/lib/communications/types";

export type ShareInvitationStatus =
  | "active"
  | "not_found"
  | "revoked"
  | "cancelled"
  | "expired"
  | "sharing_disabled";

export interface ShareInvitationData {
  status: ShareInvitationStatus;
  canShare: boolean;
  passToken: string;
  sanitizedToken: string;
  passUrl: string;
  shareUrl: string;
  eventName: string;
  eventDate: string | null;
  eventTime: string | null;
  venue: string | null;
  attendeeName: string;
  organizerName?: string | null;
  templateName?: string | null;
  invitationText: string;
  whatsappUrl: string;
  whatsappWebUrl: string;
  reason?: string;
}

function getAdminClient() {
  if ((globalThis as any).__urpass_admin_client) {
    return (globalThis as any).__urpass_admin_client;
  }
  const serviceRoleKey = getSupabaseServiceRoleKey();
  return createAdminClient(getSupabaseUrl(), serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Builds universal and desktop WhatsApp prefilled sharing URLs without double encoding.
 */
export function buildWhatsAppUrls(
  text: string,
  phone?: string | null
): { whatsappUrl: string; whatsappWebUrl: string } {
  const encodedText = encodeURIComponent(text);

  let cleanPhone = "";
  if (phone) {
    cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
  }

  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  const whatsappWebUrl = cleanPhone
    ? `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://web.whatsapp.com/send?text=${encodedText}`;

  return { whatsappUrl, whatsappWebUrl };
}

/**
 * Reconstructs the exact WhatsApp invitation message text based on the
 * approved template format (e.g. urpass_space, urpass_ticket, nivi1, or default),
 * preserving all emojis, line breaks, attendee pass URL, and appending the reusable share URL.
 */
export function buildWhatsAppInvitationText({
  eventName,
  eventDate,
  eventTime,
  venue,
  attendeeName,
  passUrl,
  shareUrl,
  templateName,
  orgName,
}: {
  eventName: string;
  eventDate?: string | null;
  eventTime?: string | null;
  venue?: string | null;
  attendeeName?: string | null;
  passUrl: string;
  shareUrl: string;
  templateName?: string | null;
  orgName?: string | null;
}): string {
  const tpl = (templateName || "urpass_space").trim().toLowerCase();
  const name = (attendeeName || "").trim() || "Guest";
  const title = (eventName || "").trim() || "Event";
  const venueText = (venue || "").trim() || "Confirmed on Pass";

  const dateText = eventDate
    ? new Date(eventDate).toLocaleDateString("en-IN", { dateStyle: "medium" })
    : "Upcoming";

  const timeFormatted = formatTimeWithAmPm(eventTime);
  const timeText = timeFormatted || (eventDate && eventDate.includes("T")
    ? new Date(eventDate).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "");

  const teamName = orgName?.trim() || "Team UrPass";

  // Template 1: nivi1 / nivi (Date, Time, Venue, Pass URL embedded in body)
  if (tpl === "nivi" || tpl === "nivi1") {
    const longDateText = eventDate
      ? new Date(eventDate).toLocaleDateString("en-IN", {
          dateStyle: "long",
          timeZone: "Asia/Kolkata",
        })
      : dateText;

    const niviTimeText =
      timeText ||
      (eventDate && eventDate.includes("T")
        ? new Date(eventDate).toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          })
        : "11:00 AM");

    return [
      `📅 *Date:* ${longDateText}`,
      `⏰ *Time:* ${niviTimeText}`,
      `📍 *Venue:* ${venueText}`,
      "",
      `🎟️ *View Digital Pass:*`,
      `${passUrl}`,
      "",
      `📲 *Share Invitation:*`,
      `${shareUrl}`,
    ].join("\n");
  }

  // Template 2: urpass_ticket (Hi {{1}}, Your registration for *{{2}}* has been confirmed! Date: {{3}}, Time: {{4}}, Venue: {{5}})
  if (tpl === "urpass_ticket" || tpl.includes("urpass_ticket")) {
    return [
      `Hi ${name}, Your registration for *${title}* has been confirmed! 🎟️`,
      "",
      `📅 *Date:* ${dateText}`,
      `⏰ *Time:* ${timeText || "Confirmed on Pass"}`,
      `📍 *Venue:* ${venueText}`,
      "",
      `🔗 *View Digital Pass:*`,
      `${passUrl}`,
      "",
      `📲 *Share Invitation:*`,
      `${shareUrl}`,
      "",
      `Show this pass at the entrance for instant check-in!`,
    ].join("\n");
  }

  // Template 3: urpass_space & Default Approved Format
  // Body: Hi {{1}},\n\nYour registration for *{{2}}* has been confirmed! ✅\n\n *Date:* {{3}}\n *Venue:* {{4}}\n\n🎟️ Your digital event pass is ready.\n\nPlease use the button below to view your QR pass and present it at the event entrance.\n\nThank you for registering!\n\n*Team UrPass*
  const timeLine = timeText ? `⏰ *Time:* ${timeText}\n` : "";

  return [
    `Hi ${name},`,
    "",
    `Your registration for *${title}* has been confirmed! ✅`,
    "",
    `📅 *Date:* ${dateText}`,
    `${timeLine}📍 *Venue:* ${venueText}`,
    "",
    `🎟️ Your digital event pass is ready.`,
    "",
    `🔗 *View Digital Pass:*`,
    `${passUrl}`,
    "",
    `📲 *Share this invitation with friends/colleagues:*`,
    `${shareUrl}`,
    "",
    `Please present your QR pass at the entrance.`,
    "",
    `Thank you for registering!`,
    "",
    `*${teamName}*`,
  ].join("\n");
}

/**
 * Retrieves the pass, event, and organizer configuration for WhatsApp invitation sharing.
 * Strictly verifies permissions, sanitizes tokens, excludes private PII, and handles
 * revoked, cancelled, and expired states gracefully.
 */
export async function getShareInvitationData(
  passToken: string
): Promise<ShareInvitationData> {
  const sanitizedToken = cleanPassToken(passToken);
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space").replace(/\/+$/, "");
  const passUrl = `${appUrl}/pass/${sanitizedToken}`;
  const shareUrl = `${appUrl}/share/${sanitizedToken}`;

  const defaultFailedResult = (
    status: ShareInvitationStatus,
    reason: string,
    eventName = "Event"
  ): ShareInvitationData => ({
    status,
    canShare: false,
    passToken: passToken || "",
    sanitizedToken: sanitizedToken || "",
    passUrl,
    shareUrl,
    eventName,
    eventDate: null,
    eventTime: null,
    venue: null,
    attendeeName: "Guest",
    organizerName: null,
    templateName: null,
    invitationText: "",
    whatsappUrl: "",
    whatsappWebUrl: "",
    reason,
  });

  if (!sanitizedToken) {
    return defaultFailedResult("not_found", "Invalid or missing pass token.");
  }

  const admin = getAdminClient();

  // 1. Fetch pass by pass_token with strictly bounded projection
  const { data: pass, error: passErr } = await admin
    .from("passes")
    .select("pass_token, pass_type, status, attendee_id, event_id")
    .or(`pass_token.eq.${sanitizedToken},pass_token.eq.${passToken}`)
    .maybeSingle();

  if (passErr || !pass) {
    return defaultFailedResult("not_found", "Invitation pass not found.");
  }

  const passStatus = (pass.status || "").toLowerCase();
  if (passStatus === "revoked") {
    return defaultFailedResult("revoked", "This pass has been revoked by the organizer.");
  }
  if (passStatus === "cancelled") {
    return defaultFailedResult("cancelled", "This pass has been cancelled.");
  }
  if (passStatus === "expired") {
    return defaultFailedResult("expired", "This invitation has expired.");
  }

  // 2. Fetch attendee & event details
  const [{ data: attendee }, { data: event }] = await Promise.all([
    admin
      .from("attendees")
      .select("id, name, application_status")
      .eq("id", pass.attendee_id)
      .maybeSingle(),
    admin
      .from("events")
      .select(
        "id, name, description, event_date, start_time, end_time, venue, event_type, status, organizer_id, custom_pass_design, whatsapp_settings"
      )
      .eq("id", pass.event_id)
      .maybeSingle(),
  ]);

  if (!event) {
    return defaultFailedResult("not_found", "Associated event not found.");
  }

  const eventName = event.name || "Event";

  // Check event status
  if (event.status === "cancelled") {
    return defaultFailedResult(
      "cancelled",
      "This event has been cancelled by the organizer.",
      eventName
    );
  }

  // Check organizer permissions for pass sharing
  const whatsappSettings = (event.whatsapp_settings || {}) as WhatsAppNotificationToggles;
  const customPassDesign = (event.custom_pass_design || {}) as Record<string, any>;

  if (
    whatsappSettings.allow_pass_sharing === false ||
    customPassDesign.allow_pass_sharing === false
  ) {
    return defaultFailedResult(
      "sharing_disabled",
      "The event organizer has disabled WhatsApp invitation sharing for this pass.",
      eventName
    );
  }

  // Fetch organizer branding if available
  let orgName: string | null = null;
  if (event.organizer_id) {
    const { data: profile } = await admin
      .from("profiles")
      .select("org_name")
      .eq("user_id", event.organizer_id)
      .maybeSingle();
    orgName = profile?.org_name || null;
  }

  // Privacy Protection: If organizer set showAttendeeName to false, hide name
  const attendeeName =
    customPassDesign.showAttendeeName === false
      ? "Guest"
      : attendee?.name?.trim() || "Guest";

  const templateName =
    whatsappSettings.template_name ||
    process.env.WHATSAPP_TEMPLATE_TICKET ||
    process.env.WHATSAPP_TEMPLATE_NAME ||
    "urpass_space";

  const invitationText = buildWhatsAppInvitationText({
    eventName,
    eventDate: event.event_date,
    eventTime: event.start_time,
    venue: event.venue,
    attendeeName,
    passUrl,
    shareUrl,
    templateName,
    orgName,
  });

  const { whatsappUrl, whatsappWebUrl } = buildWhatsAppUrls(invitationText);

  return {
    status: "active",
    canShare: true,
    passToken: pass.pass_token,
    sanitizedToken,
    passUrl,
    shareUrl,
    eventName,
    eventDate: event.event_date,
    eventTime: event.start_time,
    venue: event.venue,
    attendeeName,
    organizerName: orgName,
    templateName,
    invitationText,
    whatsappUrl,
    whatsappWebUrl,
  };
}
