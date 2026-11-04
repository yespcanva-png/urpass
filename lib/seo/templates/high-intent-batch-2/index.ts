import { SeoGeoPageConfig } from "../seo-geo-template.types";
import {
  PAGE_026_CUSTOM_QR_DESIGNER_CONFIG,
  PAGE_027_PRINTABLE_BADGE_GENERATOR_CONFIG,
  PAGE_028_BRANDED_DIGITAL_PASSES_CONFIG,
  PAGE_029_VIP_ACCESS_CONTROL_CONFIG,
  PAGE_030_OFFLINE_QR_CHECKIN_CONFIG,
  PAGE_031_DUPLICATE_SCAN_PREVENTION_CONFIG,
  PAGE_032_PHONE_BASED_SCANNER_CONFIG,
} from "./ticket-studio-gate-control";
import {
  PAGE_033_BULK_IMPORT_QR_CONFIG,
  PAGE_034_INVITE_ONLY_APPROVAL_CONFIG,
  PAGE_035_CUSTOM_QUESTIONS_CONFIG,
  PAGE_036_EARLY_BIRD_VIP_CONFIG,
  PAGE_037_DISCOUNT_CODES_CONFIG,
  PAGE_038_GST_INVOICE_CONFIG,
  PAGE_039_ONE_TIME_TICKETING_CONFIG,
} from "./registration-payments";
import {
  PAGE_040_REAL_TIME_ATTENDANCE_DASHBOARD_CONFIG,
  PAGE_041_MULTI_SESSION_TRACKING_CONFIG,
  PAGE_042_CSV_EXPORT_REPORTS_CONFIG,
  PAGE_043_STAFF_PERMISSIONS_CONFIG,
  PAGE_044_API_WEBHOOKS_CONFIG,
  PAGE_045_CLAUDE_MCP_CONFIG,
} from "./analytics-enterprise";
import {
  PAGE_046_PRODUCT_LAUNCH_CONFIG,
  PAGE_047_STARTUP_PITCH_CONFIG,
  PAGE_048_ALUMNI_REUNION_CONFIG,
  PAGE_049_PROFESSIONAL_TRAINING_CONFIG,
  PAGE_050_BUSINESS_NETWORKING_CONFIG,
} from "./event-types";

export {
  PAGE_026_CUSTOM_QR_DESIGNER_CONFIG,
  PAGE_027_PRINTABLE_BADGE_GENERATOR_CONFIG,
  PAGE_028_BRANDED_DIGITAL_PASSES_CONFIG,
  PAGE_029_VIP_ACCESS_CONTROL_CONFIG,
  PAGE_030_OFFLINE_QR_CHECKIN_CONFIG,
  PAGE_031_DUPLICATE_SCAN_PREVENTION_CONFIG,
  PAGE_032_PHONE_BASED_SCANNER_CONFIG,
  PAGE_033_BULK_IMPORT_QR_CONFIG,
  PAGE_034_INVITE_ONLY_APPROVAL_CONFIG,
  PAGE_035_CUSTOM_QUESTIONS_CONFIG,
  PAGE_036_EARLY_BIRD_VIP_CONFIG,
  PAGE_037_DISCOUNT_CODES_CONFIG,
  PAGE_038_GST_INVOICE_CONFIG,
  PAGE_039_ONE_TIME_TICKETING_CONFIG,
  PAGE_040_REAL_TIME_ATTENDANCE_DASHBOARD_CONFIG,
  PAGE_041_MULTI_SESSION_TRACKING_CONFIG,
  PAGE_042_CSV_EXPORT_REPORTS_CONFIG,
  PAGE_043_STAFF_PERMISSIONS_CONFIG,
  PAGE_044_API_WEBHOOKS_CONFIG,
  PAGE_045_CLAUDE_MCP_CONFIG,
  PAGE_046_PRODUCT_LAUNCH_CONFIG,
  PAGE_047_STARTUP_PITCH_CONFIG,
  PAGE_048_ALUMNI_REUNION_CONFIG,
  PAGE_049_PROFESSIONAL_TRAINING_CONFIG,
  PAGE_050_BUSINESS_NETWORKING_CONFIG,
};

