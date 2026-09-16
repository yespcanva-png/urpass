import type { Metadata } from "next";
import { Ticket, CreditCard, QrCode, ScanLine, ShieldCheck, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Ticketing System for Events | URPASS",
  description: "Issue digital QR tickets for your events. Collect payments, generate QR tickets, and scan at entry — all from one system. Free for non-paid events.",
  alternates: { canonical: "https://urpass.space/qr-ticketing-system" },
  openGraph: {
    title: "QR Ticketing System for Events | URPASS",
    description: "Digital QR ticketing from payment to entry scan. Simple, fast, affordable.",
    url: "https://urpass.space/qr-ticketing-system",
  },
};

export default function QrTicketingSystemPage() {
  return (
    <SEOPage
      config={{
        badge: "QR TICKETING SYSTEM",
        h1: "Digital QR Ticketing Made Simple",
        description: "Create ticket types, collect payments, generate unique QR tickets, and scan attendees at the entrance. The full ticketing cycle — one platform.",
        ctaLabel: "Start ticketing free",
        features: [
          { icon: Ticket, title: "Multiple ticket types", desc: "Create General Admission, VIP, Speaker, or custom ticket categories with individual pricing and capacity." },
          { icon: CreditCard, title: "Integrated payments", desc: "Collect ticket payments via Razorpay integration. Automatic reconciliation with attendee records." },
          { icon: QrCode, title: "QR ticket generation", desc: "Every paid or approved attendee gets a unique digital QR ticket delivered via link — no printing." },
          { icon: ScanLine, title: "QR entry scanning", desc: "Staff scans QR tickets at the entrance using any phone browser. Instant valid/invalid feedback." },
          { icon: ShieldCheck, title: "Single-use enforcement", desc: "Each QR ticket is single-use. Sharing or duplicating a QR ticket is automatically blocked." },
          { icon: BarChart3, title: "Ticket sales analytics", desc: "Track ticket sales, check-in rates, and attendance by ticket type in your real-time dashboard." },
        ],
        callout: {
          badge: "FREE + PAID EVENTS",
          title: "Free or paid — QR tickets work the same.",
          description: "URPASS handles both free registration events and paid ticketing events. Set up ticket types with pricing, collect payments, and scan everyone at the door with the same QR flow.",
          bullets: [
            "Free tickets — instant QR pass on approval",
            "Paid tickets — payment required, then QR issued",
            "Multiple ticket types per event",
            "Razorpay payment integration",
          ],
        },
        useCases: [
          "College fests", "Hackathons", "Workshops", "Paid conferences",
          "Corporate events", "Community events", "Tech events", "Seminars",
        ],
        faqs: [
          { q: "What is a QR ticketing system?", a: "A QR ticketing system generates a unique QR code for each event ticket or registration. Attendees show the QR on their phone at entry, and staff scans it for instant validation. URPASS handles the full flow from registration to QR generation to entry scanning." },
          { q: "Does URPASS support paid ticketing?", a: "Yes. Starter and Pro plans support paid ticketing with Razorpay integration. You can set ticket prices, collect payments, and automatically issue QR tickets to paid attendees." },
          { q: "Can I create different ticket types with different prices?", a: "Yes. You can create multiple ticket types (General, VIP, Speaker, etc.) with individual prices and seat capacities." },
          { q: "How do attendees receive their QR ticket?", a: "After payment or approval, attendees receive a direct link to their digital QR pass. They open it on their phone at the entrance for scanning." },
          { q: "Do I need a payment gateway to use URPASS?", a: "Only for paid events. Free events don't require any payment setup. Paid events need a Razorpay account connected in settings." },
          { q: "What are the fees for using URPASS for paid events?", a: "URPASS charges a platform subscription fee. Razorpay charges their standard payment processing fees separately. There are no per-ticket fees from URPASS." },
        ],
        ctaTitle: "Launch your QR ticketing system today",
        ctaDescription: "Digital QR tickets · Free + paid events · Any phone as scanner",
      }}
    />
  );
}
