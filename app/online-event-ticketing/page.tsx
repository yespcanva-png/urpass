import type { Metadata } from "next";
import { Globe, Ticket, CreditCard, QrCode, ScanLine, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Online Event Ticketing & Registration Platform | URPASS",
  description: "Sell and manage event tickets online. Share a registration link, collect payments, issue digital QR passes, and track check-ins. Works for any event size.",
  alternates: { canonical: "https://urpass.space/online-event-ticketing" },
  openGraph: {
    title: "Online Event Ticketing & Registration Platform | URPASS",
    description: "Online ticketing with QR check-in. Registration to entry, connected.",
    url: "https://urpass.space/online-event-ticketing",
  },
};

export default function OnlineEventTicketingPage() {
  return (
    <SEOPage
      config={{
        badge: "ONLINE EVENT TICKETING",
        h1: "Sell & Manage Event Tickets Online",
        description: "Create an online ticket page, collect payments, send digital QR tickets, and check in attendees at the event. Everything managed from your browser.",
        ctaLabel: "Sell tickets online",
        features: [
          { icon: Globe, title: "Online registration page", desc: "Your event gets a shareable public registration link — no website needed." },
          { icon: Ticket, title: "Multiple ticket options", desc: "Create General, VIP, or custom ticket types with individual pricing and capacity." },
          { icon: CreditCard, title: "Online payment collection", desc: "Accept payments through Razorpay. Secure, instant reconciliation with attendee records." },
          { icon: QrCode, title: "Digital QR ticket delivery", desc: "Every paid attendee receives a digital QR ticket — no printing, no email attachment." },
          { icon: ScanLine, title: "QR scanning at the event", desc: "Staff scans QR tickets at the entrance using any phone. Validation in under a second." },
          { icon: BarChart3, title: "Live sales and check-in stats", desc: "Monitor ticket sales and check-in progress in real time from any device." },
        ],
        callout: {
          badge: "NO WEBSITE NEEDED",
          title: "Your event goes online in minutes.",
          description: "Create your event on URPASS and share the registration link. Attendees complete their ticket purchase online. You manage everything from your URPASS dashboard.",
          bullets: [
            "Shareable link — no website needed",
            "Online payment via Razorpay",
            "QR ticket delivered on purchase",
            "Real-time check-in management",
          ],
        },
        useCases: [
          "Paid workshops", "Online-promoted events", "College fests", "Conferences",
          "Community events", "Corporate events", "Tech meetups", "Seminars",
        ],
        faqs: [
          { q: "Do I need a website to sell tickets online?", a: "No. URPASS gives every event a unique public registration page. You just share the link — no website or coding needed." },
          { q: "How do I receive the ticket payments?", a: "Payments are processed through Razorpay and settled directly to your linked bank account per Razorpay's settlement schedule." },
          { q: "Can attendees pay by UPI, card, or net banking?", a: "Yes. Razorpay supports UPI, credit/debit cards, net banking, and wallets — all standard Indian payment methods." },
          { q: "Is there a service fee per ticket sold?", a: "URPASS charges a monthly subscription. Razorpay charges their standard payment processing fee. No additional per-ticket fees from URPASS." },
          { q: "How do attendees receive their ticket online?", a: "After payment, attendees land on their digital QR pass page. They can bookmark it, screenshot it, or return to it at any time before the event." },
          { q: "Can I run registrations for free events and paid events on the same account?", a: "Yes. You can have both free registration events and paid ticketing events on the same URPASS account." },
        ],
        ctaTitle: "Start selling tickets online today",
        ctaDescription: "Shareable ticket link · Online payments · Digital QR tickets · Built for India",
      }}
    />
  );
}
