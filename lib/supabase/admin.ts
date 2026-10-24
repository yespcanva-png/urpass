import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl, getSupabaseServiceRoleKey, getSupabaseAnonKey } from "./config";

let _instance: SupabaseClient | null = null;

export function adminClient(): SupabaseClient {
  if (!_instance) {
    const supabaseUrl = getSupabaseUrl();
    const serviceRoleKey = getSupabaseServiceRoleKey() || getSupabaseAnonKey();
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
