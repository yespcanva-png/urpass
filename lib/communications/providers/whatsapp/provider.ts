import { TicketDeliveryPayload } from "../../types";
import { isValidE164 } from "../../utils";
import { formatTimeWithAmPm } from "@/lib/utils";
import { aiSensyProvider } from "./aisensy";
import {
  buildTemplatePayload,
  APPROVED_TEMPLATES,
  WhatsAppTemplateType,
  normalizeTemplateLanguage,
  extractCleanButtonPassToken,
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
      let res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      let data = await res.json().catch(() => null);

      // ── Self-Healing Dynamic Template Resolver ──
      // Automatically resolves:
      // 1. Parameter count mismatches (Code 132000): e.g. 4 params sent when 5 expected
      // 2. Templates that REQUIRE a button parameter (Code 131008)
      // 3. Templates that DO NOT support a button component (Code 132018)
      for (let attempt = 0; attempt < 2 && !res.ok && templateObj; attempt++) {
        const errObj = data?.error;
        const code = errObj?.code;
        const details = (
          (errObj?.error_data?.details || "") +
          " " +
          (errObj?.message || "")
        ).toLowerCase();

        const isButtonParamMissing =
          code === 131008 ||
          details.includes("131008") ||
          details.includes("button at index 0 of type url requires a parameter") ||
          (details.includes("button") && details.includes("requires a parameter"));

        const isButtonNotSupported =
          code === 132018 ||
          details.includes("132018") ||
          details.includes("template does not contain a button component") ||
          details.includes("param does not exist in template") ||
          (details.includes("button") && details.includes("not contain"));

        const isParamMismatch =
          code === 132000 ||
          details.includes("132000") ||
          details.includes("number of localizable_params") ||
          details.includes("does not match the expected number of params");

        if (!isButtonParamMissing && !isButtonNotSupported && !isParamMismatch) {
          break;
        }

        let modified = false;

        if (isParamMismatch) {
          const match =
            details.match(/expected number of params\s*(?:\(|:)?\s*(\d+)/i) ||
            details.match(/localizable_params\s*\(\s*\d+\s*\)\s*does not match(?: the)? expected number of params\s*\(\s*(\d+)\s*\)/i);
          const expectedCount = match ? parseInt(match[1], 10) : null;

          if (expectedCount !== null) {
            const buttonToken =
              extractCleanButtonPassToken(payload.passToken, payload.ticketUrl, payload.ticketId) ||
              payload.passToken ||
              "pass";
            const dateText = payload.eventDate
              ? new Date(payload.eventDate).toLocaleDateString("en-IN", { dateStyle: "long", timeZone: "Asia/Kolkata" })
              : "24 October 2026";
            const timeText =
              formatTimeWithAmPm(payload.eventTime) ||
              (payload.eventDate?.includes("T")
                ? new Date(payload.eventDate).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" })
                : "11:00 AM");
            const venueText = payload.venue || "Confirmed on Pass";
            const passUrl =
              payload.ticketUrl || (buttonToken ? `https://urpass.space/pass/${buttonToken}` : "https://urpass.space");
            const eventName = payload.eventName || "Event";
            const attendeeName = payload.attendeeName || "Guest";
            const ticketId = payload.ticketId || "PASS";

            let bodyComp = (templateObj.components || []).find((c: any) => c.type === "body");
            if (!bodyComp) {
              bodyComp = { type: "body", parameters: [] };
              templateObj.components = templateObj.components || [];
              templateObj.components.push(bodyComp);
            }

            const tName = (templateObj.name || "").toLowerCase();
            if (expectedCount === 5) {
              if (tName.includes("nivi")) {
                bodyComp.parameters = [
                  { type: "text", text: eventName },
                  { type: "text", text: dateText },
                  { type: "text", text: timeText },
                  { type: "text", text: venueText },
                  { type: "text", text: passUrl },
                ];
              } else {
                bodyComp.parameters = [
                  { type: "text", text: attendeeName },
                  { type: "text", text: eventName },
                  { type: "text", text: dateText },
                  { type: "text", text: timeText },
                  { type: "text", text: venueText },
                ];
              }
            } else if (expectedCount === 4) {
              if (tName.includes("nivi")) {
                bodyComp.parameters = [
                  { type: "text", text: dateText },
                  { type: "text", text: timeText },
                  { type: "text", text: venueText },
                  { type: "text", text: passUrl },
                ];
              } else {
                bodyComp.parameters = [
                  { type: "text", text: attendeeName },
                  { type: "text", text: eventName },
                  { type: "text", text: dateText },
                  { type: "text", text: venueText },
                ];
              }
            } else if (expectedCount === 3) {
              bodyComp.parameters = [
                { type: "text", text: dateText },
                { type: "text", text: timeText },
                { type: "text", text: venueText },
              ];
            } else if (expectedCount === 2) {
              bodyComp.parameters = [
                { type: "text", text: attendeeName },
                { type: "text", text: eventName },
              ];
            } else if (expectedCount === 1) {
              bodyComp.parameters = [
                { type: "text", text: eventName || attendeeName },
              ];
            } else {
              const pool = [attendeeName, eventName, dateText, timeText, venueText, passUrl, ticketId];
              bodyComp.parameters = Array.from({ length: expectedCount }, (_, idx) => ({
                type: "text",
                text: pool[idx % pool.length],
              }));
            }
            modified = true;
          }
        }

        if (isButtonParamMissing) {
          const buttonToken =
            extractCleanButtonPassToken(payload.passToken, payload.ticketUrl, payload.ticketId) ||
            payload.passToken ||
            "pass";

          templateObj.components = (templateObj.components || []).filter(
            (c: any) => c.type !== "button"
          );
          templateObj.components.push({
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              {
                type: "text",
                text: buttonToken,
              },
            ],
          });
          modified = true;
        } else if (isButtonNotSupported) {
          templateObj.components = (templateObj.components || []).filter(
            (c: any) => c.type !== "button"
          );
          modified = true;
        }

        if (!modified) break;

        requestBody.template = templateObj;

        try {
          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), 6000);
          res = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            signal: retryController.signal,
          });
          clearTimeout(retryTimeoutId);
          data = await res.json().catch(() => null);
        } catch {
          break;
        }
      }

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

