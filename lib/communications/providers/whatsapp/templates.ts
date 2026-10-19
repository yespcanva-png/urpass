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
  eventTime?: string | null;
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

export function getApprovedTemplates(): Record<
  WhatsAppTemplateType,
  {
    name: string;
    defaultLang: string;
    description: string;
  }
> {
  const customTicket = (process.env.WHATSAPP_TEMPLATE_TICKET || process.env.WHATSAPP_TEMPLATE_NAME || "urpass_ticket").trim();
  return {
    ticket_confirmation: {
      name: customTicket,
      defaultLang: "en_US",
      description: "Transactional ticket issuance with dynamic QR pass link and ticket ID",
    },
    registration_received: {
      name: (process.env.WHATSAPP_TEMPLATE_REGISTRATION_RECEIVED || "registration_received").trim(),
      defaultLang: "en_US",
      description: "Application submission acknowledgment for events requiring organizer approval",
    },
    payment_confirmation: {
      name: (process.env.WHATSAPP_TEMPLATE_PAYMENT || "payment_confirmation").trim(),
      defaultLang: "en_US",
      description: "Payment receipt acknowledgment for paid event tickets",
    },
    event_reminder: {
      name: (process.env.WHATSAPP_TEMPLATE_REMINDER || "event_reminder").trim(),
      defaultLang: "en_US",
      description: "24-hour pre-event reminder with venue instructions and mobile pass link",
    },
    event_cancelled: {
      name: (process.env.WHATSAPP_TEMPLATE_CANCELLED || "event_cancelled").trim(),
      defaultLang: "en_US",
      description: "Event cancellation or rescheduling advisory with refund details",
    },
  };
}

export const APPROVED_TEMPLATES: Record<
  WhatsAppTemplateType,
  {
    name: string;
    defaultLang: string;
    description: string;
  }
> = new Proxy({} as any, {
  get(_target, prop: WhatsAppTemplateType) {
    return getApprovedTemplates()[prop];
  },
  ownKeys() {
    return Object.keys(getApprovedTemplates());
  },
  getOwnPropertyDescriptor(_target, prop) {
    return {
      enumerable: true,
      configurable: true,
      value: getApprovedTemplates()[prop as WhatsAppTemplateType],
    };
  },
});

/**
 * Builds Meta Cloud API template components matching approved template specifications
 */
export function buildTemplatePayload(
  templateType: WhatsAppTemplateType,
  params: TemplateParamInput,
  preferredLanguage?: string
): MetaTemplatePayload {
  const config = APPROVED_TEMPLATES[templateType] || APPROVED_TEMPLATES.ticket_confirmation;
  const langCode = (preferredLanguage || process.env.WHATSAPP_TEMPLATE_LANG || config.defaultLang).trim();

  const components: MetaTemplateComponent[] = [];

  switch (templateType) {
    case "ticket_confirmation": {
      const activeName = (config.name || "").trim();
      const isUrpassTicket = activeName === "urpass_ticket" && (params.eventDate !== undefined || params.venue !== undefined || !params.ticketUrl);

      if (isUrpassTicket) {
        // Live approved Meta template "urpass_ticket":
        // Body: Hi {{1}}, Your registration for *{{2}}* has been confirmed! Date: {{3}}, Time: {{4}}, Venue: {{5}}
        const dateText = params.eventDate
          ? new Date(params.eventDate).toLocaleDateString("en-IN", { dateStyle: "medium" })
          : "Upcoming";

        const timeText = params.eventTime || (params.eventDate && params.eventDate.includes("T")
          ? new Date(params.eventDate).toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric", hour12: true })
          : "Confirmed on Pass");

        const venueText = params.venue || "Confirmed on Pass";

        components.push({
          type: "body",
          parameters: [
            { type: "text", text: params.attendeeName || "Guest" },
            { type: "text", text: params.eventName || "Event" },
            { type: "text", text: dateText },
            { type: "text", text: timeText },
            { type: "text", text: venueText },
          ],
        });

        // URL Button: {{1}} passToken
        if (params.passToken || params.ticketId) {
          components.push({
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              {
                type: "text",
                text: params.passToken || params.ticketId || "",
              },
            ],
          });
        }
      } else {
        // Standard template format with optional header preview
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

        const passUrlText =
          params.ticketUrl ||
          (params.passToken ? `https://urpass.space/pass/${params.passToken}` : "https://urpass.space");

        components.push({
          type: "body",
          parameters: [
            { type: "text", text: params.attendeeName || "Guest" },
            { type: "text", text: params.eventName || "Event" },
            { type: "text", text: params.ticketId || "PASS" },
            { type: "text", text: passUrlText },
          ],
        });

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
