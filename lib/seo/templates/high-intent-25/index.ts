import { SeoGeoPageConfig } from "../seo-geo-template.types";
import { PAGE_001_CORPORATE_CONFIG } from "../page-001-corporate";
import {
  PAGE_002_CONFERENCE_CONFIG,
  PAGE_003_COLLEGE_FEST_CONFIG,
  PAGE_004_AGENCIES_CONFIG,
  PAGE_005_PAID_WORKSHOP_CONFIG,
} from "./india-solutions-1";
import {
  PAGE_006_MULTI_GATE_CONFIG,
  PAGE_007_RAZORPAY_CONFIG,
  PAGE_008_GUEST_APPROVAL_CONFIG,
  PAGE_009_ZERO_COMMISSION_CONFIG,
  PAGE_010_HACKATHON_CONFIG,
} from "./india-solutions-2";
import {
  PAGE_011_SEMINAR_CONFIG,
  PAGE_012_EXHIBITION_VISITORS_CONFIG,
  PAGE_013_QR_CANCELLATION_CONFIG,
  PAGE_014_APPROVAL_WORKFLOW_CONFIG,
  PAGE_015_ATTENDEE_DASHBOARD_CONFIG,
} from "./india-solutions-3";
import {
  PAGE_016_UK_CONFERENCE_CONFIG,
  PAGE_017_UK_QR_CHECKIN_CONFIG,
  PAGE_018_UK_UNIVERSITIES_CONFIG,
  PAGE_019_UK_GUEST_MANAGEMENT_CONFIG,
  PAGE_020_UK_WORKSHOPS_CONFIG,
} from "./uk-solutions";
import {
  PAGE_021_BANGALORE_CONFIG,
  PAGE_022_CHENNAI_CONFIG,
  PAGE_023_HYDERABAD_CONFIG,
  PAGE_024_MUMBAI_CONFIG,
  PAGE_025_PUNE_CONFIG,
} from "./city-solutions";

export const HIGH_INTENT_25_PAGES: SeoGeoPageConfig[] = [
  PAGE_001_CORPORATE_CONFIG,
  PAGE_002_CONFERENCE_CONFIG,
  PAGE_003_COLLEGE_FEST_CONFIG,
  PAGE_004_AGENCIES_CONFIG,
  PAGE_005_PAID_WORKSHOP_CONFIG,
  PAGE_006_MULTI_GATE_CONFIG,
  PAGE_007_RAZORPAY_CONFIG,
  PAGE_008_GUEST_APPROVAL_CONFIG,
  PAGE_009_ZERO_COMMISSION_CONFIG,
  PAGE_010_HACKATHON_CONFIG,
  PAGE_011_SEMINAR_CONFIG,
  PAGE_012_EXHIBITION_VISITORS_CONFIG,
  PAGE_013_QR_CANCELLATION_CONFIG,
  PAGE_014_APPROVAL_WORKFLOW_CONFIG,
  PAGE_015_ATTENDEE_DASHBOARD_CONFIG,
  PAGE_016_UK_CONFERENCE_CONFIG,
  PAGE_017_UK_QR_CHECKIN_CONFIG,
  PAGE_018_UK_UNIVERSITIES_CONFIG,
  PAGE_019_UK_GUEST_MANAGEMENT_CONFIG,
  PAGE_020_UK_WORKSHOPS_CONFIG,
  PAGE_021_BANGALORE_CONFIG,
  PAGE_022_CHENNAI_CONFIG,
  PAGE_023_HYDERABAD_CONFIG,
  PAGE_024_MUMBAI_CONFIG,
  PAGE_025_PUNE_CONFIG,
];

// Direct slug lookup map
export const HIGH_INTENT_25_BY_SLUG: Record<string, SeoGeoPageConfig> = {};

// Populate primary slugs
HIGH_INTENT_25_PAGES.forEach((page) => {
  HIGH_INTENT_25_BY_SLUG[page.slug] = page;
  if (page.pageId && page.pageId !== page.slug) {
    HIGH_INTENT_25_BY_SLUG[page.pageId] = page;
  }
});

// Add aliases for natural routing flexibility
const ALIAS_MAPPINGS: Record<string, SeoGeoPageConfig> = {
  // UK Aliases (with or without -uk suffix)
  "conference-registration-software": PAGE_016_UK_CONFERENCE_CONFIG,
  "qr-code-event-check-in-software": PAGE_017_UK_QR_CHECKIN_CONFIG,
  "event-registration-platform-for-universities": PAGE_018_UK_UNIVERSITIES_CONFIG,
  "corporate-event-guest-management-software": PAGE_019_UK_GUEST_MANAGEMENT_CONFIG,
  "event-ticketing-software-for-workshops": PAGE_020_UK_WORKSHOPS_CONFIG,

  // City Aliases (matching exact query variations)
  "event-registration-software-for-bangalore-corporate-events": PAGE_021_BANGALORE_CONFIG,
  "conference-qr-check-in-software-chennai": PAGE_022_CHENNAI_CONFIG,
  "college-fest-ticketing-software-hyderabad": PAGE_023_HYDERABAD_CONFIG,
  "event-agency-registration-software-mumbai": PAGE_024_MUMBAI_CONFIG,
  "corporate-event-attendee-check-in-pune": PAGE_025_PUNE_CONFIG,
};

Object.entries(ALIAS_MAPPINGS).forEach(([alias, config]) => {
  if (!HIGH_INTENT_25_BY_SLUG[alias]) {
    HIGH_INTENT_25_BY_SLUG[alias] = config;
  }
});

/**
 * Retrieve a high-intent page configuration by slug or path
 */
export function getHighIntent25Page(slugOrPath: string): SeoGeoPageConfig | undefined {
  if (!slugOrPath) return undefined;
  // Clean leading/trailing slashes and common path prefixes
  const normalized = slugOrPath
    .replace(/^\/+|\/+$/g, "")
    .replace(/^solutions\//, "")
    .replace(/^uk\//, "")
    .replace(/^in\//, "");

  return (
    HIGH_INTENT_25_BY_SLUG[normalized] ||
    HIGH_INTENT_25_BY_SLUG[`${normalized}-uk`] ||
    HIGH_INTENT_25_BY_SLUG[slugOrPath]
  );
}

/**
 * Get all slugs suitable for static params in Next.js
 */
export function getAllHighIntentSlugs(): string[] {
  return HIGH_INTENT_25_PAGES.map((page) => page.slug);
}
