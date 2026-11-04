import { SMSProvider } from "./base";
import { mockSMSProvider } from "./mock";
import { GenericDLTSMSProvider } from "./generic";
import { TwilioSMSProvider } from "./twilio";

export * from "./base";
export * from "./mock";
export * from "./generic";
export * from "./twilio";

export function getSMSProvider(providerName?: string | null): SMSProvider {
  const chosen = (providerName || process.env.SMS_PROVIDER || "mock").toLowerCase();

  switch (chosen) {
    case "mock":
    case "test":
      return mockSMSProvider;
    case "twilio":
      return new TwilioSMSProvider();
    case "dlt":
    case "fast2sms":
    case "msg91":
    case "generic":
    case "default":
    default:
      if (process.env.NODE_ENV === "test") {
        return mockSMSProvider;
      }
      return new GenericDLTSMSProvider();
  }
}

/**
 * Returns the appropriate SMS provider for a recipient.
 * International / UK numbers (+44 or any non-+91) are routed to Twilio/global gateway
 * instead of Indian DLT, preventing delivery failures.
 */
export function getSMSProviderForRecipient(recipientPhone?: string | null, providerName?: string | null): SMSProvider {
  if (recipientPhone) {
    const cleaned = recipientPhone.trim().replace(/[\s\-()]/g, "");
    const isIndian = cleaned.startsWith("+91") || (!cleaned.startsWith("+") && cleaned.length === 10);
    if (!isIndian) {
      if (process.env.NODE_ENV === "test") {
        return mockSMSProvider;
      }
      return new TwilioSMSProvider();
    }
  }
  return getSMSProvider(providerName);
}
