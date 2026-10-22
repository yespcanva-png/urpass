import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  DeliveryStatus,
  EventCommunicationSettings,
  OperationalSMSPayload,
  SMSMessage,
  SMSResult,
  TicketDeliveryPayload,
} from "./types";
import {
  buildTicketSmsText,
  buildTicketUrl,
  formatTicketId,
  generateIdempotencyKey,
  isValidE164,
  normalizePhone,
} from "./utils";
import { getSMSProvider, SMSProvider } from "./providers/sms";
import { emailProvider, EmailProvider } from "./providers/email/resend";
import { normalizeTemplateLanguage } from "./providers/whatsapp/templates";
import { whatsAppProvider, WhatsAppProvider } from "./providers/whatsapp/provider";

function getAdminClient() {
  if (process.env.NODE_ENV === "test") return null;
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createAdminClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// In-memory rate limiter for manual resend requests (max 1 resend per 30 seconds per ticket+channel)
const resendRateLimitMap = new Map<string, number>();

export class CommunicationService {
  private email: EmailProvider;
  private whatsapp: WhatsAppProvider;

  constructor() {
    this.email = emailProvider;
    this.whatsapp = whatsAppProvider;
  }

  getSMSProvider(providerName?: string | null): SMSProvider {
    return getSMSProvider(providerName);
  }

  /**
   * Resolves or fetches communication settings for an event
   */
  async getEventCommunicationSettings(eventId: string): Promise<EventCommunicationSettings> {
    const admin = getAdminClient();
    if (!admin) {
      return {
        sms_enabled: false,
        whatsapp_enabled: false,
        email_enabled: true,
        sms_fallback_enabled: true,
      };
    }

    const defaultWhatsappSettings = {
      registration_received: true,
      ticket_delivery: true,
      payment_confirmation: true,
      event_reminders: true,
      event_cancellation: true,
    };

    try {
      const { data } = await admin
        .from("events")
        .select(
          "organization_id, organizer_id, sms_enabled, whatsapp_enabled, email_enabled, sms_fallback_enabled, whatsapp_settings, sms_sender_id, sms_dlt_entity_id, sms_dlt_template_id, sms_provider"
        )
        .eq("id", eventId)
        .maybeSingle();

      if (data) {
        let orgSettings = null;
        const targetOrg = data.organization_id || (data.organizer_id ? `personal_${data.organizer_id}` : null);
        if (targetOrg) {
          try {
            const { getOrganizationCommunicationSettings } = await import("./org-settings");
            orgSettings = await getOrganizationCommunicationSettings(targetOrg);
          } catch {}
        }

        const commEnabled = orgSettings ? orgSettings.enable_communication : true;
        const emailEnabled = (orgSettings ? orgSettings.email_communication : true) && data.email_enabled !== false;
        const whatsappEnabled = (orgSettings ? orgSettings.whatsapp_communication : false) || !!data.whatsapp_enabled;
        const whatsappModel = orgSettings?.whatsapp_integration_model || "none";

        return {
          communication_enabled: commEnabled,
          sms_enabled: !!data.sms_enabled,
          whatsapp_enabled: whatsappEnabled,
          email_enabled: emailEnabled,
          sms_fallback_enabled: data.sms_fallback_enabled !== false,
          whatsapp_model: whatsappModel,
          whatsapp_settings: {
            ...defaultWhatsappSettings,
            ...(data.whatsapp_settings || {}),
          },
          automation_rules: orgSettings?.automation_rules,
          sms_sender_id: data.sms_sender_id || "URPASS",
          sms_dlt_entity_id: data.sms_dlt_entity_id,
          sms_dlt_template_id: data.sms_dlt_template_id,
          sms_provider: data.sms_provider || "default",
        };
      }
    } catch {}

    return {
      communication_enabled: true,
      sms_enabled: false,
      whatsapp_enabled: false,
      email_enabled: true,
      sms_fallback_enabled: true,
      whatsapp_model: "none",
      whatsapp_settings: defaultWhatsappSettings,
    };
  }

  /**
   * Sends transactional SMS ticket confirmation
   * Strictly idempotent — duplicate calls with same passToken/version will not resend
   */
  async sendTicketSMS(
    payload: TicketDeliveryPayload,
    options?: {
      provider?: string;
      force?: boolean;
      dltEntityId?: string;
      dltTemplateId?: string;
      senderId?: string;
    }
  ): Promise<SMSResult> {
    const admin = getAdminClient();
    const ticketId = payload.ticketId || formatTicketId(payload.passToken);
    const ticketUrl = payload.ticketUrl || buildTicketUrl(payload.passToken);
    const normalizedPhone = normalizePhone(payload.phone);

    if (!normalizedPhone || !isValidE164(normalizedPhone)) {
      return {
        success: false,
        status: "FAILED",
        error: "Recipient phone number is missing or not a valid E.164 number.",
        errorCode: "INVALID_PHONE_NUMBER",
        provider: options?.provider || "generic",
      };
    }

    const idempotencyKey = generateIdempotencyKey(payload.passToken, "SMS", payload.version || "v1");

    // 1. Idempotency Check: if already sent/delivered, return previous record
    if (admin && !options?.force) {
      try {
        const { data: existing } = await admin
          .from("communication_deliveries")
          .select("id, status, provider, provider_message_id, failure_reason")
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();

        if (existing && (existing.status === "SENT" || existing.status === "DELIVERED")) {
          return {
            success: true,
            messageId: existing.provider_message_id || existing.id,
            status: existing.status as DeliveryStatus,
            provider: existing.provider,
          };
        }
      } catch {}
    }

    const smsText = buildTicketSmsText(payload.eventName, ticketId, ticketUrl);
    const smsProvider = this.getSMSProvider(options?.provider);

    const message: SMSMessage = {
      to: normalizedPhone,
      body: smsText,
      templateName: "ticket_confirmation",
      senderId: options?.senderId,
      dltEntityId: options?.dltEntityId,
      dltTemplateId: options?.dltTemplateId,
      metadata: {
        eventId: payload.eventId,
        passToken: payload.passToken,
        ticketId,
        attendeeId: payload.attendeeId,
      },
    };

    // 2. Insert initial queued delivery record
    let deliveryRecordId: string | null = null;
    if (admin) {
      try {
        const { data: inserted } = await admin
          .from("communication_deliveries")
          .upsert(
            {
              event_id: payload.eventId,
              ticket_id: ticketId,
              attendee_id: payload.attendeeId,
              channel: "SMS",
              destination: normalizedPhone,
              template_name: "ticket_confirmation",
              provider: smsProvider.name,
              status: "SENDING",
              idempotency_key: idempotencyKey,
              last_attempt_at: new Date().toISOString(),
              metadata: {
                ticketUrl,
                eventName: payload.eventName,
              },
            },
            { onConflict: "idempotency_key" }
          )
          .select("id")
          .single();

        deliveryRecordId = inserted?.id || null;
      } catch {}
    }

    // 3. Dispatch to SMS provider API
    let result: SMSResult;
    try {
      result = await smsProvider.send(message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      result = {
        success: false,
        status: "FAILED",
        error: msg,
        errorCode: "DISPATCH_EXCEPTION",
        provider: smsProvider.name,
      };
    }

    // 4. Update delivery status in database
    if (admin && deliveryRecordId) {
      try {
        await admin
          .from("communication_deliveries")
          .update({
            status: result.status,
            provider: result.provider,
            provider_message_id: result.messageId || null,
            failure_code: result.errorCode || null,
            failure_reason: result.error || null,
            provider_cost: result.cost || 0,
            currency: result.currency || "INR",
            sent_at: result.success ? new Date().toISOString() : null,
            failed_at: !result.success ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", deliveryRecordId);
      } catch {}
    }

    return result;
  }

  /**
   * Sends ticket via Email and logs delivery
   */
  async sendTicketEmail(payload: TicketDeliveryPayload): Promise<{ success: boolean; error?: string }> {
    const admin = getAdminClient();
    const ticketId = payload.ticketId || formatTicketId(payload.passToken);
    const idempotencyKey = generateIdempotencyKey(payload.passToken, "EMAIL", payload.version || "v1");

    if (admin) {
      try {
        const { data: existing } = await admin
          .from("communication_deliveries")
          .select("id, status")
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();

        if (existing && (existing.status === "SENT" || existing.status === "DELIVERED")) {
          return { success: true };
        }
      } catch {}
    }

    const res = await this.email.sendTicketEmail(payload);

    if (admin) {
      try {
        await admin.from("communication_deliveries").upsert(
          {
            event_id: payload.eventId,
            ticket_id: ticketId,
            attendee_id: payload.attendeeId,
            channel: "EMAIL",
            destination: payload.email,
            template_name: "ticket_confirmation",
            provider: "resend",
            provider_message_id: res.messageId || null,
            status: res.success ? "DELIVERED" : "FAILED",
            failure_reason: res.error || null,
            idempotency_key: idempotencyKey,
            sent_at: res.success ? new Date().toISOString() : null,
            delivered_at: res.success ? new Date().toISOString() : null,
            failed_at: !res.success ? new Date().toISOString() : null,
          },
          { onConflict: "idempotency_key" }
        );
      } catch {}
    }

    return res;
  }

  /**
   * Sends ticket via WhatsApp with atomic database claiming, strict idempotency,
   * consent verification, and Monotonic delivery status reconciliation.
   */
  async sendTicketWhatsApp(
    payload: TicketDeliveryPayload
  ): Promise<{ success: boolean; unavailable?: boolean; error?: string; messageId?: string; provider?: string }> {
    const admin = getAdminClient();
    const ticketId = payload.ticketId || formatTicketId(payload.passToken);
    const ticketUrl = payload.ticketUrl || buildTicketUrl(payload.passToken);
    const normalizedPhone = normalizePhone(payload.phone);

    if (!normalizedPhone || !isValidE164(normalizedPhone)) {
      return { success: false, error: "Valid phone number in E.164 format is required for WhatsApp" };
    }

    // ── 1. Attendee Consent Verification ──
    let consentGranted = payload.whatsappConsent === true;
    if (!consentGranted && admin && payload.attendeeId) {
      try {
        const { data: att } = await admin
          .from("attendees")
          .select("whatsapp_consent")
          .eq("id", payload.attendeeId)
          .maybeSingle();

        if (att?.whatsapp_consent) {
          consentGranted = true;
        }
      } catch {}
    }

    if (!consentGranted) {
      return {
        success: false,
        error: "Attendee has not opted in to receive WhatsApp notifications (explicit consent required)",
      };
    }

    const eventSettings = await this.getEventCommunicationSettings(payload.eventId);
    const templateName = eventSettings.whatsapp_settings?.template_name?.trim()
      || process.env.WHATSAPP_TEMPLATE_NAME?.trim()
      || "urpass_space";

    const templateLanguage = normalizeTemplateLanguage(
      eventSettings.whatsapp_settings?.template_name?.trim()
        ? eventSettings.whatsapp_settings.template_language || undefined
        : payload.templateLanguage || process.env.WHATSAPP_TEMPLATE_LANG,
      templateName
    );

    const idempotencyKey = generateIdempotencyKey(payload.passToken, "WHATSAPP", payload.version || "v1");

    // ── 2. Atomic Database Claim (Prevent Concurrent Duplicate Sends) ──
    let existingRecord: {
      id?: string;
      status?: string;
      provider?: string;
      provider_message_id?: string | null;
      last_attempt_at?: string | null;
      attempt_count?: number;
    } | null = null;

    let isNewClaim = false;

    if (admin) {
      try {
        // Attempt atomic INSERT claim with status: 'SENDING'
        const { data: inserted, error: insertErr } = await admin
          .from("communication_deliveries")
          .insert({
            event_id: payload.eventId,
            ticket_id: ticketId,
            attendee_id: payload.attendeeId,
            channel: "WHATSAPP",
            destination: normalizedPhone,
            template_name: templateName,
            provider: "whatsapp_cloud",
            status: "SENDING",
            attempt_count: 1,
            last_attempt_at: new Date().toISOString(),
            idempotency_key: idempotencyKey,
            metadata: { version: payload.version || "v1", templateLanguage },
          })
          .select("id, status, provider_message_id, provider, last_attempt_at, attempt_count")
          .maybeSingle();

        if (insertErr) {
          // Row already exists — fetch existing delivery record
          const { data: existing } = await admin
            .from("communication_deliveries")
            .select("id, status, provider_message_id, provider, last_attempt_at, attempt_count")
            .eq("idempotency_key", idempotencyKey)
            .maybeSingle();

          existingRecord = existing;
        } else {
          existingRecord = inserted;
          isNewClaim = true;
        }
      } catch {
        // Fallback if database operation throws
      }
    }

    // Evaluate existing record to suppress duplicate notifications
    if (existingRecord && !isNewClaim) {
      const currentStatus = String(existingRecord.status || "").toUpperCase();

      // Terminal Success: already sent or delivered to attendee
      if (["SENT", "DELIVERED", "READ"].includes(currentStatus)) {
        return {
          success: true,
          messageId: existingRecord.provider_message_id || undefined,
          provider: existingRecord.provider || "whatsapp_cloud",
        };
      }

      // Concurrency check: if another request is currently in 'SENDING' state
      if (currentStatus === "SENDING") {
        const lastAttempt = existingRecord.last_attempt_at ? new Date(existingRecord.last_attempt_at).getTime() : 0;
        const isRecent = Date.now() - lastAttempt < 60000; // 60s lock window
        if (isRecent) {
          return {
            success: false,
            error: "A WhatsApp notification for this ticket is currently in-flight. Duplicate send suppressed.",
          };
        }
      }

      // If previous attempt failed or timed out, update attempt count and last_attempt_at
      if (admin && existingRecord.id) {
        try {
          await admin
            .from("communication_deliveries")
            .update({
              status: "SENDING",
              attempt_count: (existingRecord.attempt_count || 1) + 1,
              last_attempt_at: new Date().toISOString(),
            })
            .eq("id", existingRecord.id);
        } catch {}
      }
    }

    // ── 3. Dispatch to Meta WhatsApp Cloud API Gateway ──
    let res: { success: boolean; messageId?: string; error?: string; provider?: string };
    try {
      res = await this.whatsapp.sendTicketWhatsApp({
        ...payload,
        templateName,
        templateLanguage,
        phone: normalizedPhone,
        ticketId,
        ticketUrl,
        whatsappConsent: true,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res = {
        success: false,
        error: `WhatsApp gateway dispatch exception: ${msg}`,
        provider: "whatsapp_cloud",
      };
    }

    // ── 4. Reconcile Gateway Result in Database ──
    if (admin) {
      try {
        const now = new Date().toISOString();
        const isSuccess = Boolean(res.success);
        const isTimeout = !isSuccess && Boolean(res.error?.toLowerCase().includes("timeout") || res.error?.toLowerCase().includes("abort"));

        // If timed out, keep status as 'SENDING' to await webhook reconciliation rather than blindly retrying
        const updatedStatus = isSuccess ? "SENT" : isTimeout ? "SENDING" : "FAILED";

        await admin
          .from("communication_deliveries")
          .update({
            provider: res.provider || "whatsapp_cloud",
            provider_message_id: res.messageId || null,
            status: updatedStatus,
            failure_reason: res.error || null,
            sent_at: isSuccess ? now : null,
            failed_at: !isSuccess && !isTimeout ? now : null,
            updated_at: now,
          })
          .eq("idempotency_key", idempotencyKey);
      } catch {}
    }

    return res;
  }

  /**
   * Unified ticket communications dispatcher.
   * Dispatches primary channels (Email, WhatsApp) and automatically triggers
   * SMS fallback if WhatsApp fails or is unavailable.
   */
  async sendTicketCommunications(
    payload: TicketDeliveryPayload,
    customSettings?: Partial<EventCommunicationSettings>
  ): Promise<{
    email?: { success: boolean; error?: string };
    whatsapp?: { success: boolean; error?: string };
    sms?: SMSResult;
    smsFallbackTriggered?: boolean;
  }> {
    const settings = {
      ...(await this.getEventCommunicationSettings(payload.eventId)),
      ...customSettings,
    };

    const out: {
      email?: { success: boolean; error?: string };
      whatsapp?: { success: boolean; error?: string };
      sms?: SMSResult;
      smsFallbackTriggered?: boolean;
    } = {};

    // 1. Email Channel
    if (settings.email_enabled && payload.email) {
      out.email = await this.sendTicketEmail(payload);
    }

    // 2. WhatsApp Channel
    let whatsappFailed = false;
    if (settings.whatsapp_enabled && payload.phone) {
      const waRes = await this.sendTicketWhatsApp(payload);
      out.whatsapp = waRes;
      if (!waRes.success && !waRes.error?.includes("opted in")) {
        whatsappFailed = true;
      }
    }

    // 3. SMS Channel (Direct or Fallback)
    const shouldSendSmsFallback =
      settings.sms_fallback_enabled &&
      whatsappFailed &&
      payload.phone;

    const shouldSendSmsDirect = settings.sms_enabled && payload.phone;

    if (shouldSendSmsDirect || shouldSendSmsFallback) {
      out.smsFallbackTriggered = !!(shouldSendSmsFallback && !shouldSendSmsDirect);
      out.sms = await this.sendTicketSMS(payload, {
        provider: settings.sms_provider || undefined,
        senderId: settings.sms_sender_id || undefined,
        dltEntityId: settings.sms_dlt_entity_id || undefined,
        dltTemplateId: settings.sms_dlt_template_id || undefined,
      });
    }

    return out;
  }

  /**
   * Operational event broadcast SMS (venue change, gate update, postponement, etc.)
   */
  async sendOperationalSMS(
    type: "reminder" | "venue_update" | "gate_change" | "postponed" | "cancelled" | "emergency",
    payload: OperationalSMSPayload
  ): Promise<SMSResult> {
    const normalizedPhone = normalizePhone(payload.phone);
    if (!normalizedPhone || !isValidE164(normalizedPhone)) {
      return {
        success: false,
        status: "FAILED",
        error: "Invalid phone number",
        errorCode: "INVALID_PHONE_NUMBER",
        provider: "generic",
      };
    }

    const provider = this.getSMSProvider();
    const res = await provider.send({
      to: normalizedPhone,
      body: payload.message,
      templateName: `operational_${type}`,
      dltTemplateId: payload.dltTemplateId,
      metadata: {
        eventId: payload.eventId,
        attendeeId: payload.attendeeId,
        type,
      },
    });

    const admin = getAdminClient();
    if (admin) {
      try {
        await admin.from("communication_deliveries").insert({
          event_id: payload.eventId,
          ticket_id: payload.ticketId || null,
          attendee_id: payload.attendeeId,
          channel: "SMS",
          destination: normalizedPhone,
          template_name: `operational_${type}`,
          provider: res.provider,
          provider_message_id: res.messageId || null,
          status: res.status,
          failure_reason: res.error || null,
          sent_at: res.success ? new Date().toISOString() : null,
          failed_at: !res.success ? new Date().toISOString() : null,
        });
      } catch {}
    }

    return res;
  }

  /**
   * Manual resend with server-side rate-limiting and temporary error retry
   */
  async retrySMSDelivery(deliveryId: string): Promise<SMSResult> {
    const admin = getAdminClient();
    if (!admin) {
      return { success: false, status: "FAILED", error: "Database unavailable", provider: "generic" };
    }

    const { data: delivery } = await admin
      .from("communication_deliveries")
      .select("*, event:events(name)")
      .eq("id", deliveryId)
      .single();

    if (!delivery) {
      return { success: false, status: "FAILED", error: "Delivery record not found", provider: "generic" };
    }

    // Rate-limiting: block rapid repeated clicks (min 30 seconds between retries)
    const rateLimitKey = `resend_${delivery.id}`;
    const lastAttempt = resendRateLimitMap.get(rateLimitKey) || 0;
    const now = Date.now();
    if (now - lastAttempt < 30000) {
      return {
        success: false,
        status: "FAILED",
        error: "Please wait 30 seconds before resending this message.",
        errorCode: "RATE_LIMITED",
        provider: delivery.provider,
      };
    }
    resendRateLimitMap.set(rateLimitKey, now);

    // Do not continuously retry permanent failures
    if (delivery.failure_code === "INVALID_PHONE_NUMBER" || delivery.failure_code === "PERMANENT_REJECTION") {
      return {
        success: false,
        status: "FAILED",
        error: `Cannot retry delivery: ${delivery.failure_reason || "Permanently rejected"}`,
        errorCode: delivery.failure_code,
        provider: delivery.provider,
      };
    }

    const ticketId = delivery.ticket_id || "URP-PASS";
    const ticketUrl = delivery.metadata?.ticketUrl || buildTicketUrl(delivery.ticket_id || "");
    const eventName = (delivery.event as { name?: string })?.name || "your event";
    const body = buildTicketSmsText(eventName, ticketId, ticketUrl);

    const smsProvider = this.getSMSProvider(delivery.provider);
    const res = await smsProvider.send({
      to: delivery.destination,
      body,
      templateName: delivery.template_name,
    });

    await admin
      .from("communication_deliveries")
      .update({
        attempt_count: (delivery.attempt_count || 1) + 1,
        status: res.status,
        provider_message_id: res.messageId || delivery.provider_message_id,
        failure_code: res.errorCode || null,
        failure_reason: res.error || null,
        last_attempt_at: new Date().toISOString(),
        sent_at: res.success ? new Date().toISOString() : delivery.sent_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", delivery.id);

    return res;
  }

  /**
   * Idempotent webhook delivery reconciliation
   */
  async updateDeliveryFromWebhook(
    provider: string,
    data: {
      providerMessageId: string;
      status: DeliveryStatus;
      failureReason?: string;
      deliveredAt?: string;
      readAt?: string;
      cost?: number;
    }
  ): Promise<boolean> {
    const admin = getAdminClient();
    if (!admin || !data.providerMessageId) return false;

    try {
      let query = admin
        .from("communication_deliveries")
        .select("id, status, delivered_at")
        .eq("provider_message_id", data.providerMessageId);

      if (provider) {
        query = query.eq("provider", provider);
      }

      const { data: record } = await query.maybeSingle();

      if (!record) return false;

      // Status hierarchy preservation:
      // 1. If already READ, ignore older status updates (DELIVERED, SENT, QUEUED)
      if (record.status === "READ" && data.status !== "READ") {
        return true;
      }
      // 2. If already DELIVERED, ignore older status updates (SENT, QUEUED), but allow promotion to READ
      if (record.status === "DELIVERED" && (data.status === "SENT" || data.status === "QUEUED")) {
        return true;
      }

      const now = new Date().toISOString();
      const updateData: Record<string, unknown> = {
        status: data.status,
        updated_at: now,
      };

      if (data.status === "DELIVERED") {
        updateData.delivered_at = data.deliveredAt || now;
      } else if (data.status === "READ") {
        updateData.read_at = data.readAt || now;
        if (!record.delivered_at) {
          updateData.delivered_at = data.deliveredAt || now;
        }
      } else if (data.status === "FAILED") {
        updateData.failed_at = now;
        updateData.failure_reason = data.failureReason || null;
      }

      if (data.cost !== undefined) {
        updateData.provider_cost = data.cost;
      }

      await admin
        .from("communication_deliveries")
        .update(updateData)
        .eq("id", record.id);

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Scans and processes pending/retryable WhatsApp dispatches with exponential backoff.
   * Delays:
   *   Attempt 1 -> Attempt 2: 1 minute (60s)
   *   Attempt 2 -> Attempt 3: 5 minutes (300s)
   *   Attempt 3 -> Failure: 15 minutes (900s)
   */
  async processWhatsAppOutboxRetries(): Promise<{ processed: number; recovered: number; failed: number }> {
    const admin = getAdminClient();
    if (!admin) return { processed: 0, recovered: 0, failed: 0 };

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();

    try {
      const { data: pending } = await admin
        .from("communication_deliveries")
        .select("id, ticket_id, destination, template_name, attempt_count, last_attempt_at, idempotency_key, metadata, event:events(id, name, event_date, venue)")
        .eq("channel", "WHATSAPP")
        .in("status", ["QUEUED", "SENDING"])
        .lt("last_attempt_at", oneMinuteAgo)
        .limit(50);

      if (!pending || pending.length === 0) {
        return { processed: 0, recovered: 0, failed: 0 };
      }

      let recovered = 0;
      let failed = 0;

      for (const item of pending) {
        const attempts = Number(item.attempt_count || 1);
        const lastAttemptMs = item.last_attempt_at ? new Date(item.last_attempt_at).getTime() : 0;
        const elapsedSeconds = (Date.now() - lastAttemptMs) / 1000;

        const requiredDelaySeconds = attempts === 1 ? 60 : attempts === 2 ? 300 : 900;
        if (elapsedSeconds < requiredDelaySeconds) {
          continue;
        }

        if (attempts >= 3) {
          await admin
            .from("communication_deliveries")
            .update({
              status: "FAILED",
              failure_code: "MAX_RETRIES_EXCEEDED",
              failure_reason: `Exceeded maximum automated retry attempts (${attempts})`,
              failed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", item.id);
          failed++;
          continue;
        }

        const eventData = Array.isArray(item.event) ? item.event[0] : item.event;
        const passToken = item.metadata?.passToken || item.ticket_id || "";

        await admin
          .from("communication_deliveries")
          .update({
            attempt_count: attempts + 1,
            last_attempt_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        const res = await this.whatsapp.sendTicketWhatsApp({
          eventId: eventData?.id || "outbox",
          eventName: eventData?.name || "Your Event",
          eventDate: eventData?.event_date,
          venue: eventData?.venue,
          ticketId: item.ticket_id || "PASS",
          passToken,
          attendeeId: item.metadata?.attendeeId || "outbox",
          attendeeName: item.metadata?.attendeeName || "Guest",
          email: item.metadata?.email || "attendee@urpass.space",
          phone: item.destination,
          ticketUrl: item.metadata?.ticketUrl || buildTicketUrl(passToken),
          templateName: item.template_name,
          templateLanguage: item.metadata?.templateLanguage,
          whatsappConsent: true,
        });

        if (res.success) {
          await admin
            .from("communication_deliveries")
            .update({
              status: "SENT",
              provider_message_id: res.messageId || null,
              sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", item.id);
          recovered++;
        }
      }

      return { processed: pending.length, recovered, failed };
    } catch (err) {
      console.error("[CommunicationService] processWhatsAppOutboxRetries exception:", err);
      return { processed: 0, recovered: 0, failed: 0 };
    }
  }
}

export const communicationService = new CommunicationService();