export const HIGH_INTENT_BATCH_2_PAGES: SeoGeoPageConfig[] = [
  PAGE_026_CUSTOM_QR_DESIGNER_CONFIG,
  PAGE_027_PRINTABLE_BADGE_GENERATOR_CONFIG,
  PAGE_028_BRANDED_DIGITAL_PASSES_CONFIG,
  PAGE_029_VIP_ACCESS_CONTROL_CONFIG,
  PAGE_030_OFFLINE_QR_CHECKIN_CONFIG,
  PAGE_031_DUPLICATE_SCAN_PREVENTION_CONFIG,
  PAGE_032_PHONE_BASED_SCANNER_CONFIG,
  PAGE_033_BULK_IMPORT_QR_CONFIG,
  PAGE_034_INVITE_ONLY_APPROVAL_CONFIG,
  PAGE_035_CUSTOM_QUESTIONS_CONFIG,
  PAGE_036_EARLY_BIRD_VIP_CONFIG,
  PAGE_037_DISCOUNT_CODES_CONFIG,
  PAGE_038_GST_INVOICE_CONFIG,
  PAGE_039_ONE_TIME_TICKETING_CONFIG,
  PAGE_040_REAL_TIME_ATTENDANCE_DASHBOARD_CONFIG,
  PAGE_041_MULTI_SESSION_TRACKING_CONFIG,
  PAGE_042_CSV_EXPORT_REPORTS_CONFIG,
  PAGE_043_STAFF_PERMISSIONS_CONFIG,
  PAGE_044_API_WEBHOOKS_CONFIG,
  PAGE_045_CLAUDE_MCP_CONFIG,
  PAGE_046_PRODUCT_LAUNCH_CONFIG,
  PAGE_047_STARTUP_PITCH_CONFIG,
  PAGE_048_ALUMNI_REUNION_CONFIG,
  PAGE_049_PROFESSIONAL_TRAINING_CONFIG,
  PAGE_050_BUSINESS_NETWORKING_CONFIG,
];

// Direct slug lookup map
export const HIGH_INTENT_BATCH_2_BY_SLUG: Record<string, SeoGeoPageConfig> = {};

// Populate primary slugs
HIGH_INTENT_BATCH_2_PAGES.forEach((page) => {
  HIGH_INTENT_BATCH_2_BY_SLUG[page.slug] = page;
  if (page.pageId && page.pageId !== page.slug) {
    HIGH_INTENT_BATCH_2_BY_SLUG[page.pageId] = page;
  }
});

