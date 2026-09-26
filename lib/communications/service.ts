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

    try {
      const { data } = await admin
        .from("events")
        .select(
          "sms_enabled, whatsapp_enabled, email_enabled, sms_fallback_enabled, sms_sender_id, sms_dlt_entity_id, sms_dlt_template_id, sms_provider"
        )
        .eq("id", eventId)
        .maybeSingle();

      if (data) {
        return {
          sms_enabled: !!data.sms_enabled,
          whatsapp_enabled: !!data.whatsapp_enabled,
          email_enabled: data.email_enabled !== false,
          sms_fallback_enabled: data.sms_fallback_enabled !== false,
          sms_sender_id: data.sms_sender_id || "URPASS",
          sms_dlt_entity_id: data.sms_dlt_entity_id,
          sms_dlt_template_id: data.sms_dlt_template_id,
          sms_provider: data.sms_provider || "default",
        };
      }
    } catch {}

    return {
      sms_enabled: false,
      whatsapp_enabled: false,
      email_enabled: true,
      sms_fallback_enabled: true,
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
   * Sends ticket via WhatsApp and logs delivery
   */
  async sendTicketWhatsApp(
    payload: TicketDeliveryPayload
  ): Promise<{ success: boolean; unavailable?: boolean; error?: string }> {
    const admin = getAdminClient();
    const ticketId = payload.ticketId || formatTicketId(payload.passToken);
    const ticketUrl = payload.ticketUrl || buildTicketUrl(payload.passToken);
    const normalizedPhone = normalizePhone(payload.phone);

    if (!normalizedPhone) {
      return { success: false, error: "Valid phone number required for WhatsApp" };
    }

    const idempotencyKey = generateIdempotencyKey(payload.passToken, "WHATSAPP", payload.version || "v1");

    const res = await this.whatsapp.sendTicketWhatsApp({
      ...payload,
      phone: normalizedPhone,
      ticketId,
      ticketUrl,
    });

    if (admin) {
      try {
        await admin.from("communication_deliveries").upsert(
          {
            event_id: payload.eventId,
            ticket_id: ticketId,
            attendee_id: payload.attendeeId,
            channel: "WHATSAPP",
            destination: normalizedPhone,
            template_name: "ticket_confirmation",
            provider: "whatsapp_cloud",
            provider_message_id: res.messageId || null,
            status: res.success ? "SENT" : "FAILED",
            failure_reason: res.error || null,
            idempotency_key: idempotencyKey,
            sent_at: res.success ? new Date().toISOString() : null,
            failed_at: !res.success ? new Date().toISOString() : null,
          },
          { onConflict: "idempotency_key" }
        );
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
      if (!waRes.success) {
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
      cost?: number;
    }
  ): Promise<boolean> {
    const admin = getAdminClient();
    if (!admin || !data.providerMessageId) return false;

    try {
      const { data: record } = await admin
        .from("communication_deliveries")
        .select("id, status")
        .eq("provider", provider)
        .eq("provider_message_id", data.providerMessageId)
        .maybeSingle();

      if (!record) return false;

      // Idempotency: if already in terminal state DELIVERED, ignore older status
      if (record.status === "DELIVERED" && data.status !== "DELIVERED") {
        return true;
      }

      await admin
        .from("communication_deliveries")
        .update({
          status: data.status,
          delivered_at: data.status === "DELIVERED" ? data.deliveredAt || new Date().toISOString() : null,
          failed_at: data.status === "FAILED" ? new Date().toISOString() : null,
          failure_reason: data.failureReason || null,
          ...(data.cost ? { provider_cost: data.cost } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq("id", record.id);

      return true;
    } catch {
      return false;
    }
  }
}

export const communicationService = new CommunicationService();
