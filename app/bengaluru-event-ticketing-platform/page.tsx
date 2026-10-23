import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Platform Bengaluru | UrPass",
  description: "Sell tickets for Bengaluru events using UrPass. Manage paid registrations, ticket categories, digital QR passes and attendee entry.",
  keywords: ["bengaluru event ticketing platform","bangalore event ticketing software","sell tickets online bangalore","event ticketing software bengaluru","0 commission event ticketing bangalore","bengaluru qr ticketing platform"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-event-ticketing-platform",
  },
  openGraph: {
    title: "Event Ticketing Platform Bengaluru | UrPass",
    description: "Sell tickets for Bengaluru events using UrPass. Manage paid registrations, ticket categories, digital QR passes and attendee entry.",
    url: "https://urpass.space/bengaluru-event-ticketing-platform",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Ticketing Platform Bengaluru | UrPass",
    description: "Sell tickets for Bengaluru events using UrPass. Manage paid registrations, ticket categories, digital QR passes and attendee entry.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruEventTicketingPlatformPage() {
  return (
    <SEOPage
      config={{
        badge: "BENGALURU EVENT TICKETING",
        h1: "Event Ticketing Platform for Bengaluru Organizers",
        canonicalUrl: "https://urpass.space/bengaluru-event-ticketing-platform",
        description: "Sell tickets for Bengaluru events using UrPass. Manage paid registrations, ticket categories, digital QR passes and attendee entry.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-event-ticketing-platform",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Sell Tickets for Your Next Bengaluru Event",
        ctaDescription: "Keep 100% of your ticket price with 0% platform commission. Direct Razorpay UPI settlement to your bank account.",
        directAnswer: {
        "title": "What is the Best Event Ticketing Platform for Bengaluru?",
        "summary": "UrPass is a dedicated event ticketing platform for Bengaluru (Bangalore) organizers. It enables tech summits, cultural fests, and workshops to sell paid tickets with 0% platform commission, accept instant UPI payments via Razorpay, issue encrypted digital QR passes, and verify attendees at venue doors in under 0.3 seconds.",
        "keyPoints": [
                "0% platform commission on ticket sales with direct Razorpay UPI settlement to your bank",
                "Instant digital QR pass generation delivered via WhatsApp, Apple Wallet, and email",
                "Sub-0.3s camera check-in on volunteer smartphones with zero expensive equipment rentals",
                "Predictable flat subscription pricing starting from plans starting from ₹499/mo"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Event Producers Choose UrPass",
        "definition": "As India's premier technology and startup capital, Bengaluru hosts thousands of conferences, developer hackathons, and corporate summits monthly. UrPass replaces high-commission ticketing aggregators with a self-service SaaS platform tailored for Bengaluru's fast-moving event ecosystem.",
        "details": [
                "Eliminates 5% to 10% ticketing aggregator percentage deductions on delegate passes",
                "Provides native UPI checkout (Google Pay, PhonePe, Paytm, Cred) with sub-5s completion",
                "Equips gate volunteers with high-speed smartphone camera scanners that need no native app",
                "Includes automated corporate GST tax invoicing for enterprise and B2B attendees"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Commercial Ticketing Aggregators in Bengaluru",
        "subtitle": "Why Bangalore organizers keep more revenue with UrPass flat subscriptions.",
        "headers": [
                "Operational Factor",
                "Commercial Ticketing Aggregators",
                "UrPass Ticketing Platform"
        ],
        "rows": [
                {
                        "col1": "Platform Ticketing Fee",
                        "col2": "5% to 8% deducted from gross ticket sales",
                        "col3": "0% ticket commission; keep 100% of ticket price"
                },
                {
                        "col1": "Payment Settlement",
                        "col2": "Held until 7-14 days after the event completes",
                        "col3": "Direct settlement via your own Razorpay account (T+2)"
                },
                {
                        "col1": "Entrance Scan Latency",
                        "col2": "Slow manual name lookups or sluggish app scanners",
                        "col3": "Under 0.3s camera scan using standard mobile browsers"
                },
                {
                        "col1": "Pass Customization",
                        "col2": "Aggregator-branded tickets with competitor ads",
                        "col3": "100% white-label passes with your logo, colors & sponsors"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "REVENUE RETENTION",
                "title": "Keep 100% of Your Ticket Sales with Direct UPI Settlements",
                "paragraphs": [
                        "Ticketing aggregators routinely extract 5% to 8% in platform fees from Bengaluru event revenues. On a tech conference generating ₹10,00,000 in delegate passes, aggregators deduct ₹60,000 to ₹80,000 while holding funds until days after the summit concludes.",
                        "UrPass connects directly to your verified Razorpay merchant gateway. All ticket funds flow straight into your business or institutional bank account on rolling T+2 business day cycles, allowing organizers to pay venue deposits and catering vendors without cash flow strain."
                ],
                "bullets": [
                        "Accept all Indian UPI apps (Google Pay, PhonePe, Paytm, Cred, BHIM) seamlessly",
                        "Credit cards, debit cards, corporate cards, and net banking supported natively",
                        "Automated GST invoice generation with custom business tax registration details",
                        "Flat subscription starting from ₹499/month"
                ],
                "takeaway": "Direct payment gateway integration protects your margins and provides immediate cash flow."
        },
        {
                "badge": "DOOR OPERATIONS",
                "title": "Sub-Second Smartphone QR Scanning Across Bengaluru Venues",
                "paragraphs": [
                        "From convention centers in Whitefield to auditorium complexes in Koramangala and Central Bengaluru, entrance delays ruin attendee first impressions. When registration desks rely on paper rosters or desktop lookups, attendees face 30-minute lobby lines.",
                        "UrPass equips your door team with a web-based smartphone camera scanner that decodes passes in under 300 milliseconds. Volunteers scan an organizer setup QR code to activate the scanner in Safari or Chrome. Atomic database row locks ensure passes cannot be reused across multiple doors."
                ],
                "bullets": [
                        "Zero mobile app downloads required for staff or attendees",
                        "Sub-0.3 second validation clears 1,000 attendees in approximately 15 minutes",
                        "Atomic row locking prevents ticket screenshot sharing across venue gates",
                        "Real-time attendance telemetry tracks arrival rates and gate congestion live"
                ],
                "takeaway": "High-speed browser camera scanning eliminates queue congestion without expensive equipment rentals."
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
            desc: "Accept Google Pay, PhonePe, Paytm, Cred, and net banking with direct bank settlements.",
          },
          {
            icon: QrCode,
            title: "Branded Digital Passes",
            desc: "Issue scannable digital passes customized with your event branding, colors, and logos.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Check-In",
            desc: "Scan attendee passes at the door in milliseconds using volunteer smartphone browsers.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Duplicate Blocking",
            desc: "Prevent ticket screenshot sharing across multiple entrance gates with database-level row locks.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Sales Dashboard",
            desc: "Track ticket sales velocity, tier capacity, and gross revenue live from your control room.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Your Event",
                "desc": "Define ticket tiers, early bird pricing, and capacity caps in under 3 minutes."
        },
        {
                "n": "02",
                "title": "Link Razorpay Gateway",
                "desc": "Connect your Razorpay merchant account to receive ticket revenues directly."
        },
        {
                "n": "03",
                "title": "Publish Ticket Page",
                "desc": "Share your high-converting, ad-free event registration page with attendees."
        },
        {
                "n": "04",
                "title": "Collect Direct Payments",
                "desc": "Attendees pay via UPI or cards and receive instant digital QR passes."
        },
        {
                "n": "05",
                "title": "Scan at the Entrance",
                "desc": "Door staff scan passes with phone cameras for instantaneous green verification."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass in Bengaluru?",
        "subtitle": "Event producers across Bangalore's tech, startup, academic, and creative sectors.",
        "personas": [
                {
                        "badge": "TECH CONFERENCES",
                        "title": "SaaS & AI Summits",
                        "desc": "Manage high-value delegate passes, corporate GST invoices, and multi-track session scanning."
                },
                {
                        "badge": "STARTUPS",
                        "title": "Founder Meetups & Demo Days",
                        "desc": "Host curated pitch events and community gatherings in Koramangala, Indiranagar, and HSR Layout."
                },
                {
                        "badge": "COLLEGES",
                        "title": "Engineering Fests & Symposiums",
                        "desc": "Process thousands of student entries with instant UPI payments and volunteer phone scanning."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Creator & Professional Bootcamps",
                        "desc": "Sell limited-seat masterclasses directly with automated calendar invites and WhatsApp passes."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Smartphone Check-In Operates at Bengaluru Venues",
        "subtitle": "Rapid entrance verification that keeps keynote sessions starting on time.",
        "description": "When an attendee arrives at the venue entrance, they present their digital pass on their smartphone screen or WhatsApp chat. Door staff point their phone camera at the QR code. UrPass verifies the cryptographic token in under 0.3 seconds, displays the attendee's name and ticket tier, and sounds an audible green confirmation chime.",
        "points": [
                "Volunteers scan on personal smartphones with zero app downloads.",
                "Audible audio chimes confirm entry even in noisy convention foyers.",
                "Atomic database row locking prevents pass reuse across multiple entrance doors.",
                "Quick manual search allows backup check-in if an attendee phone is uncharged."
        ]
},
        faqs: [
        {
                "q": "How does UrPass compare to traditional ticketing portals in Bengaluru?",
                "a": "Unlike aggregators that take 5% to 8% of every ticket sold and hold your funds for weeks, UrPass charges 0% platform ticket commission. You connect your own Razorpay account, receive ticket revenues directly into your bank, and scan attendees using smartphone cameras."
        },
        {
                "q": "What payment options are supported for Bengaluru ticket buyers?",
                "a": "Through direct Razorpay integration, attendees can pay with all major UPI apps (Google Pay, PhonePe, Paytm, Cred, BHIM), Indian debit/credit cards, corporate net banking, and digital wallets."
        },
        {
                "q": "Can college symposium organizers in Bangalore use UrPass?",
                "a": "Yes. Hundreds of campus committees use UrPass to manage technical symposiums, hackathons, and cultural fests with multi-track event passes and student volunteer scanning."
        },
        {
                "q": "Do door volunteers need to install an app from Google Play or the App Store?",
                "a": "No. The UrPass scanner operates entirely within modern mobile web browsers such as Safari and Chrome. Volunteers simply scan an organizer setup QR code to start scanning immediately."
        },
        {
                "q": "How much does UrPass cost for Bengaluru organizers?",
                "a": "UrPass offers an introductory plan starting from ₹499/month with 0% platform ticket commission. Single event pay-as-you-go passes are also available starting from ₹299."
        }
],
      }}
    />
  );
}
