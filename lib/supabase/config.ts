const FALLBACK_SUPABASE_URL = "https://kxmxxqyxkoseksfaymqm.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bXh4cXl4a29zZWtzZmF5bXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0ODc1MjAsImV4cCI6MjEwNTA2MzUyMH0.NRLQbKKbvwJJajxcfwO0O717ttW2tJ5YhFbTGWa_5Zw";

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
}

export function getSupabaseConfig() {
  return {
    url: getSupabaseUrl(),
    anonKey: getSupabaseAnonKey(),
  };
}
