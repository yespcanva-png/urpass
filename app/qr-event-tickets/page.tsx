import type { Metadata } from "next";
import { QrCode, Ticket, ShieldCheck, Smartphone, Zap, CreditCard } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Code Event Tickets & Digital Passes",
  description: "Create QR code event tickets for your attendees. Each ticket is a unique digital QR pass — scannable at entry, fraud-proof, and delivered instantly on registration.",
  alternates: { canonical: "https://urpass.space/qr-event-tickets" },
  openGraph: {
    title: "QR Code Event Tickets & Digital Passes | URPASS",
    description: "Issue unique QR code tickets for your event. No printing. Instant delivery. Scanned at entry.",
    url: "https://urpass.space/qr-event-tickets",
  },
};

export default function QrEventTicketsPage() {
  return (
    <SEOPage
      config={{
        badge: "QR CODE EVENT TICKETS",
        h1: "Create QR Tickets for Your Event",
        description: "Issue every attendee a unique QR code ticket. They show it on their phone. You scan it at the door. No printing, no spreadsheets, no confusion.",
        ctaLabel: "Create QR tickets free",
        features: [
          { icon: QrCode, title: "Unique QR per ticket", desc: "Every ticket gets a cryptographically unique QR code — impossible to duplicate or guess." },
          { icon: Ticket, title: "Multiple ticket categories", desc: "General, VIP, Speaker — create as many ticket types as your event needs." },
          { icon: CreditCard, title: "Paid or free tickets", desc: "Issue free QR tickets instantly on approval, or collect payment before issuing." },
          { icon: Smartphone, title: "Phone-based ticket", desc: "Attendees carry their ticket on their phone — no printing, no lamination, no lost tickets." },
          { icon: ShieldCheck, title: "Fraud-proof single-use", desc: "Each QR ticket can only be used once. Photocopies and shared screenshots are blocked." },
          { icon: Zap, title: "Instant after payment", desc: "QR tickets appear immediately after payment confirmation. No waiting for email." },
        ],
        callout: {
          badge: "SIMPLE QR TICKET FLOW",
          title: "Register, pay, get QR. Show at door.",
          description: "Attendees complete registration or payment online. Their unique QR ticket is available immediately. At your event, staff scans it for instant entry.",
          bullets: [
            "Unique QR issued on payment/approval",
            "Opens in any mobile browser",
            "Scanned at entrance in < 1 second",
            "Dashboard tracks every scan",
          ],
        },
        useCases: [
          "Paid workshops", "College fests", "Conferences", "Hackathons",
          "Corporate events", "Community events", "Tech meetups", "Seminars",
        ],
        faqs: [
          { q: "What is a QR code event ticket?", a: "A QR code event ticket is a digital pass with a unique QR code embedded. The attendee shows it on their phone screen at entry. Staff scans the QR to verify the ticket and check in the attendee." },
          { q: "Can attendees share their QR ticket with someone else?", a: "No. The QR ticket is single-use. Once scanned and checked in, any subsequent scan of the same QR will be rejected as 'Already Used.'" },
          { q: "Do attendees need to print their QR ticket?", a: "No. The digital QR ticket is designed for phones. Attendees just open the link and show the QR on their screen." },
          { q: "How do I scan QR tickets at the event?", a: "Open the URPASS scanner in a browser on any phone or tablet. Point it at the attendee's QR code. Valid and invalid results appear instantly." },
          { q: "What happens if an attendee's phone battery dies?", a: "Each QR ticket also shows a short code. Staff can look up the attendee by their short code or name in the attendee dashboard." },
          { q: "Can I issue QR tickets for free events?", a: "Yes. For free events, attendees receive a QR ticket immediately after their application is approved. No payment required." },
        ],
        ctaTitle: "Issue QR tickets for your next event",
        ctaDescription: "Unique per attendee · Phone-based · Scanned at door · Free to start",
      }}
    />
  );
}
