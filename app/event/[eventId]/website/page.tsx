import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";
import WebsiteBuilder from "@/components/conference/WebsiteBuilder";
import { slugify } from "@/lib/conference/helpers";
import type { EventWebsite } from "@/types/conference";

export const metadata: Metadata = {
  title: "Website Builder — URPASS",
  robots: { index: false, follow: false },
};

export default async function EventWebsitePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) notFound();

  const supabase = await createClient();

  const [{ data: event }, { data: existingWebsite }] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, apply_slug, venue, event_date")
      .eq("id", eventId)
      .single(),
    supabase.from("event_websites").select("*").eq("event_id", eventId).maybeSingle(),
  ]);

  if (!event) notFound();

  let website = existingWebsite;
  if (!website) {
    const fallbackSlug = slugify(event.apply_slug || event.name || "event");
    website = {
      id: "draft",
      event_id: eventId,
      slug: fallbackSlug,
      custom_domain: null,
      theme: "modern",
      primary_colour: "#6C63FF",
      secondary_colour: "#0e0c16",
      hero_image: null,
      published: true,
      seo_title: `${event.name} — Official Event Website`,
      seo_description: `Join us for ${event.name} at ${event.venue}. Browse agenda, speakers and reserve your sessions.`,
      sections_config: {
        hero: { enabled: true, order: 1 },
        about: { enabled: true, order: 2 },
        agenda: { enabled: true, order: 3 },
        speakers: { enabled: true, order: 4 },
        venue: { enabled: true, order: 5 },
        sponsors: { enabled: false, order: 6 },
        faq: { enabled: true, order: 7 },
        tickets: { enabled: true, order: 8 },
        contact: { enabled: true, order: 9 },
      },
      social_links: { twitter: "", linkedin: "", instagram: "", website: "" },
      cta_text: "Register Now",
      footer_text: `© ${new Date().getFullYear()} ${event.name}. Powered by URPASS.`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return (
    <WebsiteBuilder
      eventId={eventId}
      eventName={event.name}
      initialWebsite={website as EventWebsite}
    />
  );
}
