import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Kochi Kerala",
  description: "Organizing a college fest, conference, workshop or corporate event in Kochi? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
  keywords: [
    "event registration software kochi",
    "event registration software India",
    "QR event check-in Kochi",
    "college event passes Kochi",
    "event ticketing platform Kochi",
    "Razorpay event ticketing",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-kochi" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Kochi Kerala | URPASS",
    description: "Organizing a college fest, conference, workshop or corporate event in Kochi? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
    url: "https://urpass.space/event-registration-software-kochi",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "KL",
    "geo.placename": "Kochi",
    "geo.position": "9.9312;76.2673",
    "ICBM": "9.9312, 76.2673",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "KOCHI STARTUPS & CREATOR FESTS",
        h1: "Event Registration & QR Check-In Software in Kochi",
        canonicalUrl: "https://urpass.space/event-registration-software-kochi",
        geo: {
          region: "KL",
          placename: "Kochi",
          position: "9.9312;76.2673",
          latitude: 9.9312,
          longitude: 76.2673,
        },
        description: "Organizing a college fest, conference, workshop or corporate event in Kochi? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
        ctaLabel: "Start your Kochi event free",
        features: [
          { icon: MapPin, title: "Built for Kochi Events", desc: "Local INR pricing, Razorpay payment gateway integration, and native support for Kochi colleges, conferences, fests, and corporate summits." },
          { icon: Ticket, title: "UPI & Online Ticketing", desc: "Accept payments via Google Pay, PhonePe, Paytm, net banking, and cards with zero per-ticket platform commission fees." },
          { icon: QrCode, title: "Instant Digital Passes", desc: "Approved registrants automatically receive a unique digital QR pass — no physical printing or lost paper tickets." },
          { icon: ScanLine, title: "Sub-0.3s Door Scanning", desc: "Scan attendee passes at Kochi venue entrances using any smartphone or tablet browser without renting hardware." },
          { icon: Users, title: "Attendee Management", desc: "Review, approve, search, and manage participant registrations from anywhere in Kochi on one central dashboard." },
          { icon: BarChart3, title: "Live Gate Analytics", desc: "Track attendance and check-in velocity live as guests arrive, with one-click export to CSV for institutional audits." },
        ],
        callout: {
          badge: "POPULAR KOCHI VENUES",
          title: "Trusted across venues in Kochi and Kerala.",
          description: "Engineered for high-volume crowds across Infopark Kakkanad, Kerala Startup Mission (KSUM), Marine Drive, CUSAT Campus, and Bolgatty Palace. URPASS eliminates entrance bottlenecks and duplicate pass fraud.",
          bullets: [
            "Local INR pricing with GST compliant invoices",
            "Zero per-ticket percentage cuts on ticket revenue",
            "Instant duplicate pass lockout across all entrance gates",
            "Permanent free tier available for up to 100 attendees per month"
          ],
        },
        useCases: [
          "Creator & Media Summits",
          "Startup Pitch Competitions",
          "Campus Cultural Fests",
          "Technology Workshops",
          "Art & Literature Gatherings",
        ],
        faqs: [
          { q: "Can Kochi startup events use URPASS for demo days?", a: "Yes. Curate founder and investor RSVPs, issue digital badges, and verify guests at the entrance in under 0.3s." },
          { q: "Can Kerala colleges use URPASS for inter-college fests?", a: "Yes. Manage student roll numbers, cap workshop seats, and scan passes at campus gates with any smartphone." },
          { q: "Can organizers accept ticket payments via UPI in Kochi?", a: "Yes. Built-in Razorpay integration enables instant ticket sales through GPay, PhonePe, Paytm, and net banking." },
          { q: "Is URPASS free for community meetups in Kochi?", a: "Yes. Community meetups with up to 100 attendees can use our permanent free tier at ₹0 forever." },
        ],
        ctaTitle: "Start your Kochi event with URPASS",
        ctaDescription: "Free plan available · Razorpay UPI payments · Sub-second mobile scanning",
      }}
    />
  );
}
