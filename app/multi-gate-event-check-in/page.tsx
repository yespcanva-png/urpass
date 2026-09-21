import type { Metadata } from "next";
import { CheckCircle2, Users, ScanLine, ShieldCheck, Clock, Layers, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Multi-Gate Event Check-In & Synchronized Access Control",
  description: "Coordinate multiple entrances, turnstiles, and volunteer check-in lanes in real time. Prevent pass sharing and duplicate entry across large event venues.",
  keywords: [
    "multi gate event check in",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/multi-gate-event-check-in" },
  openGraph: {
    title: "Multi-Gate Event Check-In & Synchronized Access Control | URPASS",
    description: "Coordinate multiple entrances, turnstiles, and volunteer check-in lanes in real time. Prevent pass sharing and duplicate entry across large event venues.",
    url: "https://urpass.space/multi-gate-event-check-in",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "MULTI-GATE CHECK-IN",
        h1: "Multi-Gate Event Check-In with Real-Time Cloud Sync",
        canonicalUrl: "https://urpass.space/multi-gate-event-check-in",
        description: "Coordinate multiple entrances, turnstiles, and volunteer check-in lanes in real time. Prevent pass sharing and duplicate entry across large event venues.",
        ctaLabel: "Set up multi-gate check-in free",
        features: [
          { icon: Users, title: "Real-Time Multi-Gate Sync", desc: "Every scan at Gate A immediately invalidates the ticket at Gate B, Gate C, and VIP entrances." },
          { icon: ScanLine, title: "Parallel Check-In Lanes", desc: "Deploy multiple scanning volunteers at each gate to divide arrival queues and eliminate entrance wait times." },
          { icon: ShieldCheck, title: "PIN-Protected Volunteer Access", desc: "Grant gate staff scanner access via secure PIN without exposing your organizer dashboard or revenue." },
          { icon: Clock, title: "Sub-Second Pass Verification", desc: "Fast QR camera decoding verifies credentials in under 0.3s to maintain continuous line momentum." },
          { icon: Layers, title: "Gate-Specific Headcounts", desc: "Monitor entry distribution across different venue gates to balance security and staffing in real time." },
          { icon: BarChart3, title: "Unified Attendance Roster", desc: "All admissions flow into a single central dashboard with live totals, velocity charts, and CSV export." },
        ],
        steps: [
          { n: "01", title: "Plan Gate Layout", desc: "Identify entry gates (Main Gate, North Gate, VIP Entrance, Auditorium)." },
          { n: "02", title: "Share Scanner Links", desc: "Distribute PIN-protected scanner links to volunteer teams at each gate." },
          { n: "03", title: "Open Browser Cameras", desc: "Staff open the scanner URL on their own phones — no app downloads." },
          { n: "04", title: "Synchronized Scanning", desc: "Every verified pass updates centrally to block cross-gate pass sharing." },
          { n: "05", title: "Monitor Gate Loads", desc: "Reallocate volunteers dynamically based on real-time arrival counts." },
        ],
        callout: {
          badge: "CROSS-GATE SECURITY",
          title: "Zero duplicate entries across all venue entrances.",
          description: "At large festivals and campuses with multiple gates, attendees frequently attempt to hand passes back through fences. URPASS real-time cloud sync locks out duplicate passes instantly.",
          bullets: [
            "Instant cross-gate duplicate pass lockout",
            "Deploy unlimited scanning phones across all venue gates",
            "Restricted volunteer access protecting sensitive settings",
            "Live gate velocity analytics on organizer dashboard",
          ],
        },
        useCases: [
          "College Campuses with Multiple Entrances",
          "Multi-Hall Exhibition Centers",
          "Sports Complexes",
          "Multi-Track Conference Venues",
          "Open-Air Music Festivals",
          "Hackathon Re-Entry Gates",
        ],
        faqs: [
          { q: "How quickly does a scan at Gate 1 sync with Gate 2?", a: "Scans synchronize in milliseconds over standard cellular or Wi-Fi connections, ensuring immediate duplicate lockout across all gates." },
          { q: "Can we designate specific gates for VIP or Speaker ticket tiers?", a: "Yes. The scanner displays the ticket tier prominently on screen so staff can direct attendees to appropriate zones." },
          { q: "What if one gate has weak Wi-Fi?", a: "The scanner uses client caching and lightweight payloads to ensure responsive verification even on 3G/4G cellular networks." },
          { q: "How many volunteers can scan at the same time?", a: "There is no limit on volunteer scanning devices. All devices connect to your live event database simultaneously." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
