"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { communicationService } from "@/lib/communications";
import {
  buildTicketUrl,
  formatTicketId,
  generateIdempotencyKey,
  isValidE164,
  normalizePhone,
} from "@/lib/communications/utils";
import type { DeliveryStatus, TicketDeliveryPayload } from "@/lib/communications/types";
import { revalidatePath } from "next/cache";

function getAdminClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createAdminClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export interface BulkWhatsAppAudienceItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  normalizedPhone: string | null;
  isValidPhone: boolean;
  passToken: string | null;
  passType: string;
  passStatus: string;
  applicationStatus: string;
  deliveryStatus: DeliveryStatus | "NOT_SENT";
  lastSentAt: string | null;
  failureReason: string | null;
  eligible: boolean;
  ineligibilityReason?: string;
  isDuplicatePhone?: boolean;
}

export interface BulkWhatsAppAudienceReport {
  event: {
    id: string;
    name: string;
    eventDate: string | null;
    venue: string | null;
    status: string;
  };
  summary: {
    totalAttendees: number;
    eligibleCount: number;
    alreadySentCount: number;
    failedCount: number;
    invalidPhoneCount: number;
    duplicatePhoneCount: number;
  };
  audience: BulkWhatsAppAudienceItem[];
}

export interface SendBulkWhatsAppResult {
  success: boolean;
  campaignId: string;
  totalRequested: number;
  processedCount: number;
  sentCount: number;
  failedCount: number;
  skippedCount: number;
  results: Array<{
    attendeeId: string;
    name: string;
    phone: string | null;
    status: "SENT" | "FAILED" | "SKIPPED";
    messageId?: string;
    error?: string;
  }>;
  error?: string;
}

/**
 * Validates whether caller has permissions to manage communications for an event
 */
async function verifyOrganizerAccess(supabase: Awaited<ReturnType<typeof createClient>>, eventId: string, userId: string) {
  const { data: event } = await supabase
    .from("events")
    .select("id, name, event_date, venue, status, organizer_id, organization_id, whatsapp_enabled")
    .eq("id", eventId)
    .single();

  if (!event) return null;
  if (event.organizer_id === userId) return event;

  if (event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", userId)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .maybeSingle();

    if (member) return event;
  }

  return null;
}

/**
 * Fetches and audits all attendees for bulk WhatsApp eligibility
 */
export async function getBulkWhatsAppAudience(eventId: string): Promise<BulkWhatsAppAudienceReport | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Authentication required" };

  const event = await verifyOrganizerAccess(supabase, eventId, user.id);
  if (!event) return { error: "Event not found or insufficient permissions" };

  const admin = getAdminClient() || supabase;

  // 1. Fetch all attendees with their passes
  const { data: attendees, error: attError } = await admin
    .from("attendees")
    .select("id, name, email, phone, pass_type, pass_status, application_status, passes(id, pass_token, status)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (attError || !attendees) {
    return { error: attError?.message || "Failed to fetch attendees." };
  }

  // 2. Fetch existing WhatsApp delivery records for this event
  const { data: deliveries } = await admin
    .from("communication_deliveries")
    .select("attendee_id, status, last_attempt_at, failure_reason, sent_at, delivered_at")
    .eq("event_id", eventId)
    .eq("channel", "WHATSAPP")
    .order("created_at", { ascending: false });

  const deliveryMap = new Map<string, { status: DeliveryStatus; lastAttemptAt: string | null; failureReason: string | null }>();
  for (const d of deliveries || []) {
    if (d.attendee_id && !deliveryMap.has(d.attendee_id)) {
      deliveryMap.set(d.attendee_id, {
        status: d.status as DeliveryStatus,
        lastAttemptAt: d.last_attempt_at || d.sent_at || null,
        failureReason: d.failure_reason || null,
      });
    }
  }

  // 3. Track duplicates by normalized phone
  const phoneCountMap = new Map<string, number>();
  for (const att of attendees) {
    if (att.phone) {
      const norm = normalizePhone(att.phone);
      if (norm && isValidE164(norm)) {
        phoneCountMap.set(norm, (phoneCountMap.get(norm) || 0) + 1);
      }
    }
  }

  let eligibleCount = 0;
  let alreadySentCount = 0;
  let failedCount = 0;
  let invalidPhoneCount = 0;
  let duplicatePhoneCount = 0;

  const audience: BulkWhatsAppAudienceItem[] = attendees.map((att) => {
    const rawPassList = att.passes as Array<{ id: string; pass_token: string; status: string }> | null;
    const pass = rawPassList && rawPassList.length > 0 ? rawPassList[0] : null;
    const passToken = pass?.pass_token || null;

    const normalizedPhone = att.phone ? normalizePhone(att.phone) : null;
    const validPhone = Boolean(normalizedPhone && isValidE164(normalizedPhone));
    const isDup = Boolean(normalizedPhone && (phoneCountMap.get(normalizedPhone) || 0) > 1);

    const delivery = deliveryMap.get(att.id);
    const deliveryStatus = delivery?.status || "NOT_SENT";

    let eligible = false;
    let ineligibilityReason: string | undefined = undefined;

    if (!validPhone) {
      ineligibilityReason = "Invalid or missing phone number";
      invalidPhoneCount++;
    } else if (!passToken) {
      ineligibilityReason = "Pass not yet generated";
    } else if (att.application_status !== "approved") {
      ineligibilityReason = "Application is not approved";
    } else if (deliveryStatus === "SENT" || deliveryStatus === "DELIVERED" || deliveryStatus === "READ") {
      alreadySentCount++;
      ineligibilityReason = "Already successfully delivered";
    } else {
      eligible = true;
      eligibleCount++;
    }

    if (deliveryStatus === "FAILED") {
      failedCount++;
    }

    if (isDup) {
      duplicatePhoneCount++;
    }

    return {
      id: att.id,
      name: att.name,
      email: att.email,
      phone: att.phone,
      normalizedPhone,
      isValidPhone: validPhone,
      passToken,
      passType: att.pass_type || "participant",
      passStatus: att.pass_status || "generated",
      applicationStatus: att.application_status,
      deliveryStatus,
      lastSentAt: delivery?.lastAttemptAt || null,
      failureReason: delivery?.failureReason || null,
      eligible,
      ineligibilityReason,
      isDuplicatePhone: isDup,
    };
  });

  return {
    event: {
      id: event.id,
      name: event.name,
      eventDate: event.event_date,
      venue: event.venue,
      status: event.status,
    },
    summary: {
      totalAttendees: attendees.length,
      eligibleCount,
      alreadySentCount,
      failedCount,
      invalidPhoneCount,
      duplicatePhoneCount,
    },
    audience,
  };
}

