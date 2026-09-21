import type { Metadata } from "next";
import { CheckCircle2, Users, Search, ScanLine, ShieldCheck, Clock, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Guest List Software & VIP Door Management",
  description: "Manage digital guest lists, track VIP arrivals, eliminate paper clipboard chaos, and scan QR passes across multiple venue doors in real time.",
  keywords: [
    "event guest list software",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-guest-list-software" },
  openGraph: {
    title: "Event Guest List Software & VIP Door Management | URPASS",
    description: "Manage digital guest lists, track VIP arrivals, eliminate paper clipboard chaos, and scan QR passes across multiple venue doors in real time.",
    url: "https://urpass.space/event-guest-list-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "GUEST LIST SOFTWARE",
        h1: "Event Guest List Software with Real-Time Door Sync",
        canonicalUrl: "https://urpass.space/event-guest-list-software",
        description: "Manage digital guest lists, track VIP arrivals, eliminate paper clipboard chaos, and scan QR passes across multiple venue doors in real time.",
        ctaLabel: "Manage guest list free",
        features: [
          { icon: Users, title: "Live Digital Guest List", desc: "Search thousands of guests instantly by name, email, or company from any smartphone or tablet." },
          { icon: Search, title: "VIP & Speaker Tagging", desc: "Categorize guests into General, VIP, Media, and Speaker tiers with instant visual highlights upon check-in." },
          { icon: ScanLine, title: "QR Scan & Manual Lookup", desc: "Scan attendee QR passes in under 0.3s or mark attendance with a single tap on the digital list." },
          { icon: ShieldCheck, title: "Multi-Door Synchronization", desc: "Multiple door staff can access and update the guest list simultaneously with zero duplicate entries." },
          { icon: Clock, title: "Arrival Timestamps", desc: "Log the exact time each guest enters for post-event analytics, security audit trails, and reporting." },
          { icon: BarChart3, title: "CSV Roster Import/Export", desc: "Import pre-existing spreadsheets in seconds and export verified attendance records anytime." },
        ],
        steps: [
          { n: "01", title: "Import or Collect", desc: "Import guest list via CSV or collect registrations via custom forms." },
          { n: "02", title: "Assign Categories", desc: "Tag VIPs, speakers, sponsors, and general attendees with badge pills." },
          { n: "03", title: "Share Door Access", desc: "Provide door hosts with secure browser-based scanner and lookup access." },
          { n: "04", title: "Greet & Check In", desc: "Scan QR passes or search names with instant green confirmation screens." },
          { n: "05", title: "Review Headcount", desc: "Monitor real-time arrival counts and export clean attendance records." },
        ],
        callout: {
          badge: "DOOR EFFICIENCY",
          title: "Say goodbye to paper clipboards and highlighter pens.",
          description: "Flipping through printed paper rosters creates awkward door queues and leaves you blind to real-time headcount. URPASS digitizes your guest list with instant search and QR scanning.",
          bullets: [
            "Sub-second search across thousands of attendee names",
            "Instant real-time sync across multiple entrance devices",
            "Clear visual indicators for VIPs and special guests",
            "Detailed exportable records showing who attended",
          ],
        },
        useCases: [
          "VIP Reception Tables",
          "Corporate Gala Dinners",
          "Media Press Conferences",
          "Award Ceremonies",
          "Private Screenings",
          "Exclusive Networking Mixers",
        ],
        faqs: [
          { q: "Can door hosts look up attendees manually if they don't have a QR code?", a: "Yes. The scanner interface includes a live search bar where staff can find guests by name or email and check them in with one tap." },
          { q: "Can we import our existing attendee list from Excel or CSV?", a: "Yes. You can import attendee names and email addresses directly into URPASS with our CSV import tool." },
          { q: "How many door hosts can use the guest list at once?", a: "Unlimited. All devices synchronize in real time, preventing duplicate admissions across different doors." },
          { q: "Is attendee data kept secure and confidential?", a: "Yes. Your guest list data belongs solely to your organization and is protected by encrypted cloud infrastructure." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
