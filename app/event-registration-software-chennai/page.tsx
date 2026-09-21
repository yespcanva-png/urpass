import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Chennai",
  description: "Organizing a college fest, conference, workshop or corporate event in Chennai? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
  keywords: [
    "event registration software chennai",
    "event registration software India",
    "QR event check-in Chennai",
    "college event passes Chennai",
    "event ticketing platform Chennai",
    "Razorpay event ticketing",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-chennai" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Chennai | URPASS",
    description: "Organizing a college fest, conference, workshop or corporate event in Chennai? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
    url: "https://urpass.space/event-registration-software-chennai",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "TN",
    "geo.placename": "Chennai",
    "geo.position": "13.0827;80.2707",
    "ICBM": "13.0827, 80.2707",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "CHENNAI COLLEGES & CONFERENCES",
        h1: "Event Registration & QR Check-In Software in Chennai",
        canonicalUrl: "https://urpass.space/event-registration-software-chennai",
        geo: {
          region: "TN",
          placename: "Chennai",
          position: "13.0827;80.2707",
          latitude: 13.0827,
          longitude: 80.2707,
        },
        description: "Organizing a college fest, conference, workshop or corporate event in Chennai? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
        ctaLabel: "Start your Chennai event free",
        features: [
          { icon: MapPin, title: "Built for Chennai Events", desc: "Local INR pricing, Razorpay payment gateway integration, and native support for Chennai colleges, conferences, fests, and corporate summits." },
          { icon: Ticket, title: "UPI & Online Ticketing", desc: "Accept payments via Google Pay, PhonePe, Paytm, net banking, and cards with zero per-ticket platform commission fees." },
          { icon: QrCode, title: "Instant Digital Passes", desc: "Approved registrants automatically receive a unique digital QR pass — no physical printing or lost paper tickets." },
          { icon: ScanLine, title: "Sub-0.3s Door Scanning", desc: "Scan attendee passes at Chennai venue entrances using any smartphone or tablet browser without renting hardware." },
          { icon: Users, title: "Attendee Management", desc: "Review, approve, search, and manage participant registrations from anywhere in Chennai on one central dashboard." },
          { icon: BarChart3, title: "Live Gate Analytics", desc: "Track attendance and check-in velocity live as guests arrive, with one-click export to CSV for institutional audits." },
        ],
        callout: {
          badge: "POPULAR CHENNAI VENUES",
          title: "Trusted across venues in Chennai and Tamil Nadu.",
          description: "Engineered for high-volume crowds across OMR IT Corridor, Guindy, Chennai Trade Centre Nandambakkam, Anna Nagar, and T. Nagar. URPASS eliminates entrance bottlenecks and duplicate pass fraud.",
          bullets: [
            "Local INR pricing with GST compliant invoices",
            "Zero per-ticket percentage cuts on ticket revenue",
            "Instant duplicate pass lockout across all entrance gates",
            "Permanent free tier available for up to 100 attendees per month"
          ],
        },
        useCases: [
          "Engineering Symposiums",
          "Inter-College Culturals",
          "IT Industry Summits",
          "Healthcare Conferences",
          "Music & Dance Fests",
        ],
        faqs: [
          { q: "How does URPASS help Chennai engineering college symposiums?", a: "URPASS lets college symposiums collect student roll numbers, cap lab seat quotas, issue verified QR passes, and scan students at campus gates in under 0.3s." },
          { q: "Can we manage multi-gate entry at Chennai Trade Centre expos?", a: "Yes. Scanners sync across all entrance halls in real time, preventing duplicate entry and pass sharing." },
          { q: "Do students need to install an app to enter Chennai college fests?", a: "No. The digital QR pass opens directly in mobile web browsers and can be saved to Apple Wallet." },
          { q: "Can organizers accept UPI ticket payments in Chennai?", a: "Yes. Built-in Razorpay integration enables instant ticket sales through GPay, PhonePe, Paytm, and net banking." },
        ],
        ctaTitle: "Start your Chennai event with URPASS",
        ctaDescription: "Free plan available · Razorpay UPI payments · Sub-second mobile scanning",
      }}
    />
  );
}
