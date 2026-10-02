import type {
  SponsorshipTier,
  EventSponsor,
  SponsorDeliverablesStatus,
} from "./types";
import { getAdminClient } from "./db";

declare global {
  // eslint-disable-next-line no-var
  var __urpass_sponsorship_tiers: Record<string, SponsorshipTier[]> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_event_sponsors: Record<string, EventSponsor[]> | undefined;
}

if (!globalThis.__urpass_sponsorship_tiers) {
  globalThis.__urpass_sponsorship_tiers = {};
}
if (!globalThis.__urpass_event_sponsors) {
  globalThis.__urpass_event_sponsors = {};
}

export const DEFAULT_SPONSOR_TIERS = [
  {
    name: "Platinum Title Partner",
    price: 500000,
    currency: "INR",
    maxSponsors: 2,
    benefits: [
      "Keynote Stage Plenary Branding",
      "Prime 400 sq.ft Exhibition Island Booth",
      "Branded Lanyard Badges & All Attendee Passes",
      "Dedicated Keynote Address Slot (20 mins)",
      "Full Delegate Lead Directory Access",
    ],
    logoPlacementRules: {
      homepage: true,
      eventWebsite: true,
      agenda: true,
      session: true,
      email: true,
      badge: true,
      app: true,
    },
  },
  {
    name: "Gold Partner",
    price: 250000,
    currency: "INR",
    maxSponsors: 4,
    benefits: [
      "Track Session Room Co-Branding",
      "200 sq.ft Exhibition Booth Pavilion",
      "Logo on Event Website & Agenda Schedules",
      "2 Dedicated B2B Workshop Breakouts",
      "Lead Capture Scanner App for 5 Staff",
    ],
    logoPlacementRules: {
      homepage: true,
      eventWebsite: true,
      agenda: true,
      session: true,
      email: true,
      badge: false,
      app: true,
    },
  },
  {
    name: "Silver Partner",
    price: 100000,
    currency: "INR",
    maxSponsors: 8,
    benefits: [
      "100 sq.ft Exhibition Booth",
      "Logo on Official Website & Email Inclusions",
      "Lead Capture Scanner App for 2 Staff",
      "10 Delegate Entry Passes",
    ],
    logoPlacementRules: {
      homepage: false,
      eventWebsite: true,
      agenda: true,
      session: false,
      email: true,
      badge: false,
      app: true,
    },
  },
  {
    name: "Bronze Partner",
    price: 50000,
    currency: "INR",
    maxSponsors: 12,
    benefits: [
      "Logo in Sponsor Directory",
      "Shared Collateral Table",
      "5 Delegate Entry Passes",
    ],
    logoPlacementRules: {
      homepage: false,
      eventWebsite: true,
      agenda: false,
      session: false,
      email: false,
      badge: false,
      app: true,
    },
  },
];

