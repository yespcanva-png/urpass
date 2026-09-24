import type { Metadata } from "next";
import { BookOpen, CreditCard, QrCode, ScanLine, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticket Booking & QR Entry System",
  description: "A complete event ticket booking system with QR entry. Attendees book tickets online, receive a QR pass, and scan at the entrance. From booking to entry in one system.",
  alternates: { canonical: "https://urpass.space/event-ticket-booking-system" },
  openGraph: {
    title: "Event Ticket Booking & QR Entry System | URPASS",
    description: "From booking to QR entry — one connected ticket booking system for your event.",
    url: "https://urpass.space/event-ticket-booking-system",
  },
};

export default function EventTicketBookingSystemPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticket-booking-system",
        badge: "EVENT TICKET BOOKING SYSTEM",
        h1: "Event Booking to Entry in One System",
        description: "Let attendees book tickets online, collect payment, generate QR passes, and scan them in at the entrance. One connected system — no disconnected tools.",
        ctaLabel: "Start your booking system",
        features: [
          { icon: BookOpen, title: "Online ticket booking", desc: "Attendees book tickets from a public link — no app, no account needed on their end." },
          { icon: CreditCard, title: "Secure online payment", desc: "Collect ticket fees via Razorpay. Instant payment confirmation triggers QR pass generation." },
          { icon: QrCode, title: "Instant QR pass on booking", desc: "Each booked ticket generates a unique QR pass immediately after payment." },
          { icon: ScanLine, title: "QR scan at entry", desc: "Staff uses any phone as a scanner at the event entrance. No dedicated hardware." },
          { icon: Users, title: "Booking management", desc: "See all bookings, payment status, and attendee details in your dashboard." },
          { icon: BarChart3, title: "Sales and entry tracking", desc: "Monitor bookings, check-in rates, and revenue from your real-time dashboard." },
        ],
        callout: {
          badge: "CONNECTED SYSTEM",
          title: "Book → Pay → QR → Scan. Done.",
          description: "URPASS connects the entire ticket booking flow. A completed booking automatically triggers QR pass generation. At your event, one scan at the entrance completes the cycle.",
          bullets: [
            "Booking triggers QR generation",
            "Payment confirmation required",
            "QR pass linked to booking",
            "Scan validates booking at entry",
          ],
        },
        useCases: [
          "Paid workshops", "Conferences", "Corporate events", "College fests",
          "Hackathons", "Community events", "Tech events", "Seminars",
        ],
        faqs: [
          { q: "What is an event ticket booking system?", a: "An event ticket booking system lets attendees select and book tickets online, processes payment, and delivers an entry pass. URPASS adds QR-based entry scanning to complete the full cycle." },
          { q: "How are tickets delivered after booking?", a: "After a successful payment, the attendee lands on their digital QR pass page. They can bookmark or screenshot it for entry." },
          { q: "Can I limit the number of bookings?", a: "Yes. Each ticket type has an optional capacity limit. Bookings close automatically when a ticket type sells out." },
          { q: "How do I scan tickets at the event?", a: "Open the URPASS scanner in a phone browser, scan each attendee's QR code at the entrance. Instant valid or invalid result." },
          { q: "What payment methods can attendees use?", a: "Razorpay supports UPI, credit/debit cards, net banking, and wallets — the full range of Indian payment methods." },
          { q: "Can I offer early bird or discounted ticket types?", a: "Yes. Create multiple ticket types with different prices and capacities. You can name them Early Bird, Regular, VIP, etc." },
        ],
        ctaTitle: "Build your ticket booking system today",
        ctaDescription: "Online bookings · QR passes · Entry scanning · Razorpay integration",
      }}
    />
  );
}
