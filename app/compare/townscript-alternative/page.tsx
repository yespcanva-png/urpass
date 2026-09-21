import type { Metadata } from "next";
import { CheckCircle2, Percent, CreditCard, ScanLine, ShieldCheck, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Townscript Alternative for Event Organizers in India",
  description: "Compare Townscript and URPASS. Eliminate high per-ticket transaction cuts, simplify door check-in with sub-second browser scanning, and keep 100% of your event revenue.",
  keywords: [
    "townscript alternative",
    "event ticketing alternative",
    "event registration software",
    "QR event check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/compare/townscript-alternative" },
  openGraph: {
    title: "Townscript Alternative for Event Organizers in India | URPASS",
    description: "Compare Townscript and URPASS. Eliminate high per-ticket transaction cuts, simplify door check-in with sub-second browser scanning, and keep 100% of your event revenue.",
    url: "https://urpass.space/compare/townscript-alternative",
    locale: "en_IN",
    type: "article",
  },
};

export default function ComparisonPage() {
  return (
    <SEOPage
      config={{
        badge: "FLAT PRICING ALTERNATIVE",
        h1: "Townscript Alternative with Zero Ticket Commissions",
        canonicalUrl: "https://urpass.space/compare/townscript-alternative",
        description: "Compare Townscript and URPASS. Eliminate high per-ticket transaction cuts, simplify door check-in with sub-second browser scanning, and keep 100% of your event revenue.",
        ctaLabel: "Switch from Townscript free",
        features: [
          { icon: Percent, title: "Flat Subscription Model", desc: "Townscript charges significant percentage cuts per ticket. URPASS offers flat, transparent monthly plans with zero per-ticket commission." },
          { icon: CreditCard, title: "Native Razorpay Integration", desc: "Collect ticket revenue via UPI (GPay, PhonePe, Paytm), credit/debit cards, and net banking with direct bank settlements." },
          { icon: ScanLine, title: "Instant Mobile Door Check-In", desc: "Scan passes in under 0.3 seconds directly inside phone browsers without renting specialized barcode guns." },
          { icon: ShieldCheck, title: "Single-Use Duplicate Lockout", desc: "Cryptographic QR tokens prevent ticket duplication, pass sharing, and unauthorized gate entry." },
          { icon: Users, title: "Custom Pass Branding", desc: "Create modern digital tickets featuring your organization logo, accent colors, and Apple Wallet support." },
          { icon: BarChart3, title: "Exportable Attendee Data", desc: "Download complete attendee contact information and timestamped arrival records to CSV at any time." },
        ],
        steps: [
          { n: "01", title: "Create Event", desc: "Set ticket classes, capacity limits, and custom registration fields." },
          { n: "02", title: "Publish in INR", desc: "Share your clean, mobile-responsive ticketing link across channels." },
          { n: "03", title: "Auto-Deliver Passes", desc: "Attendees receive unique digital QR passes immediately upon booking." },
          { n: "04", title: "Scan at Doors", desc: "Volunteers scan passes with phone browsers in under 0.3 seconds." },
          { n: "05", title: "Keep 100% Revenue", desc: "Revenue settles directly to your bank account with zero platform cuts." },
        ],
        callout: {
          badge: "BETTER VALUE",
          title: "Save tens of thousands of rupees on ticketing commissions.",
          description: "If you sell 1,000 tickets at ₹500 each, legacy ticketing platforms take upwards of ₹25,000 in platform fees. URPASS charges zero per-ticket commission on flat, predictable plans.",
          bullets: [
            "Zero per-ticket percentage cuts on ticket sales",
            "Native UPI payments via Razorpay (GPay, PhonePe, Paytm)",
            "Sub-0.3s camera check-in with any smartphone browser",
            "Permanent free tier available for up to 100 attendees per month",
          ],
        },
        useCases: [
          "College Fests & Culturals",
          "Tech Conferences & Summits",
          "Hands-on Workshops",
          "Hackathons & Buildathons",
          "Music Concerts & Shows",
          "Corporate Seminars",
        ],
        faqs: [
          { q: "How does URPASS pricing compare to Townscript?", a: "Townscript takes a percentage fee from every ticket you sell. URPASS operates on flat monthly subscription tiers with zero per-ticket commissions." },
          { q: "Can Indian event organizers accept UPI payments?", a: "Yes. Native Razorpay integration allows you to accept Google Pay, PhonePe, Paytm, cards, and net banking." },
          { q: "How do door staff scan tickets at the venue?", a: "Staff simply open a secure scanner URL in their phone browser, grant camera access, and scan tickets in under 0.3 seconds." },
          { q: "Can I host free events on URPASS?", a: "Yes. You can host 2 events per month with up to 100 registrations per month completely free on our permanent free tier." },
        ],
        ctaTitle: "Experience the URPASS difference today",
        ctaDescription: "Permanent free tier · Zero ticket commission · Sub-second door check-in",
      }}
    />
  );
}
