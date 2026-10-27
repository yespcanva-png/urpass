import { createClient } from "@/lib/supabase/server";
import type {
  ExploreCategory,
  ExploreDateFilter,
  ExploreEventItem,
  ExplorePricingFilter,
  ExploreQueryParams,
  ExploreQueryResult,
  ExploreSortOrder,
} from "./types";
import { EXPLORE_CATEGORIES, EXPLORE_CITIES } from "./types";
import { getExploreEligibility } from "./eligibility";
import { eventLocalNow } from "./eligibility";

export function getCategoryLabel(catKey: string): string {
  const found = EXPLORE_CATEGORIES.find((c) => c.key === catKey.toLowerCase());
  return found ? found.label : "General";
}

function resolveCityFromVenue(venue?: string | null): string {
  if (!venue) return "Bengaluru";
  const v = venue.toLowerCase();
  if (v.includes("online") || v.includes("virtual") || v.includes("zoom")) return "Online";
  if (v.includes("bengaluru") || v.includes("bangalore")) return "Bengaluru";
  if (v.includes("mumbai") || v.includes("bombay")) return "Mumbai";
  if (v.includes("delhi") || v.includes("noida") || v.includes("gurugram") || v.includes("gurgaon")) return "Delhi NCR";
  if (v.includes("hyderabad")) return "Hyderabad";
  if (v.includes("chennai") || v.includes("madras")) return "Chennai";
  if (v.includes("coimbatore")) return "Coimbatore";
  if (v.includes("pune")) return "Pune";
  if (v.includes("kochi") || v.includes("cochin")) return "Kochi";
  if (v.includes("thiruvananthapuram") || v.includes("trivandrum")) return "Thiruvananthapuram";
  if (v.includes("madurai")) return "Madurai";
  if (v.includes("erode")) return "Erode";
  if (v.includes("tiruppur") || v.includes("tirupur")) return "Tiruppur";
  if (v.includes("kolkata") || v.includes("calcutta")) return "Kolkata";
  if (v.includes("ahmedabad")) return "Ahmedabad";
  if (v.includes("jaipur")) return "Jaipur";
  if (v.includes("london") || v.includes("uk")) return "London";
  return "Bengaluru";
}

function resolveCategory(name: string, description?: string | null): ExploreCategory {
  const text = `${name} ${description || ""}`.toLowerCase();
  if (text.includes("music") || text.includes("concert") || text.includes("dj") || text.includes("band")) return "music";
  if (text.includes("workshop") || text.includes("bootcamp") || text.includes("training") || text.includes("class")) return "workshops";
  if (text.includes("business") || text.includes("conference") || text.includes("summit") || text.includes("startup") || text.includes("founder")) return "business";
  if (text.includes("festival") || text.includes("fest") || text.includes("carnival") || text.includes("gala")) return "festivals";
  if (text.includes("food") || text.includes("drink") || text.includes("dinner") || text.includes("beer") || text.includes("wine") || text.includes("coffee")) return "food_drink";
  if (text.includes("sport") || text.includes("run") || text.includes("marathon") || text.includes("cricket") || text.includes("football") || text.includes("yoga")) return "sports";
  if (text.includes("art") || text.includes("exhibition") || text.includes("theater") || text.includes("design") || text.includes("film")) return "arts";
  return "community";
}

