import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SessionLandingView from "@/components/conference/SessionLandingView";
import type { EventSession } from "@/types/conference";
import { resolveEventOgImage } from "@/lib/seo/og-images";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sessionSlug: string }>;
}): Promise<Metadata> {
  const { slug, sessionSlug } = await params;
  const supabase = await createClient();

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionSlug);
  const { data: session } = await (isUuid
    ? supabase.from("event_sessions").select("title, description").eq("id", sessionSlug)
    : supabase.from("event_sessions").select("title, description").eq("slug", sessionSlug)
  ).maybeSingle();

  if (!session) return { title: "Session Details — URPASS" };

  const isEventUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  const { data: event } = await (isEventUuid
    ? supabase.from("events").select("name, banner_url, logo_url, custom_pass_design").eq("id", slug)
    : supabase.from("events").select("name, banner_url, logo_url, custom_pass_design").eq("apply_slug", slug)
  ).maybeSingle();

  const ogImage = resolveEventOgImage(event);
  const title = `${session.title} — ${event?.name || "URPASS Conference"}`;
  const description = session.description || undefined;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "URPASS",
      images: [
        {
          url: ogImage.url,
          secureUrl: ogImage.secureUrl,
          alt: ogImage.alt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function PublicSessionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; sessionSlug: string }>;
  searchParams: Promise<{ passToken?: string }>;
}) {
  const { slug, sessionSlug } = await params;
  const { passToken } = await searchParams;
  const supabase = await createClient();

  // 1. Resolve event
  let eventId: string | null = null;
  let eventName = "Conference";

  const { data: website } = await supabase
    .from("event_websites")
    .select("event_id, event:events(name)")
    .eq("slug", slug)
    .maybeSingle();

  if (website) {
    eventId = website.event_id;
    eventName = (website.event as any)?.name || "Conference";
  } else {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    const { data: evt } = await (isUuid
      ? supabase.from("events").select("id, name").eq("id", slug)
      : supabase.from("events").select("id, name").eq("apply_slug", slug)
    ).maybeSingle();

    if (evt) {
      eventId = evt.id;
      eventName = evt.name;
    }
  }

  if (!eventId) notFound();

  // 2. Fetch session
  const isSessionUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionSlug);
  const sessionQuery = supabase
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
    .eq("event_id", eventId);

  const { data: sessionRaw, error } = await (isSessionUuid
    ? sessionQuery.eq("id", sessionSlug)
    : sessionQuery.eq("slug", sessionSlug)
  ).maybeSingle();

  if (error || !sessionRaw) notFound();

  const reservation_count = (sessionRaw.reservations || []).filter(
    (r: any) => r.status === "reserved" || r.status === "attended"
  ).length;

  const { reservations, ...rest } = sessionRaw;
  const session = { ...rest, reservation_count } as EventSession;

  return (
    <SessionLandingView
      session={session}
      eventSlug={slug}
      eventName={eventName}
      initialPassToken={passToken}
    />
  );
}
