import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategoryLabel } from "@/lib/explore/service";
import CorporateEventPage, {
  type CorporateEventData,
} from "@/components/explore/CorporateEventPage";
import ApplyPage from "@/app/apply/[eventId]/page";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slug
    );
  const supabase = await createClient();
  const query = supabase
    .from("events")
    .select(
      "id, name, description, venue, event_date, start_time, banner_url, logo_url, apply_slug"
    )
    .eq("status", "active");

  const { data: event } = await (isUuid
    ? query.eq("id", slug)
    : query.eq("apply_slug", slug)
  ).maybeSingle();

  if (!event) {
    return { title: "Register for Event — UrPass" };
  }

  const title = `${event.name} — Official Executive Pass & Entry`;
  const desc =
    event.description ||
    `Register for ${event.name} at ${event.venue}. Digital QR event pass issued immediately upon approval.`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: event.banner_url ? [event.banner_url] : [],
    },
  };
}

export default async function EventSeoSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slug
    );
  const supabase = await createClient();

  const query = supabase
    .from("events")
    .select(`
      id,
      name,
      description,
      event_date,
      start_time,
      end_time,
      venue,
      banner_url,
      logo_url,
      status,
      apply_slug,
      attendee_limit,
      ticket_types(
        id,
        name,
        description,
        price,
        capacity,
        status
      ),
      explore_marketplace_listings(
        id,
        status,
        featured,
        category,
        city,
        venue_address,
        editorial_summary
      )
    `)
    .eq("status", "active");

  const { data: event } = await (isUuid
    ? query.eq("id", slug)
    : query.eq("apply_slug", slug)
  ).maybeSingle();

  if (!event) {
    // Fall back to ApplyPage which handles drafts, organizer preview, etc.
    return <ApplyPage params={Promise.resolve({ eventId: slug })} />;
  }

  // Format corporate event data
  const listing = Array.isArray(event.explore_marketplace_listings)
    ? event.explore_marketplace_listings[0]
    : event.explore_marketplace_listings;

  const rawTickets = Array.isArray(event.ticket_types) ? event.ticket_types : [];
  const ticketTypes =
    rawTickets.length > 0
      ? rawTickets.map((t: any) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          price: t.price || 0,
          capacity: t.capacity,
          status: t.status || "on_sale",
        }))
      : [
          {
            id: "default",
            name: "General Admission Pass",
            description:
              "Complimentary access to mixer panels and networking area",
            price: 0,
            capacity: event.attendee_limit,
            status: "on_sale",
          },
        ];

  const city = listing?.city || "Bengaluru";
  const category = listing?.category || "business";

  const corporateData: CorporateEventData = {
    id: event.id,
    name: event.name,
    description:
      listing?.editorial_summary ||
      event.description ||
      "Exclusive curated gathering bringing together founders, technology leaders, and practitioners.",
    eventDate: event.event_date,
    startTime: event.start_time,
    endTime: event.end_time,
    venue: event.venue,
    venueAddress:
      listing?.venue_address || `${event.venue}, ${city}`,
    bannerUrl: event.banner_url,
    logoUrl: event.logo_url,
    city,
    category,
    categoryLabel: getCategoryLabel(category),
    attendeeLimit: event.attendee_limit || 250,
    slug: event.apply_slug || event.id,
    organizerName: "UrPass Verified Host",
    ticketTypes,
  };

  return <CorporateEventPage event={corporateData} />;
}
