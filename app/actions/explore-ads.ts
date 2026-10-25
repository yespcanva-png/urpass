"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { adsAdmin, fetchExplorePlacements, mapRowToCampaign, safeCreative, safeDestination, subscribeExploreNewsletter } from "@/lib/explore/ads-service";
import type { AdCampaign, AdPerformanceRow, ExploreAdPlacementsBundle, NewsletterSubscriptionInput } from "@/lib/explore/ads-types";

export async function fetchExplorePlacementsAction(city?: string): Promise<ExploreAdPlacementsBundle> {
  return fetchExplorePlacements(city);
}

const newsletterRate = new Map<string, { count: number; expires: number }>();
export async function subscribeExploreNewsletterAction(input: NewsletterSubscriptionInput) {
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  if (newsletterRate.size > 5000) for (const [key, entry] of newsletterRate) if (entry.expires < now) newsletterRate.delete(key);
  if (newsletterRate.size > 5000) newsletterRate.delete(newsletterRate.keys().next().value || "");
  const previous = newsletterRate.get(ip);
  if (previous && previous.expires > now && previous.count >= 5) return { success: false, error: "Please wait before trying again." };
  newsletterRate.set(ip, { count: previous && previous.expires > now ? previous.count + 1 : 1,
    expires: previous && previous.expires > now ? previous.expires : now + 3600000 });
  return subscribeExploreNewsletter(input);
}

export async function getAdminCampaignsAction(): Promise<{ success: boolean; campaigns?: AdCampaign[]; performance?: AdPerformanceRow[]; error?: string }> {
  if (!await isOpsAuthenticated()) return { success: false, error: "Administrator access required." };
  try {
    const admin = adsAdmin();
    const [{ data, error }, { data: metrics }] = await Promise.all([
      admin.from("explore_ad_campaigns").select("*").order("created_at", { ascending: false }),
      admin.rpc("explore_ad_performance"),
    ]);
    if (error) throw error;
    return { success: true, campaigns: (data || []).map(mapRowToCampaign),
      performance: (metrics || []).map((row: Record<string, unknown>) => ({
        placement: row.placement, city: row.city,
        impressions: Number(row.impressions) || 0, clicks: Number(row.clicks) || 0,
      })) as AdPerformanceRow[] };
  } catch { return { success: false, error: "Could not load campaigns." }; }
}

const placements = new Set(["hero", "top_sidebar", "in_content", "bottom_sidebar"]);
const types = new Set(["event_promo", "brand_sponsor", "urpass_house", "external"]);
const statuses = new Set(["draft", "active", "paused", "archived"]);

