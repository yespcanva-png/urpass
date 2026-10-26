"use server";

import { adminClient } from "@/lib/supabase/admin";
import { getExploreEligibility } from "@/lib/explore/eligibility";
import { recordExploreInteraction, setExploreReferral, hasExploreReferral } from "@/lib/explore/attribution";

export async function trackExploreJourneyAction(eventId: string, stage: "detail_view" | "ticket_selection" | "registration_start") {
  if (!/^[0-9a-f-]{36}$/i.test(eventId)) return;
  if (stage === "detail_view") {
    const { data: listing } = await adminClient().from("explore_marketplace_listings")
      .select("status, approved_at, city, category, editorial_summary")
      .eq("event_id", eventId).maybeSingle();
    if (!listing || listing.status !== "approved" || !listing.approved_at) return;
    const eligibility = await getExploreEligibility(eventId, {
      city: listing.city, category: listing.category, editorialSummary: listing.editorial_summary,
    });
    if (!eligibility.ready) return;
    await setExploreReferral(eventId);
  } else if (!await hasExploreReferral(eventId)) return;
  try { await recordExploreInteraction(eventId, stage); } catch { /* Analytics must not interrupt booking. */ }
}