/**
 * Executes rate-limited bulk WhatsApp invitation dispatch to selected attendees
 */
export async function sendBulkWhatsAppInvitations({
  eventId,
  recipientAttendeeIds,
  forceRetry = false,
  campaignId = crypto.randomUUID(),
  customMessageTemplate,
}: {
  eventId: string;
  recipientAttendeeIds?: string[];
  forceRetry?: boolean;
  campaignId?: string;
  customMessageTemplate?: string;
}): Promise<SendBulkWhatsAppResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      campaignId,
      totalRequested: 0,
      processedCount: 0,
      sentCount: 0,
      failedCount: 0,
      skippedCount: 0,
      results: [],
      error: "Authentication required",
    };
  }

  const event = await verifyOrganizerAccess(supabase, eventId, user.id);
  if (!event) {
    return {
      success: false,
      campaignId,
      totalRequested: 0,
      processedCount: 0,
      sentCount: 0,
      failedCount: 0,
      skippedCount: 0,
      results: [],
      error: "Event not found or unauthorized",
    };
  }

  const admin = getAdminClient() || supabase;

  // 1. Query requested attendees
  let query = admin
    .from("attendees")
    .select("id, name, email, phone, pass_type, application_status, passes(id, pass_token, status)")
    .eq("event_id", eventId)
    .eq("application_status", "approved");

  if (recipientAttendeeIds && recipientAttendeeIds.length > 0) {
    query = query.in("id", recipientAttendeeIds);
  }

  const { data: attendees, error: fetchErr } = await query;
  if (fetchErr || !attendees || attendees.length === 0) {
    return {
      success: false,
      campaignId,
      totalRequested: recipientAttendeeIds?.length || 0,
      processedCount: 0,
      sentCount: 0,
      failedCount: 0,
      skippedCount: 0,
      results: [],
      error: "No approved attendees found matching dispatch criteria.",
    };
  }

  // 2. Fetch existing delivery statuses to prevent duplicate sending unless forceRetry is true
  const { data: existingDeliveries } = await admin
    .from("communication_deliveries")
    .select("attendee_id, status")
    .eq("event_id", eventId)
    .eq("channel", "WHATSAPP");

  const sentAttendeeSet = new Set<string>();
  for (const d of existingDeliveries || []) {
    if (d.status === "SENT" || d.status === "DELIVERED" || d.status === "READ") {
      sentAttendeeSet.add(d.attendee_id);
    }
  }

  const processedPhonesInRun = new Set<string>();
  const results: SendBulkWhatsAppResult["results"] = [];

  let sentCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  // 3. Process recipients sequentially with rate-limit pacing (50ms throttle)
  for (const att of attendees) {
    const rawPassList = att.passes as Array<{ id: string; pass_token: string }> | null;
    const passToken = rawPassList && rawPassList.length > 0 ? rawPassList[0].pass_token : null;
    const normalizedPhone = att.phone ? normalizePhone(att.phone) : null;

    // Check pass and phone validity
    if (!passToken || !normalizedPhone || !isValidE164(normalizedPhone)) {
      skippedCount++;
      results.push({
        attendeeId: att.id,
        name: att.name,
        phone: att.phone,
        status: "SKIPPED",
        error: !passToken ? "Missing pass credential" : "Invalid phone format",
      });
      continue;
    }

    // Skip if already successfully sent and not force-retrying
    if (sentAttendeeSet.has(att.id) && !forceRetry) {
      skippedCount++;
      results.push({
        attendeeId: att.id,
        name: att.name,
        phone: att.phone,
        status: "SKIPPED",
        error: "Already delivered previously",
      });
      continue;
    }

    // Deduplicate identical phone numbers within the campaign
    if (processedPhonesInRun.has(normalizedPhone)) {
      skippedCount++;
      results.push({
        attendeeId: att.id,
        name: att.name,
        phone: att.phone,
        status: "SKIPPED",
        error: "Duplicate phone number in campaign",
      });
      continue;
    }
    processedPhonesInRun.add(normalizedPhone);

    const ticketUrl = buildTicketUrl(passToken);
    const ticketId = formatTicketId(passToken);

    // Build personalized invitation message text
    let messageText = customMessageTemplate
      ? customMessageTemplate
          .replace(/\{\{guest_name\}\}/g, att.name || "Guest")
          .replace(/\{\{eventName\}\}/g, event.name)
          .replace(/\{\{pass_url\}\}/g, ticketUrl)
          .replace(/\{\{ticketId\}\}/g, ticketId)
      : `Hello ${att.name || "Guest"},\n\nYou are invited to the ${event.name}!\n\nYour event pass: ${ticketUrl}\n\nPlease present your QR pass at the entrance.\n\nWe look forward to welcoming you!`;

    const payload: TicketDeliveryPayload = {
      eventId,
      eventName: event.name,
      eventDate: event.event_date,
      venue: event.venue,
      ticketId,
      passToken,
      attendeeId: att.id,
      attendeeName: att.name,
      email: att.email,
      phone: normalizedPhone,
      passType: att.pass_type,
      ticketUrl,
      version: `bulk_${campaignId}`,
      customMessage: messageText,
    };

    try {
      const dispatchRes = await communicationService.sendTicketWhatsApp(payload);

      if (dispatchRes.success) {
        sentCount++;
        results.push({
          attendeeId: att.id,
          name: att.name,
          phone: normalizedPhone,
          status: "SENT",
          messageId: dispatchRes.messageId,
        });
      } else {
        failedCount++;
        results.push({
          attendeeId: att.id,
          name: att.name,
          phone: normalizedPhone,
          status: "FAILED",
          error: dispatchRes.error || "Provider rejected delivery",
        });
      }
    } catch (err: unknown) {
      failedCount++;
      const msg = err instanceof Error ? err.message : String(err);
      results.push({
        attendeeId: att.id,
        name: att.name,
        phone: normalizedPhone,
        status: "FAILED",
        error: msg,
      });
    }

    // Rate-limiting throttle: 50ms pause between provider calls
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // 4. Log aggregate campaign to event_communications
  if (sentCount > 0 || failedCount > 0) {
    try {
      await admin.from("event_communications").insert({
        event_id: eventId,
        type: "whatsapp_bulk_invitation",
        subject: `WhatsApp Invitation Campaign (${sentCount} sent)`,
        recipient_count: sentCount,
        sent_by: user.id,
        sent_at: new Date().toISOString(),
      });
    } catch (logErr) {
      console.error("[bulk-whatsapp] Campaign logging error:", logErr);
    }
  }

  revalidatePath(`/event/${eventId}/communications`);

  return {
    success: sentCount > 0 || failedCount === 0,
    campaignId,
    totalRequested: attendees.length,
    processedCount: results.length,
    sentCount,
    failedCount,
    skippedCount,
    results,
  };
}

/**
 * Retries only attendees whose previous WhatsApp invitation failed
 */
export async function retryFailedWhatsAppInvitations(eventId: string, campaignId?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Authentication required" };

  const admin = getAdminClient() || supabase;

  // Find all attendees with FAILED delivery status
  const { data: failedDeliveries } = await admin
    .from("communication_deliveries")
    .select("attendee_id")
    .eq("event_id", eventId)
    .eq("channel", "WHATSAPP")
    .eq("status", "FAILED");

  const failedAttendeeIds = (failedDeliveries || []).map((d) => d.attendee_id).filter(Boolean);

  if (failedAttendeeIds.length === 0) {
    return { success: true, message: "No failed WhatsApp deliveries to retry.", retriedCount: 0 };
  }

  return sendBulkWhatsAppInvitations({
    eventId,
    recipientAttendeeIds: failedAttendeeIds,
    forceRetry: true,
    campaignId: campaignId || `retry_${Date.now()}`,
  });
}
