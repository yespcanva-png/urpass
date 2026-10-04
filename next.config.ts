import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://kxmxxqyxkoseksfaymqm.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bXh4cXl4a29zZWtzZmF5bXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0ODc1MjAsImV4cCI6MjEwNTA2MzUyMH0.NRLQbKKbvwJJajxcfwO0O717ttW2tJ5YhFbTGWa_5Zw",
  },
  async redirects() {
    return [
      {
        source: "/lifetime",
        destination: "/founder-lifetime-deal",
        permanent: true,
      },
      {
        source: "/founder-lifetime",
        destination: "/founder-lifetime-deal",
        permanent: true,
      },
      // Consolidation 301 redirects: Merge duplicate & cannibalistic commercial landing pages
      {
        source: "/event-registration-platform",
        destination: "/event-registration-software",
        permanent: true,
      },
      {
        source: "/event-ticketing-platform",
        destination: "/event-ticketing-software",
        permanent: true,
      },
      {
        source: "/multiple-gate-event-check-in",
        destination: "/multi-gate-event-check-in",
        permanent: true,
      },
      {
        source: "/google-forms-event-registration-alternative",
        destination: "/google-forms-alternative-for-events",
        permanent: true,
      },
      {
        source: "/eventbrite-alternative-india",
        destination: "/eventbrite-alternative",
        permanent: true,
      },
      {
        source: "/online-event-registration-system",
        destination: "/online-event-registration",
        permanent: true,
      },
      {
        source: "/online-ticket-booking-system-for-events",
        destination: "/online-ticket-generator-for-events",
        permanent: true,
      },
      {
        source: "/qr-event-tickets",
        destination: "/qr-event-registration",
        permanent: true,
      },
      {
        source: "/attendee-check-in-system",
        destination: "/event-check-in-software",
        permanent: true,
      },
      {
        source: "/event-entry-management",
        destination: "/event-entry-management-software",
        permanent: true,
      },
      {
        source: "/qr-ticketing-system",
        destination: "/qr-code-ticketing-system",
        permanent: true,
      },
      // City flat route consolidation into geo hubs
      {
        source: "/event-registration-software-delhi",
        destination: "/in/delhi",
        permanent: true,
      },
      {
        source: "/event-registration-software-bangalore",
        destination: "/in/bangalore",
        permanent: true,
      },
      {
        source: "/event-registration-software-chennai",
        destination: "/in/chennai",
        permanent: true,
      },
      {
        source: "/event-registration-software-mumbai",
        destination: "/in/mumbai",
        permanent: true,
      },
      {
        source: "/event-registration-software-hyderabad",
        destination: "/in/hyderabad",
        permanent: true,
      },
      {
        source: "/event-registration-software-gurgaon",
        destination: "/in/gurgaon",
        permanent: true,
      },
      {
        source: "/event-registration-software-noida",
        destination: "/in/noida",
        permanent: true,
      },
      {
        source: "/event-registration-software-pune",
        destination: "/in/pune",
        permanent: true,
      },
      {
        source: "/event-registration-software-kolkata",
        destination: "/in/kolkata",
        permanent: true,
      },
      {
        source: "/event-registration-software-coimbatore",
        destination: "/in/coimbatore",
        permanent: true,
      },
      {
        source: "/event-registration-software-ahmedabad",
        destination: "/in/ahmedabad",
        permanent: true,
      },
      {
        source: "/event-registration-software-jaipur",
        destination: "/in/jaipur",
        permanent: true,
      },
      {
        source: "/event-registration-software-chandigarh",
        destination: "/in/chandigarh",
        permanent: true,
      },
      {
        source: "/event-registration-software-kochi",
        destination: "/in/kochi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
