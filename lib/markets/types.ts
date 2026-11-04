import { z } from "zod";

export const countryCodeSchema = z.enum(["IN", "GB"]);
export type CountryCode = z.infer<typeof countryCodeSchema>;

export const marketCurrencySchema = z.enum(["INR", "GBP"]);
export type MarketCurrency = z.infer<typeof marketCurrencySchema>;

export type PaymentGatewayType = "razorpay" | "stripe" | "pending";

export type PrivacyFrameworkType = "DPDP_ACT_2023" | "UK_GDPR_PECR";

export interface CampusTerminology {
  readonly institution: string;
  readonly department: string;
  readonly studentOrg: string;
  readonly studentId: string;
  readonly governingBody: string;
  readonly academicTerm: string;
}

export interface TaxConfig {
  readonly taxType: "GST" | "VAT" | "NONE";
  readonly taxLabel: string; // "GST" | "VAT"
  readonly taxRatePercent: number; // 18 for India, 20 for UK
  readonly taxIdLabel: string; // "GSTIN" vs "VAT Registration Number"
  readonly taxIdRegex?: RegExp;
}

export interface MarketConfig {
  readonly countryCode: CountryCode;
  readonly countryName: string;
  readonly currency: MarketCurrency;
  readonly currencySymbol: string;
  readonly defaultTimezone: string;
  readonly locale: string;
  readonly phonePrefix: string;
  readonly phoneDigits: number;
  readonly postalCodeLabel: string;
  readonly tax: TaxConfig;
  readonly defaultGateway: PaymentGatewayType;
  readonly paymentsEnabled: boolean; // UK remains false until approved provider arrangement is verified
  readonly privacyFramework: PrivacyFrameworkType;
  readonly terminology: CampusTerminology;
}
