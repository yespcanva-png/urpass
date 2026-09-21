import type { Metadata } from "next";
import { MapPin, GraduationCap, QrCode, ScanLine, Ticket, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Chennai",
  description: "URPASS event registration and QR check-in platform for Chennai. Trusted by colleges, tech companies, and event organisers across Chennai and Tamil Nadu. Free to start.",
  keywords: [
    "event registration Chennai",
    "QR check-in Chennai",
    "college fest passes Chennai",
    "IIT Madras events registration",
    "Anna University event passes",
    "event management software Tamil Nadu",
    "Razorpay event ticketing Chennai",
  ],
  alternates: { canonical: "https://urpass.space/in/chennai" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Chennai | URPASS",
    description: "Chennai's event registration and QR pass platform for colleges, corporates, and communities.",
    url: "https://urpass.space/in/chennai",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Chennai, Tamil Nadu, India",
    "geo.position": "13.0827;80.2707",
    "ICBM": "13.0827, 80.2707",
  },
};

export default function ChennaiPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · CHENNAI",
        h1: "Event Registration & QR Check-In for Chennai Events",
        canonicalUrl: "https://urpass.space/in/chennai",
        geo: {
          region: "IN-TN",
          placename: "Chennai, Tamil Nadu, India",
          position: "13.0827;80.2707",
          latitude: 13.0827,
          longitude: 80.2707,
        },
        description: "Trusted by college organisers, tech event teams, and corporate event managers across Chennai and Tamil Nadu. Digital QR passes, Razorpay payments, and real-time check-in.",
        ctaLabel: "Start your Chennai event",
        features: [
          { icon: GraduationCap, title: "Chennai college events", desc: "Run registration and QR check-in for IIT Madras, Anna University, SRM, VIT, and other Chennai college events." },
          { icon: MapPin, title: "Built for Tamil Nadu", desc: "Used by event organisers across Chennai, Coimbatore, and Tamil Nadu. INR pricing with Razorpay." },
          { icon: Ticket, title: "Paid and free events", desc: "Accept Razorpay payments for paid events or run free events at zero cost." },
          { icon: QrCode, title: "Digital QR passes", desc: "Issue unique digital QR passes instantly to every approved attendee." },
          { icon: ScanLine, title: "QR check-in at venue", desc: "Any Chennai event venue — scan attendee passes with any smartphone. No hardware." },
          { icon: Users, title: "Full attendee management", desc: "Manage registrations, approvals, and check-ins for your Chennai event from one dashboard." },
        ],
        callout: {
          badge: "CHENNAI EVENTS",
          title: "From college fests to corporate events.",
          description: "Chennai has a vibrant event ecosystem — from Anna University symposiums to OMR tech meetups to Nungambakkam corporate conferences. URPASS is built for all of them.",
          bullets: [
            "College fests and symposiums",
            "Tech meetups and hackathons",
            "Corporate and startup events",
            "Community and cultural events",
          ],
        },
        useCases: [
          "IIT Madras events", "Anna University symposiums", "SRM college fests", "Chennai hackathons",
          "OMR tech meetups", "T. Nagar corporate events", "Guindy workshops", "Chennai AI events",
        ],
        faqs: [
          { q: "Is URPASS used by Chennai colleges?", a: "Yes. URPASS is used by event organisers at colleges across Chennai and Tamil Nadu for registration, QR passes, and check-in." },
          { q: "Can I use URPASS for a Chennai corporate event?", a: "Yes. Corporate events, product launches, and company offsites in Chennai can be managed on URPASS with branded passes on the Pro plan." },
          { q: "Does URPASS support Tamil language events?", a: "URPASS currently operates in English. Event names and descriptions can be in any language." },
          { q: "Is URPASS free for Chennai events?", a: "Yes. The free plan is available for all Chennai organisers — 1 event, 50 attendees, full QR check-in, no credit card required." },
          { q: "Can I use Razorpay for Chennai event payments?", a: "Yes. Razorpay integration supports all payment methods popular in Chennai — UPI, credit/debit card, and net banking." },
          { q: "What types of Chennai events use URPASS?", a: "College workshops, hackathons, cultural fests, tech conferences, corporate events, and community meetups across Chennai use URPASS." },
        ],
        ctaTitle: "Start your Chennai event on URPASS",
        ctaDescription: "Used across Chennai · Free to start · QR passes · Razorpay payments",
      }}
    />
  );
}
