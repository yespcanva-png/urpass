import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software in Coimbatore",
  description: "Organizing a college fest, conference, workshop or corporate event in Coimbatore? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
  keywords: [
    "event registration software coimbatore",
    "event registration software India",
    "QR event check-in Coimbatore",
    "college event passes Coimbatore",
    "event ticketing platform Coimbatore",
    "Razorpay event ticketing",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-coimbatore" },
  openGraph: {
    title: "Event Registration & QR Check-In Software in Coimbatore | URPASS",
    description: "Organizing a college fest, conference, workshop or corporate event in Coimbatore? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
    url: "https://urpass.space/event-registration-software-coimbatore",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "TN",
    "geo.placename": "Coimbatore",
    "geo.position": "11.0168;76.9558",
    "ICBM": "11.0168, 76.9558",
  },
};

export default function LocationPage() {
  return (
    <SEOPage
      config={{
        badge: "COIMBATORE COLLEGES & WORKSHOPS",
        h1: "Event Registration & QR Check-In Software in Coimbatore",
        canonicalUrl: "https://urpass.space/event-registration-software-coimbatore",
        geo: {
          region: "TN",
          placename: "Coimbatore",
          position: "11.0168;76.9558",
          latitude: 11.0168,
          longitude: 76.9558,
        },
        description: "Organizing a college fest, conference, workshop or corporate event in Coimbatore? URPASS helps organizers manage online registrations, issue digital QR passes and check attendees in using any phone.",
        ctaLabel: "Start your Coimbatore event free",
        features: [
          { icon: MapPin, title: "Built for Coimbatore Events", desc: "Local INR pricing, Razorpay payment gateway integration, and native support for Coimbatore colleges, conferences, fests, and corporate summits." },
          { icon: Ticket, title: "UPI & Online Ticketing", desc: "Accept payments via Google Pay, PhonePe, Paytm, net banking, and cards with zero per-ticket platform commission fees." },
          { icon: QrCode, title: "Instant Digital Passes", desc: "Approved registrants automatically receive a unique digital QR pass — no physical printing or lost paper tickets." },
          { icon: ScanLine, title: "Sub-0.3s Door Scanning", desc: "Scan attendee passes at Coimbatore venue entrances using any smartphone or tablet browser without renting hardware." },
          { icon: Users, title: "Attendee Management", desc: "Review, approve, search, and manage participant registrations from anywhere in Coimbatore on one central dashboard." },
          { icon: BarChart3, title: "Live Gate Analytics", desc: "Track attendance and check-in velocity live as guests arrive, with one-click export to CSV for institutional audits." },
        ],
        callout: {
          badge: "POPULAR COIMBATORE VENUES",
          title: "Trusted across venues in Coimbatore and Tamil Nadu.",
          description: "Engineered for high-volume crowds across CODISSIA Trade Fair Complex, Avinashi Road, Peelamedu, and Saravanampatti IT Park. URPASS eliminates entrance bottlenecks and duplicate pass fraud.",
          bullets: [
            "Local INR pricing with GST compliant invoices",
            "Zero per-ticket percentage cuts on ticket revenue",
            "Instant duplicate pass lockout across all entrance gates",
            "Permanent free tier available for up to 100 attendees per month"
          ],
        },
        useCases: [
          "Technical Paper Presentations",
          "Automotive & Industrial Expos",
          "College Culturals",
          "Manufacturing Summits",
          "Campus Placement Drives",
        ],
        faqs: [
          { q: "Is URPASS suitable for engineering colleges in Coimbatore?", a: "Yes. Leading engineering institutions use URPASS to run technical symposiums, paper presentations, and cultural fests with digital gate verification." },
          { q: "Can trade expos at CODISSIA use URPASS for visitor badges?", a: "Yes. Generate printable and mobile QR badges for industrial buyers and scan attendees at exhibition turnstiles." },
          { q: "Can student volunteers scan passes on their own phones?", a: "Yes. Volunteers open the scanner in their mobile browser with PIN protection — no app downloads required." },
          { q: "Is URPASS free for department workshops in Coimbatore?", a: "Yes. Events with up to 100 participants can use our permanent free tier at ₹0 forever." },
        ],
        ctaTitle: "Start your Coimbatore event with URPASS",
        ctaDescription: "Free plan available · Razorpay UPI payments · Sub-second mobile scanning",
      }}
    />
  );
}
