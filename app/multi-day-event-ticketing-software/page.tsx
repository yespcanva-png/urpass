import type { Metadata } from "next";
import { BarChart3, Calendar, Layers, Lock, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Multi-Day Event Ticketing Software | UrPass",
  description: "Issue multi-day passes, track individual day check-ins, and prevent pass misuse across multi-day conferences and festivals.",
  keywords: [
    "multi day event ticketing software",
    "manage tickets for multi-day events",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/multi-day-event-ticketing-software" },
  openGraph: {
    title: "Multi-Day Event Ticketing Software | UrPass",
    description: "Issue multi-day passes, track individual day check-ins, and prevent pass misuse across multi-day conferences and festivals.",
    url: "https://urpass.space/multi-day-event-ticketing-software",
    locale: "en_US",
    type: "website",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "MULTI-DAY CONVENTIONS & FESTIVALS",
        h1: "Manage Tickets for Multi-Day Events",
        canonicalUrl: "https://urpass.space/multi-day-event-ticketing-software",
        description: "Issue multi-day passes, track individual day check-ins, and prevent pass misuse across multi-day conferences and festivals.",
        ctaLabel: "Create Multi-Day Event",
        directAnswer: {
          title: "How Does Multi-Day Event Ticketing Work on UrPass?",
          summary: "UrPass manages multi-day conferences, weekend summits, and three-day festivals with intelligent pass lifecycle rules. Organizers can issue All-Access multi-day passes or individual Day 1, Day 2, and Day 3 passes. Gate scanners enforce daily admission rules, prevent pass pass-backs, and track attendance per calendar day.",
          keyPoints: ["Flexible pass configurations: Full Multi-Day Passes vs Single-Day Passes", "Automated daily scan reset allowing one valid entry per calendar date", "Anti-passback protection preventing badge sharing during active event hours", "Day-by-day attendance telemetry and drop-off rate analytics"],
        },
        keyFactsTable: {
          title: "Multi-Day Event Operations Comparison",
          subtitle: "Handling re-entry and multi-day pass validation efficiently.",
          headers: ["Multi-Day Capability", "UrPass Multi-Day System", "Traditional Paper Badges & Wristbands"],
          rows: [
            {
                        "col1": "Daily Admission Control",
                        "col2": "Digital token automatically validates per calendar day",
                        "col3": "Multiple wristband colors prone to fraud and tangling"
            },
            {
                        "col1": "Pass-Back Fraud Prevention",
                        "col2": "Instant atomic scan lock stops pass sharing",
                        "col3": "Attendees pass wristbands through gates to friends"
            },
            {
                        "col1": "Single-Day vs Full-Pass Sales",
                        "col2": "Configured ticket tiers with independent pricing",
                        "col3": "Manual checks prone to admitting Day 1 ticket on Day 2"
            },
            {
                        "col1": "Daily Attendance Tracking",
                        "col2": "Live breakdown of Day 1 vs Day 2 vs Day 3 attendance",
                        "col3": "Zero visibility into multi-day retention or attrition"
            },
            {
                        "col1": "Lost Pass Replacement",
                        "col2": "Instant zero-cost digital pass resend on WhatsApp",
                        "col3": "Costly replacement fees and long customer service lines"
            }
],
        },
        features: [
          { icon: Calendar, title: "Multi-Day Ticket Architecture", desc: "Issue single QR codes that remain valid across 2, 3, or 5 consecutive event days with automated daily resets." },
          { icon: Lock, title: "Anti-Passback Verification", desc: "Prevent attendees from passing their digital ticket to an unregistered friend outside the gates." },
          { icon: Layers, title: "Single-Day vs Season Passes", desc: "Sell Day 1 Only, Day 2 Only, or All-Days Weekend Passes from a single unified ticketing portal." },
          { icon: QrCode, title: "Single Persistent QR Pass", desc: "Attendees use the same convenient digital pass throughout the entire event duration." },
          { icon: ScanLine, title: "Sub-0.3s Day Verification", desc: "Gate scanners instantly indicate whether a pass is valid for the current active event date." },
          { icon: BarChart3, title: "Multi-Day Retention Telemetry", desc: "Track attendee retention and identify drop-off rates between opening and closing event days." }
        ],
        steps: [
          { n: "01", title: "Define Event Dates", desc: "Set your multi-day event calendar range (e.g. Friday through Sunday) on your event setup screen." },
          { n: "02", title: "Create Daily & Full Passes", desc: "Configure 3-Day All Access passes alongside individual Friday, Saturday, and Sunday passes." },
          { n: "03", title: "Publish Ticket Portal", desc: "Attendees select their preferred days and purchase passes with 0% platform commission." },
          { n: "04", title: "Scan at the Entrance", desc: "Scanners verify ticket validity for today's date in <0.3s, rejecting expired or wrong-day tickets." },
          { n: "05", title: "Review Day-by-Day Stats", desc: "Analyze unique daily visitor counts and multi-day delegate engagement across your dashboard." }
        ],
        callout: {
          badge: "MULTI-DAY INTEGRITY",
          title: "Stop ticket pass-backs and multi-day badge counterfeiting.",
          description: "Multi-day events lose substantial revenue when attendees hand wristbands or screenshots to friends on subsequent days. UrPass enforces cryptographic daily verification.",
          bullets: ["Single digital pass valid across multiple days with zero wristband waste", "Scanners automatically detect and reject tickets not valid for today's date", "Instant replacement on mobile if an attendee misplaces their phone", "Track true multi-day retention and delegate engagement metrics"],
        },
        faqs: [
          { q: "Can one QR code be used for all 3 days of a conference?", a: "Yes! An All-Access multi-day ticket uses a single persistent QR code that automatically permits one check-in per calendar day." },
          { q: "Can I sell both full multi-day passes and single-day passes?", a: "Yes. You can create different ticket tiers (e.g. '3-Day All-Access Pass', 'Friday Only', 'Saturday Only') with custom prices and limits." },
          { q: "What happens if someone tries to use a Day 1 ticket on Day 2?", a: "The scanner immediately flashes red with an error indicating 'Ticket Not Valid for Today's Date'." },
          { q: "Can we track how many Day 1 attendees returned on Day 2?", a: "Yes. The real-time analytics dashboard provides full day-by-day retention comparisons and unique daily attendance figures." }
        ],
        relatedLinks: [
          { title: "Conference Ticketing Software", href: "/conference-ticketing-platform", category: "Product" },
          { title: "Event Ticket Types Management", href: "/event-ticket-types-management", category: "Product" },
          { title: "Duplicate QR Ticket Detection", href: "/duplicate-qr-ticket-detection", category: "Product" },
          { title: "Session-Wise Attendance Tracking", href: "/session-wise-attendance-tracking", category: "Product" }
        ],
      }}
    />
  );
}
