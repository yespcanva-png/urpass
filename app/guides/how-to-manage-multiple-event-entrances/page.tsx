import type { Metadata } from "next";
import { CheckCircle2, Layers, ShieldCheck, Users, Clock, ScanLine, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Manage Multiple Event Entrances Without Duplicate Entry",
  description: "Managing multiple event entrances requires a synchronized cloud check-in system where scanners at Gate A, Gate B, and VIP doors share the same live attendee state. When an attendee checks in at Gate A, their QR code is instantly invalidated across all other gates in real time to prevent duplicate admissions.",
  keywords: [
    "how to manage multiple event entrances",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-manage-multiple-event-entrances" },
  openGraph: {
    title: "How to Manage Multiple Event Entrances Without Duplicate Entry | URPASS",
    description: "Managing multiple event entrances requires a synchronized cloud check-in system where scanners at Gate A, Gate B, and VIP doors share the same live attendee state. When an attendee checks in at Gate A, their QR code is instantly invalidated across all other gates in real time to prevent duplicate admissions.",
    url: "https://urpass.space/guides/how-to-manage-multiple-event-entrances",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "SECURITY GUIDE",
        h1: "How to Manage Multiple Event Entrances",
        canonicalUrl: "https://urpass.space/guides/how-to-manage-multiple-event-entrances",
        description: "Managing multiple event entrances requires a synchronized cloud check-in system where scanners at Gate A, Gate B, and VIP doors share the same live attendee state. When an attendee checks in at Gate A, their QR code is instantly invalidated across all other gates in real time to prevent duplicate admissions.",
        ctaLabel: "Manage multiple gates free",
        features: [
          { icon: Layers, title: "Real-Time Central State", desc: "Every scan updates a centralized cloud database, immediately locking the pass against reuse across all other gates." },
          { icon: ShieldCheck, title: "Cross-Gate Duplicate Lockout", desc: "If an attendee hands their pass back to a friend who attempts to enter at another gate, the scanner flashes red immediately." },
          { icon: Users, title: "Decentralized Volunteer Setup", desc: "Equip volunteers across distant gates with PIN-protected scanner links on their personal phones." },
          { icon: Clock, title: "Gate-Specific Headcounts", desc: "Monitor entry volume per gate to identify congested doors and direct crowd traffic accordingly." },
          { icon: ScanLine, title: "Access Tier Routing", desc: "Configure specific gates for VIPs, press, or participants with visual confirmation on the scanner screen." },
          { icon: BarChart3, title: "Unified Master Audit Log", desc: "Download a single, consolidated attendance log showing exact entry timestamps and entrance gate locations." },
        ],
        steps: [
          { n: "01", title: "Map Venue Gates", desc: "Identify all physical entrance points (Main Gate, VIP Door, East Entrance)." },
          { n: "02", title: "Assign Gate Staff", desc: "Provide entrance coordinators at each gate with the secure check-in URL." },
          { n: "03", title: "Begin Unified Scanning", desc: "Staff scan incoming passes simultaneously with real-time cloud sync." },
          { n: "04", title: "Block Shared Passes", desc: "Any attempted reuse at another gate is immediately rejected." },
          { n: "05", title: "Monitor Real-Time Traffic", desc: "Watch live arrival graphs to balance volunteer staffing across gates." },
        ],
        callout: {
          badge: "ANTI-FRAUD ARCHITECTURE",
          title: "Prevent fence-passing and pass-sharing across doors.",
          description: "At large festivals, attendees often enter through Gate 1 and text a screenshot of their pass to friends waiting at Gate 2. URPASS eliminates this loophole with sub-second cross-gate database invalidation.",
          bullets: [
            "Sub-second cross-gate duplicate pass lockout",
            "Deploy unlimited volunteer scanners across all doors",
            "Restricted volunteer access protecting financial settings",
            "Live traffic analytics across all entrance gates",
          ],
        },
        useCases: [
          "Campus Fests with Multiple Entrances",
          "Multi-Hall Convention Centers",
          "Sports Stadiums",
          "Open-Air Music Festivals",
          "Hackathon Venues with Re-Entry",
          "Corporate Multi-Building Summits",
        ],
        faqs: [
          { q: "How fast does a scan at Gate 1 invalidate a pass at Gate 2?", a: "The pass is invalidated in milliseconds across all connected scanning devices over standard cellular or Wi-Fi connections." },
          { q: "Can we assign specific ticket types to specific gates?", a: "Yes. When a pass is scanned, the attendee's ticket tier (e.g. VIP, Speaker, General) appears clearly on the screen so staff can verify entry rights." },
          { q: "Can we track which gate an attendee entered through?", a: "Yes. Check-in logs record the timestamp and scanner metadata, allowing you to audit traffic per gate." },
          { q: "Is there an extra charge for adding more gates or scanners?", a: "No. URPASS allows unlimited scanning devices and gates across all subscription plans." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
