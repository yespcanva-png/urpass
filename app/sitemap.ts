import type { MetadataRoute } from "next";

const BASE = "https://urpass.space";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const core = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE}/pricing`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE}/sitelinks`, priority: 0.85, changeFrequency: "weekly" as const },
    { url: `${BASE}/contact`, priority: 0.6, changeFrequency: "yearly" as const },
    { url: `${BASE}/terms`, priority: 0.4, changeFrequency: "yearly" as const },
    { url: `${BASE}/docs`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/feedback`, priority: 0.4, changeFrequency: "yearly" as const },
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
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.85, changeFrequency: "monthly" as const }));

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
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.8, changeFrequency: "monthly" as const }));

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
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.75, changeFrequency: "monthly" as const }));

  const guidePages = [
    "/guides/what-is-qr-event-check-in",
    "/guides/how-to-create-qr-event-pass",
    "/guides/prevent-duplicate-event-entry",
    "/guides/college-event-registration-system",
    "/guides/event-check-in-without-app",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.7, changeFrequency: "monthly" as const }));

  const comparePages = [
    "/compare/eventbrite-alternative",
    "/compare/zoho-backstage-alternative",
  ].map((path) => ({ url: `${BASE}${path}`, priority: 0.7, changeFrequency: "monthly" as const }));

  return [
    ...core,
    ...seoPages,
    ...useCasePages,
    ...locationPages,
    ...guidePages,
    ...comparePages,
  ].map((item) => ({ ...item, lastModified: now }));
}
