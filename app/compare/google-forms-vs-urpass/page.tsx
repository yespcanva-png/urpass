import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, QrCode, ScanLine, ShieldCheck, BarChart3, CreditCard } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Google Forms vs URPASS for Event Registration & Check-In",
  description: "While Google Forms collects responses into a spreadsheet, it lacks digital QR passes, gate check-in scanning, duplicate entry lockout, and live attendance metrics. Compare features, entrance security, and workflow efficiency.",
  keywords: [
    "google forms vs urpass",
    "event ticketing alternative",
    "event registration software",
    "QR event check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/compare/google-forms-vs-urpass" },
  openGraph: {
    title: "Google Forms vs URPASS for Event Registration & Check-In | URPASS",
    description: "While Google Forms collects responses into a spreadsheet, it lacks digital QR passes, gate check-in scanning, duplicate entry lockout, and live attendance metrics. Compare features, entrance security, and workflow efficiency.",
    url: "https://urpass.space/compare/google-forms-vs-urpass",
    locale: "en_IN",
    type: "article",
  },
};

export default function ComparisonPage() {
  return (
    <SEOPage
      config={{
        badge: "WORKFLOW COMPARISON",
        h1: "Google Forms vs URPASS for Event Registration & Entry",
        canonicalUrl: "https://urpass.space/compare/google-forms-vs-urpass",
        description: "While Google Forms collects responses into a spreadsheet, it lacks digital QR passes, gate check-in scanning, duplicate entry lockout, and live attendance metrics. Compare features, entrance security, and workflow efficiency.",
        ctaLabel: "Try URPASS free",
        features: [
          { icon: ClipboardList, title: "Digital QR Pass Issuance", desc: "Google Forms leaves you with raw spreadsheet rows. URPASS automatically generates and delivers branded, encrypted QR passes to approved guests." },
          { icon: QrCode, title: "Sub-0.3s Mobile Gate Scanning", desc: "Google Forms requires manual name-crossing at the door. URPASS verifies attendee passes in under 0.3s using phone cameras." },
          { icon: ScanLine, title: "Duplicate Entry Prevention", desc: "Google Forms cannot stop attendees from sharing names or reusing confirmations. URPASS locks out duplicate pass scans in real time." },
          { icon: ShieldCheck, title: "Multi-Gate Cloud Sync", desc: "Coordinate multiple volunteer scanners across venue doors with instant central synchronization on URPASS." },
          { icon: BarChart3, title: "Integrated UPI & Card Payments", desc: "Google Forms cannot natively process payments. URPASS integrates Razorpay for paid ticketing with zero commission." },
          { icon: CreditCard, title: "Real-Time Attendance Dashboard", desc: "URPASS displays live arrival charts, peak entry hours, and exportable timestamped logs for compliance." },
        ],
        steps: [
          { n: "01", title: "Build Form", desc: "Set up registration fields on URPASS in 3 minutes with custom seat caps." },
          { n: "02", title: "Share Public Link", desc: "Share your clean, mobile-responsive link across student and community channels." },
          { n: "03", title: "Auto-Deliver Passes", desc: "Approved participants receive digital QR passes without manual mail merges." },
          { n: "04", title: "Scan at Venue Doors", desc: "Volunteers scan passes with smartphone browsers for instant valid/invalid checks." },
          { n: "05", title: "Export Attendance", desc: "Download verified attendance sheets with exact entry timestamps." },
        ],
        callout: {
          badge: "LAST-MILE SOLUTION",
          title: "Google Forms solves collection. URPASS solves event entry.",
          description: "Collecting names is only the first step. When hundreds of attendees arrive at your venue, searching spreadsheets creates massive queues and security loopholes. URPASS automates the entire registration-to-entry journey.",
          bullets: [
            "Automated digital QR passes for every registered attendee",
            "Sub-0.3s door check-in using standard smartphone cameras",
            "Instant duplicate entry lockout across all venue doors",
            "Permanent free tier for up to 100 registrations per month",
          ],
        },
        useCases: [
          "College Technical Symposiums",
          "Campus Cultural Fests",
          "24h Hackathons",
          "Hands-on Workshops",
          "Department Seminars",
          "Community Tech Meetups",
        ],
        faqs: [
          { q: "Can I import an existing Google Sheet into URPASS?", a: "Yes. You can export your Google Sheet to CSV and import it into URPASS to generate unique digital QR passes for all attendees immediately." },
          { q: "Why shouldn't I use Google Forms add-ons to send QR codes?", a: "Third-party add-ons rely on Google Apps Script quotas, frequently break under volume, and provide no synchronized scanner to prevent duplicate entry at the door." },
          { q: "Is URPASS as easy to use as Google Forms?", a: "Yes. Creating an event and form takes under 3 minutes with zero technical or coding knowledge required." },
          { q: "Does URPASS charge money for small events?", a: "No. You can host up to 2 events per month with 100 registrations per month completely free on our permanent free tier." },
        ],
        ctaTitle: "Experience the URPASS difference today",
        ctaDescription: "Permanent free tier · Zero ticket commission · Sub-second door check-in",
      }}
    />
  );
}
