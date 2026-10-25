"use server";

import { createClient } from "@/lib/supabase/server";
import { fetchExploreMarketplaceEvents } from "@/lib/explore/service";
import type { ExploreQueryParams, ExploreQueryResult } from "@/lib/explore/types";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { adminClient } from "@/lib/supabase/admin";
import { getExploreEligibility } from "@/lib/explore/eligibility";

async function requireOrganizer(eventId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(eventId)) throw new Error("Invalid event ID.");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to manage this Explore listing.");

  const admin = adminClient();
  const { data: event, error } = await admin
    .from("events")
    .select("id, name, organizer_id, organization_id, venue, apply_slug, event_date, start_time, banner_url, logo_url, is_paid_event, ticket_price, status")
    .eq("id", eventId)
    .maybeSingle();

  if (error || !event) throw new Error("Event not found.");

  if (event.organizer_id !== user.id) {
    if (!event.organization_id) throw new Error("You cannot manage this event's Explore listing.");
    const { data: member } = await admin
      .from("organization_members")
      .select("id")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .maybeSingle();

    if (!member) throw new Error("You cannot manage this event's Explore listing.");
  }

  return { user, event, admin };
}

export async function getExploreEventsAction(
  params: ExploreQueryParams = {}
): Promise<ExploreQueryResult> {
  return fetchExploreMarketplaceEvents(params);
}

export async function getEventExploreListingStatusAction(eventId: string): Promise<{
  hasListing: boolean;
  status?: "pending" | "approved" | "rejected" | "suspended";
  featured?: boolean;
  category?: string;
  city?: string;
  rejectionReason?: string;
  editorialSummary?: string;
  venueAddress?: string;
  minPricePaise?: number;
  isFree?: boolean;
  eventName?: string;
  applySlug?: string | null;
  eventDate?: string;
  startTime?: string;
  venue?: string | null;
  bannerUrl?: string | null;
  logoUrl?: string | null;
}> {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(eventId)) return { hasListing: false };
    const admin = adminClient();

    const [listingRes, eventRes] = await Promise.all([
      admin
        .from("explore_marketplace_listings")
        .select("status, featured, category, city, rejection_reason, editorial_summary, venue_address, min_price_paise, is_free")
        .eq("event_id", eventId)
        .maybeSingle(),
      admin
        .from("events")
        .select("name, apply_slug, event_date, start_time, venue, banner_url, logo_url")
        .eq("id", eventId)
        .maybeSingle(),
    ]);

    const listing = listingRes.data;
    const event = eventRes.data;

    if (!listing) {
      return {
        hasListing: false,
        eventName: event?.name,
        applySlug: event?.apply_slug,
        eventDate: event?.event_date,
        startTime: event?.start_time,
        venue: event?.venue,
        bannerUrl: event?.banner_url,
        logoUrl: event?.logo_url,
      };
    }

    return {
      hasListing: true,
      status: listing.status as "pending" | "approved" | "rejected" | "suspended",
      featured: listing.featured,
      category: listing.category,
      city: listing.city,
      rejectionReason: listing.rejection_reason,
      editorialSummary: listing.editorial_summary,
      venueAddress: listing.venue_address || event?.venue,
      minPricePaise: listing.min_price_paise,
      isFree: listing.is_free,
      eventName: event?.name,
      applySlug: event?.apply_slug,
      eventDate: event?.event_date,
      startTime: event?.start_time,
      venue: event?.venue,
      bannerUrl: event?.banner_url,
      logoUrl: event?.logo_url,
    };
  } catch {
    return { hasListing: false };
  }
}

export async function checkEventExploreReadinessAction(eventId: string): Promise<{
  ready: boolean;
  issues: string[];
  minPricePaise: number;
  isFree: boolean;
}> {
  try {
    const { user, event } = await requireOrganizer(eventId);
    const eligibility = await getExploreEligibility(
      eventId,
      { city: "Bengaluru", category: "community" },
      user.id
    );

    return {
      ready: eligibility.ready,
      issues: eligibility.issues,
      minPricePaise: eligibility.minPricePaise,
      isFree: eligibility.isFree,
    };
  } catch (err) {
    return {
      ready: false,
      issues: [err instanceof Error ? err.message : "Unable to verify event readiness."],
      minPricePaise: 0,
      isFree: true,
    };
  }
}

export async function submitExploreListingApplicationAction(
  eventId: string,
  payload: {
    category: string;
    city: string;
    editorialSummary?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user, event, admin } = await requireOrganizer(eventId);

    // Full server-side eligibility validation
    const eligibility = await getExploreEligibility(
      eventId,
      {
        city: payload.city,
        category: payload.category,
        editorialSummary: payload.editorialSummary,
      },
      user.id
    );

    if (!eligibility.ready) {
      return {
        success: false,
        error: eligibility.issues[0] || "Event is not eligible for Explore listing.",
      };
    }

    const { error: upsertErr } = await admin.from("explore_marketplace_listings").upsert(
      {
        event_id: eventId,
        status: "pending",
        category: payload.category || "community",
        city: payload.city || "Bengaluru",
        venue_address: event.venue,
        editorial_summary: payload.editorialSummary?.trim() || null,
        min_price_paise: eligibility.minPricePaise,
        currency: "INR",
        is_free: eligibility.isFree,
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "event_id" }
    );

    if (upsertErr) {
      return { success: false, error: upsertErr.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit marketplace application.",
    };
  }
}

