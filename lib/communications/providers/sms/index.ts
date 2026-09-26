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
