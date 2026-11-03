import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl, getSupabaseServiceRoleKey } from "./config";

let _instance: SupabaseClient | null = null;

export function adminClient(): SupabaseClient {
  if (!_instance) {
    const supabaseUrl = getSupabaseUrl();
    const serviceRoleKey = getSupabaseServiceRoleKey();
    if (!serviceRoleKey) {
      throw new Error(
        "[adminClient] SUPABASE_SERVICE_ROLE_KEY is required for admin operations."
      );
    }
    _instance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _instance;
}

export const getAdminClient = adminClient;
