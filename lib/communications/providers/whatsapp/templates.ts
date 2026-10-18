/**
 * Meta WhatsApp Cloud API — Approved Template Catalog & Component Mapper
 *
 * Enforces approved Meta message template naming, parameter sequencing,
 * language fallback, and interactive button payload formatting.
 */

export type WhatsAppTemplateType =
  | "ticket_confirmation"
  | "registration_received"
  | "payment_confirmation"
  | "event_reminder"
  | "event_cancelled";

export interface TemplateParamInput {
  attendeeName?: string;
  eventName?: string;
  eventDate?: string | null;
  venue?: string | null;
  ticketId?: string;
  ticketUrl?: string;
  passToken?: string;
  amountFormatted?: string;
  transactionId?: string;
  reason?: string;
  mediaUrl?: string; // QR pass image or header banner
}

export interface MetaTemplateComponent {
  type: "header" | "body" | "button";
  sub_type?: "url" | "quick_reply";
  index?: string | number;
  parameters: Array<Record<string, unknown>>;
}

export interface MetaTemplatePayload {
  name: string;
  language: { code: string };
  components: MetaTemplateComponent[];
}

/**
 * Registry of approved Meta WhatsApp templates for UrPass
 */
export const APPROVED_TEMPLATES: Record<
  WhatsAppTemplateType,
  {
    name: string;
    defaultLang: string;
    description: string;
  }
> = {
  ticket_confirmation: {
    name: process.env.WHATSAPP_TEMPLATE_TICKET || process.env.WHATSAPP_TEMPLATE_NAME || "ticket_confirmation",
    defaultLang: "en_US",
    description: "Transactional ticket issuance with dynamic QR pass link and ticket ID",
  },
  registration_received: {
    name: process.env.WHATSAPP_TEMPLATE_REGISTRATION_RECEIVED || "registration_received",
    defaultLang: "en_US",
    description: "Application submission acknowledgment for events requiring organizer approval",
  },
  payment_confirmation: {
    name: process.env.WHATSAPP_TEMPLATE_PAYMENT || "payment_confirmation",
    defaultLang: "en_US",
    description: "Payment receipt acknowledgment for paid event tickets",
  },
  event_reminder: {
    name: process.env.WHATSAPP_TEMPLATE_REMINDER || "event_reminder",
    defaultLang: "en_US",
    description: "24-hour pre-event reminder with venue instructions and mobile pass link",
  },
  event_cancelled: {
    name: process.env.WHATSAPP_TEMPLATE_CANCELLED || "event_cancelled",
    defaultLang: "en_US",
    description: "Event cancellation or rescheduling advisory with refund details",
  },
};

/**
 * Builds Meta Cloud API template components matching approved template specifications
 */
export function buildTemplatePayload(
  templateType: WhatsAppTemplateType,
  params: TemplateParamInput,
  preferredLanguage?: string
): MetaTemplatePayload {
  const config = APPROVED_TEMPLATES[templateType] || APPROVED_TEMPLATES.ticket_confirmation;
  const langCode = preferredLanguage || process.env.WHATSAPP_TEMPLATE_LANG || config.defaultLang;

  const components: MetaTemplateComponent[] = [];

  switch (templateType) {
    case "ticket_confirmation": {
      // 1. Optional Header (QR code pass preview image)
      if (params.mediaUrl) {
        components.push({
          type: "header",
          parameters: [
            {
              type: "image",
              image: { link: params.mediaUrl },
            },
          ],
        });
      }

      const passUrlText = params.ticketUrl || (params.passToken ? `https://urpass.space/pass/${params.passToken}` : "https://urpass.space");

      components.push({
        type: "body",
        parameters: [
          { type: "text", text: params.attendeeName || "Guest" },
          { type: "text", text: params.eventName || "Event" },
          { type: "text", text: params.ticketId || "PASS" },
          { type: "text", text: passUrlText },
        ],
      });

      // 3. Interactive URL Button (Direct link to /pass/[passToken])
      if (params.passToken) {
        components.push({
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: params.passToken,
            },
          ],
        });
      }
      break;
    }

    case "registration_received": {
      // Body: {{1}} Attendee Name, {{2}} Event Name, {{3}} Reference / Ticket ID
      components.push({
        type: "body",
        parameters: [
          { type: "text", text: params.attendeeName || "Guest" },
          { type: "text", text: params.eventName || "Event" },
          { type: "text", text: params.ticketId || "PENDING" },
        ],
      });
      break;
    }

    case "payment_confirmation": {
      // Body: {{1}} Attendee Name, {{2}} Event Name, {{3}} Amount Paid, {{4}} Transaction ID
      components.push({
        type: "body",
        parameters: [
          { type: "text", text: params.attendeeName || "Guest" },
          { type: "text", text: params.eventName || "Event" },
          { type: "text", text: params.amountFormatted || "Confirmed" },
          { type: "text", text: params.transactionId || params.ticketId || "TXN" },
        ],
      });
      break;
    }

    case "event_reminder": {
      // Body: {{1}} Attendee Name, {{2}} Event Name, {{3}} Date & Time, {{4}} Venue, {{5}} Pass URL
      const dateText = params.eventDate ? new Date(params.eventDate).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Tomorrow";
      const passUrl = params.ticketUrl || (params.passToken ? `https://urpass.space/pass/${params.passToken}` : "https://urpass.space");

      components.push({
        type: "body",
        parameters: [
          { type: "text", text: params.attendeeName || "Guest" },
          { type: "text", text: params.eventName || "Event" },
          { type: "text", text: dateText },
          { type: "text", text: params.venue || "Venue" },
          { type: "text", text: passUrl },
        ],
      });
      break;
    }

    case "event_cancelled": {
      // Body: {{1}} Attendee Name, {{2}} Event Name, {{3}} Reason / Refund details
      components.push({
        type: "body",
        parameters: [
          { type: "text", text: params.attendeeName || "Guest" },
          { type: "text", text: params.eventName || "Event" },
          { type: "text", text: params.reason || "Event cancelled by organizer. Refunds will be processed automatically." },
        ],
      });
      break;
    }
  }

  return {
    name: config.name,
    language: { code: langCode },
    components,
  };
}
