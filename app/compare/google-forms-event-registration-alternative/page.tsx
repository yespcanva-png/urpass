import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, QrCode, ScanLine, ShieldCheck, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Google Forms Event Registration Alternative with Automated QR Passes",
  description: "Upgrade from Google Forms and spreadsheets to an automated registration-to-entry system. Collect custom attendee data, issue single-use digital QR passes, and scan guests at the door.",
  keywords: [
    "google forms event registration alternative",
    "event ticketing alternative",
    "event registration software",
    "QR event check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/compare/google-forms-event-registration-alternative" },
  openGraph: {
    title: "Google Forms Event Registration Alternative with Automated QR Passes | URPASS",
    description: "Upgrade from Google Forms and spreadsheets to an automated registration-to-entry system. Collect custom attendee data, issue single-use digital QR passes, and scan guests at the door.",
    url: "https://urpass.space/compare/google-forms-event-registration-alternative",
    locale: "en_IN",
    type: "article",
  },
};

export default function ComparisonPage() {
  return (
    <SEOPage
      config={{
        badge: "AUTOMATED ALTERNATIVE",
        h1: "Google Forms Event Registration Alternative with Digital Passes",
        canonicalUrl: "https://urpass.space/compare/google-forms-event-registration-alternative",
        description: "Upgrade from Google Forms and spreadsheets to an automated registration-to-entry system. Collect custom attendee data, issue single-use digital QR passes, and scan guests at the door.",
        ctaLabel: "Upgrade from Google Forms free",
        features: [
          { icon: ClipboardList, title: "Automated QR Pass Delivery", desc: "No manual mail merges or spreadsheet formatting. Registrants receive unique digital QR passes automatically." },
          { icon: QrCode, title: "Mobile Door Check-In", desc: "Volunteers scan attendee passes in under 0.3s using phone browsers, eliminating paper sign-in rosters." },
          { icon: ScanLine, title: "Duplicate Entry Lockout", desc: "Single-use cryptographic tokens prevent pass sharing and unauthorized entrance across all venue gates." },
          { icon: ShieldCheck, title: "Real-Time Headcount Feed", desc: "Watch live attendance tallies update with every scan, displaying total arrivals and remaining capacity." },
          { icon: Users, title: "Paid Ticketing via Razorpay", desc: "Collect registration fees via UPI, credit/debit cards, and net banking with zero platform commission." },
          { icon: BarChart3, title: "One-Click CSV Export", desc: "Download verified attendee records with full contact details and exact check-in timestamps anytime." },
        ],
        steps: [
          { n: "01", title: "Create Form in URPASS", desc: "Add custom questions, ticket tiers, and capacity caps in 3 minutes." },
          { n: "02", title: "Share Public Link", desc: "Distribute your clean, mobile-responsive registration link across channels." },
          { n: "03", title: "Deliver Digital Passes", desc: "Approved participants receive digital QR passes without manual mail merges." },
          { n: "04", title: "Scan at Doors", desc: "Volunteers scan passes with phone browsers for instant valid/invalid checks." },
          { n: "05", title: "Export Attendance", desc: "Download verified attendance sheets with exact entry timestamps." },
        ],
        callout: {
          badge: "UPGRADE YOUR FLOW",
          title: "Everything Google Forms is missing for event organizers.",
          description: "Google Forms only records responses into a spreadsheet. It cannot issue verifiable digital passes, authenticate entry at the door, or prevent duplicate admissions. URPASS solves the complete event lifecycle.",
          bullets: [
            "Direct conversion from form submission to digital QR pass",
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
