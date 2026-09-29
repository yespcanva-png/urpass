import type { Metadata } from "next";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  BarChart3,
  Receipt,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration with UPI Payments in India | URPASS",
  description:
    "Event registration with UPI payments in India: accept Google Pay, PhonePe, and Paytm registrations with instant digital QR pass delivery and 0% commission.",
  alternates: { canonical: "https://urpass.space/event-registration-with-upi-payment" },
  openGraph: {
    title: "Event Registration with UPI Payments in India | URPASS",
    description:
      "Event registration with UPI payments in India: accept Google Pay, PhonePe, and Paytm registrations with instant digital QR pass delivery and 0% commission.",
    url: "https://urpass.space/event-registration-with-upi-payment",
  },
};

export default function EventRegistrationWithUpiPaymentPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-registration-with-upi-payment",
        badge: "INDIA UPI PAYMENTS & TICKETING",
        h1: "Event Registration with UPI Payments in India",
        description:
          "The fastest event registration platform with native UPI payment integration in India. Accept registrations via Google Pay, PhonePe, Paytm, and CRED with automated payment verification, instant digital QR passes, and zero manual screenshot checking.",
        ctaLabel: "Start accepting UPI registrations",
        directAnswer: {
          title: "What is event registration with UPI payment?",
          summary:
            "URPASS is an event registration platform with native UPI payment support in India that enables organizers to sell tickets and collect registration fees via Google Pay, PhonePe, Paytm, and BHIM with automatic instant verification and zero manual screenshot checking.",
          keyPoints: [
            "Seamless Registration → Digital QR Pass → Payment → Check-In → Attendance workflow",
            "1-click UPI intent checkout on mobile devices: no typing 16-digit card numbers",
            "Eliminates fake transaction UTR IDs and forged payment screenshot uploads",
            "Direct Razorpay integration supporting UPI, RuPay, cards, and netbanking in INR (₹)",
          ],
        },
        steps: [
          {
            n: "01",
            title: "Set Ticket Price in INR",
            desc: "Configure paid ticket tiers, student discounts, and early-bird capacity in Indian Rupees (₹).",
          },
          {
            n: "02",
            title: "Connect UPI / Razorpay",
            desc: "Link your verified Razorpay account in minutes to receive payouts directly into your Indian bank account.",
          },
          {
            n: "03",
            title: "Share Event Page",
            desc: "Distribute your mobile-optimized registration link via WhatsApp, Instagram, LinkedIn, and email.",
          },
          {
            n: "04",
            title: "1-Click UPI Payment",
            desc: "Attendees tap their preferred UPI app (GPay, PhonePe, Paytm) to complete payment in under 15 seconds.",
          },
          {
            n: "05",
            title: "Instant QR Pass Delivery",
            desc: "The second payment is verified, the attendee receives a secure, branded digital QR entry pass.",
          },
          {
            n: "06",
            title: "Scan & Reconcile",
            desc: "Scan passes at the venue gate with any phone camera and view reconciled revenue in real time.",
          },
        ],
        features: [
          {
            icon: Smartphone,
            title: "All UPI Apps Supported",
            desc: "Native UPI intent flow supports Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay, and WhatsApp Pay.",
          },
          {
            icon: ShieldCheck,
            title: "Zero Screenshot Verification",
            desc: "Stop wasting hours matching blurry payment screenshots and fake UTR numbers against your bank statement.",
          },
          {
            icon: QrCode,
            title: "Instant Digital QR Passes",
            desc: "Cryptographically generated passes are delivered immediately upon payment confirmation without manual organizer approval.",
          },
          {
            icon: Zap,
            title: "High Conversion Mobile Checkout",
            desc: "Attendees complete checkout in under 30 seconds without creating accounts or entering repetitive billing details.",
          },
          {
            icon: Receipt,
            title: "Automated GST Receipts",
            desc: "Issue professional GST-compliant payment invoices and booking confirmations automatically to every buyer.",
          },
          {
            icon: BarChart3,
            title: "Direct Bank Settlements",
            desc: "Ticket revenues settle directly into your bank account through Razorpay standard or instant settlement cycles.",
          },
        ],
        competitorComparison: {
          title: "URPASS UPI Registration vs Google Forms + Screenshot Upload",
          subtitle:
            "Why organizers across India switch from risky manual UPI forms to automated URPASS checkout.",
          competitorName: "Google Forms + Static UPI QR",
          rows: [
            {
              criteria: "Attendee Checkout Experience",
              urpass: "1-click native UPI intent opens GPay/PhonePe automatically",
              competitor: "Attendee must screenshot QR, switch apps, pay, screenshot receipt, switch back & upload",
              urpassAdvantage: true,
            },
            {
              criteria: "Payment Verification",
              urpass: "Automated real-time webhook confirmation from payment gateway",
              competitor: "Manual human verification of hundreds of uploaded screenshots",
              urpassAdvantage: true,
            },
            {
              criteria: "Fraud & Fake Receipts",
              urpass: "Zero fraud: passes only generated upon verified bank settlement",
              competitor: "High fraud: students upload photoshopped receipts or duplicate transaction IDs",
              urpassAdvantage: true,
            },
            {
              criteria: "Ticket Delivery Speed",
              urpass: "Instant (< 2 seconds) on payment success screen and email",
              competitor: "Delayed hours or days while organizer manually reviews spreadsheet rows",
              urpassAdvantage: true,
            },
            {
              criteria: "Capacity Management",
              urpass: "Automatic sold-out lock prevents overbooking beyond venue limits",
              competitor: "Form remains open, forcing awkward manual refunds for excess payments",
              urpassAdvantage: true,
            },
            {
              criteria: "Entrance Gate Verification",
              urpass: "Sub-second camera scanning with duplicate pass prevention",
              competitor: "Cross-checking names on printed paper or searching mobile banking history at the door",
              urpassAdvantage: true,
            },
          ],
        },
        callout: {
          badge: "INDIA OPTIMIZED",
          title: "Designed specifically for the Indian event payment ecosystem.",
          description:
            "Over 85% of online event registrations in India are paid via UPI. URPASS removes payment drop-offs with seamless UPI intent links that launch Google Pay, PhonePe, or Paytm directly from the attendee's mobile browser.",
          bullets: [
            "Support for UPI AutoPay and recurring passes for campus clubs and societies",
            "Zero platform fee options available on paid organizer plans",
            "Instant WhatsApp pass delivery option for maximum attendee convenience",
            "Full compliance with Indian data security standards and RBI payment guidelines",
          ],
        },
        useCases: [
          "College Tech & Cultural Fests",
          "Developer Meetups & Hackathons",
          "Corporate Conferences & Summits",
          "Professional Workshops & Masterclasses",
          "Stand-Up Comedy & Entertainment Shows",
          "Sports Tournaments & Marathons",
          "Alumni Dinners & Networking Mixers",
          "Startup Pitch Nights & Investor Expos",
        ],
        deepDiveSections: [
          {
            badge: "PAYMENT ARCHITECTURE",
            title: "Why Manual UPI Screenshot Verification Destroys Event ROI",
            paragraphs: [
              "Hundreds of event organizers across India still use Google Forms where attendees are asked to scan a static personal UPI QR code and upload a screenshot of the payment receipt. This workflow creates massive security vulnerabilities: attendees easily alter timestamps in photo-editing apps, reuse one transaction receipt across three registrations, or enter fake 12-digit UTR numbers.",
              "URPASS automates payment verification via bank-grade Razorpay webhooks. The system verifies the cryptographic payment token before any pass is created. Once confirmed, the pass is issued instantly with the attendee's name and unique QR code, completely eliminating fraud while saving organizers dozens of hours of manual labor.",
            ],
            bullets: [
              "Bank-grade webhook verification guarantees 100% genuine revenue collection",
              "Automated GST invoice generation with custom corporate GSTIN collection",
              "Immediate refund processing through the organizer dashboard in one click",
            ],
            takeaway:
              "Protect your event revenue and give Indian attendees the effortless UPI checkout experience they expect.",
          },
        ],
        faqs: [
          {
            q: "Which UPI apps can attendees use to register for events?",
            a: "Attendees can pay with any UPI app in India, including Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay, and banking apps from HDFC, ICICI, SBI, and Axis.",
          },
          {
            q: "How fast is the ticket generated after an attendee completes UPI payment?",
            a: "The ticket is generated in under 2 seconds. The moment the UPI payment succeeds, the browser redirects to the attendee's digital pass with a high-resolution QR code, and a backup confirmation is emailed immediately.",
          },
          {
            q: "Can URPASS eliminate fake payment screenshots from students or attendees?",
            a: "Yes, completely. URPASS does not use manual screenshot uploads. Payments are processed through automated gateway webhooks, meaning a QR pass is only issued when the funds are verified by the bank.",
          },
          {
            q: "Does URPASS charge a commission on UPI ticket sales?",
            a: "URPASS offers zero-commission ticketing plans where you pay ₹0 platform commission on ticket sales, retaining 100% of your registration revenue minus standard bank gateway processing fees.",
          },
          {
            q: "Can I collect GST from attendees and issue tax invoices?",
            a: "Yes. You can configure GST rates (e.g., 18%) to be included or added on top of your ticket price, and collect attendee company GSTIN details for automated tax invoice generation.",
          },
          {
            q: "Can attendees still pay with debit cards, credit cards, or netbanking if they do not have UPI?",
            a: "Yes. In addition to UPI, the checkout modal supports all major Indian debit cards, credit cards, RuPay, netbanking across 50+ banks, and popular mobile wallets.",
          },
          {
            q: "How do ticket revenues get transferred to my bank account?",
            a: "Your ticket revenue is settled directly into your linked Indian bank account through Razorpay's automated settlement cycle (typically T+2 business days).",
          },
        ],
        relatedLinks: [
          { title: "Events in India Hub", href: "/in", category: "Location" },
          { title: "Event Registration with UPI", href: "/event-registration-with-upi", category: "Product" },
          { title: "Razorpay Event Registration", href: "/razorpay-event-registration", category: "Product" },
          { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
          { title: "Best Event Registration Software India", href: "/best-event-registration-software-india", category: "Guide" },
          { title: "QR Event Check-In Software", href: "/qr-event-check-in", category: "Product" },
        ],
        ctaTitle: "Start collecting UPI event registrations today",
        ctaDescription:
          "Zero manual verification, zero payment fraud, and instant digital QR passes for your attendees.",
      }}
    />
  );
}
