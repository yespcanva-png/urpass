import type { Metadata } from "next";
import { MapPin, QrCode, Users, ScanLine, Ticket, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software India",
  description: "URPASS is an event registration, ticketing, and QR check-in platform built for India. Trusted by colleges, startups, and event organisers across Chennai, Bangalore, Mumbai, and beyond.",
  keywords: [
    "event registration software India",
    "QR event check-in India",
    "event ticketing platform India",
    "Razorpay event ticketing",
    "college event passes India",
    "digital ticket generator India",
    "event attendance tracking India",
  ],
  alternates: { canonical: "https://urpass.space/in" },
  openGraph: {
    title: "Event Registration & QR Check-In Software India | URPASS",
    description: "India's event registration and QR check-in platform. Built for Indian events. Free to start.",
    url: "https://urpass.space/in",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

export default function IndiaPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS INDIA",
        h1: "Event Registration & QR Check-In Platform for India",
        canonicalUrl: "https://urpass.space/in",
        geo: {
          region: "IN",
          placename: "India",
          position: "20.5937;78.9629",
          latitude: 20.5937,
          longitude: 78.9629,
        },
        description: "URPASS is built for Indian event organisers. Handle event registrations, issue digital QR passes, accept Razorpay payments, and check in attendees — in INR, for India.",
        ctaLabel: "Start free in India",
        features: [
          { icon: MapPin, title: "Built for India", desc: "INR pricing, Razorpay payment integration, and support for Indian event types — colleges, conferences, fests, and meetups." },
          { icon: Ticket, title: "Razorpay ticketing", desc: "Accept ticket payments via UPI, credit/debit card, net banking, and wallets. All standard Indian payment methods." },
          { icon: QrCode, title: "Digital QR passes", desc: "Issue unique digital QR passes to every attendee. No printing, no physical tickets." },
          { icon: ScanLine, title: "QR entry scanning", desc: "Scan attendee passes at the event entrance using any phone. No dedicated scanner hardware." },
          { icon: Users, title: "Attendee management", desc: "Manage registrations, approvals, and check-ins from one dashboard — from anywhere in India." },
          { icon: BarChart3, title: "Real-time check-in dashboard", desc: "Track attendance and check-in rates live. Export data to CSV for reporting." },
        ],
        callout: {
          badge: "MADE IN INDIA",
          title: "Event management software for India.",
          description: "URPASS is trusted by event organisers in Chennai, Bangalore, Coimbatore, Hyderabad, Pune, Mumbai, and Delhi. Designed for how Indian events are run.",
          bullets: [
            "INR pricing — ₹0 to start",
            "Razorpay for Indian payments",
            "College and corporate event support",
            "Works across India — any city, any event",
          ],
        },
        useCases: [
          "College fests — Chennai", "Tech events — Bangalore", "Workshops — Coimbatore",
          "Corporate events — Mumbai", "Hackathons — Hyderabad", "Conferences — Delhi",
          "Community events — Pune", "Campus events — India",
        ],
        faqs: [
          { q: "Is URPASS an Indian event management platform?", a: "Yes. URPASS is an India-focused digital event registration, QR pass and check-in platform for colleges, conferences, hackathons, workshops and corporate events across India with native INR pricing and Razorpay UPI payments." },
          { q: "What payment methods does URPASS support in India?", a: "URPASS uses Razorpay for ticketing payments, supporting instant UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and wallets with zero per-ticket commission fees." },
          { q: "Is URPASS free for Indian users?", a: "Yes. The free plan is permanently available to all Indian organizers — 2 events/month, 100 registrations/month, full QR check-in, no credit card required." },
          { q: "Which Indian cities use URPASS?", a: "URPASS is used by event organisers in Chennai, Bangalore, Coimbatore, Hyderabad, Pune, Mumbai, Delhi NCR, Kochi, Kolkata, Ahmedabad and across India." },
          { q: "Does URPASS support college events in India?", a: "Yes. URPASS is widely used for Indian college events — workshops, seminars, symposiums, hackathons, cultural fests, and campus department events." },
          { q: "What is the pricing for Indian users?", a: "Free plan: ₹0 forever (2 events/mo, 100 registrations/mo). Starter: ₹499/month (+18% GST). Pro: ₹999/month (+18% GST). Business: ₹2,499/month (+18% GST). All paid plans include a 30-day free trial." },
        ],
        ctaTitle: "Start your event in India today",
        ctaDescription: "₹0 to start · Razorpay UPI payments · Built for India",
      }}
    />
  );
}
