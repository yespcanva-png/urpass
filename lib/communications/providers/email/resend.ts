import { sendPassEmail } from "@/lib/email";
import { TicketDeliveryPayload } from "../../types";

export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailProvider {
  readonly name = "resend";

  async sendTicketEmail(payload: TicketDeliveryPayload): Promise<EmailDeliveryResult> {
    if (!payload.email) {
      return { success: false, error: "No email address provided" };
    }

    try {
      await sendPassEmail({
        to: payload.email,
        attendeeName: payload.attendeeName,
        eventName: payload.eventName,
        eventDate: payload.eventDate || "Upcoming",
        venue: payload.venue || "Venue details on ticket",
        passToken: payload.passToken,
        passType: payload.passType || undefined,
      });

      return {
        success: true,
        messageId: `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: msg,
      };
    }
  }
}

export const emailProvider = new EmailProvider();