export async function fetchExploreMarketplaceEvents(
  params: ExploreQueryParams = {}
): Promise<ExploreQueryResult> {
  const supabase = await createClient();

  const query = params.query?.trim() || "";
  const city = params.city && params.city !== "All Cities" ? params.city : undefined;
  const category = params.category && params.category !== "all" ? params.category : undefined;
  const dateFilter: ExploreDateFilter = params.dateFilter || "all";
  const pricing: ExplorePricingFilter = params.pricing || "all";
  const sort: ExploreSortOrder = params.sort || "soonest";
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Math.min(50, Number(params.limit) || 12));

  // 1. Fetch approved listings from explore_marketplace_listings table
  // Supabase nested event joins are not represented in the generated DB types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawListings: any[] = [];

  try {
    const { data: listings, error: listingError } = await supabase
      .from("explore_marketplace_listings")
      .select(`
        id,
        event_id,
        status,
        featured,
        category,
        city,
        venue_address,
        editorial_summary,
        min_price_paise,
        currency,
        is_free,
        event:events(
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
          is_paid_event,
          ticket_price,
          application_enabled,
          auto_approve,
          custom_pass_design,
          organizer_id
        )
      `)
      .eq("status", "approved")
      .not("approved_at", "is", null);

    if (!listingError && listings && listings.length > 0) {
      rawListings = listings;
    }
  } catch {
    // Keep the marketplace empty until approved listings can be read.
  }

  // 2. Only approved listings are discoverable.
  let items: ExploreEventItem[] = [];

  if (rawListings.length > 0) {
    const assessments = await Promise.all(rawListings.map(async (listing) => {
      try {
        return await getExploreEligibility(listing.event_id, {
          city: listing.city, category: listing.category, editorialSummary: listing.editorial_summary,
        });
      } catch { return null; }
    }));
    items = rawListings
      .filter((_, index) => assessments[index]?.ready)
      .filter((l) => {
        if (!l.event || l.event.status !== "active" || l.event.application_enabled === false) {
          return false;
        }

        // Exclude private or invite-only events
        const design = l.event.custom_pass_design || {};
        if (design.is_private === true || design.visibility === "private" || design.visibility === "invite_only") {
          return false;
        }

        // Exclude past events (respecting event city timezone and date/time)
        const city = l.city || resolveCityFromVenue(l.event.venue);
        const localNow = eventLocalNow(new Date(), city);
        if (l.event.event_date < localNow.date) {
          return false;
        }
        if (l.event.event_date === localNow.date && l.event.start_time && l.event.start_time < localNow.time) {
          return false;
        }

        return true;
      })
      .map((l) => {
        const evt = l.event;
        const bannerUrl =
          evt.banner_url ||
          evt.logo_url ||
          (evt.custom_pass_design?.event_images?.[0] as string | undefined) ||
          null;

        const resolvedCategory = (l.category as ExploreCategory) || resolveCategory(evt.name, evt.description);

        return {
          id: l.id,
          eventId: evt.id,
          slug: evt.apply_slug || evt.id,
          name: evt.name,
          description: l.editorial_summary || evt.description,
          eventDate: evt.event_date,
          startTime: evt.start_time,
          endTime: evt.end_time,
          venue: evt.venue,
          city: l.city || resolveCityFromVenue(evt.venue),
          category: resolvedCategory,
          categoryLabel: getCategoryLabel(resolvedCategory),
          bannerUrl,
          logoUrl: evt.logo_url,
          minPricePaise: assessments[rawListings.indexOf(l)]?.minPricePaise ?? 0,
          currency: l.currency || "INR",
          isFree: assessments[rawListings.indexOf(l)]?.isFree ?? true,
          featured: Boolean(l.featured),
          organizerName:
            evt.name?.includes("YESP") || evt.description?.includes("Yesp")
              ? "YESP Corp"
              : "Verified Host",
          applicationEnabled: evt.application_enabled !== false,
          approvalRequired: evt.auto_approve === false,
          status: evt.status,
        };
      });
  }

  // 3. Filter by search query
  if (query) {
    const q = query.toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.venue.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q)
    );
  }

  // 4. Filter by city
  if (city) {
    items = items.filter(
      (item) => item.city.toLowerCase() === city.toLowerCase()
    );
  }

  // 5. Filter by category
  if (category) {
    items = items.filter((item) => item.category === category);
  }

  // 6. Filter by pricing
  if (pricing === "free") {
    items = items.filter((item) => item.isFree || item.minPricePaise === 0);
  } else if (pricing === "paid") {
    items = items.filter((item) => !item.isFree && item.minPricePaise > 0);
  }

  // 7. Filter by date
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  if (dateFilter === "today") {
    items = items.filter((item) => item.eventDate === todayStr);
  } else if (dateFilter === "this_weekend") {
    // Current week's Saturday and Sunday
    const dayOfWeek = now.getDay();
    const distanceToSaturday = (6 - dayOfWeek + 7) % 7;
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + distanceToSaturday);
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    const satStr = saturday.toISOString().split("T")[0];
    const sunStr = sunday.toISOString().split("T")[0];

    items = items.filter(
      (item) => item.eventDate === satStr || item.eventDate === sunStr
    );
  } else if (dateFilter === "this_month") {
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    items = items.filter((item) => item.eventDate.startsWith(currentYearMonth));
  }

  // 8. Sorting
  if (sort === "soonest") {
    items.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  } else if (sort === "recently_added") {
    items.sort((a, b) => b.id.localeCompare(a.id));
  } else if (sort === "price_asc") {
    items.sort((a, b) => a.minPricePaise - b.minPricePaise);
  } else if (sort === "price_desc") {
    items.sort((a, b) => b.minPricePaise - a.minPricePaise);
  }

  // 9. Featured events subset (maximum 3-4 items)
  const featuredEvents = items.filter((item) => item.featured).slice(0, 4);

  // 10. Pagination
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const startIndex = (page - 1) * limit;
  const paginatedEvents = items.slice(startIndex, startIndex + limit);

  return {
    events: paginatedEvents,
    featuredEvents,
    totalCount,
    page,
    totalPages,
    activeCity: city || "All Cities",
    availableCities: Array.from(EXPLORE_CITIES),
  };
}

export async function fetchEventsForSeoPage(pageConfig: import("./seo-pages").ExploreSeoPageConfig): Promise<{
  matchingEvents: ExploreEventItem[];
  fallbackEvents: ExploreEventItem[];
  totalMatches: number;
}> {
  // Query matching events
  const result = await fetchExploreMarketplaceEvents({
    city: pageConfig.cityFilter,
    category: pageConfig.categoryFilter,
    dateFilter: pageConfig.dateFilter,
    pricing: pageConfig.pricingFilter,
    query: pageConfig.queryKeywords?.[0],
    limit: 18,
  });

  let matching = result.events;
  let totalMatches = result.totalCount;

  // If query keywords were provided (e.g. for seasonal or niche searches) and direct query was empty, test keywords
  if (pageConfig.queryKeywords && pageConfig.queryKeywords.length > 0 && matching.length === 0) {
    for (const kw of pageConfig.queryKeywords) {
      const kwResult = await fetchExploreMarketplaceEvents({
        city: pageConfig.cityFilter,
        category: pageConfig.categoryFilter,
        dateFilter: pageConfig.dateFilter,
        pricing: pageConfig.pricingFilter,
        query: kw,
        limit: 12,
      });
      if (kwResult.events.length > 0) {
        matching = kwResult.events;
        totalMatches = kwResult.totalCount;
        break;
      }
    }
  }

  // Fetch trending fallback events across India if matching count is low
  let fallbackEvents: ExploreEventItem[] = [];
  if (matching.length < 3) {
    const fallbackRes = await fetchExploreMarketplaceEvents({
      limit: 6,
      sort: "soonest",
    });
    const matchingIds = new Set(matching.map((e) => e.id));
    fallbackEvents = fallbackRes.events.filter((e) => !matchingIds.has(e.id)).slice(0, 4);
  }

  return {
    matchingEvents: matching,
    fallbackEvents,
    totalMatches,
  };
}
