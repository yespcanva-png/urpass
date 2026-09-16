import type { Metadata } from "next";
import { Ticket, CreditCard, QrCode, ScanLine, BarChart3, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Platform with QR Check-In | URPASS",
  description: "An event ticketing platform that connects ticket sales to QR check-in. Create ticket types, collect payments, issue digital QR tickets, and scan attendees at entry.",
  alternates: { canonical: "https://urpass.space/event-ticketing-platform" },
  openGraph: {
    title: "Event Ticketing Platform with QR Check-In | URPASS",
    description: "Sell tickets, generate QR passes, and check in attendees — all from one platform.",
    url: "https://urpass.space/event-ticketing-platform",
  },
};

export default function EventTicketingPlatformPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT TICKETING PLATFORM",
        h1: "Event Ticketing Made Simple",
        description: "Create ticket types, collect payments, issue digital QR tickets, and scan attendees at the door — all from one connected platform. No juggling multiple tools.",
        ctaLabel: "Start ticketing now",
        features: [
          { icon: Ticket, title: "Flexible ticket types", desc: "Create multiple ticket categories — General, VIP, Speaker — with individual prices and seat limits." },
          { icon: CreditCard, title: "Online payment collection", desc: "Accept ticket payments via Razorpay integration. Secure, instant, and directly tied to attendee records." },
          { icon: QrCode, title: "Digital QR tickets", desc: "Every paid attendee receives a unique digital QR ticket automatically on payment completion." },
          { icon: ScanLine, title: "QR scanning at entry", desc: "Scan QR tickets at the entrance using any phone browser. Fast, reliable, no hardware required." },
          { icon: Users, title: "Attendee management", desc: "See ticket sales by type, manage your attendee list, and check in everyone from one dashboard." },
          { icon: BarChart3, title: "Sales and check-in analytics", desc: "Track ticket sales, revenue, check-in rates, and attendance breakdown by ticket type." },
        ],
        callout: {
          badge: "END-TO-END FLOW",
          title: "Ticket sale to entry scan — one platform.",
          description: "URPASS connects the ticket purchase to the check-in process. When an attendee pays, their QR ticket is issued. When they arrive, your staff scans it at the door.",
          bullets: [
            "Ticket purchase → QR issued instantly",
            "Attendee shows QR at entrance",
            "Staff scans → valid or invalid",
            "Dashboard updates in real time",
          ],
        },
        useCases: [
          "Paid conferences", "Workshops", "Corporate events", "Hackathons",
          "College fests", "Tech events", "Community events", "Seminars",
        ],
        faqs: [
          { q: "What makes URPASS different from other ticketing platforms?", a: "URPASS connects ticketing directly to QR check-in. Most platforms stop at selling tickets. URPASS continues to generate QR tickets, provides a scanning tool, and gives you real-time check-in data." },
          { q: "Which payment gateway does URPASS use?", a: "URPASS integrates with Razorpay for payment collection. You connect your Razorpay account in the settings." },
          { q: "Are there per-ticket fees from URPASS?", a: "No. URPASS charges a monthly subscription. Razorpay applies their standard payment processing fees. No additional per-ticket charges from URPASS." },
          { q: "Can I run both free and paid ticket types in the same event?", a: "Yes. You can create multiple ticket types — some free, some paid — for the same event." },
          { q: "Does URPASS handle refunds?", a: "Refunds are managed through Razorpay directly. URPASS does not process refunds but you can manually update attendee status." },
          { q: "Is URPASS available in India?", a: "Yes. URPASS is built for the Indian market with Razorpay integration and pricing in INR. It's trusted by colleges, event organizers, and startups across India." },
        ],
        ctaTitle: "Launch your ticketed event today",
        ctaDescription: "Sell tickets · Digital QR passes · Entry scanning · Built for India",
      }}
    />
  );
}
