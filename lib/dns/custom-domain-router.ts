import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

const domainRouteCache = new Map<string, { targetPath: string; expiresAt: number }>();
const CACHE_TTL_MS = 60_000; // 1 minute in-memory cache

export function normalizeHostname(host: string): string {
  if (!host) return "";
  let clean = host.toLowerCase().trim();
  clean = clean.replace(/^https?:\/\//i, "");
  clean = clean.split("/")[0];
  clean = clean.split(":")[0];
  return clean.trim();
}

export function isPlatformDomain(host: string): boolean {
  if (!host) return true;
  const h = normalizeHostname(host);
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.endsWith(".localhost") ||
    h === "urpass.space" ||
    h.endsWith(".urpass.space") ||
    h === "urpass.in" ||
    h.endsWith(".urpass.in") ||
    h.endsWith(".vercel.app")
  );
}

/**
 * Resolves an active custom domain to its mapped event registration or conference route.
 * Returns null if the domain is a platform domain, not active, or unmapped.
 */
export async function resolveCustomDomainTarget(
  host: string
): Promise<{ rewritePath: string; organizationId?: string } | null> {
  const cleanHost = host.toLowerCase().split(":")[0].trim();
  if (isPlatformDomain(cleanHost)) {
    return null;
  }

  // Check in-memory cache first
  const cached = domainRouteCache.get(cleanHost);
  if (cached && Date.now() < cached.expiresAt) {
    return { rewritePath: cached.targetPath };
  }

  const supabaseUrl = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  try {
    const admin = createAdminClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Check conference event_websites first (direct 1:1 event mapping)
    const { data: webData } = await admin
      .from("event_websites")
      .select("slug, custom_domain")
      .eq("custom_domain", cleanHost)
      .eq("published", true)
      .maybeSingle();

    if (webData?.slug) {
      const targetPath = `/e/${webData.slug}`;
      domainRouteCache.set(cleanHost, { targetPath, expiresAt: Date.now() + CACHE_TTL_MS });
      return { rewritePath: targetPath };
    }

    // 2. Check verified custom_domains table
    const { data: domainRec } = await admin
      .from("custom_domains")
      .select("organization_id, status")
      .eq("domain", cleanHost)
      .eq("status", "active")
      .maybeSingle();

    if (domainRec?.organization_id) {
      // Find latest published event for this organization
      const { data: activeEvent } = await admin
        .from("events")
        .select("apply_slug, id")
        .eq("organization_id", domainRec.organization_id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (activeEvent) {
        const targetSlug = activeEvent.apply_slug || activeEvent.id;
        const targetPath = `/events/${targetSlug}`;
        domainRouteCache.set(cleanHost, { targetPath, expiresAt: Date.now() + CACHE_TTL_MS });
        return { rewritePath: targetPath, organizationId: domainRec.organization_id };
      }
    }

    return null;
  } catch {
    return null;
  }
}
