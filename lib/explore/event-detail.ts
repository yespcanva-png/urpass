import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { getCategoryLabel } from "./service";
import { getExploreEligibility } from "./eligibility";

export type ExploreEventDetail = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string | null;
  venue: string;
  address: string | null;
  banner: string | null;
  category: string;
  city: string | null;
  organizer: string;
  approvalRequired: boolean;
  registrationOpen: boolean;
  startingPricePaise: number;
  currency: string;
  ticketTypes: { id: string; name: string; description: string | null; price: number; capacity: number | null; soldCount: number; status: string; available: boolean }[];
  sessions: { id: string; title: string; date: string; startTime: string; endTime: string }[];
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getExploreEventDetail(slug: string): Promise<ExploreEventDetail | null> {
  const supabase = await createClient();
  const eventSelect = `id, name, description, event_date, start_time, end_time, venue, banner_url, logo_url, apply_slug, status, application_enabled, auto_approve, organizer_id, ticket_price, is_paid_event`;
  const { data: event, error: eventError } = await supabase.from("events")
    .select(eventSelect)
    .eq(UUID.test(slug) ? "id" : "apply_slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (eventError || !event) return null;

  // Explore only displays listings approved by marketplace moderation.
  const { data: listing } = await supabase.from("explore_marketplace_listings")
    .select("category, city, venue_address, editorial_summary, currency")
    .eq("event_id", event.id)
    .eq("status", "approved")
    .not("approved_at", "is", null)
    .maybeSingle();
  if (!listing) return null;
  const eligibility = await getExploreEligibility(event.id, {
    city: listing.city, category: listing.category, editorialSummary: listing.editorial_summary,
  });
  if (!eligibility.ready) return null;

  const [{ data: ticketRows }, { data: sessions }, { data: organizerProfile }] = await Promise.all([
    supabase.from("ticket_types")
      .select("id, name, description, price, capacity, status, sales_start, sales_end")
      .eq("event_id", event.id)
      .eq("status", "on_sale")
      .order("position", { ascending: true }),
    supabase.from("event_sessions")
      .select("id, title, session_date, start_time, end_time")
      .eq("event_id", event.id)
      .eq("status", "published")
      .eq("visibility", "public")
      .order("session_date", { ascending: true })
      .order("start_time", { ascending: true }),
    adminClient().from("profiles").select("org_name, company_name, full_name")
      .eq("user_id", event.organizer_id).maybeSingle(),
  ]);

  const counts = await Promise.all((ticketRows ?? []).map((ticket) => adminClient().from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("event_id", event.id)
    .eq("ticket_type_id", ticket.id)
    .neq("application_status", "rejected")));
  const now = Date.now();

  const ticketTypes = (ticketRows ?? []).map((ticket, index) => ({
    id: ticket.id, name: ticket.name, description: ticket.description,
    price: Number(ticket.price) || 0, capacity: ticket.capacity,
    soldCount: counts[index]?.count || 0, status: ticket.status,
    available: (ticket.capacity == null || (counts[index]?.count || 0) < ticket.capacity)
      && (!ticket.sales_start || new Date(ticket.sales_start).getTime() <= now)
      && (!ticket.sales_end || new Date(ticket.sales_end).getTime() >= now),
  }));
  const startingPricePaise = eligibility.minPricePaise;

  return {
    id: event.id,
    slug: event.apply_slug || event.id,
    name: event.name,
    description: listing.editorial_summary || event.description,
    date: event.event_date,
    startTime: event.start_time,
    endTime: event.end_time,
    venue: event.venue,
    address: listing.venue_address || null,
    banner: event.banner_url || event.logo_url,
    category: getCategoryLabel(listing.category || "general"),
    city: listing.city,
    organizer:
      organizerProfile?.company_name ||
      organizerProfile?.org_name ||
      organizerProfile?.full_name ||
      (event.name?.includes("YESP") ? "YESP Corp" : "Event organizer"),
    approvalRequired: !event.auto_approve,
    registrationOpen: event.application_enabled !== false,
    startingPricePaise,
    currency: listing.currency || "INR",
    ticketTypes,
    sessions: (sessions ?? []).map((session) => ({
      id: session.id, title: session.title, date: session.session_date,
      startTime: session.start_time, endTime: session.end_time,
    })),
  };
}
