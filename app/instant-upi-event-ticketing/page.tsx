import type { Metadata } from "next";
import { Smartphone, Zap, CreditCard, ShieldCheck, Ticket, BarChart3, Users, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Instant UPI Event Ticketing Platform (PhonePe, GPay, Paytm) | URPASS",
  description:
    "Sell event tickets with instant mobile UPI QR checkout via Razorpay. PhonePe, Google Pay, Paytm, 0% platform commission, and T+2 direct bank deposits.",
  keywords: [
    "instant upi event ticketing",
    "upi qr event registration",
    "phonepe event tickets",
    "gpay event registration",
    "razorpay event ticketing india",
    "upi ticketing platform",
  ],
  alternates: { canonical: "https://urpass.space/instant-upi-event-ticketing" },
  openGraph: {
    title: "Instant UPI Event Ticketing Platform (PhonePe, GPay, Paytm) | URPASS",
    description: "Sell event tickets with instant mobile UPI QR checkout via Razorpay. 0% platform commission.",
    url: "https://urpass.space/instant-upi-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "NATIVE UPI 2.0 INFRASTRUCTURE",
        h1: "Instant UPI Event Ticketing Platform for Indian Events",
        canonicalUrl: "https://urpass.space/instant-upi-event-ticketing",
        description:
          "Enable attendees to buy event tickets in 5 seconds with instant UPI QR payments via PhonePe, Google Pay, and Paytm. 0% platform commission and direct bank payouts.",
        ctaLabel: "Start UPI Ticketing Free",
        directAnswer: {
          title: "How Does UPI Event Ticketing Work on URPASS?",
          summary:
            "URPASS integrates directly with Razorpay to offer native UPI 2.0 checkout for Indian conferences, college fests, and workshops. When attendees register on mobile, they can complete payment in under 5 seconds using PhonePe, Google Pay, Paytm, or Cred. URPASS charges 0% platform commission, and funds settle on standard T+2 cycles directly into the organizer's verified Indian bank account.",
          keyPoints: [
            "Native mobile UPI intent and dynamic QR checkout supporting PhonePe, GPay, Paytm, and BHIM",
            "0% per-ticket platform commission — keep 100% of your ticket price without aggregator markups",
            "Direct T+2 business day bank settlement through your connected Razorpay merchant account",
            "Automated GST invoice generation with organizer GSTIN and attendee tax details",
          ],
        },
        keyFactsTable: {
          title: "UPI Checkout Performance vs International Gateways",
          subtitle: "Payment conversion and settlement benchmarks in the Indian event market.",
          headers: ["Payment Factor", "URPASS Native UPI Integration", "International Aggregators (Eventbrite / etc.)"],
          rows: [
            { col1: "Supported UPI Apps", col2: "PhonePe, Google Pay, Paytm, Cred, BHIM, RuPay", col3: "Limited or unsupported; clunky third-party redirects" },
            { col1: "Mobile Checkout Speed", col2: "Under 5 seconds via native UPI app intent", col3: "60–90s entering card numbers and OTPs" },
            { col1: "Platform Commission", col2: "0% on all plans (flat software subscription)", col3: "3.7% to 8% cut on every ticket sold" },
            { col1: "Bank Settlement Time", col2: "Direct T+2 business days to your bank", col3: "Withheld until 7–14 days post-event" },
            { col1: "Drop-Off Rate Reduction", col2: "Up to 35% higher checkout completion", col3: "High drop-offs due to international card declines" },
          ],
        },
        features: [
          { icon: Smartphone, title: "5-Second UPI Mobile Checkout", desc: "Attendees tap their preferred UPI app (PhonePe, GPay, Paytm) and approve payment in seconds with zero friction." },
          { icon: Zap, title: "0% Platform Commission", desc: "We never take a cut of your ticket earnings. You keep 100% of your ticket revenue minus standard gateway rates." },
          { icon: CreditCard, title: "Direct T+2 Bank Deposits", desc: "Funds deposit directly into your Indian bank account on standard T+2 settlement schedules, maintaining event cash flow." },
          { icon: ShieldCheck, title: "Automated Pass Dispatch", desc: "The exact moment UPI confirms payment, a cryptographically signed QR ticket is generated and emailed to the attendee." },
          { icon: Ticket, title: "Bespoke Ticket Studio", desc: "Design branded passes featuring ticket tiers, venue directions, and high-contrast QR codes for sub-0.3s gate entry." },
          { icon: BarChart3, title: "Automated GST Invoices", desc: "Provide B2B delegates with compliant tax invoices containing your organizer GSTIN and SAC codes for tax deductions." },
        ],
        steps: [
          { n: "01", title: "Create Your Event", desc: "Set event name, ticket pricing in INR, pass limits, and registration questions." },
          { n: "02", title: "Connect Razorpay", desc: "Link your verified Razorpay merchant account in your organizer settings." },
          { n: "03", title: "Share Ticket Link", desc: "Attendees open the link and select their ticket tier on any smartphone." },
          { n: "04", title: "Instant UPI Approval", desc: "Attendees pay in seconds via PhonePe, Google Pay, or Paytm." },
          { n: "05", title: "Pass Generated Instantly", desc: "Unique single-use digital QR ticket arrives immediately via email and web." },
        ],
        callout: {
          badge: "INDIA OPTIMIZED",
          title: "Over 85% of online event ticket sales in India happen via UPI.",
          description: "If your event ticketing platform doesn't have flawless, instant UPI integration, you are losing more than a third of your potential attendees at checkout. URPASS delivers the fastest mobile payment flow in India.",
          bullets: [
            "Native 1-tap mobile UPI checkout with zero clunky bank redirects",
            "Zero platform commission fees keeping your fest and conference budgets intact",
            "Automatic GSTIN capture and compliant B2B tax invoice generation",
            "Sub-0.3s gate scanning with standard volunteer smartphones",
          ],
        },
        faqs: [
          { q: "Which UPI apps are supported for ticket checkout?", a: "URPASS supports all major Indian UPI applications including PhonePe, Google Pay, Paytm, BHIM, Cred, and mobile banking UPI apps." },
          { q: "Do organizers need their own Razorpay account?", a: "Yes. Connecting your own Razorpay account ensures that all funds settle directly into your bank on standard T+2 schedules with 0% platform commission." },
          { q: "Can attendees also pay via Net Banking or Credit/Debit cards?", a: "Yes. In addition to UPI, Razorpay supports all major Indian Net Banking portals, domestic debit/credit cards, and RuPay." },
          { q: "Are GST tax invoices generated automatically for paid tickets?", a: "Yes. URPASS generates compliant GST tax invoices containing your organizer GSTIN, buyer billing details, and HSN/SAC codes automatically upon payment." },
        ],
        relatedLinks: [
          { title: "UPI Event Ticketing", href: "/upi-event-ticketing", category: "Product" },
          { title: "Event Ticketing Software India", href: "/event-ticketing-software-india", category: "Location" },
          { title: "Razorpay Event Ticketing", href: "/razorpay-event-ticketing", category: "Product" },
          { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
        ],
      }}
    />
  );
}
