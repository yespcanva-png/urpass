export function getSupabaseUrl(): string {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  if (!url && process.env.NODE_ENV === "production") {
    console.error("[supabase/config] Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  if (!key && process.env.NODE_ENV === "production") {
    console.error("[supabase/config] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
  }
  return key;
}

export function getSupabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function getGoogleOAuthCredentials(): { clientId: string; clientSecret: string } {
  const clientId = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  return { clientId, clientSecret };
}

export function getAppOrigin(req?: { headers?: { get: (name: string) => string | null } } | null): string {
  return getPublicAppOrigin(req);
}

/**
 * Resolves the public, production-safe application origin.
 * Guarantees that localhost / loopback addresses are NEVER returned in production environments.
 */
export function getPublicAppOrigin(req?: { headers?: { get: (name: string) => string | null }; url?: string } | null): string {
  const isProduction = process.env.NODE_ENV === "production";
  const CANONICAL_PRODUCTION_ORIGIN = "https://urpass.space";

  // 1. Check explicit request URL first if available
  if (req?.url) {
    try {
      const parsedUrl = new URL(req.url);
      const urlHost = parsedUrl.host.toLowerCase();
      const isUrlLocal =
        urlHost.includes("localhost") ||
        urlHost.includes("127.0.0.1") ||
        urlHost.includes("0.0.0.0");

      if (isProduction && isUrlLocal) {
        return CANONICAL_PRODUCTION_ORIGIN;
      }

      if (!isUrlLocal && urlHost) {
        return `${parsedUrl.protocol}//${urlHost}`.replace(/\/$/, "");
      }
    } catch {
      // Ignore URL parse error
    }
  }

  // 2. Check incoming request headers if provided
  if (req?.headers) {
    const forwardedHost = req.headers.get("x-forwarded-host");
    const rawHost = forwardedHost || req.headers.get("host") || "";
    const host = rawHost.split(",")[0].trim().toLowerCase();

    if (host) {
      const isLocalHost =
        host.includes("localhost") ||
        host.includes("127.0.0.1") ||
        host.includes("0.0.0.0") ||
        host.startsWith("192.168.") ||
        host.startsWith("10.") ||
        host.startsWith("172.");

      // In production, NEVER use local loopback host under any circumstances
      if (isProduction && isLocalHost) {
        return CANONICAL_PRODUCTION_ORIGIN;
      }

      if (!isLocalHost) {
        const proto = req.headers.get("x-forwarded-proto") || "https";
        return `${proto}://${host}`.replace(/\/$/, "");
      }

      // In non-production, check if NEXT_PUBLIC_APP_URL is explicitly set to a public URL
      const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
      if (envUrl) {
        const trimmed = envUrl.trim().replace(/\/$/, "");
        const isEnvLocal =
          trimmed.includes("localhost") ||
          trimmed.includes("127.0.0.1") ||
          trimmed.includes("0.0.0.0");
        if (!isEnvLocal) {
          return trimmed.startsWith("http://") ? trimmed.replace(/^http:\/\//, "https://") : trimmed;
        }
      }

      return `http://${host}`.replace(/\/$/, "");
    }
  }

  // 3. Client-side browser execution check
  if (typeof window !== "undefined" && window.location?.origin) {
    const browserOrigin = window.location.origin.trim().replace(/\/$/, "");
    const isBrowserLocal =
      browserOrigin.includes("localhost") ||
      browserOrigin.includes("127.0.0.1") ||
      browserOrigin.includes("0.0.0.0");

    if (isProduction && isBrowserLocal) {
      return CANONICAL_PRODUCTION_ORIGIN;
    }

    if (!isProduction || !isBrowserLocal) {
      return browserOrigin;
    }
  }

  // 4. Environment variable fallback check
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/$/, "");
    const isEnvLocal =
      trimmed.includes("localhost") ||
      trimmed.includes("127.0.0.1") ||
      trimmed.includes("0.0.0.0");

    if (isProduction && isEnvLocal) {
      return CANONICAL_PRODUCTION_ORIGIN;
    }

    if (!isProduction && isEnvLocal) {
      return trimmed;
    }

    return trimmed.startsWith("http://") ? trimmed.replace(/^http:\/\//, "https://") : trimmed;
  }

  // 5. Safe production default
  return CANONICAL_PRODUCTION_ORIGIN;
}

export function getSupabaseConfig() {
  return {
    url: getSupabaseUrl(),
    anonKey: getSupabaseAnonKey(),
  };
}
