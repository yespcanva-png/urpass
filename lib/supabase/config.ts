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
  if (req?.headers) {
    const forwardedHost = req.headers.get("x-forwarded-host");
    const rawHost = forwardedHost || req.headers.get("host") || "";
    const host = rawHost.split(",")[0].trim();

    if (host) {
      const isLocal =
        host.includes("localhost") ||
        host.includes("127.0.0.1") ||
        host.startsWith("192.168.") ||
        host.startsWith("10.");

      if (isLocal) {
        return `http://${host}`.replace(/\/$/, "");
      }

      // Non-local host (e.g. urpass.space, production domain, reverse proxy) -> ALWAYS HTTPS
      return `https://${host}`.replace(/\/$/, "");
    }
  }

  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/$/, "");
    if (trimmed.includes("localhost") || trimmed.includes("127.0.0.1")) {
      return trimmed;
    }
    return trimmed.startsWith("http://") ? trimmed.replace(/^http:\/\//, "https://") : trimmed;
  }

  return "https://urpass.space";
}

export function getSupabaseConfig() {
  return {
    url: getSupabaseUrl(),
    anonKey: getSupabaseAnonKey(),
  };
}
