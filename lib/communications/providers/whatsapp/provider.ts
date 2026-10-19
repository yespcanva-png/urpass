import { TicketDeliveryPayload } from "../../types";
import { isValidE164 } from "../../utils";
import { aiSensyProvider } from "./aisensy";
import {
  buildTemplatePayload,
  APPROVED_TEMPLATES,
  WhatsAppTemplateType,
  normalizeTemplateLanguage,
} from "./templates";

export interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  unavailable?: boolean;
  error?: string;
  provider?: string;
}

export class WhatsAppProvider {
  private simulateUnavailable = false;
  private simulateFailure = false;

  get name(): string {
    return "whatsapp_cloud";
  }

  async sendTicketWhatsApp(payload: TicketDeliveryPayload): Promise<WhatsAppResult> {
    if (!payload.phone || !isValidE164(payload.phone)) {
      return {
        success: false,
        error: "Valid phone number in E.164 format is required for WhatsApp",
        provider: this.name,
      };
    }

    if (this.simulateUnavailable) {
      return {
        success: false,
        unavailable: true,
        error: "WhatsApp provider is currently unavailable (maintenance/rate limited)",
        provider: this.name,
      };
    }

    if (this.simulateFailure) {
      return {
        success: false,
        error: "User is not registered on WhatsApp or message rejected",
        provider: this.name,
      };
    }

    // Direct Meta WhatsApp Cloud API

    // 2. Priority 2: Meta WhatsApp Cloud API if credentials present
    const token = process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_CLOUD_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID;

    const templateName = (
      payload.templateName ||
      process.env.WHATSAPP_TEMPLATE_NAME ||
      (process.env.NODE_ENV !== "test" ? "urpass_space" : undefined)
    )?.trim();
    const rawLang = payload.templateLanguage || process.env.WHATSAPP_TEMPLATE_LANG;
    const templateLang = normalizeTemplateLanguage(rawLang, templateName);

    // Meta Policy Enforcement: Outbound business-initiated messages require an approved template
    if (!templateName && !payload.isSessionReply) {
      return {
        success: false,
        error:
          "Meta WhatsApp Cloud API strictly requires an approved message template (e.g. WHATSAPP_TEMPLATE_NAME='urpass_space' or 'urpass_ticket') for outbound business-initiated messages outside the 24-hour customer service window.",
        provider: "whatsapp_cloud",
      };
    }

    // In local dev/testing without WhatsApp API credentials, simulate delivery
    if (!token || !phoneId) {
      if (process.env.NODE_ENV !== "test") {
        console.warn(`[WhatsApp] Direct WhatsApp credentials (WHATSAPP_API_TOKEN/WHATSAPP_PHONE_NUMBER_ID) not configured. Simulated delivery to: ${payload.phone}`);
      }
      return {
        success: true,
        messageId: `wamid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        provider: "whatsapp_cloud",
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const cleanPhone = payload.phone.replace(/^\+/, "").replace(/\s+/g, "").trim();

      let templateObj = null;
      if (templateName) {
        const knownType = Object.keys(APPROVED_TEMPLATES).includes(templateName)
          ? (templateName as WhatsAppTemplateType)
          : "ticket_confirmation";

        const generated = buildTemplatePayload(
          knownType,
          {
            attendeeName: payload.attendeeName,
            eventName: payload.eventName,
            eventDate: payload.eventDate,
            eventTime: payload.eventTime,
            venue: payload.venue,
            ticketId: payload.ticketId,
            ticketUrl: payload.ticketUrl,
            passToken: payload.passToken,
            mediaUrl: payload.mediaUrl,
          },
          templateLang,
          templateName
        );

        templateObj = generated;
      }

      const requestBody = templateObj
        ? {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanPhone,
            type: "template",
            template: templateObj,
          }
        : {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanPhone,
            type: "text",
            text: {
              preview_url: true,
              body:
                payload.customMessage ||
                `🎟️ Your ticket for *${payload.eventName}* is confirmed!\nTicket: ${payload.ticketId}\nView your QR pass: ${payload.ticketUrl}`,
            },
          };

      const apiVersion = process.env.WHATSAPP_GRAPH_VERSION || "v21.0";
      const url = `https://graph.facebook.com/${apiVersion}/${phoneId}/messages`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errObj = data?.error;
        const detailMsg =
          errObj?.error_data?.details ||
          errObj?.message ||
          `WhatsApp HTTP ${res.status}`;
        const errorCode = errObj?.code ? ` [Code ${errObj.code}]` : "";
        return {
          success: false,
          error: `${detailMsg}${errorCode}`,
          provider: "whatsapp_cloud",
        };
      }

      const messageId = data?.messages?.[0]?.id || `wamid_${Date.now()}`;
      return {
        success: true,
        messageId,
        provider: "whatsapp_cloud",
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        unavailable: true,
        error: msg,
        provider: "whatsapp_cloud",
      };
    }
  }

  setSimulateUnavailable(val: boolean): void {
    this.simulateUnavailable = val;
  }

  setSimulateFailure(val: boolean): void {
    this.simulateFailure = val;
  }
}

export const whatsAppProvider = new WhatsAppProvider();

