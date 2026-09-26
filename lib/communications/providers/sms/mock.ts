import { SMSMessage, SMSResult, SMSStatus } from "../../types";
import { isValidE164 } from "../../utils";
import { SMSProvider } from "./base";

export interface MockDispatchedSMS {
  id: string;
  to: string;
  body: string;
  senderId?: string;
  dltTemplateId?: string;
  dltEntityId?: string;
  sentAt: string;
  status: "SENT" | "DELIVERED" | "FAILED";
}

export class MockSMSProvider implements SMSProvider {
  readonly name = "mock";
  private dispatched: MockDispatchedSMS[] = [];
  private failNextReason: string | null = null;
  private permanentFailReason: string | null = null;

  async send(message: SMSMessage): Promise<SMSResult> {
    if (!message.to || !isValidE164(message.to)) {
      return {
        success: false,
        status: "FAILED",
        error: "Invalid phone number format. Must be E.164.",
        errorCode: "INVALID_PHONE_NUMBER",
        provider: this.name,
      };
    }

    if (this.failNextReason) {
      const reason = this.failNextReason;
      this.failNextReason = null;
      return {
        success: false,
        status: "FAILED",
        error: reason,
        errorCode: "SIMULATED_FAILURE",
        provider: this.name,
      };
    }

    if (this.permanentFailReason) {
      return {
        success: false,
        status: "FAILED",
        error: this.permanentFailReason,
        errorCode: "PERMANENT_REJECTION",
        provider: this.name,
      };
    }

    const messageId = `mock_sms_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const record: MockDispatchedSMS = {
      id: messageId,
      to: message.to,
      body: message.body,
      senderId: message.senderId,
      dltTemplateId: message.dltTemplateId,
      dltEntityId: message.dltEntityId,
      sentAt: new Date().toISOString(),
      status: "SENT",
    };

    this.dispatched.push(record);

    return {
      success: true,
      messageId,
      status: "SENT",
      cost: 0.15,
      currency: "INR",
      provider: this.name,
    };
  }

  async getStatus(messageId: string): Promise<SMSStatus> {
    const found = this.dispatched.find((m) => m.id === messageId);
    if (!found) {
      return {
        messageId,
        status: "FAILED",
        failureReason: "Message not found",
      };
    }

    return {
      messageId,
      status: "DELIVERED",
      deliveredAt: new Date().toISOString(),
    };
  }

  getSentMessages(): MockDispatchedSMS[] {
    return [...this.dispatched];
  }

  clear(): void {
    this.dispatched = [];
    this.failNextReason = null;
    this.permanentFailReason = null;
  }

  setFailNext(reason: string): void {
    this.failNextReason = reason;
  }

  setPermanentFail(reason: string): void {
    this.permanentFailReason = reason;
  }
}

export const mockSMSProvider = new MockSMSProvider();
