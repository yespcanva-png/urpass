import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE = "https://urpass.space";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const core = [
    { url: BASE, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${BASE}/pricing`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE}/sitelinks`, priority: 0.85, changeFrequency: "weekly" as const },
    { url: `${BASE}/contact`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE}/terms`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `${BASE}/docs`, priority: 0.6, changeFrequency: "weekly" as const },
    { url: `${BASE}/feedback`, priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const seoPages = [
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
    "/event-ticketing-platform",
    "/event-ticketing-software",
    "/online-event-ticketing",
    "/qr-event-tickets",
    "/event-ticket-booking-system",
    "/free-event-ticketing",
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
    "/in/kochi",
    "/in/kolkata",
    "/in/ahmedabad",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.85, changeFrequency: "weekly" as const }));

  const guidePages = [
    "/guides/what-is-qr-event-check-in",
    "/guides/how-to-create-qr-event-pass",
    "/guides/prevent-duplicate-event-entry",
    "/guides/college-event-registration-system",
    "/guides/event-check-in-without-app",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.75, changeFrequency: "monthly" as const }));

  const comparePages = [
    "/compare/eventbrite-alternative",
    "/compare/zoho-backstage-alternative",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.75, changeFrequency: "monthly" as const }));

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
  ].map((item) => ({ ...item, lastModified: now }));

  return [...staticEntries, ...eventEntries];
}