export function getSponsorshipTiers(eventId: string): SponsorshipTier[] {
  const store = globalThis.__urpass_sponsorship_tiers!;
  if (!store[eventId] || store[eventId].length === 0) {
    const now = new Date().toISOString();
    store[eventId] = DEFAULT_SPONSOR_TIERS.map((t, idx) => ({
      id: `tier-${eventId}-${t.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      eventId,
      name: t.name,
      price: t.price,
      currency: t.currency,
      maxSponsors: t.maxSponsors,
      benefits: t.benefits,
      logoPlacementRules: t.logoPlacementRules,
      position: idx,
      createdAt: now,
      updatedAt: now,
    }));
  }
  return store[eventId];
}

export async function getSponsorshipTiersDb(eventId: string): Promise<SponsorshipTier[]> {
  const admin = getAdminClient();
  if (!admin) return getSponsorshipTiers(eventId);

  try {
    const { data, error } = await admin
      .from("event_sponsorship_tiers")
      .select("*")
      .eq("event_id", eventId)
      .order("position", { ascending: true });

    if (error || !data || data.length === 0) {
      const now = new Date().toISOString();
      const presets = DEFAULT_SPONSOR_TIERS.map((t, idx) => ({
        event_id: eventId,
        name: t.name,
        price: t.price,
        currency: t.currency,
        max_sponsors: t.maxSponsors,
        benefits: t.benefits,
        logo_placement_rules: t.logoPlacementRules,
        position: idx,
      }));

      const { data: inserted } = await admin.from("event_sponsorship_tiers").insert(presets).select();
      if (inserted && inserted.length > 0) {
        const seeded: SponsorshipTier[] = inserted.map((row: any) => ({
          id: row.id,
          eventId: row.event_id,
          name: row.name,
          price: Number(row.price),
          currency: row.currency || "INR",
          maxSponsors: row.max_sponsors,
          benefits: row.benefits || [],
          logoPlacementRules: row.logo_placement_rules || {},
          position: row.position || 0,
          createdAt: row.created_at || now,
          updatedAt: row.updated_at || now,
        }));
        globalThis.__urpass_sponsorship_tiers![eventId] = seeded;
        return seeded;
      }
      return getSponsorshipTiers(eventId);
    }

    const tiers: SponsorshipTier[] = data.map((row: any) => ({
      id: row.id,
      eventId: row.event_id,
      name: row.name,
      price: Number(row.price),
      currency: row.currency || "INR",
      maxSponsors: row.max_sponsors,
      benefits: row.benefits || [],
      logoPlacementRules: row.logo_placement_rules || {},
      position: row.position || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    globalThis.__urpass_sponsorship_tiers![eventId] = tiers;
    return tiers;
  } catch (err) {
    console.warn("[sponsor-service] Error reading tiers from DB:", err);
    return getSponsorshipTiers(eventId);
  }
}

export function saveSponsorshipTier(
  tier: Partial<SponsorshipTier> & { eventId: string; name: string }
): SponsorshipTier {
  const store = globalThis.__urpass_sponsorship_tiers!;
  const list = getSponsorshipTiers(tier.eventId);
  const now = new Date().toISOString();

  if (tier.id) {
    const idx = list.findIndex((t) => t.id === tier.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...tier, updatedAt: now };
      store[tier.eventId] = list;
      return list[idx];
    }
  }

  const newTier: SponsorshipTier = {
    id: tier.id || `tier-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: tier.eventId,
    name: tier.name,
    price: tier.price || 0,
    currency: tier.currency || "INR",
    maxSponsors: tier.maxSponsors || 5,
    benefits: tier.benefits || [],
    logoPlacementRules: tier.logoPlacementRules || {
      homepage: true,
      eventWebsite: true,
      agenda: true,
      session: true,
      email: true,
      badge: true,
      app: true,
    },
    position: list.length,
    createdAt: now,
    updatedAt: now,
  };

  list.push(newTier);
  store[tier.eventId] = list;
  return newTier;
}

export async function saveSponsorshipTierDb(
  tier: Partial<SponsorshipTier> & { eventId: string; name: string }
): Promise<SponsorshipTier> {
  const local = saveSponsorshipTier(tier);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload = {
      event_id: tier.eventId,
      name: tier.name,
      price: tier.price || 0,
      currency: tier.currency || "INR",
      max_sponsors: tier.maxSponsors || 5,
      benefits: tier.benefits || [],
      logo_placement_rules: local.logoPlacementRules,
      updated_at: new Date().toISOString(),
    };

    if (tier.id && !tier.id.startsWith("tier-")) {
      await admin.from("event_sponsorship_tiers").update(payload).eq("id", tier.id);
    } else {
      const { data } = await admin.from("event_sponsorship_tiers").insert(payload).select().single();
      if (data?.id) local.id = data.id;
    }
  } catch (err) {
    console.warn("[sponsor-service] Error saving tier to DB:", err);
  }

  return local;
}

export function deleteSponsorshipTier(eventId: string, tierId: string): boolean {
  const store = globalThis.__urpass_sponsorship_tiers!;
  const list = getSponsorshipTiers(eventId);
  store[eventId] = list.filter((t) => t.id !== tierId);
  return true;
}

export async function deleteSponsorshipTierDb(eventId: string, tierId: string): Promise<boolean> {
  deleteSponsorshipTier(eventId, tierId);
  const admin = getAdminClient();
  if (!admin) return true;

  try {
    await admin.from("event_sponsorship_tiers").delete().eq("id", tierId);
    return true;
  } catch (err) {
    console.warn("[sponsor-service] Error deleting tier from DB:", err);
    return false;
  }
}

export function getEventSponsors(eventId: string): EventSponsor[] {
  const store = globalThis.__urpass_event_sponsors!;
  return store[eventId] || [];
}

export async function getEventSponsorsDb(eventId: string): Promise<EventSponsor[]> {
  const admin = getAdminClient();
  if (!admin) return getEventSponsors(eventId);

  try {
    const { data, error } = await admin
      .from("event_sponsors")
      .select(`
        *,
        event_sponsorship_tiers ( name )
      `)
      .eq("event_id", eventId)
      .order("position", { ascending: true });

    if (error || !data) return getEventSponsors(eventId);

    const mapped: EventSponsor[] = data.map((row: any) => ({
      id: row.id,
      eventId: row.event_id,
      tierId: row.tier_id || undefined,
      tierName: row.event_sponsorship_tiers?.name || "General Partner",
      name: row.name,
      logoUrl: row.logo_url || undefined,
      websiteUrl: row.website_url || undefined,
      description: row.description || undefined,
      contactName: row.contact_name || undefined,
      contactEmail: row.contact_email || undefined,
      contactPhone: row.contact_phone || undefined,
      visibilitySettings: row.visibility_settings || {
        homepage: true,
        eventWebsite: true,
        agenda: true,
        session: true,
        email: true,
        badge: true,
        app: true,
      },
      deliverablesStatus: row.deliverables_status || {
        logoReceived: false,
        bannerReceived: false,
        boothConfirmed: false,
        emailInclusion: false,
        stageBranding: false,
        socialMention: false,
      },
      pageViews: Number(row.page_views) || 0,
      bannerClicks: Number(row.banner_clicks) || 0,
      boothVisits: Number(row.booth_visits) || 0,
      position: row.position || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    globalThis.__urpass_event_sponsors![eventId] = mapped;
    return mapped;
  } catch (err) {
    console.warn("[sponsor-service] Error reading sponsors from DB:", err);
    return getEventSponsors(eventId);
  }
}

export function saveEventSponsor(
  sponsor: Partial<EventSponsor> & { eventId: string; name: string }
): EventSponsor {
  const store = globalThis.__urpass_event_sponsors!;
  if (!store[sponsor.eventId]) store[sponsor.eventId] = [];
  const list = store[sponsor.eventId];
  const now = new Date().toISOString();

  if (sponsor.id) {
    const idx = list.findIndex((s) => s.id === sponsor.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...sponsor, updatedAt: now };
      store[sponsor.eventId] = list;
      return list[idx];
    }
  }

  const newSponsor: EventSponsor = {
    id: sponsor.id || `spon-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: sponsor.eventId,
    tierId: sponsor.tierId,
    tierName: sponsor.tierName || "General Partner",
    name: sponsor.name,
    logoUrl: sponsor.logoUrl,
    websiteUrl: sponsor.websiteUrl,
    description: sponsor.description,
    contactName: sponsor.contactName,
    contactEmail: sponsor.contactEmail,
    contactPhone: sponsor.contactPhone,
    visibilitySettings: sponsor.visibilitySettings || {
      homepage: true,
      eventWebsite: true,
      agenda: true,
      session: true,
      email: true,
      badge: true,
      app: true,
    },
    deliverablesStatus: sponsor.deliverablesStatus || {
      logoReceived: false,
      bannerReceived: false,
      boothConfirmed: false,
      emailInclusion: false,
      stageBranding: false,
      socialMention: false,
    },
    pageViews: 0,
    bannerClicks: 0,
    boothVisits: 0,
    position: list.length,
    createdAt: now,
    updatedAt: now,
  };

  list.push(newSponsor);
  store[sponsor.eventId] = list;
  return newSponsor;
}

export async function saveEventSponsorDb(
  sponsor: Partial<EventSponsor> & { eventId: string; name: string }
): Promise<EventSponsor> {
  const local = saveEventSponsor(sponsor);
  const admin = getAdminClient();
  if (!admin) return local;

  try {
    const payload = {
      event_id: sponsor.eventId,
      tier_id: sponsor.tierId || null,
      name: sponsor.name,
      logo_url: sponsor.logoUrl || null,
      website_url: sponsor.websiteUrl || null,
      description: sponsor.description || null,
      contact_name: sponsor.contactName || null,
      contact_email: sponsor.contactEmail || null,
      contact_phone: sponsor.contactPhone || null,
      visibility_settings: local.visibilitySettings,
      deliverables_status: local.deliverablesStatus,
      updated_at: new Date().toISOString(),
    };

    if (sponsor.id && !sponsor.id.startsWith("spon-")) {
      await admin.from("event_sponsors").update(payload).eq("id", sponsor.id);
    } else {
      const { data } = await admin.from("event_sponsors").insert(payload).select().single();
      if (data?.id) local.id = data.id;
    }
  } catch (err) {
    console.warn("[sponsor-service] Error saving sponsor to DB:", err);
  }

  return local;
}

export function deleteEventSponsor(eventId: string, sponsorId: string): boolean {
  const store = globalThis.__urpass_event_sponsors!;
  const list = getEventSponsors(eventId);
  store[eventId] = list.filter((s) => s.id !== sponsorId);
  return true;
}

export async function deleteEventSponsorDb(eventId: string, sponsorId: string): Promise<boolean> {
  deleteEventSponsor(eventId, sponsorId);
  const admin = getAdminClient();
  if (!admin) return true;

  try {
    await admin.from("event_sponsors").delete().eq("id", sponsorId);
    return true;
  } catch (err) {
    console.warn("[sponsor-service] Error deleting sponsor from DB:", err);
    return false;
  }
}

export async function updateSponsorDeliverableDb(
  eventId: string,
  sponsorId: string,
  deliverableKey: keyof SponsorDeliverablesStatus,
  status: boolean
): Promise<boolean> {
  const sponsors = await getEventSponsorsDb(eventId);
  const target = sponsors.find((s) => s.id === sponsorId);
  if (!target) return false;

  target.deliverablesStatus = {
    ...target.deliverablesStatus,
    [deliverableKey]: status,
  };

  const admin = getAdminClient();
  if (!admin) return true;

  try {
    await admin
      .from("event_sponsors")
      .update({
        deliverables_status: target.deliverablesStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sponsorId);
    return true;
  } catch (err) {
    console.warn("[sponsor-service] Error updating deliverables in DB:", err);
    return false;
  }
}

export async function recordSponsorImpressionDb(
  sponsorId: string,
  type: "view" | "click" | "visit"
): Promise<void> {
  const admin = getAdminClient();
  if (!admin) return;

  try {
    const col = type === "click" ? "banner_clicks" : type === "visit" ? "booth_visits" : "page_views";
    await admin.rpc("increment_sponsor_stat", { sponsor_id: sponsorId, column_name: col });
  } catch {
    // Graceful fallback
  }
}

export function updateSponsorDeliverable(
  eventId: string,
  sponsorId: string,
  deliverableKey: keyof SponsorDeliverablesStatus,
  status: boolean
): boolean {
  const sponsors = getEventSponsors(eventId);
  const target = sponsors.find((s) => s.id === sponsorId);
  if (!target) return false;
  target.deliverablesStatus = {
    ...target.deliverablesStatus,
    [deliverableKey]: status,
  };
  return true;
}

