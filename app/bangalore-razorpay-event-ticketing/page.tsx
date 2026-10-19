import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Razorpay Event Ticketing Bangalore | UrPass",
  description: "Accept UPI, card and net banking payments through Razorpay for Bangalore events. Issue digital QR tickets and manage check-in.",
  keywords: ["bangalore razorpay event ticketing","razorpay event ticketing bangalore","accept upi for bangalore events","event ticketing razorpay integration karnataka","bengaluru razorpay ticket platform"],
  alternates: {
    canonical: "https://urpass.space/bangalore-razorpay-event-ticketing",
  },
  openGraph: {
    title: "Razorpay Event Ticketing Bangalore | UrPass",
    description: "Accept UPI, card and net banking payments through Razorpay for Bangalore events. Issue digital QR tickets and manage check-in.",
    url: "https://urpass.space/bangalore-razorpay-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Razorpay Event Ticketing Bangalore | UrPass",
    description: "Accept UPI, card and net banking payments through Razorpay for Bangalore events. Issue digital QR tickets and manage check-in.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreRazorpayEventTicketingPage() {
  return (
    <SEOPage
      config={{
        badge: "RAZORPAY EVENT TICKETING",
        h1: "Razorpay Event Ticketing for Bangalore Events",
        canonicalUrl: "https://urpass.space/bangalore-razorpay-event-ticketing",
        description: "Accept UPI, card and net banking payments through Razorpay for Bangalore events. Issue digital QR tickets and manage check-in.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-razorpay-event-ticketing",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Connect Razorpay and Start Selling Tickets in 5 Minutes",
        ctaDescription: "Accept Google Pay, PhonePe, Paytm, and cards with instant digital pass issuance and 0% UrPass platform ticket commissions.",
        directAnswer: {
        "title": "How Does Razorpay Event Ticketing Work for Bangalore Organizers?",
        "summary": "Razorpay event ticketing connects your event registration form directly to your verified Razorpay merchant account. Attendees pay instantly via UPI (Google Pay, PhonePe, Paytm), credit/debit cards, and net banking with immediate settlement into your bank, while UrPass automatically issues digital QR passes and verifies entry in under 0.3 seconds.",
        "keyPoints": [
                "Native Razorpay integration supporting all Indian UPI apps, cards, and net banking",
                "Direct settlement into your own bank account on standard Razorpay cycles (T+2)",
                "0% UrPass platform ticket commission — pay only standard Razorpay processing fees",
                "Automatic digital QR pass generation and multi-channel delivery upon successful payment"
        ]
},
        whatIs: {
        "title": "Why Bangalore Organizers Choose Direct Razorpay Integration",
        "definition": "As Bangalore is the headquarters and primary hub of India's fintech revolution, event organizers expect clean, instant payment rails. UrPass provides a native bridge between your event forms and your Razorpay merchant dashboard.",
        "details": [
                "Eliminates manual verification of unverified UPI transaction screenshots and UTR numbers",
                "Instant webhook validation prevents ticket generation on failed or cancelled payments",
                "Supports dynamic pricing, early bird discounts, and coupon code redemptions",
                "Automated attendee receipt generation with customizable GST tax invoices"
        ]
},
        keyFactsTable: {
        "title": "Direct Razorpay Integration vs Manual UPI Screenshot Forms",
        "subtitle": "Why automated Razorpay checkout is essential for professional Bangalore events.",
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
                "badge": "PAYMENT SPEED",
                "title": "Sub-5-Second Mobile UPI Intent Flow",
                "paragraphs": [
                        "In Bengaluru's tech-savvy community, attendees expect instant mobile checkout. Forcing buyers through lengthy multi-step forms or poorly optimized card portals leads to high cart abandonment.",
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
                "badge": "TAX & COMPLIANCE",
                "title": "Clean Financial Reconciliation and Automated GST Invoices",
                "paragraphs": [
                        "Managing financial records for commercial tech conferences or college symposiums can quickly become an accounting nightmare when tracking hundreds of individual bank transactions.",
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
        featuresTitle: "Core Ticketing & Entry Capabilities",
        featuresSubtitle: "Engineered for Bengaluru event organizers seeking speed and zero ticket commissions.",
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
        "title": "Who Needs Razorpay Event Ticketing in Bangalore?",
        "subtitle": "Event teams across Bangalore requiring fast, reliable online ticket sales.",
        "personas": [
                {
                        "badge": "TECH CONFERENCES",
                        "title": "Tech Conferences & Industry Summits",
                        "desc": "Sell delegate passes with corporate GST invoices and instant payment reconciliation."
                },
                {
                        "badge": "COLLEGES",
                        "title": "College Fests & Student Committees",
                        "desc": "Collect registration fees for technical symposiums and cultural fests directly into college accounts."
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
                "q": "Do I need a Razorpay account to sell paid tickets in Bangalore?",
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