export async function saveAdminCampaignAction(campaign: Partial<AdCampaign>): Promise<{ success: boolean; campaign?: AdCampaign; error?: string }> {
  if (!await isOpsAuthenticated()) return { success: false, error: "Administrator access required." };
  const title = campaign.title?.trim() || "";
  const advertiser = campaign.advertiserName?.trim() || "";
  const image = campaign.desktopImageUrl?.trim() || "";
  const mobile = campaign.mobileImageUrl?.trim() || "";
  const dest = campaign.destinationUrl?.trim() || "";
  if (!title || title.length > 255 || !advertiser || advertiser.length > 255 ||
      !placements.has(campaign.placement || "") || !types.has(campaign.campaignType || "") ||
      !statuses.has(campaign.status || "") || !safeCreative(image) || (mobile && !safeCreative(mobile)) ||
      !safeDestination(dest) || !campaign.ctaText?.trim() || campaign.ctaText.length > 100 ||
      !Array.isArray(campaign.cityTargeting) || campaign.cityTargeting.length < 1 || campaign.cityTargeting.length > 30 ||
      !campaign.cityTargeting.every(c => typeof c === "string" && c.length <= 100) ||
      !Number.isInteger(campaign.priority) || (campaign.priority ?? 0) < 1 || (campaign.priority ?? 0) > 100) {
    return { success: false, error: "Check the campaign fields, creative URLs, destination, cities, and priority." };
  }
  if ((campaign.campaignType === "event_promo" || /^\/(event|apply)(\/|\?|$)/.test(dest)) && !campaign.eventId) {
    return { success: false, error: "Link a live approved Explore event for event promotions." };
  }
  const start = new Date(campaign.startsAt || "");
  const end = campaign.endsAt ? new Date(campaign.endsAt) : null;
  if (!Number.isFinite(start.getTime()) || (end && (!Number.isFinite(end.getTime()) || end <= start))) {
    return { success: false, error: "Enter a valid campaign schedule." };
  }
  try {
    const admin = adsAdmin();
    if (campaign.eventId) {
      const { data: listing } = await admin.from("explore_marketplace_listings")
        .select("event_id,event:events(status)").eq("event_id", campaign.eventId).eq("status", "approved").maybeSingle();
      const event = Array.isArray(listing?.event) ? listing.event[0] : listing?.event;
      if (!listing || event?.status !== "active") return { success: false, error: "Linked event must have an approved live Explore listing." };
    }
    const payload = {
      title, description: campaign.description?.trim() || null, placement: campaign.placement,
      campaign_type: campaign.campaignType, advertiser_name: advertiser, event_id: campaign.eventId || null,
      desktop_image_url: image, mobile_image_url: mobile || null, badge_label: campaign.badgeLabel?.trim() || "Sponsored",
      cta_text: campaign.ctaText.trim(), destination_url: dest, city_targeting: campaign.cityTargeting,
      starts_at: start.toISOString(), ends_at: end?.toISOString() || null, priority: campaign.priority,
      status: campaign.status, approved_at: campaign.status === "active" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    const query = campaign.id ? admin.from("explore_ad_campaigns").update(payload).eq("id", campaign.id) :
      admin.from("explore_ad_campaigns").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) throw error;
    await admin.from("explore_ad_audit_logs").insert({ campaign_id: data.id,
      action: campaign.id ? "campaign_updated" : "campaign_created",
      details: { status: data.status, placement: data.placement, destination_url: data.destination_url } });
    revalidatePath("/explore");
    return { success: true, campaign: mapRowToCampaign(data) };
  } catch { return { success: false, error: "Could not save campaign." }; }
}

export async function toggleCampaignStatusAction(campaignId: string, newStatus: "active" | "paused" | "archived") {
  if (!await isOpsAuthenticated()) return { success: false, error: "Administrator access required." };
  if (!/^[0-9a-f-]{36}$/i.test(campaignId) || !["active", "paused", "archived"].includes(newStatus)) {
    return { success: false, error: "Invalid campaign update." };
  }
  try {
    const admin = adsAdmin();
    const { error } = await admin.from("explore_ad_campaigns")
      .update({ status: newStatus, approved_at: newStatus === "active" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString() }).eq("id", campaignId);
    if (error) throw error;
    revalidatePath("/explore");
    return { success: true };
  } catch { return { success: false, error: "Could not update campaign." }; }
}

export async function uploadCampaignCreativeAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!await isOpsAuthenticated()) return { success: false, error: "Administrator access required." };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size < 1 || file.size > 4 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
    return { success: false, error: "Use a JPEG, PNG, WebP, or AVIF image under 4 MB." };
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const webp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  const avif = String.fromCharCode(...bytes.slice(4, 12)).includes("ftypavif");
  if (!({ "image/jpeg": jpeg, "image/png": png, "image/webp": webp, "image/avif": avif } as Record<string, boolean>)[file.type]) {
    return { success: false, error: "Image contents do not match its file type." };
  }
  try {
    const admin = adsAdmin();
    const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>)[file.type];
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await admin.storage.from("explore-ad-creatives").upload(path, bytes, { contentType: file.type, upsert: false });
    if (error) throw error;
    return { success: true, url: admin.storage.from("explore-ad-creatives").getPublicUrl(path).data.publicUrl };
  } catch { return { success: false, error: "Could not upload image." }; }
}
