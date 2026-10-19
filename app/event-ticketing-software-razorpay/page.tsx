import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Razorpay Event Ticketing Software | UrPass",
  description: "Accept UPI, cards and net banking for event tickets through Razorpay. Automate registration, QR pass generation and attendee check-in.",
  keywords: ["event ticketing software razorpay","razorpay event ticketing","accept upi for event tickets","event registration razorpay integration","sell event tickets upi india","razorpay qr ticket generator"],
  alternates: {
    canonical: "https://urpass.space/event-ticketing-software-razorpay",
  },
  openGraph: {
    title: "Razorpay Event Ticketing Software | UrPass",
    description: "Accept UPI, cards and net banking for event tickets through Razorpay. Automate registration, QR pass generation and attendee check-in.",
    url: "https://urpass.space/event-ticketing-software-razorpay",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Razorpay Event Ticketing Software | UrPass",
    description: "Accept UPI, cards and net banking for event tickets through Razorpay. Automate registration, QR pass generation and attendee check-in.",
  },
};

export default function EventTicketingSoftwareRazorpayPage() {
  return (
    <SEOPage
      config={{
        badge: "RAZORPAY EVENT TICKETING",
        h1: "Event Ticketing Software with Razorpay Payments",
        canonicalUrl: "https://urpass.space/event-ticketing-software-razorpay",
        description: "Accept UPI, cards and net banking for event tickets through Razorpay. Automate registration, QR pass generation and attendee check-in.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=event-ticketing-software-razorpay",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Connect Razorpay and Start Selling Event Tickets in Minutes",
        ctaDescription: "Accept UPI, cards, and net banking with instant digital pass issuance and 0% UrPass platform ticket commissions.",
        directAnswer: {
        "title": "What is Event Ticketing Software with Razorpay?",
        "summary": "Event ticketing software with Razorpay enables Indian organizers to sell event tickets online and accept payments directly through Razorpay. Attendees pay instantly via UPI (Google Pay, PhonePe, Paytm), credit/debit cards, and net banking, while the software automatically issues digital QR passes and settles revenue into the organizer's bank.",
        "keyPoints": [
                "Native Razorpay integration supporting all UPI apps, debit/credit cards, and net banking",
                "Direct settlement into your own bank account on standard Razorpay cycles",
                "0% UrPass platform ticket commission — pay only standard Razorpay processing fees",
                "Automatic digital QR pass generation and multi-channel delivery upon successful payment"
        ]
},
        whatIs: {
        "title": "How UrPass Integrates with Razorpay for Event Ticketing",
        "definition": "UrPass provides a seamless, secure bridge between your event registration forms and your verified Razorpay merchant account. When an attendee selects a paid ticket, UrPass initiates a secure Razorpay checkout modal, verifies payment webhooks, and immediately delivers a cryptographically unique digital QR pass.",
        "details": [
                "Eliminates manual verification of UPI transaction screenshots and reference numbers",
                "Instant webhook validation prevents ticket generation on failed or cancelled payments",
                "Supports dynamic pricing, early bird discounts, and coupon code redemptions",
                "Automated attendee receipt generation with customizable GST tax invoices"
        ]
},
        keyFactsTable: {
        "title": "Direct Razorpay Integration vs Manual UPI Screenshot Forms",
        "subtitle": "Why automated Razorpay checkout is essential for professional Indian events.",
        "headers": [
                "Operational Requirement",
                "Manual Screenshot Uploads",
                "UrPass Razorpay Integration"
        ],
        "rows": [
                {
                        "col1": "Payment Verification",
                        "col2": "Manual review of 500+ bank transaction screenshots",
                        "col3": "Instant cryptographic webhook validation in milliseconds"
                },
                {
                        "col1": "Fraud Risk",
                        "col2": "High risk of photoshopped or duplicate UTR numbers",
                        "col3": "Zero fraud risk; tickets issue only after bank confirmation"
                },
                {
                        "col1": "Ticket Issuance",
                        "col2": "Manual email dispatch taking days of staff time",
                        "col3": "Automatic instant QR pass delivery via WhatsApp and email"
                },
                {
                        "col1": "Cash Flow",
                        "col2": "Unorganized bank credits with difficult reconciliation",
                        "col3": "Clean Razorpay dashboard reporting with automated T+2 payouts"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CONVERSION & CHECKOUT",
                "title": "Sub-5-Second UPI Checkout Boosts Ticket Conversion",
                "paragraphs": [
                        "In India, over 80% of digital consumer payments occur via UPI. When ticketing platforms force attendees through lengthy multi-step checkout forms or poorly optimized card portals, cart abandonment skyrockets.",
                        "UrPass embedded Razorpay checkout launches the native UPI intent flow on mobile devices. Attendees tap once to open Google Pay, PhonePe, or Paytm, authenticate with their UPI PIN, and are returned to their confirmed digital ticket in under five seconds."
                ],
                "bullets": [
                        "One-tap UPI intent flow on mobile devices for frictionless checkout",
                        "Comprehensive payment methods: UPI, Rupay, Mastercard, Visa, Net Banking, and Wallets",
                        "Abandoned cart recovery telemetry to identify registration drop-offs",
                        "Mobile-optimized checkout modal that matches your event branding"
                ],
                "takeaway": "Native mobile UPI checkout dramatically reduces drop-off and increases paid registrations."
        },
        {
                "badge": "ACCOUNTING & COMPLIANCE",
                "title": "Clean Financial Reconciliation and Automated GST Invoices",
                "paragraphs": [
                        "Managing financial records for commercial events or college symposiums can quickly become an accounting nightmare when tracking hundreds of individual bank transactions.",
                        "UrPass and Razorpay automate the entire financial audit trail. Every ticket order is stamped with a unique payment ID, transaction reference, and optional GST breakdown. Organizers can export unified sales reports with a single click for straightforward tax filing and committee auditing."
                ],
                "bullets": [
                        "Itemized sales reports matching Razorpay transaction settlement IDs",
                        "Automated GST invoice generation sent to attendee email addresses",
                        "Support for promo codes, coupon discounts, and group booking tiers",
                        "Zero third-party escrow holds on your event revenue"
                ],
                "takeaway": "Integrated payment reconciliation simplifies tax compliance and financial reporting."
        }
],
        featuresTitle: "Core Capabilities Built for Event Organizers",
        featuresSubtitle: "Engineered for speed, reliability, and zero ticketing commission.",
        features: [
          {
            icon: CreditCard,
            title: "All Major Indian Payment Methods",
            desc: "Accept Google Pay, PhonePe, Paytm, Cred, cards, net banking, and wallets seamlessly.",
          },
          {
            icon: Zap,
            title: "Instant Webhook Verification",
            desc: "Tickets generate automatically the millisecond Razorpay confirms payment completion.",
          },
          {
            icon: QrCode,
            title: "Cryptographic QR Passes",
            desc: "Issue scannable, anti-counterfeit digital QR tickets immediately after payment.",
          },
          {
            icon: ShieldCheck,
            title: "0% Platform Commission",
            desc: "Keep 100% of your ticket price. Pay only standard Razorpay payment processing fees.",
          },
          {
            icon: BarChart3,
            title: "Unified Sales Accounting",
            desc: "Export complete transaction logs with attendee details, ticket tiers, and payment IDs.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Gate Validation",
            desc: "Scan attendees at venue entrances with volunteer smartphones for seamless entry.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Your Event",
                "desc": "Configure registration questions and paid ticket tiers in UrPass."
        },
        {
                "n": "02",
                "title": "Add Razorpay Key",
                "desc": "Enter your Razorpay Key ID and Secret in your UrPass dashboard settings."
        },
        {
                "n": "03",
                "title": "Publish Ticket Page",
                "desc": "Share your high-converting event page with attendees across your channels."
        },
        {
                "n": "04",
                "title": "Attendees Pay with UPI",
                "desc": "Attendees complete checkout via Google Pay, PhonePe, or cards in seconds."
        },
        {
                "n": "05",
                "title": "Instant Pass Delivery",
                "desc": "Attendees receive their digital QR ticket immediately on WhatsApp and email."
        }
],
        whoShouldUse: {
        "title": "Who Needs Razorpay Event Ticketing?",
        "subtitle": "Event teams across India requiring fast, reliable online ticket sales.",
        "personas": [
                {
                        "badge": "COLLEGES",
                        "title": "College Fests & Student Committees",
                        "desc": "Collect registration fees for technical symposiums and cultural fests directly into college accounts."
                },
                {
                        "badge": "CONFERENCES",
                        "title": "Tech Conferences & Industry Summits",
                        "desc": "Sell delegate passes with corporate GST invoices and instant payment reconciliation."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Training Workshops & Bootcamps",
                        "desc": "Sell limited-seat masterclasses with instant UPI payments and automated calendar invites."
                },
                {
                        "badge": "EXPOS",
                        "title": "Trade Shows & Consumer Expos",
                        "desc": "Pre-sell exhibition visitor tickets and clear entrance lines with high-speed phone scanning."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "From Razorpay Payment to Gate Entry in Seconds",
        "subtitle": "How the complete payment-to-pass workflow functions.",
        "description": "When an attendee completes their Razorpay payment, UrPass generates a digital QR pass with an encrypted token. The pass is instantly sent to the attendee's WhatsApp and email. On event day, volunteers scan the pass using their smartphone camera, validating the ticket in under 0.3 seconds.",
        "points": [
                "Payment is verified cryptographically before any ticket is issued.",
                "Scanners prevent duplicate entry if a pass is scanned multiple times.",
                "Door staff can look up attendees by name or phone number if their battery dies.",
                "All check-in timestamps sync live to the central organizer dashboard."
        ]
},
        faqs: [
        {
                "q": "Do I need a Razorpay account to sell paid tickets on UrPass?",
                "a": "Yes. To sell paid event tickets in India, you connect your own verified Razorpay merchant account. This ensures all ticket proceeds deposit directly into your business or institutional bank account without platform delays."
        },
        {
                "q": "Does UrPass take a cut of my Razorpay ticket sales?",
                "a": "No. UrPass charges 0% platform commission on ticket sales. You pay only standard Razorpay payment processing interchange fees (typically 2% + GST for domestic UPI and cards) and your flat UrPass monthly subscription."
        },
        {
                "q": "Can attendees pay using UPI apps like Google Pay and PhonePe?",
                "a": "Yes. Razorpay natively supports all Indian UPI applications including Google Pay, PhonePe, Paytm, Cred, and BHIM UPI with one-tap mobile checkout."
        },
        {
                "q": "What happens if a payment fails during checkout?",
                "a": "If an attendee's bank declines the transaction or the payment fails, Razorpay communicates the failure to UrPass. No ticket or QR pass is generated, protecting your event from unpaid entries."
        },
        {
                "q": "Can I issue automated GST invoices to ticket buyers?",
                "a": "Yes. You can configure your business GSTIN and tax percentage in your event settings. UrPass automatically generates itemized tax invoices attached to attendee ticket confirmation emails."
        }
],
      }}
    />
  );
}
