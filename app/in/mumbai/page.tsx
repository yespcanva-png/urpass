import type { Metadata } from "next";
import { MapPin, Building2, QrCode, ScanLine, Ticket, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Mumbai",
  description: "URPASS event registration and QR check-in for Mumbai. For corporate events, tech meetups, college events, and community gatherings across Mumbai, Navi Mumbai, and Thane.",
  keywords: [
    "event registration Mumbai",
    "QR check-in Mumbai",
    "BKC corporate event ticketing",
    "Powai startup meetups pass",
    "IIT Bombay event passes",
    "Mumbai college fests registration",
    "event management software Maharashtra",
  ],
  alternates: { canonical: "https://urpass.space/in/mumbai" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Mumbai | URPASS",
    description: "Mumbai event registration and QR pass platform for corporate, tech, and college events.",
    url: "https://urpass.space/in/mumbai",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Mumbai, Maharashtra, India",
    "geo.position": "19.0760;72.8777",
    "ICBM": "19.0760, 72.8777",
  },
};

export default function MumbaiPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · MUMBAI",
        h1: "Event Registration & QR Check-In for Mumbai Events",
        canonicalUrl: "https://urpass.space/in/mumbai",
        geo: {
          region: "IN-MH",
          placename: "Mumbai, Maharashtra, India",
          position: "19.0760;72.8777",
          latitude: 19.0760,
          longitude: 72.8777,
        },
        description: "Trusted by Mumbai's corporate event teams, startup community, and college organisers. Online registration, digital QR passes, and fast check-in for any Mumbai event.",
        ctaLabel: "Start your Mumbai event",
        features: [
          { icon: Building2, title: "Mumbai corporate events", desc: "For BKC, Lower Parel, and Powai corporate events — professional registration and branded QR passes." },
          { icon: MapPin, title: "Built for Mumbai", desc: "INR pricing, Razorpay, and support for events across Mumbai, Navi Mumbai, and Thane." },
          { icon: Ticket, title: "Paid and free events", desc: "Collect fees via Razorpay or run free events at zero cost." },
          { icon: QrCode, title: "Digital QR passes", desc: "Unique digital QR passes issued instantly — no printing needed." },
          { icon: ScanLine, title: "Venue QR check-in", desc: "Scan passes at any Mumbai venue using any smartphone. No hardware required." },
          { icon: Users, title: "Attendee management", desc: "Manage registrations, approvals, and check-ins from one dashboard." },
        ],
        callout: {
          badge: "MUMBAI EVENTS",
          title: "From BKC boardrooms to college fests.",
          description: "Mumbai hosts everything from Fortune 500 corporate events to IIT Bombay hackathons to Bandra community meetups. URPASS handles the registration and check-in for all of them.",
          bullets: [
            "Corporate events in BKC and Lower Parel",
            "Tech meetups in Powai and Andheri",
            "College events at IIT Bombay, VJTI, and more",
            "Community events across Mumbai",
          ],
        },
        useCases: [
          "BKC corporate events", "IIT Bombay hackathons", "Powai tech meetups", "Bandra community events",
          "Lower Parel conferences", "Mumbai startup events", "VJTI workshops", "Thane college fests",
        ],
        faqs: [
          { q: "Is URPASS used in Mumbai?", a: "Yes. URPASS is used by Mumbai event organisers across corporate events, college fests, and community gatherings." },
          { q: "Can I use URPASS for a large Mumbai conference?", a: "Yes. Pro plan supports up to 2,000 attendees per event — suitable for large Mumbai conferences." },
          { q: "Is there a free plan for Mumbai events?", a: "Yes. Free plan with 1 event and 50 attendees — no credit card required." },
          { q: "Can I brand passes for my Mumbai company's events?", a: "Yes. Pro plan includes custom branding — company name, logo, and brand colour on every pass." },
          { q: "What payment methods are available for Mumbai events?", a: "Razorpay supports UPI, HDFC/Axis/ICICI cards, Paytm, PhonePe, and net banking — popular in Mumbai." },
          { q: "Can I use URPASS for an event in Navi Mumbai or Thane?", a: "Yes. URPASS works anywhere — the registration link is shared online and scanning works at any venue." },
        ],
        ctaTitle: "Run your Mumbai event with URPASS",
        ctaDescription: "BKC to Bandra · Free to start · Professional QR passes",
      }}
    />
  );
}
