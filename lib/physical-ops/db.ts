import { createClient as createAdminClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/supabase/config";

declare global {
  // eslint-disable-next-line no-var
  var __urpass_admin_client: SupabaseClient | undefined;
}

export function getAdminClient(): SupabaseClient | null {
  if (globalThis.__urpass_admin_client) {
    return globalThis.__urpass_admin_client;
  }

  const url = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || getSupabaseAnonKey();

  if (!url || !serviceKey) {
    return null;
  }

  try {
    const client = createAdminClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    globalThis.__urpass_admin_client = client;
    return client;
  } catch (err) {
    console.error("[physical-ops/db] Failed to initialize admin Supabase client:", err);
    return null;
  }
}
