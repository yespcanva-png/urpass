"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  communicationService,
  EventCommunicationSettings,
  formatTicketId,
  normalizePhone,
  isValidE164,
  buildTicketUrl,
} from "@/lib/communications";

function adminClient() {
  return createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// In-memory server-side rate limit: 1 resend per 30 seconds per passToken+channel
const resendRateLimit = new Map<string, number>();

interface AuthUser {
  id: string;
  email?: string;
}

interface VerifiedEvent {
  id: string;
  name: string;
  organizer_id: string;
  organization_id: string | null;
  event_date: string | null;
  venue: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyEventOrganizer(
  supabase: any,
  user: AuthUser,
  eventId: string
): Promise<VerifiedEvent | null> {
  const { data } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id, event_date, venue")
    .eq("id", eventId)
    .single();

  const event = data as VerifiedEvent | null;
  if (!event) return null;

  if (event.organizer_id === user.id) {
    return event;
  }

  if (event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .maybeSingle();

    if (member) return event;
  }

  return null;
}

/**
 * Updates event ticket delivery and SMS/DLT settings
 */
export async function updateEventCommunicationSettings(
  eventId: string,
  settings: Partial<EventCommunicationSettings>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) {
    return { error: "You are not authorized to configure communications for this event." };
  }

  const admin = adminClient();
  const db = admin || supabase;

  const { error } = await db
    .from("events")
    .update({
      ...(settings.sms_enabled !== undefined ? { sms_enabled: settings.sms_enabled } : {}),
      ...(settings.whatsapp_enabled !== undefined ? { whatsapp_enabled: settings.whatsapp_enabled } : {}),
      ...(settings.email_enabled !== undefined ? { email_enabled: settings.email_enabled } : {}),
      ...(settings.sms_fallback_enabled !== undefined
        ? { sms_fallback_enabled: settings.sms_fallback_enabled }
        : {}),
      ...(settings.sms_sender_id !== undefined ? { sms_sender_id: settings.sms_sender_id } : {}),
      ...(settings.sms_dlt_entity_id !== undefined ? { sms_dlt_entity_id: settings.sms_dlt_entity_id } : {}),
      ...(settings.sms_dlt_template_id !== undefined ? { sms_dlt_template_id: settings.sms_dlt_template_id } : {}),
      ...(settings.sms_provider !== undefined ? { sms_provider: settings.sms_provider } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/event/${eventId}/settings`);
  return { success: true };
}

/**
 * Sends a test transactional SMS to verify DLT header and template configuration
 */
export async function sendTestSMS(eventId: string, rawPhone: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) {
    return { error: "Unauthorized" };
  }

  const normalized = normalizePhone(rawPhone);
  if (!normalized || !isValidE164(normalized)) {
    return { error: "Please enter a valid phone number with country code (e.g. +919876543210)" };
  }

  const settings = await communicationService.getEventCommunicationSettings(eventId);

  const testPayload = {
    eventId,
    eventName: event.name,
    eventDate: event.event_date,
    venue: event.venue,
    ticketId: "URP-TEST01",
    passToken: "test_preview_pass_token",
    attendeeId: user.id,
    attendeeName: "Test Organizer",
    email: user.email || "test@example.com",
    phone: normalized,
    ticketUrl: buildTicketUrl("test_preview_pass_token"),
    version: `test_${Date.now()}`,
  };

  const res = await communicationService.sendTicketSMS(testPayload, {
    provider: settings.sms_provider || undefined,
    senderId: settings.sms_sender_id || undefined,
    dltEntityId: settings.sms_dlt_entity_id || undefined,
    dltTemplateId: settings.sms_dlt_template_id || undefined,
    force: true,
  });

  if (!res.success) {
    return { error: res.error || "Failed to send test SMS" };
  }

  return { success: true, messageId: res.messageId };
}

/**
 * Resends pass via Email, WhatsApp, or SMS using the EXACT existing ticket/QR credentials.
 * Never regenerates the pass_token or QR.
 */
export async function resendTicketChannel(
  eventId: string,
  passToken: string,
  channel: "EMAIL" | "WHATSAPP" | "SMS"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) {
    return { error: "Unauthorized" };
  }

  // Rate-limiting check
  const lockKey = `${passToken}_${channel}`;
  const lastAttempt = resendRateLimit.get(lockKey) || 0;
  const now = Date.now();
  if (now - lastAttempt < 30000) {
    return { error: "Please wait 30 seconds before resending to this recipient." };
  }
  resendRateLimit.set(lockKey, now);

  const admin = adminClient();
  const db = admin || supabase;

  // Retrieve existing pass and attendee details
  const { data: pass } = await db
    .from("passes")
    .select("id, pass_token, pass_type, attendee:attendees!attendee_id(id, name, email, phone)")
    .eq("pass_token", passToken)
    .eq("event_id", eventId)
    .single();

  if (!pass) {
    return { error: "Ticket not found." };
  }

  const attendee = Array.isArray(pass.attendee) ? pass.attendee[0] : pass.attendee;
  if (!attendee) {
    return { error: "Attendee details not found for this ticket." };
  }

  const ticketPayload = {
    eventId,
    eventName: event.name,
    eventDate: event.event_date,
    venue: event.venue,
    ticketId: formatTicketId(pass.pass_token),
    passToken: pass.pass_token,
    attendeeId: attendee.id,
    attendeeName: attendee.name,
    email: attendee.email,
    phone: attendee.phone,
    passType: pass.pass_type,
    ticketUrl: buildTicketUrl(pass.pass_token),
    version: `resend_${Date.now()}`,
  };

  const settings = await communicationService.getEventCommunicationSettings(eventId);

  if (channel === "SMS") {
    if (!attendee.phone) {
      return { error: "No phone number on record for this attendee." };
    }
    const res = await communicationService.sendTicketSMS(ticketPayload, {
      provider: settings.sms_provider || undefined,
      senderId: settings.sms_sender_id || undefined,
      dltEntityId: settings.sms_dlt_entity_id || undefined,
      dltTemplateId: settings.sms_dlt_template_id || undefined,
      force: true,
    });
    if (!res.success) return { error: res.error || "SMS delivery failed" };
    return { success: true };
  }

  if (channel === "EMAIL") {
    const res = await communicationService.sendTicketEmail(ticketPayload);
    if (!res.success) return { error: res.error || "Email delivery failed" };
    return { success: true };
  }

  if (channel === "WHATSAPP") {
    if (!attendee.phone) {
      return { error: "No phone number on record for this attendee." };
    }
    const res = await communicationService.sendTicketWhatsApp(ticketPayload);
    if (!res.success) return { error: res.error || "WhatsApp delivery failed" };
    return { success: true };
  }

  return { error: "Invalid communication channel requested." };
}

/**
 * Retrieves delivery logs for organizer dashboard with filtering
 */
export async function getEventCommunicationLogs(
  eventId: string,
  filter?: { channel?: string; status?: string }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) {
    return { error: "Unauthorized", logs: [] };
  }

  const admin = adminClient();
  const db = admin || supabase;

  let query = db
    .from("communication_deliveries")
    .select("*, attendee:attendees!attendee_id(name, email, phone)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (filter?.channel && filter.channel !== "ALL") {
    query = query.eq("channel", filter.channel);
  }
  if (filter?.status && filter.status !== "ALL") {
    query = query.eq("status", filter.status);
  }

  const { data, error } = await query;
  if (error) {
    return { error: error.message, logs: [] };
  }

  return { logs: data || [] };
}
