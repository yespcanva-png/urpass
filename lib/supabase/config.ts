const FALLBACK_SUPABASE_URL = "https://kxmxxqyxkoseksfaymqm.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bXh4cXl4a29zZWtzZmF5bXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0ODc1MjAsImV4cCI6MjEwNTA2MzUyMH0.NRLQbKKbvwJJajxcfwO0O717ttW2tJ5YhFbTGWa_5Zw";
export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
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
