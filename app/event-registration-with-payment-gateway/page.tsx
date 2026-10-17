import type { Metadata } from "next";
import { BarChart3, CreditCard, FileText, QrCode, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration with Payment Gateway | UrPass",
  description: "Collect registration fees seamlessly with integrated Razorpay, UPI, credit cards and net banking with zero platform ticket commissions.",
  keywords: [
    "event registration with payment gateway",
    "accept online event registrations and payments",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-with-payment-gateway" },
  openGraph: {
    title: "Event Registration with Payment Gateway | UrPass",
    description: "Collect registration fees seamlessly with integrated Razorpay, UPI, credit cards and net banking with zero platform ticket commissions.",
    url: "https://urpass.space/event-registration-with-payment-gateway",
    locale: "en_US",
    type: "website",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "INTEGRATED DIRECT PAYMENTS",
        h1: "Accept Online Event Registrations and Payments",
        canonicalUrl: "https://urpass.space/event-registration-with-payment-gateway",
        description: "Collect registration fees seamlessly with integrated Razorpay, UPI, credit cards and net banking with zero platform ticket commissions.",
        ctaLabel: "Accept Ticket Payments",
        directAnswer: {
          title: "How Does Event Registration with Payment Gateway Work on UrPass?",
          summary: "UrPass connects directly with payment gateways like Razorpay and Stripe so organizers can collect ticket fees via UPI, credit cards, debit cards, and Net Banking. Unlike ticketing aggregators that charge 5% to 10% commission, UrPass charges 0% per-ticket platform fees with direct T+2 bank deposits.",
          keyPoints: ["Native payment gateway integration supporting UPI, Cards, Net Banking, and Wallets", "0% per-ticket platform fees \u2014 keep 100% of your gross ticket sales revenue", "Automated GST-compliant tax invoices generated and emailed upon payment", "Immediate ticket dispatch with cryptographically signed digital QR passes"],
        },
        keyFactsTable: {
          title: "Payment Gateway Integration Comparison",
          subtitle: "How UrPass direct gateway processing beats ticketing aggregators.",
          headers: ["Financial & Processing Factor", "UrPass Direct Gateway Integration", "Traditional Ticketing Aggregators"],
          rows: [
            {
                        "col1": "Platform Commission",
                        "col2": "0% commission on all ticket transactions",
                        "col3": "5% to 8% cut on every single ticket sold"
            },
            {
                        "col1": "Payout Settlement Speed",
                        "col2": "Direct T+2 settlement to your bank account",
                        "col3": "Held by platform until 7\u201314 days post-event"
            },
            {
                        "col1": "Payment Method Coverage",
                        "col2": "UPI (GPay/PhonePe/Paytm), Cards, Net Banking",
                        "col3": "Often limited or high-friction redirects"
            },
            {
                        "col1": "Attendee Data Ownership",
                        "col2": "100% organizer ownership with zero third-party ads",
                        "col3": "Aggregator markets competing events to your attendees"
            },
            {
                        "col1": "GST Tax Invoicing",
                        "col2": "Automated B2B GST tax invoices with your GSTIN",
                        "col3": "Complex reconciliation or missing buyer tax invoices"
            }
],
        },
        features: [
          { icon: CreditCard, title: "Direct Gateway Connection", desc: "Connect your own verified Razorpay or Stripe account in minutes to receive ticket funds directly." },
          { icon: Zap, title: "Instant UPI App-Switch", desc: "Indian attendees pay in 5 seconds via Google Pay, PhonePe, and Paytm with zero checkout friction." },
          { icon: ShieldCheck, title: "0% Platform Commissions", desc: "Keep every single rupee or pound of ticket sales. You only pay standard bank interchange fees." },
          { icon: FileText, title: "Automated GST Invoices", desc: "Automatically issue compliant tax invoices with your organization GSTIN, SAC codes, and buyer details." },
          { icon: QrCode, title: "Automated Pass Dispatch", desc: "The millisecond payment is confirmed by the gateway, a cryptographically signed QR ticket is dispatched." },
          { icon: BarChart3, title: "Real-Time Sales Telemetry", desc: "Monitor live revenue, conversion funnels, and ticket tier velocity from your organizer console." }
        ],
        steps: [
          { n: "01", title: "Create Paid Event", desc: "Set ticket tiers, prices in INR/GBP/USD, and capacity limits on your event dashboard." },
          { n: "02", title: "Connect Gateway", desc: "Link your Razorpay or Stripe API keys in your organizer settings with one click." },
          { n: "03", title: "Share Ticket Page", desc: "Publish a clean, conversion-focused ticket checkout page that loads in under 1 second." },
          { n: "04", title: "Attendees Pay Online", desc: "Buyers pay instantly via UPI, credit/debit cards, or net banking with bank-grade security." },
          { n: "05", title: "Funds Settle Directly", desc: "Ticket revenue lands directly in your merchant bank account on standard T+2 cycles." }
        ],
        callout: {
          badge: "MAXIMIZE TICKET REVENUE",
          title: "Stop giving away 8% of your event revenue to ticketing middlemen.",
          description: "On an event generating ₹10,00,000 / £10,000 in ticket sales, traditional ticketing platforms siphon off up to ₹80,000 / £800 in arbitrary platform commission. UrPass charges 0% commission.",
          bullets: ["Retain 100% of your hard-earned event ticket earnings", "Direct settlement maintains healthy event cash flow for deposits and vendors", "Full ownership of your buyer email addresses and customer data", "Automated GST tax compliance eliminating manual accounting headaches"],
        },
        faqs: [
          { q: "Which payment gateways does UrPass integrate with?", a: "UrPass integrates directly with Razorpay (ideal for India, supporting UPI, Net Banking, and Cards) and Stripe (for global cards and payments)." },
          { q: "Does UrPass charge any percentage on ticket sales?", a: "No. UrPass charges 0% platform commission on all plans. You only pay the direct payment gateway processing fee (e.g., standard ~2% gateway fee)." },
          { q: "When do ticket funds get deposited into my bank account?", a: "Because you connect your own gateway account, funds settle directly on your standard gateway payout schedule (typically T+2 business days)." },
          { q: "Can attendees get automatic GST tax invoices for business expenses?", a: "Yes! UrPass automatically generates and emails compliant GST invoices containing your organization GSTIN and attendee billing details." }
        ],
        relatedLinks: [
          { title: "UPI Event Ticketing Software", href: "/upi-event-ticketing-software", category: "Product" },
          { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
          { title: "Event Ticket Sales Reporting", href: "/event-ticket-sales-reporting", category: "Product" },
          { title: "Paid Workshop Registration Software", href: "/paid-workshop-registration-software", category: "Product" }
        ],
      }}
    />
  );
}
