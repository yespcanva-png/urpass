import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Mumbai",
  description: "Organizing a college fest, conference, workshop or corporate event in Mumbai? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
  keywords: [
    "event registration software mumbai",
    "event registration software India",
    "QR event check-in Mumbai",
    "college event passes Mumbai",
    "event ticketing platform Mumbai",
    "Razorpay event ticketing",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-mumbai" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Mumbai | URPASS",
    description: "Organizing a college fest, conference, workshop or corporate event in Mumbai? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
    url: "https://urpass.space/event-registration-software-mumbai",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "MH",
    "geo.placename": "Mumbai",
    "geo.position": "19.0760;72.8777",
    "ICBM": "19.0760, 72.8777",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "MUMBAI SUMMITS & CONFERENCES",
        h1: "Event Registration & QR Check-In Software in Mumbai",
        canonicalUrl: "https://urpass.space/event-registration-software-mumbai",
        geo: {
          region: "MH",
          placename: "Mumbai",
          position: "19.0760;72.8777",
          latitude: 19.076,
          longitude: 72.8777,
        },
        description: "Organizing a college fest, conference, workshop or corporate event in Mumbai? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
        ctaLabel: "Start your Mumbai event free",
        features: [
          { icon: MapPin, title: "Built for Mumbai Events", desc: "Local INR pricing, Razorpay payment gateway integration, and native support for Mumbai colleges, conferences, fests, and corporate summits." },
          { icon: Ticket, title: "UPI & Online Ticketing", desc: "Accept payments via Google Pay, PhonePe, Paytm, net banking, and cards with zero per-ticket platform commission fees." },
          { icon: QrCode, title: "Instant Digital Passes", desc: "Approved registrants automatically receive a unique digital QR pass — no physical printing or lost paper tickets." },
          { icon: ScanLine, title: "Sub-0.3s Door Scanning", desc: "Scan attendee passes at Mumbai venue entrances using any smartphone or tablet browser without renting hardware." },
          { icon: Users, title: "Attendee Management", desc: "Review, approve, search, and manage participant registrations from anywhere in Mumbai on one central dashboard." },
          { icon: BarChart3, title: "Live Gate Analytics", desc: "Track attendance and check-in velocity live as guests arrive, with one-click export to CSV for institutional audits." },
        ],
        callout: {
          badge: "POPULAR MUMBAI VENUES",
          title: "Trusted across venues in Mumbai and Maharashtra.",
          description: "Engineered for high-volume crowds across Bandra Kurla Complex (BKC), Bombay Exhibition Centre (NESCO) Goregaon, Nariman Point, and Powai. URPASS eliminates entrance bottlenecks and duplicate pass fraud.",
          bullets: [
            "Local INR pricing with GST compliant invoices",
            "Zero per-ticket percentage cuts on ticket revenue",
            "Instant duplicate pass lockout across all entrance gates",
            "Permanent free tier available for up to 100 attendees per month"
          ],
        },
        useCases: [
          "Banking & FinTech Summits",
          "Media & Entertainment Galas",
          "College Youth Fests",
          "Investor Demo Days",
          "Corporate Annual Dinners",
        ],
        faqs: [
          { q: "Is URPASS suitable for high-profile executive summits in BKC?", a: "Yes. URPASS delivers prestigious digital passes with company branding, table numbers, and rapid 0.3s red carpet check-in." },
          { q: "Can large exhibitions at NESCO Goregaon manage multi-hall visitor check-in?", a: "Yes. Deploy unlimited scanning counters across halls with real-time central synchronization." },
          { q: "Does URPASS charge per-ticket commissions on ticket sales?", a: "No. URPASS operates on transparent monthly subscription tiers with zero per-ticket platform cuts." },
          { q: "Can Mumbai college fests use URPASS for star night crowds?", a: "Yes. High-speed mobile scanning handles thousands of students at campus gates without delays." },
        ],
        ctaTitle: "Start your Mumbai event with URPASS",
        ctaDescription: "Free plan available · Razorpay UPI payments · Sub-second mobile scanning",
      }}
    />
  );
}
