import type { Metadata } from "next";
import { CheckCircle2, BarChart3, ScanLine, Users, Clock, Download, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Attendance Software & Live Check-In Tracking",
  description: "Track attendee check-ins, eliminate paper rosters, verify entries in under 0.3s, and export timestamped attendance records for compliance and certificates.",
  keywords: [
    "event attendance software",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-attendance-software" },
  openGraph: {
    title: "Event Attendance Software & Live Check-In Tracking | URPASS",
    description: "Track attendee check-ins, eliminate paper rosters, verify entries in under 0.3s, and export timestamped attendance records for compliance and certificates.",
    url: "https://urpass.space/event-attendance-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ATTENDANCE TRACKING SOFTWARE",
        h1: "Event Attendance Software with Real-Time QR Gate Tracking",
        canonicalUrl: "https://urpass.space/event-attendance-software",
        description: "Track attendee check-ins, eliminate paper rosters, verify entries in under 0.3s, and export timestamped attendance records for compliance and certificates.",
        ctaLabel: "Track attendance free",
        features: [
          { icon: BarChart3, title: "Real-Time Check-In Feed", desc: "Watch live attendance numbers update instantly as attendees scan their passes at venue doors." },
          { icon: ScanLine, title: "Time-Stamped Audit Logs", desc: "Every scan records the exact time, entrance gate, and scanner device for complete institutional compliance." },
          { icon: Users, title: "Sub-Second QR Validation", desc: "Verify passes in under 0.3s using any smartphone camera, eliminating long arrival lines." },
          { icon: Clock, title: "Fraud-Proof Verification", desc: "Single-use cryptographic tokens prevent pass sharing, screenshots, and unauthorized admissions." },
          { icon: Download, title: "One-Click CSV Export", desc: "Export full attendee rosters with checked-in status and timestamps for certification and reporting." },
          { icon: ShieldCheck, title: "Department & Tier Breakdown", desc: "Analyze attendance rates by student department, ticket tier, or organization type in real time." },
        ],
        steps: [
          { n: "01", title: "Import or Register", desc: "Collect signups on URPASS or import an existing attendee list via CSV." },
          { n: "02", title: "Issue QR Passes", desc: "Attendees receive digital passes with unique verifiable QR codes." },
          { n: "03", title: "Scan at Doors", desc: "Entrance volunteers scan passes using mobile browser cameras." },
          { n: "04", title: "Monitor Live Feed", desc: "Watch real-time headcount and arrival velocity on your dashboard." },
          { n: "05", title: "Export Records", desc: "Download verified attendance sheets for certificates and compliance." },
        ],
        callout: {
          badge: "ACCURATE RECORDS",
          title: "Accurate, audit-ready attendance data without manual errors.",
          description: "Manual paper sign-in sheets lead to illegible handwriting, lost sheets, and untracked entries. URPASS creates clean, timestamped attendance logs automatically.",
          bullets: [
            "Precise timestamps for every verified attendee scan",
            "Instant export to Excel/CSV for accreditation and certificates",
            "Multi-device scanning synchronized across all venue doors",
            "Permanent free tier for up to 100 attendees per month",
          ],
        },
        useCases: [
          "Continuing Education Seminars",
          "Corporate Training Sessions",
          "College Department Workshops",
          "Mandatory Campus Orientations",
          "Academic Conferences",
          "Shareholder Meetings",
        ],
        faqs: [
          { q: "Can we use this attendance software for mandatory college workshops?", a: "Yes. Every student scan records the precise timestamp, roll number, and department for official college attendance records." },
          { q: "Can we export attendance data for certificate generation?", a: "Yes. You can download a CSV file containing all checked-in attendees with timestamps to import into certificate generators." },
          { q: "Does the system work without internet?", a: "URPASS includes smart local caching to continue verifying passes smoothly even in areas with intermittent Wi-Fi or cellular connectivity." },
          { q: "How many gates can track attendance simultaneously?", a: "Unlimited. Multiple entrance staff can scan at different doors simultaneously with real-time central synchronization." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
