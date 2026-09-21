import type { Metadata } from "next";
import { Gift, Ticket, QrCode, ScanLine, Zap, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Free Event Ticketing & QR Check-In Platform",
  description: "Free event ticketing platform with QR check-in. Issue digital QR tickets for free events. No credit card required. Upgrade to paid ticketing when you're ready.",
  alternates: { canonical: "https://urpass.space/free-event-ticketing" },
  openGraph: {
    title: "Free Event Ticketing & QR Check-In Platform | URPASS",
    description: "Free event ticketing with QR passes and check-in. Start at zero cost.",
    url: "https://urpass.space/free-event-ticketing",
  },
};

export default function FreeEventTicketingPage() {
  return (
    <SEOPage
      config={{
        badge: "FREE EVENT TICKETING",
        h1: "Start Event Ticketing for Free",
        description: "URPASS lets you ticket your events at zero cost — for free events. Issue digital QR tickets to attendees, scan them at the door, and track everything. Upgrade for paid ticketing.",
        ctaLabel: "Start free ticketing",
        features: [
          { icon: Gift, title: "Free tickets included", desc: "Issue unlimited-looking free tickets (within plan capacity) with QR codes at no charge." },
          { icon: Ticket, title: "Ticket type setup", desc: "Create your General Admission or custom ticket type in under 2 minutes." },
          { icon: QrCode, title: "QR ticket generation", desc: "Every registered attendee gets a unique digital QR ticket automatically." },
          { icon: ScanLine, title: "QR scanning included", desc: "QR entry scanning is included in the free plan. Use any phone as a scanner." },
          { icon: Zap, title: "Instant setup", desc: "Create your event and publish your ticketing link in under 5 minutes." },
          { icon: BarChart3, title: "Check-in dashboard", desc: "See real-time check-in data and attendance stats from your free dashboard." },
        ],
        callout: {
          badge: "FREE PLAN",
          title: "Ticket your free event at zero cost.",
          description: "The URPASS free plan is built for free events. Issue digital QR tickets to your first 50 attendees, scan them at the door, and manage the full event lifecycle — at no charge.",
          bullets: [
            "1 active event",
            "Up to 50 attendees",
            "Full QR ticketing included",
            "No credit card required",
          ],
        },
        useCases: [
          "Small workshops", "College events", "Club events", "Community meetups",
          "Local hackathons", "Trial events", "Seminars", "Campus events",
        ],
        faqs: [
          { q: "Is URPASS completely free for free events?", a: "Yes. For events where tickets are free (₹0), the URPASS free plan covers the full flow: registration, QR tickets, and check-in — at zero cost with up to 50 attendees." },
          { q: "Can I use the free plan for paid events too?", a: "No. Collecting payments requires a Starter or Pro subscription. The free plan is for free (₹0) events only." },
          { q: "What is the difference between a free ticket and a paid ticket in URPASS?", a: "A free ticket is a ₹0 registration where the attendee applies and gets a QR pass on approval. A paid ticket requires attendees to pay via Razorpay before receiving their QR pass." },
          { q: "How do I upgrade to paid ticketing?", a: "Sign up and start with the free plan. When you're ready to collect payments, upgrade to the Starter or Pro plan from your billing page." },
          { q: "Are there any hidden fees on the free plan?", a: "No. The free plan is genuinely free — no trial period, no credit card required, no hidden charges." },
          { q: "Can I switch from free to paid events on the same account?", a: "Yes. Once you upgrade to a paid plan, you can create paid ticketing events alongside free events on the same account." },
        ],
        ctaTitle: "Ticket your next event for free",
        ctaDescription: "Free plan forever · QR tickets · Entry scanning · No credit card",
      }}
    />
  );
}
