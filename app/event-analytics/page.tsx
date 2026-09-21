import type { Metadata } from "next";
import { TrendingUp, Users, Download, Activity, PieChart, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Real-Time Event Attendance & Check-In Analytics Dashboard",
  description: "Live event analytics dashboard for modern organizers. Track check-in velocity, attendance rates, ticket tier breakdown, and export timestamped CSV reports in one click.",
  keywords: [
    "event analytics dashboard",
    "real-time attendance tracking",
    "event check-in velocity",
    "ticket sales analytics",
    "event attendee reports CSV",
    "event drop-off rate tracking",
    "conference attendance analytics",
    "live entry monitoring",
  ],
  alternates: { canonical: "https://urpass.space/event-analytics" },
  openGraph: {
    title: "Real-Time Event Attendance & Check-In Analytics Dashboard | URPASS",
    description: "Monitor live check-in counts, peak rush hours, attendee tiers, and attendance percentage from any device. Export audit-ready CSV reports.",
    url: "https://urpass.space/event-analytics",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

export default function EventAnalyticsPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS INSIGHTS · LIVE ANALYTICS",
        h1: "Real-time attendee intelligence at your fingertips",
        canonicalUrl: "https://urpass.space/event-analytics",
        description: "Stop guessing how many people have arrived. URPASS gives you an interactive, real-time analytics dashboard with live gate velocity, attendance percentages, and 1-click CSV exports.",
        ctaLabel: "View analytics demo",
        features: [
          { icon: Activity, title: "Live check-in counter", desc: "Watch attendee entries tick upward live as passes are scanned across all venue gates with zero latency." },
          { icon: TrendingUp, title: "Gate velocity & rush hour curves", desc: "Identify peak arrival times and queue surges so you can reassign staff to busy entrance lanes proactively." },
          { icon: PieChart, title: "Ticket tier breakdown", desc: "Compare attendance rates between VIP, General Admission, Speaker, and Sponsor ticket categories in real time." },
          { icon: Users, title: "No-show & attendance percentage", desc: "Instantly see what percentage of registered attendees have checked in versus total approved registrations." },
          { icon: Download, title: "1-Click CSV & Excel export", desc: "Export timestamped attendee logs, scanner device IDs, check-in timestamps, and contact data anytime." },
          { icon: ShieldCheck, title: "Audit-ready compliance", desc: "Complete cryptographic check-in logs provide an immutable audit trail for venue fire safety and sponsor reporting." },
        ],
        steps: [
          { n: "01", title: "Collect Registrations", desc: "Attendees sign up online or are imported in bulk via CSV into your event dashboard." },
          { n: "02", title: "Monitor Pre-Event", desc: "Track ticket tier breakdown, payment revenue, and approval status prior to doors opening." },
          { n: "03", title: "Track Live Scans", desc: "During the event, view real-time arrival velocity, total arrivals, and gate congestion." },
          { n: "04", title: "Spot Trends", desc: "Analyze peak entry windows to optimize registration flow for your next conference or festival." },
          { n: "05", title: "Export Reports", desc: "Download full attendee reports and check-in audit logs in Excel or CSV format." },
        ],
        callout: {
          badge: "DATA-DRIVEN EVENTS",
          title: "Know exactly who attended, when, and where.",
          description: "From academic symposium certificates to sponsor attendance proof, accurate real-time data is the cornerstone of professional event execution.",
          bullets: [
            "Live auto-refreshing dashboard without manual page reloads",
            "Individual attendee arrival timestamps down to the second",
            "Device ID tracking to see which volunteer scanned each pass",
            "Instant CSV export compatible with CRM and email marketing tools",
          ],
        },
        useCases: [
          "Sponsor Proof of Attendance", "Post-Event Certificate Verification", "Venue Fire Capacity Compliance",
          "College Attendance Marking", "Corporate All-Hands Tracking", "VIP Arrival Alerts", "Multi-Day Conference Tracking",
        ],
        faqs: [
          { q: "Does the analytics dashboard update in real time without refreshing?", a: "Yes. The dashboard automatically syncs new check-ins as volunteers scan passes at the entrance doors." },
          { q: "Can I export attendee check-in data to Excel or CSV?", a: "Yes. You can export complete attendee records, including check-in status, timestamps, and registration responses, with a single click." },
          { q: "Can I see which entrance gate or volunteer scanned an attendee?", a: "Yes. Every scan record captures the exact timestamp and scanner session ID for full operational accountability." },
          { q: "Can we use attendance data to issue participation certificates?", a: "Yes! The exported CSV gives you a verified list of only those who actually checked in at the venue." },
          { q: "Is analytics included in the free plan?", a: "Yes. Basic check-in counts and attendee lists are included on the Free plan, while advanced velocity curves and multi-tier analytics are available on Pro." },
        ],
        ctaTitle: "Elevate your event operations with live analytics",
        ctaDescription: "Free tier available · Real-time attendance dashboard · 1-click export",
      }}
    />
  );
}
