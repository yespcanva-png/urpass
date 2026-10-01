import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PublicEventWebsite from "@/components/conference/PublicEventWebsite";
import type { EventSession, EventTrack, EventRoom, EventSpeaker, EventWebsite } from "@/types/conference";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  // Try website slug first
  const { data: website } = await supabase
    .from("event_websites")
    .select("seo_title, seo_description, event:events(name, description)")
    .eq("slug", slug)
    .maybeSingle();

  if (website) {
    const eventName = (website.event as any)?.name || "Conference";
    return {
      title: website.seo_title || `${eventName} — Conference Schedule & Passes`,
      description: website.seo_description || (website.event as any)?.description || undefined,
    };
  }

  // Try event apply_slug or ID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  const { data: event } = await (isUuid
    ? supabase.from("events").select("name, description").eq("id", slug)
    : supabase.from("events").select("name, description").eq("apply_slug", slug)
  ).maybeSingle();

  if (!event) return { title: "Conference — URPASS" };

  return {
    title: `${event.name} — Schedule & Passes`,
    description: event.description || `Attend ${event.name}. Complete agenda and speaker line-up.`,
  };
}

export default async function PublicEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ passToken?: string }>;
}) {
  const { slug } = await params;
  const { passToken } = await searchParams;
  const supabase = await createClient();

  // 1. Resolve Event and Website
  let eventId: string | null = null;
  let websiteRecord: any = null;

  const { data: websiteBySlug } = await supabase
    .from("event_websites")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (websiteBySlug) {
    eventId = websiteBySlug.event_id;
    websiteRecord = websiteBySlug;
  } else {
    // Check if slug matches event.apply_slug or event.id
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    const { data: eventBySlug } = await (isUuid
      ? supabase.from("events").select("id").eq("id", slug)
      : supabase.from("events").select("id").eq("apply_slug", slug)
    ).maybeSingle();

    if (eventBySlug) {
      eventId = eventBySlug.id;
      const { data: web } = await supabase
        .from("event_websites")
        .select("*")
        .eq("event_id", eventId)
        .maybeSingle();
      websiteRecord = web;
    }
  }

  if (!eventId) notFound();

  // 2. Fetch Event, Tracks, Rooms, Sessions, Speakers
  const [
    { data: event },
    { data: tracks },
    { data: rooms },
    { data: sessionsRaw },
    { data: speakers },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, description, event_date, start_time, end_time, venue, status, apply_slug, banner_url, logo_url, is_paid_event, ticket_price")
      .eq("id", eventId)
      .single(),

    supabase
      .from("event_tracks")
      .select("*")
      .eq("event_id", eventId)
      .eq("visibility", "public")
      .order("sort_order", { ascending: true }),

    supabase
      .from("event_rooms")
      .select("*")
      .eq("event_id", eventId)
      .order("name", { ascending: true }),

    supabase
      .from("event_sessions")
      .select(`
        *,
        track:event_tracks (*),
        room:event_rooms (*),
        speakers:session_speakers (
          id,
          role,
          sort_order,
          speaker:event_speakers (*)
        ),
        reservations:session_reservations (id, status)
      `)
      .eq("event_id", eventId)
      .eq("visibility", "public")
      .neq("status", "cancelled")
      .order("session_date", { ascending: true })
      .order("start_time", { ascending: true }),

    supabase
      .from("event_speakers")
      .select("*")
      .eq("event_id", eventId)
      .eq("visibility", "public")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (!event) notFound();

  const sessions = ((sessionsRaw || []) as any[]).map((s) => {
    const reservation_count = (s.reservations || []).filter(
      (r: any) => r.status === "reserved" || r.status === "attended"
    ).length;
    const { reservations, ...rest } = s;
    return { ...rest, reservation_count } as EventSession;
  });

  const defaultWebsite: EventWebsite = websiteRecord || {
    id: "default",
    event_id: event.id,
    slug: event.apply_slug || event.id,
    custom_domain: null,
    theme: "modern",
    primary_colour: "#6C63FF",
    secondary_colour: "#0e0c16",
    hero_image: event.banner_url || null,
    published: true,
    seo_title: `${event.name} — Schedule & Passes`,
    seo_description: event.description || "",
    sections_config: {
      hero: { enabled: true, order: 1 },
      about: { enabled: true, order: 2 },
      agenda: { enabled: true, order: 3 },
      speakers: { enabled: true, order: 4 },
      venue: { enabled: true, order: 5 },
      faq: { enabled: true, order: 7 },
      tickets: { enabled: true, order: 8 },
      contact: { enabled: true, order: 9 },
    },
    social_links: { twitter: "", linkedin: "", instagram: "", website: "" },
    cta_text: "Register Now",
    footer_text: `© ${new Date().getFullYear()} ${event.name}. Powered by UrPass.`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <PublicEventWebsite
      event={event}
      website={defaultWebsite}
      tracks={(tracks || []) as EventTrack[]}
      rooms={(rooms || []) as EventRoom[]}
      sessions={sessions}
      speakers={(speakers || []) as EventSpeaker[]}
      initialPassToken={passToken}
    />
  );
}
