import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE = "https://urpass.space";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const core = [
    { url: BASE, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${BASE}/about`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE}/faq`, priority: 0.85, changeFrequency: "weekly" as const },
    { url: `${BASE}/pricing`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE}/guides`, priority: 0.85, changeFrequency: "weekly" as const },
    { url: `${BASE}/compare`, priority: 0.85, changeFrequency: "weekly" as const },
    { url: `${BASE}/sitelinks`, priority: 0.85, changeFrequency: "weekly" as const },
    { url: `${BASE}/contact`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE}/terms`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `${BASE}/docs`, priority: 0.6, changeFrequency: "weekly" as const },
    { url: `${BASE}/feedback`, priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const seoPages = [
    // Core features
    "/platform",
    "/design-your-ticket",
    "/custom-pass-design",
    "/qr-code-scanner",
    "/event-analytics",
    "/event-registration-software",
    "/qr-event-check-in",
    "/digital-event-pass",
    "/event-attendance-tracking",
    "/attendee-management",
    "/qr-event-registration",
    "/event-entry-management",
    "/event-qr-code-generator",
    "/qr-ticketing-system",
    "/event-guest-management",
    "/event-access-control",
    "/free-event-registration",
    "/event-ticketing-software",
    "/event-ticketing-software-india",
    "/event-ticketing-platform-for-college-events",
    "/event-ticketing-platform-for-conferences",
    "/event-ticketing-platform-for-workshops",
    "/qr-ticket-scanner",
    "/how-qr-ticket-validation-works",
    "/event-ticketing-with-upi",
    "/event-ticket-payment-gateway",
    "/online-event-ticketing",
    "/qr-event-tickets",
    "/event-ticket-booking-system",
    "/free-event-ticketing",
    // Expanded feature cluster
    "/event-management-software",
    "/event-check-in-software",
    "/event-registration-platform",
    "/online-event-registration",
    "/online-event-registration-system",
    "/event-registration-form-builder",
    "/bulk-event-registration",
    "/event-attendance-software",
    "/event-pass-management-system",
    "/event-badge-generator",
    "/event-ticket-generator",
    "/event-registration-form",
    "/event-rsvp-software",
    "/event-guest-list-software",
    "/event-entry-system",
    "/multi-gate-event-check-in",
    "/event-check-in-app",
    "/qr-code-attendance-system",
    // Enterprise & Multi-Location cluster
    "/enterprise-event-management",
    "/enterprise-event-registration",
    "/corporate-event-management",
    "/multi-location-event-management",
    "/white-label-event-platform",
    "/event-data-migration",
    // High-Intent SEO & GEO Cluster (Payments, Operations, Enterprise, Comparisons)
    "/event-registration-with-payment",
    "/upi-event-ticketing",
    "/razorpay-event-registration",
    "/event-ticket-inventory-management",
    "/event-registration-approval-system",
    "/event-waitlist-management",
    "/event-capacity-management",
    "/branded-event-tickets",
    "/event-ticket-designer",
    "/event-attendee-data-export",
    "/event-check-in-dashboard",
    "/event-registration-analytics",
    "/event-no-show-tracking",
    "/event-organizer-dashboard",
    "/event-team-management",
    "/multi-event-management",
    "/event-registration-api",
    "/event-webhooks",
    "/google-forms-alternative-for-events",
    "/eventbrite-alternative-india",
    "/event-registration-software-for-agencies",
    "/event-registration-software-for-universities",
    "/event-registration-software-for-corporates",
    // Enterprise Security, SSO, SCIM & Branded Portals
    "/enterprise-sso-event-ticketing",
    "/scim-event-user-provisioning",
    "/custom-domain-event-ticketing",
    "/event-security-compliance",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.85, changeFrequency: "weekly" as const }));

  const useCasePages = [
    "/college-events",
    "/college-fests",
    "/hackathons",
    "/workshops",
    "/conferences",
    "/seminars",
    "/corporate-events",
    "/tech-events",
    "/community-events",
    "/campus-events",
    // Expanded use-cases
    "/school-events",
    "/university-events",
    "/sports-events",
    "/exhibitions",
    "/trade-shows",
    "/startup-events",
    "/networking-events",
    "/award-ceremonies",
    "/alumni-events",
    "/orientation-events",
    "/technical-symposium",
    "/cultural-fest",
    "/business-conferences",
    "/developer-meetups",
    "/training-events",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.8, changeFrequency: "weekly" as const }));

  const locationPages = [
    "/in",
    "/in/chennai",
    "/in/bangalore",
    "/in/coimbatore",
    "/in/hyderabad",
    "/in/pune",
    "/in/mumbai",
    "/in/delhi",
    "/in/gurgaon",
    "/in/noida",
    "/in/chandigarh",
    "/in/jaipur",
    "/in/goa",
    "/in/kochi",
    "/in/kolkata",
    "/in/ahmedabad",
    // High-intent root city pages
    "/event-registration-software-bangalore",
    "/event-registration-software-chennai",
    "/event-registration-software-coimbatore",
    "/event-registration-software-hyderabad",
    "/event-registration-software-mumbai",
    "/event-registration-software-pune",
    "/event-registration-software-delhi",
    "/event-registration-software-gurgaon",
    "/event-registration-software-noida",
    "/event-registration-software-kochi",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.85, changeFrequency: "weekly" as const }));

  const guidePages = [
    "/guides/what-is-qr-event-check-in",
    "/guides/how-to-create-qr-event-pass",
    "/guides/prevent-duplicate-event-entry",
    "/guides/college-event-registration-system",
    "/guides/event-check-in-without-app",
    // Expanded educational guides
    "/guides/how-does-qr-event-check-in-work",
    "/guides/how-to-create-qr-codes-for-event-attendees",
    "/guides/how-to-create-digital-event-passes",
    "/guides/how-to-manage-college-event-registrations",
    "/guides/how-to-check-in-1000-attendees-quickly",
    "/guides/how-to-manage-multiple-event-entrances",
    "/guides/how-to-create-college-fest-registration-form",
    "/guides/how-to-send-qr-tickets-to-attendees",
    "/guides/how-to-track-event-attendance-in-real-time",
    "/guides/what-information-should-event-registration-form-collect",
    "/guides/qr-ticket-vs-paper-ticket",
    "/guides/event-registration-software-vs-google-forms",
    "/guides/can-google-forms-generate-event-qr-passes",
    "/guides/how-to-run-event-registration-without-eventbrite",
    "/guides/how-to-create-free-event-tickets-online",
    "/guides/how-to-organize-registration-for-a-hackathon",
    "/guides/how-to-manage-conference-attendees",
    "/guides/best-way-to-check-attendees-into-an-event",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.75, changeFrequency: "monthly" as const }));

  const comparePages = [
    "/compare/eventbrite-alternative",
    "/compare/zoho-backstage-alternative",
    "/compare/google-forms-vs-urpass",
    "/compare/eventbrite-alternative-india",
    "/compare/zoho-backstage-alternative-india",
    "/compare/allevents-alternative",
    "/compare/townscript-alternative",
    "/compare/google-forms-event-registration-alternative",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.8, changeFrequency: "weekly" as const }));

  const mcpPages = [
    "/mcp-event-management",
    "/mcp-server-for-events",
    "/ai-agent-event-registration",
    "/ai-event-check-in",
    "/claude-desktop-event-management",
    "/cursor-mcp-event-ticketing",
    "/mcp-qr-code-scanner",
    "/ai-attendee-management",
    "/ai-event-analytics",
    "/mcp-hackathon-management",
    "/ai-conference-management",
    "/autonomous-event-check-in",
    "/mcp-event-api",
    "/ai-event-ticketing-bot",
    "/mcp-event-management-bangalore",
    "/mcp-event-management-hyderabad",
    "/mcp-event-management-chennai",
    "/mcp-event-management-pune",
    "/mcp-event-management-delhi",
    "/mcp-event-management-mumbai",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.85, changeFrequency: "weekly" as const }));

  // Query live events dynamically so public event registration pages get indexed
  let eventEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: events } = await supabase
      .from("events")
      .select("id, apply_slug, updated_at")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (events && events.length > 0) {
      eventEntries = events.flatMap((e) => [
        {
          url: `${BASE}/apply/${e.apply_slug || e.id}`,
          priority: 0.8,
          changeFrequency: "daily" as const,
          lastModified: e.updated_at || now,
        },
        {
          url: `${BASE}/feedback/${e.apply_slug || e.id}`,
          priority: 0.6,
          changeFrequency: "weekly" as const,
          lastModified: e.updated_at || now,
        },
      ]);
    }
  } catch {
    // Silently fall back if Supabase is unavailable at build-time
  }

  const staticEntries = [
    ...core,
    ...seoPages,
    ...useCasePages,
    ...locationPages,
    ...guidePages,
    ...comparePages,
    ...mcpPages,
  ].map((item) => ({ ...item, lastModified: now }));

  return [...staticEntries, ...eventEntries];
}
