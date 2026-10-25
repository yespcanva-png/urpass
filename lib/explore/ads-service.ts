import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";
import type { AdCampaign, AdEventPayload, AdPlacement, ExploreAdPlacementsBundle, NewsletterSubscriptionInput } from "./ads-types";

export function adsAdmin() {
  const key = getSupabaseServiceRoleKey();
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for promotions");
  return createServiceClient(getSupabaseUrl(), key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function safeDestination(value: string): boolean {
  if (typeof value !== "string" || value.length > 2048 || /[\\\u0000-\u001f]/.test(value)) return false;
  if (value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch { return false; }
}

export function safeCreative(value: string): boolean {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    const storageHost = new URL(getSupabaseUrl()).hostname;
    return url.protocol === "https:" && !url.username && !url.password &&
      ((url.hostname === storageHost && url.pathname.startsWith("/storage/v1/object/public/explore-ad-creatives/")) ||
       url.hostname === "images.unsplash.com");
  } catch { return false; }
}

interface CampaignRow {
  id: string; title: string; description: string | null; placement: AdPlacement;
  campaign_type: AdCampaign["campaignType"]; advertiser_name: string; event_id: string | null;
  desktop_image_url: string; mobile_image_url: string | null; badge_label: string | null;
  cta_text: string; destination_url: string; city_targeting: string[];
  starts_at: string; ends_at: string | null; priority: number; status: AdCampaign["status"];
  impressions_count: number; clicks_count: number; created_at: string; updated_at: string;
}

export function mapRowToCampaign(row: CampaignRow): AdCampaign {
  return {
    id: row.id, title: row.title, description: row.description || null,
    placement: row.placement as AdPlacement, campaignType: row.campaign_type,
    advertiserName: row.advertiser_name, eventId: row.event_id || null,
    desktopImageUrl: row.desktop_image_url, mobileImageUrl: row.mobile_image_url || null,
    badgeLabel: row.badge_label || "Sponsored", ctaText: row.cta_text,
    destinationUrl: row.destination_url,
    cityTargeting: Array.isArray(row.city_targeting) ? row.city_targeting : ["All Cities"],
    startsAt: row.starts_at, endsAt: row.ends_at || null,
    priority: row.priority, status: row.status,
    impressionsCount: Number(row.impressions_count) || 0,
    clicksCount: Number(row.clicks_count) || 0,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

export function selectExplorePlacements(campaigns: AdCampaign[], city = "All Cities", now = Date.now()): ExploreAdPlacementsBundle {
  const eligible = campaigns.filter(c => c.status === "active" &&
    (c.campaignType !== "event_promo" || Boolean(c.eventId) || Boolean(c.destinationUrl)) &&
    new Date(c.startsAt).getTime() <= now &&
    (!c.endsAt || new Date(c.endsAt).getTime() > now) &&
    safeCreative(c.desktopImageUrl) && (!c.mobileImageUrl || safeCreative(c.mobileImageUrl)) &&
    safeDestination(c.destinationUrl) &&
    (city === "All Cities" || c.cityTargeting.some(t => t.toLowerCase() === "all cities" || t.toLowerCase() === city.toLowerCase()))
  ).sort((a,b) => b.priority - a.priority || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  const used = new Set<string>();
  const take = (placement: AdPlacement) => {
    const campaign = eligible.find(c => c.placement === placement && !used.has(c.id)) || null;
    if (campaign) used.add(campaign.id);
    return campaign;
  };
  const hero = eligible.filter(c => c.placement === "hero").slice(0, 4);
  hero.forEach(c => used.add(c.id));
  return { hero, topSidebar: take("top_sidebar"), inContent: take("in_content"), bottomSidebar: take("bottom_sidebar") };
}

export async function fetchExplorePlacements(city?: string): Promise<ExploreAdPlacementsBundle> {
  const empty = { hero: [], topSidebar: null, inContent: null, bottomSidebar: null };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("explore_ad_campaigns").select("*")
      .eq("status", "active").not("approved_at", "is", null)
      .lte("starts_at", new Date().toISOString()).order("priority", { ascending: false });
    if (error) return empty;
    const rows = (data || []) as CampaignRow[];
    const eventIds = rows.map(r => r.event_id).filter(Boolean) as string[];
    let approvedIds = new Set<string>();
    if (eventIds.length) {
      const { data: listings } = await supabase.from("explore_marketplace_listings")
        .select("event_id").in("event_id", eventIds).eq("status", "approved");
      approvedIds = new Set((listings || []).map(l => l.event_id));
    }
    return selectExplorePlacements(rows.filter(r => !r.event_id || approvedIds.has(r.event_id)).map(mapRowToCampaign), city);
  } catch { return empty; }
}

export async function recordAdEventInDb(payload: AdEventPayload): Promise<boolean> {
  try {
    const { data, error } = await adsAdmin().rpc("record_explore_ad_event", {
      p_campaign_id: payload.campaignId, p_placement: payload.placement,
      p_event_type: payload.eventType, p_session_id: payload.sessionId,
      p_city: payload.city || "All Cities",
    });
    return !error && data === true;
  } catch { return false; }
}

export async function subscribeExploreNewsletter(input: NewsletterSubscriptionInput): Promise<{ success: boolean; error?: string; isNew?: boolean; unsubscribeToken?: string }> {
  const email = input.email?.trim().toLowerCase();
  if (!email || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: "Please enter a valid email address." };
  if (!input.consentGiven) return { success: false, error: "Please confirm your consent to receive event updates." };
  try {
    const admin = adsAdmin();
    const { data: existing, error: lookupError } = await admin.from("explore_newsletter_subscriptions")
      .select("id,status,unsubscribe_token").eq("email", email).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) {
      const { error } = await admin.from("explore_newsletter_subscriptions").update({ status: "active", consent_given: true,
        city: input.city || "All Cities", updated_at: new Date().toISOString() }).eq("id", existing.id);
      if (error) throw error;
      return { success: true, isNew: false, unsubscribeToken: existing.unsubscribe_token };
    }
    const { data, error } = await admin.from("explore_newsletter_subscriptions")
      .insert({ email, city: input.city || "All Cities", consent_given: true, status: "active" })
      .select("unsubscribe_token").single();
    if (error) throw error;
    return { success: true, isNew: true, unsubscribeToken: data.unsubscribe_token };
  } catch { return { success: false, error: "Subscription could not be saved. Please try again." }; }
}

export async function unsubscribeExploreNewsletter(token: string): Promise<boolean> {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return false;
  try {
    const { data, error } = await adsAdmin().from("explore_newsletter_subscriptions")
      .update({ status: "unsubscribed", updated_at: new Date().toISOString() })
      .eq("unsubscribe_token", token).select("id").maybeSingle();
    return !error && Boolean(data);
  } catch { return false; }
}
