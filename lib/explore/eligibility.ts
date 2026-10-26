import { adminClient } from "@/lib/supabase/admin";
import { EXPLORE_CATEGORIES, EXPLORE_CITIES } from "./types";

export type ExploreListingMetadata = {
  city?: string | null;
  category?: string | null;
  editorialSummary?: string | null;
};

export type ExploreEligibility = {
  ready: boolean;
  issues: string[];
  minPricePaise: number;
  isFree: boolean;
  availableTickets: number | null;
};

export type EligibilityEvent = {
  id: string;
  name: string | null;
  description: string | null;
  banner_url: string | null;
  logo_url: string | null;
  custom_pass_design?: Record<string, unknown> | null;
  status: string;
  application_enabled: boolean;
  apply_slug: string | null;
  event_date: string;
  start_time: string;
  venue: string | null;
  attendee_limit: number | null;
  is_paid_event: boolean;
  ticket_price: number | null;
  organizer_id?: string | null;
  organization_id?: string | null;
};

export type EligibilityTier = {
  id: string;
  status: string;
  price: number;
  capacity: number | null;
  sales_start: string | null;
  sales_end: string | null;
  reserved: number;
};

export function eventLocalNow(now: Date, city?: string | null, configuredTimezone?: string | null): { date: string; time: string } {
  const fallback = city?.toLowerCase() === "london" ? "Europe/London" : "Asia/Kolkata";
  let timeZone = configuredTimezone || fallback;
  try { new Intl.DateTimeFormat("en-GB", { timeZone }); } catch { timeZone = fallback; }
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value || "00";
  return { date: `${part("year")}-${part("month")}-${part("day")}`, time: `${part("hour")}:${part("minute")}` };
}

export function assessExploreEligibility(input: {
  event: EligibilityEvent | null;
  metadata: ExploreListingMetadata;
  tiers: EligibilityTier[];
  attendeeCount: number;
  activeReservations: number;
  now?: Date;
  userId?: string | null;
  isAuthorized?: boolean;
}): ExploreEligibility {
  const { event, metadata, tiers, attendeeCount, activeReservations, isAuthorized } = input;
  if (!event) {
    return { ready: false, issues: ["Event not found."], minPricePaise: 0, isFree: true, availableTickets: 0 };
  }

  const issues: string[] = [];

  // 1. Authorization check (if explicitly evaluated)
  if (isAuthorized === false) {
    issues.push("You are not authorized to manage this event's Explore marketplace listing.");
  }

  // 2. Event status check (not cancelled, completed, or draft)
  if (event.status !== "active") {
    if (event.status === "cancelled") {
      issues.push("Cancelled events cannot be listed on Explore.");
    } else if (event.status === "completed") {
      issues.push("Completed events cannot be listed on Explore.");
    } else {
      issues.push("Event must be published and set to Active status.");
    }
  }

  // 3. Registration enabled check
  if (!event.application_enabled) {
    issues.push("Attendee applications or ticket sales must be enabled in settings.");
  }

  // 4. Public visibility eligibility
  const design = event.custom_pass_design || {};
  if (design.is_private === true || design.visibility === "private" || design.visibility === "invite_only") {
    issues.push("Private or invitation-only events cannot be listed publicly.");
  }

  // 5. Valid direct registration route
  if (!event.apply_slug && !event.id) {
    issues.push("Create a direct event registration link before applying.");
  }

  // 6. Title and Venue
  if (!event.name?.trim()) issues.push("Add an event title.");
  if (!event.venue?.trim()) issues.push("A venue name or physical address must be specified.");

  // 7. Description or Editorial Summary
  if (!(event.description?.trim() || metadata.editorialSummary?.trim())) {
    issues.push("Add an event description or Explore summary.");
  }

  // 8. Image / Cover
  const hasDesignImage =
    Array.isArray(design.event_images) && design.event_images.some((url) => typeof url === "string" && url.length > 0);
  if (!event.banner_url && !event.logo_url && !hasDesignImage) {
    issues.push("Add an event cover image or logo.");
  }

  // 9. Valid City and Category
  if (!metadata.city || !EXPLORE_CITIES.some((city) => city !== "All Cities" && city === metadata.city)) {
    issues.push("Choose a valid Explore city.");
  }
  if (!metadata.category || !EXPLORE_CATEGORIES.some((category) => category.key !== "all" && category.key === metadata.category)) {
    issues.push("Choose a valid Explore category.");
  }

  // 10. Date and Time boundaries
  const localNow = eventLocalNow(input.now || new Date(), metadata.city,
    typeof design.timezone === "string" ? design.timezone : null);
  if (!event.event_date) {
    issues.push("Event date must be specified.");
  } else if (event.event_date < localNow.date || (event.event_date === localNow.date && (event.start_time || "00:00") < localNow.time)) {
    issues.push("Event date cannot be in the past.");
  }

  // 11. Available tickets / registration capacity (Free, Base-Price, and Multi-Tier)
  const nowMs = (input.now || new Date()).getTime();
  const onSale = tiers.filter(
    (tier) =>
      tier.status === "on_sale" &&
      (!tier.sales_start || Date.parse(tier.sales_start) <= nowMs) &&
      (!tier.sales_end || Date.parse(tier.sales_end) >= nowMs)
  );

  const eventRemaining =
    event.attendee_limit == null ? null : Math.max(0, event.attendee_limit - attendeeCount - activeReservations);
  const available = onSale.filter((tier) => tier.capacity == null || tier.reserved < tier.capacity);

  if ((eventRemaining !== null && eventRemaining <= 0) || (tiers.length > 0 && available.length === 0)) {
    issues.push("No registration option has available tickets. Open a ticket tier or increase capacity.");
  }

  // Compute minimum starting price
  const prices = available.map((tier) => Math.max(0, Number(tier.price) || 0));
  const minPricePaise = prices.length
    ? Math.min(...prices)
    : tiers.length === 0 && event.is_paid_event
    ? Math.max(0, Math.round(Number(event.ticket_price || 0) * 100))
    : 0;
  if (tiers.length === 0 && event.is_paid_event && minPricePaise === 0) {
    issues.push("Set a valid base ticket price or add an available ticket tier.");
  }

  return {
    ready: issues.length === 0,
    issues,
    minPricePaise,
    isFree: minPricePaise === 0,
    availableTickets: eventRemaining,
  };
}

