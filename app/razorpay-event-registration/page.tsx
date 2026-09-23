import type { Metadata } from "next";
import { CreditCard, ShieldCheck, Zap, Layers, ArrowRight, IndianRupee, BarChart3, Lock, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Razorpay Event Registration Software | URPASS",
  description: "Accept event registrations with Razorpay payments. Instant digital QR pass dispatch, UPI integration, GST invoices, and zero per-ticket commission fees.",
  keywords: [
    "Razorpay event registration",
    "Razorpay event ticketing",
    "Razorpay event payment integration",
    "event registration software Razorpay",
    "sell event passes with Razorpay",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/razorpay-event-registration" },
  openGraph: {
    title: "Razorpay Event Registration Software | URPASS",
    description: "Accept event registrations with Razorpay payments and automated digital QR passes.",
    url: "https://urpass.space/razorpay-event-registration",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "RAZORPAY INTEGRATION",
        h1: "Event Registration with Razorpay Payments",
        canonicalUrl: "https://urpass.space/razorpay-event-registration",
        description:
          "Razorpay event registration embeds payment processing directly into your attendee registration workflow. URPASS leverages Razorpay's payments architecture to accept UPI, debit/credit cards, and net banking with instant webhook settlement verification and automated cryptographic QR ticket generation.",
        ctaLabel: "Connect Razorpay Registration",
        features: [
          { icon: CreditCard, title: "Native Razorpay Checkout", desc: "Embed sleek, trusted Razorpay checkout modals directly on your branded URPASS registration links." },
          { icon: Zap, title: "Instant Webhook Pass Issuance", desc: "Payment authorizations trigger server-to-server webhooks that issue and email digital passes in under a second." },
          { icon: IndianRupee, title: "Zero Platform Commissions", desc: "Pay only your regular URPASS plan and standard Razorpay gateway processing fees. No per-ticket ticketing cut." },
          { icon: Lock, title: "Bank-Grade Encryption", desc: "PCI-DSS Level 1 compliance ensures attendee payment details and credentials remain completely secure." },
          { icon: BarChart3, title: "GST-Compliant Invoicing", desc: "Automate B2B and B2C tax invoice generation with GSTIN details, place of supply, and downloadable PDFs." },
          { icon: ShieldCheck, title: "Real-Time Inventory Hold", desc: "Reserved ticket inventory locks during checkout to prevent overselling high-demand event tiers." },
        ],
        steps: [
          { n: "01", title: "Configure Event & Tickets", desc: "Set ticket tiers, prices in INR, and custom registration questionnaire fields in URPASS." },
          { n: "02", title: "Attendee Fills Form", desc: "Participants open your registration link and enter their details in seconds on any device." },
          { n: "03", title: "Razorpay Checkout", desc: "Razorpay modal provides 1-click UPI apps, cards, net banking, and corporate card options." },
          { n: "04", title: "Webhook Auto-Verification", desc: "Razorpay signs and dispatches the payment.captured webhook, verifying valid transaction." },
          { n: "05", title: "Digital Pass & Scanner Sync", desc: "Tamper-proof QR ticket is emailed to attendee and instantly recognized by gate entry scanners." },
        ],
        callout: {
          badge: "SEAMLESS TICKETING FLOW",
          title: "Enterprise payment reliability with startup agility.",
          description: "Combining Razorpay's high payment success rates with URPASS's sub-second QR code scanner infrastructure provides organizers with an enterprise-grade ticketing engine that launches in minutes.",
          bullets: [
            "Industry-leading 99.9% payment gateway uptime and high UPI success rates",
            "Automatic refund and cancellation handling directly connected to ticket revocation",
            "Automated GST invoice generation for corporate and conference registrations",
            "Clean organizer dashboard with real-time gross revenue and settlement metrics",
          ],
        },
        deepDiveSections: [
          {
            badge: "TECHNICAL INTEGRATION",
            title: "How does URPASS integrate with Razorpay for event registration?",
            paragraphs: [
              "URPASS creates a Razorpay payment order for each ticket purchase transaction, locking the seat in the database for 10 minutes to protect against double-booking. When the attendee submits their registration form, the Razorpay Standard Checkout opens natively on the page.",
              "Once the attendee approves the transaction in their bank or UPI app, Razorpay transmits an HMAC-SHA256 authenticated webhook to URPASS. URPASS verifies the signature, marks the registration status as 'PAID', and immediately issues the attendee their personalized digital QR pass.",
            ],
            takeaway: "Cryptographic webhook validation ensures tickets are generated only after bank funds are fully verified.",
          },
          {
            badge: "COMMISSION COMPARISON",
            title: "Why use Razorpay event registration instead of traditional ticketing portals?",
            paragraphs: [
              "Traditional ticketing portals (such as BookMyShow, Eventbrite, or Townscript) charge 5% to 10% commission on every ticket sold, plus internet handling charges that frustrate attendees.",
              "With URPASS and Razorpay, you bypass third-party ticket commissions entirely. You pay only standard payment gateway processing (typically 2% + GST) while retaining full ownership of your attendee email list, brand identity, and customer relationships.",
            ],
            takeaway: "For an event doing ₹5,00,000 in ticket sales, switching from traditional portals to URPASS saves organizers between ₹25,000 and ₹50,000 in commission fees.",
          },
        ],
        faqs: [
          {
            q: "Can attendees pay using international credit cards through Razorpay?",
            a: "Yes. When international cards are enabled, foreign attendees can purchase tickets using Visa, Mastercard, American Express, and Discover cards in their home currencies.",
          },
          {
            q: "Do attendees need to create a Razorpay account to register?",
            a: "No. Attendees do not need any special account; they simply complete payment using their existing UPI app, debit/credit card, or net banking portal.",
          },
          {
            q: "Can I issue automated GST invoices for ticket purchases?",
            a: "Yes. URPASS automatically generates downloadable PDF invoices featuring your legal entity name, GSTIN, attendee billing address, and itemized tax breakdowns.",
          },
        ],
        relatedLinks: [
          { title: "Event Registration with Payment", href: "/event-registration-with-payment", category: "Product" },
          { title: "UPI Event Ticketing", href: "/upi-event-ticketing", category: "Product" },
          { title: "Townscript Alternative", href: "/compare/townscript-alternative", category: "Comparison" },
          { title: "Eventbrite Alternative India", href: "/eventbrite-alternative-india", category: "Comparison" },
        ],
      }}
    />
  );
}
