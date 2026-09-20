import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://kxmxxqyxkoseksfaymqm.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bXh4cXl4a29zZWtzZmF5bXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0ODc1MjAsImV4cCI6MjEwNTA2MzUyMH0.NRLQbKKbvwJJajxcfwO0O717ttW2tJ5YhFbTGWa_5Zw",
  },
};

export default nextConfig;
