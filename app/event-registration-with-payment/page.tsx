import type { Metadata } from "next";
import { CreditCard, QrCode, ShieldCheck, Zap, ArrowRight, CheckCircle2, RefreshCw, BarChart3, Lock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration with Payment & QR Tickets | URPASS",
  description: "Collect attendee registrations and process online payments via UPI, Cards, and Net Banking with instant automated QR pass delivery. Zero platform commission fees.",
  keywords: [
    "event registration with payment",
    "online event ticketing with payment",
    "paid event registration",
    "event ticket payment gateway",
    "event registration payment UPI",
    "sell event tickets online",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-with-payment" },
  openGraph: {
    title: "Event Registration with Payment & QR Tickets | URPASS",
    description: "Collect attendee registrations and process online payments with instant automated QR pass delivery.",
    url: "https://urpass.space/event-registration-with-payment",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "PAID REGISTRATIONS",
        h1: "Event Registration with Online Payment",
        canonicalUrl: "https://urpass.space/event-registration-with-payment",
        description:
          "Event registration with payment unifies attendee registration, instant online payment processing (UPI, cards, net banking), and automatic cryptographic QR pass issuance upon transaction settlement. URPASS removes manual transaction reconciliation by syncing form entries directly to payment confirmations and mobile entry scanners.",
        ctaLabel: "Start Selling Tickets",
        features: [
          { icon: CreditCard, title: "Multi-Method Payment Checkout", desc: "Accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and international cards seamlessly." },
          { icon: Zap, title: "Instant QR Pass Dispatch", desc: "Cryptographic digital passes are generated and emailed immediately after Razorpay confirms payment settlement." },
          { icon: Lock, title: "Zero Platform Commissions", desc: "Keep 100% of your ticket revenue. URPASS charges zero per-ticket platform fees; only standard payment gateway processing applies." },
          { icon: ShieldCheck, title: "Double-Booking Prevention", desc: "Ticket inventory reserves in real-time during checkout so tiers never oversell beyond venue fire codes." },
          { icon: BarChart3, title: "Real-Time Revenue Analytics", desc: "Track gross revenue, paid registrations, pending transactions, and check-in percentages from one dashboard." },
          { icon: RefreshCw, title: "Automated Tax Invoices", desc: "Generate GST-compliant invoices and payment receipts automatically for every ticket purchase." },
        ],
        steps: [
          { n: "01", title: "Select & Register", desc: "Attendee chooses ticket tier, enters contact details, and submits custom form questions." },
          { n: "02", title: "Instant Checkout", desc: "Secure checkout opens with native UPI QR, UPI ID, credit/debit cards, and net banking options." },
          { n: "03", title: "Webhook Settlement", desc: "Bank-grade webhook verifies payment success and locks the ticket inventory slot instantly." },
          { n: "04", title: "QR Ticket Issued", desc: "Attendee receives a tamper-proof digital pass on-screen, via email, and Apple/Google Wallet." },
          { n: "05", title: "Sub-0.3s Gate Scan", desc: "Entry staff scan the pass with any phone browser; scanner immediately confirms paid valid admission." },
        ],
        callout: {
          badge: "ELIMINATE MANUAL PAYMENT PROOF",
          title: "Stop asking attendees for payment screenshots in Google Forms.",
          description: "Manually checking UPI transaction reference IDs against bank statements causes gate bottlenecks, fake payment fraud, and hours of administrative waste. URPASS automates the entire loop from checkout to entrance verification.",
          bullets: [
            "Automated payment verification eliminates fraudulent payment screenshots",
            "Zero per-ticket ticketing commission — flat, predictable SaaS pricing",
            "Direct attendee communication with branded confirmation emails and passes",
            "Instant attendance tracking matching revenue numbers to on-site attendance",
          ],
        },
        deepDiveSections: [
          {
            badge: "WORKFLOW",
            title: "How does event registration with payment work?",
            paragraphs: [
              "Event registration with payment combines attendee data collection, payment gateway verification, and ticket distribution into a single automated pipeline. When an attendee arrives at your registration page, they choose their ticket category and fill in required fields such as name, email, phone number, and organization.",
              "Upon submitting the form, the attendee is immediately routed to a secure payment gateway modal. Once payment is authorized by the bank, a webhook triggers URPASS to create a cryptographically signed digital pass containing a unique QR token. The attendee is redirected to a confirmation page with their live pass and simultaneously receives an email containing their entry credentials.",
            ],
            bullets: [
              "Single-step flow reduces checkout drop-off compared to multi-app setups",
              "Immediate token generation guarantees pass legitimacy before event day",
              "Works across mobile browsers without forcing attendees to install an application",
            ],
            takeaway: "Automated payment verification eliminates the operational hazard of checking bank transaction numbers manually on event morning.",
          },
          {
            badge: "PAYMENT RAILS",
            title: "Which payment methods are supported for event attendees?",
            paragraphs: [
              "In India, over 75% of online event transactions occur via Unified Payments Interface (UPI). URPASS integrates directly with Razorpay to provide native UPI intent flows on mobile (opening Google Pay, PhonePe, Paytm, or CRED directly) and dynamic UPI QR codes on desktop displays.",
              "In addition to UPI, attendees can pay using domestic Visa, Mastercard, and RuPay debit or credit cards, corporate credit cards, net banking across 50+ banks, and international credit cards for global summits and academic conferences.",
            ],
            takeaway: "Offering native UPI alongside traditional card payment rails maximizes registration conversion rates for both student and corporate audiences.",
          },
          {
            badge: "ENTRY VERIFICATION",
            title: "How do organizers track paid attendees and prevent fraudulent entries?",
            paragraphs: [
              "Every ticket generated through URPASS contains a dynamic, high-density QR code tied to a unique transaction ID. On event day, volunteers and security staff open the URPASS mobile scanner in their standard smartphone browser (Safari or Chrome).",
              "When scanned, the engine validates the ticket token against the event database in under 300 milliseconds. If the pass was previously scanned, the screen turns red and displays the exact time and device of the initial check-in, making screenshot forwarding and duplicate ticket fraud impossible.",
            ],
            takeaway: "Cryptographic ticket generation ensures only attendees who actually completed payment gain entry through physical gate checkpoints.",
          },
        ],
        faqs: [
          {
            q: "Does URPASS charge a commission on paid ticket sales?",
            a: "No. URPASS charges zero percent per-ticket platform fees. Organizers pay only their monthly or annual URPASS subscription and standard payment gateway transaction fees (e.g. Razorpay standard rates).",
          },
          {
            q: "Can I sell multiple ticket tiers (e.g., Early Bird, VIP, Student)?",
            a: "Yes. You can create unlimited ticket tiers, each with individual pricing, seat quotas, sale start/end dates, and custom registration fields.",
          },
          {
            q: "What happens if an attendee's payment fails?",
            a: "If payment fails, no pass is generated and the allocated inventory slot is returned to the pool after a brief reservation timeout. Attendees can retry immediately using an alternate payment method.",
          },
          {
            q: "Can attendees download GST tax invoices for their registration?",
            a: "Yes. URPASS supports automatic tax invoice generation including GSTIN numbers, seller and customer details, HSN/SAC codes, and itemized tax breakdowns.",
          },
        ],
        relatedLinks: [
          { title: "UPI Event Ticketing", href: "/upi-event-ticketing", category: "Product" },
          { title: "Razorpay Event Registration", href: "/razorpay-event-registration", category: "Product" },
          { title: "Ticket Inventory Management", href: "/event-ticket-inventory-management", category: "Product" },
          { title: "Event Registration Analytics", href: "/event-registration-analytics", category: "Product" },
          { title: "Eventbrite Alternative India", href: "/eventbrite-alternative-india", category: "Comparison" },
        ],
      }}
    />
  );
}
