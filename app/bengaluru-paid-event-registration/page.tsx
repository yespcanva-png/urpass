import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Paid Event Registration Bengaluru | UrPass",
  description: "Collect paid event registrations in Bengaluru with online payments, automated QR passes and attendee management in one platform.",
  keywords: ["bengaluru paid event registration","paid event registration software bangalore","collect event registration fees bangalore","paid event ticketing bengaluru","razorpay paid events bangalore","paid workshop registration bengaluru"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-paid-event-registration",
  },
  openGraph: {
    title: "Paid Event Registration Bengaluru | UrPass",
    description: "Collect paid event registrations in Bengaluru with online payments, automated QR passes and attendee management in one platform.",
    url: "https://urpass.space/bengaluru-paid-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paid Event Registration Bengaluru | UrPass",
    description: "Collect paid event registrations in Bengaluru with online payments, automated QR passes and attendee management in one platform.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruPaidEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "BENGALURU PAID REGISTRATION",
        h1: "Paid Event Registration Software in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-paid-event-registration",
        description: "Collect paid event registrations in Bengaluru with online payments, automated QR passes and attendee management in one platform.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-paid-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Collect Paid Registrations with 0% Platform Commission",
        ctaDescription: "Connect your Razorpay gateway, accept instant UPI payments, and automatically issue digital QR passes to paid attendees.",
        directAnswer: {
        "title": "What is Paid Event Registration Software for Bengaluru?",
        "summary": "Paid event registration software for Bengaluru enables organizers to sell tickets, collect delegate fees via UPI and cards through Razorpay, automatically issue cryptographically signed digital QR passes, and verify attendees at venue doors in under 0.3 seconds with 0% platform ticket commissions.",
        "keyPoints": [
                "Collect paid ticket revenue directly into your bank account via Razorpay with 0% platform fee",
                "Accept instant UPI (Google Pay, PhonePe, Paytm), debit/credit cards, and net banking",
                "Automated digital QR pass generation delivered to attendee WhatsApp and email inboxes",
                "Real-time seat capacity locking prevents overbooking paid workshop and conference sessions"
        ]
},
        whatIs: {
        "title": "How UrPass Simplifies Paid Event Operations in Bengaluru",
        "definition": "Commercial summits, masterclasses, and college fests in Bengaluru require reliable payment collection without surrendering 5% to 8% in platform fees to aggregators. UrPass combines high-converting registration forms, native Razorpay checkout, and entrance QR scanning under a flat SaaS subscription.",
        "details": [
                "Eliminates manual payment verification of unverified UPI transaction screenshots",
                "Enforces real-time seat inventory caps that automatically close sold-out paid tiers",
                "Issues automated GST tax invoices with your business tax credentials for corporate buyers",
                "Provides 100% attendee data ownership with zero third-party ads on checkout pages"
        ]
},
        keyFactsTable: {
        "title": "UrPass Paid Registration vs Generic Forms and Aggregators",
        "subtitle": "Why Bengaluru event producers choose UrPass for paid ticketing.",
        "headers": [
                "Operational Requirement",
                "Generic Forms (Google Forms / Typeform)",
                "UrPass Paid Event Platform"
        ],
        "rows": [
                {
                        "col1": "Payment Verification",
                        "col2": "Manual review of unverified UPI transaction screenshots",
                        "col3": "Instant cryptographic webhook validation via Razorpay"
                },
                {
                        "col1": "Platform Ticketing Fee",
                        "col2": "Requires paid add-ons or aggregator fees (5% to 8%)",
                        "col3": "0% ticket commission; keep 100% of ticket revenue"
                },
                {
                        "col1": "Ticket Pass Issuance",
                        "col2": "Manual email dispatch taking days of staff time",
                        "col3": "Automatic instant QR pass delivery via WhatsApp and email"
                },
                {
                        "col1": "Door Check-In Verification",
                        "col2": "Manual paper printout lookup at the door",
                        "col3": "Sub-0.3s smartphone camera scanner with duplicate blocking"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CONVERSION & CHECKOUT",
                "title": "Sub-5-Second UPI Checkout Boosts Paid Ticket Sales",
                "paragraphs": [
                        "In Bengaluru, over 85% of online consumer transactions occur via UPI applications like Google Pay, PhonePe, and Paytm. When ticketing software forces attendees through multi-step checkout flows or clunky card gateways, cart abandonment rates surge.",
                        "UrPass embedded Razorpay checkout launches the native UPI intent flow on mobile devices. Attendees tap once to open their preferred UPI app, authenticate with their PIN, and are immediately returned to their confirmed digital ticket in under five seconds."
                ],
                "bullets": [
                        "One-tap UPI intent flow on mobile devices for frictionless checkout",
                        "Support for all Indian credit/debit cards, net banking, and corporate cards",
                        "Automated GST invoice generation with custom business tax registration details",
                        "Real-time sales telemetry tracking revenue velocity and tier inventory"
                ],
                "takeaway": "Native mobile UPI checkout dramatically reduces drop-offs and increases paid registrations."
        },
        {
                "badge": "INVENTORY LOCKING",
                "title": "Real-Time Seat Inventory Caps Prevent Overbooking",
                "paragraphs": [
                        "Paid technical workshops, coding masterclasses, and executive roundtables in Bangalore have strict physical seating limits. When registration systems lack atomic inventory locking, simultaneous checkouts cause embarrassing overbooking.",
                        "UrPass enforces database-level inventory locks. When an attendee initiates payment, their seat is reserved. Once the tier capacity is reached, registration locks automatically, displaying a 'Sold Out' status to protect classroom seating."
                ],
                "bullets": [
                        "Real-time seat countdown drives registration urgency",
                        "Automated tier locking the moment maximum participant capacity is reached",
                        "Early-bird pricing tiers with scheduled automated price increases",
                        "Support for promo codes, discount coupons, and corporate group rates"
                ],
                "takeaway": "Automated inventory caps protect venue seating and eliminate overbooking."
        }
],
        featuresTitle: "Core Ticketing & Entry Capabilities",
        featuresSubtitle: "Engineered for Bengaluru event organizers seeking speed and zero ticket commissions.",
        features: [
          {
            icon: CreditCard,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your ticket price. No percentage deductions or per-ticket aggregator cuts.",
          },
          {
            icon: Zap,
            title: "Instant UPI & Razorpay",
            desc: "Accept Google Pay, PhonePe, Paytm, Cred, and cards with direct bank settlements.",
          },
          {
            icon: ShieldCheck,
            title: "Strict Capacity Limits",
            desc: "Prevent overbooking with automated inventory locking that closes sold-out tiers.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Passes",
            desc: "Automatically issue encrypted digital QR passes immediately upon payment confirmation.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and verify paid attendees at the door using volunteer smartphone cameras.",
          },
          {
            icon: BarChart3,
            title: "Unified Sales Accounting",
            desc: "Export complete transaction logs with attendee details, ticket tiers, and payment IDs.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Paid Tiers",
                "desc": "Define ticket pricing, early bird discounts, and capacity caps in UrPass."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant gateway to receive ticket revenues directly."
        },
        {
                "n": "03",
                "title": "Share Ticket Link",
                "desc": "Publish your high-converting, ad-free event registration page with attendees."
        },
        {
                "n": "04",
                "title": "Attendees Pay with UPI",
                "desc": "Attendees complete checkout via UPI or cards and receive instant digital passes."
        },
        {
                "n": "05",
                "title": "Scan at the Entrance",
                "desc": "Door staff scan passes with phone cameras for instantaneous green verification."
        }
],
        whoShouldUse: {
        "title": "Who Collects Paid Registrations with UrPass in Bengaluru?",
        "subtitle": "Commercial organizers, corporate educators, and academic committees.",
        "personas": [
                {
                        "badge": "WORKSHOPS",
                        "title": "Creator Masterclasses & Bootcamps",
                        "desc": "Sell limited seats for coding, AI, and design workshops with instant UPI checkout."
                },
                {
                        "badge": "CONFERENCES",
                        "title": "B2B Tech Conferences & Summits",
                        "desc": "Sell high-ticket delegate passes with corporate GST invoices and executive badges."
                },
                {
                        "badge": "COLLEGES",
                        "title": "Engineering Fests & Symposiums",
                        "desc": "Collect registration fees for technical events and cultural fests directly into college bank accounts."
                },
                {
                        "badge": "COMMUNITY",
                        "title": "Business Networking Meets",
                        "desc": "Collect entrance fees for breakfast meets and founder mixers with zero platform commission."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "From Payment to Gate Entry in Seconds",
        "subtitle": "Complete operational harmony between paid checkout and door verification.",
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
                "q": "Does UrPass charge a percentage commission on paid Bengaluru registrations?",
                "a": "No. UrPass charges 0% platform ticket commission. You keep 100% of your ticket price minus standard Razorpay payment processing interchange fees and your flat monthly subscription."
        },
        {
                "q": "When do ticket funds deposit into my bank account?",
                "a": "Because you connect your own verified Razorpay merchant account, ticket proceeds deposit directly into your business bank account on standard T+2 business day settlement schedules."
        },
        {
                "q": "Can attendees pay using UPI apps like Google Pay and PhonePe?",
                "a": "Yes. Razorpay natively supports all Indian UPI applications including Google Pay, PhonePe, Paytm, Cred, and BHIM UPI with one-tap mobile checkout."
        },
        {
                "q": "Can I issue automated GST invoices to ticket buyers in Bangalore?",
                "a": "Yes. You can configure your business GSTIN and tax percentage in your event settings. UrPass automatically generates itemized tax invoices attached to attendee ticket confirmation emails."
        },
        {
                "q": "What happens when all tickets are sold out?",
                "a": "Once your configured capacity limit is reached, UrPass automatically locks that tier, displays a 'Sold Out' badge on the booking form, and prevents any further ticket sales, avoiding overbooking."
        }
],
      }}
    />
  );
}
