import type { Metadata } from "next";
import { CheckCircle2, ScanLine, Smartphone, ShieldCheck, Users, Clock, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Check-In Software & Fast QR Door Scanner",
  description: "Eliminate paper attendee sheets and manual name lookups. Verify tickets and digital QR passes in under 0.3 seconds with browser-based scanning on any phone.",
  keywords: [
    "event check in software",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-check-in-software" },
  openGraph: {
    title: "Event Check-In Software & Fast QR Door Scanner | URPASS",
    description: "Eliminate paper attendee sheets and manual name lookups. Verify tickets and digital QR passes in under 0.3 seconds with browser-based scanning on any phone.",
    url: "https://urpass.space/event-check-in-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "FAST EVENT CHECK-IN",
        h1: "Event Check-In Software for Fast, Queue-Free Entrances",
        canonicalUrl: "https://urpass.space/event-check-in-software",
        description: "Eliminate paper attendee sheets and manual name lookups. Verify tickets and digital QR passes in under 0.3 seconds with browser-based scanning on any phone.",
        ctaLabel: "Try check-in software free",
        features: [
          { icon: ScanLine, title: "Browser-Based QR Scanner", desc: "Gate staff and volunteers simply open a secure link in Safari or Chrome to turn any phone into a high-speed ticket scanner." },
          { icon: Smartphone, title: "Sub-Second Pass Verification", desc: "High-contrast QR recognition validates passes in under 0.3s, even under dim auditorium lighting or awkward angles." },
          { icon: ShieldCheck, title: "Instant Duplicate Lockout", desc: "If an attendee attempts to reuse or share a pass, the scanner screen flashes red with the original check-in timestamp." },
          { icon: Users, title: "Multi-Gate Cloud Sync", desc: "Deploy 5, 10, or 20 scanning lanes simultaneously with instant real-time synchronization across all devices." },
          { icon: Clock, title: "Manual Name Fallback", desc: "Search attendees by name, email, or registration ID directly inside the scanner interface if a phone battery dies." },
          { icon: BarChart3, title: "Real-Time Headcount Feed", desc: "Monitor total arrivals, check-in velocity, and remaining attendees live from your organizer dashboard." },
        ],
        steps: [
          { n: "01", title: "Open Scanner URL", desc: "Access the mobile check-in URL or share a PIN-protected scanner link with staff." },
          { n: "02", title: "Grant Camera Access", desc: "Enable camera permission in the mobile browser with zero app installation." },
          { n: "03", title: "Scan QR Pass", desc: "Point camera at attendee digital pass or printed badge for instant validation." },
          { n: "04", title: "Green/Red Feedback", desc: "Receive immediate visual and audible confirmation of valid or duplicate passes." },
          { n: "05", title: "Analyze Arrivals", desc: "View peak arrival times and export full timestamped entry logs." },
        ],
        callout: {
          badge: "GATE VELOCITY",
          title: "Keep entrance lines moving at full speed.",
          description: "Entrance bottlenecks ruin the attendee first impression. URPASS event check-in software moves hundreds of guests through doors quickly and securely without paper confusion.",
          bullets: [
            "Zero app installation required for staff or attendees",
            "Immediate duplicate pass detection across all entry points",
            "Restricted volunteer access links protecting financial data",
            "Live synchronization across all gate counters",
          ],
        },
        useCases: [
          "Conference Check-in Desks",
          "College Fest Main Gates",
          "Auditorium Turnstiles",
          "Workshop Room Entrances",
          "VIP Backstage Access",
          "Exhibition Hall Doors",
        ],
        faqs: [
          { q: "How fast is the check-in process per attendee?", a: "QR passes scan and validate in under 0.3 seconds. Staff can check in attendees continuously without delays." },
          { q: "Do volunteers need to install an app from Google Play or Apple App Store?", a: "No. The URPASS scanner runs completely within standard mobile browsers (Safari, Chrome, Firefox)." },
          { q: "What happens if an attendee presents a screenshot of a used pass?", a: "The moment a pass is scanned, it is permanently flagged as used in the database. Any subsequent scan displays an immediate red 'Already Checked In' warning." },
          { q: "Can we have staff scanning at multiple doors simultaneously?", a: "Yes. You can use as many scanning devices as needed. All scans synchronize in real time across all gates." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
