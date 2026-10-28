import { CTAConfig, VisitorSegment } from "./types";
import { adminClient } from "@/lib/supabase/admin";

export const DEFAULT_CTA_CATALOG: Record<VisitorSegment, CTAConfig> = {
  college: {
    segment: "college",
    primaryCtaLabel: "Create College Event",
    primaryCtaSubtext: "Free Forever Plan Available · 0% Ticket Commission · Sub-second Check-in",
    primaryCtaUrl: "/signup?segment=college&intent=organizer_signup",
    secondaryCtaLabel: "Request Campus Walkthrough",
    secondaryCtaSubtext: "Talk to campus fest specialist",
    secondaryCtaUrl: "/contact?segment=college",
    badgeText: "Campus & Fest Edition",
    headlineOverride: "Host Flawless College Fests, Symposia & Campus Events",
    isActive: true,
  },
  corporate: {
    segment: "corporate",
    primaryCtaLabel: "Start Free / Request Demo",
    primaryCtaSubtext: "Instant Setup · GST Tax Invoices · Corporate RBAC Workspaces",
    primaryCtaUrl: "/signup?segment=corporate&intent=organizer_signup",
    secondaryCtaLabel: "Book Enterprise Demo",
    secondaryCtaSubtext: "Live 1-on-1 walkthrough with an engineer",
    secondaryCtaUrl: "/contact?segment=corporate",
    badgeText: "Corporate & Enterprise",
    headlineOverride: "Enterprise Event Registration & Digital Access Control",
    isActive: true,
  },
  ticketing: {
    segment: "ticketing",
    primaryCtaLabel: "Create Tickets",
    primaryCtaSubtext: "0% Platform Fee · Direct Razorpay/UPI Payouts · Instant QR Delivery",
    primaryCtaUrl: "/signup?segment=ticketing&intent=organizer_signup",
    secondaryCtaLabel: "Calculate Your Savings",
    secondaryCtaSubtext: "See how much you save vs 8% ticketing fees",
    secondaryCtaUrl: "/ticket-fee-calculator",
    badgeText: "0% Fee Ticketing",
    headlineOverride: "Sell Tickets Online with 0% Platform Commission",
    isActive: true,
  },
  managed_service: {
    segment: "managed_service",
    primaryCtaLabel: "Request Managed Setup",
    primaryCtaSubtext: "From ₹1,000/event · Done-For-You Remote Setup by UrPass Engineers",
    primaryCtaUrl: "/contact?segment=managed_service",
    secondaryCtaLabel: "Start Self-Service",
    secondaryCtaSubtext: "Or configure your own event in minutes",
    secondaryCtaUrl: "/signup?segment=self_service&intent=organizer_signup",
    badgeText: "Done-For-You Remote Service",
    headlineOverride: "Remote Managed Event Ticketing & Pass Configuration",
    isActive: true,
  },
  general: {
    segment: "general",
    primaryCtaLabel: "Create Your Event",
    primaryCtaSubtext: "Free Forever Plan Available · 0% Ticket Commission · Fast Setup",
    primaryCtaUrl: "/signup?segment=general&intent=organizer_signup",
    secondaryCtaLabel: "Explore Features",
    secondaryCtaSubtext: "Discover ticket studio, offline scanning & MCP",
    secondaryCtaUrl: "/features",
    badgeText: "Sub-Second QR Platform",
    headlineOverride: "Digital Event Passes & Lightning Fast QR Check-In",
    isActive: true,
  },
};

/**
 * Resolves CTA configuration for a visitor segment.
 * Falls back deterministically to catalog if database query is unavailable.
 */
export async function getResolvedCTAConfig(segment: VisitorSegment): Promise<CTAConfig> {
  const fallback = DEFAULT_CTA_CATALOG[segment] || DEFAULT_CTA_CATALOG.general;

  try {
    const admin = adminClient();
    const { data: dbConfig } = await admin
      .from("conversion_cta_configs")
      .select("*")
      .eq("segment", segment)
      .eq("is_active", true)
      .maybeSingle();

    if (dbConfig) {
      return {
        id: dbConfig.id,
        segment: dbConfig.segment,
        primaryCtaLabel: dbConfig.primary_cta_label,
        primaryCtaSubtext: dbConfig.primary_cta_subtext,
        primaryCtaUrl: dbConfig.primary_cta_url,
        secondaryCtaLabel: dbConfig.secondary_cta_label,
        secondaryCtaSubtext: dbConfig.secondary_cta_subtext,
        secondaryCtaUrl: dbConfig.secondary_cta_url,
        badgeText: dbConfig.badge_text,
        headlineOverride: dbConfig.headline_override,
        isActive: dbConfig.is_active,
      };
    }
  } catch (err) {
    // Graceful fallback
  }

  return fallback;
}

/**
 * Synchronous client-side resolver using deterministic catalog.
 */
export function getClientCTAConfig(segment: VisitorSegment): CTAConfig {
  return DEFAULT_CTA_CATALOG[segment] || DEFAULT_CTA_CATALOG.general;
}
