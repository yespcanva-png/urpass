import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Delhi NCR",
  description: "Organizing a college fest, conference, workshop or corporate event in Delhi NCR? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
  keywords: [
    "event registration software delhi",
    "event registration software India",
    "QR event check-in Delhi NCR",
    "college event passes Delhi NCR",
    "event ticketing platform Delhi NCR",
    "Razorpay event ticketing",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-delhi" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Delhi NCR | URPASS",
    description: "Organizing a college fest, conference, workshop or corporate event in Delhi NCR? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
    url: "https://urpass.space/event-registration-software-delhi",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "DL",
    "geo.placename": "Delhi NCR",
    "geo.position": "28.6139;77.2090",
    "ICBM": "28.6139, 77.2090",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "DELHI NCR CONFERENCES & EXPOS",
        h1: "Event Registration & QR Check-In Software in Delhi NCR",
        canonicalUrl: "https://urpass.space/event-registration-software-delhi",
        geo: {
          region: "DL",
          placename: "Delhi NCR",
          position: "28.6139;77.2090",
          latitude: 28.6139,
          longitude: 77.209,
        },
        description: "Organizing a college fest, conference, workshop or corporate event in Delhi NCR? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
        ctaLabel: "Start your Delhi NCR event free",
        features: [
          { icon: MapPin, title: "Built for Delhi NCR Events", desc: "Local INR pricing, Razorpay payment gateway integration, and native support for Delhi NCR colleges, conferences, fests, and corporate summits." },
          { icon: Ticket, title: "UPI & Online Ticketing", desc: "Accept payments via Google Pay, PhonePe, Paytm, net banking, and cards with zero per-ticket platform commission fees." },
          { icon: QrCode, title: "Instant Digital Passes", desc: "Approved registrants automatically receive a unique digital QR pass — no physical printing or lost paper tickets." },
          { icon: ScanLine, title: "Sub-0.3s Door Scanning", desc: "Scan attendee passes at Delhi NCR venue entrances using any smartphone or tablet browser without renting hardware." },
          { icon: Users, title: "Attendee Management", desc: "Review, approve, search, and manage participant registrations from anywhere in Delhi NCR on one central dashboard." },
          { icon: BarChart3, title: "Live Gate Analytics", desc: "Track attendance and check-in velocity live as guests arrive, with one-click export to CSV for institutional audits." },
        ],
        callout: {
          badge: "POPULAR DELHI NCR VENUES",
          title: "Trusted across venues in Delhi NCR and National Capital.",
          description: "Engineered for high-volume crowds across Pragati Maidan (Bharat Mandapam), Yashobhoomi Dwarka, India Habitat Centre, Cyber City Gurgaon, and Noida Expo Mart. URPASS eliminates entrance bottlenecks and duplicate pass fraud.",
          bullets: [
            "Local INR pricing with GST compliant invoices",
            "Zero per-ticket percentage cuts on ticket revenue",
            "Instant duplicate pass lockout across all entrance gates",
            "Permanent free tier available for up to 100 attendees per month"
          ],
        },
        useCases: [
          "National Policy Summits",
          "University Convocations",
          "Mega Trade Expos",
          "Diplomatic Dinners",
          "Corporate Leadership Conferences",
        ],
        faqs: [
          { q: "Can URPASS handle mega conventions at Bharat Mandapam or Yashobhoomi?", a: "Yes. The platform easily scales across dozens of scanning lanes with sub-second verification and real-time cloud sync." },
          { q: "Does URPASS provide GST invoices for corporate clients in Delhi NCR?", a: "Yes. Detailed GST invoices with your organization's tax ID are generated automatically in the billing dashboard." },
          { q: "Can Delhi university fests prevent gate crashing and duplicate passes?", a: "Yes. Single-use QR tokens ensure each pass can only enter once; duplicate attempts trigger an immediate red alert." },
          { q: "Is URPASS free to start for small Delhi seminars?", a: "Yes. Host 2 events per month with up to 100 registrations per month for ₹0 forever on our free plan." },
        ],
        ctaTitle: "Start your Delhi NCR event with URPASS",
        ctaDescription: "Free plan available · Razorpay UPI payments · Sub-second mobile scanning",
      }}
    />
  );
}
