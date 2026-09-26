import { SMSMessage, SMSResult, SMSStatus } from "../../types";
import { isValidE164 } from "../../utils";
import { SMSProvider } from "./base";

export interface TwilioSMSConfig {
  accountSid?: string;
  authToken?: string;
  fromPhoneNumber?: string;
  messagingServiceSid?: string;
}

export class TwilioSMSProvider implements SMSProvider {
  readonly name = "twilio";
  private config: TwilioSMSConfig;

  constructor(config?: TwilioSMSConfig) {
    this.config = {
      accountSid: config?.accountSid || process.env.TWILIO_ACCOUNT_SID,
      authToken: config?.authToken || process.env.TWILIO_AUTH_TOKEN,
      fromPhoneNumber: config?.fromPhoneNumber || process.env.TWILIO_PHONE_NUMBER,
      messagingServiceSid: config?.messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID,
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

    const { accountSid, authToken, fromPhoneNumber, messagingServiceSid } = this.config;

    if (!accountSid || !authToken || (!fromPhoneNumber && !messagingServiceSid)) {
      const simulatedId = `sim_twilio_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      if (process.env.NODE_ENV !== "test") {
        console.warn(
          `[Twilio] TWILIO credentials not fully configured. Simulated SMS to ${message.to}: "${message.body}"`
        );
      }
      return {
        success: true,
        messageId: simulatedId,
        status: "SENT",
        cost: 0.05,
        currency: "USD",
        provider: this.name,
      };
    }

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const params = new URLSearchParams();
      params.append("To", message.to);
      params.append("Body", message.body);

      if (messagingServiceSid) {
        params.append("MessagingServiceSid", messagingServiceSid);
      } else if (fromPhoneNumber) {
        params.append("From", fromPhoneNumber);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          success: false,
          status: "FAILED",
          error: data?.message || `Twilio HTTP ${res.status}`,
          errorCode: data?.code ? String(data.code) : `HTTP_${res.status}`,
          provider: this.name,
        };
      }

      return {
        success: true,
        messageId: data.sid,
        status: "SENT",
        cost: data.price ? Math.abs(parseFloat(data.price)) : 0.05,
        currency: data.price_unit || "USD",
        provider: this.name,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        status: "FAILED",
        error: msg,
        errorCode: "TWILIO_NETWORK_ERROR",
        provider: this.name,
      };
    }
  }

  async getStatus(messageId: string): Promise<SMSStatus> {
    const { accountSid, authToken } = this.config;
    if (!accountSid || !authToken) {
      return { messageId, status: "DELIVERED" };
    }

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages/${messageId}.json`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        const rawStatus = (data.status || "").toLowerCase();
        let status: SMSStatus["status"] = "SENT";
        if (rawStatus === "delivered") status = "DELIVERED";
        else if (rawStatus === "failed" || rawStatus === "undelivered") status = "FAILED";
        else if (rawStatus === "queued" || rawStatus === "sending") status = "SENDING";

        return {
          messageId,
          status,
          deliveredAt: data.date_sent || data.date_updated,
          failureReason: data.error_message,
        };
      }
    } catch {}

    return { messageId, status: "SENT" };
  }
}
