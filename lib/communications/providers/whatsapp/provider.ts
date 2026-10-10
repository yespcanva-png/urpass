import { TicketDeliveryPayload } from "../../types";
import { isValidE164 } from "../../utils";
import { aiSensyProvider } from "./aisensy";

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
    if (process.env.AISENSY_API_KEY) {
      return "aisensy";
    }
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

    // 1. Priority 1: AiSensy if AISENSY_API_KEY is configured
    if (aiSensyProvider.isConfigured()) {
      const aisResult = await aiSensyProvider.sendTicketWhatsApp(payload);
      return {
        success: aisResult.success,
        messageId: aisResult.messageId,
        error: aisResult.error,
        unavailable: !aisResult.success && aisResult.error?.includes("timeout"),
        provider: "aisensy",
      };
    }

    // 2. Priority 2: Meta WhatsApp Cloud API if credentials present
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    // In local dev/testing without WhatsApp API credentials, simulate delivery
    if (!token || !phoneId) {
      if (process.env.NODE_ENV !== "test") {
        console.warn(`[WhatsApp] AISENSY_API_KEY or WHATSAPP_API_TOKEN not configured. Simulated WhatsApp pass delivery to: ${payload.phone}`);
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

      const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: payload.phone.replace("+", ""),
          type: "text",
          text: {
            preview_url: true,
            body: `🎟️ Your ticket for *${payload.eventName}* is confirmed!\nTicket: ${payload.ticketId}\nView your QR pass: ${payload.ticketUrl}`,
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          success: false,
          error: data?.error?.message || `WhatsApp HTTP ${res.status}`,
          provider: "whatsapp_cloud",
        };
      }

      return {
        success: true,
        messageId: data?.messages?.[0]?.id || `wamid_${Date.now()}`,
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

