import type { Metadata } from "next";
import { Ticket, QrCode, ScanLine, CreditCard, BarChart3, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Software with QR Check-In | URPASS",
  description: "Event ticketing software that generates digital QR tickets and checks in attendees at the door. No printing. No spreadsheets. Just create, sell, scan.",
  alternates: { canonical: "https://urpass.space/event-ticketing-software" },
  openGraph: {
    title: "Event Ticketing Software with QR Check-In | URPASS",
    description: "Create events, sell tickets, issue QR passes, and check in attendees — simple ticketing software.",
    url: "https://urpass.space/event-ticketing-software",
  },
};

export default function EventTicketingSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT TICKETING SOFTWARE",
        h1: "Simple Event Ticketing Software",
        description: "Create your event, set up ticket types, collect payments, issue digital QR tickets, and check in attendees with a phone scanner. All in one place.",
        ctaLabel: "Create your first ticket",
        features: [
          { icon: Ticket, title: "Easy ticket setup", desc: "Create ticket types with names, descriptions, pricing, and capacity in minutes." },
          { icon: CreditCard, title: "Secure payment collection", desc: "Razorpay integration handles payments securely. Funds go directly to your account." },
          { icon: QrCode, title: "Auto QR ticket generation", desc: "Each paid attendee gets a unique digital QR ticket instantly — no manual work." },
          { icon: ScanLine, title: "Phone-based scanning", desc: "Turn any Android or iOS device into a ticket scanner. No extra hardware." },
          { icon: Zap, title: "Instant ticket delivery", desc: "Digital tickets are available immediately after payment. No email delays." },
          { icon: BarChart3, title: "Live check-in dashboard", desc: "Monitor ticket sales and check-ins in real time from your organiser dashboard." },
        ],
        callout: {
          badge: "SIMPLE WORKFLOW",
          title: "Create. Sell. Scan. Done.",
          description: "Set up your ticket types in minutes. Share the registration link. Collect payments. Issue QR tickets automatically. Scan at the door.",
          bullets: [
            "Ticket setup in under 5 minutes",
            "Razorpay payment collection",
            "Automatic QR ticket generation",
            "Any phone as scanner",
          ],
        },
        useCases: [
          "Workshops", "Paid conferences", "College fests", "Corporate events",
          "Hackathons", "Seminars", "Community events", "Tech events",
        ],
        faqs: [
          { q: "Is URPASS ticketing software free to try?", a: "Yes. You can create an account and set up your event for free. Paid ticketing (collecting payments) requires a Starter or Pro subscription." },
          { q: "How does ticket delivery work?", a: "After payment, attendees receive a direct link to their digital QR ticket. They open it on their phone at the event entrance." },
          { q: "Can I sell tickets with early bird pricing?", a: "You can create multiple ticket types with different prices (for example, Early Bird and Regular), each with their own capacity limit." },
          { q: "Does the software work for small events?", a: "Yes. URPASS is designed to be simple enough for a 20-person workshop and scalable for a 2,000-person conference." },
          { q: "What reports does URPASS generate?", a: "You can see ticket sales by type, total revenue, check-in rates, and attendance breakdowns from your dashboard." },
          { q: "Can I use URPASS for events in India?", a: "Yes. URPASS is built for India with Razorpay integration and INR pricing. Trusted by event organizers across Chennai, Bangalore, and beyond." },
        ],
        ctaTitle: "Start selling tickets today",
        ctaDescription: "Simple ticketing · Razorpay payments · Digital QR tickets · No printing",
      }}
    />
  );
}
