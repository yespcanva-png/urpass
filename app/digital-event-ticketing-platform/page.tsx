import type { Metadata } from "next";
import { Ticket, CreditCard, QrCode, ShieldCheck, Smartphone, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Digital Event Ticketing Platform | URPASS by Yesp Corporation",
  description: "Sell tickets, issue digital QR passes, and verify attendees instantly with URPASS by Yesp Corporation. Zero ticket commission fees, instant payouts, and seamless mobile passes.",
  keywords: [
    "digital event ticketing platform",
    "digital event ticketing",
    "online event ticketing software",
    "QR event ticketing",
    "zero commission ticketing",
    "URPASS ticketing"
  ],
  alternates: { canonical: "https://urpass.space/digital-event-ticketing-platform" },
  openGraph: {
    title: "Digital Event Ticketing Platform | URPASS by Yesp Corporation",
    description: "Sell tickets, issue digital QR passes, and verify attendees instantly with URPASS by Yesp Corporation.",
    url: "https://urpass.space/digital-event-ticketing-platform",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "DIGITAL EVENT TICKETING",
        h1: "Digital Event Ticketing Platform with Zero Commission Fees",
        canonicalUrl: "https://urpass.space/digital-event-ticketing-platform",
        description: "URPASS by Yesp Corporation provides high-speed digital ticketing for college fests, conferences, hackathons, and community gatherings. Eliminate paper tickets and keep 100% of your earnings.",
        ctaLabel: "Start Selling Tickets",
        directAnswer: {
          title: "How does digital event ticketing work with URPASS?",
          summary: "Digital event ticketing with URPASS replaces physical paper tickets and PDF attachments with interactive, cryptographically secured mobile passes. Attendees purchase or register online, receive a dynamic QR pass directly in their smartphone browser, and gain instant entrance via volunteer smartphone cameras.",
          keyPoints: [
            "0% platform commissions on all ticket sales",
            "Direct payment settlement to organizer merchant accounts",
            "Apple Wallet and web-ready digital passes with embedded QR verification",
            "Built-in fraud prevention against duplicate ticket scans and screenshots"
          ]
        },
        features: [
          { icon: Ticket, title: "Custom Ticket Tiers", desc: "Configure Free, Early Bird, General Admission, VIP, or Student passes with distinct pricing and capacity caps." },
          { icon: CreditCard, title: "Direct Payment Integration", desc: "Collect payments directly via UPI, credit/debit cards, and net banking using Razorpay with zero platform surcharges." },
          { icon: QrCode, title: "Instant QR Pass Delivery", desc: "Tickets are generated dynamically with encrypted single-use tokens and sent via email and instant confirmation URLs." },
          { icon: Smartphone, title: "Zero App Download for Guests", desc: "Attendees never need to install an app; passes open instantaneously in Safari, Chrome, or any mobile browser." },
          { icon: ShieldCheck, title: "Fraud-Proof Verification", desc: "Prevent ticket scalping, duplicate entries, and screenshot sharing with instant real-time gate validation." },
          { icon: Zap, title: "0.3s Entrance Check-In", desc: "Scan attendee passes at maximum speed to keep venue queues moving smoothly during peak rush hours." }
        ],
        steps: [
          { n: "01", title: "Create Ticket Types", desc: "Define pricing, quantities, and ticket descriptions for your upcoming event." },
          { n: "02", title: "Share Ticket Link", desc: "Publish your public booking page across social media, WhatsApp, and email lists." },
          { n: "03", title: "Automated Pass Dispatch", desc: "As tickets are purchased, digital QR passes are generated and emailed immediately." },
          { n: "04", title: "Scan at the Entrance", desc: "Check in guests in under 0.3s per scan using standard smartphone cameras." }
        ],
        faqs: [
          { q: "Do you take a cut of my ticket sales?", a: "No. URPASS charges 0% per-ticket commission fees. You only pay standard gateway processing fees to Razorpay." },
          { q: "What happens if an attendee loses their email?", a: "Organizers can look up any attendee by name or email on the live roster and re-issue passes or check them in manually." },
          { q: "Is URPASS suitable for both free and paid tickets?", a: "Yes. You can host 100% free community events or multi-tiered paid conferences seamlessly." }
        ]
      }}
    />
  );
}
