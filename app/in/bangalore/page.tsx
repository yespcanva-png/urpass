import type { Metadata } from "next";
import { MapPin, Cpu, QrCode, ScanLine, Ticket, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Bangalore",
  description: "URPASS event registration and QR check-in platform for Bangalore. For tech meetups, startup events, corporate conferences, and college events. Free to start.",
  keywords: [
    "event registration Bangalore",
    "QR check-in Bangalore",
    "Bangalore tech events pass",
    "startup event ticketing Bangalore",
    "college event passes Bangalore",
    "event management software Karnataka",
    "Razorpay event ticketing Bangalore",
  ],
  alternates: { canonical: "https://urpass.space/in/bangalore" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Bangalore | URPASS",
    description: "Bangalore's event registration and QR pass platform. Built for tech events, startups, and colleges.",
    url: "https://urpass.space/in/bangalore",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangalorePage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · BANGALORE",
        h1: "Event Registration & QR Check-In for Bangalore Events",
        canonicalUrl: "https://urpass.space/in/bangalore",
        geo: {
          region: "IN-KA",
          placename: "Bengaluru, Karnataka, India",
          position: "12.9716;77.5946",
          latitude: 12.9716,
          longitude: 77.5946,
        },
        description: "Engineered for Bangalore's tech community, startups, and college event organisers. Digital QR passes, Razorpay payments, and real-time check-in for every type of Bangalore event.",
        ctaLabel: "Start your Bangalore event",
        features: [
          { icon: Cpu, title: "Bangalore tech events", desc: "Built for Bangalore's tech ecosystem — developer meetups, startup events, AI/ML conferences, and hackathons." },
          { icon: MapPin, title: "Built for Karnataka", desc: "Engineered for event organisers across Bangalore, Mysore, and Karnataka. INR pricing with Razorpay." },
          { icon: Ticket, title: "Paid and free events", desc: "Accept Razorpay payments for paid events or run free events at zero cost." },
          { icon: QrCode, title: "Digital QR passes", desc: "Unique digital QR passes issued instantly to every approved attendee." },
          { icon: ScanLine, title: "QR check-in at venue", desc: "Scan attendee passes at any Bangalore venue using any smartphone. No hardware." },
          { icon: Users, title: "Attendee management", desc: "Manage registrations, approvals, and check-ins from one dashboard." },
        ],
        callout: {
          badge: "BANGALORE EVENTS",
          title: "For Bangalore's startup and tech community.",
          description: "From Koramangala startup meetups to Whitefield corporate events to Electronic City tech conferences — URPASS handles the registration and entry flow.",
          bullets: [
            "Developer meetups and hackathons",
            "Startup pitch events and demos",
            "College fests and technical symposiums",
            "Corporate events in Whitefield and Koramangala",
          ],
        },
        useCases: [
          "Bangalore hackathons", "Startup pitch events", "Engineering college symposiums", "Developer meetups",
          "Koramangala tech talks", "HSR Layout events", "Whitefield corporate events", "AI Bangalore conferences",
        ],
        faqs: [
          { q: "Can Bangalore event organisers use URPASS?", a: "Yes. URPASS is designed for tech event organisers, startups, and colleges across Bangalore for registration, QR passes, and gate check-in." },
          { q: "Can I use URPASS for a Bangalore startup event?", a: "Yes. URPASS is ideal for Bangalore startup pitch events, demo days, and founder meetups — with both free and paid event support." },
          { q: "Does URPASS support large Bangalore conferences?", a: "Yes. The Pro and Business plans support 2,500 to 10,000 registrations/month — suitable for large Bangalore tech conferences." },
          { q: "Is there a free plan for Bangalore events?", a: "Yes. Free plan with 2 events/month and 100 registrations/month — no credit card required. Perfect for Bangalore community meetups. Paid plans include a 30-day free trial." },
          { q: "Which Bangalore payment methods does URPASS support?", a: "Razorpay integration supports UPI, cards, net banking, and wallets — all the payment methods Bangalore attendees prefer." },
          { q: "Can I use URPASS for Bangalore college events?", a: "Yes. URPASS is designed for campus events, department symposiums, hackathons, and student clubs across Bangalore colleges and universities." },
        ],
        ctaTitle: "Start your Bangalore event on URPASS",
        ctaDescription: "Engineered for Bangalore · Free to start · Tech events · Razorpay",
      }}
    />
  );
}
