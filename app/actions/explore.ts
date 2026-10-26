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
  status?: "pending" | "approved" | "rejected" | "changes_requested" | "suspended" | "unlisted";
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
  error?: string;
}> {
  try {
    await requireOrganizer(eventId);
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
      status: listing.status as "pending" | "approved" | "rejected" | "changes_requested" | "suspended" | "unlisted",
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
  } catch (error) {
    return { hasListing: false, error: error instanceof Error ? error.message : "Unable to load listing." };
  }
}

export async function checkEventExploreReadinessAction(eventId: string): Promise<{
  ready: boolean;
  issues: string[];
  minPricePaise: number;
  isFree: boolean;
}> {
  try {
    await requireOrganizer(eventId);
    const { data: listing } = await adminClient().from("explore_marketplace_listings")
      .select("city, category, editorial_summary").eq("event_id", eventId).maybeSingle();
    const eligibility = await getExploreEligibility(
      eventId,
      { city: listing?.city || "Bengaluru", category: listing?.category || "community", editorialSummary: listing?.editorial_summary }
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
    const { data: existing, error: existingError } = await admin.from("explore_marketplace_listings")
      .select("status").eq("event_id", eventId).maybeSingle();
    if (existingError) throw new Error(existingError.message);
    if (existing && !["rejected", "changes_requested", "unlisted"].includes(existing.status)) {
      return { success: false, error: `This listing is ${existing.status}. Refresh its status before applying again.` };
    }

    // Full server-side eligibility validation
    const eligibility = await getExploreEligibility(
      eventId,
      {
        city: payload.city,
        category: payload.category,
        editorialSummary: payload.editorialSummary,
      }
    );

    if (!eligibility.ready) {
      return {
        success: false,
        error: eligibility.issues[0] || "Event is not eligible for Explore listing.",
      };
    }

    const values = {
        status: "pending",
        category: payload.category,
        city: payload.city,
        venue_address: event.venue,
        editorial_summary: payload.editorialSummary?.trim().slice(0, 140) || null,
        min_price_paise: eligibility.minPricePaise,
        currency: "INR",
        is_free: eligibility.isFree,
        rejection_reason: null,
        approved_at: null,
        featured: false,
        last_actor_id: user.id,
        updated_at: new Date().toISOString(),
      };
    const result = existing
      ? await admin.from("explore_marketplace_listings").update(values)
          .eq("event_id", eventId).eq("status", existing.status).select("id").maybeSingle()
      : await admin.from("explore_marketplace_listings").insert({ event_id: eventId, ...values }).select("id").maybeSingle();
    const upsertErr = result.error;

    if (upsertErr) {
      return { success: false, error: upsertErr.code === "23505" ? "An application already exists. Refresh its status." : upsertErr.message };
    }
    if (!result.data) return { success: false, error: "Listing changed. Refresh and try again." };

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
    const { admin, user } = await requireOrganizer(eventId);

    const { data, error: updateErr } = await admin
      .from("explore_marketplace_listings")
      .update({
        status: "unlisted",
        featured: false,
        last_actor_id: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId).in("status", ["approved", "pending", "rejected", "changes_requested"])
      .select("id").maybeSingle();

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }
    if (!data) return { success: false, error: "There is no listing you can remove." };

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

    const [{ count: totalBookings, error: attError }, { data: orders, error: ordError },
      { data: attributed, error: attrError }, { data: interactions, error: interactionsError }] = await Promise.all([
      admin.from("attendees").select("*", { count: "exact", head: true })
        .eq("event_id", eventId).eq("application_status", "approved"),
      admin.from("ticket_orders").select("attendee_id, amount")
        .eq("event_id", eventId).eq("status", "paid"),
      admin.from("explore_booking_attributions").select("attendee_id")
        .eq("event_id", eventId).not("confirmed_at", "is", null),
      admin.from("explore_interactions").select("event_type").eq("event_id", eventId),
    ]);
    if (attError || ordError || attrError || interactionsError) {
      throw new Error((attError || ordError || attrError || interactionsError)?.message);
    }
    const attributedIds = new Set((attributed || []).map((item) => item.attendee_id));
    const exploreRevenue = (orders || []).filter((order) => attributedIds.has(order.attendee_id))
      .reduce((sum, order) => sum + Number(order.amount || 0), 0);
    const totalRevenue = (orders || []).reduce((sum, order) => sum + Number(order.amount || 0), 0);

    return {
      success: true,
      exploreBookings: attributedIds.size,
      totalBookings: totalBookings || 0,
      exploreRevenuePaise: exploreRevenue,
      totalRevenuePaise: totalRevenue,
      views: null,
      clicks: (interactions || []).filter((item) => item.event_type === "detail_view").length,
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
    if (!reason.trim()) return { success: false, error: "Provide a reason for rejection." };
    const admin = adminClient();
    const { data, error } = await admin
      .from("explore_marketplace_listings")
      .update({
        status: "rejected",
        rejection_reason: reason.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId).eq("status", "pending").select("id").maybeSingle();

    if (error) return { success: false, error: error.message };
    if (!data) return { success: false, error: "Pending listing not found." };
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
    if (!feedback.trim()) return { success: false, error: "Provide the requested changes." };
    const { data, error } = await admin
      .from("explore_marketplace_listings")
      .update({
        status: "changes_requested",
        rejection_reason: feedback.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId).eq("status", "pending").select("id").maybeSingle();

    if (error) return { success: false, error: error.message };
    if (!data) return { success: false, error: "Pending listing not found." };
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
      .eq("status", "pending")
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

export async function adminSuspendExploreListingAction(eventId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  if (!(await isOpsAuthenticated())) return { success: false, error: "Administrator access required." };
  if (!reason.trim()) return { success: false, error: "Provide a suspension reason." };
  if (!/^[0-9a-f-]{36}$/i.test(eventId)) return { success: false, error: "Invalid event ID." };
  const { data, error } = await adminClient().from("explore_marketplace_listings")
    .update({ status: "suspended", featured: false, rejection_reason: reason.trim(), updated_at: new Date().toISOString() })
    .eq("event_id", eventId).eq("status", "approved").select("id").maybeSingle();
  if (error) return { success: false, error: error.message };
  return data ? { success: true } : { success: false, error: "Approved listing not found." };
}
