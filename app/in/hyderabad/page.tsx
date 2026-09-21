import type { Metadata } from "next";
import { MapPin, Cpu, QrCode, ScanLine, Ticket, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Hyderabad",
  description: "URPASS event registration and QR check-in for Hyderabad. For tech events, HITEC City meetups, college events, and corporate conferences. Free to start.",
  keywords: [
    "event registration Hyderabad",
    "QR check-in Hyderabad",
    "HITEC city event ticketing",
    "Gachibowli tech meetups pass",
    "IIIT Hyderabad events check-in",
    "Hyderabad college fests software",
  ],
  alternates: { canonical: "https://urpass.space/in/hyderabad" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Hyderabad | URPASS",
    description: "Hyderabad event registration and QR pass platform. Tech, colleges, and corporate events.",
    url: "https://urpass.space/in/hyderabad",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad, Telangana, India",
    "geo.position": "17.3850;78.4867",
    "ICBM": "17.3850, 78.4867",
  },
};

export default function HyderabadPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · HYDERABAD",
        h1: "Event Registration & QR Check-In for Hyderabad",
        canonicalUrl: "https://urpass.space/in/hyderabad",
        geo: {
          region: "IN-TG",
          placename: "Hyderabad, Telangana, India",
          position: "17.3850;78.4867",
          latitude: 17.3850,
          longitude: 78.4867,
        },
        description: "Trusted by Hyderabad's tech community, colleges, and corporate event teams. Manage registrations, issue digital QR passes, and check in attendees with phone-based scanning.",
        ctaLabel: "Start your Hyderabad event",
        features: [
          { icon: Cpu, title: "Hyderabad tech events", desc: "Ideal for HITEC City developer meetups, startup events, and tech conferences." },
          { icon: MapPin, title: "Built for Hyderabad", desc: "INR pricing, Razorpay, and support for Hyderabad's diverse event scene." },
          { icon: Ticket, title: "Free and paid events", desc: "Free events and paid ticketing supported — Razorpay for INR payments." },
          { icon: QrCode, title: "Digital QR passes", desc: "Unique digital QR passes issued to every approved attendee — no printing." },
          { icon: ScanLine, title: "QR scanning at venue", desc: "Scan passes at any Hyderabad venue using any smartphone. No hardware required." },
          { icon: Users, title: "Full attendee management", desc: "Manage registrations and check-ins for your Hyderabad event in one place." },
        ],
        callout: {
          badge: "HYDERABAD EVENTS",
          title: "For Hyderabad's growing event ecosystem.",
          description: "From HITEC City startup events to IIIT Hyderabad hackathons to Jubilee Hills corporate galas — URPASS handles the registration and check-in for any Hyderabad event.",
          bullets: [
            "Tech meetups in HITEC City",
            "College events at IIIT, BITS Pilani Hyderabad",
            "Corporate events in Gachibowli",
            "Community events across Hyderabad",
          ],
        },
        useCases: [
          "HITEC City meetups", "IIIT Hyderabad events", "Gachibowli tech events", "Startup events",
          "Hyderabad hackathons", "College fests Hyderabad", "Corporate seminars", "Community events",
        ],
        faqs: [
          { q: "Is URPASS used in Hyderabad?", a: "Yes. URPASS is used by event organisers in Hyderabad for tech meetups, college events, and corporate conferences." },
          { q: "Can I use URPASS for a HITEC City tech event?", a: "Yes. URPASS is ideal for Hyderabad's tech event ecosystem in HITEC City, Gachibowli, and Madhapur." },
          { q: "Is there a free plan for Hyderabad events?", a: "Yes. Free plan with 1 event, 50 attendees, full QR check-in. No credit card." },
          { q: "Does URPASS support Telangana college events?", a: "Yes. URPASS is used by colleges across Telangana and Andhra Pradesh." },
          { q: "What payment methods work for Hyderabad events?", a: "Razorpay supports UPI, PhonePe, Google Pay, cards, and net banking — all popular in Hyderabad." },
          { q: "Can I run a large Hyderabad conference on URPASS?", a: "Yes. Pro plan supports up to 2,000 attendees per event." },
        ],
        ctaTitle: "Start your Hyderabad event on URPASS",
        ctaDescription: "HITEC City to campus · Free to start · QR check-in",
      }}
    />
  );
}
