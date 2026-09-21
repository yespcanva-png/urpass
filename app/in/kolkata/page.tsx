import type { Metadata } from "next";
import { GraduationCap, MapPin, QrCode, ScanLine, Ticket, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Kolkata",
  description: "URPASS event registration, digital passes, and QR check-in platform for Kolkata and West Bengal. Ideal for college fests, tech symposiums, cultural gatherings, and conferences.",
  keywords: [
    "event registration Kolkata",
    "QR check-in Kolkata",
    "Kolkata college fests passes",
    "Jadavpur University events registration",
    "IIT Kharagpur fest ticketing",
    "Kolkata tech meetups pass",
  ],
  alternates: { canonical: "https://urpass.space/in/kolkata" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Kolkata | URPASS",
    description: "Kolkata event registration and QR pass platform for colleges, culture, and tech conferences.",
    url: "https://urpass.space/in/kolkata",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-WB",
    "geo.placename": "Kolkata, West Bengal, India",
    "geo.position": "22.5726;88.3639",
    "ICBM": "22.5726, 88.3639",
  },
};

export default function KolkataPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · KOLKATA",
        h1: "Event Registration & QR Check-In for Kolkata Events",
        canonicalUrl: "https://urpass.space/in/kolkata",
        geo: {
          region: "IN-WB",
          placename: "Kolkata, West Bengal, India",
          position: "22.5726;88.3639",
          latitude: 22.5726,
          longitude: 88.3639,
        },
        description: "Trusted by college fest organizers, tech communities, and cultural coordinators across Kolkata and Salt Lake Sector V. Digital passes, Razorpay ticketing, and real-time gate entry.",
        ctaLabel: "Start your Kolkata event",
        features: [
          { icon: GraduationCap, title: "Kolkata college events", desc: "For Jadavpur University, St. Xavier's, Presidency, and West Bengal colleges running major campus events." },
          { icon: MapPin, title: "Salt Lake & New Town Tech", desc: "Built for developer conferences, IT meetups, and startup forums across Salt Lake and Rajarhat." },
          { icon: Ticket, title: "Razorpay Indian ticketing", desc: "Accept payments via UPI, RuPay, cards, and net banking with automatic ticket delivery to email." },
          { icon: QrCode, title: "Designer event passes", desc: "Modern digital passes with your university or company logo, custom colors, and unique QR codes." },
          { icon: ScanLine, title: "Fast entrance check-in", desc: "Check in hundreds of attendees per minute at entry gates using standard mobile phones." },
          { icon: Users, title: "Comprehensive attendee control", desc: "Track VIPs, speaker badges, general admission, and duplicate entries on one live dashboard." },
        ],
        callout: {
          badge: "KOLKATA CULTURE & TECH",
          title: "Engineered for high-volume campus and cultural fests.",
          description: "Whether running a 2,000-attendee college cultural festival or a private corporate workshop, URPASS ensures attendees enter quickly without queue bottlenecks.",
          bullets: [
            "Seamless entry for Jadavpur, Xavier's & Calcutta colleges",
            "Salt Lake Sector V corporate and startup summits",
            "Anti-fraud QR pass validation with duplicate lock",
            "Live check-in progress dashboard with instant CSV export",
          ],
        },
        useCases: [
          "Kolkata college fests", "Salt Lake tech talks", "Cultural conventions", "Jadavpur symposiums",
          "Kolkata hackathons", "Literary and art fests", "Corporate workshops", "Music and stage events",
        ],
        faqs: [
          { q: "Is URPASS suitable for large college fests in Kolkata?", a: "Yes. URPASS easily manages thousands of registrations with real-time capacity monitoring and fast entry scanning." },
          { q: "Can we issue free passes for student registrations in Kolkata?", a: "Yes. You can run completely free registration events where students register and receive their pass without paying fees." },
          { q: "Can multiple volunteers scan tickets at different entrance gates?", a: "Yes. Unlimited team members can scan simultaneously using their phones, with automatic real-time sync preventing duplicate entry." },
          { q: "Does URPASS support Razorpay for paid registrations?", a: "Yes. Organizers can connect Razorpay to collect registration fees directly into their Indian bank account." },
        ],
        ctaTitle: "Start your Kolkata event on URPASS today",
        ctaDescription: "Free tier available · Instant QR check-in · Built for West Bengal",
      }}
    />
  );
}
