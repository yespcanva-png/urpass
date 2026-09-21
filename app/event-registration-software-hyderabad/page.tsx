import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Hyderabad",
  description: "Organizing a college fest, conference, workshop or corporate event in Hyderabad? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
  keywords: [
    "event registration software hyderabad",
    "event registration software India",
    "QR event check-in Hyderabad",
    "college event passes Hyderabad",
    "event ticketing platform Hyderabad",
    "Razorpay event ticketing",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-hyderabad" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Hyderabad | URPASS",
    description: "Organizing a college fest, conference, workshop or corporate event in Hyderabad? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
    url: "https://urpass.space/event-registration-software-hyderabad",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "TG",
    "geo.placename": "Hyderabad",
    "geo.position": "17.3850;78.4867",
    "ICBM": "17.3850, 78.4867",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "HYDERABAD TECH & HITEC CITY",
        h1: "Event Registration & QR Check-In Software in Hyderabad",
        canonicalUrl: "https://urpass.space/event-registration-software-hyderabad",
        geo: {
          region: "TG",
          placename: "Hyderabad",
          position: "17.3850;78.4867",
          latitude: 17.385,
          longitude: 78.4867,
        },
        description: "Organizing a college fest, conference, workshop or corporate event in Hyderabad? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
        ctaLabel: "Start your Hyderabad event free",
        features: [
          { icon: MapPin, title: "Built for Hyderabad Events", desc: "Local INR pricing, Razorpay payment gateway integration, and native support for Hyderabad colleges, conferences, fests, and corporate summits." },
          { icon: Ticket, title: "UPI & Online Ticketing", desc: "Accept payments via Google Pay, PhonePe, Paytm, net banking, and cards with zero per-ticket platform commission fees." },
          { icon: QrCode, title: "Instant Digital Passes", desc: "Approved registrants automatically receive a unique digital QR pass — no physical printing or lost paper tickets." },
          { icon: ScanLine, title: "Sub-0.3s Door Scanning", desc: "Scan attendee passes at Hyderabad venue entrances using any smartphone or tablet browser without renting hardware." },
          { icon: Users, title: "Attendee Management", desc: "Review, approve, search, and manage participant registrations from anywhere in Hyderabad on one central dashboard." },
          { icon: BarChart3, title: "Live Gate Analytics", desc: "Track attendance and check-in velocity live as guests arrive, with one-click export to CSV for institutional audits." },
        ],
        callout: {
          badge: "POPULAR HYDERABAD VENUES",
          title: "Trusted across venues in Hyderabad and Telangana.",
          description: "Engineered for high-volume crowds across HITEX Exhibition Centre, HICC Madhapur, Gachibowli, Financial District, and Begumpet. URPASS eliminates entrance bottlenecks and duplicate pass fraud.",
          bullets: [
            "Local INR pricing with GST compliant invoices",
            "Zero per-ticket percentage cuts on ticket revenue",
            "Instant duplicate pass lockout across all entrance gates",
            "Permanent free tier available for up to 100 attendees per month"
          ],
        },
        useCases: [
          "Pharma & Biotech Congresses",
          "Software Developer Summits",
          "University Fests",
          "Startup Buildathons",
          "Corporate Annual Meets",
        ],
        faqs: [
          { q: "Can we coordinate multiple entrances at HITEX or HICC?", a: "Yes. URPASS synchronizes scans across all doors in milliseconds, preventing duplicate entry across halls." },
          { q: "Can Hyderabad organizers collect ticket fees in INR?", a: "Yes. Direct Razorpay integration supports all Indian UPI apps, credit/debit cards, and net banking." },
          { q: "How fast is check-in for large crowds in Hyderabad?", a: "Passes verify in under 0.3 seconds per scan, keeping entrance lines moving continuously." },
          { q: "Can we export attendance data for corporate audit records?", a: "Yes. Download complete attendee records with exact entrance timestamps to Excel or CSV at any time." },
        ],
        ctaTitle: "Start your Hyderabad event with URPASS",
        ctaDescription: "Free plan available · Razorpay UPI payments · Sub-second mobile scanning",
      }}
    />
  );
}
