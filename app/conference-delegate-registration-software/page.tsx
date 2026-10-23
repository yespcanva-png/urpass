import type { Metadata } from "next";
import { BarChart3, CreditCard, Layers, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Conference Registration Software | UrPass",
  description: "Organize conference delegate registration, ticket categories, digital badges and QR-based check-in with UrPass. Simplify delegate entry.",
  keywords: ["conference delegate registration software","conference registration software","delegate check in software","b2b conference ticketing","digital conference badges","event delegate management platform"],
  alternates: {
    canonical: "https://urpass.space/conference-delegate-registration-software",
  },
  openGraph: {
    title: "Conference Registration Software | UrPass",
    description: "Organize conference delegate registration, ticket categories, digital badges and QR-based check-in with UrPass. Simplify delegate entry.",
    url: "https://urpass.space/conference-delegate-registration-software",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conference Registration Software | UrPass",
    description: "Organize conference delegate registration, ticket categories, digital badges and QR-based check-in with UrPass. Simplify delegate entry.",
  },
};

export default function ConferenceDelegateRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "CONFERENCE DELEGATE MANAGEMENT",
        h1: "Conference Delegate Registration and QR Check-In",
        canonicalUrl: "https://urpass.space/conference-delegate-registration-software",
        description: "Organize conference delegate registration, ticket categories, digital badges and QR-based check-in with UrPass. Simplify delegate entry.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=conference-delegate-registration-software",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Elevate Your Conference Delegate Experience",
        ctaDescription: "Streamline executive registrations, tiered delegate passes, tax invoices, and sub-second door check-ins with 0% platform ticket commissions.",
        directAnswer: {
        "title": "What is Conference Delegate Registration Software?",
        "summary": "Conference delegate registration software is an enterprise solution designed to manage the end-to-end lifecycle of professional conference attendees. It handles tiered delegate packages (VIP, Speaker, Academic, Virtual), collects corporate billing details, generates digital QR credentials, and verifies delegates at venue doors in under 0.3 seconds.",
        "keyPoints": [
                "Tiered delegate passes with custom corporate invoicing and automated tax receipts",
                "Visual digital conference badges compatible with Apple Wallet and mobile web",
                "Sub-0.3 second camera check-in on volunteer smartphones for instant badge verification",
                "Multi-track breakout room session attendance tracking for sponsor and accreditation reporting"
        ]
},
        whatIs: {
        "title": "How UrPass Simplifies Conference Delegate Operations",
        "definition": "UrPass eliminates legacy enterprise conference software complexity. Instead of expensive multi-thousand-dollar contracts and complex setup timelines, UrPass allows conference organizers to launch executive registration portals in minutes, collect payments via Stripe or Razorpay, and scan delegates effortlessly using mobile phones.",
        "details": [
                "Replaces overpriced enterprise conference software with flat, predictable SaaS subscriptions",
                "Generates branded digital credentials with attendee name, job title, and company affiliation",
                "Tracks session-by-session room attendance for accredited continuing education (CPE/CPD)",
                "Provides 100% attendee data ownership with zero third-party ads on checkout pages"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Legacy Enterprise Conference Platforms (Cvent / Whova)",
        "subtitle": "Why modern corporate conference producers choose UrPass for agility and value.",
        "headers": [
                "Operational Metric",
                "Legacy Enterprise Conference Software",
                "UrPass Conference Platform"
        ],
        "rows": [
                {
                        "col1": "Pricing Model",
                        "col2": "Annual lock-in contracts costing £3,000 - £15,000+ per year",
                        "col3": "Transparent monthly plans starting with plans from ₹499/mo / £15/mo"
                },
                {
                        "col1": "Platform Commission",
                        "col2": "Per-registration fees plus percentage cuts on paid passes",
                        "col3": "0% ticket commission; keep 100% of your delegate revenue"
                },
                {
                        "col1": "Delegate Mobile Experience",
                        "col2": "Requires downloading heavy 100MB+ mobile community apps",
                        "col3": "Frictionless mobile web pass + native Apple Wallet support"
                },
                {
                        "col1": "Gate Check-In Equipment",
                        "col2": "Proprietary scanning terminals requiring costly on-site rentals",
                        "col3": "Sub-0.3s browser camera scanning on staff smartphones"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "DELEGATE TIERS",
                "title": "Multi-Tier Delegate Packages with Automated Tax Invoicing",
                "paragraphs": [
                        "B2B conferences require diverse registration options: All-Access Executive Passes, Standard Delegate Passes, Speaker Invitations, Media Accreditations, and Group Corporate Bundles. Enterprise attendees also require proper corporate invoicing with business tax registration numbers (GST/VAT).",
                        "UrPass allows organizers to configure multi-tier ticket categories with automated early bird price shifts, private promo codes, and group discounts. Every completed purchase generates an itemized tax receipt and corporate invoice sent directly to the delegate's billing department."
                ],
                "bullets": [
                        "Configure VIP, Speaker, Delegate, Sponsor, and Student ticket tiers",
                        "Automated GST and VAT compliance with itemized corporate tax receipts",
                        "Private hidden ticket tiers unlocked via bespoke invitation access codes",
                        "Group corporate booking workflows with multi-pass bulk allocation"
                ],
                "takeaway": "Flexible delegate tiers and automated corporate invoicing simplify B2B sales."
        },
        {
                "badge": "SESSION TELEMETRY",
                "title": "Multi-Track Breakout Attendance for Sponsor ROI & CPD Accreditation",
                "paragraphs": [
                        "At major industry summits, key stakeholders need to know which presentations drew the highest executive interest. Furthermore, accredited conferences must verify that delegates attended specific technical sessions before issuing continuing professional development certificates.",
                        "UrPass supports multi-session scanning. Station staff outside breakout rooms with smartphone scanners to record session attendance in milliseconds. The system logs exact entry timestamps for each delegate, producing verified room-by-room attendance reports for sponsors and accrediting bodies."
                ],
                "bullets": [
                        "Scan the same delegate pass across multiple halls and workshops",
                        "Live room occupancy telemetry prevents exceeding auditorium fire capacities",
                        "Export session-level attendance logs to CSV with one click",
                        "Automated post-conference digital attendance certificates delivered to verified delegates"
                ],
                "takeaway": "Session-level QR tracking provides verified delegate engagement data for sponsors."
        }
],
        featuresTitle: "Industry-Grade Capabilities",
        featuresSubtitle: "Purpose-built for your specific event operational workflows.",
        features: [
          {
            icon: Users,
            title: "Tiered Delegate Categories",
            desc: "Create VIP, General, Speaker, and Media passes with custom access privileges.",
          },
          {
            icon: CreditCard,
            title: "0% Ticketing Commission",
            desc: "Collect high-ticket delegate payments via Stripe or Razorpay and keep 100% of revenue.",
          },
          {
            icon: QrCode,
            title: "Executive Digital Badges",
            desc: "Issue branded mobile passes featuring delegate name, job title, company, and QR code.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in delegates using volunteer smartphone browsers with zero app downloads.",
          },
          {
            icon: Layers,
            title: "Session-Wise Attendance",
            desc: "Track delegate attendance across keynote halls, breakout tracks, and VIP dinners.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Ingress Telemetry",
            desc: "Monitor arrival flow, peak door traffic, and no-show statistics on an executive dashboard.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Configure Conference Portal",
                "desc": "Set up delegate tiers, speaker profiles, early bird schedules, and corporate tax details."
        },
        {
                "n": "02",
                "title": "Connect Payment Gateway",
                "desc": "Link Stripe or Razorpay to receive 100% of delegate pass sales directly into your bank."
        },
        {
                "n": "03",
                "title": "Publish Registration Form",
                "desc": "Share your high-converting, professional registration page with prospective attendees."
        },
        {
                "n": "04",
                "title": "Issue Digital Credentials",
                "desc": "Delegates receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan Delegates at the Door",
                "desc": "Door staff scan passes in <0.3s with smartphone cameras for rapid executive entry."
        }
],
        whoShouldUse: {
        "title": "Who Relies on UrPass for Conference Registration?",
        "subtitle": "B2B conference organizers, industry associations, and corporate summit teams.",
        "personas": [
                {
                        "badge": "B2B SUMMITS",
                        "title": "Technology & Industry Summits",
                        "desc": "Manage high-value delegate tickets, executive badge generation, and multi-track session scanning."
                },
                {
                        "badge": "ACADEMIC",
                        "title": "Scientific & Medical Colloquiums",
                        "desc": "Collect delegate abstracts, verify professional credentials, and issue accredited CPD certificates."
                },
                {
                        "badge": "ASSOCIATIONS",
                        "title": "Trade & Professional Associations",
                        "desc": "Manage annual member meetings, corporate sponsorships, and delegate ball admissions."
                },
                {
                        "badge": "CORPORATE",
                        "title": "Annual Partner & Client Summits",
                        "desc": "Streamline client registrations, executive arrival tracking, and VIP lounge access control."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Delegate Check-In Functions at the Registration Desk",
        "subtitle": "Fast, dignified executive arrival that eliminates lobby congestion.",
        "description": "Delegates display their digital pass on their smartphone screen or Apple Wallet. Registration desk staff point their mobile camera at the pass. UrPass validates the delegate's credentials in under 300 milliseconds, displays their name and tier (e.g., VIP Speaker), and marks them admitted.",
        "points": [
                "Eliminates slow manual searching through printed alphabetical delegate lists.",
                "Instant visual badge confirmation on the scanner screen shows job title and organization.",
                "Scanners prevent duplicate pass entry across multiple lobby doors.",
                "Manual search by delegate name or corporate email allows instant backup check-in."
        ]
},
        faqs: [
        {
                "q": "Can delegates add their conference pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Delegates can add their pass with one tap from their confirmation email, allowing fast lockscreen retrieval upon arriving at the conference venue."
        },
        {
                "q": "Can we issue corporate invoices with company tax numbers (GST/VAT)?",
                "a": "Yes. You can configure your business tax details in UrPass. Attendees can enter their organization name and GSTIN/VAT number during checkout, and an itemized corporate tax invoice is generated automatically."
        },
        {
                "q": "How does UrPass prevent delegates from sharing tickets with colleagues?",
                "a": "Every delegate pass is protected with an encrypted cryptographic token and backed by database-level atomic locking. Once scanned at the venue entrance, the pass is locked. Any subsequent scan attempt displays an amber duplicate warning showing the original entry timestamp."
        },
        {
                "q": "Can we track which delegates attended specific breakout sessions?",
                "a": "Yes. You can station staff with smartphone scanners at breakout room doors to scan delegates into individual sessions, generating room-by-room attendance ledgers."
        },
        {
                "q": "What are the platform fees for high-value conference tickets?",
                "a": "UrPass charges 0% platform ticket commission. Whether your delegate pass is £50 or £1,500, you pay only standard merchant payment processing fees to Stripe/Razorpay and your flat UrPass monthly subscription."
        }
],
      }}
    />
  );
}
