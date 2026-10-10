import { TicketDeliveryPayload } from "../../types";
import { isValidE164, normalizePhone } from "../../utils";

export interface AiSensyResponse {
  success?: boolean;
  message?: string;
  name?: string;
  errorCode?: number | string;
  errorMessage?: string;
  aisTraceId?: string;
  data?: {
    messageId?: string;
    [key: string]: unknown;
  };
}

export interface AiSensyResult {
  success: boolean;
  messageId?: string;
  error?: string;
  traceId?: string;
}

export class AiSensyProvider {
  readonly name = "aisensy";
  private apiKey: string;
  private defaultCampaignName: string;

  constructor(apiKey?: string, defaultCampaignName?: string) {
    this.apiKey =
      apiKey ||
      process.env.AISENSY_API_KEY ||
      "";
    this.defaultCampaignName =
      defaultCampaignName ||
      process.env.AISENSY_CAMPAIGN_NAME ||
      "ticket_confirmation";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey || process.env.AISENSY_API_KEY);
  }

  /**
   * Dispatches a WhatsApp campaign message via AiSensy API v2
   * Endpoint: POST https://backend.aisensy.com/campaign/t1/api/v2
   */
  async sendTicketWhatsApp(
    payload: TicketDeliveryPayload,
    options?: {
      campaignName?: string;
      mediaUrl?: string;
      tags?: string[];
    }
  ): Promise<AiSensyResult> {
    const rawPhone = payload.phone;
    const normalizedPhone = rawPhone ? normalizePhone(rawPhone) : null;

    if (!normalizedPhone || !isValidE164(normalizedPhone)) {
      return {
        success: false,
        error: "Valid phone number in E.164 format is required for WhatsApp",
      };
    }

    const key = this.apiKey || process.env.AISENSY_API_KEY;
    if (!key) {
      return {
        success: false,
        error: "AiSensy API Key is not configured (AISENSY_API_KEY missing)",
      };
    }

    const campaign = options?.campaignName || this.defaultCampaignName;

    // AiSensy expects templateParams as an array of strings in order of placeholders in the approved template
    // [Attendee Name, Event Name, Ticket ID, Pass Link]
    const templateParams = [
      payload.attendeeName || "Attendee",
      payload.eventName || "Event",
      payload.ticketId || "PASS",
      payload.ticketUrl || "https://urpass.space",
    ];

    const bodyPayload: Record<string, unknown> = {
      apiKey: key,
      campaignName: campaign,
      destination: normalizedPhone,
      userName: payload.attendeeName || "Guest",
      templateParams,
      tags: options?.tags || ["urpass", "ticket", payload.eventId],
      attributes: {
        eventId: payload.eventId,
        ticketId: payload.ticketId,
        passToken: payload.passToken,
      },
    };

    if (options?.mediaUrl || payload.ticketUrl) {
      bodyPayload.media = {
        url: options?.mediaUrl || payload.ticketUrl,
        filename: `${payload.ticketId || "pass"}.png`,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = (await res.json().catch(() => null)) as AiSensyResponse | null;

      // Check HTTP status and AiSensy error status
      if (!res.ok || (data && (data.errorCode || data.name === "ERR400" || data.success === false))) {
        const errorMsg =
          data?.errorMessage ||
          data?.message ||
          `AiSensy error (HTTP ${res.status})`;

        return {
          success: false,
          error: errorMsg,
          traceId: data?.aisTraceId,
        };
      }

      const messageId =
        data?.data?.messageId ||
        data?.aisTraceId ||
        `ais_${Date.now()}`;

      return {
        success: true,
        messageId,
        traceId: data?.aisTraceId,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: `AiSensy dispatch exception: ${msg}`,
      };
    }
  }
}

export const aiSensyProvider = new AiSensyProvider();
