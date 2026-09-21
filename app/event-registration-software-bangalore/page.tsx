import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Bangalore",
  description: "Organizing a college fest, conference, workshop or corporate event in Bangalore? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
  keywords: [
    "event registration software bangalore",
    "event registration software India",
    "QR event check-in Bangalore",
    "college event passes Bangalore",
    "event ticketing platform Bangalore",
    "Razorpay event ticketing",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-bangalore" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Bangalore | URPASS",
    description: "Organizing a college fest, conference, workshop or corporate event in Bangalore? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
    url: "https://urpass.space/event-registration-software-bangalore",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "KA",
    "geo.placename": "Bangalore",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "BANGALORE TECH & STARTUP EVENTS",
        h1: "Event Registration & QR Check-In Software in Bangalore",
        canonicalUrl: "https://urpass.space/event-registration-software-bangalore",
        geo: {
          region: "KA",
          placename: "Bangalore",
          position: "12.9716;77.5946",
          latitude: 12.9716,
          longitude: 77.5946,
        },
        description: "Organizing a college fest, conference, workshop or corporate event in Bangalore? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
        ctaLabel: "Start your Bangalore event free",
        features: [
          { icon: MapPin, title: "Built for Bangalore Events", desc: "Local INR pricing, Razorpay payment gateway integration, and native support for Bangalore colleges, conferences, fests, and corporate summits." },
          { icon: Ticket, title: "UPI & Online Ticketing", desc: "Accept payments via Google Pay, PhonePe, Paytm, net banking, and cards with zero per-ticket platform commission fees." },
          { icon: QrCode, title: "Instant Digital Passes", desc: "Approved registrants automatically receive a unique digital QR pass — no physical printing or lost paper tickets." },
          { icon: ScanLine, title: "Sub-0.3s Door Scanning", desc: "Scan attendee passes at Bangalore venue entrances using any smartphone or tablet browser without renting hardware." },
          { icon: Users, title: "Attendee Management", desc: "Review, approve, search, and manage participant registrations from anywhere in Bangalore on one central dashboard." },
          { icon: BarChart3, title: "Live Gate Analytics", desc: "Track attendance and check-in velocity live as guests arrive, with one-click export to CSV for institutional audits." },
        ],
        callout: {
          badge: "POPULAR BANGALORE VENUES",
          title: "Trusted across venues in Bangalore and Karnataka.",
          description: "Engineered for high-volume crowds across Koramangala, Indiranagar, Electronic City, Whitefield, and KTPO Whitefield. URPASS eliminates entrance bottlenecks and duplicate pass fraud.",
          bullets: [
            "Local INR pricing with GST compliant invoices",
            "Zero per-ticket percentage cuts on ticket revenue",
            "Instant duplicate pass lockout across all entrance gates",
            "Permanent free tier available for up to 100 attendees per month"
          ],
        },
        useCases: [
          "AI & Web3 Hackathons",
          "SaaS Developer Summits",
          "College Tech Fests",
          "Startup Demo Days",
          "Engineering Workshops",
        ],
        faqs: [
          { q: "Can Bangalore organizers collect ticket payments in INR via UPI?", a: "Yes. Native Razorpay integration allows Bangalore organizers to accept ticket payments via Google Pay, PhonePe, Paytm, cards, and net banking with zero platform cuts." },
          { q: "How fast is check-in at large Bangalore tech conferences?", a: "Passes verify in under 0.3 seconds directly in mobile phone browsers, eliminating morning keynote foyer queues." },
          { q: "Can we use URPASS for hackathons in Koramangala or HSR Layout?", a: "Yes. URPASS is heavily used for 24h/48h hackathons to manage hacker applications, team QR passes, and late-night re-entry." },
          { q: "Is URPASS free for Bangalore developer meetups?", a: "Yes. Tech communities can host up to 2 meetups per month with 100 developers per month for ₹0 forever on our free plan." },
        ],
        ctaTitle: "Start your Bangalore event with URPASS",
        ctaDescription: "Free plan available · Razorpay UPI payments · Sub-second mobile scanning",
      }}
    />
  );
}