export async function getExploreEligibility(
  eventId: string,
  metadata: ExploreListingMetadata,
  userId?: string | null
): Promise<ExploreEligibility> {
  const db = adminClient();
  const { data: event, error: eventError } = await db
    .from("events")
    .select(
      "id, name, description, banner_url, logo_url, custom_pass_design, status, application_enabled, apply_slug, event_date, start_time, venue, attendee_limit, is_paid_event, ticket_price, organizer_id, organization_id"
    )
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) throw new Error(`Unable to verify event eligibility: ${eventError.message}`);
  if (!event) {
    return assessExploreEligibility({
      event: null,
      metadata,
      tiers: [],
      attendeeCount: 0,
      activeReservations: 0,
    });
  }

  let isAuthorized = true;
  if (userId) {
    if (event.organizer_id !== userId) {
      isAuthorized = false;
      if (event.organization_id) {
        const { data: member } = await db
          .from("organization_members")
          .select("role")
          .eq("organization_id", event.organization_id)
          .eq("user_id", userId)
          .eq("status", "active")
          .in("role", ["owner", "admin", "event_manager"])
          .maybeSingle();

        if (member) isAuthorized = true;
      }
    }
  }

  const [
    { data: tierRows, error: tierError },
    { count: attendeeCount, error: attendeeError },
    { data: reservations, error: reservationError },
  ] = await Promise.all([
    db.from("ticket_types").select("id, status, price, capacity, sales_start, sales_end").eq("event_id", eventId),
    db.from("attendees").select("*", { count: "exact", head: true }).eq("event_id", eventId).neq("application_status", "rejected"),
    db.from("ticket_reservations").select("ticket_type_id, quantity").eq("event_id", eventId).eq("status", "RESERVED").gt("expires_at", new Date().toISOString()),
  ]);

  if (tierError || attendeeError || reservationError) {
    throw new Error(`Unable to verify ticket availability: ${(tierError || attendeeError || reservationError)?.message}`);
  }

  const reservationCount = (reservations ?? []).reduce(
    (sum, row) => sum + Math.max(1, Number(row.quantity) || 1),
    0
  );

  const tiers = await Promise.all(
    (tierRows ?? []).map(async (row) => {
      const { count, error } = await db
        .from("attendees")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("ticket_type_id", row.id)
        .neq("application_status", "rejected");

      if (error) throw new Error(`Unable to verify ticket tier: ${error.message}`);
      const held = (reservations ?? []).filter((reservation) => reservation.ticket_type_id === row.id).reduce(
        (sum, reservation) => sum + Math.max(1, Number(reservation.quantity) || 1),
        0
      );
      return { ...row, reserved: (count || 0) + held } as EligibilityTier;
    })
  );

  return assessExploreEligibility({
    event: event as EligibilityEvent,
    metadata,
    tiers,
    attendeeCount: attendeeCount || 0,
    activeReservations: reservationCount,
    userId,
    isAuthorized,
  });
}