// Add aliases for natural routing flexibility and common search query variations
const BATCH_2_ALIAS_MAPPINGS: Record<string, SeoGeoPageConfig> = {
  // Page 26
  "custom-qr-designer": PAGE_026_CUSTOM_QR_DESIGNER_CONFIG,
  "ticket-studio": PAGE_026_CUSTOM_QR_DESIGNER_CONFIG,

  // Page 27 (Top 5 Priority)
  "qr-conference-badge-generator": PAGE_027_PRINTABLE_BADGE_GENERATOR_CONFIG,
  "printable-conference-badge-generator": PAGE_027_PRINTABLE_BADGE_GENERATOR_CONFIG,
  "conference-badge-maker": PAGE_027_PRINTABLE_BADGE_GENERATOR_CONFIG,

  // Page 28
  "branded-digital-event-passes": PAGE_028_BRANDED_DIGITAL_PASSES_CONFIG,
  "company-digital-event-passes": PAGE_028_BRANDED_DIGITAL_PASSES_CONFIG,

  // Page 29
  "vip-ticket-access-control": PAGE_029_VIP_ACCESS_CONTROL_CONFIG,
  "vip-ticket-access-control-software": PAGE_029_VIP_ACCESS_CONTROL_CONFIG,

  // Page 30 (Top 5 Priority)
  "offline-qr-event-check-in-software": PAGE_030_OFFLINE_QR_CHECKIN_CONFIG,
  "offline-qr-check-in-software": PAGE_030_OFFLINE_QR_CHECKIN_CONFIG,
  "offline-event-scanner": PAGE_030_OFFLINE_QR_CHECKIN_CONFIG,

  // Page 31
  "ticket-duplicate-scan-prevention": PAGE_031_DUPLICATE_SCAN_PREVENTION_CONFIG,
  "duplicate-scan-prevention-software": PAGE_031_DUPLICATE_SCAN_PREVENTION_CONFIG,

  // Page 32
  "phone-based-ticket-scanner": PAGE_032_PHONE_BASED_SCANNER_CONFIG,
  "phone-ticket-scanner-for-staff": PAGE_032_PHONE_BASED_SCANNER_CONFIG,

  // Page 33
  "bulk-attendee-import-qr-pass": PAGE_033_BULK_IMPORT_QR_CONFIG,
  "bulk-event-attendee-import": PAGE_033_BULK_IMPORT_QR_CONFIG,

  // Page 34
  "invite-only-event-registration": PAGE_034_INVITE_ONLY_APPROVAL_CONFIG,
  "event-registration-approval-software": PAGE_034_INVITE_ONLY_APPROVAL_CONFIG,

  // Page 35
  "event-registration-custom-questions": PAGE_035_CUSTOM_QUESTIONS_CONFIG,
  "event-forms-custom-questions": PAGE_035_CUSTOM_QUESTIONS_CONFIG,

  // Page 36 (Top 5 Priority)
  "early-bird-vip-pricing": PAGE_036_EARLY_BIRD_VIP_CONFIG,
  "early-bird-and-vip-ticketing": PAGE_036_EARLY_BIRD_VIP_CONFIG,
  "tiered-event-ticketing-software": PAGE_036_EARLY_BIRD_VIP_CONFIG,

  // Page 37
  "event-ticket-discount-code-management": PAGE_037_DISCOUNT_CODES_CONFIG,
  "event-promo-code-management-software": PAGE_037_DISCOUNT_CODES_CONFIG,

  // Page 38
  "event-registration-gst-invoice-support": PAGE_038_GST_INVOICE_CONFIG,
  "event-ticketing-gst-invoice-software": PAGE_038_GST_INVOICE_CONFIG,

  // Page 39
  "one-time-event-ticketing-software": PAGE_039_ONE_TIME_TICKETING_CONFIG,
  "event-ticketing-without-subscription": PAGE_039_ONE_TIME_TICKETING_CONFIG,

  // Page 40 (Top 5 Priority)
  "real-time-attendance-dashboard": PAGE_040_REAL_TIME_ATTENDANCE_DASHBOARD_CONFIG,
  "real-time-event-attendance-dashboard": PAGE_040_REAL_TIME_ATTENDANCE_DASHBOARD_CONFIG,
  "live-event-attendance-dashboard": PAGE_040_REAL_TIME_ATTENDANCE_DASHBOARD_CONFIG,

  // Page 41
  "multi-session-conference-attendance-tracking": PAGE_041_MULTI_SESSION_TRACKING_CONFIG,
  "breakout-session-attendance-tracking": PAGE_041_MULTI_SESSION_TRACKING_CONFIG,

  // Page 42
  "event-check-in-reports-csv-export": PAGE_042_CSV_EXPORT_REPORTS_CONFIG,
  "event-check-in-csv-export-software": PAGE_042_CSV_EXPORT_REPORTS_CONFIG,

  // Page 43
  "event-management-staff-permissions": PAGE_043_STAFF_PERMISSIONS_CONFIG,
  "event-staff-permissions-software": PAGE_043_STAFF_PERMISSIONS_CONFIG,

  // Page 44
  "event-registration-api-webhooks": PAGE_044_API_WEBHOOKS_CONFIG,
  "event-ticketing-api-webhooks": PAGE_044_API_WEBHOOKS_CONFIG,

  // Page 45
  "ai-assisted-event-management": PAGE_045_CLAUDE_MCP_CONFIG,
  "claude-mcp-event-management": PAGE_045_CLAUDE_MCP_CONFIG,

  // Page 46 (Top 5 Priority)
  "product-launch-registration-software": PAGE_046_PRODUCT_LAUNCH_CONFIG,
  "product-launch-event-ticketing": PAGE_046_PRODUCT_LAUNCH_CONFIG,

  // Page 47
  "startup-pitch-event-registration": PAGE_047_STARTUP_PITCH_CONFIG,
  "demo-day-registration-software": PAGE_047_STARTUP_PITCH_CONFIG,

  // Page 48
  "alumni-reunion-registration-software": PAGE_048_ALUMNI_REUNION_CONFIG,
  "alumni-reunion-ticketing-software": PAGE_048_ALUMNI_REUNION_CONFIG,

  // Page 49
  "professional-training-registration-payments": PAGE_049_PROFESSIONAL_TRAINING_CONFIG,
  "training-event-registration-payments": PAGE_049_PROFESSIONAL_TRAINING_CONFIG,

  // Page 50
  "business-networking-registration-software": PAGE_050_BUSINESS_NETWORKING_CONFIG,
  "networking-event-registration-software": PAGE_050_BUSINESS_NETWORKING_CONFIG,
};

Object.entries(BATCH_2_ALIAS_MAPPINGS).forEach(([alias, config]) => {
  if (!HIGH_INTENT_BATCH_2_BY_SLUG[alias]) {
    HIGH_INTENT_BATCH_2_BY_SLUG[alias] = config;
  }
});

/**
 * Retrieve a Batch 2 high-intent page configuration by slug or path
 */
export function getHighIntentBatch2Page(slugOrPath: string): SeoGeoPageConfig | undefined {
  if (!slugOrPath) return undefined;
  // Clean leading/trailing slashes and common path prefixes
  const normalized = slugOrPath
    .replace(/^\/+|\/+$/g, "")
    .replace(/^solutions\//, "")
    .replace(/^uk\//, "")
    .replace(/^in\//, "");

  return (
    HIGH_INTENT_BATCH_2_BY_SLUG[normalized] ||
    HIGH_INTENT_BATCH_2_BY_SLUG[`${normalized}-uk`] ||
    HIGH_INTENT_BATCH_2_BY_SLUG[slugOrPath]
  );
}

/**
 * Get all Batch 2 slugs suitable for static params in Next.js
 */
export function getAllHighIntentBatch2Slugs(): string[] {
  return HIGH_INTENT_BATCH_2_PAGES.map((page) => page.slug);
}

