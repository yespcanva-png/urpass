import type { Metadata } from "next";
import { Clock, Factory, Layers, QrCode, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Factory Visitor Event Registration | UrPass",
  description: "Coordinate vendor days, open houses, plant visits and factory tour check-ins with secure digital registration and access validation.",
  keywords: [
    "factory visitor event registration",
    "manage factory event guests with digital qr passes",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/factory-visitor-event-registration" },
  openGraph: {
    title: "Factory Visitor Event Registration | UrPass",
    description: "Coordinate vendor days, open houses, plant visits and factory tour check-ins with secure digital registration and access validation.",
    url: "https://urpass.space/factory-visitor-event-registration",
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
        badge: "PLANT VISITS & VENDOR SUMMITS",
        h1: "Manage Factory Event Guests with Digital QR Passes",
        canonicalUrl: "https://urpass.space/factory-visitor-event-registration",
        description: "Coordinate vendor days, open houses, plant visits and factory tour check-ins with secure digital registration and access validation.",
        ctaLabel: "Create Plant Event",
        directAnswer: {
          title: "How Does Factory Visitor Event Registration Work with UrPass?",
          summary: "UrPass manages visitor registration and security gate access for manufacturing plants, automotive assembly factories, and industrial vendor days. Visitors pre-register, review safety protocols and PPE requirements, and receive digital QR entry passes. Security teams at outer perimeter gates scan passes in <0.3s.",
          keyPoints: ["Mandatory industrial safety briefing and PPE gear acknowledgment before pass issuance", "Perimeter security gate verification using standard smartphones or rugged Android scanners", "Time-gated visitor access restricting entry to designated tour windows and plant zones", "Emergency muster point roll call capability with real-time in-plant headcount"],
        },
        keyFactsTable: {
          title: "Factory Visitor Security Comparison",
          subtitle: "EHS safety compliance and plant perimeter security.",
          headers: ["Industrial Safety Factor", "UrPass Plant Pass System", "Gatehouse Paper Visitor Logs"],
          rows: [
            {
                        "col1": "Safety Briefing Acknowledgment",
                        "col2": "Digital signature required prior to QR pass release",
                        "col3": "Hasty verbal briefing at gatehouse with zero proof"
            },
            {
                        "col1": "Emergency Evacuation Muster",
                        "col2": "Live on-site visitor headcount accessible on mobile",
                        "col3": "Paper logbook trapped inside gatehouse during fire"
            },
            {
                        "col1": "Perimeter Gate Throughput",
                        "col2": "<0.3s camera scan keeping gate traffic clear",
                        "col3": "Vehicles queued on highway waiting for manual check-in"
            },
            {
                        "col1": "Restricted Zone Access",
                        "col2": "Scanner validates specific assembly line permissions",
                        "col3": "Generic paper badges with no zone verification"
            },
            {
                        "col1": "EHS Safety Compliance Audit",
                        "col2": "Instant digital audit log with exact entry timestamps",
                        "col3": "Illegible, incomplete physical sign-in books"
            }
],
        },
        features: [
          { icon: Factory, title: "Plant Perimeter Gate Scanning", desc: "Security personnel scan visitor passes at outer gates and security checkpoints in under 0.3 seconds." },
          { icon: ShieldCheck, title: "Safety & PPE Acknowledgments", desc: "Require visitors to review mandatory safety rules (steel-toe footwear, hi-vis vests) before receiving passes." },
          { icon: Clock, title: "Time-Gated Shift Access", desc: "Restrict pass validity to specific tour slots, vendor meeting windows, or morning/afternoon shifts." },
          { icon: Layers, title: "Zone & Line Access Control", desc: "Control which visitors have clearance for shop floor tours versus administrative office boardrooms." },
          { icon: Users, title: "Emergency Muster Headcount", desc: "Access live lists of all on-site visitors instantly on security smartphones during emergency drills." },
          { icon: QrCode, title: "WhatsApp QR Dispatch", desc: "Send digital passes with GPS gate coordinates and parking instructions directly to visitor WhatsApp." }
        ],
        steps: [
          { n: "01", title: "Set Up Plant Event", desc: "Configure vendor day, plant opening, or client tour with safety requirements and visitor quotas." },
          { n: "02", title: "Visitors Pre-Register", desc: "Guests submit vehicle numbers, ID details, and accept mandatory EHS plant safety rules." },
          { n: "03", title: "Deliver Digital Passes", desc: "Approved guests receive encrypted digital QR passes on WhatsApp with gate entry instructions." },
          { n: "04", title: "Security Gate Scan", desc: "Security guards scan visitor passes through car windows or at turnstiles in under 0.3s." },
          { n: "05", title: "Maintain Safety Telemetry", desc: "Monitor active in-plant headcount to ensure full compliance with factory fire safety caps." }
        ],
        callout: {
          badge: "EHS SAFETY & COMPLIANCE",
          title: "Know exactly who is inside your manufacturing facility at all times.",
          description: "Industrial manufacturing plants carry strict environmental, health, and safety (EHS) obligations. UrPass ensures every visitor has acknowledged safety rules and gives safety teams live headcount.",
          bullets: ["Instant emergency muster roll call accessible from any safety officer's phone", "Prevent unauthorized access to dangerous machinery or restricted production lines", "Eliminate long truck and car queues at security entry gates", "Full digital audit trails for ISO 45001 and workplace safety inspections"],
        },
        faqs: [
          { q: "Can we mandate that visitors accept safety rules before receiving an entry pass?", a: "Yes. UrPass allows you to embed plant safety protocols, footwear rules, and NDAs that must be accepted before a pass is released." },
          { q: "Can security guards scan passes outdoors without specialized equipment?", a: "Yes. Security teams can use any standard smartphone camera or rugged Android device to scan passes in all lighting conditions." },
          { q: "How does the system support emergency evacuation and muster accounting?", a: "The real-time dashboard shows exact counts and names of all currently checked-in visitors, accessible immediately on mobile during drills or alarms." },
          { q: "Can we collect vehicle registration numbers during visitor signup?", a: "Yes. Custom form fields capture driver license numbers, vehicle registration plates, and company names." }
        ],
        relatedLinks: [
          { title: "Industrial Exhibition Visitor Management", href: "/industrial-exhibition-visitor-management", category: "Product" },
          { title: "Event Entry and Exit Tracking", href: "/event-entry-exit-tracking", category: "Product" },
          { title: "Corporate Visitor Registration", href: "/corporate-visitor-registration-software", category: "Product" },
          { title: "Smartphone QR Ticket Scanner", href: "/smartphone-qr-ticket-scanner", category: "Product" }
        ],
      }}
    />
  );
}