export async function organizerResubmitExploreListingAction(
  eventId: string,
  payload: {
    category: string;
    city: string;
    editorialSummary?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  return submitExploreListingApplicationAction(eventId, payload);
}

export async function unlistExploreListingAction(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { admin } = await requireOrganizer(eventId);

    const { error: updateErr } = await admin
      .from("explore_marketplace_listings")
      .update({
        status: "suspended",
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to unlist event from Explore.",
    };
  }
}

export async function getExploreListingAttributionAction(eventId: string): Promise<{
  success: boolean;
  exploreBookings: number;
  totalBookings: number;
  exploreRevenuePaise: number;
  totalRevenuePaise: number;
  views: number | null;
  clicks: number | null;
  error?: string;
}> {
  try {
    await requireOrganizer(eventId);
    const admin = adminClient();

    // Query attendees and paid ticket orders
    const [{ data: attendees, error: attError }, { data: orders, error: ordError }] = await Promise.all([
      admin
        .from("attendees")
        .select("id, custom_responses, application_status")
        .eq("event_id", eventId)
        .neq("application_status", "rejected"),
      admin
        .from("ticket_orders")
        .select("id, attendee_id, amount, status")
        .eq("event_id", eventId)
        .eq("status", "paid"),
    ]);

    if (attError) throw new Error(attError.message);

    const activeAttendees = attendees || [];
    const paidOrders = orders || [];

    const exploreAttendeeIds = new Set<string>();
    let exploreCount = 0;

    for (const a of activeAttendees) {
      const cr = a.custom_responses as Record<string, unknown> | null;
      if (cr?.referral_source === "explore") {
        exploreCount++;
        exploreAttendeeIds.add(a.id);
      }
    }

    let exploreRevenue = 0;
    let totalRevenue = 0;

    for (const order of paidOrders) {
      const amt = Number(order.amount) || 0;
      totalRevenue += amt;
      if (order.attendee_id && exploreAttendeeIds.has(order.attendee_id)) {
        exploreRevenue += amt;
      }
    }

    return {
      success: true,
      exploreBookings: exploreCount,
      totalBookings: activeAttendees.length,
      exploreRevenuePaise: exploreRevenue,
      totalRevenuePaise: totalRevenue,
      views: null, // View tracking unconfigured (empty state)
      clicks: null,
    };
  } catch (err) {
    return {
      success: false,
      exploreBookings: 0,
      totalBookings: 0,
      exploreRevenuePaise: 0,
      totalRevenuePaise: 0,
      views: null,
      clicks: null,
      error: err instanceof Error ? err.message : "Failed to calculate attribution metrics.",
    };
  }
}

export async function adminRejectExploreListingAction(
  eventId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await isOpsAuthenticated())) return { success: false, error: "Administrator access required." };
  try {
    if (!/^[0-9a-f-]{36}$/i.test(eventId)) return { success: false, error: "Invalid event ID." };
    const admin = adminClient();
    const { error } = await admin
      .from("explore_marketplace_listings")
      .update({
        status: "rejected",
        rejection_reason: reason.trim() || "Event does not meet current curation guidelines.",
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to reject listing.",
    };
  }
}

export async function adminRequestChangesExploreListingAction(
  eventId: string,
  feedback: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await isOpsAuthenticated())) return { success: false, error: "Administrator access required." };
  try {
    if (!/^[0-9a-f-]{36}$/i.test(eventId)) return { success: false, error: "Invalid event ID." };
    const admin = adminClient();
    const formattedReason = `[Changes Requested] ${feedback.trim() || "Please update event details."}`;
    const { error } = await admin
      .from("explore_marketplace_listings")
      .update({
        status: "rejected",
        rejection_reason: formattedReason,
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to request changes.",
    };
  }
}

export async function adminApproveExploreListingAction(
  eventId: string,
  featured: boolean = false
): Promise<{ success: boolean; error?: string }> {
  if (!(await isOpsAuthenticated())) return { success: false, error: "Administrator access required." };
  try {
    if (!/^[0-9a-f-]{36}$/i.test(eventId)) return { success: false, error: "Invalid event ID." };
    const admin = adminClient();

    const { data: listing } = await admin
      .from("explore_marketplace_listings")
      .select("category, city, editorial_summary")
      .eq("event_id", eventId)
      .maybeSingle();

    const eligibility = await getExploreEligibility(
      eventId,
      {
        category: listing?.category,
        city: listing?.city,
        editorialSummary: listing?.editorial_summary,
      }
    );

    if (!eligibility.ready) {
      return {
        success: false,
        error: `Cannot approve ineligible event: ${eligibility.issues[0]}`,
      };
    }

    const { data, error } = await admin
      .from("explore_marketplace_listings")
      .update({
        status: "approved",
        featured,
        min_price_paise: eligibility.minPricePaise,
        is_free: eligibility.isFree,
        approved_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId)
      .select("id")
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    if (!data) return { success: false, error: "Listing not found." };

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to approve listing.",
    };
  }
}
