import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Varanasi",
  description: "Organizing a college fest, conference, trade expo, or corporate event in Varanasi? URPASS delivers instant online registration, Razorpay UPI ticketing with 0% platform cuts, digital QR passes, and sub-0.3s gate scanning from any smartphone.",
  keywords: [
    "event registration software varanasi",
    "event ticketing platform Varanasi",
    "QR event check-in Varanasi",
    "college event passes Varanasi",
    "Razorpay event ticketing Uttar Pradesh",
    "event attendance software Varanasi",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-varanasi" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Varanasi | URPASS",
    description: "Organizing an event in Varanasi? URPASS delivers instant online registrations, 0% commission Razorpay UPI ticketing, digital QR passes, and sub-0.3s gate check-in.",
    url: "https://urpass.space/event-registration-software-varanasi",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "UP",
    "geo.placename": "Varanasi",
    "geo.position": "25.3176;82.9739",
    "ICBM": "25.3176, 82.9739",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "VARANASI SCIENTIFIC & CULTURAL SUMMITS",
        h1: "Event Registration & QR Check-In Software in Varanasi",
        canonicalUrl: "https://urpass.space/event-registration-software-varanasi",
        geo: {
          region: "UP",
          placename: "Varanasi",
          position: "25.3176;82.9739",
          latitude: 25.3176,
          longitude: 82.9739,
        },
        description: "Organizing a college fest, conference, trade expo, or corporate summit in Varanasi? URPASS powers end-to-end event registrations, automated QR pass delivery, native Razorpay UPI ticketing, and sub-0.3s door check-in on any smartphone.",
        ctaLabel: "Start your Varanasi event free",
        directAnswer: {
          title: "How URPASS streamlines Varanasi event operations",
          summary: "URPASS replaces error-prone Google Forms, physical paper tickets, and expensive ticketing aggregators for Varanasi organizers. Registrants receive unique cryptographically generated QR passes via instant confirmation. Gate volunteers scan passes directly using their smartphone cameras in under 0.3s with zero app installation, eliminating venue entry queues entirely.",
          keyPoints: [
            "0% platform commission on ticket revenue (keep 100% of your ticket sales)",
            "Native Razorpay integration supporting Google Pay, PhonePe, Paytm, cards, and net banking",
            "Sub-0.3s door check-in speed that prevents bottleneck queues at venue gates",
            "Strict anti-duplicate pass lockout across all venue entrances simultaneously"
          ]
        },
        keyFactsTable: {
          title: "Varanasi Event Ticketing & Gate Control Comparison",
          subtitle: "Why event directors and student committees in Varanasi switch to URPASS",
          headers: ["Operational Feature", "Traditional Ticketing Platforms", "URPASS Event Infrastructure"],
          rows: [
            { col1: "Ticket Commission", col2: "5% to 12% per ticket + convenience charges", col3: "0% platform commission fee (keep 100% of proceeds)" },
            { col1: "Gate Check-In Speed", col2: "15 to 45 seconds per attendee", col3: "Under 0.3 seconds via smartphone browser scanner" },
            { col1: "Volunteer Onboarding", col2: "Requires app store downloads, logins & training", col3: "Zero app download: works instantly on any phone camera" },
            { col1: "Pass Security", col2: "Easily duplicated via screenshots or forwarded emails", col3: "Cryptographic QR pass with real-time multi-gate duplicate lockout" },
            { col1: "Payout Timelines", col2: "Funds held until 7 to 14 days after event concludes", col3: "Direct Razorpay settlements straight to your organization bank account" }
          ]
        },
        features: [
          { icon: MapPin, title: "Engineered for Varanasi", desc: "Direct INR billing, GST compliant tax invoices, and optimized performance for Varanasi venues, colleges, and business districts." },
          { icon: Ticket, title: "0% Commission UPI Ticketing", desc: "Collect payments directly via Razorpay with Google Pay, PhonePe, Paytm, net banking, and cards with zero platform percentage fees." },
          { icon: QrCode, title: "Instant Digital QR Passes", desc: "Registrants receive personal digital passes formatted for mobile display, Apple Wallet, and WhatsApp sharing." },
          { icon: ScanLine, title: "Sub-0.3s Mobile Scanning", desc: "Volunteers and door staff scan passes at venue gates using any iOS or Android phone browser without renting barcode hardware." },
          { icon: Users, title: "Central Attendee Control", desc: "Review applications, approve VIP participants, manage waitlists, and issue delegate passes from a unified control console." },
          { icon: BarChart3, title: "Real-Time Gate Analytics", desc: "Track live footfall velocity, peak arrival intervals, and gate turnout percentages with one-click export for institutional audits." },
        ],
        callout: {
          badge: "POPULAR VARANASI VENUES & INSTITUTES",
          title: "Trusted across venues and campuses in Varanasi.",
          description: "Engineered for high-volume crowds across Rudraksh International Cooperation & Convention Centre, Swatantrata Bhavan IIT BHU, Deendayal Hastkala Sankul (Bada Lalpur), KN Udupa Auditorium. URPASS is trusted by IIT (BHU) Varanasi, Banaras Hindu University (BHU), Institute of Medical Sciences (IMS BHU), Mahatma Gandhi Kashi Vidyapith to eliminate ticket fraud and eradicate entrance bottlenecks.",
          bullets: [
            "Local INR pricing with automated GST tax invoices",
            "Zero percentage commission deducted from ticket sales",
            "Instant multi-gate duplicate pass lockout",
            "Permanent free plan available for up to 100 registrations per month"
          ],
        },
        useCases: [
          "Engineering College Cultural & Technical Fests",
          "Corporate Conferences & Technology Summits",
          "Medical, Healthcare & Scientific Congresses",
          "Startup Pitch Conclaves & Hackathons",
          "Industry Trade Shows & Commercial Expos",
        ],
        faqs: [
          { q: "Can Varanasi organizers accept payments via UPI with zero platform cuts?", a: "Yes. With native Razorpay integration, attendees pay via Google Pay, PhonePe, Paytm, cards, or net banking, and funds settle directly into your bank account with zero platform percentage commissions taken by URPASS." },
          { q: "How fast is check-in during peak entry at Varanasi venues?", a: "Check-in takes under 0.3 seconds per attendee. Volunteers simply point their phone browser camera at the pass QR code. Instant audio-visual cues verify validity and block duplicates." },
          { q: "Can volunteers scan passes without installing an app from the App Store or Play Store?", a: "Yes. Volunteers access a secure web scanning link directly on their mobile browser. No downloads, installations, or app store accounts are required." },
          { q: "Is there a free tier for student communities and meetups in Varanasi?", a: "Yes. Organizers can host events with up to 100 registrations per month completely free on our starter tier, with full access to QR passes and live scanning." },
        ],
        ctaTitle: "Power your Varanasi event with URPASS",
        ctaDescription: "Permanent free tier available · Razorpay UPI settlements · Instant mobile browser scanning",
      }}
    />
  );
}
