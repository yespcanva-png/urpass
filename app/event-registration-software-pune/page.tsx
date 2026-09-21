import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Pune",
  description: "Organizing a college fest, conference, workshop or corporate event in Pune? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
  keywords: [
    "event registration software pune",
    "event registration software India",
    "QR event check-in Pune",
    "college event passes Pune",
    "event ticketing platform Pune",
    "Razorpay event ticketing",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-pune" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Pune | URPASS",
    description: "Organizing a college fest, conference, workshop or corporate event in Pune? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
    url: "https://urpass.space/event-registration-software-pune",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "MH",
    "geo.placename": "Pune",
    "geo.position": "18.5204;73.8567",
    "ICBM": "18.5204, 73.8567",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "PUNE STUDENT & TECH FESTS",
        h1: "Event Registration & QR Check-In Software in Pune",
        canonicalUrl: "https://urpass.space/event-registration-software-pune",
        geo: {
          region: "MH",
          placename: "Pune",
          position: "18.5204;73.8567",
          latitude: 18.5204,
          longitude: 73.8567,
        },
        description: "Organizing a college fest, conference, workshop or corporate event in Pune? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
        ctaLabel: "Start your Pune event free",
        features: [
          { icon: MapPin, title: "Built for Pune Events", desc: "Local INR pricing, Razorpay payment gateway integration, and native support for Pune colleges, conferences, fests, and corporate summits." },
          { icon: Ticket, title: "UPI & Online Ticketing", desc: "Accept payments via Google Pay, PhonePe, Paytm, net banking, and cards with zero per-ticket platform commission fees." },
          { icon: QrCode, title: "Instant Digital Passes", desc: "Approved registrants automatically receive a unique digital QR pass — no physical printing or lost paper tickets." },
          { icon: ScanLine, title: "Sub-0.3s Door Scanning", desc: "Scan attendee passes at Pune venue entrances using any smartphone or tablet browser without renting hardware." },
          { icon: Users, title: "Attendee Management", desc: "Review, approve, search, and manage participant registrations from anywhere in Pune on one central dashboard." },
          { icon: BarChart3, title: "Live Gate Analytics", desc: "Track attendance and check-in velocity live as guests arrive, with one-click export to CSV for institutional audits." },
        ],
        callout: {
          badge: "POPULAR PUNE VENUES",
          title: "Trusted across venues in Pune and Maharashtra.",
          description: "Engineered for high-volume crowds across Hinjawadi IT Park, Magarpatta City, Shivaji Nagar, Viman Nagar, and Auto Cluster Chinchwad. URPASS eliminates entrance bottlenecks and duplicate pass fraud.",
          bullets: [
            "Local INR pricing with GST compliant invoices",
            "Zero per-ticket percentage cuts on ticket revenue",
            "Instant duplicate pass lockout across all entrance gates",
            "Permanent free tier available for up to 100 attendees per month"
          ],
        },
        useCases: [
          "Engineering College Fests",
          "Automotive Technology Meets",
          "Hackathons & Codefests",
          "University Youth Festivals",
          "IT Department Seminars",
        ],
        faqs: [
          { q: "Why do Pune engineering colleges choose URPASS for fests?", a: "URPASS eliminates paper lists and proxy sign-ins by issuing cryptographically verified QR passes scanned at gates in under 0.3s." },
          { q: "Can we run hackathons in Hinjawadi with late-night re-entry?", a: "Yes. Hackers use their digital pass for seamless door entry and late-night security validation." },
          { q: "Can student volunteers scan passes with their own phones?", a: "Yes. Volunteers open the scanner URL in their phone browser with zero app installation." },
          { q: "Can organizers accept UPI payments for Pune workshops?", a: "Yes. Seamless Razorpay integration enables instant UPI, card, and net banking settlements." },
        ],
        ctaTitle: "Start your Pune event with URPASS",
        ctaDescription: "Free plan available · Razorpay UPI payments · Sub-second mobile scanning",
      }}
    />
  );
}
