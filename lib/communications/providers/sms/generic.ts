import { SMSMessage, SMSResult, SMSStatus } from "../../types";
import { isValidE164 } from "../../utils";
import { SMSProvider } from "./base";

export interface GenericSMSConfig {
  apiKey?: string;
  senderId?: string;
  dltEntityId?: string;
  dltTemplateId?: string;
  gatewayUrl?: string;
}

export class GenericDLTSMSProvider implements SMSProvider {
  readonly name = "dlt_generic";
  private config: GenericSMSConfig;

  constructor(config?: GenericSMSConfig) {
    this.config = {
      apiKey: config?.apiKey || process.env.SMS_API_KEY,
      senderId: config?.senderId || process.env.SMS_SENDER_ID || "URPASS",
      dltEntityId: config?.dltEntityId || process.env.SMS_DLT_ENTITY_ID,
      dltTemplateId: config?.dltTemplateId || process.env.SMS_DLT_TEMPLATE_ID,
      gatewayUrl: config?.gatewayUrl || process.env.SMS_GATEWAY_URL,
    };
  }

  async send(message: SMSMessage): Promise<SMSResult> {
    if (!message.to || !isValidE164(message.to)) {
      return {
        success: false,
        status: "FAILED",
        error: "Recipient phone number must be in E.164 format.",
        errorCode: "INVALID_PHONE_NUMBER",
        provider: this.name,
      };
    }

    const apiKey = this.config.apiKey;
    const senderId = message.senderId || this.config.senderId || "URPASS";
    const dltEntityId = message.dltEntityId || this.config.dltEntityId;
    const dltTemplateId = message.dltTemplateId || this.config.dltTemplateId;
    const gatewayUrl = this.config.gatewayUrl;

    // In local development or testing when SMS_GATEWAY_URL is not configured, simulate delivery
    if (!gatewayUrl || !apiKey) {
      const simulatedId = `sim_sms_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      if (process.env.NODE_ENV !== "test") {
        console.warn(
          `[SMS DLT] SMS_GATEWAY_URL or SMS_API_KEY not configured. Simulated SMS to ${message.to}: "${message.body}"`
        );
      }
      return {
        success: true,
        messageId: simulatedId,
        status: "SENT",
        cost: 0.18,
        currency: "INR",
        provider: this.name,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(gatewayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          to: message.to,
          message: message.body,
          sender: senderId,
          dlt_entity_id: dltEntityId,
          dlt_template_id: dltTemplateId,
          template_name: message.templateName,
          meta: message.metadata,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          status: "FAILED",
          error: json?.message || json?.error || `Gateway returned HTTP ${response.status}`,
          errorCode: json?.code || `HTTP_${response.status}`,
          provider: this.name,
        };
      }

      const messageId = json?.message_id || json?.messageId || json?.id || `dlt_${Date.now()}`;

      return {
        success: true,
        messageId,
        status: "SENT",
        cost: json?.cost || 0.18,
        currency: json?.currency || "INR",
        provider: this.name,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        status: "FAILED",
        error: msg,
        errorCode: "GATEWAY_TIMEOUT",
        provider: this.name,
      };
    }
  }

  async getStatus(messageId: string): Promise<SMSStatus> {
    const gatewayUrl = this.config.gatewayUrl;
    const apiKey = this.config.apiKey;

    if (!gatewayUrl || !apiKey) {
      return {
        messageId,
        status: "DELIVERED",
        deliveredAt: new Date().toISOString(),
      };
    }

    try {
      const res = await fetch(`${gatewayUrl}/status/${messageId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        return {
          messageId,
          status: (data.status?.toUpperCase() as SMSStatus["status"]) || "DELIVERED",
          deliveredAt: data.delivered_at,
          failedAt: data.failed_at,
          failureReason: data.failure_reason,
        };
      }
    } catch {}

    return {
      messageId,
      status: "SENT",
    };
  }
}
