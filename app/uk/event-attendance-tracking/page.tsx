import type { Metadata } from "next";
import {
  BarChart3,
  QrCode,
  ScanLine,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  Layers,
  CheckCircle2,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Attendance Tracking Software UK | Real-Time Headcount",
  description:
    "UK event attendance tracking and gate monitoring software. Track live arrivals, verify CPD credits, scan digital QR passes in 0.28s, and export UK GDPR-compliant rosters.",
  keywords: [
    "event attendance tracking software uk",
    "event attendance tracking uk",
    "cpd attendance tracking software",
    "conference headcount tracker uk",
    "qr code attendance system uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/event-attendance-tracking",
  },
  openGraph: {
    title: "Event Attendance Tracking Software UK | URPASS",
    description:
      "Accurate, real-time event attendance tracking for UK conferences, CPD seminars, and universities. Sub-second QR scanning and exportable logs.",
    url: "https://urpass.space/uk/event-attendance-tracking",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkEventAttendanceTrackingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/event-attendance-tracking",
        badge: "HEADCOUNT & CPD ACCREDITATION",
        h1: "Event Attendance Tracking Software for UK Events",
        description:
          "Know exactly who attended, when they arrived, and which entrance they used. URPASS provides real-time gate attendance tracking, CPD session logging, and exportable timestamped reports for UK conferences, seminars, and higher education institutions.",
        ctaLabel: "Start Tracking Free",
        directAnswer: {
          title: "How URPASS Tracks Event Attendance",
          summary:
            "Instead of manual paper sign-in sheets that create queues and unreliable records, URPASS equips event staff with an ultra-fast in-browser smartphone camera scanner (<0.28s). Every scan records the attendee's name, ticket tier, gate location, and exact second of arrival into a centralized cloud database, providing live venue occupancy metrics and verified CSV attendance audits.",
          keyPoints: [
            "Accurate Timestamps: Log exact entry seconds for CPD compliance and safety regulations",
            "Real-Time Occupancy: Track live venue headcount to ensure compliance with UK fire safety limits",
            "Multi-Gate Coordination: Sync dozens of entrance scanners across large UK exhibition centers",
            "UK GDPR Compliant: Full data encryption and exportable attendee records",
          ],
        },
        productProof: {
          badge: "REAL-TIME OCCUPANCY",
          title: "Live Attendance Velocity Dashboard",
          description:
            "Watch arrival charts update live as delegates pass through entrance gates. Export verified CSV rosters anytime.",
          type: "analytics",
        },
        features: [
          {
            icon: BarChart3,
            title: "Live Arrival Velocity",
            desc: "Monitor check-in speed per minute, anticipate door surges, and maintain optimal queue flow at entry gates.",
          },
          {
            icon: QrCode,
            title: "Encrypted QR Badges",
            desc: "Attendees present digital passes on their mobile screens with anti-fraud encryption and Apple Wallet sync.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second In-Browser Scan",
            desc: "Check in guests in under 0.28 seconds using any smartphone browser with zero app installation.",
          },
          {
            icon: ShieldCheck,
            title: "CPD & Compliance Records",
            desc: "Export verified attendance rosters with exact check-in seconds to satisfy continuing professional development audits.",
          },
          {
            icon: Users,
            title: "Multi-Gate Cloud Sync",
            desc: "Deploy staff across multiple entrances with synchronized headcount tracking to prevent duplicate admissions.",
          },
          {
            icon: Smartphone,
            title: "Zero Hardware Rentals",
            desc: "Eliminate expensive barcode scanner rentals by using the smartphones your event team already owns.",
          },
        ],
        steps: [
          { n: "01", title: "Set Up Event", desc: "Define attendance targets, gate locations, and registration categories." },
          { n: "02", title: "Distribute Passes", desc: "Registrants receive verified digital QR passes on their smartphones." },
          { n: "03", title: "Scan at Doors", desc: "Staff scan passes at entrances in under 0.28s with audible chimes." },
          { n: "04", title: "Export Reports", desc: "Download verified attendance sheets with timestamps for post-event audits." },
        ],
        callout: {
          badge: "SAFETY & COMPLIANCE",
          title: "Maintain accurate venue headcounts for safety and audits",
          description:
            "Knowing exact real-time attendance is critical for venue safety limits, fire regulations, and CPD certification compliance.",
          bullets: [
            "Permanent free plan available for small seminars and workshops",
            "In-browser scanner runs on any mobile device (<0.28s)",
            "Instant multi-door cloud sync across venue entry gates",
            "One-click CSV exports with verified delegate arrival timestamps",
          ],
        },
        useCases: [
          "Professional CPD training seminars & legal workshops",
          "Medical, healthcare & NHS educational sessions",
          "Academic university lectures & campus symposiums",
          "Corporate town halls, AGMs & investor conferences",
          "Exhibition halls & industry trade shows",
        ],
        faqs: [
          {
            q: "Can URPASS track attendance for UK CPD certification?",
            a: "Yes! URPASS logs the exact date, hour, minute, and second each attendee scans their pass at the entrance. Organizers can export this verified roster to CSV to audit and issue CPD certificates.",
          },
          {
            q: "How does the system ensure compliance with UK fire safety capacity limits?",
            a: "The organizer dashboard displays live real-time venue occupancy, showing total check-ins versus maximum venue capacity so you never exceed safety limits.",
          },
          {
            q: "Can we use multiple scanners across different entrances?",
            a: "Yes. You can station multiple volunteers across different doors. All scans synchronize instantly to provide a single, unified headcount.",
          },
          {
            q: "Is attendee data stored in accordance with UK GDPR?",
            a: "Yes. All personal data is encrypted in transit and at rest in strict compliance with the UK Data Protection Act 2018 and UK GDPR.",
          },
        ],
        ctaTitle: "Upgrade your event attendance tracking",
        ctaDescription: "Permanent free plan · Sub-0.3s gate scanning · Real-time headcount · UK GDPR compliant",
      }}
    />
  );
}
