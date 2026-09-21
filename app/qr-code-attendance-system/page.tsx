import type { Metadata } from "next";
import { CheckCircle2, QrCode, BarChart3, Clock, Download, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Code Attendance System for Events & Workshops",
  description: "Automate attendance tracking with unique QR codes. Attendees present their digital pass, staff scans in under 0.3s, and records sync in real time.",
  keywords: [
    "QR code attendance system",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/qr-code-attendance-system" },
  openGraph: {
    title: "QR Code Attendance System for Events & Workshops | URPASS",
    description: "Automate attendance tracking with unique QR codes. Attendees present their digital pass, staff scans in under 0.3s, and records sync in real time.",
    url: "https://urpass.space/qr-code-attendance-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "QR CODE ATTENDANCE SYSTEM",
        h1: "QR Code Attendance System for Conferences, Colleges & Fests",
        canonicalUrl: "https://urpass.space/qr-code-attendance-system",
        description: "Automate attendance tracking with unique QR codes. Attendees present their digital pass, staff scans in under 0.3s, and records sync in real time.",
        ctaLabel: "Set up attendance system free",
        features: [
          { icon: QrCode, title: "Individual Encrypted QR Codes", desc: "Each participant receives a unique QR code tied to their registration record that cannot be forged or shared." },
          { icon: BarChart3, title: "Sub-Second Entry Scanning", desc: "Verify passes in under 0.3 seconds using any mobile browser, eliminating paper rosters and queue delays." },
          { icon: Clock, title: "Real-Time Headcount Dashboard", desc: "Watch live attendance tallies update with every scan, displaying total arrivals and peak check-in velocity." },
          { icon: Download, title: "Time-Stamped Audit Records", desc: "Capture the exact second each attendee entered for formal accreditation, college credits, or compliance." },
          { icon: ShieldCheck, title: "Duplicate Entry Lockout", desc: "Passes are permanently invalidated upon first scan, completely preventing unauthorized re-use." },
          { icon: Users, title: "Instant CSV Export", desc: "Export verified attendee records with full contact details and check-in timestamps to Excel with one click." },
        ],
        steps: [
          { n: "01", title: "Collect Registrations", desc: "Gather participant signups via custom online forms on URPASS." },
          { n: "02", title: "Issue QR Passes", desc: "Attendees receive mobile digital passes containing their unique QR code." },
          { n: "03", title: "Scan at Doors", desc: "Staff scan passes with smartphone cameras as attendees arrive." },
          { n: "04", title: "Record Attendance", desc: "Dashboard updates in real time with exact arrival timestamps." },
          { n: "05", title: "Export Audit Log", desc: "Download verified attendance lists for certificates and reporting." },
        ],
        callout: {
          badge: "MODERN ATTENDANCE",
          title: "Fraud-proof attendance logging without paper lists.",
          description: "Manual sign-in sheets are slow, inaccurate, and vulnerable to proxy sign-ins. URPASS QR code attendance system provides verified, timestamped attendance records automatically.",
          bullets: [
            "Eliminates proxy attendance and fraudulent check-ins",
            "Timestamped logs ready for institutional accreditation",
            "Runs on standard mobile phones without barcode hardware",
            "Free tier available for up to 100 attendees per month",
          ],
        },
        useCases: [
          "College Technical Symposiums",
          "Corporate Continuing Education",
          "Medical & Legal Conferences",
          "Mandatory Safety Briefings",
          "Department Training Seminars",
          "Campus General Meetings",
        ],
        faqs: [
          { q: "How does this system prevent students from marking attendance for friends?", a: "Each QR code is linked to an individual student and can only be scanned once at the door. Screenshots or forwarded codes are locked out once used." },
          { q: "Can we export attendance data with exact entry timestamps?", a: "Yes. The CSV export includes attendee name, email, department, pass tier, and the exact timestamp of their check-in." },
          { q: "Does the system require dedicated scanning hardware?", a: "No. Any staff member or volunteer can scan using the camera on their own smartphone via a web browser." },
          { q: "Is URPASS free to use for small workshops?", a: "Yes. You can host 2 events per month with up to 100 attendees per month completely free on our permanent free tier." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
