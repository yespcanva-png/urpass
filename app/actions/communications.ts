"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getUserPlan } from "@/lib/plan";
import {
  communicationService,
  EventCommunicationSettings,
  NotificationAutomationRules,
  formatTicketId,
  normalizePhone,
  isValidE164,
  buildTicketUrl,
  maskPhone,
  getOrganizationCommunicationSettings,
  updateOrganizationCommunicationSettings,
  getWhatsAppSelfServiceConfig,
  saveWhatsAppSelfServiceConfig,
  createManagedWhatsAppServiceRequest,
  getManagedServiceRequests,
  getWhatsAppTemplatesCatalog,
  DEFAULT_AUTOMATION_RULES,
} from "@/lib/communications";
import { isTableMissingError } from "@/lib/org/fallback-store";

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
 * Retrieves event ticket delivery and SMS/DLT settings
 */
export async function getEventCommunicationSettings(eventId: string): Promise<EventCommunicationSettings> {
  return await communicationService.getEventCommunicationSettings(eventId);
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
      ...(settings.whatsapp_settings !== undefined ? { whatsapp_settings: settings.whatsapp_settings } : {}),
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

/** Saves the optional event template override without replacing notification toggles. */
export async function saveWhatsAppTemplateNameAction(eventId: string, name: string, language = "en") {
  if (typeof name !== "string") return { error: "Enter a valid template name." };
  const templateName = name.trim();
  if (typeof language !== "string" || !/^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(language.trim())) {
    return { error: "Enter a valid template language code, such as en or en_US." };
  }
  if (templateName && !/^[a-z0-9_]{1,512}$/.test(templateName)) {
    return { error: "Use only lowercase letters, numbers, and underscores for the template name." };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!await verifyEventOrganizer(supabase, user, eventId)) {
    return { error: "You are not authorized to configure communications for this event." };
  }
  const db = adminClient();
  const { data, error } = await db.from("events").select("whatsapp_settings").eq("id", eventId).single();
  if (error) return { error: error.message };
  const { error: saveError } = await db.from("events").update({
    whatsapp_settings: { ...(data.whatsapp_settings || {}), template_name: templateName, template_language: templateName ? language.trim() : undefined },
    updated_at: new Date().toISOString(),
  }).eq("id", eventId);
  if (saveError) return { error: saveError.message };
  revalidatePath(`/event/${eventId}/communications`);
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

  // Mask destination phone numbers for attendee privacy
  const sanitized = (data || []).map((l: any) => ({
    ...l,
    destination: l.channel === "WHATSAPP" || l.channel === "SMS" ? maskPhone(l.destination) : l.destination,
    attendee: l.attendee ? {
      ...l.attendee,
      phone: l.attendee.phone ? maskPhone(l.attendee.phone) : null,
    } : null,
  }));

  return { logs: sanitized };
}

/**
 * Retrieves unified control panel data for the communication command center
 */
export async function getCommunicationControlPanelData(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) {
    return { error: "Unauthorized access to event communications" };
  }

  const userPlan = await getUserPlan(supabase, user.id);
  const orgId = event.organization_id || `personal_${user.id}`;

  const [orgSettings, selfServiceConfig, managedRequests, templates, eventSettings] = await Promise.all([
    getOrganizationCommunicationSettings(orgId),
    getWhatsAppSelfServiceConfig(orgId),
    getManagedServiceRequests(orgId),
    getWhatsAppTemplatesCatalog(orgId),
    communicationService.getEventCommunicationSettings(eventId),
  ]);

  const admin = adminClient();
  const db = admin || supabase;

  // Aggregate message metrics
  const { data: deliveries } = await db
    .from("communication_deliveries")
    .select("channel, status")
    .eq("event_id", eventId);

  const stats = {
    totalSent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    pending: 0,
    emailCount: 0,
    whatsappCount: 0,
  };

  if (deliveries) {
    for (const d of deliveries) {
      if (d.status === "SENT" || d.status === "DELIVERED" || d.status === "READ") {
        stats.totalSent++;
      }
      if (d.status === "DELIVERED") stats.delivered++;
      if (d.status === "READ") {
        stats.delivered++;
        stats.read++;
      }
      if (d.status === "FAILED") stats.failed++;
      if (d.status === "QUEUED" || d.status === "SENDING") stats.pending++;
      if (d.channel === "EMAIL") stats.emailCount++;
      if (d.channel === "WHATSAPP") stats.whatsappCount++;
    }
  }

  // Fetch recent logs with masked phone
  const { data: rawLogs } = await db
    .from("communication_deliveries")
    .select("*, attendee:attendees!attendee_id(name, email, phone)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .limit(50);

  const sanitizedLogs = (rawLogs || []).map((l: any) => ({
    ...l,
    destination: l.channel === "WHATSAPP" || l.channel === "SMS" ? maskPhone(l.destination) : l.destination,
    attendee: l.attendee ? {
      ...l.attendee,
      phone: l.attendee.phone ? maskPhone(l.attendee.phone) : null,
    } : null,
  }));

  return {
    success: true,
    userPlan: {
      slug: userPlan.slug,
      canWhatsAppSelfService: userPlan.canWhatsAppSelfService,
    },
    event: {
      id: event.id,
      name: event.name,
      eventDate: event.event_date,
      venue: event.venue,
      organizationId: event.organization_id,
    },
    orgSettings,
    selfServiceConfig,
    managedRequests,
    templates,
    defaultWhatsAppTemplateName: process.env.WHATSAPP_TEMPLATE_NAME?.trim() || "urpass_space",
    eventSettings,
    stats,
    recentLogs: sanitizedLogs,
  };
}

/**
 * Toggles master communication switch.
 * When disabled, optional event communications are paused.
 */
export async function toggleMasterCommunicationAction(eventId: string, enabled: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) return { error: "Unauthorized" };

  const orgId = event.organization_id || `personal_${user.id}`;
  await updateOrganizationCommunicationSettings(orgId, {
    enable_communication: enabled,
  });

  const admin = adminClient();
  const db = admin || supabase;
  await db
    .from("events")
    .update({
      email_enabled: enabled,
      whatsapp_enabled: enabled ? undefined : false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  revalidatePath(`/event/${eventId}/communications`);
  return { success: true, enable_communication: enabled };
}

/**
 * Toggles individual communication channel (Email or WhatsApp).
 * Backend enforces that WhatsApp cannot be enabled unless activated.
 */
export async function toggleChannelAction(eventId: string, channel: "email" | "whatsapp", enabled: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) return { error: "Unauthorized" };

  const orgId = event.organization_id || `personal_${user.id}`;
  const orgSettings = await getOrganizationCommunicationSettings(orgId);

  if (channel === "whatsapp" && enabled) {
    const isSelfServiceActive =
      orgSettings.whatsapp_integration_model === "self_service" && orgSettings.whatsapp_setup_status === "active";
    const isManagedActive =
      orgSettings.whatsapp_integration_model === "managed" && orgSettings.whatsapp_setup_status === "active";

    if (!isSelfServiceActive && !isManagedActive) {
      return {
        error:
          "WhatsApp communication cannot be enabled until configured and activated via Self-Service (Business Plan) or UrPass Managed WhatsApp.",
      };
    }
  }

  const updates = channel === "email"
    ? { email_communication: enabled }
    : { whatsapp_communication: enabled };

  await updateOrganizationCommunicationSettings(orgId, updates);

  const admin = adminClient();
  const db = admin || supabase;
  await db
    .from("events")
    .update({
      ...(channel === "email" ? { email_enabled: enabled } : { whatsapp_enabled: enabled }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  revalidatePath(`/event/${eventId}/communications`);
  return { success: true };
}

/**
 * Configures Self-Service WhatsApp.
 * STRICTLY ENFORCED: Business Plan only!
 */
export async function saveSelfServiceWhatsAppAction(
  eventId: string,
  config: {
    waba_id: string;
    phone_number_id: string;
    app_id?: string;
    access_token?: string;
    app_secret?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) return { error: "Unauthorized" };

  // Backend Plan Eligibility Check: Business plan only!
  const userPlan = await getUserPlan(supabase, user.id);
  if (!userPlan.canWhatsAppSelfService) {
    return {
      error:
        "Self-Service WhatsApp integration is exclusively available on the Business plan. Upgrade to Business to connect your own Meta WhatsApp credentials.",
      requiresUpgrade: true,
    };
  }

  const orgId = event.organization_id || `personal_${user.id}`;
  const result = await saveWhatsAppSelfServiceConfig(orgId, config);

  if (!result.success) {
    return { error: result.error || "Failed to verify Meta WhatsApp credentials" };
  }

  const admin = adminClient();
  const db = admin || supabase;
  await db
    .from("events")
    .update({
      whatsapp_enabled: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  revalidatePath(`/event/${eventId}/communications`);
  return { success: true, verifiedName: result.verifiedName };
}

/**
 * Submits an UrPass Managed WhatsApp service request (Paid add-on)
 */
export async function requestManagedWhatsAppAction(
  eventId: string,
  payload: {
    estimated_monthly_volume: string;
    use_case: string;
    contact_email: string;
    contact_phone: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) return { error: "Unauthorized" };

  const orgId = event.organization_id || `personal_${user.id}`;
  const result = await createManagedWhatsAppServiceRequest(orgId, user.id, payload);

  if (!result.success) {
    return { error: result.error || "Failed to submit managed WhatsApp request" };
  }

  revalidatePath(`/event/${eventId}/communications`);
  return { success: true, request: result.request };
}

/**
 * Updates an automation rule item (e.g. registration_confirmed email/whatsapp)
 */
export async function updateAutomationRuleAction(
  eventId: string,
  triggerKey: keyof NotificationAutomationRules,
  channel: "email" | "whatsapp",
  enabled: boolean
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) return { error: "Unauthorized" };

  const orgId = event.organization_id || `personal_${user.id}`;
  const orgSettings = await getOrganizationCommunicationSettings(orgId);

  if (channel === "whatsapp" && enabled) {
    if (orgSettings.whatsapp_setup_status !== "active") {
      return {
        error: "Cannot enable WhatsApp for this trigger until WhatsApp integration is active.",
      };
    }
  }

  const currentRules = orgSettings.automation_rules || DEFAULT_AUTOMATION_RULES;
  const currentItem = currentRules[triggerKey] || { email: true, whatsapp: false };
  const updatedRules: NotificationAutomationRules = {
    ...currentRules,
    [triggerKey]: {
      ...currentItem,
      [channel]: enabled,
    },
  };

  await updateOrganizationCommunicationSettings(orgId, {
    automation_rules: updatedRules,
  });

  revalidatePath(`/event/${eventId}/communications`);
  return { success: true, automation_rules: updatedRules };
}

/**
 * Sends a test preview email to verify template rendering and email gateway delivery
 */
export async function sendTestEmailAction(eventId: string, targetEmail: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) return { error: "Unauthorized" };

  if (!targetEmail || !targetEmail.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const { sendPassEmail } = await import("@/lib/email");
    await sendPassEmail({
      to: targetEmail,
      attendeeName: "Organizer Test",
      eventName: event.name,
      eventDate: event.event_date || "Upcoming Event",
      venue: event.venue || "Main Venue",
      passToken: "preview_test_token",
      passType: "VIP Pass",
    });

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Failed to dispatch test email: ${msg}` };
  }
}

/**
 * Creates a WhatsApp template under the organization's catalog
 */
export async function createWhatsAppTemplateAction(
  eventId: string,
  template: {
    name: string;
    category: "UTILITY" | "MARKETING" | "AUTHENTICATION";
    language: string;
    body_text: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await verifyEventOrganizer(supabase, user, eventId);
  if (!event) return { error: "Unauthorized" };

  const cleanName = template.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
  if (!cleanName || cleanName.length < 3) {
    return {
      error:
        "Template name must be at least 3 characters and contain only lowercase letters, numbers, and underscores.",
    };
  }

  const admin = adminClient();
  const db = admin || supabase;
  const orgId = event.organization_id || `personal_${user.id}`;

  try {
    const { error } = await db.from("whatsapp_templates").insert({
      organization_id: event.organization_id || null,
      name: cleanName,
      category: template.category,
      language: template.language || "en_US",
      status: "APPROVED",
      body_text: template.body_text,
      buttons: [{ type: "URL", text: "View Ticket", url: "https://urpass.space/pass/{{1}}" }],
      is_system: false,
    });

    if (error && !isTableMissingError(error)) {
      return { error: error.message };
    }
  } catch {}

  revalidatePath(`/event/${eventId}/communications`);
  return { success: true, name: cleanName };
}

