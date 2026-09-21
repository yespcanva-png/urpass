import type { Metadata } from "next";
import { CheckCircle2, Trophy, Ticket, ScanLine, Users, ShieldCheck, Clock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Sports Event Registration, Ticketing & Gate Access Control",
  description: "Manage tournament team signups, spectator ticketing, and stadium turnstile check-ins. Prevent pass sharing and move crowds through gates in under 0.3 seconds.",
  keywords: [
    "sports event registration and ticketing",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/sports-events" },
  openGraph: {
    title: "Sports Event Registration, Ticketing & Gate Access Control | URPASS",
    description: "Manage tournament team signups, spectator ticketing, and stadium turnstile check-ins. Prevent pass sharing and move crowds through gates in under 0.3 seconds.",
    url: "https://urpass.space/sports-events",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "SPORTS & TOURNAMENTS",
        h1: "Sports Event Registration, Ticketing & Stadium Gate Check-In",
        canonicalUrl: "https://urpass.space/sports-events",
        description: "Manage tournament team signups, spectator ticketing, and stadium turnstile check-ins. Prevent pass sharing and move crowds through gates in under 0.3 seconds.",
        ctaLabel: "Manage sports events free",
        features: [
          { icon: Trophy, title: "Team & Athlete Registration", desc: "Collect player rosters, age categories, emergency contacts, and waiver sign-offs on custom forms." },
          { icon: Ticket, title: "Spectator QR Ticketing", desc: "Sell spectator tickets online via Razorpay (UPI, cards) with zero per-ticket platform cuts." },
          { icon: ScanLine, title: "Rapid Turnstile Scanning", desc: "Staff scan digital passes from smartphone screens in under 0.3s to keep stadium arrival lines flowing." },
          { icon: Users, title: "Athlete vs Spectator Tiers", desc: "Issue distinct pass tiers for Players, Coaches, Referees, VIPs, and General Spectators." },
          { icon: ShieldCheck, title: "Re-Entry Management", desc: "Manage multi-entry access throughout full-day tournaments with instant status lookups." },
          { icon: Clock, title: "Anti-Scalping Protection", desc: "Encrypted single-use QR tokens ensure that tickets cannot be photocopied, shared, or forged." },
        ],
        steps: [
          { n: "01", title: "Configure Tournament", desc: "Set up sporting divisions, ticket tiers, and spectator capacity." },
          { n: "02", title: "Collect Signups", desc: "Athletes register teams; fans purchase spectator passes online." },
          { n: "03", title: "Distribute Passes", desc: "Participants receive digital QR passes on their mobile devices." },
          { n: "04", title: "Scan at Stadium Doors", desc: "Volunteers scan spectator and athlete passes at entry gates." },
          { n: "05", title: "Track Headcount", desc: "Monitor live spectator numbers and attendance across divisions." },
        ],
        callout: {
          badge: "STADIUM SPEED",
          title: "Move athletic crowds through gates without delays.",
          description: "Long entrance lines create frustrated spectators and delay match start times. URPASS provides sub-second mobile QR scanning to get fans into seats quickly.",
          bullets: [
            "Sub-0.3 second ticket scanning from phone screens",
            "Zero per-ticket percentage commission on spectator sales",
            "Distinct access tiers for athletes, officials, and fans",
            "Duplicate entry lockout prevents shared tickets",
          ],
        },
        useCases: [
          "Inter-College Sports Tournaments",
          "Marathons & 10K Runs",
          "Cricket & Football Leagues",
          "Badminton & Tennis Opens",
          "Combat Sports & Martial Arts",
          "Campus Athletics Meets",
        ],
        faqs: [
          { q: "Can we collect team rosters on the registration form?", a: "Yes. Custom form fields allow team captains to list player names, jersey numbers, and contact details." },
          { q: "Can attendees show their tickets offline at stadium gates?", a: "Yes. Spectators can save their digital ticket to Apple Wallet or take a screenshot to show offline." },
          { q: "Does URPASS charge ticket commissions on sports tickets?", a: "No. URPASS charges zero per-ticket platform fees; you keep 100% of your ticket revenue." },
          { q: "Can staff scan in bright sunlight outdoors?", a: "Yes. High-contrast QR codes and browser camera auto-focus ensure quick scanning under outdoor sun." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
