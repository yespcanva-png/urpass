import type { Metadata } from "next";
import { BarChart3, Briefcase, Clock, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Trade Show Exhibitor Registration | UrPass",
  description: "Register exhibitors, booth staff and VIP attendees with custom badge data and instant QR check-in at trade show entry points.",
  keywords: [
    "trade show exhibitor registration",
    "manage trade show exhibitors and digital passes",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/trade-show-exhibitor-registration" },
  openGraph: {
    title: "Trade Show Exhibitor Registration | UrPass",
    description: "Register exhibitors, booth staff and VIP attendees with custom badge data and instant QR check-in at trade show entry points.",
    url: "https://urpass.space/trade-show-exhibitor-registration",
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
        badge: "TRADE SHOW & EXPO OPERATIONS",
        h1: "Manage Trade Show Exhibitors and Digital Passes",
        canonicalUrl: "https://urpass.space/trade-show-exhibitor-registration",
        description: "Register exhibitors, booth staff and VIP attendees with custom badge data and instant QR check-in at trade show entry points.",
        ctaLabel: "Start Exhibitor Registration",
        directAnswer: {
          title: "How Does Trade Show Exhibitor Registration Work on UrPass?",
          summary: "UrPass provides an end-to-end exhibitor management system for trade expos and commercial trade fairs. Event organizers allocate booth staff quotas, collect exhibitor badge credentials, and issue multi-day digital QR passes. Booth staff scan in at loading bays and exhibit hall turnstiles with sub-second camera verification.",
          keyPoints: ["Allocated exhibitor booth passes with customizable staff quotas per booth tier", "Multi-day pass validity with setup-day early access permissions", "Instant QR badge delivery via WhatsApp and email for exhibitor teams", "Real-time exhibitor check-in analytics and booth occupancy telemetry"],
        },
        keyFactsTable: {
          title: "Trade Show Exhibitor Management Comparison",
          subtitle: "How UrPass accelerates trade show booth operations.",
          headers: ["Exhibitor Feature", "UrPass Digital Platform", "Manual Badging & Plastic Ribbons"],
          rows: [
            {
                        "col1": "Badge Turnaround Time",
                        "col2": "Instant digital pass release via smartphone",
                        "col3": "Hours standing in line at on-site badge printers"
            },
            {
                        "col1": "Booth Quota Allocation",
                        "col2": "Automated booth-based registration quotas",
                        "col3": "Messy Excel emails with exhibitor coordinators"
            },
            {
                        "col1": "Setup Day Access Control",
                        "col2": "Custom access rules for contractor / staff hours",
                        "col3": "Paper wristbands and manual gate guards"
            },
            {
                        "col1": "Badge Reprint Costs",
                        "col2": "$0 / \u00a30 (always available on mobile)",
                        "col3": "$15 to $30 penalty fees per lost badge"
            },
            {
                        "col1": "Multi-Hall Gate Sync",
                        "col2": "Sub-150ms cloud sync across all exhibit halls",
                        "col3": "Disconnected gate counters and slow paper logs"
            }
],
        },
        features: [
          { icon: Briefcase, title: "Booth Quota Management", desc: "Assign custom staff badge allowances depending on exhibitor booth square footage or sponsorship tier." },
          { icon: Clock, title: "Setup & Teardown Access", desc: "Differentiate build-up contractor badges from official show floor exhibitor passes automatically." },
          { icon: QrCode, title: "Digital Exhibitor Badges", desc: "Branded mobile passes with company name, booth number, staff role, and scannable QR code." },
          { icon: ScanLine, title: "Multi-Door Exhibition Scanning", desc: "Fast camera scanning at main expo entrances, loading bay doors, and VIP exhibitor lounges." },
          { icon: Users, title: "Self-Serve Team Roster", desc: "Lead exhibitors can invite their own booth team members without burdening the event organizer." },
          { icon: BarChart3, title: "Exhibitor Presence Telemetry", desc: "Track which booths are checked in and staffed during official show hours in real time." }
        ],
        steps: [
          { n: "01", title: "Define Booth Categories", desc: "Set booth sizes (e.g. 9sqm, 18sqm, Anchor Pavilion) and assign default staff pass quotas." },
          { n: "02", title: "Invite Exhibitor Leads", desc: "Send exhibitor registration portals to participating company coordinators." },
          { n: "03", title: "Exhibitors Register Team", desc: "Exhibitor leads input booth staff names, designations, and contact numbers." },
          { n: "04", title: "Automated Pass Dispatch", desc: "Staff receive personalized digital QR passes on WhatsApp and mobile email." },
          { n: "05", title: "Sub-Second Gate Scan", desc: "Expo hall security verify booth badges in <0.3s on mobile devices without badge queues." }
        ],
        callout: {
          badge: "ZERO QUEUE POLICY",
          title: "Eliminate 2-hour morning queues at trade show exhibitor registration desks.",
          description: "On day one of major trade expos, booth staff arrive simultaneously with thousands of delegates. UrPass eliminates badge printing queues with instant digital phone check-in.",
          bullets: ["Exhibitors arrive directly at their booths with pre-verified mobile QR badges", "No expensive badge printing contractors or malfunctioning thermal printers", "Instant pass replacements if a staff member loses their phone", "Full visibility over booth occupancy across multi-hall exhibition centers"],
        },
        faqs: [
          { q: "Can exhibitors register additional booth staff beyond their quota?", a: "Yes. Organizers can allow exhibitors to purchase supplementary staff passes at configured rates with zero platform fees." },
          { q: "How does the system handle setup days before the expo opens?", a: "UrPass allows organizers to set custom access dates and hours, granting setup access to contractors while locking out general delegates." },
          { q: "Can exhibitors scan visitor badges for lead retrieval?", a: "Yes! UrPass supports attendee badge scanning capabilities for fast booth lead capture and instant digital contact sharing." },
          { q: "Does UrPass work across multiple exhibition halls and gates?", a: "Yes. UrPass synchronizes scans in real-time (<150ms) across unlimited entry doors, loading bays, and VIP lounge turnstiles." }
        ],
        relatedLinks: [
          { title: "Industrial Exhibition Visitor Management", href: "/industrial-exhibition-visitor-management", category: "Product" },
          { title: "Conference Badge Scanning Software", href: "/conference-badge-scanning-software", category: "Product" },
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" }
        ],
      }}
    />
  );
}
