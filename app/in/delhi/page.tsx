import type { Metadata } from "next";
import { MapPin, Building2, QrCode, ScanLine, Ticket, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Delhi",
  description: "URPASS event registration and QR check-in for Delhi NCR. For corporate events, tech meetups, college events, and conferences across Delhi, Noida, and Gurugram. Free to start.",
  keywords: [
    "event registration Delhi",
    "QR check-in Delhi NCR",
    "Noida event passes",
    "Gurugram corporate event registration",
    "Delhi University event passes",
    "IIT Delhi events check-in",
    "event ticketing software Delhi",
  ],
  alternates: { canonical: "https://urpass.space/in/delhi" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Delhi | URPASS",
    description: "Delhi NCR event registration and QR pass platform for colleges, corporates, and tech events.",
    url: "https://urpass.space/in/delhi",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-DL",
    "geo.placename": "New Delhi, Delhi NCR, India",
    "geo.position": "28.6139;77.2090",
    "ICBM": "28.6139, 77.2090",
  },
};

export default function DelhiPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · DELHI NCR",
        h1: "Event Registration & QR Check-In for Delhi Events",
        canonicalUrl: "https://urpass.space/in/delhi",
        geo: {
          region: "IN-DL",
          placename: "New Delhi, Delhi NCR, India",
          position: "28.6139;77.2090",
          latitude: 28.6139,
          longitude: 77.2090,
        },
        description: "Used by Delhi NCR's corporate event teams, college organisers, and startup community. Online registration, digital QR passes, and check-in for any Delhi event.",
        ctaLabel: "Start your Delhi event",
        features: [
          { icon: Building2, title: "Delhi corporate events", desc: "For Connaught Place, Gurugram, and Noida corporate events with professional branding." },
          { icon: MapPin, title: "Delhi NCR coverage", desc: "INR pricing and Razorpay for events across Delhi, Noida, Gurugram, and Faridabad." },
          { icon: Ticket, title: "Free and paid events", desc: "Collect ticket fees or run free registrations — Razorpay for INR payments." },
          { icon: QrCode, title: "Digital QR passes", desc: "Unique digital QR passes issued immediately to every approved attendee." },
          { icon: ScanLine, title: "QR scanning at venue", desc: "Scan passes at any Delhi NCR venue using any smartphone." },
          { icon: Users, title: "Attendee management", desc: "View, approve, and track attendees from your dashboard." },
        ],
        callout: {
          badge: "DELHI NCR EVENTS",
          title: "From IIT Delhi to Cyber City Gurugram.",
          description: "Delhi NCR hosts a massive range of events — from IIT Delhi hackathons to DLF Cyber City corporate conferences to Connaught Place community meetups. URPASS handles all of them.",
          bullets: [
            "IIT Delhi and DTU college events",
            "Gurugram and Noida corporate events",
            "Delhi startup and tech meetups",
            "Community events across NCR",
          ],
        },
        useCases: [
          "IIT Delhi hackathons", "Gurugram corporate events", "Noida tech meetups", "DTU events",
          "Connaught Place events", "Nehru Place tech events", "Delhi startup events", "NCR conferences",
        ],
        faqs: [
          { q: "Is URPASS used in Delhi NCR?", a: "Yes. URPASS is used by Delhi NCR event organisers for college events, corporate conferences, and startup meetups." },
          { q: "Can I use URPASS for Gurugram or Noida events?", a: "Yes. URPASS works for any event in the Delhi NCR region — Delhi, Gurugram, Noida, Faridabad, and Ghaziabad." },
          { q: "Is there a free plan for Delhi events?", a: "Yes. Free plan with 1 event and 50 attendees — no credit card required." },
          { q: "Can I brand passes for a Delhi corporate event?", a: "Yes. Pro plan includes custom branding — company name, logo, and brand colour on every pass." },
          { q: "What payment methods work for Delhi events?", a: "Razorpay supports UPI, cards, Paytm, PhonePe, and net banking — popular across Delhi NCR." },
          { q: "Can I manage a large Delhi conference on URPASS?", a: "Yes. Pro plan supports up to 2,000 attendees per event." },
        ],
        ctaTitle: "Run your Delhi event with URPASS",
        ctaDescription: "IIT Delhi to Cyber City · Free to start · Professional QR passes",
      }}
    />
  );
}
