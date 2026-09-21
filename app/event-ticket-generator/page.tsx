import type { Metadata } from "next";
import { CheckCircle2, Ticket, QrCode, CreditCard, ScanLine, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticket Generator & Online QR Ticketing",
  description: "Generate branded event tickets online with unique QR codes. Sell paid tickets via Razorpay or issue free passes with browser-based door verification.",
  keywords: [
    "event ticket generator",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-ticket-generator" },
  openGraph: {
    title: "Event Ticket Generator & Online QR Ticketing | URPASS",
    description: "Generate branded event tickets online with unique QR codes. Sell paid tickets via Razorpay or issue free passes with browser-based door verification.",
    url: "https://urpass.space/event-ticket-generator",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT TICKET GENERATOR",
        h1: "Event Ticket Generator with Instant QR Code Issuance",
        canonicalUrl: "https://urpass.space/event-ticket-generator",
        description: "Generate branded event tickets online with unique QR codes. Sell paid tickets via Razorpay or issue free passes with browser-based door verification.",
        ctaLabel: "Generate tickets free",
        features: [
          { icon: Ticket, title: "Instant QR Ticket Issuance", desc: "Generate unique digital tickets with scannable QR tokens automatically upon registration or payment." },
          { icon: QrCode, title: "Multiple Ticket Classes", desc: "Configure General Admission, Early Bird, VIP, and Student tickets with custom pricing and quotas." },
          { icon: CreditCard, title: "Razorpay INR Payments", desc: "Sell paid tickets online via UPI, debit/credit cards, and net banking with direct bank settlements." },
          { icon: ScanLine, title: "Zero Ticket Commissions", desc: "Keep 100% of your ticket revenue without paying 3% to 10% platform cuts per transaction." },
          { icon: Users, title: "Anti-Fraud Security", desc: "Single-use QR tokens ensure that tickets cannot be photocopied, shared, or redeemed twice." },
          { icon: BarChart3, title: "Mobile Gate Scanner", desc: "Check in ticket holders in under 0.3 seconds using standard phone cameras at event entrances." },
        ],
        steps: [
          { n: "01", title: "Set Ticket Tiers", desc: "Specify ticket names, prices (free or paid in INR), and availability caps." },
          { n: "02", title: "Share Public Link", desc: "Share your branded ticketing link on social channels, websites, or email." },
          { n: "03", title: "Automated Issuance", desc: "Tickets with encrypted QR tokens are delivered immediately upon booking." },
          { n: "04", title: "Door Validation", desc: "Staff scan tickets with mobile browsers for instant valid/duplicate checks." },
          { n: "05", title: "Track Sales & Entry", desc: "Monitor ticket revenue, check-in rates, and attendee logs in real time." },
        ],
        callout: {
          badge: "TICKETING FREEDOM",
          title: "Generate tickets without high platform commissions.",
          description: "Legacy ticketing sites take large cuts from every ticket you sell. URPASS offers flat monthly plans with zero per-ticket commission, letting you keep your revenue.",
          bullets: [
            "Zero per-ticket percentage commission fees",
            "Native UPI payments via Razorpay (GPay, PhonePe, Paytm)",
            "Instant automated ticket generation on booking",
            "Real-time sales dashboard and attendee analytics",
          ],
        },
        useCases: [
          "Music Concerts & Culturals",
          "College Fest Workshops",
          "Tech Conferences",
          "Comedy Nights & Shows",
          "Fundraisers & Charity Galas",
          "Sports Tournaments",
        ],
        faqs: [
          { q: "Does URPASS take a percentage cut of my ticket sales?", a: "No. URPASS charges zero per-ticket platform fees. You only pay standard Razorpay processing fees and your flat subscription tier." },
          { q: "How do ticket holders present their tickets?", a: "Ticket holders open their digital ticket URL on any smartphone screen or save it to Apple Wallet. Volunteers scan the QR directly from the screen." },
          { q: "Can I generate free tickets?", a: "Yes. You can create free events and tickets with ₹0 pricing on our free plan." },
          { q: "Can attendees download their ticket as a PDF?", a: "Yes. The digital ticket interface includes options to save or print clean PDF passes." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
