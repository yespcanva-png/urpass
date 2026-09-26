import { TicketDeliveryPayload } from "../../types";
import { isValidE164 } from "../../utils";

export interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  unavailable?: boolean;
  error?: string;
}

export class WhatsAppProvider {
  readonly name = "whatsapp_cloud";
  private simulateUnavailable = false;
  private simulateFailure = false;

  async sendTicketWhatsApp(payload: TicketDeliveryPayload): Promise<WhatsAppResult> {
    if (!payload.phone || !isValidE164(payload.phone)) {
      return {
        success: false,
        error: "Valid phone number in E.164 format is required for WhatsApp",
      };
    }

    if (this.simulateUnavailable) {
      return {
        success: false,
        unavailable: true,
        error: "WhatsApp Cloud API is currently unavailable (maintenance/rate limited)",
      };
    }

    if (this.simulateFailure) {
      return {
        success: false,
        error: "User is not registered on WhatsApp or message rejected",
      };
    }

    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    // In local dev/testing without WhatsApp API credentials, simulate delivery
    if (!token || !phoneId) {
      if (process.env.NODE_ENV !== "test") {
        console.warn(`[WhatsApp] WHATSAPP_API_TOKEN not configured. Simulated WhatsApp pass delivery to: ${payload.phone}`);
      }
      return {
        success: true,
        messageId: `wamid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
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
        };
      }

      return {
        success: true,
        messageId: data?.messages?.[0]?.id || `wamid_${Date.now()}`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        unavailable: true,
        error: msg,
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
